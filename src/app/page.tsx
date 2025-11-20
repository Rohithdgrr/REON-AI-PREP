
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';


export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

   const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  if (isUserLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
        <header className="p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b">
            <Link href="/" className="font-bold text-xl font-headline">REON AI</Link>
            <div>
                {user ? (
                    <Button asChild>
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                ) : (
                    <Button asChild>
                        <Link href="/login">Login / Register</Link>
                    </Button>
                )}
            </div>
        </header>

        <main className="flex-1">
             <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
                {heroImage && (
                    <Image
                    src={heroImage.imageUrl}
                    alt="AI abstract art"
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    />
                )}
                 <div className="absolute inset-0 bg-black/60" />
                 <div className="relative z-10 p-4">
                     <h1 className="text-4xl md:text-6xl font-bold font-headline">Your Personal AI Exam Partner</h1>
                     <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Get AI-powered insights, personalized study plans, and mock tests to ace your competitive exams.</p>
                     <Button size="lg" className="mt-8" asChild>
                        <Link href={user ? "/dashboard" : "/login"}>Get Started</Link>
                     </Button>
                 </div>
            </section>
            
             <section className="py-16 bg-background">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold font-headline mb-8">Features</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Personalized Roadmap</h3>
                            <p className="text-muted-foreground">AI-generated study plans based on your weak spots and available time.</p>
                        </div>
                         <div className="p-6 border rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">AI-Powered Quizzes</h3>
                            <p className="text-muted-foreground">Generate unlimited quizzes on any topic, at any difficulty level.</p>
                        </div>
                         <div className="p-6 border rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Community & Collaboration</h3>
                            <p className="text-muted-foreground">Connect with fellow aspirants, share notes, and compete in challenges.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <footer className="p-4 border-t text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} REON AI. All rights reserved.
        </footer>
    </div>
  );
}
