import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Wifi, Users, Star, Bookmark, BookmarkCheck, ArrowLeft, Loader, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const APP_STATUS_STYLE = {
  pending:   'bg-yellow-500/20 text-yellow-400',
  accepted:  'bg-green-500/20 text-green-400',
  rejected:  'bg-red-500/20 text-red-400',
  withdrawn: 'bg-white/10 text-slate-400',
};

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [proposedSalary, setProposedSalary] = useState('');
  const [showNegotiate, setShowNegotiate] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobRes, profileRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          api.get('/users/profile'),
        ]);
        setJob(jobRes.data.job);
        const savedIds = profileRes.data.profile.savedPosts?.map((p) => p._id || p) || [];
        setIsSaved(savedIds.includes(id));

        if (user?.role === 'worker') {
          const appsRes = await api.get('/applications/my');
          setAlreadyApplied(appsRes.data.applications.some((a) => (a.job?._id || a.job) === id));
        }
      } catch {
        toast.error('Failed to load job');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, navigate]);

  const handleSave = async () => {
    try {
      await api.post(`/users/save-job/${id}`);
      setIsSaved((v) => !v);
      toast.success(isSaved ? 'Removed from saved' : 'Job saved!');
    } catch { toast.error('Failed'); }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/applications/${id}`, { coverNote, ...(proposedSalary && { proposedSalary }) });
      setAlreadyApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const toggleApplicants = async () => {
    if (showApplicants) { setShowApplicants(false); return; }
    setShowApplicants(true);
    if (applicants.length > 0) return;
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/job/${id}`);
      setApplicants(res.data.applications);
    } catch { toast.error('Failed to load applicants'); }
    finally { setLoadingApplicants(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="w-6 h-6 animate-spin text-primary-400" />
    </div>
  );

  if (!job) return null;

  const spotsLeft = job.vacancies - job.filledVacancies;
  const isOwner = job.provider?._id === user?._id;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-primary-500 px-4 pt-4 pb-10 relative">
        <button onClick={() => navigate(-1)} className="text-white mb-4 flex items-center gap-1 text-sm hover:text-primary-200">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{job.category}</span>
            <h1 className="text-xl font-bold text-white mt-2 leading-tight">{job.title}</h1>
            <p className="text-white/70 text-sm mt-1">{job.provider?.name}</p>
          </div>
          <button onClick={handleSave} className="text-white p-1">
            {isSaved ? <BookmarkCheck className="w-6 h-6 fill-white" /> : <Bookmark className="w-6 h-6" />}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-navy-900" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
      </div>

      <div className="px-4 -mt-2 pb-24 space-y-4">
        {/* Quick info chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Clock, label: job.jobType },
            { icon: Wifi, label: job.workMode },
            { icon: Users, label: `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` },
            { icon: MapPin, label: job.location?.address || 'Location TBD' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 bg-navy-700 text-slate-300 text-xs px-3 py-1.5 rounded-full shadow-sm capitalize">
              <Icon className="w-3 h-3 text-primary-400" /> {label}
            </span>
          ))}
          {job.startDate && (
            <span className="flex items-center gap-1.5 bg-navy-700 text-slate-300 text-xs px-3 py-1.5 rounded-full shadow-sm">
              📅 {new Date(job.startDate).toLocaleDateString()} {job.endDate ? `→ ${new Date(job.endDate).toLocaleDateString()}` : ''}
            </span>
          )}
          {job.aiGenerated && (
            <span className="flex items-center gap-1 bg-purple-500/20 text-purple-400 text-xs px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3" /> AI Description
            </span>
          )}
        </div>

        {/* Salary card */}
        <div className="bg-navy-700 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Salary</p>
            <p className="text-2xl font-bold text-white">₹{job.salary?.amount?.toLocaleString()}</p>
            <p className="text-xs text-slate-400">per {job.salary?.period}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Status</p>
            <span className={`text-sm font-semibold capitalize ${
              job.status === 'open' ? 'text-green-400' :
              job.status === 'completed' ? 'text-slate-400' : 'text-primary-400'
            }`}>{job.status}</span>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div className="bg-navy-700 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-white mb-2">About this job</p>
            <p className="text-sm text-slate-400 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>
        )}

        {/* Provider info */}
        <div className="bg-navy-700 rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-white mb-3">Posted by</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-400/20 flex items-center justify-center">
                <span className="font-bold text-primary-400">{job.provider?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{job.provider?.name}</p>
                <p className="text-xs text-slate-400">{job.provider?.location?.address || 'Location not set'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Connect with this provider to get contact details</p>
          </div>
        </div>

        {/* Apply section — workers only, non-owners */}
        {user?.role === 'worker' && !isOwner && job.status === 'open' && (
          <div className="bg-navy-700 rounded-2xl p-4 shadow-sm">
            {alreadyApplied ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <Star className="w-4 h-4 fill-green-400 text-green-400" />
                You have already applied for this job
              </div>
            ) : showApplyForm ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Write a short note (optional)</p>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Tell the provider why you're a good fit..."
                  rows={3}
                  className="w-full border border-white/20 bg-navy-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none placeholder:text-slate-500"
                />

                {/* Salary negotiation */}
                <button
                  type="button"
                  onClick={() => setShowNegotiate((v) => !v)}
                  className="flex items-center gap-2 text-xs text-primary-400 font-medium"
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold transition-colors ${showNegotiate ? 'bg-primary-400 border-primary-400 text-white' : 'border-primary-400/50'}`}>
                    {showNegotiate ? '✓' : '+'}
                  </span>
                  Negotiate salary (posted: ₹{job.salary?.amount?.toLocaleString()}/{job.salary?.period})
                </button>

                {showNegotiate && (
                  <div className="bg-navy-800 border border-primary-400/20 rounded-xl p-3 space-y-2">
                    <p className="text-xs text-slate-400">Your expected salary ({job.salary?.period})</p>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">₹</span>
                      <input
                        type="number"
                        value={proposedSalary}
                        onChange={(e) => setProposedSalary(e.target.value)}
                        placeholder={job.salary?.amount}
                        min={0}
                        className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-slate-600"
                      />
                      <span className="text-xs text-slate-500">/{job.salary?.period}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">The provider will see your proposed rate</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => { setShowApplyForm(false); setShowNegotiate(false); setProposedSalary(''); }} className="flex-1 py-3 rounded-xl border border-white/20 text-slate-300 text-sm font-medium hover:bg-white/5">
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1 py-3 rounded-xl bg-primary-400 text-white text-sm font-semibold hover:bg-primary-500 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {applying ? <Loader className="w-4 h-4 animate-spin" /> : null}
                    Submit Application
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full py-3.5 bg-primary-400 text-white font-semibold rounded-xl hover:bg-primary-500 transition-colors"
              >
                Apply for this Job
              </button>
            )}
          </div>
        )}

        {/* Owner panel */}
        {isOwner && (
          <div className="bg-navy-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">Your Job Post</p>
                <p className="text-xs text-slate-400 mt-0.5">{job.filledVacancies}/{job.vacancies} positions filled</p>
              </div>
              <button
                onClick={toggleApplicants}
                className="flex items-center gap-1.5 text-xs bg-navy-800 border border-white/10 text-slate-300 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <Users className="w-3.5 h-3.5" />
                Applicants
                {showApplicants ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            {showApplicants && (
              <div className="border-t border-white/10 p-4 bg-navy-800/50 space-y-2">
                {loadingApplicants ? (
                  <div className="flex justify-center py-3">
                    <Loader className="w-5 h-5 animate-spin text-primary-400" />
                  </div>
                ) : applicants.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-3">No applicants yet</p>
                ) : (
                  applicants.map((app) => (
                    <div key={app._id} className="flex items-center justify-between gap-2 border border-white/10 rounded-xl p-3 bg-navy-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-400">{app.applicant?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{app.applicant?.name}</p>
                          {app.applicantProfile?.averageRating > 0 ? (
                            <span className="flex items-center gap-0.5 text-xs text-primary-400">
                              <Star className="w-3 h-3 fill-primary-400" /> {app.applicantProfile.averageRating} ({app.applicantProfile.totalRatings})
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">No ratings yet</span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${APP_STATUS_STYLE[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
