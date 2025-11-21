
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, getRedirectResult, AuthError } from 'firebase/auth';
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
  const { toast } = useToast();
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);
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
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        title = "Sign-in Cancelled";
        description = "The sign-in window was closed. Please try again.";
        break;
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
      case 'auth/account-exists-with-different-credential':
        title = "Account Exists";
        description = 'An account already exists with this email. Please sign in using the method you originally used (e.g., Google).';
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
    if (auth) {
      getRedirectResult(auth)
        .then((result) => {
          if (result) {
            toast({ title: "Signed In Successfully!", description: `Welcome, ${result.user.displayName}!`});
            // Redirect will be handled by the user state change effect
          }
        })
        .catch((error) => {
          handleAuthError(error);
        })
        .finally(() => {
          setIsProcessingRedirect(false);
        });
    } else {
        setIsProcessingRedirect(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    if (!isUserLoading && user) {
        router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = () => {
    if (!auth) return;
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch(handleAuthError);
  };

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
            handleAuthError({ code: 'auth/account-exists-with-different-credential' } as AuthError);
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
  
  if (isUserLoading || isProcessingRedirect) {
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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="mx-auto w-full max-w-[380px] p-6 shadow-xl">
            <CardHeader className="p-0 mb-6 text-center">
              <h1 className="text-3xl font-bold font-headline">Welcome to REON AI</h1>
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

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                 <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   <GoogleIcon /> Sign in with Google
                 </Button>

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


    