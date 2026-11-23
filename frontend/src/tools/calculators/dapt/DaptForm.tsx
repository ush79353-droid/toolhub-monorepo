'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DaptAgeBand,
  DaptFieldErrors,
  DaptInput,
  DaptResult,
} from './types';
import { AGE_OPTIONS, FACTOR_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: DaptInput;
  errors: DaptFieldErrors;
  result: DaptResult | null;
  onChange: (input: DaptInput) => void;
  onLoadExample: () => void;
}

export function DaptForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<DaptInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Select age and clinical factors to see the educational DAPT score.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Yeh 2016 / ACC–AHA educational score for patients who completed about
        12 months of DAPT after PCI without a major ischemic or bleeding event.
        It does not recommend therapy duration. Entries stay in your browser
        only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age ≥75 → score −2)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="Yeh/ACC points: under 65 → 0; 65–74 → −1; 75 or older → −2. The screenshot’s top band is shown as ≥75 so age 75 is scored correctly."
          />
        </legend>
        <div className="space-y-2" role="radiogroup" aria-label="Age band">
          {AGE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="dapt-age"
                className="h-4 w-4 accent-primary"
                checked={input.ageBand === opt.value}
                onChange={() => set({ ageBand: opt.value as DaptAgeBand })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2.5">
        {FACTOR_OPTIONS.map((factor) => (
          <label
            key={factor.key}
            className="flex cursor-pointer items-start gap-2 text-sm text-accent"
          >
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              checked={input[factor.key]}
              onChange={(e) => set({ [factor.key]: e.target.checked })}
            />
            <span>{factor.label}</span>
          </label>
        ))}
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Smoking: screenshot says “current or past”; Yeh counted current
          smoking or within the past year. Vein graft and CHF/LVEF&lt;30% add 2
          points each; stent diameter of exactly 3 mm does not add a point.
        </p>
      </div>

      <div>
        <div className={labelClass}>
          <span>DAPT score</span>
          <InfoTooltip
            label="DAPT score"
            text="Additive Yeh score from −2 to 10. In the derivation framing, totals ≥2 were associated with a more favorable prolonged-DAPT benefit/risk pattern — not a treatment order."
          />
        </div>
        <div
          className="flex h-11 items-center rounded-lg border border-border bg-muted/25 px-3 text-sm font-semibold tabular-nums text-primary"
          aria-live="polite"
          aria-label="DAPT score result"
        >
          {result ? result.formattedScore : '0'}
        </div>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result.highScoreBand
              ? 'Educational band: score ≥2 (higher ischemic-relative framing in Yeh 2016). Not a prescription.'
              : 'Educational band: score <2. Not a prescription to stop therapy.'}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
