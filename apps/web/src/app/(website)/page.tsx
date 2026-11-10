export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-xl rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-accent">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Foundation Initialized
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Mega Tools — Development Environment Ready
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Architecture foundation established: Next.js App Router, Express API backend, strict
          TypeScript monorepo, and locked design system.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-md border border-border bg-background px-2.5 py-1 font-mono">
            Web: Port 3000
          </span>
          <span className="rounded-md border border-border bg-background px-2.5 py-1 font-mono">
            API: Port 5001
          </span>
          <span className="rounded-md border border-border bg-background px-2.5 py-1 font-mono">
            DB: MongoDB
          </span>
        </div>
      </div>
    </main>
  );
}

