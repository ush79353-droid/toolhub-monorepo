'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertLength,
  convertSpeed,
  generateTireCode,
  parseTireCode,
} from './calculation';
import {
  CONSTRUCTION_LABELS,
  LENGTH_UNIT_LABELS,
  SPEED_RATINGS,
  SPEED_UNIT_LABELS,
  createEmptyInput,
  type LengthUnit,
  type SpeedRatingCode,
  type SpeedUnit,
  type TireConstruction,
  type TireFields,
  type TireSizeFieldErrors,
  type TireSizeInput,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function previewCode(fields: TireFields): string {
  const w = Number(fields.width.replace(/,/g, ''));
  const a = Number(fields.aspectRatio.replace(/,/g, ''));
  const r = Number(fields.rimDiameter.replace(/,/g, ''));
  if (!(w > 0) || !(a > 0) || !(r > 0)) return '—';
  const widthMm = convertLength(w, fields.widthUnit, 'mm');
  const rimIn = convertLength(r, fields.rimUnit, 'in');
  const li =
    fields.loadIndex.trim() === ''
      ? null
      : Number(fields.loadIndex.replace(/,/g, ''));
  const sr = fields.speedRating.trim() === '' ? null : fields.speedRating;
  return generateTireCode(
    widthMm,
    a,
    fields.construction,
    rimIn,
    Number.isFinite(li) ? li : null,
    sr,
  );
}

interface TireSizeFormProps {
  input: TireSizeInput;
  errors: TireSizeFieldErrors;
  onChange: (next: TireSizeInput) => void;
}

function TireBlock({
  title,
  fields,
  errors,
  widthKey,
  aspectKey,
  rimKey,
  onPatch,
}: {
  title: string;
  fields: TireFields;
  errors: TireSizeFieldErrors;
  widthKey: 'width' | 'repWidth';
  aspectKey: 'aspectRatio' | 'repAspectRatio';
  rimKey: 'rimDiameter' | 'repRimDiameter';
  onPatch: (patch: Partial<TireFields>) => void;
}) {
  const changeWidthUnit = (next: LengthUnit) => {
    const n = Number(fields.width.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      onPatch({
        widthUnit: next,
        width: String(
          Number(convertLength(n, fields.widthUnit, next).toPrecision(12)),
        ),
      });
      return;
    }
    onPatch({ widthUnit: next });
  };

  const changeRimUnit = (next: LengthUnit) => {
    const n = Number(fields.rimDiameter.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      onPatch({
        rimUnit: next,
        rimDiameter: String(
          Number(convertLength(n, fields.rimUnit, next).toPrecision(12)),
        ),
      });
      return;
    }
    onPatch({ rimUnit: next });
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
      <h3 className="text-[13px] font-semibold text-accent">{title}</h3>

      <div className="rounded-lg border border-dashed border-border bg-muted/15 px-3 py-2.5">
        <p className="text-[11px] text-muted-foreground">Tire code</p>
        <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-accent">
          {previewCode(fields)}
        </p>
      </div>

      <div>
        <label className={labelClass}>
          Width
          <InfoTooltip
            label="Section width"
            text="Tire section width. Tire codes use millimeters even if you enter inches."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors[widthKey]}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={fields.width}
              onChange={(e) => onPatch({ width: e.target.value })}
              aria-label={`${title} width`}
            />
          </FieldShell>
          <select
            className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
            value={fields.widthUnit}
            aria-label={`${title} width unit`}
            onChange={(e) => changeWidthUnit(e.target.value as LengthUnit)}
          >
            {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
              <option key={u} value={u}>
                {LENGTH_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors[widthKey] ? (
          <p className="mt-1 text-xs text-rose-600">{errors[widthKey]}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass}>
          Profile ratio
          <InfoTooltip
            label="Aspect ratio"
            text="Sidewall height as a percent of section width."
          />
        </label>
        <FieldShell error={errors[aspectKey]}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={fields.aspectRatio}
            onChange={(e) => onPatch({ aspectRatio: e.target.value })}
            aria-label={`${title} profile ratio`}
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors[aspectKey] ? (
          <p className="mt-1 text-xs text-rose-600">{errors[aspectKey]}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>Tire construction</legend>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(CONSTRUCTION_LABELS) as TireConstruction[]).map(
            (c) => (
              <label
                key={c}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name={`${title}-construction`}
                  className="h-4 w-4 border-border"
                  checked={fields.construction === c}
                  onChange={() => onPatch({ construction: c })}
                />
                {CONSTRUCTION_LABELS[c]}
              </label>
            ),
          )}
        </div>
      </fieldset>

      <div>
        <label className={labelClass}>Rim diameter</label>
        <div className="flex gap-2">
          <FieldShell error={errors[rimKey]}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={fields.rimDiameter}
              onChange={(e) => onPatch({ rimDiameter: e.target.value })}
              aria-label={`${title} rim diameter`}
            />
          </FieldShell>
          <select
            className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
            value={fields.rimUnit}
            aria-label={`${title} rim unit`}
            onChange={(e) => changeRimUnit(e.target.value as LengthUnit)}
          >
            {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
              <option key={u} value={u}>
                {LENGTH_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors[rimKey] ? (
          <p className="mt-1 text-xs text-rose-600">{errors[rimKey]}</p>
        ) : null}
      </div>
    </div>
  );
}

export function TireSizeForm({
  input,
  errors,
  onChange,
}: TireSizeFormProps) {
  const set = (patch: Partial<TireSizeInput>) =>
    onChange({ ...input, ...patch });

  const patchPrimary = (patch: Partial<TireFields>) =>
    set({ primary: { ...input.primary, ...patch } });

  const patchRep = (patch: Partial<TireFields>) =>
    set({ replacement: { ...input.replacement, ...patch } });

  const applyParsedCode = (raw: string) => {
    const p = parseTireCode(raw);
    if (!p) {
      set({
        primary: input.primary,
      });
      return false;
    }
    patchPrimary({
      width: String(p.widthMm),
      widthUnit: 'mm',
      aspectRatio: String(p.aspectRatio),
      construction: p.construction,
      rimDiameter: String(p.rimIn),
      rimUnit: 'in',
      loadIndex: p.loadIndex != null ? String(p.loadIndex) : '',
      speedRating: (p.speedRating ?? '') as SpeedRatingCode,
    });
    return true;
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        The Tire Size Calculator helps you determine tire diameter, sidewall
        height, circumference, and other dimensions using the tire code printed
        on a tire&apos;s sidewall. Results are theoretical unloaded geometry.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (225/65 R17)
        </button>
      </div>

      <div>
        <label htmlFor="ts-parse" className={labelClass}>
          Paste tire code (optional)
          <InfoTooltip
            label="Parse marking"
            text="Accepts formats like 225/65R17 or 225/65 R17 98H."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.tireCode}>
            <input
              id="ts-parse"
              className={inputClass}
              placeholder="225/65R17"
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (!v) return;
                if (!applyParsedCode(v)) {
                  onChange({ ...input });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v && !applyParsedCode(v)) {
                    /* keep */
                  }
                }
              }}
            />
          </FieldShell>
        </div>
      </div>

      <TireBlock
        title="Tire size"
        fields={input.primary}
        errors={errors}
        widthKey="width"
        aspectKey="aspectRatio"
        rimKey="rimDiameter"
        onPatch={patchPrimary}
      />

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-[13px] font-semibold text-accent"
          onClick={() => set({ showAdditional: !input.showAdditional })}
          aria-expanded={input.showAdditional}
        >
          Additional parameters
          <span className="text-muted-foreground">
            {input.showAdditional ? '−' : '+'}
          </span>
        </button>
        {input.showAdditional ? (
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="ts-li" className={labelClass}>
                Load index (optional)
                <InfoTooltip
                  label="Load index"
                  text="Shown on the tire code when provided. This tool does not convert it to a kg rating."
                />
              </label>
              <FieldShell error={errors.loadIndex}>
                <input
                  id="ts-li"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.primary.loadIndex}
                  onChange={(e) => patchPrimary({ loadIndex: e.target.value })}
                />
              </FieldShell>
              {errors.loadIndex ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loadIndex}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ts-sr" className={labelClass}>
                Speed rating (optional)
              </label>
              <select
                id="ts-sr"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.primary.speedRating}
                onChange={(e) =>
                  patchPrimary({
                    speedRating: e.target.value as SpeedRatingCode,
                  })
                }
              >
                {SPEED_RATINGS.map((r) => (
                  <option key={r || 'none'} value={r}>
                    {r === '' ? 'None' : r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.compare}
          onChange={(e) => set({ compare: e.target.checked })}
        />
        Compare with another tire
      </label>

      {input.compare ? (
        <>
          <TireBlock
            title="Replacement tire"
            fields={input.replacement}
            errors={errors}
            widthKey="repWidth"
            aspectKey="repAspectRatio"
            rimKey="repRimDiameter"
            onPatch={patchRep}
          />
          <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
            <h3 className="text-[13px] font-semibold text-accent">
              Indicated speed
            </h3>
            <div className="flex gap-2">
              <FieldShell error={errors.indicatedSpeed}>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={input.indicatedSpeed}
                  onChange={(e) => set({ indicatedSpeed: e.target.value })}
                  aria-label="Indicated speed"
                />
              </FieldShell>
              <select
                className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                value={input.indicatedSpeedUnit}
                aria-label="Speed unit"
                onChange={(e) => {
                  const next = e.target.value as SpeedUnit;
                  const n = Number(input.indicatedSpeed.replace(/,/g, ''));
                  if (Number.isFinite(n) && n > 0) {
                    set({
                      indicatedSpeedUnit: next,
                      indicatedSpeed: String(
                        Number(
                          convertSpeed(
                            n,
                            input.indicatedSpeedUnit,
                            next,
                          ).toPrecision(12),
                        ),
                      ),
                    });
                  } else {
                    set({ indicatedSpeedUnit: next });
                  }
                }}
              >
                {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {SPEED_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.indicatedSpeed ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.indicatedSpeed}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
