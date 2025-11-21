

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { User, Upload, LogOut, Loader2, Mail, Phone, Moon, Sun, Monitor, Lock, Trash2, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { signOut, deleteUser } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteDoc, doc } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";


const faqs = [
    {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click on the 'Forgot your password?' link. Follow the instructions sent to your registered email address.",
    },
    {
        question: "How is my 'Weakness Radar' calculated?",
        answer: "Your Weakness Radar is calculated by an AI algorithm that analyzes your performance in mock tests and practice sessions. It identifies subjects and topics where you score lower or take more time, helping you focus your efforts.",
    },
    {
        question: "Can I take a mock test more than once?",
        answer: "Mock tests are designed to simulate a real exam environment and are typically available only once. However, you can review the analysis and solutions multiple times from your 'Past Mock Test Results' section.",
    },
    {
        question: "How do I generate a personalized study plan?",
        answer: "The AI automatically generates a 'Today's Plan' for you on the dashboard based on your available time and weak areas. A more comprehensive roadmap is available on the 'Roadmap' page.",
    },
    {
        question: "What is 'R-Chat'?",
        answer: "R-Chat is a collaborative tool where you can join study groups, chat with fellow aspirants, and get instant doubt clarification from our LIBRA AI.",
    }
]

export function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const { theme, setTheme, themes } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !auth || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete account. User not found.",
      });
      return;
    }
    setIsDeleting(true);
    try {
      // 1. Delete user data from Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      await deleteDoc(userDocRef);

      // 2. Delete the user from Firebase Auth
      await deleteUser(user);

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      // The withAuth component will handle the redirection to /login
    } catch (error: any) {
      console.error("Account Deletion Error:", error);

      if (error.code === 'auth/requires-recent-login') {
         toast({
            variant: "destructive",
            title: "Re-authentication Required",
            description: "This is a sensitive operation. Please log out and log back in again before deleting your account.",
            duration: 8000,
        });
      } else {
         toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: error.message || "An unexpected error occurred.",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    if (newTheme === 'default') {
      setTheme(isDark ? 'theme-default-dark' : 'theme-default-light');
    } else if (newTheme === 'sapphire') {
      setTheme(isDark ? 'theme-sapphire-dark' : 'theme-sapphire-light');
    } else {
      setTheme(newTheme);
    }
  }

  const getCurrentBaseTheme = () => {
    if (theme?.includes('sapphire')) return 'sapphire';
    if (theme?.includes('default')) return 'default';
    return 'default';
  }


  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Settings & Support
        </h1>
        <p className="text-muted-foreground">
          Manage your account, customize your experience, and find help.
        </p>
      </div>

       <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
            <div className="flex flex-col gap-8 mt-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information and manage account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-6">
                            <Avatar className="h-40 w-40">
                                <AvatarImage src={user?.photoURL ?? userAvatar?.imageUrl} />
                                <AvatarFallback><User className="h-20 w-20" /></AvatarFallback>
                            </Avatar>
                            <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Change Photo</Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user?.displayName ?? ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user?.email ?? ""} disabled />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile</Label>
                                <Input id="mobile" defaultValue={user?.phoneNumber ?? ""} />
                            </div>
                        </div>
                         <Separator/>
                        <div className="space-y-4">
                            <Label className="text-base">Change Password</Label>
                                <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <Button>Update Password</Button>
                        </div>
                        <Separator/>
                         <div className="space-y-4">
                            <Label className="text-base">Account Actions</Label>
                                <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout from this device
                            </Button>
                        </div>
                        <Separator/>
                        <div className="space-y-4 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
                            <Label className="text-base text-destructive">Danger Zone</Label>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full justify-start" disabled={isDeleting}>
                                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                        Delete My Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove all your data from our servers.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                        Delete
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button>Save Profile</Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the app.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Theme Palette</Label>
                            <Select value={getCurrentBaseTheme()} onValueChange={handleThemeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a theme palette" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="sapphire">Turquoise Sapphire</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Mode</Label>
                            <div className="flex rounded-md bg-muted p-1">
                                <Button variant={theme?.endsWith('light') ? 'background' : 'ghost'} onClick={() => setTheme(getCurrentBaseTheme() === 'default' ? 'theme-default-light' : 'theme-sapphire-light')} className="flex-1">
                                    <Sun className="mr-2"/> Light
                                </Button>
                                <Button variant={theme?.endsWith('dark') ? 'background' : 'ghost'} onClick={() => setTheme(getCurrentBaseTheme() === 'default' ? 'theme-default-dark' : 'theme-sapphire-dark')} className="flex-1">
                                    <Moon className="mr-2"/> Dark
                                </Button>
                                <Button variant={theme === 'system' ? 'background' : 'ghost'} onClick={() => setTheme('system')} className="flex-1">
                                    <Monitor className="mr-2"/> System
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Manage language and notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="language">Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger id="language" className="w-[180px]">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="te">Telugu</SelectItem>
                                    <SelectItem value="hi">Hindi</SelectItem>
                                    <SelectItem value="ta">Tamil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                <p className="text-xs text-muted-foreground">Receive updates about tests and progress.</p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="help">
           <div className="flex flex-col gap-8 max-w-4xl mx-auto mt-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Us</CardTitle>
                        <CardDescription>If you can't find an answer, feel free to reach out.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                            <Mail className="h-8 w-8 text-primary" />
                            <div>
                                <h3 className="font-semibold">Email Support</h3>
                                <a href="mailto:support@reon.ai" className="text-muted-foreground hover:text-primary">support@reon.ai</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="h-8 w-8 text-primary" />
                            <div>
                                <h3 className="font-semibold">Phone Support</h3>
                                <p className="text-muted-foreground">+91-80-XXXX-XXXX</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="about">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-6 w-6" />
                            About REON AI
                        </CardTitle>
                        <CardDescription>Important information regarding this application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <p>
                            This application, REON AI, has been developed as an experimental project for demonstration and educational purposes. The features, data, and functionalities presented are illustrative and may not represent a complete or commercially available product.
                        </p>
                        <p>
                            We earnestly request that all users and reviewers respect the intellectual effort that has gone into this project. Our development process operates with the utmost respect for intellectual property rights, and we have made every effort to avoid any infringement of copyright or patent laws.
                        </p>
                        <p>
                            In accordance with Indian law, including but not limited to <span className="font-semibold text-foreground">The Copyright Act, 1957</span>, and <span className="font-semibold text-foreground">The Patents Act, 1970</span>, we affirm that we do not intend to violate any protected rights. The concepts and technologies used are either our own original work, based on open-source technologies, or are implementations of publicly documented features.
                        </p>
                        <p>
                           If you have any concerns regarding potential copyright or patent infringements, we kindly ask you to contact us directly at <a href="mailto:support@reon.ai" className="text-primary hover:underline">support@reon.ai</a> so that we may address the matter promptly.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
