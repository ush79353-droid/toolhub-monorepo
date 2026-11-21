'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  CURRENCY_DENOMINATION_NOTE,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  GALLON_SYSTEM_LABELS,
  LITERS_PER_GALLON,
  type GallonSystem,
  type PricePerLiterToGallonFieldErrors,
  type PricePerLiterToGallonInput,
  type PricePerVolumeSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface PricePerLiterToGallonDraft {
  source: PricePerVolumeSource;
  pricePerLiter: string;
  pricePerGallon: string;
  gallonSystem: GallonSystem;
  currency: SupportedCurrency;
  detailsOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: PricePerLiterToGallonDraft): PricePerLiterToGallonInput {
  return {
    source: draft.source,
    pricePerLiter: parseOptionalNumber(draft.pricePerLiter),
    pricePerGallon: parseOptionalNumber(draft.pricePerGallon),
    gallonSystem: draft.gallonSystem,
    currency: draft.currency,
  };
}

export function emptyDraft(): PricePerLiterToGallonDraft {
  return {
    source: 'perLiter',
    pricePerLiter: '',
    pricePerGallon: '',
    gallonSystem: 'us',
    currency: 'USD',
    detailsOpen: true,
  };
}

interface PricePerLiterToGallonFormProps {
  draft: PricePerLiterToGallonDraft;
  errors: PricePerLiterToGallonFieldErrors;
  onDraftChange: (draft: PricePerLiterToGallonDraft) => void;
  onGallonSystemChange: (system: GallonSystem) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
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

export function PricePerLiterToGallonForm({
  draft,
  errors,
  onDraftChange,
  onGallonSystemChange,
  onCurrencyChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PricePerLiterToGallonFormProps) {
  const set = (patch: Partial<PricePerLiterToGallonDraft>) =>
    onDraftChange({ ...draft, ...patch });
  const symbol = getCurrencySymbol(draft.currency);
  const factor = LITERS_PER_GALLON[draft.gallonSystem];
  const gallonShort = draft.gallonSystem === 'us' ? 'US gal' : 'imp gal';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert price per liter ↔ price per gallon. US liquid gallon = {LITERS_PER_GALLON.us} L;
 Imperial gallon = {LITERS_PER_GALLON.imperial} L. Currency changes the symbol only; no
        exchange-rate conversion.
      </div>

      <FieldShell
        label="Price per liter"
        htmlFor="ppl-gal-liter"
        tip={`Enter a price per liter. Price per ${gallonShort} = price per liter × ${factor}.`}
        error={errors.pricePerLiter}
      >
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="ppl-gal-liter"
              inputMode="decimal"
              autoComplete="off"
              className={`${inputClass} pl-8`}
              value={draft.pricePerLiter}
              placeholder="Enter price"
              aria-invalid={Boolean(errors.pricePerLiter)}
              onChange={(event) =>
                set({ source: 'perLiter', pricePerLiter: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            /L
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Price per gallon"
        htmlFor="ppl-gal-gallon"
        tip={`Enter a price per gallon. Price per liter = price per ${gallonShort} ÷ ${factor}.`}
        error={errors.pricePerGallon}
      >
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="ppl-gal-gallon"
              inputMode="decimal"
              autoComplete="off"
              className={`${inputClass} pl-8`}
              value={draft.pricePerGallon}
              placeholder="Enter price"
              aria-invalid={Boolean(errors.pricePerGallon)}
              onChange={(event) =>
                set({ source: 'perGallon', pricePerGallon: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            /gal
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Gallon type" htmlFor="ppl-gal-system">
        <select
          id="ppl-gal-system"
          className={selectClass}
          value={draft.gallonSystem}
          onChange={(event) => onGallonSystemChange(event.target.value as GallonSystem)}
        >
          <option value="us">{GALLON_SYSTEM_LABELS.us}</option>
          <option value="imperial">{GALLON_SYSTEM_LABELS.imperial}</option>
        </select>
      </FieldShell>

      <FieldShell label="Currency" htmlFor="ppl-gal-currency">
        <CurrencySelect
          id="ppl-gal-currency"
          value={draft.currency}
          onChange={onCurrencyChange}
          aria-label="Display currency"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.detailsOpen}
          onClick={() => set({ detailsOpen: !draft.detailsOpen })}
        >
          <span>Conversion details</span>
          {draft.detailsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.detailsOpen ? (
          <div className="space-y-2 border-t border-border px-3.5 pb-3.5 pt-3 text-sm text-muted-foreground">
            <p>
              Active system: <span className="font-medium text-accent">{GALLON_SYSTEM_LABELS[draft.gallonSystem]}</span>
            </p>
            <p className="font-mono text-xs text-accent">
              1 {gallonShort} = {factor} L
            </p>
            <p className="font-mono text-xs text-accent">
              Price/{gallonShort} = Price/L × {factor}
            </p>
            <p className="font-mono text-xs text-accent">
              Price/L = Price/{gallonShort} ÷ {factor}
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
          Convert
        </button>
      </div>
    </form>
  );
}
