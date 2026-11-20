'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  NetIncomeFieldErrors,
  NetIncomeInput,
  NetIncomeResult,
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

function MoneyInput({
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
  value,
  symbol,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  symbol: string;
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
          value={value}
          placeholder="—"
          aria-readonly="true"
        />
      </FieldShell>
    </div>
  );
}

interface NetIncomeFormProps {
  input: NetIncomeInput;
  errors: NetIncomeFieldErrors;
  result: NetIncomeResult | null;
  onChange: (input: NetIncomeInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function NetIncomeForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: NetIncomeFormProps) {
  const [pretaxOpen, setPretaxOpen] = useState(true);
  const [taxOpen, setTaxOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<NetIncomeInput>) => {
    onChange({ ...input, ...patch });
  };

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
          aria-label="Currency for net income amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (no FX conversion). Tax rate is a
        percent. Estimated taxes use max(EBT, 0) × rate.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <CollapsibleSection
        title="Net income before taxes"
        open={pretaxOpen}
        onToggle={() => setPretaxOpen((o) => !o)}
      >
        <MoneyInput
          id="ni-revenue"
          label="Revenue"
          tip="Total revenue from goods or services before expenses for the reporting period."
          value={input.revenue}
          error={errors.revenue}
          symbol={symbol}
          onChange={(v) => set({ revenue: v })}
        />
        <MoneyInput
          id="ni-cogs"
          label="Cost of sales"
          tip="Direct costs of goods or services sold (COGS / cost of revenue)."
          value={input.costOfSales}
          error={errors.costOfSales}
          symbol={symbol}
          onChange={(v) => set({ costOfSales: v })}
        />
        <ReadOnlyMoney
          id="ni-gp"
          label="Gross profit"
          tip="Revenue − cost of sales."
          value={result?.formattedGrossProfit ?? ''}
          symbol={symbol}
        />
        <MoneyInput
          id="ni-opex"
          label="Operating expenses"
          tip="Operating costs not in cost of sales (SG&A, overhead, D&A if applicable)."
          value={input.operatingExpenses}
          error={errors.operatingExpenses}
          symbol={symbol}
          onChange={(v) => set({ operatingExpenses: v })}
        />
        <ReadOnlyMoney
          id="ni-oi"
          label="Operating income"
          tip="Gross profit − operating expenses (simplified EBIT-style operating profit)."
          value={result?.formattedOperatingIncome ?? ''}
          symbol={symbol}
        />
        <MoneyInput
          id="ni-interest"
          label="Interest"
          tip="Interest expense on borrowings for the period (not interest income)."
          value={input.interest}
          error={errors.interest}
          symbol={symbol}
          onChange={(v) => set({ interest: v })}
        />
        <ReadOnlyMoney
          id="ni-ebt"
          label="Net income before taxes"
          tip="Operating income − interest (simplified EBT / pretax income)."
          value={result?.formattedEarningsBeforeTax ?? ''}
          symbol={symbol}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Taxes"
        open={taxOpen}
        onToggle={() => setTaxOpen((o) => !o)}
      >
        <div>
          <label htmlFor="ni-tax-rate" className={labelClass}>
            Tax rate
            <InfoTooltip
              label="Tax rate"
              text="Assumed effective tax rate applied to positive EBT. Converted as percent ÷ 100."
            />
          </label>
          <FieldShell error={errors.taxRate}>
            <input
              id="ni-tax-rate"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.taxRate}
              onChange={(e) => set({ taxRate: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.taxRate)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.taxRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.taxRate}</p>
          ) : null}
        </div>
        <ReadOnlyMoney
          id="ni-taxes"
          label="Total taxes"
          tip="Estimated income taxes = max(EBT, 0) × tax rate. Not a legal tax determination."
          value={result?.formattedTotalTaxes ?? ''}
          symbol={symbol}
        />
        <ReadOnlyMoney
          id="ni-niat"
          label="Net income after taxes"
          tip="EBT − estimated taxes. Primary bottom-line result."
          value={result?.formattedNetIncomeAfterTaxes ?? ''}
          symbol={symbol}
        />
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
