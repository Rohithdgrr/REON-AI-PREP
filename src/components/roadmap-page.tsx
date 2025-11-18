"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RoadmapPage() {
  return (
    <div className="flex flex-col gap-6">
       <h1 className="text-3xl font-bold font-headline tracking-tight">
        Study Roadmap
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Roadmap content will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
