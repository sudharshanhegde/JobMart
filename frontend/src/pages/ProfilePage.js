import React, { useState, useEffect } from 'react';
import { MapPin, Star, Plus, X, Loader, Check, Phone } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/i18n';

const SKILL_SUGGESTIONS = ['Cleaning', 'Cooking', 'Driving', 'Gardening', 'Security', 'Delivery', 'Carpentry', 'Plumbing', 'Painting', 'Babysitting'];

function StarRating({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.round(value) ? 'text-primary-400 fill-primary-400' : 'text-white/10 fill-white/10'}`} />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, login } = useAuth();
  const { lang } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: '', age: '', whatsappNumber: '', language: 'en',
    bio: '', qualification: '', jobCategory: '', skills: [], address: '', coords: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users/profile');
        const p = res.data.profile;
        setProfile(p);
        setForm({
          name: p.user?.name || '',
          age: p.user?.age || '',
          whatsappNumber: p.user?.whatsappNumber || '',
          language: p.user?.language || 'en',
          bio: p.bio || '',
          qualification: p.qualification || '',
          jobCategory: p.jobCategory || '',
          skills: p.skills || [],
          address: p.user?.location?.address || '',
          coords: p.user?.location?.coordinates || null,
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          coords: [pos.coords.longitude, pos.coords.latitude],
          address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        }));
        setLocating(false);
        toast.success('Location detected!');
      },
      () => { toast.error('Location access denied'); setLocating(false); }
    );
  };

  const addSkill = (skill) => {
    const s = skill.trim();
    if (!s || form.skills.includes(s)) return;
    setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name, age: Number(form.age),
        whatsappNumber: form.whatsappNumber, language: form.language,
        bio: form.bio, qualification: form.qualification,
        jobCategory: form.jobCategory, skills: form.skills,
        location: { coordinates: form.coords || [0, 0], address: form.address },
      };
      const res = await api.put('/users/profile', payload);
      setProfile(res.data.profile);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      login(localStorage.getItem('token'), { ...storedUser, name: form.name });
      setEditMode(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = profile.status === 'available' ? 'busy' : 'available';
    try {
      await api.put('/users/status', { status: newStatus });
      setProfile((p) => ({ ...p, status: newStatus }));
      toast.success(`Status set to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-6 h-6 animate-spin text-primary-400" />
      </div>
    );
  }

  const inputCls = "w-full border border-white/20 bg-navy-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-slate-500 disabled:bg-navy-900 disabled:text-slate-500";

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
      {/* Avatar + summary card */}
      <div className="bg-primary-400 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-2xl font-bold text-primary-500">
              {form.name?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg leading-tight">{form.name}</h2>
            <p className="text-primary-100 text-sm flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" /> {user?.phoneNumber}
            </p>
            <p className="text-primary-100 text-xs capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>

        {/* Status + rating row */}
        <div className="relative mt-4 flex items-center justify-between">
          <button
            onClick={toggleStatus}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              profile?.status === 'available' ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${profile?.status === 'available' ? 'bg-green-300' : 'bg-red-300'}`} />
            {profile?.status === 'available' ? t(lang, 'available') : t(lang, 'busy')}
          </button>
          <div className="flex items-center gap-1.5">
            <StarRating value={profile?.averageRating || 0} />
            <span className="text-primary-100 text-xs">
              {profile?.averageRating
                ? `${profile.averageRating} (${profile.totalRatings})`
                : t(lang, 'noRatings')}
            </span>
          </div>
        </div>
      </div>

      {/* Edit toggle */}
      <div className="flex justify-end">
        {editMode ? (
          <div className="flex gap-2">
            <button onClick={() => setEditMode(false)}
              className="text-sm px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5">
              {t(lang, 'cancel')}
            </button>
            <button onClick={handleSave} disabled={saving}
              className="text-sm px-4 py-2 rounded-xl bg-primary-400 text-white font-semibold flex items-center gap-1.5 hover:bg-primary-500 disabled:opacity-60">
              {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {t(lang, 'save')}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)}
            className="text-sm px-4 py-2 rounded-xl bg-primary-400 text-white font-semibold hover:bg-primary-500">
            {t(lang, 'editProfile')}
          </button>
        )}
      </div>

      {/* Personal details */}
      <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold text-white">{t(lang, 'personalDetails')}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">{t(lang, 'fullName')}</label>
            <input disabled={!editMode} value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">{t(lang, 'age')}</label>
            <input disabled={!editMode} type="number" value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">{t(lang, 'whatsapp')}</label>
            <input disabled={!editMode} value={form.whatsappNumber}
              onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">{t(lang, 'language')}</label>
            <select disabled={!editMode} value={form.language}
              onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} className={inputCls}>
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">{t(lang, 'bio')}</label>
          <textarea disabled={!editMode} value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            rows={2} placeholder={t(lang, 'bioPlaceholder')} className={`${inputCls} resize-none`} />
        </div>
      </div>

      {/* Professional details */}
      <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold text-white">{t(lang, 'professionalDetails')}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">{t(lang, 'qualification')}</label>
            <input disabled={!editMode} value={form.qualification}
              onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
              placeholder={t(lang, 'qualificationPlaceholder')} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">{t(lang, 'jobCategory')}</label>
            <input disabled={!editMode} value={form.jobCategory}
              onChange={(e) => setForm((f) => ({ ...f, jobCategory: e.target.value }))}
              placeholder={t(lang, 'jobCategoryPlaceholder')} className={inputCls} />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="text-xs text-slate-400 block mb-2">{t(lang, 'skills')}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map((skill) => (
              <span key={skill} className="flex items-center gap-1 bg-primary-400/20 text-primary-300 text-xs px-3 py-1 rounded-full">
                {skill}
                {editMode && (
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {editMode && (
            <>
              <div className="flex gap-2">
                <input type="text" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                  placeholder={t(lang, 'skillsPlaceholder')} className={inputCls} />
                <button type="button" onClick={() => addSkill(skillInput)}
                  className="p-2.5 bg-primary-400 text-white rounded-xl hover:bg-primary-500">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).slice(0, 6).map((s) => (
                  <button key={s} onClick={() => addSkill(s)}
                    className="text-xs px-2.5 py-1 border border-dashed border-white/20 text-slate-400 rounded-full hover:border-primary-400/50 hover:text-primary-400 transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="bg-navy-700 rounded-2xl p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-400" /> {t(lang, 'locationLabel')}
        </p>
        <div className="flex gap-2">
          <input disabled={!editMode} value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder={t(lang, 'locationPlaceholder')} className={`flex-1 ${inputCls}`} />
          {editMode && (
            <button type="button" onClick={detectLocation} disabled={locating}
              className="p-2.5 border border-white/20 rounded-xl text-primary-400 hover:bg-primary-400/10 transition-colors disabled:opacity-60">
              {locating ? <Loader className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
