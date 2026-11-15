import React from 'react';
import {
  Shield,
  Lock,
  MessageSquare,
  Sliders,
  Ban,
  ArrowLeft,
} from 'lucide-react';
import { Creator, PrivacySettings } from '../types';
import { SafeImage } from './SafeImage';

interface SettingsViewProps {
  settings: PrivacySettings;
  blockedCreators: Creator[];
  onUpdateSettings: (next: Partial<PrivacySettings>) => void;
  onUnblockCreator: (creatorId: string) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  blockedCreators,
  onUpdateSettings,
  onUnblockCreator,
  onBack,
}) => {
  return (
    <div className="flex-1 min-h-screen pb-24 lg:pb-10 px-4 sm:px-6 lg:px-10 py-6 max-w-4xl mx-auto w-full space-y-6">
      <header className="flex items-center gap-3">
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
            Privacy &amp; Security Settings
          </h1>
          <p className="text-sm text-slate-400">
            Manage account visibility, two-factor authentication, messaging, and blocked accounts.
          </p>
        </div>
      </header>

      {/* Account Privacy & Security */}
      <section className="bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <Shield className="w-4 h-4 text-sky-400" />
          <span>Account Security</span>
        </div>

        <ToggleRow
          label="Private Account"
          description="Only approved followers can watch your reels and live streams."
          checked={settings.privateAccount}
          onChange={(v) => onUpdateSettings({ privateAccount: v })}
        />

        <ToggleRow
          label="Two-Factor Authentication (2FA)"
          description="Require a verification code when signing in from a new device."
          checked={settings.twoFactorAuth}
          onChange={(v) => onUpdateSettings({ twoFactorAuth: v })}
        />

        <ToggleRow
          label="Allow Remix &amp; Duets"
          description="Let other creators duet or stitch clips from your published videos."
          checked={settings.allowDuets}
          onChange={(v) => onUpdateSettings({ allowDuets: v })}
        />
      </section>

      {/* Interactions & Messaging */}
      <section className="bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>Comments &amp; Direct Messages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="setting-comments"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Who can comment on your videos
            </label>
            <select
              id="setting-comments"
              value={settings.allowComments}
              onChange={(e) =>
                onUpdateSettings({
                  allowComments: e.target.value as PrivacySettings['allowComments'],
                })
              }
              className="w-full h-11 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
            >
              <option value="Everyone">Everyone</option>
              <option value="Followers">Followers only</option>
              <option value="Off">Turned off</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="setting-messages"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Who can send direct messages
            </label>
            <select
              id="setting-messages"
              value={settings.allowMessages}
              onChange={(e) =>
                onUpdateSettings({
                  allowMessages: e.target.value as PrivacySettings['allowMessages'],
                })
              }
              className="w-full h-11 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
            >
              <option value="Everyone">Everyone</option>
              <option value="Followers">Followers only</option>
              <option value="No one">No one</option>
            </select>
          </div>
        </div>
      </section>

      {/* Playback & Ads */}
      <section className="bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <Sliders className="w-4 h-4 text-pink-400" />
          <span>Playback &amp; Ad Preferences</span>
        </div>

        <ToggleRow
          label="High-Quality 1080p Playback"
          description="Stream vertical reels at full bitrate on cellular and Wi-Fi."
          checked={settings.highQualityPlayback}
          onChange={(v) => onUpdateSettings({ highQualityPlayback: v })}
        />

        <ToggleRow
          label="Personalized Ad Targeting"
          description="Use your feed interests to surface relevant creator promotions."
          checked={settings.personalizedAds}
          onChange={(v) => onUpdateSettings({ personalizedAds: v })}
        />
      </section>

      {/* Blocked Accounts */}
      <section className="bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <Ban className="w-4 h-4 text-rose-400" />
          <span>Blocked Accounts</span>
        </div>

        {blockedCreators.length === 0 ? (
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>You have not blocked any accounts.</span>
          </p>
        ) : (
          <div className="space-y-3">
            {blockedCreators.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={c.avatar}
                    alt={c.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {c.displayName}
                    </p>
                    <p className="text-xs text-slate-400">@{c.username}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUnblockCreator(c.id)}
                  className="min-h-[36px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
}) => (
  <label className="flex items-center justify-between gap-4 cursor-pointer">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-gradient-to-r from-sky-500 to-purple-600' : 'bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </label>
);
