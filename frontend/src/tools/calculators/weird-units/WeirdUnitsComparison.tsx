'use client';

import { comparisonRatio, formatWeird } from './calculation';
import type { WeirdUnitDef } from './types';

interface WeirdUnitsComparisonProps {
  weirdCount: number;
  weird: WeirdUnitDef;
  sentence: string;
}

export function WeirdUnitsComparison({ weirdCount, weird, sentence }: WeirdUnitsComparisonProps) {
  const ratio = comparisonRatio(weirdCount);
  const percent = Math.round(ratio * 100);

  return (
    <div
      className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
      aria-label="Illustrative comparison"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Visual comparison
      </p>
      <p className="mt-1 text-sm text-accent" aria-live="polite">
        {sentence}
      </p>

      <div className="mt-4 space-y-2">
        <div className="flex items-end gap-3">
          <div
            className="w-10 rounded-md bg-primary/80"
            style={{ height: `${Math.max(12, percent)}px` }}
            role="img"
            aria-label={`Illustrative bar for about ${formatWeird(weirdCount)} ${weird.label}`}
          />
          <div className="min-w-0 flex-1 space-y-1.5 pb-1">
            <div className="h-2.5 overflow-hidden rounded-full bg-border/70">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Illustrative scale only — not a physically exact diagram. One full bar would mean many
              times the selected reference stacked together.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {weird.description}
        {weird.approximate ? ' Marked approximate because real-world examples vary.' : ''}
        {weird.sourceNote ? ` ${weird.sourceNote}` : ''}
      </p>
    </div>
  );
}
