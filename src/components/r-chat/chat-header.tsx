
'use client';

import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Hash, Menu, Monitor, Phone, Pin, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "../r-chat-page";
import { Dispatch, SetStateAction, useState } from "react";

type ChatHeaderProps = {
    name: string;
    description: string;
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>;
    onToggleChannels: () => void;
}

export function ChatHeader({ name, description, messages, setMessages, onToggleChannels }: ChatHeaderProps) {
    const { toast } = useToast();
    const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);

    // This is a temporary way to allow pinning. In a real app, this would be managed in ChatMessages.
    if (!pinnedMessage && messages.length > 0) {
        setPinnedMessage(messages.find(m => m.id === 3) || null)
    }

    return (
        <CardHeader className="flex flex-col gap-2 border-b p-4">
            <div className="flex flex-row items-center gap-2">
                 <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleChannels}>
                    <Menu className="h-5 w-5" />
                </Button>
                <Hash className="h-5 w-5 text-muted-foreground hidden sm:block" />
                <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription className="text-xs">{description}</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Starting Voice Call..."})}><Phone className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Starting Video Call..."})}><Video className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => toast({title: "Starting Screen Share..."})}><Monitor className="h-4 w-4"/></Button>
                </div>
            </div>
            {pinnedMessage && (
                <div className="p-2 bg-muted rounded-md text-xs flex items-center gap-2">
                    <Pin className="h-4 w-4 text-primary" />
                    <span className="font-semibold hidden sm:inline">Pinned:</span>
                    <span className="line-clamp-1 flex-1">{pinnedMessage.content}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPinnedMessage(null)}><X className="h-4 w-4"/></Button>
                </div>
            )}
        </CardHeader>
    )
}
