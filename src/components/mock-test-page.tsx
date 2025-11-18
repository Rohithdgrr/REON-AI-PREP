
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Shield, FileClock, Info, BarChart, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const upcomingTests = [
  {
    id: "mock-sbi-po-05",
    title: "SBI PO Prelims Full Mock Test #5",
    date: "Today",
    time: "9:00 PM",
    duration: "60 mins",
    questions: 100,
    status: "Live",
  },
   {
    id: "mock-rrb-ntpc-12",
    title: "RRB NTPC CBT-1 Full Mock Test #12",
    date: "Tomorrow",
    time: "9:00 AM",
    duration: "90 mins",
    questions: 120,
    status: "Upcoming",
  },
];

const pastResults = [
    { id: "mock-sbi-po-04", title: "SBI PO Prelims Full Mock Test #4", score: "78/100", rank: "2,451", accuracy: "89%" },
    { id: "mock-rrb-ntpc-11", title: "RRB NTPC CBT-1 Full Mock Test #11", score: "85/120", rank: "#5,102", accuracy: "81%" },
];

export function MockTestPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Mock Test Arena
        </h1>
        <p className="text-muted-foreground">
          Simulate the real exam environment. High-difficulty tests with AI proctoring.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Mock Tests</CardTitle>
          <CardDescription>Tests go live at the scheduled time. Be ready!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {upcomingTests.map((test) => (
            <Card key={test.id} className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold">{test.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1.5"><FileClock className="h-4 w-4" /> {test.duration}</div>
                  <div className="flex items-center gap-1.5"><Info className="h-4 w-4" /> {test.questions} Questions</div>
                </div>
                 <div className="mt-2">
                    {test.status === "Live" && <Badge variant="destructive" className="animate-pulse">● Live Now</Badge>}
                    {test.status === "Upcoming" && <Badge variant="secondary">{test.date} at {test.time}</Badge>}
                </div>
              </div>
              <Button size="lg" className="w-full sm:w-auto" disabled={test.status !== "Live"}>
                Join Test
              </Button>
            </Card>
          ))}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Proctoring Enabled</AlertTitle>
            <AlertDescription className="flex items-center gap-2">
              <Camera className="h-4 w-4" /> Your webcam will be active during the test. Copy-paste and tab-switching are disabled.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Past Mock Test Results</CardTitle>
          <CardDescription>Analyze your performance and learn from your mistakes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.title}</TableCell>
                  <TableCell>{result.score}</TableCell>
                  <TableCell>{result.rank}</TableCell>
                  <TableCell>{result.accuracy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                       <BarChart className="mr-2 h-4 w-4" />
                       View Analysis
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
