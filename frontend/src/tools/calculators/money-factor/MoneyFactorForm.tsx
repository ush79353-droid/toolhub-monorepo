'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MoneyFactorFieldErrors,
  MoneyFactorInput,
  MoneyFactorSourceField,
} from './types';

interface MoneyFactorFormProps {
  input: MoneyFactorInput;
  errors: MoneyFactorFieldErrors;
  onChange: (field: MoneyFactorSourceField, value: string) => void;
  onReset: () => void;
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
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function MoneyFactorForm({
  input,
  errors,
  onChange,
  onReset,
}: MoneyFactorFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Interest rate ↔ money factor
        </legend>

        <div>
          <FieldLabel
            htmlFor="mf-interest"
            label="Interest rate"
            tip="Annual interest rate (%). Money factor = rate ÷ 2400."
          />
          <div className="relative">
            <input
              id="mf-interest"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRate}
              aria-invalid={Boolean(errors.interestRate)}
              onChange={(e) => onChange('interestRate', e.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.interestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="mf-factor"
            label="Money factor"
            tip="Unitless lease money factor. Interest rate (%) = money factor × 2400."
          />
          <input
            id="mf-factor"
            className={inputClass}
            inputMode="decimal"
            value={input.moneyFactor}
            aria-invalid={Boolean(errors.moneyFactor)}
            onChange={(e) => onChange('moneyFactor', e.target.value)}
          />
          {errors.moneyFactor ? (
            <p className="mt-1 text-xs text-rose-600">{errors.moneyFactor}</p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
