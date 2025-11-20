
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Award, Star, TrendingUp, User } from "lucide-react";

export function UserProfileCard() {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
    const powerLevel = 78;

    return (
        <Card className="w-full max-w-sm rounded-2xl shadow-lg">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
                        {userAvatar ? <AvatarImage src={userAvatar.imageUrl} /> : <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>}
                    </Avatar>
                    <h3 className="text-xl font-bold font-headline">Srinivas Reddy</h3>
                    <p className="text-sm text-muted-foreground">Level: Expert</p>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                            <span>Power Level</span>
                            <span>{powerLevel}%</span>
                        </div>
                        <Progress value={powerLevel} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xs text-muted-foreground">Rank</p>
                            <p className="text-lg font-bold flex items-center justify-center gap-1"><TrendingUp className="h-4 w-4 text-green-500" />127</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">XP</p>
                            <p className="text-lg font-bold flex items-center justify-center gap-1"><Star className="h-4 w-4 text-blue-500" />12,450</p>
                        </div>
                    </div>
                </div>

                <Button className="w-full mt-6">
                    <Award className="mr-2 h-4 w-4" />
                    View Full Profile
                </Button>
            </CardContent>
        </Card>
    );
}
