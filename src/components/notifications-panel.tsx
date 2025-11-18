"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "./ui/scroll-area";

const notifications = [
  {
    id: 1,
    title: "New Mock Test Available",
    description: "RRB NTPC Stage 2 Mock Test #5 is now live. Test your skills!",
    time: "2 hours ago",
    read: false,
    tag: "Mock Test",
  },
  {
    id: 2,
    title: "Mission Accomplished!",
    description: "You've completed the 'Night Owl' mission. +50 XP awarded.",
    time: "8 hours ago",
    read: false,
    tag: "Reward",
  },
  {
    id: 3,
    title: "Result Declared: IBPS Clerk Prelims",
    description: "Check the official IBPS website for your results.",
    time: "1 day ago",
    read: true,
    tag: "Results",
  },
  {
    id: 4,
    title: "AI Suggestion: Focus on Algebra",
    description: "LIBRA suggests you revise algebra concepts based on your recent performance.",
    time: "2 days ago",
    read: true,
    tag: "AI",
  },
];

export function NotificationsPanel() {
  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="py-4 space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm relative">
             {!notification.read && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
            <div className="flex justify-between items-start">
                 <h4 className="font-semibold">{notification.title}</h4>
                 <Badge variant={notification.read ? "outline" : "default"}>{notification.tag}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
            <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
