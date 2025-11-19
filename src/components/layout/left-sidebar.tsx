
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
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
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
          <path d="M128 0C57.31 0 0 57.31 0 128s57.31 128 128 128 128-57.31 128-128S198.69 0 128 0zm0 240C66.43 240 16 189.57 16 128S66.43 16 128 16s112 50.43 112 112-50.43 112-112 112z" />
          <path d="M128 48c-3.3 0-6 2.7-6 6v14.4c-11.23 2.5-20.59 9.38-26.33 19.16C90.3 96.53 87.89 105.7 88.08 115.1c.21 10.37 3.32 20.06 8.87 28.18 5.48 7.97 13.06 14.28 21.69 17.89V180c0 3.3 2.7 6 6 6s6-2.7 6-6v-18.84c8.63-3.6 16.21-9.92 21.69-17.89 5.55-8.12 8.66-17.81 8.87-28.18.19-9.4-2.22-18.57-7.58-27.54-5.74-9.78-15.1-16.66-26.33-19.16V54c0-3.3-2.7-6-6-6zm-40.16 35.84a2.5 2.5 0 01-2.17 4.29c-3.13 0-5.91-2.07-6.8-5.04a2.5 2.5 0 014.8-1.5c.34 1.11 1.34 1.91 2.51 1.91.56 0 1.07-.29 1.35-.76.43-.72-.05-1.74-.83-2.28-1.46-.99-3.23-1.63-5.07-1.89a2.5 2.5 0 01-2.4-2.85c1.07-3.93 4.87-6.84 9.14-6.84a2.5 2.5 0 012.17 4.29c-1.39.77-2.45 2.05-2.88 3.52-.4.99-.2 2.1.48 2.95zm80.32 0a2.5 2.5 0 01.48-2.95c.43-1.47-1.49-2.75-2.88-3.52a2.5 2.5 0 012.17-4.29c4.27 0 8.07 2.91 9.14 6.84a2.5 2.5 0 01-2.4 2.85c-1.84.26-3.61.9-5.07 1.89-.78.54-1.26 1.56-.83 2.28.28.47.79.76 1.35.76 1.17 0 2.17-.8 2.51-1.91a2.5 2.5 0 014.8 1.5c-.89 2.97-3.67 5.04-6.8 5.04a2.5 2.5 0 01-2.17-4.29zm-38.16 2.16c-18.78 0-34 15.22-34 34s15.22 34 34 34 34-15.22 34-34-15.22-34-34-34zm0 6c15.46 0 28 12.54 28 28s-12.54 28-28 28-28-12.54-28-28 12.54-28 28-28zm-47.5-19a2.5 2.5 0 01-3.9 3.1c-1.43-1.43-3.6-2.1-5.6-2.1-3.3 0-6.24 1.88-7.74 4.74a2.5 2.5 0 01-4.63-2.11c.96-3.8 4.29-6.63 8.37-6.63 3.09 0 5.91 1.21 8 .5a2.5 2.5 0 014.5 2.5zM34.5 108a2.5 2.5 0 014.5-2.5c2.09-1.29 4.91-2.5 8-2.5 4.08 0 7.41 2.83 8.37 6.63a2.5 2.5 0 01-4.63 2.11c-1.5-2.86-4.44-4.74-7.74-4.74-2 0-4.17.67-5.6 2.1a2.5 2.5 0 01-3.9-3.1zm141.5-19a2.5 2.5 0 014.5 2.5c-.96 3.8-4.29 6.63-8.37 6.63-3.3 0-6.24 1.88-7.74-4.74a2.5 2.5 0 014.63-2.11c1.5 2.86 4.44 4.74 7.74 4.74 2 0 4.17.67 5.6-2.1a2.5 2.5 0 01-3.9-3.1zm33.5 19a2.5 2.5 0 01-3.9 3.1c-1.43-1.43-3.6-2.1-5.6-2.1-3.3 0-6.24 1.88-7.74 4.74a2.5 2.5 0 01-4.63-2.11c.96-3.8 4.29-6.63 8.37-6.63 3.09 0 5.91 1.21 8 .5a2.5 2.5 0 014.5 2.5z" />
          <path d="M128 106c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22zm-8 16h16c1.1 0 2 .9 2 2s-.9 2-2 2h-16c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
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
      onDoubleClick={toggleSidebar}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
         <div className={cn("flex items-center border-b h-14", isCollapsed ? 'justify-center' : 'justify-between p-2')}>
            <div className="flex items-center gap-2">
                <Logo isCollapsed={isCollapsed} />
                {!isCollapsed && <span className="font-bold font-headline text-primary">REON™</span>}
            </div>
            <Button onClick={toggleSidebar} variant="ghost" size="icon" className={cn("h-8 w-8", isCollapsed && "hidden")}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
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
                  <Avatar className="h-8 w-8">
                    {userAvatar ? <AvatarImage src={userAvatar.imageUrl} /> : <AvatarFallback><User /></AvatarFallback>}
                  </Avatar>
                  {!isCollapsed && <div className="text-left"><p className="font-semibold text-foreground">Srinivas</p><p className="text-xs">RaxPro</p></div>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
