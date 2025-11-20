

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, ArrowLeft, ArrowRight, Bot, Loader2, ChevronLeft, BarChart, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useToolsSidebar } from "@/hooks/use-tools-sidebar";

const manualQuizzes = [
    {
      id: "quiz1",
      title: "Quantitative Aptitude: Time & Work",
      questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Time & Work Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "A" })),
    },
    {
        id: "quiz2",
        title: "Reasoning: Blood Relations",
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Blood Relations Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "B" })),
    },
    {
        id: "quiz3",
        title: "General Knowledge: Indian History",
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Indian History Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "C" })),
    },
    {
        id: 'quiz4',
        title: 'English: Synonyms & Antonyms',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Synonym/Antonym Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "D" })),
    },
    {
        id: 'quiz5',
        title: 'Quant: Percentages',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Percentage Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "A" })),
    },
    {
        id: 'quiz6',
        title: 'Reasoning: Analogies',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Analogy Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "B" })),
    },
    {
        id: 'quiz7',
        title: 'GK: Indian Geography',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Indian Geography Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "C" })),
    },
    {
        id: 'quiz8',
        title: 'English: Idioms and Phrases',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Idiom/Phrase Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "D" })),
    },
    {
        id: 'quiz9',
        title: 'Quant: Simple & Compound Interest',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Interest Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "A" })),
    },
    {
        id: 'quiz10',
        title: 'Reasoning: Seating Arrangement',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Seating Arrangement Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "B" })),
    },
    {
        id: 'quiz11',
        title: 'GK: Indian Polity',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Indian Polity Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "C" })),
    },
    {
        id: 'quiz12',
        title: 'English: Prepositions',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Preposition Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "D" })),
    },
    {
        id: 'quiz13',
        title: 'Quant: Speed, Time & Distance',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Speed/Time/Distance Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "A" })),
    },
    {
        id: 'quiz14',
        title: 'Reasoning: Coding-Decoding',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Coding-Decoding Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "B" })),
    },
    {
        id: 'quiz15',
        title: 'GK: Famous Personalities',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Famous Personalities Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "C" })),
    },
    {
        id: 'quiz16',
        title: 'English: Articles',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Article Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "D" })),
    },
    {
        id: 'quiz17',
        title: 'Quant: Averages',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Averages Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "A" })),
    },
    {
        id: 'quiz18',
        title: 'Reasoning: Syllogism',
        questions: Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, question: `Syllogism Question ${i+1}`, options: ["A", "B", "C", "D"], correctAnswer: "B" })),
    },
].map(quiz => ({ ...quiz, questions: quiz.questions.map(q => ({ ...q, id: Math.random().toString(), question: q.question || "", explanation: "This is a placeholder explanation.", fastSolveTricks: "This is a placeholder trick.", analogies: "This is a placeholder analogy." })) }));


const aiQuickQuizzes = [
    { topic: "General Knowledge Mix", numQuestions: 30 },
    { topic: "Indian Polity", numQuestions: 30 },
    { topic: "Modern Indian History", numQuestions: 30 },
    { topic: "Quantitative Aptitude: Profit & Loss", numQuestions: 30 },
    { topic: "Reasoning: Analogies", numQuestions: 30 },
    { topic: "General Science: Biology", numQuestions: 30 },
    { topic: "Banking Awareness", numQuestions: 30 },
    { topic: "Current Affairs (Last 3 months)", numQuestions: 30 },
    { topic: "Geography: Rivers of India", numQuestions: 30 },
    { topic: "English: Error Spotting", numQuestions: 30 },
    { topic: "Quant: Number Series", numQuestions: 30 },
    { topic: "Reasoning: Direction Sense", numQuestions: 30 },
    { topic: "GK: Books and Authors", numQuestions: 30 },
    { topic: "Computer Knowledge", numQuestions: 30 },
    { topic: "Physics: Units & Measurements", numQuestions: 30 },
    { topic: "Chemistry: Acids & Bases", numQuestions: 30 },
    { topic: "Sports GK", numQuestions: 30 },
    { topic: "Important Dates & Days", numQuestions: 30 },
];

const pastQuizResults = [
    { id: "past-quiz-1", title: "Quantitative Aptitude: Time & Work", score: "25/30", accuracy: "83%" },
    { id: "past-quiz-2", title: "Reasoning: Blood Relations", score: "28/30", accuracy: "93%" },
    { id: "past-quiz-3", title: "AI Quiz: Indian History", score: "22/30", accuracy: "73%" },
];


type UserAnswers = { [key: string]: string };
type QuestionTimes = { [key: string]: number };

type QuizQuestion = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    fastSolveTricks?: string;
    analogies?: string;
};

type QuizData = {
    id: string;
    title: string;
    questions: QuizQuestion[];
};

type GenerateQuizOutput = {
  title: string;
  questions: Omit<QuizQuestion, 'id'>[];
}

const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

