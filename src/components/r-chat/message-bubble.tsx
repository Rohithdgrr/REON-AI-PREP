
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
    message: Message;
    onEdit: (id: number, content: string) => void;
    onDelete: (id: number) => void;
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
            <div className="relative h-6 w-full rounded-full bg-background/30">
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-blue-400"
                style={{
                  width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center px-2">
                <RadioGroupItem value={option.text} id={`poll-opt-${index}`} />
                <Label htmlFor={`poll-opt-${index}`} className="sr-only">
                  {option.text}
                </Label>
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


export function MessageBubble({ message, onEdit, onDelete }: MessageBubbleProps) {
    return (
         <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className={cn(
                    'flex items-start gap-3 group',
                    message.sender === 'me' ? 'justify-end' : ''
                  )}
                >
                  {message.sender === 'other' && (
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'flex flex-col gap-1',
                      message.sender === 'me' ? 'items-end' : 'items-start'
                    )}
                  >
                    {message.replyTo && (
                      <div className="text-xs text-muted-foreground italic bg-muted/50 px-2 py-1 rounded-md border-l-2 border-primary">
                        Reply to: "{message.replyTo.content}"
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-md rounded-lg p-3 text-sm relative group',
                        message.type === 'voice' && '!p-2',
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.type === 'text' && <p>{message.content}</p>}
                      {message.type === 'image' && (
                        <Image
                          src={message.content}
                          alt="media content"
                          width={200}
                          height={200}
                          unoptimized
                          className="rounded-md"
                        />
                      )}
                      {message.type === 'voice' && message.duration && (
                        <VoiceMessageBubble duration={message.duration} />
                      )}
                      {message.type === 'poll' && message.pollData && (
                        <PollMessageBubble pollData={message.pollData} />
                      )}

                      <div className="absolute -bottom-2 right-2 text-xs flex items-center gap-1">
                        <span>{message.timestamp}</span>
                        {message.sender === 'me' && (
                          <CheckCheck
                            className={cn(
                              'h-4 w-4',
                              message.read ? 'text-blue-400' : 'text-muted-foreground'
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {message.sender === 'me' && (
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        <CircleUser />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onEdit(message.id, message.content)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reply
                </ContextMenuItem>
                <ContextMenuItem>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin Message
                </ContextMenuItem>
                <Separator />
                {message.sender === 'me' && (
                  <ContextMenuItem onClick={() => onEdit(message.id, message.content)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </ContextMenuItem>
                )}
                <ContextMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Forward
                </ContextMenuItem>
                <ContextMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(message.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
    )
}
