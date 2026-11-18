'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PercentageReturnFieldErrors,
  PercentageReturnInput,
  PercentageReturnResult,
  SolveMode,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function ReadOnlyShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
      {children}
    </div>
  );
}

interface PercentageReturnFormProps {
  input: PercentageReturnInput;
  errors: PercentageReturnFieldErrors;
  result: PercentageReturnResult | null;
  onChange: (input: PercentageReturnInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function PercentageReturnForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: PercentageReturnFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PercentageReturnInput>) => onChange({ ...input, ...patch });

  const onMoney =
    (key: 'investedAmount' | 'returnedAmount') => (event: ChangeEvent<HTMLInputElement>) => {
      set({ [key]: event.target.value });
    };

  const setSolveMode = (solveMode: SolveMode) => {
    set({ solveMode });
  };

  const moneyInput = (
    key: 'investedAmount' | 'returnedAmount',
    id: string,
    label: string,
    tip: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[key]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={input[key]}
            aria-invalid={Boolean(errors[key])}
            onChange={onMoney(key)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const moneyOutput = (id: string, label: string, tip: string, display: string) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <ReadOnlyShell>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={display}
            aria-live="polite"
          />
        </ReadOnlyShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  const percentOutput = (id: string, label: string, tip: string, display: string) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell>
        <input
          id={id}
          className={`${inputClass} cursor-default pr-8 font-semibold text-accent`}
          readOnly
          value={display}
          aria-live="polite"
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          %
        </span>
      </FieldShell>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="pct-basic-heading">
        <h3 id="pct-basic-heading" className={sectionTitleClass}>
          Basic percentage return
        </h3>

        {moneyInput(
          'investedAmount',
          'pct-invested',
          'Invested amount',
          'Starting amount invested. Must be greater than zero. Currency labels amounts only.'
        )}
        {moneyInput(
          'returnedAmount',
          'pct-returned',
          'Returned amount',
          'Ending value of the investment. May be zero for a total loss; cannot be negative.'
        )}
        {moneyOutput(
          'pct-gain-loss',
          'Gain or loss',
          'Returned amount − invested amount. Negative means a loss.',
          result?.gainOrLossDisplay ?? ''
        )}
        {percentOutput(
          'pct-return',
          'Percentage return',
          '((Returned − Invested) / Invested) × 100.',
          result?.percentageReturnDisplay ?? ''
        )}
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="pct-annualized-heading"
      >
        <h3 id="pct-annualized-heading" className={sectionTitleClass}>
          Annualized percentage return
        </h3>

        <fieldset className="space-y-2">
          <legend className="text-[13px] font-medium text-accent">I want to find...</legend>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="pct-solve-mode"
              checked={input.solveMode === 'annualized'}
              onChange={() => setSolveMode('annualized')}
            />
            annualized percentage return
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="pct-solve-mode"
              checked={input.solveMode === 'time-needed'}
              onChange={() => setSolveMode('time-needed')}
            />
            time needed
          </label>
        </fieldset>

        {input.solveMode === 'annualized' ? (
          <>
            <div>
              <label htmlFor="pct-start" className={labelClass}>
                Start date
                <InfoTooltip
                  label="Start date"
                  text="Investment start date. Used with end date or duration to measure holding years."
                />
              </label>
              <FieldShell error={errors.startDate}>
                <input
                  id="pct-start"
                  type="date"
                  className={inputClass}
                  value={input.startDate}
                  aria-invalid={Boolean(errors.startDate)}
                  onChange={(event) => set({ startDate: event.target.value })}
                />
              </FieldShell>
            </div>

            <div>
              <label htmlFor="pct-end" className={labelClass}>
                End date
                <InfoTooltip
                  label="End date"
                  text="Investment end date. Editing this updates investment duration from the calendar span."
                />
              </label>
              <FieldShell error={errors.endDate}>
                <input
                  id="pct-end"
                  type="date"
                  className={inputClass}
                  value={input.endDate}
                  aria-invalid={Boolean(errors.endDate)}
                  onChange={(event) =>
                    set({ endDate: event.target.value, durationSource: 'endDate' })
                  }
                />
              </FieldShell>
              {errors.endDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.endDate}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="pct-duration" className={labelClass}>
                Investment duration
                <InfoTooltip
                  label="Investment duration"
                  text="Holding period in years. Editing this updates the end date from the start date."
                />
              </label>
              <FieldShell error={errors.durationYears}>
                <input
                  id="pct-duration"
                  className={`${inputClass} pr-12`}
                  inputMode="decimal"
                  value={input.durationYears}
                  aria-invalid={Boolean(errors.durationYears)}
                  onChange={(event) =>
                    set({
                      durationYears: event.target.value,
                      durationSource: 'duration',
                    })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              {errors.durationYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.durationYears}</p>
              ) : null}
            </div>

            {percentOutput(
              'pct-annualized',
              'Annualized percentage return',
              '((Returned / Invested)^(1 / Years) − 1) × 100. Uses a 365.25-day year for date spans.',
              result?.annualizedReturnDisplay ?? ''
            )}
          </>
        ) : (
          <>
            <div>
              <label htmlFor="pct-rate-input" className={labelClass}>
                Annualized percentage return
                <InfoTooltip
                  label="Annualized percentage return"
                  text="Target compound annual rate (%) used to solve for time needed."
                />
              </label>
              <FieldShell error={errors.annualizedRatePercent}>
                <input
                  id="pct-rate-input"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.annualizedRatePercent}
                  aria-invalid={Boolean(errors.annualizedRatePercent)}
                  onChange={(event) => set({ annualizedRatePercent: event.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualizedRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.annualizedRatePercent}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="pct-time-needed" className={labelClass}>
                Time needed
                <InfoTooltip
                  label="Time needed"
                  text="Years = ln(Returned / Invested) / ln(1 + annualized rate)."
                />
              </label>
              <FieldShell>
                <input
                  id="pct-time-needed"
                  className={`${inputClass} cursor-default pr-12 font-semibold text-accent`}
                  readOnly
                  value={result?.timeNeededDisplay ?? ''}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
            </div>
          </>
        )}

        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            checked={input.compareEnabled}
            onChange={(event) => set({ compareEnabled: event.target.checked })}
          />
          Compare with another investment
        </label>
        {input.compareEnabled ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-accent">
            Comparison fields are not specified in the reference screenshot. No extra comparison
            inputs are shown until a verified field list is provided.
          </p>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
