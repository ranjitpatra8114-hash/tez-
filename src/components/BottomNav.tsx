import React from 'react';
import { Home, Search, Plus, Radio, User } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unreadNotifications?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  unreadNotifications = 0,
}) => {
  const navItems: {
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isUpload?: boolean;
    isLive?: boolean;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'upload', label: 'Upload', icon: Plus, isUpload: true },
    { id: 'live', label: 'Live', icon: Radio, isLive: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#06070B]/90 backdrop-blur-xl border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-full items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          if (item.isUpload) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate('upload')}
                aria-label="Upload Video"
                className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl"
              >
                <span className="w-11 h-8 rounded-xl bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.45)] group-active:scale-95 transition-transform">
                  <Icon className="w-5 h-5 text-white stroke-[2.4]" />
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-xl ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-[22px] h-[22px] transition-transform duration-150 ${
                    isActive
                      ? item.isLive
                        ? 'text-pink-400 scale-105'
                        : 'text-sky-400 scale-105'
                      : ''
                  }`}
                />
                {item.id === 'profile' && unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-pink-500 text-[9px] font-bold text-white flex items-center justify-center font-mono-num">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium tracking-tight whitespace-nowrap shrink-0">
                {item.label}
              </span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 w-4 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-purple-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
