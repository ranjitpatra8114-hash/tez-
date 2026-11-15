import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Megaphone,
  Radio,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
import { NotificationItem } from '../types';
import { SafeImage } from './SafeImage';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
  onBack: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onBack,
}) => {
  const [filter, setFilter] = useState<'all' | NotificationItem['type']>('all');

  const filtered =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-sky-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-purple-400" />;
      case 'ad':
        return <Megaphone className="w-4 h-4 text-emerald-400" />;
      case 'live':
        return <Radio className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="flex-1 min-h-screen pb-24 lg:pb-10 px-4 sm:px-6 lg:px-10 py-6 max-w-4xl mx-auto w-full space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="lg:hidden min-h-[44px] min-w-[44px] rounded-xl bg-white/[0.06] flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              Notifications
            </h1>
            <p className="text-sm text-slate-400">
              Likes, comments, followers, live alerts, and ad campaign updates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          className="min-h-[40px] px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 flex items-center gap-1.5 shrink-0"
        >
          <CheckCheck className="w-4 h-4 text-sky-400" />
          <span>Mark all read</span>
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all' as const, label: 'All Activity' },
          { id: 'like' as const, label: 'Likes' },
          { id: 'comment' as const, label: 'Comments' },
          { id: 'follow' as const, label: 'Followers' },
          { id: 'ad' as const, label: 'Ad Updates' },
          { id: 'live' as const, label: 'Live' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`min-h-[36px] px-3.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              filter === f.id
                ? 'bg-purple-500/20 border border-purple-400/50 text-white'
                : 'bg-[#0D1017] border border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0D1017] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06] overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No notifications in this category.
          </p>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectNotification(item)}
              className={`w-full px-5 py-4 flex items-center gap-4 text-left transition-colors hover:bg-white/[0.04] ${
                !item.read ? 'bg-purple-500/[0.06]' : ''
              }`}
            >
              <div className="relative shrink-0">
                <SafeImage
                  src={item.actorAvatar}
                  alt={item.actorName}
                  className="w-11 h-11 rounded-full object-cover border border-white/10"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0D1017] border border-white/10 flex items-center justify-center">
                  {getIcon(item.type)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-200 leading-snug">
                  <span className="font-semibold text-white">
                    {item.actorName}
                  </span>{' '}
                  {item.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">{item.timestamp}</p>
              </div>
              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
