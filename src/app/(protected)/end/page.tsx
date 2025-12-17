export default function EndPage() {
  return (
    <div className="flex h-full min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <div className="max-w-3xl">
        <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl md:text-6xl text-balance">
          This website doesn’t end here.
        </h1>
        <p className="mt-6 font-body text-2xl text-primary sm:text-3xl md:text-4xl text-balance">
          Neither do we.
        </p>
      </div>

      <footer className="absolute bottom-8 text-center text-sm text-muted-foreground">
        <p>Made with love, not logic.</p>
        <p>October 2024</p>
        <p>By You-Know-Who</p>
      </footer>
    </div>
  );
}
