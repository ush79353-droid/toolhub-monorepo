'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ORIGIN_COUNTRIES,
  PRODUCT_CATEGORIES,
  PRODUCT_PRESETS,
  presetsForCategory,
  type ProductCategory,
  type ProductPresetId,
  type TariffMode,
  type TrumpTariffFieldErrors,
  type TrumpTariffInput,
  type TrumpTariffResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface TrumpTariffFormProps {
  input: TrumpTariffInput;
  errors: TrumpTariffFieldErrors;
  result: TrumpTariffResult | null;
  onChange: (input: TrumpTariffInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function TrumpTariffForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: TrumpTariffFormProps) {
  const [showLanded, setShowLanded] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPassThrough, setShowPassThrough] = useState(false);
  const symbol = getCurrencySymbol(input.currency);

  const presets = useMemo(
    () => presetsForCategory(input.category),
    [input.category]
  );

  const set = (patch: Partial<TrumpTariffInput>) =>
    onChange({ ...input, ...patch });

  const handleMode = (mode: TariffMode) => {
    set({ mode });
  };

  const handleCategory = (category: ProductCategory) => {
    const nextPresets = presetsForCategory(category);
    const stillValid = nextPresets.some((p) => p.id === input.productPreset);
    const nextPreset = stillValid
      ? input.productPreset
      : (nextPresets[0]?.id ?? 'custom');
    const preset =
      PRODUCT_PRESETS.find((p) => p.id === nextPreset) ??
      PRODUCT_PRESETS[PRODUCT_PRESETS.length - 1]!;
    set({
      category,
      productPreset: nextPreset,
      baseTariffRate: String(preset.suggestedBaseRate),
      additionalTariffRate: String(preset.suggestedAdditionalRate),
    });
  };

  const handlePreset = (productPreset: ProductPresetId) => {
    const preset =
      PRODUCT_PRESETS.find((p) => p.id === productPreset) ??
      PRODUCT_PRESETS[PRODUCT_PRESETS.length - 1]!;
    set({
      productPreset,
      category:
        input.category === 'popular' ? input.category : preset.category,
      baseTariffRate: String(preset.suggestedBaseRate),
      additionalTariffRate: String(preset.suggestedAdditionalRate),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational estimate only — not an official CBP, USITC, or USTR
        determination. Rates you enter are a user-defined scenario unless you
        verify them against HTSUS and current trade measures. Currency is
        denomination (not live FX).
      </p>

      <div
        role="radiogroup"
        aria-label="Calculation mode"
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {(
          [
            ['product', 'Calculate by product'],
            ['country', 'Calculate by country'],
          ] as const
        ).map(([id, label]) => (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
              input.mode === id
                ? 'border-primary bg-primary/5 font-medium text-accent'
                : 'border-border bg-white text-muted-foreground'
            }`}
          >
            <input
              type="radio"
              name="tt-mode"
              className="accent-primary"
              checked={input.mode === id}
              onChange={() => handleMode(id)}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="tt-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($800 × 10 · 5% + 20% · landed $10,300)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Product & origin</h3>

        <div>
          <label htmlFor="tt-category" className={labelClass}>
            Product category
          </label>
          <select
            id="tt-category"
            className={selectClass}
            value={input.category}
            onChange={(e) =>
              handleCategory(e.target.value as ProductCategory)
            }
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tt-product" className={labelClass}>
            Choose product
            <InfoTooltip text="Presets are illustrative hypothetical scenarios, not official HTSUS classifications or verified duty rates." />
          </label>
          <select
            id="tt-product"
            className={selectClass}
            value={input.productPreset}
            onChange={(e) =>
              handlePreset(e.target.value as ProductPresetId)
            }
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {
              (
                PRODUCT_PRESETS.find((p) => p.id === input.productPreset) ??
                PRODUCT_PRESETS[PRODUCT_PRESETS.length - 1]!
              ).note
            }
          </p>
        </div>

        <div>
          <label htmlFor="tt-country" className={labelClass}>
            Country of origin
            <InfoTooltip text="Country of origin is where the goods were manufactured or substantially transformed — not necessarily the seller’s location, brand HQ, or shipping country." />
          </label>
          <select
            id="tt-country"
            className={selectClass}
            value={input.countryCode}
            onChange={(e) => set({ countryCode: e.target.value })}
          >
            {ORIGIN_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.countryCode ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.countryCode}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Value & quantity</h3>
        <div>
          <label htmlFor="tt-value" className={labelClass}>
            Customs value of product
            <InfoTooltip text="Use the applicable customs value (often transaction value), which may differ from retail price or invoice total." />
          </label>
          <FieldShell error={errors.unitCustomsValue}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="tt-value"
              className={inputClass}
              inputMode="decimal"
              value={input.unitCustomsValue}
              onChange={(e) => set({ unitCustomsValue: e.target.value })}
              placeholder="800"
            />
          </FieldShell>
          {errors.unitCustomsValue ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.unitCustomsValue}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tt-qty" className={labelClass}>
            Quantity
          </label>
          <FieldShell error={errors.quantity}>
            <input
              id="tt-qty"
              className={inputClass}
              inputMode="numeric"
              value={input.quantity}
              onChange={(e) => set({ quantity: e.target.value })}
              placeholder="1"
            />
          </FieldShell>
          {errors.quantity ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.quantity}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Tariff rates</h3>
        <p className="text-[11px] text-muted-foreground">
          Custom / user-defined scenario. Do not treat suggested preset rates as
          currently effective official duties.
        </p>
        <div>
          <label htmlFor="tt-base" className={labelClass}>
            Base import duty rate
          </label>
          <FieldShell error={errors.baseTariffRate}>
            <input
              id="tt-base"
              className={inputClass}
              inputMode="decimal"
              value={input.baseTariffRate}
              onChange={(e) => set({ baseTariffRate: e.target.value })}
              placeholder="5"
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.baseTariffRate ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.baseTariffRate}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tt-add" className={labelClass}>
            Additional applicable tariff rate
            <InfoTooltip text="Additional measures (e.g. Section 301 or 232) may apply depending on classification, origin, and date. They do not always stack automatically." />
          </label>
          <FieldShell error={errors.additionalTariffRate}>
            <input
              id="tt-add"
              className={inputClass}
              inputMode="decimal"
              value={input.additionalTariffRate}
              onChange={(e) => set({ additionalTariffRate: e.target.value })}
              placeholder="20"
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.additionalTariffRate ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.additionalTariffRate}
            </p>
          ) : null}
        </div>
        <label className="flex items-start gap-2 text-xs text-accent">
          <input
            type="checkbox"
            className="mt-0.5 accent-primary"
            checked={input.assumeAdditiveStacking}
            onChange={(e) =>
              set({ assumeAdditiveStacking: e.target.checked })
            }
          />
          <span>
            Assume additive ad valorem stacking on the same customs value
            (simplified educational mode). Uncheck if measures may not combine.
          </span>
        </label>
        <div>
          <label htmlFor="tt-combined" className={labelClass}>
            Estimated total tariff rate
          </label>
          <FieldShell muted>
            <input
              id="tt-combined"
              className={inputClass}
              readOnly
              aria-readonly
              value={result?.formattedCombinedRate ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-medium text-accent"
          aria-expanded={showLanded}
          onClick={() => setShowLanded((v) => !v)}
        >
          Shipping, insurance & other fees
          <span className="text-muted-foreground">
            {showLanded ? 'Hide' : 'Show'}
          </span>
        </button>
        {showLanded ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            {(
              [
                ['shippingCost', 'Shipping / freight', errors.shippingCost],
                ['insuranceCost', 'Insurance', errors.insuranceCost],
                ['otherFees', 'Other fees', errors.otherFees],
              ] as const
            ).map(([key, label, err]) => (
              <div key={key}>
                <label htmlFor={`tt-${key}`} className={labelClass}>
                  {label}
                </label>
                <FieldShell error={err}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id={`tt-${key}`}
                    className={inputClass}
                    inputMode="decimal"
                    value={input[key]}
                    onChange={(e) => set({ [key]: e.target.value })}
                    placeholder="0"
                  />
                </FieldShell>
                {err ? (
                  <p className="mt-1 text-xs text-rose-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-medium text-accent"
          aria-expanded={showAdvanced}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          Advanced (HTSUS)
          <span className="text-muted-foreground">
            {showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>
        {showAdvanced ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <div>
              <label htmlFor="tt-hts" className={labelClass}>
                Harmonized Tariff Schedule code
                <InfoTooltip text="Format validation only. A matching pattern does not confirm the correct legal classification or duty." />
              </label>
              <FieldShell error={errors.htsusCode}>
                <input
                  id="tt-hts"
                  className={inputClass}
                  value={input.htsusCode}
                  onChange={(e) => set({ htsusCode: e.target.value })}
                  placeholder="e.g. 8471.30.01"
                />
              </FieldShell>
              {errors.htsusCode ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.htsusCode}
                </p>
              ) : null}
              <p className="mt-1 text-[11px] text-muted-foreground">
                No live HTSUS lookup in this tool — enter verified rates
                manually from USITC/CBP/USTR sources.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-medium text-accent"
          aria-expanded={showPassThrough}
          onClick={() => setShowPassThrough((v) => !v)}
        >
          Optional tariff pass-through
          <span className="text-muted-foreground">
            {showPassThrough ? 'Hide' : 'Show'}
          </span>
        </button>
        {showPassThrough ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-[11px] text-muted-foreground">
              Scenario assumption — not a guaranteed retail outcome.
            </p>
            <div>
              <label htmlFor="tt-retail" className={labelClass}>
                Original retail price
              </label>
              <FieldShell error={errors.retailPrice}>
                <span
                  className="pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
                <input
                  id="tt-retail"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.retailPrice}
                  onChange={(e) => set({ retailPrice: e.target.value })}
                  placeholder="1000"
                />
              </FieldShell>
              {errors.retailPrice ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.retailPrice}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tt-pass" className={labelClass}>
                Pass-through percentage
              </label>
              <FieldShell error={errors.passThroughPercent}>
                <input
                  id="tt-pass"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.passThroughPercent}
                  onChange={(e) =>
                    set({ passThroughPercent: e.target.value })
                  }
                  placeholder="60"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              {errors.passThroughPercent ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.passThroughPercent}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
