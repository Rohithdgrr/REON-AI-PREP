
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Notebook,
  Calendar,
  Calculator,
  Timer,
  Clock,
  Bell,
  Globe,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";

const tools = [
  { icon: Notebook, title: "Notes", description: "Jot down quick notes and ideas." },
  { icon: Calendar, title: "Calendar", description: "View your schedule and events." },
  { icon: Calculator, title: "Calculator", description: "Perform quick calculations." },
  { icon: Timer, title: "Timer", description: "Set a countdown for study sessions." },
  { icon: Clock, title: "Stopwatch", description: "Track your time for practice." },
  { icon: Bell, title: "Notifications", description: "Check your latest notifications." },
  { icon: Globe, title: "In-App Browser", description: "Browse websites without leaving." },
  { icon: Sparkles, title: "LIBRA AI", description: "Ask your AI assistant anything." },
];

export function ToolsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Tools
        </h1>
        <p className="text-muted-foreground">
          Your collection of handy utilities to boost your productivity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <tool.icon className="h-6 w-6 text-primary" />
                <span>{tool.title}</span>
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Open Tool</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
