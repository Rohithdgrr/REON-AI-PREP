"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuizPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight">
        Quiz
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Quiz content will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
