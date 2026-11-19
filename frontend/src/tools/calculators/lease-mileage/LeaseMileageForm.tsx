'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DistanceUnit,
  LeaseMileageFieldErrors,
  LeaseMileageInput,
  LeaseMileageResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
  'h-11 w-[4.5rem] shrink-0 rounded-lg border border-border bg-muted/40 px-1.5 text-sm font-medium text-accent';

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

function SectionCard({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
        <span className="text-[13px] font-semibold text-accent">{title}</span>
      </button>
      {open ? <div className="mt-3.5 space-y-3.5">{children}</div> : null}
    </fieldset>
  );
}

interface LeaseMileageFormProps {
  input: LeaseMileageInput;
  errors: LeaseMileageFieldErrors;
  result: LeaseMileageResult | null;
  onChange: (input: LeaseMileageInput) => void;
  onFeeCurrencyChange: (currency: SupportedCurrency) => void;
  onChargeCurrencyChange: (currency: SupportedCurrency) => void;
  onSavingsCurrencyChange: (currency: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function LeaseMileageForm({
  input,
  errors,
  result,
  onChange,
  onFeeCurrencyChange,
  onChargeCurrencyChange,
  onSavingsCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: LeaseMileageFormProps) {
  const set = (patch: Partial<LeaseMileageInput>) => onChange({ ...input, ...patch });
  const feeSymbol = getCurrencySymbol(input.excessFeeCurrency);
  const chargeSymbol = getCurrencySymbol(
    result?.chargeCurrency ?? input.chargeCurrency
  );
  const savingsSymbol = getCurrencySymbol(
    result?.savingsCurrency ?? input.savingsCurrency
  );

  const termRow = (
    id: string,
    label: string,
    tip: string,
    yearsKey: 'totalYears' | 'remainingYears',
    monthsKey: 'totalMonths' | 'remainingMonths',
    error?: string
  ) => (
    <div>
      <label className={labelClass} htmlFor={`${id}-yrs`}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex flex-wrap gap-2">
        <FieldShell error={error}>
          <input
            id={`${id}-yrs`}
            className={inputClass}
            inputMode="numeric"
            placeholder="0"
            value={input[yearsKey]}
            aria-invalid={Boolean(error)}
            onChange={(e) => set({ [yearsKey]: e.target.value })}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            yrs
          </span>
        </FieldShell>
        <FieldShell error={error}>
          <input
            id={`${id}-mos`}
            className={inputClass}
            inputMode="numeric"
            placeholder="0"
            value={input[monthsKey]}
            aria-invalid={Boolean(error)}
            onChange={(e) => set({ [monthsKey]: e.target.value })}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            mos
          </span>
        </FieldShell>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <SectionCard
        title="Lease details"
        open={input.leaseDetailsOpen}
        onToggle={() => set({ leaseDetailsOpen: !input.leaseDetailsOpen })}
      >
        {termRow(
          'lease-total',
          'Total lease term',
          'Full contract length as years + months (converted to months internally).',
          'totalYears',
          'totalMonths',
          errors.totalTerm
        )}
        {termRow(
          'lease-remaining',
          'Remaining lease time',
          'Time left on the lease. Must be greater than zero and less than the total term for a projection.',
          'remainingYears',
          'remainingMonths',
          errors.remainingTerm
        )}

        <div>
          <label className={labelClass} htmlFor="lease-current-distance">
            <span>Current miles driven</span>
            <InfoTooltip
              label="Current miles driven"
              text="Odometer distance driven so far on this lease. Unit selector converts between km and mi (1 mi = 1.609344 km)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentDistance}>
              <input
                id="lease-current-distance"
                className={inputClass}
                inputMode="decimal"
                value={input.currentDistance}
                aria-invalid={Boolean(errors.currentDistance)}
                onChange={(e) => set({ currentDistance: e.target.value })}
              />
            </FieldShell>
            <select
              className={unitClass}
              aria-label="Current distance unit"
              value={input.currentDistanceUnit}
              onChange={(e) =>
                set({ currentDistanceUnit: e.target.value as DistanceUnit })
              }
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
          {errors.currentDistance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentDistance}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-allowance">
            <span>Annual mileage allowance</span>
            <InfoTooltip
              label="Annual mileage allowance"
              text="Contracted allowed distance per year. Converted with the same km/mi factor as current miles."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualAllowance}>
              <input
                id="lease-allowance"
                className={inputClass}
                inputMode="decimal"
                value={input.annualAllowance}
                aria-invalid={Boolean(errors.annualAllowance)}
                onChange={(e) => set({ annualAllowance: e.target.value })}
              />
            </FieldShell>
            <select
              className={unitClass}
              aria-label="Annual allowance unit"
              value={input.annualAllowanceUnit}
              onChange={(e) =>
                set({ annualAllowanceUnit: e.target.value as DistanceUnit })
              }
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
          {errors.annualAllowance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualAllowance}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-excess-fee">
            <span>Excess distance fee</span>
            <InfoTooltip
              label="Excess distance fee"
              text="Charge per excess km or mi. Currency converts with Phase 2 FX; / km vs / mi is normalized before multiplying excess distance."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.excessFee}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {feeSymbol}
              </span>
              <input
                id="lease-excess-fee"
                className={`${inputClass} pl-1`}
                inputMode="decimal"
                value={input.excessFee}
                aria-invalid={Boolean(errors.excessFee)}
                onChange={(e) => set({ excessFee: e.target.value })}
              />
              <div className="w-[5.5rem] shrink-0 border-l border-border pr-1">
                <CurrencySelect
                  id="lease-excess-fee-currency"
                  value={input.excessFeeCurrency}
                  onChange={onFeeCurrencyChange}
                  aria-label="Excess fee currency"
                />
              </div>
            </FieldShell>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span aria-hidden>/</span>
              <select
                className={unitClass}
                aria-label="Excess fee distance unit"
                value={input.excessFeeDistanceUnit}
                onChange={(e) =>
                  set({
                    excessFeeDistanceUnit: e.target.value as DistanceUnit,
                  })
                }
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </div>
          </div>
          {errors.excessFee ? (
            <p className="mt-1 text-xs text-rose-600">{errors.excessFee}</p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title="Results"
        open={input.resultsOpen}
        onToggle={() => set({ resultsOpen: !input.resultsOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="lease-excess-result">
            <span>Predicted excess miles</span>
            <InfoTooltip
              label="Predicted excess miles"
              text="Projected distance over the allowance at lease end, assuming constant historical driving rate."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <input
                id="lease-excess-result"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={
                  result?.availability === 'ok' ? result.formattedExcess : ''
                }
                aria-readonly="true"
              />
            </FieldShell>
            <select
              className={unitClass}
              aria-label="Predicted excess distance unit"
              value={input.excessResultUnit}
              onChange={(e) =>
                set({ excessResultUnit: e.target.value as DistanceUnit })
              }
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-charge-result">
            <span>Predicted lease-end charge</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {chargeSymbol}
              </span>
              <input
                id="lease-charge-result"
                className={`${inputClass} pl-1`}
                readOnly
                tabIndex={-1}
                value={
                  result?.availability === 'ok' ? result.formattedCharge : ''
                }
                aria-readonly="true"
              />
              <div className="w-[5.5rem] shrink-0 border-l border-border pr-1">
                <CurrencySelect
                  id="lease-charge-currency"
                  value={input.chargeCurrency}
                  onChange={onChargeCurrencyChange}
                  aria-label="Lease-end charge currency"
                />
              </div>
            </FieldShell>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-savings-result">
            <span>Monthly savings required</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {savingsSymbol}
              </span>
              <input
                id="lease-savings-result"
                className={`${inputClass} pl-1`}
                readOnly
                tabIndex={-1}
                value={
                  result?.availability === 'ok' ? result.formattedSavings : ''
                }
                aria-readonly="true"
              />
              <div className="w-[5.5rem] shrink-0 border-l border-border pr-1">
                <CurrencySelect
                  id="lease-savings-currency"
                  value={input.savingsCurrency}
                  onChange={onSavingsCurrencyChange}
                  aria-label="Monthly savings currency"
                />
              </div>
            </FieldShell>
            <span className="flex h-11 items-center text-sm text-muted-foreground">
              / mo
            </span>
          </div>
        </div>

        {result?.availability === 'no_elapsed' ? (
          <p className="text-xs text-amber-800" role="status">
            Estimate unavailable: no lease time has elapsed yet (remaining time equals the full
            term). Enter current miles after some months have passed.
          </p>
        ) : null}
        {result?.availability === 'ok' ? (
          <p className="text-xs text-muted-foreground">{result.assumptionNote}</p>
        ) : null}
      </SectionCard>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
