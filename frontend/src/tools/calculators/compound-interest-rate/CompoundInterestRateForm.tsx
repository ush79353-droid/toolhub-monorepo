'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { formatCurrencyValue, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  type CompoundInterestRateFieldErrors,
  type CompoundInterestRateInput,
  type CompoundInterestRateResult,
  type CompoundingFrequency,
} from './types';
import { parseNonNegativeInt, parseOptionalNumber } from './validation';

export interface CompoundInterestRateDraft {
  initialBalance: string;
  finalBalance: string;
  compounding: CompoundingFrequency;
  termYears: string;
  termMonths: string;
  currency: CompoundInterestRateInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring';
const selectClass = `${inputClass} pr-8`;
const readoutClass =
  'h-11 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm font-semibold tabular-nums text-accent';

function formatAmount(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

export function inputToDraft(input: CompoundInterestRateInput): CompoundInterestRateDraft {
  return {
    initialBalance: formatAmount(input.initialBalance),
    finalBalance: formatAmount(input.finalBalance),
    compounding: input.compounding,
    termYears: formatAmount(input.termYears),
    termMonths: formatAmount(input.termMonths),
    currency: input.currency,
  };
}

export function draftToInput(draft: CompoundInterestRateDraft): CompoundInterestRateInput {
  return {
    initialBalance: parseOptionalNumber(draft.initialBalance),
    finalBalance: parseOptionalNumber(draft.finalBalance),
    compounding: draft.compounding,
    termYears: parseNonNegativeInt(draft.termYears),
    termMonths: parseNonNegativeInt(draft.termMonths),
    currency: draft.currency,
  };
}

interface CompoundInterestRateFormProps {
  draft: CompoundInterestRateDraft;
  errors: CompoundInterestRateFieldErrors;
  result: CompoundInterestRateResult | null;
  onDraftChange: (draft: CompoundInterestRateDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      <span>{label}</span>
      <InfoTooltip label={label} text={tip} />
    </label>
  );
}

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  currency,
  onValueChange,
  onCurrencyChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  currency: CompoundInterestRateDraft['currency'];
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: CompoundInterestRateDraft['currency']) => void;
}) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} tip={tip} />
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} pl-10`}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(event) => onValueChange(event.target.value)}
          />
        </div>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function Readout({
  id,
  label,
  tip,
  value,
  suffix,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  suffix?: ReactNode;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} tip={tip} />
      <div className="flex gap-2">
        <input id={id} className={readoutClass} readOnly value={value} aria-live="polite" />
        {suffix}
      </div>
    </div>
  );
}

export function CompoundInterestRateForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: CompoundInterestRateFormProps) {
  const patch = (next: Partial<CompoundInterestRateDraft>) =>
    onDraftChange({ ...draft, ...next });
  const show = result?.defined ? result : null;
  const surplusText =
    show && Number.isFinite(show.surplus)
      ? formatCurrencyValue(show.surplus, draft.currency)
      : '—';
  const rateText =
    show && show.annualNominalRatePercent !== null
      ? String(show.annualNominalRatePercent)
      : '—';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <MoneyField
        id="cir-initial"
        label="Initial balance"
        tip="Starting principal before compounding. Must be greater than zero."
        value={draft.initialBalance}
        error={errors.initialBalance}
        currency={draft.currency}
        onValueChange={(initialBalance) => patch({ initialBalance })}
        onCurrencyChange={(currency) => patch({ currency })}
      />
      <MoneyField
        id="cir-final"
        label="Final balance"
        tip="Ending balance after compounding. Must be greater than zero. Below the initial balance yields a negative rate."
        value={draft.finalBalance}
        error={errors.finalBalance}
        currency={draft.currency}
        onValueChange={(finalBalance) => patch({ finalBalance })}
        onCurrencyChange={(currency) => patch({ currency })}
      />
      <Readout
        id="cir-surplus"
        label="Surplus"
        tip="Final balance minus initial balance."
        value={surplusText}
        suffix={
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="cir-surplus-currency"
              value={draft.currency}
              onChange={(currency) => patch({ currency })}
              aria-label="Surplus currency"
            />
          </div>
        }
      />

      <div>
        <FieldLabel
          htmlFor="cir-compounding"
          label="Compounding frequency"
          tip="How many times interest compounds each year (n in the rate formula)."
        />
        <select
          id="cir-compounding"
          className={selectClass}
          value={draft.compounding}
          aria-invalid={Boolean(errors.compounding)}
          onChange={(event) =>
            patch({ compounding: event.target.value as CompoundingFrequency })
          }
        >
          {COMPOUNDING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.compounding ? (
          <p className="mt-1 text-xs text-rose-600">{errors.compounding}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="cir-years"
          label="Term"
          tip="Investment length as whole years and months. Total duration must be greater than zero."
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              id="cir-years"
              className={`${inputClass} pr-12`}
              inputMode="numeric"
              value={draft.termYears}
              aria-invalid={Boolean(errors.termYears)}
              aria-label="Term years"
              onChange={(event) => patch({ termYears: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              yrs
            </span>
          </div>
          <div className="relative">
            <input
              id="cir-months"
              className={`${inputClass} pr-12`}
              inputMode="numeric"
              value={draft.termMonths}
              aria-invalid={Boolean(errors.termMonths)}
              aria-label="Term months"
              onChange={(event) => patch({ termMonths: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              mos
            </span>
          </div>
        </div>
        {errors.termYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
        ) : null}
        {errors.termMonths ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="cir-rate"
          label="Compound interest rate"
          tip="Solved annual nominal rate: n × [(FV / PV)^(1 / (n × t)) − 1] × 100."
        />
        <div className="relative">
          <input
            id="cir-rate"
            className={`${readoutClass} pr-10`}
            readOnly
            value={rateText}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 px-5 text-sm font-medium">
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 px-5 text-sm font-medium"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
