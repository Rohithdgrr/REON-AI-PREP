
"use client";
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
        <Leaderboard />
        <StatsCards />
      </div>
    </div>
  );
}
