"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generatePersonalizedStudyPlan, GeneratePersonalizedStudyPlanInput } from "@/ai/flows/generate-personalized-study-plan";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function RoadmapPage() {
  const [formData, setFormData] = useState<GeneratePersonalizedStudyPlanInput>({
    targetExam: "Railway NTPC",
    weakSubjects: ["Reasoning", "English"],
    availableHours: 4,
    previousPerformance: "Scored 65/100 in last mock test. Weak in algebra and geometry."
  });
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === "weakSubjects") {
      setFormData((prev) => ({ ...prev, [id]: value.split(",").map(s => s.trim()) }));
    } else if (id === "availableHours") {
      setFormData((prev) => ({ ...prev, [id]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStudyPlan(null);
    try {
      const result = await generatePersonalizedStudyPlan(formData);
      setStudyPlan(result.studyPlan);
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate study plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight">
        Study Roadmap
      </h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Generate Your Plan</CardTitle>
            <CardDescription>Fill in your details to get a personalized study roadmap from our AI.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetExam">Target Exam</Label>
                <Input id="targetExam" value={formData.targetExam} onChange={handleInputChange} placeholder="e.g., Railway NTPC, SBI PO" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weakSubjects">Weak Subjects (comma-separated)</Label>
                <Input id="weakSubjects" value={formData.weakSubjects.join(", ")} onChange={handleInputChange} placeholder="e.g., Reasoning, English" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableHours">Available Hours per Day</Label>
                <Input id="availableHours" type="number" value={formData.availableHours} onChange={handleInputChange} placeholder="e.g., 4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousPerformance">Previous Performance (Optional)</Label>
                <Textarea id="previousPerformance" value={formData.previousPerformance} onChange={handleInputChange} placeholder="e.g., Scored 65/100, weak in algebra..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Roadmap"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Personalized Roadmap</CardTitle>
            <CardDescription>Follow this plan to ace your exam. The plan will appear here once generated.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {studyPlan ? (
              <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: studyPlan.replace(/\n/g, '<br />') }} />
            ) : (
              !isLoading && <p className="text-muted-foreground text-center py-16">Your AI-generated study plan will be displayed here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
