
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

const pastResults = [
    { id: "mock-sbi-po-04", title: "SBI PO Prelims Full Mock Test #4", score: "78/100", rank: "2,451", accuracy: "89%" },
    { id: "mock-rrb-ntpc-11", title: "RRB NTPC CBT-1 Full Mock Test #11", score: "85/120", rank: "#5,102", accuracy: "81%" },
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
  
  const handleGenerateAndStart = async () => {
    setIsGenerating(true);
    try {
        const allSubTopics = [...customSubTopics];
        if (customOtherSubTopic.trim()) {
            allSubTopics.push(customOtherSubTopic.trim());
        }

        // For mock tests, we can use the generateQuiz flow with high difficulty and specific instructions
        const result = await generateQuiz({ 
            topic: customTopic, 
            subTopics: allSubTopics,
            numQuestions: customNumQuestions,
            difficultyLevel: customDifficulty,
            specialization: customSpecialization || "A full mock test based on previous year papers and question patterns for competitive exams.",
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
                            <SelectItem value="100">100</SelectItem>
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
            <Button onClick={handleGenerateAndStart} disabled={isGenerating}>
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
