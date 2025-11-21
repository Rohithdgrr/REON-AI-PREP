
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, ChevronRight, FileQuestion, Github, Linkedin, Map, MessageCircle, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: "Personalized Roadmap",
    description: "AI-generated study plans based on your weak spots and available time.",
    link: "/dashboard/roadmap",
    imageId: "homepage-feature-roadmap",
    icon: Map,
  },
  {
    title: "AI-Powered Quizzes",
    description: "Generate unlimited quizzes on any topic, at any difficulty level.",
    link: "/dashboard/quiz",
    imageId: "homepage-feature-quiz",
    icon: FileQuestion,
  },
  {
    title: "Community & Collaboration",
    description: "Connect with fellow aspirants, share notes, and compete in challenges.",
    link: "/dashboard/r-chat",
    imageId: "homepage-feature-chat",
    icon: MessageCircle,
  },
];

export default function HomePage() {
   const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
        <header className="p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
              <Bot className="h-7 w-7 text-primary" />
              <span>REON AI</span>
            </Link>
            <nav className='hidden md:flex gap-6 items-center'>
              <Link href="#features" className='text-sm font-medium text-muted-foreground hover:text-primary'>Features</Link>
              <Link href="#how-it-works" className='text-sm font-medium text-muted-foreground hover:text-primary'>How It Works</Link>
              <Link href="#tools" className='text-sm font-medium text-muted-foreground hover:text-primary'>Tools</Link>
            </nav>
            <div>
                <Button asChild>
                    <Link href="/login">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        </header>

        <main className="flex-1">
             <section className="relative h-[70vh] flex items-center justify-center text-center text-white">
                {heroImage && (
                    <Image
                    src={heroImage.imageUrl}
                    alt="AI abstract art"
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                    />
                )}
                 <div className="absolute inset-0 bg-black/60" />
                 <div className="relative z-10 p-4 max-w-4xl mx-auto">
                     <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">Your Personal AI Exam Partner</h1>
                     <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/80">Stop guessing, start preparing. REON AI provides AI-powered insights, personalized study plans, and adaptive mock tests to help you conquer competitive exams in India.</p>
                     <Button size="lg" className="mt-8 text-base" asChild>
                        <Link href="/login">Start Your Free Trial</Link>
                     </Button>
                 </div>
            </section>
            
             <section id="features" className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl lg:text-4xl font-bold font-headline">Everything You Need to Succeed</h2>
                      <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">From AI-driven plans to collaborative tools, we've got you covered.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature) => {
                          const featureImage = PlaceHolderImages.find((img) => img.id === feature.imageId);
                          return (
                            <Card key={feature.title} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                                {featureImage && (
                                  <div className="aspect-video overflow-hidden">
                                      <Image
                                        src={featureImage.imageUrl}
                                        alt={feature.title}
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        data-ai-hint={featureImage.imageHint}
                                      />
                                  </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><feature.icon className="h-6 w-6 text-primary" /> {feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                </div>
            </section>
            
             <section id="how-it-works" className="py-16 lg:py-24 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl lg:text-4xl font-bold font-headline">How It Works</h2>
                      <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">A simple, effective path to exam readiness.</p>
                    </div>
                    <div className="relative grid md:grid-cols-3 gap-8">
                       <div className="absolute left-1/3 top-1/2 h-0.5 w-1/3 bg-border -translate-y-1/2 hidden md:block"></div>
                       <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">1</div>
                          <h3 className="text-xl font-semibold mb-2">Set Your Goal</h3>
                          <p className="text-muted-foreground">Tell us your target exam (Railway, Bank, etc.) and your weak subjects.</p>
                       </div>
                       <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">2</div>
                          <h3 className="text-xl font-semibold mb-2">Follow Your AI Plan</h3>
                          <p className="text-muted-foreground">Our AI generates a daily and weekly study roadmap tailored to you.</p>
                       </div>
                       <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">3</div>
                          <h3 className="text-xl font-semibold mb-2">Practice & Analyze</h3>
                          <p className="text-muted-foreground">Take mock tests, practice with AI quizzes, and track your progress with our analytics.</p>
                       </div>
                    </div>
                </div>
            </section>

             <section id="tools" className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold font-headline">More Than Just a Study App</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto mb-12">REON AI comes packed with tools to keep you focused and productive.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div className="flex flex-col items-center gap-2"><Map className="h-8 w-8 text-primary"/><span>Roadmap</span></div>
                      <div className="flex flex-col items-center gap-2"><FileQuestion className="h-8 w-8 text-primary"/><span>AI Quiz</span></div>
                      <div className="flex flex-col items-center gap-2"><MessageCircle className="h-8 w-8 text-primary"/><span>R-Chat</span></div>
                      <div className="flex flex-col items-center gap-2"><Bot className="h-8 w-8 text-primary"/><span>LIBRA AI</span></div>
                  </div>
                </div>
            </section>
        </main>
        
        <footer className="bg-muted/30 border-t">
          <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
              <div className="col-span-4 md:col-span-1">
                 <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
                    <Bot className="h-7 w-7 text-primary" />
                    <span>REON AI</span>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">Your personal AI partner for acing competitive exams.</p>
                  <div className="flex gap-4 mt-4">
                      <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary"><Github /></Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin /></Link>
                  </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                  <h4 className="font-semibold mb-3">Product</h4>
                  <ul className="space-y-2 text-sm">
                      <li><Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link></li>
                      <li><Link href="/login" className="text-muted-foreground hover:text-primary">Get Started</Link></li>
                      <li><Link href="/dashboard/help" className="text-muted-foreground hover:text-primary">Support</Link></li>
                  </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                  <h4 className="font-semibold mb-3">Legal</h4>
                  <ul className="space-y-2 text-sm">
                      <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                      <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                  </ul>
              </div>
               <div className="col-span-4 md:col-span-1">
                  <h4 className="font-semibold mb-3">Stay Updated</h4>
                  <p className="text-sm text-muted-foreground mb-3">Subscribe to our newsletter for the latest updates and tips.</p>
                  <div className="flex gap-2">
                      <input type="email" placeholder="Enter your email" className="w-full text-sm p-2 border rounded-md bg-background"/>
                      <Button size="sm">Subscribe</Button>
                  </div>
              </div>
          </div>
          <div className="border-t py-4">
            <p className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                © {new Date().getFullYear()} REON AI. All rights reserved.
            </p>
          </div>
        </footer>
    </div>
  );
}
