

'use client';

import { AtSign, Inbox, Search, User, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-2');

const friends = [
  { id: 'u2', name: 'RI-YYYY', avatarUrl: userAvatar?.imageUrl, status: 'Online', customStatus: 'Playing Valorant' },
  { id: 'u3', name: 'RI-ZZZZ', avatarUrl: userAvatar?.imageUrl, status: 'Idle', customStatus: '' },
  { id: 'u4', name: 'RI-AAAA', avatarUrl: userAvatar?.imageUrl, status: 'Do Not Disturb', customStatus: 'In a meeting' },
  { id: 'u5', name: 'RI-BBBB', avatarUrl: userAvatar?.imageUrl, status: 'Offline', customStatus: '' },
];

const FriendRow = ({friend}: {friend: typeof friends[0]}) => {
    const statusColors = {
        'Online': 'bg-green-500',
        'Idle': 'bg-yellow-500',
        'Do Not Disturb': 'bg-red-500',
        'Offline': 'bg-gray-500'
    };

    return (
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <div className="relative">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.avatarUrl ?? undefined} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-muted ${statusColors[friend.status as keyof typeof statusColors]}`} />
            </div>
            <div className="flex-1">
                <p className="font-semibold">{friend.name}</p>
                <p className="text-xs text-muted-foreground">{friend.customStatus || friend.status}</p>
            </div>
        </div>
    )
}

export function FriendsPanel() {
    return (
        <div className="flex-1 flex flex-col min-w-0 bg-card">
             <header className="flex flex-row items-center gap-4 border-b p-3 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h2 className="font-semibold text-base">Friends</h2>
                </div>
                 <Separator orientation="vertical" className="h-6" />
                 <Tabs defaultValue="online" className="h-8">
                    <TabsList className="h-full bg-transparent p-0 gap-2">
                        <TabsTrigger value="online" className="h-full data-[state=active]:bg-muted data-[state=active]:text-foreground px-3">Online</TabsTrigger>
                        <TabsTrigger value="all" className="h-full data-[state=active]:bg-muted data-[state=active]:text-foreground px-3">All</TabsTrigger>
                        <TabsTrigger value="pending" className="h-full data-[state=active]:bg-muted data-[state=active]:text-foreground px-3">Pending</TabsTrigger>
                         <Button variant="ghost" className="h-full text-green-500 hover:text-green-600 hover:bg-green-500/10 px-3">Add Friend</Button>
                    </TabsList>
                 </Tabs>
             </header>

            <main className="flex-1 p-4 overflow-y-auto">
                 <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Online - {friends.filter(f => f.status !== 'Offline').length}</h3>
                 <div className="space-y-1">
                    {friends.filter(f => f.status !== 'Offline').map(friend => <FriendRow key={friend.id} friend={friend} />)}
                 </div>

                 <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-6 mb-2">Offline - {friends.filter(f => f.status === 'Offline').length}</h3>
                 <div className="space-y-1">
                    {friends.filter(f => f.status === 'Offline').map(friend => <FriendRow key={friend.id} friend={friend} />)}
                 </div>
            </main>
        </div>
    )
}
