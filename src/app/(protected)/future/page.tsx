import { Swords } from 'lucide-react';

const dreams = [
  'Traveling somewhere completely new, just the two of us.',
  'Building a home filled with laughter, books, and plants.',
  'Growing individually, but always growing together.',
  'Mastering the art of making the perfect breakfast for you.',
  'Continuing to choose each other, every single day.',
  'Creating something beautiful together.',
  'Being there for all the boring days, not just the exciting ones.',
  'Becoming the old couple that still holds hands.',
];

export default function FuturePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          The Future
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          Not a map, but a compass. With you as my true north.
        </p>
      </header>

      <ul className="space-y-6">
        {dreams.map((dream, index) => (
          <li key={index} className="flex items-start gap-4">
            <Swords className="mt-1 h-5 w-5 flex-shrink-0 text-primary/70" />
            <span className="font-body text-xl text-foreground">
              {dream}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
