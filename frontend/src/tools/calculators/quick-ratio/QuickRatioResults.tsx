'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { QuickRatioResult } from './types';

interface QuickRatioResultsProps {
  result: QuickRatioResult | null;
}

export function QuickRatioResults({ result }: QuickRatioResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const qa = result.quickAssets;
  const cl = result.currentLiabilities;
  const max = Math.max(qa, cl, 1);
  const qaPct = (qa / max) * 100;
  const clPct = (cl / max) * 100;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Quick Ratio</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedQuickRatio}
      </p>

      <dl className="space-y-2 text-sm">
        {result.method === 'direct' && result.solveTarget !== 'requiredQuickAssets' ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Cash and cash equivalents</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedCash}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Marketable securities</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedSecurities}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Accounts receivable</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedReceivables}
              </dd>
            </div>
          </>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total quick assets</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedQuickAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Current liabilities</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLiabilities}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Quick ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedQuickRatio}
          </dd>
        </div>
      </dl>

      <div
        className="space-y-2 rounded-lg border border-border bg-white px-3 py-2"
        role="img"
        aria-label="Quick assets versus current liabilities comparison"
      >
        <div className="text-[11px] text-muted-foreground">Quick assets</div>
        <div className="h-2.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full bg-emerald-500/80"
            style={{ width: `${qaPct}%` }}
          />
        </div>
        <div className="text-[11px] text-muted-foreground">
          Current liabilities
        </div>
        <div className="h-2.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full bg-rose-500/80"
            style={{ width: `${clPct}%` }}
          />
        </div>
      </div>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs text-muted-foreground">
        Band:{' '}
        {result.band === 'below'
          ? 'Below 1.00 — quick assets less than current liabilities'
          : result.band === 'equal'
            ? 'Exactly 1.00 — quick assets equal current liabilities'
            : 'Above 1.00 — quick assets exceed current liabilities'}
        . Industry context still matters.
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
          href="/tools/cash-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Ratio
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
          href="/tools/defensive-interval-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Defensive Interval
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-asset-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Asset
        </Link>
        {' · '}
        <Link
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage
        </Link>
      </p>
    </div>
  );
}
