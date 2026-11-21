'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { HomeAffordabilityResult } from './types';

interface HomeAffordabilityResultsProps {
  result: HomeAffordabilityResult | null;
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

export function HomeAffordabilityResults({
  result,
}: HomeAffordabilityResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const money = (formatted: string) => `${symbol}${formatted}`;

  const bindingLabel =
    result.bindingLimit === 'payment'
      ? 'Entered maximum housing payment'
      : result.bindingLimit === 'front'
        ? 'Front-end DTI limit'
        : result.bindingLimit === 'back'
          ? 'Back-end DTI limit'
          : 'Front-end and back-end DTI (tied)';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Binding budget: {bindingLabel} ({money(result.formattedBudget)}/mo)
      </p>

      <dl className="mt-2.5 space-y-2 text-sm">
        <Row
          label="Estimated affordable home price"
          value={money(result.formattedHomePrice)}
          emphasize
        />
        <Row
          label="Maximum affordable loan"
          value={money(result.formattedLoanAmount)}
        />
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
        <Row label="Monthly HOA fees" value={money(result.formattedMonthlyHoa)} />
        <Row
          label="Monthly mortgage insurance (est.)"
          value={money(result.formattedMonthlyMi)}
        />
        <Row
          label="Total monthly housing payment"
          value={money(result.formattedTotalHousing)}
          emphasize
        />
        {result.frontEndDti !== null ? (
          <Row label="Front-end DTI" value={`${result.frontEndDti.toFixed(2)}%`} />
        ) : null}
        {result.backEndDti !== null ? (
          <Row label="Back-end DTI" value={`${result.backEndDti.toFixed(2)}%`} />
        ) : null}
        {result.estimatedClosingCosts > 0 ? (
          <>
            <Row
              label="Estimated closing costs"
              value={money(result.formattedClosingCosts)}
            />
            <Row
              label="Cash needed at closing"
              value={money(result.formattedCashAtClosing)}
            />
          </>
        ) : null}
      </dl>

      {result.warning ? (
        <p
          className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900"
          role="status"
        >
          {result.warning}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-muted-foreground">
 Estimate only; not a mortgage preapproval or lending decision. Mortgage
        insurance is a simplified loan-balance rate estimate.
      </p>
    </div>
  );
}
