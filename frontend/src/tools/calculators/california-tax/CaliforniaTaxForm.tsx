'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { COUNTY_PROPERTY_TAX_RATES } from './tax-parameters';
import type {
  CaliforniaCounty,
  CaliforniaFilingStatus,
  CaliforniaIncomePeriod,
  CaliforniaPayFrequency,
  CaliforniaTaxFieldErrors,
  CaliforniaTaxInput,
  CaliforniaTaxResult,
  CaliforniaTaxYear,
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

const INCOME_PERIODS: ReadonlyArray<{ value: CaliforniaIncomePeriod; label: string }> = [
  { value: 'year', label: '/year' },
  { value: 'month', label: '/month' },
  { value: 'semimonthly', label: '/semimonthly' },
  { value: 'biweekly', label: '/biweekly' },
  { value: 'week', label: '/week' },
];

const PAY_FREQUENCIES: ReadonlyArray<{ value: CaliforniaPayFrequency; label: string }> = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'semimonthly', label: 'Semimonthly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
];

const FILING_STATUSES: ReadonlyArray<{ value: CaliforniaFilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married filing jointly' },
  { value: 'married-separate', label: 'Married filing separately' },
  { value: 'head-of-household', label: 'Head of household' },
];

const COUNTIES = (
  Object.entries(COUNTY_PROPERTY_TAX_RATES) as Array<
    [CaliforniaCounty, { label: string; ratePercent: number }]
  >
).map(([value, meta]) => ({ value, label: meta.label }));

const RESULT_ROWS: ReadonlyArray<{
  key: keyof Pick<
    CaliforniaTaxResult,
    | 'formattedAnnualAgi'
    | 'formattedFederalIncomeTax'
    | 'formattedCaliforniaIncomeTax'
    | 'formattedPayrollTaxes'
    | 'formattedTotalIncomeAndPayrollTax'
    | 'formattedTakeHomePerPayPeriod'
    | 'formattedEstimatedPropertyTax'
  >;
  label: string;
}> = [
  { key: 'formattedAnnualAgi', label: 'Annualized AGI' },
  { key: 'formattedFederalIncomeTax', label: 'Estimated federal income tax' },
  { key: 'formattedCaliforniaIncomeTax', label: 'Estimated California income tax' },
  { key: 'formattedPayrollTaxes', label: 'Estimated payroll taxes (SS/Medicare/SDI)' },
  { key: 'formattedTotalIncomeAndPayrollTax', label: 'Total income + payroll taxes' },
  { key: 'formattedTakeHomePerPayPeriod', label: 'Take-home per pay period' },
  { key: 'formattedEstimatedPropertyTax', label: 'Estimated annual property tax' },
];

interface CaliforniaTaxFormProps {
  input: CaliforniaTaxInput;
  errors: CaliforniaTaxFieldErrors;
  result: CaliforniaTaxResult | null;
  onChange: (input: CaliforniaTaxInput) => void;
}

export function CaliforniaTaxForm({
  input,
  errors,
  result,
  onChange,
}: CaliforniaTaxFormProps) {
  const set = (patch: Partial<CaliforniaTaxInput>) => onChange({ ...input, ...patch });

  const setCounty = (county: CaliforniaCounty) => {
    set({
      county,
      propertyTaxRate: String(COUNTY_PROPERTY_TAX_RATES[county].ratePercent),
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
            <label className={labelClass} htmlFor="ca-tax-agi">
              <span>Adjusted Gross Income (AGI)</span>
              <InfoTooltip
                label="Adjusted Gross Income (AGI)"
                text="Federal AGI used as a proxy for California AGI when Schedule CA adjustments are not entered. Fixed USD. Choose the period that matches how the amount is stated."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.agi}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="ca-tax-agi"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.agi}
                  aria-invalid={Boolean(errors.agi)}
                  onChange={(e) => set({ agi: e.target.value })}
                />
              </FieldShell>
              <select
                id="ca-tax-income-period"
                className={`${selectClass} w-[8.5rem] shrink-0`}
                value={input.incomePeriod}
                aria-label="Income period"
                onChange={(e) =>
                  set({ incomePeriod: e.target.value as CaliforniaIncomePeriod })
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
            <label className={labelClass} htmlFor="ca-tax-pay-frequency">
              <span>Pay frequency</span>
              <InfoTooltip
                label="Pay frequency"
                text="Used only to translate annual after-tax net into an estimated take-home amount per pay period."
              />
            </label>
            <select
              id="ca-tax-pay-frequency"
              className={selectClass}
              value={input.payFrequency}
              onChange={(e) =>
                set({ payFrequency: e.target.value as CaliforniaPayFrequency })
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
            <label className={labelClass} htmlFor="ca-tax-year">
              <span>Year of income</span>
            </label>
            <select
              id="ca-tax-year"
              className={selectClass}
              value={input.taxYear}
              onChange={(e) =>
                set({ taxYear: Number(e.target.value) as CaliforniaTaxYear })
              }
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="ca-tax-filing-status">
              <span>What is your filing status?</span>
            </label>
            <select
              id="ca-tax-filing-status"
              className={selectClass}
              value={input.filingStatus}
              onChange={(e) =>
                set({ filingStatus: e.target.value as CaliforniaFilingStatus })
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
            <label className={labelClass} htmlFor="ca-tax-dependents">
              <span>Number of additional dependents</span>
              <InfoTooltip
                label="Additional dependents"
                text="Do not count yourself or your spouse. California dependent exemption credit is $475 each (2025). Federal side applies the $500 other dependent credit per dependent (child tax credit age rules are not inferred)."
              />
            </label>
            <FieldShell error={errors.additionalDependents}>
              <input
                id="ca-tax-dependents"
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
            <label className={labelClass} htmlFor="ca-tax-itemized">
              <span>Itemized deductions</span>
              <InfoTooltip
                label="Itemized deductions"
                text="Compared with the federal and California standard deductions; the larger amount is used in each jurisdiction. California itemizing rules can differ from federal Schedule A."
              />
            </label>
            <FieldShell error={errors.itemizedDeductions}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="ca-tax-itemized"
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
            <label className={labelClass} htmlFor="ca-tax-post-tax">
              <span>Post-tax deductions</span>
              <InfoTooltip
                label="Post-tax deductions"
                text="Reductions to take-home pay after tax (for example certain benefits). Not subtracted from taxable income."
              />
            </label>
            <FieldShell error={errors.postTaxDeductions}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="ca-tax-post-tax"
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
            <label className={labelClass} htmlFor="ca-tax-assessed">
              <span>Assessed home value</span>
              <InfoTooltip
                label="Assessed home value"
                text="Use the assessor's taxable assessed value, not purchase price or market value. California Prop 13 assessments often differ from market value."
              />
            </label>
            <FieldShell error={errors.assessedHomeValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="ca-tax-assessed"
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
            <label className={labelClass} htmlFor="ca-tax-county">
              <span>Location</span>
            </label>
            <select
              id="ca-tax-county"
              className={selectClass}
              value={input.county}
              onChange={(e) => setCounty(e.target.value as CaliforniaCounty)}
            >
              {COUNTIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="ca-tax-rate">
              <span>Applied property tax rate</span>
              <InfoTooltip
                label="Applied property tax rate"
                text="Defaults to the BOE 2024–25 county-average statutory rate of assessed value. Edit when you know your tax-rate area rate. Special assessments are not added automatically."
              />
            </label>
            <FieldShell error={errors.propertyTaxRate}>
              <input
                id="ca-tax-rate"
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
