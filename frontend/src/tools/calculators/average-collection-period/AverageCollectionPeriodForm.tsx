'use client';

import * as React from 'react';
import { ChevronDown, MoreHorizontal, RotateCcw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { averageAccountsReceivable } from './calculation';
import {
  isAverageArMethod,
  type AverageCollectionPeriodFieldErrors,
  type AverageCollectionPeriodInput,
  type AverageCollectionPeriodResult,
  type CalculationMethod,
} from './types';

interface AverageCollectionPeriodFormProps {
  input: AverageCollectionPeriodInput;
  errors: AverageCollectionPeriodFieldErrors;
  result: AverageCollectionPeriodResult | null;
  averageSectionOpen: boolean;
  copied: boolean;
  onAverageSectionOpenChange: (open: boolean) => void;
  onChange: (input: AverageCollectionPeriodInput) => void;
  onReset: () => void;
  onShare: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

const METHOD_OPTIONS: { value: CalculationMethod; label: string }[] = [
  { value: 'average-ar', label: 'Average accounts receivable' },
  { value: 'turnover-ratio', label: 'Receivables turnover ratio' },
];

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip?: string;
}) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
          {label}
        </label>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </div>
      <span className="text-muted-foreground/50" aria-hidden="true">
        <MoreHorizontal className="h-4 w-4" />
      </span>
    </div>
  );
}

function numberOrBlank(value: number): string | number {
  return Number.isFinite(value) ? value : '';
}

