import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { SearchX, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <Container className="max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary text-primary shadow-xs">
          <SearchX className="h-10 w-10" />
        </div>

        <span className="mt-6 inline-block rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Error 404
        </span>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The tool or page you are trying to access doesn&apos;t exist, has been renamed, or is currently in development.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="default" className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))]">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="default">
            <Link href="/tools" className="inline-flex items-center gap-1.5">
              <span>Browse All Tools</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}

