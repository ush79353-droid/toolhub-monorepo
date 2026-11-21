'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import type {
  CellPhonePlanFieldErrors,
  CellPhonePlanInput,
  CellPhonePlanResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

function MoneyField({
  id,
  label,
  tip,
  symbol,
  value,
  error,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  tip: string;
  symbol: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className={labelClass}>
        <label htmlFor={id}>{label}</label>
        <InfoTooltip label={label} text={tip} align="left" />
      </div>
      <FieldShell error={error}>
        <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ReadOnlyMoney({
  label,
  tip,
  value,
}: {
  label: string;
  tip: string;
  value: string | null;
}) {
  return (
    <div>
      <div className={labelClass}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} align="left" />
      </div>
      <div className="flex h-11 items-center rounded-lg border border-dashed border-border bg-muted/20 px-3 text-sm tabular-nums font-medium text-accent">
        {value ?? '—'}
      </div>
    </div>
  );
}

interface CellPhonePlanFormProps {
  input: CellPhonePlanInput;
  errors: CellPhonePlanFieldErrors;
  result: CellPhonePlanResult | null;
  onChange: (next: CellPhonePlanInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function CellPhonePlanForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: CellPhonePlanFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CellPhonePlanInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Compare buying a phone upfront vs a carrier phone plan while investing the phone price at
          a savings rate (monthly compounding).
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="cpp-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="cpp-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <section
        aria-labelledby="cpp-contract-heading"
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
      >
        <h3 id="cpp-contract-heading" className="text-sm font-semibold text-accent">
          Contract settings
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className={labelClass}>
              <label htmlFor="contract-duration">Contract duration</label>
              <InfoTooltip
                label="Contract duration"
                text="Length of the comparison in whole months (for example 12, 24, or 36)."
                align="left"
              />
            </div>
            <FieldShell error={errors.contractDuration}>
              <input
                id="contract-duration"
                className={inputClass}
                inputMode="numeric"
                placeholder="24"
                value={input.contractDuration}
                aria-invalid={Boolean(errors.contractDuration)}
                onChange={(event) => set({ contractDuration: event.target.value })}
              />
              <span className="pr-3 text-xs text-muted-foreground">months</span>
            </FieldShell>
            {errors.contractDuration ? (
              <p className="mt-1 text-xs text-rose-600">{errors.contractDuration}</p>
            ) : null}
          </div>
          <div>
            <div className={labelClass}>
              <label htmlFor="savings-rate">Interest rate</label>
              <InfoTooltip
                label="Interest rate"
                text="Annual savings/investment rate earned on the phone price when you choose the carrier plan. Not the carrier finance rate. Compounded monthly."
                align="left"
              />
            </div>
            <FieldShell error={errors.annualInterestRate}>
              <input
                id="savings-rate"
                className={inputClass}
                inputMode="decimal"
                placeholder="0"
                value={input.annualInterestRate}
                aria-invalid={Boolean(errors.annualInterestRate)}
                onChange={(event) => set({ annualInterestRate: event.target.value })}
              />
              <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
            </FieldShell>
            {errors.annualInterestRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRate}</p>
            ) : null}
          </div>
        </div>
      </section>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.outrightOpen}
        onToggle={(event) => set({ outrightOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.outrightOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Buying a phone outright</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <MoneyField
            id="phone-price"
            label="Phone price"
            tip="Full retail price paid up front when you buy the phone yourself."
            symbol={symbol}
            value={input.phonePrice}
            error={errors.phonePrice}
            placeholder="Enter phone price"
            onChange={(value) => set({ phonePrice: value })}
          />
          <MoneyField
            id="outright-bill"
            label="Monthly bill"
            tip="Monthly SIM-only or BYOD carrier bill when you already own the phone."
            symbol={symbol}
            value={input.outrightMonthlyBill}
            error={errors.outrightMonthlyBill}
            placeholder="Enter monthly bill"
            onChange={(value) => set({ outrightMonthlyBill: value })}
          />
          <ReadOnlyMoney
            label="Total cost"
            tip="Phone price + monthly bill × contract months."
            value={
              result ? formatMoney(result.outrightTotalCost, result.currency) : null
            }
          />
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.carrierOpen}
        onToggle={(event) => set({ carrierOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.carrierOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>On a carrier phone-buying plan</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <MoneyField
            id="carrier-bill"
            label="Monthly bill"
            tip="Total monthly carrier charge including phone installment and service."
            symbol={symbol}
            value={input.carrierMonthlyBill}
            error={errors.carrierMonthlyBill}
            placeholder="Enter monthly bill"
            onChange={(value) => set({ carrierMonthlyBill: value })}
          />
          <ReadOnlyMoney
            label="Interest from investing"
            tip="Interest earned by investing the phone price and withdrawing the monthly bill difference."
            value={
              result
                ? formatMoney(result.interestEarned, result.currency)
                : null
            }
          />
          <ReadOnlyMoney
            label="Total cost"
            tip="Carrier payments over the contract minus interest earned (when the savings plan is feasible)."
            value={
              result && result.recommendedOption !== 'infeasible'
                ? formatMoney(result.carrierEffectiveTotalCost, result.currency)
                : null
            }
          />
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="cpp-compare-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="cpp-compare-heading" className="text-sm font-semibold text-accent">
            Comparison
          </h3>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Buying outright</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.outrightTotalCost, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Carrier plan (effective)</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.recommendedOption === 'infeasible'
                  ? '—'
                  : formatMoney(result.carrierEffectiveTotalCost, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Interest earned</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.interestEarned, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cost difference</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.recommendedOption === 'infeasible'
                  ? '—'
                  : formatMoney(result.absoluteCostDifference, result.currency)}
              </dd>
            </div>
          </dl>
          <div
            className={`rounded-lg px-3 py-2.5 text-sm ${
              result.recommendedOption === 'infeasible'
                ? 'bg-amber-100 text-amber-950'
                : result.recommendedOption === 'equal'
                  ? 'bg-muted text-accent'
                  : 'bg-emerald-100 text-emerald-950'
            }`}
          >
            <p className="font-semibold">
              {result.recommendedOption === 'carrier'
                ? 'Carrier phone-buying plan is cheaper'
                : result.recommendedOption === 'outright'
                  ? 'Buying outright is cheaper'
                  : result.recommendedOption === 'equal'
                    ? 'Both options cost the same'
                    : 'Savings strategy not feasible'}
            </p>
            <p className="mt-1 text-xs opacity-90">{result.recommendationText}</p>
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter contract settings and both scenarios, then Calculate to compare total costs.
        </p>
      )}
    </form>
  );
}
