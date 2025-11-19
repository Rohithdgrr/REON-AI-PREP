
'use client';
import { CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Message } from '../r-chat-page';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { MessageBubble } from './message-bubble';
import { Bot } from 'lucide-react';
import { Separator } from '../ui/separator';

type ChatMessagesProps = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

export function ChatMessages({ messages, setMessages }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(true);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const typingTimeout = setTimeout(() => setIsTyping(false), 3000);
    return () => clearTimeout(typingTimeout);
  }, []);

  const handleEditMessage = (messageId: number, newContent: string) => {
    setMessages(
      messages.map((m) =>
        m.id === messageId ? { ...m, content: newContent } : m
      )
    );
  };

  const handleDeleteMessage = (messageId: number) => {
    setMessages(messages.filter((m) => m.id !== messageId));
  };

  return (
    <CardContent className="flex-1 overflow-hidden p-0">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="p-4 space-y-1">
          {messages.map((message, index) => {
            const previousMessage = messages[index - 1];
            const showAvatar =
              !previousMessage || previousMessage.sender !== message.sender;

            const isNewDay =
              !previousMessage ||
              new Date(message.timestamp).toDateString() !==
                new Date(previousMessage.timestamp).toDateString();

            return (
              <>
                {isNewDay && (
                   <Separator className="my-4">
                      <span className="px-2 bg-background text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                   </Separator>
                )}
                <MessageBubble
                  key={message.id}
                  message={message}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  showAvatar={showAvatar}
                />
              </>
            );
          })}
          {isTyping && (
            <div className="flex items-end gap-3 text-sm text-muted-foreground animate-pulse pt-4">
              <div className="w-9 h-9 flex items-center justify-center">
                <Bot />
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </CardContent>
  );
}
