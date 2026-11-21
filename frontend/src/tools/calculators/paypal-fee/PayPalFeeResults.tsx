'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PayPalFeeResult } from './types';

interface PayPalFeeResultsProps {
  result: PayPalFeeResult | null;
}

export function PayPalFeeResults({ result }: PayPalFeeResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">PayPal Fee Breakdown</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedTotalFee}
      </p>
      <p className="text-xs text-muted-foreground">
        Net received{' '}
        <span className="font-medium text-accent">{result.formattedNet}</span>
        {result.effectiveFeePercentage != null ? (
          <>
            {' '}
            · effective rate{' '}
            <span className="font-medium text-accent">
              {result.formattedEffectiveRate}
            </span>
          </>
        ) : null}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gross payment</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedGross}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Percentage fee ({result.formattedPercentageRate})
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPercentageFeeAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Additional fee ({result.formattedAdditionalRate})
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAdditionalFeeAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fixed fee</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFixedFeeAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total PayPal fee</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalFee}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net received</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNet}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Schedule: {result.scheduleLabel}
        {result.scheduleEffectiveDate
          ? ` · effective ${result.scheduleEffectiveDate}`
          : ''}
        {result.verified ? ' · verified preset' : ' · custom estimate'}
        {result.scheduleSourceUrl ? (
          <>
            {' '}
            ·{' '}
            <a
              href={result.scheduleSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Official fee source
            </a>
          </>
        ) : null}
        . {result.explanation}
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

      <button
        type="button"
        onClick={() => setShowCompare((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showCompare ? 'Hide fee comparison' : 'Show fee comparison'}
      </button>
      {showCompare && result.comparison.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[240px] text-left text-xs">
            <thead>
              <tr className="border-b border-border text-accent">
                <th className="px-3 py-2 font-semibold">Payment</th>
                <th className="px-3 py-2 font-semibold">Fee</th>
                <th className="px-3 py-2 font-semibold">Net</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.map((row) => (
                <tr key={row.gross} className="border-b border-border/50">
                  <td className="px-3 py-1.5 tabular-nums">{row.formattedGross}</td>
                  <td className="px-3 py-1.5 tabular-nums">{row.formattedFee}</td>
                  <td className="px-3 py-1.5 tabular-nums">{row.formattedNet}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-3 py-2 text-[11px] text-muted-foreground">
 Same schedule and rounding as the main result; not universal for
            every PayPal account.
          </p>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markup
        </Link>
        {' · '}
        <Link
          href="/tools/margin-and-markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Margin &amp; Markup
        </Link>
        {' · '}
        <Link
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
        </Link>
        {' · '}
        <Link
          href="/tools/sales-tax-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Sales Tax
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
          href="/tools/cash-back-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back
        </Link>
      </p>
    </div>
  );
}
