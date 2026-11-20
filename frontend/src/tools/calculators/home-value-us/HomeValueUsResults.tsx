'use client';

import type { HomeValueUsResult } from './types';
import { periodLabel } from './types';

interface HomeValueUsResultsProps {
  result: HomeValueUsResult | null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold tabular-nums text-accent">{value}</dd>
    </div>
  );
}

export function HomeValueUsResults({ result }: HomeValueUsResultsProps) {
  if (!result) return null;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">
        Home value estimate
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {result.metroLabel} · purchase {periodLabel(result.purchasePeriod)} →
        valuation {periodLabel(result.valuationPeriod)}
        {result.retrospective ? ' (retrospective)' : ''}
      </p>

      <dl className="mt-2.5 space-y-2 text-sm">
        <Row label="Purchase price" value={result.formattedPurchasePrice} />
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Estimated home value</dt>
          <dd className="text-base font-semibold tabular-nums text-accent">
            {result.formattedEstimatedValue}
          </dd>
        </div>
        <Row
          label="Nominal change"
          value={`${result.formattedNominalDollar}${
            result.formattedNominalPercent
              ? ` (${result.formattedNominalPercent})`
              : ''
          }`}
        />
        {result.formattedInflationAdjustedPurchase ? (
          <Row
            label="Purchase price in valuation-date dollars"
            value={result.formattedInflationAdjustedPurchase}
          />
        ) : (
          <p className="text-xs text-muted-foreground">
            Inflation-adjusted comparison unavailable for these periods (CPI
            observation missing).
          </p>
        )}
        {result.formattedRealDollar && result.formattedRealPercent ? (
          <Row
            label="Real change (valuation-date dollars)"
            value={`${result.formattedRealDollar} (${result.formattedRealPercent})`}
          />
        ) : null}
        <Row
          label="Purchase index"
          value={result.purchaseIndex.toFixed(4)}
        />
        <Row
          label="Valuation index"
          value={result.valuationIndex.toFixed(4)}
        />
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        Source: {result.homeIndexSource} ({result.homeIndexFredId})
        {result.cpiSource && result.cpiFredId
          ? ` · CPI: ${result.cpiSource} (${result.cpiFredId})`
          : ''}
        . This estimate applies metro-level index changes to the entered purchase
        price — it is not an appraisal of a specific home.
      </p>

      {result.staleData ? (
        <p
          className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          role="status"
        >
          Showing cached index observations because a live refresh was
          unavailable. Figures may lag the latest FRED release.
        </p>
      ) : null}
    </div>
  );
}
