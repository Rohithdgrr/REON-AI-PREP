
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
  Search,
  FileQuestion,
  Bot,
  Loader2,
  Paperclip,
  X,
  File as FileIcon,
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
import { getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from './ui/progress';

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

type UploadStatus = {
  file: File | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
};

export function KnowledgeHubPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { setActiveTool } = useToolsSidebar();
  const { user } = useUser();
  const { storage, firestore } = useFirebase();

  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ file: null, status: 'idle', progress: 0 });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePostSubmit = (
    postContent?: string,
    hasAttachment = false,
    attachmentTitle?: string
  ) => {
    const content = postContent || newPost;
    if (content.trim() === '' && !hasAttachment) return;
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
    setNewPost('');
    setUploadStatus({ file: null, status: 'idle', progress: 0 });
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    toast({ title: 'Post shared successfully!' });
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 15 * 1024 * 1024) { // 15MB limit
            setUploadStatus({ file, status: 'error', progress: 0, error: 'File size cannot exceed 15MB.' });
        } else {
            setUploadStatus({ file, status: 'idle', progress: 0 });
        }
    }
  };


  const handleFileUpload = async () => {
    if (!uploadStatus.file || !user || !storage || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Please select a file and ensure you are logged in.',
      });
      return;
    }
    const file = uploadStatus.file;

    setUploadStatus(prev => ({ ...prev, status: 'uploading', error: undefined }));

    const storageRef = ref(
      storage,
      `users/${user.uid}/materials/${Date.now()}_${file.name}`
    );
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadStatus(prev => ({ ...prev, progress: progress }));
        },
        (error: any) => {
            console.error('Upload error:', error);
            setUploadStatus(prev => ({ ...prev, status: 'error', error: 'Upload failed. Please try again.' }));
        },
        async () => {
            // Upload completed successfully, now get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Create document in Firestore
            const materialsCollection = collection(firestore, `users/${user.uid}/materials`);
            await addDoc(materialsCollection, {
                userId: user.uid,
                title: file.name,
                url: downloadURL,
                type: file.type || 'unknown',
                createdAt: serverTimestamp(),
            });

            setUploadStatus(prev => ({ ...prev, status: 'success' }));
            handlePostSubmit(newPost || `Shared a new file: ${file.name}`, true, file.name);
        }
    );
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
  
  const handleCancelUpload = () => {
    setUploadStatus({ file: null, status: 'idle', progress: 0 });
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

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
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-base">Share your thoughts</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative">
                    <Textarea
                      placeholder="What's on your mind? Share an update or ask a question..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                    />
                  </div>
                  {uploadStatus.file && (
                     <div className="mt-3 p-2 border rounded-md flex items-center gap-3 bg-muted/50">
                        <FileIcon className="h-5 w-5 text-muted-foreground"/>
                        <div className="flex-1">
                            <p className="text-sm font-medium truncate">{uploadStatus.file.name}</p>
                             {uploadStatus.status === 'uploading' && (
                                <div className="flex items-center gap-2">
                                  <Progress value={uploadStatus.progress} className="w-24 h-1"/>
                                  <p className="text-xs text-blue-500">{Math.round(uploadStatus.progress)}%</p>
                                </div>
                             )}
                             {uploadStatus.status === 'error' && <p className="text-xs text-destructive">{uploadStatus.error}</p>}
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelUpload}>
                            <X className="h-4 w-4" />
                        </Button>
                     </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                     <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="mr-2 h-4 w-4" /> Attach File
                      </Button>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    <Button
                        size="sm"
                        onClick={uploadStatus.file ? handleFileUpload : () => handlePostSubmit()}
                        disabled={uploadStatus.status === 'uploading' || (uploadStatus.status === 'error' && !newPost.trim())}
                      >
                         {uploadStatus.status === 'uploading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                        {uploadStatus.status === 'uploading' ? 'Posting...' : 'Post'}
                      </Button>
                </CardFooter>
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
