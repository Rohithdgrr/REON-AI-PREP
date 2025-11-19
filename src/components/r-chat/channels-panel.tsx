
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { channelsByRealm, directMessages, realms } from "../r-chat-page";
import { CircleUser, Hash, Headphones, Mic, Settings, User } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type ChannelsPanelProps = {
    activeRealm: typeof realms[0];
    activeChannel: typeof channelsByRealm.r1[0];
    activeDM: typeof directMessages[0] | null;
    onSelectChannel: (channel: typeof channelsByRealm.r1[0]) => void;
    onSelectDM: (dm: typeof directMessages[0]) => void;
    onDoubleClick: () => void;
}

export function ChannelsPanel({ activeRealm, activeChannel, activeDM, onSelectChannel, onSelectDM, onDoubleClick}: ChannelsPanelProps) {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    return (
        <div className="flex flex-col border-r bg-muted/50 h-full" onDoubleClick={onDoubleClick}>
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg">{activeRealm.name}</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-2">
                <div className="space-y-1">
                    <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground">ROUTE CHANNELS</h4>
                    {channelsByRealm[activeRealm.id].filter(c => c.type === 'text').map((channel) => (
                        <Button key={channel.name} variant={activeChannel.name === channel.name && !activeDM ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onSelectChannel(channel)}>
                            <Hash className="mr-2 h-4 w-4" /> {channel.name}
                        </Button>
                    ))}
                    <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-4">RESONANT ROOMS</h4>
                    {channelsByRealm[activeRealm.id].filter(c => c.type === 'voice').map((channel) => (
                        <Button key={channel.name} variant="ghost" className="w-full justify-start">
                            <Headphones className="mr-2 h-4 w-4" /> 
                            <span className="flex-1 text-left">{channel.name}</span>
                        </Button>
                    ))}
                    <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-4">REACH DMS</h4>
                    {directMessages.map((contact) => (
                        <Button key={contact.id} variant={activeDM?.id === contact.id ? 'secondary' : 'ghost'} className="w-full justify-start h-auto p-2" onClick={() => onSelectDM(contact)}>
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
