
'use client';

import {
  Paperclip,
  Send,
  Smile,
  Vote,
  Sparkles,
  Lightbulb,
  PlusCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { stickerGifData } from '@/lib/sticker-gif-data';
import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Message, MessageType, PollData } from '../r-chat-page';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { answerQuestionsWithAI } from '@/ai/flows/answer-questions-with-ai';

type ChatInputProps = {
  channelName: string;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setIsPollModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function ChatInput({ channelName, setMessages, setIsPollModalOpen }: ChatInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = useCallback(
    (overrideContent?: string, type: MessageType = 'text', pollData?: PollData) => {
      const content = overrideContent || newMessage;
      if (content.trim() === '') return;

      const messageToSend: Message = {
        id: Date.now(),
        sender: 'me',
        type,
        content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        read: false,
        replyTo: null,
        ...(pollData && { pollData }),
      };

      setMessages((prev) => [...prev, messageToSend]);
      setNewMessage('');
    },
    [newMessage, setMessages]
  );
  
  const handleSendMedia = (url: string, type: MessageType = 'image') => {
     const newMediaMessage: Message = {
      id: Date.now(),
      sender: 'me',
      type: type,
      content: url,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      replyTo: null,
     };
     setMessages((prev) => [...prev, newMediaMessage]);
  };

  const handleAiEdit = async () => {
    if (!newMessage.trim()) return;
    toast({ title: 'AI Improving Text...', description: 'Please wait a moment.' });
    try {
      const result = await answerQuestionsWithAI({ prompt:
        `Rewrite this message to be more clear and professional: "${newMessage}"`,
        model: 'L1',
      });
      setNewMessage(result);
      toast({
        title: 'Text Improved!',
        description: 'Your message has been enhanced by AI.',
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'AI improvement failed.',
      });
    }
  };

  const handleIcebreaker = async () => {
    setNewMessage('');
    toast({
      title: 'Generating Icebreaker...',
      description: 'LIBRA AI is thinking of a fun question.',
    });
    try {
      const result = await answerQuestionsWithAI({
        prompt: `Generate one short, fun, and quirky icebreaker question.`,
        model: 'L1',
      });
      setNewMessage(result);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate icebreaker.',
      });
    }
  };


  return (
    <div className="p-4 border-t bg-card flex-shrink-0">
      <div className="relative bg-muted rounded-lg">
         <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Attach File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        <Input
          placeholder={`Message #${channelName}`}
          className="pl-12 pr-28 h-12 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsPollModalOpen(true)}>
                  <Vote className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Create Poll</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleAiEdit}>
                  <Sparkles className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Improve (AI)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Smile />
              </Button>
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
                      {stickerGifData.stickers.map((sticker) => (
                        <Button
                          key={sticker.id}
                          variant="ghost"
                          className="h-auto p-1"
                          onClick={() => handleSendMedia(sticker.url)}
                        >
                          <Image
                            src={sticker.url}
                            alt={sticker.alt}
                            width={60}
                            height={60}
                          />
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="gifs">
                  <ScrollArea className="h-48">
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {stickerGifData.gifs.map((gif) => (
                        <Button
                          key={gif.id}
                          variant="ghost"
                          className="h-auto p-1 aspect-square"
                          onClick={() => handleSendMedia(gif.url)}
                        >
                          <Image
                            src={gif.url}
                            alt={gif.alt}
                            width={80}
                            height={80}
                            unoptimized
                            className="object-cover w-full h-full rounded"
                          />
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
