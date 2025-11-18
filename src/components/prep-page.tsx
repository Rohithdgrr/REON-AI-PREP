"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrepPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight">
        Preparation
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Preparation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Notes, PYQs, MCQs, Cheatsheets, and Videos will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
