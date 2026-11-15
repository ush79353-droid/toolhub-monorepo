'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure, lengthToMeters, metersToLength } from './calculation';
import { PrismIllustration } from './PrismIllustration';
import {
  LENGTH_UNIT_OPTIONS,
  type CubicFeetFieldErrors,
  type CubicFeetInput,
  type LengthUnit,
  type MissingDimension,
  type MissingDimensionFieldErrors,
  type MissingDimensionInput,
  type MissingDimensionResult,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CubicFeetDraft {
  length: string;
  width: string;
  height: string;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
  moreOpen: boolean;
  missingOpen: boolean;
}

export interface MissingDraft {
  unknown: MissingDimension;
  volumeCubicFeet: string;
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

export function inputToDraft(input: CubicFeetInput): CubicFeetDraft {
  return {
    length: input.length === null ? '' : formatMeasure(input.length),
    width: input.width === null ? '' : formatMeasure(input.width),
    height: input.height === null ? '' : formatMeasure(input.height),
    lengthUnit: input.lengthUnit,
    widthUnit: input.widthUnit,
    heightUnit: input.heightUnit,
    moreOpen: false,
    missingOpen: false,
  };
}

export function draftToInput(draft: CubicFeetDraft): CubicFeetInput {
  return {
    length: parseOptionalNumber(draft.length),
    width: parseOptionalNumber(draft.width),
    height: parseOptionalNumber(draft.height),
    lengthUnit: draft.lengthUnit,
    widthUnit: draft.widthUnit,
    heightUnit: draft.heightUnit,
  };
}

export function emptyMissingDraft(): MissingDraft {
  return {
    unknown: 'length',
    volumeCubicFeet: '',
    length: '',
    width: '',
    height: '',
    lengthUnit: 'ft',
    widthUnit: 'ft',
    heightUnit: 'ft',
    resultUnit: 'ft',
  };
}

export function missingDraftToInput(draft: MissingDraft): MissingDimensionInput {
  return {
    unknown: draft.unknown,
    volumeCubicFeet: parseOptionalNumber(draft.volumeCubicFeet),
    length: parseOptionalNumber(draft.length),
    width: parseOptionalNumber(draft.width),
    height: parseOptionalNumber(draft.height),
    lengthUnit: draft.lengthUnit,
    widthUnit: draft.widthUnit,
    heightUnit: draft.heightUnit,
    resultUnit: draft.resultUnit,
  };
}

interface CubicFeetFormProps {
  draft: CubicFeetDraft;
  errors: CubicFeetFieldErrors;
  volumeCubicFeet: number | null;
  otherUnits: readonly OtherUnitRow[] | null;
  missingDraft: MissingDraft;
  missingErrors: MissingDimensionFieldErrors;
  missingResult: MissingDimensionResult | null;
  onDraftChange: (draft: CubicFeetDraft) => void;
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

export function CubicFeetForm({
  draft,
  errors,
  volumeCubicFeet,
  otherUnits,
  missingDraft,
  missingErrors,
  missingResult,
  onDraftChange,
  onMissingChange,
  onSubmit,
  onReset,
}: CubicFeetFormProps) {
  const set = (patch: Partial<CubicFeetDraft>) => onDraftChange({ ...draft, ...patch });
  const setMissing = (patch: Partial<MissingDraft>) =>
    onMissingChange({ ...missingDraft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <PrismIllustration />

      <FieldShell
        label="Length"
        htmlFor="cf-length"
        tip="One edge of the rectangular prism. Pick any length unit; volume is computed after converting to meters."
        error={errors.length}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cf-length"
              inputMode="decimal"
              className={inputClass}
              value={draft.length}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.length)}
              onChange={(event) => set({ length: event.target.value })}
            />
          </div>
          <select
            aria-label="Length unit"
            className={selectClass}
            value={draft.lengthUnit}
            onChange={(event) => {
              const next = event.target.value as LengthUnit;
              set({
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
        htmlFor="cf-width"
        tip="The perpendicular edge on the base. Unit may differ from length and height."
        error={errors.width}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cf-width"
              inputMode="decimal"
              className={inputClass}
              value={draft.width}
              placeholder="Enter width"
              aria-invalid={Boolean(errors.width)}
              onChange={(event) => set({ width: event.target.value })}
            />
          </div>
          <select
            aria-label="Width unit"
            className={selectClass}
            value={draft.widthUnit}
            onChange={(event) => {
              const next = event.target.value as LengthUnit;
              set({
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

      <FieldShell
        label="Height"
        htmlFor="cf-height"
        tip="The vertical edge. For soil or fill, this is the depth of the rectangular space."
        error={errors.height}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cf-height"
              inputMode="decimal"
              className={inputClass}
              value={draft.height}
              placeholder="Enter height"
              aria-invalid={Boolean(errors.height)}
              onChange={(event) => set({ height: event.target.value })}
            />
          </div>
          <select
            aria-label="Height unit"
            className={selectClass}
            value={draft.heightUnit}
            onChange={(event) => {
              const next = event.target.value as LengthUnit;
              set({
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
        label="Volume in cubic feet"
        htmlFor="cf-volume"
        tip="Read-only result. Volume = length × width × height after each side is converted to a common unit."
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/30">
            <input
              id="cf-volume"
              readOnly
              className={`${inputClass} cursor-default`}
              value={volumeCubicFeet === null ? '' : formatMeasure(volumeCubicFeet)}
              placeholder="Calculated volume"
              aria-live="polite"
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft³
          </span>
        </div>
      </FieldShell>

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
                Enter length, width, and height to see cubic inches, yards, meters, liters, and
                gallons.
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
              Provide volume in cubic feet and the two known edges. This section is separate from
              the main calculator and does not sync into it.
            </p>
            <FieldShell label="Unknown dimension" htmlFor="cf-unknown">
              <select
                id="cf-unknown"
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
              label="Volume (ft³)"
              htmlFor="cf-miss-vol"
              error={missingErrors.volumeCubicFeet}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cf-miss-vol"
                    inputMode="decimal"
                    className={inputClass}
                    value={missingDraft.volumeCubicFeet}
                    placeholder="Enter volume"
                    onChange={(event) => setMissing({ volumeCubicFeet: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  ft³
                </span>
              </div>
            </FieldShell>
            {missingDraft.unknown !== 'length' ? (
              <FieldShell label="Length" htmlFor="cf-miss-l" error={missingErrors.length}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="cf-miss-l"
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
              <FieldShell label="Width" htmlFor="cf-miss-w" error={missingErrors.width}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="cf-miss-w"
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
              <FieldShell label="Height" htmlFor="cf-miss-h" error={missingErrors.height}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="cf-miss-h"
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
            <FieldShell label="Result unit" htmlFor="cf-miss-result-unit">
              <select
                id="cf-miss-result-unit"
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
