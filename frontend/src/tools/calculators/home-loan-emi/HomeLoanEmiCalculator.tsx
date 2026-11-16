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
import { HomeLoanEmiForm } from './HomeLoanEmiForm';
import {
  createDefaultInput,
  type HomeLoanEmiFieldErrors,
  type HomeLoanEmiInput,
  type HomeLoanEmiResult,
} from './types';
import { validateHomeLoanEmiInput } from './validation';

const CURRENCY_NOTE =
  'Changing principal currency converts the loan amount using stored rates. EMI, total payable, and total interest currencies only re-express results. Term and interest rate are never converted.';

export function HomeLoanEmiCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<HomeLoanEmiInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<HomeLoanEmiFieldErrors>({});
  const [result, setResult] = React.useState<HomeLoanEmiResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const apply = (next: HomeLoanEmiInput) => {
    setInput(next);
    const validation = validateHomeLoanEmiInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const principalSymbol = getCurrencySymbol(input.currency);
  const emiSymbol = getCurrencySymbol(result?.emiCurrency ?? input.emiCurrency);
  const payableSymbol = getCurrencySymbol(
    result?.totalPayableCurrency ?? input.totalPayableCurrency
  );
  const interestSymbol = getCurrencySymbol(
    result?.totalInterestCurrency ?? input.totalInterestCurrency
  );
  const termLabel = input.termUnit === 'yrs' ? 'yrs' : 'mos';

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Principal: ${principalSymbol}${input.principal}`,
        `Loan term: ${input.loanTerm} ${termLabel} (${result.paymentCount} months)`,
        `Interest rate: ${input.interestRatePercent}%`,
        `EMI: ${emiSymbol}${result.formattedEmi}`,
        `Total amount payable: ${payableSymbol}${result.formattedTotalPayable}`,
        `Total interest due: ${interestSymbol}${result.formattedTotalInterest}`,
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
        <HomeLoanEmiForm
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
