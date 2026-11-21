'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COST_MODES,
  DOWN_PAYMENT_MODES,
  FieldShell,
  MoneyOrPercentField,
  inputClass,
  labelClass,
  selectClass,
} from './field-ui';
import type {
  CostMode,
  DownPaymentMode,
  FixedBudgetFieldErrors,
  FixedBudgetInput,
} from './types';

interface FixedBudgetFormProps {
  input: FixedBudgetInput;
  errors: FixedBudgetFieldErrors;
  stale: boolean;
  onChange: (next: FixedBudgetInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function FixedBudgetForm({
  input,
  errors,
  stale,
  onChange,
  onCalculate,
  onClear,
}: FixedBudgetFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<FixedBudgetInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-accent">
          House affordability based on fixed monthly budgets
        </h3>
        <div className="w-[110px]">
          <CurrencySelect
            id="ha-budget-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label="Display currency"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Estimate affordability from a fixed monthly allocation toward housing
        costs. Independent from the income-based calculator above.
      </p>

      <div>
        <label className={labelClass} htmlFor="ha-budget">
          <span>Budget for house</span>
          <InfoTooltip
            label="Budget for house"
            text="Total monthly housing budget when taxes and fees are included; otherwise treated as the principal-and-interest budget."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.monthlyHousingBudget}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden
            >
              {symbol}
            </span>
            <input
              id="ha-budget"
              className={inputClass}
              inputMode="decimal"
              value={input.monthlyHousingBudget}
              aria-invalid={Boolean(errors.monthlyHousingBudget)}
              onChange={(e) => set({ monthlyHousingBudget: e.target.value })}
            />
          </FieldShell>
          <span className={`${selectClass} flex items-center px-3 text-xs`}>
            per month
          </span>
        </div>
        {errors.monthlyHousingBudget ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.monthlyHousingBudget}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="ha-b-term">
            Mortgage loan term
          </label>
          <FieldShell error={errors.mortgageTermYears}>
            <input
              id="ha-b-term"
              className={inputClass}
              inputMode="decimal"
              value={input.mortgageTermYears}
              aria-invalid={Boolean(errors.mortgageTermYears)}
              onChange={(e) => set({ mortgageTermYears: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              years
            </span>
          </FieldShell>
          {errors.mortgageTermYears ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.mortgageTermYears}
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="ha-b-rate">
            Interest rate
          </label>
          <FieldShell error={errors.annualInterestRate}>
            <input
              id="ha-b-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.annualInterestRate}
              aria-invalid={Boolean(errors.annualInterestRate)}
              onChange={(e) => set({ annualInterestRate: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualInterestRate}
            </p>
          ) : null}
        </div>
      </div>

      <MoneyOrPercentField
        id="ha-b-dp"
        label="Down payment"
        tip="Percent of house price or fixed amount."
        currency={input.currency}
        mode={input.downPaymentMode}
        value={input.downPaymentValue}
        error={errors.downPaymentValue}
        modes={[...DOWN_PAYMENT_MODES]}
        onModeChange={(m) =>
          set({ downPaymentMode: m as DownPaymentMode })
        }
        onValueChange={(downPaymentValue) => set({ downPaymentValue })}
      />

      <label className="flex items-start gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-primary"
          checked={input.includeTaxesAndFees}
          onChange={(e) => set({ includeTaxesAndFees: e.target.checked })}
        />
        <span>
          Include the tax and fees below into the budget
          <span className="mt-0.5 block text-xs text-muted-foreground">
            When unchecked, the budget constrains principal &amp; interest only;
            other ownership costs still appear in results.
          </span>
        </span>
      </label>

      <MoneyOrPercentField
        id="ha-b-tax"
        label="Property tax"
        tip="Annual percent, annual amount, or monthly amount."
        currency={input.currency}
        mode={input.propertyTaxMode}
        value={input.propertyTax}
        error={errors.propertyTax}
        modes={[...COST_MODES]}
        onModeChange={(m) => set({ propertyTaxMode: m as CostMode })}
        onValueChange={(propertyTax) => set({ propertyTax })}
      />

      <MoneyOrPercentField
        id="ha-b-hoa"
        label="HOA or co-op fee"
        tip="Association or co-op dues."
        currency={input.currency}
        mode={input.hoaMode}
        value={input.hoaFee}
        error={errors.hoaFee}
        modes={[...COST_MODES]}
        onModeChange={(m) => set({ hoaMode: m as CostMode })}
        onValueChange={(hoaFee) => set({ hoaFee })}
      />

      <MoneyOrPercentField
        id="ha-b-ins"
        label="Insurance"
        tip="Homeowners insurance estimate."
        currency={input.currency}
        mode={input.insuranceMode}
        value={input.insurance}
        error={errors.insurance}
        modes={[...COST_MODES]}
        onModeChange={(m) => set({ insuranceMode: m as CostMode })}
        onValueChange={(insurance) => set({ insurance })}
      />

      <MoneyOrPercentField
        id="ha-b-maint"
        label="Maintenance cost (repair, utility, etc.)"
        tip="Ownership-expense allowance — not always a lender qualifying debt."
        currency={input.currency}
        mode={input.maintenanceMode}
        value={input.maintenance}
        error={errors.maintenance}
        modes={[...COST_MODES]}
        onModeChange={(m) => set({ maintenanceMode: m as CostMode })}
        onValueChange={(maintenance) => set({ maintenance })}
      />

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {stale ? (
        <p className="text-xs text-amber-800" role="status">
          Inputs changed — click Calculate to refresh results.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-10 rounded-xl px-5 text-xs font-semibold">
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl border-border px-5 text-xs font-semibold text-accent"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