function buildQuizPrompt(input: { topic: string; subTopics?: string[]; numQuestions: number; difficultyLevel?: 'Easy' | 'Medium' | 'Hard'; specialization?: string; }): string {
    let prompt = `You are an expert quiz creator for competitive exams like Railway and Bank exams in India.

Generate a quiz with ${input.numQuestions} multiple-choice questions on the topic of "${input.topic}".
`;

    if (input.subTopics && input.subTopics.length > 0) {
        prompt += `Focus on the following sub-topics: ${input.subTopics.join(', ')}.\n`;
    }

    if (input.difficultyLevel) {
        prompt += `The difficulty of the questions should be: ${input.difficultyLevel}.\n`;
    }

    if (input.specialization) {
        prompt += `Specialize the quiz with a focus on: ${input.specialization}. For example, if the focus is "time management", include questions that are tricky to solve quickly.\n`;
    }

    prompt += `
For each question, you MUST provide:
1. "question": The question text.
2. "options": An array of 4 string options.
3. "correctAnswer": The string of the correct answer from the options.
4. "explanation": A detailed explanation for the correct answer.
5. "fastSolveTricks": Optional tips or tricks to solve the question quickly.
6. "analogies": Optional analogies to help understand the core concept.

The questions should be challenging and relevant to the exam syllabus.

Return the result ONLY in a valid JSON format. Do not add any introductory text, closing remarks, or markdown formatting. The output must be a single, parseable JSON object that strictly follows this schema:
{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string",
      "fastSolveTricks": "string",
      "analogies": "string"
    }
  ]
}
`;
    return prompt.trim();
}

