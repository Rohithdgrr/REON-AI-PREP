'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, FileQuestion, Lightbulb, Map, ArrowRight, Star, BarChart, BrainCircuit, Users, BookOpen, MessageCircle, Target, TestTube2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Badge } from './ui/badge';

const features = [
    {
        icon: BrainCircuit,
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
        icon: BarChart,
        title: "Performance Analytics",
        description: "Track your progress with detailed insights and identify areas for improvement."
    }
];

const howItWorks = [
    {
        step: 1,
        title: 'Sign Up & Personalize',
        description: 'Create your account and tell us your target exams and weak subjects.'
    },
    {
        step: 2,
        title: 'Follow Your AI Plan',
        description: 'Our AI generates a daily and weekly study plan just for you.'
    },
    {
        step: 3,
        title: 'Practice & Compete',
        description: 'Take mock tests, practice quizzes, and challenge peers on the leaderboard.'
    },
    {
        step: 4,
        title: 'Analyze & Improve',
        description: 'Use our Weakness Radar and detailed analytics to focus on what matters.'
    },
];

const dashboardFeatures = [
    {
        icon: Map,
        title: "Personalized Roadmap",
        description: "A dynamic, week-by-week study plan that adapts to your progress and focuses on your weak areas. Never wonder what to study next.",
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500"
    },
    {
        icon: BookOpen,
        title: "Prep Hub",
        description: "Your central library for all study materials, including video lectures, notes, PYQs, and cheatsheets, all organized by topic.",
        bgColor: "bg-green-500/10",
        iconColor: "text-green-500"
    },
    {
        icon: TestTube2,
        title: "AI Practice & Quizzes",
        description: "Generate unlimited topic-wise or mixed-subject quizzes. Practice what you've learned and get immediate feedback with detailed explanations.",
        bgColor: "bg-yellow-500/10",
        iconColor: "text-yellow-500"
    },
    {
        icon: Target,
        title: "Mock Test Arena",
        description: "Experience real exam pressure with full-length mock tests, complete with AI proctoring and in-depth performance analysis.",
        bgColor: "bg-red-500/10",
        iconColor: "text-red-500"
    },
    {
        icon: MessageCircle,
        title: "R-Chat",
        description: "Collaborate with fellow aspirants in study groups, get instant doubt clarification from LIBRA AI, and stay connected on your journey.",
        bgColor: "bg-purple-500/10",
        iconColor: "text-purple-500"
    },
    {
        icon: Lightbulb,
        title: "AI Suggestions",
        description: "Receive tailored advice and strategies from our AI based on your specific exam goals and performance data.",
        bgColor: "bg-indigo-500/10",
        iconColor: "text-indigo-500"
    }
];


const carouselSlides = [
    {
        id: 'slide-1',
        title: 'AI-Powered Study Planner',
        description: 'Stop wondering what to study next. Our AI analyzes your performance and creates an optimal, personalized study schedule to help you cover the syllabus efficiently and focus on your weak areas.',
        imageHint: 'planner schedule',
        imageId: 'suggestion-schedule'
    },
    {
        id: 'slide-2',
        title: 'Unlimited Practice Questions',
        description: 'Access a massive, ever-growing library of Previous Year Questions (PYQs), Multiple Choice Questions (MCQs), topic-wise notes, and full-length mock tests for both Railway and Bank exams.',
        imageHint: 'books library',
        imageId: 'suggestion-resources'
    },
    {
        id: 'slide-3',
        title: 'LIBRA: Your Personal AI Tutor',
        description: 'Stuck on a concept? Need a quick summary of a topic? Just ask LIBRA. Get instant, 24/7 doubt clarification, topic explanations, and even generate custom quizzes on the fly.',
        imageHint: 'robot assistant',
        imageId: 'job-ssc' 
    },
    {
        id: 'slide-4',
        title: 'Gamified Learning Experience',
        description: 'Turn your prep into a game! Earn XP, unlock badges, complete missions, and climb the live leaderboards. Compete with peers in your region and stay motivated every single day.',
        imageHint: 'trophy award',
        imageId: 'suggestion-goal'
    },
    {
        id: 'slide-5',
        title: 'In-Depth Performance Analytics',
        description: 'Go beyond just scores. Our "Weakness Radar" pinpoints your exact weak topics, while detailed post-test analysis shows your accuracy, time management, and rank improvement over time.',
        imageHint: 'analytics chart',
        imageId: 'job-bank'
    }
]

