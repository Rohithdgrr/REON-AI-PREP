
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import Link from 'next/link';
import Image from 'next/image';
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
]

export function AuthPage() {
  const heroBg = PlaceHolderImages.find((img) => img.id === 'hero-background');
  return (
    <div className="w-full min-h-screen">
      <div className="w-full lg:grid lg:grid-cols-2">
        <div className="relative flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold font-headline">REON AI Prep</h1>
              <p className="text-balance text-muted-foreground">
                Login or create an account to start your AI-powered journey
              </p>
            </div>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline">
                        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                          <path
                            fill="currentColor"
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-4.38 1.62-3.8 0-6.89-3.1-6.89-7s3.09-7 6.89-7c2.1 0 3.56.84 4.38 1.62l2.35-2.35C18.27 1.3 15.83 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c7.2 0 12.03-4.92 12.03-12.03 0-.8-.07-1.55-.2-2.3H12.48z"
                          />
                        </svg>
                        Gmail
                      </Button>
                      <Button variant="outline">Mobile OTP</Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ri-id-login">RI ID</Label>
                      <Input id="ri-id-login" placeholder="RAX202514789" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="password-login">Password</Label>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Input id="password-login" type="password" required />
                    </div>
                    <Link href="/dashboard" className="w-full">
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="register">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Enter your details below to create a new account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Srinivas Reddy" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="srinivas@example.com"
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input id="mobile" placeholder="+91 9876543210" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-type">Exam Type</Label>
                      <Select>
                        <SelectTrigger id="exam-type">
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="railway">Railway</SelectItem>
                          <SelectItem value="bank">Bank</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ri-id-register">Create RI ID</Label>
                      <Input id="ri-id-register" placeholder="Auto-suggested: RAX..." required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Password</Label>
                      <Input id="password-register" type="password" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{' '}
                        <Link href="#" className="underline">
                          terms and conditions
                        </Link>
                      </Label>
                    </div>
                    <Link href="/dashboard" className="w-full">
                      <Button type="submit" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden bg-muted lg:block relative min-h-[600px] lg:min-h-screen">
          {heroBg && (
            <Image
              src={heroBg.imageUrl}
              alt={heroBg.description}
              data-ai-hint={heroBg.imageHint}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
              <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
                  <h2 className="text-4xl font-bold font-headline mb-4">REON – AI based prep for Railway & Bank exams.</h2>
              </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}
