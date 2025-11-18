
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
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const sampleQuiz = {
  id: "quiz1",
  title: "Quantitative Aptitude: Time & Work",
  questions: [
    {
      id: "q1",
      text: "A can do a piece of work in 10 days, and B can do it in 15 days. In how many days can they do it working together?",
      options: ["4 days", "5 days", "6 days", "8 days"],
      correctAnswer: "6 days",
    },
    {
      id: "q2",
      text: "If 12 men can build a wall in 20 days, how many men can build the same wall in 15 days?",
      options: ["15 men", "16 men", "18 men", "20 men"],
      correctAnswer: "16 men",
    },
    {
      id: "q3",
      text: "A and B together can do a piece of work in 8 days. If A alone can do it in 12 days, then in how many days can B alone do it?",
      options: ["18 days", "20 days", "24 days", "28 days"],
      correctAnswer: "24 days",
    },
    {
      id: "q4",
        text: "3 men or 4 women can plough a field in 43 days. How long will 7 men and 5 women take to plough it?",
        options: ["12 days", "15 days", "18 days", "21 days"],
        correctAnswer: "12 days",
    },
    {
        id: "q5",
        text: "A is twice as good a workman as B and together they finish a piece of work in 14 days. In how many days can A alone finish the work?",
        options: ["20 days", "21 days", "22 days", "23 days"],
        correctAnswer: "21 days",
    }
  ],
};

type UserAnswers = { [key: string]: string };

export function QuizPage() {
  const [quizState, setQuizState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);

  const handleStartQuiz = () => {
    setQuizState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuiz.questions.length - 1) {
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
    sampleQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizState("finished");
  };

  if (quizState === "not-started") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center h-full text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Ready for a Challenge?
        </h1>
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{sampleQuiz.title}</CardTitle>
                <CardDescription>This quiz contains {sampleQuiz.questions.length} questions. Test your knowledge!</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">You'll have unlimited time for this quiz, but try to answer as quickly and accurately as possible.</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleStartQuiz} className="w-full">Start Quiz</Button>
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
            <CardTitle>You scored {score}/{sampleQuiz.questions.length}!</CardTitle>
             <CardDescription>
              {score! > 3 ? "Great job! You've got a good grasp of the concepts." : "Keep practicing! You'll get there."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {sampleQuiz.questions.map((q, index) => (
              <div key={q.id} className="border-l-4 p-4 rounded-r-lg bg-muted/40 data-[correct=true]:border-green-500 data-[correct=false]:border-red-500" data-correct={userAnswers[q.id] === q.correctAnswer}>
                <p className="font-semibold">{index + 1}. {q.text}</p>
                <div className="mt-2 text-sm">
                  <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{userAnswers[q.id] || "Not answered"}</Badge></p>
                  {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary">{q.correctAnswer}</Badge></p>}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartQuiz} className="w-full">Take Another Quiz</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = sampleQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuiz.questions.length) * 100;


  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{sampleQuiz.title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {sampleQuiz.questions.length}</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-lg mb-4">{currentQuestion.text}</p>
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
          {currentQuestionIndex < sampleQuiz.questions.length - 1 ? (
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
