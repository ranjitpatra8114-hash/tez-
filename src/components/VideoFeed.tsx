import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Send,
  Radio,
  Film,
  Settings,
  Flag,
  Share2,
  Megaphone,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music2,
  ChevronUp,
  ChevronDown,
  Bell,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { Creator, ScreenId, VideoItem } from '../types';
import { SafeImage } from './SafeImage';
import { formatCompactNumber } from '../data/mockData';
import { reelAudio } from '../utils/audioSynth';

interface VideoFeedProps {
  videos: VideoItem[];
  creators: Creator[];
  activeIndex: number;
  onChangeIndex: (nextIndex: number) => void;
  onToggleLike: (videoId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenComments: (video: VideoItem) => void;
  onOpenShare: (video: VideoItem) => void;
  onOpenReport: (video: VideoItem) => void;
  onOpenMessengerWithCreator: (creatorId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onPromoteVideo: (videoId: string) => void;
  onSearchHashtag: (tag: string) => void;
  onSelectCreatorProfile: (creatorId: string) => void;
  unreadNotifications: number;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  creators,
  activeIndex,
  onChangeIndex,
  onToggleLike,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
  onOpenReport,
  onOpenMessengerWithCreator,
  onNavigate,
  onPromoteVideo,
  onSearchHashtag,
  onSelectCreatorProfile,
  unreadNotifications,
}) => {
  const [feedMode, setFeedMode] = useState<'foryou' | 'following'>('foryou');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [heartBurst, setHeartBurst] = useState<{ id: number; x: number; y: number } | null>(null);

  const touchStartY = useRef<number | null>(null);
  const wheelLockRef = useRef<number>(0);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const lastTapRef = useRef<number>(0);

  const visibleVideos =
    feedMode === 'following'
      ? videos.filter((v) => {
          const c = creators.find((cr) => cr.id === v.creatorId);
          return c?.isFollowing;
        })
      : videos;

  const safeIndex =
    visibleVideos.length > 0 ? Math.min(activeIndex, visibleVideos.length - 1) : 0;
  const currentVideo = visibleVideos[safeIndex] ?? null;
  const currentCreator = currentVideo
    ? creators.find((c) => c.id === currentVideo.creatorId)
    : undefined;

  // Simulated smooth playback timer for image-backed reels
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
  }, [currentVideo?.id]);

  useEffect(() => {
    if (!currentVideo || !isPlaying) return;
    if (currentVideo.videoUrl && videoElRef.current) {
      videoElRef.current.play().catch(() => {});
      return;
    }
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const step = 100 / (currentVideo.durationSec * 10);
        return prev + step >= 100 ? 0 : prev + step;
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [currentVideo, isPlaying]);

  // Sync audio synth
  useEffect(() => {
    if (!isPlaying || isMuted || !currentVideo) {
      reelAudio.setMuted(true);
    } else {
      reelAudio.setMuted(false, safeIndex);
    }
    return () => {
      reelAudio.stopLoop();
    };
  }, [isMuted, isPlaying, safeIndex, currentVideo]);

  const goNext = useCallback(() => {
    if (visibleVideos.length <= 1) return;
    setDirection(1);
    onChangeIndex((safeIndex + 1) % visibleVideos.length);
  }, [visibleVideos.length, onChangeIndex, safeIndex]);

  const goPrev = useCallback(() => {
    if (visibleVideos.length <= 1) return;
    setDirection(-1);
    onChangeIndex((safeIndex - 1 + visibleVideos.length) % visibleVideos.length);
  }, [visibleVideos.length, onChangeIndex, safeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelLockRef.current < 420) return;
    if (Math.abs(e.deltaY) > 35) {
      wheelLockRef.current = now;
      if (e.deltaY > 0) goNext();
      else goPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (Math.abs(delta) > 48) {
      if (delta > 0) goNext();
      else goPrev();
    }
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentVideo) return;
    const now = Date.now();
    if (now - lastTapRef.current < 270) {
      // Double tap to like
      const rect = e.currentTarget.getBoundingClientRect();
      setHeartBurst({
        id: now,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      if (!currentVideo.isLiked) {
        onToggleLike(currentVideo.id);
      }
      window.setTimeout(() => setHeartBurst(null), 700);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      window.setTimeout(() => {
        if (lastTapRef.current === now) {
          setIsPlaying((p) => {
            const next = !p;
            if (videoElRef.current) {
              if (next) videoElRef.current.play().catch(() => {});
              else videoElRef.current.pause();
            }
            return next;
          });
        }
      }, 275);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((m) => !m);
  };

  return (
    <div className="relative flex-1 flex items-center justify-center h-[calc(100dvh-4rem)] lg:h-screen overflow-hidden bg-[#06070B] lg:px-8 lg:py-5 gap-8">
      {/* Main 9:16 Vertical Video Player Stage */}
      <div
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-full lg:h-[min(90vh,860px)] lg:w-auto lg:aspect-[9/16] lg:rounded-3xl overflow-hidden bg-[#0A0C12] lg:border lg:border-white/10 lg:shadow-[0_0_60px_rgba(56,189,248,0.12),0_20px_60px_rgba(0,0,0,0.85)] select-none"
      >
        {/* Top Overlay Bar inside Player */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-3 pb-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none">
          <div className="flex items-center gap-1 pointer-events-auto bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setFeedMode('following');
                onChangeIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                feedMode === 'following'
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Following
            </button>
            <button
              type="button"
              onClick={() => {
                setFeedMode('foryou');
                onChangeIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                feedMode === 'foryou'
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              For You
            </button>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => onPromoteVideo(currentVideo?.id || '')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 text-white text-xs font-bold tracking-wide neon-ad-glow flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>AD NOW</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              aria-label="Notifications"
              className="lg:hidden relative min-h-[40px] min-w-[40px] rounded-xl bg-black/45 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/65 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-pink-500 text-[10px] font-bold flex items-center justify-center font-mono-num">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Video Content / Empty Following Fallback */}
        {!currentVideo ? (
          <div className="h-full w-full flex flex-col items-center justify-center px-8 text-center gap-4">
            <p className="font-display text-lg font-semibold text-white">
              No followed creators yet
            </p>
            <p className="text-sm text-slate-400">
              Follow creators in For You to build your personal stream.
            </p>
            <button
              type="button"
              onClick={() => setFeedMode('foryou')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-sm font-semibold text-white"
            >
              Browse For You
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentVideo.id}
              custom={direction}
              initial={{ y: direction * 90, opacity: 0.35 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction * -90, opacity: 0.35 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleStageClick}
              className="relative w-full h-full cursor-pointer"
            >
              {currentVideo.videoUrl ? (
                <video
                  ref={videoElRef}
                  src={currentVideo.videoUrl}
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  onTimeUpdate={(e) => {
                    const el = e.currentTarget;
                    if (el.duration) {
                      setProgress((el.currentTime / el.duration) * 100);
                    }
                  }}
                  style={{ filter: currentVideo.filterCss || 'none' }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <SafeImage
                  src={currentVideo.posterImage}
                  alt={currentVideo.caption}
                  fallbackLabel={currentVideo.musicName}
                  style={{ filter: currentVideo.filterCss || 'none' }}
                  className={`w-full h-full object-cover animate-reel-motion ${
                    !isPlaying ? 'animate-reel-paused' : ''
                  }`}
                />
              )}

              {/* Play / Pause Indicator Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-black/55 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Double-tap Neon Heart Burst */}
              <AnimatePresence>
                {heartBurst && (
                  <motion.div
                    key={heartBurst.id}
                    initial={{ scale: 0.4, opacity: 0.95 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ left: heartBurst.x - 36, top: heartBurst.y - 36 }}
                    className="absolute pointer-events-none z-30"
                  >
                    <Heart className="w-18 h-18 fill-pink-500 text-pink-400 drop-shadow-[0_0_24px_rgba(236,72,153,0.9)]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Contrast Scrim for 4.5:1 Text Legibility */}
              <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

              {/* Bottom-Left Creator & Caption Info */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-5 left-4 right-20 z-20 space-y-2.5"
              >
                {/* Creator Row + Follow */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onSelectCreatorProfile(currentVideo.creatorId)}
                    className="flex items-center gap-2.5 group focus-visible:outline-none"
                  >
                    <SafeImage
                      src={currentVideo.avatar}
                      alt={currentVideo.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-400/70 group-hover:border-sky-400 transition-colors"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className="font-display text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                          @{currentVideo.username}
                        </span>
                        {currentCreator?.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono-num">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{formatCompactNumber(currentVideo.views)} views</span>
                        {currentVideo.isPromoted && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-sky-300 font-sans font-medium">
                              Sponsored
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>

                  {currentCreator && (
                    <button
                      type="button"
                      onClick={() => onToggleFollow(currentCreator.id)}
                      className={`min-h-[34px] px-3.5 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                        currentCreator.isFollowing
                          ? 'bg-white/15 text-white border border-white/20 hover:bg-white/20'
                          : 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-[0_0_16px_rgba(56,189,248,0.35)] hover:brightness-110'
                      }`}
                    >
                      {currentCreator.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>

                {/* Caption & Clickable Hashtags */}
                <p className="text-sm text-slate-100 leading-snug line-clamp-2">
                  {currentVideo.caption}{' '}
                  <span className="inline-flex flex-wrap gap-x-1.5">
                    {currentVideo.hashtags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onSearchHashtag(tag)}
                        className="text-sky-300 hover:text-sky-200 font-medium hover:underline"
                      >
                        {tag}
                      </button>
                    ))}
                  </span>
                </p>

                {/* Music Bar + Audio Toggle */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={`w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-sky-500 flex items-center justify-center shrink-0 ${
                        isPlaying ? 'animate-spin' : ''
                      }`}
                      style={{ animationDuration: '5s' }}
                    >
                      <Music2 className="w-3 h-3 text-white" />
                    </span>
                    <span className="text-xs text-slate-200 font-medium truncate">
                      {currentVideo.musicName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                    className="min-h-[34px] min-w-[34px] px-2.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition-colors shrink-0"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    )}
                    <span className="hidden sm:inline">
                      {isMuted ? 'Muted' : 'Sound'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right-Side Vertical Glowing Action Menu (All 8 Requested Actions) */}
              <div
                onClick={(e) => e.stopPropagation()}
                aria-label="Video actions"
                className="absolute right-2.5 bottom-4 z-20 flex flex-col items-center gap-1 sm:gap-1.5 max-h-[calc(100%-5.2rem)] overflow-y-auto py-1"
              >
                {/* 1. Like */}
                <ActionButton
                  icon={Heart}
                  label={formatCompactNumber(currentVideo.likes)}
                  ariaLabel="Like video"
                  active={currentVideo.isLiked}
                  activeClass="text-pink-400 fill-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.75)]"
                  onClick={() => onToggleLike(currentVideo.id)}
                />

                {/* 2. Comment */}
                <ActionButton
                  icon={MessageCircle}
                  label={formatCompactNumber(currentVideo.comments.length)}
                  ariaLabel="Open comments"
                  onClick={() => onOpenComments(currentVideo)}
                />

                {/* 3. Messenger */}
                <ActionButton
                  icon={Send}
                  label="DM"
                  ariaLabel="Message creator"
                  onClick={() => onOpenMessengerWithCreator(currentVideo.creatorId)}
                />

                {/* 4. Live Stream */}
                <ActionButton
                  icon={Radio}
                  label="Live"
                  ariaLabel="Open live streams"
                  accentHover="hover:text-pink-400"
                  onClick={() => onNavigate('live')}
                />

                {/* 5. Video Upload */}
                <ActionButton
                  icon={Film}
                  label="Upload"
                  ariaLabel="Upload video"
                  accentHover="hover:text-sky-400"
                  onClick={() => onNavigate('upload')}
                />

                {/* 6. Settings */}
                <ActionButton
                  icon={Settings}
                  label="Settings"
                  ariaLabel="Open settings"
                  onClick={() => onNavigate('settings')}
                />

                {/* 7. Report Video */}
                <ActionButton
                  icon={Flag}
                  label="Report"
                  ariaLabel="Report video"
                  accentHover="hover:text-rose-400"
                  onClick={() => onOpenReport(currentVideo)}
                />

                {/* 8. Share */}
                <ActionButton
                  icon={Share2}
                  label={formatCompactNumber(currentVideo.shares)}
                  ariaLabel="Share video"
                  onClick={() => onOpenShare(currentVideo)}
                />
              </div>

              {/* Video Playback Scrubber Bar */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.max(
                    0,
                    Math.min(1, (e.clientX - rect.left) / rect.width)
                  );
                  setProgress(ratio * 100);
                  if (videoElRef.current && videoElRef.current.duration) {
                    videoElRef.current.currentTime =
                      ratio * videoElRef.current.duration;
                  }
                }}
                className="absolute bottom-0 left-0 right-0 h-2 z-30 flex items-end cursor-pointer group"
                title="Seek playback"
              >
                <div className="w-full h-[3px] group-hover:h-[5px] transition-all bg-white/20">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-sky-400 via-purple-400 to-pink-500 transition-[width] duration-100"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Desktop Swipe / Step Controls & Contextual Creator Stage (1440px Balance) */}
      {currentVideo && (
        <div className="hidden lg:flex flex-col justify-between h-[min(90vh,860px)] w-80 xl:w-96 py-2">
          {/* Up / Down Reel Stepper + Play Control */}
          <div className="flex items-center justify-between bg-[#0D1017] border border-white/[0.08] rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous video"
                className="min-h-[42px] min-w-[42px] rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-slate-200 transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next video"
                className="min-h-[42px] min-w-[42px] rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-slate-200 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-400 font-mono-num ml-1">
                {safeIndex + 1} / {visibleVideos.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="min-h-[40px] px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play</span>
                </>
              )}
            </button>
          </div>

          {/* Creator Spotlight Card */}
          {currentCreator && (
            <div className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <SafeImage
                  src={currentCreator.avatar}
                  alt={currentCreator.displayName}
                  className="w-12 h-12 rounded-full object-cover border border-purple-400/50"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-white truncate">
                    {currentCreator.displayName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    @{currentCreator.username}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleFollow(currentCreator.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    currentCreator.isFollowing
                      ? 'bg-white/10 text-white'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                  }`}
                >
                  {currentCreator.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCreator.bio}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.07] text-center">
                <div>
                  <p className="font-mono-num text-sm font-semibold text-white">
                    {formatCompactNumber(currentCreator.followers)}
                  </p>
                  <p className="text-[11px] text-slate-400">Followers</p>
                </div>
                <div>
                  <p className="font-mono-num text-sm font-semibold text-white">
                    {formatCompactNumber(currentCreator.totalLikes)}
                  </p>
                  <p className="text-[11px] text-slate-400">Total Likes</p>
                </div>
                <div>
                  <p className="font-mono-num text-sm font-semibold text-white">
                    {formatCompactNumber(currentVideo.views)}
                  </p>
                  <p className="text-[11px] text-slate-400">Reel Views</p>
                </div>
              </div>
            </div>
          )}

          {/* Top Comments Preview */}
          <div className="flex-1 min-h-0 mt-4 bg-[#0D1017] border border-white/[0.08] rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold text-white">
                Top Comments
              </h3>
              <button
                type="button"
                onClick={() => onOpenComments(currentVideo)}
                className="text-xs font-medium text-sky-400 hover:text-sky-300"
              >
                View all ({currentVideo.comments.length})
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {currentVideo.comments.slice(0, 4).map((cm) => (
                <div key={cm.id} className="flex items-start gap-2.5">
                  <SafeImage
                    src={cm.avatar}
                    alt={cm.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">
                        @{cm.username}
                      </span>{' '}
                      · {cm.createdAt}
                    </p>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                      {cm.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onOpenComments(currentVideo)}
              className="mt-3 w-full min-h-[42px] px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-left text-xs text-slate-400 transition-colors"
            >
              Write a comment...
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
  accentHover?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  ariaLabel,
  onClick,
  active,
  activeClass,
  accentHover = 'hover:text-purple-300',
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="group flex flex-col items-center justify-center min-w-[44px] py-0.5 focus-visible:outline-none"
  >
    <span
      className={`w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-hover:border-purple-400/60 group-hover:neon-action-glow group-active:scale-95 ${
        active ? 'border-pink-400/60 bg-pink-500/15 neon-action-glow' : ''
      }`}
    >
      <Icon
        className={`w-[18px] h-[18px] transition-colors ${
          active && activeClass
            ? activeClass
            : `text-white ${accentHover}`
        }`}
      />
    </span>
    <span className="text-[10px] font-semibold text-white/90 mt-0.5 font-mono-num drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
      {label}
    </span>
  </button>
);
