'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { LaborCostForm } from './LaborCostForm';
import { LaborCostResults } from './LaborCostResults';
import {
  createDefaultInput,
  type LaborCostFieldErrors,
  type LaborCostInput,
  type LaborCostResult,
} from './types';
import { validateLaborCost } from './validation';

const MONEY_KEYS = [
  'payRate',
  'taxes',
  'insurance',
  'benefits',
  'overtime',
  'supplies',
  'revenue',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts pay rate, employer costs, payroll totals, and unit labor cost using stored exchange rates. Hours and labor cost % stay the same.';

function convertLaborCostMoney(
  input: LaborCostInput,
  from: string,
  to: string,
  rates: Record<string, number>
): Partial<LaborCostInput> | null {
  const patch: Partial<LaborCostInput> = {};
  for (const key of MONEY_KEYS) {
    const amount = input[key];
    if (!Number.isFinite(amount)) {
      patch[key] = amount;
      continue;
    }
    const converted = convertCurrency({ amount, from, to, rates });
    if (!converted.ok) return null;
    patch[key] = converted.amount;
  }
  return patch;
}

export function LaborCostCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<LaborCostInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<LaborCostFieldErrors>({});
  const [result, setResult] = React.useState<LaborCostResult | null>(() =>
    validateLaborCost(createDefaultInput(), { includeLaborCostPercent: false }).result
  );
  const [additionalOpen, setAdditionalOpen] = React.useState(false);
  const [percentageOpen, setPercentageOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const run = (next: LaborCostInput, includePercent: boolean) => {
    const validation = validateLaborCost(next, { includeLaborCostPercent: includePercent });
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleChange = (next: LaborCostInput) => {
    setConversionError(null);
    setInput(next);
    run(next, percentageOpen);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const moneyPatch = convertLaborCostMoney(input, input.currency, currency, rates.rates);
    if (!moneyPatch) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleChange({ ...input, ...moneyPatch, currency });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setAdditionalOpen(false);
    setPercentageOpen(false);
    run(fresh, false);
    setConversionError(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result && result.annualPayrollLaborCost !== null
      ? [
          `${metadata.title} | Omega Calculators`,
          `Gross hours/year: ${result.grossHoursPerYearDisplay}`,
          `Gross pay: ${symbol}${result.grossPayDisplay}`,
          `Net hours worked: ${result.netHoursWorkedDisplay}`,
          `Annual payroll labor cost: ${symbol}${result.annualPayrollLaborCostDisplay}`,
          `Hourly labor cost: ${symbol}${result.hourlyLaborCostDisplay}`,
          percentageOpen && result.laborCostPercentDisplay
            ? `Labor cost percentage: ${result.laborCostPercentDisplay}%`
            : null,
          currencyNote,
        ]
          .filter(Boolean)
          .join('\n')
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
            Estimate annual and hourly labor cost. {currencyNote}
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
        <LaborCostForm
          input={input}
          errors={errors}
          result={result}
          additionalOpen={additionalOpen}
          percentageOpen={percentageOpen}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onToggleAdditional={() => setAdditionalOpen((open) => !open)}
          onTogglePercentage={() => {
            setPercentageOpen((open) => {
              const next = !open;
              run(input, next);
              return next;
            });
          }}
          onReset={handleReset}
        />
        <LaborCostResults />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
