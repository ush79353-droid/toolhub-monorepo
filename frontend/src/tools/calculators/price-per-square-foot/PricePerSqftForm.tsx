'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  areaUnitLabel,
  convertArea,
  convertPricePerArea,
  convertRentalPeriodDisplay,
} from './calculation';
import type {
  AreaUnit,
  CalculationMode,
  PricePerSqftFieldErrors,
  PricePerSqftInput,
  PricePerSqftResult,
  PricingContext,
  RentalPeriod,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function formatNumericDisplay(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e8) / 1e8;
  return String(rounded);
}

interface PricePerSqftFormProps {
  input: PricePerSqftInput;
  errors: PricePerSqftFieldErrors;
  result: PricePerSqftResult | null;
  onChange: (input: PricePerSqftInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PricePerSqftForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: PricePerSqftFormProps) {
  const [secondOpen, setSecondOpen] = useState(false);
  const symbol = getCurrencySymbol(input.currency);
  const areaLabel = areaUnitLabel(input.areaUnit);
  const secondAreaLabel = areaUnitLabel(input.secondAreaUnit);

  const priceReadOnly = input.calculationMode === 'totalPrice';
  const areaReadOnly = input.calculationMode === 'area';
  const ppaReadOnly = input.calculationMode === 'pricePerArea';

  const set = (patch: Partial<PricePerSqftInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMode = (mode: CalculationMode) => {
    if (mode === input.calculationMode) return;
    set({ calculationMode: mode });
  };

  const setContext = (pricingContext: PricingContext) => {
    if (pricingContext === input.pricingContext) return;
    set({ pricingContext });
  };

  const setRentalPeriod = (next: RentalPeriod) => {
    if (next === input.rentalPeriod) return;
    const priceRaw = input.price.trim().replace(/,/g, '');
    const priceNum = priceRaw === '' ? Number.NaN : Number(priceRaw);
    const secondRaw = input.secondPrice.trim().replace(/,/g, '');
    const secondNum = secondRaw === '' ? Number.NaN : Number(secondRaw);
    set({
      rentalPeriod: next,
      price: Number.isFinite(priceNum)
        ? formatNumericDisplay(
            convertRentalPeriodDisplay(priceNum, input.rentalPeriod, next)
          )
        : input.price,
      secondPrice: Number.isFinite(secondNum)
        ? formatNumericDisplay(
            convertRentalPeriodDisplay(secondNum, input.rentalPeriod, next)
          )
        : input.secondPrice,
    });
  };

  const setAreaUnit = (next: AreaUnit) => {
    if (next === input.areaUnit) return;
    const areaRaw = input.area.trim().replace(/,/g, '');
    const ppaRaw = input.pricePerArea.trim().replace(/,/g, '');
    const areaNum = areaRaw === '' ? Number.NaN : Number(areaRaw);
    const ppaNum = ppaRaw === '' ? Number.NaN : Number(ppaRaw);
    set({
      areaUnit: next,
      area: Number.isFinite(areaNum)
        ? formatNumericDisplay(convertArea(areaNum, input.areaUnit, next))
        : input.area,
      pricePerArea: Number.isFinite(ppaNum)
        ? formatNumericDisplay(
            convertPricePerArea(ppaNum, input.areaUnit, next)
          )
        : input.pricePerArea,
    });
  };

  const setSecondAreaUnit = (next: AreaUnit) => {
    if (next === input.secondAreaUnit) return;
    const areaRaw = input.secondArea.trim().replace(/,/g, '');
    const areaNum = areaRaw === '' ? Number.NaN : Number(areaRaw);
    set({
      secondAreaUnit: next,
      secondArea: Number.isFinite(areaNum)
        ? formatNumericDisplay(
            convertArea(areaNum, input.secondAreaUnit, next)
          )
        : input.secondArea,
    });
  };

  const setCompare = (yes: boolean) => {
    set({ compareSecondProperty: yes });
    if (yes) setSecondOpen(true);
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="ppsf-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculate</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          {(
            [
              ['pricePerArea', 'Price per area'],
              ['totalPrice', 'Total price'],
              ['area', 'Property area'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ppsf-mode"
                className="h-4 w-4 accent-primary"
                checked={input.calculationMode === value}
                onChange={() => setMode(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Pricing context</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="ppsf-context"
              className="h-4 w-4 accent-primary"
              checked={input.pricingContext === 'purchase'}
              onChange={() => setContext('purchase')}
            />
            Purchase price
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="ppsf-context"
              className="h-4 w-4 accent-primary"
              checked={input.pricingContext === 'rent'}
              onChange={() => setContext('rent')}
            />
            Rent
          </label>
        </div>
      </fieldset>

      {input.pricingContext === 'rent' ? (
        <div>
          <label htmlFor="ppsf-rent-period" className={labelClass}>
            Rental period
          </label>
          <select
            id="ppsf-rent-period"
            className="h-11 w-full max-w-xs rounded-lg border border-border bg-white px-3 text-sm text-accent"
            value={input.rentalPeriod}
            onChange={(e) => setRentalPeriod(e.target.value as RentalPeriod)}
          >
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="ppsf-price" className={labelClass}>
          <span>Price or rent</span>
          <InfoTooltip
            label="Price or rent"
            text="Total purchase price or rent for the selected period. Used with area to compute price per unit area."
          />
        </label>
        <FieldShell error={errors.price} muted={priceReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ppsf-price"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={
              priceReadOnly ? (result?.formattedPrice ?? '') : input.price
            }
            readOnly={priceReadOnly}
            aria-readonly={priceReadOnly || undefined}
            aria-invalid={errors.price ? true : undefined}
            onChange={
              priceReadOnly
                ? undefined
                : (e) => set({ price: e.target.value })
            }
          />
        </FieldShell>
        {errors.price ? (
          <p className="mt-1 text-xs text-rose-600">{errors.price}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ppsf-area" className={labelClass}>
          <span>Square footage</span>
          <InfoTooltip
            label="Square footage"
            text="Measured property area. Use a consistent definition (for example interior living space) when comparing. Switching units preserves physical area and adjusts price-per-area so total value stays constant."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.area} muted={areaReadOnly}>
            <input
              id="ppsf-area"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={
                areaReadOnly ? (result?.formattedArea ?? '') : input.area
              }
              readOnly={areaReadOnly}
              aria-readonly={areaReadOnly || undefined}
              aria-invalid={errors.area ? true : undefined}
              onChange={
                areaReadOnly ? undefined : (e) => set({ area: e.target.value })
              }
            />
          </FieldShell>
          <select
            className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent"
            value={input.areaUnit}
            aria-label="Area unit"
            disabled={areaReadOnly}
            onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
          >
            <option value="ft2">ft²</option>
            <option value="m2">m²</option>
          </select>
        </div>
        {errors.area ? (
          <p className="mt-1 text-xs text-rose-600">{errors.area}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ppsf-ppa" className={labelClass}>
          <span>
            {input.areaUnit === 'm2' ? 'Price per m²' : 'Price per sqft'}
          </span>
          <InfoTooltip
            label="Price per area"
            text={`Unit price in ${symbol}/${areaLabel}${
              input.pricingContext === 'rent'
                ? `/${input.rentalPeriod === 'monthly' ? 'month' : 'year'}`
                : ''
            }.`}
          />
        </label>
        <FieldShell error={errors.pricePerArea} muted={ppaReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}/{areaLabel}
            {input.pricingContext === 'rent'
              ? `/${input.rentalPeriod === 'monthly' ? 'mo' : 'yr'}`
              : ''}
          </span>
          <input
            id="ppsf-ppa"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={
              ppaReadOnly
                ? (result?.formattedPricePerArea ?? '')
                : input.pricePerArea
            }
            readOnly={ppaReadOnly}
            aria-readonly={ppaReadOnly || undefined}
            aria-invalid={errors.pricePerArea ? true : undefined}
            onChange={
              ppaReadOnly
                ? undefined
                : (e) => set({ pricePerArea: e.target.value })
            }
          />
        </FieldShell>
        {errors.pricePerArea ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pricePerArea}</p>
        ) : null}
      </div>

      <CollapsibleSection
        title="Second property"
        open={secondOpen}
        onToggle={() => setSecondOpen((v) => !v)}
      >
        <fieldset>
          <legend className={labelClass}>Compare with a second property?</legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="ppsf-compare"
                className="h-4 w-4 accent-primary"
                checked={!input.compareSecondProperty}
                onChange={() => setCompare(false)}
              />
              No
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="ppsf-compare"
                className="h-4 w-4 accent-primary"
                checked={input.compareSecondProperty}
                onChange={() => setCompare(true)}
              />
              Yes
            </label>
          </div>
        </fieldset>

        {input.compareSecondProperty ? (
          <>
            <p className="text-xs text-muted-foreground">
              Uses the same currency and purchase/rent context as property A.
              Areas are normalized before comparing unit prices.
            </p>
            <div>
              <label htmlFor="ppsf-second-price" className={labelClass}>
                Second property price or rent
              </label>
              <FieldShell error={errors.secondPrice}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ppsf-second-price"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.secondPrice}
                  aria-invalid={errors.secondPrice ? true : undefined}
                  onChange={(e) => set({ secondPrice: e.target.value })}
                />
              </FieldShell>
              {errors.secondPrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.secondPrice}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ppsf-second-area" className={labelClass}>
                Second property square footage
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.secondArea}>
                  <input
                    id="ppsf-second-area"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.secondArea}
                    aria-invalid={errors.secondArea ? true : undefined}
                    onChange={(e) => set({ secondArea: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent"
                  value={input.secondAreaUnit}
                  aria-label="Second property area unit"
                  onChange={(e) =>
                    setSecondAreaUnit(e.target.value as AreaUnit)
                  }
                >
                  <option value="ft2">ft²</option>
                  <option value="m2">m²</option>
                </select>
              </div>
              {errors.secondArea ? (
                <p className="mt-1 text-xs text-rose-600">{errors.secondArea}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ppsf-second-ppa" className={labelClass}>
                Second property price per{' '}
                {input.secondAreaUnit === 'm2' ? 'm²' : 'sqft'}
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}/{secondAreaLabel}
                </span>
                <input
                  id="ppsf-second-ppa"
                  type="text"
                  className={inputClass}
                  value={result?.formattedSecondPricePerArea ?? ''}
                  readOnly
                  aria-readonly
                />
              </FieldShell>
            </div>
          </>
        ) : null}
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
