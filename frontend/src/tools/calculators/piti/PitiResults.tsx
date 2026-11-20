'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { PitiResult } from './types';

interface PitiResultsProps {
  result: PitiResult | null;
}

export function PitiResults({ result }: PitiResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(true);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const piShare =
    result.monthlyPITI > 0
      ? (result.monthlyPrincipalAndInterest / result.monthlyPITI) * 100
      : 0;
  const taxShare =
    result.monthlyPITI > 0
      ? (result.monthlyPropertyTax / result.monthlyPITI) * 100
      : 0;
  const insShare =
    result.monthlyPITI > 0
      ? (result.monthlyHomeownersInsurance / result.monthlyPITI) * 100
      : 0;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">PITI</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Total estimated monthly housing payment (principal, interest, taxes,
        insurance).
      </p>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-accent">Monthly PITI</span>
        <span className="text-xl font-semibold tabular-nums text-accent">
          {symbol}
          {result.formattedPITI}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            / month
          </span>
        </span>
      </div>

      {result.monthlyPITI > 0 ? (
        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full"
          role="presentation"
          aria-hidden
        >
          <div className="bg-primary" style={{ width: `${piShare}%` }} />
          <div className="bg-amber-500" style={{ width: `${taxShare}%` }} />
          <div className="bg-sky-500" style={{ width: `${insShare}%` }} />
        </div>
      ) : null}
      <p className="text-[11px] text-muted-foreground">
        <span className="text-primary">■</span> P&amp;I{' '}
        <span className="text-amber-600">■</span> Tax{' '}
        <span className="text-sky-600">■</span> Insurance
      </p>

      <div className="rounded-lg border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
          aria-expanded={breakdownOpen}
          onClick={() => setBreakdownOpen((o) => !o)}
        >
          <span>Monthly breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <dl className="space-y-1.5 border-t border-border px-3 py-2.5 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Principal &amp; interest</dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedPI}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Property tax</dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedTax}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Homeowners insurance</dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedInsurance}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-t border-border pt-1.5 font-medium">
              <dt className="text-accent">Total PITI</dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedPITI}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-t border-border pt-1.5">
              <dt className="text-muted-foreground">Monthly escrow (T+I)</dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedEscrow}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Annual PITI</dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedAnnualPITI}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Total P&amp;I over loan ({result.totalTermMonths} mo)
              </dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedTotalPayments}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Total mortgage interest</dt>
              <dd className="tabular-nums text-accent">
                {symbol}
                {result.formattedTotalInterest}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>

      <p className="font-mono text-xs text-muted-foreground">
        PITI = M + T/12 + I/12 · M = Pr / (1−(1+r)^−n)
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/home-mortgage-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Home Mortgage
        </Link>
        {' · '}
        <Link
          href="/tools/home-affordability-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Home Affordability
        </Link>
        {' · '}
        <Link
          href="/tools/amortization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Amortization
        </Link>
        {' · '}
        <Link
          href="/tools/loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan
        </Link>
        {' · '}
        <Link
          href="/tools/heloc-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          HELOC
        </Link>
        {' · '}
        <Link
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        .
      </p>
    </div>
  );
}
