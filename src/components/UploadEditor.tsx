import React, { useState, useRef } from 'react';
import {
  Upload,
  Sliders,
  Music2,
  Scissors,
  Sparkles,
  CheckCircle2,
  Film,
  ArrowLeft,
} from 'lucide-react';
import { VideoItem } from '../types';
import { ASSETS, CURRENT_USER } from '../data/mockData';
import { SafeImage } from './SafeImage';

interface UploadEditorProps {
  onPublishVideo: (video: VideoItem) => void;
  onBack: () => void;
}

const FILTER_PRESETS = [
  { id: 'none', name: 'Original', css: 'none' },
  {
    id: 'neon',
    name: 'Neon Tokyo',
    css: 'contrast(1.16) saturate(1.38) hue-rotate(-8deg)',
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    css: 'contrast(1.12) saturate(1.15) brightness(0.95) hue-rotate(12deg)',
  },
  {
    id: 'violet',
    name: 'Violet Haze',
    css: 'contrast(1.1) saturate(1.28) hue-rotate(24deg)',
  },
  {
    id: 'noir',
    name: 'Obsidian Noir',
    css: 'grayscale(0.9) contrast(1.25)',
  },
];

const AUDIO_TRACKS = [
  'Midnight Rain Protocol — Sora Hayashi',
  'Voltage Drift (128 BPM) — Sora',
  'Concrete Echoes — Kael Beats',
  'Velvet Horizon — Dusk Collective',
];

const SAMPLE_BACKDROPS = [
  { label: 'Tokyo Rain', src: ASSETS.tokyoDance },
  { label: 'Modular Studio', src: ASSETS.studioDj },
  { label: 'Night Skate', src: ASSETS.nightSkate },
  { label: 'Runway Shell', src: ASSETS.fashionEditorial },
];

