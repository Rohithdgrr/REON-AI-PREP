
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { channelsByRealm, directMessages, realms } from "../r-chat-page";
import { ChevronDown, CircleUser, Hash, Headphones, Mic, Settings, User } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/lib/utils";

type ChannelsPanelProps = {
    activeRealm: typeof realms[0];
    activeChannel: typeof channelsByRealm.r1[0];
    activeDM: typeof directMessages[0] | null;
    onSelectChannel: (channel: typeof channelsByRealm.r1[0]) => void;
    onSelectDM: (dm: typeof directMessages[0]) => void;
}

export function ChannelsPanel({ activeRealm, activeChannel, activeDM, onSelectChannel, onSelectDM}: ChannelsPanelProps) {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    return (
        <div className="flex flex-col border-r bg-muted/40 h-full">
            <CardHeader className="p-4 border-b shadow-sm">
                <CardTitle className="text-lg">{activeRealm.name}</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 px-2 py-4">
                <div className="space-y-1">
                    <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger className="w-full flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 hover:text-foreground">
                            <ChevronDown className="h-3 w-3 transition-transform duration-200 [&[data-state=closed]>*]:-rotate-90"/>
                            Text Channels
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {channelsByRealm[activeRealm.id].filter(c => c.type === 'text').map((channel) => (
                                <Button key={channel.name} variant={activeChannel.name === channel.name && !activeDM ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onSelectChannel(channel)}>
                                    <Hash className="mr-2 h-4 w-4 text-muted-foreground" /> {channel.name}
                                </Button>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                    
                     <Collapsible defaultOpen={true} className="mt-4">
                        <CollapsibleTrigger className="w-full flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 hover:text-foreground">
                            <ChevronDown className="h-3 w-3 transition-transform duration-200 [&[data-state=closed]>*]:-rotate-90"/>
                            Voice Channels
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                             {channelsByRealm[activeRealm.id].filter(c => c.type === 'voice').map((channel) => (
                                <Button key={channel.name} variant="ghost" className="w-full justify-start">
                                    <Headphones className="mr-2 h-4 w-4 text-muted-foreground" /> 
                                    <span className="flex-1 text-left">{channel.name}</span>
                                </Button>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                    
                    <Collapsible defaultOpen={true} className="mt-4">
                         <CollapsibleTrigger className="w-full flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 hover:text-foreground">
                            <ChevronDown className="h-3 w-3 transition-transform duration-200 [&[data-state=closed]>*]:-rotate-90"/>
                            Direct Messages
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {directMessages.map((contact) => (
                                <Button key={contact.id} variant={activeDM?.id === contact.id ? 'secondary' : 'ghost'} className="w-full justify-start h-auto p-2" onClick={() => onSelectDM(contact)}>
                                <Avatar className="mr-2 h-8 w-8">
                                    <AvatarImage src={contact.avatarUrl} />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-sm">{contact.name}</span>
                                </Button>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
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
