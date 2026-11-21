'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  KG_PER_OUNCE,
  KG_PER_TROY_OUNCE,
  MORE_MASS_UNITS,
  MORE_UNIT_LABELS,
  MORE_UNIT_SYMBOLS,
  OZ_PER_KG,
  type KgOzSource,
  type KgToOunceFieldErrors,
  type KgToOunceInput,
  type MoreMassUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface KgToOunceDraft {
  source: KgOzSource;
  kg: string;
  oz: string;
  troyOz: string;
  lbPart: string;
  ozPart: string;
  moreUnit: MoreMassUnit;
  moreValue: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

export function draftToInput(draft: KgToOunceDraft): KgToOunceInput {
  return {
    source: draft.source,
    kg: parseOptionalNumber(draft.kg),
    oz: parseOptionalNumber(draft.oz),
    troyOz: parseOptionalNumber(draft.troyOz),
    lbPart: parseOptionalNumber(draft.lbPart),
    ozPart: parseOptionalNumber(draft.ozPart),
    moreUnit: draft.moreUnit,
    moreValue: parseOptionalNumber(draft.moreValue),
  };
}

export function emptyDraft(): KgToOunceDraft {
  return {
    source: 'kg',
    kg: '',
    oz: '',
    troyOz: '',
    lbPart: '',
    ozPart: '',
    moreUnit: 'lb',
    moreValue: '',
    otherOpen: false,
  };
}

interface KgToOunceFormProps {
  draft: KgToOunceDraft;
  errors: KgToOunceFieldErrors;
  onDraftChange: (draft: KgToOunceDraft) => void;
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

export function KgToOunceForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KgToOunceFormProps) {
  const set = (patch: Partial<KgToOunceDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 avoirdupois ounce = {KG_PER_OUNCE} kg. Edit kilograms or ounces: the other
        updates instantly. Mass ounces only (not fluid ounces).
      </div>

      <FieldShell
        label="Kilograms"
        htmlFor="kg-oz-kg"
        tip={`Enter a nonnegative mass in kilograms. 1 kg ≈ ${OZ_PER_KG} oz.`}
        error={errors.kg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-oz-kg"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kg}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.kg)}
              onChange={(event) => set({ source: 'kg', kg: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            kg
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Ounces"
        htmlFor="kg-oz-oz"
        tip="Avoirdupois mass ounces; not fluid ounces (fl oz) and not troy ounces."
        error={errors.oz}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-oz-oz"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.oz}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.oz)}
              onChange={(event) => set({ source: 'oz', oz: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            oz
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => set({ otherOpen: !draft.otherOpen })}
          aria-expanded={draft.otherOpen}
        >
          <span>Other units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <FieldShell
              label="Troy ounces"
              htmlFor="kg-oz-troy"
              tip={`Exact: 1 troy ounce = ${KG_PER_TROY_OUNCE} kg (31.1034768 g).`}
              error={errors.troyOz}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="kg-oz-troy"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.troyOz}
                    placeholder="Enter mass"
                    aria-invalid={Boolean(errors.troyOz)}
                    onChange={(event) =>
                      set({ source: 'troyOz', troyOz: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  oz t
                </span>
              </div>
            </FieldShell>

            <div className="space-y-1.5">
              <p className={labelClass}>
                Pounds and ounces{' '}
                <InfoTooltip
                  label="Pounds and ounces"
                  text="1 lb = 16 avoirdupois oz. Whole pounds plus remainder ounces for the same mass."
                />
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="min-w-0 flex-1 basis-[7rem]">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="kg-oz-lb-part"
                        inputMode="decimal"
                        autoComplete="off"
                        className={inputClass}
                        value={draft.lbPart}
                        placeholder="lb"
                        aria-label="Pounds"
                        aria-invalid={Boolean(errors.lbPart)}
                        onChange={(event) =>
                          set({ source: 'lbOz', lbPart: event.target.value })
                        }
                      />
                    </div>
                    <span className={unitBadgeClass} aria-hidden="true">
                      lb
                    </span>
                  </div>
                  {errors.lbPart ? (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.lbPart}
                    </p>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 basis-[7rem]">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="kg-oz-oz-part"
                        inputMode="decimal"
                        autoComplete="off"
                        className={inputClass}
                        value={draft.ozPart}
                        placeholder="oz"
                        aria-label="Ounce remainder"
                        aria-invalid={Boolean(errors.ozPart)}
                        onChange={(event) =>
                          set({ source: 'lbOz', ozPart: event.target.value })
                        }
                      />
                    </div>
                    <span className={unitBadgeClass} aria-hidden="true">
                      oz
                    </span>
                  </div>
                  {errors.ozPart ? (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.ozPart}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <FieldShell
              label={`More units · ${MORE_UNIT_LABELS[draft.moreUnit]}`}
              htmlFor="kg-oz-more"
              tip="Same underlying mass in another unit. Metric ton (t) is the SI tonne."
              error={errors.moreValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="kg-oz-more"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.moreValue}
                    placeholder="Enter value"
                    aria-invalid={Boolean(errors.moreValue)}
                    onChange={(event) =>
                      set({ source: 'more', moreValue: event.target.value })
                    }
                  />
                </div>
                <select
                  className={selectClass}
                  value={draft.moreUnit}
                  aria-label="More units"
                  onChange={(event) => {
                    const moreUnit = event.target.value as MoreMassUnit;
                    // Keep current source so the underlying mass stays fixed.
                    set({ moreUnit });
                  }}
                >
                  {MORE_MASS_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {MORE_UNIT_SYMBOLS[unit]}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        oz = kg × {OZ_PER_KG} · kg = oz × {KG_PER_OUNCE}
      </p>

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
