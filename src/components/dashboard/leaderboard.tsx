import { ArrowDown, ArrowUp, Crown, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const leaderboardData = [
  { rank: 1, name: "Ravi_K", accuracy: "99.8%", xp: "10,420", change: "up", isTopper: true },
  { rank: 2, name: "Neha_99", accuracy: "99.1%", xp: "9,890", change: "same" },
  { rank: 3, name: "Sai_RR", accuracy: "98.7%", xp: "9,210", change: "same" },
  { rank: 127, name: "You", accuracy: "92.4%", xp: "12,450", change: "up", changeAmount: 43, isCurrentUser: true },
  { rank: 128, name: "Anil_07", accuracy: "92.3%", xp: "12,430", change: "down" },
];

export function Leaderboard() {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
            <CardTitle>Live Leaderboard (Telangana)</CardTitle>
            <CardDescription>Your current standing among peers.</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">View Full Leaderboard</Button>
            <Button className="w-full sm:w-auto">Challenge #3</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Accuracy</TableHead>
              <TableHead className="text-right">XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user) => (
              <TableRow key={user.rank} className={user.isCurrentUser ? "bg-accent" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    #{user.rank}
                    {user.change === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                    {user.change === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                     {user.name}
                    {user.isTopper && <Crown className="h-4 w-4 text-yellow-500" />}
                    {user.isCurrentUser && user.changeAmount && <Badge variant="secondary">+{user.changeAmount}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">{user.accuracy}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.xp} <Star className="h-4 w-4 text-blue-500" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
