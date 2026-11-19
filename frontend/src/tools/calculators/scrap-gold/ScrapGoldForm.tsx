'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatMoney,
  formatQty,
  karatToPurityPercent,
  parseOptionalNumber,
  purityPercentToKarat,
  weightUnitLabel,
} from './calculation';
import {
  SCRAP_GOLD_WEIGHT_UNIT_OPTIONS,
  SUGGESTED_KARATS,
  type ScrapGoldFieldErrors,
  type ScrapGoldInput,
  type ScrapGoldResult,
  type ScrapGoldWeightUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 max-w-[9.5rem] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

function formatSynced(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 1e6) / 1e6;
  return String(rounded);
}

interface ScrapGoldFormProps {
  input: ScrapGoldInput;
  errors: ScrapGoldFieldErrors;
  result: ScrapGoldResult | null;
  onChange: (next: ScrapGoldInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function ScrapGoldForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: ScrapGoldFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<ScrapGoldInput>) => {
    onChange({ ...input, ...patch });
  };

  const setKarat = (raw: string) => {
    const karat = parseOptionalNumber(raw);
    if (karat === null) {
      set({ karat: raw, purityDriver: 'karat' });
      return;
    }
    const clamped = Math.min(24, Math.max(0, karat));
    set({
      karat: raw,
      purityPercent: formatSynced(karatToPurityPercent(clamped)),
      purityDriver: 'karat',
    });
  };

  const setPurity = (raw: string) => {
    const purity = parseOptionalNumber(raw);
    if (purity === null) {
      set({ purityPercent: raw, purityDriver: 'percent' });
      return;
    }
    const clamped = Math.min(100, Math.max(0, purity));
    set({
      purityPercent: raw,
      karat: formatSynced(purityPercentToKarat(clamped)),
      purityDriver: 'percent',
    });
  };

  const applySuggestedKarat = (karat: number) => {
    set({
      karat: String(karat),
      purityPercent: formatSynced(karatToPurityPercent(karat)),
      purityDriver: 'karat',
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Estimate scrap value from weight, karat or purity, and a pure-gold market
          price. Price is manual — not a live quote.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="sg-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="sg-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sg-weight">Weight of scrap gold</label>
          <InfoTooltip
            label="Weight of scrap gold"
            text="Total scrap weight before purity. Choose grams, kilograms, troy ounces, pennyweights, or grains."
            align="left"
          />
        </div>
        <div className="flex gap-2">
          <FieldShell error={errors.weight}>
            <input
              id="sg-weight"
              className={inputClass}
              inputMode="decimal"
              placeholder="0"
              value={input.weight}
              aria-invalid={Boolean(errors.weight)}
              onChange={(event) => set({ weight: event.target.value })}
            />
          </FieldShell>
          <select
            className={unitSelectClass}
            aria-label="Scrap weight unit"
            value={input.weightUnit}
            onChange={(event) =>
              set({ weightUnit: event.target.value as ScrapGoldWeightUnit })
            }
          >
            {SCRAP_GOLD_WEIGHT_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {errors.weight ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sg-karat">Gold purity by karat</label>
          <InfoTooltip
            label="Gold purity by karat"
            text="0–24K. Changing karat updates purity % using karat ÷ 24 × 100."
            align="left"
          />
        </div>
        <FieldShell error={errors.karat}>
          <input
            id="sg-karat"
            className={inputClass}
            inputMode="decimal"
            value={input.karat}
            aria-invalid={Boolean(errors.karat)}
            onChange={(event) => setKarat(event.target.value)}
          />
          <span className="pr-3 text-sm text-muted-foreground">K</span>
        </FieldShell>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUGGESTED_KARATS.map((k) => (
            <button
              key={k}
              type="button"
              className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                input.karat === String(k)
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => applySuggestedKarat(k)}
            >
              {k}K
            </button>
          ))}
        </div>
        {errors.karat ? (
          <p className="mt-1 text-xs text-rose-600">{errors.karat}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sg-purity">Gold purity by percent</label>
          <InfoTooltip
            label="Gold purity by percent"
            text="Synced with karat. Edit % to update the effective karat (purity ÷ 100 × 24)."
            align="left"
          />
        </div>
        <FieldShell error={errors.purityPercent}>
          <input
            id="sg-purity"
            className={inputClass}
            inputMode="decimal"
            value={input.purityPercent}
            aria-invalid={Boolean(errors.purityPercent)}
            onChange={(event) => setPurity(event.target.value)}
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.purityPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.purityPercent}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sg-pure-weight">Pure gold weight</label>
          <InfoTooltip
            label="Pure gold weight"
            text="Scrap weight × purity. Display unit is independent of the scrap weight unit."
            align="left"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-dashed border-border bg-muted/20 px-3 text-sm font-semibold tabular-nums text-accent">
            <span id="sg-pure-weight" aria-live="polite">
              {result ? formatQty(result.pureGoldWeight) : '—'}
            </span>
          </div>
          <select
            className={unitSelectClass}
            aria-label="Pure gold weight unit"
            value={input.pureGoldUnit}
            onChange={(event) =>
              set({ pureGoldUnit: event.target.value as ScrapGoldWeightUnit })
            }
          >
            {SCRAP_GOLD_WEIGHT_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.short}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sg-price">Price per unit weight</label>
          <InfoTooltip
            label="Price per unit weight"
            text="Pure-gold market price for the selected weight unit. Converted to a per-gram rate internally."
            align="left"
          />
        </div>
        <div className="flex gap-2">
          <FieldShell error={errors.pricePerUnit}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="sg-price"
              className={inputClass}
              inputMode="decimal"
              placeholder="0"
              value={input.pricePerUnit}
              aria-invalid={Boolean(errors.pricePerUnit)}
              onChange={(event) => set({ pricePerUnit: event.target.value })}
            />
          </FieldShell>
          <select
            className={unitSelectClass}
            aria-label="Price weight unit"
            value={input.priceUnit}
            onChange={(event) =>
              set({ priceUnit: event.target.value as ScrapGoldWeightUnit })
            }
          >
            {SCRAP_GOLD_WEIGHT_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                / {opt.short}
              </option>
            ))}
          </select>
        </div>
        {errors.pricePerUnit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pricePerUnit}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>Total value</span>
        </div>
        <div className="flex h-11 items-center rounded-lg border border-dashed border-border bg-muted/20 px-3 text-lg font-semibold tabular-nums text-accent">
          <span aria-live="polite">
            {result ? formatMoney(result.totalValue, result.currency) : '—'}
          </span>
        </div>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="sg-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="sg-results-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90 sm:text-sm">
            {result.summaryText}
          </div>
          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Original scrap weight</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatQty(result.weight)} {weightUnitLabel(result.weightUnit)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Gold purity</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatQty(result.karat)}K · {formatQty(result.purityPercent)}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Pure gold weight</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatQty(result.pureGoldWeight)}{' '}
                {weightUnitLabel(result.pureGoldUnit)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Price per unit</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.pricePerUnit, result.currency)} /{' '}
                {weightUnitLabel(result.priceUnit)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Estimated total value</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.totalValue, result.currency)}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter scrap weight and a pure-gold market price to estimate value.
        </p>
      )}
    </form>
  );
}
