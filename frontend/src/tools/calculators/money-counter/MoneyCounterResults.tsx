'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { MoneyCounterResult } from './types';

interface MoneyCounterResultsProps {
  result: MoneyCounterResult | null;
}

export function MoneyCounterResults({ result }: MoneyCounterResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
        Enter nonnegative whole-number counts to see the cash total.
      </div>
    );
  }

  const active = result.lines.filter((l) => l.count > 0);
  if (active.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">{result.explanation}</p>
    );
  }

  return (
    <details className="rounded-xl border border-border bg-white open:shadow-sm">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent marker:content-none [&::-webkit-details-marker]:hidden">
        Breakdown ({active.length} denomination
        {active.length === 1 ? '' : 's'})
      </summary>
      <ul className="divide-y divide-border border-t border-border">
        {active.map((line) => (
          <li
            key={line.id}
            className="flex items-center justify-between gap-3 px-4 py-2 text-sm"
          >
            <span className="text-muted-foreground">
              {line.count} × {line.label}
            </span>
            <span className="tabular-nums font-medium text-accent">
              {formatCurrencyValue(line.lineTotal, result.currency)}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
