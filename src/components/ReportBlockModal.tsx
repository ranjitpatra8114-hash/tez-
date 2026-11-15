import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Ban, CheckCircle2 } from 'lucide-react';
import { VideoItem } from '../types';

interface ReportBlockModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (videoId: string, reason: string, blockCreator: boolean, creatorId: string) => void;
}

const REPORT_REASONS = [
  'Spam or misleading engagement',
  'Harassment or hate speech',
  'Copyright or uncredited audio',
  'Unsafe or dangerous activity',
  'Nudity or sensitive content',
  'Impersonation',
];

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  video,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [blockCreator, setBlockCreator] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;
    onSubmitReport(video.id, selectedReason, blockCreator, video.creatorId);
    setSubmitted(true);
    window.setTimeout(() => {
      setSubmitted(false);
      setNotes('');
      setBlockCreator(false);
      onClose();
    }, 1100);
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
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.section
            role="dialog"
            aria-label="Report video or block creator"
            initial={{ y: 36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-md bg-[#0D1017] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5"
          >
            {submitted ? (
              <div className="py-10 flex flex-col items-center text-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <h3 className="font-display text-lg font-semibold text-white">
                  Report Submitted
                </h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  {blockCreator
                    ? `@${video.username} has been blocked and their reels are hidden from your feed.`
                    : 'Thank you. Our safety review team has logged this report.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirm} className="space-y-4">
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <h2 className="font-display text-base font-semibold text-white">
                      Report or Block @{video.username}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close report dialog"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </header>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400">
                    Select a reason
                  </p>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {REPORT_REASONS.map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${
                          selectedReason === reason
                            ? 'bg-purple-500/15 border-purple-400/50 text-white'
                            : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="report-reason"
                          checked={selectedReason === reason}
                          onChange={() => setSelectedReason(reason)}
                          className="accent-purple-500"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="report-notes"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Additional context (optional)
                  </label>
                  <textarea
                    id="report-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide timestamps or details..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Ban className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Block @{video.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        Hide all videos &amp; prevent direct messages
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={blockCreator}
                    onChange={(e) => setBlockCreator(e.target.checked)}
                    className="w-4 h-4 accent-rose-500"
                  />
                </label>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] text-sm font-medium text-slate-200 hover:bg-white/[0.1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-sm font-semibold text-white transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
