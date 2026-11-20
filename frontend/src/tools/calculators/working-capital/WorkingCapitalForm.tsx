'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateWorkingCapital,
  formatSignedMoney,
} from './calculation';
import type {
  WorkingCapitalFieldErrors,
  WorkingCapitalInput,
  WorkingCapitalResult,
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

interface WorkingCapitalFormProps {
  input: WorkingCapitalInput;
  errors: WorkingCapitalFieldErrors;
  result: WorkingCapitalResult | null;
  onChange: (input: WorkingCapitalInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function WorkingCapitalForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: WorkingCapitalFormProps) {
  const [basicOpen, setBasicOpen] = useState(true);
  const [turnoverOpen, setTurnoverOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<WorkingCapitalInput>) => {
    onChange({ ...input, ...patch });
  };

  let wcDisplay = result?.formattedWorkingCapital ?? '';
  if (!wcDisplay) {
    const a = parseNonneg(input.currentAssets);
    const l = parseNonneg(input.currentLiabilities);
    if (a !== null && l !== null) {
      const wc = calculateWorkingCapital(a, l);
      if (wc !== null) wcDisplay = formatSignedMoney(wc, input.currency);
    }
  }

  const ratioDisplay =
    result?.formattedWorkingCapitalRatio != null
      ? result.formattedWorkingCapitalRatio
      : '';

  let begWcDisplay = result?.formattedBeginningWorkingCapital ?? '';
  if (!begWcDisplay) {
    const a = parseNonneg(input.beginningCurrentAssets);
    const l = parseNonneg(input.beginningCurrentLiabilities);
    if (a !== null && l !== null) {
      const wc = calculateWorkingCapital(a, l);
      if (wc !== null) begWcDisplay = formatSignedMoney(wc, input.currency);
    }
  }

  let endWcDisplay = result?.formattedEndingWorkingCapital ?? '';
  if (!endWcDisplay) {
    const a = parseNonneg(input.endingCurrentAssets);
    const l = parseNonneg(input.endingCurrentLiabilities);
    if (a !== null && l !== null) {
      const wc = calculateWorkingCapital(a, l);
      if (wc !== null) endWcDisplay = formatSignedMoney(wc, input.currency);
    }
  }

  const avgDisplay = result?.formattedAverageWorkingCapital ?? '';
  const turnoverDisplay =
    result?.formattedWorkingCapitalTurnoverRatio != null
      ? `${result.formattedWorkingCapitalTurnoverRatio}x`
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
          id="wc-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for working capital amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (denomination only — no FX). Basic and
        turnover sections use separate inputs.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate working capital
        </a>
      </p>

      <CollapsibleSection
        title="Working capital"
        open={basicOpen}
        onToggle={() => setBasicOpen((o) => !o)}
      >
        <MoneyField
          id="wc-ca"
          label="Current assets"
          tip="Assets expected to be converted into cash, sold, or consumed within the normal operating cycle or about one year."
          value={input.currentAssets}
          error={errors.currentAssets}
          symbol={symbol}
          onChange={(v) => set({ currentAssets: v })}
        />
        <MoneyField
          id="wc-cl"
          label="Current liabilities"
          tip="Obligations expected to be settled within the normal operating cycle or about one year."
          value={input.currentLiabilities}
          error={errors.currentLiabilities}
          symbol={symbol}
          onChange={(v) => set({ currentLiabilities: v })}
        />
        <ReadOnlyMoney
          id="wc-amount"
          label="Working capital"
          tip="Current assets − current liabilities. May be positive, zero, or negative."
          symbol={symbol}
          display={wcDisplay}
        />
        <div>
          <label htmlFor="wc-ratio" className={labelClass}>
            Working capital ratio
            <InfoTooltip
              label="Working capital ratio"
              text="Current assets ÷ current liabilities (the current ratio). Dimensionless — no currency symbol. Unavailable when liabilities are zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="wc-ratio"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={ratioDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Working capital turnover inputs"
        open={turnoverOpen}
        onToggle={() => setTurnoverOpen((o) => !o)}
      >
        <MoneyField
          id="wc-rev"
          label="Revenues"
          tip="Net sales or comparable operating revenue for the same period as the beginning and ending balances."
          value={input.revenue}
          error={errors.revenue}
          symbol={symbol}
          onChange={(v) => set({ revenue: v })}
        />
        <MoneyField
          id="wc-beg-ca"
          label="Beginning current assets"
          tip="Current assets at the start of the reporting period."
          value={input.beginningCurrentAssets}
          error={errors.beginningCurrentAssets}
          symbol={symbol}
          onChange={(v) => set({ beginningCurrentAssets: v })}
        />
        <MoneyField
          id="wc-beg-cl"
          label="Beginning current liabilities"
          tip="Current liabilities at the start of the reporting period."
          value={input.beginningCurrentLiabilities}
          error={errors.beginningCurrentLiabilities}
          symbol={symbol}
          onChange={(v) => set({ beginningCurrentLiabilities: v })}
        />
        <MoneyField
          id="wc-end-ca"
          label="Ending current assets"
          tip="Current assets at the end of the reporting period."
          value={input.endingCurrentAssets}
          error={errors.endingCurrentAssets}
          symbol={symbol}
          onChange={(v) => set({ endingCurrentAssets: v })}
        />
        <MoneyField
          id="wc-end-cl"
          label="Ending current liabilities"
          tip="Current liabilities at the end of the reporting period."
          value={input.endingCurrentLiabilities}
          error={errors.endingCurrentLiabilities}
          symbol={symbol}
          onChange={(v) => set({ endingCurrentLiabilities: v })}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Working capital turnover results"
        open={resultsOpen}
        onToggle={() => setResultsOpen((o) => !o)}
      >
        <ReadOnlyMoney
          id="wc-beg"
          label="Beginning working capital"
          tip="Beginning current assets − beginning current liabilities."
          symbol={symbol}
          display={begWcDisplay}
        />
        <ReadOnlyMoney
          id="wc-end"
          label="Ending working capital"
          tip="Ending current assets − ending current liabilities."
          symbol={symbol}
          display={endWcDisplay}
        />
        <ReadOnlyMoney
          id="wc-avg"
          label="Average working capital"
          tip="(Beginning WC + Ending WC) ÷ 2."
          symbol={symbol}
          display={avgDisplay}
        />
        <div>
          <label htmlFor="wc-turnover" className={labelClass}>
            Working capital turnover ratio
            <InfoTooltip
              label="Working capital turnover ratio"
              text="Revenue ÷ average working capital. Shown with x. Unavailable when average WC is zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="wc-turnover"
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
