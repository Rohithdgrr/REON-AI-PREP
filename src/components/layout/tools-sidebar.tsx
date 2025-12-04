'use client';
import { useToolsSidebar } from '@/hooks/use-tools-sidebar';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { SimpleCalculator } from '../simple-calculator';
import { MultiTimer } from '../multi-timer';
import { AdvancedCalendar } from '../advanced-calendar';
import { NotificationsPanel } from '../notifications-panel';
import { TodoList } from '../todo-list';
import { LibraSidebar } from '../libra/LibraSidebar';
import { SimpleNotes } from '../simple-notes';

const toolComponents: Record<string, { component: React.ComponentType<any>, title: string, description?: string } | undefined> = {
  notes: {
    component: SimpleNotes,
    title: "Notes",
    description: "Jot down your thoughts and ideas.",
  },
  todo: {
    component: TodoList,
    title: "To-Do List",
    description: "Track your study tasks for the day.",
  },
  calendar: {
    component: AdvancedCalendar,
    title: "Calendar",
    description: "View your schedule and events.",
  },
  calculator: {
    component: SimpleCalculator,
    title: "Calculator",
    description: "Perform quick calculations.",
  },
  timer: {
    component: MultiTimer,
    title: "Timers",
    description: "Set multiple countdowns for your study sessions.",
  },
  notifications: {
    component: NotificationsPanel,
    title: "Job Notifications",
  },
  libra: {
    component: (props: any) => <LibraSidebar {...props} />,
    title: "LIBRA AI",
  },
};

export function ToolsSidebar() {
  const { isOpen, activeTool, setActiveTool } = useToolsSidebar();

  const activeToolConfig = activeTool ? toolComponents[activeTool.id] : null;
  const ActiveToolComponent = activeToolConfig?.component;
  const isLibra = activeTool?.id === 'libra';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setActiveTool(null)}>
       <SheetContent 
        className={cn(
          "p-0 w-full max-w-none sm:max-w-md",
          isLibra && "sm:max-w-lg"
        )}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('[data-radix-collection-item]')) {
            e.preventDefault();
          }
        }}
      >
        {activeTool && ActiveToolComponent && (
          <div className="flex flex-col h-full">
            {isLibra ? (
               <ActiveToolComponent {...(activeTool.payload || {})} />
            ) : (
              <>
                 <SheetHeader className="p-4 border-b">
                  <SheetTitle>{activeToolConfig?.title}</SheetTitle>
                  {activeToolConfig?.description && (
                    <SheetDescription>{activeToolConfig.description}</SheetDescription>
                  )}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4">
                  <ActiveToolComponent {...(activeTool.payload || {})} />
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
