
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
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { Bot, CheckCheck, CircleUser, MessageSquare, Pencil, Pin, Play, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Message, PollData } from '../r-chat-page';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

type MessageBubbleProps = {
    message: Message & { edited?: boolean };
    onEdit: (id: number, content: string) => void;
    onDelete: (id: number) => void;
    onReply: (message: Message) => void;
    isFirstInGroup: boolean;
    isLastInGroup: boolean;
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
);

const PollMessageBubble = ({ pollData }: { pollData: PollData }) => {
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">{pollData.question}</h4>
      <RadioGroup>
        {pollData.options.map((option, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span>{option.text}</span>
              <span>
                {totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="relative h-6 w-full rounded-md bg-background/30 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-400/50"
                style={{
                  width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center px-2">
                <RadioGroupItem value={option.text} id={`poll-opt-${index}`} />
                <Label htmlFor={`poll-opt-${index}`} className="ml-2 cursor-pointer">{option.text}</Label>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
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
                    'flex items-end gap-3 group relative',
                    isFirstInGroup && 'mt-4',
                    !isFirstInGroup && 'pt-0.5',
                    message.sender === 'me' ? 'justify-end' : ''
                  )}
                >
                  {message.sender === 'other' && (
                     <div className="w-9 h-9 flex-shrink-0">
                      {isLastInGroup && (
                        <Avatar>
                          <AvatarFallback>
                            <Bot />
                          </AvatarFallback>
                        </Avatar>
                      )}
                     </div>
                  )}
                  <div
                    className={cn(
                      'flex flex-col gap-1',
                      message.sender === 'me' ? 'items-end' : 'items-start'
                    )}
                  >
                    {isFirstInGroup && (
                        <div className="flex items-center gap-2">
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
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted',
                        isFirstInGroup && !isLastInGroup && (message.sender === 'me' ? 'rounded-t-lg rounded-bl-lg' : 'rounded-t-lg rounded-br-lg'),
                        !isFirstInGroup && !isLastInGroup && (message.sender === 'me' ? 'rounded-l-lg' : 'rounded-r-lg'),
                        !isFirstInGroup && isLastInGroup && (message.sender === 'me' ? 'rounded-b-none rounded-l-lg' : 'rounded-b-none rounded-r-lg'),
                        isLastInGroup && (message.sender === 'me' ? 'rounded-b-lg' : 'rounded-b-lg'),
                        isFirstInGroup && isLastInGroup && 'rounded-lg',
                        message.type === 'voice' && '!p-2',
                         message.type === 'image' && '!p-0 overflow-hidden',
                      )}
                    >
                      {message.type === 'text' && <p>{message.content}</p>}
                      {message.type === 'image' && (
                        <Image
                          src={message.content}
                          alt="media content"
                          width={300}
                          height={200}
                          className="object-cover"
                        />
                      )}
                      {message.type === 'voice' && message.duration && (
                        <VoiceMessageBubble duration={message.duration} />
                      )}
                      {message.type === 'poll' && message.pollData && (
                        <PollMessageBubble pollData={message.pollData} />
                      )}
                       {message.edited && <span className="text-xs text-muted-foreground/60 ml-2">(edited)</span>}
                    </div>
                  </div>
                  {message.sender === 'me' && (
                     <div className="w-9 h-9 flex-shrink-0 flex items-end">
                      {isLastInGroup && (
                         <Avatar>
                          <AvatarFallback>
                            <CircleUser />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}

                   {/* Timestamp on hover */}
                  {!isFirstInGroup && (
                     <div className={cn("absolute top-1/2 -translate-y-1/2 hidden group-hover:block text-xs text-muted-foreground pr-2 w-12 text-right", message.sender === 'me' ? 'left-0' : 'right-0 -translate-x-full')}>
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
                <Separator />
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
