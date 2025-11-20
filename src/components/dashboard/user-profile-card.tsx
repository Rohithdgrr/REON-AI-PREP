

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
                <div className="md:col-span-1 p-12 bg-background flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse blur-xl" />
                        <Avatar className="h-56 w-56 relative border-4 border-background rounded-full">
                            {userAvatar ? <AvatarImage src={userAvatar.imageUrl} className="rounded-full" /> : <AvatarFallback className="rounded-full"><Bot className="h-32 w-32" /></AvatarFallback>}
                        </Avatar>
                    </div>
                </div>
                <div className="md:col-span-2 p-12">
                    <h3 className="text-4xl font-bold font-headline">Ananya Sharma</h3>
                    <p className="text-base text-muted-foreground mt-1">RI-XXXX</p>
                    <p className="text-base font-semibold text-muted-foreground tracking-widest uppercase mt-8">Registered Identifier</p>
                    <h2 className="text-6xl font-bold font-headline mt-2">RI-XXXX</h2>
                    <p className="text-muted-foreground mt-4 text-lg">Welcome back! Use this RI for quick logins and progress sync.</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
