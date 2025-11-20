
'use client';
import { Bot, MessageCircle, Plus, Users } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { realms } from '../r-chat-page';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

type RealmsSidebarProps = {
  realms: {id: string, name: string, icon: React.ReactNode}[];
  activeRealm: (typeof realms)[0];
  onSelectRealm: (realm: (typeof realms)[0]) => void;
};

export function RealmsSidebar({
  realms,
  activeRealm,
  onSelectRealm,
}: RealmsSidebarProps) {
  return (
    <div
      className="bg-muted/30 p-3 flex flex-col items-center gap-2 border-r"
    >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-12 w-12 text-lg rounded-full bg-primary text-primary-foreground relative hover:bg-primary/90 transition-all duration-200 hover:rounded-2xl">
                    <MessageCircle />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Direct Messages</p></TooltipContent>
          </Tooltip>

          <Separator className='my-1' />

          {realms.map((realm) => (
            <Tooltip key={realm.id}>
              <TooltipTrigger asChild>
                <div className="relative group">
                    <div className={cn("absolute left-[-12px] top-1/2 -translate-y-1/2 h-2 w-1 bg-foreground rounded-r-full transition-all duration-300", activeRealm.id === realm.id ? 'h-10' : 'group-hover:h-5')} />
                    <Button
                    variant="ghost"
                    className="h-12 w-12 text-lg rounded-full bg-background relative transition-all duration-200 hover:rounded-2xl data-[active=true]:rounded-2xl data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    data-active={activeRealm.id === realm.id}
                    onClick={() => onSelectRealm(realm)}
                    >
                    {realm.icon}
                    </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{realm.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-full border-dashed bg-transparent transition-all duration-200 hover:rounded-2xl hover:bg-primary/10"
              >
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Create Realm</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    </div>
  );
}
