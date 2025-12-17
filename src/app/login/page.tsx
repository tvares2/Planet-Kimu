'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Invalid email or password.'
            : error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm text-center">
        <Heart className="mx-auto mb-6 h-12 w-12 text-primary" />
        <h1 className="mb-2 font-headline text-3xl font-bold tracking-tight text-foreground">
          Forever Yours
        </h1>
        <p className="mb-8 text-muted-foreground font-headline text-lg">
          Welcome Back
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="Password"
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
            {isLoading ? 'Logging In...' : 'Login'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