function formatDays(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

export function AverageCollectionPeriodForm({
  input,
  errors,
  result,
  averageSectionOpen,
  copied,
  onAverageSectionOpenChange,
  onChange,
  onReset,
  onShare,
}: AverageCollectionPeriodFormProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const set = (patch: Partial<AverageCollectionPeriodInput>) => onChange({ ...input, ...patch });
  const usingAverageAr = isAverageArMethod(input);
  const symbol = getCurrencySymbol(input.currency);

  const onNumber = (key: keyof AverageCollectionPeriodInput) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<AverageCollectionPeriodInput>);
    };

  const onBeginningOrEnding =
    (key: 'beginningReceivable' | 'endingReceivable') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      const nextValue = text === '' ? Number.NaN : Number(text);
      const beginning = key === 'beginningReceivable' ? nextValue : input.beginningReceivable;
      const ending = key === 'endingReceivable' ? nextValue : input.endingReceivable;
      const patch: Partial<AverageCollectionPeriodInput> = { [key]: nextValue };
      if (Number.isFinite(beginning) && Number.isFinite(ending)) {
        patch.averageReceivable = averageAccountsReceivable(beginning, ending);
      }
      set(patch);
    };

  const collectionDisplay =
    result?.defined && result.collectionPeriodDays !== null
      ? formatDays(result.collectionPeriodDays)
      : '';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-accent">Calculation method</legend>
        <div role="radiogroup" aria-label="Calculation method" className="space-y-2">
          {METHOD_OPTIONS.map((option) => {
            const active = input.method === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                  active
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="acp-method"
                  className="accent-[hsl(var(--primary))]"
                  checked={active}
                  value={option.value}
                  onChange={() => set({ method: option.value })}
                />
                <span className="font-medium text-accent">{option.label}</span>
              </label>
            );
          })}
        </div>
        {errors.method ? <p className="mt-1 text-xs text-rose-600">{errors.method}</p> : null}
      </fieldset>

      <div>
        <FieldLabel
          htmlFor="acp-duration"
          label="Duration"
          tip="Length of the sales period in days. A common full-year figure is 365."
        />
        <div className="relative">
          <input
            id="acp-duration"
            className={`${inputClass} pr-14`}
            inputMode="decimal"
            value={numberOrBlank(input.durationDays)}
            aria-invalid={Boolean(errors.durationDays)}
            onChange={onNumber('durationDays')}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            days
          </span>
        </div>
        {errors.durationDays ? (
          <p className="mt-1 text-xs text-rose-600">{errors.durationDays}</p>
        ) : null}
      </div>

      {usingAverageAr ? (
        <details
          className="rounded-xl border border-border bg-muted/20"
          open={averageSectionOpen}
          onToggle={(event) => onAverageSectionOpenChange(event.currentTarget.open)}
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                averageSectionOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
            Calculate average accounts receivable
          </summary>
          <div className="space-y-3.5 px-4 pb-4">
            <div>
              <FieldLabel
                htmlFor="acp-begin"
                label="Beginning accounts receivable"
                tip="Receivables at the start of the same period as the credit sales."
              />
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id="acp-begin"
                    className={`${inputClass} pl-8`}
                    inputMode="decimal"
                    value={numberOrBlank(input.beginningReceivable)}
                    aria-invalid={Boolean(errors.beginningReceivable)}
                    onChange={onBeginningOrEnding('beginningReceivable')}
                  />
                </div>
                <div className="w-[120px] shrink-0 sm:w-[130px]">
                  <CurrencySelect
                    id="acp-begin-currency"
                    value={input.currency}
                    onChange={(currency) => set({ currency })}
                  />
                </div>
              </div>
            </div>
            <div>
              <FieldLabel
                htmlFor="acp-end"
                label="Ending accounts receivable"
                tip="Receivables at the end of that period. Averaged with the beginning balance."
              />
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id="acp-end"
                    className={`${inputClass} pl-8`}
                    inputMode="decimal"
                    value={numberOrBlank(input.endingReceivable)}
                    aria-invalid={Boolean(errors.endingReceivable)}
                    onChange={onBeginningOrEnding('endingReceivable')}
                  />
                </div>
                <div className="w-[120px] shrink-0 sm:w-[130px]">
                  <CurrencySelect
                    id="acp-end-currency"
                    value={input.currency}
                    onChange={(currency) => set({ currency })}
                  />
                </div>
              </div>
            </div>
          </div>
        </details>
      ) : null}

      {usingAverageAr ? (
        <>
          <div>
            <FieldLabel
              htmlFor="acp-average"
              label="Average accounts receivable"
              tip="(Beginning + ending) ÷ 2, or enter the average directly. Uses the same currency as credit sales."
            />
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="acp-average"
                  className={`${inputClass} pl-8`}
                  inputMode="decimal"
                  value={numberOrBlank(input.averageReceivable)}
                  aria-invalid={Boolean(errors.averageReceivable)}
                  onChange={onNumber('averageReceivable')}
                />
              </div>
              <div className="w-[120px] shrink-0 sm:w-[130px]">
                <CurrencySelect
                  id="acp-average-currency"
                  value={input.currency}
                  onChange={(currency) => set({ currency })}
                />
              </div>
            </div>
            {errors.averageReceivable ? (
              <p className="mt-1 text-xs text-rose-600">{errors.averageReceivable}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="acp-sales"
              label="Total credit sales"
              tip="Credit sales for the period after returns and allowances. Do not include cash sales."
            />
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="acp-sales"
                  className={`${inputClass} pl-8`}
                  inputMode="decimal"
                  value={numberOrBlank(input.totalCreditSales)}
                  aria-invalid={Boolean(errors.totalCreditSales)}
                  onChange={onNumber('totalCreditSales')}
                />
              </div>
              <div className="w-[120px] shrink-0 sm:w-[130px]">
                <CurrencySelect
                  id="acp-sales-currency"
                  value={input.currency}
                  onChange={(currency) => set({ currency })}
                />
              </div>
            </div>
            {errors.totalCreditSales ? (
              <p className="mt-1 text-xs text-rose-600">{errors.totalCreditSales}</p>
            ) : null}
          </div>
        </>
      ) : (
        <div>
          <FieldLabel
            htmlFor="acp-turnover"
            label="Receivables turnover ratio"
            tip="How many times receivables turn over in the period: total credit sales ÷ average receivables."
          />
          <input
            id="acp-turnover"
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input.receivablesTurnoverRatio)}
            aria-invalid={Boolean(errors.receivablesTurnoverRatio)}
            onChange={onNumber('receivablesTurnoverRatio')}
          />
          {errors.receivablesTurnoverRatio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.receivablesTurnoverRatio}</p>
          ) : null}
        </div>
      )}

      <div>
        <FieldLabel
          htmlFor="acp-terms"
          label="Terms of credit"
          tip="Stated customer payment terms for comparison only. Not used in the collection-period formula."
        />
        <div className="relative">
          <input
            id="acp-terms"
            className={`${inputClass} pr-14`}
            inputMode="decimal"
            value={numberOrBlank(input.termsOfCreditDays)}
            aria-invalid={Boolean(errors.termsOfCreditDays)}
            onChange={onNumber('termsOfCreditDays')}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            days
          </span>
        </div>
        {errors.termsOfCreditDays ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termsOfCreditDays}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/10 p-4">
        <h3 className="mb-3 text-sm font-semibold text-accent">Results</h3>
        <FieldLabel
          htmlFor="acp-result"
          label="Average collection period"
          tip="Estimated days to collect receivables for the selected method."
        />
        <div className="relative">
          <input
            id="acp-result"
            className={`${inputClass} bg-muted/30 pr-14 text-accent`}
            readOnly
            value={collectionDisplay}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            days
          </span>
        </div>
      </div>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="border-t border-border/80 pt-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onShare}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Link Copied!' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center gap-1.5 rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={onReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-full justify-center text-xs font-normal text-muted-foreground hover:text-foreground"
              onClick={onReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
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
    </form>
  );
}
