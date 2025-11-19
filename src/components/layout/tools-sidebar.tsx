
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
import { InAppBrowser } from '../in-app-browser';
import { AdvancedCalendar } from '../advanced-calendar';
import { SimpleStopwatch } from '../simple-stopwatch';
import { Textarea } from '../ui/textarea';
import { NotificationsPanel } from '../notifications-panel';
import { answerQuestionsWithAI } from '@/ai/flows/answer-questions-with-ai';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TodoList } from '../todo-list';

function LibraAI() {
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
        <div className="flex flex-col h-full">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-foreground">✨ Ask LIBRA</h3>
            </div>
            <div className="flex flex-col flex-1 py-4">
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
        </div>
    )
}


const toolComponents: Record<string, React.ComponentType | undefined> = {
  notes: () => (
    <>
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-foreground">My Notes</h3>
      </div>
      <div className="py-4 h-full">
        <Textarea
          className="h-full resize-none"
          placeholder="Start typing your notes here..."
        />
      </div>
    </>
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
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
      </div>
      <NotificationsPanel />
    </>
  ),
  browser: () => <div className="h-full flex flex-col"><InAppBrowser /></div>,
  libra: LibraAI,
};

export function ToolsSidebar() {
  const { isOpen, activeTool, setActiveTool } = useToolsSidebar();

  const ActiveToolComponent = activeTool ? toolComponents[activeTool] : null;

  return (
    <div
      className={cn(
        'hidden sm:block transition-all duration-300 ease-in-out',
        isOpen ? 'w-[400px]' : 'w-0'
      )}
    >
      <div className={cn("h-full bg-background border-l", isOpen ? 'p-4' : 'p-0')}>
        {isOpen && activeTool && (
          <div className="flex flex-col h-full">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {ActiveToolComponent ? <ActiveToolComponent /> : <p>Tool not found</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
