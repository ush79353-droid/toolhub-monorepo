'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cubicMetersToVolume,
  formatMeasure,
  lengthToMeters,
  metersToLength,
  volumeToCubicMeters,
} from './calculation';
import {
  LENGTH_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  type CalcSource,
  type CubicMeterFieldErrors,
  type CubicMeterInput,
  type LengthUnit,
  type MissingDimension,
  type MissingDimensionFieldErrors,
  type MissingDimensionInput,
  type MissingDimensionResult,
  type OtherUnitRow,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CubicMeterDraft {
  source: CalcSource;
  length: string;
  width: string;
  height: string;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
  volumeOther: string;
  volumeUnit: VolumeUnit;
  volumeM3: string;
  moreOpen: boolean;
  missingOpen: boolean;
}

export interface MissingDraft {
  unknown: MissingDimension;
  volumeCubicMeters: string;
  length: string;
  width: string;
  height: string;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
  resultUnit: LengthUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

function preserveLength(value: string, from: LengthUnit, to: LengthUnit): string {
  if (from === to) return value;
  const parsed = parseOptionalNumber(value);
  if (parsed === null || !Number.isFinite(parsed)) return value;
  return formatMeasure(metersToLength(lengthToMeters(parsed, from), to));
}

function preserveVolume(value: string, from: VolumeUnit, to: VolumeUnit): string {
  if (from === to) return value;
  const parsed = parseOptionalNumber(value);
  if (parsed === null || !Number.isFinite(parsed)) return value;
  return formatMeasure(cubicMetersToVolume(volumeToCubicMeters(parsed, from), to));
}

export function inputToDraft(input: CubicMeterInput): CubicMeterDraft {
  return {
    source: input.source,
    length: input.length === null ? '' : formatMeasure(input.length),
    width: input.width === null ? '' : formatMeasure(input.width),
    height: input.height === null ? '' : formatMeasure(input.height),
    lengthUnit: input.lengthUnit,
    widthUnit: input.widthUnit,
    heightUnit: input.heightUnit,
    volumeOther: input.volume === null ? '' : formatMeasure(input.volume),
    volumeUnit: input.volumeUnit,
    volumeM3: '',
    moreOpen: false,
    missingOpen: false,
  };
}

export function draftToInput(draft: CubicMeterDraft): CubicMeterInput {
  if (draft.source === 'volume') {
    // Prefer the field last edited — volumeOther when unit isn't m3, else volumeM3.
    const fromOther = parseOptionalNumber(draft.volumeOther);
    const fromM3 = parseOptionalNumber(draft.volumeM3);
    const usingM3 = draft.volumeUnit === 'm3';
    return {
      source: 'volume',
      length: null,
      width: null,
      height: null,
      lengthUnit: draft.lengthUnit,
      widthUnit: draft.widthUnit,
      heightUnit: draft.heightUnit,
      volume: usingM3 ? fromM3 : fromOther,
      volumeUnit: usingM3 ? 'm3' : draft.volumeUnit,
    };
  }
  return {
    source: 'dimensions',
    length: parseOptionalNumber(draft.length),
    width: parseOptionalNumber(draft.width),
    height: parseOptionalNumber(draft.height),
    lengthUnit: draft.lengthUnit,
    widthUnit: draft.widthUnit,
    heightUnit: draft.heightUnit,
    volume: null,
    volumeUnit: draft.volumeUnit,
  };
}

/** Volume-mode draft: which volume text field was edited. */
export function draftToVolumeInput(
  draft: CubicMeterDraft,
  edited: 'other' | 'm3'
): CubicMeterInput {
  if (edited === 'm3') {
    return {
      source: 'volume',
      length: null,
      width: null,
      height: null,
      lengthUnit: draft.lengthUnit,
      widthUnit: draft.widthUnit,
      heightUnit: draft.heightUnit,
      volume: parseOptionalNumber(draft.volumeM3),
      volumeUnit: 'm3',
    };
  }
  return {
    source: 'volume',
    length: null,
    width: null,
    height: null,
    lengthUnit: draft.lengthUnit,
    widthUnit: draft.widthUnit,
    heightUnit: draft.heightUnit,
    volume: parseOptionalNumber(draft.volumeOther),
    volumeUnit: draft.volumeUnit,
  };
}

export function emptyMissingDraft(): MissingDraft {
  return {
    unknown: 'length',
    volumeCubicMeters: '',
    length: '',
    width: '',
    height: '',
    lengthUnit: 'm',
    widthUnit: 'm',
    heightUnit: 'm',
    resultUnit: 'm',
  };
}

export function missingDraftToInput(draft: MissingDraft): MissingDimensionInput {
  return {
    unknown: draft.unknown,
    volumeCubicMeters: parseOptionalNumber(draft.volumeCubicMeters),
    length: parseOptionalNumber(draft.length),
    width: parseOptionalNumber(draft.width),
    height: parseOptionalNumber(draft.height),
    lengthUnit: draft.lengthUnit,
    widthUnit: draft.widthUnit,
    heightUnit: draft.heightUnit,
    resultUnit: draft.resultUnit,
  };
}

interface CubicMeterFormProps {
  draft: CubicMeterDraft;
  errors: CubicMeterFieldErrors;
  cubicMeters: number | null;
  volumeOtherDisplay: string;
  volumeM3Display: string;
  otherUnits: readonly OtherUnitRow[] | null;
  missingDraft: MissingDraft;
  missingErrors: MissingDimensionFieldErrors;
  missingResult: MissingDimensionResult | null;
  onDraftChange: (draft: CubicMeterDraft, volumeEdited?: 'other' | 'm3') => void;
  onMissingChange: (draft: MissingDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CubicMeterForm({
  draft,
  errors,
  cubicMeters,
  volumeOtherDisplay,
  volumeM3Display,
  otherUnits,
  missingDraft,
  missingErrors,
  missingResult,
  onDraftChange,
  onMissingChange,
  onSubmit,
  onReset,
}: CubicMeterFormProps) {
  const set = (patch: Partial<CubicMeterDraft>, volumeEdited?: 'other' | 'm3') =>
    onDraftChange({ ...draft, ...patch }, volumeEdited);
  const setMissing = (patch: Partial<MissingDraft>) =>
    onMissingChange({ ...missingDraft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-accent">Calculate volume</h3>
        <p className="text-xs text-muted-foreground">
          Enter the dimensions of a rectangular object or space. Volume = height × length × width.
        </p>
      </div>

      <FieldShell
        label="Height"
        htmlFor="cm3-height"
        tip="Vertical edge. Each dimension can use its own unit."
        error={errors.height}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm3-height"
              inputMode="decimal"
              className={inputClass}
              value={draft.height}
              placeholder="Enter height"
              aria-invalid={Boolean(errors.height)}
              onChange={(event) =>
                set({ source: 'dimensions', height: event.target.value })
              }
            />
          </div>
          <select
            aria-label="Height unit"
            className={selectClass}
            value={draft.heightUnit}
            onChange={(event) => {
              const next = event.target.value as LengthUnit;
              set({
                source: 'dimensions',
                heightUnit: next,
                height: preserveLength(draft.height, draft.heightUnit, next),
              });
            }}
          >
            {LENGTH_UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Length"
        htmlFor="cm3-length"
        tip="One base edge of the rectangular prism."
        error={errors.length}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm3-length"
              inputMode="decimal"
              className={inputClass}
              value={draft.length}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.length)}
              onChange={(event) =>
                set({ source: 'dimensions', length: event.target.value })
              }
            />
          </div>
          <select
            aria-label="Length unit"
            className={selectClass}
            value={draft.lengthUnit}
            onChange={(event) => {
              const next = event.target.value as LengthUnit;
              set({
                source: 'dimensions',
                lengthUnit: next,
                length: preserveLength(draft.length, draft.lengthUnit, next),
              });
            }}
          >
            {LENGTH_UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Width"
        htmlFor="cm3-width"
        tip="The perpendicular base edge."
        error={errors.width}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm3-width"
              inputMode="decimal"
              className={inputClass}
              value={draft.width}
              placeholder="Enter width"
              aria-invalid={Boolean(errors.width)}
              onChange={(event) =>
                set({ source: 'dimensions', width: event.target.value })
              }
            />
          </div>
          <select
            aria-label="Width unit"
            className={selectClass}
            value={draft.widthUnit}
            onChange={(event) => {
              const next = event.target.value as LengthUnit;
              set({
                source: 'dimensions',
                widthUnit: next,
                width: preserveLength(draft.width, draft.widthUnit, next),
              });
            }}
          >
            {LENGTH_UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <div className="border-t border-border pt-4 space-y-1">
        <h3 className="text-sm font-semibold text-accent">Conversion to cubic meters</h3>
        <p className="text-xs text-muted-foreground">
          Enter a known volume to convert into cubic meters. This does not invent length, width, or
          height.
        </p>
      </div>

      <FieldShell
        label="Volume in other units"
        htmlFor="cm3-vol-other"
        tip="Edit here to convert from the selected volume unit into cubic meters."
        error={draft.source === 'volume' && draft.volumeUnit !== 'm3' ? errors.volume : undefined}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm3-vol-other"
              inputMode="decimal"
              className={inputClass}
              value={volumeOtherDisplay}
              placeholder="Enter volume"
              onChange={(event) =>
                set(
                  {
                    source: 'volume',
                    volumeOther: event.target.value,
                    volumeM3: draft.volumeM3,
                  },
                  'other'
                )
              }
            />
          </div>
          <select
            aria-label="Volume unit"
            className={selectClass}
            value={draft.volumeUnit}
            onChange={(event) => {
              const next = event.target.value as VolumeUnit;
              set({
                volumeUnit: next,
                volumeOther: preserveVolume(volumeOtherDisplay, draft.volumeUnit, next),
              });
            }}
          >
            {VOLUME_UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in cubic meters"
        htmlFor="cm3-vol-m3"
        tip="Primary result in m³. Editing this field switches to volume-conversion mode."
        error={draft.source === 'volume' && draft.volumeUnit === 'm3' ? errors.volume : undefined}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm3-vol-m3"
              inputMode="decimal"
              className={inputClass}
              value={volumeM3Display}
              placeholder="Calculated volume"
              aria-live="polite"
              onChange={(event) =>
                set(
                  {
                    source: 'volume',
                    volumeM3: event.target.value,
                    volumeOther: draft.volumeOther,
                  },
                  'm3'
                )
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m³
          </span>
        </div>
      </FieldShell>

      {cubicMeters !== null && draft.source === 'dimensions' ? (
        <p className="text-xs text-muted-foreground">
          From dimensions: {formatMeasure(cubicMeters)} m³
        </p>
      ) : null}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {otherUnits && otherUnits.length > 0 ? (
              <ul className="divide-y divide-border">
                {otherUnits.map((row) => (
                  <li
                    key={row.unit}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatMeasure(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter dimensions or a volume to see cubic feet, yards, inches, liters, and gallons.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.missingOpen}
          onClick={() => set({ missingOpen: !draft.missingOpen })}
        >
          <span>Find a missing dimension</span>
          {draft.missingOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.missingOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            <p className="text-xs text-muted-foreground">
              Provide volume in cubic meters and two known edges. Separate from the main calculator.
            </p>
            <FieldShell label="Unknown dimension" htmlFor="cm3-unknown">
              <select
                id="cm3-unknown"
                className={`${selectClass} w-full`}
                value={missingDraft.unknown}
                onChange={(event) =>
                  setMissing({ unknown: event.target.value as MissingDimension })
                }
              >
                <option value="length">Length</option>
                <option value="width">Width</option>
                <option value="height">Height</option>
              </select>
            </FieldShell>
            <FieldShell
              label="Volume (m³)"
              htmlFor="cm3-miss-vol"
              error={missingErrors.volumeCubicMeters}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cm3-miss-vol"
                    inputMode="decimal"
                    className={inputClass}
                    value={missingDraft.volumeCubicMeters}
                    placeholder="Enter volume"
                    onChange={(event) =>
                      setMissing({ volumeCubicMeters: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  m³
                </span>
              </div>
            </FieldShell>
            {missingDraft.unknown !== 'length' ? (
              <FieldShell label="Length" htmlFor="cm3-miss-l" error={missingErrors.length}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="cm3-miss-l"
                      inputMode="decimal"
                      className={inputClass}
                      value={missingDraft.length}
                      onChange={(event) => setMissing({ length: event.target.value })}
                    />
                  </div>
                  <select
                    aria-label="Missing-mode length unit"
                    className={selectClass}
                    value={missingDraft.lengthUnit}
                    onChange={(event) => {
                      const next = event.target.value as LengthUnit;
                      setMissing({
                        lengthUnit: next,
                        length: preserveLength(
                          missingDraft.length,
                          missingDraft.lengthUnit,
                          next
                        ),
                      });
                    }}
                  >
                    {LENGTH_UNIT_OPTIONS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FieldShell>
            ) : null}
            {missingDraft.unknown !== 'width' ? (
              <FieldShell label="Width" htmlFor="cm3-miss-w" error={missingErrors.width}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="cm3-miss-w"
                      inputMode="decimal"
                      className={inputClass}
                      value={missingDraft.width}
                      onChange={(event) => setMissing({ width: event.target.value })}
                    />
                  </div>
                  <select
                    aria-label="Missing-mode width unit"
                    className={selectClass}
                    value={missingDraft.widthUnit}
                    onChange={(event) => {
                      const next = event.target.value as LengthUnit;
                      setMissing({
                        widthUnit: next,
                        width: preserveLength(missingDraft.width, missingDraft.widthUnit, next),
                      });
                    }}
                  >
                    {LENGTH_UNIT_OPTIONS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FieldShell>
            ) : null}
            {missingDraft.unknown !== 'height' ? (
              <FieldShell label="Height" htmlFor="cm3-miss-h" error={missingErrors.height}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="cm3-miss-h"
                      inputMode="decimal"
                      className={inputClass}
                      value={missingDraft.height}
                      onChange={(event) => setMissing({ height: event.target.value })}
                    />
                  </div>
                  <select
                    aria-label="Missing-mode height unit"
                    className={selectClass}
                    value={missingDraft.heightUnit}
                    onChange={(event) => {
                      const next = event.target.value as LengthUnit;
                      setMissing({
                        heightUnit: next,
                        height: preserveLength(
                          missingDraft.height,
                          missingDraft.heightUnit,
                          next
                        ),
                      });
                    }}
                  >
                    {LENGTH_UNIT_OPTIONS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FieldShell>
            ) : null}
            <FieldShell label="Result unit" htmlFor="cm3-miss-result-unit">
              <select
                id="cm3-miss-result-unit"
                className={`${selectClass} w-full`}
                value={missingDraft.resultUnit}
                onChange={(event) =>
                  setMissing({ resultUnit: event.target.value as LengthUnit })
                }
              >
                {LENGTH_UNIT_OPTIONS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </FieldShell>
            {missingResult ? (
              <p className="rounded-lg bg-brand-softTeal/40 px-3 py-2.5 text-sm font-medium tabular-nums text-accent">
                {missingResult.unknown.charAt(0).toUpperCase() + missingResult.unknown.slice(1)}{' '}
                = {formatMeasure(missingResult.value)} {missingResult.unit}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter volume and the two known dimensions to solve for the third.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
