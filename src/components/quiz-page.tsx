

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
import { Check, X, ArrowLeft, ArrowRight, Bot, Loader2, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "./ui/checkbox";

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


type UserAnswers = { [key: string]: string };

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

  const handleStartQuiz = (quizData: QuizData) => {
    setActiveQuiz(quizData);
    setQuizState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  const handleGenerateAndStartQuiz = async () => {
    setIsGenerating(true);
    try {
        const subTopicsArray = customSubTopics.split(',').map(s => s.trim()).filter(s => s);

        const result = await generateQuiz({ 
            topic: customTopic, 
            subTopics: subTopicsArray.length > 0 ? subTopicsArray : undefined,
            numQuestions: customNumQuestions,
            difficultyLevel: customDifficulty,
            specialization: customSpecialization || undefined,
        });
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
  
  const handleQuickQuiz = async (topic: string, numQuestions: number) => {
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
                     <Button key={quiz.topic} variant="secondary" className="h-auto py-4" onClick={() => handleQuickQuiz(quiz.topic, quiz.numQuestions)} disabled={isGenerating}>
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
                <Button onClick={handleGenerateAndStartQuiz} disabled={isGenerating}>
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
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Quiz Results
            </h1>
            <Button onClick={() => setQuizState("not-started")} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Quiz Arena
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>You scored {score}/{activeQuiz.questions.length}!</CardTitle>
             <CardDescription>
              {score! / activeQuiz.questions.length > 0.7 ? "Great job! You've got a good grasp of the concepts." : "Keep practicing! You'll get there."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {activeQuiz.questions.map((q, index) => (
              <Card key={q.id} className="p-4 bg-muted/20 data-[correct=true]:border-green-500 data-[correct=false]:border-red-500 border-l-4">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <div className="mt-2 text-sm space-y-1">
                  <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'} className={userAnswers[q.id] === q.correctAnswer ? "bg-green-100 text-green-800" : ""}>{userAnswers[q.id] || "Not answered"}</Badge></p>
                  {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary">{q.correctAnswer}</Badge></p>}
                </div>
                {(q.explanation || q.fastSolveTricks || q.analogies) && (
                     <CardFooter className="flex flex-col items-start gap-3 p-0 pt-3 mt-3 border-t">
                        {q.explanation && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {q.explanation}</p>}
                        {q.fastSolveTricks && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">💡 Trick to Solve Fast:</span> {q.fastSolveTricks}</p>}
                        {q.analogies && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">🧠 Analogy:</span> {q.analogies}</p>}
                    </CardFooter>
                )}
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
