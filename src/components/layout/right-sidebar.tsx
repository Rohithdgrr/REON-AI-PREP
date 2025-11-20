
'use client';

import {
  Calculator,
  Calendar as CalendarIcon,
  Clock,
  Notebook,
  Sparkles,
  Timer,
  Bell,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToolsSidebar } from '@/hooks/use-tools-sidebar';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '../ui/sheet';
import { SimpleCalculator } from '../simple-calculator';
import { AdvancedCalendar } from '../advanced-calendar';
import { MultiTimer } from '../multi-timer';
import { SimpleStopwatch } from '../simple-stopwatch';
import { NotificationsPanel } from '../notifications-panel';
import { TodoList } from '../todo-list';
import { LibraSidebar } from '../libra/LibraSidebar';
import { SimpleNotes } from '../simple-notes';

const tools = [
  { id: 'notifications', icon: Bell, label: 'Notifications', component: NotificationsPanel, title: 'Notifications' },
  { id: 'libra', icon: Sparkles, label: 'LIBRA AI', component: LibraSidebar, title: 'LIBRA AI', isAi: true },
  { id: 'notes', icon: Notebook, label: 'Notes', component: SimpleNotes, title: 'Notes' },
  { id: 'todo', icon: ListTodo, label: 'To-Do List', component: TodoList, title: 'To-Do List' },
  { id: 'calendar', icon: CalendarIcon, label: 'Calendar', component: AdvancedCalendar, title: 'Calendar' },
  { id: 'calculator', icon: Calculator, label: 'Calculator', component: SimpleCalculator, title: 'Calculator' },
  { id: 'timer', icon: Timer, label: 'Timer', component: MultiTimer, title: 'Timers' },
  { id: 'stopwatch', icon: Clock, label: 'Stopwatch', component: SimpleStopwatch, title: 'Stopwatch' },
];


function TooltipButton({
  icon: Icon,
  label,
  onClick,
  onDoubleClick,
  className,
  isAi = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  onDoubleClick?: () => void;
  className?: string;
  isAi?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
             <Button variant="ghost" size="icon" onClick={onClick} onDoubleClick={onDoubleClick} className={className}>
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </Button>
            {isAi && <div className="absolute inset-0 rounded-full bg-primary/20 -z-10 animate-pulse" />}
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function RightSidebar() {
  const { activeTool, setActiveTool } = useToolsSidebar();

  const handleToolClick = (toolId: string) => {
    setActiveTool({ id: toolId });
  };
  
  const handleDoubleClick = (toolId: string) => {
    if (activeTool?.id === toolId) {
        setActiveTool(null);
    }
  };
  
  return (
    <aside className="fixed inset-y-0 right-0 z-10 hidden w-20 flex-col border-l bg-background lg:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {tools.map((tool) => (
          <TooltipButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            onClick={() => handleToolClick(tool.id)}
            onDoubleClick={() => handleDoubleClick(tool.id)}
            isAi={tool.isAi}
            className={cn(
              "h-12 w-12",
              activeTool?.id === tool.id && 'bg-accent text-accent-foreground',
              tool.isAi && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-200"
            )}
          />
        ))}
      </nav>
    </aside>
  );
}
