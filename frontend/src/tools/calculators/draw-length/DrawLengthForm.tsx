'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLength, fromCm, parseNumber, toCm } from './calculation';
import type {
  DrawLengthFieldErrors,
  DrawLengthInput,
  DrawLengthResult,
  LengthUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const LENGTH_UNITS: { value: LengthUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
];

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: DrawLengthInput;
  errors: DrawLengthFieldErrors;
  result: DrawLengthResult | null;
  onChange: (input: DrawLengthInput) => void;
}

export function DrawLengthForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<DrawLengthInput>) =>
    onChange({ ...input, ...patch });

  const wingspanDisplay =
    input.lastEdited === 'wingspan'
      ? input.wingspanText
      : (result?.formattedWingspan ?? '');
  const drawDisplay =
    input.lastEdited === 'drawLength'
      ? input.drawLengthText
      : (result?.formattedDrawLength ?? '');

  const changeWingspanUnit = (next: LengthUnit) => {
    const raw =
      input.lastEdited === 'wingspan'
        ? parseNumber(input.wingspanText)
        : result?.wingspanCm != null
          ? fromCm(result.wingspanCm, input.wingspanUnit)
          : null;
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.wingspanUnit);
      set({
        wingspanUnit: next,
        wingspanText: formatLength(fromCm(cm, next)),
        lastEdited: 'wingspan',
      });
      return;
    }
    set({ wingspanUnit: next });
  };

  const changeDrawUnit = (next: LengthUnit) => {
    const raw =
      input.lastEdited === 'drawLength'
        ? parseNumber(input.drawLengthText)
        : result?.drawLengthCm != null
          ? fromCm(result.drawLengthCm, input.drawLengthUnit)
          : null;
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.drawLengthUnit);
      set({
        drawLengthUnit: next,
        drawLengthText: formatLength(fromCm(cm, next)),
        lastEdited: 'drawLength',
      });
      return;
    }
    set({ drawLengthUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Draw length inputs">
        <div>
          <label className={labelClass} htmlFor="draw-wingspan">
            Wingspan
            <InfoTooltip text="Fingertip-to-fingertip span with arms outstretched horizontally." />
          </label>
          <FieldShell error={errors.wingspanText}>
            <input
              id="draw-wingspan"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={wingspanDisplay}
              onChange={(e) =>
                set({
                  wingspanText: e.target.value,
                  lastEdited: 'wingspan',
                })
              }
              aria-invalid={Boolean(errors.wingspanText)}
            />
            <select
              className={unitSelectClass}
              value={input.wingspanUnit}
              onChange={(e) => changeWingspanUnit(e.target.value as LengthUnit)}
              aria-label="Wingspan unit"
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.wingspanText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.wingspanText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="draw-length">
            Draw length
            <InfoTooltip text="Estimated as wingspan ÷ 2.5. Enter a value here to back-solve wingspan." />
          </label>
          <FieldShell error={errors.drawLengthText}>
            <input
              id="draw-length"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={drawDisplay}
              onChange={(e) =>
                set({
                  drawLengthText: e.target.value,
                  lastEdited: 'drawLength',
                })
              }
              aria-invalid={Boolean(errors.drawLengthText)}
            />
            <select
              className={unitSelectClass}
              value={input.drawLengthUnit}
              onChange={(e) => changeDrawUnit(e.target.value as LengthUnit)}
              aria-label="Draw length unit"
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.drawLengthText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.drawLengthText}</p>
          ) : null}
        </div>

        <div
          className="rounded-xl border border-dashed border-border bg-muted/20 px-3 py-4 text-center"
          aria-hidden="true"
        >
          <p className="text-xs font-medium text-accent">Measurement diagram</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Wingspan: fingertip to fingertip. Draw length: about wingspan ÷ 2.5
            (center-chest to fingertip teaching sketch).
          </p>
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
