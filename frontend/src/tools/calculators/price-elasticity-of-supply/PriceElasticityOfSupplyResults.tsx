'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PesChart } from './PesChart';
import { formatMoney, formatQuantity } from './calculation';
import type { PriceElasticityOfSupplyResult } from './types';

interface Props {
  result: PriceElasticityOfSupplyResult | null;
}

export function PriceElasticityOfSupplyResults({ result }: Props) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Result · {result.methodLabel}
      </h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price elasticity of supply</dt>
          <dd className="text-2xl font-semibold tabular-nums text-accent">
            {result.formattedPes}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Classification</dt>
          <dd className="text-right font-medium text-accent">
            {result.classificationLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price change</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedPercentPrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Quantity supplied change</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedPercentQuantity}
          </dd>
        </div>
        {result.p1 != null && result.p2 != null ? (
          <div className="flex justify-between gap-2 text-xs">
            <dt className="text-muted-foreground">Prices</dt>
            <dd className="tabular-nums text-muted-foreground">
              {formatMoney(result.p1, result.currency)} →{' '}
              {formatMoney(result.p2, result.currency)}
            </dd>
          </div>
        ) : null}
        {result.q1 != null && result.q2 != null ? (
          <div className="flex justify-between gap-2 text-xs">
            <dt className="text-muted-foreground">Quantities supplied</dt>
            <dd className="tabular-nums text-muted-foreground">
              {formatQuantity(result.q1)} → {formatQuantity(result.q2)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        {result.warningMessage ? (
          <p className="mt-1 text-xs leading-relaxed text-rose-600">
            {result.warningMessage}
          </p>
        ) : null}
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          PES has no currency or percent unit. Two observations do not identify
          an entire supply curve.
        </p>
      </div>

      {result.p1 != null ? <PesChart result={result} /> : null}

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your result is calculated'
          : 'How your result is calculated'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          {result.steps.length ? (
            <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/price-elasticity-of-demand-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PED
        </Link>
        {' · '}
        <Link
          href="/tools/cross-price-elasticity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cross-price
        </Link>
        {' · '}
        <Link
          href="/tools/income-elasticity-of-demand-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Income elasticity
        </Link>
        {' · '}
        <Link
          href="/tools/comparative-advantage-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Comparative advantage
        </Link>
        .
      </p>
    </div>
  );
}
