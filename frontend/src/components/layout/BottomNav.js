import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Briefcase, Bell, User, PlusSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const workerNav = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/jobs', icon: Search, label: 'Jobs' },
  { to: '/my-applications', icon: Briefcase, label: 'Applied' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const providerNav = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/my-jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/post-job', icon: PlusSquare, label: 'Post' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav({ unreadCount = 0 }) {
  const { user } = useAuth();
  const navItems = user?.role === 'provider' ? providerNav : workerNav;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 flex"
      style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center pt-2 pb-3 text-[10px] font-medium transition-colors relative ${
              isActive ? 'text-primary-400' : 'text-slate-600 hover:text-slate-400'
            }`
          }>
          {({ isActive }) => (
            <>
              {/* Active pill glow */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              )}
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-400/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={isActive ? 'font-semibold' : ''}>{label}</span>
              {label === 'Alerts' && unreadCount > 0 && (
                <span className="absolute top-1.5 right-[calc(50%-12px)] w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
