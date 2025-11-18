
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, BookOpen, BrainCircuit, MessageSquare, Newspaper, Flag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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


export function RoadmapPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Your Study Roadmap
        </h1>
        <p className="text-muted-foreground">
          A 4-week structured plan to conquer the Railway NTPC exam.
        </p>
      </div>
      
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
    </div>
  );
}

