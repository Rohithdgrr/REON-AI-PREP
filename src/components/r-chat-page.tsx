
'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Bot,
  CircleUser,
  Paperclip,
  Send,
  Smile,
  Hash,
  Plus,
  Settings,
  Headphones,
  Mic,
  Play,
  Phone,
  Video,
  Monitor,
  CheckCheck,
  MessageSquare,
  Pin,
  Pencil,
  Trash2,
  X,
  Share2,
  User,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { stickerGifData } from '@/lib/sticker-gif-data';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Separator } from './ui/separator';

const realms = [
  { id: 'r1', name: 'R&T Community Hub', icon: '🤖' },
  { id: 'r2', name: 'Railway Aspirants', icon: '🚂' },
  { id: 'r3', name: 'Bank PO Masters', icon: '🏦' },
];

const channels = [
  { name: 'rapid-relay', type: 'text' },
  { name: 'announcements', type: 'text' },
  { name: 'resources', type: 'text' },
];

const voiceChannels = [
    { name: 'Resonant Room 1', members: 5 },
    { name: 'Study Session', members: 12 },
]

const directMessages = [
  { id: 'u2', name: 'Anil Kumar', avatarId: 'user-avatar-2' },
  { id: 'u3', name: 'Priya Sharma', avatarId: 'user-avatar-3' },
];

type Sender = 'me' | 'other';
type MessageType = 'text' | 'image' | 'voice' | 'file';
type Message = {
  id: number;
  sender: Sender;
  type: MessageType;
  content: string;
  duration?: string;
  timestamp: string;
  read: boolean;
  replyTo?: Message;
};

const initialMessages: Message[] = [
  { id: 1, sender: 'other', type: 'text', content: 'Hey! Are you ready for the mock test tomorrow?', timestamp: "10:30 AM", read: true },
  { id: 2, sender: 'me', type: 'text', content: 'Almost. Just revising the reasoning part. You?', timestamp: "10:31 AM", read: true },
  { id: 3, sender: 'other', type: 'text', content: 'Same here. That new puzzle type is tricky.', timestamp: "10:31 AM", read: true },
  { id: 4, sender: 'me', type: 'voice', content: 'Just sent you a voice note about it.', duration: '0:15', timestamp: "10:32 AM", read: true },
];

