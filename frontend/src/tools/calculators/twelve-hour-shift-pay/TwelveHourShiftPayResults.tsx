'use client';

import { Button } from '@/components/ui/button';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { TwelveHourShiftPayResult } from './types';

/**
 * Wage lines stay at hundredths. Intl gives PKR 0 fraction digits in this runtime,
 * which would show 23.33 as 23.
 */
export function formatShiftPay(amount: number, currency: SupportedCurrency): string {
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

function formatHours(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}

export function TwelveHourShiftPayResults({ result, copied, onCopy }: TwelveHourShiftPayResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct the messages above to refresh the shift pay estimate.
        </p>
      </div>
    );
  }

  const money = (value: number) => formatShiftPay(value, result.currency);
  const shiftLabel = `Pay per ${formatHours(result.shiftHours)}-hour shift`;
  const overtimeNote =
    result.overtimeWageSource === 'suggested'
      ? `Overtime wage is 1.5× the hourly wage (${money(result.overtimeHourlyWage)}). That multiplier is an assumption, not a legal rate.`
      : `Overtime wage is the ${money(result.overtimeHourlyWage)} rate you entered. It is not replaced by 1.5×.`;

  return (
    <div className="space-y-3.5" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">{shiftLabel}</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.shiftPay)}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
            {copied ? 'Copied' : 'Copy results'}
          </Button>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          Average wage this shift is {money(result.averageHourlyPay)} per hour. {overtimeNote}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Metric label="Average wage per hour" value={money(result.averageHourlyPay)} />
        <Metric label="Pay per week" value={money(result.weeklyPay)} />
        <Metric label="Pay per month" value={money(result.monthlyPay)} />
        <Metric label="Pay per year" value={money(result.yearlyPay)} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Week, month, and year figures assume {formatHours(result.shiftsPerWeek)} shifts per week and{' '}
        {formatHours(result.weeksPerYear)} weeks per year. Month is that yearly total divided by 12. These are
        projections, not guaranteed earnings.
      </p>

      <dl className="grid grid-cols-2 gap-2.5 rounded-xl border border-border bg-white p-3 text-sm">
        <Breakdown term="Regular hours" value={formatHours(result.regularHours)} />
        <Breakdown term="Overtime hours" value={formatHours(result.overtimeHours)} />
        <Breakdown term="Regular pay" value={money(result.regularPay)} />
        <Breakdown term="Overtime pay" value={money(result.overtimePay)} />
      </dl>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
      <p className="text-xs font-normal text-muted-foreground">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent sm:text-base">{value}</p>
    </div>
  );
}

function Breakdown({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{term}</dt>
      <dd className="font-medium tabular-nums text-accent">{value}</dd>
    </div>
  );
}
