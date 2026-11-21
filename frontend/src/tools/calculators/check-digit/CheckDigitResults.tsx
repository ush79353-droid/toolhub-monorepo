'use client';

import { useState } from 'react';
import Link from 'next/link';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { CheckDigitResult } from './types';

interface CheckDigitResultsProps {
  result: CheckDigitResult | null;
}

export function CheckDigitResults({ result }: CheckDigitResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  const [copiedGtin, setCopiedGtin] = useState(false);

  if (!result) return null;

  const statusTone =
    result.mode === 'validate'
      ? result.isValid
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
        : 'border-rose-200 bg-rose-50 text-rose-900'
      : 'border-border bg-white text-accent';

  const handleCopyGtin = async () => {
    if (await copyTextToClipboard(result.completeGTIN)) {
      setCopiedGtin(true);
      window.setTimeout(() => setCopiedGtin(false), 2000);
    }
  };

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        {result.mode === 'validate' ? 'Validation result' : 'Check Digit'}
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.mode === 'validate'
          ? result.isValid
            ? 'Valid'
            : 'Invalid'
          : result.checkDigit}
      </p>
      <p className="text-xs text-muted-foreground">
        Complete GTIN{' '}
        <span className="font-mono font-medium text-accent">
          {result.completeGTIN}
        </span>
      </p>

      <button
        type="button"
        onClick={() => void handleCopyGtin()}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {copiedGtin ? 'Copied GTIN' : 'Copy complete GTIN'}
      </button>

      <p
        className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${statusTone}`}
      >
        {result.interpretation}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Barcode format</dt>
          <dd className="font-medium text-accent">{result.formatLabel}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Original payload</dt>
          <dd className="font-mono tabular-nums font-medium text-accent">
            {result.payload || '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Leading zeros applied</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.leadingZerosApplied}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Padded payload</dt>
          <dd className="font-mono tabular-nums font-medium text-accent">
            {result.paddedPayload}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Weighted sum</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.weightedSum}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Modulo 10 remainder</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.remainder}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Calculated check digit</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.checkDigit}
          </dd>
        </div>
        {result.mode === 'validate' ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Supplied check digit</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.suppliedCheckDigit}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Complete GTIN</dt>
          <dd className="font-mono tabular-nums font-medium text-accent">
            {result.completeGTIN}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
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
            {result.narrativeSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[240px] border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-1 pr-2 font-medium">Pos</th>
                  <th className="py-1 pr-2 font-medium">Digit</th>
                  <th className="py-1 pr-2 font-medium">Weight</th>
                  <th className="py-1 font-medium">Product</th>
                </tr>
              </thead>
              <tbody>
                {result.steps.map((s) => (
                  <tr key={`${s.position}-${s.digit}-${s.weight}`}>
                    <td className="py-0.5 pr-2 tabular-nums">{s.position}</td>
                    <td className="py-0.5 pr-2 tabular-nums">{s.digit}</td>
                    <td className="py-0.5 pr-2 tabular-nums">{s.weight}</td>
                    <td className="py-0.5 tabular-nums">{s.product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/cash-back-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back
        </Link>
        {' · '}
        <Link
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday
        </Link>
        {' · '}
        <Link
          href="/tools/percentage-discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Percentage Discount
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
          href="/tools/profit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Profit
        </Link>
      </p>
    </div>
  );
}
