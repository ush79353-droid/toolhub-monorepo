'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EjectionFractionFieldErrors,
  EjectionFractionInput,
  EjectionFractionMode,
  EjectionFractionResult,
} from './types';
import { MODE_OPTIONS, switchMode } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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
        muted ? 'border-border bg-sky-50/80' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: EjectionFractionInput;
  errors: EjectionFractionFieldErrors;
  result: EjectionFractionResult | null;
  onChange: (input: EjectionFractionInput) => void;
  onLoadExample: () => void;
}

export function EjectionFractionForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<EjectionFractionInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Educational ejection fraction from end-diastolic volume and stroke
        volume (or ESV / CO & HR).{' '}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-2 hover:underline"
          onClick={onLoadExample}
        >
          Load example
        </button>
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>I know…</span>
          <InfoTooltip text="Choose which measurement you have. EDV is kept when switching; other mode fields clear." />
        </div>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Known measurement mode"
        >
          {MODE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="ef-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === opt.value}
                onChange={() =>
                  onChange(switchMode(input, opt.value as EjectionFractionMode))
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <span>End diastolic volume (EDV)</span>
          <InfoTooltip text="Ventricular volume at end-diastole. Must be positive." />
        </div>
        <FieldShell error={errors.edvMl}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.edvMl}
            aria-label="End diastolic volume"
            onChange={(e) => set({ edvMl: e.target.value })}
          />
          <span className="shrink-0 px-3 text-sm text-muted-foreground">ml</span>
        </FieldShell>
        {errors.edvMl ? (
          <p className="mt-1 text-xs text-rose-600">{errors.edvMl}</p>
        ) : null}
      </div>

      {input.mode === 'sv' ? (
        <div>
          <div className={labelClass}>
            <span>Stroke volume</span>
            <InfoTooltip text="Volume ejected per beat (mL). Cannot exceed EDV." />
          </div>
          <FieldShell error={errors.strokeVolumeMl}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.strokeVolumeMl}
              aria-label="Stroke volume"
              onChange={(e) => set({ strokeVolumeMl: e.target.value })}
            />
            <span className="shrink-0 px-3 text-sm text-muted-foreground">
              ml
            </span>
          </FieldShell>
          {errors.strokeVolumeMl ? (
            <p className="mt-1 text-xs text-rose-600">{errors.strokeVolumeMl}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'esv' ? (
        <div>
          <div className={labelClass}>
            <span>End-systolic volume (ESV)</span>
            <InfoTooltip text="Volume remaining at end-systole. SV = EDV − ESV; ESV ≤ EDV." />
          </div>
          <FieldShell error={errors.esvMl}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.esvMl}
              aria-label="End-systolic volume"
              onChange={(e) => set({ esvMl: e.target.value })}
            />
            <span className="shrink-0 px-3 text-sm text-muted-foreground">
              ml
            </span>
          </FieldShell>
          {errors.esvMl ? (
            <p className="mt-1 text-xs text-rose-600">{errors.esvMl}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'coHr' ? (
        <>
          <div>
            <div className={labelClass}>
              <span>Cardiac output</span>
              <InfoTooltip text="Litres per minute. SV (mL) = 1000 × CO / HR." />
            </div>
            <FieldShell error={errors.cardiacOutputLMin}>
              <input
                className={inputClass}
                inputMode="decimal"
                value={input.cardiacOutputLMin}
                aria-label="Cardiac output"
                onChange={(e) => set({ cardiacOutputLMin: e.target.value })}
              />
              <span className="shrink-0 px-3 text-sm text-muted-foreground">
                L/min
              </span>
            </FieldShell>
            {errors.cardiacOutputLMin ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.cardiacOutputLMin}
              </p>
            ) : null}
          </div>
          <div>
            <div className={labelClass}>
              <span>Heart rate</span>
              <InfoTooltip text="Beats per minute. Must be positive." />
            </div>
            <FieldShell error={errors.heartRateBpm}>
              <input
                className={inputClass}
                inputMode="decimal"
                value={input.heartRateBpm}
                aria-label="Heart rate"
                onChange={(e) => set({ heartRateBpm: e.target.value })}
              />
              <span className="shrink-0 px-3 text-sm text-muted-foreground">
                bpm
              </span>
            </FieldShell>
            {errors.heartRateBpm ? (
              <p className="mt-1 text-xs text-rose-600">{errors.heartRateBpm}</p>
            ) : null}
          </div>
        </>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>Ejection fraction</span>
          <InfoTooltip text="EF% = 100 × SV / EDV." />
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={result?.formattedEf ?? ''}
            aria-label="Ejection fraction result"
            tabIndex={-1}
          />
          <span className="shrink-0 px-3 text-sm font-medium text-primary">
            %
          </span>
        </FieldShell>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation} {result.disclaimer}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Enter EDV and the values for your selected mode to see EF%.
          </p>
        )}
      </div>
    </form>
  );
}
