
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
import { User, Upload, LogOut, Loader2, Mail, Phone, Moon, Sun, Monitor } from "lucide-react";
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
  const { theme, setTheme } = useTheme();
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Settings & Support
        </h1>
        <p className="text-muted-foreground">
          Manage your account, customize your experience, and find help.
        </p>
      </div>

       <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
            <div className="grid gap-8 lg:grid-cols-3 mt-6">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={user?.photoURL ?? userAvatar?.imageUrl} />
                                    <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                                </Avatar>
                                <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Change Photo</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={user?.displayName ?? ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={user?.email ?? ""} disabled />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile</Label>
                                <Input id="mobile" defaultValue={user?.phoneNumber ?? ""} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of the app.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <div className="flex rounded-md bg-muted p-1">
                                    <Button variant={theme === 'light' ? 'background' : 'ghost'} onClick={() => setTheme('light')} className="flex-1">
                                        <Sun className="mr-2"/> Light
                                    </Button>
                                    <Button variant={theme === 'dark' ? 'background' : 'ghost'} onClick={() => setTheme('dark')} className="flex-1">
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
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Change Password</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Actions</CardTitle>
                            <CardDescription>Manage your session and account status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" onClick={handleLogout} className="w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">Delete Account</CardTitle>
                            <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isDeleting}>
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Delete My Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
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
                        </CardFooter>
                    </Card>
                </div>
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
      </Tabs>
    </div>
  );
}
