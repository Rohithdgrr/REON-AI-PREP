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
  User,
  Smile,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { stickerGifData } from '@/lib/sticker-gif-data';
import { cn } from '@/lib/utils';

const contacts = [
  {
    name: 'AI Study Group',
    lastMessage: "Let's review the quant chapter.",
    avatarId: 'group-avatar',
    isGroup: true,
  },
  { name: 'Anil Kumar', lastMessage: 'Got it, thanks!', avatarId: 'user-avatar-2' },
  { name: 'Priya Sharma', lastMessage: 'See you tomorrow.', avatarId: 'user-avatar-3' },
];

const initialMessages = [
  { sender: 'other', type: 'text', content: 'Hey! Are you ready for the mock test tomorrow?' },
  { sender: 'me', type: 'text', content: 'Almost. Just revising the reasoning part. You?' },
  { sender: 'other', type: 'text', content: 'Same here. That new puzzle type is tricky.' },
];

type Message = {
  sender: 'me' | 'other';
  type: 'text' | 'image';
  content: string;
}

export function RChatPage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMessages: Message[] = [...messages, { sender: 'me', type: 'text', content: newMessage }];
    setMessages(newMessages);
    setNewMessage('');

    // Simulate a reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'other', type: 'text', content: 'Got it!' }]);
      audioRef.current?.play();
    }, 1000);
  };

  const handleSendMedia = (url: string) => {
     const newMessages: Message[] = [...messages, { sender: 'me', type: 'image', content: url }];
     setMessages(newMessages);

     // Simulate a reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'other', type: 'text', content: 'Nice one!' }]);
      audioRef.current?.play();
    }, 1000);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-100px)] gap-4">
      <audio ref={audioRef} src="/audio/notification.mp3" preload="auto" />
      {/* Contacts List */}
      <Card className="col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>R-Chat</CardTitle>
          <CardDescription>Your conversations.</CardDescription>
          <Input placeholder="Search contacts..." className="mt-2" />
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-2">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {contacts.map((contact) => (
                <Button
                  key={contact.name}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                >
                  <Avatar className="mr-3">
                    {contact.isGroup ? (
                        <AvatarFallback><Bot /></AvatarFallback>
                    ) : (
                        <AvatarFallback><User /></AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">{contact.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {contact.lastMessage}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
        <CardHeader className="flex flex-row items-center gap-3 border-b">
          <Avatar>
            <AvatarFallback><Bot /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">AI Study Group</CardTitle>
            <CardDescription>3 members online</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-end gap-2 group',
                    message.sender === 'me' ? 'justify-end' : ''
                  )}
                >
                  {message.sender === 'other' && (
                   <Avatar className="h-8 w-8">
                     <AvatarFallback><Bot /></AvatarFallback>
                   </Avatar>
                  )}
                  <div
                    className={cn(
                        'max-w-xs rounded-lg p-2 transition-all duration-200 group-hover:scale-105',
                        message.type === 'text' && 'p-3',
                        message.sender === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.type === 'text' ? (
                        <p>{message.content}</p>
                    ) : (
                        <Image src={message.content} alt="media content" width={150} height={150} unoptimized className="rounded-md" />
                    )}
                  </div>
                   {message.sender === 'me' && (
                   <Avatar className="h-8 w-8">
                     {userAvatar && <Image src={userAvatar.imageUrl} alt="You" width={32} height={32} className="rounded-full" />}
                     {!userAvatar && <AvatarFallback><CircleUser /></AvatarFallback>}
                   </Avatar>
                   )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t">
          <div className="relative">
            <Input 
                placeholder="Type your message..." 
                className="pr-28" 
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

              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
