
'use client';

import { Button } from "../ui/button";
import { Hash, Menu, AtSign, Inbox, Search, Users, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "../r-chat-page";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type ChatHeaderProps = {
    name: string;
    description: string;
    type?: 'text' | 'voice' | 'dm';
    onToggleChannels: () => void;
    onToggleMembers: () => void;
    membersPanelOpen: boolean;
}

export function ChatHeader({ name, description, type, onToggleChannels, onToggleMembers, membersPanelOpen }: ChatHeaderProps) {
    const { toast } = useToast();

    const Icon = type === 'text' ? Hash : type === 'voice' ? Headphones : AtSign;

    return (
        <header className="flex flex-row items-center gap-2 border-b p-3 shadow-sm flex-shrink-0">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleChannels}>
                <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-base">{name}</h2>
            </div>
            <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
            <p className="text-sm text-muted-foreground truncate hidden sm:block">{description}</p>
            
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
                 <div className="relative hidden md:block">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input placeholder="Search" className="h-8 w-36 lg:w-64 pl-8 bg-muted border-none focus-visible:ring-primary"/>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => toast({title: "Viewing Inbox..."})}><Inbox className="h-5 w-5"/></Button>
                 <Button variant="ghost" size="icon" className={cn("hidden lg:flex", membersPanelOpen && "bg-accent")} onClick={onToggleMembers}><Users className="h-5 w-5"/></Button>
            </div>
        </header>
    )
}
