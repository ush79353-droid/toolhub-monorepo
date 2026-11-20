'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { TEXAS_COUNTY_RATES, type TexasCountySlug } from './counties';
import type {
  TexasFilingStatus,
  TexasIncomePeriod,
  TexasPayFrequency,
  TexasTaxFieldErrors,
  TexasTaxInput,
  TexasTaxResult,
  TexasTaxYear,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

const INCOME_PERIODS: ReadonlyArray<{ value: TexasIncomePeriod; label: string }> = [
  { value: 'year', label: '/year' },
  { value: 'month', label: '/month' },
  { value: 'semimonthly', label: '/semimonthly' },
  { value: 'biweekly', label: '/biweekly' },
  { value: 'week', label: '/week' },
];

const PAY_FREQUENCIES: ReadonlyArray<{ value: TexasPayFrequency; label: string }> = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'semimonthly', label: 'Semimonthly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
];

const FILING_STATUSES: ReadonlyArray<{ value: TexasFilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married filing jointly' },
  { value: 'married-separate', label: 'Married filing separately' },
  { value: 'head-of-household', label: 'Head of household' },
  { value: 'qualifying-surviving-spouse', label: 'Qualifying surviving spouse' },
];

const COUNTIES = TEXAS_COUNTY_RATES.map((c) => ({
  value: c.slug,
  label: c.label,
}));

const RESULT_ROWS: ReadonlyArray<{
  key: keyof Pick<
    TexasTaxResult,
    | 'formattedAnnualAgi'
    | 'formattedFederalIncomeTax'
    | 'formattedTexasStateIncomeTax'
    | 'formattedCombinedIncomeTax'
    | 'formattedIncomeTaxPerPayPeriod'
    | 'formattedAfterIncomeTax'
    | 'formattedEstimatedPropertyTax'
  >;
  label: string;
}> = [
  { key: 'formattedAnnualAgi', label: 'Annualized AGI' },
  { key: 'formattedFederalIncomeTax', label: 'Estimated federal income tax' },
  { key: 'formattedTexasStateIncomeTax', label: 'Texas state income tax' },
  { key: 'formattedCombinedIncomeTax', label: 'Combined income tax' },
  { key: 'formattedIncomeTaxPerPayPeriod', label: 'Income tax per pay period' },
  { key: 'formattedAfterIncomeTax', label: 'After income tax (excl. FICA)' },
  { key: 'formattedEstimatedPropertyTax', label: 'Estimated annual property tax' },
];

interface TexasTaxFormProps {
  input: TexasTaxInput;
  errors: TexasTaxFieldErrors;
  result: TexasTaxResult | null;
  onChange: (input: TexasTaxInput) => void;
}

