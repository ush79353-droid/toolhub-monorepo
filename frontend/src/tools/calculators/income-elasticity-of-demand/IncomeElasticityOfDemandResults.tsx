'use client';

import Link from 'next/link';

import type { IncomeElasticityOfDemandResult } from './types';

interface IncomeElasticityOfDemandResultsProps {
  result: IncomeElasticityOfDemandResult | null;
}

const CLASSIFICATION_LABEL: Record<string, string> = {
  inferior: 'Inferior good',
  zeroElasticity: 'Zero income elasticity',
  normalNecessity: 'Normal necessity-type good',
  unitIncomeElasticity: 'Unit income elasticity',
  incomeElasticNormal: 'Income-elastic normal good',
  unknown: '—',
};

export function IncomeElasticityOfDemandResults({
  result,
}: IncomeElasticityOfDemandResultsProps) {
  if (!result) return null;
  const blocked =
    result.status === 'zeroIncomeChange' || result.status === 'indeterminate';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Income elasticity summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Method</dt>
          <dd className="text-accent">
            {result.method === 'midpoint' ? 'Midpoint' : 'Standard'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Change in income</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedIncomePercentageChange}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Change in quantity</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedQuantityPercentageChange}%
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Income elasticity (YED)</dt>
          <dd
            className={`font-semibold tabular-nums ${
              blocked ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {result.formattedIncomeElasticity ?? 'Unavailable'}
          </dd>
        </div>
        {!blocked ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Classification</dt>
            <dd className="text-right text-accent">
              {CLASSIFICATION_LABEL[result.classification] ?? '—'}
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        YED = %ΔQd / %ΔY
      </p>
      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            blocked ? 'text-rose-700' : 'text-amber-800'
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
        <Link
          href="/tools/cross-price-elasticity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cross Price Elasticity
        </Link>
        .
      </p>
    </div>
  );
}
