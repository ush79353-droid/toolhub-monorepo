'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  areaToSquareMeters,
  lengthToMeters,
  metersToLength,
  roundDisplay,
  squareMetersToArea,
} from './calculation';
import {
  AREA_UNIT_OPTIONS,
  LENGTH_UNIT_OPTIONS,
  type AreaUnit,
  type LengthUnit,
  type LotSizeSource,
  type LotSizeToSqftFieldErrors,
  type LotSizeToSqftInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LotSizeToSqftDraft {
  source: LotSizeSource;
  width: string;
  length: string;
  area: string;
  widthUnit: LengthUnit;
  lengthUnit: LengthUnit;
  areaUnit: AreaUnit;
  pricePerUnit: string;
  priceAreaUnit: AreaUnit;
  currency: LotSizeToSqftInput['currency'];
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

export function inputToDraft(input: LotSizeToSqftInput, priceOpen = false): LotSizeToSqftDraft {
  return {
    source: input.source,
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

export function draftToInput(draft: LotSizeToSqftDraft): LotSizeToSqftInput {
  return {
    source: draft.source,
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

export function emptyDraft(currency: LotSizeToSqftInput['currency'] = 'USD'): LotSizeToSqftDraft {
  return {
    source: 'dimensions',
    width: '',
    length: '',
    area: '',
    widthUnit: 'ft',
    lengthUnit: 'ft',
    areaUnit: 'ft2',
    pricePerUnit: '',
    priceAreaUnit: 'ft2',
    currency,
    priceOpen: false,
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
  const perSquareMeter = parsed / areaToSquareMeters(1, from);
  const next = perSquareMeter * areaToSquareMeters(1, to);
  return String(roundDisplay(next));
}

interface LotSizeToSqftFormProps {
  draft: LotSizeToSqftDraft;
  errors: LotSizeToSqftFieldErrors;
  onDraftChange: (draft: LotSizeToSqftDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
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

export function LotSizeToSqftForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LotSizeToSqftFormProps) {
  const set = (patch: Partial<LotSizeToSqftDraft>) => onDraftChange({ ...draft, ...patch });
  const symbol = getCurrencySymbol(draft.currency);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Enter width and length for area, or enter area plus one side to solve the missing side.
        Changing units keeps the same physical size. Rectangular lots only.
      </div>

      <FieldShell
        label="Width"
        htmlFor="lot-sqft-width"
        tip="One side of a rectangular lot. Cannot be negative."
        error={errors.width}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lot-sqft-width"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.width}
              placeholder="Enter width"
              aria-invalid={Boolean(errors.width)}
              onChange={(event) => {
                const width = event.target.value;
                const hasLength = draft.length.trim() !== '';
                const hasArea = draft.area.trim() !== '';
                const source: LotSizeSource =
                  hasLength || !hasArea ? 'dimensions' : 'solveLength';
                set({ source, width });
              }}
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
        htmlFor="lot-sqft-length"
        tip="The other side of a rectangular lot. Cannot be negative."
        error={errors.length}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lot-sqft-length"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.length}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.length)}
              onChange={(event) => {
                const length = event.target.value;
                const hasWidth = draft.width.trim() !== '';
                const hasArea = draft.area.trim() !== '';
                const source: LotSizeSource =
                  hasWidth || !hasArea ? 'dimensions' : 'solveWidth';
                set({ source, length });
              }}
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
        label="Area"
        htmlFor="lot-sqft-area"
        tip="Updates from width × length, or enter area with one side to solve the other."
        error={errors.area}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lot-sqft-area"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.area}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.area)}
              onChange={(event) => {
                const area = event.target.value;
                const hasWidth = draft.width.trim() !== '';
                const hasLength = draft.length.trim() !== '';
                let source: LotSizeSource = draft.source;
                if (hasWidth && !hasLength) source = 'solveLength';
                else if (hasLength && !hasWidth) source = 'solveWidth';
                else if (hasWidth && hasLength) {
                  // Prefer solving the side that was not just edited as area authority.
                  source = draft.source === 'solveWidth' ? 'solveWidth' : 'solveLength';
                }
                set({ source, area });
              }}
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
              htmlFor="lot-sqft-price"
              tip="Optional. Total price uses the current lot area converted into the pricing unit. Currency changes the symbol only."
              error={errors.pricePerUnit}
            >
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id="lot-sqft-price"
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
                        next,
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

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Calculate
        </button>
      </div>
    </form>
  );
}
