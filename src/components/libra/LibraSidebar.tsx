
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, X, Sparkles, History, Download, Copy, Trash2, Undo2, PanelRightOpen, Plus, BotMessageSquare, Send, Paperclip, Vote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useToolsSidebar } from '@/hooks/use-tools-sidebar';
import { Card } from '../ui/card';

type AIMode = 'Chat' | 'History';
type Language = 'en' | 'hi' | 'te' | 'ta';
type AIModel = 'L1';
type Session = {
  id: number;
  mode: AIMode;
  input: string;
  responses: string[];
  currentResponseIndex: number;
  language: Language;
  model: AIModel;
};

const FormattedAIResponse = ({ response }: { response: string }) => {
  const parts = response.split(/(\*\*.*?\*\*)/g).filter(Boolean);

  return (
    <div className="whitespace-pre-wrap font-sans text-sm">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.substring(2, part.length - 2);
          const isHeader = !content.includes(' '); // Simple check if it's a header-like bold text

          return (
            <strong key={index} className={cn("block my-3 font-semibold", isHeader && "text-base")}>
              {content}
            </strong>
          );
        }
        
        const lines = part.split('\n');
        const listItems: string[] = [];
        const otherContent: string[] = [];

        lines.forEach(line => {
           if (/^\d+\.\s/.test(line)) {
               listItems.push(line);
           } else {
               otherContent.push(line);
           }
        });

        return (
          <React.Fragment key={index}>
            <p>{otherContent.join('\n')}</p>
            {listItems.length > 0 && (
                <ol className="list-decimal list-inside space-y-1 my-2">
                    {listItems.map((item, i) => (
                        <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                    ))}
                </ol>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const suggestionCards = [
    { title: "Explain Topic", prompt: "Explain the topic of 'Data Interpretation' for bank exams." },
    { title: "Create Quiz", prompt: "Create a 5-question quiz on Indian Polity." },
    { title: "Plan my day", prompt: "I have 3 hours to study for my Railway exam. My weak subject is Reasoning. Create a study plan for me." },
    { title: "Summarize Notes", prompt: "Summarize my notes on the Mughal Empire into 5 key points." },
]


export function LibraSidebar({ pageTitle, pageContent }: { pageTitle: string; pageContent?: string }) {
  const [currentMode, setCurrentMode] = useState<AIMode>('Chat');
  const [language, setLanguage] = useState<Language>('en');
  const [model, setModel] = useState<AIModel>('L1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const { toast } = useToast();
  const { setActiveTool } = useToolsSidebar();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('libraSessionHistory');
      if (savedHistory) setSessionHistory(JSON.parse(savedHistory));
    } catch (e) { console.error("Failed to load LIBRA history from localStorage", e); }
  }, []);

   useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [sessionHistory, isLoading]);


  const saveHistory = (newHistory: Session[]) => {
    const simplifiedHistory = newHistory.filter(s => s.mode === 'Chat' || s.mode === 'History');
    setSessionHistory(simplifiedHistory);
    try {
      localStorage.setItem('libraSessionHistory', JSON.stringify(simplifiedHistory));
    } catch (e) { console.error("Failed to save LIBRA history to localStorage", e); }
  };

  const handleAiRequest = async (promptOverride?: string) => {
    const textToProcess = promptOverride || input || pageContent;
    if (!textToProcess) {
      toast({ variant: 'destructive', title: 'Input required', description: 'Please type or provide content to process.' });
      return;
    }

    setIsLoading(true);
    let finalResponse = '';

    const fullPrompt = `You are LIBRA, an AI assistant for competitive exam preparation. Your persona is helpful, encouraging, and an expert in subjects like Quantitative Aptitude, Reasoning, English, and General Awareness for Indian exams (Railway, Bank PO, etc.). Respond to the user's query in ${language} language. User input: "${textToProcess}"`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-70b-instruct",
          "messages": [
            { "role": "user", "content": fullPrompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      finalResponse = data.choices[0].message.content;

    } catch (error) {
      console.error(`API Error:`, error);
      toast({ variant: 'destructive', title: 'AI Error', description: 'The model failed to respond. Check console.' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
    
    const currentInput = promptOverride || input;
    const existingSessionIndex = sessionHistory.findIndex(s => s.mode === currentMode);
    let newHistory = [...sessionHistory];

    if (existingSessionIndex > -1) {
      const session = newHistory[existingSessionIndex];
      session.responses.push(finalResponse);
      session.currentResponseIndex = session.responses.length - 1;
      session.input = currentInput;
    } else {
      const newSession: Session = {
        id: Date.now(),
        mode: currentMode,
        input: currentInput,
        responses: [finalResponse],
        currentResponseIndex: 0,
        language,
        model,
      };
      newHistory.push(newSession);
    }
    saveHistory(newHistory);
    setInput('');
  };
  
  const handleNewChat = () => {
    const newHistory = sessionHistory.filter(s => s.mode !== 'Chat');
    saveHistory(newHistory);
    setInput('');
    setCurrentMode('Chat');
    toast({ title: 'New Chat Started' });
  };

  const handleRevert = (mode: AIMode) => {
    const sessionIndex = sessionHistory.findIndex(s => s.mode === mode);
    if (sessionIndex > -1) {
      const newHistory = [...sessionHistory];
      const session = newHistory[sessionIndex];
      if (session.currentResponseIndex > 0) {
        session.currentResponseIndex--;
        saveHistory(newHistory);
      }
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
    toast({ title: 'History Cleared' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const downloadResponse = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const currentSession = sessionHistory.find(s => s.mode === 'Chat');
  const currentResponse = currentSession ? currentSession.responses[currentSession.currentResponseIndex] : null;

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border-l">
      {/* Header */}
      <div className="p-2 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold font-headline">LIBRA AI</h2>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleNewChat}>
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>New Chat</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={currentMode === 'History' ? 'secondary' : 'ghost'} size="icon" onClick={() => setCurrentMode(currentMode === 'History' ? 'Chat' : 'History')}>
                  <History />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>View History</p></TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)}>
                  <X />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Close</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Messages Area */}
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMode === 'History' ? (
            <div className="space-y-4">
              <div className='flex justify-between items-center'>
                <h3 className="font-semibold">Conversation History</h3>
                <Button variant="destructive" size="sm" onClick={handleClearHistory}><Trash2 className="mr-2 h-4 w-4" /> Clear All</Button>
              </div>
              {sessionHistory.length > 0 ? sessionHistory.map(session => (
                <div key={session.id} className="text-xs p-2 border rounded-md bg-muted/50 cursor-pointer hover:bg-muted" onClick={() => {
                    // In a real app you might load this session
                    toast({ title: "Session clicked", description: "This would load the selected session."})
                }}>
                  <p className="font-bold">{session.mode}</p>
                  <p className="truncate text-muted-foreground mt-1">Input: {session.input}</p>
                  <p className="truncate text-muted-foreground">Last Response: {session.responses[session.responses.length -1]}</p>
                </div>
              )) : <p className="text-center text-muted-foreground py-10 text-sm">No history yet.</p>}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-muted-foreground"><Sparkles className="animate-spin h-5 w-5" /> Thinking...</div>
            </div>
          ) : currentResponse ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 justify-end">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground max-w-sm">
                  <p className="text-sm">{currentSession?.input}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary"/>
                </div>
                <div className="p-3 rounded-lg bg-muted max-w-sm">
                  <FormattedAIResponse response={currentResponse} />
                  <div className="flex items-center gap-1 mt-2">
                    {currentSession && currentSession.responses.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRevert('Chat')} disabled={currentSession.currentResponseIndex === 0}>
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    )}
                    {currentResponse && (
                      <>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(currentResponse)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => downloadResponse(currentResponse, `libra-response.txt`)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center h-full flex flex-col justify-center items-center">
                <BotMessageSquare className='mx-auto h-16 w-16 opacity-10 mb-4' />
                <h3 className="text-lg font-semibold">How can I help you today?</h3>
                <div className="grid grid-cols-2 gap-3 mt-6 max-w-md w-full">
                    {suggestionCards.map(card => (
                        <Card key={card.title} className="p-3 hover:bg-muted cursor-pointer" onClick={() => handleAiRequest(card.prompt)}>
                            <p className="font-semibold text-sm">{card.title}</p>
                        </Card>
                    ))}
                </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t flex-shrink-0 space-y-4 bg-background">
          <div className="relative rounded-lg border bg-background shadow-sm p-2 flex gap-2 items-end">
            <Textarea
              placeholder="Ask LIBRA anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiRequest(); }}}
              rows={1}
              className="resize-none w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm shadow-none"
            />
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8"><Paperclip className="h-4 w-4"/></Button></TooltipTrigger>
                    <TooltipContent><p>Attach File (Coming Soon)</p></TooltipContent>
                </Tooltip>
             </TooltipProvider>
            <Button onClick={() => handleAiRequest()} disabled={isLoading || input.trim() === ''} size="icon" className="h-8 w-8 rounded-full flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
           <div className="text-xs text-muted-foreground text-center">
              Context: {pageTitle}
           </div>
        </div>
      </div>
    </div>
  );
}
