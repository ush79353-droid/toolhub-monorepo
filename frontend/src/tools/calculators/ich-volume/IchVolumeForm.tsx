'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HemorrhageShape,
  IchVolumeFieldErrors,
  IchVolumeInput,
  IchVolumeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const suffixClass =
  'shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground';

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
  input: IchVolumeInput;
  errors: IchVolumeFieldErrors;
  result: IchVolumeResult | null;
  areaOpen: boolean;
  resultOpen: boolean;
  onAreaOpenChange: (open: boolean) => void;
  onResultOpenChange: (open: boolean) => void;
  onChange: (input: IchVolumeInput) => void;
}

export function IchVolumeForm({
  input,
  errors,
  result,
  areaOpen,
  resultOpen,
  onAreaOpenChange,
  onResultOpenChange,
  onChange,
}: Props) {
  const set = (patch: Partial<IchVolumeInput>) => onChange({ ...input, ...patch });

  const shapeOptions: { value: HemorrhageShape; label: string }[] = [
    { value: 'ellipsoid', label: 'Ellipsoid or round' },
    { value: 'irregular', label: 'Irregular, separated, multinodular' },
  ];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational ABC/2 (or ABC/3 for irregular) ICH volume estimate from CT
        diameters and slice count. Not planimetry and not for treatment decisions.
      </p>

      <div>
        <label className={labelClass} htmlFor="ich-length">
          Length
        </label>
        <FieldShell
          error={errors.lengthCm}
          suffix={<span className={suffixClass}>cm</span>}
        >
          <input
            id="ich-length"
            className={inputClass}
            inputMode="decimal"
            value={input.lengthCm}
            aria-invalid={Boolean(errors.lengthCm)}
            onChange={(e) => set({ lengthCm: e.target.value })}
          />
        </FieldShell>
        {errors.lengthCm ? (
          <p className="mt-1 text-xs text-rose-600">{errors.lengthCm}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ich-width">
          Width
        </label>
        <FieldShell
          error={errors.widthCm}
          suffix={<span className={suffixClass}>cm</span>}
        >
          <input
            id="ich-width"
            className={inputClass}
            inputMode="decimal"
            value={input.widthCm}
            aria-invalid={Boolean(errors.widthCm)}
            onChange={(e) => set({ widthCm: e.target.value })}
          />
        </FieldShell>
        {errors.widthCm ? (
          <p className="mt-1 text-xs text-rose-600">{errors.widthCm}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ich-thickness">
          Slice thickness
        </label>
        <FieldShell
          error={errors.sliceThicknessMm}
          suffix={<span className={suffixClass}>mm</span>}
        >
          <input
            id="ich-thickness"
            className={inputClass}
            inputMode="decimal"
            value={input.sliceThicknessMm}
            aria-invalid={Boolean(errors.sliceThicknessMm)}
            onChange={(e) => set({ sliceThicknessMm: e.target.value })}
          />
        </FieldShell>
        {errors.sliceThicknessMm ? (
          <p className="mt-1 text-xs text-rose-600">{errors.sliceThicknessMm}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ich-slices">
          <span>Number of slices</span>
          <InfoTooltip
            label="Number of slices"
            text="Simplified C uses this count × slice thickness (cm). If you enter hemorrhage-area bands below, C uses Kothari weights instead — then Number of slices must equal the sum of those counts or be left blank."
          />
        </label>
        <FieldShell error={errors.numberOfSlices}>
          <input
            id="ich-slices"
            className={inputClass}
            inputMode="numeric"
            value={input.numberOfSlices}
            aria-invalid={Boolean(errors.numberOfSlices)}
            onChange={(e) => set({ numberOfSlices: e.target.value })}
          />
        </FieldShell>
        {errors.numberOfSlices ? (
          <p className="mt-1 text-xs text-rose-600">{errors.numberOfSlices}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>Hemorrhage shape</legend>
        <div className="space-y-2">
          {shapeOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ich-shape"
                className="h-4 w-4 accent-primary"
                checked={input.shape === opt.value}
                onChange={() => set({ shape: opt.value })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={areaOpen}
          onClick={() => onAreaOpenChange(!areaOpen)}
        >
          <span>Hemorrhage area</span>
          {areaOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {areaOpen ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Optional Kothari weights vs largest-slice area: ≥75% = 1, 25–75% =
              0.5, &lt;25% = 0. Leave blank to use Number of slices only.
            </p>
            {(
              [
                ['slicesGe75', '≥75%', errors.slicesGe75],
                ['slices25to75', '25–75%', errors.slices25to75],
                ['slicesLt25', '<25%', errors.slicesLt25],
              ] as const
            ).map(([key, label, err]) => (
              <div key={key}>
                <label className={labelClass} htmlFor={`ich-${key}`}>
                  {label}
                </label>
                <FieldShell error={err}>
                  <input
                    id={`ich-${key}`}
                    className={inputClass}
                    inputMode="numeric"
                    value={input[key]}
                    aria-invalid={Boolean(err)}
                    onChange={(e) => set({ [key]: e.target.value })}
                  />
                </FieldShell>
                {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={resultOpen}
          onClick={() => onResultOpenChange(!resultOpen)}
        >
          <span>Result</span>
          {resultOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {resultOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3">
            <p className="text-[13px] font-medium text-accent">
              Estimated ICH volume
            </p>
            <FieldShell
              muted
              suffix={
                <span className="pr-3 text-sm text-muted-foreground">mL</span>
              }
            >
              <output
                className="w-full px-3 text-sm tabular-nums font-semibold text-accent"
                aria-live="polite"
              >
                {result ? result.formattedVolumeMl : ''}
              </output>
            </FieldShell>
            {result ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {result.explanation}
              </p>
            ) : null}
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result?.disclaimer ??
                'Educational estimate — not individualized clinical advice.'}
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
