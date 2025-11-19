
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Star, CheckCircle2 } from "lucide-react";

const tasks = [
    { text: "Daily Check-in", xp: "+10 XP", completed: true },
    { text: "Complete 'Today's Plan'", xp: "+50 XP", completed: true },
    { text: "Finish one topic-wise quiz", xp: "+25 XP", completed: false },
    { text: "Attempt a full syllabus mock test", xp: "+100 XP", completed: false },
    { text: "Spend 30 mins in the Practice Arena", xp: "+20 XP", completed: false },
    { text: "Share a note in the Knowledge Hub", xp: "+15 XP", completed: false },
    { text: "Answer a question in R-Chat", xp: "+10 XP", completed: false },
    { text: "Listen to one full podcast episode", xp: "+15 XP", completed: false },
]

export function TasksCard() {
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
                <span className="ml-auto text-sm font-semibold text-blue-500">{task.xp}</span>
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
