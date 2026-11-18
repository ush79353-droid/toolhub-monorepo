'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CagrChangeInValue, CagrDraft, CagrField, CagrFieldErrors } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const shellClass =
  'rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring';

interface CagrFormProps {
  draft: CagrDraft;
  errors: CagrFieldErrors;
  change: CagrChangeInValue | null;
  changeOpen: boolean;
  onChangeOpen: (open: boolean) => void;
  onFieldChange: (field: CagrField, value: string) => void;
  onCurrencyChange: (currency: CagrDraft['currency']) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  tip,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tip?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CagrForm({
  draft,
  errors,
  change,
  changeOpen,
  onChangeOpen,
  onFieldChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: CagrFormProps) {
  const symbol = getCurrencySymbol(draft.currency);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Compound Annual Growth Rate (CAGR)"
        htmlFor="cagr-rate"
        error={errors.cagrPercent}
        tip="Yearly compound growth rate. Leave blank to solve from initial, final, and periods."
      >
        <div className={`relative ${shellClass}`}>
          <input
            id="cagr-rate"
            inputMode="decimal"
            className={`${inputClass} pr-10`}
            value={draft.cagrPercent}
            aria-invalid={Boolean(errors.cagrPercent)}
            onChange={(event) => onFieldChange('cagrPercent', event.target.value)}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Number of periods"
        htmlFor="cagr-periods"
        error={errors.periods}
        tip="Holding length in years (or equal-length periods). Must be greater than zero."
      >
        <div className={shellClass}>
          <input
            id="cagr-periods"
            inputMode="decimal"
            className={inputClass}
            value={draft.periods}
            aria-invalid={Boolean(errors.periods)}
            onChange={(event) => onFieldChange('periods', event.target.value)}
          />
        </div>
      </FieldShell>

      <FieldShell
        label="Initial value"
        htmlFor="cagr-initial"
        error={errors.initialValue}
        tip="Starting amount. Must be greater than zero. Changing currency converts both monetary values together."
      >
        <div className="flex gap-2">
          <div className={`relative min-w-0 flex-1 ${shellClass}`}>
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              {symbol}
            </span>
            <input
              id="cagr-initial"
              inputMode="decimal"
              className={`${inputClass} pl-8`}
              value={draft.initialValue}
              aria-invalid={Boolean(errors.initialValue)}
              onChange={(event) => onFieldChange('initialValue', event.target.value)}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="cagr-initial-currency"
              value={draft.currency}
              onChange={onCurrencyChange}
              aria-label="Initial value currency"
            />
          </div>
        </div>
      </FieldShell>

      <FieldShell
        label="Final value"
        htmlFor="cagr-final"
        error={errors.finalValue}
        tip="Ending amount after the periods. Changing currency converts both monetary values together."
      >
        <div className="flex gap-2">
          <div className={`relative min-w-0 flex-1 ${shellClass}`}>
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              {symbol}
            </span>
            <input
              id="cagr-final"
              inputMode="decimal"
              className={`${inputClass} pl-8`}
              value={draft.finalValue}
              aria-invalid={Boolean(errors.finalValue)}
              onChange={(event) => onFieldChange('finalValue', event.target.value)}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="cagr-final-currency"
              value={draft.currency}
              onChange={onCurrencyChange}
              aria-label="Final value currency"
            />
          </div>
        </div>
      </FieldShell>

      {errors.form ? (
        <p className="text-xs text-red-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="rounded-xl border border-border bg-muted/20">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={changeOpen}
          onClick={() => onChangeOpen(!changeOpen)}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${changeOpen ? 'rotate-180' : ''}`}
          />
          Change in value
        </button>
        {changeOpen ? (
          <div className="space-y-2 border-t border-border px-3.5 py-3 text-sm text-foreground/85">
            {change ? (
              <>
                <p>
                  Absolute change:{' '}
                  <span className="font-medium tabular-nums text-accent">
                    {symbol}
                    {change.absoluteDisplay}
                  </span>
                </p>
                <p>
                  Percent change:{' '}
                  <span className="font-medium tabular-nums text-accent">
                    {change.percentDisplay}%
                  </span>
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Enter a valid initial and final value to see the change.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
