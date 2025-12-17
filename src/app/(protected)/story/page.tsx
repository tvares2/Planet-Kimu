
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HeartPulse,
  CalendarClock,
  HeartHandshake,
  BookText,
  UserCircle,
} from 'lucide-react';

const sections = [
  {
    icon: HeartPulse,
    title: 'Our Love Meter',
    content:
      "I wanted a way to tell you you're on my mind, even when we're apart. Any time you think of me, or I think of you, just press the button. It's our own little secret signal. The page will keep a count of all those little moments, showing us the thoughts we've sent and received.",
  },
  {
    icon: CalendarClock,
    title: 'Our Days Counter',
    content:
      'This is our special timeline. It counts the days since our most important moments, reminding us just how far we’ve come. From the first day we saw each other to the start of our love story, every day is a number I cherish.',
  },
  {
    icon: HeartHandshake,
    title: 'Our Lessons Learnt',
    content:
      'I believe every part of our journey helps us grow, especially the tough times. I made this shared space so we can write down what we learn from our disagreements. It’s our private board for growth, a place to turn challenges into strength, together.',
  },
  {
    icon: BookText,
    title: 'Our Weekly Stories',
    content:
      'This is our shared diary. A place where we can capture our week together—the big adventures, the quiet evenings, the funny little things. Over time, this will become the storybook of our life, written chapter by chapter, by both of us.',
  },
  {
    icon: UserCircle,
    title: 'Your Profile',
    content:
      'This is your little corner of the site. You can update your details here. Most importantly, this is how we connect our Love Meters. Just add my User ID to your "Partner ID" field, and I\'ll do the same with yours. It’s the final step to linking our hearts on here.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          About This Space I Made For You
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          I built this little world for us. It's a private space filled with
          things I hope will make you smile and celebrate our story. Here's a little tour...
        </p>
      </header>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            className="w-full rounded-lg border-border/50 bg-secondary/20 px-4 transition-colors hover:bg-secondary/40"
          >
            <AccordionItem value={`item-${index}`} className="border-b-0">
              <AccordionTrigger className="py-5 font-headline text-xl hover:no-underline">
                <div className="flex items-center gap-3">
                  <section.icon className="h-6 w-6 text-primary/80" />
                  <span>{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 font-body text-lg text-muted-foreground">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
