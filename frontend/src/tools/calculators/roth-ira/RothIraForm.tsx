'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { ROTH_RULE_YEAR } from './roth-limits';
import {
  FILING_OPTIONS,
  type RothFilingStatus,
  type RothIraFieldErrors,
  type RothIraInput,
  type RothIraResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface RothIraFormProps {
  input: RothIraInput;
  errors: RothIraFieldErrors;
  result: RothIraResult | null;
  onChange: (input: RothIraInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RothIraForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: RothIraFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RothIraInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter MAGI, ages, filing status, tax rate, and expected return to see{' '}
        {ROTH_RULE_YEAR} Roth contribution limits, eligibility after phase-out,
        and a projected balance at retirement. Currency formats amounts only
        (IRS limits are USD statutory figures).
      </p>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-accent">Currency</span>
          <CurrencySelect
            id="roth-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Currency denomination for Roth IRA amounts"
          />
        </div>

        <div>
          <label htmlFor="roth-magi" className={labelClass}>
            Modified annual gross income (MAGI)
            <InfoTooltip
              label="MAGI"
              text="Modified adjusted gross income used for Roth IRA phase-outs. Compared to IRS USD thresholds; not converted via FX."
            />
          </label>
          <FieldShell error={errors.magi}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="roth-magi"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.magi}
              onChange={(e) => set({ magi: e.target.value })}
              aria-invalid={Boolean(errors.magi)}
            />
          </FieldShell>
          {errors.magi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.magi}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="roth-age" className={labelClass}>
              Current age
            </label>
            <FieldShell error={errors.currentAge}>
              <input
                id="roth-age"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.currentAge}
                onChange={(e) => set({ currentAge: e.target.value })}
                aria-invalid={Boolean(errors.currentAge)}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                years
              </span>
            </FieldShell>
            {errors.currentAge ? (
              <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="roth-retire" className={labelClass}>
              Retirement age
            </label>
            <FieldShell error={errors.retirementAge}>
              <input
                id="roth-retire"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.retirementAge}
                onChange={(e) => set({ retirementAge: e.target.value })}
                aria-invalid={Boolean(errors.retirementAge)}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                years
              </span>
            </FieldShell>
            {errors.retirementAge ? (
              <p className="mt-1 text-xs text-rose-600">{errors.retirementAge}</p>
            ) : null}
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Tax filing</legend>
          <div className="flex flex-col gap-2" role="radiogroup">
            {FILING_OPTIONS.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="roth-filing"
                  checked={input.filingStatus === o.value}
                  onChange={() =>
                    set({ filingStatus: o.value as RothFilingStatus })
                  }
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="roth-tax" className={labelClass}>
              Income tax rate
            </label>
            <FieldShell error={errors.incomeTaxRate}>
              <input
                id="roth-tax"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.incomeTaxRate}
                onChange={(e) => set({ incomeTaxRate: e.target.value })}
                aria-invalid={Boolean(errors.incomeTaxRate)}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.incomeTaxRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.incomeTaxRate}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="roth-return" className={labelClass}>
              Annual return rate
            </label>
            <FieldShell error={errors.annualReturn}>
              <input
                id="roth-return"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.annualReturn}
                onChange={(e) => set({ annualReturn: e.target.value })}
                aria-invalid={Boolean(errors.annualReturn)}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.annualReturn ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualReturn}</p>
            ) : null}
          </div>
        </div>
      </div>

      {result && result.phaseOutPercent > 0 && result.phaseOutPercent < 100 ? (
        <p className="text-xs text-amber-800" role="status">
          MAGI is in the {ROTH_RULE_YEAR} phase-out range (~
          {result.phaseOutPercent.toFixed(1)}% through the band).
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
