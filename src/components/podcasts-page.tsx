
"use client";

import { useState } from "react";
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
  Users,
  Swords,
  Timer,
  Send,
  Upload,
  Search,
  FileQuestion,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { generatePodcastFromText } from "@/ai/flows/generate-podcast-from-text";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

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

const initialCommunityPosts = [
    {
        id: 1,
        user: "Neha Sharma",
        avatar: "/avatars/01.png",
        time: "5m ago",
        post: "Just finished the Reasoning Puzzles course! The AI-generated tests are a game-changer. Anyone have tips for the advanced seating arrangements?",
    },
    {
        id: 2,
        user: "Ravi Kumar",
        avatar: "/avatars/02.png",
        time: "1h ago",
        post: "Uploaded my handwritten notes for the Quantitative Aptitude percentage chapter. Hope it helps someone! #Quant #Notes",
        hasAttachment: true,
    }
];

const allFriends = [
    { id: 1, name: 'Anil Kumar', riId: 'RAX202514790' },
    { id: 2, name: 'Priya Sharma', riId: 'RAX202514791' },
    { id: 3, name: 'Ravi Teja', riId: 'RAX202514792' },
    { id: 4, name: 'Sunita Devi', riId: 'RAX202514793' },
];

const competitions = [
    {
        id: 1,
        title: "The Data Sufficiency Dilemma",
        description: "A set of 5 tricky data sufficiency questions. Can you determine what's needed under pressure?",
        timeLimit: "10 Mins",
    },
    {
        id: 2,
        title: "High-Level Puzzle Mania",
        description: "A single, complex multi-variable puzzle. Requires intense focus and logical deduction.",
        timeLimit: "15 Mins",
    },
     {
        id: 3,
        title: "Quant Speed Challenge",
        description: "10 mixed quantitative aptitude questions. The goal is maximum accuracy in minimum time.",
        timeLimit: "8 Mins",
    }
]

export function PodcastsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(playlist[0]);
  const [textToConvert, setTextToConvert] = useState("Enter your text here to generate a custom podcast...");
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts);
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim() === "") return;
    const post = {
      id: Date.now(),
      user: "Srinivas Reddy",
      avatar: "/avatars/03.png", // Assuming current user avatar
      time: "Just now",
      post: newPost,
    };
    setCommunityPosts([post, ...communityPosts]);
    setNewPost("");
    toast({ title: "Post shared successfully!" });
  };

  const handleUploadClick = () => {
    toast({ title: "Upload Notes", description: "This feature is coming soon!"});
  };

  const handleStartChallenge = (title: string) => {
    toast({ title: `Starting: ${title}`, description: "Redirecting to the quiz arena..."});
    router.push('/dashboard/quiz');
  };

  const filteredFriends = allFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.riId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onClick={() => setIsPlaying(!isPlaying)}
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
                        onClick={() => setCurrentTrack(track)}
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
      
      {/* Knowledge Hub Section */}
      <div className="mt-8">
         <h1 className="text-3xl font-bold font-headline tracking-tight">
          Knowledge Hub
        </h1>
        <p className="text-muted-foreground mb-4">
          Connect, compete, and grow with the community.
        </p>
        <Card>
            <Tabs defaultValue="community">
                <CardHeader>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="community"><Users className="mr-2 h-4 w-4" />Community</TabsTrigger>
                        <TabsTrigger value="competitions"><Swords className="mr-2 h-4 w-4" />Competitions</TabsTrigger>
                    </TabsList>
                </CardHeader>

                <TabsContent value="community" className="m-0">
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Discussion Feed */}
                            <div className="lg:col-span-2 space-y-4">
                               <Card>
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base">Share your thoughts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="relative">
                                            <Textarea 
                                                placeholder="What's on your mind? Share an update or ask a question..." 
                                                className="pr-20"
                                                value={newPost}
                                                onChange={(e) => setNewPost(e.target.value)}
                                            />
                                            <div className="absolute right-2 top-2 flex flex-col gap-2">
                                                <Button size="icon" className="h-8 w-8" onClick={handlePostSubmit}><Send className="h-4 w-4" /></Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleUploadClick}><Upload className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                {communityPosts.map(post => (
                                    <Card key={post.id}>
                                        <CardHeader className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={post.avatar} />
                                                    <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{post.user}</p>
                                                    <p className="text-xs text-muted-foreground">{post.time}</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <p className="text-sm">{post.post}</p>
                                            {post.hasAttachment && (
                                                <Button variant="outline" className="mt-3 text-xs h-8"><FileQuestion className="mr-2 h-4 w-4" /> View Notes</Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {/* Search Friends */}
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Find Friends</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                placeholder="Search by name or RI ID" 
                                                className="pl-8"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {filteredFriends.map(friend => (
                                                <div key={friend.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                                    <div>
                                                        <p className="font-semibold text-sm">{friend.name}</p>
                                                        <p className="text-xs text-muted-foreground">{friend.riId}</p>
                                                    </div>
                                                    <Button size="sm" variant="outline">Connect</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </TabsContent>

                <TabsContent value="competitions" className="m-0">
                     <CardContent className="space-y-4">
                         <p className="text-sm text-muted-foreground">Put your skills to the test with these high-difficulty challenges. Solve them within the time limit to earn bonus XP and climb the leaderboard.</p>
                         {competitions.map(comp => (
                             <Card key={comp.id}>
                                 <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">{comp.title}</CardTitle>
                                        <CardDescription>{comp.description}</CardDescription>
                                    </div>
                                    <Badge variant="destructive" className="flex-shrink-0"><Timer className="mr-1.5 h-4 w-4" />{comp.timeLimit}</Badge>
                                 </CardHeader>
                                 <CardFooter>
                                     <Button onClick={() => handleStartChallenge(comp.title)}>Start Challenge</Button>
                                 </CardFooter>
                             </Card>
                         ))}
                     </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
      </div>
    </div>
  );
}
