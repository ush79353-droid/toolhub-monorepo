import * as React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ToolsDirectoryClient } from '@/components/tools/ToolsDirectoryClient';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'All Online Tools — Complete Utilities Directory',
  description:
    'Browse our complete library of free online tools including financial calculators, unit converters, PDF editors, image optimizers, and developer utilities.',
};

export default function ToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16">
          <Container>
            <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 h-12 w-full max-w-xl animate-pulse rounded-xl bg-muted" />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl border border-border bg-white p-5 animate-pulse"
                />
              ))}
            </div>
          </Container>
        </div>
      }
    >
      <ToolsDirectoryClient />
    </Suspense>
  );
}
