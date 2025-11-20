
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

type Member = {
    id: string;
    name: string;
    role: string;
    status: 'Online' | 'Idle' | 'Do Not Disturb' | 'Offline';
    avatarUrl: string;
}

type MembersPanelProps = {
    members: Member[];
}

const statusColors = {
    'Online': 'bg-green-500',
    'Idle': 'bg-yellow-500',
    'Do Not Disturb': 'bg-red-500',
    'Offline': 'bg-gray-500'
}

const roleHierarchy = ['Online', 'Offline'];

export function MembersPanel({ members }: MembersPanelProps) {

    const groupedMembers = members.reduce((acc, member) => {
        const role = member.role || 'Members';
        if (!acc[role]) {
            acc[role] = [];
        }
        acc[role].push(member);
        return acc;
    }, {} as Record<string, Member[]>);

    return (
        <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 px-2 py-4">
                <div className="space-y-4">
                    {roleHierarchy.map(role => {
                         const roleMembers = groupedMembers[role];
                         if (!roleMembers || roleMembers.length === 0) return null;

                         return (
                            <div key={role}>
                                <h4 className="px-2 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    {role} — {roleMembers.length}
                                </h4>
                                <div className="space-y-1">
                                    {roleMembers.map(member => (
                                         <div key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/80 cursor-pointer">
                                             <div className="relative">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.avatarUrl} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className={cn("absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-background", statusColors[member.status])} />
                                             </div>
                                            <span className={cn("font-medium text-sm", member.status === 'Offline' && 'opacity-60')}>{member.name}</span>
                                             {member.name.includes('YYYY') && <Crown className="h-4 w-4 text-yellow-500 ml-auto"/>}
                                         </div>
                                    ))}
                                </div>
                            </div>
                         )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
