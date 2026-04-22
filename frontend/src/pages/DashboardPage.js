import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, BookmarkCheck, Star, ChevronRight, MapPin, Clock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t, tStatus, tJobType, tWorkMode, tPeriod } from '../utils/i18n';
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
  const { lang } = useLanguage();
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
            {tWorkMode(lang, job.workMode)}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          {job.location?.address && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" /> {job.location.address}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" /> {tJobType(lang, job.jobType)}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Zap className="w-3 h-3" /> {job.vacancies - job.filledVacancies} {t(lang, 'left')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: '#818cf8' }}>
            ₹{job.salary?.amount?.toLocaleString()}
            <span className="text-slate-500 font-normal text-xs"> /{tPeriod(lang, job.salary?.period)}</span>
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
  const { lang } = useLanguage();
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
        <StatCard icon={Briefcase} value={stats.applied} label={t(lang, 'applied')} colorKey="purple" onClick={() => navigate('/my-applications')} />
        <StatCard icon={BookmarkCheck} value={stats.saved} label={t(lang, 'saved')} colorKey="green" onClick={() => navigate('/saved-jobs')} />
        <StatCard icon={Star} value={stats.rating || '—'} label={t(lang, 'myRating')} colorKey="yellow" onClick={() => navigate('/profile')} />
        <StatCard icon={Search} value={t(lang, 'search')} label={t(lang, 'browseJobs')} colorKey="blue" onClick={() => navigate('/jobs')} />
      </div>

      {/* Active jobs */}
      {acceptedApps.length > 0 && (
        <div>
          <SectionHeader title={t(lang, 'myActiveJobs')} />
          <div className="space-y-2">
            {acceptedApps.map((app) => (
              <button key={app._id} onClick={() => navigate(`/jobs/${app.job?._id}`)}
                className="w-full text-left rounded-2xl p-4 transition-transform hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">{t(lang, 'active')}</span>
                </div>
                <p className="font-semibold text-white text-sm">{app.job?.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{app.job?.provider?.name}</p>
                <p className="font-bold text-sm mt-1.5" style={{ color: '#818cf8' }}>
                  ₹{app.job?.salary?.amount?.toLocaleString()}
                  <span className="text-slate-500 font-normal text-xs"> /{tPeriod(lang, app.job?.salary?.period)}</span>
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
          <p className="text-sm font-semibold text-primary-300">{t(lang, 'completeProfile')}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t(lang, 'addSkillsLocation')}</p>
        </div>
        <button onClick={() => navigate('/profile')}
          className="text-xs font-bold px-3 py-2 rounded-xl text-white flex-shrink-0 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          {t(lang, 'update')}
        </button>
      </div>

      {/* Recent jobs */}
      <div>
        <SectionHeader title={t(lang, 'latestJobs')} action={t(lang, 'viewAll')} onAction={() => navigate('/jobs')} />
        {jobs.length === 0 ? (
          <div className="rounded-2xl p-8 text-center text-slate-500 text-sm"
            style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {t(lang, 'noJobsYet')}
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
  const { lang } = useLanguage();
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
        <StatCard icon={Briefcase} value={stats.total} label={t(lang, 'totalPosts')} colorKey="blue" onClick={() => navigate('/my-jobs')} />
        <StatCard icon={Search} value={stats.open} label={t(lang, 'openJobs')} colorKey="green" onClick={() => navigate('/my-jobs')} />
        <StatCard icon={Star} value={stats.completed} label={t(lang, 'statusCompleted')} colorKey="purple" onClick={() => navigate('/my-jobs')} />
        <StatCard icon={BookmarkCheck} value={t(lang, 'post')} label={t(lang, 'newJob')} colorKey="yellow" onClick={() => navigate('/post-job')} />
      </div>

      {/* Quick post nudge */}
      <div className="rounded-2xl p-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(129,140,248,0.2)' }}>
        <div>
          <p className="text-sm font-semibold text-primary-300">{t(lang, 'needWorkersFast')}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t(lang, 'postJobQuick')}</p>
        </div>
        <button onClick={() => navigate('/post-job')}
          className="text-xs font-bold px-3 py-2 rounded-xl text-white flex-shrink-0 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          {t(lang, 'postJob')}
        </button>
      </div>

      {/* Recent posts */}
      <div>
        <SectionHeader title={t(lang, 'myRecentPosts')} action={t(lang, 'viewAll')} onAction={() => navigate('/my-jobs')} />
        {recentJobs.length === 0 ? (
          <div className="rounded-2xl p-8 text-center text-slate-500 text-sm"
            style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {t(lang, 'noJobsPosted')}{' '}
            <button onClick={() => navigate('/post-job')} className="text-primary-400 font-medium">
              {t(lang, 'postFirstJob')}
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
                    <p className="text-xs text-slate-500 mt-0.5">{job.category} · {tJobType(lang, job.jobType)}</p>
                  </div>
                  <div className="text-right ml-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {tStatus(lang, job.status)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{job.filledVacancies}/{job.vacancies} {t(lang, 'filled')}</p>
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