export const UploadEditor: React.FC<UploadEditorProps> = ({
  onPublishVideo,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [previewUrl, setPreviewUrl] = useState<string>(ASSETS.tokyoDance);
  const [caption, setCaption] = useState(
    'Late-night neon grading test straight from mobile studio.'
  );
  const [hashtagsRaw, setHashtagsRaw] = useState('#LumenStudio #NightCinema #Neon');
  const [category, setCategory] = useState('Dance');
  const [selectedFilter, setSelectedFilter] = useState(FILTER_PRESETS[1]);
  const [musicName, setMusicName] = useState(AUDIO_TRACKS[0]);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(18);
  const [musicVolume, setMusicVolume] = useState(80);
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuets, setAllowDuets] = useState(true);
  const [publishedToast, setPublishedToast] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      setMediaType('image');
    }
    setPreviewUrl(url);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = hashtagsRaw
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newVideo: VideoItem = {
      id: `v-${Date.now()}`,
      creatorId: CURRENT_USER.id,
      username: CURRENT_USER.username,
      displayName: CURRENT_USER.displayName,
      avatar: CURRENT_USER.avatar,
      posterImage: mediaType === 'image' ? previewUrl : ASSETS.studioDj,
      videoUrl: mediaType === 'video' ? previewUrl : undefined,
      filterCss: selectedFilter.css,
      caption: caption.trim() || 'New Lumen reel',
      hashtags: tags.length > 0 ? tags : ['#Lumen'],
      musicName,
      category,
      likes: 1,
      commentsCount: 0,
      shares: 0,
      views: 1,
      durationSec: Math.max(3, trimEnd - trimStart),
      isLiked: false,
      isSaved: false,
      comments: [],
    };

    setPublishedToast(true);
    window.setTimeout(() => {
      onPublishVideo(newVideo);
    }, 600);
  };

  return (
    <div className="flex-1 min-h-screen pb-24 lg:pb-10 px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto w-full space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to feed"
            className="lg:hidden min-h-[44px] min-w-[44px] rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              Upload &amp; Edit Video
            </h1>
            <p className="text-sm text-slate-400">
              Import a clip, apply color grading &amp; audio, and publish to the 9:16 feed.
            </p>
          </div>
        </div>
      </header>

      {publishedToast && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-sm text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Reel published! Opening in your live feed...</span>
        </div>
      )}

      <form
        onSubmit={handlePublish}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Left: Live 9:16 Preview Stage */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5">
          <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_0_40px_rgba(168,85,247,0.18)]">
            {mediaType === 'video' ? (
              <video
                src={previewUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{ filter: selectedFilter.css }}
                className="w-full h-full object-cover"
              />
            ) : (
              <SafeImage
                src={previewUrl}
                alt="Video preview"
                style={{ filter: selectedFilter.css }}
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
              <p className="text-xs font-semibold text-white">
                @{CURRENT_USER.username}
              </p>
              <p className="text-xs text-slate-200 line-clamp-2 mt-0.5">
                {caption}
              </p>
              <p className="text-[11px] text-sky-300 mt-1 truncate">
                {musicName}
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-[300px] min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Select Video or Photo File</span>
          </button>

          <div className="w-full max-w-[300px]">
            <p className="text-[11px] text-slate-400 mb-2">
              Or test with a studio clip:
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {SAMPLE_BACKDROPS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setMediaType('image');
                    setPreviewUrl(item.src);
                  }}
                  className={`aspect-[9/14] rounded-lg overflow-hidden border transition-all ${
                    previewUrl === item.src
                      ? 'border-sky-400 ring-1 ring-sky-400'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Editing & Publishing Controls */}
        <div className="lg:col-span-7 bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-6">
          {/* Visual Color Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Color Grading Preset</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedFilter(preset)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedFilter.id === preset.id
                      ? 'bg-purple-500/20 border-purple-400 text-white'
                      : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Trim Timeline */}
          <div className="space-y-3 pt-4 border-t border-white/[0.07]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Scissors className="w-4 h-4 text-sky-400" />
                <span>Trim Clip Duration</span>
              </div>
              <span className="text-xs font-mono-num text-sky-300">
                {trimStart}s – {trimEnd}s ({Math.max(3, trimEnd - trimStart)}s total)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Start ({trimStart}s)
                </label>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={trimStart}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTrimStart(Math.min(val, trimEnd - 3));
                  }}
                  className="w-full accent-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  End ({trimEnd}s)
                </label>
                <input
                  type="range"
                  min={3}
                  max={30}
                  value={trimEnd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTrimEnd(Math.max(val, trimStart + 3));
                  }}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Audio Track & Mix */}
          <div className="space-y-3 pt-4 border-t border-white/[0.07]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Music2 className="w-4 h-4 text-pink-400" />
              <span>Soundtrack &amp; Mix</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <select
                aria-label="Select soundtrack"
                value={musicName}
                onChange={(e) => setMusicName(e.target.value)}
                className="h-11 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
              >
                {AUDIO_TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Track Volume</span>
                  <span className="font-mono-num text-white">{musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Caption, Hashtags, Category */}
          <div className="space-y-4 pt-4 border-t border-white/[0.07]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Post Details</span>
            </div>

            <div>
              <label
                htmlFor="upload-caption"
                className="block text-xs font-medium text-slate-400 mb-1.5"
              >
                Caption
              </label>
              <textarea
                id="upload-caption"
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe your reel..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="upload-tags"
                  className="block text-xs font-medium text-slate-400 mb-1.5"
                >
                  Hashtags
                </label>
                <input
                  id="upload-tags"
                  type="text"
                  value={hashtagsRaw}
                  onChange={(e) => setHashtagsRaw(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label
                  htmlFor="upload-category"
                  className="block text-xs font-medium text-slate-400 mb-1.5"
                >
                  Category
                </label>
                <select
                  id="upload-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Dance">Dance</option>
                  <option value="Music">Music</option>
                  <option value="Skate">Skate</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  className="w-4 h-4 accent-purple-500"
                />
                <span>Allow comments</span>
              </label>
              <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDuets}
                  onChange={(e) => setAllowDuets(e.target.checked)}
                  className="w-4 h-4 accent-sky-500"
                />
                <span>Allow remix &amp; duets</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 min-h-[48px] px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 text-white font-bold text-sm neon-ad-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Film className="w-4 h-4" />
              <span>Publish Reel to Feed</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
