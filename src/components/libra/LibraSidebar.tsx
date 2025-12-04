

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
    suggestions?: string[];
}

type Session = {
  id: number;
  messages: Message[];
};

const FormattedAIResponse = ({ response }: { response: string }) => {
    // Enhanced to process markdown tables, lists, and text formatting.
    const htmlContent = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
        .replace(/(\n|^)---(\n|$)/g, '$1<hr class="my-4 border-border" />$2') // Horizontal rule
        // Unordered lists
        .replace(/(\n|^)([-*] .+(\n|$))+/g, (match) => {
            const items = match.trim().split('\n').map(item => `<li>${item.replace(/[-*] /, '').trim()}</li>`).join('');
            return `<ul class="list-disc list-inside space-y-1 my-3">${items}</ul>`;
        })
        // Ordered lists
        .replace(/(\n|^)(\d+\. .+(\n|$))+/g, (match) => {
            const items = match.trim().split('\n').map(item => `<li>${item.replace(/\d+\. /, '').trim()}</li>`).join('');
            return `<ol class="list-decimal list-inside space-y-1 my-3">${items}</ol>`;
        })
         // Markdown Tables
        .replace(/\|(.+?)\|\n *\|( *:?-+:? *\|)+ */g, (match) => {
            const lines = match.trim().split('\n');
            const headerLine = lines[0];
            const headers = headerLine.split('|').map(h => h.trim()).filter(Boolean);
            const rows = lines.slice(2);

            const thead = `<thead><tr class="border-b">${headers.map(h => `<th class="p-2 text-left font-semibold">${h}</th>`).join('')}</tr></thead>`;
            
            const tbody = `<tbody>${rows.map(rowLine => {
                const cells = rowLine.split('|').map(c => c.trim()).filter(Boolean);
                return `<tr class="border-b">${cells.map(c => `<td class="p-2">${c}</td>`).join('')}</tr>`;
            }).join('')}</tbody>`;

            return `<div class="overflow-x-auto my-4"><table class="w-full text-sm">${thead}${tbody}</table></div>`;
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
  return `You are LIBRA, an expert AI assistant for REON AI PREP, specializing in Indian competitive exams (UPSC, SSC, Banking, Railways, GATE). Your goal is to provide structured, accurate, and encouraging answers that are highly useful for aspirants.

**Your Core Directives:**

1.  **Expert Persona**: Act as an expert tutor. Provide well-researched, clear, and actionable information.
2.  **Structured Formatting (CRITICAL)**: Use Markdown to structure your responses. This is essential.
    *   **Headings**: Use \`#\`, \`##\`, and \`###\` for titles and sub-sections.
    *   **Bold/Italic**: Use \`**bold**\` for key terms and headings.
    *   **Lists**: Use bullet points (\`-\` or \`*\`) for lists.
    *   **Tables**: When comparing items, listing resources, or showing data, YOU MUST USE MARKDOWN TABLES. This is crucial for clarity.
        *   **Table Example:**
            \`\`\`
            | Feature         | Details                               |
            |-----------------|---------------------------------------|
            | Key Articles    | Art 14-18 (Right to Equality)         |
            | Important Cases | Kesavananda Bharati vs. State of Kerala |
            \`\`\`
3.  **Content Guidelines**:
    *   **Be Specific**: When asked about a topic like "Polity," don't just define it. Explain its importance for exams, list key sub-topics, mention important articles, suggest study resources, and provide recent updates.
    *   **Use Tables for Data**: For exam weightage, book recommendations, or topic breakdowns, a table is always better than a list.
    *   **Stay Relevant**: Keep your answers focused on the context of Indian competitive exams.
    *   **Encourage and Engage**: End your responses with a positive and encouraging note. Use emojis (like 📚, 🚀, 💪) to make the content engaging.
4.  **Proactive Suggestions (IMPORTANT!)**: At the end of every response, you MUST suggest 2-3 relevant follow-up questions or actions. Format these suggestions using a special separator: \`[SUGGESTIONS]\`. Each suggestion should be on a new line. This helps guide the user's learning journey.

**Example of a High-Quality Response:**

*User:* "What is Polity?"

*Your Ideal Response:*

### What is Polity? (Simple & Clear Explanation)
Polity refers to the system of government and the rules by which a country is governed. For Indian competitive exams, **Indian Polity** is a core subject that covers the Constitution, governmental structure, and administrative processes.

### Why is Polity Important for Government Exams?
| Exam              | Approx. Questions | Topics Asked Most                                    |
|-------------------|-------------------|------------------------------------------------------|
| UPSC CSE Prelims  | 12–18             | Constitution, Fundamental Rights, Parliament, Judiciary |
| SSC CGL/CHSL      | 6–12              | President, PM, Parliament, FR/DPSP, Amendments        |

Keep up the great work! Let me know if you want to dive deeper into any of these topics. 💪
[SUGGESTIONS]
Can you explain Fundamental Rights in detail?
What's the difference between the Lok Sabha and Rajya Sabha?
Create a 3-question quiz on the Preamble.
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

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('libra-chat-history');
      if (storedHistory) {
        setSessionHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
    }
  }, []);

  const saveHistory = (newHistory: Session[]) => {
    setSessionHistory(newHistory);
    try {
      localStorage.setItem('libra-chat-history', JSON.stringify(newHistory));
    } catch(e) {
      console.error("Failed to save chat history to localStorage", e);
    }
  }
  
  const shuffleSuggestions = () => {
    const shuffled = [...allSuggestionCards].sort(() => 0.5 - Math.random());
    setSuggestionCards(shuffled.slice(0, 4));
  };
  
  useEffect(() => {
    shuffleSuggestions();
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      handleAiRequest(initialPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  useEffect(() => {
    if (messages.length === 0) {
      shuffleSuggestions();
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
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; 

            for (const line of lines) {
                if (line.trim() === '' || !line.startsWith('data: ')) continue;
                
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
                     console.error('Error parsing streaming JSON:', e, 'line:', line);
                }
            }
        }
        
        let finalMessages: Message[] = [];
        setMessages(prev => {
            const lastMessage = prev[prev.length -1];
            if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content.includes('[SUGGESTIONS]')) {
                const parts = lastMessage.content.split('[SUGGESTIONS]');
                lastMessage.content = parts[0].trim();
                lastMessage.suggestions = parts[1].trim().split('\n').filter(s => s.trim() !== '');
            }
            finalMessages = [...prev];
            return finalMessages;
        });

        saveHistory([...sessionHistory, { id: Date.now(), messages: finalMessages }]);

    } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted by user.');
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content === '') {
                    return prev.slice(0, -1);
                }
                if(messages.length === prev.length -1) {
                    return prev.slice(0,-2);
                }
                return prev;
            });
        } else {
             console.error(`API Error:`, error);
              toast({
                  variant: "destructive",
                  title: 'AI Error',
                  description: error.message || 'The model failed to respond. Please check console.',
              });
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
    }
  }

  const handleNewChat = () => {
    setMessages([]);
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
    setMessages(session.messages);
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
                  <p className="font-bold truncate">{session.messages[0]?.content || 'Untitled Chat'}</p>
                  <p className="truncate text-muted-foreground mt-1">
                    {session.messages[1]?.content || '...'}
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
                      <div className="w-full max-w-sm space-y-3">
                         <div className="p-3 rounded-2xl bg-muted">
                            {(message.content || (isLoading && index === messages.length - 1)) ? (
                            <>
                                <FormattedAIResponse response={message.content} />
                                {isLoading && index === messages.length -1 && (
                                <Sparkles className="animate-spin h-5 w-5 text-muted-foreground mt-2" />
                                )}
                            </>
                            ) : (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Sparkles className="animate-spin h-5 w-5" /> Thinking...
                                </div>
                            )}
                         </div>
                        {message.content && !isLoading && index === messages.length -1 && (
                            <div className="flex items-center gap-2 justify-end">
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
                        {message.suggestions && message.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, i) => (
                                    <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1" onClick={() => handleAiRequest(suggestion)}>
                                        {suggestion}
                                    </Button>
                                ))}
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
        {isLoading && (
            <Button variant="outline" className="w-full" onClick={handleStopGeneration}>
                <Square className="mr-2 h-4 w-4" /> Stop Generating
            </Button>
        )}
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
            disabled={isLoading}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8"
                  disabled={true}
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
            onClick={() => handleAiRequest()}
            disabled={isLoading || input.trim() === ''}
            size="icon"
            className="h-8 w-8 rounded-full flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-[11px] text-muted-foreground text-center">
          LIBRA AI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}
