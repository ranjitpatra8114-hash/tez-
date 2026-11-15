import React, { useState, useMemo } from 'react';
import {
  Search,
  Play,
  Music2,
  TrendingUp,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Creator, VideoItem } from '../types';
import { SafeImage } from './SafeImage';
import { formatCompactNumber } from '../data/mockData';

interface SearchDiscoverProps {
  videos: VideoItem[];
  creators: Creator[];
  initialQuery?: string;
  onSelectVideo: (videoId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onSelectCreator: (creatorId: string) => void;
}

const CATEGORIES = ['All', 'Dance', 'Music', 'Skate', 'Fashion'];

const TRENDING_TAGS = [
  '#TokyoNight',
  '#ModularSynth',
  '#NightSkate',
  '#Techwear',
  '#35mm',
  '#LiveElectronic',
];

export const SearchDiscover: React.FC<SearchDiscoverProps> = ({
  videos,
  creators,
  initialQuery = '',
  onSelectVideo,
  onToggleFollow,
  onSelectCreator,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      const catMatch = category === 'All' || v.category === category;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        v.caption.toLowerCase().includes(q) ||
        v.username.toLowerCase().includes(q) ||
        v.musicName.toLowerCase().includes(q) ||
        v.hashtags.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [videos, query, category]);

  const filteredCreators = useMemo(() => {
    const q = query.trim().toLowerCase();
    return creators.filter((c) => {
      if (!q) return true;
      return (
        c.username.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [creators, query]);

  return (
    <div className="flex-1 min-h-screen pb-24 lg:pb-10 px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Search Bar */}
      <header className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Search &amp; Discover
        </h1>

        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators, reels, sounds, or #hashtags..."
            className="w-full h-12 pl-12 pr-11 rounded-2xl bg-[#0D1017] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                category === cat
                  ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-[0_0_14px_rgba(56,189,248,0.3)]'
                  : 'bg-[#0D1017] border border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Trending Hashtags */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>Trending Tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-purple-500/15 border border-white/[0.08] hover:border-purple-400/40 text-xs font-medium text-sky-300 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      {filteredCreators.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-base font-semibold text-white">
            Creators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => onSelectCreator(creator.id)}
                  className="flex items-center gap-3 min-w-0 text-left group"
                >
                  <SafeImage
                    src={creator.avatar}
                    alt={creator.displayName}
                    className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-sky-300">
                        {creator.displayName}
                      </p>
                      {creator.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate font-mono-num">
                      {formatCompactNumber(creator.followers)} followers
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFollow(creator.id)}
                  className={`min-h-[34px] px-3 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                    creator.isFollowing
                      ? 'bg-white/10 text-slate-200'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                  }`}
                >
                  {creator.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Results Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-white">
            Trending Reels
          </h2>
          <span className="text-xs text-slate-400 font-mono-num">
            {filteredVideos.length} videos
          </span>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-10 text-center space-y-2">
            <p className="text-sm font-medium text-white">
              No reels match "{query}"
            </p>
            <p className="text-xs text-slate-400">
              Try clearing your filter or searching another hashtag.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredVideos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => onSelectVideo(video.id)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#0D1017] border border-white/[0.08] hover:border-purple-400/50 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <SafeImage
                  src={video.posterImage}
                  alt={video.caption}
                  style={{ filter: video.filterCss || 'none' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-md text-[11px] font-mono-num text-white flex items-center gap-1">
                  <Play className="w-3 h-3 fill-white" />
                  <span>{formatCompactNumber(video.views)}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
                  <p className="text-xs font-medium text-white line-clamp-2 leading-snug">
                    {video.caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="truncate">@{video.username}</span>
                    <span className="flex items-center gap-1 shrink-0 text-sky-300">
                      <Music2 className="w-3 h-3" />
                      <span className="font-mono-num">{video.durationSec}s</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
