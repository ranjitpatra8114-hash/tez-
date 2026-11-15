import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  TrendingUp,
  Users,
  DollarSign,
  Play,
  Pause,
  Plus,
  CheckCircle2,
  Eye,
  MousePointerClick,
  Target,
  ArrowLeft,
} from 'lucide-react';
import { AdCampaign, AdStatus, VideoItem } from '../types';
import { SafeImage } from './SafeImage';
import { formatCompactNumber } from '../data/mockData';

interface AdNowStudioProps {
  campaigns: AdCampaign[];
  videos: VideoItem[];
  preselectedVideoId?: string;
  onCreateCampaign: (campaign: AdCampaign) => void;
  onUpdateCampaignStatus: (campaignId: string, status: AdStatus) => void;
  onBack: () => void;
}

const REGIONS = [
  'Global · Top Tier',
  'North America',
  'Tokyo · Seoul · Osaka',
  'Western Europe',
  'Latin America',
];

const AGE_GROUPS = ['18–24', '18–34', '25–44', 'All Ages (18+)'];

const INTEREST_OPTIONS = [
  'Street Dance',
  'Electronic Music',
  'Techwear & Fashion',
  'Urban Sports',
  'Night Photography',
  'Creator Gear',
  'Design & Motion',
];

const GOALS: {
  id: AdCampaign['goal'];
  label: string;
  desc: string;
}[] = [
  { id: 'Video Views', label: 'Boost Video Reach', desc: 'Maximize plays & completions' },
  { id: 'Follower Growth', label: 'Grow Followers', desc: 'Target high-intent subscribers' },
  { id: 'Profile Visits', label: 'Profile Visits', desc: 'Drive traffic to your studio' },
  { id: 'Website Traffic', label: 'Website Clicks', desc: 'Convert external landing links' },
];

