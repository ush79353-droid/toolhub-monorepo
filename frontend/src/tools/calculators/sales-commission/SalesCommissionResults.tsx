'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import { methodLabel } from './calculation';
import type { SalesCommissionResult } from './types';

interface SalesCommissionResultsProps {
  result: SalesCommissionResult | null;
  invalid: boolean;
}

export function SalesCommissionResults({ result, invalid }: SalesCommissionResultsProps) {
  if (!result?.defined) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
        <p className="text-sm font-medium text-accent">
          {invalid ? 'Review highlighted inputs' : 'Enter sales figures to calculate'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Commission, labor cost, and margins update as you type.
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, result.currency);

  return (
    <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4" aria-live="polite">
      <p className="text-xs font-medium text-primary">Commission</p>
      <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
        {money(result.commission)}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        Based on {methodLabel(result.commissionBase)}. Total labor cost (OTE){' '}
        {money(result.totalLaborCost)}. Operational profit {money(result.operationalProfit)}.
      </p>
    </div>
  );
}
