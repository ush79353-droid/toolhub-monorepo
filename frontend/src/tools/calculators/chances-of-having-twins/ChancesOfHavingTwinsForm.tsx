'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { ChancesOfHavingTwinsResults } from './ChancesOfHavingTwinsResults';
import type {
  TwinsFieldErrors,
  TwinsInput,
  TwinsResult,
  TwinsStratumMode,
} from './types';
import { RACE_ETHNICITY_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const radioRowClass =
  'flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5';

interface Props {
  input: TwinsInput;
  errors: TwinsFieldErrors;
  result: TwinsResult | null;
  onChange: (input: TwinsInput) => void;
  onLoadExample: () => void;
}

export function ChancesOfHavingTwinsForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<TwinsInput>) => onChange({ ...input, ...patch });

  const setMode = (stratumMode: TwinsStratumMode) => {
    onChange({
      ...input,
      stratumMode,
      motherAgeYears: stratumMode === 'by_age' ? input.motherAgeYears : '',
      raceEthnicity: stratumMode === 'by_race' ? input.raceEthnicity : '',
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Look up a published US twin <strong className="font-semibold">birth</strong>{' '}
        rate for one demographic group. Rates count twin deliveries per 1,000 total
        births — not personal odds.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Choose <strong className="font-semibold text-accent">by maternal age</strong>{' '}
        or <strong className="font-semibold text-accent">by race and Hispanic origin</strong>.
        The tool shows a single CDC/NVSS stratum; it does not multiply age and race
        rates together. Entries stay in your browser; share uses the page URL only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age 32 → 33.2 per 1,000, ~3.32%, about 1 in 30)
        </button>
      </p>

      <fieldset className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Stratum
        </legend>
        <label className={radioRowClass}>
          <input
            type="radio"
            name="twins-stratum-mode"
            checked={input.stratumMode === 'by_age'}
            onChange={() => setMode('by_age')}
            className="h-4 w-4 shrink-0 accent-primary"
          />
          <span>By maternal age at birth</span>
        </label>
        <label className={radioRowClass}>
          <input
            type="radio"
            name="twins-stratum-mode"
            checked={input.stratumMode === 'by_race'}
            onChange={() => setMode('by_race')}
            className="h-4 w-4 shrink-0 accent-primary"
          />
          <span>By race and Hispanic origin</span>
        </label>
      </fieldset>

      {input.stratumMode === 'by_age' ? (
        <StratumFieldset>
          <label htmlFor="twins-mother-age" className={labelClass}>
            Mother&apos;s age at birth (years)
            <InfoTooltip
              label="Maternal age"
              text="Whole years, 12–55. Mapped to CDC 2024 age brackets for twin birth rates."
            />
          </label>
          <FieldShell error={errors.motherAgeYears}>
            <input
              id="twins-mother-age"
              className={inputClass}
              inputMode="numeric"
              aria-label="Mother age at birth in years"
              value={input.motherAgeYears}
              aria-invalid={Boolean(errors.motherAgeYears)}
              onChange={(e) => set({ motherAgeYears: e.target.value })}
            />
          </FieldShell>
          {errors.motherAgeYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.motherAgeYears}</p>
          ) : null}
        </StratumFieldset>
      ) : (
        <StratumFieldset>
          <label htmlFor="twins-race" className={labelClass}>
            Race and Hispanic origin
            <InfoTooltip
              label="Race and ethnicity"
              text="2024 NVSS twin birth rate for the selected US population group only."
            />
          </label>
          <select
            id="twins-race"
            className={selectClass}
            value={input.raceEthnicity}
            aria-invalid={Boolean(errors.raceEthnicity)}
            onChange={(e) =>
              set({
                raceEthnicity: e.target.value as TwinsInput['raceEthnicity'],
              })
            }
          >
            <option value="">Select a group</option>
            {RACE_ETHNICITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.raceEthnicity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.raceEthnicity}</p>
          ) : null}
        </StratumFieldset>
      )}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <ChancesOfHavingTwinsResults result={result} />
    </form>
  );
}

function StratumFieldset({ children }: { children: ReactNode }) {
  return (
    <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      {children}
    </fieldset>
  );
}

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}