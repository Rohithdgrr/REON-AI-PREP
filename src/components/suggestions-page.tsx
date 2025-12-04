
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { stickerGifData } from "@/lib/sticker-gif-data";

const generalSuggestions = [
  {
    id: "goal",
    title: "Understand Your Goal Clearly",
    points: [
      "Identify which exam category suits you — Banking (SBI, IBPS, RBI) or Railways (RRB NTPC, Group D, ALP, etc.).",
      "Check the eligibility criteria, exam pattern, and job roles.",
      "Clarity helps you plan your preparation effectively.",
    ],
    imageId: "suggestion-goal",
  },
  {
    id: "schedule",
    title: "Plan a Realistic Study Schedule",
    points: [
      "Create a daily routine with fixed time slots for each subject.",
      "Keep short-term goals (weekly targets) and long-term goals (monthly coverage).",
      "Include regular breaks and revision time to avoid burnout.",
    ],
    imageId: "suggestion-schedule",
  },
  {
    id: "foundation",
    title: "Build a Strong Foundation",
    points: [
      "Start with basic concepts of Maths, English, and Reasoning.",
      "Refer to NCERT books (6th–10th) to clear fundamentals.",
      "For beginners, focus on accuracy first, then on speed.",
    ],
    imageId: "suggestion-foundation",
  },
  {
    id: "resources",
    title: "Choose Quality Resources",
    points: [
      "Banking Exams: Oliveboard, Adda247, BankersAdda, PracticeMock.",
      "Railway Exams: Lucent GK, Testbook, Rakesh Yadav Quant, RS Aggarwal Reasoning.",
      "Watch YouTube classes or join online courses for expert guidance.",
    ],
    imageId: "suggestion-resources",
  },
  {
    id: "concepts",
    title: "Focus on Conceptual Clarity",
    points: [
      "Understand the logic behind each question instead of memorizing answers.",
      "Practice topic-wise tests before moving to full-length mocks.",
      "Revisit topics until you can solve them confidently within time limits.",
    ],
    imageId: "suggestion-concepts",
  },
  {
    id: "practice",
    title: "Practice Regularly",
    points: [
      "Attempt sectional tests and mock exams weekly.",
      "Analyze your performance to find weak areas.",
      "Work on speed and accuracy — both matter equally in online tests.",
    ],
    imageId: "suggestion-practice",
  },
  {
    id: "awareness",
    title: "Strengthen Current Affairs & General Awareness",
    points: [
      "Read The Hindu, Indian Express, or Dainik Jagran (National Edition) daily.",
      "Revise monthly current affairs PDFs and banking awareness capsules.",
      "Make short notes for static GK and important government schemes.",
    ],
    imageId: "suggestion-awareness",
  },
  {
    id: "notifications",
    title: "Keep Track of Notifications",
    points: [
      "Regularly check official websites: rrbcdg.gov.in for Railway jobs, ibps.in, and sbi.co.in/careers for Banking jobs.",
      "Subscribe to job alert sites or Telegram channels for instant updates.",
    ],
    imageId: "suggestion-notifications",
  },
  {
    id: "interview",
    title: "Prepare for the Interview (After Written Exam)",
    points: [
      "Work on communication skills and general awareness.",
      "Read about banking terms, railway structure, and government policies.",
      "Practice mock interviews to improve confidence.",
    ],
    imageId: "suggestion-interview",
  },
  {
    id: "motivation",
    title: "Stay Motivated and Consistent",
    points: [
      "Preparation is a marathon, not a sprint.",
      "Avoid unnecessary distractions like social media.",
      "Read success stories of toppers to stay inspired.",
      "Remember: Small daily progress leads to big results.",
    ],
    imageId: "suggestion-motivation",
  },
];

type GeneratePrepSuggestionsOutput = {
  suggestions: {
    title: string;
    points: string[];
  }[];
};


const quickRecap = [
    { area: "Goal Setting", suggestion: "Choose the right exam and understand its pattern" },
    { area: "Study Plan", suggestion: "Create a realistic, consistent schedule" },
    { area: "Resources", suggestion: "Use updated books and online platforms" },
    { area: "Practice", suggestion: "Regular mock tests and performance tracking" },
    { area: "Motivation", suggestion: "Stay disciplined and positive" },
]

function buildPrompt(targetExam: string): string {
    return `You are an expert career counselor for government job aspirants in India. 
  
  Generate a list of 5-7 high-level, actionable preparation suggestions for an aspirant targeting the "${targetExam}" exam category. 
  
  For each suggestion, provide a clear title and a few bullet points explaining the suggestion. The advice should be practical and encouraging.

  Focus on topics like:
  - Understanding the exam pattern and syllabus
  - Creating a study schedule
  - Choosing the right resources
  - The importance of mock tests
  - Subject-specific strategies (if applicable for the category)
  - Staying motivated
  
  Do not just provide a generic list. Tailor the points based on the specifics of the "${targetExam}" category. For example, if the target is 'Bank', mention sectional timings and the importance of speed. If it's 'Railway', mention the importance of General Science. If it's 'Both', provide advice on how to balance the preparation for both.
  
  Return the result ONLY in a valid JSON format. Do not add any introductory text, closing remarks, or markdown formatting. The output must be a single, parseable JSON object that strictly follows this schema:
  {
    "suggestions": [
      {
        "title": "string",
        "points": ["string", "string", ...]
      }
    ]
  }
  `.trim();
}

