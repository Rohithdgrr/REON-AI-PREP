
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Swords,
  Timer,
  Send,
  Upload,
  Search,
  FileQuestion,
  Bot,
  Loader2,
  Paperclip,
} from 'lucide-react';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import { Badge } from './ui/badge';
import { useToolsSidebar } from '@/hooks/use-tools-sidebar';
import { useUser, useFirebase } from '@/firebase';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-2');

const initialCommunityPosts = [
  {
    id: 1,
    user: 'RI-YYYY',
    avatar: userAvatar?.imageUrl,
    time: '5m ago',
    post: 'Just finished the Reasoning Puzzles course! The AI-generated tests are a game-changer. Anyone have tips for the advanced seating arrangements?',
  },
  {
    id: 2,
    user: 'RI-ZZZZ',
    avatar: userAvatar?.imageUrl,
    time: '1h ago',
    post: 'Uploaded my handwritten notes for the Quantitative Aptitude percentage chapter. Hope it helps someone! #Quant #Notes',
    hasAttachment: true,
    attachmentTitle: 'Quant-Percentages-Notes.pdf',
  },
];

const allFriends = [
  {
    id: 1,
    riId: 'RAX202514790',
    avatarUrl: userAvatar?.imageUrl,
  },
  {
    id: 2,
    riId: 'RAX202514791',
    avatarUrl: userAvatar?.imageUrl,
  },
  {
    id: 3,
    riId: 'RAX202514792',
    avatarUrl: userAvatar?.imageUrl,
  },
  {
    id: 4,
    riId: 'RAX202514793',
    avatarUrl: userAvatar?.imageUrl,
  },
];

const competitions = [
  {
    id: 1,
    title: 'The Data Sufficiency Dilemma',
    description:
      "A set of 5 tricky data sufficiency questions. Can you determine what's needed under pressure?",
    timeLimit: '10 Mins',
  },
  {
    id: 2,
    title: 'High-Level Puzzle Mania',
    description:
      'A single, complex multi-variable puzzle. Requires intense focus and logical deduction.',
    timeLimit: '15 Mins',
  },
  {
    id: 3,
    title: 'Quant Speed Challenge',
    description:
      '10 mixed quantitative aptitude questions. The goal is maximum accuracy in minimum time.',
    timeLimit: '8 Mins',
  },
];

export function KnowledgeHubPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { setActiveTool } = useToolsSidebar();
  const { user } = useUser();
  const { storage, firestore } = useFirebase();

  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePostSubmit = (postContent?: string, hasAttachment = false, attachmentTitle?: string) => {
    const content = postContent || newPost;
    if (content.trim() === '') return;
    const post = {
      id: Date.now(),
      user: 'RI-XXXX',
      avatar: userAvatar?.imageUrl || 'https://i.ibb.co/ckT3S1g/wolf-gears.png',
      time: 'Just now',
      post: content,
      hasAttachment,
      attachmentTitle,
    };
    setCommunityPosts([post, ...communityPosts]);
    if (!postContent) {
      setNewPost('');
    }
    toast({ title: 'Post shared successfully!' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Please select a file and ensure you are logged in.',
      });
      return;
    }

    setIsUploading(true);
    toast({ title: 'Uploading file...', description: 'Please wait a moment.' });

    try {
      // 1. Upload to Storage
      const storageRef = ref(
        storage,
        `users/${user.uid}/materials/${Date.now()}_${file.name}`
      );
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // 2. Create document in Firestore
      const materialsCollection = collection(
        firestore,
        `users/${user.uid}/materials`
      );
      await addDoc(materialsCollection, {
        userId: user.uid,
        title: file.name,
        url: downloadURL,
        type: file.type || 'unknown',
        createdAt: serverTimestamp(),
      });
      
      toast({ title: 'Success!', description: `${file.name} has been uploaded.` });
      handlePostSubmit(`Shared a new file: ${file.name}`, true, file.name);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  const handleStartChallenge = (title: string) => {
    toast({
      title: `Starting: ${title}`,
      description: 'Redirecting to the quiz arena...',
    });
    router.push('/dashboard/quiz');
  };

  const handleAskLibra = (prompt: string) => {
    setActiveTool({
      id: 'libra',
      payload: { initialPrompt: prompt },
    });
  };

  const filteredFriends = allFriends.filter((friend) =>
    friend.riId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Knowledge Hub
        </h1>
        <p className="text-muted-foreground">
          Connect, compete, and grow with the community.
        </p>
      </div>

      <Tabs defaultValue="community">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="community">
            <Users className="mr-2 h-4 w-4" />
            Community
          </TabsTrigger>
          <TabsTrigger value="competitions">
            <Swords className="mr-2 h-4 w-4" />
            Competitions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="m-0 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePostSubmit()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Paperclip className="h-4 w-4" />}
                      </Button>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {communityPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.time}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">{post.post}</p>
                    {post.hasAttachment && (
                      <Button variant="outline" className="mt-3 text-xs h-8">
                        <FileQuestion className="mr-2 h-4 w-4" /> View Notes
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-4 lg:sticky lg:top-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Find Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by RI ID"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={friend.avatarUrl} />
                            <AvatarFallback>
                              {friend.riId.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-sm">
                            {friend.riId}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot /> Ask LIBRA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Stuck on a problem or need a concept explained? Ask our AI
                    assistant.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleAskLibra(
                        'Explain the difference between Syllogism and Reverse Syllogism.'
                      )
                    }
                  >
                    Open LIBRA AI
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="competitions" className="m-0 pt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Put your skills to the test with these high-difficulty
              challenges. Solve them within the time limit to earn bonus XP and
              climb the leaderboard.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {competitions.map((comp) => (
                <Card key={comp.id}>
                  <CardHeader className="flex flex-col items-start gap-2">
                    <div>
                      <CardTitle className="text-base">{comp.title}</CardTitle>
                      <CardDescription>{comp.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <Badge variant="destructive" className="flex-shrink-0">
                      <Timer className="mr-1.5 h-4 w-4" />
                      {comp.timeLimit}
                    </Badge>
                    <Button onClick={() => handleStartChallenge(comp.title)}>
                      Start
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
