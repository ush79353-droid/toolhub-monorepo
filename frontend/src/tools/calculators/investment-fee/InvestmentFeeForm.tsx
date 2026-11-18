'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  InvestmentFeeFieldErrors,
  InvestmentFeeInput,
  InvestmentFeeResult,
} from './types';

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

interface InvestmentFeeFormProps {
  input: InvestmentFeeInput;
  errors: InvestmentFeeFieldErrors;
  result: InvestmentFeeResult | null;
  onChange: (input: InvestmentFeeInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function InvestmentFeeForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: InvestmentFeeFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<InvestmentFeeInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className={`${sectionClass} bg-muted/15`}>
        <legend className="px-1 text-[13px] font-semibold text-accent">Inputs</legend>

        <div>
          <label className={labelClass} htmlFor="ifee-initial">
            <span>Initial investment amount</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialInvestment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="ifee-initial"
                className={inputClass}
                inputMode="decimal"
                value={input.initialInvestment}
                aria-invalid={Boolean(errors.initialInvestment)}
                onChange={(e) => set({ initialInvestment: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ifee-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Currency"
              />
            </div>
          </div>
          {errors.initialInvestment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
          ) : null}
        </div>

        {(
          [
            ['salesLoadPercent', 'Sales load', '%', 'ifee-sales', errors.salesLoadPercent],
            [
              'annualReturnPercent',
              'Annual return',
              '%',
              'ifee-return',
              errors.annualReturnPercent,
            ],
            [
              'annualOperatingFeesPercent',
              'Annual operating fees',
              '%',
              'ifee-op',
              errors.annualOperatingFeesPercent,
            ],
            [
              'durationYears',
              'Investment duration',
              'yrs',
              'ifee-years',
              errors.durationYears,
            ],
            [
              'turnoverCostPercent',
              'Turnover cost',
              '%',
              'ifee-turnover',
              errors.turnoverCostPercent,
            ],
            [
              'redemptionFeesPercent',
              'Redemption fees',
              '%',
              'ifee-redemption',
              errors.redemptionFeesPercent,
            ],
          ] as const
        ).map(([key, label, suffix, id, error]) => (
          <div key={key}>
            <label className={labelClass} htmlFor={id}>
              <span>{label}</span>
              {key === 'salesLoadPercent' ? (
                <InfoTooltip
                  label={label}
                  text="Front-end load charged when buying fund shares."
                />
              ) : null}
              {key === 'turnoverCostPercent' ? (
                <InfoTooltip
                  label={label}
                  text="Transaction costs from fund buying and selling, deducted from grown value."
                />
              ) : null}
            </label>
            <FieldShell error={error}>
              <input
                id={id}
                className={`${inputClass} pr-10`}
                inputMode="decimal"
                value={input[key]}
                aria-invalid={Boolean(error)}
                onChange={(e) => set({ [key]: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                {suffix}
              </span>
            </FieldShell>
            {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
          </div>
        ))}
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>
        {result ? (
          <ul className="space-y-2 text-sm text-accent">
            <li>
              Invested amount:{' '}
              <span className="font-semibold tabular-nums">
                {symbol}
                {result.formattedInvestedAmount}
              </span>
            </li>
            <li>
              Effective return:{' '}
              <span className="font-semibold tabular-nums">
                {result.formattedEffectiveReturn}%
              </span>
            </li>
            <li>
              Fund value before redemption:{' '}
              <span className="font-semibold tabular-nums">
                {symbol}
                {result.formattedFundValueBeforeRedemption}
              </span>
            </li>
            <li>
              Final fund value:{' '}
              <span className="font-semibold tabular-nums">
                {symbol}
                {result.formattedFinalFundValue}
              </span>
            </li>
            <li>
              Fund value without fees:{' '}
              <span className="font-semibold tabular-nums">
                {symbol}
                {result.formattedFundValueWithoutFees}
              </span>
            </li>
            <li>
              Total fees:{' '}
              <span className="font-semibold tabular-nums">
                {symbol}
                {result.formattedTotalFees}
              </span>
            </li>
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid inputs to see fee impact results.
          </p>
        )}
        {errors.form ? <p className="mt-2 text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
