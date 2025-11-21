
'use client';

import Link from 'next/link';
import {
  Bell,
  BookOpen,
  ChevronLeft,
  FileQuestion,
  HelpCircle,
  LayoutDashboard,
  Lightbulb,
  Map,
  MessageCircle,
  Settings,
  Target,
  TestTube2,
  Users,
  Menu,
  PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { href: '/dashboard/roadmap', icon: Map, label: 'Roadmap' },
  { href: '/dashboard/prep', icon: BookOpen, label: 'Prep' },
  { href: '/dashboard/suggestions', icon: Lightbulb, label: 'Suggestions' },
  { href: '/dashboard/quiz', icon: FileQuestion, label: 'Quiz' },
  { href: '/dashboard/practice', icon: TestTube2, label: 'Practice' },
  { href: '/dashboard/mock', icon: Target, label: 'Mock Test' },
  { href: '/dashboard/courses', icon: PlayCircle, label: 'Courses' },
  { href: '/dashboard/knowledge-hub', icon: Users, label: 'Knowledge Hub' },
  { href: '/dashboard/r-chat', icon: MessageCircle, label: 'R-Chat' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function Logo({ isCollapsed }: { isCollapsed: boolean }) {
  const appLogo = PlaceHolderImages.find(img => img.id === 'app-logo');
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2 font-semibold',
        isCollapsed ? 'justify-center' : 'px-2'
      )}
    >
      {appLogo ? (
         <img
            src={appLogo.imageUrl}
            alt="REON Logo"
            className={cn('h-8 w-8 transition-all')}
        />
      ) : (
        <img
            src="https://i.ibb.co/VMy9fR1/Screenshot-2024-07-28-at-4-11-20-PM.png"
            alt="REON Logo"
            className={cn('h-8 w-8 transition-all')}
        />
      )}
     
      <span
        className={cn(
          'transition-opacity',
          isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
        )}
      >
        REON™
      </span>
    </Link>
  );
}

function NavLink({
  item,
  isCollapsed,
}: {
  item: (typeof navItems)[0];
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = (item.href === '/dashboard' && pathname === '/dashboard') || (item.href !== '/dashboard' && pathname.startsWith(item.href));

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              'flex h-12 w-full items-center gap-3 rounded-lg px-3 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive && 'bg-sidebar-primary text-sidebar-primary-foreground',
              isCollapsed && 'justify-center'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span
              className={cn(
                'transition-opacity',
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              )}
            >
              {item.label}
            </span>
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}

function SidebarContent({
  isCollapsed,
  toggleSidebar,
}: {
  isCollapsed: boolean;
  toggleSidebar?: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          'flex h-16 items-center border-b border-sidebar-border/50 p-2',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <Logo isCollapsed={isCollapsed} />
        {!isCollapsed && toggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 py-2 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
    </>
  );
}

interface LeftSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function LeftSidebar({ isCollapsed, toggleSidebar }: LeftSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const mobileNavItems = [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/notifications', icon: Bell, label: 'Alerts' },
      { href: '/dashboard/roadmap', icon: Map, label: 'Roadmap' },
      { href: '/dashboard/prep', icon: BookOpen, label: 'Prep' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        data-collapsed={isCollapsed}
        className={cn(
          'fixed inset-y-0 left-0 z-20 hidden flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Mobile Bottom Navigation */}
       <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t bg-sidebar text-sidebar-foreground h-16">
        <nav className="flex items-center justify-around h-full">
          {mobileNavItems.map((item) => {
             const isActive = (item.href === '/dashboard' && pathname === '/dashboard') || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
             <TooltipProvider key={item.label} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs transition-all h-full w-full',
                        isActive
                          ? 'text-sidebar-primary bg-sidebar-accent'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="top">{item.label}</TooltipContent>
              </Tooltip>
             </TooltipProvider>
          )})}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
                 <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <div
                              className={cn(
                                'flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs transition-all h-full w-full cursor-pointer',
                                'text-sidebar-foreground hover:bg-sidebar-accent'
                              )}
                            >
                              <Menu className="h-5 w-5" />
                              <span>More</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">More</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-64 bg-sidebar text-sidebar-foreground border-r-0"
            >
              <SidebarContent isCollapsed={false} />
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
}