export function RChatPage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    let messageToSend: Message = {
      id: Date.now(),
      sender: 'me',
      type: 'text',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      ...(replyingTo && { replyTo: replyingTo }),
    };

    if (editingMessage) {
        setMessages(messages.map(m => m.id === editingMessage.id ? { ...m, content: newMessage } : m));
        setEditingMessage(null);
    } else {
        setMessages([...messages, messageToSend]);
    }
    
    setNewMessage('');
    setReplyingTo(null);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'other', type: 'text', content: 'Got it!', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: true }]);
      audioRef.current?.play();
    }, 2000);
    setTimeout(() => setMessages(prev => prev.map(m => m.id === messageToSend.id ? {...m, read: true} : m)), 3000);
  };
  
  const handleSendMedia = (url: string, type: MessageType = 'image') => {
     const newMediaMessage: Message = {
      id: Date.now(),
      sender: 'me',
      type: type,
      content: url,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
     };
     setMessages([...messages, newMediaMessage]);

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'other', type: 'text', content: 'Nice one!', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: true }]);
      audioRef.current?.play();
    }, 1000);
     setTimeout(() => setMessages(prev => prev.map(m => m.id === newMediaMessage.id ? {...m, read: true} : m)), 2000);
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
    setReplyingTo(null);
  };

  const handleDeleteMessage = (messageId: number) => {
    setMessages(messages.filter(m => m.id !== messageId));
  };
  
  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
    setEditingMessage(null);
  };

  const handlePinMessage = (message: Message) => {
    setPinnedMessage(message);
  }
  
  const VoiceMessageBubble = ({ duration }: { duration: string }) => (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-background/20 max-w-xs">
        <Button size="icon" className="h-8 w-8 rounded-full">
            <Play className="h-4 w-4" />
        </Button>
        <div className="w-40 h-1 bg-foreground/20 rounded-full">
            <div className="w-1/3 h-full bg-foreground rounded-full" />
        </div>
        <span className="text-xs">{duration}</span>
    </div>
  )

  const ReplyBar = () => (
    <div className="p-2 border-t bg-muted/50 text-xs text-muted-foreground flex justify-between items-center">
        <div>
            Replying to <strong>{replyingTo?.sender === 'me' ? 'Yourself' : 'Anil Kumar'}</strong>
            <p className="line-clamp-1 italic">"{replyingTo?.content}"</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyingTo(null)}><X className="h-4 w-4"/></Button>
    </div>
  )

  const EditBar = () => (
    <div className="p-2 border-t bg-muted/50 text-xs text-muted-foreground flex justify-between items-center">
        <p>Editing message...</p>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingMessage(null); setNewMessage(''); }}><X className="h-4 w-4"/></Button>
    </div>
  )

  return (
    <div className="grid grid-cols-[auto,1fr] lg:grid-cols-[auto,280px,1fr] h-[calc(100vh-100px)] gap-0 bg-card text-card-foreground rounded-xl overflow-hidden border">
      <audio ref={audioRef} src="/audio/notification.mp3" preload="auto" />
      
      {/* Realms Sidebar */}
      <div className="bg-muted/50 p-2 flex flex-col items-center gap-2 border-r">
          <TooltipProvider>
            {realms.map(realm => (
                <Tooltip key={realm.id}>
                    <TooltipTrigger asChild>
                         <Button variant="ghost" className="h-12 w-12 text-2xl rounded-full bg-background">
                            {realm.icon}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{realm.name}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="h-12 w-12 rounded-full border-dashed">
                        <Plus />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right"><p>Create Realm</p></TooltipContent>
             </Tooltip>
          </TooltipProvider>
      </div>

      {/* Channels & DMs Panel */}
      <div className="flex flex-col border-r bg-muted/50">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">R&T Community Hub</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
                 <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground">ROUTE CHANNELS</h4>
                 {channels.map((channel) => (
                    <Button key={channel.name} variant="ghost" className="w-full justify-start">
                        <Hash className="mr-2 h-4 w-4" /> {channel.name}
                    </Button>
                ))}
                 <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-4">RESONANT ROOMS</h4>
                 {voiceChannels.map((channel) => (
                    <Button key={channel.name} variant="ghost" className="w-full justify-start">
                        <Headphones className="mr-2 h-4 w-4" /> 
                        <span className="flex-1 text-left">{channel.name}</span>
                        <span className="text-xs text-muted-foreground">{channel.members}</span>
                    </Button>
                ))}
                <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-4">REACH DMS</h4>
                {directMessages.map((contact) => (
                    <Button key={contact.name} variant="secondary" className="w-full justify-start h-auto p-2">
                    <Avatar className="mr-2 h-8 w-8">
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">{contact.name}</span>
                    </Button>
                ))}
            </div>
        </ScrollArea>
         <div className="p-2 border-t mt-auto bg-background/50">
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} />}
                    <AvatarFallback><CircleUser /></AvatarFallback>
                </Avatar>
                <div className="text-sm">
                    <p className="font-semibold">Srinivas Reddy</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                </div>
                 <div className="ml-auto flex items-center">
                    <Button variant="ghost" size="icon"><Mic className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Headphones className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                </div>
            </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col">
        <CardHeader className="flex flex-col gap-2 border-b p-4">
          <div className="flex flex-row items-center gap-3">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">rapid-relay</CardTitle>
              <CardDescription className="text-xs">The main channel for all community discussions.</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4"/></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4"/></Button>
              <Button variant="ghost" size="icon"><Monitor className="h-4 w-4"/></Button>
            </div>
          </div>
          {pinnedMessage && (
            <div className="p-2 bg-muted rounded-md text-xs flex items-center gap-2">
                <Pin className="h-4 w-4 text-primary" />
                <span className="font-semibold">Pinned:</span>
                <span className="line-clamp-1 flex-1">{pinnedMessage.content}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPinnedMessage(null)}><X className="h-4 w-4"/></Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <ContextMenu key={message.id}>
                  <ContextMenuTrigger>
                    <div className={cn('flex items-start gap-3 group', message.sender === 'me' ? 'justify-end' : '')}>
                      {message.sender === 'other' && (
                       <Avatar className="h-9 w-9">
                         <AvatarFallback><Bot /></AvatarFallback>
                       </Avatar>
                      )}
                      <div className={cn('flex flex-col gap-1', message.sender === 'me' ? 'items-end' : 'items-start')}>
                         {message.replyTo && (
                            <div className="text-xs text-muted-foreground italic bg-muted/50 px-2 py-1 rounded-md border-l-2 border-primary">
                                Reply to: "{message.replyTo.content}"
                            </div>
                         )}
                         <div className={cn(
                            'max-w-md rounded-lg p-3 text-sm relative group',
                            message.type === 'voice' && '!p-2',
                            message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                         )}>
                            {message.type === 'text' && <p>{message.content}</p>}
                            {message.type === 'image' && <Image src={message.content} alt="media content" width={200} height={200} unoptimized className="rounded-md" />}
                            {message.type === 'voice' && message.duration && <VoiceMessageBubble duration={message.duration} />}
                            <div className="absolute -bottom-2 right-2 text-xs flex items-center gap-1">
                                <span>{message.timestamp}</span>
                                {message.sender === 'me' && <CheckCheck className={cn("h-4 w-4", message.read ? "text-blue-400" : "text-muted-foreground")} />}
                            </div>
                        </div>
                      </div>
                       {message.sender === 'me' && (
                       <Avatar className="h-9 w-9">
                         {userAvatar && <Image src={userAvatar.imageUrl} alt="You" width={36} height={36} className="rounded-full" />}
                         {!userAvatar && <AvatarFallback><CircleUser /></AvatarFallback>}
                       </Avatar>
                       )}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleReplyToMessage(message)}><MessageSquare className="mr-2 h-4 w-4" />Reply</ContextMenuItem>
                    <ContextMenuItem onClick={() => handlePinMessage(message)}><Pin className="mr-2 h-4 w-4" />Pin Message</ContextMenuItem>
                    <Separator />
                    {message.sender === 'me' && <ContextMenuItem onClick={() => handleEditMessage(message)}><Pencil className="mr-2 h-4 w-4" />Edit</ContextMenuItem>}
                    <ContextMenuItem><Share2 className="mr-2 h-4 w-4" />Forward</ContextMenuItem>
                    <ContextMenuItem className="text-destructive" onClick={() => handleDeleteMessage(message.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
              {isTyping && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-9 w-9">
                         <AvatarFallback><Bot /></AvatarFallback>
                       </Avatar>
                      <span>typing...</span>
                  </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t bg-background">
          {(replyingTo || editingMessage) && (
            replyingTo ? <ReplyBar /> : <EditBar />
          )}
          <div className="relative">
            <Button variant="ghost" size="icon" className="absolute left-1 top-1/2 -translate-y-1/2">
                <Paperclip className="h-5 w-5" />
            </Button>
            <Input 
                placeholder="Type in #rapid-relay..." 
                className="pl-12 pr-28 h-12 text-base" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
               <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon"><Smile /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <Tabs defaultValue="stickers">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="stickers">Stickers</TabsTrigger>
                                <TabsTrigger value="gifs">GIFs</TabsTrigger>
                            </TabsList>
                            <TabsContent value="stickers">
                                <ScrollArea className="h-48">
                                <div className="grid grid-cols-4 gap-2 p-2">
                                    {stickerGifData.stickers.map(sticker => (
                                        <Button key={sticker.id} variant="ghost" className="h-auto p-1" onClick={() => handleSendMedia(sticker.url)}>
                                            <Image src={sticker.url} alt={sticker.alt} width={60} height={60} />
                                        </Button>
                                    ))}
                                </div>
                                </ScrollArea>
                            </TabsContent>
                            <TabsContent value="gifs">
                                 <ScrollArea className="h-48">
                                <div className="grid grid-cols-3 gap-2 p-2">
                                    {stickerGifData.gifs.map(gif => (
                                        <Button key={gif.id} variant="ghost" className="h-auto p-1 aspect-square" onClick={() => handleSendMedia(gif.url)}>
                                            <Image src={gif.url} alt={gif.alt} width={80} height={80} unoptimized className="object-cover w-full h-full rounded" />
                                        </Button>
                                    ))}
                                </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </PopoverContent>
                </Popover>

              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
