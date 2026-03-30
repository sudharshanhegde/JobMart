import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, BookmarkCheck, Star, ChevronRight, MapPin, Clock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Gradient configs per color key
const GRAD = {
  purple: { bg: 'rgba(168,85,247,0.15)', from: '#a855f7', glow: 'rgba(168,85,247,0.25)' },
  green:  { bg: 'rgba(34,197,94,0.15)',  from: '#22c55e', glow: 'rgba(34,197,94,0.25)' },
  yellow: { bg: 'rgba(234,179,8,0.15)',  from: '#eab308', glow: 'rgba(234,179,8,0.25)' },
  blue:   { bg: 'rgba(59,130,246,0.15)', from: '#3b82f6', glow: 'rgba(59,130,246,0.25)' },
};

function StatCard({ icon: Icon, value, label, colorKey, onClick }) {
  const g = GRAD[colorKey] || GRAD.blue;
  return (
    <button onClick={onClick}
      className="rounded-2xl p-4 flex items-center gap-3 w-full text-left transition-transform hover:scale-[1.02] active:scale-95"
      style={{ background: `linear-gradient(135deg, ${g.bg} 0%, rgba(30,41,59,0.6) 100%)`, border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${g.from}33, ${g.from}18)`, boxShadow: `0 4px 12px ${g.glow}` }}>
        <Icon className="w-5 h-5" style={{ color: g.from }} />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </button>
  );
}

function JobCard({ job }) {
  const navigate = useNavigate();
  return (
    <button
      className="w-full text-left rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] active:scale-[0.99]"
      style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={() => navigate(`/jobs/${job._id}`)}>
      {/* Colored top accent line */}
      <div className="h-0.5 w-full"
        style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm leading-tight">{job.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{job.provider?.name}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
            job.workMode === 'remote' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
          }`}>
            {job.workMode}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          {job.location?.address && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" /> {job.location.address}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" /> {job.jobType}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Zap className="w-3 h-3" /> {job.vacancies - job.filledVacancies} left
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: '#818cf8' }}>
            ₹{job.salary?.amount?.toLocaleString()}
            <span className="text-slate-500 font-normal text-xs"> /{job.salary?.period}</span>
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-400/10 text-primary-400 border border-primary-400/20">
            {job.category}
          </span>
        </div>
      </div>
    </button>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #818cf8, #a855f7)' }} />
        <h2 className="font-bold text-white text-sm">{title}</h2>
      </div>
      {action && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-xs text-primary-400 hover:text-primary-300 transition-colors">
          {action} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ---------- Worker Dashboard ----------
function WorkerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ applied: 0, saved: 0, rating: 0 });
  const [acceptedApps, setAcceptedApps] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, appsRes, profileRes] = await Promise.all([
          api.get('/jobs?status=open'),
          api.get('/applications/my'),
          api.get('/users/profile'),
        ]);
        setJobs(jobsRes.data.jobs.slice(0, 6));
        const allApps = appsRes.data.applications || [];
        setAcceptedApps(allApps.filter((a) => a.status === 'accepted' && a.job?.status !== 'completed'));
        setStats({
          applied: appsRes.data.count,
          saved: profileRes.data.profile.savedPosts?.length || 0,
          rating: profileRes.data.profile.averageRating || 0,
        });
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Briefcase} value={stats.applied} label="Applied" colorKey="purple" onClick={() => navigate('/my-applications')} />
        <StatCard icon={BookmarkCheck} value={stats.saved} label="Saved" colorKey="green" onClick={() => navigate('/saved-jobs')} />
        <StatCard icon={Star} value={stats.rating || '—'} label="My Rating" colorKey="yellow" onClick={() => navigate('/profile')} />
        <StatCard icon={Search} value="Find" label="Browse Jobs" colorKey="blue" onClick={() => navigate('/jobs')} />
      </div>

      {/* Active jobs */}
      {acceptedApps.length > 0 && (
        <div>
          <SectionHeader title="My Active Jobs" />
          <div className="space-y-2">
            {acceptedApps.map((app) => (
              <button key={app._id} onClick={() => navigate(`/jobs/${app.job?._id}`)}
                className="w-full text-left rounded-2xl p-4 transition-transform hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Active</span>
                </div>
                <p className="font-semibold text-white text-sm">{app.job?.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{app.job?.provider?.name}</p>
                <p className="font-bold text-sm mt-1.5" style={{ color: '#818cf8' }}>
                  ₹{app.job?.salary?.amount?.toLocaleString()}
                  <span className="text-slate-500 font-normal text-xs"> /{app.job?.salary?.period}</span>
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile nudge */}
      <div className="rounded-2xl p-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(129,140,248,0.2)' }}>
        <div>
          <p className="text-sm font-semibold text-primary-300">Complete your profile</p>
          <p className="text-xs text-slate-500 mt-0.5">Add skills & location to get noticed</p>
        </div>
        <button onClick={() => navigate('/profile')}
          className="text-xs font-bold px-3 py-2 rounded-xl text-white flex-shrink-0 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          Update
        </button>
      </div>

      {/* Recent jobs */}
      <div>
        <SectionHeader title="Latest Jobs" action="View all" onAction={() => navigate('/jobs')} />
        {jobs.length === 0 ? (
          <div className="rounded-2xl p-8 text-center text-slate-500 text-sm"
            style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            No jobs posted yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Provider Dashboard ----------
function ProviderDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, completed: 0 });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        const jobs = res.data.jobs;
        setStats({
          total: jobs.length,
          open: jobs.filter((j) => j.status === 'open').length,
          completed: jobs.filter((j) => j.status === 'completed').length,
        });
        setRecentJobs(jobs.slice(0, 4));
      } catch {}
    };
    load();
  }, []);

  const statusStyle = {
    open:      { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
    completed: { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.15)' },
    assigned:  { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  };

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Briefcase} value={stats.total} label="Total Posts" colorKey="blue" onClick={() => navigate('/my-jobs')} />
        <StatCard icon={Search} value={stats.open} label="Open Jobs" colorKey="green" onClick={() => navigate('/my-jobs')} />
        <StatCard icon={Star} value={stats.completed} label="Completed" colorKey="purple" onClick={() => navigate('/my-jobs')} />
        <StatCard icon={BookmarkCheck} value="Post" label="New Job" colorKey="yellow" onClick={() => navigate('/post-job')} />
      </div>

      {/* Quick post nudge */}
      <div className="rounded-2xl p-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(129,140,248,0.2)' }}>
        <div>
          <p className="text-sm font-semibold text-primary-300">Need workers fast?</p>
          <p className="text-xs text-slate-500 mt-0.5">Post a job and get applicants quickly</p>
        </div>
        <button onClick={() => navigate('/post-job')}
          className="text-xs font-bold px-3 py-2 rounded-xl text-white flex-shrink-0 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          Post Job
        </button>
      </div>

      {/* Recent posts */}
      <div>
        <SectionHeader title="My Recent Posts" action="View all" onAction={() => navigate('/my-jobs')} />
        {recentJobs.length === 0 ? (
          <div className="rounded-2xl p-8 text-center text-slate-500 text-sm"
            style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            No jobs posted yet.{' '}
            <button onClick={() => navigate('/post-job')} className="text-primary-400 font-medium">
              Post your first job →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => {
              const s = statusStyle[job.status] || statusStyle.open;
              return (
                <button key={job._id} onClick={() => navigate('/my-jobs')}
                  className="w-full text-left rounded-2xl p-4 flex items-center justify-between transition-transform hover:scale-[1.01]"
                  style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div>
                    <p className="text-sm font-semibold text-white">{job.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{job.category} · {job.jobType}</p>
                  </div>
                  <div className="text-right ml-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {job.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{job.filledVacancies}/{job.vacancies} filled</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === 'provider' ? <ProviderDashboard /> : <WorkerDashboard />;
}
