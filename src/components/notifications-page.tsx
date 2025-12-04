
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, ShieldAlert, FileText, SquarePen, Ticket, BadgeCheck, School } from "lucide-react";
import { officialSitesData } from "@/lib/official-sites-data";
import { Button } from "./ui/button";

const icons: { [key: string]: React.ElementType } = {
  Notifications: FileText,
  Application: SquarePen,
  "Admit Cards": Ticket,
  Results: BadgeCheck,
  "Main Portal": School,
};

export function NotificationsPage() {

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Official Exam Resources
        </h1>
        <p className="text-muted-foreground mt-2">
          Verified links for notifications, applications, admit cards, and results for major government exams.
        </p>
      </div>

      <Tabs defaultValue="SSC" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {Object.keys(officialSitesData).map((exam) => (
                <TabsTrigger key={exam} value={exam}>{exam}</TabsTrigger>
            ))}
        </TabsList>
        
        {Object.entries(officialSitesData).map(([exam, data]) => (
            <TabsContent key={exam} value={exam} className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>{data.title}</CardTitle>
                        <CardDescription>{data.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[150px]">Resource</TableHead>
                                        <TableHead>Official Link</TableHead>
                                        <TableHead>Metadata & Key Information</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.resources.map((resource) => {
                                        const Icon = icons[resource.resource] || FileText;
                                        return (
                                        <TableRow key={resource.resource}>
                                            <TableCell className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4 text-primary" />
                                                    {resource.resource}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button asChild variant="link" className="p-0 h-auto">
                                                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm">
                                                        {new URL(resource.link).hostname} <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                                {resource.secondaryLink && (
                                                    <Button asChild variant="link" className="p-0 h-auto">
                                                        <a href={resource.secondaryLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            or {new URL(resource.secondaryLink).hostname} <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{resource.metadata}</TableCell>
                                        </TableRow>
                                    )})}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                 </Card>
            </TabsContent>
        ))}
      </Tabs>
      
       <Card className="mt-4 bg-muted/50">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-amber-600"/> General Tips & Disclaimers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• All links are verified as official portals, but always double-check the URL before entering sensitive information.</p>
            <p>• Deadlines are strict. Monitor the "What's New" sections on the official portals regularly.</p>
            <p>• Use incognito mode for downloads or form submissions to prevent caching issues.</p>
            <p>• For general alerts across all government jobs, you can also refer to the official [Employment News](https://employmentnews.gov.in) portal.</p>
        </CardContent>
      </Card>

    </div>
  );
}
