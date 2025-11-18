import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function TodaysPlan() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Today's Plan</CardTitle>
        <CardDescription>You have 4.5 hours free today.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="font-semibold text-foreground">▸ Reasoning:</span> 45 min (weak)
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold text-foreground">▸ Quant:</span> 1 hr 30 min (priority)
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold text-foreground">▸ GS Revision:</span> 1 hr + 20 Qs
          </li>
        </ul>
        <Button className="w-full">Start Now</Button>
      </CardContent>
    </Card>
  );
}