export const AdNowStudio: React.FC<AdNowStudioProps> = ({
  campaigns,
  videos,
  preselectedVideoId,
  onCreateCampaign,
  onUpdateCampaignStatus,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'campaigns' | 'analytics'>(
    preselectedVideoId ? 'create' : 'campaigns'
  );
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    preselectedVideoId || videos[0]?.id || ''
  );
  const [goal, setGoal] = useState<AdCampaign['goal']>('Video Views');
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [ageGroup, setAgeGroup] = useState<string>('18–34');
  const [interests, setInterests] = useState<string[]>([
    'Electronic Music',
    'Night Photography',
  ]);
  const [dailyBudget, setDailyBudget] = useState<number>(60);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [selectedAnalyticsId, setSelectedAnalyticsId] = useState<string>(
    campaigns[0]?.id || ''
  );
  const [createdBanner, setCreatedBanner] = useState(false);

  const selectedVideo =
    videos.find((v) => v.id === selectedVideoId) || videos[0];

  const totalBudget = dailyBudget * durationDays;
  const estMinReach = Math.round(totalBudget * 480);
  const estMaxReach = Math.round(totalBudget * 760);

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo) return;

    const baseReach = Math.round(dailyBudget * 520);
    const newCampaign: AdCampaign = {
      id: `ad-${Date.now()}`,
      videoId: selectedVideo.id,
      videoTitle: selectedVideo.caption.slice(0, 48),
      videoThumbnail: selectedVideo.posterImage,
      goal,
      audienceRegion: region,
      audienceAge: ageGroup,
      interests: interests.length > 0 ? interests : ['General Discovery'],
      dailyBudget,
      durationDays,
      status: 'Active',
      impressions: baseReach,
      clicks: Math.round(baseReach * 0.048),
      conversions: Math.round(baseReach * 0.014),
      spendToDate: dailyBudget,
      dailyReachSeries: [
        { day: 'Day 1', reach: Math.round(baseReach * 0.65), clicks: Math.round(baseReach * 0.03) },
        { day: 'Day 2', reach: Math.round(baseReach * 0.85), clicks: Math.round(baseReach * 0.04) },
        { day: 'Day 3', reach: baseReach, clicks: Math.round(baseReach * 0.05) },
        { day: 'Day 4', reach: Math.round(baseReach * 1.12), clicks: Math.round(baseReach * 0.055) },
        { day: 'Day 5', reach: Math.round(baseReach * 1.24), clicks: Math.round(baseReach * 0.062) },
      ],
    };

    onCreateCampaign(newCampaign);
    setSelectedAnalyticsId(newCampaign.id);
    setCreatedBanner(true);
    setActiveTab('campaigns');
    window.setTimeout(() => setCreatedBanner(false), 3500);
  };

  const activeAnalyticsCampaign =
    campaigns.find((c) => c.id === selectedAnalyticsId) || campaigns[0];

  const aggregateStats = useMemo(() => {
    const impressions = campaigns.reduce((s, c) => s + c.impressions, 0);
    const clicks = campaigns.reduce((s, c) => s + c.clicks, 0);
    const spend = campaigns.reduce((s, c) => s + c.spendToDate, 0);
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
    return { impressions, clicks, spend, ctr };
  }, [campaigns]);

  return (
    <div className="flex-1 min-h-screen pb-24 lg:pb-10 px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to feed"
            className="lg:hidden min-h-[44px] min-w-[44px] rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-200 hover:bg-white/[0.1]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-5 h-5 text-pink-400" />
              <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                AD NOW Studio
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Promote videos, target audiences, and track real-time reach analytics.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 text-white text-sm font-bold neon-ad-glow flex items-center justify-center gap-2 hover:brightness-110 transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Advertisement</span>
        </button>
      </header>

      {createdBanner && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-sm text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            New advertisement launched and active. Reach delivery has begun.
          </span>
        </div>
      )}

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0D1017] border border-white/[0.08] rounded-xl w-fit">
        {[
          { id: 'campaigns' as const, label: 'Campaign Status' },
          { id: 'create' as const, label: 'Promote Video' },
          { id: 'analytics' as const, label: 'Performance Analytics' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-sky-500/25 to-purple-500/25 text-white border border-purple-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Aggregate KPI Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={Eye}
          label="Total Ad Reach"
          value={formatCompactNumber(aggregateStats.impressions)}
          sub="Last 7 days"
        />
        <KpiCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={formatCompactNumber(aggregateStats.clicks)}
          sub={`CTR ${aggregateStats.ctr}%`}
        />
        <KpiCard
          icon={DollarSign}
          label="Total Ad Spend"
          value={`$${aggregateStats.spend.toFixed(2)}`}
          sub={`${campaigns.filter((c) => c.status === 'Active').length} active campaigns`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Avg. CPM"
          value="$2.14"
          sub="18% below benchmark"
        />
      </section>

      {/* TAB 1: CREATE NEW ADVERTISEMENT / PROMOTE YOUR VIDEO */}
      {activeTab === 'create' && (
        <form
          onSubmit={handleLaunchCampaign}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div className="lg:col-span-7 space-y-6 bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6">
            {/* Step 1: Promote Your Video */}
            <div className="space-y-3">
              <h2 className="font-display text-base font-semibold text-white">
                01. Promote Your Video
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {videos.slice(0, 4).map((v) => {
                  const isSelected = v.id === selectedVideoId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVideoId(v.id)}
                      className={`group relative aspect-[9/14] rounded-2xl overflow-hidden border text-left transition-all ${
                        isSelected
                          ? 'border-sky-400 ring-2 ring-purple-500/40'
                          : 'border-white/10 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <SafeImage
                        src={v.posterImage}
                        alt={v.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[11px] font-medium text-white line-clamp-2">
                          {v.caption}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Boost Video Reach Objective */}
            <div className="space-y-3 pt-4 border-t border-white/[0.07]">
              <h2 className="font-display text-base font-semibold text-white">
                02. Boost Video Reach Objective
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      goal === g.id
                        ? 'bg-purple-500/15 border-purple-400/60 text-white'
                        : 'bg-white/[0.03] border-white/[0.07] text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <p className="text-sm font-semibold">{g.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Select Advertising Audience */}
            <div className="space-y-4 pt-4 border-t border-white/[0.07]">
              <h2 className="font-display text-base font-semibold text-white">
                03. Select Advertising Audience
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ad-region"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Target Region
                  </label>
                  <select
                    id="ad-region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ad-age"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Age Bracket
                  </label>
                  <select
                    id="ad-age"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400"
                  >
                    {AGE_GROUPS.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">
                  Audience Interests
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((tag) => {
                    const active = interests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-sky-500/20 border-sky-400/60 text-sky-200'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 4: Advertisement Budget */}
            <div className="space-y-4 pt-4 border-t border-white/[0.07]">
              <h2 className="font-display text-base font-semibold text-white">
                04. Advertisement Budget &amp; Duration
              </h2>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-300">Daily Budget</span>
                    <span className="font-mono-num font-semibold text-sky-400">
                      ${dailyBudget} / day
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-300">Campaign Duration</span>
                    <span className="font-mono-num font-semibold text-purple-300">
                      {durationDays} days
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary & Launch Preview */}
          <div className="lg:col-span-5 bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 lg:sticky lg:top-6">
            <h3 className="font-display text-base font-semibold text-white">
              Campaign Forecast
            </h3>

            {selectedVideo && (
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <SafeImage
                  src={selectedVideo.posterImage}
                  alt={selectedVideo.caption}
                  className="w-14 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-sky-400">{goal}</p>
                  <p className="text-sm font-medium text-white line-clamp-2 mt-0.5">
                    {selectedVideo.caption}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    @{selectedVideo.username}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2.5 text-sm border-t border-b border-white/[0.07] py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated Video Reach</span>
                <span className="font-mono-num font-semibold text-white">
                  {formatCompactNumber(estMinReach)} – {formatCompactNumber(estMaxReach)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Audience</span>
                <span className="text-slate-200 truncate max-w-[190px]">
                  {region} · {ageGroup}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Campaign Budget</span>
                <span className="font-mono-num text-lg font-bold text-white">
                  ${totalBudget.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 text-white font-bold text-sm neon-ad-glow hover:brightness-110 active:scale-[0.99] transition-all"
            >
              Launch Advertisement Now
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: AD CAMPAIGN STATUS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-3">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <SafeImage
                  src={camp.videoThumbnail}
                  alt={camp.videoTitle}
                  className="w-14 h-20 rounded-xl object-cover shrink-0 border border-white/10"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold ${
                        camp.status === 'Active'
                          ? 'text-emerald-400'
                          : camp.status === 'Paused'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {camp.status}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-xs text-slate-400">{camp.goal}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-white truncate">
                    {camp.videoTitle}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {camp.audienceRegion} · Ages {camp.audienceAge} · ${camp.dailyBudget}/day
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.07]">
                <div className="grid grid-cols-3 gap-4 text-right font-mono-num">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {formatCompactNumber(camp.impressions)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans">Reach</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {formatCompactNumber(camp.clicks)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans">Clicks</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      ${camp.spendToDate.toFixed(0)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans">Spend</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCampaignStatus(
                        camp.id,
                        camp.status === 'Active' ? 'Paused' : 'Active'
                      )
                    }
                    className="min-h-[40px] px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                  >
                    {camp.status === 'Active' ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAnalyticsId(camp.id);
                      setActiveTab('analytics');
                    }}
                    className="min-h-[40px] px-3.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-xs font-semibold text-purple-200 transition-colors"
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AD PERFORMANCE ANALYTICS */}
      {activeTab === 'analytics' && activeAnalyticsCampaign && (
        <div className="bg-[#0D1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Ad Performance Analytics
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily reach and click-through progression for selected campaign
              </p>
            </div>
            <select
              aria-label="Select campaign for analytics"
              value={activeAnalyticsCampaign.id}
              onChange={(e) => setSelectedAnalyticsId(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.videoTitle} ({c.status})
                </option>
              ))}
            </select>
          </div>

          {/* Responsive Bar & Line SVG Chart */}
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 h-56 items-end pt-6 px-2 border-b border-white/[0.08]">
              {(() => {
                const maxReach = Math.max(
                  ...activeAnalyticsCampaign.dailyReachSeries.map((d) => d.reach),
                  1
                );
                return activeAnalyticsCampaign.dailyReachSeries.map((pt) => {
                  const pct = Math.max(12, Math.round((pt.reach / maxReach) * 100));
                  return (
                    <div
                      key={pt.day}
                      className="flex flex-col items-center justify-end h-full gap-2 group"
                    >
                      <span className="text-[11px] font-mono-num text-slate-300 opacity-80 group-hover:opacity-100">
                        {formatCompactNumber(pt.reach)}
                      </span>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full max-w-[44px] rounded-t-xl bg-gradient-to-t from-purple-600 via-sky-500 to-cyan-300 opacity-85 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                      />
                    </div>
                  );
                });
              })()}
            </div>
            <div className="grid grid-cols-7 gap-2 sm:gap-4 px-2 text-center">
              {activeAnalyticsCampaign.dailyReachSeries.map((pt) => (
                <span key={pt.day} className="text-xs text-slate-400">
                  {pt.day}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-400" />
                <span>Goal</span>
              </p>
              <p className="text-sm font-semibold text-white mt-1">
                {activeAnalyticsCampaign.goal}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Conversions</span>
              </p>
              <p className="font-mono-num text-sm font-semibold text-white mt-1">
                {formatCompactNumber(activeAnalyticsCampaign.conversions)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-slate-400">Click-Through Rate</p>
              <p className="font-mono-num text-sm font-semibold text-emerald-400 mt-1">
                {(
                  (activeAnalyticsCampaign.clicks /
                    Math.max(activeAnalyticsCampaign.impressions, 1)) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-slate-400">Remaining Budget</p>
              <p className="font-mono-num text-sm font-semibold text-white mt-1">
                $
                {Math.max(
                  0,
                  activeAnalyticsCampaign.dailyBudget *
                    activeAnalyticsCampaign.durationDays -
                    activeAnalyticsCampaign.spendToDate
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface KpiCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-[#0D1017] border border-white/[0.08] rounded-2xl p-4 space-y-1.5">
    <div className="flex items-center justify-between text-slate-400">
      <span className="text-xs font-medium">{label}</span>
      <Icon className="w-4 h-4 text-sky-400" />
    </div>
    <p className="font-mono-num text-xl sm:text-2xl font-bold text-white">
      {value}
    </p>
    <p className="text-xs text-slate-400">{sub}</p>
  </div>
);
