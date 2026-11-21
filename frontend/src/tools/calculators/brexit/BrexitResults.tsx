'use client';

import { formatCount } from './calculation';
import type { BrexitResult } from './types';
import { GROUP_LABELS, type OpportunityGroup } from './constants';

interface BrexitResultsProps {
  result: BrexitResult | null;
}

const GROUP_ORDER: OpportunityGroup[] = [
  'build',
  'fund',
  'recycle',
  'buy',
  'hire',
];

export function BrexitResults({ result }: BrexitResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
        Enter valid inputs to see illustrative opportunity-cost comparisons.
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-label="Opportunity cost comparisons">
      <div>
        <h3 className="text-[15px] font-semibold text-accent">
          How would we use the money instead?
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Counts = floor(cost so far ÷ unit cost). Satirical rows are labelled as
          such — educational illustration only.
        </p>
      </div>

      {GROUP_ORDER.map((group) => {
        const items = result.opportunities.filter(
          (o) => o.group === GROUP_LABELS[group]
        );
        if (items.length === 0) return null;
        return (
          <div key={group} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {GROUP_LABELS[group]}
            </p>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 bg-white px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-accent">
                      {item.label}
                    </p>
                    {item.id === 'rubbishTonnes' &&
                    result.franceRubbishEquiv != null ? (
                      <p className="text-[11px] text-muted-foreground">
                        Roughly{' '}
                        {result.franceRubbishEquiv.toLocaleString('en-GB', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        × the area of France at 1&nbsp;m depth (illustrative).
                      </p>
                    ) : null}
                    {item.note ? (
                      <p className="text-[11px] italic text-muted-foreground">
                        {item.note}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-accent">
                    {formatCount(item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {result.sourceSummary}
      </p>
    </section>
  );
}
