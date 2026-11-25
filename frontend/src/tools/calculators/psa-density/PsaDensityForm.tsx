'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LengthUnit,
  PsaDensityFieldErrors,
  PsaDensityInput,
  PsaDensityResult,
  VolumeUnit,
} from './types';
import { withSyncedVolume } from './validation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

const LENGTH_UNITS: LengthUnit[] = ['cm', 'mm', 'in'];

interface Props {
  input: PsaDensityInput;
  errors: PsaDensityFieldErrors;
  result: PsaDensityResult | null;
  onChange: (input: PsaDensityInput) => void;
  onLoadExample: () => void;
}

export function PsaDensityForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const apply = (patch: Partial<PsaDensityInput>) => {
    let next: PsaDensityInput = { ...input, ...patch };
    const dimensionKeys: (keyof PsaDensityInput)[] = [
      'length',
      'width',
      'height',
      'lengthUnit',
      'widthUnit',
      'heightUnit',
    ];
    const touchesDim = Object.keys(patch).some((k) =>
      dimensionKeys.includes(k as keyof PsaDensityInput),
    );
    if (touchesDim && !patch.volumeManual) {
      next = { ...next, volumeManual: false };
      next = withSyncedVolume(next);
    }
    onChange(next);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational PSA density = PSA ÷ prostate volume. Ellipsoid volume uses
        π/6 × L × W × H (cm). You may enter volume directly from imaging. Not a
        diagnosis.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (4 × 3 × 5 cm, PSA 3.1416 → density 0.10)
        </button>
      </p>

      {errors.form ? (
        <p className="text-xs text-destructive" role="alert">
          {errors.form}
        </p>
      ) : null}

      {(
        [
          ['length', 'lengthUnit', 'Length', 'pd-length'],
          ['width', 'widthUnit', 'Width', 'pd-width'],
          ['height', 'heightUnit', 'Height', 'pd-height'],
        ] as const
      ).map(([valKey, unitKey, label, id]) => (
        <div key={valKey}>
          <label className={labelClass} htmlFor={id}>
            {label}
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors[valKey] ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id={id}
              className={inputClass}
              inputMode="decimal"
              value={input[valKey]}
              aria-invalid={Boolean(errors[valKey])}
              onChange={(e) => apply({ [valKey]: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label={`${label} unit`}
              value={input[unitKey]}
              onChange={(e) =>
                apply({ [unitKey]: e.target.value as LengthUnit })
              }
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          {errors[valKey] ? (
            <p className="mt-1 text-xs text-destructive">{errors[valKey]}</p>
          ) : null}
        </div>
      ))}

      <div>
        <label className={labelClass} htmlFor="pd-volume">
          Prostate volume
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.prostateVolume ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pd-volume"
            className={inputClass}
            inputMode="decimal"
            value={input.prostateVolume}
            aria-invalid={Boolean(errors.prostateVolume)}
            onChange={(e) =>
              onChange({
                ...input,
                prostateVolume: e.target.value,
                volumeManual: true,
              })
            }
          />
          <select
            className={selectClass}
            aria-label="Prostate volume unit"
            value={input.volumeUnit}
            onChange={(e) =>
              apply({ volumeUnit: e.target.value as VolumeUnit })
            }
          >
            <option value="cm3">cm³</option>
            <option value="mL">mL</option>
          </select>
        </div>
        {result?.volumeFromDimensions ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Updated from ellipsoid dimensions (π/6). Edit volume to override.
          </p>
        ) : null}
        {errors.prostateVolume ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.prostateVolume}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pd-psa">
          PSA
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.psa ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="pd-psa"
            className={inputClass}
            inputMode="decimal"
            value={input.psa}
            aria-invalid={Boolean(errors.psa)}
            onChange={(e) => apply({ psa: e.target.value })}
          />
          <span className={selectClass}>ng/mL</span>
        </div>
        {errors.psa ? (
          <p className="mt-1 text-xs text-destructive">{errors.psa}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pd-density">
          <span>PSA density</span>
          <InfoTooltip
            label="PSA density"
            text="PSA density = serum PSA (ng/mL) divided by prostate volume (cc). This tool reports the numeric ratio only — not a cancer diagnosis."
          />
        </label>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/30">
          <input
            id="pd-density"
            className={inputClass}
            readOnly
            value={result?.formattedPsaDensity ?? ''}
            aria-live="polite"
          />
          <span className={selectClass}>ng/mL²</span>
        </div>
      </div>
    </form>
  );
}