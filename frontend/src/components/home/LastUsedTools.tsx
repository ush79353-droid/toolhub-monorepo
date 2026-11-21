'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { readRecentTools, type RecentTool } from '@/lib/recent-tools';

export function LastUsedTools() {
  const [tools, setTools] = React.useState<RecentTool[] | null>(null);

  React.useEffect(() => {
    setTools(readRecentTools());
  }, []);

  if (!tools || tools.length === 0) return null;

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-white p-3 shadow-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:px-4">
      <p className="inline-flex items-center gap-2 px-1 text-sm font-semibold text-accent">
        <Heart className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
        Last used calculators
      </p>
      {tools.map((tool) => (
        <Link
          key={tool.slug}
          href={`/tools/${tool.slug}`}
          className="inline-flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary sm:max-w-xs"
        >
          <span className="truncate">{tool.name}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
