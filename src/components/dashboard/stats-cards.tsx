
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
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Level</CardTitle>
          <CardDescription>Your current level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+2 levels from last week</p>
        </CardContent>
      </Card>
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Rank</CardTitle>
          <CardDescription>Your overall rank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">#1,280</div>
           <p className="text-xs text-muted-foreground">↑150 ranks from last month</p>
        </CardContent>
      </Card>
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader>
          <CardTitle>RAX-Score</CardTitle>
          <CardDescription>Your readiness score</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold">850</div>
            <p className="text-xs text-muted-foreground">Top 15% of aspirants</p>
        </CardContent>
      </Card>
    </div>
  );
}
