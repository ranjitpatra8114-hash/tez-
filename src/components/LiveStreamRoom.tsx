import React, { useState } from 'react';
import {
  Radio,
  Users,
  Heart,
  Send,
  Gift,
  Video,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { LiveStreamRoom } from '../types';
import { SafeImage } from './SafeImage';
import { ASSETS, CURRENT_USER, formatCompactNumber } from '../data/mockData';

interface LiveStreamRoomProps {
  rooms: LiveStreamRoom[];
  onSendMessage: (roomId: string, text: string, giftName?: string) => void;
  onToggleLikeRoom: (roomId: string) => void;
  onToggleFollowHost: (roomId: string) => void;
  onBack: () => void;
}

const GIFTS = [
  { name: 'Pulse Spark', cost: 10 },
  { name: 'Prism Wave', cost: 50 },
  { name: 'Supernova', cost: 200 },
];

export const LiveStreamRoomView: React.FC<LiveStreamRoomProps> = ({
  rooms,
  onSendMessage,
  onToggleLikeRoom,
  onToggleFollowHost,
  onBack,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  const [isHosting, setIsHosting] = useState(false);
  const [hostTitle, setHostTitle] = useState('Late Night Motion & Audio Lab');
  const [chatDraft, setChatDraft] = useState('');

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom || !chatDraft.trim()) return;
    onSendMessage(activeRoom.id, chatDraft.trim());
    setChatDraft('');
  };

  return (
    <div className="flex-1 min-h-screen pb-24 lg:pb-8 px-4 sm:px-6 lg:px-10 py-5 max-w-6xl mx-auto w-full space-y-5">
      {/* Header & Room Switcher */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-pink-500" />
              <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                Live Stream Room
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Join live creator sessions or start your own broadcast.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsHosting((h) => !h)}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 ${
            isHosting
              ? 'bg-rose-600 text-white'
              : 'bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 text-white neon-ad-glow hover:brightness-110'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{isHosting ? 'End Broadcast Preview' : 'Go Live Now'}</span>
        </button>
      </header>

      {/* Active Streams Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {rooms.map((room) => {
          const isSelected = !isHosting && room.id === activeRoom?.id;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                setIsHosting(false);
                setSelectedRoomId(room.id);
              }}
              className={`min-h-[48px] px-3.5 py-2 rounded-2xl border flex items-center gap-3 transition-all shrink-0 ${
                isSelected
                  ? 'bg-purple-500/15 border-purple-400/60 text-white'
                  : 'bg-[#0D1017] border-white/[0.08] text-slate-300 hover:border-white/20'
              }`}
            >
              <SafeImage
                src={room.hostAvatar}
                alt={room.hostName}
                className="w-8 h-8 rounded-full object-cover border border-pink-500"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">
                  @{room.hostUsername}
                </p>
                <p className="text-[11px] text-slate-400 font-mono-num">
                  {formatCompactNumber(room.viewers)} watching
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Live Stage + Chat */}
      {isHosting ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 relative aspect-[9/14] max-h-[680px] w-full rounded-3xl overflow-hidden bg-[#0D1017] border border-pink-500/40">
            <SafeImage
              src={ASSETS.studioDj}
              alt="Host broadcast preview"
              className="w-full h-full object-cover animate-reel-motion"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>LIVE PREVIEW</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-black/55 backdrop-blur-md text-xs font-mono-num text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>142 joined</span>
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 space-y-2">
              <p className="text-xs text-sky-300 font-semibold">
                @{CURRENT_USER.username}
              </p>
              <h2 className="font-display text-lg font-bold text-white">
                {hostTitle}
              </h2>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 space-y-4">
            <h3 className="font-display text-base font-semibold text-white">
              Broadcast Setup
            </h3>
            <div>
              <label
                htmlFor="live-title"
                className="block text-xs font-medium text-slate-400 mb-1.5"
              >
                Stream Title
              </label>
              <input
                id="live-title"
                type="text"
                value={hostTitle}
                onChange={(e) => setHostTitle(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white focus:outline-none focus:border-pink-400"
              />
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Stream Health</p>
              <p>Resolution: 1080×1920 (60 fps)</p>
              <p>Audio Bitrate: 256 kbps Stereo</p>
              <p>Moderation Filter: Active</p>
            </div>
          </div>
        </div>
      ) : (
        activeRoom && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Live Video Feed */}
            <div className="lg:col-span-7 relative aspect-[9/14] max-h-[680px] w-full rounded-3xl overflow-hidden bg-[#0D1017] border border-white/10">
              <SafeImage
                src={activeRoom.coverImage}
                alt={activeRoom.title}
                className="w-full h-full object-cover animate-reel-motion"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />

              {/* Top Host Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                  <SafeImage
                    src={activeRoom.hostAvatar}
                    alt={activeRoom.hostName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-white">
                        @{activeRoom.hostUsername}
                      </p>
                      <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono-num">
                      {formatCompactNumber(activeRoom.likes)} likes
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFollowHost(activeRoom.id)}
                    className={`ml-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      activeRoom.isFollowing
                        ? 'bg-white/15 text-white'
                        : 'bg-pink-500 text-white'
                    }`}
                  >
                    {activeRoom.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>LIVE</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-black/55 backdrop-blur-md text-xs font-mono-num text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>{formatCompactNumber(activeRoom.viewers)}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Title & Like Action */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-sky-300">
                    {activeRoom.category}
                  </span>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white mt-0.5">
                    {activeRoom.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleLikeRoom(activeRoom.id)}
                  aria-label="Send live like"
                  className="min-h-[48px] min-w-[48px] rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.45)] active:scale-90 transition-transform shrink-0"
                >
                  <Heart className="w-5 h-5 fill-white" />
                </button>
              </div>
            </div>

            {/* Real-time Live Chat & Gifts */}
            <div className="lg:col-span-5 bg-[#0D1017] border border-white/[0.08] rounded-3xl flex flex-col max-h-[680px]">
              <header className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-white">
                  Live Stream Chat
                </h3>
                <span className="text-xs text-slate-400 font-mono-num">
                  {activeRoom.chat.length} messages
                </span>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[240px]">
                {activeRoom.chat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`text-sm leading-relaxed ${
                      msg.isGift
                        ? 'px-3 py-2 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-200'
                        : 'text-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-sky-300 mr-2">
                      @{msg.username}
                    </span>
                    <span>{msg.text}</span>
                  </div>
                ))}
              </div>

              {/* Virtual Gifts */}
              <div className="px-4 py-2.5 border-t border-white/[0.07] flex items-center gap-2 overflow-x-auto">
                {GIFTS.map((gift) => (
                  <button
                    key={gift.name}
                    type="button"
                    onClick={() =>
                      onSendMessage(
                        activeRoom.id,
                        `Sent ${gift.name}`,
                        gift.name
                      )
                    }
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-purple-500/20 border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Gift className="w-3.5 h-3.5 text-pink-400" />
                    <span>{gift.name}</span>
                    <span className="text-slate-400 font-mono-num">
                      {gift.cost}
                    </span>
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendChat}
                className="p-4 border-t border-white/[0.07] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder="Say something in live chat..."
                  className="flex-1 h-11 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
                <button
                  type="submit"
                  disabled={!chatDraft.trim()}
                  aria-label="Send live chat message"
                  className="min-h-[44px] min-w-[44px] px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )
      )}
    </div>
  );
};
