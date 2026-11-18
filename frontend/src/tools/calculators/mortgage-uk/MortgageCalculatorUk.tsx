'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { MortgageUkForm } from './MortgageUkForm';
import {
  createDefaultInput,
  type MortgageUkFieldErrors,
  type MortgageUkInput,
  type MortgageUkResult,
} from './types';
import { validateMortgageUkInput } from './validation';

export function MortgageCalculatorUk({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateMortgageUkInput(defaults);
  const [input, setInput] = React.useState<MortgageUkInput>(() => defaults);
  const [errors, setErrors] = React.useState<MortgageUkFieldErrors>(() => initial.errors);
  const [result, setResult] = React.useState<MortgageUkResult | null>(() => initial.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: MortgageUkInput) => {
    setInput(next);
    const validation = validateMortgageUkInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateMortgageUkInput(fresh);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Home price: £${input.homePrice}`,
        `Deposit: ${input.depositPercent}% (£${result.formattedDepositAmount})`,
        `Loan amount: £${result.formattedLoanAmount}`,
        `Term: ${input.loanTermYears} years @ ${input.interestRatePercent}%`,
        `Interest only: £${result.formattedInterestOnlyMonthly}`,
        `Monthly repayment: £${result.formattedMonthlyRepayment}`,
        `Total out-of-pocket: £${result.formattedOutOfPocketMonthly}/mo · £${result.formattedOutOfPocketTotal} lifetime`,
        `Total interest: £${result.formattedTotalInterest}`,
        `Start: ${result.startLabel} · Payoff: ${result.payoffLabel}`,
        'Currency: fixed GBP (£) — no FX selectors in the reference.',
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
            UK mortgage repayment with optional taxes and insurance (fixed £)
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <MortgageUkForm
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
