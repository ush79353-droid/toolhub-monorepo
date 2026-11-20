'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { FixedBudgetResult } from './types';

interface Props {
  result: FixedBudgetResult | null;
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`tabular-nums text-accent ${
          emphasize ? 'text-base font-semibold' : 'font-semibold'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function FixedBudgetResults({ result }: Props) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const money = (f: string) => `${symbol}${f}`;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h4 className="text-[13px] font-semibold text-accent">
        Fixed-budget results
      </h4>
      <dl className="mt-2.5 space-y-2 text-sm">
        <Row
          label="Estimated maximum house price"
          value={money(result.formattedHousePrice)}
          emphasize
        />
        <Row label="Mortgage amount" value={money(result.formattedLoanAmount)} />
        <Row label="Down payment" value={money(result.formattedDownPayment)} />
        <Row
          label="Monthly principal & interest"
          value={money(result.formattedMonthlyPi)}
        />
        <Row
          label="Monthly property tax"
          value={money(result.formattedMonthlyTax)}
        />
        <Row
          label="Monthly HOA fees"
          value={money(result.formattedMonthlyHoa)}
        />
        <Row
          label="Monthly insurance"
          value={money(result.formattedMonthlyInsurance)}
        />
        <Row
          label="Monthly maintenance"
          value={money(result.formattedMonthlyMaintenance)}
        />
        <Row
          label="Total estimated monthly housing costs"
          value={money(result.formattedTotalHousing)}
          emphasize
        />
        <Row
          label="Monthly budget"
          value={money(result.formattedBudget)}
        />
        <Row
          label={
            result.includeTaxesAndFees
              ? 'Budget remaining (vs constrained total)'
              : 'Budget remaining (vs P&I)'
          }
          value={money(result.formattedBudgetDifference)}
        />
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">{result.note}</p>
    </div>
  );
}
