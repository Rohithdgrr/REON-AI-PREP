
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, BookOpen, BrainCircuit, MessageSquare, Newspaper, Flag, Wand2, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { generatePersonalizedStudyPlan, GeneratePersonalizedStudyPlanOutput } from "@/ai/flows/generate-personalized-study-plan";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";

const studyPlan = [
  {
    week: 1,
    title: "Foundation & Basics",
    status: "Completed",
    subjects: [
      { 
        name: "Quantitative Aptitude", 
        icon: BrainCircuit,
        tasks: [
          { description: "Number System & HCF/LCM", completed: true },
          { description: "Simplification & Approximation", completed: true },
          { description: "Percentage, Profit & Loss", completed: true },
        ] 
      },
      { 
        name: "Reasoning Ability", 
        icon: BrainCircuit,
        tasks: [
          { description: "Coding-Decoding & Analogy", completed: true },
          { description: "Blood Relations & Direction Sense", completed: true },
        ] 
      },
      { 
        name: "English Language",
        icon: MessageSquare, 
        tasks: [
          { description: "Grammar Basics: Tenses & Parts of Speech", completed: true },
        ] 
      },
       { 
        name: "General Awareness",
        icon: Newspaper, 
        tasks: [
          { description: "Indian History (Ancient & Medieval)", completed: true },
        ] 
      },
    ]
  },
  {
    week: 2,
    title: "Core Concepts",
    status: "In Progress",
    subjects: [
      { 
        name: "Quantitative Aptitude", 
        icon: BrainCircuit,
        tasks: [
          { description: "Ratio, Proportion & Averages", completed: true },
          { description: "Time & Work, Speed, Time & Distance", completed: false },
          { description: "Simple & Compound Interest", completed: false },
        ] 
      },
      { 
        name: "Reasoning Ability",
        icon: BrainCircuit, 
        tasks: [
          { description: "Syllogism & Seating Arrangements", completed: true },
          { description: "Puzzles (Floor, Box-based)", completed: false },
        ] 
      },
      { 
        name: "General Awareness", 
        icon: Newspaper,
        tasks: [
          { description: "Indian Polity & Constitution", completed: true },
          { description: "Current Affairs (Last 6 Months)", completed: false },
        ] 
      },
    ]
  },
  {
    week: 3,
    title: "Advanced Topics & Practice",
    status: "Not Started",
    subjects: [
      { 
        name: "Quantitative Aptitude", 
        icon: BrainCircuit,
        tasks: [
          { description: "Data Interpretation (Tables, Bar Graphs)", completed: false },
          { description: "Algebra & Geometry Basics", completed: false },
        ] 
      },
      { 
        name: "Reasoning Ability", 
        icon: BrainCircuit,
        tasks: [
          { description: "Input-Output & Data Sufficiency", completed: false },
          { description: "Logical & Critical Reasoning", completed: false },
        ] 
      },
      { 
        name: "English Language",
        icon: MessageSquare, 
        tasks: [
          { description: "Reading Comprehension & Para Jumbles", completed: false },
        ] 
      },
    ]
  },
  {
    week: 4,
    title: "Revision & Mock Tests",
    status: "Not Started",
    subjects: [
      { 
        name: "Revision",
        icon: BookOpen,
        tasks: [
          { description: "Full Syllabus Revision", completed: false },
          { description: "Review Weak Areas from Radar", completed: false },
        ] 
      },
      { 
        name: "Mock Tests",
        icon: Flag,
        tasks: [
          { description: "Attempt 5 Full-Length Mocks", completed: false },
          { description: "Analyze Mock Performance", completed: false },
        ] 
      },
    ]
  },
];

const subjectsOptions = ["Quantitative Aptitude", "Reasoning", "English", "General Awareness", "General Science", "Computer Knowledge"];

