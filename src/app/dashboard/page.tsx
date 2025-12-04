
import { type Metadata } from 'next';
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { MissionsCard } from "@/components/dashboard/missions-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TasksCard } from "@/components/dashboard/tasks-card";
import { TodaysPlan } from "@/components/dashboard/todays-plan";
import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { WeaknessRadar } from "@/components/dashboard/weakness-radar";

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Your central hub for exam preparation. Track your progress, view your study plan, and climb the leaderboard.',
};


export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            
            <UserProfileCard />
            
            <StatsCards />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <WeaknessRadar />
                <TodaysPlan />
            </div>
            
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <TasksCard />
                <MissionsCard />
            </div>

            <Leaderboard />

        </div>
    )
}
