
'use client';

import {
  Bot,
  MessageCircle,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChatHeader } from './r-chat/chat-header';
import { ChatMessages } from './r-chat/chat-messages';
import { ChatInput } from './r-chat/chat-input';
import { RealmsSidebar } from './r-chat/realms-sidebar';
import { ChannelsPanel } from './r-chat/channels-panel';
import { PollCreator } from './r-chat/poll-creator';
import { MembersPanel } from './r-chat/members-panel';
import { FriendsPanel } from './r-chat/friends-panel';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const realms = [
  { id: 'me', name: 'Home', icon: <MessageCircle /> },
  { id: 'r1', name: 'R&T Community Hub', icon: <Users /> },
  { id: 'r2', name: 'AI Assistants & Bots', icon: <Bot /> },
];

export const channelsByRealm: Record<
  string,
  { name: string; type: 'text' | 'voice'; description: string; }[]
> = {
  me: [],
  r1: [
    { name: 'general-chat', type: 'text', description: 'The main channel for R&T Community Hub' },
    { name: 'announcements', type: 'text', description: 'Official announcements and updates' },
    { name: 'study-resources', type: 'text', description: 'Share and find study materials' },
    { name: 'General Voice', type: 'voice', description: 'Voice chat for general discussion' },
    { name: 'Study Session', type: 'voice', description: 'Focused group study sessions' },
  ],
  r2: [
    { name: 'libra-ai-chat', type: 'text', description: 'Chat with the main AI assistant' },
    { name: 'bot-commands', type: 'text', description: 'Use bot commands here' },
    { name: 'AI Voice Support', type: 'voice', description: 'Voice chat with AI support' },
  ],
};

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-2');

export const directMessages = [
    { id: 'dm1', name: 'RI-YYYY', avatarUrl: userAvatar?.imageUrl, status: 'Online' },
    { id: 'dm2', name: 'RI-ZZZZ', avatarUrl: userAvatar?.imageUrl, status: 'Idle' },
];

export type Sender = 'me' | 'other';
export type MessageType = 'text' | 'image' | 'voice' | 'file' | 'poll';

export type PollData = {
  question: string;
  options: { text: string; votes: number }[];
};
export type Message = {
  id: number;
  sender: Sender;
  senderName?: string;
  avatarUrl?: string;
  type: MessageType;
  content: string;
  duration?: string;
  timestamp: string;
  read: boolean;
  replyTo?: Message | null;
  pollData?: PollData;
};

const initialMessages: Message[] = [
    {
    id: 1,
    sender: 'other',
    senderName: 'LIBRA AI',
    type: 'text',
    content: "Welcome to the #general-chat channel! Feel free to ask questions, share resources, or just chat with fellow aspirants. How's everyone's prep going today?",
    timestamp: '2024-07-29T10:00:00Z',
    read: true,
  },
  {
    id: 2,
    sender: 'me',
    type: 'text',
    content: "Hey everyone! I'm struggling a bit with Data Interpretation questions. Any good resources or tips?",
    timestamp: '2024-07-29T10:02:00Z',
    read: true,
  },
];

export const members = [
    { id: 'u1', name: 'RI-XXXX', role: 'Online', status: 'Online', avatarUrl: userAvatar?.imageUrl ?? '' },
    { id: 'u2', name: 'RI-YYYY', role: 'Online', status: 'Online', avatarUrl: userAvatar?.imageUrl ?? '' },
    { id: 'u3', name: 'RI-ZZZZ', role: 'Online', status: 'Idle', avatarUrl: userAvatar?.imageUrl ?? '' },
    { id: 'u4', name: 'RI-AAAA', role: 'Offline', status: 'Offline', avatarUrl: userAvatar?.imageUrl ?? '' },
    { id: 'u5', name: 'RI-BBBB', role: 'Offline', status: 'Offline', avatarUrl: userAvatar?.imageUrl ?? '' },
];


