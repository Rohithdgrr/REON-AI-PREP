
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, X, Sparkles, Wand2, Languages, Type, List, FileText, BotMessageSquare, History, Brain, Lightbulb, ChevronDown, Download, Copy, Trash2, Undo2, PanelRightClose, PanelRightOpen, Plus
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

const modeIcons: Record<AIMode, React.ElementType> = {
  Chat: BotMessageSquare, History: History,
};

const modePrompts: Record<AIMode, string> = {
  Chat: "You are LIBRA, an AI assistant. Respond to the user's query: ",
  History: "Provide the historical background and context for the following topic: ",
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

    const fullPrompt = `${modePrompts[currentMode]} In ${language} language. User input: "${textToProcess}"`;

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
  
  const currentSession = sessionHistory.find(s => s.mode === currentMode);
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
            {/* Mode Selector */}
            <div className="p-2 border-b flex-shrink-0">
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant={currentMode === 'Chat' ? 'secondary' : 'ghost'}
                  onClick={() => setCurrentMode('Chat')}
                >
                  <BotMessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
                <Button
                  variant={currentMode === 'History' ? 'secondary' : 'ghost'}
                  onClick={() => setCurrentMode('History')}
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </Button>
              </div>
            </div>
            
            {/* Response Area */}
            <ScrollArea className="flex-1 p-4">
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
                <div className="flex items-center gap-2 text-muted-foreground"><Sparkles className="animate-spin h-4 w-4" /> Thinking...</div>
              ) : currentResponse ? (
                <FormattedAIResponse response={currentResponse} />
              ) : (
                <div className="text-center text-muted-foreground pt-16">
                  {React.createElement(modeIcons[currentMode], { className: 'mx-auto h-12 w-12 opacity-30 mb-4' })}
                  <p className="font-semibold">LIBRA AI - {currentMode} Mode</p>
                  <p className="text-xs">Ask a question or provide context below.</p>
                </div>
              )}
            </ScrollArea>
            
            {/* Context and controls */}
            <div className="p-2 border-t text-xs text-muted-foreground flex items-center justify-between flex-shrink-0">
                <p className="truncate">Context: {pageTitle}</p>
                <div className="flex items-center gap-1">
                  {currentSession && currentSession.responses.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRevert(currentMode)} disabled={currentSession.currentResponseIndex === 0}>
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  )}
                  {currentResponse && (
                    <>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(currentResponse)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => downloadResponse(currentResponse, `${currentMode}-${Date.now()}.txt`)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClearHistory}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-2 border-t flex flex-col gap-2 flex-shrink-0">
              <div className="flex gap-2">
                  <Textarea
                  placeholder={`Ask LIBRA or paste text for ${currentMode} mode...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  rows={2}
                  className="resize-none flex-1"
                  disabled={currentMode === 'History'}
                  />
                  <Button onClick={handleAiRequest} disabled={isLoading || currentMode === 'History'} size="icon" className="h-auto w-10">
                      <Sparkles className="h-5 w-5" />
                  </Button>
              </div>
              <div className="flex justify-start items-center gap-2">
                   <Select value={language} onValueChange={(v: Language) => setLanguage(v)} disabled={currentMode === 'History'}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                   <Select value={model} onValueChange={(v: AIModel) => setModel(v)} disabled={currentMode === 'History'}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">Llama 3.1 70B</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
             <TooltipProvider>
               {(Object.keys(modeIcons) as AIMode[]).map(mode => (
                  <Tooltip key={mode}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={currentMode === mode ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => {
                            setCurrentMode(mode);
                            setIsCollapsed(false);
                        }}
                      >
                        {React.createElement(modeIcons[mode])}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>{mode}</p></TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
