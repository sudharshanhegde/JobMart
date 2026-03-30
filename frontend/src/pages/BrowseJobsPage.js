import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SwipeJobCards from '../components/jobs/SwipeJobCards';

const CATEGORIES = ['Cleaning', 'Delivery', 'Cooking', 'Gardening', 'Security', 'Driving', 'Construction', 'Shop Assistant', 'Babysitting', 'Other'];
const JOB_TYPES = ['part-time', 'full-time'];
const WORK_MODES = ['remote', 'offline'];

export default function BrowseJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', jobType: '', workMode: '', minSalary: '', maxSalary: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);
  const [deckKey, setDeckKey] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: 'open' });
      if (search) params.append('search', search);
      if (filters.category) params.append('category', filters.category);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.workMode) params.append('workMode', filters.workMode);
      if (filters.minSalary) params.append('minSalary', filters.minSalary);
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.jobs);
      setDeckKey((k) => k + 1);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, 400);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  useEffect(() => {
    if (!user || user.role !== 'worker') return;
    const loadApplied = async () => {
      try {
        const res = await api.get('/applications/my');
        setAppliedIds(res.data.applications.map((a) => a.job?._id || a.job).filter(Boolean));
      } catch {}
    };
    loadApplied();
  }, [user]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const clearFilters = () => setFilters({ category: '', jobType: '', workMode: '', minSalary: '', maxSalary: '' });
  const visibleJobs = jobs.filter((j) => !appliedIds.includes(j._id));

  const inputCls = "w-full border border-white/20 bg-navy-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-slate-500";

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* Search + Filter bar */}
      <div className="px-4 pt-4 pb-2 space-y-2 flex-shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-navy-700 border border-white/10 rounded-xl px-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-400">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-2 py-2.5 text-sm focus:outline-none bg-transparent text-white placeholder:text-slate-500"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-3 rounded-xl border shadow-sm transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-primary-400 text-white border-primary-400'
                : 'bg-navy-700 text-slate-400 border-white/10'
            }`}
          >
            <Filter className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-navy-700 rounded-2xl p-3 space-y-3 border border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white">Filters</p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-red-400">Clear all</button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button key={cat}
                  onClick={() => setFilters((f) => ({ ...f, category: f.category === cat ? '' : cat }))}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filters.category === cat ? 'bg-primary-400 text-white border-primary-400' : 'border-white/20 text-slate-300'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {JOB_TYPES.map((t) => (
                <button key={t}
                  onClick={() => setFilters((f) => ({ ...f, jobType: f.jobType === t ? '' : t }))}
                  className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${filters.jobType === t ? 'bg-primary-400 text-white border-primary-400' : 'border-white/20 text-slate-300'}`}>
                  {t}
                </button>
              ))}
              {WORK_MODES.map((m) => (
                <button key={m}
                  onClick={() => setFilters((f) => ({ ...f, workMode: f.workMode === m ? '' : m }))}
                  className={`text-xs px-3 py-1 rounded-full border capitalize transition-colors ${filters.workMode === m ? 'bg-primary-400 text-white border-primary-400' : 'border-white/20 text-slate-300'}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="Min ₹" value={filters.minSalary}
                onChange={(e) => setFilters((f) => ({ ...f, minSalary: e.target.value }))} className={inputCls} />
              <input type="number" placeholder="Max ₹" value={filters.maxSalary}
                onChange={(e) => setFilters((f) => ({ ...f, maxSalary: e.target.value }))} className={inputCls} />
            </div>
          </div>
        )}
      </div>

      {/* Swipe deck */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Loading jobs...</p>
            </div>
          </div>
        ) : (
          <SwipeJobCards
            key={deckKey}
            jobs={[...visibleJobs].reverse()}
            onApplied={(jobId) => setAppliedIds((prev) => [...prev, jobId])}
          />
        )}
      </div>
    </div>
  );
}
