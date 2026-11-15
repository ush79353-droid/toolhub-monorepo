'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  metersToLength,
  squareMetersToArea,
  areaToSquareMeters,
  lengthToMeters,
  roundDisplay,
} from './calculation';
import {
  AREA_UNIT_OPTIONS,
  LENGTH_UNIT_OPTIONS,
  type AcreageFieldErrors,
  type AcreageInput,
  type AcreageMode,
  type AreaUnit,
  type LengthUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AcreageDraft {
  mode: AcreageMode;
  width: string;
  length: string;
  area: string;
  widthUnit: LengthUnit;
  lengthUnit: LengthUnit;
  areaUnit: AreaUnit;
  pricePerUnit: string;
  priceAreaUnit: AreaUnit;
  currency: AcreageInput['currency'];
  priceOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

function formatAmount(value: number | null): string {
  return value === null ? '' : String(value);
}

export function inputToDraft(input: AcreageInput, priceOpen = false): AcreageDraft {
  return {
    mode: input.mode,
    width: formatAmount(input.width),
    length: formatAmount(input.length),
    area: formatAmount(input.area),
    widthUnit: input.widthUnit,
    lengthUnit: input.lengthUnit,
    areaUnit: input.areaUnit,
    pricePerUnit: formatAmount(input.pricePerUnit),
    priceAreaUnit: input.priceAreaUnit,
    currency: input.currency,
    priceOpen,
  };
}

export function draftToInput(draft: AcreageDraft): AcreageInput {
  return {
    mode: draft.mode,
    width: parseOptionalNumber(draft.width),
    length: parseOptionalNumber(draft.length),
    area: parseOptionalNumber(draft.area),
    widthUnit: draft.widthUnit,
    lengthUnit: draft.lengthUnit,
    areaUnit: draft.areaUnit,
    pricePerUnit: parseOptionalNumber(draft.pricePerUnit),
    priceAreaUnit: draft.priceAreaUnit,
    currency: draft.currency,
  };
}

function preserveLength(value: string, from: LengthUnit, to: LengthUnit): string {
  if (from === to) return value;
  const parsed = parseOptionalNumber(value);
  if (parsed === null || !Number.isFinite(parsed)) return value;
  return String(roundDisplay(metersToLength(lengthToMeters(parsed, from), to)));
}

function preserveArea(value: string, from: AreaUnit, to: AreaUnit): string {
  if (from === to) return value;
  const parsed = parseOptionalNumber(value);
  if (parsed === null || !Number.isFinite(parsed)) return value;
  return String(roundDisplay(squareMetersToArea(areaToSquareMeters(parsed, from), to)));
}

function preservePriceDensity(value: string, from: AreaUnit, to: AreaUnit): string {
  if (from === to) return value;
  const parsed = parseOptionalNumber(value);
  if (parsed === null || !Number.isFinite(parsed)) return value;
  // Price per from-unit → price per to-unit: multiply by (from m² / to m²)
  const perSquareMeter = parsed / areaToSquareMeters(1, from);
  const next = perSquareMeter * areaToSquareMeters(1, to);
  return String(roundDisplay(next));
}

interface AcreageFormProps {
  draft: AcreageDraft;
  errors: AcreageFieldErrors;
  onDraftChange: (draft: AcreageDraft) => void;
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

export function AcreageForm({ draft, errors, onDraftChange, onSubmit, onReset }: AcreageFormProps) {
  const set = (patch: Partial<AcreageDraft>) => onDraftChange({ ...draft, ...patch });
  const symbol = getCurrencySymbol(draft.currency);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div
        className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-muted/40 p-1"
        role="group"
        aria-label="Calculation mode"
      >
        {(
          [
            { value: 'dimensions' as const, label: 'Width × length' },
            { value: 'area' as const, label: 'Area conversion' },
          ] as const
        ).map((option) => {
          const active = draft.mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => set({ mode: option.value })}
              className={`h-9 flex-1 rounded-md px-3 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:bg-white hover:text-accent'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {draft.mode === 'dimensions' ? (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <FieldShell
            label="Width"
            htmlFor="acreage-width"
            tip="One side of a rectangular plot. Must be greater than zero."
            error={errors.width}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="acreage-width"
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
            label="Length"
            htmlFor="acreage-length"
            tip="The other side of a rectangular plot. Must be greater than zero."
            error={errors.length}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="acreage-length"
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
        </div>
      ) : (
        <FieldShell
          label="Area"
          htmlFor="acreage-area-input"
          tip="Enter an area to convert. This mode does not invent a width and length."
          error={errors.area}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="acreage-area-input"
                inputMode="decimal"
                className={inputClass}
                value={draft.area}
                placeholder="Enter area"
                aria-invalid={Boolean(errors.area)}
                onChange={(event) => set({ area: event.target.value })}
              />
            </div>
            <select
              aria-label="Area unit"
              className={selectClass}
              value={draft.areaUnit}
              onChange={(event) => {
                const next = event.target.value as AreaUnit;
                set({
                  areaUnit: next,
                  area: preserveArea(draft.area, draft.areaUnit, next),
                });
              }}
            >
              {AREA_UNIT_OPTIONS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </FieldShell>
      )}

      {draft.mode === 'dimensions' ? (
        <FieldShell
          label="Area unit"
          htmlFor="acreage-area-unit"
          tip="The rectangular area is shown in this unit. Switching units keeps the same physical area."
        >
          <select
            id="acreage-area-unit"
            className={`${selectClass} w-full sm:w-auto`}
            value={draft.areaUnit}
            onChange={(event) => set({ areaUnit: event.target.value as AreaUnit })}
          >
            {AREA_UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </FieldShell>
      ) : null}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.priceOpen}
          onClick={() => set({ priceOpen: !draft.priceOpen })}
        >
          <span>Unit and total price</span>
          {draft.priceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.priceOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <FieldShell
              label={`Price per ${AREA_UNIT_OPTIONS.find((u) => u.value === draft.priceAreaUnit)?.label ?? 'unit'}`}
              htmlFor="acreage-price"
              tip="Optional. Total price uses the current area converted into the selected pricing unit. Currency changes the symbol only."
              error={errors.pricePerUnit}
            >
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id="acreage-price"
                    inputMode="decimal"
                    className={`${inputClass} pl-8`}
                    value={draft.pricePerUnit}
                    placeholder="0"
                    aria-invalid={Boolean(errors.pricePerUnit)}
                    onChange={(event) => set({ pricePerUnit: event.target.value })}
                  />
                </div>
                <select
                  aria-label="Price area unit"
                  className={selectClass}
                  value={draft.priceAreaUnit}
                  onChange={(event) => {
                    const next = event.target.value as AreaUnit;
                    set({
                      priceAreaUnit: next,
                      pricePerUnit: preservePriceDensity(
                        draft.pricePerUnit,
                        draft.priceAreaUnit,
                        next
                      ),
                    });
                  }}
                >
                  {AREA_UNIT_OPTIONS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {draft.currency}/{unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>
            <p className="text-xs text-muted-foreground">
              Display currency is chosen in the calculator header. Changing it does not convert the
              numbers.
            </p>
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
