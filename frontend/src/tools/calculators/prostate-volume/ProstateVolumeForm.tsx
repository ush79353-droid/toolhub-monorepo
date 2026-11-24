'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type {
  LengthUnit,
  ProstateVolumeFieldErrors,
  ProstateVolumeInput,
  ProstateVolumeResult,
  VolumeModel,
  VolumeUnit,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-accent outline-none sm:min-w-[4.5rem]';

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
  input: ProstateVolumeInput;
  errors: ProstateVolumeFieldErrors;
  result: ProstateVolumeResult | null;
  onChange: (input: ProstateVolumeInput) => void;
}

const LENGTH_UNITS: LengthUnit[] = ['cm', 'mm', 'in'];

export function ProstateVolumeForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<ProstateVolumeInput>) =>
    onChange({ ...input, ...patch });

  const models: { value: VolumeModel; label: string }[] = [
    { value: 'ellipsoid', label: 'Ellipsoid volume (basic)' },
    { value: 'bullet', label: '"Bullet" volume' },
    { value: 'compare', label: 'Compare the two models' },
  ];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational prostate volume from L×H×W. Bullet (5π/24) may fit glands
        &lt;55 mL better (MacMahon 2009). Not a diagnosis.
      </p>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Volume calculation model</legend>
        {models.map((m) => (
          <label
            key={m.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name="pv-model"
              className="h-4 w-4"
              checked={input.model === m.value}
              onChange={() => set({ model: m.value })}
            />
            {m.label}
          </label>
        ))}
        <p className="text-xs text-muted-foreground">
          &quot;Bullet&quot; volume may be more precise for prostate glands
          smaller than 55 mL.
        </p>
      </fieldset>

      {(
        [
          ['length', 'lengthUnit', 'Length'],
          ['height', 'heightUnit', 'Height'],
          ['width', 'widthUnit', 'Width'],
        ] as const
      ).map(([valKey, unitKey, label]) => (
        <div key={valKey}>
          <label className={labelClass} htmlFor={`pv-${valKey}`}>
            {label}
          </label>
          <FieldShell error={errors[valKey]}>
            <input
              id={`pv-${valKey}`}
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

      {input.model === 'compare' && result ? (
        <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-3">
          <div>
            <p className="text-[13px] font-medium text-accent">
              Ellipsoid volume (basic)
            </p>
            <p className="text-sm tabular-nums text-accent">
              {result.formattedEllipsoid} {input.volumeUnit === 'cm3' ? 'cm³' : 'mL'}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-accent">
              &quot;Bullet&quot; volume
            </p>
            <p className="text-sm tabular-nums text-accent">
              {result.formattedBullet} {input.volumeUnit === 'cm3' ? 'cm³' : 'mL'}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="pv-vol">
            {input.model === 'bullet'
              ? '"Bullet" volume'
              : 'Ellipsoid volume (basic)'}
          </label>
          <FieldShell muted>
            <input
              id="pv-vol"
              className={inputClass}
              readOnly
              value={result?.formattedPrimary ?? ''}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              aria-label="Volume unit"
              value={input.volumeUnit}
              onChange={(e) =>
                set({ volumeUnit: e.target.value as VolumeUnit })
              }
            >
              <option value="mL">mL</option>
              <option value="cm3">cm³</option>
            </select>
          </FieldShell>
        </div>
      )}

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-between px-3 text-sm font-medium text-accent"
          onClick={() => set({ psaDensityOpen: !input.psaDensityOpen })}
          aria-expanded={input.psaDensityOpen}
        >
          Calculate PSA density
          {input.psaDensityOpen ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
        </button>
        {input.psaDensityOpen ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <div>
              <label className={labelClass} htmlFor="pv-psa">
                Serum PSA
              </label>
              <FieldShell error={errors.psa}>
                <input
                  id="pv-psa"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.psa}
                  onChange={(e) => set({ psa: e.target.value })}
                />
                <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
                  ng/mL
                </span>
              </FieldShell>
              {errors.psa ? (
                <p className="mt-1 text-xs text-rose-600">{errors.psa}</p>
              ) : null}
            </div>
            {input.model === 'compare' ? (
              <div>
                <label className={labelClass} htmlFor="pv-psa-src">
                  Volume for density
                </label>
                <select
                  id="pv-psa-src"
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                  value={input.psaVolumeSource}
                  onChange={(e) =>
                    set({
                      psaVolumeSource: e.target.value as 'ellipsoid' | 'bullet',
                    })
                  }
                >
                  <option value="ellipsoid">Ellipsoid</option>
                  <option value="bullet">Bullet</option>
                </select>
              </div>
            ) : null}
            <div>
              <label className={labelClass} htmlFor="pv-dens">
                PSA density
              </label>
              <FieldShell muted>
                <input
                  id="pv-dens"
                  className={inputClass}
                  readOnly
                  value={result?.formattedPsaDensity ?? ''}
                />
                <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
                  ng/mL²
                </span>
              </FieldShell>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
