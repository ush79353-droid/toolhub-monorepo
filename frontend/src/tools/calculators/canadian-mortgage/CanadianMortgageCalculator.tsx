'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CanadianMortgageForm } from './CanadianMortgageForm';
import {
  createDefaultInput,
  type CanadianMortgageFieldErrors,
  type CanadianMortgageInput,
  type CanadianMortgageResult,
} from './types';
import { validateCanadianMortgageInput } from './validation';

export function CanadianMortgageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateCanadianMortgageInput(defaults);
  const [input, setInput] = React.useState<CanadianMortgageInput>(() => defaults);
  const [errors, setErrors] = React.useState<CanadianMortgageFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<CanadianMortgageResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: CanadianMortgageInput) => {
    setInput(next);
    const validation = validateCanadianMortgageInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: CanadianMortgageInput) => apply(next);

  const handleCalculate = () => apply(input);

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateCanadianMortgageInput(fresh);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Home price: $${result.formattedHomePrice}`,
        `Down payment: ${input.downPaymentPercent}% ($${result.formattedDownPayment})`,
        `Loan amount: $${result.formattedLoanAmount}`,
        `Term: ${input.loanTermYears} years (${result.paymentCount} payments)`,
        `Interest rate: ${input.interestRatePercent}% (Canadian semi-annual compounding)`,
        `Monthly mortgage payment: $${result.formattedMonthlyMortgagePayment}`,
        `Total mortgage payments: $${result.formattedTotalMortgagePayments}`,
        `Total interest: $${result.formattedTotalInterest}`,
        `Monthly out-of-pocket: $${result.formattedMonthlyOutOfPocket}`,
        `Total out-of-pocket: $${result.formattedTotalOutOfPocket}`,
        `Payoff date: ${result.formattedPayoffDate}`,
        'Currency: fixed dollar ($) formatting — no FX selectors in the reference.',
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
            Canadian fixed-rate mortgage with semi-annual compounding. Dollar amounts use fixed $
            formatting (no currency selectors in the reference).
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CanadianMortgageForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCalculate={handleCalculate}
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
