import Link from 'next/link';
import TypingAnimation from '@/components/typing-animation';
import { Button } from '@/components/ui/button';
import { HER_NAME } from '@/lib/constants';
import { MoveRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex h-full min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <div className="max-w-3xl">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          Hey {HER_NAME},
        </h1>
        <TypingAnimation
          text="This website exists because you exist."
          className="mt-4 font-body text-xl text-muted-foreground sm:text-2xl md:text-3xl"
        />
        <div className="mt-12">
          <Button
            asChild
            className="animate-glow font-headline transition-all hover:scale-105"
            size="lg"
          >
            <Link href="/story">
              Start Exploring <MoveRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
