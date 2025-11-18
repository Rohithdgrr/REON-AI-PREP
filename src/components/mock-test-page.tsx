
"use client";

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
import { Camera, Shield, FileClock, Info, BarChart, Bot, Loader2, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";


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
];


const pastResults = [
    { id: "mock-sbi-po-04", title: "SBI PO Prelims Full Mock Test #4", score: "78/100", rank: "2,451", accuracy: "89%" },
    { id: "mock-rrb-ntpc-11", title: "RRB NTPC CBT-1 Full Mock Test #11", score: "85/120", rank: "#5,102", accuracy: "81%" },
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

export function MockTestPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [customTopic, setCustomTopic] = useState("Full Syllabus Mock");
  const [customSubTopics, setCustomSubTopics] = useState<string[]>(['Previous Year Questions']);
  const [customOtherSubTopic, setCustomOtherSubTopic] = useState("");
  const [customNumQuestions, setCustomNumQuestions] = useState(100);
  const [customDifficulty, setCustomDifficulty] = useState<"Hard">("Hard");
  const [customSpecialization, setCustomSpecialization] = useState("Based on previous year papers");
  
  const handleGenerateAndStart = async (topic: string, numQuestions: number, isQuickMock: boolean = false) => {
    setIsGenerating(true);
    try {
        let allSubTopics = [...customSubTopics];
        if (customOtherSubTopic.trim() && !isQuickMock) {
            allSubTopics.push(customOtherSubTopic.trim());
        }

        const specialization = isQuickMock
            ? `A full mock test for the ${topic.replace('Full Syllabus Mock: ', '')} section based on previous year papers.`
            : customSpecialization || "A full mock test based on previous year papers and question patterns for competitive exams.";

        const result = await generateQuiz({ 
            topic: topic || customTopic, 
            subTopics: isQuickMock ? [] : allSubTopics,
            numQuestions: numQuestions || customNumQuestions,
            difficultyLevel: customDifficulty,
            specialization: specialization,
        });
        
        toast({
            title: "Mock Test Generated!",
            description: `Your custom mock test "${result.title}" is ready. Starting now...`
        });
        // Here you would typically navigate to the test interface
        // For this demo, we'll just show a success message.
        console.log("Generated Mock Test:", result);

    } catch (e) {
        toast({
            variant: "destructive",
            title: "AI Test Generation Failed",
            description: "There was an error generating the mock test. Please try again."
        });
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  }


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
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {manualMockTests.map(test => (
                 <Button key={test.id} variant="outline" className="h-auto py-4" onClick={() => handleGenerateAndStart(test.title, test.questions)} disabled={isGenerating}>
                    <div className="flex flex-col items-center text-center">
                        <p className="font-semibold">{test.title}</p>
                        <p className="text-xs text-muted-foreground">{test.questions} questions</p>
                    </div>
                </Button>
            ))}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> AI Quick Mock Test</CardTitle>
            <CardDescription>Let our AI generate a random high-difficulty mock test for a specific exam section.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiQuickMocks.map(quiz => (
                 <Button key={quiz.topic} variant="secondary" className="h-auto py-4" onClick={() => handleGenerateAndStart(quiz.topic, 100, true)} disabled={isGenerating}>
                    <div className="flex flex-col items-center text-center">
                        <p className="font-semibold">{quiz.topic}</p>
                    </div>
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
                    <Label>Focus Areas (Sub-topics)</Label>
                    <div className="grid grid-cols-2 gap-2">
                    {subTopicsOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`sub-${option.id}`}
                                checked={customSubTopics.includes(option.label)}
                                onCheckedChange={(checked) => {
                                    setCustomSubTopics(prev => checked ? [...prev, option.label] : prev.filter(item => item !== option.label))
                                }}
                            />
                            <Label htmlFor={`sub-${option.id}`} className="font-normal">{option.label}</Label>
                        </div>
                    ))}
                    </div>
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
        <CardFooter className="flex justify-between items-center">
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
              {pastResults.map((result) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    