
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

export function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Last Mock</CardTitle>
          <CardDescription>RRB NTPC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">92/100</div>
          <p className="text-xs text-muted-foreground">↑43 rank from previous</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accuracy</CardTitle>
          <CardDescription>Overall performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">92%</div>
           <p className="text-xs text-muted-foreground">Reasoning 88%, Quant 96%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Your achievements</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>🏅 Night Owl</Badge>
          <Badge>⚡ Speed King</Badge>
          <Badge>🔥 45+ Streak</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
