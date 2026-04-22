import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Search, Briefcase, BookmarkCheck, Bell, User,
  PlusSquare, Users, LogOut, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/i18n';
import toast from 'react-hot-toast';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const workerLinks = [
    { to: '/dashboard', icon: Home, label: t(lang, 'navHome') },
    { to: '/jobs', icon: Search, label: t(lang, 'navBrowseJobs') },
    { to: '/my-applications', icon: Briefcase, label: t(lang, 'navMyApplications') },
    { to: '/saved-jobs', icon: BookmarkCheck, label: t(lang, 'navSavedJobs') },
    { to: '/connections', icon: Users, label: t(lang, 'navConnections') },
    { to: '/notifications', icon: Bell, label: t(lang, 'navNotifications') },
    { to: '/profile', icon: User, label: t(lang, 'navMyProfile') },
  ];

  const providerLinks = [
    { to: '/dashboard', icon: Home, label: t(lang, 'navHome') },
    { to: '/my-jobs', icon: Briefcase, label: t(lang, 'navMyJobPosts') },
    { to: '/post-job', icon: PlusSquare, label: t(lang, 'navPostJob') },
    { to: '/connections', icon: Users, label: t(lang, 'navConnections') },
    { to: '/notifications', icon: Bell, label: t(lang, 'navNotifications') },
    { to: '/profile', icon: User, label: t(lang, 'navMyProfile') },
  ];
  const links = user?.role === 'provider' ? providerLinks : workerLinks;

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
        style={{ background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Header with gradient */}
        <div className="relative px-5 py-6 flex items-center justify-between overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%)' }}>
          {/* Decorative circle */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />

          <div className="flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-white/25 border border-white/30 flex items-center justify-center font-bold text-white text-base shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight truncate max-w-[120px]">{user?.name}</p>
              <p className="text-white/60 text-xs capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white transition-colors relative">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-3 my-0.5 px-3 py-2.5 text-sm rounded-xl transition-all ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.1))',
                border: '1px solid rgba(129,140,248,0.2)',
              } : {}}>
              {({ isActive }) => (
                <>
                  <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} style={{ width: '18px', height: '18px' }} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-red-400 text-sm w-full px-3 py-2.5 rounded-xl hover:bg-red-400/5 transition-all">
            <LogOut className="w-4 h-4" />
            {t(lang, 'logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
