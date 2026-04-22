import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusSquare, Users, Loader, Trash2, CheckCircle, ChevronDown, ChevronUp, MessageCircle, Star } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { t, tStatus, tJobType, tPeriod } from '../utils/i18n';

const STATUS_STYLE = {
  open:      'bg-green-500/20 text-green-400',
  assigned:  'bg-blue-500/20 text-blue-400',
  completed: 'bg-white/10 text-slate-400',
  closed:    'bg-red-500/20 text-red-400',
};

const APP_STATUS_STYLE = {
  pending:   'bg-yellow-500/20 text-yellow-400',
  accepted:  'bg-green-500/20 text-green-400',
  rejected:  'bg-red-500/20 text-red-400',
  withdrawn: 'bg-white/10 text-slate-400',
};

function ApplicantCard({ app, onAccept, onReject, onRate, jobStatus, jobSalary }) {
  const { lang } = useLanguage();

  const openWhatsApp = () => {
    const number = app.applicant?.whatsappNumber?.replace(/\D/g, '') || app.applicant?.phoneNumber?.replace(/\D/g, '') || '';
    if (!number) return toast.error('No contact available');
    const text = encodeURIComponent(`Hi ${app.applicant?.name}! Regarding your application on JobMart.`);
    window.open(`https://wa.me/91${number}?text=${text}`, '_blank');
  };

  const rating = app.applicantProfile?.averageRating;
  const totalRatings = app.applicantProfile?.totalRatings;

  return (
    <div className="border border-white/10 rounded-xl p-3 bg-navy-800">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary-400">{app.applicant?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{app.applicant?.name}</p>
            <p className="text-xs text-slate-400">{app.applicant?.phoneNumber}</p>
            {rating > 0 ? (
              <span className="flex items-center gap-0.5 text-xs text-primary-400 font-medium">
                <Star className="w-3 h-3 fill-primary-400 text-primary-400" /> {rating} ({totalRatings})
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">{t(lang, 'noRatings')}</span>
            )}
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${APP_STATUS_STYLE[app.status]}`}>
          {tStatus(lang, app.status)}
        </span>
      </div>

      {app.proposedSalary && (
        <div className="mt-2 flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2.5 py-1.5">
          <span className="text-xs text-orange-400 font-semibold">₹{app.proposedSalary.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500">(₹{jobSalary?.amount?.toLocaleString()})</span>
        </div>
      )}
      {app.coverNote && <p className="mt-2 text-xs text-slate-400 italic">"{app.coverNote}"</p>}

      <div className="flex gap-2 mt-2">
        <button onClick={openWhatsApp} className="flex items-center gap-1 text-xs bg-green-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-green-600">
          <MessageCircle className="w-3 h-3" /> {t(lang, 'chat')}
        </button>
        {app.status === 'pending' && (
          <>
            <button onClick={() => onAccept(app._id)} className="flex-1 text-xs bg-primary-400 text-white py-1.5 rounded-lg hover:bg-primary-500 font-medium">
              {t(lang, 'statusAccepted')}
            </button>
            <button onClick={() => onReject(app._id)} className="flex-1 text-xs border border-red-500/30 text-red-400 py-1.5 rounded-lg hover:bg-red-500/10">
              {t(lang, 'statusRejected')}
            </button>
          </>
        )}
        {app.status === 'accepted' && jobStatus === 'completed' && (
          <button onClick={() => onRate(app)} className="flex items-center gap-1 text-xs border border-primary-400/30 text-primary-400 px-2.5 py-1.5 rounded-lg hover:bg-primary-400/10">
            <Star className="w-3 h-3" /> {t(lang, 'ratings')}
          </button>
        )}
      </div>
    </div>
  );
}

function RatingModal({ app, jobId, onClose, onDone }) {
  const { lang } = useLanguage();
  const [value, setValue] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await api.post('/ratings', { jobId, rateeId: app.applicant._id, value, feedback });
      toast.success('Rating submitted!');
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
        <h3 className="font-bold text-white">{app.applicant?.name}</h3>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setValue(i)}>
              <Star className={`w-8 h-8 transition-colors ${i <= value ? 'text-primary-400 fill-primary-400' : 'text-white/10 fill-white/10'}`} />
            </button>
          ))}
        </div>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback (optional)..." rows={3}
          className="w-full border border-white/20 bg-navy-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none placeholder:text-slate-500" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 text-sm text-slate-300 hover:bg-white/5">{t(lang, 'cancel')}</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-3 rounded-xl bg-primary-400 text-white text-sm font-semibold disabled:opacity-60">
            {saving ? t(lang, 'loading') : t(lang, 'submit')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyJobsPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicantsMap, setApplicantsMap] = useState({});
  const [loadingApps, setLoadingApps] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        setJobs(res.data.jobs);
      } catch {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleApplicants = async (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    setExpandedJob(jobId);
    if (applicantsMap[jobId]) return;
    setLoadingApps(jobId);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicantsMap((m) => ({ ...m, [jobId]: res.data.applications }));
    } catch { toast.error('Failed to load applicants'); }
    finally { setLoadingApps(null); }
  };

  const handleAppStatus = async (appId, status, jobId) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      setApplicantsMap((m) => ({ ...m, [jobId]: m[jobId].map((a) => a._id === appId ? { ...a, status } : a) }));
      toast.success(`Application ${status}`);
      if (status === 'accepted') {
        setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, filledVacancies: j.filledVacancies + 1 } : j));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleComplete = async (jobId) => {
    if (!window.confirm('Mark this job as completed?')) return;
    try {
      await api.put(`/jobs/${jobId}/complete`);
      setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, status: 'completed' } : j));
      toast.success('Job marked as completed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job post?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
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
        <h1 className="text-xl font-bold text-white">{t(lang, 'myJobPosts')}</h1>
        <button onClick={() => navigate('/post-job')}
          className="flex items-center gap-1.5 bg-primary-400 text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-primary-500">
          <PlusSquare className="w-4 h-4" /> {t(lang, 'post')}
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-navy-700 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-3xl mb-3">📢</p>
          <p className="text-white font-semibold">{t(lang, 'noJobsPosted')}</p>
          <button onClick={() => navigate('/post-job')}
            className="mt-4 bg-primary-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-500">
            {t(lang, 'postFirstJob')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="bg-navy-700 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{job.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{job.category} · {tJobType(lang, job.jobType)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[job.status]}`}>
                    {tStatus(lang, job.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary-400 font-bold text-sm">
                    ₹{job.salary?.amount?.toLocaleString()}
                    <span className="text-slate-400 font-normal text-xs"> /{tPeriod(lang, job.salary?.period)}</span>
                  </span>
                  <span className="text-xs text-slate-400">{job.filledVacancies}/{job.vacancies} {t(lang, 'filled')}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => toggleApplicants(job._id)}
                    className="flex items-center gap-1.5 text-xs bg-navy-800 border border-white/10 text-slate-300 px-3 py-2 rounded-lg hover:bg-white/10 flex-1 justify-center">
                    <Users className="w-3.5 h-3.5" />
                    {t(lang, 'applicants')}
                    {expandedJob === job._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {job.status !== 'completed' && job.status !== 'closed' && (
                    <button onClick={() => handleComplete(job._id)}
                      className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-2 rounded-lg hover:bg-green-500/30">
                      <CheckCircle className="w-3.5 h-3.5" /> {t(lang, 'done')}
                    </button>
                  )}

                  {job.status === 'open' && (
                    <button onClick={() => handleDelete(job._id)}
                      className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500/30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {expandedJob === job._id && (
                <div className="border-t border-white/10 p-4 bg-navy-800/50 space-y-2">
                  {loadingApps === job._id ? (
                    <div className="flex justify-center py-3"><Loader className="w-5 h-5 animate-spin text-primary-400" /></div>
                  ) : !applicantsMap[job._id]?.length ? (
                    <p className="text-xs text-slate-400 text-center py-3">{t(lang, 'noApplicantsYet')}</p>
                  ) : (
                    applicantsMap[job._id].map((app) => (
                      <ApplicantCard key={app._id} app={app} jobStatus={job.status} jobSalary={job.salary}
                        onAccept={(appId) => handleAppStatus(appId, 'accepted', job._id)}
                        onReject={(appId) => handleAppStatus(appId, 'rejected', job._id)}
                        onRate={(a) => setRatingTarget({ app: a, jobId: job._id })} />
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {ratingTarget && (
        <RatingModal app={ratingTarget.app} jobId={ratingTarget.jobId}
          onClose={() => setRatingTarget(null)} onDone={() => setRatingTarget(null)} />
      )}
    </div>
  );
}
