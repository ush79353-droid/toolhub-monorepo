'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HeartRateBand,
  RevisedGenevaFieldErrors,
  RevisedGenevaInput,
  RevisedGenevaResult,
  YesNo,
} from './types';
import { HEART_RATE_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: RevisedGenevaInput;
  errors: RevisedGenevaFieldErrors;
  result: RevisedGenevaResult | null;
  onChange: (input: RevisedGenevaInput) => void;
  onLoadExample: () => void;
}

export function RevisedGenevaForm({
  input,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<RevisedGenevaInput>) =>
    onChange({ ...input, ...patch });

  const ynRadios = (
    name: string,
    value: YesNo,
    onPick: (v: YesNo) => void,
  ) => (
    <div className="mt-1 flex gap-4">
      {(['yes', 'no'] as const).map((v) => (
        <label
          key={v}
          className="flex cursor-pointer items-center gap-2 text-sm text-accent"
        >
          <input
            type="radio"
            name={name}
            className="h-4 w-4 accent-primary"
            checked={value === v}
            onChange={() => onPick(v)}
          />
          <span>{v === 'yes' ? 'Yes' : 'No'}</span>
        </label>
      ))}
    </div>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational revised Geneva score (Le Gal 2006) for PE pretest
        probability. It does not diagnose PE or order imaging. Entries stay in
        your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age &gt;65 + surgery + HR ≥95 → score 8)
        </button>
      </p>

      <details open className="rounded-xl border border-border bg-white">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-semibold text-accent marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Risk factors
            <span className="text-muted-foreground" aria-hidden>
              ▾
            </span>
          </span>
        </summary>
        <div className="space-y-3 border-t border-border px-3 py-3">
          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>Age</span>
              <InfoTooltip
                label="Age"
                text="Age greater than 65 years scores 1 point (revised Geneva)."
              />
            </legend>
            <label className="mt-1 flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={input.ageOver65}
                onChange={(e) => set({ ageOver65: e.target.checked })}
              />
              <span>Over 65 years</span>
            </label>
          </fieldset>

          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>Surgery or bone fracture</span>
              <InfoTooltip
                label="Surgery or bone fracture"
                text="Surgery or fracture within the past month scores 2 points."
              />
            </legend>
            <label className="mt-1 flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={input.surgeryOrFractureLastMonth}
                onChange={(e) =>
                  set({ surgeryOrFractureLastMonth: e.target.checked })
                }
              />
              <span>Within the last month</span>
            </label>
          </fieldset>

          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>Malignant condition</span>
              <InfoTooltip
                label="Malignant condition"
                text="Active malignancy (ongoing treatment, treatment within 6 months, or palliative) scores 2 points."
              />
            </legend>
            <label className="mt-1 flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={input.activeMalignancy}
                onChange={(e) => set({ activeMalignancy: e.target.checked })}
              />
              <span>Active</span>
            </label>
          </fieldset>

          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>History of DVT or PE</span>
              <InfoTooltip
                label="History of DVT or PE"
                text="Previous deep-vein thrombosis or pulmonary embolism scores 3 points."
              />
            </legend>
            {ynRadios('rgs-prior', input.priorDvtOrPe, (v) =>
              set({ priorDvtOrPe: v }),
            )}
          </fieldset>
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-white">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-semibold text-accent marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Clinical findings
            <span className="text-muted-foreground" aria-hidden>
              ▾
            </span>
          </span>
        </summary>
        <div className="space-y-3 border-t border-border px-3 py-3">
          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>Heart rate</span>
              <InfoTooltip
                label="Heart rate"
                text="Published bands: &lt;75 → 0; 75–94 → 3; ≥95 → 5 points. Pulse 95 scores the ≥95 band."
              />
            </legend>
            <div
              className="mt-1 space-y-2"
              role="radiogroup"
              aria-label="Heart rate band"
            >
              {HEART_RATE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="rgs-hr"
                    className="h-4 w-4 accent-primary"
                    checked={input.heartRateBand === opt.value}
                    onChange={() =>
                      set({ heartRateBand: opt.value as HeartRateBand })
                    }
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>Unilateral lower limb pain?</span>
              <InfoTooltip
                label="Unilateral lower limb pain"
                text="Unilateral lower-limb pain scores 3 points."
              />
            </legend>
            {ynRadios('rgs-limb-pain', input.unilateralLowerLimbPain, (v) =>
              set({ unilateralLowerLimbPain: v }),
            )}
          </fieldset>

          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>
                Pain on deep venous palpation AND unilateral edema?
              </span>
              <InfoTooltip
                label="Deep venous tenderness with edema"
                text="Published revised Geneva awards 4 points only when both deep venous palpation pain and unilateral edema are present (AND, not OR)."
              />
            </legend>
            {ynRadios(
              'rgs-combined',
              input.deepVenousPainAndUnilateralEdema,
              (v) => set({ deepVenousPainAndUnilateralEdema: v }),
            )}
          </fieldset>

          <fieldset className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>Hemoptysis?</span>
              <InfoTooltip
                label="Hemoptysis"
                text="Hemoptysis scores 2 points."
              />
            </legend>
            {ynRadios('rgs-hemo', input.hemoptysis, (v) =>
              set({ hemoptysis: v }),
            )}
          </fieldset>
        </div>
      </details>

      {result ? (
        <div
          className="space-y-3 rounded-xl border border-border bg-muted/15 px-4 py-3"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-accent">Result</p>
          <div className="flex items-center gap-3">
            <div className="flex h-11 min-w-11 items-center justify-center rounded-lg bg-primary/15 px-2 text-xl font-bold tabular-nums text-primary">
              {result.formattedScore}
            </div>
            <p className="text-sm text-accent">Revised Geneva Score</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              2-level scoring system
            </p>
            <p className="text-sm font-medium text-foreground">
              {result.twoLevelTitle}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.twoLevelDetail}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              3-level scoring system
            </p>
            <p className="text-sm font-medium text-foreground">
              {result.threeLevelTitle}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.threeLevelDetail}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : null}
    </form>
  );
}
