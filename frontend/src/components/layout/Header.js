import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/i18n';

export default function Header({ onMenuClick, unreadCount = 0 }) {
  const { user } = useAuth();
  const { lang, switchLang } = useLanguage();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t(lang, 'goodMorning')
    : hour < 17
    ? t(lang, 'goodAfternoon')
    : t(lang, 'goodEvening');

  return (
    <header className="bg-navy-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20 border-b border-white/10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <p className="text-white/80 text-xs">{greeting},</p>
          <p className="text-white font-bold text-base leading-tight truncate max-w-[160px]">{user?.name}!</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {/* Language toggle */}
        <div className="flex gap-0.5 bg-white/10 rounded-full p-0.5 mr-1">
          {['en', 'kn'].map((l) => (
            <button key={l} onClick={() => switchLang(l)}
              className={`text-[11px] px-2.5 py-1 rounded-full transition-colors font-medium ${lang === l ? 'bg-primary-400 text-white' : 'text-slate-400'}`}>
              {l === 'en' ? 'EN' : 'ಕನ್ನಡ'}
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate('/jobs')}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
