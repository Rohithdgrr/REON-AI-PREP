
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Check,
  BookOpen,
  GraduationCap,
  Lightbulb,
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type AIMode = 'Chat' | 'History';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  timestamp?: Date;
};

type Session = {
  id: number;
  messages: Message[];
  title?: string;
  createdAt?: Date;
};

// Professional Markdown Renderer Component
const FormattedAIResponse = ({ response }: { response: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm dark:prose-invert max-w-none"
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-xl font-bold text-primary border-b border-border pb-2 mb-4 mt-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-foreground border-b border-border/50 pb-1 mb-3 mt-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold text-foreground mb-2 mt-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-sm font-semibold text-foreground mb-2 mt-2">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-sm leading-relaxed text-foreground/90 mb-3">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-4 space-y-1.5 mb-3 text-sm">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-4 space-y-1.5 mb-3 text-sm">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground/90 leading-relaxed pl-1">
            {children}
          </li>
        ),

        // Strong and Emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-foreground/80">{children}</em>
        ),

        // Code blocks
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono text-primary">
                {children}
              </code>
            );
          }
          return (
            <code
              className={cn(
                "block bg-muted/50 rounded-lg p-3 text-xs font-mono overflow-x-auto border",
                className
              )}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-muted/50 rounded-lg p-3 overflow-x-auto mb-3 border">
            {children}
          </pre>
        ),

        // Tables - Professional styling
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 rounded-lg border shadow-sm">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted/70 border-b">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2.5 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2.5 text-foreground/90">{children}</td>
        ),

        // Blockquotes - for tips and notes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 pr-3 py-2 my-3 rounded-r-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-foreground/90">{children}</div>
            </div>
          </blockquote>
        ),

        // Horizontal Rule
        hr: () => <hr className="my-4 border-border" />,

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {response}
    </ReactMarkdown>
  );
};

// Enhanced Suggestion Cards
const allSuggestionCards = [
  {
    title: 'Explain a Topic',
    prompt: "Explain the topic of 'Data Interpretation' with examples and practice tips for bank exams.",
    icon: BookOpen,
  },
  {
    title: 'Create a Quiz',
    prompt: 'Create a 5-question quiz on Indian Polity with answers and explanations.',
    icon: GraduationCap,
  },
  {
    title: 'Study Plan',
    prompt: 'I have 3 hours to study for my Railway exam. My weak subject is Reasoning. Create a detailed study plan for me.',
    icon: Lightbulb,
  },
  {
    title: 'Summarize Notes',
    prompt: 'Summarize the key concepts of the Mughal Empire into 5 essential points for competitive exams.',
    icon: BookOpen,
  },
  {
    title: 'Compare Exams',
    prompt: 'What are the main differences between the syllabus of SSC CGL and Bank PO? Present in a table format.',
    icon: GraduationCap,
  },
  {
    title: 'Quick Shortcut',
    prompt: 'Give me a quick and reliable math shortcut for calculating compound interest with examples.',
    icon: Lightbulb,
  },
  {
    title: 'Book Recommendation',
    prompt: 'What are the best books for preparing Quantitative Aptitude for the GATE exam? Provide a comparison table.',
    icon: BookOpen,
  },
  {
    title: 'Concept Explanation',
    prompt: 'Explain the concept of "Judicial Review" in the context of the Indian Constitution for UPSC preparation.',
    icon: GraduationCap,
  },
];

