'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMaturityMoney } from './calculation';
import type {
  DurationUnit,
  MaturityValueFieldErrors,
  MaturityValueInput,
  MaturityValueResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface MaturityValueFormProps {
  input: MaturityValueInput;
  errors: MaturityValueFieldErrors;
  result: MaturityValueResult | null;
  onChange: (input: MaturityValueInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function MaturityValueForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: MaturityValueFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Maturity value = principal × (1 + annual rate)<sup>years</sup> with
        annual compounding. No extra deposits, fees, or taxes.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="mv-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for maturity value amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Money fields share one currency and scale (denomination only — no FX).
      </p>
      <p className="text-xs">
        <a
          href="#formula"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Maturity value formula
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Investment inputs
        </legend>

        <div>
          <label htmlFor="mv-principal" className={labelClass}>
            Principal
            <InfoTooltip
              label="Principal"
              text="The initial amount of money invested before interest is earned."
            />
          </label>
          <FieldShell error={errors.principal}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="mv-principal"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.principal}
              onChange={(e) =>
                onChange({ ...input, principal: e.target.value })
              }
              placeholder="2,000"
              aria-invalid={Boolean(errors.principal)}
            />
          </FieldShell>
          {errors.principal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.principal}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mv-rate" className={labelClass}>
            Interest rate
            <InfoTooltip
              label="Interest rate"
              text="The annual interest rate applied to the investment, expressed as a percentage."
            />
          </label>
          <FieldShell error={errors.interestRate}>
            <input
              id="mv-rate"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.interestRate}
              onChange={(e) =>
                onChange({ ...input, interestRate: e.target.value })
              }
              placeholder="3"
              aria-invalid={Boolean(errors.interestRate)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              % / yr
            </span>
          </FieldShell>
          {errors.interestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mv-duration" className={labelClass}>
            Time of investment
            <InfoTooltip
              label="Time of investment"
              text="The duration for which the principal remains invested."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.duration}>
              <input
                id="mv-duration"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.duration}
                onChange={(e) =>
                  onChange({ ...input, duration: e.target.value })
                }
                placeholder="2"
                aria-invalid={Boolean(errors.duration)}
              />
            </FieldShell>
            <select
              className="h-11 shrink-0 rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.durationUnit}
              aria-label="Investment duration unit"
              onChange={(e) =>
                onChange({
                  ...input,
                  durationUnit: e.target.value as DurationUnit,
                })
              }
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
          {errors.duration ? (
            <p className="mt-1 text-xs text-rose-600">{errors.duration}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mv-result" className={labelClass}>
            Maturity value
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="mv-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? formatMaturityMoney(result.maturityValue, input.currency)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result
                  ? `Maturity value ${result.formattedMaturityValue}`
                  : 'Maturity value unavailable'
              }
            />
          </FieldShell>
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
