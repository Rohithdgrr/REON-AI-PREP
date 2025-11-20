
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
                <div className="md:col-span-1 p-12 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 dark:from-blue-900/50 dark:via-purple-900/30 dark:to-gray-900/50 flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl animate-pulse blur-lg" />
                        <Avatar className="h-48 w-48 relative border-4 border-background rounded-2xl">
                            {userAvatar ? <AvatarImage src={userAvatar.imageUrl} className="rounded-xl" /> : <AvatarFallback className="rounded-xl"><Bot className="h-24 w-24" /></AvatarFallback>}
                        </Avatar>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 rounded-full bg-blue-400/50 text-white text-sm backdrop-blur-sm border border-white/20">
                            RI RI-2045
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 p-12">
                    <h3 className="text-3xl font-bold font-headline">Ananya Sharma</h3>
                    <p className="text-base text-muted-foreground mt-1">RI-XXXX</p>
                    <p className="text-base font-semibold text-muted-foreground tracking-widest uppercase mt-8">Registered Identifier</p>
                    <h2 className="text-5xl font-bold font-headline mt-2">RI-XXXX</h2>
                    <p className="text-muted-foreground mt-4 text-lg">Welcome back! Use this RI for quick logins and progress sync.</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 py-6 text-base">
                            <Target className="mr-2" />
                            Start adaptive quiz
                        </Button>
                        <Button size="lg" variant="outline" className="py-6 text-base">
                            <Rocket className="mr-2" />
                            Launch mock console
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
