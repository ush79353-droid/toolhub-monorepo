'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { DcfFieldErrors, DcfInput, DcfMethod, DcfResult } from './types';

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
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  currency: DcfInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: DcfInput['currency']) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
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

function PercentField({
  id,
  label,
  tip,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <input
          id={id}
          className={`${inputClass} pr-8`}
          inputMode="decimal"
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface DcfFormProps {
  input: DcfInput;
  errors: DcfFieldErrors;
  result: DcfResult | null;
  onChange: (input: DcfInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function DcfForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: DcfFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<DcfInput>) => onChange({ ...input, ...patch });
  const isFcff = input.method === 'fcff';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className={`${sectionClass} bg-muted/15`}>
        <legend className="px-1 text-[13px] font-semibold text-accent">DCF method</legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="DCF method">
          {(
            [
              { value: 'fcff', label: 'Free cash flow to firm (FCFF)' },
              { value: 'eps', label: 'Earnings per share (EPS)' },
            ] as const
          ).map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dcf-method"
                className="h-4 w-4 border-border"
                checked={input.method === option.value}
                onChange={() => set({ method: option.value as DcfMethod })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {isFcff ? (
        <fieldset className={sectionClass}>
          <legend className="px-1 text-[13px] font-semibold text-accent">DCF using FCFF</legend>
          <MoneyField
            id="dcf-first-fcff"
            label="First FCFF"
            tip="Free cash flow to firm in year 1."
            value={input.firstFcff}
            error={errors.firstFcff}
            symbol={symbol}
            currency={input.currency}
            onValueChange={(firstFcff) => set({ firstFcff })}
            onCurrencyChange={onCurrencyChange}
          />
          <MoneyField
            id="dcf-second-fcff"
            label="Second FCFF"
            tip="Free cash flow to firm in year 2 (used for terminal value)."
            value={input.secondFcff}
            error={errors.secondFcff}
            symbol={symbol}
            currency={input.currency}
            onValueChange={(secondFcff) => set({ secondFcff })}
            onCurrencyChange={onCurrencyChange}
          />
        </fieldset>
      ) : (
        <fieldset className={sectionClass}>
          <legend className="px-1 text-[13px] font-semibold text-accent">DCF using EPS</legend>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Equity model: EPS is capitalized at cost of equity (not WACC). Earnings are treated as a
            per-share equity earnings proxy, not as free cash flow to the firm.
          </p>
          <MoneyField
            id="dcf-first-eps"
            label="First EPS"
            tip="Earnings per share in year 1."
            value={input.firstEps}
            error={errors.firstEps}
            symbol={symbol}
            currency={input.currency}
            onValueChange={(firstEps) => set({ firstEps })}
            onCurrencyChange={onCurrencyChange}
          />
          <MoneyField
            id="dcf-second-eps"
            label="Second EPS"
            tip="Earnings per share in year 2 (used for terminal value per share)."
            value={input.secondEps}
            error={errors.secondEps}
            symbol={symbol}
            currency={input.currency}
            onValueChange={(secondEps) => set({ secondEps })}
            onCurrencyChange={onCurrencyChange}
          />
        </fieldset>
      )}

      {isFcff ? (
        <fieldset className={sectionClass}>
          <legend className="px-1 text-[13px] font-semibold text-accent">Net debt</legend>
          <MoneyField
            id="dcf-cash"
            label="Cash"
            tip="Cash and cash equivalents subtracted from enterprise value via Equity = EV + Cash − Debt."
            value={input.cash}
            error={errors.cash}
            symbol={symbol}
            currency={input.currency}
            onValueChange={(cash) => set({ cash })}
            onCurrencyChange={onCurrencyChange}
          />
          <MoneyField
            id="dcf-debt"
            label="Outstanding debt"
            tip="Interest-bearing debt used in Equity = EV + Cash − Debt."
            value={input.outstandingDebt}
            error={errors.outstandingDebt}
            symbol={symbol}
            currency={input.currency}
            onValueChange={(outstandingDebt) => set({ outstandingDebt })}
            onCurrencyChange={onCurrencyChange}
          />
        </fieldset>
      ) : null}

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Growth and discount rate
        </legend>
        <PercentField
          id="dcf-growth"
          label="Perpetual growth"
          tip="Long-run growth rate g. Must be below the discount rate."
          value={input.perpetualGrowthPercent}
          error={errors.perpetualGrowthPercent}
          onChange={(perpetualGrowthPercent) => set({ perpetualGrowthPercent })}
        />
        {isFcff ? (
          <PercentField
            id="dcf-wacc"
            label="Weighted average cost of capital (WACC)"
            tip="Firm discount rate. Must be greater than perpetual growth."
            value={input.waccPercent}
            error={errors.waccPercent}
            onChange={(waccPercent) => set({ waccPercent })}
          />
        ) : (
          <PercentField
            id="dcf-cost-equity"
            label="Cost of equity"
            tip="Equity required return used to discount EPS. Must be greater than perpetual growth."
            value={input.costOfEquityPercent}
            error={errors.costOfEquityPercent}
            onChange={(costOfEquityPercent) => set({ costOfEquityPercent })}
          />
        )}
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Shares and its market value
        </legend>
        <div>
          <label className={labelClass} htmlFor="dcf-shares">
            <span>Outstanding shares</span>
            <InfoTooltip
              label="Outstanding shares"
              text="Share count used to convert equity value to per-share value (and the reverse in EPS mode)."
            />
          </label>
          <FieldShell error={errors.outstandingShares}>
            <input
              id="dcf-shares"
              className={inputClass}
              inputMode="decimal"
              value={input.outstandingShares}
              aria-invalid={Boolean(errors.outstandingShares)}
              onChange={(event) => set({ outstandingShares: event.target.value })}
            />
          </FieldShell>
          {errors.outstandingShares ? (
            <p className="mt-1 text-xs text-rose-600">{errors.outstandingShares}</p>
          ) : null}
        </div>
        <MoneyField
          id="dcf-share-price"
          label="Share price"
          tip="Calculated estimated intrinsic share value from the selected DCF model."
          value={result ? result.formattedShareValue : ''}
          symbol={symbol}
          currency={input.currency}
          onCurrencyChange={onCurrencyChange}
          readOnly
        />
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
