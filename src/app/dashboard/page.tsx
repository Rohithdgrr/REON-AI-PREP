import { Leaderboard } from "@/components/dashboard/leaderboard";
import { MissionsCard } from "@/components/dashboard/missions-card";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TasksCard } from "@/components/dashboard/tasks-card";
import { TodaysPlan } from "@/components/dashboard/todays-plan";
import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { WeaknessRadar } from "@/components/dashboard/weakness-radar";


export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold font-headline tracking-tight">
                        Welcome back, Srinivas!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's your performance summary for today. Keep up the great work!
                    </p>
                </div>
                <div className="hidden lg:flex justify-end">
                    <UserProfileCard />
                </div>
            </div>
            
            <StatsCards />

            <div className="grid gap-6 lg:grid-cols-3">
                <ProgressCard />
                <WeaknessRadar />
                <TodaysPlan />
            </div>

            <Leaderboard />
            
            <div className="grid gap-6 lg:grid-cols-2">
                <TasksCard />
                <MissionsCard />
            </div>

        </div>
    )
}
