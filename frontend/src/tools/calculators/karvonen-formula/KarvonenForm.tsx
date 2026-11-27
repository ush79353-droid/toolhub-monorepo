'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  KarvonenFieldErrors,
  KarvonenInput,
  KarvonenResult,
  KnowMaxHr,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: KarvonenInput;
  errors: KarvonenFieldErrors;
  result: KarvonenResult | null;
  onChange: (input: KarvonenInput) => void;
}

export function KarvonenForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<KarvonenInput>) => onChange({ ...input, ...patch });
  const knowMax = input.knowMaxHr === 'yes';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Karvonen inputs">
        <div>
          <label className={labelClass} htmlFor="karvonen-rhr">
            Resting heart rate
            <InfoTooltip text="Heart rate at rest in beats per minute (bpm), typically measured seated after several minutes of quiet rest." />
          </label>
          <FieldShell error={errors.restingHrText}>
            <input
              id="karvonen-rhr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.restingHrText}
              onChange={(e) => set({ restingHrText: e.target.value })}
              aria-invalid={Boolean(errors.restingHrText)}
            />
            <span className={unitFixed}>bpm</span>
          </FieldShell>
          {errors.restingHrText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.restingHrText}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Do you know the maximum HR?</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {(
              [
                ['yes', 'Yes'],
                ['no', 'No'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="karvonen-know-max"
                  checked={input.knowMaxHr === value}
                  onChange={() => set({ knowMaxHr: value as KnowMaxHr })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {!knowMax ? (
          <div>
            <label className={labelClass} htmlFor="karvonen-age">
              Age
              <InfoTooltip text="Whole years. Used only when maximum HR is unknown: Fox estimate MHR = 220 − age." />
            </label>
            <FieldShell error={errors.ageText}>
              <input
                id="karvonen-age"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.ageText}
                onChange={(e) => set({ ageText: e.target.value })}
                aria-invalid={Boolean(errors.ageText)}
              />
              <span className={unitFixed}>years</span>
            </FieldShell>
            {errors.ageText ? (
              <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="karvonen-mhr">
            Maximum heart rate
            <InfoTooltip
              text={
                knowMax
                  ? 'Measured or known maximum heart rate in bpm.'
                  : 'Estimated as 220 − age when you select No above (Fox / classic Karvonen teaching estimate).'
              }
            />
          </label>
          <FieldShell error={errors.maximumHrText} muted={!knowMax}>
            <input
              id="karvonen-mhr"
              type="text"
              inputMode="decimal"
              readOnly={!knowMax}
              tabIndex={knowMax ? undefined : 0}
              className={`${inputClass}${!knowMax ? ' text-muted-foreground' : ''}`}
              value={
                knowMax
                  ? input.maximumHrText
                  : (result?.formattedMaximumHr ?? '')
              }
              onChange={(e) =>
                knowMax ? set({ maximumHrText: e.target.value }) : undefined
              }
              aria-invalid={Boolean(errors.maximumHrText)}
              aria-readonly={!knowMax ? 'true' : undefined}
            />
            <span className={unitFixed}>bpm</span>
          </FieldShell>
          {errors.maximumHrText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.maximumHrText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="karvonen-intensity">
            Intensity
            <InfoTooltip text="Exercise intensity as a percent of heart rate reserve (0–100). Screenshot default is 70%." />
          </label>
          <FieldShell error={errors.intensityText}>
            <input
              id="karvonen-intensity"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.intensityText}
              onChange={(e) => set({ intensityText: e.target.value })}
              aria-invalid={Boolean(errors.intensityText)}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.intensityText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.intensityText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="karvonen-target">
            Target heart rate
            <InfoTooltip text="THR = resting HR + (intensity/100) × heart rate reserve." />
          </label>
          <FieldShell muted>
            <input
              id="karvonen-target"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedTargetHr ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>bpm</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="karvonen-reserve">
            Heart rate reserve
            <InfoTooltip text="HRR = maximum HR − resting HR (bpm)." />
          </label>
          <FieldShell muted>
            <input
              id="karvonen-reserve"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedReserve ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>bpm</span>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
