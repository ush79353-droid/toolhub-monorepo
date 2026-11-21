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
import { RvLoanForm } from './RvLoanForm';
import {
  createDefaultInput,
  type RvLoanFieldErrors,
  type RvLoanInput,
  type RvLoanResult,
} from './types';
import { validateRvLoanInput } from './validation';

const RV_LOAN_CURRENCY_NOTE =
  'RV price, down payment, loan amount, payment, total paid, and cost of loan each have their own currency. Price and down payment convert on change and normalize before financing. Result currencies only re-express calculated values. Term and interest rate are never converted.';

export function RvLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateRvLoanInput(defaults, rates);
  const [input, setInput] = React.useState<RvLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<RvLoanFieldErrors>(() => initial.errors);
  const [result, setResult] = React.useState<RvLoanResult | null>(() => initial.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: RvLoanInput) => {
    setInput(next);
    const validation = validateRvLoanInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateRvLoanInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available
    ? RV_LOAN_CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const priceSymbol = getCurrencySymbol(input.rvPriceCurrency);
  const downSymbol = getCurrencySymbol(input.downPaymentCurrency);
  const loanSymbol = getCurrencySymbol(input.loanAmountCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);
  const totalSymbol = getCurrencySymbol(input.totalPaidCurrency);
  const costSymbol = getCurrencySymbol(input.costOfLoanCurrency);

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `RV price: ${priceSymbol}${input.rvPrice || '0'}`,
        `Down payment: ${downSymbol}${input.downPayment || '0'}`,
        `Term: ${input.termYears || '0'} yrs ${input.termMonths || '0'} mos`,
        `Interest: ${input.annualInterestRatePercent}%/yr`,
        `Loan amount: ${loanSymbol}${result.formattedLoanAmount}`,
        `Payment: ${paymentSymbol}${result.formattedPayment} / mon`,
        `Total paid: ${totalSymbol}${result.formattedTotalPaid}`,
        `Cost of loan: ${costSymbol}${result.formattedCostOfLoan}`,
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
        <RvLoanForm
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
