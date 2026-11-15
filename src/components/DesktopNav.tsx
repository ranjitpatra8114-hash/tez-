import React from 'react';
import {
  Home,
  Search,
  PlusSquare,
  Radio,
  User,
  MessageCircle,
  Bell,
  Megaphone,
  Settings,
  Play,
} from 'lucide-react';
import { ScreenId } from '../types';

interface DesktopNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unreadMessages: number;
  unreadNotifications: number;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  activeScreen,
  onNavigate,
  unreadMessages,
  unreadNotifications,
}) => {
  const mainLinks: {
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    accent?: string;
  }[] = [
    { id: 'home', label: 'For You Feed', icon: Home },
    { id: 'search', label: 'Search & Explore', icon: Search },
    { id: 'upload', label: 'Upload Video', icon: PlusSquare },
    { id: 'live', label: 'Live Stream', icon: Radio, accent: 'text-pink-400' },
    { id: 'messenger', label: 'Messenger', icon: MessageCircle, badge: unreadMessages },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'profile', label: 'Creator Profile', icon: User },
  ];

  return (
    <aside
      aria-label="Desktop navigation"
      className="hidden lg:flex flex-col justify-between w-64 shrink-0 h-screen sticky top-0 bg-[#090B11] border-r border-white/[0.07] px-4 py-6"
    >
      <div className="space-y-6">
        {/* Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 px-3 py-1.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-xl"
        >
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Lumen
          </span>
        </button>

        {/* Primary Links */}
        <nav className="space-y-1">
          {mainLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive
                        ? item.accent || 'text-sky-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-purple-600 text-[11px] font-semibold text-white flex items-center justify-center font-mono-num">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Premium AD NOW Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('adnow')}
            className={`w-full min-h-[48px] flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold tracking-wide text-white bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 neon-ad-glow hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              activeScreen === 'adnow' ? 'ring-2 ring-white/50' : ''
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>AD NOW</span>
          </button>
        </div>
      </div>

      {/* Bottom Settings Trigger */}
      <div className="pt-4 border-t border-white/[0.07]">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            activeScreen === 'settings'
              ? 'bg-white/[0.08] text-white'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap">Privacy & Settings</span>
        </button>
      </div>
    </aside>
  );
};
