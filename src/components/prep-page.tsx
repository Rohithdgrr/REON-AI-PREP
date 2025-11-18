
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
import { Book, FileText, Film, Layers, ListChecks } from "lucide-react";
import { videoData } from "@/lib/video-data";
import { otherMaterialsData } from "@/lib/other-materials-data";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import Link from "next/link";

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

function VideoPlayer({ videoId, title, onClose }: { videoId: string, title: string, onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PrepMaterialCard = ({ material, onPlayVideo }: { material: any, onPlayVideo: (videoId: string, title: string) => void }) => (
  <Card className="flex flex-col">
    {material.category === 'Videos' && (
       <div className="aspect-video relative w-full overflow-hidden rounded-t-lg">
        <Image
            src={`https://img.youtube.com/vi/${material.videoId}/mqdefault.jpg`}
            alt={material.title}
            fill
            className="object-cover"
        />
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
    <CardFooter>
        {material.category === 'Videos' ? (
            <Button className="w-full" onClick={() => onPlayVideo(material.videoId, material.title)}>Watch Video</Button>
        ) : (
             <Link href={material.url} target="_blank" className="w-full">
                <Button className="w-full">Start Studying</Button>
             </Link>
        )}
    </CardFooter>
  </Card>
);

export function PrepPage() {
  const [playingVideo, setPlayingVideo] = useState<{ id: string, title: string } | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {playingVideo && (
        <VideoPlayer 
            videoId={playingVideo.id} 
            title={playingVideo.title} 
            onClose={() => setPlayingVideo(null)} 
        />
      )}
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Preparation Hub
        </h1>
        <p className="text-muted-foreground">
          Find all your study materials in one place.
        </p>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((cat) => (
            <TabsTrigger key={cat.name} value={cat.name}>
              <cat.icon className="mr-2 h-4 w-4" />
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="All" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prepMaterials.map((material) => (
              <PrepMaterialCard key={material.id} material={material} onPlayVideo={(id, title) => setPlayingVideo({id, title})} />
            ))}
          </div>
        </TabsContent>

        {categories.slice(1).map((cat) => (
          <TabsContent key={cat.name} value={cat.name} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {prepMaterials
                .filter((material) => material.category === cat.name)
                .map((material) => (
                  <PrepMaterialCard key={material.id} material={material} onPlayVideo={(id, title) => setPlayingVideo({id, title})} />
                ))}
            </div>
             {prepMaterials.filter(m => m.category === cat.name).length === 0 && (
                <Card className="col-span-full">
                    <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                        <cat.icon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No {cat.name} Available</h3>
                        <p className="text-muted-foreground mt-2">There are currently no materials in this category. Check back later!</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

    