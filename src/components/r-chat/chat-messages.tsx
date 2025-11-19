
'use client';
import { CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Message } from "../r-chat-page";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MessageBubble } from "./message-bubble";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Bot } from "lucide-react";

type ChatMessagesProps = {
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

export function ChatMessages({ messages, setMessages }: ChatMessagesProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(true);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

     useEffect(() => {
        const typingTimeout = setTimeout(() => setIsTyping(false), 3000);
        return () => clearTimeout(typingTimeout);
    }, []);

    const handleEditMessage = (messageId: number, newContent: string) => {
        setMessages(messages.map(m => m.id === messageId ? { ...m, content: newContent } : m));
    };

    const handleDeleteMessage = (messageId: number) => {
        setMessages(messages.filter(m => m.id !== messageId));
    };

    return (
        <CardContent className="flex-1 overflow-auto p-4">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((message) => (
                    <MessageBubble 
                        key={message.id} 
                        message={message} 
                        onEdit={handleEditMessage} 
                        onDelete={handleDeleteMessage}
                    />
                ))}
                {isTyping && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <span>typing...</span>
                    </div>
                )}
                </div>
            </ScrollArea>
        </CardContent>
    )
}
