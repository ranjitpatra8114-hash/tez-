import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Megaphone,
  MessageCircle,
  Play,
  BarChart3,
  CheckCircle2,
  X,
  ArrowLeft,
  Eye,
  Heart,
  Users,
} from 'lucide-react';
import { Creator, ScreenId, VideoItem } from '../types';
import { SafeImage } from './SafeImage';
import { formatCompactNumber } from '../data/mockData';

interface ProfileDashboardProps {
  profile: Creator;
  isOwnProfile: boolean;
  allCreators: Creator[];
  videos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenMessenger: (creatorId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onResetToOwnProfile: () => void;
  unreadNotifications: number;
}

const WEEKLY_VIEWS = [
  { day: 'Mon', views: 142000 },
  { day: 'Tue', views: 198000 },
  { day: 'Wed', views: 175000 },
  { day: 'Thu', views: 264000 },
  { day: 'Fri', views: 318000 },
  { day: 'Sat', views: 412000 },
  { day: 'Sun', views: 389000 },
];

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  profile,
  isOwnProfile,
  allCreators,
  videos,
  onSelectVideo,
  onToggleFollow,
  onOpenMessenger,
  onNavigate,
  onResetToOwnProfile,
  unreadNotifications,
}) => {
  const [tab, setTab] = useState<'videos' | 'liked' | 'saved' | 'analytics'>('videos');
  const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null);

  const ownVideos = videos.filter((v) => v.creatorId === profile.id);
  const displayVideos =
    tab === 'videos'
      ? ownVideos.length > 0
        ? ownVideos
        : videos
      : tab === 'liked'
      ? videos.filter((v) => v.isLiked)
      : videos.filter((v) => v.isSaved);

  const totalViews = videos.reduce((s, v) => s + v.views, 0);

  return (
    <div className="flex-1 min-h-screen pb-24 lg:pb-10 px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Action Bar */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isOwnProfile && (
            <button
              type="button"
              onClick={onResetToOwnProfile}
              aria-label="Back to my profile"
              className="min-h-[40px] min-w-[40px] rounded-xl bg-white/[0.06] flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
            {isOwnProfile ? 'Creator Profile Dashboard' : `@${profile.username}`}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            aria-label="Notifications"
            className="relative min-h-[42px] min-w-[42px] rounded-xl bg-[#0D1017] border border-white/10 flex items-center justify-center text-slate-200 hover:text-white"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center font-mono-num">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('messenger')}
            aria-label="Messenger"
            className="min-h-[42px] min-w-[42px] rounded-xl bg-[#0D1017] border border-white/10 flex items-center justify-center text-slate-200 hover:text-white"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            aria-label="Privacy and Security Settings"
            className="min-h-[42px] min-w-[42px] rounded-xl bg-[#0D1017] border border-white/10 flex items-center justify-center text-slate-200 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Profile Hero Card */}
      <section className="bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <SafeImage
            src={profile.avatar}
            alt={profile.displayName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-purple-500/70 shadow-[0_0_24px_rgba(168,85,247,0.3)] shrink-0"
          />
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-xl font-bold text-white">
                {profile.displayName}
              </h2>
              {profile.verified && (
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
              )}
              <span className="text-sm text-slate-400">
                @{profile.username}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {profile.bio}
            </p>

            {/* Followers / Following / Likes */}
            <div className="flex items-center gap-5 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => setFollowModal('followers')}
                className="text-left group"
              >
                <span className="font-mono-num text-base font-bold text-white group-hover:text-sky-300">
                  {formatCompactNumber(profile.followers)}
                </span>{' '}
                <span className="text-xs text-slate-400">Followers</span>
              </button>

              <button
                type="button"
                onClick={() => setFollowModal('following')}
                className="text-left group"
              >
                <span className="font-mono-num text-base font-bold text-white group-hover:text-sky-300">
                  {formatCompactNumber(profile.following)}
                </span>{' '}
                <span className="text-xs text-slate-400">Following</span>
              </button>

              <div>
                <span className="font-mono-num text-base font-bold text-white">
                  {formatCompactNumber(profile.totalLikes)}
                </span>{' '}
                <span className="text-xs text-slate-400">Likes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isOwnProfile ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('adnow')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 text-white text-sm font-bold neon-ad-glow flex items-center gap-2 hover:brightness-110 transition-all"
              >
                <Megaphone className="w-4 h-4" />
                <span>AD NOW</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('analytics')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-sm font-medium text-white flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span>Analytics</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onToggleFollow(profile.id)}
                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  profile.isFollowing
                    ? 'bg-white/10 text-white'
                    : 'bg-gradient-to-r from-sky-500 to-purple-600 text-white'
                }`}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                type="button"
                onClick={() => onOpenMessenger(profile.id)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-sm font-medium text-white flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <span>Message</span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0D1017] border border-white/[0.08] rounded-xl w-fit overflow-x-auto max-w-full">
        {[
          { id: 'videos' as const, label: 'Videos' },
          { id: 'liked' as const, label: 'Liked' },
          { id: 'saved' as const, label: 'Saved' },
          { id: 'analytics' as const, label: 'Views & Analytics' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'analytics' ? (
        <section className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-400" />
                <span>7-Day Video Views</span>
              </p>
              <p className="font-mono-num text-2xl font-bold text-white mt-1.5">
                {formatCompactNumber(totalViews)}
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                +22.4% vs prior 7 days
              </p>
            </div>
            <div className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Avg. Engagement Rate</span>
              </p>
              <p className="font-mono-num text-2xl font-bold text-white mt-1.5">
                11.8%
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Likes + comments per view
              </p>
            </div>
            <div className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Net Follower Growth</span>
              </p>
              <p className="font-mono-num text-2xl font-bold text-white mt-1.5">
                +6,420
              </p>
              <p className="text-xs text-slate-400 mt-1">Last 7 days</p>
            </div>
          </div>

          <div className="bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-white">
              Daily Video Views Breakdown
            </h3>
            <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end pt-4 border-b border-white/[0.07]">
              {WEEKLY_VIEWS.map((item) => {
                const pct = Math.round((item.views / 412000) * 100);
                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center justify-end h-full gap-1.5"
                  >
                    <span className="text-[11px] font-mono-num text-slate-300">
                      {formatCompactNumber(item.views)}
                    </span>
                    <div
                      style={{ height: `${pct}%` }}
                      className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-purple-600 via-sky-500 to-cyan-300"
                    />
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center text-xs text-slate-400">
              {WEEKLY_VIEWS.map((item) => (
                <span key={item.day}>{item.day}</span>
              ))}
            </div>
          </div>
        </section>
      ) : displayVideos.length === 0 ? (
        <div className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-10 text-center text-sm text-slate-400">
          No reels in this collection yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayVideos.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVideo(v.id)}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#0D1017] border border-white/[0.08] hover:border-sky-400/50 text-left transition-all"
            >
              <SafeImage
                src={v.posterImage}
                alt={v.caption}
                style={{ filter: v.filterCss || 'none' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-mono-num">
                <span className="flex items-center gap-1">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {formatCompactNumber(v.views)}
                </span>
                <span>{formatCompactNumber(v.likes)} likes</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Followers / Following Modal */}
      {followModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setFollowModal(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md bg-[#0D1017] border border-white/10 rounded-3xl p-5 space-y-4">
            <header className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white capitalize">
                {followModal}
              </h3>
              <button
                type="button"
                onClick={() => setFollowModal(null)}
                aria-label="Close list"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </header>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(followModal === 'following'
                ? allCreators.filter((c) => c.isFollowing)
                : allCreators
              ).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeImage
                      src={c.avatar}
                      alt={c.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {c.displayName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        @{c.username}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFollow(c.id)}
                    className={`min-h-[34px] px-3.5 rounded-xl text-xs font-semibold ${
                      c.isFollowing
                        ? 'bg-white/10 text-white'
                        : 'bg-sky-500 text-slate-950'
                    }`}
                  >
                    {c.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
