
"use client";

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

const suggestions = [
  {
    title: "Understand Your Goal Clearly",
    points: [
      "Identify which exam category suits you — Banking (SBI, IBPS, RBI) or Railways (RRB NTPC, Group D, ALP, etc.).",
      "Check the eligibility criteria, exam pattern, and job roles.",
      "Clarity helps you plan your preparation effectively.",
    ],
  },
  {
    title: "Build a Strong Foundation",
    points: [
      "Start with basic concepts of Maths, English, and Reasoning.",
      "Refer to NCERT books (6th–10th) to clear fundamentals.",
      "For beginners, focus on accuracy first, then on speed.",
    ],
  },
  {
    title: "Plan a Realistic Study Schedule",
    points: [
      "Create a daily routine with fixed time slots for each subject.",
      "Keep short-term goals (weekly targets) and long-term goals (monthly coverage).",
      "Include regular breaks and revision time to avoid burnout.",
    ],
  },
  {
    title: "Focus on Conceptual Clarity",
    points: [
      "Understand the logic behind each question instead of memorizing answers.",
      "Practice topic-wise tests before moving to full-length mocks.",
      "Revisit topics until you can solve them confidently within time limits.",
    ],
  },
  {
    title: "Choose Quality Resources",
    points: [
      "Banking Exams: Oliveboard, Adda247, BankersAdda, PracticeMock.",
      "Railway Exams: Lucent GK, Testbook, Rakesh Yadav Quant, RS Aggarwal Reasoning.",
      "Watch YouTube classes or join online courses for expert guidance.",
    ],
  },
  {
    title: "Keep Track of Notifications",
    points: [
      "Regularly check official websites: rrbcdg.gov.in for Railway jobs, ibps.in, and sbi.co.in/careers for Banking jobs.",
      "Subscribe to job alert sites or Telegram channels for instant updates.",
    ],
  },
  {
    title: "Strengthen Current Affairs & General Awareness",
    points: [
      "Read The Hindu, Indian Express, or Dainik Jagran (National Edition) daily.",
      "Revise monthly current affairs PDFs and banking awareness capsules.",
      "Make short notes for static GK and important government schemes.",
    ],
  },
  {
    title: "Practice Regularly",
    points: [
      "Attempt sectional tests and mock exams weekly.",
      "Analyze your performance to find weak areas.",
      "Work on speed and accuracy — both matter equally in online tests.",
    ],
  },
  {
    title: "Stay Motivated and Consistent",
    points: [
      "Preparation is a marathon, not a sprint.",
      "Avoid unnecessary distractions like social media.",
      "Read success stories of toppers to stay inspired.",
      "Remember: Small daily progress leads to big results.",
    ],
  },
  {
    title: "Prepare for the Interview (After Written Exam)",
    points: [
      "Work on communication skills and general awareness.",
      "Read about banking terms, railway structure, and government policies.",
      "Practice mock interviews to improve confidence.",
    ],
  },
];

const quickRecap = [
    { area: "Goal Setting", suggestion: "Choose the right exam and understand its pattern" },
    { area: "Study Plan", suggestion: "Create a realistic, consistent schedule" },
    { area: "Resources", suggestion: "Use updated books and online platforms" },
    { area: "Practice", suggestion: "Regular mock tests and performance tracking" },
    { area: "Motivation", suggestion: "Stay disciplined and positive" },
]

export function SuggestionsPage() {
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

      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                {index + 1}. {suggestion.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {suggestion.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
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
      
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
            <CardTitle>Final Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Cracking a Railway or Bank job is all about planning, perseverance, and patience. Stay consistent, use authentic sources, and keep improving your weak areas. With dedication, success will follow.</p>
        </CardContent>
      </Card>

    </div>
  );
}
