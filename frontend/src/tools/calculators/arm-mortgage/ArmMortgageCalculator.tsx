'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { ArmMortgageForm } from './ArmMortgageForm';
import { ArmMortgageResults } from './ArmMortgageResults';
import { calculateArmMortgage } from './calculation';
import { createDefaultArmInput, type ArmFieldErrors, type ArmMortgageInput, type ArmMortgageResult } from './types';
import { validateArmInput } from './validation';

function todayIso(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

export function ArmMortgageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ArmMortgageInput>(() => createDefaultArmInput(todayIso()));
  const [errors, setErrors] = React.useState<ArmFieldErrors>({});
  const [result, setResult] = React.useState<ArmMortgageResult | null>(() =>
    calculateArmMortgage(input)
  );
  const [copied, setCopied] = React.useState(false);

  const run = (next: ArmMortgageInput) => {
    const validation = validateArmInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateArmMortgage(next) : null);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Initial P&I: ${formatCurrencyValue(result.initialPaymentCents / 100, result.currency)}`,
        `First reset payment (assumption): ${
          result.firstAdjustedPaymentCents
            ? formatCurrencyValue(result.firstAdjustedPaymentCents / 100, result.currency)
            : 'n/a'
        }`,
        `Projected rate at first reset: ${
          result.projectedRateAfterFirstReset === null ? 'n/a' : `${result.projectedRateAfterFirstReset.toFixed(3)}%`
        }`,
        `Maximum permitted rate: ${result.maximumPermittedRate.toFixed(3)}%`,
        `Highest payment if caps bind: ${formatCurrencyValue(result.contractualMaxPaymentCents / 100, result.currency)}`,
        `Total interest on this assumption: ${formatCurrencyValue(result.totalInterestCents / 100, result.currency)}`,
        'Later rates are user assumptions, not a forecast.',
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
          <p className="text-xs font-normal text-muted-foreground">Formatting currency only</p>
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <CurrencySelect
              id="arm-currency"
              value={input.currency}
              onChange={(currency) => {
                const next = { ...input, currency };
                setInput(next);
                run(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ArmMortgageForm
          input={input}
          errors={errors}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={() => {
            const fresh = createDefaultArmInput(todayIso());
            setInput(fresh);
            setErrors({});
            setResult(calculateArmMortgage(fresh));
          }}
        />
        <ArmMortgageResults
          result={result}
          copied={copied}
          onCopy={async () => {
            if (!summary) return;
            if (await copyTextToClipboard(summary)) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }
          }}
        />
      </div>
    </section>
  );
}
