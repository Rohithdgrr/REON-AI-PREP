
'use client';

import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Hash, Menu, Monitor, Phone, Pin, Users, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "../r-chat-page";
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";

type ChatHeaderProps = {
    name: string;
    description: string;
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>;
    onToggleChannels: () => void;
    onToggleMembers: () => void;
    membersPanelOpen: boolean;
}

export function ChatHeader({ name, description, messages, setMessages, onToggleChannels, onToggleMembers, membersPanelOpen }: ChatHeaderProps) {
    const { toast } = useToast();
    const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);

    // This is a temporary way to allow pinning. In a real app, this would be managed in ChatMessages.
    if (!pinnedMessage && messages.length > 0) {
        setPinnedMessage(messages.find(m => m.id === 3) || null)
    }

    return (
        <CardHeader className="flex flex-col gap-2 border-b p-4 shadow-sm flex-shrink-0">
            <div className="flex flex-row items-center gap-2">
                 <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleChannels}>
                    <Menu className="h-5 w-5" />
                </Button>
                <Hash className="h-5 w-5 text-muted-foreground hidden sm:block" />
                <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                </div>
                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Starting Voice Call..."})}><Phone className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Starting Video Call..."})}><Video className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Feature coming soon!"})}><Pin className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" className={cn("hidden lg:flex", membersPanelOpen && "bg-accent")} onClick={onToggleMembers}><Users className="h-5 w-5"/></Button>
                </div>
            </div>
        </CardHeader>
    )
}
