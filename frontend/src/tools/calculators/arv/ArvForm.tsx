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
} from './calculation';
import type {
  AreaUnit,
  ArvFieldErrors,
  ArvInput,
  ArvResult,
  ValuationMethod,
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

function formatAreaInput(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e8) / 1e8;
  return String(rounded);
}

interface ArvFormProps {
  input: ArvInput;
  errors: ArvFieldErrors;
  result: ArvResult | null;
  onChange: (input: ArvInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ArvForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ArvFormProps) {
  const [propertyOpen, setPropertyOpen] = useState(true);
  const [bidOpen, setBidOpen] = useState(true);
  const [roiOpen, setRoiOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const symbol = getCurrencySymbol(input.currency);
  const areaLabel = areaUnitLabel(input.areaUnit);

  const set = (patch: Partial<ArvInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMethod = (method: ValuationMethod) => {
    if (method === input.method) return;
    set({ method });
  };

  const setAreaUnit = (next: AreaUnit) => {
    if (next === input.areaUnit) return;
    const areaRaw = input.propertyArea.trim().replace(/,/g, '');
    const priceRaw = input.averagePrice.trim().replace(/,/g, '');
    const areaNum = areaRaw === '' ? Number.NaN : Number(areaRaw);
    const priceNum = priceRaw === '' ? Number.NaN : Number(priceRaw);
    set({
      areaUnit: next,
      propertyArea: Number.isFinite(areaNum)
        ? formatAreaInput(convertArea(areaNum, input.areaUnit, next))
        : input.propertyArea,
      averagePrice: Number.isFinite(priceNum)
        ? formatAreaInput(convertPricePerArea(priceNum, input.areaUnit, next))
        : input.averagePrice,
    });
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
 changes the symbol only; it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="arv-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <CollapsibleSection
        title="Property value"
        open={propertyOpen}
        onToggle={() => setPropertyOpen((v) => !v)}
      >
        <fieldset>
          <legend className={labelClass}>Method</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="arv-method"
                className="h-4 w-4 accent-primary"
                checked={input.method === 'property-value'}
                onChange={() => setMethod('property-value')}
              />
              Value of the property
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="arv-method"
                className="h-4 w-4 accent-primary"
                checked={input.method === 'average-price'}
                onChange={() => setMethod('average-price')}
              />
              Average price in the area
            </label>
          </div>
        </fieldset>

        {input.method === 'property-value' ? (
          <div>
            <label className={labelClass} htmlFor="arv-property-value">
              <span>Property&apos;s current value</span>
              <InfoTooltip
                label="Property current value"
                text="As-is market estimate before renovations. Zero is allowed; leave blank until you have a figure."
              />
            </label>
            <FieldShell error={errors.propertyValue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {symbol}
              </span>
              <input
                id="arv-property-value"
                className={inputClass}
                inputMode="decimal"
                value={input.propertyValue}
                aria-invalid={Boolean(errors.propertyValue)}
                onChange={(e) => set({ propertyValue: e.target.value })}
              />
            </FieldShell>
            {errors.propertyValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.propertyValue}</p>
            ) : null}
          </div>
        ) : (
          <>
            <div>
              <label className={labelClass} htmlFor="arv-average-price">
                <span>Average price in the area</span>
                <InfoTooltip
                  label="Average price"
                  text={`Comparable sold price per ${areaLabel}. Changing the area unit also converts this rate so the product stays the same.`}
                />
              </label>
              <FieldShell error={errors.averagePrice}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {symbol}/{areaLabel}
                </span>
                <input
                  id="arv-average-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.averagePrice}
                  aria-invalid={Boolean(errors.averagePrice)}
                  onChange={(e) => set({ averagePrice: e.target.value })}
                />
              </FieldShell>
              {errors.averagePrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.averagePrice}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="arv-property-area">
                <span>Property area</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.propertyArea}>
                  <input
                    id="arv-property-area"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.propertyArea}
                    aria-invalid={Boolean(errors.propertyArea)}
                    onChange={(e) => set({ propertyArea: e.target.value })}
                  />
                </FieldShell>
                <select
                  id="arv-area-unit"
                  className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent sm:w-[120px]"
                  value={input.areaUnit}
                  aria-label="Area unit"
                  onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                >
                  <option value="ft2">ft²</option>
                  <option value="m2">m²</option>
                </select>
              </div>
              {errors.propertyArea ? (
                <p className="mt-1 text-xs text-rose-600">{errors.propertyArea}</p>
              ) : null}
            </div>
          </>
        )}

        <div>
          <label className={labelClass} htmlFor="arv-renovation-value">
            <span>Value of renovations</span>
            <InfoTooltip
              label="Value of renovations"
              text="Expected increase in market value from repairs; not necessarily the same as renovation cost."
            />
          </label>
          <FieldShell error={errors.renovationValue}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="arv-renovation-value"
              className={inputClass}
              inputMode="decimal"
              value={input.renovationValue}
              aria-invalid={Boolean(errors.renovationValue)}
              onChange={(e) => set({ renovationValue: e.target.value })}
            />
          </FieldShell>
          {errors.renovationValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.renovationValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="arv-arv">
            <span>After repair value (ARV)</span>
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="arv-arv"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedArv ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
          This tool estimates after-repair value from your inputs. Accuracy
          depends on comparable sales, renovation scope, and local market
 conditions; treat results as planning estimates, not appraisals.
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Property best purchase price"
        open={bidOpen}
        onToggle={() => setBidOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="arv-renovation-cost">
            <span>Total cost of renovation</span>
            <InfoTooltip
              label="Renovation cost"
              text="Cash outlay for repairs. Distinct from renovation value (market uplift)."
            />
          </label>
          <FieldShell error={errors.renovationCost}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="arv-renovation-cost"
              className={inputClass}
              inputMode="decimal"
              value={input.renovationCost}
              aria-invalid={Boolean(errors.renovationCost)}
              onChange={(e) => set({ renovationCost: e.target.value })}
            />
          </FieldShell>
          {errors.renovationCost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.renovationCost}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="arv-purchase-rule">
            <span>Investor&apos;s purchase rule</span>
            <InfoTooltip
              label="Purchase rule"
              text="Common flip heuristic is 70% of ARV minus renovation cost. Adjust for your market and risk."
            />
          </label>
          <FieldShell error={errors.purchaseRulePercent}>
            <input
              id="arv-purchase-rule"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.purchaseRulePercent}
              aria-invalid={Boolean(errors.purchaseRulePercent)}
              onChange={(e) => set({ purchaseRulePercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.purchaseRulePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.purchaseRulePercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="arv-max-bid">
            <span>Maximum bid price</span>
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="arv-max-bid"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedMaximumBid ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          {result?.maximumBidNegative ? (
            <p className="mt-1 text-xs text-amber-700" role="status">
              Maximum bid is negative: renovation cost exceeds the
              rule-adjusted ARV. Review costs or the purchase rule.
            </p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Potential return on investment"
        open={roiOpen}
        onToggle={() => setRoiOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="arv-roi">
            <span>ROI</span>
            <InfoTooltip
              label="ROI"
              text="Simplified gross ROI = (ARV − purchase − renovation cost) ÷ (purchase + renovation cost) × 100. Excludes financing, holding, closing, selling costs, and taxes."
            />
          </label>
          <FieldShell muted>
            <input
              id="arv-roi"
              className={`${inputClass} pr-8 text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedRoi ?? ''}
              aria-live="polite"
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {result?.roiUsedMaximumBid ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Using maximum bid ({symbol}
              {result.formattedPurchasePriceUsed}) as the assumed purchase
              price. Enter a custom purchase price under Additional settings to
              override.
            </p>
          ) : null}
          {result &&
          result.formattedMaximumBid &&
          result.formattedRoi === null &&
          result.totalInvestment === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              ROI is unavailable when total investment is zero.
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="arv-target-roi">
            <span>Target ROI (optional)</span>
            <InfoTooltip
              label="Target ROI"
              text="Reverse solve only: maximum purchase price that would yield this gross ROI. Shown separately from the investor-rule maximum bid."
            />
          </label>
          <FieldShell error={errors.targetRoiPercent}>
            <input
              id="arv-target-roi"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.targetRoiPercent}
              aria-invalid={Boolean(errors.targetRoiPercent)}
              onChange={(e) => set({ targetRoiPercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.targetRoiPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetRoiPercent}</p>
          ) : null}
        </div>

        {result?.formattedTargetPurchasePrice ? (
          <div>
            <label className={labelClass} htmlFor="arv-target-pp">
              <span>Max purchase price for target ROI</span>
            </label>
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {symbol}
              </span>
              <input
                id="arv-target-pp"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result.formattedTargetPurchasePrice}
                aria-live="polite"
              />
            </FieldShell>
            <p className="mt-1 text-xs text-muted-foreground">
              Separate from the investor-rule maximum bid above.
            </p>
          </div>
        ) : null}
      </CollapsibleSection>

      <CollapsibleSection
        title="Additional settings"
        open={settingsOpen}
        onToggle={() => setSettingsOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="arv-purchase-price">
            <span>Custom purchase price (for ROI)</span>
            <InfoTooltip
              label="Custom purchase price"
              text="Optional. When set, primary ROI uses this price instead of the maximum bid."
            />
          </label>
          <FieldShell error={errors.purchasePrice}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="arv-purchase-price"
              className={inputClass}
              inputMode="decimal"
              value={input.purchasePrice}
              aria-invalid={Boolean(errors.purchasePrice)}
              onChange={(e) => set({ purchasePrice: e.target.value })}
            />
          </FieldShell>
          {errors.purchasePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.purchasePrice}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
