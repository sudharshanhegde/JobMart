import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Loader, MessageCircle, Star, Calendar } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  pending:   'bg-yellow-500/20 text-yellow-400',
  accepted:  'bg-green-500/20 text-green-400',
  rejected:  'bg-red-500/20 text-red-400',
  withdrawn: 'bg-white/10 text-slate-400',
  filled:    'bg-orange-500/20 text-orange-400',
};

const STATUS_LABEL = {
  filled: 'Job Filled',
};

const TABS = ['all', 'pending', 'accepted', 'rejected', 'filled'];

function RateProviderModal({ app, onClose, onDone }) {
  const [value, setValue] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await api.post('/ratings', {
        jobId: app.job._id,
        rateeId: app.job.provider,
        value,
        feedback,
      });
      toast.success('Provider rated!');
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center p-4">
      <div className="bg-navy-700 rounded-2xl w-full max-w-sm p-5 space-y-4">
        <h3 className="font-bold text-white">Rate the Provider</h3>
        <p className="text-xs text-slate-400">for "{app.job?.title}"</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setValue(i)}>
              <Star className={`w-8 h-8 transition-colors ${i <= value ? 'text-primary-400 fill-primary-400' : 'text-white/10 fill-white/10'}`} />
            </button>
          ))}
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback (optional)..."
          rows={3}
          className="w-full border border-white/20 bg-navy-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none placeholder:text-slate-500"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 text-sm text-slate-300 hover:bg-white/5">Cancel</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-3 rounded-xl bg-primary-400 text-white text-sm font-semibold disabled:opacity-60">
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [ratingTarget, setRatingTarget] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/applications/my');
        setApplications(res.data.applications);
      } catch {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await api.put(`/applications/${appId}/withdraw`);
      setApplications((prev) =>
        prev.map((a) => a._id === appId ? { ...a, status: 'withdrawn' } : a)
      );
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  const openWhatsApp = async (job) => {
    try {
      const res = await api.get(`/users/contact/${job.provider?._id || job.provider}`);
      const number = res.data.user?.whatsappNumber?.replace(/\D/g, '') || res.data.user?.phoneNumber?.replace(/\D/g, '') || '';
      if (!number) return toast.error('No WhatsApp contact available');
      const text = encodeURIComponent(`Hi! I applied for "${job.title}" on JobMart.`);
      window.open(`https://wa.me/91${number}?text=${text}`, '_blank');
    } catch {
      toast.error('Connect with this provider first to get their contact');
    }
  };

  const filtered = tab === 'all' ? applications : applications.filter((a) => a.status === tab);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="w-6 h-6 animate-spin text-primary-400" />
    </div>
  );

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold text-white">My Applications</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => {
          const count = t === 'all' ? applications.length : applications.filter((a) => a.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full capitalize transition-colors ${
                tab === t ? 'bg-primary-400 text-white' : 'bg-navy-700 text-slate-400 border border-white/10'
              }`}
            >
              {t} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-navy-700 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-white font-semibold">No applications yet</p>
          <p className="text-slate-400 text-sm mt-1">Browse jobs and apply to get started</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 bg-primary-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-500"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app._id} className="bg-navy-700 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/jobs/${app.job?._id}`)}
                >
                  <h3 className="font-semibold text-white text-sm">{app.job?.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{app.job?.category}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[app.status] || STATUS_STYLE.pending}`}>
                  {STATUS_LABEL[app.status] || app.status}
                </span>
              </div>

              {app.status === 'filled' && (
                <p className="text-xs text-orange-400/80 mt-1 bg-orange-500/10 rounded-lg px-2 py-1">
                  All vacancies for this job have been filled. Keep applying — new jobs are posted daily!
                </p>
              )}

              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3" /> {app.job?.location?.address || 'N/A'}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" /> {app.job?.jobType}
                </span>
                {app.job?.startDate && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" /> {new Date(app.job.startDate).toLocaleDateString()}{app.job.endDate ? ` → ${new Date(app.job.endDate).toLocaleDateString()}` : ''}
                  </span>
                )}
              </div>

              {app.proposedSalary && (
                <div className="flex items-center gap-2 mt-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs text-orange-400 font-semibold">Your proposed: ₹{app.proposedSalary.toLocaleString()}/{app.job?.salary?.period}</span>
                  <span className="text-[10px] text-slate-500">· posted ₹{app.job?.salary?.amount?.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <span className="text-primary-400 font-bold text-sm">
                  ₹{app.job?.salary?.amount?.toLocaleString()}
                  <span className="text-slate-400 font-normal text-xs"> /{app.job?.salary?.period}</span>
                </span>
                <div className="flex gap-2">
                  {app.status === 'accepted' && (
                    <button
                      onClick={() => openWhatsApp(app.job)}
                      className="flex items-center gap-1 bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Contact
                    </button>
                  )}
                  {app.status === 'accepted' && app.job?.status === 'completed' && (
                    <button
                      onClick={() => setRatingTarget(app)}
                      className="flex items-center gap-1 border border-primary-400/30 text-primary-400 text-xs px-3 py-1.5 rounded-lg hover:bg-primary-400/10"
                    >
                      <Star className="w-3.5 h-3.5" /> Rate
                    </button>
                  )}
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {app.coverNote && (
                <p className="mt-2 text-xs text-slate-400 italic border-t border-white/10 pt-2">
                  "{app.coverNote}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {ratingTarget && (
        <RateProviderModal
          app={ratingTarget}
          onClose={() => setRatingTarget(null)}
          onDone={() => setRatingTarget(null)}
        />
      )}
    </div>
  );
}
