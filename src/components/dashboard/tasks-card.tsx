
'use client';

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const tasks = [
    { text: "Daily Check-in", xp: "+10 XP", completed: true, link: "/dashboard" },
    { text: "Complete 'Today's Plan'", xp: "+50 XP", completed: true, link: "/dashboard" },
    { text: "Finish one topic-wise quiz", xp: "+25 XP", completed: false, link: "/dashboard/quiz" },
    { text: "Attempt a full syllabus mock test", xp: "+100 XP", completed: false, link: "/dashboard/mock" },
    { text: "Spend 30 mins in the Practice Arena", xp: "+20 XP", completed: false, link: "/dashboard/practice" },
    { text: "Share a note in the Knowledge Hub", xp: "+15 XP", completed: false, link: "/dashboard/knowledge-hub" },
    { text: "Answer a question in R-Chat", xp: "+10 XP", completed: false, link: "/dashboard/knowledge-hub?tab=r-chat" },
    { text: "Listen to one full podcast episode", xp: "+15 XP", completed: false, link: "/dashboard/podcasts" },
];

export function TasksCard() {
  const router = useRouter();

  const handleStart = (link: string) => {
    router.push(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Star /> Daily XP Tasks</CardTitle>
        <CardDescription>Complete these daily tasks to earn XP and level up.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task, index) => (
            <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className={task.completed ? "text-green-500" : "text-muted-foreground/50"} />
                <span className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                    {task.text}
                </span>
                {!task.completed ? (
                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => handleStart(task.link)}>Start</Button>
                ) : (
                  <span className="ml-auto text-sm font-semibold text-green-500">{task.xp}</span>
                )}
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
