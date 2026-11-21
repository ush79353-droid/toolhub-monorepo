'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { AfterTaxCostOfDebtForm } from './AfterTaxCostOfDebtForm';
import {
  createDefaultInput,
  type AfterTaxCostOfDebtFieldErrors,
  type AfterTaxCostOfDebtInput,
  type AfterTaxCostOfDebtResult,
} from './types';
import { validateAfterTaxCostOfDebtInput } from './validation';

const ATCOD_CURRENCY_NOTE =
  'Net income and pre-tax income each have their own currency. Mixed-currency incomes are normalized into the net-income currency before the tax-rate ratio. Tax rate, cost of debt, and after-tax cost of debt percentages are never converted.';

function inputsEqual(a: AfterTaxCostOfDebtInput, b: AfterTaxCostOfDebtInput): boolean {
  return (
    a.netIncome === b.netIncome &&
    a.netIncomeCurrency === b.netIncomeCurrency &&
    a.pretaxIncome === b.pretaxIncome &&
    a.pretaxIncomeCurrency === b.pretaxIncomeCurrency &&
    a.taxRatePercent === b.taxRatePercent &&
    a.taxRateSource === b.taxRateSource &&
    a.costOfDebtPercent === b.costOfDebtPercent
  );
}

export function AfterTaxCostOfDebtCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateAfterTaxCostOfDebtInput(defaults, rates);
  const [input, setInput] = React.useState<AfterTaxCostOfDebtInput>(() => defaults);
  const [errors, setErrors] = React.useState<AfterTaxCostOfDebtFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<AfterTaxCostOfDebtResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: AfterTaxCostOfDebtInput) => {
    const validation = validateAfterTaxCostOfDebtInput(next, rates);
    const synced =
      next.taxRateSource === 'incomes' && validation.syncedTaxRatePercent !== null
        ? { ...next, taxRatePercent: validation.syncedTaxRatePercent }
        : next;
    setInput(synced);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateAfterTaxCostOfDebtInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const dirty = !inputsEqual(input, defaults);
  const currencyNote = ratesStatus.available
    ? ATCOD_CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const netSymbol = getCurrencySymbol(input.netIncomeCurrency);
  const pretaxSymbol = getCurrencySymbol(input.pretaxIncomeCurrency);

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Net income: ${netSymbol}${input.netIncome}`,
        `Pre-tax income: ${pretaxSymbol}${input.pretaxIncome}`,
        `Marginal corporate tax rate: ${result.formattedTaxRate}%`,
        `Cost of debt: ${result.formattedCostOfDebt}%`,
        `After-tax cost of debt: ${result.formattedAfterTaxCostOfDebt}%`,
        currencyNote,
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
          <p className="text-xs font-normal text-muted-foreground">{currencyNote}</p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <AfterTaxCostOfDebtForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
          dirty={dirty}
        />
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
            {copied ? 'Copied' : 'Share result'}
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
