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
import { useToast } from '@/hooks/use-toast';
import { useToolsSidebar } from '@/hooks/use-tools-sidebar';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';


type AIMode = 'Chat' | 'History';

type Message = {
    role: 'user' | 'assistant';
    content: string;
}

type Session = {
  id: number;
  mode: AIMode;
  input: string;
  response: string;
};

const FormattedAIResponse = ({ response }: { response: string }) => {
    // Process markdown-like lists (unordered and ordered) and bold/italic text.
    const htmlContent = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/(\n|^)---(\n|$)/g, '$1<hr class="my-4 border-border" />$2') // Horizontal rule
        .replace(/(\n|^)([-*] .+(\n|$))+/g, (match) => { // Unordered lists
            const items = match.trim().split('\n').map(item => `<li>${item.replace(/[-*] /, '').trim()}</li>`).join('');
            return `<ul class="list-disc list-inside space-y-1 my-3">${items}</ul>`;
        })
        .replace(/(\n|^)(\d+\. .+(\n|$))+/g, (match) => { // Ordered lists
            const items = match.trim().split('\n').map(item => `<li>${item.replace(/\d+\. /, '').trim()}</li>`).join('');
            return `<ol class="list-decimal list-inside space-y-1 my-3">${items}</ol>`;
        });

    return (
        <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

const allSuggestionCards = [
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
  {
      title: 'Compare Exams',
      prompt: 'What are the main differences between the syllabus of SSC CGL and Bank PO?'
  },
  {
      title: 'Give me a shortcut',
      prompt: 'Give me a quick math shortcut for calculating compound interest.'
  },
  {
      title: 'Suggest a Book',
      prompt: 'What is the best book for preparing Quantitative Aptitude for the GATE exam?'
  },
  {
      title: 'Explain a Concept',
      prompt: 'Explain the concept of "Judicial Review" in the context of the Indian Constitution for UPSC prep.'
  }
];

function buildSystemPrompt(): string {
    return `You are LIBRA, an expert AI assistant integrated into the REON AI PREP application. Your primary role is to help users prepare for competitive government exams in India, such as Bank PO, SBI PO, and Railway (RRB NTPC) exams.

**Your Core Directives:**
1.  **Expertise**: Act as an expert tutor. Provide accurate, well-structured, and helpful information related to exam subjects (Quantitative Aptitude, Reasoning, English, General Awareness), study strategies, and exam patterns.
2.  **Clarity and Formatting**:
    *   Use clear and simple language. Avoid jargon where possible, or explain it if necessary.
    *   Structure your responses for readability. Use **bold text** for headings and key terms. Use bullet points (\`-\` or \`*\`) for lists.
    *   Ensure perfect spelling and grammar. Your responses must be professional and polished.
3.  **Tone**: Be encouraging, supportive, and positive. Motivate the user in their preparation journey.
4.  **Functionality**:
    *   If asked to explain a topic, break it down into simple concepts.
    *   If asked to create a quiz, provide multiple-choice questions with clear options and a correct answer.
    *   If asked for a study plan, make it actionable and realistic.

**Example Interaction:**

*User:* "Explain Syllogism."

*Your Ideal Response:*
"Of course! Let's break down Syllogism.

**What is Syllogism?**
Syllogism is a part of logical reasoning where you are given a few statements (also called premises) and you have to deduce a conclusion from them. The key is to assume the statements are 100% true, even if they don't make sense in the real world.

**Key Components:**
- **Statements/Premises:** These are the facts you are given. (e.g., "All cats are dogs.")
- **Conclusion:** This is what you need to determine is true or false based on the statements.

Let's try a simple example:
- **Statement 1:** All A are B.
- **Statement 2:** All B are C.
- **Conclusion:** All A are C.

In this case, the conclusion is valid. The best way to solve these is by using Venn diagrams. Would you like me to explain how to use Venn diagrams for Syllogism?"
`;
}


export function LibraSidebar({ initialPrompt }: { initialPrompt?: string }) {
  const [currentMode, setCurrentMode] = useState<AIMode>('Chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const { setActiveTool } = useToolsSidebar();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [apiKey] = useState("nJCcmgS1lSo13OVE79Q64QndL3nCDjQI");
  const [suggestionCards, setSuggestionCards] = useState(allSuggestionCards.slice(0, 4));

  useEffect(() => {
    // Shuffle and pick 4 random suggestions on component mount
    const shuffled = [...allSuggestionCards].sort(() => 0.5 - Math.random());
    setSuggestionCards(shuffled.slice(0, 4));
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (messages.length === 0) {
      // Reshuffle suggestions when starting a new chat
      const shuffled = [...allSuggestionCards].sort(() => 0.5 - Math.random());
      setSuggestionCards(shuffled.slice(0, 4));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);


  const handleAiRequest = async (promptOverride?: string) => {
    const textToProcess = promptOverride || input;
    if (!textToProcess) {
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please type a message.',
      });
      return;
    }

    setIsLoading(true);
    setInput('');
    abortControllerRef.current = new AbortController();
    
    const newMessages: Message[] = [...messages, { role: 'user', content: textToProcess }];
    setMessages(newMessages);

    // Add an empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const systemPrompt = buildSystemPrompt();

    try {
       const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "open-mistral-nemo",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...newMessages.map(m => ({ role: m.role, content: m.content }))
                ],
                stream: true,
            }),
            signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        if (!response.body) {
            throw new Error("Response body is empty.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data.trim() === '[DONE]') break;
                    try {
                        const json = JSON.parse(data);
                        const content = json.choices[0]?.delta?.content || '';
                        if (content) {
                            setMessages(prevMessages => {
                                const updatedMessages = [...prevMessages];
                                const lastMessage = updatedMessages[updatedMessages.length - 1];
                                if (lastMessage && lastMessage.role === 'assistant') {
                                    lastMessage.content += content;
                                }
                                return updatedMessages;
                            });
                        }
                    } catch (e) {
                         console.error('Error parsing streaming JSON:', e);
                    }
                }
            }
        }

    } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted by user.');
          // Remove the user message and the empty assistant message
          setMessages(prev => prev.slice(0, -2));
        } else {
             console.error(`API Error:`, error);
              toast({
                  variant: "destructive",
                  title: 'AI Error',
                  description: error.message || 'The model failed to respond. Please check console.',
              });
              // Remove the user message and the empty assistant message
             setMessages(prev => prev.slice(0, -2));
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
    setMessages([]);
    setInput('');
    setCurrentMode('Chat');
  };

  const handleClearHistory = () => {
    setSessionHistory([]);
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
    setMessages([
        { role: 'user', content: session.input },
        { role: 'assistant', content: session.response },
    ]);
    setCurrentMode('Chat');
  };

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
                    {session.response}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10 text-sm">
                No history yet.
              </p>
            )}
          </div>
        ) : messages.length === 0 ? (
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
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                {message.role === 'user' ? (
                    <div className="flex items-start gap-3 justify-end">
                      <div className="p-3 rounded-2xl bg-primary text-primary-foreground max-w-sm">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="p-3 rounded-2xl bg-muted max-w-sm">
                        {(message.content || isLoading) ? (
                          <>
                            <FormattedAIResponse response={message.content} />
                            {isLoading && index === messages.length -1 && (
                              <Sparkles className="animate-spin h-5 w-5 text-muted-foreground mt-2" />
                            )}
                            {message.content && !isLoading && index === messages.length -1 && (
                              <div className="flex items-center gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(message.content)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    downloadResponse(
                                      message.content,
                                      `libra-response.txt`
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                           <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Sparkles className="animate-spin h-5 w-5" /> Thinking...
                            </div>
                        )}
                      </div>
                    </div>
                )}
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
          LIBRA AI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}
