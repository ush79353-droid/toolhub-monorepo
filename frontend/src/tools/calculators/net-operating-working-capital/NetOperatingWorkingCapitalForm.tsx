'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  NetOperatingWorkingCapitalFieldErrors,
  NetOperatingWorkingCapitalInput,
  NetOperatingWorkingCapitalResult,
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
  value,
  symbol,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  symbol: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
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

interface NetOperatingWorkingCapitalFormProps {
  input: NetOperatingWorkingCapitalInput;
  errors: NetOperatingWorkingCapitalFieldErrors;
  result: NetOperatingWorkingCapitalResult | null;
  onChange: (input: NetOperatingWorkingCapitalInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function NetOperatingWorkingCapitalForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: NetOperatingWorkingCapitalFormProps) {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [liabOpen, setLiabOpen] = useState(true);
  const [nowcOpen, setNowcOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<NetOperatingWorkingCapitalInput>) => {
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
          aria-label="Currency for net operating working capital"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (no FX conversion). Prefer operating
        cash rather than excess investment cash. Bank loans are excluded from
        COL.
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
        title="Current operating assets"
        open={assetsOpen}
        onToggle={() => setAssetsOpen((o) => !o)}
      >
        <MoneyField
          id="nowc-cash"
          label="Cash"
          tip="Cash and cash equivalents used for ordinary business operations."
          value={input.cash}
          error={errors.cash}
          symbol={symbol}
          onChange={(v) => set({ cash: v })}
        />
        <MoneyField
          id="nowc-ar"
          label="Accounts receivable"
          tip="Amounts owed by customers for credit sales (prefer net carrying value)."
          value={input.accountsReceivable}
          error={errors.accountsReceivable}
          symbol={symbol}
          onChange={(v) => set({ accountsReceivable: v })}
        />
        <MoneyField
          id="nowc-inv"
          label="Inventories"
          tip="Carrying value of goods and materials held for sale or production."
          value={input.inventories}
          error={errors.inventories}
          symbol={symbol}
          onChange={(v) => set({ inventories: v })}
        />
        <ReadOnlyMoney
          id="nowc-coa"
          label="Current operating assets"
          tip="Cash + accounts receivable + inventories."
          value={result?.formattedCurrentOperatingAssets ?? ''}
          symbol={symbol}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Current operating liabilities"
        open={liabOpen}
        onToggle={() => setLiabOpen((o) => !o)}
      >
        <MoneyField
          id="nowc-ap"
          label="Accounts payable"
          tip="Amounts owed to suppliers for goods or services purchased on credit."
          value={input.accountsPayable}
          error={errors.accountsPayable}
          symbol={symbol}
          onChange={(v) => set({ accountsPayable: v })}
        />
        <MoneyField
          id="nowc-ae"
          label="Accrued expenses"
          tip="Operating expenses incurred but not yet paid (exclude interest-bearing debt)."
          value={input.accruedExpenses}
          error={errors.accruedExpenses}
          symbol={symbol}
          onChange={(v) => set({ accruedExpenses: v })}
        />
        <ReadOnlyMoney
          id="nowc-col"
          label="Current operating liabilities"
          tip="Accounts payable + accrued expenses."
          value={result?.formattedCurrentOperatingLiabilities ?? ''}
          symbol={symbol}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Net operating working capital"
        open={nowcOpen}
        onToggle={() => setNowcOpen((o) => !o)}
      >
        <ReadOnlyMoney
          id="nowc-result"
          label="NOWC"
          tip="Current operating assets − current operating liabilities."
          value={result?.formattedNetOperatingWorkingCapital ?? ''}
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
