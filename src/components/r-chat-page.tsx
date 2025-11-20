
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
  Vote,
  Sparkles,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChatHeader } from './r-chat/chat-header';
import { ChatMessages } from './r-chat/chat-messages';
import { ChatInput } from './r-chat/chat-input';
import { RealmsSidebar } from './r-chat/realms-sidebar';
import { ChannelsPanel } from './r-chat/channels-panel';
import { PollCreator } from './r-chat/poll-creator';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export const realms = [
  { id: 'r1', name: 'R&T Community Hub', icon: '🤖' },
  { id: 'r2', name: 'Railway Aspirants', icon: '🚂' },
  { id: 'r3', name: 'Bank PO Masters', icon: '🏦' },
];

export const channelsByRealm: Record<
  string,
  { name: string; type: 'text' | 'voice'; description: string; }[]
> = {
  r1: [
    { name: 'rapid-relay', type: 'text', description: 'The main channel for R&T Community Hub' },
    { name: 'announcements', type: 'text', description: 'Official announcements and updates' },
    { name: 'resources', type: 'text', description: 'Share and find study materials' },
    { name: 'Resonant Room 1', type: 'voice', description: 'Voice chat for general discussion' },
    { name: 'Study Session', type: 'voice', description: 'Focused group study sessions' },
  ],
  r2: [
    { name: 'railway-general', type: 'text', description: 'General chat for railway aspirants' },
    { name: 'Railway Voice', type: 'voice', description: 'Voice chat for railway exam prep' },
  ],
  r3: [
    { name: 'bank-general', type: 'text', description: 'General chat for banking aspirants' },
    { name: 'Bank Voice', type: 'voice', description: 'Voice chat for banking exam prep' },
  ],
};

export const directMessages = [
    { id: 'u2', name: 'RI-YYYY', avatarUrl: 'https://i.ibb.co/ckT3S1g/wolf-gears.png' },
    { id: 'u3', name: 'RI-ZZZZ', avatarUrl: 'https://i.ibb.co/ckT3S1g/wolf-gears.png' },
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
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    read: true,
  },
  {
    id: 2,
    sender: 'me',
    type: 'text',
    content: 'Almost. Just revising the reasoning part. You?',
    timestamp: new Date().toISOString(),
    read: true,
  },
  {
    id: 3,
    sender: 'other',
    type: 'text',
    content: 'Same here. That new puzzle type is tricky.',
    timestamp: new Date().toISOString(),
    read: true,
  },
  {
    id: 4,
    sender: 'me',
    type: 'voice',
    content: 'Just sent you a voice note about it.',
    duration: '0:15',
    timestamp: new Date().toISOString(),
    read: true,
  },
  {
    id: 5,
    sender: 'other',
    type: 'poll',
    content: 'Poll: What topic should we focus on next?',
    timestamp: new Date().toISOString(),
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
  {
    id: 6,
    sender: 'other',
    type: 'text',
    content: "Let's do some advanced puzzles then. I'll share a resource link in the resources channel.",
    timestamp: new Date().toISOString(),
    read: true,
  },
  {
    id: 7,
    sender: 'me',
    type: 'text',
    content: "Sounds good! I'm heading there now.",
    timestamp: new Date().toISOString(),
    read: true,
  },
  {
    id: 8,
    sender: 'me',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1517694712202-1428bc648c2a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    timestamp: new Date().toISOString(),
    read: false,
  }
];

export function RChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeRealm, setActiveRealm] = useState(realms[0]);
  const [activeChannel, setActiveChannel] = useState(
    channelsByRealm[realms[0].id][0]
  );
  const [activeDM, setActiveDM] = useState<typeof directMessages[0] | null>(
    null
  );
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [realmsSidebarOpen, setRealmsSidebarOpen] = useState(true);
  const [channelsPanelOpen, setChannelsPanelOpen] = useState(true);
  const [mobileChannelsOpen, setMobileChannelsOpen] = useState(false);

  const handleSelectRealm = (realm: typeof realms[0]) => {
    setActiveRealm(realm);
    setActiveChannel(channelsByRealm[realm.id][0]);
    setActiveDM(null);
  };

  const handleSelectChannel = (channel: (typeof channelsByRealm.r1)[0]) => {
    setActiveChannel(channel);
    setActiveDM(null);
    setMobileChannelsOpen(false);
  };

  const handleSelectDM = (dm: typeof directMessages[0]) => {
    setActiveDM(dm);
    setMobileChannelsOpen(false);
  };

  const activeConversationName = activeDM ? activeDM.name : activeChannel.name;
  const activeConversationDescription = activeDM
    ? 'Direct Message'
    : activeChannel.description;

  return (
    <Dialog open={isPollModalOpen} onOpenChange={setIsPollModalOpen}>
      <div className="flex h-[calc(100vh-100px)] gap-0 bg-card text-card-foreground rounded-xl overflow-hidden border">
        <RealmsSidebar
          realms={realms}
          activeRealm={activeRealm}
          onSelectRealm={handleSelectRealm}
          isOpen={realmsSidebarOpen}
          setIsOpen={setRealmsSidebarOpen}
        />

        {/* Mobile Channels Panel */}
         <Sheet open={mobileChannelsOpen} onOpenChange={setMobileChannelsOpen}>
            <SheetContent side="left" className="p-0 w-[260px]">
                 <ChannelsPanel
                    activeRealm={activeRealm}
                    activeChannel={activeChannel}
                    activeDM={activeDM}
                    onSelectChannel={handleSelectChannel}
                    onSelectDM={handleSelectDM}
                    onDoubleClick={() => setMobileChannelsOpen(false)}
                />
            </SheetContent>
        </Sheet>

        <div className={cn("grid w-full transition-all duration-300", channelsPanelOpen ? "grid-cols-1 md:grid-cols-[240px,1fr]" : "grid-cols-1 md:grid-cols-[0px,1fr]")}>
            <div className={cn("transition-all duration-300 overflow-hidden hidden md:block", channelsPanelOpen ? "w-[240px]" : "w-0")}>
              <ChannelsPanel
                  activeRealm={activeRealm}
                  activeChannel={activeChannel}
                  activeDM={activeDM}
                  onSelectChannel={handleSelectChannel}
                  onSelectDM={handleSelectDM}
                  onDoubleClick={() => setChannelsPanelOpen(false)}
              />
            </div>

            <div className="flex flex-col relative min-w-0">
              {!channelsPanelOpen && (
                <Button onClick={() => setChannelsPanelOpen(true)} variant="ghost" size="icon" className="absolute top-1/2 -left-4 -translate-y-1/2 bg-muted/80 hover:bg-muted border rounded-full h-8 w-8 z-10 hidden md:flex">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            <ChatHeader
                name={activeConversationName}
                description={activeConversationDescription}
                messages={messages}
                setMessages={setMessages}
                onToggleChannels={() => setMobileChannelsOpen(true)}
            />
            <ChatMessages messages={messages} setMessages={setMessages} />
            <ChatInput
                messages={messages}
                setMessages={setMessages}
                setIsPollModalOpen={setIsPollModalOpen}
            />
            </div>
        </div>

        <PollCreator
          setMessages={setMessages}
          setIsPollModalOpen={setIsPollModalOpen}
        />
      </div>
    </Dialog>
  );
}