export function RChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeRealm, setActiveRealm] = useState(realms[1]);
  const [activeChannel, setActiveChannel] = useState<typeof channelsByRealm.r1[0] | null>(channelsByRealm.r1[0]);
  const [activeDM, setActiveDM] = useState<typeof directMessages[0] | null>(null);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [mobileChannelsOpen, setMobileChannelsOpen] = useState(false);
  const [membersPanelOpen, setMembersPanelOpen] = useState(true);

  const handleSelectRealm = (realm: typeof realms[0]) => {
    setActiveRealm(realm);
    setActiveChannel(realm.id === 'me' ? null : channelsByRealm[realm.id]?.[0] ?? null);
    setActiveDM(null);
  };

  const handleSelectChannel = (channel: (typeof channelsByRealm.r1)[0]) => {
    setActiveChannel(channel);
    setActiveDM(null);
    setMobileChannelsOpen(false);
  };

  const handleSelectDM = (dm: typeof directMessages[0]) => {
    setActiveDM(dm);
    setActiveChannel(null);
    setActiveRealm(realms.find(r => r.id === 'me')!);
    setMobileChannelsOpen(false);
  };
  
  const handleSelectFriends = () => {
    setActiveDM(null);
    setActiveChannel(null);
    setActiveRealm(realms.find(r => r.id === 'me')!);
  }

  const activeConversationName = activeDM ? activeDM.name : (activeChannel ? activeChannel.name : "Friends");
  const activeConversationDescription = activeDM ? `This is the beginning of your direct message history with ${activeDM.name}.` : (activeChannel ? activeChannel.description : "Manage your friends and direct messages.");
  const activeConversationType = activeDM ? 'dm' : activeChannel?.type;

  const showFriendsPanel = activeRealm.id === 'me' && !activeDM;

  return (
    <Dialog open={isPollModalOpen} onOpenChange={setIsPollModalOpen}>
      <div className="flex h-[calc(100vh-100px)] lg:h-[calc(100vh-140px)] gap-0 bg-background text-card-foreground rounded-xl overflow-hidden border">
        <RealmsSidebar
          realms={realms}
          activeRealm={activeRealm}
          onSelectRealm={handleSelectRealm}
        />

        <Sheet open={mobileChannelsOpen} onOpenChange={setMobileChannelsOpen}>
            <SheetContent side="left" className="p-0 w-[260px] bg-muted/80 backdrop-blur-sm border-r-0">
                 <ChannelsPanel
                    activeRealm={activeRealm}
                    activeChannel={activeChannel}
                    activeDM={activeDM}
                    onSelectChannel={handleSelectChannel}
                    onSelectDM={handleSelectDM}
                    onSelectFriends={handleSelectFriends}
                />
            </SheetContent>
        </Sheet>
        
        <div className="hidden md:flex md:w-[240px] flex-col">
            <ChannelsPanel
                activeRealm={activeRealm}
                activeChannel={activeChannel}
                activeDM={activeDM}
                onSelectChannel={handleSelectChannel}
                onSelectDM={handleSelectDM}
                onSelectFriends={handleSelectFriends}
            />
        </div>

        {showFriendsPanel ? (
          <FriendsPanel />
        ) : (
          <div className="flex-1 flex flex-col min-w-0 bg-card">
              <ChatHeader
                  name={activeConversationName}
                  description={activeConversationDescription}
                  type={activeConversationType}
                  onToggleChannels={() => setMobileChannelsOpen(true)}
                  onToggleMembers={() => setMembersPanelOpen(!membersPanelOpen)}
                  membersPanelOpen={membersPanelOpen}
              />
              <div className="flex-1 flex min-h-0">
                  <div className="flex-1 flex flex-col">
                      <ChatMessages messages={messages} setMessages={setMessages} />
                      <ChatInput
                          channelName={activeConversationName}
                          messages={messages}
                          setMessages={setMessages}
                          setIsPollModalOpen={setIsPollModalOpen}
                      />
                  </div>
                  <div className={cn("hidden lg:block w-[240px] border-l bg-muted/40 transition-all duration-300", membersPanelOpen ? "w-[240px]" : "w-0")}>
                      {membersPanelOpen && <MembersPanel members={members} />}
                  </div>
              </div>
          </div>
        )}

        <PollCreator
          setMessages={setMessages}
          setIsPollModalOpen={setIsPollModalOpen}
        />
      </div>
    </Dialog>
  );
}
