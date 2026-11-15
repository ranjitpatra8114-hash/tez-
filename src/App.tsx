import React, { useState, useMemo } from 'react';
import {
  INITIAL_AD_CAMPAIGNS,
  INITIAL_CONVERSATIONS,
  INITIAL_CREATORS,
  INITIAL_LIVE_ROOMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PRIVACY_SETTINGS,
  INITIAL_VIDEOS,
  CURRENT_USER,
} from './data/mockData';
import {
  AdCampaign,
  AdStatus,
  Conversation,
  Creator,
  LiveStreamRoom,
  NotificationItem,
  PrivacySettings,
  ScreenId,
  VideoItem,
} from './types';
import { DesktopNav } from './components/DesktopNav';
import { BottomNav } from './components/BottomNav';
import { VideoFeed } from './components/VideoFeed';
import { SearchDiscover } from './components/SearchDiscover';
import { UploadEditor } from './components/UploadEditor';
import { LiveStreamRoomView } from './components/LiveStreamRoom';
import { ProfileDashboard } from './components/ProfileDashboard';
import { MessengerView } from './components/MessengerView';
import { AdNowStudio } from './components/AdNowStudio';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { CommentsDrawer } from './components/CommentsDrawer';
import { ShareSheet } from './components/ShareSheet';
import { ReportBlockModal } from './components/ReportBlockModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [creators, setCreators] = useState<Creator[]>(INITIAL_CREATORS);
  const [conversations, setConversations] =
    useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [liveRooms, setLiveRooms] =
    useState<LiveStreamRoom[]>(INITIAL_LIVE_ROOMS);
  const [campaigns, setCampaigns] =
    useState<AdCampaign[]>(INITIAL_AD_CAMPAIGNS);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    INITIAL_PRIVACY_SETTINGS
  );

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(
    INITIAL_CONVERSATIONS[0].id
  );
  const [viewedProfileId, setViewedProfileId] = useState<string>(CURRENT_USER.id);
  const [adPreselectedVideoId, setAdPreselectedVideoId] = useState<
    string | undefined
  >(undefined);

  // Overlay states
  const [commentsVideoId, setCommentsVideoId] = useState<string | null>(null);
  const [shareVideoId, setShareVideoId] = useState<string | null>(null);
  const [reportVideoId, setReportVideoId] = useState<string | null>(null);

  const blockedCreatorIds = useMemo(
    () => new Set(creators.filter((c) => c.isBlocked).map((c) => c.id)),
    [creators]
  );

  const visibleVideos = useMemo(
    () => videos.filter((v) => !blockedCreatorIds.has(v.creatorId)),
    [videos, blockedCreatorIds]
  );

  const unreadMessages = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleNavigate = (screen: ScreenId) => {
    if (screen === 'profile') {
      setViewedProfileId(CURRENT_USER.id);
    }
    if (screen !== 'adnow') {
      setAdPreselectedVideoId(undefined);
    }
    setActiveScreen(screen);
  };

  const handleToggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              isLiked: !v.isLiked,
              likes: v.isLiked ? Math.max(0, v.likes - 1) : v.likes + 1,
            }
          : v
      )
    );
  };

  const handleToggleSave = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isSaved: !v.isSaved } : v))
    );
  };

  const handleToggleFollow = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId
          ? {
              ...c,
              isFollowing: !c.isFollowing,
              followers: c.isFollowing
                ? Math.max(0, c.followers - 1)
                : c.followers + 1,
            }
          : c
      )
    );
  };

  const handleAddComment = (videoId: string, text: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              commentsCount: v.commentsCount + 1,
              comments: [
                {
                  id: `cm-${Date.now()}`,
                  username: CURRENT_USER.username,
                  avatar: CURRENT_USER.avatar,
                  text,
                  createdAt: 'Just now',
                  likes: 0,
                  isLiked: false,
                },
                ...v.comments,
              ],
            }
          : v
      )
    );
  };

  const handleToggleCommentLike = (videoId: string, commentId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              comments: v.comments.map((cm) =>
                cm.id === commentId
                  ? {
                      ...cm,
                      isLiked: !cm.isLiked,
                      likes: cm.isLiked
                        ? Math.max(0, cm.likes - 1)
                        : cm.likes + 1,
                    }
                  : cm
              ),
            }
          : v
      )
    );
  };

  const handleShareToFriend = (conversationId: string, video: VideoItem) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, shares: v.shares + 1 } : v))
    );
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: `Shared reel by @${video.username}`,
              lastTimestamp: 'Just now',
              messages: [
                ...conv.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: 'me',
                  text: `Check out this reel by @${video.username}`,
                  sharedVideoTitle: video.caption.slice(0, 42),
                  timestamp: 'Now',
                },
              ],
            }
          : conv
      )
    );
  };

  const handleOpenMessengerWithCreator = (creatorId: string) => {
    const existing = conversations.find((c) => c.creatorId === creatorId);
    if (existing) {
      setSelectedConversationId(existing.id);
      setConversations((prev) =>
        prev.map((c) => (c.id === existing.id ? { ...c, unreadCount: 0 } : c))
      );
    } else {
      const creator = creators.find((c) => c.id === creatorId);
      if (creator) {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          creatorId: creator.id,
          username: creator.username,
          displayName: creator.displayName,
          avatar: creator.avatar,
          online: true,
          unreadCount: 0,
          lastMessage: 'Start a conversation',
          lastTimestamp: 'Now',
          messages: [],
        };
        setConversations((prev) => [newConv, ...prev]);
        setSelectedConversationId(newConv.id);
      }
    }
    setActiveScreen('messenger');
  };

  const handleSendDirectMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              unreadCount: 0,
              lastMessage: text,
              lastTimestamp: 'Just now',
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: 'me',
                  text,
                  timestamp: 'Now',
                },
              ],
            }
          : c
      )
    );
  };

  const handleBlockCreator = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId ? { ...c, isBlocked: true, isFollowing: false } : c
      )
    );
    setActiveVideoIndex(0);
  };

  const handleUnblockCreator = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, isBlocked: false } : c))
    );
  };

  const handleSubmitReport = (
    _videoId: string,
    _reason: string,
    blockCreator: boolean,
    creatorId: string
  ) => {
    if (blockCreator) {
      handleBlockCreator(creatorId);
    }
  };

  const handlePublishVideo = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
    setActiveVideoIndex(0);
    setActiveScreen('home');
  };

  const handleSelectVideoFromGrid = (videoId: string) => {
    const idx = visibleVideos.findIndex((v) => v.id === videoId);
    if (idx !== -1) {
      setActiveVideoIndex(idx);
      setActiveScreen('home');
    }
  };

  const handlePromoteVideo = (videoId: string) => {
    setAdPreselectedVideoId(videoId);
    setActiveScreen('adnow');
  };

  const handleCreateCampaign = (newCampaign: AdCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setVideos((prev) =>
      prev.map((v) =>
        v.id === newCampaign.videoId ? { ...v, isPromoted: true } : v
      )
    );
  };

  const handleUpdateCampaignStatus = (campaignId: string, status: AdStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status } : c))
    );
  };

  const handleSendLiveMessage = (
    roomId: string,
    text: string,
    giftName?: string
  ) => {
    setLiveRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              chat: [
                ...room.chat,
                {
                  id: `lc-${Date.now()}`,
                  username: CURRENT_USER.username,
                  text,
                  isGift: Boolean(giftName),
                  giftName,
                },
              ],
            }
          : room
      )
    );
  };

  const handleToggleLikeRoom = (roomId: string) => {
    setLiveRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, likes: room.likes + 1 } : room
      )
    );
  };

  const handleToggleFollowHost = (roomId: string) => {
    setLiveRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, isFollowing: !room.isFollowing }
          : room
      )
    );
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.type === 'live') {
      setActiveScreen('live');
    } else if (item.type === 'ad') {
      setActiveScreen('adnow');
    } else if (item.targetVideoId) {
      handleSelectVideoFromGrid(item.targetVideoId);
    }
  };

  const activeCommentsVideo =
    videos.find((v) => v.id === commentsVideoId) || null;
  const activeShareVideo = videos.find((v) => v.id === shareVideoId) || null;
  const activeReportVideo = videos.find((v) => v.id === reportVideoId) || null;

  const viewedProfile =
    viewedProfileId === CURRENT_USER.id
      ? CURRENT_USER
      : creators.find((c) => c.id === viewedProfileId) || CURRENT_USER;

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex">
      {/* Desktop Left Navigation Rail */}
      <DesktopNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        unreadMessages={unreadMessages}
        unreadNotifications={unreadNotifications}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {activeScreen === 'home' && (
          <VideoFeed
            videos={visibleVideos}
            creators={creators}
            activeIndex={activeVideoIndex}
            onChangeIndex={setActiveVideoIndex}
            onToggleLike={handleToggleLike}
            onToggleFollow={handleToggleFollow}
            onOpenComments={(v) => setCommentsVideoId(v.id)}
            onOpenShare={(v) => setShareVideoId(v.id)}
            onOpenReport={(v) => setReportVideoId(v.id)}
            onOpenMessengerWithCreator={handleOpenMessengerWithCreator}
            onNavigate={handleNavigate}
            onPromoteVideo={handlePromoteVideo}
            onSearchHashtag={(tag) => {
              setSearchQuery(tag);
              setActiveScreen('search');
            }}
            onSelectCreatorProfile={(creatorId) => {
              setViewedProfileId(creatorId);
              setActiveScreen('profile');
            }}
            unreadNotifications={unreadNotifications}
          />
        )}

        {activeScreen === 'search' && (
          <SearchDiscover
            videos={visibleVideos}
            creators={creators.filter((c) => !c.isBlocked)}
            initialQuery={searchQuery}
            onSelectVideo={handleSelectVideoFromGrid}
            onToggleFollow={handleToggleFollow}
            onSelectCreator={(creatorId) => {
              setViewedProfileId(creatorId);
              setActiveScreen('profile');
            }}
          />
        )}

        {activeScreen === 'upload' && (
          <UploadEditor
            onPublishVideo={handlePublishVideo}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'live' && (
          <LiveStreamRoomView
            rooms={liveRooms}
            onSendMessage={handleSendLiveMessage}
            onToggleLikeRoom={handleToggleLikeRoom}
            onToggleFollowHost={handleToggleFollowHost}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfileDashboard
            profile={viewedProfile}
            isOwnProfile={viewedProfile.id === CURRENT_USER.id}
            allCreators={creators.filter((c) => !c.isBlocked)}
            videos={visibleVideos}
            onSelectVideo={handleSelectVideoFromGrid}
            onToggleFollow={handleToggleFollow}
            onOpenMessenger={handleOpenMessengerWithCreator}
            onNavigate={handleNavigate}
            onResetToOwnProfile={() => setViewedProfileId(CURRENT_USER.id)}
            unreadNotifications={unreadNotifications}
          />
        )}

        {activeScreen === 'messenger' && (
          <MessengerView
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => {
              setSelectedConversationId(id);
              setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            onSendMessage={handleSendDirectMessage}
            onBlockCreator={handleBlockCreator}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'adnow' && (
          <AdNowStudio
            campaigns={campaigns}
            videos={visibleVideos}
            preselectedVideoId={adPreselectedVideoId}
            onCreateCampaign={handleCreateCampaign}
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onMarkAllRead={() =>
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            }
            onSelectNotification={handleSelectNotification}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsView
            settings={privacySettings}
            blockedCreators={creators.filter((c) => c.isBlocked)}
            onUpdateSettings={(next) =>
              setPrivacySettings((prev) => ({ ...prev, ...next }))
            }
            onUnblockCreator={handleUnblockCreator}
            onBack={() => setActiveScreen('home')}
          />
        )}
      </main>

      {/* Mobile 5-Icon Bottom Navigation Bar */}
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        unreadNotifications={unreadNotifications}
      />

      {/* Interactive Drawers & Modals */}
      <CommentsDrawer
        video={activeCommentsVideo}
        isOpen={Boolean(activeCommentsVideo)}
        onClose={() => setCommentsVideoId(null)}
        onAddComment={handleAddComment}
        onToggleCommentLike={handleToggleCommentLike}
      />

      <ShareSheet
        video={activeShareVideo}
        conversations={conversations}
        isOpen={Boolean(activeShareVideo)}
        onClose={() => setShareVideoId(null)}
        onShareToFriend={handleShareToFriend}
        onToggleSave={handleToggleSave}
        onPromoteVideo={handlePromoteVideo}
        onOpenReport={(v) => setReportVideoId(v.id)}
      />

      <ReportBlockModal
        video={activeReportVideo}
        isOpen={Boolean(activeReportVideo)}
        onClose={() => setReportVideoId(null)}
        onSubmitReport={handleSubmitReport}
      />
    </div>
  );
}
