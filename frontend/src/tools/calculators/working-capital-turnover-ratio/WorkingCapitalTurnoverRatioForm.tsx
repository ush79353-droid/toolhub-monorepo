'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateAverageBalance,
  calculateAverageWorkingCapitalFromAverages,
  formatMoney,
} from './calculation';
import type {
  WorkingCapitalTurnoverRatioFieldErrors,
  WorkingCapitalTurnoverRatioInput,
  WorkingCapitalTurnoverRatioResult,
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

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          aria-invalid={Boolean(error)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ReadOnlyMoney({
  id,
  label,
  tip,
  symbol,
  display,
}: {
  id: string;
  label: string;
  tip: string;
  symbol: string;
  display: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell muted>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default text-muted-foreground`}
          value={display}
          placeholder="—"
          aria-readonly="true"
        />
      </FieldShell>
    </div>
  );
}

interface WorkingCapitalTurnoverRatioFormProps {
  input: WorkingCapitalTurnoverRatioInput;
  errors: WorkingCapitalTurnoverRatioFieldErrors;
  result: WorkingCapitalTurnoverRatioResult | null;
  onChange: (input: WorkingCapitalTurnoverRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function WorkingCapitalTurnoverRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: WorkingCapitalTurnoverRatioFormProps) {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [liabOpen, setLiabOpen] = useState(true);
  const [turnoverOpen, setTurnoverOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<WorkingCapitalTurnoverRatioInput>) => {
    onChange({ ...input, ...patch });
  };

  let acaDisplay = result?.formattedAverageCurrentAssets ?? '';
  if (!acaDisplay) {
    const o = parseNonneg(input.openingCurrentAssets);
    const c = parseNonneg(input.closingCurrentAssets);
    if (o !== null && c !== null) {
      const avg = calculateAverageBalance(o, c);
      if (avg !== null) acaDisplay = formatMoney(avg, input.currency);
    }
  }

  let aclDisplay = result?.formattedAverageCurrentLiabilities ?? '';
  if (!aclDisplay) {
    const o = parseNonneg(input.openingCurrentLiabilities);
    const c = parseNonneg(input.closingCurrentLiabilities);
    if (o !== null && c !== null) {
      const avg = calculateAverageBalance(o, c);
      if (avg !== null) aclDisplay = formatMoney(avg, input.currency);
    }
  }

  let awcDisplay = result?.formattedAverageWorkingCapital ?? '';
  if (!awcDisplay) {
    const oA = parseNonneg(input.openingCurrentAssets);
    const cA = parseNonneg(input.closingCurrentAssets);
    const oL = parseNonneg(input.openingCurrentLiabilities);
    const cL = parseNonneg(input.closingCurrentLiabilities);
    if (oA !== null && cA !== null && oL !== null && cL !== null) {
      const aca = calculateAverageBalance(oA, cA);
      const acl = calculateAverageBalance(oL, cL);
      if (aca !== null && acl !== null) {
        const awc = calculateAverageWorkingCapitalFromAverages(aca, acl);
        if (awc !== null) awcDisplay = formatMoney(awc, input.currency);
      }
    }
  }

  const turnoverDisplay =
    result?.formattedWorkingCapitalTurnover != null
      ? `${result.formattedWorkingCapitalTurnover}x`
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
          id="wctr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for working capital turnover amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (denomination only — no FX). Use the
        same reporting period for balances and revenue.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate-turnover"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate working capital turnover
        </a>
      </p>

      <CollapsibleSection
        title="Average current assets"
        open={assetsOpen}
        onToggle={() => setAssetsOpen((o) => !o)}
      >
        <MoneyField
          id="wctr-oca"
          label="Opening current assets"
          tip="Current assets at the beginning of the accounting period — cash, receivables, inventory, and other short-term assets."
          value={input.openingCurrentAssets}
          error={errors.openingCurrentAssets}
          symbol={symbol}
          onChange={(v) => set({ openingCurrentAssets: v })}
        />
        <MoneyField
          id="wctr-cca"
          label="Closing current assets"
          tip="Current assets at the end of the accounting period."
          value={input.closingCurrentAssets}
          error={errors.closingCurrentAssets}
          symbol={symbol}
          onChange={(v) => set({ closingCurrentAssets: v })}
        />
        <ReadOnlyMoney
          id="wctr-aca"
          label="Average current assets"
          tip="(Opening current assets + Closing current assets) ÷ 2."
          symbol={symbol}
          display={acaDisplay}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Average current liabilities"
        open={liabOpen}
        onToggle={() => setLiabOpen((o) => !o)}
      >
        <MoneyField
          id="wctr-ocl"
          label="Opening current liabilities"
          tip="Current liabilities at the beginning of the reporting period."
          value={input.openingCurrentLiabilities}
          error={errors.openingCurrentLiabilities}
          symbol={symbol}
          onChange={(v) => set({ openingCurrentLiabilities: v })}
        />
        <MoneyField
          id="wctr-ccl"
          label="Closing current liabilities"
          tip="Current liabilities at the end of the reporting period."
          value={input.closingCurrentLiabilities}
          error={errors.closingCurrentLiabilities}
          symbol={symbol}
          onChange={(v) => set({ closingCurrentLiabilities: v })}
        />
        <ReadOnlyMoney
          id="wctr-acl"
          label="Average current liabilities"
          tip="(Opening current liabilities + Closing current liabilities) ÷ 2."
          symbol={symbol}
          display={aclDisplay}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Working capital turnover"
        open={turnoverOpen}
        onToggle={() => setTurnoverOpen((o) => !o)}
      >
        <ReadOnlyMoney
          id="wctr-awc"
          label="Average working capital"
          tip="Average current assets − average current liabilities. May be positive, zero, or negative."
          symbol={symbol}
          display={awcDisplay}
        />
        <MoneyField
          id="wctr-rev"
          label="Revenue"
          tip="Net sales or comparable operating revenue for the same period — not net income or cash flow."
          value={input.revenue}
          error={errors.revenue}
          symbol={symbol}
          onChange={(v) => set({ revenue: v })}
        />
        <div>
          <label htmlFor="wctr-ratio" className={labelClass}>
            Working capital turnover
            <InfoTooltip
              label="Working capital turnover"
              text="Revenue ÷ average working capital. Shown with x — no currency symbol. Unavailable when average WC is zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="wctr-ratio"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={turnoverDisplay}
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
