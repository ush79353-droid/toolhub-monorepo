'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  KidneyStonePcnlFieldErrors,
  KidneyStonePcnlInput,
  KidneyStonePcnlResult,
} from './types';
import {
  CALYCES_OPTIONS,
  DENSITY_OPTIONS,
  OBSTRUCTION_OPTIONS,
  STONE_SIZE_OPTIONS,
  TRACT_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface FormProps {
  input: KidneyStonePcnlInput;
  errors: KidneyStonePcnlFieldErrors;
  result: KidneyStonePcnlResult | null;
  onChange: (input: KidneyStonePcnlInput) => void;
}

export function KidneyStonePcnlForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<KidneyStonePcnlInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Predicts approximate stone-free chance after first percutaneous
        nephrolithotomy from CT-based S.T.O.N.E. nephrolithometry (not the
        emergency renal-colic STONE score).
      </p>

      <section className={sectionClass} aria-label="STONE nephrolithometry inputs">
        <fieldset>
          <legend className={labelClass}>
            Stone size (mm²)
            <InfoTooltip text="Axial CT length × width in mm² (Okhunov S component)." />
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="Stone size">
            {STONE_SIZE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="stone-size"
                  className="h-4 w-4 accent-primary"
                  checked={input.stoneSize === opt.value}
                  onChange={() => set({ stoneSize: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Tract length (mm)
            <InfoTooltip text="Skin-to-stone distance on CT (Okhunov T)." />
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="Tract length">
            {TRACT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="tract-length"
                  className="h-4 w-4 accent-primary"
                  checked={input.tractLength === opt.value}
                  onChange={() => set({ tractLength: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Obstruction (hydronephrosis)
            <InfoTooltip text="Degree of collecting-system dilation (Okhunov O)." />
          </legend>
          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Obstruction"
          >
            {OBSTRUCTION_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="obstruction"
                  className="h-4 w-4 accent-primary"
                  checked={input.obstruction === opt.value}
                  onChange={() => set({ obstruction: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Number of calyces with calculi
            <InfoTooltip text="Involved calyces or full staghorn (Okhunov N)." />
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="Calyces">
            {CALYCES_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="calyces"
                  className="h-4 w-4 accent-primary"
                  checked={input.calyces === opt.value}
                  onChange={() => set({ calyces: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Stone density (HU)
            <InfoTooltip text="Mean Hounsfield units; Okhunov essence ≤950 vs >950." />
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="Density">
            {DENSITY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="density"
                  className="h-4 w-4 accent-primary"
                  checked={input.density === opt.value}
                  onChange={() => set({ density: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass} aria-label="STONE score result">
        <div>
          <p className={labelClass}>Result</p>
          <div className="flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3 text-sm tabular-nums text-accent">
            {result != null ? String(result.totalScore) : ''}
          </div>
        </div>
        {result ? (
          <p className="text-sm leading-relaxed text-accent">
            {result.explanation}{' '}
            <span className="text-xs text-muted-foreground">
              {result.disclaimer}
            </span>
          </p>
        ) : null}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </section>
    </form>
  );
}
