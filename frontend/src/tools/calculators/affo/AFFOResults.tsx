'use client';

import { Button } from '@/components/ui/button';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import type { AffoResult } from './types';

interface AffoResultsProps {
  result: AffoResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function formatRatio(value: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value * 100)}%`;
}

function formatShares(value: number, currency: AffoResult['currency']): string {
  return formatCurrencyValue(value, currency);
}

export function AFFOResults({ result, invalid, copied, shared, canShare, onCopy, onShare }: AffoResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">{invalid ? 'Review highlighted inputs' : 'Enter net income to calculate'}</p>
        <p className="mt-1 max-w-md text-xs font-normal leading-relaxed text-muted-foreground">
          {invalid
            ? 'Correct the messages above. Results stay blank until every amount is a usable number.'
            : 'FFO and the simplified AFFO estimate update as you type. Amounts stay in the period you selected.'}
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, result.currency);

  return (
    <div className="space-y-3.5" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Simplified AFFO</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.affo)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
              {copied ? 'Copied' : 'Copy results'}
            </Button>
            {canShare ? (
              <Button type="button" variant="outline" size="sm" onClick={onShare} className="h-8 bg-white px-2.5 text-xs font-medium">
                {shared ? 'Shared' : 'Share'}
              </Button>
            ) : null}
          </div>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          {result.periodLabel} estimate in {result.currency}. Simplified FFO is {money(result.ffo)}. AFFO minus FFO is{' '}
          {money(result.affoAdjustment)}. That difference is a reconciliation, not profit and not cash available to distribute.
        </p>
      </div>

      <dl className="grid gap-2 sm:grid-cols-2">
        {[
          ['Net income', money(result.netIncome)],
          ['Simplified FFO', money(result.ffo)],
          ['FFO additions', money(result.ffoAdditions)],
          ['FFO deductions', money(result.ffoDeductions)],
          ['AFFO additions', money(result.affoAdditions)],
          ['AFFO deductions', money(result.affoDeductions)],
          ['Interest income (not adjusted)', money(result.interestIncome)],
          ['Reporting period', result.periodLabel],
          ['Currency', result.currency],
          ['FFO per share', result.ffoPerShare === null ? '—' : formatShares(result.ffoPerShare, result.currency)],
          ['AFFO per share', result.affoPerShare === null ? '—' : formatShares(result.affoPerShare, result.currency)],
          ['AFFO payout ratio', result.payoutRatio === null ? '—' : formatRatio(result.payoutRatio)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-white px-3 py-2">
            <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-accent">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">FFO to simplified AFFO reconciliation</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Line</th>
              <th scope="col" className="px-3 py-2 font-medium">Treatment</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.id} className="border-t border-border">
                <th scope="row" className="px-3 py-2 text-left text-[13px] font-medium text-foreground">
                  {line.label}
                </th>
                <td className="px-3 py-2 text-[13px] capitalize text-muted-foreground">{line.treatment}</td>
                <td className="px-3 py-2 text-right tabular-nums text-accent">{money(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        This is a simplified estimate. It does not apply impairment, unconsolidated-entity, or other REIT-specific items unless you entered them in an explicit field. REIT reporting policies differ, so the result is not a Nareit-compliant FFO figure and it is not audited AFFO. {CURRENCY_DENOMINATION_NOTE}
      </p>
    </div>
  );
}
