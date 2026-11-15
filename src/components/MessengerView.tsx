import React, { useState } from 'react';
import {
  Search,
  Send,
  ArrowLeft,
  Ban,
  Film,
} from 'lucide-react';
import { Conversation } from '../types';
import { SafeImage } from './SafeImage';

interface MessengerViewProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onBlockCreator: (creatorId: string) => void;
  onBack: () => void;
}

export const MessengerView: React.FC<MessengerViewProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onSendMessage,
  onBlockCreator,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(
    Boolean(selectedConversationId)
  );

  const filteredConvs = conversations.filter(
    (c) =>
      c.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeConv =
    conversations.find((c) => c.id === selectedConversationId) ||
    conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !draft.trim()) return;
    onSendMessage(activeConv.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="flex-1 h-[calc(100dvh-4rem)] lg:h-screen flex flex-col lg:flex-row max-w-6xl mx-auto w-full lg:py-6 lg:px-8 gap-0 lg:gap-5">
      {/* Left Conversation List */}
      <aside
        className={`${
          mobileShowThread ? 'hidden lg:flex' : 'flex'
        } flex-col w-full lg:w-80 shrink-0 h-full bg-[#0D1017] lg:border lg:border-white/[0.08] lg:rounded-3xl overflow-hidden`}
      >
        <header className="px-5 py-4 border-b border-white/[0.07] space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to feed"
              className="lg:hidden min-h-[40px] min-w-[40px] rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-xl font-bold text-white">
              Messenger
            </h1>
          </div>

          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search direct messages..."
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.05]">
          {filteredConvs.map((conv) => {
            const isSelected = activeConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => {
                  onSelectConversation(conv.id);
                  setMobileShowThread(true);
                }}
                className={`w-full px-4 py-3.5 flex items-center gap-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-purple-500/15'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="relative shrink-0">
                  <SafeImage
                    src={conv.avatar}
                    alt={conv.displayName}
                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                  />
                  {conv.online && (
                    <span
                      title="Online"
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0D1017]"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {conv.displayName}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono-num shrink-0">
                      {conv.lastTimestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-sky-500 text-[11px] font-bold text-slate-950 flex items-center justify-center font-mono-num">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Active Chat Thread */}
      <section
        className={`${
          mobileShowThread ? 'flex' : 'hidden lg:flex'
        } flex-1 flex-col h-full bg-[#0D1017] lg:border lg:border-white/[0.08] lg:rounded-3xl overflow-hidden`}
      >
        {activeConv ? (
          <>
            <header className="px-5 py-3.5 border-b border-white/[0.07] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileShowThread(false)}
                  aria-label="Back to conversations"
                  className="lg:hidden min-h-[40px] min-w-[40px] rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <SafeImage
                  src={activeConv.avatar}
                  alt={activeConv.displayName}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-white truncate">
                    {activeConv.displayName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    @{activeConv.username} ·{' '}
                    {activeConv.online ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onBlockCreator(activeConv.creatorId)}
                className="min-h-[38px] px-3 rounded-xl bg-white/[0.05] hover:bg-rose-500/15 text-xs font-medium text-slate-300 hover:text-rose-300 flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Block</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
              {activeConv.messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isMe ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-br-md'
                          : 'bg-white/[0.07] text-slate-100 rounded-bl-md'
                      }`}
                    >
                      {msg.sharedVideoTitle && (
                        <div className="flex items-center gap-1.5 text-xs text-sky-200 mb-1 pb-1 border-b border-white/15">
                          <Film className="w-3.5 h-3.5" />
                          <span>Shared Reel: {msg.sharedVideoTitle}</span>
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono-num">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-white/[0.07] bg-[#090B11] flex items-center gap-2.5"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message @${activeConv.username}...`}
                className="flex-1 h-11 px-4 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
                className="min-h-[44px] min-w-[44px] px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white flex items-center justify-center disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
            Select a conversation to begin messaging.
          </div>
        )}
      </section>
    </div>
  );
};
