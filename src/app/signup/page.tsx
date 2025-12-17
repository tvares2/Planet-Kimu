'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password Too Short',
        description: 'Your password must be at least 6 characters long.',
      });
      return;
    }
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user && firestore) {
        // Create a user document in Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
          displayName: '',
          username: '',
          nicknames: '',
          hobby: '',
          phoneNumber: '',
          description: '',
          partnerId: '',
        });
      }

      toast({
        title: 'Account Created!',
        description: "You've been successfully signed up.",
      });
      router.push('/home');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm text-center">
        <Heart className="mx-auto mb-6 h-12 w-12 text-primary" />
        <h1 className="mb-2 font-headline text-3xl font-bold tracking-tight text-foreground text-balance">
          My Kutty Pattu cute ah email id type panunga
        </h1>
        <p className="mb-8 text-muted-foreground font-headline text-lg">
          Join the story.
        </p>
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center font-headline"
            disabled={isLoading}
            required
            suppressHydrationWarning
          />
          <Input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center font-headline"
            disabled={isLoading}
            required
            suppressHydrationWarning
          />
          <Button
            type="submit"
            className="w-full font-headline"
            disabled={isLoading}
            suppressHydrationWarning
          >
            <span>Ula vaanga kutty</span>
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
