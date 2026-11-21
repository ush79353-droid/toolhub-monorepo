'use client';

import type { SwpResult } from './types';

interface SwpResultsProps {
  result: SwpResult | null;
}

export function SwpResults({ result }: SwpResultsProps) {
  if (!result) return null;

  const rows: { label: string; value: string }[] = [
    { label: 'Opening balance', value: result.formattedOpening },
    {
      label: `${result.frequencyLabel} withdrawal`,
      value: result.formattedWithdrawal,
    },
    { label: 'Total withdrawal', value: result.formattedTotalWithdrawal },
    { label: 'Total return', value: result.formattedTotalReturn },
    {
      label: 'Number of withdrawals',
      value: String(result.numberOfWithdrawals),
    },
    { label: 'Last withdrawal on', value: result.lastWithdrawalDate },
  ];

  if (result.mode === 'final' || result.endingBalance !== 0) {
    rows.push({ label: 'Ending balance', value: result.formattedEnding });
  }
  if (result.mode === 'rate') {
    rows.push({
      label: 'Required annual return',
      value: `${result.annualReturnPercent.toFixed(2)}%`,
    });
  }

  return (
    <div
      id="swp-results"
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-sm leading-relaxed text-foreground/90">
        {result.summaryMessage}
      </p>
      <dl className="space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="tabular-nums font-medium text-accent">{row.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
        {result.assumptionNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
