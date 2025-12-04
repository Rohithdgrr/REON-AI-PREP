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

function ResourceTable({ resources, isNestedTable = false }: { resources: any[], isNestedTable?: boolean }) {
    if (!resources) return <p className="text-muted-foreground">No resources found for this section.</p>;

    if (isNestedTable) {
        return (
             <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>RRB Region</TableHead>
                            <TableHead>States/UTs</TableHead>
                            <TableHead>Official Link</TableHead>
                            <TableHead>Metadata (2025 Updates)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resources.map((resource:any, index: number) => (
                             <TableRow key={index}>
                                <TableCell className="font-semibold">{resource.resource}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{resource.states}</TableCell>
                                <TableCell>
                                    <Button asChild variant="link" className="p-0 h-auto">
                                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm">
                                            {new URL(resource.link).hostname} <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </Button>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{resource.metadata}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }


    return (
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
                    {resources.map((resource:any) => {
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
                                {resource.secondaryLink && resource.secondaryLink !== 'regional redirect' && resource.secondaryLink !== 'RRB-specific' && (
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
    );
}

export function NotificationsPage() {

  const mainTabs = ["Bank", "Railway", "SSC", "UPSC", "GATE", "PSU"];

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

      <Tabs defaultValue="Bank" className="w-full">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 min-w-[600px]">
                {mainTabs.map((exam) => (
                    <TabsTrigger key={exam} value={exam}>{exam}</TabsTrigger>
                ))}
            </TabsList>
        </div>
        
        {Object.entries(officialSitesData).map(([exam, data]) => (
            <TabsContent key={exam} value={exam} className="mt-6">
                {data.nested ? (
                     <Tabs defaultValue={Object.keys(data.nested)[0]} className="w-full">
                        <div className="overflow-x-auto pb-2 -mx-4 px-4">
                            <TabsList className="grid w-full grid-cols-3 min-w-[500px]">
                            {Object.keys(data.nested).map(nestedTab => (
                                <TabsTrigger key={nestedTab} value={nestedTab}>{nestedTab}</TabsTrigger>
                            ))}
                            </TabsList>
                        </div>
                         {Object.entries(data.nested).map(([nestedTab, nestedData]: [string, any]) => (
                             <TabsContent key={nestedTab} value={nestedTab} className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{nestedData.title}</CardTitle>
                                        <CardDescription>{nestedData.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResourceTable 
                                            resources={nestedData.resources} 
                                            isNestedTable={nestedTab === "RRB Regions" || nestedTab === "RRC Regions"}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                         ))}
                     </Tabs>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>{(data as any).title}</CardTitle>
                            <CardDescription>{(data as any).description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResourceTable resources={(data as any).resources} />
                        </CardContent>
                    </Card>
                )}
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
