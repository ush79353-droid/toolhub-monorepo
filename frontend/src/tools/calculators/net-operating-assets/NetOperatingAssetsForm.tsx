'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  NetOperatingAssetsFieldErrors,
  NetOperatingAssetsInput,
  NetOperatingAssetsResult,
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
  value,
  symbol,
}: {
  id: string;
  label: string;
  value: string;
  symbol: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
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

interface NetOperatingAssetsFormProps {
  input: NetOperatingAssetsInput;
  errors: NetOperatingAssetsFieldErrors;
  result: NetOperatingAssetsResult | null;
  onChange: (input: NetOperatingAssetsInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function NetOperatingAssetsForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: NetOperatingAssetsFormProps) {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [liabOpen, setLiabOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<NetOperatingAssetsInput>) => {
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
          aria-label="Currency for net operating assets"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Use operating cash (not excess investment cash) when
        measuring operating capital.
      </p>

      <CollapsibleSection
        title="Operating assets"
        open={assetsOpen}
        onToggle={() => setAssetsOpen((o) => !o)}
      >
        <MoneyField
          id="noa-cash"
          label="Cash"
          tip="Cash and cash equivalents included in operating activities."
          value={input.cash}
          error={errors.cash}
          symbol={symbol}
          onChange={(v) => set({ cash: v })}
        />
        <MoneyField
          id="noa-ar"
          label="Accounts receivable"
          tip="Amounts owed by customers for goods or services delivered on credit."
          value={input.accountsReceivable}
          error={errors.accountsReceivable}
          symbol={symbol}
          onChange={(v) => set({ accountsReceivable: v })}
        />
        <MoneyField
          id="noa-inv"
          label="Inventory"
          tip="Carrying value of goods held for sale or materials used in production."
          value={input.inventory}
          error={errors.inventory}
          symbol={symbol}
          onChange={(v) => set({ inventory: v })}
        />
        <MoneyField
          id="noa-pe"
          label="Prepaid expenses"
          tip="Operating expenses paid in advance that benefit future periods."
          value={input.prepaidExpenses}
          error={errors.prepaidExpenses}
          symbol={symbol}
          onChange={(v) => set({ prepaidExpenses: v })}
        />
        <MoneyField
          id="noa-fa"
          label="Fixed assets"
          tip="Long-term tangible assets used in operations (prefer net carrying value)."
          value={input.fixedAssets}
          error={errors.fixedAssets}
          symbol={symbol}
          onChange={(v) => set({ fixedAssets: v })}
        />
        <ReadOnlyMoney
          id="noa-oa"
          label="Operating assets"
          value={result?.formattedOperatingAssets ?? ''}
          symbol={symbol}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Operating liabilities"
        open={liabOpen}
        onToggle={() => setLiabOpen((o) => !o)}
      >
        <MoneyField
          id="noa-ap"
          label="Accounts payable"
          tip="Amounts owed to suppliers for goods or services purchased on credit."
          value={input.accountsPayable}
          error={errors.accountsPayable}
          symbol={symbol}
          onChange={(v) => set({ accountsPayable: v })}
        />
        <MoneyField
          id="noa-aoe"
          label="Accrued operating expenses"
          tip="Operating expenses incurred but not yet paid (exclude interest-bearing debt)."
          value={input.accruedOperatingExpenses}
          error={errors.accruedOperatingExpenses}
          symbol={symbol}
          onChange={(v) => set({ accruedOperatingExpenses: v })}
        />
        <ReadOnlyMoney
          id="noa-ol"
          label="Operating liabilities"
          value={result?.formattedOperatingLiabilities ?? ''}
          symbol={symbol}
        />
      </CollapsibleSection>

      <ReadOnlyMoney
        id="noa-result"
        label="Net operating assets (NOA)"
        value={result?.formattedNetOperatingAssets ?? ''}
        symbol={symbol}
      />

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
