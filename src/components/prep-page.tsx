

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, FileText, Film, Layers, ListChecks, Expand, X, Bot } from "lucide-react";
import { videoData } from "@/lib/video-data";
import { otherMaterialsData } from "@/lib/other-materials-data";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { InAppBrowser } from "./in-app-browser";
import { useToolsSidebar } from "@/hooks/use-tools-sidebar";

const prepMaterials = [
    ...otherMaterialsData.map(d => ({...d, icon: d.category === 'Notes' ? FileText : d.category === 'PYQs & MCQs' ? ListChecks : Layers})), 
    ...videoData.map(v => ({
    ...v,
    id: `video-${v.id}`,
    url: `https://www.youtube.com/watch?v=${v.videoId}`,
    type: 'Video',
    category: 'Videos',
    icon: Film,
}))];

const categories = [
  { name: "All", icon: Book },
  { name: "Notes", icon: FileText },
  { name: "PYQs & MCQs", icon: ListChecks },
  { name: "Cheatsheets", icon: Layers },
  { name: "Videos", icon: Film },
];

function VideoPlayer({ videoId, title }: { videoId: string, title: string }) {
  return (
    <div className="aspect-video w-full h-full relative">
        <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full absolute top-0 left-0"
        ></iframe>
    </div>
  );
}

const PrepMaterialCard = ({ material, onOpenUrl, onAskLibra }: { material: any, onOpenUrl: (url: string, title: string) => void, onAskLibra: (materialTitle: string) => void }) => (
  <Card className="flex flex-col">
    {material.category === 'Videos' && (
       <div className="aspect-video relative w-full overflow-hidden rounded-t-lg bg-black">
        <VideoPlayer videoId={material.videoId} title={material.title} />
       </div>
    )}
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {material.category !== 'Videos' && <material.icon className="h-6 w-6 text-primary" />}
          <CardTitle className="text-lg">{material.title}</CardTitle>
        </div>
        <Badge variant="secondary">{material.type}</Badge>
      </div>
      <CardDescription className="pt-2">{material.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="flex flex-wrap gap-2">
        {material.tags.map((tag: string) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </CardContent>
    <CardFooter className="grid grid-flow-col auto-cols-fr gap-2">
        {material.category !== 'Videos' && (
            <Button className="w-full" onClick={() => onOpenUrl(material.url, material.title)}>Start Studying</Button>
        )}
        <Button variant="outline" className="w-full" onClick={() => onAskLibra(material.title)}>
            <Bot className="mr-2 h-4 w-4" /> Ask LIBRA
        </Button>
    </CardFooter>
  </Card>
);

export function PrepPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({ All: 'All' });
  const [browserState, setBrowserState] = useState<{open: boolean, url: string, title: string}>({open: false, url: '', title: ''});
  const { setActiveTool } = useToolsSidebar();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    prepMaterials.forEach(m => m.tags.forEach(t => tags.add(t)));
    return ["All", ...Array.from(tags)];
  }, []);

  const handleOpenUrl = (url: string, title: string) => {
    setBrowserState({ open: true, url, title });
  };

  const handleAskLibra = (materialTitle: string) => {
    setActiveTool({ id: 'libra', payload: { prompt: `Explain the key concepts from "${materialTitle}" and create a 3-question mini-quiz based on it.` }});
  };

  const handleCloseBrowser = () => {
    setBrowserState({ open: false, url: '', title: '' });
  };

  const renderMaterials = (category: string) => {
    const currentFilter = activeFilters[category] || 'All';
    const filteredMaterials = prepMaterials.filter(material => {
      const categoryMatch = category === 'All' || material.category === category;
      const filterMatch = currentFilter === 'All' || material.tags.includes(currentFilter);
      return categoryMatch && filterMatch;
    });

    if (filteredMaterials.length === 0) {
      const categoryIcon = categories.find(c => c.name === category)?.icon || Book;
      return (
          <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                  <categoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">No Materials Found</h3>
                  <p className="text-muted-foreground mt-2">There are currently no materials matching your filter in this category.</p>
              </CardContent>
          </Card>
      );
    }

    return filteredMaterials.map(material => (
      <PrepMaterialCard key={material.id} material={material} onOpenUrl={handleOpenUrl} onAskLibra={handleAskLibra} />
    ));
  };
  
  const handleFilterChange = (category: string, filter: string) => {
    setActiveFilters(prev => ({ ...prev, [category]: filter }));
  };

  const currentCategoryTags = useMemo(() => {
    const tags = new Set<string>();
    prepMaterials.filter(m => activeTab === 'All' || m.category === activeTab).forEach(m => m.tags.forEach(t => tags.add(t)));
    return ['All', ...Array.from(tags)];
  }, [activeTab]);


  return (
    <div className="flex flex-col gap-6">
       <Dialog open={browserState.open} onOpenChange={(isOpen) => !isOpen && handleCloseBrowser()}>
        <DialogContent className="w-full h-full max-w-none max-h-none flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between">
            <DialogTitle>{browserState.title}</DialogTitle>
            <DialogClose asChild>
                <Button variant="ghost" size="icon"><X /></Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe src={browserState.url} className="w-full h-full border-0" title={browserState.title} />
          </div>
        </DialogContent>
      </Dialog>
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Preparation Hub
        </h1>
        <p className="text-muted-foreground">
          Find all your study materials in one place.
        </p>
      </div>

      <Tabs defaultValue="All" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((cat) => (
            <TabsTrigger key={cat.name} value={cat.name}>
              <cat.icon className="mr-2 h-4 w-4" />
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((cat) => (
          <TabsContent key={cat.name} value={cat.name} className="mt-6">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {currentCategoryTags.map(tag => (
                   <Button 
                    key={tag} 
                    variant={activeFilters[cat.name] === tag || (!activeFilters[cat.name] && tag === 'All') ? "default" : "outline"}
                    onClick={() => handleFilterChange(cat.name, tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {renderMaterials(cat.name)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
