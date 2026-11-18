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
import { FhaLoanForm } from './FhaLoanForm';
import {
  createDefaultInput,
  type FhaLoanFieldErrors,
  type FhaLoanInput,
  type FhaLoanResult,
} from './types';
import { validateFhaLoanInput } from './validation';

const FX_NOTE =
  'Home price and each monetary result have their own currency. Changing home-price currency converts that amount; changing a result currency only re-expresses that result. Percentages and payment counts are never converted.';

export function FhaLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateFhaLoanInput(defaults, rates);
  const [input, setInput] = React.useState<FhaLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<FhaLoanFieldErrors>(() => initial.errors);
  const [result, setResult] = React.useState<FhaLoanResult | null>(() => initial.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: FhaLoanInput) => {
    setInput(next);
    const validation = validateFhaLoanInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateFhaLoanInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Home price: ${getCurrencySymbol(input.homePriceCurrency)}${input.homePrice}`,
        `Down payment: ${input.downPaymentPercent}%`,
        `Loan term: ${input.loanTermYears} yrs`,
        `Interest rate: ${input.interestRatePercent}%`,
        `FHA Annual MIP: ${input.annualMipPercent}%`,
        `Total down payment: ${getCurrencySymbol(result.totalDownPaymentCurrency)}${result.formattedTotalDownPayment}`,
        `FHA base loan: ${getCurrencySymbol(result.baseLoanAmountCurrency)}${result.formattedBaseLoanAmount}`,
        `Upfront MIP: ${getCurrencySymbol(result.upfrontMipCurrency)}${result.formattedUpfrontMip}`,
        `Monthly mortgage: ${getCurrencySymbol(result.monthlyMortgagePaymentCurrency)}${result.formattedMonthlyMortgagePayment}`,
        `Monthly MIP: ${getCurrencySymbol(result.monthlyMipCurrency)}${result.formattedMonthlyMip}`,
        `Total FHA loan: ${getCurrencySymbol(result.totalFhaLoanAmountCurrency)}${result.formattedTotalFhaLoanAmount}`,
        `Total monthly: ${getCurrencySymbol(result.totalMonthlyPaymentCurrency)}${result.formattedTotalMonthlyPayment}`,
        `Total cost: ${getCurrencySymbol(result.totalCostOfLoanCurrency)}${result.formattedTotalCostOfLoan}`,
        `Periodic rate: ${result.formattedPeriodicInterestRatePercent}%`,
        `Payments: ${result.numberOfPayments}`,
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
        <FhaLoanForm
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
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
