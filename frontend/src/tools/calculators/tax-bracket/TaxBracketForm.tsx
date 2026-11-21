'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { FILING_STATUS_LABELS } from './tax-parameters';
import type {
  TaxBracketCalculatorInput,
  TaxBracketCalculatorResult,
  TaxBracketFieldErrors,
  TaxBracketFilingStatus,
  TaxBracketYear,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface TaxBracketFormProps {
  input: TaxBracketCalculatorInput;
  errors: TaxBracketFieldErrors;
  result: TaxBracketCalculatorResult | null;
  onChange: (input: TaxBracketCalculatorInput) => void;
}

export function TaxBracketForm({
  input,
  errors,
  result,
  onChange,
}: TaxBracketFormProps) {
  const set = (patch: Partial<TaxBracketCalculatorInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <label className={labelClass} htmlFor="tax-bracket-year">
            <span>Year</span>
            <InfoTooltip
              label="Year"
              text="Federal tax year. Brackets update from verified IRS revenue procedures for 2024–2026."
            />
          </label>
          <select
            id="tax-bracket-year"
            className={selectClass}
            value={input.taxYear}
            onChange={(e) =>
              set({ taxYear: Number(e.target.value) as TaxBracketYear })
            }
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="tax-bracket-status">
            <span>Filing status</span>
            <InfoTooltip
              label="Filing status"
              text="IRS filing status for the selected year. Qualifying Surviving Spouse uses Married Filing Jointly brackets."
            />
          </label>
          <select
            id="tax-bracket-status"
            className={selectClass}
            value={input.filingStatus}
            onChange={(e) =>
              set({
                filingStatus: e.target.value as TaxBracketFilingStatus,
              })
            }
          >
            {(
              Object.keys(FILING_STATUS_LABELS) as TaxBracketFilingStatus[]
            ).map((key) => (
              <option key={key} value={key}>
                {FILING_STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="tax-bracket-income">
            <span>Total taxable income</span>
            <InfoTooltip
              label="Total taxable income"
              text="Enter income before the Deductions field below. Taxable amount used for brackets = max(0, this amount − deductions). If your figure is already IRS taxable income, leave deductions at 0."
            />
          </label>
          <FieldShell error={errors.totalTaxableIncome}>
            <input
              id="tax-bracket-income"
              className={inputClass}
              inputMode="decimal"
              value={input.totalTaxableIncome}
              aria-invalid={Boolean(errors.totalTaxableIncome)}
              onChange={(e) => set({ totalTaxableIncome: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
          </FieldShell>
          {errors.totalTaxableIncome ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.totalTaxableIncome}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="tax-bracket-deductions">
            <span>Deductions</span>
            <InfoTooltip
              label="Deductions"
              text="Subtracted from the income field before brackets. Default $0. Not a second standard deduction — if income is already taxable, keep this at 0."
            />
          </label>
          <FieldShell error={errors.deductions}>
            <input
              id="tax-bracket-deductions"
              className={inputClass}
              inputMode="decimal"
              value={input.deductions}
              aria-invalid={Boolean(errors.deductions)}
              onChange={(e) => set({ deductions: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
          </FieldShell>
          {errors.deductions ? (
            <p className="mt-1 text-xs text-rose-600">{errors.deductions}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Default $0. Fixed USD — no currency conversion.
            </p>
          )}
        </div>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <p className="text-[13px] font-semibold text-accent">Results</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Taxable income used</dt>
              <dd className="tabular-nums font-medium text-accent">
                ${result.formattedTaxableIncome}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Estimated federal tax</dt>
              <dd className="tabular-nums font-semibold text-accent">
                ${result.formattedEstimatedTax}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Marginal rate</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedMarginalRate}%
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Effective rate</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedEffectiveRate === '—'
                  ? '—'
                  : `${result.formattedEffectiveRate}%`}
              </dd>
            </div>
          </dl>

          {result.slices.length > 0 ? (
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-xs font-semibold text-accent">
                Bracket breakdown
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {result.slices.map((s) => (
                  <li
                    key={`${s.from}-${s.rate}`}
                    className="flex justify-between gap-2 tabular-nums"
                  >
                    <span>
                      {(s.rate * 100).toFixed(0)}% band · $
                      {s.from.toLocaleString('en-US')}
                      {Number.isFinite(s.upTo)
                        ? `–$${s.upTo.toLocaleString('en-US')}`
                        : '+'}
                    </span>
                    <span className="text-accent">
                      ${s.taxInBracket.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {result.sourceNote}. Educational ordinary-income estimate only — not
            a complete Form 1040 liability (no credits, AMT, NIIT, or payroll).
          </p>
        </div>
      ) : null}
    </form>
  );
}
