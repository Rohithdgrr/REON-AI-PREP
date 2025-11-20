
'use client';
import { Plus } from 'lucide-react';
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
  realms: typeof realms;
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
      className="bg-muted/50 p-3 flex flex-col items-center gap-2 border-r"
    >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-12 w-12 text-lg rounded-2xl bg-primary text-primary-foreground relative hover:bg-primary/90">
                    R
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Direct Messages</p></TooltipContent>
          </Tooltip>

          <Separator className='my-1' />

          {realms.map((realm) => (
            <Tooltip key={realm.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeRealm.id === realm.id ? 'secondary' : 'ghost'}
                  className="h-12 w-12 text-lg rounded-2xl bg-background relative data-[active=true]:scale-110"
                  data-active={activeRealm.id === realm.id}
                  onClick={() => onSelectRealm(realm)}
                >
                  <div className={cn("absolute left-[-12px] top-1/2 -translate-y-1/2 h-3 w-1 bg-foreground rounded-r-full transition-all", activeRealm.id === realm.id ? 'h-8' : 'group-hover:h-5')} />
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
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-dashed bg-transparent"
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
