import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Star, CheckCheck, Briefcase, Loader } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TYPE_META = {
  new_job:            { icon: Briefcase, color: 'bg-blue-500/20 text-blue-400' },
  job_assigned:       { icon: CheckCheck, color: 'bg-green-500/20 text-green-400' },
  job_completed:      { icon: CheckCheck, color: 'bg-white/10 text-slate-400' },
  application_update: { icon: Briefcase, color: 'bg-primary-400/20 text-primary-400' },
  new_rating:         { icon: Star, color: 'bg-yellow-500/20 text-yellow-400' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications);
        await api.put('/notifications/mark-all-read');
      } catch {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await api.put(`/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
        );
      } catch {}
    }
    if (notification.relatedJob) {
      navigate(`/jobs/${notification.relatedJob}`);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="w-6 h-6 animate-spin text-primary-400" />
    </div>
  );

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={async () => {
              await api.put('/notifications/mark-all-read');
              setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            }}
            className="text-xs text-primary-400 hover:text-primary-300 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-navy-700 rounded-2xl p-12 text-center shadow-sm">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-semibold">No notifications yet</p>
          <p className="text-slate-400 text-sm mt-1">We'll let you know when something happens</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const meta = TYPE_META[n.type] || TYPE_META.new_job;
            const Icon = meta.icon;
            return (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`w-full text-left bg-navy-700 rounded-2xl p-4 shadow-sm flex items-start gap-3 transition-all hover:shadow-md ${
                  !n.isRead ? 'border-l-4 border-primary-400' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${n.isRead ? 'text-slate-400' : 'text-white font-semibold'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0 mt-1.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
