'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Sparkles,
  History,
  Download,
  Copy,
  Trash2,
  Plus,
  BotMessageSquare,
  Send,
  Paperclip,
  Square,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.substring(2, part.length - 2);
          const isHeader = !content.includes(' '); // Simple check if it's a header-like bold text

          return (
            <strong
              key={index}
              className={cn(
                'block my-2 font-semibold text-[0.9rem]',
                isHeader && 'text-sm'
              )}
            >
              {content}
            </strong>
          );
        }

        const lines = part.split('\n');
        const listItems: string[] = [];
        const otherContent: string[] = [];

        lines.forEach((line) => {
          if (/^\d+\.\s/.test(line)) {
            listItems.push(line);
          } else {
            otherContent.push(line);
          }
        });

        return (
          <React.Fragment key={index}>
            {otherContent.join('\n').trim() && (
              <p className="mb-1">{otherContent.join('\n')}</p>
            )}
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
  {
    title: 'Explain Topic',
    prompt: "Explain the topic of 'Data Interpretation' for bank exams.",
  },
  {
    title: 'Create Quiz',
    prompt: 'Create a 5-question quiz on Indian Polity.',
  },
  {
    title: 'Plan my day',
    prompt:
      'I have 3 hours to study for my Railway exam. My weak subject is Reasoning. Create a study plan for me.',
  },
  {
    title: 'Summarize Notes',
    prompt:
      'Summarize my notes on the Mughal Empire into 5 key points.',
  },
];