export function QuizPage() {
  const [quizState, setQuizState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizData>(manualQuizzes[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [customTopic, setCustomTopic] = useState("Indian History");
  const [customSubTopics, setCustomSubTopics] = useState("");
  const [customNumQuestions, setCustomNumQuestions] = useState(5);
  const [customDifficulty, setCustomDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [customSpecialization, setCustomSpecialization] = useState("");

  const { toast } = useToast();
  const { setActiveTool } = useToolsSidebar();

  const [overallTime, setOverallTime] = useState(0);
  const [perQuestionTime, setPerQuestionTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<QuestionTimes>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const apiKey = "nJCcmgS1lSo13OVE79Q64QndL3nCDjQI";
  const model = "open-mistral-nemo";

  useEffect(() => {
    if (quizState === "in-progress") {
      timerRef.current = setInterval(() => {
        setOverallTime(prev => prev + 1);
        setPerQuestionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState]);

  const recordQuestionTime = (questionId: string) => {
      setQuestionTimes(prev => ({...prev, [questionId]: (prev[questionId] || 0) + perQuestionTime }));
      setPerQuestionTime(0);
  }

  const handleStartQuiz = (quizData: QuizData) => {
    setActiveQuiz(quizData);
    setQuizState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
    setOverallTime(0);
    setPerQuestionTime(0);
    setQuestionTimes({});
  };

  const handleGenerateAndStartQuiz = async (
    topic: string, 
    numQuestions: number, 
    subTopics?: string[], 
    difficulty?: 'Easy' | 'Medium' | 'Hard', 
    specialization?: string
) => {
    setIsGenerating(true);
    try {
        const prompt = buildQuizPrompt({
            topic,
            subTopics,
            numQuestions,
            difficultyLevel: difficulty,
            specialization,
        });

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`HTTP ${response.status}: ${err}`);
        }

        const data = await response.json();
        const jsonString = data.choices[0]?.message?.content;
        
        if (!jsonString) {
            throw new Error("No content received from AI.");
        }

        const result: GenerateQuizOutput = JSON.parse(jsonString);

        const quizData: QuizData = {
            id: `ai-quiz-${Date.now()}`,
            title: result.title,
            questions: result.questions.map((q, i) => ({...q, id: `q-${i}`})),
        }
        handleStartQuiz(quizData);
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "AI Quiz Generation Failed",
            description: e.message || "There was an error generating the quiz. Please try again."
        });
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const navigateQuestion = (newIndex: number) => {
    if (quizState !== "in-progress") return;
    const currentQuestionId = activeQuiz.questions[currentQuestionIndex].id;
    recordQuestionTime(currentQuestionId);
    setCurrentQuestionIndex(newIndex);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      navigateQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    recordQuestionTime(activeQuiz.questions[currentQuestionIndex].id);
    let correctAnswers = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizState("finished");
  };

  const handleAskLibra = (question: QuizQuestion) => {
    const prompt = `Deeply explain the following question and its solution. Break it down step-by-step.
Question: "${question.question}"
Options: ${question.options.join(", ")}
Correct Answer: ${question.correctAnswer}
Explanation: ${question.explanation}`;
    setActiveTool({ id: 'libra', payload: { prompt } });
  };

  if (quizState === "not-started") {
    return (
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Quiz Arena
            </h1>
            <p className="text-muted-foreground">Choose from a topic-wise quiz, or let AI generate one for you!</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Topic-wise Quizzes</CardTitle>
                <CardDescription>Test your knowledge on specific topics with our manually curated quizzes.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {manualQuizzes.map(quiz => (
                    <Button key={quiz.id} variant="outline" className="h-auto py-4" onClick={() => handleStartQuiz(quiz)}>
                        <div className="flex flex-col items-center text-center">
                            <p className="font-semibold">{quiz.title}</p>
                            <p className="text-xs text-muted-foreground">{quiz.questions.length} questions</p>
                        </div>
                    </Button>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> AI Quick Quizzes</CardTitle>
                <CardDescription>Let our AI generate a random quiz for you on a popular topic.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aiQuickQuizzes.map(quiz => (
                     <Button key={quiz.topic} variant="secondary" className="h-auto py-4" onClick={() => handleGenerateAndStartQuiz(quiz.topic, quiz.numQuestions)} disabled={isGenerating}>
                        <div className="flex flex-col items-center text-center">
                            <p className="font-semibold">{quiz.topic}</p>
                            <p className="text-xs text-muted-foreground">{quiz.numQuestions} questions</p>
                        </div>
                    </Button>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> Custom AI Quiz</CardTitle>
                <CardDescription>Create your own quiz by specifying a topic and number of questions.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input id="topic" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} placeholder="e.g. Indian History" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="sub-topics">Sub-topics (comma-separated)</Label>
                        <Input id="sub-topics" value={customSubTopics} onChange={(e) => setCustomSubTopics(e.target.value)} placeholder="e.g. Ancient, Medieval" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input id="specialization" value={customSpecialization} onChange={(e) => setCustomSpecialization(e.target.value)} placeholder="e.g. time management, previous mistakes, etc." />
                    </div>
                </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="num-questions">Number of Questions</Label>
                        <Select value={String(customNumQuestions)} onValueChange={(val) => setCustomNumQuestions(Number(val))}>
                            <SelectTrigger id="num-questions">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(6)].map((_, i) => (
                                    <SelectItem key={i+1} value={String((i+1)*5)}>{(i+1)*5}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select value={customDifficulty} onValueChange={(val: "Easy" | "Medium" | "Hard") => setCustomDifficulty(val)}>
                            <SelectTrigger id="difficulty">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => handleGenerateAndStartQuiz(customTopic, customNumQuestions, customSubTopics.split(',').map(s => s.trim()).filter(s => s), customDifficulty, customSpecialization)} disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate & Start Custom Quiz"}
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Previous Quiz Results</CardTitle>
                <CardDescription>Analyze your past performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quiz Name</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Accuracy</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pastQuizResults.map((result) => (
                            <TableRow key={result.id}>
                                <TableCell className="font-medium">{result.title}</TableCell>
                                <TableCell>{result.score}</TableCell>
                                <TableCell>{result.accuracy}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">
                                        <BarChart className="mr-2 h-4 w-4" />
                                        View Analysis
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "finished") {
    return (
      <div className="flex flex-col gap-6">
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Quiz Results
            </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>You scored {score}/{activeQuiz.questions.length}!</CardTitle>
             <CardDescription className="flex items-center gap-4">
              <span>{score! / activeQuiz.questions.length > 0.7 ? "Great job! You've got a good grasp of the concepts." : "Keep practicing! You'll get there."}</span>
              <span className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4" /> Total Time: {formatTime(overallTime)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {activeQuiz.questions.map((q, index) => (
              <Card key={q.id} className="p-4 bg-muted/20 data-[correct=true]:border-green-500 data-[correct=false]:border-red-500 border-l-4">
                 <div className="flex justify-between items-start">
                    <p className="font-semibold flex-1 pr-4">{index + 1}. {q.question}</p>
                    <Badge variant="outline" className="flex-shrink-0">
                        <Timer className="mr-2 h-3 w-3"/>{formatTime(questionTimes[q.id] || 0)}
                    </Badge>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'} className={userAnswers[q.id] === q.correctAnswer ? "bg-green-100 text-green-800" : ""}>{userAnswers[q.id] || "Not answered"}</Badge></p>
                  {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary">{q.correctAnswer}</Badge></p>}
                </div>
                <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-0 pt-3 mt-3 border-t">
                  <div className="flex-1 space-y-2">
                    {q.explanation && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {q.explanation}</p>}
                    {q.fastSolveTricks && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">💡 Trick to Solve Fast:</span> {q.fastSolveTricks}</p>}
                    {q.analogies && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">🧠 Analogy:</span> {q.analogies}</p>}
                  </div>
                   <Button variant="outline" size="sm" onClick={() => handleAskLibra(q)}><Bot className="mr-2 h-4 w-4" /> Ask LIBRA AI</Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setQuizState("not-started")} className="w-full">Back to Quiz Arena</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = activeQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
           <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{activeQuiz.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-1.5"><Timer className="h-4 w-4"/> {formatTime(perQuestionTime)}</div>
                <div className="flex items-center gap-1.5"><Timer className="h-4 w-4 text-primary"/> {formatTime(overallTime)}</div>
            </div>
          </div>
          <CardDescription>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-lg mb-4">{currentQuestion.question}</p>
          <RadioGroup
            value={userAnswers[currentQuestion.id]}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            className="space-y-2"
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-accent">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-base flex-1 cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
              Submit Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
