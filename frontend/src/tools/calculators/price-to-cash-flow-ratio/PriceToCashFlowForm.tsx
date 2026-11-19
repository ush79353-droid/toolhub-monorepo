'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PriceToCashFlowFieldErrors,
  PriceToCashFlowInput,
  PriceToCashFlowResult,
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

interface PriceToCashFlowFormProps {
  input: PriceToCashFlowInput;
  errors: PriceToCashFlowFieldErrors;
  result: PriceToCashFlowResult | null;
  onChange: (input: PriceToCashFlowInput) => void;
  onCashFlowCurrencyChange: (next: SupportedCurrency) => void;
  onCashFlowPerShareCurrencyChange: (next: SupportedCurrency) => void;
  onPricePerShareCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function PriceToCashFlowForm({
  input,
  errors,
  result,
  onChange,
  onCashFlowCurrencyChange,
  onCashFlowPerShareCurrencyChange,
  onPricePerShareCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: PriceToCashFlowFormProps) {
  const cashSymbol = getCurrencySymbol(input.cashFlowCurrency);
  const cfpsSymbol = getCurrencySymbol(
    result?.cashFlowPerShareCurrency ?? input.cashFlowPerShareCurrency
  );
  const priceSymbol = getCurrencySymbol(input.pricePerShareCurrency);

  const set = (patch: Partial<PriceToCashFlowInput>) => {
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
        open={input.cashFlowPerShareOpen}
        onToggle={(event) =>
          set({ cashFlowPerShareOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.cashFlowPerShareOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Cash flow per share</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="pcf-cash-flow">
              <span>Cash flow</span>
              <InfoTooltip
                label="Cash flow"
                text="Treat as operating cash flow for the same reporting period as shares outstanding. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.cashFlow}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {cashSymbol}
                </span>
                <input
                  id="pcf-cash-flow"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.cashFlow}
                  aria-invalid={Boolean(errors.cashFlow)}
                  onChange={(e) => set({ cashFlow: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="pcf-cash-flow-currency"
                  value={input.cashFlowCurrency}
                  onChange={onCashFlowCurrencyChange}
                  aria-label="Cash flow currency"
                />
              </div>
            </div>
            {errors.cashFlow ? (
              <p className="mt-1 text-xs text-rose-600">{errors.cashFlow}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="pcf-shares">
              <span>Number of shares outstanding</span>
              <InfoTooltip
                label="Shares outstanding"
                text="Share count for the same period as cash flow. Must be greater than zero. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.sharesOutstanding}>
              <input
                id="pcf-shares"
                className={inputClass}
                inputMode="decimal"
                value={input.sharesOutstanding}
                aria-invalid={Boolean(errors.sharesOutstanding)}
                onChange={(e) => set({ sharesOutstanding: e.target.value })}
              />
            </FieldShell>
            {errors.sharesOutstanding ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.sharesOutstanding}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="pcf-cfps">
              <span>Cash flow per share</span>
              <InfoTooltip
                label="Cash flow per share"
                text="Cash flow ÷ shares outstanding. Shown in this display currency. Not entered manually."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {cfpsSymbol}
                </span>
                <input
                  id="pcf-cfps"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedCashFlowPerShare ?? ''}
                  aria-label="Cash flow per share result"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="pcf-cfps-currency"
                  value={input.cashFlowPerShareCurrency}
                  onChange={onCashFlowPerShareCurrencyChange}
                  aria-label="Cash flow per share currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.priceToCashFlowOpen}
        onToggle={(event) =>
          set({ priceToCashFlowOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.priceToCashFlowOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Price to cash flow ratio</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="pcf-price">
              <span>Price per share</span>
              <InfoTooltip
                label="Price per share"
                text="Current market price for one share (same share unit as the share count). Nonnegative. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.pricePerShare}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {priceSymbol}
                </span>
                <input
                  id="pcf-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.pricePerShare}
                  aria-invalid={Boolean(errors.pricePerShare)}
                  onChange={(e) => set({ pricePerShare: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="pcf-price-currency"
                  value={input.pricePerShareCurrency}
                  onChange={onPricePerShareCurrencyChange}
                  aria-label="Price per share currency"
                />
              </div>
            </div>
            {errors.pricePerShare ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.pricePerShare}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="pcf-ratio">
              <span>Price to cash flow ratio</span>
              <InfoTooltip
                label="Price to cash flow ratio"
                text="Price per share ÷ cash flow per share. Dimensionless multiple (×). Never FX-converted. Undefined when cash flow per share is zero."
              />
            </label>
            <FieldShell muted>
              <input
                id="pcf-ratio"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={
                  result?.ratioUndefined
                    ? 'undefined'
                    : (result?.formattedPriceToCashFlowRatio ?? '')
                }
                aria-label="Price to cash flow ratio result"
              />
              <span
                className="shrink-0 pr-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                x
              </span>
            </FieldShell>
            {result?.negativeRatioNote ? (
              <p className="mt-1 text-xs text-amber-700">
                {result.negativeRatioNote}
              </p>
            ) : null}
            {result?.ratioUndefined ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Ratio is undefined when cash flow per share is zero (not
                Infinity).
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