export function SuggestionsPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [examType, setExamType] = useState("Both");
    const [aiSuggestions, setAiSuggestions] = useState<GeneratePrepSuggestionsOutput | null>(null);
    const { toast } = useToast();
    const [apiKey] = useState("nJCcmgS1lSo13OVE79Q64QndL3nCDjQI");

    const handleGenerate = async () => {
        setIsGenerating(true);
        setAiSuggestions(null);

        const prompt = buildPrompt(examType);

        try {
            const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: "open-mistral-nemo",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            });
            if (!mistralResponse.ok) throw new Error(`Mistral API Error: ${mistralResponse.statusText}`);
            const result = await mistralResponse.json();
            setAiSuggestions(result.choices[0].message.content);
            toast({ title: "AI Suggestions Generated!", description: "Your personalized suggestions are ready." });
        } catch (error: any) {
            console.error("Failed to generate suggestions", error);
            toast({ variant: 'destructive', title: 'Generation Failed', description: error.message || 'Could not generate AI suggestions. Please try again.' });
        } finally {
            setIsGenerating(false);
        }
    }


  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Suggestions for Aspirants
        </h1>
        <p className="text-muted-foreground mt-2">
          Your guide to cracking Indian Government Jobs in Railway & Bank Exams.
        </p>
      </div>

      <Tabs defaultValue="ai-powered" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-powered"><Wand2 className="mr-2"/> AI-Powered Suggestions</TabsTrigger>
            <TabsTrigger value="general">General Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="ai-powered" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personalized AI Suggestions</CardTitle>
                    <CardDescription>Get suggestions tailored to your exam type from LIBRA AI.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Select value={examType} onValueChange={setExamType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Exam Type" />
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
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isGenerating ? "Generating..." : "Generate Suggestions"}
                    </Button>
                </CardContent>
                {isGenerating && (
                    <CardContent>
                        <div className="w-full flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    </CardContent>
                )}
                {aiSuggestions && (
                     <CardContent className="space-y-6 pt-0 border-t mt-4 pt-6">
                        {aiSuggestions.suggestions.map((suggestion, index) => (
                            <div key={index}>
                                <h4 className="font-semibold text-lg">{index + 1}. {suggestion.title}</h4>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                                    {suggestion.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                )}
                 {!aiSuggestions && !isGenerating && (
                    <CardContent>
                        <div className="text-center text-muted-foreground py-16">
                            <p>Select an exam type and click "Generate Suggestions" to get started.</p>
                        </div>
                    </CardContent>
                 )}
            </Card>
        </TabsContent>
        <TabsContent value="general" className="mt-6">
             <div className="space-y-8">
                <Carousel className="w-full">
                  <CarouselContent>
                    {generalSuggestions.map((suggestion, index) => {
                      const image = PlaceHolderImages.find(img => img.id === suggestion.imageId);
                      const sticker = stickerGifData.stickers[index % stickerGifData.stickers.length];
                      return (
                        <CarouselItem key={suggestion.id}>
                          <Card className="overflow-hidden">
                            <div className="grid md:grid-cols-2">
                              <div className="p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
                                <div className="mb-4 flex items-start justify-between">
                                  <CardTitle className="text-2xl font-headline">
                                    {suggestion.title}
                                  </CardTitle>
                                  {sticker && (
                                    <Image 
                                      src={sticker.url} 
                                      alt={sticker.alt} 
                                      width={64} 
                                      height={64}
                                      unoptimized
                                      className="w-16 h-16 transform rotate-12 flex-shrink-0 ml-4"
                                    />
                                  )}
                                </div>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                  {suggestion.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                              {image && (
                                <div className="relative min-h-[250px] md:min-h-[400px] order-1 md:order-2">
                                  <Image
                                    src={image.imageUrl}
                                    alt={image.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.imageHint}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                  />
                                </div>
                              )}
                            </div>
                          </Card>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Quick Recap</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Area</TableHead>
                                <TableHead>Suggestion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quickRecap.map((item) => (
                                <TableRow key={item.area}>
                                    <TableCell className="font-medium">{item.area}</TableCell>
                                    <TableCell>{item.suggestion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Card className="mt-8 bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle>Final Suggestion</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Cracking a Railway or Bank job is all about planning, perseverance, and patience. Stay consistent, use authentic sources, and keep improving your weak areas. With dedication, success will follow.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    