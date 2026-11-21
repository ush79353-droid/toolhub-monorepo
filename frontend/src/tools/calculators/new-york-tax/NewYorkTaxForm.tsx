'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  NewYorkFilingStatus,
  NewYorkIncomePeriod,
  NewYorkPayFrequency,
  NewYorkTaxFieldErrors,
  NewYorkTaxInput,
  NewYorkTaxResult,
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

const INCOME_PERIODS: ReadonlyArray<{ value: NewYorkIncomePeriod; label: string }> = [
  { value: 'year', label: '/year' },
  { value: 'month', label: '/month' },
  { value: 'semimonthly', label: '/semimonthly' },
  { value: 'biweekly', label: '/biweekly' },
  { value: 'week', label: '/week' },
];

const PAY_FREQUENCIES: ReadonlyArray<{ value: NewYorkPayFrequency; label: string }> = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'semimonthly', label: 'Semimonthly' },
  { value: 'monthly', label: 'Monthly' },
];

const FILING_STATUSES: ReadonlyArray<{ value: NewYorkFilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married filing jointly' },
  { value: 'married-separate', label: 'Married filing separately' },
  { value: 'head-of-household', label: 'Head of household' },
  {
    value: 'qualifying-surviving-spouse',
    label: 'Qualifying surviving spouse',
  },
];

const RESULT_ROWS: ReadonlyArray<{
  key: keyof Pick<
    NewYorkTaxResult,
    | 'formattedAnnualAgi'
    | 'formattedFederalIncomeTax'
    | 'formattedNewYorkStateTax'
    | 'formattedNycIncomeTax'
    | 'formattedTotalIncomeTax'
    | 'formattedEffectiveTaxRate'
    | 'formattedTotalTaxPerPayPeriod'
    | 'formattedTakeHomePerPayPeriod'
  >;
  label: string;
  suffix?: string;
  prefix?: string;
}> = [
  { key: 'formattedAnnualAgi', label: 'Annualized AGI' },
  { key: 'formattedFederalIncomeTax', label: 'Estimated federal income tax' },
  { key: 'formattedNewYorkStateTax', label: 'Estimated NY State income tax' },
  { key: 'formattedNycIncomeTax', label: 'Estimated NYC income tax' },
  { key: 'formattedTotalIncomeTax', label: 'Total income taxes' },
  {
    key: 'formattedEffectiveTaxRate',
    label: 'Effective income tax rate',
    suffix: '%',
  },
  { key: 'formattedTotalTaxPerPayPeriod', label: 'Total tax per pay period' },
  { key: 'formattedTakeHomePerPayPeriod', label: 'Take-home per pay period' },
];

interface NewYorkTaxFormProps {
  input: NewYorkTaxInput;
  errors: NewYorkTaxFieldErrors;
  result: NewYorkTaxResult | null;
  onChange: (input: NewYorkTaxInput) => void;
}

export function NewYorkTaxForm({
  input,
  errors,
  result,
  onChange,
}: NewYorkTaxFormProps) {
  const set = (patch: Partial<NewYorkTaxInput>) => onChange({ ...input, ...patch });

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
          Income &amp; deductions
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label className={labelClass} htmlFor="ny-tax-agi">
              <span>Adjusted Gross Income (AGI)</span>
              <InfoTooltip
                label="Adjusted Gross Income (AGI)"
                text="Federal AGI used as a proxy for New York AGI when IT-225 and Schedule B adjustments are not entered. Fixed USD. AGI is not the same as wages."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.agi}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="ny-tax-agi"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.agi}
                  aria-invalid={Boolean(errors.agi)}
                  onChange={(e) => set({ agi: e.target.value })}
                />
              </FieldShell>
              <select
                id="ny-tax-income-period"
                className={`${selectClass} w-[8.5rem] shrink-0`}
                value={input.incomePeriod}
                aria-label="Income period"
                onChange={(e) =>
                  set({ incomePeriod: e.target.value as NewYorkIncomePeriod })
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
            <label className={labelClass} htmlFor="ny-tax-pay-frequency">
              <span>Pay frequency</span>
              <InfoTooltip
                label="Pay frequency"
                text="Used to show estimated total income tax and take-home per pay period after federal, NY State, and NYC taxes."
              />
            </label>
            <select
              id="ny-tax-pay-frequency"
              className={selectClass}
              value={input.payFrequency}
              onChange={(e) =>
                set({ payFrequency: e.target.value as NewYorkPayFrequency })
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
            <label className={labelClass} htmlFor="ny-tax-year">
              <span>Year of income</span>
            </label>
            <select id="ny-tax-year" className={selectClass} value={input.taxYear} disabled>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="ny-tax-filing-status">
              <span>What is your filing status?</span>
            </label>
            <select
              id="ny-tax-filing-status"
              className={selectClass}
              value={input.filingStatus}
              onChange={(e) =>
                set({ filingStatus: e.target.value as NewYorkFilingStatus })
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
            <label className={labelClass} htmlFor="ny-tax-nyc-resident">
              <span>NYC resident</span>
              <InfoTooltip
                label="NYC resident"
                text="NYC income tax applies only when you are a New York City resident. Yonkers and other local taxes are not included."
              />
            </label>
            <select
              id="ny-tax-nyc-resident"
              className={selectClass}
              value={input.nycResident ? 'yes' : 'no'}
              onChange={(e) => set({ nycResident: e.target.value === 'yes' })}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="ny-tax-dependents">
              <span>Number of additional dependents</span>
              <InfoTooltip
                label="Additional dependents"
                text="Do not count yourself or your spouse. New York allows a $1,000 dependent exemption per dependent on Form IT-201."
              />
            </label>
            <FieldShell error={errors.additionalDependents}>
              <input
                id="ny-tax-dependents"
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
            <label className={labelClass} htmlFor="ny-tax-itemized">
              <span>Itemized deductions</span>
              <InfoTooltip
                label="Itemized deductions"
                text="Compared with federal and New York standard deductions; the larger amount is used in each jurisdiction."
              />
            </label>
            <FieldShell error={errors.itemizedDeductions}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="ny-tax-itemized"
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
            <label className={labelClass} htmlFor="ny-tax-post-tax">
              <span>Post-tax deductions</span>
              <InfoTooltip
                label="Post-tax deductions"
                text="Reductions to take-home pay after income tax. Not subtracted from taxable income."
              />
            </label>
            <FieldShell error={errors.postTaxDeductions}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="ny-tax-post-tax"
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

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <dl>
          {RESULT_ROWS.map((row, index) => {
            const tinted = index % 2 === 1;
            const raw = result ? result[row.key] : '';
            const isRate = row.key === 'formattedEffectiveTaxRate';
            const display = raw
              ? isRate
                ? `${raw}%`
                : `$${raw}`
              : '—';
            return (
              <div
                key={row.key}
                className={`flex items-center justify-between gap-3 px-3.5 py-3 text-sm sm:px-4 ${
                  tinted ? 'bg-muted/25' : 'bg-white'
                }`}
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="tabular-nums font-semibold text-accent">{display}</dd>
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