'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { FRONT_END_LIMIT, BACK_END_LIMIT } from './calculation';
import type { Rule2836Result } from './types';

interface Rule2836ResultsProps {
  result: Rule2836Result | null;
}

function statusLabel(
  meets: boolean | null,
  limit: number
): string {
  if (meets === null) return '—';
  if (meets) return `Within ${limit}% guideline`;
  return `Above ${limit}% guideline`;
}

export function Rule2836Results({ result }: Rule2836ResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const warnTone =
    result.status === 'zeroIncome' ||
    result.meetsBothGuidelines === false;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        28/36 rule summary
      </h3>

      <dl className="space-y-1.5 text-sm">
        {result.formattedMonthlyHousingCosts !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Monthly housing costs</dt>
            <dd className="tabular-nums font-medium text-accent">
              {symbol}
              {result.formattedMonthlyHousingCosts}
            </dd>
          </div>
        ) : null}
        {result.formattedFrontEndRatio !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Front-end ratio</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedFrontEndRatio}%
              <span className="ml-1 text-xs text-muted-foreground">
                ({statusLabel(result.meetsFrontEndGuideline, FRONT_END_LIMIT)})
              </span>
            </dd>
          </div>
        ) : null}
        {result.formattedTotalMonthlyDebt !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total monthly debt</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedTotalMonthlyDebt}
            </dd>
          </div>
        ) : null}
        {result.formattedBackEndRatio !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Back-end ratio</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedBackEndRatio}%
              <span className="ml-1 text-xs text-muted-foreground">
                ({statusLabel(result.meetsBackEndGuideline, BACK_END_LIMIT)})
              </span>
            </dd>
          </div>
        ) : null}
        {result.formattedMaximumHousingCosts !== null ? (
          <div className="flex justify-between gap-2 border-t border-border pt-1.5">
            <dt className="text-muted-foreground">Max housing (28%)</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedMaximumHousingCosts}
            </dd>
          </div>
        ) : null}
        {result.formattedMaximumTotalDebt !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Max total debt (36%)</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedMaximumTotalDebt}
            </dd>
          </div>
        ) : null}
        {result.formattedHousingCapacity !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="font-medium text-accent">
              Housing capacity (both guidelines)
            </dt>
            <dd className="font-semibold tabular-nums text-accent">
              {symbol}
              {result.formattedHousingCapacity}
            </dd>
          </div>
        ) : null}
        {result.meetsBothGuidelines !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="font-medium text-accent">Overall guideline</dt>
            <dd
              className={`font-semibold ${
                result.meetsBothGuidelines ? 'text-accent' : 'text-rose-700'
              }`}
            >
              {result.meetsBothGuidelines
                ? 'Within both limits'
                : 'Does not meet both limits'}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        FER = H / I × 100 · BER = (H + D) / I × 100 · Limits 28% / 36%
      </p>

      {result.warningMessage ? (
        <p
          className={`text-xs leading-relaxed ${
            warnTone ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <div className="rounded-lg border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
          aria-expanded={breakdownOpen}
          onClick={() => setBreakdownOpen((o) => !o)}
        >
          <span>28/36 Calculation Breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3 text-xs leading-relaxed text-accent sm:text-sm">
            {result.formattedFrontEndRatio != null &&
            result.formattedMonthlyHousingCosts != null ? (
              <p className="font-mono text-[11px] sm:text-xs">
                FER = {result.formattedMonthlyHousingCosts} / income × 100 ={' '}
                {result.formattedFrontEndRatio}% (guideline {FRONT_END_LIMIT}
                %)
              </p>
            ) : (
              <p className="text-muted-foreground">
                Enter income and housing costs for the front-end ratio.
              </p>
            )}
            {result.formattedBackEndRatio != null &&
            result.formattedTotalMonthlyDebt != null ? (
              <p className="font-mono text-[11px] sm:text-xs">
                BER = {result.formattedTotalMonthlyDebt} / income × 100 ={' '}
                {result.formattedBackEndRatio}% (guideline {BACK_END_LIMIT}%)
              </p>
            ) : (
              <p className="text-muted-foreground">
                Enter other debts with housing and income for the back-end
                ratio.
              </p>
            )}
            {result.formattedHousingCapacity != null ? (
              <p className="font-mono text-[11px] sm:text-xs">
                Housing capacity = min(28% income, 36% income − other debts) ={' '}
                {symbol}
                {result.formattedHousingCapacity} (budget estimate, not an
                approved loan amount)
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/home-affordability-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Home Affordability
        </Link>
        {' · '}
        <Link
          href="/tools/house-affordability-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          House Affordability
        </Link>
        {' · '}
        <Link
          href="/tools/home-mortgage-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Mortgage
        </Link>
        {' · '}
        <Link
          href="/tools/pmi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PMI
        </Link>
        {' · '}
        <Link
          href="/tools/rent-vs-buy-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Rent vs Buy
        </Link>
        .
      </p>
    </div>
  );
}
