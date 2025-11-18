
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Bot,
  CircleUser,
  Paperclip,
  Send,
  User,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const contacts = [
  {
    name: "AI Study Group",
    lastMessage: "Let's review the quant chapter.",
    avatarId: "group-avatar",
    isGroup: true,
  },
  { name: "Anil Kumar", lastMessage: "Got it, thanks!", avatarId: "user-avatar-2" },
  { name: "Priya Sharma", lastMessage: "See you tomorrow.", avatarId: "user-avatar-3" },
];

const messages = [
  { sender: "other", text: "Hey! Are you ready for the mock test tomorrow?" },
  { sender: "me", text: "Almost. Just revising the reasoning part. You?" },
  {
    sender: "other",
    text: "Same here. That new puzzle type is tricky.",
  },
];

export function RChatPage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-100px)] gap-4">
      {/* Contacts List */}
      <Card className="col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>R-Chat</CardTitle>
          <CardDescription>Your conversations.</CardDescription>
          <Input placeholder="Search contacts..." className="mt-2" />
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-2">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {contacts.map((contact) => (
                <Button
                  key={contact.name}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                >
                  <Avatar className="mr-3">
                    {contact.isGroup ? (
                        <AvatarFallback><Bot /></AvatarFallback>
                    ) : (
                        <AvatarFallback><User /></AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">{contact.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {contact.lastMessage}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
        <CardHeader className="flex flex-row items-center gap-3 border-b">
          <Avatar>
            <AvatarFallback><Bot /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">AI Study Group</CardTitle>
            <CardDescription>3 members online</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4 space-y-4">
          <ScrollArea className="h-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.sender === "me" ? "justify-end" : ""
                }`}
              >
                {message.sender === "other" && (
                   <Avatar className="h-8 w-8">
                     <AvatarFallback><Bot /></AvatarFallback>
                   </Avatar>
                )}
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                 {message.sender === "me" && (
                   <Avatar className="h-8 w-8">
                     {userAvatar && <Image src={userAvatar.imageUrl} alt="You" width={32} height={32} className="rounded-full" />}
                     {!userAvatar && <AvatarFallback><CircleUser /></AvatarFallback>}
                   </Avatar>
                 )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t">
          <div className="relative">
            <Input placeholder="Type your message..." className="pr-24" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
