import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function SecretPage() {
  return (
    <div className="flex h-full min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <div className="max-w-2xl">
        <Heart className="mx-auto mb-8 h-16 w-16 animate-pulse text-primary" />
        <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
          You found it.
        </h1>
        <p className="mt-6 font-body text-xl text-muted-foreground text-balance sm:text-2xl">
          If you reached here, it means you’re curious...
          <br />
          and I love that about you.
        </p>

        <p className="mt-8 font-body text-lg text-muted-foreground/70">
          This little corner of the internet is just for you, a secret between
          us.
        </p>

        <div className="mt-10">
          <Link
            href="/home"
            className="text-primary hover:text-primary/80 font-headline"
          >
            &larr; Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
