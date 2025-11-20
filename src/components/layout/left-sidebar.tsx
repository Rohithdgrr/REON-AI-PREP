
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
        <Link href="/dashboard" className="flex items-center gap-2">
         <img
            src="https://i.ibb.co/VMy9fR1/Screenshot-2024-07-28-at-4-11-20-PM.png"
            alt="REON Logo"
            className={cn("transition-all duration-300", isCollapsed ? "h-8 w-8" : "h-10 w-10")}
          />
        </Link>
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
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span className="hidden lg:inline">{item.label}</span>}
            <span className="lg:hidden">{item.label}</span>
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
        "hidden border-r bg-card transition-all duration-300 lg:block",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full max-h-screen flex-col">
         <div className={cn("flex items-center border-b h-14", isCollapsed ? 'justify-center' : 'justify-between p-2')}>
            <div className="flex items-center gap-2">
                <Logo isCollapsed={isCollapsed} />
                {!isCollapsed && <span className="font-bold font-headline text-primary hidden lg:inline">REON™</span>}
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
                  {!isCollapsed && <div className="text-left hidden lg:block"><p className="font-semibold text-foreground">Settings</p></div>}
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
