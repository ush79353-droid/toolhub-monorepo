'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { BillableHoursForm } from './BillableHoursForm';
import {
  createDefaultDraft,
  type BillableHoursDraft,
  type BillableHoursFieldErrors,
  type BillableHoursResult,
} from './types';
import { RATE_TIME_UNITS, BILLABLE_TIME_UNITS } from './types';
import { validateBillableHoursInput } from './validation';

function draftsEqual(a: BillableHoursDraft, b: BillableHoursDraft): boolean {
  return (
    a.rate === b.rate &&
    a.rateCurrency === b.rateCurrency &&
    a.rateUnit === b.rateUnit &&
    a.time === b.time &&
    a.timeUnit === b.timeUnit &&
    a.value === b.value &&
    a.valueCurrency === b.valueCurrency
  );
}

const BILLABLE_HOURS_CURRENCY_NOTE =
  'Billable rate and billable value use independent currencies. Amounts are normalized into the rate currency before rate × time. Time units are never converted.';

function unitLabel(
  list: readonly { value: string; label: string }[],
  value: string
): string {
  return list.find((u) => u.value === value)?.label ?? value;
}

export function BillableHoursCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultDraft();
  const initial = validateBillableHoursInput(defaults, rates);
  const [baseline, setBaseline] = React.useState<BillableHoursDraft>(() => defaults);
  const [input, setInput] = React.useState<BillableHoursDraft>(() => defaults);
  const [errors, setErrors] = React.useState<BillableHoursFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<BillableHoursResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: BillableHoursDraft) => {
    setInput(next);
    const validation = validateBillableHoursInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultDraft();
    const validation = validateBillableHoursInput(fresh, rates);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const currencyNote = ratesStatus.available
    ? BILLABLE_HOURS_CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const dirty = !draftsEqual(input, baseline);
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Billable rate: ${getCurrencySymbol(result.calcCurrency)}${result.formattedRate}/${unitLabel(RATE_TIME_UNITS, result.rateUnit)}`,
        `Billable time: ${result.formattedTime} ${unitLabel(BILLABLE_TIME_UNITS, result.timeUnit)}`,
        `Billable value: ${getCurrencySymbol(result.valueCurrency)}${result.formattedValue}`,
        `Solved: ${result.solvedField}`,
        result.summaryText,
        currencyNote,
      ].join('\n')
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
            Rate × time · solve any one field · independent FX on money
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">{currencyNote}</p>
        <BillableHoursForm input={input} errors={errors} result={result} onChange={apply} />

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
