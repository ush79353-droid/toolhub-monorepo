'use client';

import Link from 'next/link';
import type { ReturnOnAssetsResult } from './types';

interface ReturnOnAssetsResultsProps {
  result: ReturnOnAssetsResult | null;
}

export function ReturnOnAssetsResults({ result }: ReturnOnAssetsResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.usedAverageAssets
              ? 'Average total assets'
              : 'Total assets'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAssetBase}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Return on assets (ROA)</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedRoa}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        ROA = (Net Income ÷ Assets) × 100
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.warningMessage}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/return-on-sales-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Return on Sales
        </Link>
        {' · '}
        <Link
          href="/tools/net-profit-margin-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Profit Margin
        </Link>
        {' · '}
        <Link
          href="/tools/total-asset-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Asset Turnover
        </Link>
        {' · '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont
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
          href="/tools/gmroi-calculator-gross-margin-return-on-investment"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GMROI
        </Link>
        .
      </p>
    </div>
  );
}
