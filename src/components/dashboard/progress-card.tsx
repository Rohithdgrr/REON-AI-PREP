
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

export function ProgressCard() {
  const progress = 78;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="text-yellow-500" />
          Power Level: {progress}%
        </CardTitle>
        <CardDescription>
          Your syllabus completion. Keep it up to unlock new features!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
           <div className="absolute top-0 left-0 h-full w-full animate-pulse-fast bg-primary/30" style={{ width: `${progress}%`, animationDuration: '3s' }} />
        </div>
      </CardContent>
    </Card>
  );
}
