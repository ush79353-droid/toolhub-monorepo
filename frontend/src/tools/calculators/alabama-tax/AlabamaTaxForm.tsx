'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AlabamaFilingStatus,
  AlabamaIncomePeriod,
  AlabamaJurisdiction,
  AlabamaPayFrequency,
  AlabamaTaxFieldErrors,
  AlabamaTaxInput,
  AlabamaTaxResult,
  AlabamaTaxYear,
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

const INCOME_PERIODS: ReadonlyArray<{ value: AlabamaIncomePeriod; label: string }> = [
  { value: 'year', label: '/year' },
  { value: 'month', label: '/month' },
  { value: 'semimonthly', label: '/semimonthly' },
  { value: 'biweekly', label: '/biweekly' },
  { value: 'week', label: '/week' },
];

const PAY_FREQUENCIES: ReadonlyArray<{ value: AlabamaPayFrequency; label: string }> = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'semimonthly', label: 'Semimonthly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
];

const FILING_STATUSES: ReadonlyArray<{ value: AlabamaFilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married filing jointly' },
  { value: 'married-separate', label: 'Married filing separately' },
  { value: 'head-of-family', label: 'Head of family' },
];

const JURISDICTIONS: ReadonlyArray<{ value: AlabamaJurisdiction; label: string }> = [
  { value: 'bessemer', label: 'Bessemer' },
  { value: 'birmingham', label: 'Birmingham' },
  { value: 'gadsden', label: 'Gadsden' },
  { value: 'macon-county', label: 'Macon County' },
];

const RESULT_ROWS: ReadonlyArray<{
  key: keyof Pick<
    AlabamaTaxResult,
    | 'formattedAnnualAgi'
    | 'formattedTaxableIncome'
    | 'formattedStateIncomeTax'
    | 'formattedLocalOccupationalTax'
    | 'formattedTotalTax'
    | 'formattedAfterTaxIncome'
    | 'formattedNetAfterPostTax'
    | 'formattedTakeHomePerPayPeriod'
  >;
  label: string;
}> = [
  { key: 'formattedAnnualAgi', label: 'Annualized AGI' },
  { key: 'formattedTaxableIncome', label: 'Alabama taxable income' },
  { key: 'formattedStateIncomeTax', label: 'Estimated Alabama income tax' },
  { key: 'formattedLocalOccupationalTax', label: 'Local occupational tax' },
  { key: 'formattedTotalTax', label: 'Total estimated tax' },
  { key: 'formattedAfterTaxIncome', label: 'After-tax income' },
  { key: 'formattedNetAfterPostTax', label: 'Net after post-tax deductions' },
  { key: 'formattedTakeHomePerPayPeriod', label: 'Take-home per pay period' },
];

interface AlabamaTaxFormProps {
  input: AlabamaTaxInput;
  errors: AlabamaTaxFieldErrors;
  result: AlabamaTaxResult | null;
  onChange: (input: AlabamaTaxInput) => void;
}

export function AlabamaTaxForm({
  input,
  errors,
  result,
  onChange,
}: AlabamaTaxFormProps) {
  const set = (patch: Partial<AlabamaTaxInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="al-tax-agi">
            <span>Adjusted Gross Income (AGI)</span>
            <InfoTooltip
              label="Adjusted Gross Income (AGI)"
              text="Enter federal AGI as a proxy for Alabama AGI when Alabama adjustments are not entered. Fixed USD. Choose the period that matches how the amount is stated."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.agi}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="al-tax-agi"
                className={inputClass}
                inputMode="decimal"
                value={input.agi}
                aria-invalid={Boolean(errors.agi)}
                onChange={(e) => set({ agi: e.target.value })}
              />
            </FieldShell>
            <select
              id="al-tax-income-period"
              className={`${selectClass} w-[8.5rem] shrink-0`}
              value={input.incomePeriod}
              aria-label="Income period"
              onChange={(e) =>
                set({ incomePeriod: e.target.value as AlabamaIncomePeriod })
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
          <label className={labelClass} htmlFor="al-tax-pay-frequency">
            <span>Pay frequency</span>
            <InfoTooltip
              label="Pay frequency"
              text="Used only to translate annual after-tax net into an estimated take-home amount per pay period."
            />
          </label>
          <select
            id="al-tax-pay-frequency"
            className={selectClass}
            value={input.payFrequency}
            onChange={(e) =>
              set({ payFrequency: e.target.value as AlabamaPayFrequency })
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
          <label className={labelClass} htmlFor="al-tax-year">
            <span>Year of income</span>
          </label>
          <select
            id="al-tax-year"
            className={selectClass}
            value={input.taxYear}
            onChange={(e) =>
              set({ taxYear: Number(e.target.value) as AlabamaTaxYear })
            }
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="al-tax-filing-status">
            <span>What is your filing status?</span>
          </label>
          <select
            id="al-tax-filing-status"
            className={selectClass}
            value={input.filingStatus}
            onChange={(e) =>
              set({ filingStatus: e.target.value as AlabamaFilingStatus })
            }
          >
            {FILING_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={labelClass}>
            <span>Tax jurisdiction</span>
            <InfoTooltip
              label="Tax jurisdiction"
              text="Local occupational tax applies to wages for work performed in the jurisdiction. Selecting a city does not by itself prove residency or workplace eligibility, this estimate applies the published rate to annualized AGI as an earned-income proxy."
            />
          </legend>
          <div className="mt-1.5 space-y-2">
            {JURISDICTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="al-tax-jurisdiction"
                  className="h-4 w-4 accent-primary"
                  checked={input.jurisdiction === option.value}
                  onChange={() => set({ jurisdiction: option.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="al-tax-dependents">
            <span>Number of add. dependent(s)</span>
            <InfoTooltip
              label="Additional dependents"
              text="Alabama dependent exemption amount phases by income: $1,000 / $500 / $300 per dependent (ADOR Form 40). Do not count yourself or your spouse."
            />
          </label>
          <FieldShell error={errors.additionalDependents}>
            <input
              id="al-tax-dependents"
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
          <label className={labelClass} htmlFor="al-tax-itemized">
            <span>Itemized deductions</span>
            <InfoTooltip
              label="Itemized deductions"
              text="Alabama Schedule A total. Compared with the Form 40 standard deduction chart; the larger amount is used. Alabama itemizing rules differ from federal rules."
            />
          </label>
          <FieldShell error={errors.itemizedDeductions}>
            <input
              id="al-tax-itemized"
              className={inputClass}
              inputMode="decimal"
              value={input.itemizedDeductions}
              aria-invalid={Boolean(errors.itemizedDeductions)}
              onChange={(e) => set({ itemizedDeductions: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
          </FieldShell>
          {errors.itemizedDeductions ? (
            <p className="mt-1 text-xs text-rose-600">{errors.itemizedDeductions}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="al-tax-post-tax">
            <span>Post-tax deductions</span>
            <InfoTooltip
              label="Post-tax deductions"
              text="Reductions to take-home pay after tax (for example certain benefits). Not subtracted from Alabama taxable income."
            />
          </label>
          <FieldShell error={errors.postTaxDeductions}>
            <input
              id="al-tax-post-tax"
              className={inputClass}
              inputMode="decimal"
              value={input.postTaxDeductions}
              aria-invalid={Boolean(errors.postTaxDeductions)}
              onChange={(e) => set({ postTaxDeductions: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
          </FieldShell>
          {errors.postTaxDeductions ? (
            <p className="mt-1 text-xs text-rose-600">{errors.postTaxDeductions}</p>
          ) : null}
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </div>

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
