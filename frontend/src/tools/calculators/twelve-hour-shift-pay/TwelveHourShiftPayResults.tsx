'use client';

import { Button } from '@/components/ui/button';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { TwelveHourShiftPayResult } from './types';

/**
 * Wage lines stay at hundredths. Intl gives PKR 0 fraction digits in this runtime,
 * which would show 23.33 as 23.
 */
export function formatShiftPay(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface TwelveHourShiftPayResultsProps {
  result: TwelveHourShiftPayResult | null;
  copied: boolean;
  onCopy: () => void;
}

export function TwelveHourShiftPayResults({ result, copied, onCopy }: TwelveHourShiftPayResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct the messages above to refresh the estimate.
        </p>
      </div>
    );
  }

  const money = (value: number) => formatShiftPay(value, result.currency);
  const rows = [
    ['Average wage per hour', money(result.averageHourlyPay)],
    ['Pay per day', money(result.payPerDay)],
    ['Pay per week', money(result.payPerWeek)],
    ['Pay per month', money(result.payPerMonth)],
    ['Pay per year', money(result.payPerYear)],
  ] as const;

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
          {copied ? 'Copied' : 'Copy results'}
        </Button>
      </div>
      <dl className="overflow-hidden rounded-xl border border-border bg-white">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-border px-3 py-2.5 last:border-b-0">
            <dt className="text-[13px] text-muted-foreground">{label}</dt>
            <dd className="text-[15px] font-semibold tabular-nums text-accent">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Assumes a 12-hour shift, 5 workdays per week, 4.4 weeks per month, and 52 weeks per year.
      </p>
    </div>
  );
}
