'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { calculateAverageAssets, formatTatMoney } from './calculation';
import type {
  TotalAssetTurnoverFieldErrors,
  TotalAssetTurnoverInput,
  TotalAssetTurnoverResult,
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

interface TotalAssetTurnoverFormProps {
  input: TotalAssetTurnoverInput;
  errors: TotalAssetTurnoverFieldErrors;
  result: TotalAssetTurnoverResult | null;
  onChange: (input: TotalAssetTurnoverInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function TotalAssetTurnoverForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: TotalAssetTurnoverFormProps) {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [tatOpen, setTatOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<TotalAssetTurnoverInput>) => {
    onChange({ ...input, ...patch });
  };

  let averageDisplay = result?.formattedAverageAssets ?? '';
  if (!averageDisplay) {
    const b = parseNonneg(input.beginningAssets);
    const e = parseNonneg(input.endingAssets);
    if (b !== null && e !== null) {
      const avg = calculateAverageAssets(b, e);
      if (avg !== null) averageDisplay = formatTatMoney(avg, input.currency);
    }
  }

  const tatDisplay =
    result?.formattedTotalAssetTurnover != null
      ? `${result.formattedTotalAssetTurnover}x`
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
          id="tat-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for total assets and revenue"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Amounts share one currency label (denomination only; no FX). Use total
        assets and revenue from the same reporting period.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <CollapsibleSection
        title="Average asset"
        open={assetsOpen}
        onToggle={() => setAssetsOpen((o) => !o)}
      >
        <div>
          <label htmlFor="tat-beginning" className={labelClass}>
            Beginning asset
            <InfoTooltip
              label="Beginning asset"
              text="Total assets reported at the beginning of the selected accounting period; not current assets alone, equity, or net assets."
            />
          </label>
          <FieldShell error={errors.beginningAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="tat-beginning"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.beginningAssets}
              onChange={(e) => set({ beginningAssets: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.beginningAssets)}
            />
          </FieldShell>
          {errors.beginningAssets ? (
            <p className="mt-1 text-xs text-rose-600">{errors.beginningAssets}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="tat-ending" className={labelClass}>
            Ending asset
            <InfoTooltip
              label="Ending asset"
              text="Total assets at the end of the same accounting period. Must match the company and consecutive period boundaries used for revenue."
            />
          </label>
          <FieldShell error={errors.endingAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="tat-ending"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.endingAssets}
              onChange={(e) => set({ endingAssets: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.endingAssets)}
            />
          </FieldShell>
          {errors.endingAssets ? (
            <p className="mt-1 text-xs text-rose-600">{errors.endingAssets}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="tat-average" className={labelClass}>
            Average asset
            <InfoTooltip
              label="Average asset"
              text="(Beginning assets + Ending assets) ÷ 2. A simple two-point average for the period."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="tat-average"
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
        title="Total asset turnover"
        open={tatOpen}
        onToggle={() => setTatOpen((o) => !o)}
      >
        <div>
          <label htmlFor="tat-revenue" className={labelClass}>
            Revenue
            <InfoTooltip
              label="Revenue"
              text="Net sales or comparable operating revenue for the same period; not net income, gross profit, EBITDA, or cash flow."
            />
          </label>
          <FieldShell error={errors.revenue}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="tat-revenue"
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
          <label htmlFor="tat-ratio" className={labelClass}>
            Total asset turnover
            <InfoTooltip
              label="Total asset turnover"
              text="Revenue ÷ Average Total Assets. Displayed as a multiplier with x; no currency symbol. Unavailable when average assets are zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="tat-ratio"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={tatDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
