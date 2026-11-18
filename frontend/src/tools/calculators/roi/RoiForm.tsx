'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CONTRIBUTION_FREQUENCY_OPTIONS,
  type AnnualizedFindMode,
  type ContributionFrequency,
  type PeriodUnit,
  type RoiFieldErrors,
  type RoiInput,
  type RoiResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface RoiFormProps {
  input: RoiInput;
  errors: RoiFieldErrors;
  result: RoiResult | null;
  onChange: (input: RoiInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function RoiForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: RoiFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RoiInput>) => onChange({ ...input, ...patch });
  const showContrib = input.contributionFrequency !== 'none';

  const rateDisplay =
    result && input.sourceField === 'returned'
      ? result.formattedRateOfReturnPercent
      : input.rateOfReturnPercent;
  const returnedDisplay =
    result && input.sourceField === 'rate'
      ? result.formattedReturnedAmount
      : input.returnedAmount;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="roi-basic-heading">
        <h3 id="roi-basic-heading" className={sectionTitleClass}>
          Basic ROI
        </h3>

        <div>
          <label htmlFor="roi-period" className={labelClass}>
            Investment period
            <InfoTooltip
              label="Investment period"
              text="Holding length used for the compounded rate ↔ returned amount link."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.periodValue}>
              <input
                id="roi-period"
                className={inputClass}
                inputMode="decimal"
                value={input.periodValue}
                aria-invalid={Boolean(errors.periodValue)}
                onChange={(e) => set({ periodValue: e.target.value })}
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[88px]`}
              value={input.periodUnit}
              aria-label="Investment period unit"
              onChange={(e) => set({ periodUnit: e.target.value as PeriodUnit })}
            >
              <option value="years">yrs</option>
              <option value="months">mos</option>
            </select>
          </div>
          {errors.periodValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.periodValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="roi-initial" className={labelClass}>
            Initial invested amount
            <InfoTooltip
              label="Initial invested amount"
              text="Starting principal. Currency labels amounts only; it does not convert."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialInvestment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="roi-initial"
                className={inputClass}
                inputMode="decimal"
                value={input.initialInvestment}
                aria-invalid={Boolean(errors.initialInvestment)}
                onChange={(e) => set({ initialInvestment: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="roi-initial-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Initial investment currency"
              />
            </div>
          </div>
          {errors.initialInvestment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="roi-contrib-freq" className={labelClass}>
            Periodic contribution
            <InfoTooltip
              label="Periodic contribution"
              text="Optional recurring deposits at the end of each period. Choose None for a single lump sum."
            />
          </label>
          <select
            id="roi-contrib-freq"
            className={`${selectClass} w-full`}
            value={input.contributionFrequency}
            onChange={(e) =>
              set({
                contributionFrequency: e.target.value as ContributionFrequency,
              })
            }
          >
            {CONTRIBUTION_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {showContrib ? (
          <div>
            <label htmlFor="roi-contrib-amount" className={labelClass}>
              Contribution amount
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.contributionAmount}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  {symbol}
                </span>
                <input
                  id="roi-contrib-amount"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.contributionAmount}
                  aria-invalid={Boolean(errors.contributionAmount)}
                  onChange={(e) => set({ contributionAmount: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="roi-contrib-currency"
                  value={input.currency}
                  onChange={onCurrencyChange}
                  aria-label="Contribution currency"
                />
              </div>
            </div>
            {errors.contributionAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.contributionAmount}</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="roi-rate" className={labelClass}>
              Rate of return
              <InfoTooltip
                label="Rate of return"
                text="Annual compounded rate. Editing this updates returned amount; editing returned amount updates this rate."
              />
            </label>
            <FieldShell error={errors.rateOfReturnPercent}>
              <input
                id="roi-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={rateDisplay}
                aria-invalid={Boolean(errors.rateOfReturnPercent)}
                onChange={(e) =>
                  set({
                    rateOfReturnPercent: e.target.value,
                    sourceField: 'rate',
                  })
                }
              />
              <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
                %
              </span>
            </FieldShell>
            {errors.rateOfReturnPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.rateOfReturnPercent}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="roi-returned" className={labelClass}>
              Returned amount
              <InfoTooltip
                label="Returned amount"
                text="Ending value of the investment. Editing this updates the implied annual rate."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.returnedAmount}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  {symbol}
                </span>
                <input
                  id="roi-returned"
                  className={inputClass}
                  inputMode="decimal"
                  value={returnedDisplay}
                  aria-invalid={Boolean(errors.returnedAmount)}
                  onChange={(e) =>
                    set({
                      returnedAmount: e.target.value,
                      sourceField: 'returned',
                    })
                  }
                />
              </FieldShell>
              <div className="w-[96px] shrink-0 sm:w-[110px]">
                <CurrencySelect
                  id="roi-returned-currency"
                  value={input.currency}
                  onChange={onCurrencyChange}
                  aria-label="Returned amount currency"
                />
              </div>
            </div>
            {errors.returnedAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.returnedAmount}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="roi-result" className={labelClass}>
            ROI
            <InfoTooltip
              label="ROI"
              text="(Returned amount − total investment) ÷ total investment × 100. Total investment includes contributions."
            />
          </label>
          <FieldShell muted>
            <input
              id="roi-result"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result?.formattedRoiPercent ?? ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
              %
            </span>
          </FieldShell>
        </div>

        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showTotalGain}
            onChange={(e) => set({ showTotalGain: e.target.checked })}
          />
          Show total gain or loss
        </label>

        {input.showTotalGain ? (
          <div>
            <label htmlFor="roi-gain" className={labelClass}>
              Total gain or loss
            </label>
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="roi-gain"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result?.formattedTotalGainLoss ?? ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        ) : null}
      </section>

      <section className={sectionClass} aria-labelledby="roi-annualized-heading">
        <h3 id="roi-annualized-heading" className={sectionTitleClass}>
          Annualized ROI
        </h3>

        <fieldset>
          <legend className={labelClass}>I want to find...</legend>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ['annualized', 'Annualized ROI'],
                ['time-needed', 'Time needed'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="roi-annualized-mode"
                  className="h-4 w-4 border-border accent-primary"
                  checked={input.annualizedMode === value}
                  onChange={() => set({ annualizedMode: value as AnnualizedFindMode })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {input.annualizedMode === 'annualized' ? (
          <>
            <div>
              <label htmlFor="roi-start" className={labelClass}>
                Start date
              </label>
              <FieldShell error={errors.startDate}>
                <input
                  id="roi-start"
                  type="date"
                  className={inputClass}
                  value={input.startDate}
                  aria-invalid={Boolean(errors.startDate)}
                  onChange={(e) => set({ startDate: e.target.value })}
                />
              </FieldShell>
              {errors.startDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="roi-end" className={labelClass}>
                End date
              </label>
              <FieldShell error={errors.endDate}>
                <input
                  id="roi-end"
                  type="date"
                  className={inputClass}
                  value={input.endDate}
                  aria-invalid={Boolean(errors.endDate)}
                  onChange={(e) => set({ endDate: e.target.value })}
                />
              </FieldShell>
              {errors.endDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.endDate}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="roi-ann" className={labelClass}>
                Annualized ROI
                <InfoTooltip
                  label="Annualized ROI"
                  text="Compound annual growth between start and end dates from initial investment to returned amount. With contributions, uses the same period-compounding rate solved for the cash-flow schedule."
                />
              </label>
              <FieldShell muted>
                <input
                  id="roi-ann"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result?.formattedAnnualizedRoiPercent ?? ''}
                  aria-live="polite"
                />
                <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
                  %
                </span>
              </FieldShell>
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            Time needed mode needs an expanded reference screenshot for its inputs. Send that
            screenshot to unlock this mode without inventing fields.
          </p>
        )}

        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.compareEnabled}
            onChange={(e) => set({ compareEnabled: e.target.checked })}
          />
          Compare with another investment
        </label>

        {input.compareEnabled ? (
          <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            Comparison fields are not documented in the current screenshot. Send the expanded
            comparison UI to add them.
          </p>
        ) : null}
      </section>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
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
