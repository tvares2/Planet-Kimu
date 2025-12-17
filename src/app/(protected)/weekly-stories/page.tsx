'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
  useDoc,
} from '@/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type WeeklyStory = {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  authorId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
};

function StoryForm({
  story,
  onSave,
  isSubmitting,
}: {
  story?: WeeklyStory;
  onSave: (
    data: Omit<WeeklyStory, 'id' | 'authorId' | 'createdAt'>
  ) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState(story?.title || '');
  const [content, setContent] = useState(story?.content || '');
  const [startDate, setStartDate] = useState(story?.startDate || '');
  const [endDate, setEndDate] = useState(story?.endDate || '');

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.content);
      setStartDate(story.startDate);
      setEndDate(story.endDate);
    }
  }, [story]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !startDate || !endDate) return;
    await onSave({ title, content, startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start-date" className="font-headline">
            Start Date
          </label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="end-date" className="font-headline">
            End Date
          </label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="title" className="font-headline">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., The week of our first trip"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="content" className="font-headline">
          Your Story
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Summarize your week together..."
          rows={5}
          required
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Story'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function StoryCard({
  story,
  onUpdate,
  onDelete,
  isSubmitting,
  currentUserId,
}: {
  story: WeeklyStory;
  onUpdate: (
    storyId: string,
    data: Partial<WeeklyStory>
  ) => Promise<void>;
  onDelete: (storyId: string) => Promise<void>;
  isSubmitting: boolean;
  currentUserId: string | undefined;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const authorRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'users', story.authorId) : null),
    [firestore, story.authorId]
  );
  const { data: author, isLoading: isLoadingAuthor } =
    useDoc<UserProfile>(authorRef);

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // add a day to each to fix off-by-one error
    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
  };
  
  const isCurrentUserAuthor = story.authorId === currentUserId;

  return (
    <Card
      key={story.id}
      className={cn(
        'flex flex-col border-border/50',
        isCurrentUserAuthor ? 'bg-secondary/20' : 'bg-amber-950/20'
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-headline text-2xl text-foreground">
              {story.title}
            </CardTitle>
            <CardDescription className="font-body text-base text-muted-foreground">
              {formatDateRange(story.startDate, story.endDate)}
            </CardDescription>
          </div>
          {isCurrentUserAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">
                        Edit Story
                      </DialogTitle>
                    </DialogHeader>
                    <StoryForm
                      story={story}
                      isSubmitting={isSubmitting}
                      onSave={(data) => onUpdate(story.id, data)}
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this story.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(story.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="font-body text-foreground/80 line-clamp-4">
          {story.content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
             <AvatarFallback className="text-xs">
                {isLoadingAuthor ? '?' : (author?.displayName || author?.email || '?').charAt(0).toUpperCase()}
              </AvatarFallback>
          </Avatar>
          <span className="font-medium">{isLoadingAuthor ? '...' : (author?.displayName || author?.email || 'User')}</span>
        </div>

        <p>
          {story.createdAt
            ? `Added ${format(
                new Date(story.createdAt.seconds * 1000),
                'MMM d, yyyy'
              )}`
            : 'Just now'}
        </p>
      </CardFooter>
    </Card>
  );
}

export default function WeeklyStoriesPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const storiesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'weekly_stories') : null),
    [firestore]
  );

  const storiesQuery = useMemoFirebase(
    () => storiesRef && query(storiesRef, orderBy('startDate', 'desc')),
    [storiesRef]
  );

  const { data: stories, isLoading } =
    useCollection<WeeklyStory>(storiesQuery);

  const handleCreate = async (
    data: Omit<WeeklyStory, 'id' | 'authorId' | 'createdAt'>
  ) => {
    if (!user || !storiesRef) return;
    setIsSubmitting(true);
    try {
      await addDoc(storiesRef, {
        ...data,
        authorId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Story added!' });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error adding story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add story.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    storyId: string,
    data: Partial<WeeklyStory>
  ) => {
    if (!firestore) return;
    setIsSubmitting(true);
    const storyDocRef = doc(firestore, 'weekly_stories', storyId);
    try {
      await updateDoc(storyDocRef, data);
      toast({ title: 'Story updated!' });
    } catch (error) {
      console.error('Error updating story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update story.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!firestore) return;
    const storyDocRef = doc(firestore, 'weekly_stories', storyId);
    try {
      await deleteDoc(storyDocRef);
      toast({ title: 'Story deleted.' });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete story.',
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Our Weekly Stories
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          A collection of our chapters, written week by week.
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Weekly Story</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">
                Create a New Story
              </DialogTitle>
            </DialogHeader>
            <StoryForm onSave={handleCreate} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
        {stories && stories.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground font-body text-lg">
            No stories yet. Let's write our first chapter!
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {stories?.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              isSubmitting={isSubmitting}
              currentUserId={user?.uid}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
