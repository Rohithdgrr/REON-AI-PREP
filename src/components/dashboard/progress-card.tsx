import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>78% Syllabus Completed</CardTitle>
        <CardDescription>
          Keep up the great work! You'll see confetti animations at 80%, 90%, and 100%.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={78} className="w-full" />
      </CardContent>
    </Card>
  );
}
