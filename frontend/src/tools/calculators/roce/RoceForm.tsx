'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { RoceFieldErrors, RoceInput, RoceResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4';

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

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  currency,
  onValueChange,
  onCurrencyChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  error?: string;
  symbol: string;
  currency: RoceInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: RoceInput['currency']) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <div className="flex gap-2">
        <FieldShell error={error} muted={readOnly}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass}${readOnly ? ' font-semibold' : ''}`}
            inputMode="decimal"
            value={value}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-live={readOnly ? 'polite' : undefined}
            onChange={(event) => onValueChange?.(event.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface RoceFormProps {
  input: RoceInput;
  errors: RoceFieldErrors;
  result: RoceResult | null;
  onChange: (input: RoceInput) => void;
  onReset: () => void;
}

export function RoceForm({ input, errors, result, onChange, onReset }: RoceFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RoceInput>) => onChange({ ...input, ...patch });
  const setCurrency = (currency: RoceInput['currency']) => set({ currency });
  const useAssets = input.method === 'assets';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className={`${sectionClass} bg-muted/15`}>
        <legend className="px-1 text-[13px] font-semibold text-accent">ROCE method</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="roce-method"
              className="h-4 w-4 border-border"
              checked={useAssets}
              onChange={() => set({ method: 'assets' })}
            />
            Calculate ROCE using total assets
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="roce-method"
              className="h-4 w-4 border-border"
              checked={!useAssets}
              onChange={() => set({ method: 'equity' })}
            />
            Calculate ROCE using equity
          </label>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">
          From the income statement
        </legend>
        <MoneyField
          id="roce-ebit"
          label="EBIT"
          tip="Earnings before interest and taxes (operating profit)."
          value={input.ebit}
          error={errors.ebit}
          symbol={symbol}
          currency={input.currency}
          onValueChange={(ebit) => set({ ebit })}
          onCurrencyChange={setCurrency}
        />
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">
          From the balance sheet
        </legend>
        {useAssets ? (
          <>
            <MoneyField
              id="roce-assets"
              label="Total assets"
              value={input.totalAssets}
              error={errors.totalAssets}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(totalAssets) => set({ totalAssets })}
              onCurrencyChange={setCurrency}
            />
            <MoneyField
              id="roce-current-liabilities"
              label="Total current liabilities"
              value={input.currentLiabilities}
              error={errors.currentLiabilities}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(currentLiabilities) => set({ currentLiabilities })}
              onCurrencyChange={setCurrency}
            />
          </>
        ) : (
          <>
            <MoneyField
              id="roce-equity"
              label="Total equity"
              value={input.totalEquity}
              error={errors.totalEquity}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(totalEquity) => set({ totalEquity })}
              onCurrencyChange={setCurrency}
            />
            <MoneyField
              id="roce-ncl"
              label="Non-current liabilities"
              value={input.nonCurrentLiabilities}
              error={errors.nonCurrentLiabilities}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(nonCurrentLiabilities) => set({ nonCurrentLiabilities })}
              onCurrencyChange={setCurrency}
            />
          </>
        )}
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">ROCE</legend>
        <MoneyField
          id="roce-capital"
          label="Capital employed"
          tip={
            useAssets
              ? 'Total assets − current liabilities.'
              : 'Total equity + non-current liabilities.'
          }
          value={result ? result.formattedCapitalEmployed : ''}
          symbol={symbol}
          currency={input.currency}
          onCurrencyChange={setCurrency}
          readOnly
        />
        <div>
          <label className={labelClass} htmlFor="roce-pct">
            <span>Return on capital employed</span>
          </label>
          <FieldShell muted>
            <input
              id="roce-pct"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedRoce : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
