'use client';

import Link from 'next/link';
import type { NavResult } from './types';

interface NavResultsProps {
  result: NavResult | null;
}

export function NavResults({ result }: NavResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fund assets</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFundAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fund liabilities</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFundLiabilities}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net asset value</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedNetAssetValue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">NAV per share</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNavPerShare ?? '—'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        NAV = FA − FL · NAV/share = NAV ÷ N
      </p>

      {result.sharesWarning ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.sharesWarning}
        </p>
      ) : null}

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/market-capitalization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Market Cap
        </Link>
        {' · '}
        <Link
          href="/tools/enterprise-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Enterprise Value
        </Link>
        {' · '}
        <Link
          href="/tools/intrinsic-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Intrinsic Value
        </Link>
        {' · '}
        <Link
          href="/tools/earnings-per-share-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EPS
        </Link>
        {' · '}
        <Link
          href="/tools/ebitda-multiple-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA Multiple
        </Link>
        {' · '}
        <Link
          href="/tools/stock-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Stock
        </Link>
        .
      </p>
    </div>
  );
}
