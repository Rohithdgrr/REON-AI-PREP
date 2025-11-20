
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
            
            <UserProfileCard />
            
            <StatsCards />

            <div className="grid gap-6 xl:grid-cols-3">
                <ProgressCard />
                <WeaknessRadar />
                <TodaysPlan />
            </div>
            
            <div className="grid gap-6 xl:grid-cols-2">
                <TasksCard />
                <MissionsCard />
            </div>

            <Leaderboard />

        </div>
    )
}
