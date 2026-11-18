'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { VaMortgageForm } from './VaMortgageForm';
import {
  createDefaultInput,
  type VaMortgageFieldErrors,
  type VaMortgageInput,
  type VaMortgageResult,
} from './types';
import { validateVaMortgageInput } from './validation';

export function VaMortgageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateVaMortgageInput(defaults);
  const [input, setInput] = React.useState<VaMortgageInput>(() => defaults);
  const [errors, setErrors] = React.useState<VaMortgageFieldErrors>(() => initial.errors);
  const [result, setResult] = React.useState<VaMortgageResult | null>(() => initial.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: VaMortgageInput) => {
    setInput(next);
    const validation = validateVaMortgageInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateVaMortgageInput(fresh);
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
        `Down payment: $${result.formattedDownPayment}`,
        `VA funding fee (${result.formattedFundingFeeRatePercent}%): $${result.formattedFundingFee}`,
        `Loan amount: $${result.formattedLoanAmount}`,
        `Interest rate: ${input.interestRatePercent}%`,
        `Term: ${input.loanTermYears} years`,
        `Monthly pay: $${result.formattedMonthlyPayment}`,
        `Total of ${result.paymentCount} payments: $${result.formattedTotalOfPayments}`,
        `Total interest: $${result.formattedTotalInterest}`,
        'Currency: fixed USD ($) — no FX selectors in the reference.',
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
            Fixed-rate VA purchase estimate in USD using published VA funding-fee rates. No
            currency selectors in the reference.
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <VaMortgageForm
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
