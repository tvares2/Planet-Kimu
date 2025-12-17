import LetterCard from '@/components/letter-card';

const letters = [
  {
    title: 'My Safest Place',
    content:
      "I don’t say it often enough, but you are my safest place. In a world that constantly rushes and demands, you are my quiet. With you, I don't have to be anything other than what I am. Thank you for being my harbor.",
  },
  {
    title: 'The Small Things',
    content:
      "I keep a mental scrapbook of the little things. The way you hum when you're concentrating. The slight crinkle next to your eyes when you genuinely smile. These aren't small things; they are the pixels that make up the masterpiece of you.",
  },
  {
    title: 'On Your Bad Days',
    content:
      "I know you think you have to be strong all the time, but please know you don't have to be with me. Your vulnerability is as beautiful as your strength. On your bad days, I promise to be the reminder of all your good ones.",
  },
  {
    title: 'A Thank You Note',
    content:
      'Thank you for seeing the parts of me I thought were invisible. For not just listening to my words, but understanding my silences. You’ve shown me a kindness I didn’t know I was missing.',
  },
  {
    title: 'The Future',
    content:
      "When I think about the future, it's not a grand, detailed plan. It's a feeling. It's the warmth of your hand in mine, the sound of your laughter, the comfort of knowing we're facing it together. You are my favorite future.",
  },
  {
    title: 'Just Because',
    content:
      "This is a letter for no reason at all, other than to say I'm thinking of you. Right now, in this very moment. And it makes me happy. That's all.",
  },
];

export default function LettersPage() {
  return (
    <div>
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Letters I Never Sent
        </h1>
        <p className="mt-4 font-body text-xl text-muted-foreground text-balance">
          For the words my heart wrote but my mouth couldn't say.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {letters.map((letter, index) => (
          <LetterCard key={index} letter={letter} />
        ))}
      </div>
    </div>
  );
}
