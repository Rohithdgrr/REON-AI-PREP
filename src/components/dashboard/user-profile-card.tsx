

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
            <div className="grid lg:grid-cols-3 items-center">
                <div className="lg:col-span-1 p-6 md:p-12 bg-card flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse blur-xl" />
                        <Avatar className="h-40 w-40 md:h-56 md:w-56 relative border-4 border-background rounded-full">
                            {userAvatar ? <AvatarImage src={userAvatar.imageUrl} className="rounded-full" /> : <AvatarFallback className="rounded-full"><Bot className="h-24 w-24 md:h-32 md:w-32" /></AvatarFallback>}
                        </Avatar>
                    </div>
                </div>
                <div className="lg:col-span-2 p-6 md:p-12 text-center lg:text-left">
                    <p className="text-base font-semibold text-muted-foreground tracking-widest uppercase">Registered Identifier</p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mt-2">Ananya Sharma</h2>
                    <p className="text-muted-foreground mt-2 text-lg">RI-XXXX</p>
                    <p className="text-muted-foreground mt-4 text-base md:text-lg">Welcome back! Use this RI for quick logins and progress sync.</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 py-6 text-base">
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
