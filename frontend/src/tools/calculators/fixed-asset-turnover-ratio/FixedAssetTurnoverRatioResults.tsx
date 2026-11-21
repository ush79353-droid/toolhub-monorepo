'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { FixedAssetTurnoverRatioResult } from './types';

interface FixedAssetTurnoverRatioResultsProps {
  result: FixedAssetTurnoverRatioResult | null;
}

export function FixedAssetTurnoverRatioResults({
  result,
}: FixedAssetTurnoverRatioResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const isZeroAvg = result.status === 'zeroAverageFixedAssets';
  const isNegRev = result.status === 'negativeRevenue';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Fixed asset turnover summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average fixed assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageFixedAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revenue</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedRevenue}
          </dd>
        </div>
        {result.formattedFixedAssetIntensity !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Fixed asset intensity</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedFixedAssetIntensity}×
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Fixed asset turnover</dt>
          <dd
            className={`font-semibold tabular-nums ${
              isZeroAvg || isNegRev ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {result.formattedFixedAssetTurnover != null
              ? `${result.formattedFixedAssetTurnover}×`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        FAT = Revenue / Average Fixed Assets
      </p>
      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            isZeroAvg || isNegRev ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/operating-asset-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Operating Asset Turnover
        </a>
        .
      </p>
    </div>
  );
}
