'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  LogOut,
  PanelLeft,
  UserCircle,
  HeartPulse,
  CalendarClock,
  HeartHandshake,
  BookText,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { HER_NAME } from '@/lib/constants';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/love-meter', label: 'Love Meter', icon: HeartPulse },
  { href: '/counter', label: 'Days Counter', icon: CalendarClock },
  { href: '/lessons', label: 'Lessons Learnt', icon: HeartHandshake },
  { href: '/weekly-stories', label: 'Weekly Stories', icon: BookText },
];

function NavContent() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Link
          href="/home"
          className="group flex items-center gap-2 text-foreground"
        >
          <Heart className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
          <span className="font-headline text-xl font-bold tracking-tight">
            For {HER_NAME}
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground font-headline',
              pathname === item.href &&
                'bg-primary/10 text-primary hover:text-primary'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="space-y-1 p-2">
         <Link
            href="/profile"
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground font-headline',
              pathname === '/profile' &&
                'bg-primary/10 text-primary hover:text-primary'
            )}
          >
            <UserCircle className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground font-headline"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
      <footer className="p-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()}. Made with love, not logic.</p>
      </footer>
    </div>
  );
}

export default function MainSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-background/50 backdrop-blur-sm"
            >
              <PanelLeft className="h-6 w-6 text-primary" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-background p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 border-r border-border/50 bg-background md:block">
        <NavContent />
      </aside>
    </>
  );
}