export function LibraSidebar({
  pageTitle,
  pageContent,
}: {
  pageTitle: string;
  pageContent?: string;
}) {
  const [currentMode, setCurrentMode] = useState<AIMode>('Chat');
  const [language, setLanguage] = useState<Language>('en');
  const [model, setModel] = useState<AIModel>('L1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const { toast } = useToast();
  const { setActiveTool } = useToolsSidebar();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('libraSessionHistory');
      if (savedHistory) setSessionHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error('Failed to load LIBRA history from localStorage', e);
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
  }, [sessionHistory, isLoading, currentMode]);

  const saveHistory = (newHistory: Session[]) => {
    const simplifiedHistory = newHistory.filter(
      (s) => s.mode === 'Chat' || s.mode === 'History'
    );
    setSessionHistory(simplifiedHistory);
    try {
      localStorage.setItem(
        'libraSessionHistory',
        JSON.stringify(simplifiedHistory)
      );
    } catch (e) {
      console.error('Failed to save LIBRA history to localStorage', e);
    }
  };

  const handleAiRequest = async (promptOverride?: string) => {
    const textToProcess = promptOverride || input;
    if (!textToProcess) {
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please type or provide content to process.',
      });
      return;
    }

    setIsLoading(true);
    setInput('');
    abortControllerRef.current = new AbortController();

    // Prepare the new session entry
    const currentInput = promptOverride || input;
    const newSession: Session = {
      id: Date.now(),
      mode: 'Chat',
      input: currentInput,
      responses: [''], // Start with an empty response
      currentResponseIndex: 0,
      language,
      model,
    };
    
    // Add the new session to history immediately
    const updatedHistory = [...sessionHistory, newSession];
    saveHistory(updatedHistory);

    const fullPrompt = `You are LIBRA, an AI assistant for competitive exam preparation. Your persona is helpful, encouraging, and an expert in subjects like Quantitative Aptitude, Reasoning, English, and General Awareness for Indian exams (Railway, Bank PO, etc.).

First, respond to the user's query in ${language} language. The user's input is: "${textToProcess}"

After providing the main response, you MUST add the following sections, separated by a horizontal rule (---):

---

**Summary:**
Provide a concise, one or two-sentence summary of your main response.

**Analogies:**
Give one or two simple analogies to help understand the core concept.

**Keywords & Definitions:**
List 2-3 important keywords from the topic and provide their definitions. Format as: **Keyword:** Definition.

**Corrected Prompt Grammar:**
Finally, provide the user's original prompt with any grammatical errors corrected. If there are no errors, simply state "The prompt grammar is correct."`;

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-70b-instruct',
            messages: [{ role: 'user', content: fullPrompt }],
            stream: true, // Enable streaming
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let finalResponse = '';
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        
        // Process server-sent events
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataString = line.substring(6);
            if (dataString === '[DONE]') {
              done = true;
              break;
            }
            try {
              const data = JSON.parse(dataString);
              if (data.choices && data.choices[0].delta.content) {
                const token = data.choices[0].delta.content;
                finalResponse += token;

                // Update the state in real-time
                setSessionHistory(prevHistory => {
                   const newHistory = [...prevHistory];
                   const sessionIndex = newHistory.findIndex(s => s.id === newSession.id);
                   if (sessionIndex > -1) {
                       newHistory[sessionIndex].responses[0] = finalResponse;
                   }
                   return newHistory;
                });
              }
            } catch (e) {
              console.error('Error parsing stream data:', e, 'line:', line);
            }
          }
        }
      }

    } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted by user.');
        } else {
          console.error(`API Error:`, error);
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'The model failed to respond. Check console.',
          });
        }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsLoading(false);
    }
  }


  const handleNewChat = () => {
    setSessionHistory([]);
    setInput('');
    setCurrentMode('Chat');
  };

  const handleClearHistory = () => {
    saveHistory([]);
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

  const handleHistoryClick = (session: Session) => {
    const newChatHistory = [
      {
        ...session,
        id: Date.now(),
      }
    ];
    setSessionHistory(newChatHistory);
    setCurrentMode('Chat');
  };

  const lastSession = sessionHistory[sessionHistory.length-1];

  return (
    <div className="flex h-full max-h-screen min-h-0 flex-col bg-card text-card-foreground border-l">
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
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>New Chat</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentMode === 'History' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() =>
                    setCurrentMode(
                      currentMode === 'History' ? 'Chat' : 'History'
                    )
                  }
                >
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>View History</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTool(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* MAIN CONTENT - SCROLLABLE */}
      <div
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
      >
        {currentMode === 'History' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm">Conversation History</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearHistory}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
            </div>
            {sessionHistory.length > 0 ? (
              sessionHistory.map((session) => (
                <div
                  key={session.id}
                  className="text-xs p-2 border rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition"
                  onClick={() => handleHistoryClick(session)}
                >
                  <p className="font-bold truncate">{session.input || 'Untitled Chat'}</p>
                  <p className="truncate text-muted-foreground mt-1">
                    {session.responses[session.currentResponseIndex]}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10 text-sm">
                No history yet.
              </p>
            )}
          </div>
        ) : sessionHistory.length === 0 ? (
           // Empty state
          <div className="text-center h-full flex flex-col justify-center items-center">
            <BotMessageSquare className="mx-auto h-16 w-16 opacity-10 mb-4" />
            <h3 className="text-lg font-semibold">How can I help you today?</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Ask anything related to your competitive exam prep.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-2 max-w-md w-full">
              {suggestionCards.map((card) => (
                <Card
                  key={card.title}
                  className="p-3 hover:bg-muted cursor-pointer text-left transition"
                  onClick={() => handleAiRequest(card.prompt)}
                >
                  <p className="font-semibold text-sm mb-1">{card.title}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {card.prompt}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessionHistory.map(session => (
              <React.Fragment key={session.id}>
                 {/* User bubble */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="p-3 rounded-2xl bg-primary text-primary-foreground max-w-sm">
                    <p className="text-sm">{session.input}</p>
                  </div>
                </div>

                {/* AI bubble */}
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="p-3 rounded-2xl bg-muted max-w-sm">
                    {session.responses[0] ? (
                      <>
                        <FormattedAIResponse response={session.responses[0]} />
                        <div className="flex items-center gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(session.responses[0])}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              downloadResponse(
                                session.responses[0],
                                `libra-response.txt`
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                       <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Sparkles className="animate-spin h-5 w-5" /> Thinking...
                        </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* INPUT AREA - FIXED */}
      <div className="p-4 border-t flex-shrink-0 space-y-3 bg-background">
        <div className="relative rounded-xl border bg-background shadow-sm p-2 flex gap-2 items-end">
          <Textarea
            placeholder="Ask LIBRA anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAiRequest();
              }
            }}
            rows={1}
            className="resize-none w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm shadow-none"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach File (Coming Soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            onClick={isLoading ? handleStopGeneration : () => handleAiRequest()}
            disabled={!isLoading && input.trim() === ''}
            size="icon"
            className="h-8 w-8 rounded-full flex-shrink-0"
          >
            {isLoading ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-[11px] text-muted-foreground text-center">
          LIBRA AI can make mistake . Check important info.
        </div>
      </div>
    </div>
  );
}
