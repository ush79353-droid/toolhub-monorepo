'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  isFixedVariableMethod,
  type CalculationMethod,
  type CostFunctionFieldErrors,
  type CostFunctionInput,
  type CostFunctionResult,
} from './types';

interface CostFunctionFormProps {
  input: CostFunctionInput;
  errors: CostFunctionFieldErrors;
  result: CostFunctionResult | null;
  incomplete: boolean;
  onChange: (input: CostFunctionInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

const METHOD_OPTIONS: { value: CalculationMethod; label: string }[] = [
  { value: 'fixed-variable', label: 'Use fixed and variable costs' },
  { value: 'two-points', label: 'Find cost function from two point costs' },
];

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip?: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      {tip ? <InfoTooltip label={label} text={tip} /> : null}
    </div>
  );
}

function MoneyField({
  id,
  label,
  tip,
  value,
  symbol,
  currency,
  currencyId,
  error,
  onValueChange,
  onCurrencyChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  symbol: string;
  currency: CostFunctionInput['currency'];
  currencyId: string;
  error?: string;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: CostFunctionInput['currency']) => void;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} tip={tip} />
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} pl-8`}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(event) => onValueChange(event.target.value)}
          />
        </div>
        <div className="w-[120px] shrink-0 sm:w-[130px]">
          <CurrencySelect id={currencyId} value={currency} onChange={onCurrencyChange} />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ResultRow({
  label,
  value,
  tip,
}: {
  label: string;
  value: string;
  tip?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={`cf-out-${label}`} label={label} tip={tip} />
      <input
        id={`cf-out-${label}`}
        className={`${inputClass} bg-muted/30 font-semibold text-accent`}
        readOnly
        value={value}
        aria-live="polite"
      />
    </div>
  );
}

export function CostFunctionForm({
  input,
  errors,
  result,
  incomplete,
  onChange,
  onCurrencyChange,
  onReset,
}: CostFunctionFormProps) {
  const set = (patch: Partial<CostFunctionInput>) => onChange({ ...input, ...patch });
  const symbol = getCurrencySymbol(input.currency);
  const fixedVariable = isFixedVariableMethod(input);
  const showPlaceholder = !result && (incomplete || Object.keys(errors).length === 0);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-accent">Calculation type</legend>
        <div role="radiogroup" aria-label="Calculation type" className="space-y-2">
          {METHOD_OPTIONS.map((option) => {
            const active = input.method === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                  active
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="cf-method"
                  className="accent-[hsl(var(--primary))]"
                  checked={active}
                  value={option.value}
                  onChange={() => set({ method: option.value })}
                />
                <span className="font-medium text-accent">{option.label}</span>
              </label>
            );
          })}
        </div>
        {errors.method ? <p className="mt-1 text-xs text-rose-600">{errors.method}</p> : null}
      </fieldset>

      {fixedVariable ? (
        <div className="space-y-3.5">
          <MoneyField
            id="cf-fixed"
            label="Fixed cost"
            tip="Costs that do not change with output volume in the period (rent, salaried overhead, insurance)."
            value={input.fixedCost}
            symbol={symbol}
            currency={input.currency}
            currencyId="cf-fixed-currency"
            error={errors.fixedCost}
            onValueChange={(fixedCost) => set({ fixedCost })}
            onCurrencyChange={onCurrencyChange}
          />
          <MoneyField
            id="cf-variable"
            label="Variable cost per unit"
            tip="Additional cost incurred for each unit produced or sold."
            value={input.variableCostPerUnit}
            symbol={symbol}
            currency={input.currency}
            currencyId="cf-variable-currency"
            error={errors.variableCostPerUnit}
            onValueChange={(variableCostPerUnit) => set({ variableCostPerUnit })}
            onCurrencyChange={onCurrencyChange}
          />
          <div>
            <FieldLabel
              htmlFor="cf-quantity"
              label="Quantity"
              tip="Number of units for which total cost is calculated."
            />
            <input
              id="cf-quantity"
              className={inputClass}
              inputMode="decimal"
              value={input.quantity}
              aria-invalid={Boolean(errors.quantity)}
              onChange={(event) => set({ quantity: event.target.value })}
            />
            {errors.quantity ? <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p> : null}
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div>
            <FieldLabel
              htmlFor="cf-q1"
              label="Quantity at point 1"
              tip="Output quantity for the first known total-cost observation."
            />
            <input
              id="cf-q1"
              className={inputClass}
              inputMode="decimal"
              value={input.quantity1}
              aria-invalid={Boolean(errors.quantity1)}
              onChange={(event) => set({ quantity1: event.target.value })}
            />
            {errors.quantity1 ? (
              <p className="mt-1 text-xs text-rose-600">{errors.quantity1}</p>
            ) : null}
          </div>
          <MoneyField
            id="cf-c1"
            label="Total cost at point 1"
            tip="Observed total cost at quantity 1."
            value={input.totalCost1}
            symbol={symbol}
            currency={input.currency}
            currencyId="cf-c1-currency"
            error={errors.totalCost1}
            onValueChange={(totalCost1) => set({ totalCost1 })}
            onCurrencyChange={onCurrencyChange}
          />
          <div>
            <FieldLabel
              htmlFor="cf-q2"
              label="Quantity at point 2"
              tip="Output quantity for the second known total-cost observation. Must differ from point 1."
            />
            <input
              id="cf-q2"
              className={inputClass}
              inputMode="decimal"
              value={input.quantity2}
              aria-invalid={Boolean(errors.quantity2)}
              onChange={(event) => set({ quantity2: event.target.value })}
            />
            {errors.quantity2 ? (
              <p className="mt-1 text-xs text-rose-600">{errors.quantity2}</p>
            ) : null}
          </div>
          <MoneyField
            id="cf-c2"
            label="Total cost at point 2"
            tip="Observed total cost at quantity 2."
            value={input.totalCost2}
            symbol={symbol}
            currency={input.currency}
            currencyId="cf-c2-currency"
            error={errors.totalCost2}
            onValueChange={(totalCost2) => set({ totalCost2 })}
            onCurrencyChange={onCurrencyChange}
          />
        </div>
      )}

      <div className="rounded-xl border border-border bg-muted/10 p-4">
        <h3 className="mb-3 text-sm font-semibold text-accent">Results</h3>
        {showPlaceholder ? (
          <p className="text-sm font-medium text-muted-foreground">
            Fill in all the fields to get your results!
          </p>
        ) : result ? (
          <div className="space-y-3">
            {fixedVariable ? (
              <>
                <ResultRow
                  label="Total cost"
                  tip="Fixed cost plus variable cost per unit times quantity."
                  value={`${symbol}${result.formattedTotalCost}`}
                />
                <ResultRow
                  label="Cost function"
                  tip="Linear total-cost equation TC(Q) = fixed + variable × Q."
                  value={result.costFunction}
                />
              </>
            ) : (
              <>
                <ResultRow
                  label="Fixed cost"
                  tip="Intercept of the linear cost function derived from the two points."
                  value={`${symbol}${result.formattedFixedCost}`}
                />
                <ResultRow
                  label="Variable cost per unit"
                  tip="Slope of the linear cost function: (C₂ − C₁) ÷ (Q₂ − Q₁)."
                  value={`${symbol}${result.formattedVariableCost}`}
                />
                <ResultRow
                  label="Cost function"
                  tip="Derived linear equation TC(Q) = fixed + variable × Q."
                  value={result.costFunction}
                />
              </>
            )}
          </div>
        ) : null}
      </div>

      {errors.form || errors.currency ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form ?? errors.currency}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
