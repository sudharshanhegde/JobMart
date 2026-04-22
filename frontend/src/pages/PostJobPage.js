import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Loader } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { t, tJobType, tWorkMode, tPeriod } from '../utils/i18n';

const CATEGORIES = ['Cleaning', 'Delivery', 'Cooking', 'Gardening', 'Security', 'Driving', 'Construction', 'Shop Assistant', 'Babysitting', 'Other'];
const CATEGORY_KEYS = { Cleaning: 'catCleaning', Delivery: 'catDelivery', Cooking: 'catCooking', Gardening: 'catGardening', Security: 'catSecurity', Driving: 'catDriving', Construction: 'catConstruction', 'Shop Assistant': 'catShopAssistant', Babysitting: 'catBabysitting', Other: 'catOther' };

const emptyForm = {
  title: '', category: '', vacancies: 1,
  salaryAmount: '', salaryPeriod: 'daily',
  jobType: 'part-time', workMode: 'offline',
  address: '', whatsappContact: '',
  description: '', useAI: true,
  startDate: '', endDate: '',
};

export default function PostJobPage() {
  const { lang } = useLanguage();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.longitude, pos.coords.latitude]);
        setForm((f) => ({ ...f, address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
        setLocating(false);
        toast.success('Location detected!');
      },
      () => { toast.error('Could not get location'); setLocating(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.salaryAmount) {
      return toast.error(t(lang, 'fillAll'));
    }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        vacancies: Number(form.vacancies),
        salary: { amount: Number(form.salaryAmount), period: form.salaryPeriod },
        jobType: form.jobType,
        workMode: form.workMode,
        location: { coordinates: coords || [0, 0], address: form.address },
        whatsappContact: form.whatsappContact,
        ...(form.startDate && { startDate: form.startDate }),
        ...(form.endDate && { endDate: form.endDate }),
        ...(form.useAI ? {} : { description: form.description }),
      };
      const endpoint = form.useAI ? '/jobs/ai-generate' : '/jobs';
      await api.post(endpoint, payload);
      toast.success('Job posted successfully!');
      navigate('/my-jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-white/20 bg-navy-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-slate-500";
  const toggleBtnCls = (active) => `flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
    active ? 'bg-primary-400 text-white border-primary-400' : 'border-white/20 text-slate-300 hover:border-primary-400/50'
  }`;

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">{t(lang, 'postAJob')}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{t(lang, 'fillDetails')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-white">{t(lang, 'basicInfo')}</p>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'jobTitle')} *</label>
            <input type="text" placeholder={t(lang, 'jobTitlePlaceholder')}
              value={form.title} onChange={set('title')} className={inputCls} required />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'category')} *</label>
            <select value={form.category} onChange={set('category')} className={inputCls} required>
              <option value="">{t(lang, 'selectCategory')}</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{t(lang, CATEGORY_KEYS[c])}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'vacancies')} *</label>
              <input type="number" min={1} value={form.vacancies} onChange={set('vacancies')} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'whatsappNo')}</label>
              <input type="tel" placeholder="9876543210" value={form.whatsappContact} onChange={set('whatsappContact')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Salary & Type */}
        <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-white">{t(lang, 'salaryWorkType')}</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'amount')} *</label>
              <input type="number" placeholder="500" value={form.salaryAmount} onChange={set('salaryAmount')} className={inputCls} required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'per')}</label>
              <select value={form.salaryPeriod} onChange={set('salaryPeriod')} className={inputCls}>
                <option value="hourly">{tPeriod(lang, 'hourly')}</option>
                <option value="daily">{tPeriod(lang, 'daily')}</option>
                <option value="monthly">{tPeriod(lang, 'monthly')}</option>
                <option value="fixed">{tPeriod(lang, 'fixed')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">{t(lang, 'jobType')}</label>
            <div className="flex gap-2">
              {['part-time', 'full-time'].map((type) => (
                <button key={type} type="button" onClick={() => setForm((f) => ({ ...f, jobType: type }))}
                  className={toggleBtnCls(form.jobType === type)}>
                  {tJobType(lang, type)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">{t(lang, 'workMode')}</label>
            <div className="flex gap-2">
              {['offline', 'remote'].map((mode) => (
                <button key={mode} type="button" onClick={() => setForm((f) => ({ ...f, workMode: mode }))}
                  className={toggleBtnCls(form.workMode === mode)}>
                  {tWorkMode(lang, mode)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-sm font-semibold text-white">{t(lang, 'locationLabel')}</p>
          <div className="flex gap-2">
            <input type="text" placeholder={t(lang, 'locationAreaPlaceholder')}
              value={form.address} onChange={set('address')} className={`flex-1 ${inputCls}`} />
            <button type="button" onClick={detectLocation} disabled={locating}
              className="p-3 border border-white/20 rounded-xl text-primary-400 hover:bg-primary-400/10 transition-colors disabled:opacity-60">
              {locating ? <Loader className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-sm font-semibold text-white">{t(lang, 'workDuration')}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'startDate')}</label>
              <input type="date" value={form.startDate} onChange={set('startDate')} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">{t(lang, 'endDate')}</label>
              <input type="date" value={form.endDate} onChange={set('endDate')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* AI description toggle */}
        <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-semibold text-white">{t(lang, 'aiDescription')}</p>
            </div>
            <button type="button" onClick={() => setForm((f) => ({ ...f, useAI: !f.useAI }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.useAI ? 'bg-primary-400' : 'bg-white/20'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.useAI ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {form.useAI ? (
            <p className="text-xs text-slate-400">{t(lang, 'aiDescriptionHint')}</p>
          ) : (
            <textarea placeholder={t(lang, 'writeDescription')} value={form.description}
              onChange={set('description')} rows={4} className={`${inputCls} resize-none`} />
          )}
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-primary-400 hover:bg-primary-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-md">
          {submitting ? (
            <><Loader className="w-4 h-4 animate-spin" /> {t(lang, 'posting')}</>
          ) : (
            <>{form.useAI && <Sparkles className="w-4 h-4" />} {t(lang, 'postJob')}</>
          )}
        </button>
      </form>
    </div>
  );
}