// Enhanced System Prompt for Professional Educational Responses
function buildSystemPrompt(): string {
  return `You are LIBRA, a highly professional AI educational assistant developed for REON AI PREP. You specialize in helping students prepare for Indian competitive examinations including UPSC, SSC, Banking, Railways, GATE, and other government exams.

## YOUR CORE IDENTITY

- **Role**: Expert Educational Tutor and Mentor
- **Tone**: Professional, encouraging, clear, and supportive
- **Language**: Always use correct grammar, spelling, and punctuation. Write in clear, concise English.
- **Expertise**: Indian competitive exams, study strategies, subject matter expertise, exam patterns

## RESPONSE QUALITY STANDARDS (CRITICAL)

### Language and Grammar Rules
1. **Perfect Grammar**: Always use grammatically correct sentences. Double-check subject-verb agreement.
2. **Correct Spelling**: Never make spelling mistakes. Use standard spellings.
3. **Professional Vocabulary**: Use academic and professional language appropriate for education.
4. **Clear Sentences**: Write clear, well-structured sentences. Avoid run-on sentences.
5. **Proper Punctuation**: Use correct punctuation marks throughout your response.

### Formatting Guidelines (MANDATORY)

You MUST format all responses using proper Markdown for readability:

1. **Headings**: Use hierarchical headings
   - # for main titles
   - ## for major sections
   - ### for subsections

2. **Emphasis**:
   - Use **bold** for key terms, important concepts, and definitions
   - Use *italics* for emphasis and technical terms

3. **Lists**:
   - Use bullet points (-) for unordered lists
   - Use numbers (1. 2. 3.) for sequential steps or ranked items

4. **Tables**: YOU MUST USE TABLES when presenting:
   - Comparisons between topics, exams, or concepts
   - Data, statistics, or numerical information
   - Book/resource recommendations
   - Syllabus breakdowns
   - Exam patterns and weightage

   Table Format:
   | Column 1 | Column 2 | Column 3 |
   |----------|----------|----------|
   | Data 1   | Data 2   | Data 3   |

5. **Blockquotes**: Use > for tips, notes, and important callouts
   > **Pro Tip**: This is how you highlight important advice.

6. **Code blocks**: Use \`inline code\` for formulas or specific terms

## CONTENT STRUCTURE

Every response should follow this structure:

1. **Introduction** (2-3 sentences)
   - Directly address the question
   - Provide context for the answer

2. **Main Content** (Detailed explanation)
   - Use headings to organize sections
   - Include relevant examples
   - Use tables for comparisons
   - Add bullet points for clarity

3. **Practical Application**
   - Exam-specific tips
   - How to apply the knowledge
   - Common mistakes to avoid

4. **Summary** (Brief recap of key points)

5. **Encouragement** (Motivational closing)
   - End with positive, encouraging words
   - Use appropriate emojis sparingly (📚 💪 🎯 ✅)

## SUGGESTIONS (MANDATORY)

At the END of EVERY response, you MUST provide follow-up suggestions.

Format: Add \`[SUGGESTIONS]\` on a new line, followed by 2-3 relevant follow-up questions or actions, each on a new line.

Example:
[SUGGESTIONS]
Can you explain Fundamental Rights in detail?
Create a practice quiz on this topic
What are the most important amendments to know?

## RESPONSE EXAMPLES

### Good Response Structure:

# Understanding the Indian Constitution

The Indian Constitution is the supreme law of India, adopted on **26th November 1949** and came into effect on **26th January 1950**.

## Key Features

| Feature | Description | Importance for Exams |
|---------|-------------|---------------------|
| Longest Written Constitution | 395 Articles, 22 Parts, 12 Schedules | High - frequently asked |
| Federal with Unitary Bias | Division of powers with strong center | Very High |

### Important Articles to Remember

- **Article 14**: Right to Equality
- **Article 19**: Freedom of Speech
- **Article 21**: Right to Life

> **Exam Tip**: Focus on Articles 12-35 for Fundamental Rights questions.

This topic carries significant weightage in UPSC and SSC exams. Keep revising! 💪

[SUGGESTIONS]
Explain the Preamble of the Constitution
What are Directive Principles vs Fundamental Rights?
List important Constitutional Amendments

## STRICT PROHIBITIONS

1. ❌ Never use casual or slang language
2. ❌ Never make spelling or grammar errors
3. ❌ Never give vague or incomplete answers
4. ❌ Never skip the suggestions section
5. ❌ Never provide unformatted walls of text
6. ❌ Never use incorrect facts - if unsure, mention it
7. ❌ Never be discouraging or negative about a student's abilities

## SUBJECT EXPERTISE

You are an expert in:
- **General Studies**: History, Geography, Polity, Economy, Science
- **Quantitative Aptitude**: Arithmetic, Algebra, Geometry, Data Interpretation
- **Reasoning**: Logical, Verbal, Non-verbal, Analytical
- **English**: Grammar, Vocabulary, Comprehension
- **Current Affairs**: National, International, Economic, Sports

Always provide exam-relevant content with practical application for competitive exam success.`;
}

