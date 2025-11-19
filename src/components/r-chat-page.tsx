'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bot,
  Hash,
  Headphones,
  Plus,
  Settings,
  Phone,
  Video,
  Monitor,
  User,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
} from '@/components/ui/dialog';
import { ChatHeader } from './r-chat/chat-header';
import { ChatMessages } from './r-chat/chat-messages';
import { ChatInput } from './r-chat/chat-input';
import { RealmsSidebar } from './r-chat/realms-sidebar';
import { ChannelsPanel } from './r-chat/channels-panel';
import { PollCreator } from './r-chat/poll-creator';

export const realms = [
  { id: 'r1', name: 'R&T Community Hub', icon: '🤖' },
  { id: 'r2', name: 'Railway Aspirants', icon: '🚂' },
  { id: 'r3', name: 'Bank PO Masters', icon: '🏦' },
];

export const channelsByRealm: Record<
  string,
  { name: string; type: 'text' | 'voice' }[]
> = {
  r1: [
    { name: 'rapid-relay', type: 'text' },
    { name: 'announcements', type: 'text' },
    { name: 'resources', type: 'text' },
    { name: 'Resonant Room 1', type: 'voice' },
    { name: 'Study Session', type: 'voice' },
  ],
  r2: [
    { name: 'railway-general', type: 'text' },
    { name: 'Railway Voice', type: 'voice' },
  ],
  r3: [
    { name: 'bank-general', type: 'text' },
    { name: 'Bank Voice', type: 'voice' },
  ],
};

export const directMessages = [
  { id: 'u2', name: 'Anil Kumar', avatarId: 'user-avatar-2' },
  { id: 'u3', name: 'Priya Sharma', avatarId: 'user-avatar-3' },
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
    type: 'text',
    content: 'Hey! Are you ready for the mock test tomorrow?',
    timestamp: '10:30 AM',
    read: true,
  },
  {
    id: 2,
    sender: 'me',
    type: 'text',
    content: 'Almost. Just revising the reasoning part. You?',
    timestamp: '10:31 AM',
    read: true,
  },
  {
    id: 3,
    sender: 'other',
    type: 'text',
    content: 'Same here. That new puzzle type is tricky.',
    timestamp: '10:31 AM',
    read: true,
  },
  {
    id: 4,
    sender: 'me',
    type: 'voice',
    content: 'Just sent you a voice note about it.',
    duration: '0:15',
    timestamp: '10:32 AM',
    read: true,
  },
  {
    id: 5,
    sender: 'other',
    type: 'poll',
    content: 'Poll: What topic should we focus on next?',
    timestamp: '10:40 AM',
    read: true,
    pollData: {
      question: 'What topic should we focus on next?',
      options: [
        { text: 'Data Interpretation', votes: 5 },
        { text: 'Advanced Puzzles', votes: 8 },
        { text: 'English Grammar', votes: 2 },
      ],
    },
  },
];


export function RChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeRealm, setActiveRealm] = useState(realms[0]);
  const [activeChannel, setActiveChannel] = useState(channelsByRealm[realms[0].id][0]);
  const [activeDM, setActiveDM] = useState<typeof directMessages[0] | null>(null);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  const handleSelectRealm = (realm: typeof realms[0]) => {
    setActiveRealm(realm);
    setActiveChannel(channelsByRealm[realm.id][0]);
    setActiveDM(null);
  };

  const handleSelectChannel = (channel: typeof channelsByRealm.r1[0]) => {
    setActiveChannel(channel);
    setActiveDM(null);
  };

  const handleSelectDM = (dm: typeof directMessages[0]) => {
    setActiveDM(dm);
    // When a DM is selected, we can conceptually move out of a channel
    // or keep the last active channel in the background state.
    // For simplicity, we'll just visually highlight the DM.
  };

  const activeConversationName = activeDM ? activeDM.name : activeChannel.name;
  const activeConversationDescription = activeDM ? "Direct Message" : `The main channel for ${activeRealm.name}`;
  
  return (
    <Dialog open={isPollModalOpen} onOpenChange={setIsPollModalOpen}>
      <div className="grid grid-cols-[auto,1fr] lg:grid-cols-[auto,280px,1fr] h-[calc(100vh-100px)] gap-0 bg-card text-card-foreground rounded-xl overflow-hidden border">
        
        <RealmsSidebar
          realms={realms}
          activeRealm={activeRealm}
          onSelectRealm={handleSelectRealm}
        />

        <ChannelsPanel
          activeRealm={activeRealm}
          activeChannel={activeChannel}
          activeDM={activeDM}
          onSelectChannel={handleSelectChannel}
          onSelectDM={handleSelectDM}
        />

        <div className="flex flex-col">
          <ChatHeader
            name={activeConversationName}
            description={activeConversationDescription}
            messages={messages}
            setMessages={setMessages}
          />
          <ChatMessages messages={messages} setMessages={setMessages} />
          <ChatInput
            messages={messages}
            setMessages={setMessages}
            setIsPollModalOpen={setIsPollModalOpen}
          />
        </div>
        <PollCreator
          setMessages={setMessages}
          setIsPollModalOpen={setIsPollModalOpen}
        />
      </div>
    </Dialog>
  );
}
