'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  displayName: z.string().optional(),
  username: z.string().optional(),
  nicknames: z.string().optional(),
  hobby: z.string().optional(),
  phoneNumber: z.string().optional(),
  description: z.string().optional(),
  partnerId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  username?: string;
  nicknames?: string;
  hobby?: string;
  phoneNumber?: string;
  description?: string;
  partnerId?: string;
};

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );

  const { data: userProfile, isLoading: isLoadingProfile } =
    useDoc<UserProfile>(userProfileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
      username: '',
      nicknames: '',
      hobby: '',
      phoneNumber: '',
      description: '',
      partnerId: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || '',
        username: userProfile.username || '',
        nicknames: userProfile.nicknames || '',
        hobby: userProfile.hobby || '',
        phoneNumber: userProfile.phoneNumber || '',
        description: userProfile.description || '',
        partnerId: userProfile.partnerId || '',
      });
    }
  }, [userProfile, form]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userProfileRef) return;
    try {
      await setDoc(userProfileRef, data, { merge: true });
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save your profile changes.',
      });
    }
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Your Profile
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground">
          View and edit your personal information.
        </p>
      </header>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-4xl">
                  {getInitials(user?.email)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user?.email}</CardTitle>
              {user?.uid && (
                <CardDescription className="font-mono text-xs text-muted-foreground pt-2">
                  User ID: {user.uid}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingProfile ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="partnerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your partner's User ID"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your partner's User ID to connect your Love
                          Meters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nicknames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nicknames</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Love, Sweetie" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hobby"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hobby</FormLabel>
                        <FormControl>
                          <Input placeholder="Your favorite hobby" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your phone number"
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A little about yourself..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t px-6 py-4">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || isLoadingProfile}
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                Log Out
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

    