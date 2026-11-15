import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Send } from 'lucide-react';
import { VideoItem } from '../types';
import { SafeImage } from './SafeImage';
import { formatCompactNumber } from '../data/mockData';

interface CommentsDrawerProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (videoId: string, text: string) => void;
  onToggleCommentLike: (videoId: string, commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  video,
  isOpen,
  onClose,
  onAddComment,
  onToggleCommentLike,
}) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !draft.trim()) return;
    onAddComment(video.id, draft.trim());
    setDraft('');
  };

  return (
    <AnimatePresence>
      {isOpen && video && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.section
            role="dialog"
            aria-label="Video comments"
            initial={{ y: '100%', opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.7 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full lg:w-[420px] lg:h-full max-h-[80vh] lg:max-h-full bg-[#0D1017] border-t lg:border-t-0 lg:border-l border-white/10 rounded-t-3xl lg:rounded-none flex flex-col"
          >
            {/* Mobile drag bar */}
            <div className="lg:hidden w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 mb-1" />

            <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-semibold text-white">
                  Comments
                </h2>
                <span className="text-xs text-slate-400 font-mono-num">
                  {formatCompactNumber(video.comments.length)}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close comments"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {video.comments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">
                  No comments yet. Start the conversation below.
                </p>
              ) : (
                video.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <SafeImage
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-200 truncate">
                          @{comment.username}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                        <span className="text-slate-400 shrink-0">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 mt-1 leading-relaxed break-words">
                        {comment.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleCommentLike(video.id, comment.id)}
                      aria-label={`Like comment by ${comment.username}`}
                      className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center text-slate-400 hover:text-pink-400 transition-colors shrink-0"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          comment.isLiked ? 'fill-pink-500 text-pink-500' : ''
                        }`}
                      />
                      <span className="text-[11px] font-mono-num mt-0.5">
                        {comment.likes}
                      </span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/[0.07] bg-[#090B11] flex items-center gap-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 h-11 px-4 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Post comment"
                className="min-h-[44px] min-w-[44px] px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-medium text-sm flex items-center justify-center disabled:opacity-40 hover:brightness-110 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
