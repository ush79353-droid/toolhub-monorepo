'use client';

import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { describeResult } from './calculation';
import type { ARDaysResult } from './types';

function daysText(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function money(value: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(value, currency);
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function ARDaysResults({ result }: { result: ARDaysResult | null }) {
  if (!result?.defined || result.formula === null || result.arDays === null) return null;
  const currency = result.currency;
  const formula = result.formula;
  const solvedLabel =
    result.solveFor === 'arDays'
      ? 'A/R days'
      : result.solveFor === 'receivables'
        ? 'Accounts receivable'
        : result.solveFor === 'creditSales'
          ? 'Net credit sales'
          : 'Days in the period';

  return (
    <div className="space-y-3.5">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <p className="text-[13px] font-medium text-accent">A/R days (days sales outstanding)</p>
        <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
          {daysText(result.arDays)}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">days</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Solving for {solvedLabel}.{' '}
          {result.balanceMethod === 'average'
            ? 'Receivables are the average of the beginning and ending balances.'
            : 'Receivables are the ending balance you entered, or the balance solved from the other inputs.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Stat
          label="Receivables used"
          value={money(formula.receivables, currency)}
          hint={result.averageReceivable === null ? 'Ending-balance method' : 'Average-balance method'}
        />
        {result.averageReceivable !== null ? (
          <Stat label="Average A/R" value={money(result.averageReceivable, currency)} hint="(Beginning + ending) / 2" />
        ) : null}
        <Stat label="Net credit sales" value={money(formula.netCreditSales, currency)} />
        <Stat label="Days in the period" value={daysText(formula.periodDays)} />
        <Stat
          label="Receivables turnover"
          value={result.receivablesTurnover === null ? '—' : daysText(result.receivablesTurnover)}
          hint="Net credit sales ÷ receivables used, for this period"
        />
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-sm font-medium text-accent">Formula</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90 tabular-nums">
          A/R days = ({money(formula.receivables, currency)} / {money(formula.netCreditSales, currency)}) ×{' '}
          {daysText(formula.periodDays)} = {daysText(formula.arDays)} days
        </p>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{describeResult(result)}</p>
    </div>
  );
}
