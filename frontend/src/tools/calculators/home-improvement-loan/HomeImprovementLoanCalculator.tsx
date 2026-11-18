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
import { HomeImprovementLoanForm } from './HomeImprovementLoanForm';
import {
  createDefaultInput,
  type HomeImprovementLoanFieldErrors,
  type HomeImprovementLoanInput,
  type HomeImprovementLoanResult,
} from './types';
import { validateHomeImprovementLoanInput } from './validation';

const HOME_IMPROVEMENT_CURRENCY_NOTE =
  'Loan amount, application fee, and home loan fees each have their own currency. Mixed-currency fees are normalized into the loan currency before calculation. Interest rate, term, and fee percentages are never converted.';

export function HomeImprovementLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateHomeImprovementLoanInput(defaults, rates);
  const [input, setInput] = React.useState<HomeImprovementLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<HomeImprovementLoanFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<HomeImprovementLoanResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: HomeImprovementLoanInput) => {
    setInput(next);
    const validation = validateHomeImprovementLoanInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateHomeImprovementLoanInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available
    ? HOME_IMPROVEMENT_CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const feeSymbol = getCurrencySymbol(input.applicationFeeCurrency);
  const homeFeeSymbol = getCurrencySymbol(input.homeLoanFeesCurrency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.loanCurrency);

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Loan amount: ${loanSymbol}${input.loanAmount}`,
        `Loan term: ${input.termYears || '0'} yrs ${input.termMonths || '0'} mos`,
        `Interest rate: ${input.interestRatePercent}%`,
        `Application fee: ${feeSymbol}${input.applicationFee} (${input.applicationFeePercent}%)`,
        `Home loan fees: ${homeFeeSymbol}${input.homeLoanFees}`,
        `Monthly payment: ${resultSymbol}${result.formattedMonthlyPayment}`,
        `APR: ${result.formattedApr}%`,
        `Total interest: ${resultSymbol}${result.formattedTotalInterest}`,
        `Loan fees: ${resultSymbol}${result.formattedLoanFees}`,
        `Total payments: ${resultSymbol}${result.formattedTotalPayments}`,
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
        <HomeImprovementLoanForm
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
