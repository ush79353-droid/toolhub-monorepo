'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DepthUnit,
  HeightUnit,
  Sex,
  TidalVolumeFieldErrors,
  TidalVolumeInput,
  TidalVolumeResult,
  VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  muted,
  children,
}: {
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-sky-200 bg-sky-50/60' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function parseOptional(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

interface FormProps {
  input: TidalVolumeInput;
  errors: TidalVolumeFieldErrors;
  result: TidalVolumeResult | null;
  onChange: (input: TidalVolumeInput) => void;
}

export function TidalVolumeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<TidalVolumeInput>) =>
    onChange({ ...input, ...patch });

  const hasResult =
    result?.vtMinMl != null &&
    result.vtMaxMl != null &&
    result.ettDepthCm != null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Tidal volume inputs">
        <div>
          <label className={labelClass} htmlFor="tv-height">
            Patient&apos;s height
            <InfoTooltip text="Used for Devine ideal body weight (6–8 mL/kg tidal-volume band) and Chula Ideal ETT depth." />
          </label>
          <FieldShell>
            <input
              id="tv-height"
              className={inputClass}
              inputMode="decimal"
              value={input.height ?? ''}
              onChange={(e) => set({ height: parseOptional(e.target.value) })}
              aria-invalid={Boolean(errors.height)}
              aria-describedby={errors.height ? 'tv-height-error' : undefined}
            />
            <select
              className={selectClass}
              aria-label="Height unit"
              value={input.heightUnit}
              onChange={(e) =>
                set({ heightUnit: e.target.value as HeightUnit })
              }
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.height ? (
            <p id="tv-height-error" className="mt-1.5 text-xs text-rose-600">
              {errors.height}
            </p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(
              [
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
                  name="tv-sex"
                  checked={input.sex === opt.value}
                  onChange={() => set({ sex: opt.value as Sex })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass} aria-label="Tidal volume results">
        <div>
          <div className={labelClass}>
            Ideal ETT depth
            <InfoTooltip text="Chula: ETT (cm) = 0.1 × height (cm) + 4, measured from the right upper canine. Educational estimate only." />
          </div>
          <FieldShell muted>
            <input
              readOnly
              className={inputClass}
              value={hasResult ? result.formattedEttDepth.replace(/ (cm|in)$/, '') : ''}
              aria-label="Ideal ETT depth"
            />
            <select
              className={selectClass}
              aria-label="ETT depth unit"
              value={input.depthUnit}
              onChange={(e) =>
                set({ depthUnit: e.target.value as DepthUnit })
              }
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <div className={labelClass}>
            Ideal body weight
            <InfoTooltip text="Devine IBW from height and sex. Tidal-volume band uses 6–8 mL per kg IBW." />
          </div>
          <FieldShell muted>
            <input
              readOnly
              className={inputClass}
              value={hasResult ? result.formattedIbw : ''}
              aria-label="Ideal body weight"
            />
          </FieldShell>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className={labelClass}>
              Tidal volume (min)
              <InfoTooltip text="6 mL × IBW (kg)." />
            </div>
            <FieldShell muted>
              <input
                readOnly
                className={inputClass}
                value={
                  hasResult
                    ? result.formattedVtMin.replace(/ (mL|L)$/, '')
                    : ''
                }
                aria-label="Minimum tidal volume"
              />
              <select
                className={selectClass}
                aria-label="Tidal volume unit"
                value={input.volumeUnit}
                onChange={(e) =>
                  set({ volumeUnit: e.target.value as VolumeUnit })
                }
              >
                <option value="mL">mL</option>
                <option value="L">L</option>
              </select>
            </FieldShell>
          </div>
          <div>
            <div className={labelClass}>
              Tidal volume (max)
              <InfoTooltip text="8 mL × IBW (kg)." />
            </div>
            <FieldShell muted>
              <input
                readOnly
                className={inputClass}
                value={
                  hasResult
                    ? result.formattedVtMax.replace(/ (mL|L)$/, '')
                    : ''
                }
                aria-label="Maximum tidal volume"
              />
              <span className="shrink-0 px-2 text-sm font-medium text-muted-foreground">
                {input.volumeUnit}
              </span>
            </FieldShell>
          </div>
        </div>

        {result ? (
          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </section>
    </form>
  );
}
