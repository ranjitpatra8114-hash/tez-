export type ScreenId =
  | 'home'
  | 'search'
  | 'upload'
  | 'live'
  | 'profile'
  | 'messenger'
  | 'adnow'
  | 'notifications'
  | 'settings';

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  totalLikes: number;
  isFollowing: boolean;
  isBlocked?: boolean;
  category: string;
}

export interface CommentItem {
  id: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface VideoItem {
  id: string;
  creatorId: string;
  username: string;
  displayName: string;
  avatar: string;
  posterImage: string;
  videoUrl?: string;
  filterCss?: string;
  caption: string;
  hashtags: string[];
  musicName: string;
  category: string;
  likes: number;
  commentsCount: number;
  shares: number;
  views: number;
  durationSec: number;
  isLiked: boolean;
  isSaved: boolean;
  isPromoted?: boolean;
  comments: CommentItem[];
}

export interface DirectMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  sharedVideoTitle?: string;
}

export interface Conversation {
  id: string;
  creatorId: string;
  username: string;
  displayName: string;
  avatar: string;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  messages: DirectMessage[];
}

export interface LiveChatMessage {
  id: string;
  username: string;
  text: string;
  isGift?: boolean;
  giftName?: string;
}

export interface LiveStreamRoom {
  id: string;
  hostUsername: string;
  hostName: string;
  hostAvatar: string;
  title: string;
  category: string;
  coverImage: string;
  viewers: number;
  likes: number;
  isFollowing: boolean;
  chat: LiveChatMessage[];
}

export type AdStatus = 'Active' | 'Paused' | 'In Review';

export interface AdCampaign {
  id: string;
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  goal: 'Video Views' | 'Profile Visits' | 'Follower Growth' | 'Website Traffic';
  audienceRegion: string;
  audienceAge: string;
  interests: string[];
  dailyBudget: number;
  durationDays: number;
  status: AdStatus;
  impressions: number;
  clicks: number;
  conversions: number;
  spendToDate: number;
  dailyReachSeries: { day: string; reach: number; clicks: number }[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'ad' | 'live';
  actorName: string;
  actorUsername: string;
  actorAvatar: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetVideoId?: string;
}

export interface PrivacySettings {
  privateAccount: boolean;
  twoFactorAuth: boolean;
  allowComments: 'Everyone' | 'Followers' | 'Off';
  allowMessages: 'Everyone' | 'Followers' | 'No one';
  allowDuets: boolean;
  highQualityPlayback: boolean;
  personalizedAds: boolean;
}
