
'use client';
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { realms } from "../r-chat-page";

type RealmsSidebarProps = {
    realms: typeof realms;
    activeRealm: typeof realms[0];
    onSelectRealm: (realm: typeof realms[0]) => void;
};

export function RealmsSidebar({ realms, activeRealm, onSelectRealm }: RealmsSidebarProps) {
    return (
        <div className="bg-muted/50 p-2 flex flex-col items-center gap-2 border-r">
            <TooltipProvider>
                {realms.map(realm => (
                    <Tooltip key={realm.id}>
                        <TooltipTrigger asChild>
                            <Button variant={activeRealm.id === realm.id ? "secondary" : "ghost"} className="h-12 w-12 text-2xl rounded-full bg-background" onClick={() => onSelectRealm(realm)}>
                                {realm.icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{realm.name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" className="h-12 w-12 rounded-full border-dashed">
                            <Plus />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Create Realm</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
