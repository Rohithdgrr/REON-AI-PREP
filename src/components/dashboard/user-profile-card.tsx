

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Bot, Rocket, Target } from "lucide-react";

export function UserProfileCard() {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

    return (
        <Card className="w-full rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 items-center">
                <div className="md:col-span-1 p-6 md:p-8 flex flex-col items-center text-center bg-card">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse blur-xl" />
                        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 relative border-4 border-background rounded-full">
                            {userAvatar ? <AvatarImage src={userAvatar.imageUrl} className="rounded-full" /> : <AvatarFallback className="rounded-full"><Bot className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28" /></AvatarFallback>}
                        </Avatar>
                    </div>
                </div>
                <div className="md:col-span-2 p-6 md:p-8 text-center md:text-left">
                    <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">Registered Identifier</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline mt-1">Ananya Sharma</h2>
                    <p className="text-muted-foreground mt-1 text-md">RI-XXXX</p>
                    <p className="text-muted-foreground mt-4 text-sm md:text-base">Welcome back! Use this RI for quick logins and progress sync.</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 py-5 text-base">
                            <Target className="mr-2" />
                            Start adaptive quiz
                        </Button>
                        <Button size="lg" variant="outline" className="py-5 text-base">
                            <Rocket className="mr-2" />
                            Launch mock console
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
