
'use client';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { realms } from '../r-chat-page';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';

type RealmsSidebarProps = {
  realms: typeof realms;
  activeRealm: (typeof realms)[0];
  onSelectRealm: (realm: (typeof realms)[0]) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function RealmsSidebar({
  realms,
  activeRealm,
  onSelectRealm,
  isOpen,
  setIsOpen,
}: RealmsSidebarProps) {
  return (
    <div
      className={cn(
        'bg-muted/50 p-2 flex flex-col items-center gap-2 border-r transition-all duration-300',
        isOpen ? 'w-20' : 'w-0 p-0 border-none'
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-2 transition-opacity duration-200',
          !isOpen && 'opacity-0'
        )}
      >
        <TooltipProvider>
          {realms.map((realm) => (
            <Tooltip key={realm.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeRealm.id === realm.id ? 'secondary' : 'ghost'}
                  className="h-12 w-12 text-2xl rounded-full bg-background relative"
                  onClick={() => onSelectRealm(realm)}
                >
                  {activeRealm.id === realm.id && (
                     <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />
                  )}
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
                className="h-12 w-12 rounded-full border-dashed"
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
       <button onClick={() => setIsOpen(!isOpen)} className={cn("absolute top-1/2 -translate-y-1/2 h-8 w-4 rounded-r-full bg-muted/80 border-y border-r flex items-center justify-center transition-all duration-300", isOpen ? 'left-[72px]' : 'left-0')}>
        <ChevronLeft className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
       </button>
    </div>
  );
}
