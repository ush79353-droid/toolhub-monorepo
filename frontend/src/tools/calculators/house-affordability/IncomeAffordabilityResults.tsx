'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { IncomeBasedResult } from './types';

interface Props {
  result: IncomeBasedResult | null;
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

export function IncomeAffordabilityResults({ result }: Props) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const money = (f: string) => `${symbol}${f}`;
  const binding =
    result.bindingLimit === 'front'
      ? 'Front-end DTI'
      : result.bindingLimit === 'back'
        ? 'Back-end DTI'
        : 'Front-end and back-end DTI (tied)';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h4 className="text-[13px] font-semibold text-accent">
        Income-based results
      </h4>
      <p className="mt-1 text-xs text-muted-foreground">
        Binding constraint: {binding} ({money(result.formattedBudget)}/mo)
      </p>
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
          label="Monthly homeowners insurance"
          value={money(result.formattedMonthlyInsurance)}
        />
        <Row
          label="Monthly HOA fees"
          value={money(result.formattedMonthlyHoa)}
        />
        <Row
          label="Total housing payment"
          value={money(result.formattedTotalHousing)}
          emphasize
        />
        <Row label="Front-end DTI" value={`${result.frontEndDti.toFixed(2)}%`} />
        <Row label="Back-end DTI" value={`${result.backEndDti.toFixed(2)}%`} />
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">{result.profileNote}</p>
    </div>
  );
}
