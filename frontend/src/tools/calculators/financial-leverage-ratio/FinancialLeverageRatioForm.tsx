'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { calculateTotalAssets, formatFlMoney } from './calculation';
import type {
  FinancialLeverageRatioFieldErrors,
  FinancialLeverageRatioInput,
  FinancialLeverageRatioResult,
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

interface FinancialLeverageRatioFormProps {
  input: FinancialLeverageRatioInput;
  errors: FinancialLeverageRatioFieldErrors;
  result: FinancialLeverageRatioResult | null;
  onChange: (input: FinancialLeverageRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function FinancialLeverageRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: FinancialLeverageRatioFormProps) {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [leverageOpen, setLeverageOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<FinancialLeverageRatioInput>) => {
    onChange({ ...input, ...patch });
  };

  let totalAssetsDisplay = result?.formattedTotalAssets ?? '';
  if (!totalAssetsDisplay) {
    const c = parseNonneg(input.currentAssets);
    const n = parseNonneg(input.nonCurrentAssets);
    if (c !== null && n !== null) {
      const t = calculateTotalAssets(c, n);
      if (t !== null) totalAssetsDisplay = formatFlMoney(t, input.currency);
    }
  }

  const leverageDisplay =
    result?.formattedFinancialLeverage != null
      ? `${result.formattedFinancialLeverage}×`
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
          aria-label="Currency for balance-sheet amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Financial leverage here is the equity multiplier (Total
        Assets ÷ Total Equity), not debt-to-equity.
      </p>

      <CollapsibleSection
        title="Total assets"
        open={assetsOpen}
        onToggle={() => setAssetsOpen((o) => !o)}
      >
        <div>
          <label htmlFor="flr-current" className={labelClass}>
            Current assets
            <InfoTooltip
              label="Current assets"
              text="Assets expected to be converted to cash, sold, or consumed within the operating cycle — cash, receivables, inventory, short-term investments, prepaids. Use the reported balance-sheet total."
            />
          </label>
          <FieldShell error={errors.currentAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="flr-current"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.currentAssets}
              onChange={(e) => set({ currentAssets: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.currentAssets)}
            />
          </FieldShell>
          {errors.currentAssets ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentAssets}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="flr-noncurrent" className={labelClass}>
            Non-current assets
            <InfoTooltip
              label="Non-current assets"
              text="Longer-lived assets such as PP&E, long-term investments, intangibles, and investment property — typically at net carrying value. Do not add accumulated depreciation separately if already netted."
            />
          </label>
          <FieldShell error={errors.nonCurrentAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="flr-noncurrent"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.nonCurrentAssets}
              onChange={(e) => set({ nonCurrentAssets: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.nonCurrentAssets)}
            />
          </FieldShell>
          {errors.nonCurrentAssets ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.nonCurrentAssets}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="flr-total-assets" className={labelClass}>
            Total assets
            <InfoTooltip
              label="Total assets"
              text="Current assets + Non-current assets."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="flr-total-assets"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={totalAssetsDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Financial leverage"
        open={leverageOpen}
        onToggle={() => setLeverageOpen((o) => !o)}
      >
        <div>
          <label htmlFor="flr-equity" className={labelClass}>
            Total equity
            <InfoTooltip
              label="Total equity"
              text="Residual interest in assets after liabilities (Assets − Liabilities). May be negative when liabilities exceed assets."
            />
          </label>
          <FieldShell error={errors.totalEquity}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="flr-equity"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalEquity}
              onChange={(e) => set({ totalEquity: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.totalEquity)}
            />
          </FieldShell>
          {errors.totalEquity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalEquity}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="flr-leverage" className={labelClass}>
            Financial leverage
            <InfoTooltip
              label="Financial leverage"
              text="Equity multiplier = Total Assets ÷ Total Equity. Dimensionless — no currency or percent symbol. Undefined when equity is zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="flr-leverage"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={leverageDisplay}
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
