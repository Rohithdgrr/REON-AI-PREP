
"use client";
import {
  Activity,
  ArrowUp,
  Award,
  Flame,
  Star,
  User,
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { MissionsCard } from "./dashboard/missions-card";
import { TasksCard } from "./dashboard/tasks-card";

const chartData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 5 },
  { day: "Sat", hours: 3.5 },
  { day: "Sun", hours: 1.5 },
];

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-1))",
  },
};

export function DashboardPage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-28 w-28 hidden sm:flex rounded-md">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" className="rounded-md" />}
                <AvatarFallback className="rounded-md"><User /></AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-5xl font-bold font-headline tracking-tight">
                  Welcome back, Srinivas! 🔥
                </h1>
                <p className="text-xl text-muted-foreground mt-1">
                  Your All-India Rank: #127 <ArrowUp className="inline h-5 w-5 text-green-500" />43 since yesterday
                </p>
                 <p className="text-md text-muted-foreground">
                  RI ID: RAX202514789
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Card className="flex items-center p-3 gap-3 hover:bg-accent cursor-pointer transition-colors">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                        <p className="text-sm font-bold">46-Day Streak</p>
                        <p className="text-xs text-muted-foreground">Keep it going!</p>
                    </div>
                </Card>
                 <Card className="flex items-center p-3 gap-3 hover:bg-accent cursor-pointer transition-colors">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <div>
                        <p className="text-sm font-bold">Rax Banker Lvl 12</p>
                        <p className="text-xs text-muted-foreground">Level up</p>
                    </div>
                </Card>
                 <Card className="flex items-center p-3 gap-3 hover:bg-accent cursor-pointer transition-colors">
                    <Star className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm font-bold">12,450 XP</p>
                        <p className="text-xs text-muted-foreground">New missions</p>
                    </div>
                </Card>
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
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                   <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    unit="h"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <StatsCards />
        <div className="grid gap-6 md:grid-cols-2">
            <MissionsCard />
            <TasksCard />
        </div>
        <Leaderboard />
      </div>
    </div>
  );
}
