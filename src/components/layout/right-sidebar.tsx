

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

const tools = [
  { id: 'notes', icon: Notebook, label: 'Notes' },
  { id: 'todo', icon: ListTodo, label: 'To-Do List' },
  { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
  { id: 'calculator', icon: Calculator, label: 'Calculator' },
  { id: 'timer', icon: Timer, label: 'Timer' },
  { id: 'stopwatch', icon: Clock, label: 'Stopwatch' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'libra', icon: Sparkles, label: 'LIBRA AI' },
];

function TooltipButton({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onClick} className={className}>
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function RightSidebar() {
  const { setActiveTool } = useToolsSidebar();

  const handleToolClick = (toolId: string) => {
    setActiveTool({ id: toolId });
  };
  
  return (
    <div className="hidden sm:flex flex-col items-center gap-4 border-l bg-background p-2">
      <div className="flex flex-col items-center gap-2 pt-2">
        {tools.map((tool) => {
           if (tool.id === 'libra') {
             return (
               <div key={tool.id} className="relative mt-2">
                 <TooltipButton
                  icon={tool.icon}
                  label={tool.label}
                  onClick={() => handleToolClick(tool.id)}
                  className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-200"
                />
                <div className="absolute inset-0 rounded-full bg-primary/20 -z-10 animate-pulse" />
               </div>
             )
           }
          return (
            <TooltipButton
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              onClick={() => handleToolClick(tool.id)}
            />
          )
        })}
      </div>
    </div>
  );
}
