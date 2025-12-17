'use client';

import { useState, useMemo } from 'react';
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
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
};

type FightLesson = {
  id: string;
  text: string;
  authorId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

function LessonForm({
  initialText,
  onSave,
  isSubmitting,
}: {
  initialText?: string;
  onSave: (text: string) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [text, setText] = useState(initialText || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSave(text);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did we learn from our last disagreement?"
        className="font-body text-lg"
        rows={4}
        disabled={isSubmitting}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting || !text.trim()}>
          {isSubmitting ? 'Saving...' : 'Save Lesson'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function LessonCard({
  lesson,
  onUpdate,
  onDelete,
  isSubmitting,
  currentUserId,
}: {
  lesson: FightLesson;
  onUpdate: (lessonId: string, text: string) => Promise<void>;
  onDelete: (lessonId: string) => Promise<void>;
  isSubmitting: boolean;
  currentUserId: string | undefined;
}) {
  const firestore = useFirestore();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const authorRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'users', lesson.authorId) : null),
    [firestore, lesson.authorId]
  );
  const { data: author, isLoading: isLoadingAuthor } =
    useDoc<UserProfile>(authorRef);

  const authorName = author?.displayName || author?.email || 'User';
  const isCurrentUserAuthor = lesson.authorId === currentUserId;

  const handleUpdate = async (text: string) => {
    await onUpdate(lesson.id, text);
    setEditDialogOpen(false);
  };

  return (
    <Card key={lesson.id} className="border-border/50 bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1 pt-1 font-body text-lg text-foreground">
            {lesson.text}
          </p>
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
                <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">
                        Edit Lesson
                      </DialogTitle>
                    </DialogHeader>
                    <LessonForm
                      initialText={lesson.text}
                      isSubmitting={isSubmitting}
                      onSave={handleUpdate}
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
                        delete this lesson.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(lesson.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-3 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {isLoadingAuthor
                ? '?'
                : (authorName || '?').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {isLoadingAuthor ? '...' : authorName}
          </span>
          <span>
            {lesson.createdAt
              ? `· ${formatDistanceToNow(
                  new Date(lesson.createdAt.seconds * 1000)
                )} ago`
              : '· Just now'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LessonsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [newLesson, setNewLesson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lessonsRef = useMemoFirebase(
    () => firestore && collection(firestore, 'fight_lessons'),
    [firestore]
  );

  const lessonsQuery = useMemoFirebase(
    () => lessonsRef && query(lessonsRef, orderBy('createdAt', 'desc')),
    [lessonsRef]
  );

  const { data: lessons, isLoading } = useCollection<FightLesson>(lessonsQuery);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newLesson.trim() || !lessonsRef) return;

    setIsSubmitting(true);
    try {
      await addDoc(lessonsRef, {
        text: newLesson,
        authorId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewLesson('');
      toast({ title: 'Lesson added!' });
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add lesson.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (lessonId: string, text: string) => {
    if (!firestore) return;
    setIsSubmitting(true);
    const lessonDocRef = doc(firestore, 'fight_lessons', lessonId);
    try {
      await updateDoc(lessonDocRef, { text });
      toast({ title: 'Lesson updated!' });
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update lesson.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!firestore) return;
    const lessonDocRef = doc(firestore, 'fight_lessons', lessonId);
    try {
      await deleteDoc(lessonDocRef);
      toast({ title: 'Lesson deleted.' });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete lesson.',
      });
    }
  };

  const groupedLessons = useMemo(() => {
    if (!lessons) return {};
    return lessons.reduce((acc, lesson) => {
      const month = lesson.createdAt
        ? format(new Date(lesson.createdAt.seconds * 1000), 'MMMM yyyy')
        : 'Unknown Date';
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(lesson);
      return acc;
    }, {} as Record<string, FightLesson[]>);
  }, [lessons]);

  const sortedMonths = useMemo(() => {
    return Object.keys(groupedLessons).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  }, [groupedLessons]);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Lessons Learnt
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          A shared board for our growth. Because every bump in the road is a
          chance to get better, together.
        </p>
      </header>

      <Card className="mb-8 border-border/50 bg-secondary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Add a New Lesson
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Textarea
              value={newLesson}
              onChange={(e) => setNewLesson(e.target.value)}
              placeholder="What did we learn from our last disagreement?"
              className="font-body text-lg"
              rows={3}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !newLesson.trim()}>
              {isSubmitting ? 'Adding...' : 'Add Lesson'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-12">
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {lessons && lessons.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground">
            No lessons yet. Let's add our first one!
          </p>
        )}
        {sortedMonths.map((month) => (
          <div key={month}>
            <h2 className="mb-6 font-headline text-3xl font-bold text-foreground">
              {month}
            </h2>
            <div className="space-y-6">
              {groupedLessons[month].map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  isSubmitting={isSubmitting}
                  currentUserId={user?.uid}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
