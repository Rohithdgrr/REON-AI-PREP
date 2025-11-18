'use client';

import {
  Calculator,
  Calendar as CalendarIcon,
  Clock,
  Notebook,
  Sparkles,
  Timer,
  Bell,
  Globe,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Textarea } from '../ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Calendar } from '../ui/calendar';
import { SimpleCalculator } from '../simple-calculator';
import { MultiTimer } from '../multi-timer';
import { SimpleStopwatch } from '../simple-stopwatch';
import { NotificationsPanel } from '../notifications-panel';
import { InAppBrowser } from '../in-app-browser';
import { useState } from 'react';
import { answerQuestionsWithAI } from '@/ai/flows/answer-questions-with-ai';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TodoList } from '../todo-list';

function TooltipButton({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
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
  const [libraQuestion, setLibraQuestion] = useState('');
  const [libraAnswer, setLibraAnswer] = useState('');
  const [isLibraLoading, setIsLibraLoading] = useState(false);
  const { toast } = useToast();

  const handleAskLibra = async () => {
    if (!libraQuestion.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a question.',
      });
      return;
    }
    setIsLibraLoading(true);
    setLibraAnswer('');
    try {
      const result = await answerQuestionsWithAI(libraQuestion);
      setLibraAnswer(result);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get an answer. Please try again.',
      });
      console.error(e);
    } finally {
      setIsLibraLoading(false);
    }
  };

  return (
    <div className="hidden sm:flex flex-col items-center gap-4 border-l bg-background p-2">
      <div className="flex-1 flex flex-col items-center gap-4 pt-14">
        {/* Notes Tool */}
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={Notebook} label="Notes" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" modal={false}>
            <SheetHeader>
              <SheetTitle>My Notes</SheetTitle>
            </SheetHeader>
            <div className="py-4 h-full">
              <Textarea
                className="h-full resize-none"
                placeholder="Start typing your notes here..."
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* To-Do List Tool */}
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={ListTodo} label="To-Do List" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" modal={false}>
            <SheetHeader>
              <SheetTitle>To-Do List</SheetTitle>
              <SheetDescription>Track your study tasks for the day.</SheetDescription>
            </SheetHeader>
            <TodoList />
          </SheetContent>
        </Sheet>
        
        {/* Calendar Tool */}
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={CalendarIcon} label="Calendar" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="flex justify-center items-start pt-16" modal={false}>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
            />
          </SheetContent>
        </Sheet>
        
        {/* Calculator Tool */}
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={Calculator} label="Calculator" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" modal={false}>
            <SheetHeader>
              <SheetTitle>Calculator</SheetTitle>
            </SheetHeader>
            <SimpleCalculator />
          </SheetContent>
        </Sheet>

        {/* Timer Tool */}
         <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={Timer} label="Timer" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" modal={false}>
            <SheetHeader>
              <SheetTitle>Timers</SheetTitle>
              <SheetDescription>Set multiple countdowns for your study sessions.</SheetDescription>
            </SheetHeader>
            <MultiTimer />
          </SheetContent>
        </Sheet>

        {/* Stopwatch Tool */}
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={Clock} label="Stopwatch" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" modal={false}>
            <SheetHeader>
              <SheetTitle>Stopwatch</SheetTitle>
              <SheetDescription>Track your time for practice questions.</SheetDescription>
            </SheetHeader>
            <SimpleStopwatch />
          </SheetContent>
        </Sheet>

        {/* Notifications Tool */}
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={Bell} label="Notifications" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" modal={false}>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <NotificationsPanel />
          </SheetContent>
        </Sheet>

        {/* In-App Browser Tool */}
         <Sheet>
          <SheetTrigger asChild>
            <div>
              <TooltipButton icon={Globe} label="In-App Browser" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="p-0" modal={false}>
            <InAppBrowser />
          </SheetContent>
        </Sheet>
      </div>
      <div className="mt-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="sr-only">LIBRA AI</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>✨ Ask LIBRA</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full py-4">
              <div className="flex-1 bg-muted rounded-lg p-4 text-sm overflow-y-auto">
                {isLibraLoading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Answering...</div> : (libraAnswer || "Ask a question to get started.")}
              </div>
              <div className="mt-4">
                <Textarea 
                  placeholder="Ask about this topic, get summaries, or generate quizzes..." 
                  value={libraQuestion}
                  onChange={(e) => setLibraQuestion(e.target.value)}
                  />
                <Button className="w-full mt-2" onClick={handleAskLibra} disabled={isLibraLoading}>
                  {isLibraLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
