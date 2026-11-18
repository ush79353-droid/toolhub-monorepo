'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  areaToSquareMeters,
  lengthToMeters,
  metersToLength,
  roundDisplay,
} from './calculation';
import {
  AREA_UNIT_OPTIONS,
  LENGTH_UNIT_OPTIONS,
  type AreaUnit,
  type LandAreaFieldErrors,
  type LandAreaInput,
  type LengthUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LandAreaDraft {
  width: string;
  length: string;
  area: string;
  widthUnit: LengthUnit;
  lengthUnit: LengthUnit;
  areaUnit: AreaUnit;
  pricePerUnit: string;
  priceAreaUnit: AreaUnit;
  currency: SupportedCurrency;
  priceOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function draftToInput(draft: LandAreaDraft): LandAreaInput {
  return {
    width: parseOptionalNumber(draft.width),
    length: parseOptionalNumber(draft.length),
    widthUnit: draft.widthUnit,
    lengthUnit: draft.lengthUnit,
    areaUnit: draft.areaUnit,
    pricePerUnit: parseOptionalNumber(draft.pricePerUnit),
    priceAreaUnit: draft.priceAreaUnit,
    currency: draft.currency,
  };
}

export function emptyDraft(currency: SupportedCurrency = 'USD'): LandAreaDraft {
  return {
    width: '',
    length: '',
    area: '',
    widthUnit: 'm',
    lengthUnit: 'm',
    areaUnit: 'm2',
    pricePerUnit: '',
    priceAreaUnit: 'm2',
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

function preservePriceDensity(value: string, from: AreaUnit, to: AreaUnit): string {
  if (from === to) return value;
  const parsed = parseOptionalNumber(value);
  if (parsed === null || !Number.isFinite(parsed)) return value;
  const perSquareMeter = parsed / areaToSquareMeters(1, from);
  return String(roundDisplay(perSquareMeter * areaToSquareMeters(1, to)));
}

interface LandAreaFormProps {
  draft: LandAreaDraft;
  errors: LandAreaFieldErrors;
  onDraftChange: (draft: LandAreaDraft) => void;
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

export function LandAreaForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LandAreaFormProps) {
  const set = (patch: Partial<LandAreaDraft>) => onDraftChange({ ...draft, ...patch });
  const symbol = getCurrencySymbol(draft.currency);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Rectangular land only: Area = Length × Width after converting both sides to meters.
        Changing length units keeps the same physical size. Currency selection changes the
        denomination, not the exchange rate.
      </div>

      <FieldShell
        label="Width"
        htmlFor="land-area-width"
        tip="One side of a rectangular plot. Cannot be negative."
        error={errors.width}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="land-area-width"
              inputMode="decimal"
              autoComplete="off"
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
        htmlFor="land-area-length"
        tip="The other side of a rectangular plot. Cannot be negative."
        error={errors.length}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="land-area-length"
              inputMode="decimal"
              autoComplete="off"
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
        label="Area"
        htmlFor="land-area-area"
        tip="Calculated from width × length. Changing the unit converts the displayed area only."
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/30">
            <input
              id="land-area-area"
              readOnly
              className={`${inputClass} cursor-default`}
              value={draft.area}
              placeholder="Calculated result"
              aria-live="polite"
            />
          </div>
          <select
            aria-label="Area unit"
            className={selectClass}
            value={draft.areaUnit}
            onChange={(event) => set({ areaUnit: event.target.value as AreaUnit })}
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
              label="Price per unit area"
              htmlFor="land-area-price"
              tip="Optional. Total uses the current land area converted into the pricing unit."
              error={errors.pricePerUnit}
            >
              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id="land-area-price"
                    inputMode="decimal"
                    className={`${inputClass} pl-8`}
                    value={draft.pricePerUnit}
                    placeholder="Enter price"
                    aria-invalid={Boolean(errors.pricePerUnit)}
                    onChange={(event) => set({ pricePerUnit: event.target.value })}
                  />
                </div>
                <div className="w-[120px] shrink-0 sm:w-[140px]">
                  <CurrencySelect
                    id="land-area-currency"
                    aria-label="Currency"
                    value={draft.currency}
                    onChange={(currency) => set({ currency })}
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
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>
            <p className="text-xs text-muted-foreground">
              Currency changes the symbol only — it does not convert the entered price.
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
