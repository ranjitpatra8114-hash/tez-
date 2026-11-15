import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Link2,
  Check,
  Send,
  Bookmark,
  Megaphone,
  Flag,
} from 'lucide-react';
import { Conversation, VideoItem } from '../types';
import { SafeImage } from './SafeImage';

interface ShareSheetProps {
  video: VideoItem | null;
  conversations: Conversation[];
  isOpen: boolean;
  onClose: () => void;
  onShareToFriend: (conversationId: string, video: VideoItem) => void;
  onToggleSave: (videoId: string) => void;
  onPromoteVideo: (videoId: string) => void;
  onOpenReport: (video: VideoItem) => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
  video,
  conversations,
  isOpen,
  onClose,
  onShareToFriend,
  onToggleSave,
  onPromoteVideo,
  onOpenReport,
}) => {
  const [copied, setCopied] = useState(false);
  const [sentIds, setSentIds] = useState<string[]>([]);

  const handleCopy = () => {
    if (!video) return;
    const url = `${window.location.origin}/?reel=${video.id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (convId: string) => {
    if (!video) return;
    onShareToFriend(convId, video);
    setSentIds((prev) => [...prev, convId]);
  };

  return (
    <AnimatePresence>
      {isOpen && video && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.section
            role="dialog"
            aria-label="Share video"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-md bg-[#0D1017] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 space-y-5"
          >
            <div className="sm:hidden w-10 h-1.5 bg-slate-700 rounded-full mx-auto -mt-1" />

            <header className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-white">
                Share Reel
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close share sheet"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Send via Messenger */}
            <div>
              <p className="text-xs font-medium text-slate-400 mb-3">
                Send in Messenger
              </p>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {conversations.map((conv) => {
                  const isSent = sentIds.includes(conv.id);
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSend(conv.id)}
                      className="min-w-[72px] flex flex-col items-center gap-1.5 group focus-visible:outline-none"
                    >
                      <div className="relative">
                        <SafeImage
                          src={conv.avatar}
                          alt={conv.displayName}
                          className="w-12 h-12 rounded-full object-cover border border-white/15 group-hover:border-sky-400 transition-colors"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-[#0D1017] ${
                            isSent
                              ? 'bg-emerald-500 text-white'
                              : 'bg-purple-600 text-white'
                          }`}
                        >
                          {isSent ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Send className="w-2.5 h-2.5" />
                          )}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300 truncate max-w-[72px]">
                        {isSent ? 'Sent' : conv.displayName.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.07]">
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-sm font-medium text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-sky-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleSave(video.id);
                }}
                className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-sm font-medium text-white transition-colors"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    video.isSaved
                      ? 'fill-purple-400 text-purple-400'
                      : 'text-slate-300'
                  }`}
                />
                <span>{video.isSaved ? 'Saved' : 'Save Reel'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPromoteVideo(video.id);
                }}
                className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 border border-purple-400/30 hover:border-purple-400/60 text-sm font-semibold text-white transition-all"
              >
                <Megaphone className="w-4 h-4 text-pink-400" />
                <span>Promote (AD NOW)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReport(video);
                }}
                className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 text-sm font-medium text-rose-300 transition-colors"
              >
                <Flag className="w-4 h-4" />
                <span>Report Video</span>
              </button>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
