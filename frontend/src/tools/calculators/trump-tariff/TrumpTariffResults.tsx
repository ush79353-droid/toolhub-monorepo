'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { TrumpTariffChart } from './TrumpTariffChart';
import type { TrumpTariffResult } from './types';

interface TrumpTariffResultsProps {
  result: TrumpTariffResult | null;
}

export function TrumpTariffResults({ result }: TrumpTariffResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const fmt = (n: number) => formatCurrencyValue(n, result.currency);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Estimated Import Tariff
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedTotalTariff}
      </p>
      <p className="text-[11px] text-muted-foreground">{result.scenarioLabel}</p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total customs value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCustomsValue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Base import duty</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBaseDuty}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Additional duties</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAdditionalDuty}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Combined effective rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCombinedRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tariff-inclusive value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTariffInclusive}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Estimated landed cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLanded}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Landed cost per unit</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPerUnit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost increase (duties / value)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCostIncrease}
          </dd>
        </div>
        {result.newRetailPrice != null &&
        result.consumerPriceIncrease != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Pass-through price rise</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.consumerPriceIncrease)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Estimated new retail</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.newRetailPrice)}
              </dd>
            </div>
          </>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Interpretation: </span>
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <TrumpTariffChart result={result} />

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
          href="/tools/gst-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GST
        </Link>
        {' · '}
        <Link
          href="/tools/vat-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          VAT
        </Link>
        {' · '}
        <Link
          href="/tools/buying-power-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Buying Power
        </Link>
        {' · '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
        </Link>
        {' · '}
        <Link
          href="/tools/margin-and-markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Margin & Markup
        </Link>
        {' · '}
        <Link
          href="/tools/net-profit-margin-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Profit Margin
        </Link>
        .
      </p>
    </div>
  );
}
