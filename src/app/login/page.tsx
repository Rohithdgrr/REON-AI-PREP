
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, AuthError } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon, Eye, EyeOff } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date>();
  const [showPassword, setShowPassword] = useState(false);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  const handleAuthError = (error: AuthError) => {
    setIsSubmitting(false);
    console.error("Authentication Error:", error.code, error.message);
    
    let title = "Authentication Failed";
    let description = 'An unexpected error occurred. Please try again.';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        title = "Invalid Credentials";
        description = 'Invalid email or password. Please check your credentials and try again.';
        break;
      case 'auth/email-already-in-use':
        title = "Email Already Registered";
        description = 'This email is already registered with a password. Please log in or use "Forgot Password".';
        break;
      case 'auth/operation-not-allowed':
        title = "Sign-in Method Disabled";
        description = 'This sign-in method is not enabled. Please contact support or enable it in your Firebase project settings.';
        break;
      default:
        description = error.message || `An unknown error occurred. (Code: ${error.code})`;
        break;
    }
    
    toast({
        variant: "destructive",
        title: title,
        description: description,
    });
  }

  useEffect(() => {
    if (!isUserLoading && user) {
        router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsSubmitting(true);
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        handleAuthError(error);
      });
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (!name || !dob || !email || !password) {
        toast({ variant: 'destructive', title: "Missing Information", description: "Please fill out all fields to register." });
        return;
    }
    setIsSubmitting(true);

    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
            handleAuthError({ code: 'auth/email-already-in-use' } as AuthError);
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { 
            displayName: name,
        });
        
        localStorage.setItem(`temp_user_dob_${userCredential.user.uid}`, format(dob, 'yyyy-MM-dd'));

    } catch (error) {
        handleAuthError(error as AuthError);
    }
  }
  
  if (isUserLoading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      );
  }
  
  if (user) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          <p className="ml-4">Redirecting to your dashboard...</p>
        </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="mx-auto w-full max-w-[380px] p-6 shadow-xl">
            <CardHeader className="p-0 mb-6 text-center">
              <h1 className="text-3xl font-bold font-headline">Welcome to REON AI PREP</h1>
              <p className="text-balance text-muted-foreground">
                Sign in or create an account to continue
              </p>
            </CardHeader>
            <CardContent className="p-0">
                 <Tabs defaultValue="login">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <form onSubmit={handleEmailLogin} className="space-y-4 pt-4">
                             <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting}/>
                             </div>
                              <div className="space-y-2 relative">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={isSubmitting}/>
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 bottom-1 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                             </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Login
                            </Button>
                        </form>
                    </TabsContent>
                     <TabsContent value="register">
                        <form onSubmit={handleEmailRegister} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-name">Full Name</Label>
                                <Input id="register-name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} disabled={isSubmitting}/>
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input id="register-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting}/>
                             </div>
                              <div className="space-y-2 relative">
                                <Label htmlFor="register-password">Password</Label>
                                <Input id="register-password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={isSubmitting}/>
                                 <Button type="button" variant="ghost" size="icon" className="absolute right-1 bottom-1 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="register-dob">Date of Birth</Label>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dob && "text-muted-foreground"
                                        )}
                                        disabled={isSubmitting}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={dob}
                                        onSelect={setDob}
                                        initialFocus
                                        captionLayout="dropdown-buttons"
                                        fromYear={1950}
                                        toYear={new Date().getFullYear() - 10}
                                        />
                                    </PopoverContent>
                                </Popover>
                             </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </form>
                    </TabsContent>
                 </Tabs>

            </CardContent>
        </Card>
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
