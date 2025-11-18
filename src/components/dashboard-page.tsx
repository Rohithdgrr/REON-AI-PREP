import {
  Activity,
  ArrowUp,
  Award,
  Flame,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaderboard } from "./dashboard/leaderboard";
import { ProgressCard } from "./dashboard/progress-card";
import { TodaysPlan } from "./dashboard/todays-plan";
import { WeaknessRadar } from "./dashboard/weakness-radar";
import { StatsCards } from "./dashboard/stats-cards";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Welcome back, Srinivas! 🔥
          </h1>
          <p className="text-muted-foreground">
            Your All-India Rank: #127 <ArrowUp className="inline h-4 w-4 text-green-500" />43 since yesterday
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Flame className="h-5 w-5 text-orange-500" /> 46-Day Streak
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Award className="h-5 w-5 text-yellow-500" /> Rax Banker Lvl 12
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Star className="h-5 w-5 text-blue-500" /> 12,450 XP
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <ProgressCard />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TodaysPlan />
          <WeaknessRadar />
          <Card className="lg:col-span-1">
             <CardHeader>
              <CardTitle>Time This Week</CardTitle>
              <CardDescription>Your study time distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Chart component to be added here.</p>
            </CardContent>
          </Card>
        </div>
        <Leaderboard />
        <StatsCards />
      </div>
    </div>
  );
}
