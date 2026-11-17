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
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import { formatDisplayDate } from './calculation';
import { MortgageComparisonForm } from './MortgageComparisonForm';
import {
  createDefaultInput,
  type MortgageComparisonFieldErrors,
  type MortgageComparisonInput,
  type MortgageComparisonResult,
} from './types';
import { validateMortgageComparisonInput } from './validation';

const FX_NOTE =
  'Home value, down payment, loan amount, payment, homeowners insurance, and other costs each have their own currency. Amounts normalize into the home-value currency before mortgage math. Rates, term, percentages, and dates are never converted.';

function syncDerivedFields(input: MortgageComparisonInput, result: MortgageComparisonResult): MortgageComparisonInput {
  const next = { ...input };
  if (input.downPaymentSource === 'percent') {
    next.downPayment = moneyAmountToInputString(result.downPaymentDisplay);
  } else {
    next.downPaymentPercent = result.formattedDownPaymentPercent;
  }
  return next;
}

export function MortgageComparisonCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [input, setInput] = React.useState<MortgageComparisonInput>(() => defaults);
  const [errors, setErrors] = React.useState<MortgageComparisonFieldErrors>({});
  const [result, setResult] = React.useState<MortgageComparisonResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateMortgageComparisonInput(defaults, rates);
    if (validation.isValid && validation.result) {
      setInput(syncDerivedFields(defaults, validation.result));
      setResult(validation.result);
      setErrors({});
    }
    // Initial sample only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: MortgageComparisonInput) => {
    const validation = validateMortgageComparisonInput(next, rates);
    setErrors(validation.errors);
    if (validation.isValid && validation.result) {
      setInput(syncDerivedFields(next, validation.result));
      setResult(validation.result);
    } else {
      setInput(next);
      setResult(null);
    }
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateMortgageComparisonInput(fresh, rates);
    setErrors(validation.errors);
    if (validation.isValid && validation.result) {
      setInput(syncDerivedFields(fresh, validation.result));
      setResult(validation.result);
    } else {
      setInput(fresh);
      setResult(null);
    }
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const paySymbol = result ? getCurrencySymbol(result.paymentCurrency) : '';
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Payment: ${paySymbol}${result.formattedPeriodicPayment}`,
        `Payoff: ${formatDisplayDate(result.payoffDate)}`,
        `Total payments (${result.paymentCount}): ${paySymbol}${result.formattedTotalPayments}`,
        `Total interest: ${paySymbol}${result.formattedTotalInterest}`,
        result.totalPmi > 0
          ? `PMI: ${paySymbol}${result.formattedTotalPmi} (${paySymbol}${result.formattedPeriodicPmi} periodic)`
          : 'PMI: none',
        `Total with costs: ${paySymbol}${result.formattedTotalWithCosts}`,
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
        <MortgageComparisonForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
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
              {shared ? 'Shared' : 'Share result'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
