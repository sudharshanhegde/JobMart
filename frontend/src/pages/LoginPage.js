import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Briefcase, HardHat, Eye, EyeOff, Loader, X, KeyRound } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/i18n';

const TABS = { LOGIN: 'login', REGISTER: 'register' };

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function LangToggle() {
  const { lang, switchLang } = useLanguage();
  return (
    <div className="flex bg-white/20 border border-white/20 rounded-full p-0.5">
      {['en', 'kn'].map((l) => (
        <button key={l} onClick={() => switchLang(l)}
          className={`text-xs px-3 py-1 rounded-full transition-all font-medium ${lang === l ? 'bg-white text-primary-600 shadow-sm' : 'text-white/80 hover:text-white'}`}>
          {l === 'en' ? 'EN' : 'ಕನ್ನಡ'}
        </button>
      ))}
    </div>
  );
}

function ForgotPasswordModal({ onClose }) {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ phoneNumber: '', recoveryKeyword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidPhone = (p) => /^\d{10}$/.test(p.replace(/\s/g, ''));

  const handle = async (e) => {
    e.preventDefault();
    const { phoneNumber, recoveryKeyword, newPassword, confirmPassword } = form;
    if (!phoneNumber || !recoveryKeyword || !newPassword || !confirmPassword)
      return toast.error(t(lang, 'fillAll'));
    if (!isValidPhone(phoneNumber)) return toast.error(t(lang, 'validPhone'));
    if (newPassword !== confirmPassword) return toast.error(t(lang, 'passwordMismatch'));
    if (newPassword.length < 6) return toast.error(t(lang, 'passwordShort'));
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { phoneNumber, recoveryKeyword, newPassword });
      toast.success(t(lang, 'forgotSuccess'));
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-white/15 bg-navy-900/60 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/60 placeholder:text-slate-600 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-4 sm:pb-0">
      <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-400/20 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-primary-400" />
            </div>
            <h2 className="text-white font-bold">{t(lang, 'forgotTitle')}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handle} className="space-y-3">
          {[
            { key: 'forgotPhone', field: 'phoneNumber', type: 'tel', placeholder: '9876543210', maxLen: 10 },
            { key: 'forgotKeyword', field: 'recoveryKeyword', type: 'text', placeholder: '••••••' },
          ].map(({ key, field, type, placeholder, maxLen }) => (
            <div key={field}>
              <label className="text-xs font-medium text-slate-400 block mb-1">{t(lang, key)}</label>
              <input type={type} placeholder={placeholder} maxLength={maxLen}
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className={inputCls} />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">{t(lang, 'forgotNew')}</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder={t(lang, 'minPassword')}
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                className={`${inputCls} pr-11`} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">{t(lang, 'forgotConfirm')}</label>
            <input type="password" placeholder={t(lang, 'repeatPassword')}
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              className={inputCls} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 mt-1 shadow-lg shadow-primary-500/25"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}>
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
            {t(lang, 'forgotSubmit')}
          </button>
          <button type="button" onClick={onClose}
            className="w-full text-slate-500 text-xs py-2 hover:text-slate-300 transition-colors">
            {t(lang, 'forgotBack')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const location = useLocation();
  const stateTab = location.state?.tab;
  const stateRole = location.state?.role;

  const [tab, setTab] = useState(stateTab === 'register' ? TABS.REGISTER : TABS.LOGIN);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(stateRole || 'worker');
  const [showForgot, setShowForgot] = useState(false);

  const [loginForm, setLoginForm] = useState({ phoneNumber: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', phoneNumber: '', password: '', confirmPassword: '', recoveryKeyword: '' });

  const { login } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const isValidPhone = (p) => /^\d{10}$/.test(p.replace(/\s/g, ''));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token, user);
        localStorage.setItem('jobmart_seen_landing', '1');
        toast.success(`Welcome, ${user.name}!`);
        navigate('/dashboard');
      } catch {}
    }
  }, [location, login, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.phoneNumber || !loginForm.password) return toast.error(t(lang, 'fillAll'));
    if (!isValidPhone(loginForm.phoneNumber)) return toast.error(t(lang, 'validPhone'));
    setLoading(true);
    try {
      const res = await api.post('/auth/login', loginForm);
      login(res.data.token, res.data.user);
      localStorage.setItem('jobmart_seen_landing', '1');
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, phoneNumber, password, confirmPassword, recoveryKeyword } = regForm;
    if (!name || !phoneNumber || !password || !recoveryKeyword) return toast.error(t(lang, 'fillAll'));
    if (!isValidPhone(phoneNumber)) return toast.error(t(lang, 'validPhone'));
    if (password !== confirmPassword) return toast.error(t(lang, 'passwordMismatch'));
    if (password.length < 6) return toast.error(t(lang, 'passwordShort'));
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, phoneNumber, password, role, recoveryKeyword });
      login(res.data.token, res.data.user);
      localStorage.setItem('jobmart_seen_landing', '1');
      toast.success('Account created! Welcome to JobMart');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const base = process.env.REACT_APP_API_URL || '';
    window.location.href = `${base}/api/auth/google`;
  };

  const inputCls = "w-full border border-white/15 bg-navy-900/60 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/60 placeholder:text-slate-600 transition-all";

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      {/* Gradient header */}
      <div className="relative pt-12 pb-20 flex flex-col items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="absolute top-8 right-12 w-20 h-20 rounded-full opacity-10 border border-white/30" />

        {/* Language toggle */}
        <div className="absolute top-4 right-4">
          <LangToggle />
        </div>

        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-2xl mb-3 backdrop-blur-sm">
          <Briefcase className="text-white w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t(lang, 'appName')}</h1>
        <p className="text-white/70 text-sm mt-1">{t(lang, 'tagline')}</p>

        {/* Wave curve */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-navy-900" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
      </div>

      <div className="w-full max-w-sm mx-auto px-4 -mt-6 z-10 pb-8">
        {/* Card */}
        <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Tab switcher */}
          <div className="flex bg-navy-900/50">
            {[TABS.LOGIN, TABS.REGISTER].map((t_) => (
              <button key={t_} onClick={() => setTab(t_)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all relative ${tab === t_ ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                {t_ === 'login' ? t(lang, 'signInTab') : t(lang, 'registerTab')}
                {tab === t_ && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                )}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">
            {/* Google OAuth */}
            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 border border-white/15 bg-white/5 rounded-xl py-3 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors">
              <GoogleIcon />
              {t(lang, 'continueGoogle')}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-600">{t(lang, 'orDivider')}</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Login form */}
            {tab === TABS.LOGIN && (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">{t(lang, 'phoneNumber')}</label>
                  <input type="tel" placeholder={t(lang, 'phonePlaceholder')}
                    value={loginForm.phoneNumber}
                    onChange={(e) => setLoginForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                    maxLength={10} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">{t(lang, 'password')}</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} placeholder="••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                      className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary-500/30"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}>
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                  {t(lang, 'signInBtn')}
                </button>
                <button type="button" onClick={() => setShowForgot(true)}
                  className="w-full text-center text-xs text-slate-500 hover:text-primary-400 transition-colors py-1">
                  {t(lang, 'forgotPassword')}
                </button>
              </form>
            )}

            {/* Register form */}
            {tab === TABS.REGISTER && (
              <form onSubmit={handleRegister} className="space-y-3">
                <p className="text-xs font-medium text-slate-400">{t(lang, 'iAm')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'worker', icon: HardHat, label: t(lang, 'worker'), sub: t(lang, 'workerSub') },
                    { value: 'provider', icon: Briefcase, label: t(lang, 'provider'), sub: t(lang, 'providerSub') },
                  ].map(({ value, icon: Icon, label, sub }) => (
                    <button key={value} type="button" onClick={() => setRole(value)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${role === value ? 'border-primary-500 bg-primary-500/15' : 'border-white/10 bg-navy-900/40 hover:border-white/20'}`}>
                      <Icon className={`w-6 h-6 mb-1 ${role === value ? 'text-primary-400' : 'text-slate-500'}`} />
                      <span className={`text-xs font-bold ${role === value ? 'text-primary-300' : 'text-slate-300'}`}>{label}</span>
                      <span className="text-[10px] text-slate-500 text-center mt-0.5">{sub}</span>
                    </button>
                  ))}
                </div>
                {[
                  { label: t(lang, 'yourName'), field: 'name', type: 'text', placeholder: 'Your full name' },
                  { label: t(lang, 'phoneNumber'), field: 'phoneNumber', type: 'tel', placeholder: t(lang, 'phonePlaceholder'), maxLen: 10 },
                ].map(({ label, field, type, placeholder, maxLen }) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} maxLength={maxLen}
                      value={regForm[field]}
                      onChange={(e) => setRegForm((f) => ({ ...f, [field]: e.target.value }))}
                      className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">{t(lang, 'password')}</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} placeholder={t(lang, 'minPassword')}
                      value={regForm.password}
                      onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                      className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">{t(lang, 'confirmPassword')}</label>
                  <input type="password" placeholder={t(lang, 'repeatPassword')}
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">{t(lang, 'securityWord')}</label>
                  <input type="text" placeholder="e.g. Hometown, pet name..."
                    value={regForm.recoveryKeyword}
                    onChange={(e) => setRegForm((f) => ({ ...f, recoveryKeyword: e.target.value }))}
                    className={inputCls} />
                  <p className="text-[10px] text-slate-600 mt-1">{t(lang, 'securityWordHint')}</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary-500/30"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}>
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                  {t(lang, 'createAccount')}
                </button>
              </form>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-slate-600 mt-4">JobMart — Connecting local workers & providers</p>
      </div>
    </div>
  );
}
