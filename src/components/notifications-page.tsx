
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const allNotifications = [
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
  {
    id: 5,
    title: "Study Plan Updated",
    description: "Your weekly study plan has been updated based on your progress.",
    time: "3 days ago",
    read: true,
    tag: "Plan",
  },
];

export function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Notifications
            </h1>
            <p className="text-muted-foreground">
            All your recent alerts and updates in one place.
            </p>
        </div>
        <Button>Mark all as read</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-6 space-y-4">
              {allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm relative flex items-start gap-4 data-[read=true]:opacity-60"
                  data-read={notification.read}
                >
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <Badge
                        variant={notification.read ? "outline" : "default"}
                      >
                        {notification.tag}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