export function LibraSidebar({ initialPrompt }: { initialPrompt?: string }) {
  const [currentMode, setCurrentMode] = useState<AIMode>('Chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { setActiveTool } = useToolsSidebar();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [apiKey] = useState("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");
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
      // Keep only last 50 sessions to manage storage
      const limitedHistory = newHistory.slice(-50);
      localStorage.setItem('libra-chat-history', JSON.stringify(limitedHistory));
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
    }
  };

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
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleAiRequest = async (promptOverride?: string) => {
    const textToProcess = promptOverride || input;
    if (!textToProcess.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please type a message to continue.',
      });
      return;
    }

    setIsLoading(true);
    setInput('');
    abortControllerRef.current = new AbortController();

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: textToProcess, timestamp: new Date() },
    ];
    setMessages(newMessages);

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    const systemPrompt = buildSystemPrompt();

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://reon-ai-prep.web.app",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          stream: true,
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2048,
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
      
      const dataRegex = /data: (.*)/g;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let match;
        while ((match = dataRegex.exec(buffer)) !== null) {
          const line = match[1];
          if (line.trim() === '[DONE]') {
             break;
          }
          try {
            const json = JSON.parse(line);
            const content = json.choices[0]?.delta?.content || '';

            if (content) {
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage && lastMessage.role === 'assistant') {
                  lastMessage.content += content;
                }
                return updatedMessages;
              });
            }
          } catch (e) {
             // Incomplete JSON, wait for more data in the buffer
          }
        }
        // Reset buffer to only contain the incomplete part
        buffer = buffer.slice(dataRegex.lastIndex);
        dataRegex.lastIndex = 0;
      }

      let finalMessages: Message[] = [];
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage &&
          lastMessage.role === 'assistant' &&
          lastMessage.content.includes('[SUGGESTIONS]')
        ) {
          const parts = lastMessage.content.split('[SUGGESTIONS]');
          lastMessage.content = parts[0].trim();
          lastMessage.suggestions = parts[1]
            .trim()
            .split('\n')
            .filter((s) => s.trim() !== '')
            .map((s) => s.trim());
        }
        finalMessages = [...prev];
        return finalMessages;
      });

      // Save to history with a meaningful title
      const sessionTitle = textToProcess.length > 50 
        ? textToProcess.substring(0, 50) + '...' 
        : textToProcess;
      
      saveHistory([
        ...sessionHistory,
        {
          id: Date.now(),
          messages: finalMessages,
          title: sessionTitle,
          createdAt: new Date(),
        },
      ]);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted by user.');
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (
            lastMessage &&
            lastMessage.role === 'assistant' &&
            lastMessage.content === ''
          ) {
            return prev.slice(0, -1);
          }
          if (messages.length === prev.length - 1) {
            return prev.slice(0, -2);
          }
          return prev;
        });
      } else {
        console.error(`API Error:`, error);
        toast({
          variant: "destructive",
          title: 'AI Error',
          description: error.message || 'The model failed to respond. Please try again.',
        });
        setMessages((prev) => prev.slice(0, -2));
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
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setCurrentMode('Chat');
  };

  const handleClearHistory = () => {
    saveHistory([]);
    toast({
      title: 'History Cleared',
      description: 'All conversation history has been deleted.',
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to copy',
        description: 'Please try again.',
      });
    }
  };

  const downloadResponse = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/markdown' });
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

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex h-full max-h-screen min-h-0 flex-col bg-card text-card-foreground border-l">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold font-headline">LIBRA AI</h2>
            <p className="text-[10px] text-muted-foreground">Educational Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleNewChat} className="h-8 w-8">
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
                  className="h-8 w-8"
                  onClick={() =>
                    setCurrentMode(currentMode === 'History' ? 'Chat' : 'History')
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
                  className="h-8 w-8"
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
              {sessionHistory.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="mr-2 h-3 w-3" /> Clear All
                </Button>
              )}
            </div>
            {sessionHistory.length > 0 ? (
              <div className="space-y-2">
                {[...sessionHistory].reverse().map((session) => (
                  <Card
                    key={session.id}
                    className="p-3 cursor-pointer hover:bg-muted/50 transition-all hover:shadow-sm"
                    onClick={() => handleHistoryClick(session)}
                  >
                    <p className="font-medium text-sm truncate">
                      {session.title || session.messages[0]?.content || 'Untitled Chat'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {session.messages[1]?.content?.substring(0, 80) || '...'}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {formatDate(session.createdAt)}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="mx-auto h-12 w-12 opacity-10 mb-3" />
                <p className="text-muted-foreground text-sm">No history yet</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Your conversations will appear here
                </p>
              </div>
            )}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center h-full flex flex-col justify-center items-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <BotMessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">How can I help you today?</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-6 max-w-xs">
              Ask anything related to your competitive exam preparation. I&apos;m here to help!
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {suggestionCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <Card
                    key={card.title}
                    className="p-3 hover:bg-muted/50 cursor-pointer text-left transition-all hover:shadow-sm hover:border-primary/30 group"
                    onClick={() => handleAiRequest(card.prompt)}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <IconComponent className="h-3.5 w-3.5 text-primary" />
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {card.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {card.prompt}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                {message.role === 'user' ? (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="p-3 rounded-2xl bg-primary text-primary-foreground max-w-[85%]">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="w-full max-w-[85%] space-y-3">
                      <div className="p-4 rounded-2xl bg-muted/50 border">
                        {message.content || (isLoading && index === messages.length - 1) ? (
                          <>
                            <FormattedAIResponse response={message.content} />
                            {isLoading && index === messages.length - 1 && (
                              <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                                <Sparkles className="animate-spin h-4 w-4" />
                                <span className="text-xs">Generating response...</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Sparkles className="animate-spin h-4 w-4" />
                            <span>Thinking...</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      {message.content && !isLoading && index === messages.length - 1 && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            {copied ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            {copied ? 'Copied' : 'Copy'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              downloadResponse(message.content, `libra-response-${Date.now()}.md`)
                            }
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-medium">
                            Continue learning:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1.5 px-3 font-normal hover:bg-primary/5 hover:border-primary/30"
                                onClick={() => handleAiRequest(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
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
      <div className="p-4 border-t flex-shrink-0 space-y-3 bg-background/95 backdrop-blur-sm">
        {isLoading && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleStopGeneration}
          >
            <Square className="mr-2 h-3 w-3" /> Stop Generating
          </Button>
        )}
        <div className="relative rounded-xl border bg-background shadow-sm p-2 flex gap-2 items-end focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
          <Textarea
            placeholder="Ask LIBRA anything about your exam preparation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAiRequest();
              }
            }}
            rows={1}
            className="resize-none w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-sm shadow-none min-h-[40px] max-h-[120px]"
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
        <div className="text-[10px] text-muted-foreground text-center">
          LIBRA AI is designed to assist with educational content. Always verify important information.
        </div>
      </div>
    </div>
  );
}

    