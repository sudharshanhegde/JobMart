import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, HardHat, MapPin, Zap, Shield, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/i18n';

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang, switchLang } = useLanguage();

  const goRegister = (role) => {
    localStorage.setItem('jobmart_seen_landing', '1');
    navigate('/login', { state: { tab: 'register', role } });
  };

  const goLogin = () => {
    localStorage.setItem('jobmart_seen_landing', '1');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -right-16 w-56 h-56 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />
        <div className="absolute bottom-32 left-10 w-40 h-40 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/40"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary-300 to-purple-400 bg-clip-text text-transparent">
            {t(lang, 'appName')}
          </span>
        </div>
        <div className="flex gap-0.5 bg-white/10 border border-white/10 rounded-full p-0.5">
          {['en', 'kn'].map((l) => (
            <button key={l} onClick={() => switchLang(l)}
              className={`text-xs px-3 py-1 rounded-full transition-all font-medium ${lang === l ? 'bg-primary-400 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
              {l === 'en' ? 'EN' : 'ಕನ್ನಡ'}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative px-6 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-1.5 bg-primary-400/10 border border-primary-400/25 rounded-full px-3 py-1 mb-5">
          <Sparkles className="w-3 h-3 text-primary-400" />
          <span className="text-xs text-primary-300 font-medium">Hyperlocal Job Marketplace</span>
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-primary-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t(lang, 'landingHero')}
          </span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-xs mx-auto">
          {t(lang, 'landingSubhero')}
        </p>
      </div>

      {/* Cards */}
      <div className="relative px-4 space-y-3 flex-1">

        {/* Worker card — indigo gradient border */}
        <div className="rounded-2xl p-px"
          style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.5) 0%, rgba(129,140,248,0.08) 60%, transparent 100%)' }}>
          <div className="bg-navy-800 rounded-[15px] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30"
                style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">{t(lang, 'worker')}</p>
                <p className="text-xs text-primary-400">{t(lang, 'landingWorkerSub')}</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300 mb-5">
              {[
                { icon: MapPin, text: t(lang, 'landingW1') },
                { icon: Zap, text: t(lang, 'landingW2') },
                { icon: Shield, text: t(lang, 'landingW3') },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary-400/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3 text-primary-400" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => goRegister('worker')}
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}>
              {t(lang, 'landingWorkerCTA')}
            </button>
          </div>
        </div>

        {/* Provider card — blue gradient border */}
        <div className="rounded-2xl p-px"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.08) 60%, transparent 100%)' }}>
          <div className="bg-navy-800 rounded-[15px] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">{t(lang, 'provider')}</p>
                <p className="text-xs text-blue-400">{t(lang, 'landingProviderSub')}</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300 mb-5">
              {[
                { icon: Zap, text: t(lang, 'landingP1') },
                { icon: Users, text: t(lang, 'landingP2') },
                { icon: Shield, text: t(lang, 'landingP3') },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-400/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3 text-blue-400" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => goRegister('provider')}
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              {t(lang, 'landingProviderCTA')}
            </button>
          </div>
        </div>
      </div>

      {/* Sign in */}
      <div className="relative py-8 text-center">
        <p className="text-slate-400 text-sm">
          {t(lang, 'landingAlready')}{' '}
          <button onClick={goLogin} className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
            {t(lang, 'landingSignIn')} →
          </button>
        </p>
      </div>
    </div>
  );
}
