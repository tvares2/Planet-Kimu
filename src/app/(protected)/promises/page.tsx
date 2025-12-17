import { CheckCircle2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const promises = [
  {
    text: 'I’ll listen, even when I don’t understand.',
    tooltip: 'Your feelings are valid, always. I will hear you out before I try to solve.',
  },
  {
    text: 'I won’t leave when things get hard.',
    tooltip: 'Hardship is a part of life, but it won\'t be the end of us. I\'m here to stay.',
  },
  {
    text: 'I’ll be your biggest fan.',
    tooltip: 'In everything you do, I will be there cheering you on, celebrating your wins, and lifting you up from your losses.',
  },
  {
    text: 'I will always make time for you.',
    tooltip: 'You are not an option or a convenience. You are my priority.',
  },
  {
    text: 'I’ll choose to love you, every single day.',
    tooltip: 'Love is not just a feeling, it\'s a conscious choice. And I choose you, again and again.',
  },
  {
    text: 'I promise to be a safe space for your thoughts.',
    tooltip: 'Your fears, your dreams, your random musings - they all have a home with me, judgment-free.',
  },
];

export default function PromisesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Promises
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          Not as rules, but as reminders of my commitment.
        </p>
      </header>

      <TooltipProvider>
        <ul className="space-y-6">
          {promises.map((promise, index) => (
            <li key={index}>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <div className="flex cursor-default items-start gap-4 rounded-lg p-4 transition-colors hover:bg-secondary/30">
                    <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <span className="font-body text-xl text-foreground">
                      {promise.text}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="max-w-xs font-body text-center">{promise.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </TooltipProvider>
    </div>
  );
}
