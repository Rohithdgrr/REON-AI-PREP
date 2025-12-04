
'use client';

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowUp, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const missions = [
    { text: "Improve Reasoning accuracy by 5%", completed: true, link: "/dashboard/practice" },
    { text: "Beat your personal best time in a Quant mock test", completed: true, link: "/dashboard/mock" },
    { text: "Climb into the Top 100 on the Telangana leaderboard", completed: false, link: "/dashboard" },
    { text: "Challenge and win against a Top 50 ranked player", completed: false, link: "/dashboard/knowledge-hub?tab=competitions" },
    { text: "Maintain a 95%+ accuracy in 3 consecutive practice tests", completed: false, link: "/dashboard/practice" },
    { text: "Complete a 'Hard' difficulty AI-generated mock test", completed: false, link: "/dashboard/mock" },
    { text: "Reduce average question time in 'Weakness Radar' topics by 10s", completed: false, link: "/dashboard/practice" },
    { text: "Achieve a score of 90+ in the next full syllabus mock test", completed: false, link: "/dashboard/mock" },
];

export function MissionsCard() {
  const router = useRouter();

  const handleStart = (link: string) => {
    router.push(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ArrowUp /> Rank-Up Missions</CardTitle>
        <CardDescription>Complete these to climb the leaderboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {missions.map((mission, index) => (
            <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className={mission.completed ? "text-green-500" : "text-muted-foreground/50"} />
                <span className={mission.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                    {mission.text}
                </span>
                {!mission.completed && <Button size="sm" variant="outline" className="ml-auto" onClick={() => handleStart(mission.link)}>Start</Button>}
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
