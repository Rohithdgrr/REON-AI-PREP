import Link from "next/link";
import { Bell, Search, User, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export function Header() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-xl font-bold font-headline text-primary">
          REON™
        </Link>
        <div className="flex items-center gap-2 rounded-lg bg-muted p-1 text-sm">
          <Button variant="ghost" size="sm" className="px-3">Railway</Button>
          <div className="h-4 w-px bg-border" />
          <Button variant="ghost" size="sm" className="px-3">Bank</Button>
           <div className="h-4 w-px bg-border" />
          <Button variant="ghost" size="sm" className="px-3">Both</Button>
        </div>
      </div>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Global Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>TE</DropdownMenuItem>
          <DropdownMenuItem>HI</DropdownMenuItem>
          <DropdownMenuItem>TA</DropdownMenuItem>
          <DropdownMenuItem>EN</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs"
        >
          3
        </Badge>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            {userAvatar ? (
               <Image
                src={userAvatar.imageUrl}
                width={36}
                height={36}
                alt="User avatar"
                className="rounded-full"
                data-ai-hint={userAvatar.imageHint}
              />
            ) : (
                <User className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>RaxPro</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
