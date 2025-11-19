
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, FileQuestion, Lightbulb, Map } from 'lucide-react';

const features = [
    {
        icon: Map,
        title: "AI Personalised Plans",
        description: "Get a study roadmap tailored to your weak subjects and available time."
    },
    {
        icon: FileQuestion,
        title: "PYQs, MCQs & Notes",
        description: "Access a vast library of previous year questions, notes, and practice quizzes."
    },
    {
        icon: Bot,
        title: "LIBRA AI Assistance",
        description: "Your personal AI tutor for instant doubt clarification and topic summaries."
    },
    {
        icon: Lightbulb,
        title: "Multi-language Support",
        description: "Learn in your preferred language: English, Telugu, Hindi, and more."
    }
];

export function HomePage() {
  const heroBg = PlaceHolderImages.find((img) => img.id === 'hero-background');
  
  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <h1 className="text-xl font-bold font-headline">REON AI Prep</h1>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Link href="/login" prefetch={false}>
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
            <div className="absolute inset-0">
            {heroBg && (
                <Image
                src={heroBg.imageUrl}
                alt={heroBg.description}
                data-ai-hint={heroBg.imageHint}
                fill
                className="object-cover"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="container px-4 md:px-6 relative text-white">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                            Your Personal AI Coach for Competitive Exams
                        </h1>
                        <p className="mx-auto text-gray-200 md:text-xl">
                            REON AI provides personalized study plans, unlimited practice questions, and instant doubt-solving to help you crack Railway and Bank exams.
                        </p>
                    </div>
                    <div className="space-x-4">
                        <Link href="/login" prefetch={false}>
                            <Button size="lg">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">One Platform, All Your Prep Needs</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    REON AI combines cutting-edge artificial intelligence with proven exam strategies to give you an unparalleled advantage.
                </p>
                </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-4 lg:gap-12">
                {features.map((feature) => (
                    <div key={feature.title} className="grid gap-1 text-center">
                        <div className="flex justify-center items-center mb-4">
                            <div className="bg-primary/10 p-4 rounded-full">
                                <feature.icon className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
            </div>
        </section>
      </main>
    </div>
  );
}
