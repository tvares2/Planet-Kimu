'use client';

import { useMemo, useState } from 'react';
import {
  startOfToday,
  startOfMonth,
  startOfYear,
  isAfter,
  format,
  subDays,
  startOfWeek,
} from 'date-fns';
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  useDoc,
} from '@/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  doc,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Gift, Zap } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

type LoveMeterClick = {
  id: string;
  userId: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
};

type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  partnerId?: string;
};

const chartConfig = {
  Clicks: {
    label: 'Clicks',
    color: 'hsl(var(--primary))',
  },
  Received: {
    label: 'Received',
    color: 'hsl(var(--accent))',
  },
};

type ClickStats = {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  peakDay: { date: string; count: number };
};

function StatsDisplay({
  title,
  stats,
  isLoading,
  Icon,
  iconColor,
}: {
  title: string;
  stats: ClickStats;
  isLoading: boolean;
  Icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div>
      <h2 className="mb-4 flex items-center justify-center gap-2 text-center font-headline text-3xl font-bold text-foreground">
        <Icon className={`h-8 w-8 ${iconColor}`} />
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="text-center bg-secondary/20 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg text-muted-foreground">
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="mx-auto h-12 w-20" />
            ) : (
              <p className="font-headline text-5xl font-bold text-primary">
                {stats.today}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="text-center bg-secondary/20 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg text-muted-foreground">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="mx-auto h-12 w-20" />
            ) : (
              <p className="font-headline text-5xl font-bold text-primary">
                {stats.thisWeek}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="text-center bg-secondary/20 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="mx-auto h-12 w-20" />
            ) : (
              <p className="font-headline text-5xl font-bold text-primary">
                {stats.thisMonth}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="text-center bg-secondary/20 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg text-muted-foreground">
              This Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="mx-auto h-12 w-20" />
            ) : (
              <p className="font-headline text-5xl font-bold text-primary">
                {stats.thisYear}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4 text-center bg-secondary/20 border-border/50">
        <CardHeader className="flex-row items-center justify-center gap-2 pb-2">
          <Zap className="h-6 w-6 text-amber-400" />
          <CardTitle className="font-headline text-lg text-muted-foreground">
            Peak Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="mx-auto h-12 w-40" />
          ) : (
            <>
              <p className="font-headline text-4xl font-bold text-primary">
                {stats.peakDay.count}
                <span className="ml-2 font-body text-xl text-foreground">
                  clicks
                </span>
              </p>
              <p className="mt-1 font-body text-base text-muted-foreground">
                on {stats.peakDay.date}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard({
  title,
  data,
  dataKey,
  fill,
  isLoading,
}: {
  title: string;
  data: any[];
  dataKey: string;
  fill: string;
  isLoading: boolean;
}) {
  return (
    <Card className="bg-secondary/20 border-border/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={data}>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey={dataKey} fill={fill} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const processClicks = (
  clicks: LoveMeterClick[] | null,
  presentationDate: Date
): ClickStats => {
  const stats: ClickStats = {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    peakDay: { date: 'N/A', count: 0 },
  };

  if (!clicks) {
    return stats;
  }

  const today = startOfToday();
  const week = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const month = startOfMonth(today);
  const year = startOfYear(today);
  const dailyCounts: Record<string, number> = {};

  clicks.forEach((click) => {
    if (click.timestamp) {
      const clickDate = new Date(click.timestamp.seconds * 1000);

      // Client-side filtering
      if (isAfter(clickDate, presentationDate)) {
        const dayStr = format(clickDate, 'yyyy-MM-dd');

        if (isAfter(clickDate, today)) stats.today++;
        if (isAfter(clickDate, week)) stats.thisWeek++;
        if (isAfter(clickDate, month)) stats.thisMonth++;
        if (isAfter(clickDate, year)) stats.thisYear++;

        dailyCounts[dayStr] = (dailyCounts[dayStr] || 0) + 1;
      }
    }
  });

  let peakCount = 0;
  let peakDateStr = '';
  for (const [date, count] of Object.entries(dailyCounts)) {
    if (count > peakCount) {
      peakCount = count;
      peakDateStr = date;
    }
  }

  if (peakDateStr) {
    stats.peakDay = {
      date: format(new Date(peakDateStr), 'MMM d, yyyy'),
      count: peakCount,
    };
  }

  return stats;
};

const processChartData = (
  clicks: LoveMeterClick[] | null,
  dataKey: string
) => {
  if (!clicks) return [];
  const today = startOfToday();
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    subDays(today, i)
  ).reverse();

  return last7Days.map((day) => {
    const dayString = format(day, 'MMM d');
    const dayClicks = clicks.filter((click) => {
      if (!click.timestamp) return false;
      const clickDate = new Date(click.timestamp.seconds * 1000);
      return format(clickDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }).length;

    return { date: dayString, [dataKey]: dayClicks };
  });
};

export default function LoveMeterPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This is the date from which we'll start counting.
  const presentationDate = useMemo(
    () => new Date('2024-01-01T00:00:00Z'),
    []
  );

  const userProfileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);
  const partnerId = userProfile?.partnerId;

  const partnerProfileRef = useMemoFirebase(
    () => (firestore && partnerId ? doc(firestore, 'users', partnerId) : null),
    [firestore, partnerId]
  );
  const { data: partnerProfile } = useDoc<UserProfile>(partnerProfileRef);

  const clicksRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'loveMeterClicks') : null),
    [firestore]
  );

  // Modified query to only get clicks for the specific user
  const sentClicksQuery = useMemoFirebase(
    () =>
      clicksRef && user
        ? query(clicksRef, where('userId', '==', user.uid))
        : null,
    [clicksRef, user]
  );

  const receivedClicksQuery = useMemoFirebase(
    () =>
      clicksRef && partnerId
        ? query(clicksRef, where('userId', '==', partnerId))
        : null,
    [clicksRef, partnerId]
  );

  const { data: sentClicks, isLoading: isLoadingSent } =
    useCollection<LoveMeterClick>(sentClicksQuery);
  const { data: receivedClicks, isLoading: isLoadingReceived } =
    useCollection<LoveMeterClick>(receivedClicksQuery);

  const handleButtonClick = async () => {
    if (!user || !clicksRef) return;
    setIsSubmitting(true);
    try {
      await addDoc(clicksRef, {
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error logging click:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sentStats = useMemo(
    () => processClicks(sentClicks, presentationDate),
    [sentClicks, presentationDate]
  );
  const receivedStats = useMemo(
    () => processClicks(receivedClicks, presentationDate),
    [receivedClicks, presentationDate]
  );

  const sentChartData = useMemo(
    () => processChartData(sentClicks, 'Clicks'),
    [sentClicks]
  );
  const receivedChartData = useMemo(
    () => processChartData(receivedClicks, 'Received'),
    [receivedClicks]
  );

  const partnerName = partnerProfile?.displayName || 'Your Partner';

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          The Love Meter
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          A little counter for every time you cross my mind, and every time I
          cross yours.
        </p>
      </header>

      <div className="mb-12 flex justify-center">
        <Button
          size="lg"
          onClick={handleButtonClick}
          disabled={isSubmitting}
          className="animate-glow h-20 rounded-full px-12 font-headline text-2xl transition-transform hover:scale-105"
        >
          <HeartPulse className="mr-4 h-8 w-8" />
          I'm Thinking of You
        </Button>
      </div>

      <div className="space-y-16">
        <div className="space-y-8">
          <StatsDisplay
            title="Thoughts Sent"
            stats={sentStats}
            isLoading={isLoadingSent}
            Icon={HeartPulse}
            iconColor="text-primary"
          />
          <Dashboard
            title="Your Weekly Dashboard"
            data={sentChartData}
            dataKey="Clicks"
            fill="hsl(var(--primary))"
            isLoading={isLoadingSent}
          />
        </div>

        {partnerId ? (
          <div className="space-y-8">
            <StatsDisplay
              title={`${partnerName}'s Thoughts`}
              stats={receivedStats}
              isLoading={isLoadingReceived}
              Icon={Gift}
              iconColor="text-accent"
            />
            <Dashboard
              title={`${partnerName}'s Weekly Dashboard`}
              data={receivedChartData}
              dataKey="Received"
              fill="hsl(var(--accent))"
              isLoading={isLoadingReceived}
            />
          </div>
        ) : (
          <Card className="text-center bg-secondary/20 border-border/50 p-8">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-foreground">
                Connect with your partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-lg text-muted-foreground">
                To see the thoughts they send you, go to your profile, and
                enter their User ID in the "Partner ID" field. They must do the
                same with your ID.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
