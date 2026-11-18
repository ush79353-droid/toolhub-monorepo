'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { FutureSalaryForm } from './FutureSalaryForm';
import {
  createDefaultInput,
  type FutureSalaryFieldErrors,
  type FutureSalaryInput,
  type FutureSalaryResult,
} from './types';

const FX_NOTE =
  'Current salary, expected future salary, and real future salary each have their own currency. Growth %, inflation %, and years are never FX-converted.';

function inputsEqual(a: FutureSalaryInput, b: FutureSalaryInput): boolean {
  return (
    a.currentSalary === b.currentSalary &&
    a.currentSalaryCurrency === b.currentSalaryCurrency &&
    a.salaryGrowthPercent === b.salaryGrowthPercent &&
    a.years === b.years &&
    a.futureSalaryCurrency === b.futureSalaryCurrency &&
    a.inflationPercent === b.inflationPercent &&
    a.realSalaryCurrency === b.realSalaryCurrency &&
    a.futureOpen === b.futureOpen &&
    a.realOpen === b.realOpen
  );
}

export function FutureSalaryCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<FutureSalaryInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<FutureSalaryInput>(() => defaults);
  const [errors, setErrors] = React.useState<FutureSalaryFieldErrors>({});
  const [result, setResult] = React.useState<FutureSalaryResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: FutureSalaryInput) => {
    setConversionError(null);
    setInput(next);
    setErrors({});
    setResult(null);
  };

  const handleCurrentSalaryCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currentSalaryCurrency) return;
    apply({ ...input, currentSalaryCurrency: next });
  };

  const handleFutureSalaryCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.futureSalaryCurrency) return;
    apply({ ...input, futureSalaryCurrency: next });
  };

  const handleRealSalaryCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.realSalaryCurrency) return;
    apply({ ...input, realSalaryCurrency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setConversionError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        input.currentSalary.trim()
          ? `Current salary: ${getCurrencySymbol(input.currentSalaryCurrency)}${input.currentSalary} ${input.currentSalaryCurrency}`
          : null,
        input.salaryGrowthPercent.trim()
          ? `Average salary change: ${input.salaryGrowthPercent}%/yr`
          : null,
        input.years.trim() ? `Years: ${input.years}` : null,
        `Expected future salary: ${getCurrencySymbol(result.futureSalaryCurrency)}${result.formattedFutureSalary} ${result.futureSalaryCurrency}`,
        input.inflationPercent.trim()
          ? `Average inflation: ${input.inflationPercent}%/yr`
          : null,
        `Real future salary: ${getCurrencySymbol(result.realSalaryCurrency)}${result.formattedRealSalary} ${result.realSalaryCurrency}`,
        FX_NOTE,
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
          <p className="text-xs font-normal text-muted-foreground">{FX_NOTE}</p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <FutureSalaryForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCurrentSalaryCurrencyChange={handleCurrentSalaryCurrencyChange}
          onFutureSalaryCurrencyChange={handleFutureSalaryCurrencyChange}
          onRealSalaryCurrencyChange={handleRealSalaryCurrencyChange}
          conversionError={conversionError}
        />

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
