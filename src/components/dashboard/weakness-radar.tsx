import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function WeaknessRadar() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Weakness Radar</CardTitle>
        <CardDescription>Top areas to focus on.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <span className="font-medium">1. Reasoning</span>
            <Badge variant="destructive">38%</Badge>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium">2. Quant</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">56%</Badge>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium">3. English</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">72%</Badge>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
