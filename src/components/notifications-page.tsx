
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
import { BellRing, Calendar, ExternalLink, Search, Building, Train, Shield } from "lucide-react";
import { format } from 'date-fns';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const jobNotifications = [
  {
    id: 1,
    title: "Junior Engineer (JE)",
    department: "Railway Recruitment Board (RRB)",
    postDate: "2024-07-20",
    startDate: "2024-08-01",
    endDate: "2024-08-30",
    tags: ["Railway", "Engineering"],
    url: "https://www.rrbcdg.gov.in/",
    imageId: "job-railway",
    lastUpdated: "2024-07-25"
  },
  {
    id: 2,
    title: "Probationary Officer (PO)",
    department: "State Bank of India (SBI)",
    postDate: "2024-07-18",
    startDate: "2024-07-25",
    endDate: "2024-08-20",
    tags: ["Bank", "PO"],
    url: "https://sbi.co.in/web/careers",
    imageId: "job-bank",
    lastUpdated: "2024-07-25"
  },
  {
    id: 3,
    title: "Technician Grade-I Signal",
    department: "Railway Recruitment Board (RRB)",
    postDate: "2024-07-15",
    startDate: "2024-07-20",
    endDate: "2024-08-15",
    tags: ["Railway", "Technical"],
     url: "https://www.rrbcdg.gov.in/",
     imageId: "job-railway",
     lastUpdated: "2024-07-25"
  },
   {
    id: 4,
    title: "Combined Graduate Level (CGL) Exam",
    department: "Staff Selection Commission (SSC)",
    postDate: "2024-07-22",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    tags: ["SSC", "Graduate"],
     url: "https://ssc.gov.in/",
     imageId: "job-ssc",
     lastUpdated: "2024-07-25"
  },
  {
    id: 5,
    title: "Clerk (CRP CLERKS-XIV)",
    department: "Institute of Banking Personnel Selection (IBPS)",
    postDate: "2024-06-30",
    startDate: "2024-07-01",
    endDate: "2024-07-21",
    tags: ["Bank", "Clerk"],
    url: "https://www.ibps.in/",
    imageId: "job-bank",
    lastUpdated: "2024-07-25"
  },
   {
    id: 6,
    title: "Assistant Loco Pilot (ALP)",
    department: "Railway Recruitment Board (RRB)",
    postDate: "2024-07-25",
    startDate: "2024-08-10",
    endDate: "2024-09-05",
    tags: ["Railway", "Technical"],
    url: "https://www.rrbcdg.gov.in/",
    imageId: "job-railway",
    lastUpdated: "2024-07-25"
  }
];

const officialSources = {
  railway: [
    { name: "Centralized RRB Portal", url: "https://www.rrbapply.gov.in/" },
    { name: "Indian Railways Main Site", url: "https://indianrailways.gov.in/" },
    { name: "RRB Chennai (Southern)", url: "https://www.rrbchennai.gov.in/" },
    { name: "RRB Secunderabad (South Central)", url: "https://rrbsecunderabad.gov.in/" },
    { name: "RRB Bangalore (South Western)", url: "https://www.rrbbnc.gov.in/" },
    { name: "RRB Thiruvananthapuram (Southern)", url: "https://www.rrbthiruvananthapuram.gov.in/" },
    { name: "RRB Mumbai (Western)", url: "https://rrbmumbai.gov.in/" },
    { name: "RRB Kolkata (Eastern)", url: "https://www.rrbkolkata.gov.in/" },
    { name: "RRB Chandigarh", url: "https://rrbcdg.gov.in/" },
    { name: "RRB Allahabad", url: "https://www.rrbald.gov.in/" },
  ],
  banking: [
    { name: "IBPS", url: "https://www.ibps.in/" },
    { name: "SBI Careers", url: "https://sbi.co.in/careers" },
    { name: "RBI Opportunities", url: "https://opportunities.rbi.org.in/" },
    { name: "NABARD", url: "https://www.nabard.org/careers-notices.aspx" },
    { name: "National Career Service", url: "https://www.ncs.gov.in/" },
  ],
  ssc: [
      { name: "SSC Main Site", url: "https://ssc.gov.in/" },
      { name: "SSC Online Application", url: "https://ssc.nic.in/" },
  ]
}

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
    <div className="flex flex-col gap-8">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Railway">Railway</SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                      <SelectItem value="SSC">SSC</SelectItem>
                      <SelectItem value="GATE">GATE</SelectItem>
                      <SelectItem value="PSU">PSU</SelectItem>
                      <SelectItem value="UPSC">UPSC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
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
              {filteredNotifications.length > 0 ? filteredNotifications.map((job) => {
                let image = PlaceHolderImages.find(img => img.id === job.imageId);
                if (!image) {
                    image = PlaceHolderImages.find(img => img.id === 'job-graduate');
                }
                return (
                <Card key={job.id} className="hover:shadow-md transition-shadow flex flex-col md:flex-row overflow-hidden">
                    {image && (
                        <div className="md:w-1/3 relative min-h-[200px] md:min-h-full">
                            <Image 
                                src={image.imageUrl} 
                                alt={image.description} 
                                data-ai-hint={image.imageHint}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex flex-col flex-1">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription>{job.department}</CardDescription>
                                <CardDescription className="text-xs mt-1">Last Updated: {formatDate(job.lastUpdated)}</CardDescription>
                            </div>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex flex-wrap gap-2">
                                {job.tags.filter(t => t !== job.status).map(tag => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4 bg-muted/50 p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 text-sm w-full">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-muted-foreground text-xs font-semibold">Posted:</span>
                                    <strong>{formatDate(job.postDate)}</strong>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-muted-foreground text-xs font-semibold">Starts:</span>
                                    <strong>{formatDate(job.startDate)}</strong>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-muted-foreground text-xs font-semibold">Ends:</span>
                                    <strong>{formatDate(job.endDate)}</strong>
                                </div>
                            </div>
                             <Button asChild disabled={job.status !== "Live"} className="w-full sm:w-auto self-end">
                                <a href={job.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4"/>
                                    Apply Now
                                </a>
                            </Button>
                        </CardFooter>
                    </div>
                </Card>
              )}) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No job notifications found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Train /> Railway Recruitment</CardTitle>
              <CardDescription>Direct links to official RRB portals.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {officialSources.railway.map(source => (
                <Button key={source.name} asChild variant="outline" className="justify-start">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> {source.name}
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building /> Banking Sector</CardTitle>
              <CardDescription>Direct links to official Bank recruitment portals.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {officialSources.banking.map(source => (
                <Button key={source.name} asChild variant="outline" className="justify-start">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> {source.name}
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield /> SSC</CardTitle>
              <CardDescription>Direct links to official SSC portals.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {officialSources.ssc.map(source => (
                <Button key={source.name} asChild variant="outline" className="justify-start">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> {source.name}
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    