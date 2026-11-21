'use client';

import Link from 'next/link';
import type { RoicResult } from './types';

interface RoicResultsProps {
  result: RoicResult | null;
}

export function RoicResults({ result }: RoicResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">NOPAT</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNopat}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.usedAverageCapital
              ? 'Average invested capital'
              : 'Invested capital'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInvestedCapital}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">ROIC</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedRoic}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        ROIC = NOPAT ÷ Invested Capital × 100
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/return-on-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROE
        </Link>
        {' · '}
        <Link
          href="/tools/return-on-assets-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROA
        </Link>
        {' · '}
        <Link
          href="/tools/return-on-capital-employed-calculator-roce"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROCE
        </Link>
        {' · '}
        <Link
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT
        </Link>
        {' · '}
        <Link
          href="/tools/economic-value-added-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EVA
        </Link>
        {' · '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont
        </Link>
        .
      </p>
    </div>
  );
}
