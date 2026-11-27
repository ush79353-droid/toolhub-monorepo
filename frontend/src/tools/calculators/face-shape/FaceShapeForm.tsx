'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromCm, parseNumber, toCm } from './calculation';
import type {
  FaceShapeFieldErrors,
  FaceShapeInput,
  FaceShapeResult,
  FaceShapeSex,
  FeatureSharpness,
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
  { value: 'in', label: 'in' },
];

const SHARPNESS_OPTIONS: { value: FeatureSharpness; label: string }[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'round', label: 'Round' },
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

function formatDisplay(value: number): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(4)));
}

interface FormProps {
  input: FaceShapeInput;
  errors: FaceShapeFieldErrors;
  result: FaceShapeResult | null;
  onChange: (input: FaceShapeInput) => void;
}

export function FaceShapeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<FaceShapeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (
    field: 'forehead' | 'cheeks' | 'jawline' | 'faceLength',
    next: LengthUnit,
  ) => {
    const textKey = `${field}Text` as const;
    const unitKey = `${field}Unit` as const;
    const currentUnit = input[unitKey];
    if (next === currentUnit) return;
    const raw = parseNumber(input[textKey]);
    if (raw != null && raw > 0) {
      const cm = toCm(raw, currentUnit);
      set({
        [unitKey]: next,
        [textKey]: formatDisplay(fromCm(cm, next)),
      } as Partial<FaceShapeInput>);
      return;
    }
    set({ [unitKey]: next } as Partial<FaceShapeInput>);
  };

  const showResult =
    result?.shapeId != null && Object.keys(errors).length === 0;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Face shape inputs">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Omega-defined aesthetic heuristic — not clinical validation. Jawline
          length is a jaw-width proxy only.
        </p>

        <fieldset>
          <legend className={labelClass}>
            Sex (optional)
            <InfoTooltip text="Used for styling tips only. Numeric rules do not change with sex." />
          </legend>
          <div className="flex flex-wrap gap-3 pt-1">
            {(
              [
                { value: 'unset', label: 'Not set' },
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="fs-sex"
                  checked={input.sex === opt.value}
                  onChange={() => set({ sex: opt.value as FaceShapeSex })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {(
          [
            [
              'forehead',
              'Forehead width',
              'foreheadText',
              'foreheadUnit',
              errors.foreheadText,
              'Widest part of the forehead (hairline to brow).',
            ],
            [
              'cheeks',
              'Cheeks width',
              'cheeksText',
              'cheeksUnit',
              errors.cheeksText,
              'Widest part across the cheekbones.',
            ],
            [
              'jawline',
              'Jawline length',
              'jawlineText',
              'jawlineUnit',
              errors.jawlineText,
              'Chin to outer ear along the jaw — used only as a width proxy.',
            ],
            [
              'faceLength',
              'Face length',
              'faceLengthText',
              'faceLengthUnit',
              errors.faceLengthText,
              'Hairline to chin in the center of the face.',
            ],
          ] as const
        ).map(([id, label, textKey, unitKey, err, tip]) => (
          <div key={id}>
            <label className={labelClass} htmlFor={`fs-${id}`}>
              {label}
              <InfoTooltip text={tip} />
            </label>
            <FieldShell error={err}>
              <input
                id={`fs-${id}`}
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input[textKey]}
                onChange={(e) =>
                  set({ [textKey]: e.target.value } as Partial<FaceShapeInput>)
                }
                aria-invalid={Boolean(err)}
              />
              <select
                className={unitSelectClass}
                value={input[unitKey]}
                onChange={(e) =>
                  switchUnit(id, e.target.value as LengthUnit)
                }
                aria-label={`${label} unit`}
              >
                {LENGTH_UNITS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldShell>
            {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
          </div>
        ))}

        <fieldset>
          <legend className={labelClass}>
            Feature sharpness
            <InfoTooltip text="Angular vs softer features. Affects round/diamond/square rules only." />
          </legend>
          <div className="flex flex-wrap gap-3 pt-1">
            {SHARPNESS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="fs-sharpness"
                  checked={input.sharpness === opt.value}
                  onChange={() => set({ sharpness: opt.value })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {showResult ? (
          <div
            className="rounded-lg border border-sky-200 bg-sky-50/60 px-3.5 py-3"
            aria-live="polite"
          >
            <p className="text-[13px] font-semibold text-accent">
              {result.statusHeadline}
            </p>
            {result.formattedRLf ? (
              <p className="mt-1 text-sm tabular-nums text-accent">
                Length-to-cheek ratio (rLF): {result.formattedRLf}
              </p>
            ) : null}
            {result.widestZone ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Widest zone: {result.widestZone}
              </p>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
            <p className="mt-2 text-xs font-medium text-accent">
              {result.methodologyNote}
            </p>
            {result.sexTip ? (
              <p className="mt-2 text-xs text-muted-foreground">{result.sexTip}</p>
            ) : null}
          </div>
        ) : result?.statusHeadline && !showResult ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}