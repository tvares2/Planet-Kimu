import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const confessions = [
  {
    title: "I'm scared of losing you.",
    content:
      "It's a vulnerability I don't often show, but the thought of a world without you in it is my greatest fear. You've become so integral to my happiness.",
  },
  {
    title: 'I re-read our old messages sometimes.',
    content:
      "When I'm having a tough day, I go back and read our early conversations. It's like a shot of pure happiness, reminding me of the magic right from the start.",
  },
  {
    title: "I notice the little things more than you think.",
    content:
      "The way you tuck your hair behind your ear, the specific way you laugh at a bad joke... I collect these moments like treasures.",
  },
  {
    title: "Sometimes, I'm not sure if I'm good enough for you.",
    content:
      "You shine so brightly that sometimes I feel like I'm standing in your shadow. It's a feeling that pushes me to be a better person every day.",
  },
  {
    title: 'You changed my definition of home.',
    content:
      'Home used to be a place. A set of walls. Now, it’s just wherever you are. It’s the feeling of peace I get just by being near you.',
  },
];

export default function ConfessionsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Things I Want to Tell You
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          The quiet thoughts I've kept in my heart.
        </p>
      </header>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {confessions.map((confession, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-lg border-border/50 bg-secondary/20 px-4 transition-colors hover:bg-secondary/40"
          >
            <AccordionTrigger className="font-headline text-xl hover:no-underline">
              {confession.title}
            </AccordionTrigger>
            <AccordionContent className="pt-2 font-body text-lg text-muted-foreground">
              {confession.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
