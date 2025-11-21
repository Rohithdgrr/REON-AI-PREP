

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export function UserProfileCard() {
    const { user } = useUser();
    const firestore = useFirestore();
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading } = useDoc(userProfileRef);
    
    const displayRiId = userProfile?.riId?.replace(/_/g, '');

    if (isLoading) {
        return (
             <Card className="w-full rounded-2xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-3 items-center">
                    <div className="md:col-span-1 p-6 md:p-8 flex flex-col items-center text-center bg-card">
                         <Skeleton className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-full" />
                    </div>
                    <div className="md:col-span-2 p-6 md:p-8 text-center md:text-left space-y-3">
                         <Skeleton className="h-6 w-3/4" />
                         <Skeleton className="h-10 w-1/2" />
                         <Skeleton className="h-6 w-2/3" />
                         <Skeleton className="h-6 w-full max-w-sm" />
                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                             <Skeleton className="h-12 w-48" />
                             <Skeleton className="h-12 w-48" />
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="w-full rounded-2xl shadow-lg overflow-hidden bg-card">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                <div className="relative flex-shrink-0">
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse blur-xl" />
                    <Avatar className="relative h-32 w-32 sm:h-36 sm:w-36 border-4 border-background">
                       <AvatarImage src={userProfile?.profilePhoto ?? userAvatar?.imageUrl} alt={userProfile?.fullName ?? 'User avatar'} />
                       <AvatarFallback className="text-5xl">
                         {userProfile?.fullName?.charAt(0) ?? <Bot className="h-20 w-20" />}
                       </AvatarFallback>
                    </Avatar>
                </div>
                <div className="text-center md:text-left flex-1">
                    <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">Registered Identifier</p>
                    {displayRiId && <p className="text-lg font-mono text-primary">{displayRiId}</p>}
                    <h2 className="text-3xl sm:text-4xl font-bold font-headline mt-1">{userProfile?.fullName ?? 'Welcome!'}</h2>
                    <p className="text-muted-foreground mt-1 text-md">{userProfile?.email}</p>
                    <p className="text-muted-foreground mt-4 text-sm md:text-base">Welcome back! Use this RI for quick logins and progress sync.</p>
                </div>
            </div>
        </Card>
    );
}
