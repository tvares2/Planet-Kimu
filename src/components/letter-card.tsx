'use client';

import { BookHeart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Letter = {
  title: string;
  content: string;
};

interface LetterCardProps {
  letter: Letter;
}

export default function LetterCard({ letter }: LetterCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer border-border/50 bg-secondary/20 transition-all hover:border-primary/50 hover:bg-secondary/40 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-xl text-foreground">
              <BookHeart className="h-6 w-6 text-primary/80 transition-colors group-hover:text-primary" />
              <span>{letter.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Click to open...</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-background font-body">
        <DialogHeader>
          <DialogTitle className="mb-4 font-headline text-3xl text-primary">
            {letter.title}
          </DialogTitle>
        </DialogHeader>
        <div className="prose prose-lg prose-invert max-h-[70vh] overflow-y-auto text-lg text-foreground/80">
          <p>{letter.content}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
