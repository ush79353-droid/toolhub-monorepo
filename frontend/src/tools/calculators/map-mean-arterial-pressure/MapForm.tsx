'use client';

import type { ReactNode } from 'react';
import { Stethoscope } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { MapFieldErrors, MapInput, MapResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const suffixClass =
  'shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: MapInput;
  errors: MapFieldErrors;
  result: MapResult | null;
  onChange: (input: MapInput) => void;
  onLoadExample: () => void;
}

export function MapForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<MapInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-border bg-muted/15 p-3.5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent">
          <Stethoscope className="h-4 w-4 text-primary" aria-hidden />
          <span>Blood pressure readings XX/YY</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-accent">XX</span> — systolic (SBP).{' '}
          <span className="font-semibold text-accent">YY</span> — diastolic blood
          pressure (DBP).
        </p>

        <div>
          <label className={labelClass} htmlFor="map-sbp">
            <span>Systolic (Norm: 90–120 mmHg)</span>
            <InfoTooltip
              label="Systolic pressure"
              text="Peak arterial pressure during cardiac ejection (mmHg). Must be greater than or equal to diastolic pressure."
            />
          </label>
          <FieldShell error={errors.sbpMmHg}>
            <input
              id="map-sbp"
              className={inputClass}
              inputMode="decimal"
              aria-label="Systolic blood pressure"
              value={input.sbpMmHg}
              aria-invalid={Boolean(errors.sbpMmHg)}
              onChange={(e) => set({ sbpMmHg: e.target.value })}
            />
            <span className={suffixClass}>mmHg</span>
          </FieldShell>
          {errors.sbpMmHg ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sbpMmHg}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="map-dbp">
            <span>Diastolic (Norm: 60–80 mmHg)</span>
            <InfoTooltip
              label="Diastolic pressure"
              text="Minimum arterial pressure during cardiac relaxation (mmHg)."
            />
          </label>
          <FieldShell error={errors.dbpMmHg}>
            <input
              id="map-dbp"
              className={inputClass}
              inputMode="decimal"
              aria-label="Diastolic blood pressure"
              value={input.dbpMmHg}
              aria-invalid={Boolean(errors.dbpMmHg)}
              onChange={(e) => set({ dbpMmHg: e.target.value })}
            />
            <span className={suffixClass}>mmHg</span>
          </FieldShell>
          {errors.dbpMmHg ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dbpMmHg}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="map-out">
            <span>Mean arterial pressure (MAP)</span>
            <InfoTooltip
              label="MAP"
              text="Estimated driving arterial pressure from cuff SBP and DBP (mmHg). Blank until both pressures are valid."
            />
          </label>
          <FieldShell>
            <output
              id="map-out"
              className={`${inputClass} font-semibold`}
              aria-live="polite"
            >
              {result?.formattedMap ?? ''}
            </output>
            <span className={suffixClass}>mmHg</span>
          </FieldShell>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            checked={input.displayPulsePressure}
            onChange={(e) => set({ displayPulsePressure: e.target.checked })}
          />
          <span>Display pulse pressure</span>
        </label>

        {input.displayPulsePressure ? (
          <div>
            <label className={labelClass} htmlFor="map-pp">
              <span>Pulse pressure</span>
              <InfoTooltip
                label="Pulse pressure"
                text="SBP − DBP (mmHg). Shown only when “Display pulse pressure” is checked."
              />
            </label>
            <FieldShell>
              <output
                id="map-pp"
                className={`${inputClass} font-semibold`}
                aria-live="polite"
              >
                {result?.formattedPulsePressure ?? ''}
              </output>
              <span className={suffixClass}>mmHg</span>
            </FieldShell>
          </div>
        ) : null}
      </div>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      ) : null}

      <section
        aria-label="Formula and detailed interpretation"
        className="rounded-xl border border-border bg-muted/10 p-3.5 space-y-2"
      >
        <h3 className="text-sm font-semibold text-accent">
          Formula and detailed interpretation
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          We use the following MAP formula:{' '}
          <span className="font-medium text-accent">MAP = (SBP + 2 × DBP) / 3</span>
          , which equals DBP + (SBP − DBP) / 3. Pulse pressure is{' '}
          <span className="font-medium text-accent">PP = SBP − DBP</span> when
          displayed.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Cuff-based MAP is a widely taught approximation — it is not the same as
          invasive arterial line pressure and should not be used alone for
          treatment decisions.
        </p>
      </section>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (120/80 → MAP 93.33, PP 40)
        </button>
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result?.disclaimer ??
          'Educational MAP estimate — not medical advice. Entries stay in your browser only.'}
      </p>
    </form>
  );
}