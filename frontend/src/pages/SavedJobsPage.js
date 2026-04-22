import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, MapPin, Clock, Loader, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { t, tStatus, tJobType, tPeriod } from '../utils/i18n';

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users/profile');
        const savedPosts = res.data.profile.savedPosts || [];
        setJobs(savedPosts.filter(Boolean));
      } catch {
        toast.error('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.post(`/users/save-job/${jobId}`);
      setJobs((prev) => prev.filter((j) => (j._id || j) !== jobId));
      toast.success('Removed from saved jobs');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="w-6 h-6 animate-spin text-primary-400" />
    </div>
  );

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold text-white">{t(lang, 'savedJobs')}</h1>

      {jobs.length === 0 ? (
        <div className="bg-navy-700 rounded-2xl p-12 text-center shadow-sm">
          <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-semibold">{t(lang, 'noSavedJobs')}</p>
          <p className="text-slate-400 text-sm mt-1">{t(lang, 'tapBookmark')}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 bg-primary-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-500"
          >
            {t(lang, 'browseJobs')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const jobId = job._id || job;
            const title = job.title || 'Job';
            return (
              <div key={jobId} className="bg-navy-700 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/jobs/${jobId}`)}
                  >
                    <h3 className="font-semibold text-white text-sm">{title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{job.category}</p>
                  </div>
                  <button
                    onClick={() => handleUnsave(jobId)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title={t(lang, 'removeSaved')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" /> {job.location?.address || '—'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" /> {tJobType(lang, job.jobType)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary-400 font-bold text-sm">
                    ₹{job.salary?.amount?.toLocaleString()}
                    <span className="text-slate-400 font-normal text-xs"> /{tPeriod(lang, job.salary?.period)}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      job.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-slate-400'
                    }`}>{tStatus(lang, job.status)}</span>
                    <button
                      onClick={() => navigate(`/jobs/${jobId}`)}
                      className="text-xs bg-primary-400 text-white px-3 py-1.5 rounded-lg hover:bg-primary-500"
                    >
                      {t(lang, 'view')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
