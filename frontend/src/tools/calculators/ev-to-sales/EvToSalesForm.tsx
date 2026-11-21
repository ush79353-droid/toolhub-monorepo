'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EvToSalesFieldErrors,
  EvToSalesInput,
  EvToSalesResult,
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

function MoneyRow({
  id,
  label,
  tip,
  value,
  currency,
  error,
  muted,
  onValueChange,
  onCurrencyChange,
  currencyAria,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  muted?: boolean;
  onValueChange?: (v: string) => void;
  onCurrencyChange: (c: SupportedCurrency) => void;
  currencyAria: string;
}) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error} muted={muted}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} text-accent`}
            inputMode="decimal"
            readOnly={muted}
            tabIndex={muted ? -1 : undefined}
            value={value}
            aria-invalid={Boolean(error)}
            aria-live={muted ? 'polite' : undefined}
            onChange={
              muted || !onValueChange
                ? undefined
                : (e) => onValueChange(e.target.value)
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyAria}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface EvToSalesFormProps {
  input: EvToSalesInput;
  errors: EvToSalesFieldErrors;
  result: EvToSalesResult | null;
  onChange: (input: EvToSalesInput) => void;
  onCashCurrencyChange: (next: SupportedCurrency) => void;
  onMarketCapCurrencyChange: (next: SupportedCurrency) => void;
  onTotalDebtCurrencyChange: (next: SupportedCurrency) => void;
  onMinorityCurrencyChange: (next: SupportedCurrency) => void;
  onPreferredCurrencyChange: (next: SupportedCurrency) => void;
  onEnterpriseValueCurrencyChange: (next: SupportedCurrency) => void;
  onSalesCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function EvToSalesForm({
  input,
  errors,
  result,
  onChange,
  onCashCurrencyChange,
  onMarketCapCurrencyChange,
  onTotalDebtCurrencyChange,
  onMinorityCurrencyChange,
  onPreferredCurrencyChange,
  onEnterpriseValueCurrencyChange,
  onSalesCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: EvToSalesFormProps) {
  const set = (patch: Partial<EvToSalesInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.enterpriseValueOpen}
        onToggle={(event) =>
          set({ enterpriseValueOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.enterpriseValueOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Enterprise value calculation</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <MoneyRow
            id="evs-cash"
            label="Cash and cash equivalents"
            tip="Liquid cash deducted once when computing enterprise value. Changing currency converts this amount with stored FX rates."
            value={input.cash}
            currency={input.cashCurrency}
            error={errors.cash}
            onValueChange={(v) => set({ cash: v })}
            onCurrencyChange={onCashCurrencyChange}
            currencyAria="Cash currency"
          />
          <MoneyRow
            id="evs-market-cap"
            label="Market capitalization"
            tip="Equity market value. All other money inputs normalize into this currency before EV is calculated."
            value={input.marketCap}
            currency={input.marketCapCurrency}
            error={errors.marketCap}
            onValueChange={(v) => set({ marketCap: v })}
            onCurrencyChange={onMarketCapCurrencyChange}
            currencyAria="Market capitalization currency"
          />
          <MoneyRow
            id="evs-total-debt"
            label="Total debt"
            tip="Interest-bearing debt added to equity value in the EV formula."
            value={input.totalDebt}
            currency={input.totalDebtCurrency}
            error={errors.totalDebt}
            onValueChange={(v) => set({ totalDebt: v })}
            onCurrencyChange={onTotalDebtCurrencyChange}
            currencyAria="Total debt currency"
          />
          <MoneyRow
            id="evs-minority"
            label="Minority interest"
            tip="Non-controlling interest added to EV. Defaults to 0."
            value={input.minorityInterest}
            currency={input.minorityInterestCurrency}
            error={errors.minorityInterest}
            onValueChange={(v) => set({ minorityInterest: v })}
            onCurrencyChange={onMinorityCurrencyChange}
            currencyAria="Minority interest currency"
          />
          <MoneyRow
            id="evs-preferred"
            label="Preferred shares"
            tip="Preferred equity added to EV. Defaults to 0."
            value={input.preferredShares}
            currency={input.preferredSharesCurrency}
            error={errors.preferredShares}
            onValueChange={(v) => set({ preferredShares: v })}
            onCurrencyChange={onPreferredCurrencyChange}
            currencyAria="Preferred shares currency"
          />
          <MoneyRow
            id="evs-ev"
            label="Enterprise value (EV)"
            tip="Market cap + total debt + minority interest + preferred shares − cash, shown in the currency you select."
            value={result?.formattedEnterpriseValue ?? ''}
            currency={input.enterpriseValueCurrency}
            muted
            onCurrencyChange={onEnterpriseValueCurrencyChange}
            currencyAria="Enterprise value currency"
          />
          {result?.negativeEvNote ? (
            <p className="text-xs text-amber-700">{result.negativeEvNote}</p>
          ) : null}
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.salesRatioOpen}
        onToggle={(event) => set({ salesRatioOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.salesRatioOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Sales and EV to sales ratio</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <MoneyRow
            id="evs-sales"
            label="Sales (revenues)"
            tip="Period sales used as the EV/Sales denominator. Must be greater than zero for a defined ratio."
            value={input.sales}
            currency={input.salesCurrency}
            error={errors.sales}
            onValueChange={(v) => set({ sales: v })}
            onCurrencyChange={onSalesCurrencyChange}
            currencyAria="Sales currency"
          />
          <div>
            <label className={labelClass} htmlFor="evs-ratio">
              <span>EV to sales</span>
              <InfoTooltip
                label="EV to sales"
                text="Enterprise value ÷ sales. Dimensionless; no currency selector. Undefined when sales is zero."
              />
            </label>
            <FieldShell muted>
              <input
                id="evs-ratio"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={
                  result?.ratioUndefined
                    ? 'Undefined'
                    : (result?.formattedEvToSales ?? '')
                }
                aria-live="polite"
              />
            </FieldShell>
            {result?.ratioUndefined ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Sales is zero, so EV/Sales is undefined (not Infinity).
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
