
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, AuthError, GoogleAuthProvider, signInWithPopup, linkWithCredential, OAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        {...props}
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.863,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    );
  }

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
  const [targetExam, setTargetExam] = useState('Railway');

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  const handleAuthError = (error: AuthError) => {
    setIsSubmitting(false);
    console.error("Authentication Error:", error.code, error.message);
    
    let title = "Authentication Failed";
    let description = 'An unexpected error occurred. Please try again.';

    switch (error.code) {
      case 'auth/unauthorized-domain':
        title = "Domain Not Authorized";
        description = 'This domain is not authorized for Firebase authentication. Please add "reon-ai-prep.netlify.app" to your Firebase project\'s authorized domains in the Firebase Console.';
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
        description = "An account already exists with this email address. Please sign in with the original method you used (e.g., password).";
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
    if (!name || !dob || !email || !password || !targetExam) {
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
        localStorage.setItem(`temp_user_exam_${userCredential.user.uid}`, targetExam);
        localStorage.setItem(`is_new_user_${userCredential.user.uid}`, 'true');


    } catch (error) {
        handleAuthError(error as AuthError);
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Authentication service is not available. Please refresh the page.",
      });
      return;
    }
    
    setIsSubmitting(true);

    const provider = new GoogleAuthProvider();
    // Add additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
        const result = await signInWithPopup(auth, provider);
        // User successfully signed in
        console.log('Google sign-in successful:', result.user.email);
        // On success, the useEffect will handle the redirect.
        // Don't set isSubmitting to false here as redirect will happen
    } catch (error: any) {
        setIsSubmitting(false);
        
        // Handle specific error cases
        if (error.code === 'auth/popup-closed-by-user') {
            toast({
                variant: "destructive",
                title: "Sign-in Cancelled",
                description: "The sign-in popup was closed. Please try again.",
            });
            return;
        }
        
        if (error.code === 'auth/popup-blocked') {
            toast({
                variant: "destructive",
                title: "Popup Blocked",
                description: "Please allow popups for this site and try again.",
            });
            return;
        }
        
        if (error.code === 'auth/account-exists-with-different-credential') {
            toast({
                variant: "destructive",
                title: "Account Exists",
                description: "This email is already registered with a password. Please sign in with your password to link your Google account.",
            });
            return;
        }
        
        if (error.code === 'auth/network-request-failed') {
            toast({
                variant: "destructive",
                title: "Network Error",
                description: "Please check your internet connection and try again.",
            });
            return;
        }
        
        if (error.code === 'auth/unauthorized-domain') {
            toast({
                variant: "destructive",
                title: "Domain Not Authorized",
                description: 'This domain is not authorized for Firebase authentication. Please add "reon-ai-prep.netlify.app" to your Firebase project\'s authorized domains in the Firebase Console (Authentication > Settings > Authorized domains).',
            });
            return;
        }
        
        // Handle other errors
        handleAuthError(error);
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
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <Card className="mx-auto w-full max-w-[380px] sm:max-w-[420px] p-4 sm:p-6 shadow-xl">
            <CardHeader className="p-0 mb-4 sm:mb-6 text-center">
              <div className="flex justify-center mb-4">
                <img src="/wolf_logo_like_roy_group_circle.svg" alt="REON Logo" className="h-16 w-16 rounded-full" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline">Welcome to REON AI PREP</h1>
              <p className="text-sm sm:text-base text-balance text-muted-foreground mt-2">
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
                                <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                                <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} className="h-11"/>
                             </div>
                              <div className="space-y-2 relative">
                                <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                                <Input id="login-password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={isSubmitting} className="h-11 pr-10"/>
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 bottom-1 h-9 w-9" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                             </div>
                            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </TabsContent>
                     <TabsContent value="register">
                        <form onSubmit={handleEmailRegister} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-name" className="text-sm font-medium">Full Name</Label>
                                <Input id="register-name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} disabled={isSubmitting} className="h-11"/>
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="register-email" className="text-sm font-medium">Email</Label>
                                <Input id="register-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} className="h-11"/>
                             </div>
                              <div className="space-y-2 relative">
                                <Label htmlFor="register-password" className="text-sm font-medium">Password</Label>
                                <Input id="register-password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={isSubmitting} className="h-11 pr-10"/>
                                 <Button type="button" variant="ghost" size="icon" className="absolute right-1 bottom-1 h-9 w-9" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="register-dob" className="text-sm font-medium">Date of Birth</Label>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-11 justify-start text-left font-normal",
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
                             <div className="space-y-2">
                                <Label htmlFor="target-exam" className="text-sm font-medium">Target Exam</Label>
                                <Select value={targetExam} onValueChange={setTargetExam} disabled={isSubmitting}>
                                    <SelectTrigger id="target-exam" className="h-11">
                                        <SelectValue placeholder="Select your target exam" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Railway">Railway</SelectItem>
                                        <SelectItem value="Bank">Bank</SelectItem>
                                        <SelectItem value="Both">Both (Railway & Bank)</SelectItem>
                                        <SelectItem value="GATE">GATE</SelectItem>
                                        <SelectItem value="SSC">SSC (CGL/CHSL)</SelectItem>
                                        <SelectItem value="PSU">PSU</SelectItem>
                                        <SelectItem value="UPSC">UPSC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
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

                <Button variant="outline" className="w-full h-11 text-base font-medium" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <GoogleIcon className="mr-2 h-5 w-5" />
                    )}
                    Continue with Google
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
             <h3 className="text-xl sm:text-2xl font-bold text-white font-headline">Your Personal AI Exam Partner</h3>
             <p className="text-sm sm:text-base text-white/80 mt-2">Get AI-powered insights, personalized study plans, and adaptive mock tests to help you conquer competitive exams in India.</p>
         </div>
      </div>
    </div>
  )
}
