
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { channelsByRealm, directMessages, realms } from "../r-chat-page";
import { CircleUser, Headphones, Mic, Settings, X, Hash, User, ChevronDown } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

type ChannelsPanelProps = {
    activeRealm: typeof realms[0];
    activeChannel: typeof channelsByRealm.r1[0] | null;
    activeDM: typeof directMessages[0] | null;
    onSelectChannel: (channel: typeof channelsByRealm.r1[0]) => void;
    onSelectDM: (dm: typeof directMessages[0]) => void;
    onSelectFriends: () => void;
}

export function ChannelsPanel({ activeRealm, activeChannel, activeDM, onSelectChannel, onSelectDM, onSelectFriends}: ChannelsPanelProps) {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    const realmChannels = channelsByRealm[activeRealm.id] || [];
    const textChannels = realmChannels.filter(c => c.type === 'text');
    const voiceChannels = realmChannels.filter(c => c.type === 'voice');

    return (
        <div className="flex flex-col border-r bg-muted/40 h-full">
            {activeRealm.id === 'me' ? (
                 <div className="p-4 flex-shrink-0 border-b">
                    <Input type="search" placeholder="Find or start a conversation" className="bg-background/50 h-9" />
                </div>
            ) : (
                <div className="p-4 flex-shrink-0 border-b">
                    <h2 className="text-lg font-semibold">{activeRealm.name}</h2>
                </div>
            )}
           

            <ScrollArea className="flex-1 px-2 py-2">
                 {activeRealm.id === 'me' ? (
                     <div className="space-y-1">
                        <Button variant={!activeDM ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={onSelectFriends}>
                           <User className="h-5 w-5" /> Friends
                        </Button>
                        <h4 className="px-2 pt-2 text-xs font-bold text-muted-foreground uppercase">Direct Messages</h4>
                        {directMessages.map((contact) => (
                            <div key={contact.id}  className={cn("w-full justify-start h-auto p-2 group flex items-center rounded-md cursor-pointer", activeDM?.id === contact.id ? 'bg-secondary' : 'hover:bg-muted/50')}>
                                <div className="flex items-center flex-1 gap-2" onClick={() => onSelectDM(contact)}>
                                    <div className="relative">
                                        <Avatar className="mr-2 h-8 w-8">
                                            <AvatarImage src={contact.avatarUrl ?? undefined} />
                                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-muted bg-green-500" />
                                    </div>
                                    <span className="font-semibold text-sm">{contact.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="space-y-2">
                        <Collapsible defaultOpen>
                            <CollapsibleTrigger className="w-full flex items-center justify-between text-xs font-bold text-muted-foreground uppercase hover:text-foreground">
                                <span>Text Channels</span>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pt-2">
                                {textChannels.map(channel => (
                                    <Button key={channel.name} variant={activeChannel?.name === channel.name ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => onSelectChannel(channel)}>
                                        <Hash className="h-5 w-5 text-muted-foreground" />
                                        <span>{channel.name}</span>
                                    </Button>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                         <Collapsible defaultOpen>
                            <CollapsibleTrigger className="w-full flex items-center justify-between text-xs font-bold text-muted-foreground uppercase hover:text-foreground">
                                <span>Voice Channels</span>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pt-2">
                                {voiceChannels.map(channel => (
                                    <Button key={channel.name} variant={activeChannel?.name === channel.name ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => onSelectChannel(channel)}>
                                        <Headphones className="h-5 w-5 text-muted-foreground" />
                                        <span>{channel.name}</span>
                                    </Button>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                 )}
                
            </ScrollArea>
            <div className="p-2 border-t mt-auto bg-background/30">
                <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} />}
                        <AvatarFallback><CircleUser /></AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-semibold">RI-XXXX</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                    <div className="ml-auto flex items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={isMuted ? 'destructive' : 'ghost'} size="icon" onClick={() => setIsMuted(!isMuted)}><Mic className="h-4 w-4" /></Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{isMuted ? "Unmute" : "Mute"}</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={isDeafened ? 'destructive' : 'ghost'} size="icon" onClick={() => setIsDeafened(!isDeafened)}><Headphones className="h-4 w-4" /></Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{isDeafened ? "Undeafen" : "Deafen"}</p></TooltipContent>
                            </Tooltip>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                     <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                                </TooltipTrigger>
                                <TooltipContent><p>User Settings</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}
