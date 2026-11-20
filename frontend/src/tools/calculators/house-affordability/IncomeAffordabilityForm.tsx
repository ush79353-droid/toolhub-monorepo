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
  DtiProfile,
  IncomeBasedInput,
  IncomeFieldErrors,
} from './types';

interface IncomeAffordabilityFormProps {
  input: IncomeBasedInput;
  errors: IncomeFieldErrors;
  stale: boolean;
  onChange: (next: IncomeBasedInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function IncomeAffordabilityForm({
  input,
  errors,
  stale,
  onChange,
  onCalculate,
  onClear,
}: IncomeAffordabilityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<IncomeBasedInput>) =>
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
          House Affordability Calculator
        </h3>
        <div className="w-[110px]">
          <CurrencySelect
            id="ha-income-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label="Display currency"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Estimate a maximum house price from household income and debt-to-income
        assumptions. Results are estimates — not mortgage preapproval.
      </p>

      <div>
        <label className={labelClass} htmlFor="ha-income">
          <span>Annual household income</span>
          <InfoTooltip
            label="Annual household income"
            text="Combined gross annual income of the household used for the affordability calculation."
          />
        </label>
        <FieldShell error={errors.annualHouseholdIncome}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ha-income"
            className={inputClass}
            inputMode="decimal"
            value={input.annualHouseholdIncome}
            aria-invalid={Boolean(errors.annualHouseholdIncome)}
            onChange={(e) => set({ annualHouseholdIncome: e.target.value })}
          />
        </FieldShell>
        {errors.annualHouseholdIncome ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualHouseholdIncome}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="ha-term">
            <span>Mortgage loan term</span>
          </label>
          <FieldShell error={errors.mortgageTermYears}>
            <input
              id="ha-term"
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
          <label className={labelClass} htmlFor="ha-rate">
            <span>Interest rate</span>
          </label>
          <FieldShell error={errors.annualInterestRate}>
            <input
              id="ha-rate"
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

      <div>
        <label className={labelClass} htmlFor="ha-debt">
          <span>Monthly debt payback</span>
          <InfoTooltip
            label="Monthly debt"
            text="Recurring debts such as auto, student, personal loans, and credit-card minimums — not the new mortgage."
          />
        </label>
        <FieldShell error={errors.monthlyDebtPayments}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ha-debt"
            className={inputClass}
            inputMode="decimal"
            value={input.monthlyDebtPayments}
            aria-invalid={Boolean(errors.monthlyDebtPayments)}
            onChange={(e) => set({ monthlyDebtPayments: e.target.value })}
          />
        </FieldShell>
        {errors.monthlyDebtPayments ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.monthlyDebtPayments}
          </p>
        ) : null}
      </div>

      <MoneyOrPercentField
        id="ha-dp"
        label="Down payment"
        tip="Percent of house price or fixed amount. Percentage mode solves with price."
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

      <MoneyOrPercentField
        id="ha-tax"
        label="Property tax"
        tip="Annual percent of price, annual amount, or monthly amount."
        currency={input.currency}
        mode={input.propertyTaxMode}
        value={input.propertyTax}
        error={errors.propertyTax}
        modes={[...COST_MODES]}
        onModeChange={(m) => set({ propertyTaxMode: m as CostMode })}
        onValueChange={(propertyTax) => set({ propertyTax })}
      />

      <MoneyOrPercentField
        id="ha-hoa"
        label="HOA or co-op fee"
        tip="Homeowners association or co-op dues as %/year, $/year, or $/month."
        currency={input.currency}
        mode={input.hoaMode}
        value={input.hoaFee}
        error={errors.hoaFee}
        modes={[...COST_MODES]}
        onModeChange={(m) => set({ hoaMode: m as CostMode })}
        onValueChange={(hoaFee) => set({ hoaFee })}
      />

      <MoneyOrPercentField
        id="ha-ins"
        label="Insurance"
        tip="Homeowners insurance. Distinct from mortgage insurance (not modeled here)."
        currency={input.currency}
        mode={input.insuranceMode}
        value={input.insurance}
        error={errors.insurance}
        modes={[...COST_MODES]}
        onModeChange={(m) => set({ insuranceMode: m as CostMode })}
        onValueChange={(insurance) => set({ insurance })}
      />

      <div>
        <label className={labelClass} htmlFor="ha-dti">
          <span>Debt-to-income (DTI) ratio</span>
          <InfoTooltip
            label="DTI profile"
            text="Illustrative underwriting assumptions — not a loan qualification decision."
          />
        </label>
        <select
          id="ha-dti"
          className={`${selectClass} w-full`}
          value={input.dtiProfile}
          onChange={(e) =>
            set({ dtiProfile: e.target.value as DtiProfile })
          }
        >
          <option value="conventional">
            Conventional loan – 28/36 guideline
          </option>
          <option value="fha">FHA-style scenario (illustrative 31/43)</option>
          <option value="va">VA-style scenario (illustrative DTI-only)</option>
          <option value="custom">Custom debt-to-income ratio</option>
        </select>
      </div>

      {input.dtiProfile === 'custom' ? (
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="ha-front">
              Maximum front-end DTI
            </label>
            <FieldShell error={errors.customFrontEndDti}>
              <input
                id="ha-front"
                className={inputClass}
                inputMode="decimal"
                value={input.customFrontEndDti}
                aria-invalid={Boolean(errors.customFrontEndDti)}
                onChange={(e) => set({ customFrontEndDti: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                %
              </span>
            </FieldShell>
            {errors.customFrontEndDti ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.customFrontEndDti}
              </p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="ha-back">
              Maximum back-end DTI
            </label>
            <FieldShell error={errors.customBackEndDti}>
              <input
                id="ha-back"
                className={inputClass}
                inputMode="decimal"
                value={input.customBackEndDti}
                aria-invalid={Boolean(errors.customBackEndDti)}
                onChange={(e) => set({ customBackEndDti: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                %
              </span>
            </FieldShell>
            {errors.customBackEndDti ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.customBackEndDti}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

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
