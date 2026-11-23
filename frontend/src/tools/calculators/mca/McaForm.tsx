'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { GA_WEEK_OPTIONS } from './reference-data';
import type { McaFieldErrors, McaInput, McaResult, VelocityUnit } from './types';
import { VELOCITY_UNIT_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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

interface Props {
  input: McaInput;
  errors: McaFieldErrors;
  result: McaResult | null;
  medianDisplay: string;
  medianUnavailable: boolean;
  twinGapNote?: string;
  onChange: (input: McaInput) => void;
}

export function McaForm({
  input,
  errors,
  result,
  medianDisplay,
  medianUnavailable,
  twinGapNote,
  onChange,
}: Props) {
  const set = (patch: Partial<McaInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <p className={labelClass}>Your pregnancy is:</p>
        <div
          role="radiogroup"
          aria-label="Pregnancy plurality"
          className="flex flex-wrap gap-4"
        >
          {(
            [
              ['single', 'Single'],
              ['twin', 'Twin'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="mca-plurality"
                className="h-4 w-4 accent-primary"
                checked={input.plurality === value}
                onChange={() => set({ plurality: value })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="mca-ga">
          Gestational age
          <InfoTooltip text="Completed gestational weeks used to look up the cohort median PSV." />
        </label>
        <FieldShell error={errors.gaWeeks}>
          <select
            id="mca-ga"
            className={`${inputClass} cursor-pointer`}
            value={String(input.gaWeeks)}
            onChange={(e) => set({ gaWeeks: Number(e.target.value) })}
          >
            {GA_WEEK_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w} weeks
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.gaWeeks ? (
          <p className="mt-1 text-xs text-rose-600">{errors.gaWeeks}</p>
        ) : null}
        {twinGapNote ? (
          <p className="mt-1 text-xs text-amber-800">{twinGapNote}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mca-psv">
          MCA peak systolic velocity
          <InfoTooltip text="Peak systolic velocity from the fetal MCA Doppler waveform." />
        </label>
        <FieldShell error={errors.psvText}>
          <input
            id="mca-psv"
            className={inputClass}
            inputMode="decimal"
            value={input.psvText}
            aria-invalid={Boolean(errors.psvText)}
            onChange={(e) => set({ psvText: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Velocity unit"
            value={input.velocityUnit}
            onChange={(e) => {
              const nextUnit = e.target.value as VelocityUnit;
              if (nextUnit === input.velocityUnit) return;
              const raw = input.psvText.trim().replace(/,/g, '');
              if (raw !== '' && Number.isFinite(Number(raw))) {
                const cm =
                  input.velocityUnit === 'mm/s'
                    ? Number(raw) / 10
                    : Number(raw);
                const converted =
                  nextUnit === 'mm/s' ? cm * 10 : cm;
                const digits = nextUnit === 'cm/s' ? 1 : 0;
                set({
                  velocityUnit: nextUnit,
                  psvText: String(
                    Math.round(converted * 10 ** digits) / 10 ** digits,
                  ),
                });
                return;
              }
              set({ velocityUnit: nextUnit });
            }}
          >
            {(Object.keys(VELOCITY_UNIT_LABELS) as VelocityUnit[]).map((u) => (
              <option key={u} value={u}>
                {VELOCITY_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.psvText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.psvText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mca-mom">
          MoM
          <InfoTooltip text="Multiples of the median = measured PSV ÷ gestational-age median (same velocity units)." />
        </label>
        <FieldShell muted>
          <input
            id="mca-mom"
            className={`${inputClass} cursor-default text-muted-foreground`}
            readOnly
            value={result?.formattedMom ?? ''}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="mca-median">
          Median peak systolic velocity
          <InfoTooltip text="Expected median PSV for the selected gestational age and plurality." />
        </label>
        <FieldShell muted>
          <input
            id="mca-median"
            className={`${inputClass} cursor-default text-muted-foreground`}
            readOnly
            value={medianUnavailable ? '—' : medianDisplay}
            aria-live="polite"
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">
            {input.velocityUnit}
          </span>
        </FieldShell>
      </div>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      ) : null}
    </form>
  );
}