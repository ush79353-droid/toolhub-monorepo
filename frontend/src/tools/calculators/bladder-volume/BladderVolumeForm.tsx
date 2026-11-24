'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { SHAPE_COEFFICIENT } from './calculation';
import {
  SHAPE_OPTIONS,
  type BladderVolumeFieldErrors,
  type BladderVolumeInput,
  type BladderVolumeResult,
  type LengthUnit,
  type VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-accent outline-none sm:min-w-[4.5rem]';

function FieldShell({
  error,
  muted,
  children,
  suffix,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
      {suffix}
    </div>
  );
}

interface Props {
  input: BladderVolumeInput;
  errors: BladderVolumeFieldErrors;
  result: BladderVolumeResult | null;
  onChange: (input: BladderVolumeInput) => void;
}

const LENGTH_UNITS: LengthUnit[] = ['cm', 'mm', 'in'];
const VOLUME_UNITS: VolumeUnit[] = ['mL', 'cm3', 'L'];

export function BladderVolumeForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<BladderVolumeInput>) =>
    onChange({ ...input, ...patch });

  const displayCoefficient =
    input.shape === 'custom'
      ? input.customCoefficient
      : String(SHAPE_COEFFICIENT[input.shape]);

  const coefEditable = input.shape === 'custom';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational ultrasound bladder volume (L×W×H×k). Bih et al. 1998 shape
        coefficients; not for clinical decisions alone.
      </p>

      <div>
        <label className={labelClass} htmlFor="bv-shape">
          Bladder shape
        </label>
        <select
          id="bv-shape"
          className={selectClass}
          value={input.shape}
          onChange={(e) =>
            set({
              shape: e.target.value as BladderVolumeInput['shape'],
            })
          }
        >
          {SHAPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="bv-coef">
          Coefficient
        </label>
        <FieldShell
          muted={!coefEditable}
          error={errors.customCoefficient}
        >
          <input
            id="bv-coef"
            className={inputClass}
            inputMode="decimal"
            readOnly={!coefEditable}
            aria-readonly={!coefEditable}
            value={displayCoefficient}
            onChange={(e) => set({ customCoefficient: e.target.value })}
          />
        </FieldShell>
        {errors.customCoefficient ? (
          <p className="mt-1 text-xs text-rose-600">{errors.customCoefficient}</p>
        ) : null}
      </div>

      {(
        [
          ['dim1', 'dim1Unit', 'Dimension 1', 'Maximal transverse (width)'],
          ['dim2', 'dim2Unit', 'Dimension 2', 'Anterior–posterior (height)'],
          ['dim3', 'dim3Unit', 'Dimension 3', 'Longitudinal (length)'],
        ] as const
      ).map(([valKey, unitKey, label, tip]) => (
        <div key={valKey}>
          <label className={labelClass} htmlFor={`bv-${valKey}`}>
            {label}
            <InfoTooltip content={tip} />
          </label>
          <FieldShell error={errors[valKey]}>
            <input
              id={`bv-${valKey}`}
              className={inputClass}
              inputMode="decimal"
              value={input[valKey]}
              aria-invalid={Boolean(errors[valKey])}
              onChange={(e) => set({ [valKey]: e.target.value })}
            />
            <select
              className={unitSelectClass}
              aria-label={`${label} unit`}
              value={input[unitKey]}
              onChange={(e) =>
                set({ [unitKey]: e.target.value as LengthUnit })
              }
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors[valKey] ? (
            <p className="mt-1 text-xs text-rose-600">{errors[valKey]}</p>
          ) : null}
        </div>
      ))}

      <div>
        <label className={labelClass} htmlFor="bv-volume">
          Bladder volume
        </label>
        <FieldShell muted>
          <input
            id="bv-volume"
            className={inputClass}
            readOnly
            value={result?.formattedVolume ?? ''}
            aria-live="polite"
          />
          <select
            className={unitSelectClass}
            aria-label="Bladder volume unit"
            value={input.volumeUnit}
            onChange={(e) =>
              set({ volumeUnit: e.target.value as VolumeUnit })
            }
          >
            {VOLUME_UNITS.map((u) => (
              <option key={u} value={u}>
                {u === 'cm3' ? 'cm³' : u}
              </option>
            ))}
          </select>
        </FieldShell>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result.meanErrorNote}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
