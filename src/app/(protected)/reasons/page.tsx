'use client';

import { useState, useTransition } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { generateReason } from '@/app/actions';

const initialReasons = [
  'You understand my silence.',
  'You make ordinary days feel special.',
  'You stayed.',
  'You see the best in me, even when I can’t.',
  'Your laughter is my favorite song.',
];

export default function ReasonsPage() {
  const [reason, setReason] = useState(
    'Click the button to see a reason...'
  );
  const [isPending, startTransition] = useTransition();

  const fetchReason = () => {
    startTransition(async () => {
      const result = await generateReason();
      setReason(result.reason ?? 'My love for you is beyond words.');
    });
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Why I Choose You
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          Every day, in a hundred different ways.
        </p>
      </header>

      <div className="w-full max-w-2xl">
        <Card className="flex min-h-[12rem] items-center justify-center p-8 text-center shadow-lg shadow-primary/5">
          <CardContent className="p-0">
            {isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-48" />
              </div>
            ) : (
              <p className="font-body text-2xl text-foreground sm:text-3xl text-balance">
                “{reason}”
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button
          onClick={fetchReason}
          disabled={isPending}
          className="animate-glow font-headline transition-all hover:scale-105"
          size="lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {isPending ? 'Finding a reason...' : 'Show me another reason'}
        </Button>
      </div>
    </div>
  );
}
