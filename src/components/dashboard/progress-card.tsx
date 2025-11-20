
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from "firebase/firestore";
import { Zap } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function ProgressCard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const courseProgressQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'courseProgress'));
  }, [firestore, user]);

  const { data: progressData, isLoading } = useCollection(courseProgressQuery);

  const totalCompletionRate = progressData?.length
    ? progressData.reduce((acc, curr) => acc + (curr.completionRate || 0), 0) / progressData.length
    : 0;
  
  const progress = Math.round(totalCompletionRate);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="text-yellow-500" />
          Syllabus Power: {progress}%
        </CardTitle>
        <CardDescription>
          Your average course completion. Keep it up!
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
