'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateAverageFixedAssets,
  formatFatMoney,
} from './calculation';
import type {
  FixedAssetTurnoverRatioFieldErrors,
  FixedAssetTurnoverRatioInput,
  FixedAssetTurnoverRatioResult,
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

function parseNonneg(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

interface FixedAssetTurnoverRatioFormProps {
  input: FixedAssetTurnoverRatioInput;
  errors: FixedAssetTurnoverRatioFieldErrors;
  result: FixedAssetTurnoverRatioResult | null;
  onChange: (input: FixedAssetTurnoverRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function FixedAssetTurnoverRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: FixedAssetTurnoverRatioFormProps) {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [fatOpen, setFatOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<FixedAssetTurnoverRatioInput>) => {
    onChange({ ...input, ...patch });
  };

  let averageDisplay = result?.formattedAverageFixedAssets ?? '';
  if (!averageDisplay) {
    const s = parseNonneg(input.startingFixedAssets);
    const f = parseNonneg(input.finalFixedAssets);
    if (s !== null && f !== null) {
      const avg = calculateAverageFixedAssets(s, f);
      if (avg !== null) averageDisplay = formatFatMoney(avg, input.currency);
    }
  }

  const fatDisplay =
    result?.formattedFixedAssetTurnover != null
      ? `${result.formattedFixedAssetTurnover}×`
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for fixed assets and revenue"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Use net fixed assets and net revenue from the same
        reporting period.
      </p>

      <CollapsibleSection
        title="Average fixed assets"
        open={assetsOpen}
        onToggle={() => setAssetsOpen((o) => !o)}
      >
        <div>
          <label htmlFor="fat-starting" className={labelClass}>
            Starting fixed assets
            <InfoTooltip
              label="Starting fixed assets"
              text="Net book value of fixed assets (PP&E) at the beginning of the revenue period; buildings, machinery, equipment, vehicles, and similar assets after accumulated depreciation."
            />
          </label>
          <FieldShell error={errors.startingFixedAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="fat-starting"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.startingFixedAssets}
              onChange={(e) => set({ startingFixedAssets: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.startingFixedAssets)}
            />
          </FieldShell>
          {errors.startingFixedAssets ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.startingFixedAssets}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="fat-final" className={labelClass}>
            Final fixed assets
            <InfoTooltip
              label="Final fixed assets"
              text="Net book value of fixed assets at the end of the reporting period, reflecting CapEx, depreciation, impairments, acquisitions, and disposals."
            />
          </label>
          <FieldShell error={errors.finalFixedAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="fat-final"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.finalFixedAssets}
              onChange={(e) => set({ finalFixedAssets: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.finalFixedAssets)}
            />
          </FieldShell>
          {errors.finalFixedAssets ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.finalFixedAssets}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="fat-average" className={labelClass}>
            Average fixed assets
            <InfoTooltip
              label="Average fixed assets"
              text="(Starting fixed assets + Final fixed assets) ÷ 2. A simple two-point average for the period."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="fat-average"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={averageDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Fixed asset turnover (FAT)"
        open={fatOpen}
        onToggle={() => setFatOpen((o) => !o)}
      >
        <div>
          <label htmlFor="fat-revenue" className={labelClass}>
            Revenue
            <InfoTooltip
              label="Revenue"
              text="Net sales or operating revenue for the same period as the fixed asset balances; not net income, gross profit, or cash flow."
            />
          </label>
          <FieldShell error={errors.revenue}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="fat-revenue"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.revenue}
              onChange={(e) => set({ revenue: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.revenue)}
            />
          </FieldShell>
          {errors.revenue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="fat-ratio" className={labelClass}>
            Fixed asset turnover (FAT)
            <InfoTooltip
              label="Fixed asset turnover (FAT)"
              text="Revenue ÷ Average Fixed Assets. Dimensionless multiplier; no currency or percent symbol. Undefined when average fixed assets are zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="fat-ratio"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={fatDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
