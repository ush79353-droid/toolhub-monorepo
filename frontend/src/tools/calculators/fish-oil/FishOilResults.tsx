'use client';

import type { FishOilResult } from './types';

interface Props {
  result: FishOilResult | null;
}

/** Compact status strip under the calculator panels (optional summary). */
export function FishOilResults({ result }: Props) {
  if (!result?.statusHeadline) return null;

  return (
    <div
      className="rounded-xl border border-border bg-muted/15 p-3.5 text-sm text-muted-foreground"
      aria-live="polite"
    >
      <p className="font-medium text-accent">{result.statusHeadline}</p>
      {result.statusDetail ? (
        <p className="mt-1 text-xs leading-relaxed">{result.statusDetail}</p>
      ) : null}
      <p className="mt-2 text-xs">{result.disclaimer}</p>
    </div>
  );
}
