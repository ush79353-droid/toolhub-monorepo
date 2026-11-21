'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { ArmMortgageForm } from './ArmMortgageForm';
import { ArmMortgageResults } from './ArmMortgageResults';
import { calculateArmMortgage } from './calculation';
import {
  createDefaultArmInput,
  type ArmFieldErrors,
  type ArmMortgageInput,
  type ArmMortgageResult,
} from './types';
import { validateArmInput } from './validation';

const ALWAYS_MONEY_KEYS = [
  'mortgageBalance',
  'homePrice',
  'upfrontFees',
  'propertyTaxMonthly',
  'insuranceMonthly',
  'hoaMonthly',
  'mortgageInsuranceMonthly',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts mortgage balance, fees, and other money amounts using stored exchange rates. Rates, term, and ARM structure stay the same.';

function todayIso(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

function convertArmMoney(
  input: ArmMortgageInput,
  from: string,
  to: string,
  rates: Record<string, number>
): Partial<ArmMortgageInput> | null {
  const patch: Partial<ArmMortgageInput> = {};

  for (const key of ALWAYS_MONEY_KEYS) {
    const amount = input[key];
    if (!Number.isFinite(amount)) {
      patch[key] = amount;
      continue;
    }
    if (amount === 0) {
      patch[key] = 0;
      continue;
    }
    const converted = convertCurrency({ amount, from, to, rates });
    if (!converted.ok) return null;
    patch[key] = converted.amount;
  }

  // Percent down payments are dimensionless; amount-mode down payments convert.
  if (input.downPaymentMode === 'amount') {
    const amount = input.downPayment;
    if (!Number.isFinite(amount)) {
      patch.downPayment = amount;
    } else if (amount === 0) {
      patch.downPayment = 0;
    } else {
      const converted = convertCurrency({ amount, from, to, rates });
      if (!converted.ok) return null;
      patch.downPayment = converted.amount;
    }
  }

  return patch;
}

export function ArmMortgageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<ArmMortgageInput>(() => createDefaultArmInput(todayIso()));
  const [errors, setErrors] = React.useState<ArmFieldErrors>({});
  const [result, setResult] = React.useState<ArmMortgageResult | null>(() =>
    calculateArmMortgage(input)
  );
  const [copied, setCopied] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const run = (next: ArmMortgageInput) => {
    const validation = validateArmInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateArmMortgage(next) : null);
  };

  const handleChange = (next: ArmMortgageInput) => {
    setConversionError(null);
    setInput(next);
    run(next);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const moneyPatch = convertArmMoney(input, input.currency, currency, rates.rates);
    if (!moneyPatch) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleChange({ ...input, ...moneyPatch, currency });
  };

  const handleReset = () => {
    const fresh = createDefaultArmInput(todayIso());
    setConversionError(null);
    setInput(fresh);
    setErrors({});
    setResult(calculateArmMortgage(fresh));
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Monthly Payment Range: ${formatCurrencyValue(result.minPaymentCents / 100, result.currency)} – ${formatCurrencyValue(result.maxPaymentCents / 100, result.currency)} / mo`,
        `Estimated APR: ${result.averageRate.toFixed(3)}% (Actuarial: ${result.actuarialApr.toFixed(3)}%)`,
        `Mortgage Term: ${result.termYears} years (${result.paymentCount} payments)`,
        `Paid Interest: ${formatCurrencyValue(result.totalInterestCents / 100, result.currency)}`,
        `Additional Costs: ${formatCurrencyValue(result.additionalCostsCents / 100, result.currency)}`,
        `Total Payments: ${formatCurrencyValue(result.totalPaymentsCents / 100, result.currency)}`,
        `Initial Payment: ${formatCurrencyValue(result.initialPaymentCents / 100, result.currency)} at ${result.initialRate.toFixed(3)}%`,
        `Maximum Permitted Rate: ${result.maximumPermittedRate.toFixed(3)}%`,
        currencyNote,
        'Estimates and projections based on user assumptions, not guaranteed loan quotes.',
      ].join('\n')
    : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Adjustable-rate mortgage estimates · {currencyNote}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <ArmMortgageForm
          input={input}
          errors={errors}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={handleReset}
        />
        <ArmMortgageResults
          result={result}
          copied={copied}
          onCopy={async () => {
            if (!summary) return;
            if (await copyTextToClipboard(summary)) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }
          }}
        />
      </div>
    </section>
  );
}
