
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Bot, Rocket, Target } from "lucide-react";

export function UserProfileCard() {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-2');

    return (
        <Card className="w-full rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 items-center">
                <div className="md:col-span-1 p-8 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 dark:from-blue-900/50 dark:via-purple-900/30 dark:to-gray-900/50 flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse blur-md" />
                        <Avatar className="h-32 w-32 relative border-4 border-background">
                            {userAvatar ? <AvatarImage src={userAvatar.imageUrl} /> : <AvatarFallback><Bot className="h-16 w-16" /></AvatarFallback>}
                        </Avatar>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-3 py-1 rounded-full bg-blue-400/50 text-white text-xs backdrop-blur-sm border border-white/20">
                            RI RI-2045
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold font-headline mt-6">Ananya Sharma</h3>
                    <p className="text-sm text-muted-foreground mt-1">RI-XXXX</p>
                </div>
                <div className="md:col-span-2 p-8">
                    <p className="text-sm font-semibold text-muted-foreground tracking-widest">REGISTERED IDENTIFIER</p>
                    <h2 className="text-4xl font-bold font-headline mt-1">RI-XXXX</h2>
                    <p className="text-muted-foreground mt-2">Welcome back! Use this RI for quick logins and progress sync.</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                            <Target className="mr-2" />
                            Start adaptive quiz
                        </Button>
                        <Button size="lg" variant="outline">
                            <Rocket className="mr-2" />
                            Launch mock console
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
