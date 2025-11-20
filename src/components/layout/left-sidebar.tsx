
'use client';

import Link from "next/link";
import {
  Bell,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  Globe,
  HelpCircle,
  Home,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Map,
  MessageCircle,
  Mic,
  PlayCircle,
  Settings,
  Target,
  TestTube2,
  User,
  Users,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/notifications", icon: Bell, label: "Job Notifications" },
  { href: "/dashboard/roadmap", icon: Map, label: "Roadmap" },
  { href: "/dashboard/prep", icon: BookOpen, label: "Prep" },
  { href: "/dashboard/suggestions", icon: Lightbulb, label: "Suggestions" },
  { href: "/dashboard/quiz", icon: FileQuestion, label: "Quiz" },
  { href: "/dashboard/practice", icon: TestTube2, label: "Practice" },
  { href: "/dashboard/mock", icon: Target, label: "Mock Test" },
  { href: "/dashboard/courses", icon: PlayCircle, label: "Courses" },
  { href: "/dashboard/knowledge-hub", icon: Users, label: "Knowledge Hub" },
  { href: "/dashboard/r-chat", icon: MessageCircle, label: "R-Chat" },
];

const secondaryNavItems = [
  { href: "/dashboard/tools", icon: Wrench, label: "Tools" },
];

const bottomNavItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/help", icon: HelpCircle, label: "Help" },
  { href: "#", icon: LogOut, label: "Logout" },
];

function Logo({ isCollapsed }: { isCollapsed: boolean }) {
    return (
      <div className={cn("flex items-center justify-center p-2", isCollapsed ? "h-14" : "")}>
        <svg
          role="img"
          viewBox="0 0 256 256"
          className={cn("transition-all duration-300", isCollapsed ? "h-8 w-8" : "h-10 w-10")}
          fill="currentColor"
        >
         <path d="M128 0C97.58 0 69.24 10.22 47.38 27.67L35.7 13.01A2.5 2.5 0 0031.57 12c-1.38 0-2.5 1.12-2.5 2.5v28a2.5 2.5 0 002.5 2.5h28a2.5 2.5 0 002.13-4.17l-12.75-14.88C68.91 38.08 97.43 32 128 32c52.94 0 96 43.06 96 96s-43.06 96-96 96c-30.57 0-58.1-14.28-76.62-36.99L38.63 172.4a2.5 2.5 0 00-4.29-2.17c-1.38 1.15-1.59 3.12-.53 4.53l12.75 16.88C66.76 215.92 95.4 224 128 224c70.69 0 128-57.31 128-128S198.69 0 128 0z"/>
         <path d="M88.16 83.84a2.5 2.5 0 00-2.17 4.29c-3.13 0-5.91-2.07-6.8-5.04a2.5 2.5 0 004.8-1.5c.34 1.11 1.34 1.91 2.51 1.91.56 0 1.07-.29 1.35-.76.43-.72-.05-1.74-.83-2.28-1.46-.99-3.23-1.63-5.07-1.89a2.5 2.5 0 00-2.4-2.85c1.07-3.93 4.87-6.84 9.14-6.84a2.5 2.5 0 002.17 4.29c-1.39.77-2.45 2.05-2.88 3.52-.4.99-.2 2.1.48 2.95zM168.16 83.84a2.5 2.5 0 00.48-2.95c.43-1.47-1.49-2.75-2.88-3.52a2.5 2.5 0 002.17-4.29c4.27 0 8.07 2.91 9.14 6.84a2.5 2.5 0 00-2.4 2.85c-1.84.26-3.61.9-5.07 1.89-.78.54-1.26 1.56-.83 2.28.28.47.79.76 1.35.76 1.17 0 2.17-.8 2.51-1.91a2.5 2.5 0 004.8 1.5c-.89 2.97-3.67 5.04-6.8 5.04a2.5 2.5 0 00-2.17-4.29zM128 106c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22zm-8 16h16c1.1 0 2 .9 2 2s-.9 2-2 2h-16c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
        </svg>
      </div>
    );
  }

export function LeftSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

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
        "hidden border-r bg-background transition-all duration-300 md:block",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full max-h-screen flex-col">
         <div className={cn("flex items-center border-b h-14", isCollapsed ? 'justify-center' : 'justify-between p-2')}>
            <div className="flex items-center gap-2">
                <Logo isCollapsed={isCollapsed} />
                {!isCollapsed && <span className="font-bold font-headline text-primary">REON™</span>}
            </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            {navItems.map((item) => <NavLink key={item.label} item={item} isCollapsed={isCollapsed}/>)}
            <Separator className="my-4" />
            {secondaryNavItems.map((item) => <NavLink key={item.href} item={item} isCollapsed={isCollapsed}/>)}
          </nav>
        </div>
        <div className="mt-auto p-2 space-y-1 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className={cn("w-full justify-start items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isCollapsed && "justify-center")}>
                  <Settings className="h-5 w-5" />
                  {!isCollapsed && <div className="text-left"><p className="font-semibold text-foreground">Settings</p></div>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/dashboard/settings"><Avatar className="mr-2 h-5 w-5"><AvatarImage src={userAvatar?.imageUrl} /><AvatarFallback><User /></AvatarFallback></Avatar>Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard/help"><HelpCircle className="mr-2 h-4 w-4" />Support</Link></DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><Globe className="mr-2 h-4 w-4" />Language</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Telugu</DropdownMenuItem>
                  <DropdownMenuItem>Hindi</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
