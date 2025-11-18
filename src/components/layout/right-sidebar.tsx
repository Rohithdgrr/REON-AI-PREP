"use client";

import {
  Calculator,
  Calendar,
  Clock,
  Globe,
  Notebook,
  Sparkles,
  Timer,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Textarea } from "../ui/textarea";

const tools = [
  { icon: Notebook, label: "Notes" },
  { icon: Calendar, label: "Calendar" },
  { icon: Timer, label: "Timer" },
  { icon: Clock, label: "Stopwatch" },
  { icon: Calculator, label: "Calculator" },
  { icon: Bell, label: "Notifications" },
  { icon: Globe, label: "In-App Browser" },
];

export function RightSidebar() {
  return (
    <div className="hidden sm:flex flex-col items-center gap-4 border-l bg-background p-2">
      <div className="flex flex-col items-center gap-4 mt-14">
        {tools.map((tool, index) => (
          <TooltipButton key={index} icon={tool.icon} label={tool.label} />
        ))}
      </div>
      <div className="mt-auto">
        <Sheet>
            <SheetTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="sr-only">LIBRA AI</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>✨ Ask LIBRA</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full py-4">
                    <div className="flex-1 bg-muted rounded-lg p-4 text-sm">
                        Streaming Response...
                    </div>
                    <div className="mt-4">
                        <Textarea placeholder="Ask about this topic, get summaries, or generate quizzes..." />
                        <Button className="w-full mt-2">Send</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TooltipButton({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
