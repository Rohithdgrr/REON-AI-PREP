
"use client";

import { useState } from "react";
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
import { Check, X, ArrowLeft, ArrowRight, Bot, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { generateQuiz, type GenerateQuizOutput, type QuizQuestionSchema } from "@/ai/flows/generate-quiz-flow";
import { useToast } from "@/hooks/use-toast";

const manualQuiz = {
  id: "quiz1",
  title: "Quantitative Aptitude: Time & Work",
  questions: [
    {
      id: "q1",
      question: "A can do a piece of work in 10 days, and B can do it in 15 days. In how many days can they do it working together?",
      options: ["4 days", "5 days", "6 days", "8 days"],
      correctAnswer: "6 days",
    },
    {
      id: "q2",
      question: "If 12 men can build a wall in 20 days, how many men can build the same wall in 15 days?",
      options: ["15 men", "16 men", "18 men", "20 men"],
      correctAnswer: "16 men",
    },
    {
      id: "q3",
      question: "A and B together can do a piece of work in 8 days. If A alone can do it in 12 days, then in how many days can B alone do it?",
      options: ["18 days", "20 days", "24 days", "28 days"],
      correctAnswer: "24 days",
    },
    {
      id: "q4",
        question: "3 men or 4 women can plough a field in 43 days. How long will 7 men and 5 women take to plough it?",
        options: ["12 days", "15 days", "18 days", "21 days"],
        correctAnswer: "12 days",
    },
    {
        id: "q5",
        text: "A is twice as good a workman as B and together they finish a piece of work in 14 days. In how many days can A alone finish the work?",
        options: ["20 days", "21 days", "22 days", "23 days"],
        correctAnswer: "21 days",
    }
  ].map(q => ({...q, question: q.question || q.text, id: q.id || Math.random().toString()}))
};

type UserAnswers = { [key: string]: string };

type QuizData = {
    id: string;
    title: string;
    questions: {
        id: string;
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
}

export function QuizPage() {
  const [quizState, setQuizState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizData>(manualQuiz);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTopic, setCustomTopic] = useState("Indian History");
  const [customNumQuestions, setCustomNumQuestions] = useState(5);
  const { toast } = useToast();

  const handleStartQuiz = (quizData: QuizData) => {
    setActiveQuiz(quizData);
    setQuizState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  const handleGenerateAndStartQuiz = async (topic: string, numQuestions: number) => {
    setIsGenerating(true);
    try {
        const result = await generateQuiz({ topic, numQuestions });
        const quizData: QuizData = {
            id: `ai-quiz-${Date.now()}`,
            title: result.title,
            questions: result.questions.map((q, i) => ({...q, id: `q-${i}`})),
        }
        handleStartQuiz(quizData);
    } catch (e) {
        toast({
            variant: "destructive",
            title: "AI Quiz Generation Failed",
            description: "There was an error generating the quiz. Please try again."
        });
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizState("finished");
  };

  if (testState === "not-started") {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Quiz Arena
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Topic-wise Quiz</CardTitle>
                    <CardDescription>Test your knowledge on a specific topic with our manually curated quizzes.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="font-semibold">{manualQuiz.title}</p>
                    <p className="text-sm text-muted-foreground">{manualQuiz.questions.length} questions</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleStartQuiz(manualQuiz)} className="w-full">Start Quiz</Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> AI Quick Quiz</CardTitle>
                    <CardDescription>Let our AI generate a random quiz for you on a popular topic.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="font-semibold">General Knowledge Mix</p>
                    <p className="text-sm text-muted-foreground">5 questions</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleGenerateAndStartQuiz("General Knowledge", 5)} className="w-full" disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate & Start"}
                    </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col lg:col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> Custom AI Quiz</CardTitle>
                    <CardDescription>Create your own quiz by specifying a topic and number of questions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input id="topic" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} placeholder="e.g. Indian History" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="num-questions">Number of Questions</Label>
                        <Select value={String(customNumQuestions)} onValueChange={(val) => setCustomNumQuestions(Number(val))}>
                            <SelectTrigger id="num-questions">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleGenerateAndStartQuiz(customTopic, customNumQuestions)} className="w-full" disabled={isGenerating}>
                         {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate & Start"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    );
  }

  if (quizState === "finished") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Quiz Results
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>You scored {score}/{activeQuiz.questions.length}!</CardTitle>
             <CardDescription>
              {score! / activeQuiz.questions.length > 0.7 ? "Great job! You've got a good grasp of the concepts." : "Keep practicing! You'll get there."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {activeQuiz.questions.map((q, index) => (
              <div key={q.id} className="border-l-4 p-4 rounded-r-lg bg-muted/40 data-[correct=true]:border-green-500 data-[correct=false]:border-red-500" data-correct={userAnswers[q.id] === q.correctAnswer}>
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <div className="mt-2 text-sm space-y-1">
                  <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'} className={userAnswers[q.id] === q.correctAnswer ? "bg-green-100 text-green-800" : ""}>{userAnswers[q.id] || "Not answered"}</Badge></p>
                  {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary">{q.correctAnswer}</Badge></p>}
                </div>
              </div>
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
          <CardTitle className="text-xl">{activeQuiz.title}</CardTitle>
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
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-base">{option}</Label>
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
