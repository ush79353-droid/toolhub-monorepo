'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FfoConvention,
  FfoFieldErrors,
  FfoInput,
  FfoResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface FfoFormProps {
  input: FfoInput;
  errors: FfoFieldErrors;
  result: FfoResult | null;
  onChange: (input: FfoInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function FfoForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: FfoFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const adjusted = input.convention === 'excludeInterestIncome';

  const set = (patch: Partial<FfoInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for FFO amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Enter only qualifying real estate D&amp;A already
        deducted in net income.
      </p>

      <div>
        <label htmlFor="ffo-convention" className={labelClass}>
          Calculation convention
          <InfoTooltip
            label="Calculation convention"
            text="Standard REIT FFO does not subtract interest income again. The optional adjusted convention deducts interest income once as a custom reference-style adjustment; not a Nareit requirement."
          />
        </label>
        <select
          id="ffo-convention"
          className={selectClass}
          value={input.convention}
          onChange={(e) =>
            set({ convention: e.target.value as FfoConvention })
          }
        >
          <option value="standard">Standard REIT FFO</option>
          <option value="excludeInterestIncome">
            Adjusted FFO excluding interest income
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="ffo-ni" className={labelClass}>
          Net income
          <InfoTooltip
            label="Net income"
            text="Earnings after recognized expenses and applicable income taxes for the period. May already include gains, losses, D&A, and interest income."
          />
        </label>
        <FieldShell error={errors.netIncome}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ffo-ni"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.netIncome}
            onChange={(e) => set({ netIncome: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.netIncome)}
          />
        </FieldShell>
        {errors.netIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ffo-da" className={labelClass}>
          Depreciation and amortization
          <InfoTooltip
            label="Depreciation and amortization"
            text="Qualifying real estate D&A already deducted in net income. Do not include unrelated non-real-estate depreciation or add the same amount twice."
          />
        </label>
        <FieldShell error={errors.depreciationAmortization}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ffo-da"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.depreciationAmortization}
            onChange={(e) => set({ depreciationAmortization: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.depreciationAmortization)}
          />
        </FieldShell>
        {errors.depreciationAmortization ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.depreciationAmortization}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ffo-gains" className={labelClass}>
          Gains from property sales
          <InfoTooltip
            label="Gains from property sales"
            text="Qualifying accounting gains already in net income from selling real estate; not total sale proceeds. Subtracted in FFO."
          />
        </label>
        <FieldShell error={errors.gainsFromPropertySales}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ffo-gains"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.gainsFromPropertySales}
            onChange={(e) => set({ gainsFromPropertySales: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.gainsFromPropertySales)}
          />
        </FieldShell>
        {errors.gainsFromPropertySales ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.gainsFromPropertySales}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ffo-losses" className={labelClass}>
          Losses from property sales
          <InfoTooltip
            label="Losses from property sales"
            text="Qualifying accounting losses already in net income from selling real estate; not total cost or proceeds. Added back in FFO."
          />
        </label>
        <FieldShell error={errors.lossesFromPropertySales}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ffo-losses"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.lossesFromPropertySales}
            onChange={(e) => set({ lossesFromPropertySales: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.lossesFromPropertySales)}
          />
        </FieldShell>
        {errors.lossesFromPropertySales ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.lossesFromPropertySales}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ffo-interest" className={labelClass}>
          Interest income
          <InfoTooltip
            label="Interest income"
            text="Interest from interest-bearing investments. Under standard REIT FFO it stays in net income and is not subtracted again. Required only for the optional adjusted convention."
          />
        </label>
        <FieldShell error={errors.interestIncome}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ffo-interest"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.interestIncome}
            onChange={(e) => set({ interestIncome: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.interestIncome)}
          />
        </FieldShell>
        {errors.interestIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.interestIncome}</p>
        ) : null}
        {!adjusted ? (
          <p className="mt-1 text-xs text-muted-foreground">
 Optional in standard mode; does not change standard FFO.
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Required for the adjusted convention (subtracted once).
          </p>
        )}
      </div>

      <div>
        <label htmlFor="ffo-result" className={labelClass}>
          {result?.resultLabel ?? 'Funds from operations (FFO)'}
          <InfoTooltip
            label="Funds from operations"
            text="Standard: NI + D&A − Gains + Losses. Adjusted (optional): also subtract interest income once."
          />
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ffo-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={result?.formattedDisplayedFfo ?? ''}
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>
    </form>
  );
}
