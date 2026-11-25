'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  Ethnicity,
  FlowUnit,
  HeightUnit,
  PeakFlowFieldErrors,
  PeakFlowInput,
  PeakFlowResult,
  Sex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const sectionClass = 'rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4';

interface Props {
  input: PeakFlowInput;
  errors: PeakFlowFieldErrors;
  result: PeakFlowResult | null;
  onChange: (input: PeakFlowInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function FlowSelect({
  value,
  onChange,
  label,
}: {
  value: FlowUnit;
  onChange: (u: FlowUnit) => void;
  label: string;
}) {
  return (
    <select
      className={selectClass}
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as FlowUnit)}
    >
      <option value="L/s">L/s</option>
      <option value="L/min">L/min</option>
    </select>
  );
}

export function PeakFlowForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PeakFlowInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational predicted PEF from Hankinson NHANES III (or Nunn &amp; Gregg
        for Other). Not a diagnosis. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (female · 40 y · 165 cm · Caucasian)
        </button>
      </p>

      <section className={sectionClass} aria-labelledby="pf-patient">
        <h3 id="pf-patient" className="mb-3 text-sm font-semibold text-accent">
          Patient details
        </h3>

        <fieldset className="mb-3">
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-3">
            {(
              [
                ['female', 'Female'],
                ['male', 'Male'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="pf-sex"
                  checked={input.sex === value}
                  onChange={() => set({ sex: value as Sex })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mb-3">
          <label className={labelClass} htmlFor="pf-age">
            Age
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.ageYears ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="pf-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYears ?? ''}
              onChange={(e) => set({ ageYears: parseOptional(e.target.value) })}
            />
            <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
              years
            </span>
          </div>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-destructive">{errors.ageYears}</p>
          ) : null}
        </div>

        <div className="mb-3">
          <label className={labelClass} htmlFor="pf-height">
            Height
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.height ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="pf-height"
              className={inputClass}
              inputMode="decimal"
              value={input.height ?? ''}
              onChange={(e) => set({ height: parseOptional(e.target.value) })}
            />
            <select
              className={selectClass}
              aria-label="Height unit"
              value={input.heightUnit}
              onChange={(e) =>
                set({ heightUnit: e.target.value as HeightUnit })
              }
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
              <option value="m">m</option>
            </select>
          </div>
          {errors.height ? (
            <p className="mt-1 text-xs text-destructive">{errors.height}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Ethnicity</legend>
          <div className="flex flex-col gap-2">
            {(
              [
                ['caucasian', 'Caucasian'],
                ['africanAmerican', 'African-American'],
                ['mexicanAmerican', 'Mexican-American'],
                ['other', 'Other'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="pf-ethnicity"
                  checked={input.ethnicity === value}
                  onChange={() => set({ ethnicity: value as Ethnicity })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass} aria-labelledby="pf-results">
        <h3 id="pf-results" className="mb-3 text-sm font-semibold text-accent">
          Peak flow results
        </h3>

        <div className="mb-3">
          <div className={labelClass}>Estimated peak flow</div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result
                ? result.formattedEstimated.replace(/ (L\/s|L\/min)$/, '')
                : '—'}
            </div>
            <FlowSelect
              value={input.estimatedUnit}
              label="Estimated PEF unit"
              onChange={(estimatedUnit) => set({ estimatedUnit })}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className={labelClass} htmlFor="pf-measured">
            <span>Measured peak flow</span>
            <InfoTooltip
              label="Measured PEF"
              text="Your peak-flow meter reading in the selected unit. Compared with predicted PEF and personal best when entered."
            />
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.measuredPef ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="pf-measured"
              className={inputClass}
              inputMode="decimal"
              value={input.measuredPef ?? ''}
              onChange={(e) =>
                set({ measuredPef: parseOptional(e.target.value) })
              }
            />
            <FlowSelect
              value={input.measuredUnit}
              label="Measured PEF unit"
              onChange={(measuredUnit) => set({ measuredUnit })}
            />
          </div>
          {errors.measuredPef ? (
            <p className="mt-1 text-xs text-destructive">{errors.measuredPef}</p>
          ) : null}
        </div>

        <div>
          <div className={`${labelClass} gap-1.5`}>
            <span>% of estimated PEF</span>
            <InfoTooltip
              label="% estimated"
              text="Measured PEF ÷ predicted PEF × 100 after converting both values to L/s."
            />
          </div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result?.formattedPercentEstimated ?? '—'}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="pf-best">
        <h3 id="pf-best" className="mb-3 text-sm font-semibold text-accent">
          Personal best reading
        </h3>

        <div className="mb-3">
          <label className={labelClass} htmlFor="pf-best-input">
            <span>Personal best</span>
            <InfoTooltip
              label="Personal best"
              text="Your known personal-best PEF. % of personal best = measured ÷ best × 100."
            />
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.personalBest ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="pf-best-input"
              className={inputClass}
              inputMode="decimal"
              value={input.personalBest ?? ''}
              onChange={(e) =>
                set({ personalBest: parseOptional(e.target.value) })
              }
            />
            <FlowSelect
              value={input.personalBestUnit}
              label="Personal best unit"
              onChange={(personalBestUnit) => set({ personalBestUnit })}
            />
          </div>
          {errors.personalBest ? (
            <p className="mt-1 text-xs text-destructive">{errors.personalBest}</p>
          ) : null}
        </div>

        <div>
          <div className={`${labelClass} gap-1.5`}>
            <span>% of personal best</span>
            <InfoTooltip
              label="% personal best"
              text="Requires measured PEF and a personal best greater than zero."
            />
          </div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result?.formattedPercentBest ?? '—'}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="pf-diurnal">
        <h3 id="pf-diurnal" className="mb-3 text-sm font-semibold text-accent">
          Diurnal variability
        </h3>

        <div className="mb-3">
          <label className={labelClass} htmlFor="pf-max">
            <span>PEF maximum</span>
            <InfoTooltip
              label="PEF max"
              text="Highest PEF in the observation window (same unit basis as minimum)."
            />
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.pefMax ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="pf-max"
              className={inputClass}
              inputMode="decimal"
              value={input.pefMax ?? ''}
              onChange={(e) => set({ pefMax: parseOptional(e.target.value) })}
            />
            <FlowSelect
              value={input.maxUnit}
              label="PEF maximum unit"
              onChange={(maxUnit) => set({ maxUnit })}
            />
          </div>
          {errors.pefMax ? (
            <p className="mt-1 text-xs text-destructive">{errors.pefMax}</p>
          ) : null}
        </div>

        <div className="mb-3">
          <label className={labelClass} htmlFor="pf-min">
            <span>PEF minimum</span>
            <InfoTooltip
              label="PEF min"
              text="Lowest PEF in the same window. Must not exceed the maximum."
            />
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.pefMin ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="pf-min"
              className={inputClass}
              inputMode="decimal"
              value={input.pefMin ?? ''}
              onChange={(e) => set({ pefMin: parseOptional(e.target.value) })}
            />
            <FlowSelect
              value={input.minUnit}
              label="PEF minimum unit"
              onChange={(minUnit) => set({ minUnit })}
            />
          </div>
          {errors.pefMin ? (
            <p className="mt-1 text-xs text-destructive">{errors.pefMin}</p>
          ) : null}
        </div>

        <div>
          <div className={`${labelClass} gap-1.5`}>
            <span>Diurnal variability</span>
            <InfoTooltip
              label="Diurnal variability"
              text="Amplitude percent mean: (max − min) / ((max + min) / 2) × 100. Max = min → 0%."
            />
          </div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result?.formattedDiurnal ?? '—'}
            </div>
          </div>
        </div>
      </section>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      ) : null}
    </form>
  );
}
