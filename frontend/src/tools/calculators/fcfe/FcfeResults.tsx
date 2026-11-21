'use client';

import Link from 'next/link';

import { getCurrencySymbol } from '@/tools/shared/currency';
import { FCFE_METHOD_OPTIONS, type FcfeResult } from './types';

interface FcfeResultsProps {
  result: FcfeResult | null;
}

export function FcfeResults({ result }: FcfeResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const methodLabel =
    FCFE_METHOD_OPTIONS.find((m) => m.value === result.method)?.label ??
    result.method;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">FCFE summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Method</dt>
          <dd className="max-w-[60%] text-right text-accent">{methodLabel}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net borrowing</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedNetBorrowing}
          </dd>
        </div>
        {result.formattedCalculatedNetIncome !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Estimated / input NI</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedCalculatedNetIncome}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">FCFE</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedFreeCashFlowToEquity}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {result.method === 'cfo'
          ? 'FCFE = CFO − CapEx + NB'
          : result.method === 'fcff'
            ? 'FCFE = FCFF − Interest(1 − t) + NB'
            : 'FCFE = NI + D&A − CapEx − ΔNWC + NB'}
      </p>
      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/fcff-calculator-free-cash-flow-to-firm"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FCFF
        </Link>
        ,{' '}
        <Link
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA
        </Link>
        ,{' '}
        <Link
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT
        </Link>
        .
      </p>
    </div>
  );
}
