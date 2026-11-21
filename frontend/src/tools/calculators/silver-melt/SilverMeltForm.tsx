'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney, formatQty, weightUnitLabel } from './calculation';
import {
  OTHER_METAL_OPTIONS,
  SILVER_MELT_PURITY_PRESETS,
  SILVER_MELT_WEIGHT_UNIT_OPTIONS,
  purityPercentForPreset,
  type OtherMetalType,
  type SilverMeltFieldErrors,
  type SilverMeltInput,
  type SilverMeltPurityPreset,
  type SilverMeltResult,
  type SilverMeltWeightUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 max-w-[9.5rem] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function formatSynced(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 1e6) / 1e6);
}

interface SilverMeltFormProps {
  input: SilverMeltInput;
  errors: SilverMeltFieldErrors;
  result: SilverMeltResult | null;
  onChange: (next: SilverMeltInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function SilverMeltForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: SilverMeltFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const isCustom = input.purityPreset === 'custom';

  const set = (patch: Partial<SilverMeltInput>) => {
    onChange({ ...input, ...patch });
  };

  const setPreset = (preset: SilverMeltPurityPreset) => {
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
          Estimate silver melt value from weight, purity, and a pure-silver market
          price. Optional alloy section values a second metal separately.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="sm-currency">
          Display currency
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="sm-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sm-weight">Weight</label>
          <InfoTooltip
            label="Weight"
            text="Total item weight. Use troy ounces (oz t) for precious-metal quoting; standard oz is avoirdupois."
            align="left"
          />
        </div>
        <div className="flex gap-2">
          <FieldShell error={errors.weight}>
            <input
              id="sm-weight"
              className={inputClass}
              inputMode="decimal"
              placeholder="0"
              value={input.weight}
              aria-invalid={Boolean(errors.weight)}
              onChange={(e) => set({ weight: e.target.value })}
            />
          </FieldShell>
          <select
            className={unitSelectClass}
            aria-label="Weight unit"
            value={input.weightUnit}
            onChange={(e) =>
              set({ weightUnit: e.target.value as SilverMeltWeightUnit })
            }
          >
            {SILVER_MELT_WEIGHT_UNIT_OPTIONS.map((opt) => (
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
          <label htmlFor="sm-purity-preset">Select silver purity</label>
        </div>
        <select
          id="sm-purity-preset"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
          value={input.purityPreset}
          onChange={(e) => setPreset(e.target.value as SilverMeltPurityPreset)}
        >
          {SILVER_MELT_PURITY_PRESETS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sm-purity">Purity percentage</label>
        </div>
        <FieldShell error={errors.purityPercent}>
          <input
            id="sm-purity"
            className={inputClass}
            inputMode="decimal"
            value={input.purityPercent}
            disabled={!isCustom}
            aria-invalid={Boolean(errors.purityPercent)}
            onChange={(e) =>
              set({ purityPreset: 'custom', purityPercent: e.target.value })
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
          <label htmlFor="sm-pure">Mass of pure silver</label>
        </div>
        <div className="flex gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-dashed border-border bg-muted/20 px-3 text-sm font-semibold tabular-nums text-accent">
            <span id="sm-pure" aria-live="polite">
              {result ? formatQty(result.pureSilverWeight) : '—'}
            </span>
          </div>
          <select
            className={unitSelectClass}
            aria-label="Pure silver unit"
            value={input.pureSilverUnit}
            onChange={(e) =>
              set({ pureSilverUnit: e.target.value as SilverMeltWeightUnit })
            }
          >
            {SILVER_MELT_WEIGHT_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.short}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="sm-price">Price per unit mass</label>
          <InfoTooltip
            label="Price per unit mass"
            text="Pure-silver spot price for the selected unit; not the price of the finished mixed-metal item."
            align="left"
          />
        </div>
        <div className="flex gap-2">
          <FieldShell error={errors.pricePerUnit}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="sm-price"
              className={inputClass}
              inputMode="decimal"
              placeholder="0"
              value={input.pricePerUnit}
              aria-invalid={Boolean(errors.pricePerUnit)}
              onChange={(e) => set({ pricePerUnit: e.target.value })}
            />
          </FieldShell>
          <select
            className={unitSelectClass}
            aria-label="Price unit"
            value={input.priceUnit}
            onChange={(e) =>
              set({ priceUnit: e.target.value as SilverMeltWeightUnit })
            }
          >
            {SILVER_MELT_WEIGHT_UNIT_OPTIONS.map((opt) => (
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
          <span>Value of silver item</span>
        </div>
        <div className="flex h-11 items-center rounded-lg border border-dashed border-border bg-muted/20 px-3 text-lg font-semibold tabular-nums text-accent">
          <span aria-live="polite">
            {result ? formatMoney(result.silverMeltValue, result.currency) : '—'}
          </span>
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.alloyOpen}
        onToggle={(e) => set({ alloyOpen: e.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.alloyOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Alloy value (silver + another metal)</span>
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Value the non-silver portion separately. Combined totals are estimated
            raw metal value, not guaranteed resale price.
          </p>

          <div>
            <label className={labelClass} htmlFor="sm-other-type">
              Other metal type
            </label>
            <select
              id="sm-other-type"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.otherMetalType}
              onChange={(e) =>
                set({ otherMetalType: e.target.value as OtherMetalType })
              }
            >
              {OTHER_METAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {input.otherMetalType === 'custom' ? (
            <div>
              <label className={labelClass} htmlFor="sm-other-label">
                Custom metal name
              </label>
              <FieldShell>
                <input
                  id="sm-other-label"
                  className={inputClass}
                  value={input.otherMetalLabel}
                  onChange={(e) => set({ otherMetalLabel: e.target.value })}
                />
              </FieldShell>
            </div>
          ) : null}

          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-primary"
              checked={input.deriveOtherFromRemainder}
              onChange={(e) =>
                set({ deriveOtherFromRemainder: e.target.checked })
              }
            />
            <span>
              Derive other-metal weight from remainder (total − pure silver)
            </span>
          </label>

          {!input.deriveOtherFromRemainder ? (
            <div>
              <label className={labelClass} htmlFor="sm-other-weight">
                Other metal weight
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.otherMetalWeight}>
                  <input
                    id="sm-other-weight"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.otherMetalWeight}
                    aria-invalid={Boolean(errors.otherMetalWeight)}
                    onChange={(e) => set({ otherMetalWeight: e.target.value })}
                  />
                </FieldShell>
                <select
                  className={unitSelectClass}
                  aria-label="Other metal weight unit"
                  value={input.otherMetalWeightUnit}
                  onChange={(e) =>
                    set({
                      otherMetalWeightUnit: e.target
                        .value as SilverMeltWeightUnit,
                    })
                  }
                >
                  {SILVER_MELT_WEIGHT_UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.short}
                    </option>
                  ))}
                </select>
              </div>
              {errors.otherMetalWeight ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.otherMetalWeight}
                </p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label className={labelClass} htmlFor="sm-other-price">
              Other metal price
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.otherMetalPrice}>
                <span className="pl-3 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="sm-other-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.otherMetalPrice}
                  aria-invalid={Boolean(errors.otherMetalPrice)}
                  onChange={(e) => set({ otherMetalPrice: e.target.value })}
                />
              </FieldShell>
              <select
                className={unitSelectClass}
                aria-label="Other metal price unit"
                value={input.otherMetalPriceUnit}
                onChange={(e) =>
                  set({
                    otherMetalPriceUnit: e.target.value as SilverMeltWeightUnit,
                  })
                }
              >
                {SILVER_MELT_WEIGHT_UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    / {opt.short}
                  </option>
                ))}
              </select>
            </div>
            {errors.otherMetalPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.otherMetalPrice}</p>
            ) : null}
          </div>

          {result?.alloyOpen && result.otherMetalValue !== null ? (
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Silver melt value</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.silverMeltValue, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {result.otherMetalLabel} weight
                </dt>
                <dd className="font-medium tabular-nums text-accent">
                  {result.otherMetalWeight !== null
                    ? `${formatQty(result.otherMetalWeight)} ${weightUnitLabel(result.otherMetalWeightUnit)}`
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {result.otherMetalLabel} value
                </dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.otherMetalValue, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  Combined estimated metal value
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-accent">
                  {result.combinedAlloyValue !== null
                    ? formatMoney(result.combinedAlloyValue, result.currency)
                    : '—'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-xs text-muted-foreground">
              Enter an other-metal price to see alloy totals
              {input.deriveOtherFromRemainder
                ? ' (remainder weight is derived automatically).'
                : '.'}
            </p>
          )}
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
          aria-labelledby="sm-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="sm-results-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90 sm:text-sm">
            {result.summaryText}
          </div>
          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Item weight</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatQty(result.weight)} {weightUnitLabel(result.weightUnit)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Silver purity</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatQty(result.purityPercent)}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Mass of pure silver</dt>
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
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">
                Value of silver item (melt)
              </dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.silverMeltValue, result.currency)}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter weight and a pure-silver market price to estimate melt value.
        </p>
      )}
    </form>
  );
}
