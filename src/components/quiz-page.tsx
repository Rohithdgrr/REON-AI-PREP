
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
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { useToast } from "@/hooks/use-toast";

const manualQuizzes = [
    {
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
          question: "A is twice as good a workman as B and together they finish a piece of work in 14 days. In how many days can A alone finish the work?",
          options: ["20 days", "21 days", "22 days", "23 days"],
          correctAnswer: "21 days",
        }
      ].map(q => ({...q, question: q.question || "", id: q.id || Math.random().toString()}))
    },
    {
        id: "quiz2",
        title: "Reasoning: Blood Relations",
        questions: [
            { id: "q1", question: "Pointing to a woman, a man said, 'Her father is the only son of my father.' How is the man related to the woman?", options: ["Father", "Brother", "Uncle", "Son"], correctAnswer: "Father" },
            { id: "q2", question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?", options: ["Granddaughter", "Daughter", "Grandmother", "Grandfather"], correctAnswer: "Granddaughter" },
            { id: "q3", question: "P is the brother of Q and R. S is R's mother. T is P's father. Which of the following statements cannot be definitely true?", options: ["T is Q's father", "S is P's mother", "P is S's son", "Q is T's son"], correctAnswer: "Q is T's son" },
            { id: "q4", question: "X and Y are brothers. R is the father of Y. S is the brother of T and maternal uncle of X. What is the relation of T to R?", options: ["Wife", "Sister", "Mother", "Brother"], correctAnswer: "Wife" },
            { id: "q5", question: "If 'A + B' means 'A is the father of B' and 'A - B' means 'A is the mother of B', what does 'P - Q + R' mean?", options: ["P is the grandmother of R", "P is the mother of R", "P is the aunt of R", "P is the grandfather of R"], correctAnswer: "P is the grandmother of R" },
        ].map(q => ({...q, question: q.question || "", id: q.id || Math.random().toString()}))
    },
    {
        id: "quiz3",
        title: "General Knowledge: Indian History",
        questions: [
            { id: "q1", question: "Who was the first President of India?", options: ["Jawaharlal Nehru", "Sardar Patel", "Dr. Rajendra Prasad", "Mahatma Gandhi"], correctAnswer: "Dr. Rajendra Prasad" },
            { id: "q2", question: "The Battle of Plassey was fought in?", options: ["1757", "1764", "1857", "1782"], correctAnswer: "1757" },
            { id: "q3", question: "Who founded the Maurya Empire?", options: ["Ashoka", "Bindusara", "Chandragupta Maurya", "Samudragupta"], correctAnswer: "Chandragupta Maurya" },
            { id: "q4", question: "The famous 'Quit India Movement' was launched by Mahatma Gandhi in which year?", options: ["1930", "1942", "1945", "1920"], correctAnswer: "1942" },
            { id: "q5", question: "Who is known as the 'Iron Man of India'?", options: ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "Lal Bahadur Shastri"], correctAnswer: "Sardar Vallabhbhai Patel" },
        ].map(q => ({...q, question: q.question || "", id: q.id || Math.random().toString()}))
    },
    {
        id: 'quiz4',
        title: 'English: Synonyms & Antonyms',
        questions: [
            { id: 'q1', question: "What is a synonym for 'ephemeral'?", options: ['Eternal', 'Transient', 'Ugly', 'Strong'], correctAnswer: 'Transient' },
            { id: 'q2', question: "What is an antonym for 'benevolent'?", options: ['Kind', 'Generous', 'Malevolent', 'Friendly'], correctAnswer: 'Malevolent' },
            { id: 'q3', question: "Choose the synonym for 'ubiquitous'.", options: ['Rare', 'Scarce', 'Omnipresent', 'Hidden'], correctAnswer: 'Omnipresent' },
            { id: 'q4', question: "Choose the antonym for 'assiduous'.", options: ['Diligent', 'Careful', 'Lazy', 'Hardworking'], correctAnswer: 'Lazy' },
            { id: 'q5', question: "What is a synonym for 'cacophony'?", options: ['Harmony', 'Silence', 'Discord', 'Melody'], correctAnswer: 'Discord' },
        ].map(q => ({...q, question: q.question || "", id: q.id || Math.random().toString()}))
    },
];

const aiQuickQuizzes = [
    { topic: "General Knowledge Mix", numQuestions: 5 },
    { topic: "Indian Polity", numQuestions: 5 },
    { topic: "Modern Indian History", numQuestions: 5 },
    { topic: "Quantitative Aptitude: Profit & Loss", numQuestions: 5 },
    { topic: "Reasoning: Analogies", numQuestions: 5 },
    { topic: "General Science: Biology", numQuestions: 5 },
    { topic: "Banking Awareness", numQuestions: 5 },
    { topic: "Current Affairs (Last 3 months)", numQuestions: 5 },
];


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
  const [activeQuiz, setActiveQuiz] = useState<QuizData>(manualQuizzes[0]);
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
            <CardContent className="space-y-4 max-w-sm">
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
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => handleGenerateAndStartQuiz(customTopic, customNumQuestions)} disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate & Start Custom Quiz"}
                </Button>
            </CardFooter>
        </Card>
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

    