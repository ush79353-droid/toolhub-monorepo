'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import { areaUnitLabel } from './calculation';
import type { PricePerSqftResult } from './types';

interface PricePerSqftResultsProps {
  result: PricePerSqftResult | null;
}

export function PricePerSqftResults({ result }: PricePerSqftResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const areaLabel = areaUnitLabel(result.areaUnit);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">Result</h3>
      <dl className="mt-2.5 space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">
            {result.areaUnit === 'm2' ? 'Price per m²' : 'Price per sqft'}
          </dt>
          <dd className="text-base font-semibold tabular-nums text-accent">
            {result.formattedPricePerArea} {result.pricePerAreaUnitLabel}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">
            {result.pricingContext === 'rent' ? 'Rent' : 'Property price'}
          </dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedPrice}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Area</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedArea} {areaLabel}
          </dd>
        </div>

        {result.secondEnabled &&
        result.formattedSecondPricePerArea !== null ? (
          <>
            <div className="border-t border-border pt-2" />
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Property B unit price</dt>
              <dd className="font-semibold tabular-nums text-accent">
                {result.formattedSecondPricePerArea}{' '}
                {result.secondPricePerAreaUnitLabel}
              </dd>
            </div>
            {result.formattedAbsoluteDifference !== null ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">
                  Difference (B − A, in A&apos;s unit)
                </dt>
                <dd className="font-semibold tabular-nums text-accent">
                  {result.formattedAbsoluteDifference} {symbol}/{areaLabel}
                </dd>
              </div>
            ) : null}
            {result.formattedPercentageDifference !== null ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">
                  Relative difference vs property A
                </dt>
                <dd className="font-semibold tabular-nums text-accent">
                  {result.formattedPercentageDifference}%
                </dd>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Relative percentage difference is unavailable when property
                A&apos;s unit price is zero.
              </p>
            )}
            {result.cheaperLabel ? (
              <p className="text-xs text-muted-foreground">{result.cheaperLabel}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
 Comparison is price-per-area only; not a full investment
              recommendation.
            </p>
          </>
        ) : null}
      </dl>
    </div>
  );
}
