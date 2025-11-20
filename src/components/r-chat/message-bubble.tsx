
'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { Bot, CheckCheck, CircleUser, MessageSquare, Pencil, Pin, Play, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Message, PollData } from '../r-chat-page';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

type MessageBubbleProps = {
    message: Message & { edited?: boolean };
    onEdit: (id: number, content: string) => void;
    onDelete: (id: number) => void;
    onReply: (message: Message) => void;
    isFirstInGroup: boolean;
    isLastInGroup: boolean;
}

const VoiceMessageBubble = ({ duration }: { duration: string }) => (
  <div className="flex items-center gap-2 p-2 rounded-lg bg-black/10 dark:bg-white/10 max-w-xs">
    <Button size="icon" className="h-8 w-8 rounded-full flex-shrink-0">
      <Play className="h-4 w-4" />
    </Button>
    <div className="w-40 h-1 bg-black/20 dark:bg-white/20 rounded-full">
      <div className="w-1/3 h-full bg-current rounded-full" />
    </div>
    <span className="text-xs">{duration}</span>
  </div>
);

const PollMessageBubble = ({ pollData }: { pollData: PollData }) => {
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);
  return (
    <div className="space-y-3 min-w-[250px]">
      <h4 className="font-semibold">{pollData.question}</h4>
      <div className="space-y-2">
        {pollData.options.map((option, index) => (
          <div key={index} className="space-y-1">
             <Button variant="outline" className="w-full justify-start relative h-auto p-0 border-primary/20 bg-primary/5 hover:bg-primary/10">
                <div
                    className="absolute top-0 left-0 h-full bg-primary/20 dark:bg-primary/30 transition-all duration-300 rounded-md"
                    style={{
                    width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`,
                    }}
                />
                <div className="relative z-10 flex items-center justify-between w-full p-2 text-sm">
                    <span className="font-medium">{option.text}</span>
                    <span className="font-mono text-xs">
                        {totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(0) : 0}%
                    </span>
                </div>
            </Button>
          </div>
        ))}
      </div>
      <p className="text-xs text-right text-muted-foreground/80">
        {totalVotes} votes
      </p>
    </div>
  );
};


export function MessageBubble({ message, onEdit, onDelete, onReply, isFirstInGroup, isLastInGroup }: MessageBubbleProps) {
    const formattedTimestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
         <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className={cn(
                    'flex items-start gap-3 group relative',
                    isFirstInGroup ? 'mt-4' : 'mt-1',
                    message.sender === 'me' ? 'justify-end' : ''
                  )}
                >
                  {message.sender === 'other' && (
                     <div className="w-8 h-8 flex-shrink-0">
                      {isLastInGroup ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Bot />
                          </AvatarFallback>
                        </Avatar>
                      ) : <div className="w-8"/>}
                     </div>
                  )}
                  <div
                    className={cn(
                      'flex flex-col gap-0.5',
                      message.sender === 'me' ? 'items-end' : 'items-start'
                    )}
                  >
                    {isFirstInGroup && (
                        <div className={cn("flex items-baseline gap-2", message.sender === 'me' && 'flex-row-reverse')}>
                            <span className="font-semibold text-sm">
                                {message.sender === 'me' ? 'RI-XXXX' : 'LIBRA AI'}
                            </span>
                             <span className="text-xs text-muted-foreground">{formattedTimestamp}</span>
                        </div>
                    )}
                    {message.replyTo && (
                      <div className="text-xs text-muted-foreground italic bg-muted/50 px-2 py-1 rounded-md border-l-2 border-primary">
                        Reply to: "{message.replyTo.content}"
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-md p-3 text-sm relative group',
                        message.sender === 'me'
                          ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                          : 'bg-muted',
                        isFirstInGroup ? 
                            (message.sender === 'me' ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-t-2xl rounded-br-2xl') :
                            (message.sender === 'me' ? 'rounded-l-2xl' : 'rounded-r-2xl'),
                        isLastInGroup && (message.sender === 'me' ? 'rounded-b-2xl' : 'rounded-b-2xl'),
                        
                        message.type === 'voice' && '!p-2',
                         message.type === 'image' && '!p-0 overflow-hidden',
                      )}
                    >
                      {message.type === 'text' && <p className="whitespace-pre-wrap">{message.content}</p>}
                      {message.type === 'image' && (
                        <Image
                          src={message.content}
                          alt="media content"
                          width={300}
                          height={200}
                          unoptimized
                          className="object-cover"
                        />
                      )}
                      {message.type === 'voice' && message.duration && (
                        <VoiceMessageBubble duration={message.duration} />
                      )}
                      {message.type === 'poll' && message.pollData && (
                        <PollMessageBubble pollData={message.pollData} />
                      )}
                       {message.edited && <span className="text-xs opacity-70 ml-2">(edited)</span>}
                    </div>
                  </div>
                  {message.sender === 'me' && (
                     <div className="w-8 h-8 flex-shrink-0 flex items-end">
                      {isLastInGroup && (
                         <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <CircleUser />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}

                   {/* Timestamp on hover */}
                  {!isFirstInGroup && (
                     <div className={cn("absolute top-1/2 -translate-y-1/2 hidden group-hover:block text-xs text-muted-foreground pr-2 w-16 text-right", message.sender === 'me' ? 'left-0 -translate-x-full' : 'right-0 translate-x-full')}>
                        {formattedTimestamp}
                     </div>
                  )}
                  {message.sender === 'me' && isLastInGroup && (
                    <div className="absolute right-10 -bottom-1 text-xs text-muted-foreground pl-2">
                       <CheckCheck
                          className={cn(
                            'h-4 w-4',
                            message.read ? 'text-blue-400' : 'text-muted-foreground'
                          )}
                        />
                    </div>
                  )}

                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onReply(message)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reply
                </ContextMenuItem>
                <ContextMenuItem>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin Message
                </ContextMenuItem>
                <ContextMenuSeparator />
                {message.sender === 'me' && message.type === 'text' && (
                  <ContextMenuItem onClick={() => {
                    const newContent = prompt("Edit message:", message.content);
                    if (newContent) onEdit(message.id, newContent);
                  }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </ContextMenuItem>
                )}
                <ContextMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Forward
                </ContextMenuItem>
                {message.sender === 'me' && (
                  <ContextMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(message.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </ContextMenuItem>
                )}
              </ContextMenuContent>
            </ContextMenu>
    )
}
