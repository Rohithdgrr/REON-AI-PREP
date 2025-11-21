

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Shield, FileClock, Info, BarChart, Bot, Loader2, Settings, ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";
import { useToolsSidebar } from "./hooks/use-tools-sidebar";

const upcomingTests = [
  {
    id: "mock-sbi-po-05",
    title: "SBI PO Prelims Full Mock Test #5",
    date: "Today",
    time: "9:00 PM",
    duration: "60 mins",
    questions: 100,
    status: "Live",
  },
   {
    id: "mock-rrb-ntpc-12",
    title: "RRB NTPC CBT-1 Full Mock Test #12",
    date: "Tomorrow",
    time: "9:00 AM",
    duration: "90 mins",
    questions: 120,
    status: "Upcoming",
  },
];

const manualMockTests = [
    { id: "manual-mock-1", title: "SBI Clerk Prelims Full Mock", questions: 100 },
    { id: "manual-mock-2", title: "IBPS PO Full Mock", questions: 100 },
    { id: "manual-mock-3", title: "RRB NTPC Stage 1 Mock", questions: 120 },
    { id: "manual-mock-4", title: "RRB Group D Mock", questions: 100 },
    { id: "manual-mock-5", title: "SSC CGL Tier 1 Mock", questions: 100 },
].map(mock => ({
    ...mock,
    questions: Array.from({ length: mock.questions }, (_, i) => ({
        id: `q-${i}`,
        question: `This is question number ${i+1} for the ${mock.title}. What is the correct answer?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "This is the detailed explanation for why Option A is the correct choice for this question.",
        fastSolveTricks: "A quick trick to solve this is to remember the key formula or shortcut related to this topic.",
        analogies: "Think of this problem like a real-world scenario to better understand the concept."
    }))
}));


const pastResults = [
  {
    id: 1,
    title: "SBI Clerk Prelims Full Mock",
    score: "78/100",
    rank: "1523",
    accuracy: "85%",
  },
  {
    id: 2,
    title: "AI Quick Mock: Reasoning",
    score: "25/35",
    rank: "N/A",
    accuracy: "71%",
  },
];


const aiQuickMocks = [
    { topic: "Full Syllabus Mock: Reasoning Section" },
    { topic: "Full Syllabus Mock: Quantitative Aptitude Section" },
    { topic: "Full Syllabus Mock: English Language Section" },
    { topic: "Full Syllabus Mock: General Awareness Section" },
];


const subTopicsOptions = [
    { id: "basics", label: "Basics & Fundamentals" },
    { id: "formulas", label: "Formulas & Core Concepts" },
    { id: "advanced", label: "Advanced Problems" },
    { id: "previous_years", label: "Previous Year Questions" },
];

const specializationOptions = [
    { id: "time_management", label: "Time Management" },
    { id: "conceptual_clarity", label: "Conceptual Clarity" },
    { id: "previous_mistakes", label: "Based on Previous Mistakes" },
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

type ActiveTest = {
    id: string;
    title: string;
    questions: QuizQuestion[];
}

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

export function MockTestPage() {
  const [testState, setTestState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { setActiveTool } = useToolsSidebar();

  const [apiKey] = useState("nJCcmgS1lSo13OVE79Q64QndL3nCDjQI");
  const [groqApiKey] = useState("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");

  const [customTopic, setCustomTopic] = useState("Full Syllabus Mock");
  const [customSubTopic, setCustomSubTopic] = useState<string>('Previous Year Questions');
  const [customOtherSubTopic, setCustomOtherSubTopic] = useState("");
  const [customNumQuestions, setCustomNumQuestions] = useState(100);
  const [customDifficulty, setCustomDifficulty] = useState<"Hard">("Hard");
  const [customSpecialization, setCustomSpecialization] = useState("Based on previous year papers");
  
  const [overallTime, setOverallTime] = useState(0);
  const [perQuestionTime, setPerQuestionTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<QuestionTimes>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (testState === "in-progress") {
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
  }, [testState]);

  const recordQuestionTime = (questionId: string) => {
      setQuestionTimes(prev => ({...prev, [questionId]: (prev[questionId] || 0) + perQuestionTime }));
      setPerQuestionTime(0);
  }

  const handleStartTest = (testData: ActiveTest) => {
    setActiveTest(testData);
    setTestState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
    setOverallTime(0);
    setPerQuestionTime(0);
    setQuestionTimes({});
  };
  
  const handleGenerateAndStart = async (
    topic: string, 
    numQuestions: number, 
    isQuickMock: boolean = false
) => {
    setIsGenerating(true);
    toast({ title: 'Generating AI Mock Test...', description: 'Please wait, this may take a moment.' });
    
    let allSubTopics = customSubTopic && !isQuickMock ? [customSubTopic] : [];
    if (customOtherSubTopic.trim() && !isQuickMock) {
        allSubTopics.push(customOtherSubTopic.trim());
    }

    const specialization = isQuickMock
        ? `A full mock test for the ${topic.replace('Full Syllabus Mock: ', '')} section based on previous year papers.`
        : customSpecialization || "A full mock test based on previous year papers and question patterns for competitive exams.";
    
    const prompt = buildQuizPrompt({ 
        topic: topic || customTopic, 
        subTopics: isQuickMock ? ["Previous Year Questions"] : allSubTopics,
        numQuestions: numQuestions || customNumQuestions,
        difficultyLevel: customDifficulty,
        specialization: specialization,
    });

    const processStream = async (response: Response) => {
        if (!response.body) throw new Error("Response body is empty.");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";
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
                        if (content) fullResponse += content;
                    } catch (e) { /* Ignore partial JSON */ }
                }
            }
        }
        return fullResponse;
    };
    
    try {
        const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({ model: "open-mistral-nemo", messages: [{ role: "user", content: prompt }], stream: true, response_format: { type: "json_object" } })
        });
        if (!mistralResponse.ok) throw new Error(`Mistral API Error: ${mistralResponse.statusText}`);
        const mistralResult = await processStream(mistralResponse);
        const result: GenerateQuizOutput = JSON.parse(mistralResult);
        const testData: ActiveTest = { id: `ai-test-${Date.now()}`, title: result.title, questions: result.questions.map((q, i) => ({ ...q, id: `q-${i}` })) };
        handleStartTest(testData);
        toast({ title: "Mock Test Generated!", description: `Your custom mock test "${result.title}" is ready. Starting now...` });

    } catch (mistralError: any) {
        console.warn("Mistral API failed, falling back to Groq:", mistralError.message);
        try {
            const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqApiKey}` },
                body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{ role: "user", content: prompt }], stream: true, response_format: { type: "json_object" } })
            });
            if (!groqResponse.ok) throw new Error(`Groq API Error: ${groqResponse.statusText}`);
            const groqResult = await processStream(groqResponse);
            const result: GenerateQuizOutput = JSON.parse(groqResult);
            const testData: ActiveTest = { id: `ai-test-${Date.now()}`, title: result.title, questions: result.questions.map((q, i) => ({ ...q, id: `q-${i}` })) };
            handleStartTest(testData);
            toast({ title: "Mock Test Generated!", description: `Your custom mock test "${result.title}" is ready. Starting now...` });
        } catch (error: any) {
            console.error("AI Test Generation Failed", error);
            toast({ variant: "destructive", title: "AI Test Generation Failed", description: error.message || "There was an error generating the mock test. Please try again." });
        }
    } finally {
        setIsGenerating(false);
    }
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const navigateQuestion = (newIndex: number) => {
    if (testState !== "in-progress" || !activeTest) return;
    const currentQuestionId = activeTest.questions[currentQuestionIndex].id;
    recordQuestionTime(currentQuestionId);
    setCurrentQuestionIndex(newIndex);
  }

  const handleNextQuestion = () => {
    if (!activeTest) return;
    if (currentQuestionIndex < activeTest.questions.length - 1) {
      navigateQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    recordQuestionTime(activeTest.questions[currentQuestionIndex].id);
    let correctAnswers = 0;
    activeTest.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setTestState("finished");
  };

    const handleAskLibra = (question: QuizQuestion) => {
    const prompt = `Deeply explain the following question and its solution. Break it down step-by-step.
Question: "${question.question}"
Options: ${question.options.join(", ")}
Correct Answer: ${question.correctAnswer}
Explanation: ${question.explanation}`;
    setActiveTool({ id: 'libra', payload: { initialPrompt: prompt } });
  };

  if (testState === "not-started") {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Mock Test Arena
          </h1>
          <p className="text-muted-foreground">
            Simulate the real exam environment. High-difficulty tests with AI proctoring.
          </p>
        </div>
        
         <Card>
          <CardHeader>
            <CardTitle>Upcoming Scheduled Mock Tests</CardTitle>
            <CardDescription>Official tests go live at the scheduled time. Be ready!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {upcomingTests.map((test) => (
              <Card key={test.id} className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{test.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1.5"><FileClock className="h-4 w-4" /> {test.duration}</div>
                    <div className="flex items-center gap-1.5"><Info className="h-4 w-4" /> {test.questions} Questions</div>
                  </div>
                   <div className="mt-2">
                      {test.status === "Live" && <Badge variant="destructive" className="animate-pulse">● Live Now</Badge>}
                      {test.status === "Upcoming" && <Badge variant="secondary">{test.date} at {test.time}</Badge>}
                  </div>
                </div>
                <Button size="lg" className="w-full sm:w-auto" disabled={test.status !== "Live"}>
                  Join Test
                </Button>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Manual Mock Tests</CardTitle>
              <CardDescription>Curated full-length mock tests to simulate the real exam.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {manualMockTests.map(test => (
                   <Button key={test.id} variant="outline" className="h-auto py-4 flex-col" onClick={() => handleStartTest(test)} disabled={isGenerating}>
                      <span className="font-semibold text-center whitespace-normal">{test.title}</span>
                      <span className="text-xs text-muted-foreground">{test.questions.length} questions</span>
                  </Button>
              ))}
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot /> AI Quick Mock Test</CardTitle>
              <CardDescription>Let our AI generate a random high-difficulty mock test for a specific exam section.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
              {aiQuickMocks.map(quiz => (
                   <Button key={quiz.topic} variant="secondary" className="h-auto py-4 flex-col gap-1 items-center justify-center" onClick={() => handleGenerateAndStart(quiz.topic, 100, true)} disabled={isGenerating}>
                      <span className="font-semibold text-center whitespace-normal">{quiz.topic.split(':')[0]}</span>
                      <span className="font-bold text-lg text-primary text-center whitespace-normal">{quiz.topic.split(':')[1]}</span>
                  </Button>
              ))}
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot /> Custom AI Mock Test</CardTitle>
              <CardDescription>Generate a high-difficulty mock test based on your specifications. Focuses on previous year paper patterns.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="topic">Test Topic</Label>
                      <Input id="topic" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} placeholder="e.g. RRB NTPC Full Mock" />
                  </div>
                   <div className="space-y-2">
                      <Label>Focus Area (Sub-topic)</Label>
                      <Select value={customSubTopic} onValueChange={setCustomSubTopic}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select a focus area" />
                          </SelectTrigger>
                          <SelectContent>
                              {subTopicsOptions.map((option) => (
                                  <SelectItem key={option.id} value={option.label}>
                                      {option.label}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                       <Input value={customOtherSubTopic} onChange={(e) => setCustomOtherSubTopic(e.target.value)} placeholder="Other specific topics..." />
                  </div>
                    <div className="space-y-2">
                      <Label>Specialization</Label>
                       <Input value={customSpecialization} onChange={(e) => setCustomSpecialization(e.target.value)} placeholder="e.g. Based on previous year papers" />
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
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100 (Standard)</SelectItem>
                              <SelectItem value="120">120</SelectItem>
                              <SelectItem value="150">150</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={customDifficulty} onValueChange={(val: "Hard") => setCustomDifficulty(val)}>
                          <SelectTrigger id="difficulty">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Hard">Hard / Advanced</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row flex justify-between items-center gap-4">
              <Button onClick={() => handleGenerateAndStart(customTopic, customNumQuestions)} disabled={isGenerating}>
                      {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate & Start Mock Test"}
              </Button>
              <Alert className="p-2 max-w-sm">
                  <Shield className="h-4 w-4" />
                  <AlertTitle className="text-xs">Proctoring Enabled</AlertTitle>
                  <AlertDescription className="text-xs flex items-center gap-2">
                  <Camera className="h-3 w-3" /> Your webcam will be active during the test.
                  </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Past Mock Test Results</CardTitle>
            <CardDescription>Analyze your performance and learn from your mistakes.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastResults.length > 0 ? pastResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.title}</TableCell>
                        <TableCell>{result.score}</TableCell>
                        <TableCell>{result.rank}</TableCell>
                        <TableCell>{result.accuracy}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                             <BarChart className="mr-2 h-4 w-4" />
                             View Analysis
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No past results yet.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
          </CardContent>
        </Card>
      </div>
    );
  }

    if (testState === "finished" && activeTest && score !== null) {
        return (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                Mock Test Results
                </h1>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>You scored {score}/{activeTest.questions.length}!</CardTitle>
                 <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span>{score! / activeTest.questions.length > 0.7 ? "Excellent work! Your practice is paying off." : "Good effort. Review the explanations to improve."}</span>
                  <span className="flex items-center gap-2 text-sm">Total Time: {formatTime(overallTime)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {activeTest.questions.map((q, index) => (
                  <Card key={q.id} className="p-4 bg-muted/20">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold flex-1 pr-4">{index + 1}. {q.question}</p>
                        <Badge variant="outline" className="flex-shrink-0">
                            Time: {formatTime(questionTimes[q.id] || 0)}
                        </Badge>
                    </div>
                    <div className="mt-2 text-sm space-y-2">
                      <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'}>{userAnswers[q.id] || "Not answered"}</Badge></p>
                      {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary" className="bg-green-100 text-green-800">{q.correctAnswer}</Badge></p>}
                    </div>
                    <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-0 pt-3 mt-3 border-t">
                      <div className="flex-1 space-y-2">
                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {q.explanation}</p>
                        {q.fastSolveTricks && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">💡 Trick to Solve Fast:</span> {q.fastSolveTricks}</p>}
                        {q.analogies && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">🧠 Analogy:</span> {q.analogies}</p>}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleAskLibra(q)}><Bot className="mr-2 h-4 w-4" /> Ask LIBRA AI</Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardContent>
              <CardFooter>
                <Button onClick={() => setTestState("not-started")} className="w-full">Back to Mock Test Arena</Button>
              </CardFooter>
            </Card>
          </div>
        );
    }
  
  if (testState === "in-progress" && activeTest) {
    const currentQuestion = activeTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100;
  
    return (
      <div className="flex flex-col gap-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="text-xl">{activeTest.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-1.5">Question Time: {formatTime(perQuestionTime)}</div>
                  <div className="flex items-center gap-1.5 text-primary">Total Time: {formatTime(overallTime)}</div>
              </div>
            </div>
            <CardDescription>Question {currentQuestionIndex + 1} of {activeTest.questions.length}</CardDescription>
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
            {currentQuestionIndex < activeTest.questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700">
                Submit Test
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Fallback for loading or invalid state
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
    </div>
  );
}
