'use client';

import * as React from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CashBackOrLowInterestForm } from './CashBackOrLowInterestForm';
import {
  createDefaultInput,
  type CashBackOrLowInterestFieldErrors,
  type CashBackOrLowInterestInput,
  type CashBackOrLowInterestResult,
} from './types';
import { validateCashBackOrLowInterestInput } from './validation';

export function CashBackOrLowInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateCashBackOrLowInterestInput(defaults);
  const [input, setInput] = React.useState<CashBackOrLowInterestInput>(() => defaults);
  const [errors, setErrors] = React.useState<CashBackOrLowInterestFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<CashBackOrLowInterestResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: CashBackOrLowInterestInput) => {
    setInput(next);
    const validation = validateCashBackOrLowInterestInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    apply(input);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateCashBackOrLowInterestInput(fresh);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Cash back: $${input.cashBackAmount} at ${input.highInterestRatePercent}%`,
        `Low interest: ${input.lowInterestRatePercent}%`,
        `Auto price: $${input.autoPrice} · Term: ${input.loanTermMonths} months`,
        `Down: $${input.downPayment} · Trade-in: $${input.tradeInValue}`,
        `Sales tax: ${input.salesTaxPercent}% · Fees: $${input.titleRegistrationFees}`,
        `Include fees in loan: ${input.includeAllFeesInLoan ? 'yes' : 'no'}`,
        result.verdictTitle,
        result.verdictExplanation,
        `Cash back monthly: $${result.cashBackOffer.formattedMonthlyPayment}`,
        `Cash back total cost: $${result.cashBackOffer.formattedTotalCost}`,
        `Low rate monthly: $${result.lowInterestOffer.formattedMonthlyPayment}`,
        `Low rate total cost: $${result.lowInterestOffer.formattedTotalCost}`,
        'Currency: fixed USD ($); no FX selectors in the reference.',
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
            Compare cash-back vs low-rate auto financing in fixed USD. Sales tax is entered
            manually; state selection does not invent rates.
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CashBackOrLowInterestForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onSubmit={handleSubmit}
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
