

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export function StatsCards() {
  const { user } = useUser();
  const firestore = useFirestore();

  const leaderboardQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'leaderboardEntries'), where("userId", "==", user.uid));
  }, [firestore, user]);

  const { data: leaderboardData, isLoading } = useCollection(leaderboardQuery);
  const userLeaderboardEntry = leaderboardData?.[0];

  if (isLoading) {
    return (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <Card><CardHeader><Skeleton className="h-4 w-20" /><Skeleton className="h-3 w-24 mt-1" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /><Skeleton className="h-3 w-32 mt-2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-12" /><Skeleton className="h-3 w-24 mt-1" /></CardHeader><CardContent><Skeleton className="h-8 w-24" /><Skeleton className="h-3 w-32 mt-2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-28 mt-1" /></CardHeader><CardContent><Skeleton className="h-8 w-20" /><Skeleton className="h-3 w-28 mt-2" /></CardContent></Card>
        </div>
    )
  }
  
  const level = userLeaderboardEntry ? Math.floor((userLeaderboardEntry.score || 0) / 1000) : 1;

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 shimmer-gradient opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <CardHeader>
          <CardTitle>Level</CardTitle>
          <CardDescription>Your current level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{level}</div>
          <p className="text-xs text-muted-foreground">Based on your XP</p>
        </CardContent>
      </Card>
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 shimmer-gradient opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <CardHeader>
          <CardTitle>Rank</CardTitle>
          <CardDescription>Your overall rank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">#{userLeaderboardEntry?.rank ?? 'N/A'}</div>
           <p className="text-xs text-muted-foreground">in Telangana</p>
        </CardContent>
      </Card>
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 shimmer-gradient opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <CardHeader>
          <CardTitle>RAX-Score</CardTitle>
          <CardDescription>Your readiness score</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold">{userLeaderboardEntry?.score ?? 0}</div>
            <p className="text-xs text-muted-foreground">XP Earned</p>
        </CardContent>
      </Card>
    </div>
  );
}
