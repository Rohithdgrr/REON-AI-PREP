
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
import { ArrowLeft, ArrowRight, Bot, Settings } from "lucide-react";
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
      explanation: "From the given conditions, we can deduce the arrangement. P can be on floor 2, 4, or 6. If P is on 6, T is on 3. If P is on 4, T is on 1 or 7. If P is on 2, T is on 5. Further analysis of other (unmentioned) clues would solidify R on floor 3."
    },
    {
      id: "p2",
      text: "In a certain code, 'FRESH' is written as 'EQDRG'. How is 'BLAME' written in that code?",
      options: ["AKZLD", "BKZLD", "ALZKD", "AKZLF"],
      correctAnswer: "AKZLD",
      explanation: "Each letter in the word is moved one step backward to obtain the corresponding letter of the code. B-1=A, L-1=K, A-1=Z, M-1=L, E-1=D."
    },
    {
      id: "p3",
      text: "Pointing to a photograph, a man said, 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?",
      options: ["His own", "His son's", "His father's", "His nephew's"],
      correctAnswer: "His son's",
      explanation: "The man has no siblings, so 'my father's son' is the man himself. The statement becomes 'that man's father is me'. Therefore, the photograph is of his son."
    },
    {
      id: "p4",
      text: "If A + B means A is the mother of B, A - B means A is the brother of B, A % B means A is the father of B and A x B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?",
      options: ["Q - N + M x P", "P + S x N - Q", "P - M + N x Q", "Q - S % P"],
      correctAnswer: "P - M + N x Q",
      explanation: "P - M → P is the brother of M. M + N → M is the mother of N. N x Q → N is the sister of Q. Therefore, P is the maternal uncle of Q."
    },
    {
        id: "p5",
        text: "Find the missing number in the series: 4, 18, ?, 100, 180, 294.",
        options: ["32", "36", "48", "40"],
        correctAnswer: "48",
        explanation: "The pattern is 2³ - 2², 3³ - 3², 4³ - 4², 5³ - 5², etc. So the missing term is 4³ - 4² = 64 - 16 = 48."
    },
    {
        id: "p6",
        text: "A clock is started at noon. By 10 minutes past 5, the hour hand has turned through:",
        options: ["145°", "155°", "160°", "150°"],
        correctAnswer: "155°",
        explanation: "Angle traced by hour hand in 12 hrs = 360°. Time from noon to 5:10 is 5 hrs 10 min = 31/6 hrs. Angle traced = (360/12 * 31/6) = 155°."
    },
     {
      id: "p7",
      text: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
      options: ["7", "10", "12", "13"],
      correctAnswer: "10",
      explanation: "This is an alternating series. The first pattern is 7, 8, 9, ... and the second is 10, 11, 12, ... The next number is from the first pattern, which is 10."
    },
  ],
};

type UserAnswers = { [key: string]: string };

export function PracticePage() {
  const [testState, setTestState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);

  const handleStartTest = () => {
    setTestState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < samplePracticeTest.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = () => {
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
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Practice Test Results
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>You scored {score}/{samplePracticeTest.questions.length}!</CardTitle>
             <CardDescription>
              {score! / samplePracticeTest.questions.length > 0.7 ? "Excellent work! Your practice is paying off." : "Good effort. Review the explanations to improve."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {samplePracticeTest.questions.map((q, index) => (
              <Card key={q.id} className="p-4 bg-muted/20">
                <p className="font-semibold">{index + 1}. {q.text}</p>
                <div className="mt-2 text-sm space-y-2">
                  <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'}>{userAnswers[q.id] || "Not answered"}</Badge></p>
                  {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary" className="bg-green-100 text-green-800">{q.correctAnswer}</Badge></p>}
                </div>
                <CardFooter className="p-0 pt-3 mt-3 border-t">
                  <p className="text-xs text-muted-foreground"><span className="font-semibold">Explanation:</span> {q.explanation}</p>
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
