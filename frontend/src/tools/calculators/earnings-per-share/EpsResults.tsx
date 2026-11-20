'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { EpsInput, EpsResult } from './types';
import { formatEpsMoney } from './calculation';

interface EpsResultsProps {
  input: EpsInput;
  result: EpsResult | null;
}

export function EpsResults({ input, result }: EpsResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const ni = Number(input.netIncome.replace(/,/g, ''));
  const pref = Number(input.preferredDividends.replace(/,/g, ''));

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Earnings per share</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Basic EPS for the period (not diluted).
      </p>

      <div className="rounded-lg border border-border bg-white px-3 py-3">
        <p className="text-xs text-muted-foreground">Earnings per share (EPS)</p>
        <p
          className="mt-1 text-2xl font-semibold tabular-nums text-accent"
          aria-label={`Earnings per share ${result.formattedEps} per share`}
        >
          {result.formattedEps}
          <span className="ml-1 text-sm font-medium text-muted-foreground">
            /share
          </span>
        </p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-left text-xs font-medium text-accent"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>Calculation breakdown</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <dl className="space-y-2 rounded-lg border border-border bg-white px-3 py-3 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Net income</dt>
            <dd className="tabular-nums font-medium text-accent">
              {Number.isFinite(ni)
                ? `${symbol}${formatEpsMoney(ni, result.currency)}`
                : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Preferred dividends</dt>
            <dd className="tabular-nums font-medium text-accent">
              {Number.isFinite(pref)
                ? `${symbol}${formatEpsMoney(pref, result.currency)}`
                : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Earnings available to common
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedEarningsAvailable}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Weighted-average shares</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedShares}
            </dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-border pt-2">
            <dt className="font-medium text-accent">EPS</dt>
            <dd className="tabular-nums font-semibold text-accent">
              {result.formattedEps}/share
            </dd>
          </div>
        </dl>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        EPS = (NI − Preferred dividends) ÷ Weighted-average common shares
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/net-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Income
        </Link>
        {' · '}
        <Link
          href="/tools/dividend-payout-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Payout Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/dividend-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Yield
        </Link>
        {' · '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont Analysis
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
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA
        </Link>
        {' · '}
        <Link
          href="/tools/roi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROI
        </Link>
        .
      </p>
    </div>
  );
}
