
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.591,35.021,48,29.932,48,24C48,22.659,47.862,21.35,47.611,20.083z"></path>
    </svg>
);

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  
  if (isUserLoading || user) {
     return (
        <div className="flex h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Welcome to REON AI</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to access your personalized exam prep dashboard.
            </p>
          </div>
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full text-lg h-12">
            <GoogleIcon /> Sign in with Google
          </Button>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="AI abstract art"
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
        )}
         <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
         <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/50 backdrop-blur-md rounded-lg">
             <h3 className="text-2xl font-bold text-white font-headline">Your Personal AI Exam Partner</h3>
             <p className="text-white/80 mt-2">Get AI-powered insights, personalized study plans, and mock tests to ace your competitive exams.</p>
         </div>
      </div>
    </div>
  )
}

    