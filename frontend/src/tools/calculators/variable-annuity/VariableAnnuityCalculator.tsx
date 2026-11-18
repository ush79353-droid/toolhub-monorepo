'use client';

import * as React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import {
  VariableAnnuityActions,
  VariableAnnuityForm,
} from './VariableAnnuityForm';
import {
  createDefaultInput,
  type VariableAnnuityFieldErrors,
  type VariableAnnuityInput,
  type VariableAnnuityResult,
} from './types';
import { validateVariableAnnuityInput } from './validation';

const FX_NOTE =
  'Starting balance, contribution, and annual income each have their own currency. Amounts are normalized into the starting-balance currency before annuity and tax math. Rates, ages, and durations are never converted.';

function inputsEqual(a: VariableAnnuityInput, b: VariableAnnuityInput): boolean {
  return (Object.keys(a) as (keyof VariableAnnuityInput)[]).every(
    (key) => a[key] === b[key]
  );
}

export function VariableAnnuityCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateVariableAnnuityInput(defaults, rates);
  const [baseline, setBaseline] = React.useState<VariableAnnuityInput>(() => defaults);
  const [input, setInput] = React.useState<VariableAnnuityInput>(() => defaults);
  const [errors, setErrors] = React.useState<VariableAnnuityFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<VariableAnnuityResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  const apply = (next: VariableAnnuityInput) => {
    setInput(next);
    const validation = validateVariableAnnuityInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateVariableAnnuityInput(fresh, rates);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const symbol = result ? getCurrencySymbol(result.currency) : '';
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        result.summaryText,
        `Opening balance: ${symbol}${result.formattedOpeningBalance}`,
        `Final balance before tax: ${symbol}${result.formattedFinalBalanceBeforeTax}`,
        `Final balance if taxable: ${symbol}${result.formattedFinalBalanceTaxable}`,
        `Total return: ${symbol}${result.formattedTotalReturn}`,
        `Contributions: ${result.numberOfContributions}`,
        `Annual contribution: ${symbol}${result.formattedAnnualContribution}`,
        `Total contribution: ${symbol}${result.formattedTotalContribution}`,
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
        <VariableAnnuityForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />
        <VariableAnnuityActions
          canShare={Boolean(summary)}
          shareLabel={copied ? 'Copied!' : 'Share result'}
          clearDisabled={!dirty}
          onShare={async () => {
            if (!summary) return;
            if (await copyTextToClipboard(summary)) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }
          }}
          onReload={handleReload}
          onClear={handleReload}
        />

        <div className="rounded-xl border border-border bg-muted/10 px-3.5 py-3">
          <p className="text-xs font-medium text-accent">Did we solve your problem today?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Yes
            </button>
            <button
              type="button"
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
