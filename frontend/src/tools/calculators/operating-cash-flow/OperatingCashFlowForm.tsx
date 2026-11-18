'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  OperatingCashFlowFieldErrors,
  OperatingCashFlowInput,
  OperatingCashFlowResult,
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

interface MoneyFieldProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  currencyAriaLabel: string;
}

function MoneyInputField({
  id,
  label,
  tooltip,
  value,
  currency,
  error,
  onValueChange,
  onCurrencyChange,
  currencyAriaLabel,
}: MoneyFieldProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyAriaLabel}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface MoneyResultProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  currencyAriaLabel: string;
  note?: ReactNode;
}

function MoneyResultField({
  id,
  label,
  tooltip,
  value,
  currency,
  onCurrencyChange,
  currencyAriaLabel,
  note,
}: MoneyResultProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
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
            className={`${inputClass} text-accent`}
            readOnly
            tabIndex={-1}
            value={value}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyAriaLabel}
          />
        </div>
      </div>
      {note}
    </div>
  );
}

interface OperatingCashFlowFormProps {
  input: OperatingCashFlowInput;
  errors: OperatingCashFlowFieldErrors;
  result: OperatingCashFlowResult | null;
  onChange: (input: OperatingCashFlowInput) => void;
}

export function OperatingCashFlowForm({
  input,
  errors,
  result,
  onChange,
}: OperatingCashFlowFormProps) {
  const set = (patch: Partial<OperatingCashFlowInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <MoneyInputField
        id="ocf-net-income"
        label="Net income"
        tooltip="Net income for the period. Changing currency updates the denomination for this field."
        value={input.netIncome}
        currency={input.netIncomeCurrency}
        error={errors.netIncome}
        onValueChange={(netIncome) => set({ netIncome })}
        onCurrencyChange={(netIncomeCurrency) => set({ netIncomeCurrency })}
        currencyAriaLabel="Net income currency"
      />

      <MoneyInputField
        id="ocf-depreciation"
        label="Depreciation"
        tooltip="Non-cash depreciation expense added back under the indirect method."
        value={input.depreciation}
        currency={input.depreciationCurrency}
        error={errors.depreciation}
        onValueChange={(depreciation) => set({ depreciation })}
        onCurrencyChange={(depreciationCurrency) =>
          set({ depreciationCurrency })
        }
        currencyAriaLabel="Depreciation currency"
      />

      <MoneyInputField
        id="ocf-amortization"
        label="Amortization"
        tooltip="Non-cash amortization expense added back under the indirect method."
        value={input.amortization}
        currency={input.amortizationCurrency}
        error={errors.amortization}
        onValueChange={(amortization) => set({ amortization })}
        onCurrencyChange={(amortizationCurrency) =>
          set({ amortizationCurrency })
        }
        currencyAriaLabel="Amortization currency"
      />

      <MoneyInputField
        id="ocf-inventories"
        label="Change in inventories"
        tooltip="Ending inventory minus beginning inventory. An increase uses cash in the WC adjustment."
        value={input.changeInInventories}
        currency={input.changeInInventoriesCurrency}
        error={errors.changeInInventories}
        onValueChange={(changeInInventories) => set({ changeInInventories })}
        onCurrencyChange={(changeInInventoriesCurrency) =>
          set({ changeInInventoriesCurrency })
        }
        currencyAriaLabel="Change in inventories currency"
      />

      <MoneyInputField
        id="ocf-ar"
        label="Change in accounts receivables"
        tooltip="Ending accounts receivable minus beginning. An increase uses cash in the WC adjustment."
        value={input.changeInAr}
        currency={input.changeInArCurrency}
        error={errors.changeInAr}
        onValueChange={(changeInAr) => set({ changeInAr })}
        onCurrencyChange={(changeInArCurrency) => set({ changeInArCurrency })}
        currencyAriaLabel="Change in accounts receivables currency"
      />

      <MoneyInputField
        id="ocf-ap"
        label="Change in accounts payable"
        tooltip="Ending accounts payable minus beginning. An increase provides cash in the WC adjustment."
        value={input.changeInAp}
        currency={input.changeInApCurrency}
        error={errors.changeInAp}
        onValueChange={(changeInAp) => set({ changeInAp })}
        onCurrencyChange={(changeInApCurrency) => set({ changeInApCurrency })}
        currencyAriaLabel="Change in accounts payable currency"
      />

      <MoneyInputField
        id="ocf-tax-payable"
        label="Income tax payable"
        tooltip="Enter the change in income tax payable (ending − beginning), not an absolute tax-payable balance. An increase provides cash."
        value={input.incomeTaxPayable}
        currency={input.incomeTaxPayableCurrency}
        error={errors.incomeTaxPayable}
        onValueChange={(incomeTaxPayable) => set({ incomeTaxPayable })}
        onCurrencyChange={(incomeTaxPayableCurrency) =>
          set({ incomeTaxPayableCurrency })
        }
        currencyAriaLabel="Income tax payable currency"
      />

      <MoneyInputField
        id="ocf-other"
        label="Net of other cash flows"
        tooltip="Other net operating cash flows included in the indirect-method OCF total."
        value={input.netOtherCashFlows}
        currency={input.netOtherCashFlowsCurrency}
        error={errors.netOtherCashFlows}
        onValueChange={(netOtherCashFlows) => set({ netOtherCashFlows })}
        onCurrencyChange={(netOtherCashFlowsCurrency) =>
          set({ netOtherCashFlowsCurrency })
        }
        currencyAriaLabel="Net of other cash flows currency"
      />

      <MoneyResultField
        id="ocf-wc"
        label="Change in operating working capital"
        tooltip="Working-capital cash adjustment: −ΔInventories − ΔAR + ΔAP + ΔIncome tax payable. This amount is added in the OCF formula."
        value={result?.formattedChangeInOperatingWc ?? ''}
        currency={input.changeInOperatingWcCurrency}
        onCurrencyChange={(changeInOperatingWcCurrency) =>
          set({ changeInOperatingWcCurrency })
        }
        currencyAriaLabel="Change in operating working capital currency"
      />

      <MoneyResultField
        id="ocf-result"
        label="Operating cash flow"
        tooltip="Indirect-method OCF = Net income + Depreciation + Amortization + WC cash adjustment + Net other operating cash flows."
        value={result?.formattedOperatingCashFlow ?? ''}
        currency={input.operatingCashFlowCurrency}
        onCurrencyChange={(operatingCashFlowCurrency) =>
          set({ operatingCashFlowCurrency })
        }
        currencyAriaLabel="Operating cash flow currency"
        note={
          result?.isNegativeOcf ? (
            <p className="mt-1 text-xs text-amber-700">
              Negative operating cash flow: working-capital uses and other items
              outweigh net income plus D&amp;A for this period.
            </p>
          ) : null
        }
      />

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.balanceChangesOpen}
        onToggle={(event) =>
          set({ balanceChangesOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.balanceChangesOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Balance changes</span>
        </summary>
        <div className="border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            No additional verified balance-change fields for this calculator.
            Enter inventory, receivables, payables, and income tax payable
            changes in the fields above.
          </p>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
