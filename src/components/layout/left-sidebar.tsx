
'use client';

import Link from "next/link";
import {
  Bell,
  BookOpen,
  Camera,
  ChevronLeft,
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
  PanelLeft,
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
import { useState, useEffect } from "react";
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
  { href: "/dashboard/webcam", icon: Camera, label: "Webcam" },
];

function Logo({ isCollapsed }: { isCollapsed: boolean }) {
    return (
      <Link href="/dashboard" className={cn("flex items-center gap-2 font-semibold", isCollapsed ? "justify-center" : "px-2")}>
         <img
            src="https://i.ibb.co/VMy9fR1/Screenshot-2024-07-28-at-4-11-20-PM.png"
            alt="REON Logo"
            className={cn("h-8 w-8 transition-all")}
          />
        <span className={cn("transition-opacity", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>REON™</span>
      </Link>
    );
  }

export function LeftSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) { // xl breakpoint
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === item.href && "bg-sidebar-accent text-sidebar-primary",
              isCollapsed && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className={cn("transition-opacity", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>{item.label}</span>
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
        "hidden border-r bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("flex h-14 items-center border-b p-2", isCollapsed ? 'justify-center' : 'justify-between')}>
        <Logo isCollapsed={isCollapsed} />
        {!isCollapsed && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
          {navItems.map((item) => <NavLink key={item.label} item={item} isCollapsed={isCollapsed}/>)}
          <Separator className="my-4 bg-sidebar-border" />
          {secondaryNavItems.map((item) => <NavLink key={item.href} item={item} isCollapsed={isCollapsed}/>)}
        </nav>
      </div>
      <div className="mt-auto p-2 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className={cn("w-full justify-start items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", isCollapsed && "justify-center")}>
                  <Settings className="h-5 w-5" />
                  <span className={cn("text-left transition-opacity", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/dashboard/settings"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
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
       {isCollapsed && (
          <div className="p-2 border-t border-sidebar-border">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="w-full">
              <PanelLeft className="h-5 w-5" />
            </Button>
          </div>
       )}
    </div>
  );
}
