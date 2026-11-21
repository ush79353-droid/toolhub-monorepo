'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { CapRateForm } from './CapRateForm';
import { CapRateResults } from './CapRateResults';
import {
  createDefaultInput,
  type CapRateFieldErrors,
  type CapRateInput,
  type CapRateResult,
} from './types';
import { validateCapRateInput } from './validation';

function inputsEqual(a: CapRateInput, b: CapRateInput): boolean {
  return (
    a.propertyValue === b.propertyValue &&
    a.grossRentalIncome === b.grossRentalIncome &&
    a.incomePeriod === b.incomePeriod &&
    a.otherIncome === b.otherIncome &&
    a.vacancyRate === b.vacancyRate &&
    a.operatingExpenses === b.operatingExpenses &&
    a.reverseNoi === b.reverseNoi &&
    a.reverseCapRate === b.reverseCapRate &&
    a.requiredPropertyValue === b.requiredPropertyValue &&
    a.targetCapRate === b.targetCapRate &&
    a.currency === b.currency
  );
}

export function CapRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<CapRateInput>(() => defaults);
  const [input, setInput] = React.useState<CapRateInput>(() => defaults);
  const [errors, setErrors] = React.useState<CapRateFieldErrors>({});
  const [result, setResult] = React.useState<CapRateResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: CapRateInput) => {
    const validation = validateCapRateInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;
    apply({ ...input, currency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateCapRateInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const symbol = getCurrencySymbol(input.currency);
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        result.formattedCapRate !== null
          ? `Cap rate: ${result.formattedCapRate}%`
          : null,
        result.formattedNoi
          ? `Annual NOI: ${symbol}${result.formattedNoi} ${result.currency}`
          : null,
        result.formattedEffectiveGrossIncome
          ? `Effective gross income: ${symbol}${result.formattedEffectiveGrossIncome} ${result.currency}`
          : null,
        result.formattedExpenseRatio !== null
          ? `Operating expense ratio: ${result.formattedExpenseRatio}%`
          : null,
        result.formattedEstimatedPropertyValue
          ? `Estimated value (from cap rate): ${symbol}${result.formattedEstimatedPropertyValue} ${result.currency}`
          : null,
        result.formattedRequiredAnnualNoi
          ? `Required annual NOI: ${symbol}${result.formattedRequiredAnnualNoi} ${result.currency}`
          : null,
        'Formulas: Cap Rate = NOI / Value × 100; Value = NOI / (Rate/100); Required NOI = Value × Rate/100',
        'Debt service is excluded from NOI. Cap rate is not a complete investment return.',
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
      }
    }
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

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
            Estimate capitalization rate from NOI and property value, or reverse
            to a value and required income target.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CapRateForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCurrencyChange={handleCurrencyChange}
        />

        <CapRateResults result={result} />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReset}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
