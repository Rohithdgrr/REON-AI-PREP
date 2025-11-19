

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
import { ArrowLeft, ArrowRight, Bot, Settings, Timer, ChevronLeft, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "./ui/checkbox";

const manualQuizzes = [
    {
      id: "quiz1",
      title: "Quantitative Aptitude: Time & Work",
    },
    {
        id: "quiz2",
        title: "Reasoning: Blood Relations",
    },
    {
        id: "quiz3",
        title: "General Knowledge: Indian History",
    },
    {
        id: 'quiz4',
        title: 'English: Synonyms & Antonyms',
    },
    {
        id: 'quiz5',
        title: 'Quant: Percentages',
    },
    {
        id: 'quiz6',
        title: 'Reasoning: Analogies',
    },
    {
        id: 'quiz7',
        title: 'GK: Indian Geography',
    },
    {
        id: 'quiz8',
        title: 'English: Idioms and Phrases',
    },
    {
        id: 'quiz9',
        title: 'Quant: Simple & Compound Interest',
    },
    {
        id: 'quiz10',
        title: 'Reasoning: Seating Arrangement',
    },
    {
        id: 'quiz11',
        title: 'GK: Indian Polity',
    },
    {
        id: 'quiz12',
        title: 'English: Prepositions',
    },
    {
        id: 'quiz13',
        title: 'Quant: Speed, Time & Distance',
    },
    {
        id: 'quiz14',
        title: 'Reasoning: Coding-Decoding',
    },
    {
        id: 'quiz15',
        title: 'GK: Famous Personalities',
    },
    {
        id: 'quiz16',
        title: 'English: Articles',
    },
    {
        id: 'quiz17',
        title: 'Quant: Averages',
    },
    {
        id: 'quiz18',
        title: 'Reasoning: Syllogism',
    },
].map(quiz => ({ 
    ...quiz, 
    questions: Array.from({ length: 30 }, (_, i) => ({ 
        id: Math.random().toString(), 
        question: `${quiz.title.split(': ')[1]} Question ${i + 1}`, 
        options: ["Option A", "Option B", "Option C", "Option D"], 
        correctAnswer: "Option A",
        explanation: "This is a placeholder explanation for the correct answer, providing detailed reasoning.",
        fastSolveTricks: "Use this quick trick to solve the problem faster next time.",
        analogies: "Think of it like this analogy to better understand the concept."
    })) 
}));


const aiQuickQuizzes = [
    { topic: "General Knowledge Mix", numQuestions: 30, subTopics: ["Indian History", "Geography", "Polity", "Economy", "Current Affairs"] },
    { topic: "Indian Polity", numQuestions: 30, subTopics: ["Constitution", "Parliament", "Judiciary", "State Government", "Panchayati Raj"] },
    { topic: "Modern Indian History", numQuestions: 30, subTopics: ["British Rule", "Freedom Struggle", "Gandhi Era", "Revolts", "Social Reforms"] },
    { topic: "Quantitative Aptitude: Profit & Loss", numQuestions: 30, subTopics: ["Basics of Profit and Loss", "Discount and Marked Price", "Dishonest Dealer", "Successive Selling", "Mixtures"] },
    { topic: "Reasoning: Analogies", numQuestions: 30, subTopics: ["Word Analogy", "Number Analogy", "Letter Analogy", "Mixed Analogy", "Image-based Analogy"] },
    { topic: "General Science: Biology", numQuestions: 30, subTopics: ["Human Body", "Plant Kingdom", "Diseases", "Vitamins", "Genetics"] },
    { topic: "Banking Awareness", numQuestions: 30, subTopics: ["RBI Functions", "Types of Banks", "Monetary Policy", "Negotiable Instruments", "Banking Ombudsman"] },
    { topic: "Current Affairs (Last 3 months)", numQuestions: 30, subTopics: ["National News", "International News", "Sports", "Awards", "Summits"] },
    { topic: "Geography: Rivers of India", numQuestions: 30, subTopics: ["Himalayan Rivers", "Peninsular Rivers", "Dams", "River Projects", "Tributaries"] },
    { topic: "English: Error Spotting", numQuestions: 30, subTopics: ["Subject-Verb Agreement", "Tenses", "Prepositions", "Articles", "Adjectives and Adverbs"] },
    { topic: "Quant: Number Series", numQuestions: 30, subTopics: ["Arithmetic Progression", "Geometric Progression", "Missing Number", "Wrong Number", "Mixed Series"] },
    { topic: "Reasoning: Direction Sense", numQuestions: 30, subTopics: ["Basic Direction Problems", "Pythagoras Theorem", "Shadow Problems", "Coded Direction", "Angle-based Problems"] },
    { topic: "GK: Books and Authors", numQuestions: 30, subTopics: ["Ancient Indian Authors", "Modern Indian Authors", "Famous International Authors", "Autobiographies", "Recent Book Releases"] },
    { topic: "Computer Knowledge", numQuestions: 30, subTopics: ["Basics of Computer", "Hardware and Software", "MS Office", "Internet", "Networking"] },
    { topic: "Physics: Units & Measurements", numQuestions: 30, subTopics: ["SI Units", "Fundamental and Derived Units", "Measuring Instruments", "Dimensional Analysis", "Errors in Measurement"] },
    { topic: "Chemistry: Acids & Bases", numQuestions: 30, subTopics: ["Properties of Acids", "Properties of Bases", "pH Scale", "Indicators", "Common Acids and Bases"] },
    { topic: "Sports GK", numQuestions: 30, subTopics: ["Cricket", "Football", "Olympics", "Tennis", "National Sports Awards"] },
    { topic: "Important Dates & Days", numQuestions: 30, subTopics: ["National Days", "International Days", "Theme-based Days", "Historical Dates", "Anniversaries"] },
];


type UserAnswers = { [key: string]: string };
type QuestionTimes = { [key: string]: number };
type QuizQuestion = GenerateQuizOutput['questions'][0] & { id: string };
type ActiveTest = {
    id: string;
    title: string;
    questions: QuizQuestion[];
}


const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const subTopicsOptions = [
    { id: "basics", label: "Basics & Fundamentals" },
    { id: "formulas", label: "Formulas & Core Concepts" },
    { id: "advanced", label: "Advanced Problems" },
    { id: "previous_years", label: "Previous Year Questions" },
];

export function PracticePage() {
  const [testState, setTestState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);
  const [activeTest, setActiveTest] = useState<ActiveTest>(manualQuizzes[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [customTopic, setCustomTopic] = useState("Reasoning: Advanced Puzzles");
  const [customSubTopic, setCustomSubTopic] = useState("");
  const [customOtherSubTopic, setCustomOtherSubTopic] = useState("");
  const [customNumQuestions, setCustomNumQuestions] = useState(10);
  const [customDifficulty, setCustomDifficulty] = useState<"Medium" | "Hard">("Hard");
  const [customSpecialization, setCustomSpecialization] = useState("");


  const { toast } = useToast();

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

  const shuffleArray = <T,>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

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
  
  const handleGenerateAndStart = async (topic: string, numQuestions: number, subTopics?: string[], difficulty?: "Medium" | "Hard", specialization?: string) => {
    setIsGenerating(true);
    try {
        const allSubTopics: string[] = subTopics ? [...subTopics] : [];
        if(customSubTopic && !subTopics) {
            allSubTopics.push(customSubTopic);
        }
        if (customOtherSubTopic.trim() && !subTopics) {
            allSubTopics.push(customOtherSubTopic.trim());
        }

        const result = await generateQuiz({ 
            topic: topic || customTopic, 
            subTopics: allSubTopics.length > 0 ? allSubTopics : undefined,
            numQuestions: numQuestions || customNumQuestions,
            difficultyLevel: difficulty || customDifficulty,
            specialization: specialization || customSpecialization || undefined,
        });

        const shuffledQuestions = shuffleArray(result.questions);

        const testData: ActiveTest = {
            id: `ai-test-${Date.now()}`,
            title: result.title,
            questions: shuffledQuestions.map((q, i) => ({...q, id: `q-${i}`})),
        }
        handleStartTest(testData);
    } catch (e) {
        toast({
            variant: "destructive",
            title: "AI Test Generation Failed",
            description: "There was an error generating the test. Please try again."
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
    if (testState !== "in-progress") return;
    const currentQuestionId = activeTest.questions[currentQuestionIndex].id;
    recordQuestionTime(currentQuestionId);
    setCurrentQuestionIndex(newIndex);
  }

  const handleNextQuestion = () => {
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

  if (testState === "not-started") {
    return (
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Practice Arena
            </h1>
            <p className="text-muted-foreground">Hone your skills with challenging practice tests. Choose from a topic, or let AI create one for you.</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Topic-wise Practice Tests</CardTitle>
                <CardDescription>Test your knowledge on specific topics with our manually curated practice tests.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {manualQuizzes.map(quiz => (
                    <Button key={quiz.id} variant="outline" className="h-auto py-4" onClick={() => handleStartTest(quiz)}>
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
                <CardTitle className="flex items-center gap-2"><Bot /> AI Quick Practice Tests</CardTitle>
                <CardDescription>Let our AI generate a random practice test for you on a popular topic.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aiQuickQuizzes.map(quiz => (
                     <Button key={quiz.topic} variant="secondary" className="h-auto py-4" onClick={() => handleGenerateAndStart(quiz.topic, quiz.numQuestions, quiz.subTopics, 'Medium')} disabled={isGenerating}>
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
                <CardTitle className="flex items-center gap-2"><Bot /> Custom AI Practice Test</CardTitle>
                <CardDescription>Create your own practice test by specifying a topic, difficulty, and more.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input id="topic" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} placeholder="e.g. Indian History" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sub-topics</Label>
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
                        <Input value={customOtherSubTopic} onChange={(e) => setCustomOtherSubTopic(e.target.value)} placeholder="Other specific sub-topics..." />
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
                        <Select value={customDifficulty} onValueChange={(val: "Medium" | "Hard") => setCustomDifficulty(val)}>
                            <SelectTrigger id="difficulty">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => handleGenerateAndStart(customTopic, customNumQuestions)} disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate & Start Custom Test"}
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  if (testState === "finished") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Practice Test Results
            </h1>
            <Button onClick={() => setTestState("not-started")} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Practice Arena
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>You scored {score}/{activeTest.questions.length}!</CardTitle>
             <CardDescription className="flex items-center gap-4">
              <span>{score! / activeTest.questions.length > 0.7 ? "Excellent work! Your practice is paying off." : "Good effort. Review the explanations to improve."}</span>
              <span className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4" /> Total Time: {formatTime(overallTime)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {activeTest.questions.map((q, index) => (
              <Card key={q.id} className="p-4 bg-muted/20">
                <div className="flex justify-between items-start">
                    <p className="font-semibold flex-1 pr-4">{index + 1}. {q.question}</p>
                    <Badge variant="outline" className="flex-shrink-0">
                        <Timer className="mr-2 h-3 w-3"/>{formatTime(questionTimes[q.id] || 0)}
                    </Badge>
                </div>
                <div className="mt-2 text-sm space-y-2">
                  <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'}>{userAnswers[q.id] || "Not answered"}</Badge></p>
                  {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary" className="bg-green-100 text-green-800">{q.correctAnswer}</Badge></p>}
                </div>
                <CardFooter className="flex flex-col items-start gap-3 p-0 pt-3 mt-3 border-t">
                  <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {q.explanation}</p>
                  {q.fastSolveTricks && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">💡 Trick to Solve Fast:</span> {q.fastSolveTricks}</p>}
                  {q.analogies && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">🧠 Analogy:</span> {q.analogies}</p>}
                </CardFooter>
              </Card>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setTestState("not-started")} className="w-full">Back to Practice Arena</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = activeTest.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{activeTest.title}</CardTitle>
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
