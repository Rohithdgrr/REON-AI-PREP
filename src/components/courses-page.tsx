
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
import { BookOpen, Bot, Award, PlayCircle, FileQuestion, Info } from "lucide-react";
import { Progress } from "./ui/progress";

const courses = [
  {
    id: 1,
    title: "Complete Quantitative Aptitude (Beginner to Advanced)",
    description: "An AI-structured course covering all Quant topics from basics to advanced problem-solving for Bank & Railway exams.",
    progress: 75,
    tags: ["Quant", "AI-Powered", "Bank", "Railway"],
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Master Reasoning Puzzles & Seating Arrangements",
    description: "Deep dive into complex reasoning puzzles. Includes auto-generated tests and timed drills.",
    progress: 40,
    tags: ["Reasoning", "AI-Tests", "Bank PO"],
    icon: Bot,
  },
  {
    id: 3,
    title: "English for Competitive Exams",
    description: "Improve your grammar, vocabulary, and reading comprehension with AI-driven exercises and evaluations.",
    progress: 0,
    tags: ["English", "Vocabulary", "Grammar"],
    icon: BookOpen,
  },
  {
    id: 4,
    title: "General & Banking Awareness 2024",
    description: "Stay updated with the latest in current affairs, banking news, and static GK. AI-curated daily updates.",
    progress: 90,
    tags: ["GA", "Banking", "Current Affairs"],
    icon: Bot,
  },
];

export function CoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          AI-Powered Courses
        </h1>
        <p className="text-muted-foreground">
          Structured learning paths from beginner to advanced, all powered by AI.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <course.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="pt-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {course.progress > 0 && (
                    <div className="w-full mb-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                    </div>
                )}
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3">
                <Button className="w-full">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {course.progress > 0 ? "Continue Course" : "Enroll Now"}
                </Button>
                <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" className="w-full">
                        <Info className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                    <Button variant="outline" className="w-full">
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Start Quiz
                    </Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
