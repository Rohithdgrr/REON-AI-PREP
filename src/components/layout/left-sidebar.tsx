
"use client";

import Link from "next/link";
import {
  Bell,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  HelpCircle,
  Home,
  LayoutDashboard,
  Lightbulb,
  Map,
  MessageCircle,
  Mic,
  PlayCircle,
  Settings,
  Target,
  TestTube2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/roadmap", icon: Map, label: "Roadmap" },
  { href: "/dashboard/prep", icon: BookOpen, label: "Prep" },
  { href: "/dashboard/suggestions", icon: Lightbulb, label: "Suggestions" },
  { href: "/dashboard/quiz", icon: FileQuestion, label: "Quiz" },
  { href: "/dashboard/practice", icon: TestTube2, label: "Practice" },
  { href: "/dashboard/mock", icon: Target, label: "Mock Test" },
  { href: "/dashboard/courses", icon: PlayCircle, label: "Courses" },
  { href: "/dashboard/podcasts", icon: Mic, label: "Podcasts" },
  { href: "/dashboard/r-chat", icon: MessageCircle, label: "R-Chat" },
];

const secondaryNavItems = [
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/tools", icon: Wrench, label: "Tools" },
];

const bottomNavItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/help", icon: HelpCircle, label: "Help" },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavLink = ({ item, isCollapsed }: { item: typeof navItems[0], isCollapsed: boolean }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === item.href && "bg-accent text-primary",
              isCollapsed && "justify-center"
            )}
          >
            <item.icon className="h-4 w-4" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            {item.label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div
      className={cn(
        "relative hidden border-r bg-background transition-all duration-300 md:block",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Button onClick={toggleSidebar} variant="ghost" size="icon" className="absolute -right-4 top-4 bg-background border rounded-full h-8 w-8 z-10">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            {navItems.map((item) => <NavLink key={item.href} item={item} isCollapsed={isCollapsed}/>)}
            <Separator className="my-4" />
            {secondaryNavItems.map((item) => <NavLink key={item.href} item={item} isCollapsed={isCollapsed}/>)}
          </nav>
        </div>
        <div className="mt-auto p-4 space-y-1">
            <Separator className="my-4" />
            {bottomNavItems.map((item) => <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />)}
        </div>
      </div>
    </div>
  );
}
