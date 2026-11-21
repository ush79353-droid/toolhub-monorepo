'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney, formatQty, weightUnitLabel } from './calculation';
import {
  SCRAP_SILVER_WEIGHT_UNIT_OPTIONS,
  SILVER_PURITY_PRESETS,
  purityPercentForPreset,
  type ScrapSilverFieldErrors,
  type ScrapSilverInput,
  type ScrapSilverResult,
  type ScrapSilverWeightUnit,
  type SilverPurityPreset,
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

interface ScrapSilverFormProps {
  input: ScrapSilverInput;
  errors: ScrapSilverFieldErrors;
  result: ScrapSilverResult | null;
  onChange: (next: ScrapSilverInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function ScrapSilverForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: ScrapSilverFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const isCustom = input.purityPreset === 'custom';

  const set = (patch: Partial<ScrapSilverInput>) => {
    onChange({ ...input, ...patch });
  };

  const setPreset = (preset: SilverPurityPreset) => {
    const pct = purityPercentForPreset(preset);
    set({
      purityPreset: preset,
      purityPercent: pct !== null ? formatSynced(pct) : input.purityPercent,
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
          Estimate scrap silver melt value from weight, purity, and a pure-silver
 market price. Price is manual; not a live quote.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="ss-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="ss-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="ss-weight">Weight of scrap silver</label>
          <InfoTooltip
            label="Weight of scrap silver"
            text="Total scrap weight before purity. Choose grams, kilograms, troy ounces, pennyweights, or grains."
            align="left"
          />
        </div>
        <div className="flex gap-2">
          <FieldShell error={errors.weight}>
            <input
              id="ss-weight"
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
              set({ weightUnit: event.target.value as ScrapSilverWeightUnit })
            }
          >
            {SCRAP_SILVER_WEIGHT_UNIT_OPTIONS.map((opt) => (
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
          <label htmlFor="ss-purity-preset">Silver purity</label>
          <InfoTooltip
            label="Silver purity"
            text="Choose a fineness preset (.999, .925, …) or Custom to enter a percentage."
            align="left"
          />
        </div>
        <select
          id="ss-purity-preset"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
          value={input.purityPreset}
          onChange={(event) =>
            setPreset(event.target.value as SilverPurityPreset)
          }
        >
          {SILVER_PURITY_PRESETS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.fineness !== null
                ? ` · ${formatSynced(opt.fineness * 100)}%`
                : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="ss-purity">Purity percentage</label>
        </div>
        <FieldShell error={errors.purityPercent}>
          <input
            id="ss-purity"
            className={inputClass}
            inputMode="decimal"
            value={input.purityPercent}
            disabled={!isCustom}
            aria-invalid={Boolean(errors.purityPercent)}
            onChange={(event) =>
              set({
                purityPreset: 'custom',
                purityPercent: event.target.value,
              })
            }
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {!isCustom ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Select Custom Purity to edit this field.
          </p>
        ) : null}
        {errors.purityPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.purityPercent}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="ss-price">Price per weight unit</label>
          <InfoTooltip
            label="Price per weight unit"
            text="Pure-silver market price for the selected weight unit. Converted to a per-gram rate internally."
            align="left"
          />
        </div>
        <div className="flex gap-2">
          <FieldShell error={errors.pricePerUnit}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="ss-price"
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
              set({ priceUnit: event.target.value as ScrapSilverWeightUnit })
            }
          >
            {SCRAP_SILVER_WEIGHT_UNIT_OPTIONS.map((opt) => (
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
          <label htmlFor="ss-pure-weight">Pure silver weight</label>
        </div>
        <div className="flex gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-dashed border-border bg-muted/20 px-3 text-sm font-semibold tabular-nums text-accent">
            <span id="ss-pure-weight" aria-live="polite">
              {result ? formatQty(result.pureSilverWeight) : '—'}
            </span>
          </div>
          <select
            className={unitSelectClass}
            aria-label="Pure silver weight unit"
            value={input.pureSilverUnit}
            onChange={(event) =>
              set({ pureSilverUnit: event.target.value as ScrapSilverWeightUnit })
            }
          >
            {SCRAP_SILVER_WEIGHT_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.short}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <span>Silver value</span>
        </div>
        <div className="flex h-11 items-center rounded-lg border border-dashed border-border bg-muted/20 px-3 text-lg font-semibold tabular-nums text-accent">
          <span aria-live="polite">
            {result ? formatMoney(result.silverValue, result.currency) : '—'}
          </span>
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.sellOpen}
        onToggle={(event) => set({ sellOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.sellOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Silver scrap buy and sell value</span>
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Optional adjustments to estimate what a buyer might pay after
            discount and fees. Melt value above stays unchanged.
          </p>
          <div>
            <label className={labelClass} htmlFor="ss-discount">
              Dealer discount percentage
            </label>
            <FieldShell error={errors.dealerDiscountPercent}>
              <input
                id="ss-discount"
                className={inputClass}
                inputMode="decimal"
                value={input.dealerDiscountPercent}
                aria-invalid={Boolean(errors.dealerDiscountPercent)}
                onChange={(event) =>
                  set({ dealerDiscountPercent: event.target.value })
                }
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.dealerDiscountPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.dealerDiscountPercent}
              </p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="ss-refining">
              Refining or processing fee
            </label>
            <FieldShell error={errors.refiningFee}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ss-refining"
                className={inputClass}
                inputMode="decimal"
                value={input.refiningFee}
                aria-invalid={Boolean(errors.refiningFee)}
                onChange={(event) => set({ refiningFee: event.target.value })}
              />
            </FieldShell>
            {errors.refiningFee ? (
              <p className="mt-1 text-xs text-rose-600">{errors.refiningFee}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="ss-txn">
              Additional transaction fee
            </label>
            <FieldShell error={errors.transactionFee}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ss-txn"
                className={inputClass}
                inputMode="decimal"
                value={input.transactionFee}
                aria-invalid={Boolean(errors.transactionFee)}
                onChange={(event) => set({ transactionFee: event.target.value })}
              />
            </FieldShell>
            {errors.transactionFee ? (
              <p className="mt-1 text-xs text-rose-600">{errors.transactionFee}</p>
            ) : null}
          </div>
          {result ? (
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Estimated melt value</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.silverValue, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Dealer discount</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.dealerDiscountAmount, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Refining fee</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.refiningFee, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Transaction fee</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.transactionFee, result.currency)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">
                  Estimated selling value
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-accent">
                  {formatMoney(result.estimatedSellingValue, result.currency)}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>
      </details>

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
          aria-labelledby="ss-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="ss-results-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90 sm:text-sm">
            {result.summaryText}
          </div>
          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Scrap weight</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatQty(result.weight)} {weightUnitLabel(result.weightUnit)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Silver purity</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatQty(result.purityPercent)}% · fineness{' '}
                {formatQty(result.purityFraction, 4)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Pure silver weight</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatQty(result.pureSilverWeight)}{' '}
                {weightUnitLabel(result.pureSilverUnit)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Price per unit</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.pricePerUnit, result.currency)} /{' '}
                {weightUnitLabel(result.priceUnit)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Silver melt value</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.silverValue, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Estimated selling value
              </dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.estimatedSellingValue, result.currency)}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter scrap weight and a pure-silver market price to estimate value.
        </p>
      )}
    </form>
  );
}
