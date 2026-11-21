'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  areaUnitLabel,
  convertArea,
  convertRentalPeriodDisplay,
  convertRentalRateUnits,
} from './calculation';
import type {
  AreaUnit,
  ExpenseMode,
  NoiFieldErrors,
  NoiInput,
  NoiResult,
  RentalPeriod,
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

function CollapsibleSection({
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
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function formatNumericDisplay(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e8) / 1e8;
  return String(rounded);
}

interface NoiFormProps {
  input: NoiInput;
  errors: NoiFieldErrors;
  result: NoiResult | null;
  onChange: (input: NoiInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function NoiForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: NoiFormProps) {
  const [pgiOpen, setPgiOpen] = useState(true);
  const [egiOpen, setEgiOpen] = useState(true);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [opexOpen, setOpexOpen] = useState(true);

  const symbol = getCurrencySymbol(input.currency);
  const areaLabel = areaUnitLabel(input.areaUnit);

  const set = (patch: Partial<NoiInput>) => {
    onChange({ ...input, ...patch });
  };

  const setAreaUnit = (next: AreaUnit) => {
    if (next === input.areaUnit) return;
    const areaRaw = input.area.trim().replace(/,/g, '');
    const rateRaw = input.rentalRatePerArea.trim().replace(/,/g, '');
    const areaNum = areaRaw === '' ? Number.NaN : Number(areaRaw);
    const rateNum = rateRaw === '' ? Number.NaN : Number(rateRaw);
    set({
      areaUnit: next,
      area: Number.isFinite(areaNum)
        ? formatNumericDisplay(convertArea(areaNum, input.areaUnit, next))
        : input.area,
      rentalRatePerArea: Number.isFinite(rateNum)
        ? formatNumericDisplay(
            convertRentalRateUnits(rateNum, input.areaUnit, next)
          )
        : input.rentalRatePerArea,
    });
  };

  const setRentalPeriod = (next: RentalPeriod) => {
    if (next === input.rentalPeriod) return;
    const rateRaw = input.rentalRatePerArea.trim().replace(/,/g, '');
    const rateNum = rateRaw === '' ? Number.NaN : Number(rateRaw);
    set({
      rentalPeriod: next,
      rentalRatePerArea: Number.isFinite(rateNum)
        ? formatNumericDisplay(
            convertRentalPeriodDisplay(rateNum, input.rentalPeriod, next)
          )
        : input.rentalRatePerArea,
    });
  };

  const setExpenseMode = (next: ExpenseMode) => {
    if (next === input.expenseMode) return;
    set({ expenseMode: next });
    if (next === 'breakdown') setBreakdownOpen(true);
  };

  const moneyField = (
    id: string,
    label: string,
    value: string,
    key: keyof NoiInput,
    error: string | undefined,
    tooltip: string,
    options?: { readOnly?: boolean; display?: string }
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <FieldShell error={error} muted={options?.readOnly}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={options?.readOnly ? (options.display ?? '') : value}
          readOnly={options?.readOnly}
          aria-readonly={options?.readOnly || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={
            options?.readOnly
              ? undefined
              : (e) => set({ [key]: e.target.value } as Partial<NoiInput>)
          }
        />
      </FieldShell>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
 changes the symbol only; it does not convert values. Mortgage
          payments are excluded from NOI.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="noi-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <CollapsibleSection
        title="Potential gross income"
        open={pgiOpen}
        onToggle={() => setPgiOpen((v) => !v)}
      >
        <div>
          <label htmlFor="noi-area" className={labelClass}>
            <span>Area</span>
            <InfoTooltip
              label="Area"
              text="Rentable floor area used with the rental rate per area. Switching units preserves the physical area and adjusts the rental rate so income stays constant."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.area}>
              <input
                id="noi-area"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.area}
                aria-invalid={errors.area ? true : undefined}
                onChange={(e) => set({ area: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.areaUnit}
              aria-label="Area unit"
              onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
            >
              <option value="ft2">ft²</option>
              <option value="m2">m²</option>
            </select>
          </div>
          {errors.area ? (
            <p className="mt-1 text-xs text-rose-600">{errors.area}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="noi-rental-rate" className={labelClass}>
            <span>Rental per area</span>
            <InfoTooltip
              label="Rental per area"
              text={`Rent charged per ${areaLabel}. Choose monthly or annually; monthly rates are annualized (×12) before calculating potential gross income.`}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.rentalRatePerArea}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}/{areaLabel}
              </span>
              <input
                id="noi-rental-rate"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.rentalRatePerArea}
                aria-invalid={errors.rentalRatePerArea ? true : undefined}
                onChange={(e) => set({ rentalRatePerArea: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.rentalPeriod}
              aria-label="Rental period"
              onChange={(e) =>
                setRentalPeriod(e.target.value as RentalPeriod)
              }
            >
              <option value="annually">per year</option>
              <option value="monthly">per month</option>
            </select>
          </div>
          {errors.rentalRatePerArea ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.rentalRatePerArea}
            </p>
          ) : null}
        </div>

        {moneyField(
          'noi-other-income',
          'Other income',
          input.otherIncome,
          'otherIncome',
          errors.otherIncome,
          'Annual recurring non-rent property income such as parking, storage, or laundry. Treated as annual and not reduced by occupancy in this model.'
        )}

        {moneyField(
          'noi-pgi',
          'Potential gross income',
          '',
          'otherIncome',
          undefined,
          'Annual rental income plus other annual income before vacancy loss.',
          {
            readOnly: true,
            display: result?.formattedPotentialGrossIncome ?? '',
          }
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Effective gross income"
        open={egiOpen}
        onToggle={() => setEgiOpen((v) => !v)}
      >
        <div>
          <label htmlFor="noi-occupancy" className={labelClass}>
            <span>Occupancy rate</span>
            <InfoTooltip
              label="Occupancy rate"
              text="Percent of potential rental income expected to be collected under normal occupied conditions. Vacancy rate = 100% − occupancy. Vacancy loss applies to rental income only, not other income."
            />
          </label>
          <FieldShell error={errors.occupancyRate}>
            <input
              id="noi-occupancy"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.occupancyRate}
              aria-invalid={errors.occupancyRate ? true : undefined}
              onChange={(e) => set({ occupancyRate: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.occupancyRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.occupancyRate}</p>
          ) : null}
        </div>

        {moneyField(
          'noi-vacancy-loss',
          'Vacancy loss',
          '',
          'otherIncome',
          undefined,
          'Annual rental income × (1 − occupancy rate / 100). Other income is not reduced.',
          {
            readOnly: true,
            display: result?.formattedVacancyLoss ?? '',
          }
        )}

        {moneyField(
          'noi-egi',
          'Effective gross income',
          '',
          'otherIncome',
          undefined,
          'Potential gross income minus vacancy loss.',
          {
            readOnly: true,
            display: result?.formattedEffectiveGrossIncome ?? '',
          }
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Operating expenses breakdown"
        open={breakdownOpen}
        onToggle={() => setBreakdownOpen((v) => !v)}
      >
        <p className="text-xs text-muted-foreground">
          Optional itemized annual operating costs. Use breakdown mode below to
          drive total expenses from these fields. Do not include mortgage
          principal, interest, depreciation, income taxes, or one-time capital
          improvements.
        </p>
        {moneyField(
          'noi-taxes',
          'Property taxes',
          input.propertyTaxes,
          'propertyTaxes',
          errors.propertyTaxes,
          'Annual property taxes for the building.'
        )}
        {moneyField(
          'noi-insurance',
          'Property insurance',
          input.insurance,
          'insurance',
          errors.insurance,
          'Annual property insurance premiums.'
        )}
        {moneyField(
          'noi-management',
          'Property management fees',
          input.managementFees,
          'managementFees',
          errors.managementFees,
          'Annual property management fees.'
        )}
        {moneyField(
          'noi-maintenance',
          'Repairs and maintenance',
          input.maintenance,
          'maintenance',
          errors.maintenance,
          'Recurring repairs and maintenance (not major capital projects).'
        )}
        {moneyField(
          'noi-utilities',
          'Utilities paid by the owner',
          input.utilities,
          'utilities',
          errors.utilities,
          'Owner-paid utilities for common areas or vacant units.'
        )}
        {moneyField(
          'noi-cleaning',
          'Cleaning and landscaping',
          input.cleaningAndLandscaping,
          'cleaningAndLandscaping',
          errors.cleaningAndLandscaping,
          'Annual cleaning, grounds, and landscaping costs.'
        )}
        {moneyField(
          'noi-admin',
          'Administrative expenses',
          input.administrativeExpenses,
          'administrativeExpenses',
          errors.administrativeExpenses,
          'Office, legal, accounting, and similar operating admin costs.'
        )}
        {moneyField(
          'noi-other-opex',
          'Other operating expenses',
          input.otherOperatingExpenses,
          'otherOperatingExpenses',
          errors.otherOperatingExpenses,
          'Any other recurring operating costs included in NOI.'
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Total operating expenses"
        open={opexOpen}
        onToggle={() => setOpexOpen((v) => !v)}
      >
        <div>
          <span className={labelClass}>Expense source</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`h-10 rounded-lg border px-3 text-xs font-semibold ${
                input.expenseMode === 'manual'
                  ? 'border-primary bg-primary/10 text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
              aria-pressed={input.expenseMode === 'manual'}
              onClick={() => setExpenseMode('manual')}
            >
              Enter total manually
            </button>
            <button
              type="button"
              className={`h-10 rounded-lg border px-3 text-xs font-semibold ${
                input.expenseMode === 'breakdown'
                  ? 'border-primary bg-primary/10 text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
              aria-pressed={input.expenseMode === 'breakdown'}
              onClick={() => setExpenseMode('breakdown')}
            >
              Use expense breakdown
            </button>
          </div>
        </div>

        {input.expenseMode === 'manual'
          ? moneyField(
              'noi-manual-opex',
              'Operating expenses',
              input.manualOperatingExpenses,
              'manualOperatingExpenses',
              errors.manualOperatingExpenses,
              'Total annual operating expenses entered directly. Breakdown fields are ignored in this mode.'
            )
          : moneyField(
              'noi-calc-opex',
              'Operating expenses',
              '',
              'manualOperatingExpenses',
              undefined,
              'Sum of the itemized operating expense breakdown (annual).',
              {
                readOnly: true,
                display: result?.formattedOperatingExpenses ?? '',
              }
            )}
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
