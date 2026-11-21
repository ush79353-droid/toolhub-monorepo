'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AltmanZScoreChart } from './AltmanZScoreChart';
import type { AltmanZScoreResult } from './types';

interface AltmanZScoreResultsProps {
  result: AltmanZScoreResult | null;
}

function fmtC(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function AltmanZScoreResults({ result }: AltmanZScoreResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Altman Z-Score</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedZScore}
      </p>
      <p className="text-sm font-medium text-accent">
        Classification: {result.riskLabel}
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.riskMessage}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">WC / Total assets (X1)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedX1}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">RE / Total assets (X2)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedX2}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">EBIT / Total assets (X3)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedX3}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">MVE / Total liabilities (X4)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedX4}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Sales / Total assets (X5)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedX5}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs">
        <p className="mb-2 font-medium text-accent">Weighted contributions</p>
        <dl className="space-y-1.5">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">1.2 × X1</dt>
            <dd className="tabular-nums text-accent">
              {fmtC(result.contributions.workingCapital)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">1.4 × X2</dt>
            <dd className="tabular-nums text-accent">
              {fmtC(result.contributions.retainedEarnings)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">3.3 × X3</dt>
            <dd className="tabular-nums text-accent">
              {fmtC(result.contributions.profitability)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">0.6 × X4</dt>
            <dd className="tabular-nums text-accent">
              {fmtC(result.contributions.leverage)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">1.0 × X5</dt>
            <dd className="tabular-nums text-accent">
              {fmtC(result.contributions.assetTurnover)}
            </dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-border pt-1.5 font-semibold">
            <dt className="text-accent">Total Z-Score</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedZScore}
            </dd>
          </div>
        </dl>
      </div>

      <AltmanZScoreChart result={result} />

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <pre className="whitespace-pre-wrap font-mono text-[11px]">
            {result.formulaBreakdown}
          </pre>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Working Capital
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt-to-Equity
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
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT
        </Link>
        {' · '}
        <Link
          href="/tools/market-capitalization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Market Cap
        </Link>
        {' · '}
        <Link
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage
        </Link>
        .
      </p>
    </div>
  );
}