export function RoadmapPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetExam, setTargetExam] = useState("Railway NTPC");
  const [weakSubjects, setWeakSubjects] = useState<string[]>(["Reasoning"]);
  const [availableHours, setAvailableHours] = useState(4);
  const [previousPerformance, setPreviousPerformance] = useState("");
  const [aiPlan, setAiPlan] = useState<GeneratePersonalizedStudyPlanOutput | null>(null);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setAiPlan(null);
    try {
        const result = await generatePersonalizedStudyPlan({
            targetExam,
            weakSubjects,
            availableHours,
            previousPerformance: previousPerformance || undefined
        });
        setAiPlan(result);
    } catch (error) {
        console.error("Failed to generate plan", error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate AI study plan. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  }

  const handleSubjectToggle = (subject: string) => {
    setWeakSubjects(prev => 
        prev.includes(subject) 
            ? prev.filter(s => s !== subject)
            : [...prev, subject]
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Your Study Roadmap
        </h1>
        <p className="text-muted-foreground">
          Choose between a general 4-week plan or a personalized AI-generated roadmap.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Roadmap</TabsTrigger>
            <TabsTrigger value="ai-powered"><Wand2 className="mr-2 h-4 w-4" /> AI-Powered Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
            <div className="relative pl-6">
                {/* Timeline */}
                <div className="absolute left-[34px] top-0 h-full w-0.5 bg-border -translate-x-1/2" />

                <div className="space-y-12">
                    {studyPlan.map((weekData) => (
                        <div key={weekData.week} className="relative">
                            <div className="absolute left-[34px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                            <Card className="ml-12">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Week {weekData.week}: {weekData.title}</CardTitle>
                                        <CardDescription>Focus areas for this week.</CardDescription>
                                    </div>
                                    <Badge variant={weekData.status === "Completed" ? "default" : (weekData.status === "In Progress" ? "secondary" : "outline")}>{weekData.status}</Badge>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {weekData.subjects.map(subject => (
                                        <div key={subject.name}>
                                            <h4 className="font-semibold text-lg flex items-center gap-2 mb-3">
                                                <subject.icon className="h-5 w-5 text-primary" />
                                                {subject.name}
                                            </h4>
                                            <div className="space-y-3">
                                                {subject.tasks.map(task => (
                                                    <div key={task.description} className="flex items-center gap-3 text-sm">
                                                        {task.completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                                                        <span className={task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>{task.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className="mt-6" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </TabsContent>

        <TabsContent value="ai-powered" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Study Plan</CardTitle>
                    <CardDescription>Enter your details and let LIBRA AI create a personalized study plan for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="target-exam">Target Exam</Label>
                            <Input id="target-exam" value={targetExam} onChange={e => setTargetExam(e.target.value)} placeholder="e.g. Railway NTPC, SBI PO" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="available-hours">Available Hours per Day</Label>
                            <Select value={String(availableHours)} onValueChange={val => setAvailableHours(Number(val))}>
                                <SelectTrigger id="available-hours">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(8)].map((_, i) => (
                                        <SelectItem key={i+1} value={String(i+1)}>{i+1} hour{i > 0 ? 's' : ''}</SelectItem>
                                    ))}
                                    <SelectItem value="10">10 hours</SelectItem>
                                    <SelectItem value="12">12 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Weak Subjects</Label>
                        <div className="flex flex-wrap gap-2">
                            {subjectsOptions.map(subject => (
                                <Button 
                                    key={subject}
                                    variant={weakSubjects.includes(subject) ? "default" : "outline"}
                                    onClick={() => handleSubjectToggle(subject)}
                                >
                                    {subject}
                                </Button>
                            ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="prev-performance">Previous Mock Test Performance (Optional)</Label>
                        <Textarea id="prev-performance" value={previousPerformance} onChange={e => setPreviousPerformance(e.target.value)} placeholder="e.g. Scored 65/100 in last mock. Low score in DI and Puzzles." />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <Button onClick={handleGeneratePlan} disabled={isGenerating}>
                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isGenerating ? "Generating Plan..." : "Generate AI Plan"}
                    </Button>
                    {isGenerating && (
                        <div className="w-full flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    )}
                    {aiPlan && (
                        <Card className="w-full bg-muted/50">
                            <CardHeader>
                                <CardTitle>Your Personalized Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap font-sans text-sm">{aiPlan.studyPlan}</pre>
                            </CardContent>
                        </Card>
                    )}
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
