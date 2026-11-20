'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { BalanceTransferResult } from './types';

interface BalanceTransferResultsProps {
  result: BalanceTransferResult | null;
}

export function BalanceTransferResults({
  result,
}: BalanceTransferResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const warnTone =
    result.status === 'neverPaysOff' || result.status === 'invalid';
  const savings = result.totalSavings;
  const savingsLabel =
    savings == null
      ? 'Unavailable'
      : savings > 0.005
        ? 'Potential savings'
        : savings < -0.005
          ? 'Additional cost'
          : 'Cost difference';
  const savingsDisplay =
    result.formattedSavings == null
      ? '—'
      : `${symbol}${result.formattedSavings}`;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Balance transfer summary
      </h3>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-accent">{savingsLabel}</dt>
          <dd
            className={`text-lg font-semibold tabular-nums ${
              savings != null && savings < -0.005
                ? 'text-rose-700'
                : 'text-accent'
            }`}
          >
            {savingsDisplay}
          </dd>
        </div>
        {result.formattedOldTotalCost != null ? (
          <div className="flex justify-between gap-2 border-t border-border pt-1.5">
            <dt className="text-muted-foreground">Old card total cost</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedOldTotalCost}
            </dd>
          </div>
        ) : null}
        {result.formattedNewTotalCost != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">New card total cost</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedNewTotalCost}
            </dd>
          </div>
        ) : null}
        {result.formattedTransferFee != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Transfer fee</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedTransferFee}
            </dd>
          </div>
        ) : null}
        {result.formattedNewStartingBalance != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">New starting balance</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedNewStartingBalance}
            </dd>
          </div>
        ) : null}
        {result.formattedRemainingAfterPromo != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Balance after promotional period
            </dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedRemainingAfterPromo}
            </dd>
          </div>
        ) : null}
        {result.formattedOldInterest != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Old card interest</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedOldInterest}
            </dd>
          </div>
        ) : null}
        {result.formattedNewInterest != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">New card interest</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedNewInterest}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Old card payoff</dt>
          <dd className="tabular-nums text-accent">
            {result.oldCardNeverPaysOff
              ? 'Does not pay off'
              : result.oldCardPayoffMonths != null
                ? `${result.oldCardPayoffMonths} mo`
                : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">New card payoff</dt>
          <dd className="tabular-nums text-accent">
            {result.newCardNeverPaysOff
              ? 'Does not pay off'
              : result.newCardPayoffMonths != null
                ? `${result.newCardPayoffMonths} mo`
                : '—'}
          </dd>
        </div>
        {result.formattedEffectivePayment != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Monthly payment used</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedEffectivePayment}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Break-even month</dt>
          <dd className="tabular-nums text-accent">
            {result.breakEvenMonth != null
              ? `Month ${result.breakEvenMonth}`
              : 'Not recovered in period'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        Interest_t = Bal × APR/1200 · Bal_t = Bal + Interest − Payment
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
          <span>Calculation Breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3 text-xs leading-relaxed text-accent sm:text-sm">
            <p className="font-mono text-[11px] sm:text-xs">
              Fee = {symbol}
              {result.formattedTransferFee}
              {result.formattedNewStartingBalance != null
                ? ` · New start = ${symbol}${result.formattedNewStartingBalance}`
                : ''}
              {result.formattedRemainingAfterPromo != null
                ? ` · After promo = ${symbol}${result.formattedRemainingAfterPromo}`
                : ''}
            </p>
            <p className="text-muted-foreground">
              Savings ≈ old total cost − new total cost (same principal,
              transfer fee counted once). Partial transfers keep the remainder
              on the old card inside the transfer strategy.
            </p>
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        {' · '}
        <Link
          href="/tools/credit-card-payoff-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card Payoff
        </Link>
        {' · '}
        <Link
          href="/tools/credit-card-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card Interest
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
          href="/tools/interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Rate
        </Link>
        .
      </p>
    </div>
  );
}
