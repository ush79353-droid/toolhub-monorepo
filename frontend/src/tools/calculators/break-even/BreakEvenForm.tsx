'use client';

import * as React from 'react';
import { ChevronDown, MoreHorizontal, RotateCcw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { BreakEvenFieldErrors, BreakEvenInput, BreakEvenResult } from './types';
import { EXAMPLE_REVENUE, EXAMPLE_UNITS } from './types';

interface BreakEvenFormProps {
  input: BreakEvenInput;
  errors: BreakEvenFieldErrors;
  result: BreakEvenResult | null;
  copied: boolean;
  onChange: (input: BreakEvenInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
  onShare: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

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
        {tip ? <InfoTooltip label={label} text={tip} align="left" /> : null}
      </div>
      <span className="text-muted-foreground/50" aria-hidden="true">
        <MoreHorizontal className="h-4 w-4" />
      </span>
    </div>
  );
}

function MoneyInput({
  id,
  value,
  symbol,
  currency,
  currencyId,
  error,
  onValueChange,
  onCurrencyChange,
  readOnly,
}: {
  id: string;
  value: string;
  symbol: string;
  currency: BreakEvenInput['currency'];
  currencyId: string;
  error?: string;
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: BreakEvenInput['currency']) => void;
  readOnly?: boolean;
}) {
  return (
    <>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} pl-8 ${readOnly ? 'bg-muted/10 font-semibold text-accent' : ''}`}
            inputMode="decimal"
            value={value}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-live={readOnly ? 'polite' : undefined}
            onChange={
              readOnly || !onValueChange
                ? undefined
                : (event) => onValueChange(event.target.value)
            }
          />
        </div>
        <div className="w-[120px] shrink-0 sm:w-[130px]">
          <CurrencySelect id={currencyId} value={currency} onChange={onCurrencyChange} />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </>
  );
}

export function BreakEvenForm({
  input,
  errors,
  result,
  copied,
  onChange,
  onCurrencyChange,
  onReset,
  onShare,
}: BreakEvenFormProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [marginOpen, setMarginOpen] = React.useState(true);
  const [breakEvenOpen, setBreakEvenOpen] = React.useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BreakEvenInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <div>
          <FieldLabel
            htmlFor="be-revenue"
            label="Revenue per unit"
            tip="Selling price charged for one unit."
          />
          <MoneyInput
            id="be-revenue"
            value={input.revenuePerUnit}
            symbol={symbol}
            currency={input.currency}
            currencyId="be-revenue-currency"
            error={errors.revenuePerUnit}
            onValueChange={(revenuePerUnit) => set({ revenuePerUnit })}
            onCurrencyChange={onCurrencyChange}
          />
        </div>
        <div>
          <FieldLabel
            htmlFor="be-cost"
            label="Cost per unit"
            tip="Variable cost to produce or buy one unit."
          />
          <MoneyInput
            id="be-cost"
            value={input.costPerUnit}
            symbol={symbol}
            currency={input.currency}
            currencyId="be-cost-currency"
            error={errors.costPerUnit}
            onValueChange={(costPerUnit) => set({ costPerUnit })}
            onCurrencyChange={onCurrencyChange}
          />
        </div>
        <div>
          <FieldLabel
            htmlFor="be-fixed"
            label="Fixed costs"
            tip="Costs that stay the same regardless of how many units you sell in the period."
          />
          <MoneyInput
            id="be-fixed"
            value={input.fixedCosts}
            symbol={symbol}
            currency={input.currency}
            currencyId="be-fixed-currency"
            error={errors.fixedCosts}
            onValueChange={(fixedCosts) => set({ fixedCosts })}
            onCurrencyChange={onCurrencyChange}
          />
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={marginOpen}
        onToggle={(event) => setMarginOpen(event.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <span>Margin and markup</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              marginOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </summary>
        <div className="grid grid-cols-1 gap-3 px-3.5 pb-3.5 sm:grid-cols-2 sm:px-4 sm:pb-4">
          <div>
            <FieldLabel
              htmlFor="be-margin"
              label="Margin"
              tip="Contribution per unit divided by revenue per unit, as a percent."
            />
            <div className="relative">
              <input
                id="be-margin"
                className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
                readOnly
                value={result?.formattedMargin ?? ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
                %
              </span>
            </div>
          </div>
          <div>
            <FieldLabel
              htmlFor="be-markup"
              label="Markup"
              tip="Contribution per unit divided by cost per unit, as a percent."
            />
            <div className="relative">
              <input
                id="be-markup"
                className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
                readOnly
                value={result?.formattedMarkup ?? ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
                %
              </span>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={breakEvenOpen}
        onToggle={(event) => setBreakEvenOpen(event.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <span>To break even</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              breakEvenOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </summary>
        <div className="space-y-3.5 px-3.5 pb-3.5 sm:px-4 sm:pb-4">
          <div>
            <FieldLabel
              htmlFor="be-units"
              label="You need to sell"
              tip="Ceiling of fixed costs divided by contribution per unit."
            />
            <div className="relative">
              <input
                id="be-units"
                className={`${inputClass} bg-muted/10 pr-14 font-semibold text-accent`}
                readOnly
                value={result?.formattedUnits ?? ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                units
              </span>
            </div>
          </div>
          <div>
            <FieldLabel
              htmlFor="be-break-revenue"
              label="With a revenue of"
              tip="Units to sell multiplied by revenue per unit."
            />
            <MoneyInput
              id="be-break-revenue"
              value={result?.formattedRevenue ?? ''}
              symbol={symbol}
              currency={input.currency}
              currencyId="be-break-revenue-currency"
              onCurrencyChange={onCurrencyChange}
              readOnly
            />
          </div>
        </div>
      </details>

      {errors.form || (result && !result.breakEvenDefined && result.explanation) ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form ?? result?.explanation}
        </p>
      ) : null}

      <div className="rounded-xl border border-border bg-white px-3.5 py-3 text-xs text-muted-foreground sm:px-4">
        <p className="font-medium text-accent">Check our examples:</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4">
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() => onChange({ ...EXAMPLE_UNITS, currency: input.currency })}
            >
              Example 1 (Number of units to break even)
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() => onChange({ ...EXAMPLE_REVENUE, currency: input.currency })}
            >
              Example 2 (Finding the break-even revenue)
            </button>
          </li>
        </ul>
      </div>

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
