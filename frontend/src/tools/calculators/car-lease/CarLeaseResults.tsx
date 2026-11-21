'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CarLeaseFieldErrors, CarLeaseInput, CarLeaseResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface ResultMoneyRowProps {
  id: string;
  label: string;
  tooltip?: string;
  value: string;
  currency: SupportedCurrency;
  onCurrencyChange: (next: SupportedCurrency) => void;
  currencyLabel: string;
}

function ResultMoneyRow({
  id,
  label,
  tooltip,
  value,
  currency,
  onCurrencyChange,
  currencyLabel,
}: ResultMoneyRowProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tooltip ? <InfoTooltip label={label} text={tooltip} /> : null}
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            readOnly
            value={value}
            tabIndex={0}
            aria-readonly="true"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyLabel}
          />
        </div>
      </div>
    </div>
  );
}

interface CarLeaseResultsProps {
  input: CarLeaseInput;
  result: CarLeaseResult | null;
  errors: CarLeaseFieldErrors;
  onCurrencyChange: (
    field:
      | 'netCapCostCurrency'
      | 'residualValueCurrency'
      | 'monthlyDepreciationCurrency'
      | 'monthlyLeaseFeeCurrency'
      | 'monthlyBasePaymentCurrency'
      | 'monthlySalesTaxCurrency'
      | 'monthlyLeasePaymentCurrency',
    next: SupportedCurrency
  ) => void;
}

export function CarLeaseResults({
  input,
  result,
  errors,
  onCurrencyChange,
}: CarLeaseResultsProps) {
  return (
    <div className="space-y-3.5">
      <ResultMoneyRow
        id="car-lease-net-cap"
        label="Net capitalized cost"
        tooltip="Negotiated price plus financed fees minus down payment, trade-in, and other reductions."
        value={result?.formattedNetCapitalizedCost ?? ''}
        currency={result?.netCapCostCurrency ?? input.netCapCostCurrency}
        onCurrencyChange={(next) => onCurrencyChange('netCapCostCurrency', next)}
        currencyLabel="Net capitalized cost currency"
      />
      <ResultMoneyRow
        id="car-lease-residual"
        label="Residual value"
        tooltip="MSRP × residual factor ÷ 100."
        value={result?.formattedResidualValue ?? ''}
        currency={result?.residualValueCurrency ?? input.residualValueCurrency}
        onCurrencyChange={(next) =>
          onCurrencyChange('residualValueCurrency', next)
        }
        currencyLabel="Residual value currency"
      />
      <ResultMoneyRow
        id="car-lease-dep"
        label="Monthly depreciation fee"
        tooltip="(Net capitalized cost − residual value) ÷ lease months."
        value={result?.formattedMonthlyDepreciation ?? ''}
        currency={
          result?.monthlyDepreciationCurrency ?? input.monthlyDepreciationCurrency
        }
        onCurrencyChange={(next) =>
          onCurrencyChange('monthlyDepreciationCurrency', next)
        }
        currencyLabel="Monthly depreciation currency"
      />
      <ResultMoneyRow
        id="car-lease-fee"
        label="Monthly lease fee"
        tooltip="(Net capitalized cost + residual value) × money factor."
        value={result?.formattedMonthlyLeaseFee ?? ''}
        currency={result?.monthlyLeaseFeeCurrency ?? input.monthlyLeaseFeeCurrency}
        onCurrencyChange={(next) =>
          onCurrencyChange('monthlyLeaseFeeCurrency', next)
        }
        currencyLabel="Monthly lease fee currency"
      />
      <ResultMoneyRow
        id="car-lease-base"
        label="Monthly base payment (pre-tax)"
        tooltip="Monthly depreciation fee + monthly lease fee."
        value={result?.formattedMonthlyBasePayment ?? ''}
        currency={
          result?.monthlyBasePaymentCurrency ?? input.monthlyBasePaymentCurrency
        }
        onCurrencyChange={(next) =>
          onCurrencyChange('monthlyBasePaymentCurrency', next)
        }
        currencyLabel="Monthly base payment currency"
      />
      <ResultMoneyRow
        id="car-lease-tax"
        label="Monthly sales tax"
        tooltip="Monthly base payment × sales tax % ÷ 100."
        value={result?.formattedMonthlySalesTax ?? ''}
        currency={
          result?.monthlySalesTaxCurrency ?? input.monthlySalesTaxCurrency
        }
        onCurrencyChange={(next) =>
          onCurrencyChange('monthlySalesTaxCurrency', next)
        }
        currencyLabel="Monthly sales tax currency"
      />
      <ResultMoneyRow
        id="car-lease-payment"
        label="Monthly lease payment (incl. tax)"
        tooltip="Monthly base payment + monthly sales tax."
        value={result?.formattedMonthlyLeasePayment ?? ''}
        currency={
          result?.monthlyLeasePaymentCurrency ?? input.monthlyLeasePaymentCurrency
        }
        onCurrencyChange={(next) =>
          onCurrencyChange('monthlyLeasePaymentCurrency', next)
        }
        currencyLabel="Monthly lease payment currency"
      />
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Fees are assumed financed into capitalized cost. Sales tax is applied monthly to the
        base payment. Down payment, trade-in, and other reductions are subtracted once when
        building net cap cost.
      </p>
    </div>
  );
}
