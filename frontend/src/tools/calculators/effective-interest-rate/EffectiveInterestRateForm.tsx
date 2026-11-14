'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  type EffectiveInterestRateFieldErrors,
  type EffectiveInterestRateInput,
  type EffectiveInterestRateResult,
} from './types';

interface EffectiveInterestRateFormProps {
  input: EffectiveInterestRateInput;
  errors: EffectiveInterestRateFieldErrors;
  result: EffectiveInterestRateResult | null;
  balancesOpen: boolean;
  onBalancesOpen: (open: boolean) => void;
  onChange: (input: EffectiveInterestRateInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';
const readoutClass =
  'h-11 w-full rounded-lg border border-border bg-muted/10 px-3 pr-10 text-sm font-semibold tabular-nums text-accent';

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

export function EffectiveInterestRateForm({
  input,
  errors,
  result,
  balancesOpen,
  onBalancesOpen,
  onChange,
  onReset,
}: EffectiveInterestRateFormProps) {
  const set = (patch: Partial<EffectiveInterestRateInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section className="space-y-4" aria-labelledby="eir-rates-heading">
        <h3 id="eir-rates-heading" className="text-sm font-semibold text-accent">
          Interest rates
        </h3>

        <div>
          <FieldLabel
            htmlFor="eir-annual"
            label="Annual interest rate"
            tip="Nominal annual interest rate as a percent. Zero and negative rates are allowed when the math stays finite."
          />
          <div className="relative">
            <input
              id="eir-annual"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.annualInterestRate}
              aria-invalid={Boolean(errors.annualInterestRate)}
              onChange={(event) => set({ annualInterestRate: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRate}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="eir-compounding"
            label="Compounding frequency"
            tip="How many times interest compounds per year (n). Monthly uses n = 12."
          />
          <select
            id="eir-compounding"
            className={selectClass}
            value={input.compounding}
            aria-invalid={Boolean(errors.compounding)}
            onChange={(event) =>
              set({
                compounding: event.target
                  .value as EffectiveInterestRateInput['compounding'],
              })
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
            htmlFor="eir-periodic"
            label="Periodic rate"
            tip="Annual interest rate divided by compounding periods per year."
          />
          <div className="relative">
            <input
              id="eir-periodic"
              className={readoutClass}
              readOnly
              value={result ? result.formattedPeriodicRate : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div>
          <FieldLabel
            htmlFor="eir-eir"
            label="Effective interest rate (EIR)"
            tip="Annual effective rate from compounding: [(1 + r/(100×n))^n − 1] × 100."
          />
          <div className="relative">
            <input
              id="eir-eir"
              className={readoutClass}
              readOnly
              value={result ? result.formattedEir : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border" aria-label="Balances">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={balancesOpen}
          onClick={() => onBalancesOpen(!balancesOpen)}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${balancesOpen ? 'rotate-180' : ''}`}
          />
          Balances
        </button>
        {balancesOpen ? (
          <div className="border-t border-border px-3.5 py-3.5 text-sm text-muted-foreground">
            This calculator converts a nominal annual rate into a periodic rate and effective
            interest rate. It does not project account balances.
          </div>
        ) : null}
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
