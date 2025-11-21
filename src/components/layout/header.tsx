
'use client';
import Link from 'next/link';
import {
  Bell,
  Menu,
  Search,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useUser } from '@/firebase';
import { useToolsSidebar } from '@/hooks/use-tools-sidebar';

export function Header() {
  const auth = useAuth();
  const { user } = useUser();
  const { setActiveTool } = useToolsSidebar();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
      <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-muted pl-11 h-10 shadow-inner md:w-[200px] lg:w-[336px]"
        />
      </div>
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setActiveTool({ id: 'notifications'})}>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full h-10 w-10 border-2 border-primary/20"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.photoURL ?? userAvatar?.imageUrl} alt="Avatar" />
                <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/dashboard/help" className="flex items-center cursor-pointer">
                 <Settings className="mr-2 h-4 w-4" />
                 Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
