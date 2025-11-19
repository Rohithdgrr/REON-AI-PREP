

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
import { SimpleStopwatch } from '../simple-stopwatch';
import { NotificationsPanel } from '../notifications-panel';
import { TodoList } from '../todo-list';
import { LibraSidebar } from '../libra/LibraSidebar';

const toolComponents: Record<string, React.ComponentType<any> | undefined> = {
  notes: () => (
    <div className="h-full flex flex-col">
       <iframe src="/notes-app.html" className="w-full h-full border-0" title="Notes App" />
    </div>
  ),
  todo: () => (
    <>
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-foreground">To-Do List</h3>
        <p className="text-sm text-muted-foreground">Track your study tasks for the day.</p>
      </div>
      <TodoList />
    </>
  ),
  calendar: () => (
    <div className="flex justify-center items-start pt-4">
        <AdvancedCalendar />
    </div>
  ),
  calculator: () => (
    <>
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-foreground">Calculator</h3>
      </div>
      <SimpleCalculator />
    </>
  ),
  timer: () => (
    <>
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-foreground">Timers</h3>
        <p className="text-sm text-muted-foreground">Set multiple countdowns for your study sessions.</p>
      </div>
      <MultiTimer />
    </>
  ),
  stopwatch: () => (
    <>
       <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-foreground">Stopwatch</h3>
        <p className="text-sm text-muted-foreground">Track your time for practice questions.</p>
      </div>
      <SimpleStopwatch />
    </>
  ),
  notifications: () => (
     <>
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-foreground">Job Notifications</h3>
      </div>
      <NotificationsPanel />
    </>
  ),
  libra: (props: any) => <LibraSidebar {...props} />,
};

export function ToolsSidebar() {
  const { isOpen, activeTool, setActiveTool } = useToolsSidebar();

  const ActiveToolComponent = activeTool ? toolComponents[activeTool.id] : null;
  const isLibra = activeTool?.id === 'libra';

  return (
    <div
      className={cn(
        'hidden sm:block transition-all duration-300 ease-in-out',
        isOpen ? (isLibra ? 'w-[450px]' : 'w-[400px]') : 'w-0'
      )}
    >
      <div className={cn("h-full bg-background border-l", isOpen ? (isLibra ? 'p-0' : 'p-4') : 'p-0')}>
        {isOpen && activeTool && (
          <div className="flex flex-col h-full">
            {!isLibra && (
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className={cn("flex-1", !isLibra && "overflow-y-auto")}>
              {ActiveToolComponent ? <ActiveToolComponent {...(activeTool.payload || {})} /> : <p>Tool not found</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