export function HomePage() {
  const heroBg = PlaceHolderImages.find((img) => img.id === 'hero-background');
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <Link href="#" className="flex items-center" prefetch={false}>
            <h1 className="text-xl font-bold font-headline">REON AI Prep</h1>
            </Link>
            <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/login" prefetch={false}>
                    Login
                </Link>
            </Button>
            <Button asChild>
                <Link href="/login" prefetch={false}>
                    Sign Up Free
                </Link>
            </Button>
            </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-20 md:pt-32 lg:pt-40 pb-12 md:pb-24 lg:pb-32 relative overflow-hidden">
            <div className="absolute inset-0">
            {heroBg && (
                <Image
                src={heroBg.imageUrl}
                alt={heroBg.description}
                data-ai-hint={heroBg.imageHint}
                fill
                className="object-cover"
                priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="container px-4 md:px-6 relative text-white">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="space-y-4 max-w-3xl">
                         <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline animate-fade-in-down">
                            Your Personal AI Coach for Competitive Exams
                        </h1>
                        <p className="mx-auto text-gray-200 md:text-xl animate-fade-in-up animation-delay-300">
                            REON AI provides personalized study plans, unlimited practice questions, and instant doubt-solving to help you crack Railway and Bank exams.
                        </p>
                    </div>
                    <div className="space-x-4 animate-fade-in-up animation-delay-600">
                        <Button size="lg" asChild className="transform transition-transform duration-300 hover:scale-105">
                            <Link href="/login" prefetch={false}>Start Your Free Prep <ArrowRight className="ml-2"/></Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Why Choose REON Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <Badge variant="outline">Why Choose REON</Badge>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">One Platform, All Your Prep Needs</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            REON AI combines cutting-edge artificial intelligence with proven exam strategies to give you an unparalleled advantage.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-4 lg:gap-12">
                    {features.map((feature, index) => (
                        <div key={feature.title} className="grid gap-2 text-center transform transition-transform duration-300 hover:-translate-y-2">
                            <div className="flex justify-center items-center mb-2">
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

        {/* How it works section */}
         <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <Badge variant="outline">How It Works</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Your Path to Success in 4 Simple Steps</h2>
                </div>
                <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                     <div className="absolute top-8 left-0 w-full h-0.5 bg-border hidden lg:block" />
                     {howItWorks.map((item, index) => (
                         <div key={item.step} className="relative flex flex-col items-center text-center p-4">
                              <div className="absolute top-1/2 -left-2 w-0.5 h-full bg-border -translate-y-1/2 hidden md:block lg:hidden" />
                             <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4 border-4 border-background z-10 transform transition-transform duration-300 hover:scale-110">{item.step}</div>
                             <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                             <p className="text-sm text-muted-foreground">{item.description}</p>
                         </div>
                     ))}
                </div>
            </div>
        </section>


        {/* Carousel Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <Badge variant="outline">Our Features</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent>
                        {carouselSlides.map((slide, index) => {
                            const image = PlaceHolderImages.find(img => img.id === slide.imageId);
                            return (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                                <div className="p-1">
                                    <Card className="overflow-hidden group h-full">
                                    <CardContent className="flex flex-col h-full items-center justify-center p-0">
                                        {image && (
                                             <div className="relative w-full aspect-video">
                                                <Image src={image.imageUrl} alt={image.description} data-ai-hint={slide.imageHint} fill className="object-cover transition-transform duration-500 group-hover:scale-105"/>
                                            </div>
                                        )}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
                                            <p className="text-muted-foreground text-sm">{slide.description}</p>
                                        </div>
                                    </CardContent>
                                    </Card>
                                </div>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>

        {/* Explore Dashboard Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <Badge variant="outline">A Powerful Toolkit</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Explore Your Dashboard</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {dashboardFeatures.map(feature => (
                        <Card key={feature.title} className="flex flex-col p-6 group hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Ready to Start Your Journey?</h2>
                    <p className="max-w-2xl">
                        Join thousands of aspirants who are preparing smarter with REON AI. Sign up for free and get your personalized study plan today.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="transform transition-transform duration-300 hover:scale-105">
                         <Link href="/login" prefetch={false}>Start For Free <ArrowRight className="ml-2"/></Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <footer className="bg-muted border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <h1 className="text-lg font-bold font-headline">REON AI Prep</h1>
                 <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} REON AI Prep. All rights reserved.
                </p>
            </div>
            <nav className="flex gap-4">
                <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                    Terms
                </Link>
                 <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                    Privacy
                </Link>
                 <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                    Contact
                </Link>
            </nav>
        </div>
      </footer>
    </div>
  );
}
