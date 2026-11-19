'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MarginAndSalesTaxFieldErrors,
  MarginAndSalesTaxInput,
  MarginAndSalesTaxResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface MarginAndSalesTaxFormProps {
  input: MarginAndSalesTaxInput;
  errors: MarginAndSalesTaxFieldErrors;
  result: MarginAndSalesTaxResult | null;
  onChange: (input: MarginAndSalesTaxInput) => void;
  onMoneyCurrencyChange: (
    field: 'cost' | 'netPrice' | 'grossPrice' | 'profit',
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function MarginAndSalesTaxForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: MarginAndSalesTaxFormProps) {
  const set = (patch: Partial<MarginAndSalesTaxInput>) => {
    onChange({ ...input, ...patch });
  };

  const costSymbol = getCurrencySymbol(input.costCurrency);
  const netSymbol = getCurrencySymbol(input.netPriceCurrency);
  const grossSymbol = getCurrencySymbol(input.grossPriceCurrency);
  const profitSymbol = getCurrencySymbol(input.profitCurrency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="mst-cost">
            <span>Cost</span>
            <InfoTooltip
              label="Cost"
              text="Purchase or production cost before markup. Changing currency converts the typed amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cost}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {costSymbol}
              </span>
              <input
                id="mst-cost"
                className={inputClass}
                inputMode="decimal"
                value={input.cost}
                aria-invalid={Boolean(errors.cost)}
                onChange={(e) => set({ cost: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mst-cost-currency"
                value={input.costCurrency}
                onChange={(next) => onMoneyCurrencyChange('cost', next)}
                aria-label="Cost currency"
              />
            </div>
          </div>
          {errors.cost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cost}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mst-markup">
            <span>Markup</span>
            <InfoTooltip
              label="Markup"
              text="Percent of cost. Net price = Cost × (1 + Markup/100). Zero allowed."
            />
          </label>
          <FieldShell error={errors.markupPercent}>
            <input
              id="mst-markup"
              className={inputClass}
              inputMode="decimal"
              value={input.markupPercent}
              aria-invalid={Boolean(errors.markupPercent)}
              onChange={(e) => set({ markupPercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.markupPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.markupPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mst-net">
            <span>My net price</span>
            <InfoTooltip
              label="My net price"
              text="Pre-tax selling price from cost and markup."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {netSymbol}
              </span>
              <input
                id="mst-net"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedNetPrice ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mst-net-currency"
                value={input.netPriceCurrency}
                onChange={(next) => onMoneyCurrencyChange('netPrice', next)}
                aria-label="Net price currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mst-margin">
            <span>Margin</span>
            <InfoTooltip
              label="Margin"
              text="Profit ÷ net price × 100. Undefined when net price is zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="mst-margin"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedMarginPercent ?? ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="mst-tax">
            <span>Sales tax</span>
            <InfoTooltip
              label="Sales tax"
              text="Percent added to net price for the customer gross price. Not counted as profit. Zero allowed."
            />
          </label>
          <FieldShell error={errors.salesTaxPercent}>
            <input
              id="mst-tax"
              className={inputClass}
              inputMode="decimal"
              value={input.salesTaxPercent}
              aria-invalid={Boolean(errors.salesTaxPercent)}
              onChange={(e) => set({ salesTaxPercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.salesTaxPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.salesTaxPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mst-gross">
            <span>My gross price</span>
            <InfoTooltip
              label="My gross price"
              text="Net price after sales tax: Net × (1 + Sales Tax/100)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {grossSymbol}
              </span>
              <input
                id="mst-gross"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedGrossPrice ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mst-gross-currency"
                value={input.grossPriceCurrency}
                onChange={(next) => onMoneyCurrencyChange('grossPrice', next)}
                aria-label="Gross price currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mst-profit">
            <span>Profit</span>
            <InfoTooltip
              label="Profit"
              text="Net price − cost. Sales tax is excluded from profit."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {profitSymbol}
              </span>
              <input
                id="mst-profit"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedProfit ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mst-profit-currency"
                value={input.profitCurrency}
                onChange={(next) => onMoneyCurrencyChange('profit', next)}
                aria-label="Profit currency"
              />
            </div>
          </div>
        </div>
      </div>

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
