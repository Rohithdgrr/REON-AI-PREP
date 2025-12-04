

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, BookOpen, BrainCircuit, MessageSquare, Newspaper, Flag, Wand2, Loader2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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



function buildPlanPrompt(input: {targetExam: string, weakSubjects: string[], availableHours: number, previousPerformance: string}): string {
    let prompt = `You are an expert AI career counselor who creates personalized study plans for competitive exam aspirants in India.

Generate a detailed, actionable, and encouraging weekly study plan for 4 weeks based on the following user inputs:

- Target Exam: ${input.targetExam}
- Weak Subjects: ${input.weakSubjects.join(', ')}
- Available Hours Per Day: ${input.availableHours}
`;

    if (input.previousPerformance) {
        prompt += `- Previous Performance Context: ${input.previousPerformance}\nTake this previous performance into account to specifically address areas of improvement.\n`;
    }

    prompt += `
**Instructions for the Output:**

1.  **Format**: The entire output must be a single string formatted in clean **Markdown**. Use headings, bold text, and bullet points.
2.  **Structure**:
    *   Start with a main heading, like \`# 🚀 Your Personalized 4-Week Study Plan for ${input.targetExam}\`.
    *   Create a section for each of the 4 weeks (e.g., \`## Week 1: Foundation Building\`).
    *   Under each week, create sub-headings for each day of the week (e.g., \`### Day 1: Monday\`).
    *   For each day, provide a bulleted list of specific, actionable tasks.
    *   Use bold (\`**\`) to highlight key subjects, topics, or actions for emphasis.
3.  **Content**:
    *   Allocate more time and priority to the specified **weak subjects**.
    *   The daily plan should be realistic for the given \`availableHours\`.
    *   Include a mix of learning new concepts, practice sessions (e.g., "Solve 20 PYQs"), and revision.
    *   The plan should logically progress from foundational topics in Week 1 to advanced topics and mock tests in Week 4.
    *   Add a concluding motivational sentence.
4.  **Tone**: Make the plan encouraging and motivational. Use relevant emojis to make it more engaging (e.g., 🚀, 📚, 💪).

**Example Snippet:**
\`\`\`markdown
# 🚀 Your Personalized 4-Week Study Plan for SBI PO

Here is a plan tailored to your needs. Let's get started! 💪

## Week 1: Mastering the Basics

### Day 1: Monday
- **🧠 Reasoning (Weak Subject)**: 1.5 hours - Practice 2 sets of Puzzles.
- **📊 Quantitative Aptitude**: 1 hour - Revise Percentage formulas and solve 20 basic questions.
...
\`\`\`
`;
    return prompt.trim();
}

function markdownToHtml(markdown: string) {
    // Process headings, bold, italic, and horizontal rules
    let html = markdown
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/---/g, '<hr class="my-6 border-border" />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Process lists (unordered and ordered)
    html = html.replace(/^( *[-*] .*\n?)+/gm, (match) => {
        const items = match.trim().split('\n').map(item => `<li>${item.replace(/[-*] /, '').trim()}</li>`).join('');
        return `<ul class="list-disc list-inside space-y-2 mb-4">${items}</ul>`;
    });
     html = html.replace(/^( *\d+\. .*\n?)+/gm, (match) => {
        const items = match.trim().split('\n').map(item => `<li>${item.replace(/\d+\. /, '').trim()}</li>`).join('');
        return `<ol class="list-decimal list-inside space-y-2 mb-4">${items}</ol>`;
    });

    html = html.replace(/\n/g, '<br />');
    html = html.replace(/<\/li><br \/>/g, '</li>');


    return html;
}


export function RoadmapPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetExam, setTargetExam] = useState("Railway NTPC");
  const [weakSubjects, setWeakSubjects] = useState<string[]>(["Reasoning"]);
  const [customWeakSubject, setCustomWeakSubject] = useState("");
  const [availableHours, setAvailableHours] = useState(4);
  const [previousPerformance, setPreviousPerformance] = useState("");
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [apiKey] = useState("nJCcmgS1lSo13OVE79Q64QndL3nCDjQI"); // State without setter, effectively a constant
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    if (!targetExam) {
        toast({
            variant: "destructive",
            title: "Target Exam Required",
            description: "Please select your target exam.",
        });
        return;
    }

    setIsGenerating(true);
    setAiPlan("");

    const allWeakSubjects = [...weakSubjects];
    if(customWeakSubject.trim()){
      allWeakSubjects.push(customWeakSubject.trim());
    }

    const prompt = buildPlanPrompt({
        targetExam,
        weakSubjects: allWeakSubjects,
        availableHours,
        previousPerformance
    });

    try {
        const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "open-mistral-7b",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7, max_tokens: 2048
            })
        });
        if (!mistralResponse.ok) throw new Error(`Mistral API Error: ${mistralResponse.statusText}`);
        const result = await mistralResponse.json();
        const planMarkdown = result.choices[0].message.content;
        setAiPlan(markdownToHtml(planMarkdown));
        toast({ title: "AI Plan Generated!", description: "Your personalized study plan is ready below." });

    } catch (error: any) {
        console.error("Failed to generate plan", error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: error.message || "Could not generate AI study plan. Please try again.",
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
  
  const handleAddCustomSubject = () => {
    const subject = customWeakSubject.trim();
    if (subject && !weakSubjects.includes(subject)) {
        setWeakSubjects(prev => [...prev, subject]);
    }
    setCustomWeakSubject("");
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
      
      <Tabs defaultValue="ai-powered" className="w-full">
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
                                    {weekData.subjects.map((subject, sIndex) => (
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
                                            {sIndex < weekData.subjects.length - 1 && <Separator className="mt-6" />}
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
                    <CardDescription>Enter your details and let an AI create a personalized study plan for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="target-exam">Target Exam</Label>
                            <Select value={targetExam} onValueChange={setTargetExam}>
                                <SelectTrigger id="target-exam">
                                    <SelectValue placeholder="Select your target exam" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Railway">Railway</SelectItem>
                                    <SelectItem value="Bank">Bank</SelectItem>
                                    <SelectItem value="Both">Both (Railway & Bank)</SelectItem>
                                    <SelectItem value="GATE">GATE</SelectItem>
                                    <SelectItem value="SSC">SSC (CGL/CHSL)</SelectItem>
                                    <SelectItem value="PSU">PSU</SelectItem>
                                    <SelectItem value="UPSC">UPSC</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <div className="flex gap-2 pt-2">
                            <Input 
                                value={customWeakSubject}
                                onChange={(e) => setCustomWeakSubject(e.target.value)}
                                placeholder="Add another weak subject..."
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSubject()}}
                            />
                            <Button onClick={handleAddCustomSubject}><Plus className="mr-2 h-4 w-4" /> Add</Button>
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
                    {isGenerating && !aiPlan && (
                        <Card className="w-full">
                            <CardContent className="flex flex-col items-center justify-center p-16">
                                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                <p className="text-muted-foreground">The AI is crafting your personalized plan...</p>
                            </CardContent>
                        </Card>
                    )}
                    {aiPlan && (
                        <Card className="w-full bg-muted/50">
                            <CardContent className="pt-6">
                                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-headline prose-h1:text-primary" dangerouslySetInnerHTML={{ __html: aiPlan }} />
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
