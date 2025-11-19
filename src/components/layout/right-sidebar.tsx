
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

const tools = [
  { id: 'notes', icon: Notebook, label: 'Notes' },
  { id: 'todo', icon: ListTodo, label: 'To-Do List' },
  { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
  { id: 'calculator', icon: Calculator, label: 'Calculator' },
  { id: 'timer', icon: Timer, label: 'Timer' },
  { id: 'stopwatch', icon: Clock, label: 'Stopwatch' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

function TooltipButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onClick}>
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
  const { setActiveTool, toggleSidebar } = useToolsSidebar();

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
    toggleSidebar(true);
  };
  
  return (
    <div className="hidden sm:flex flex-col items-center gap-4 border-l bg-background p-2">
      <div className="flex-1 flex flex-col items-center gap-4 pt-14">
        {tools.map((tool) => (
          <TooltipButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            onClick={() => handleToolClick(tool.id)}
          />
        ))}
      </div>
      <div className="mt-auto">
        <TooltipButton
            icon={Sparkles}
            label="LIBRA AI"
            onClick={() => handleToolClick('libra')}
          />
      </div>
    </div>
  );
}
