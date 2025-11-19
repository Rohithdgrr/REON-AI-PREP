
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BellRing, Calendar, ExternalLink, Search } from "lucide-react";
import { format } from 'date-fns';

const jobNotifications = [
  {
    id: 1,
    title: "Junior Engineer (JE)",
    department: "Railway Recruitment Board (RRB)",
    postDate: "2024-07-20",
    startDate: "2024-08-01",
    endDate: "2024-08-30",
    tags: ["Railway", "Engineering", "Live"],
    url: "#"
  },
  {
    id: 2,
    title: "Probationary Officer (PO)",
    department: "State Bank of India (SBI)",
    postDate: "2024-07-18",
    startDate: "2024-07-25",
    endDate: "2024-08-20",
    tags: ["Bank", "PO", "Live"],
    url: "#"
  },
  {
    id: 3,
    title: "Technician Grade-I Signal",
    department: "Railway Recruitment Board (RRB)",
    postDate: "2024-07-15",
    startDate: "2024-07-20",
    endDate: "2024-08-15",
    tags: ["Railway", "Technical", "Live"],
     url: "#"
  },
   {
    id: 4,
    title: "Combined Graduate Level (CGL) Exam",
    department: "Staff Selection Commission (SSC)",
    postDate: "2024-07-22",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    tags: ["SSC", "Graduate", "Upcoming"],
     url: "#"
  },
  {
    id: 5,
    title: "Clerk",
    department: "Institute of Banking Personnel Selection (IBPS)",
    postDate: "2024-06-30",
    startDate: "2024-07-01",
    endDate: "2024-07-21",
    tags: ["Bank", "Clerk", "Expired"],
    url: "#"
  },
   {
    id: 6,
    title: "Assistant Loco Pilot (ALP)",
    department: "Railway Recruitment Board (RRB)",
    postDate: "2024-07-25",
    startDate: "2024-08-10",
    endDate: "2024-09-05",
    tags: ["Railway", "Technical", "Upcoming"],
    url: "#"
  }
];

const formatDate = (dateString: string) => format(new Date(dateString), "dd MMM, yyyy");

const getStatus = (startDate: string, endDate: string): "Live" | "Upcoming" | "Expired" => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Consider the end date inclusive

    if (now < start) return "Upcoming";
    if (now > end) return "Expired";
    return "Live";
};

export function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredNotifications = useMemo(() => {
    return jobNotifications
      .map(job => ({ ...job, status: getStatus(job.startDate, job.endDate) }))
      .filter(job => {
        const searchMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.department.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = typeFilter === "All" || job.tags.includes(typeFilter);
        const statusMatch = statusFilter === "All" || job.status === statusFilter;
        return searchMatch && typeMatch && statusMatch;
      });
  }, [searchTerm, typeFilter, statusFilter]);

  const getStatusColor = (status: "Live" | "Upcoming" | "Expired") => {
    switch (status) {
        case "Live": return "bg-red-500/80 text-white animate-pulse";
        case "Upcoming": return "bg-blue-500/80 text-white";
        case "Expired": return "bg-muted text-muted-foreground";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-3">
            <BellRing /> Job Notifications
          </h1>
          <p className="text-muted-foreground">
            Latest government job openings and updates.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for jobs..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Railway">Railway</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="SSC">SSC</SelectItem>
                </SelectContent>
              </Select>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredNotifications.length > 0 ? filteredNotifications.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.department}</CardDescription>
                    </div>
                     <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-wrap gap-2">
                        {job.tags.filter(t => t !== job.status).map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 bg-muted/50 p-4 rounded-b-lg">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><strong>Posted:</strong> {formatDate(job.postDate)}</div>
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><strong>Starts:</strong> {formatDate(job.startDate)}</div>
                        <div className="flex items-center gap-2 col-span-2 sm:col-span-1"><Calendar className="h-4 w-4" /><strong>Ends:</strong> {formatDate(job.endDate)}</div>
                    </div>
                    <Button asChild disabled={job.status !== "Live"}>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4"/>
                            Apply Now
                        </a>
                    </Button>
                </CardFooter>
            </Card>
          )) : (
            <div className="text-center py-16 text-muted-foreground">
                <p>No job notifications found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
