
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, X, Sparkles, History, Download, Copy, Trash2, Undo2, PanelRightClose, PanelRightOpen, Plus, BotMessageSquare, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useToolsSidebar } from '@/hooks/use-tools-sidebar';

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

export function LibraSidebar({ pageTitle, pageContent }: { pageTitle: string; pageContent?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentMode, setCurrentMode] = useState<AIMode>('Chat');
  const [language, setLanguage] = useState<Language>('en');
  const [model, setModel] = useState<AIModel>('L1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const { toast } = useToast();
  const { setActiveTool } = useToolsSidebar();

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('libraSessionHistory');
      if (savedHistory) setSessionHistory(JSON.parse(savedHistory));
    } catch (e) { console.error("Failed to load LIBRA history from localStorage", e); }
  }, []);

  const saveHistory = (newHistory: Session[]) => {
    const simplifiedHistory = newHistory.filter(s => s.mode === 'Chat' || s.mode === 'History');
    setSessionHistory(simplifiedHistory);
    try {
      localStorage.setItem('libraSessionHistory', JSON.stringify(simplifiedHistory));
    } catch (e) { console.error("Failed to save LIBRA history to localStorage", e); }
  };

  const handleAiRequest = async () => {
    const textToProcess = input || pageContent;
    if (!textToProcess) {
      toast({ variant: 'destructive', title: 'Input required', description: 'Please type or provide content to process.' });
      return;
    }

    setIsLoading(true);
    let finalResponse = '';

    const fullPrompt = `You are LIBRA, an AI assistant. Respond to the user's query: In ${language} language. User input: "${textToProcess}"`;

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
    
    const existingSessionIndex = sessionHistory.findIndex(s => s.mode === currentMode);
    let newHistory = [...sessionHistory];

    if (existingSessionIndex > -1) {
      const session = newHistory[existingSessionIndex];
      session.responses.push(finalResponse);
      session.currentResponseIndex = session.responses.length - 1;
      session.input = textToProcess;
    } else {
      const newSession: Session = {
        id: Date.now(),
        mode: currentMode,
        input: textToProcess,
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
    <div className={cn("flex flex-col h-full bg-card text-card-foreground border-l", isCollapsed ? "w-14" : "w-full")}>
        {/* Header */}
        <div className="p-2 border-b flex items-center justify-between flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold font-headline">LIBRA AI</h2>
            </div>
          )}
          <div className={cn("flex items-center gap-1", isCollapsed && "flex-col w-full")}>
             {!isCollapsed && (
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
                </TooltipProvider>
             )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <PanelRightOpen /> : <PanelRightClose />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left"><p>{isCollapsed ? "Open Sidebar" : "Collapse Sidebar"}</p></TooltipContent>
              </Tooltip>
               <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)}>
                    <X />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left"><p>Close</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        {!isCollapsed && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMode === 'History' ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Conversation History</h3>
                  {sessionHistory.length > 0 ? sessionHistory.map(session => (
                    <div key={session.id} className="text-xs p-2 border rounded-md bg-muted/50">
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
                <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                  <BotMessageSquare className='mx-auto h-12 w-12 opacity-30 mb-4' />
                  <p className="font-semibold">How can I help you today?</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t flex-shrink-0 space-y-4">
              <div className="relative">
                  <Textarea
                  placeholder="Ask LIBRA anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiRequest(); }}}
                  rows={1}
                  className="resize-none w-full rounded-full border bg-background px-4 py-2 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-32"
                  />
                  <Button onClick={handleAiRequest} disabled={isLoading || input.trim() === ''} size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full">
                      <Send className="h-4 w-4" />
                  </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                   Context: {pageTitle}
              </div>
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center justify-start gap-2 p-2 pt-4">
             <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='secondary'
                        size="icon"
                        onClick={() => {
                            setCurrentMode('Chat');
                            setIsCollapsed(false);
                        }}
                      >
                        <BotMessageSquare />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>Chat</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size="icon"
                        onClick={() => {
                            setCurrentMode('History');
                            setIsCollapsed(false);
                        }}
                      >
                        <History />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>History</p></TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