export function TexasTaxForm({
  input,
  errors,
  result,
  onChange,
}: TexasTaxFormProps) {
  const set = (patch: Partial<TexasTaxInput>) => onChange({ ...input, ...patch });

  const setCounty = (county: TexasCountySlug) => {
    const meta = TEXAS_COUNTY_RATES.find((c) => c.slug === county);
    set({
      county,
      propertyTaxRate: meta ? String(meta.ratePercent) : input.propertyTaxRate,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Payroll taxes
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label className={labelClass} htmlFor="tx-tax-agi">
              <span>Adjusted Gross Income (AGI)</span>
              <InfoTooltip
                label="Adjusted Gross Income (AGI)"
                text="Federal AGI used as the income-tax starting point. Texas has no state income tax on individuals. Fixed USD. Choose the period that matches how the amount is stated."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.agi}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="tx-tax-agi"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.agi}
                  aria-invalid={Boolean(errors.agi)}
                  onChange={(e) => set({ agi: e.target.value })}
                />
              </FieldShell>
              <select
                id="tx-tax-income-period"
                className={`${selectClass} w-[8.5rem] shrink-0`}
                value={input.incomePeriod}
                aria-label="Income period"
                onChange={(e) =>
                  set({ incomePeriod: e.target.value as TexasIncomePeriod })
                }
              >
                {INCOME_PERIODS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.agi ? (
              <p className="mt-1 text-xs text-rose-600">{errors.agi}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-pay-frequency">
              <span>Pay frequency</span>
              <InfoTooltip
                label="Pay frequency"
                text="Used only to translate annual after-tax net and income tax into estimated amounts per pay period."
              />
            </label>
            <select
              id="tx-tax-pay-frequency"
              className={selectClass}
              value={input.payFrequency}
              onChange={(e) =>
                set({ payFrequency: e.target.value as TexasPayFrequency })
              }
            >
              {PAY_FREQUENCIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-year">
              <span>Year of income</span>
            </label>
            <select
              id="tx-tax-year"
              className={selectClass}
              value={input.taxYear}
              onChange={(e) =>
                set({ taxYear: Number(e.target.value) as TexasTaxYear })
              }
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-filing-status">
              <span>What is your filing status?</span>
            </label>
            <select
              id="tx-tax-filing-status"
              className={selectClass}
              value={input.filingStatus}
              onChange={(e) =>
                set({ filingStatus: e.target.value as TexasFilingStatus })
              }
            >
              {FILING_STATUSES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-dependents">
              <span>Number of additional dependents</span>
              <InfoTooltip
                label="Additional dependents"
                text="Do not count yourself or your spouse. Federal side applies the $500 other dependent credit per dependent when rules allow (child tax credit age rules are not inferred)."
              />
            </label>
            <FieldShell error={errors.additionalDependents}>
              <input
                id="tx-tax-dependents"
                className={inputClass}
                inputMode="numeric"
                value={input.additionalDependents}
                aria-invalid={Boolean(errors.additionalDependents)}
                onChange={(e) => set({ additionalDependents: e.target.value })}
              />
              <span
                className="shrink-0 pr-3 text-sm text-muted-foreground"
                aria-hidden
              >
                person(s)
              </span>
            </FieldShell>
            {errors.additionalDependents ? (
              <p className="mt-1 text-xs text-rose-600">{errors.additionalDependents}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-itemized">
              <span>Itemized deductions</span>
              <InfoTooltip
                label="Itemized deductions"
                text="Compared with the federal standard deduction; the larger amount reduces federal taxable income. Texas has no state income tax."
              />
            </label>
            <FieldShell error={errors.itemizedDeductions}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="tx-tax-itemized"
                className={inputClass}
                inputMode="decimal"
                value={input.itemizedDeductions}
                aria-invalid={Boolean(errors.itemizedDeductions)}
                onChange={(e) => set({ itemizedDeductions: e.target.value })}
              />
            </FieldShell>
            {errors.itemizedDeductions ? (
              <p className="mt-1 text-xs text-rose-600">{errors.itemizedDeductions}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-post-tax">
              <span>Post-tax deductions</span>
              <InfoTooltip
                label="Post-tax deductions"
                text="Annual reductions to take-home pay after tax (for example certain benefits). Not subtracted from taxable income."
              />
            </label>
            <FieldShell error={errors.postTaxDeductions}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="tx-tax-post-tax"
                className={inputClass}
                inputMode="decimal"
                value={input.postTaxDeductions}
                aria-invalid={Boolean(errors.postTaxDeductions)}
                onChange={(e) => set({ postTaxDeductions: e.target.value })}
              />
            </FieldShell>
            {errors.postTaxDeductions ? (
              <p className="mt-1 text-xs text-rose-600">{errors.postTaxDeductions}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Property tax
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label className={labelClass} htmlFor="tx-tax-assessed">
              <span>Assessed home value</span>
              <InfoTooltip
                label="Assessed home value"
                text="Enter the taxable property value you want to estimate against—not necessarily purchase price. Texas appraisal districts, exemptions, and taxing units can change actual bills."
              />
            </label>
            <FieldShell error={errors.assessedHomeValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="tx-tax-assessed"
                className={inputClass}
                inputMode="decimal"
                value={input.assessedHomeValue}
                aria-invalid={Boolean(errors.assessedHomeValue)}
                onChange={(e) => set({ assessedHomeValue: e.target.value })}
              />
            </FieldShell>
            {errors.assessedHomeValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.assessedHomeValue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-county">
              <span>In which county do you live?</span>
            </label>
            <select
              id="tx-tax-county"
              className={selectClass}
              value={input.county}
              onChange={(e) => setCounty(e.target.value as TexasCountySlug)}
            >
              {COUNTIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="tx-tax-rate">
              <span>Applied property tax rate</span>
              <InfoTooltip
                label="Applied property tax rate"
                text="Pre-filled from the ACS 2020–2024 county effective rate when you pick a county. Edit when you know your combined local rate."
              />
            </label>
            <FieldShell error={errors.propertyTaxRate}>
              <input
                id="tx-tax-rate"
                className={inputClass}
                inputMode="decimal"
                value={input.propertyTaxRate}
                aria-invalid={Boolean(errors.propertyTaxRate)}
                onChange={(e) => set({ propertyTaxRate: e.target.value })}
              />
              <span
                className="shrink-0 pr-3 text-sm text-muted-foreground"
                aria-hidden
              >
                %
              </span>
            </FieldShell>
            {errors.propertyTaxRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.propertyTaxRate}</p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">
              Pre-filled with the ACS 2020–2024 county effective rate (median tax ÷
              median home value). Applied to your entered home value as a
              market-value proxy—actual Texas appraisal and taxing-unit bills
              differ.
            </p>
          </div>
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <dl>
          {RESULT_ROWS.map((row, index) => {
            const tinted = index % 2 === 1;
            const value = result ? result[row.key] : '';
            return (
              <div
                key={row.key}
                className={`flex items-center justify-between gap-3 px-3.5 py-3 text-sm sm:px-4 ${
                  tinted ? 'bg-muted/25' : 'bg-white'
                }`}
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="tabular-nums font-semibold text-accent">
                  {value ? `$${value}` : '—'}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {result?.disclosures?.length ? (
        <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
          {result.disclosures.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}