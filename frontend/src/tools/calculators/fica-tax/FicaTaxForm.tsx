'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FicaEmploymentType,
  FicaFieldErrors,
  FicaFilingStatus,
  FicaInput,
  FicaResult,
  FicaTaxYear,
} from './types';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  FILING_STATUS_OPTIONS,
  TAX_YEAR_OPTIONS,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums font-medium text-accent">{value}</dd>
    </div>
  );
}

interface FicaTaxFormProps {
  input: FicaInput;
  errors: FicaFieldErrors;
  result: FicaResult | null;
  dirty: boolean;
  onChange: (input: FicaInput) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function FicaTaxForm({
  input,
  errors,
  result,
  dirty,
  onChange,
  onLoadExample,
  onClear,
  onReset,
}: FicaTaxFormProps) {
  const set = (patch: Partial<FicaInput>) => onChange({ ...input, ...patch });
  const isEmployee = input.employmentType === 'employee-employer';

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        US FICA and self-employment tax estimate for tax years 2025 and 2026. Amounts are fixed USD.
        Filing status affects Additional Medicare Tax liability only — not Social Security or base
        Medicare rates.
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>Employment type</span>
          <InfoTooltip
            label="Employment type"
            text="Employee/Employer shows employee and employer FICA shares on wages. Self-employed applies Schedule SE rates to 92.35% of net self-employment profit."
          />
        </legend>
        <div className="flex flex-wrap gap-4">
          {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="fica-employment-type"
                checked={input.employmentType === opt.value}
                onChange={() => set({ employmentType: opt.value as FicaEmploymentType })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="fica-tax-year">
          <span>Tax year</span>
          <InfoTooltip
            label="Tax year"
            text="Selects the SSA Social Security wage base for that year ($176,100 for 2025; $184,500 for 2026). Medicare and Additional Medicare rates are unchanged."
          />
        </label>
        <select
          id="fica-tax-year"
          className={selectClass}
          value={input.taxYear}
          onChange={(e) => set({ taxYear: Number(e.target.value) as FicaTaxYear })}
        >
          {TAX_YEAR_OPTIONS.map((opt) => (
            <option key={opt.year} value={opt.year}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="fica-filing-status">
          <span>Filing status</span>
          <InfoTooltip
            label="Filing status"
            text="Used for Additional Medicare Tax thresholds on Form 8959: $250,000 MFJ, $125,000 MFS, $200,000 for all other statuses."
          />
        </label>
        <select
          id="fica-filing-status"
          className={selectClass}
          value={input.filingStatus}
          onChange={(e) => set({ filingStatus: e.target.value as FicaFilingStatus })}
        >
          {FILING_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="fica-income">
          <span>Income</span>
          <InfoTooltip
            label="Income"
            text={
              isEmployee
                ? 'FICA wages subject to Social Security and Medicare for the year (covered wages). Fixed USD.'
                : 'Net profit from self-employment before the 92.35% Schedule SE adjustment — not gross revenue unless they are the same. Fixed USD.'
            }
          />
        </label>
        <FieldShell error={errors.income}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="fica-income"
            className={inputClass}
            inputMode="decimal"
            value={input.income}
            aria-invalid={Boolean(errors.income)}
            onChange={(e) => set({ income: e.target.value })}
          />
        </FieldShell>
        {errors.income ? <p className="mt-1 text-xs text-rose-600">{errors.income}</p> : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <h3 className="text-sm font-semibold tracking-tight text-accent">
            {isEmployee ? 'FICA tax breakdown' : 'Self-employment tax breakdown'}
          </h3>

          <p className="text-2xl font-semibold tabular-nums text-primary">
            ${result.formattedTaxpayerTotal}
          </p>
          <p className="text-xs text-muted-foreground">
            {isEmployee ? 'Total employee FICA' : 'Total self-employment tax'}
          </p>

          <dl className="space-y-2 rounded-lg border border-border bg-white p-3">
            {isEmployee ? (
              <>
                <ResultRow
                  label="Employee Social Security (6.2%)"
                  value={`$${result.formattedEmployeeSocialSecurity}`}
                />
                <ResultRow
                  label="Employee Medicare (1.45%)"
                  value={`$${result.formattedEmployeeMedicare}`}
                />
                <ResultRow
                  label="Additional Medicare Tax (0.9%)"
                  value={`$${result.formattedAdditionalMedicare}`}
                />
                <ResultRow
                  label="Employer Social Security (6.2%)"
                  value={`$${result.formattedEmployerSocialSecurity}`}
                />
                <ResultRow
                  label="Employer Medicare (1.45%)"
                  value={`$${result.formattedEmployerMedicare}`}
                />
                <ResultRow
                  label="Total employer FICA"
                  value={`$${result.formattedEmployerTotal}`}
                />
                <ResultRow
                  label="Combined employee + employer"
                  value={`$${result.formattedCombinedTotal}`}
                />
              </>
            ) : (
              <>
                <ResultRow
                  label="Social Security (12.4% of SE earnings)"
                  value={`$${result.formattedSeSocialSecurity}`}
                />
                <ResultRow
                  label="Medicare (2.9% of SE earnings)"
                  value={`$${result.formattedSeMedicare}`}
                />
                <ResultRow
                  label="Additional Medicare Tax (0.9%)"
                  value={`$${result.formattedAdditionalMedicare}`}
                />
                <ResultRow
                  label="Deductible half of regular SE tax"
                  value={`$${result.formattedSeDeductibleHalf}`}
                />
              </>
            )}
            <ResultRow
              label="Effective taxpayer rate"
              value={`${result.formattedEffectiveTaxpayerRate}%`}
            />
            {isEmployee ? (
              <ResultRow
                label="Effective combined rate"
                value={`${result.formattedEffectiveCombinedRate}%`}
              />
            ) : null}
          </dl>

          <p className="text-xs leading-relaxed text-muted-foreground">{result.summaryText}</p>
          <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
            {result.disclosures.map((line) => (
              <li key={line.slice(0, 48)}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
          Example — $100k wages
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-11"
          disabled={!dirty}
          onClick={onClear}
        >
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
