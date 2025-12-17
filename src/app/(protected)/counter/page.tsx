'use client';

import { useEffect, useState } from 'react';
import {
  FIRST_MET_DATE,
  FRIENDSHIP_DATE,
  LOVE_DATE,
} from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Counter = {
  label: string;
  days: number | null;
};

const calculateDays = (startDate: Date): number => {
  const today = new Date();
  // Set to midnight to count full days
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const differenceInTime = end.getTime() - start.getTime();
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
};

export default function CounterPage() {
  const [counters, setCounters] = useState<Counter[]>([
    { label: 'Since we first saw each other', days: null },
    { label: 'Days of our beautiful friendship', days: null },
    { label: 'Since our love story began', days: null },
  ]);

  useEffect(() => {
    setCounters([
      { label: 'Since we first saw each other', days: calculateDays(FIRST_MET_DATE) },
      { label: 'Days of our beautiful friendship', days: calculateDays(FRIENDSHIP_DATE) },
      { label: 'Since our love story began', days: calculateDays(LOVE_DATE) },
    ]);
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
       <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Our Timeline in Days
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          Counting the moments that matter.
        </p>
      </header>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {counters.map((counter, index) => (
          <Card key={index} className="text-center bg-secondary/20 border-border/50">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-muted-foreground h-12">
                {counter.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-headline text-6xl font-bold text-primary">
                {counter.days !== null ? counter.days.toLocaleString() : '...'}
              </p>
              <p className="mt-2 font-body text-lg text-foreground">days</p>
            </CardContent>
          </Card>
        ))}
      </div>
       <p className="mt-16 font-body text-xl text-muted-foreground/70 italic text-balance text-center">
          “And I’ll keep counting, every single one.”
        </p>
    </div>
  );
}
