

"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Mic,
  ListMusic,
  Download,
  Share2,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { generatePodcastFromText } from "@/ai/flows/generate-podcast-from-text";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const playlist = [
  {
    id: 1,
    title: "Daily Current Affairs Digest",
    duration: "12:30",
    category: "Current Affairs",
    source: "/audio/placeholder-1.mp3",
  },
  {
    id: 2,
    title: "RBI Monetary Policy Explained",
    duration: "08:15",
    category: "Banking",
    source: "/audio/placeholder-2.mp3",
  },
  {
    id: 3,
    title: "Railway NTPC Exam Strategy",
    duration: "15:45",
    category: "Strategy",
    source: "/audio/placeholder-3.mp3",
  },
  {
    id: 4,
    title: "Reasoning: Syllogism Tricks",
    duration: "10:00",
    category: "Reasoning",
    source: "/audio/placeholder-4.mp3",
  },
];


export function PodcastsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(playlist[0]);
  const [textToConvert, setTextToConvert] = useState("Enter your text here to generate a custom podcast...");
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);


  const handleGeneratePodcast = async () => {
    if (!textToConvert.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter some text to generate a podcast.'});
        return;
    }
    setIsLoading(true);
    setGeneratedAudio(null);
    try {
        const result = await generatePodcastFromText(textToConvert);
        setGeneratedAudio(result.media);
        toast({ title: 'Success', description: 'Your podcast has been generated.'});
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate podcast. Please try again.'});
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          AI-Generated Podcasts
        </h1>
        <p className="text-muted-foreground">
          Listen to study materials on the go. AI-powered audio for your prep.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Player */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{currentTrack.title}</CardTitle>
            <CardDescription>{currentTrack.category}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6">
            <div className="w-48 h-48 bg-primary/10 rounded-lg flex items-center justify-center">
              <Mic className="w-24 h-24 text-primary" />
            </div>
            <audio ref={audioRef} src={currentTrack.source} onEnded={() => setIsPlaying(false)} className="hidden" />
            <div className="w-full space-y-2">
              <Slider defaultValue={[33]} max={100} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>04:10</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Rewind />
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button variant="ghost" size="icon">
                <FastForward />
              </Button>
            </div>
             <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4"/> Download</Button>
                <Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4"/> Share</Button>
             </div>
          </CardContent>
        </Card>

        {/* Playlist */}
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ListMusic /> Playlist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {playlist.map((track) => (
                    <Button
                        key={track.id}
                        variant={currentTrack.id === track.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto py-3"
                        onClick={() => {
                            setCurrentTrack(track);
                            setIsPlaying(false);
                        }}
                    >
                        <div className="flex flex-col items-start text-left">
                            <span className="font-semibold">{track.title}</span>
                            <span className="text-xs text-muted-foreground">{track.duration}</span>
                        </div>
                    </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create Your Own Podcast</CardTitle>
          <CardDescription>Convert any text into a spoken-word audio file using AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            value={textToConvert}
            onChange={(e) => setTextToConvert(e.target.value)}
            rows={5}
            placeholder="Paste your notes, an article, or any text here..."
          />
          <Button onClick={handleGeneratePodcast} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Generating..." : "Generate Podcast"}
          </Button>
          {generatedAudio && (
            <div className="pt-4">
                <h4 className="font-semibold mb-2">Your Generated Audio:</h4>
                <audio controls src={generatedAudio} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
