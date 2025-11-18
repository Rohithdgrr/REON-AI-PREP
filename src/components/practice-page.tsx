
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
import { ArrowLeft, ArrowRight, Bot, Settings, Timer, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";

const samplePracticeTest = {
  id: "practice1",
  title: "Reasoning Ability: Advanced Puzzles",
  questions: [
    {
      id: "p1",
      text: "Seven people P, Q, R, S, T, U, and V live on seven different floors of a building. The lowermost floor is numbered 1. Who lives on the 3rd floor if P lives on an even-numbered floor but not on the top floor, and there are two floors between P and T?",
      options: ["Q", "R", "S", "U"],
      correctAnswer: "R",
      explanation: "From the given conditions, we can deduce the arrangement. P can be on floor 2, 4, or 6. If P is on 6, T is on 3. If P is on 4, T is on 1 or 7. If P is on 2, T is on 5. Further analysis of other (unmentioned) clues would solidify R on floor 3.",
      fastSolveTricks: "Use a table to quickly map floors and people. Eliminate possibilities for P first (not 1,3,5,7 or top floor).",
      analogies: "Think of it like a logic puzzle game (like Sudoku) where each clue eliminates possibilities until only one answer remains."
    },
    {
      id: "p2",
      text: "In a certain code, 'FRESH' is written as 'EQDRG'. How is 'BLAME' written in that code?",
      options: ["AKZLD", "BKZLD", "ALZKD", "AKZLF"],
      correctAnswer: "AKZLD",
      explanation: "Each letter in the word is moved one step backward to obtain the corresponding letter of the code. B-1=A, L-1=K, A-1=Z, M-1=L, E-1=D.",
      fastSolveTricks: "Identify the pattern with the first letter (F -> E is -1) and apply it to the target word immediately. No need to decode the full sample word if the pattern is simple.",
      analogies: "It's like shifting each key on a piano one step to the left."
    },
    {
      id: "p3",
      text: "Pointing to a photograph, a man said, 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?",
      options: ["His own", "His son's", "His father's", "His nephew's"],
      correctAnswer: "His son's",
      explanation: "The man has no siblings, so 'my father's son' is the man himself. The statement becomes 'that man's father is me'. Therefore, the photograph is of his son.",
      fastSolveTricks: "Break down the statement backwards. 'My father's son' when you have no brother is 'me'. So 'that man's father is me'.",
      analogies: "It's a riddle that folds back on itself. The key is realizing the speaker is talking about himself in a roundabout way."
    },
    {
      id: "p4",
      text: "If A + B means A is the mother of B, A - B means A is the brother of B, A % B means A is the father of B and A x B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?",
      options: ["Q - N + M x P", "P + S x N - Q", "P - M + N x Q", "Q - S % P"],
      correctAnswer: "P - M + N x Q",
      explanation: "P - M → P is the brother of M. M + N → M is the mother of N. N x Q → N is the sister of Q. Since N and Q are siblings and M is their mother, P (M's brother) is their maternal uncle.",
      fastSolveTricks: "Target the core relationship: 'maternal uncle' means 'mother's brother'. Look for `[P] - [Someone] + ...Q`. Option 3 fits this pattern. P is brother of M, M is mother of N, N is sister of Q.",
      analogies: "This is like translating a sentence from a symbolic language. You need to know the vocabulary (+, -, x, %) to understand the family tree."
    },
    {
        id: "p5",
        text: "Find the missing number in the series: 4, 18, ?, 100, 180, 294.",
        options: ["32", "36", "48", "40"],
        correctAnswer: "48",
        explanation: "The pattern is 2³ - 2², 3³ - 3², 4³ - 4², 5³ - 5², etc. So the missing term is 4³ - 4² = 64 - 16 = 48.",
        fastSolveTricks: "Look for differences between numbers. If that's not simple, check for squares or cubes. Notice 100 is close to 125 (5³) and 180 is close to 216 (6³). This hints at a cube-based pattern.",
        analogies: "Number series are like musical scales with a specific interval rule. You just need to find the rule."
    },
    {
        id: "p6",
        text: "A clock is started at noon. By 10 minutes past 5, the hour hand has turned through:",
        options: ["145°", "155°", "160°", "150°"],
        correctAnswer: "155°",
        explanation: "Angle traced by hour hand in 12 hrs = 360°. So, in 1 hour it's 30°. Time from noon to 5:10 is 5 hrs 10 min = 5 and 1/6 hrs = 31/6 hrs. Angle traced = (30 * 31/6) = 5 * 31 = 155°.",
        fastSolveTricks: "Hour hand moves 0.5° per minute. Total minutes are 5*60 + 10 = 310 minutes. Total angle = 310 * 0.5 = 155°.",
        analogies: "The hour hand is a slow runner on a circular track. You're calculating how far it has run in a given time."
    },
     {
      id: "p7",
      text: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
      options: ["7", "10", "12", "13"],
      correctAnswer: "10",
      explanation: "This is an alternating series. One series is (7, 8, 9, ...) and the second is (10, 11, 12, ...). The next number belongs to the first series.",
      fastSolveTricks: "When numbers go up and then down, it's almost always two interleaved series. Read every other number: 7, 8, 9... and 10, 11, 12...",
      analogies: "It's like two people taking turns walking up a staircase, one step at a time."
    },
  ],
};

type UserAnswers = { [key: string]: string };
type QuestionTimes = { [key: string]: number };

const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export function PracticePage() {
  const [testState, setTestState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);

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

  const handleStartTest = () => {
    setTestState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
    setOverallTime(0);
    setPerQuestionTime(0);
    setQuestionTimes({});
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const navigateQuestion = (newIndex: number) => {
    const currentQuestionId = samplePracticeTest.questions[currentQuestionIndex].id;
    recordQuestionTime(currentQuestionId);
    setCurrentQuestionIndex(newIndex);
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < samplePracticeTest.questions.length - 1) {
      navigateQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    recordQuestionTime(samplePracticeTest.questions[currentQuestionIndex].id);
    let correctAnswers = 0;
    samplePracticeTest.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setTestState("finished");
  };

  if (testState === "not-started") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Practice Arena
        </h1>
        <p className="text-muted-foreground">
          Hone your skills with challenging practice tests. Customize your session or let AI create one for you.
        </p>
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Configure Your Practice Test</CardTitle>
                <CardDescription>Set up a practice session tailored to your needs.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Manual Setup</h3>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select defaultValue="reasoning-puzzles">
                    <SelectTrigger id="topic">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reasoning-puzzles">Reasoning: Advanced Puzzles</SelectItem>
                      <SelectItem value="quant-di">Quantitative Aptitude: Data Interpretation</SelectItem>
                      <SelectItem value="english-rc">English: Reading Comprehension</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="num-questions">Number of Questions</Label>
                  <Input id="num-questions" type="number" defaultValue={samplePracticeTest.questions.length} />
                </div>
                <Button onClick={handleStartTest} className="w-full">Start Manual Test</Button>
              </div>
              <div className="space-y-4 p-6 bg-muted rounded-lg flex flex-col items-center justify-center text-center">
                 <h3 className="font-semibold text-lg flex items-center gap-2"><Bot /> AI-Powered Test</h3>
                 <p className="text-sm text-muted-foreground">Let our AI generate a custom test based on your weak points and recent performance.</p>
                 <Button variant="secondary" className="w-full">Generate with AI</Button>
              </div>
            </CardContent>
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
                Back to Setup
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>You scored {score}/{samplePracticeTest.questions.length}!</CardTitle>
             <CardDescription className="flex items-center gap-4">
              <span>{score! / samplePracticeTest.questions.length > 0.7 ? "Excellent work! Your practice is paying off." : "Good effort. Review the explanations to improve."}</span>
              <span className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4" /> Total Time: {formatTime(overallTime)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {samplePracticeTest.questions.map((q, index) => (
              <Card key={q.id} className="p-4 bg-muted/20">
                <div className="flex justify-between items-start">
                    <p className="font-semibold flex-1 pr-4">{index + 1}. {q.text}</p>
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
                  <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">💡 Trick to Solve Fast:</span> {q.fastSolveTricks}</p>
                  <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">🧠 Analogy:</span> {q.analogies}</p>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setTestState("not-started")} className="w-full">Back to Practice Setup</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = samplePracticeTest.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / samplePracticeTest.questions.length) * 100;

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between mb-4">
            <Button onClick={() => setTestState("not-started")} variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <div className="flex items-center gap-4 text-sm font-medium">
                <Badge variant="secondary" className="px-3 py-1 text-base">
                    <Timer className="mr-2 h-4 w-4" />
                    {formatTime(overallTime)}
                </Badge>
                 <Badge variant="outline" className="px-3 py-1 text-base">
                    Q: {formatTime(perQuestionTime)}
                </Badge>
            </div>
      </div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{samplePracticeTest.title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {samplePracticeTest.questions.length}</CardDescription>
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
          {currentQuestionIndex < samplePracticeTest.questions.length - 1 ? (
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
