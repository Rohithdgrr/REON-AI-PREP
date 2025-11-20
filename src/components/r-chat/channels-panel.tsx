
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { channelsByRealm, directMessages, realms } from "../r-chat-page";
import { ChevronDown, CircleUser, Hash, Headphones, Mic, Settings, User, X } from "lucide-react";
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
}

export function ChannelsPanel({ activeRealm, activeChannel, activeDM, onSelectChannel, onSelectDM}: ChannelsPanelProps) {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    return (
        <div className="flex flex-col border-r bg-muted/40 h-full">
            <div className="p-4 flex-shrink-0">
                 <Input type="search" placeholder="Find or start a conversation" className="bg-background/50 h-9" />
            </div>

            <ScrollArea className="flex-1 px-2 py-2">
                <div className="space-y-1">
                    {directMessages.map((contact) => (
                        <Button key={contact.id} variant={activeDM?.id === contact.id ? 'secondary' : 'ghost'} className="w-full justify-start h-auto p-2" onClick={() => onSelectDM(contact)}>
                        <div className="relative">
                            <Avatar className="mr-2 h-8 w-8">
                                <AvatarImage src={contact.avatarUrl} />
                                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-muted bg-green-500" />
                        </div>
                        <span className="font-semibold text-sm">{contact.name}</span>
                        <Button variant="ghost" size="icon" className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-4 w-4" />
                        </Button>
                        </Button>
                    ))}
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
