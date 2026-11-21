'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MarriageTaxFieldErrors,
  MarriageTaxInput,
  MarriageTaxResult,
  PreMarriageStatus,
  SpouseInput,
} from './types';

const labelClass = 'mb-1 flex items-center gap-1 text-[12px] font-medium text-accent';
const inputClass =
  'h-10 w-full min-w-0 bg-transparent px-2 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-10 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-10 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function MoneyRow({
  id,
  label,
  tip,
  value,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell>
        <span className="shrink-0 pl-2 font-mono text-xs text-muted-foreground" aria-hidden>
          $
        </span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldShell>
    </div>
  );
}

function SpouseColumn({
  title,
  tone,
  prefix,
  spouse,
  onChange,
}: {
  title: string;
  tone: 'sky' | 'emerald';
  prefix: string;
  spouse: SpouseInput;
  onChange: (next: SpouseInput) => void;
}) {
  const set = (patch: Partial<SpouseInput>) => onChange({ ...spouse, ...patch });
  const toneClass =
    tone === 'sky'
      ? 'border-sky-200/80 bg-sky-50/50'
      : 'border-emerald-200/80 bg-emerald-50/50';

  return (
    <div className={`space-y-3 rounded-xl border p-3 sm:p-3.5 ${toneClass}`}>
      <h3 className="text-sm font-semibold text-accent">{title}</h3>

      <MoneyRow
        id={`${prefix}-salary`}
        label="Salary+Business Income"
        tip="Wages and business income in USD."
        value={spouse.salaryBusiness}
        onChange={(v) => set({ salaryBusiness: v })}
      />
      <MoneyRow
        id={`${prefix}-int`}
        label="Interest+Dividends Income"
        tip="Ordinary interest and nonqualified dividends (USD)."
        value={spouse.interestDividends}
        onChange={(v) => set({ interestDividends: v })}
      />
      <MoneyRow
        id={`${prefix}-rental`}
        label="Rental, Royalty, Passive Income"
        tip="Rental, royalty, and other passive income (USD)."
        value={spouse.rentalPassive}
        onChange={(v) => set({ rentalPassive: v })}
      />
      <MoneyRow
        id={`${prefix}-stcg`}
        label="Short Term Capital Gain"
        tip="Short-term capital gains taxed as ordinary income (USD)."
        value={spouse.shortTermGain}
        onChange={(v) => set({ shortTermGain: v })}
      />
      <MoneyRow
        id={`${prefix}-ltcg`}
        label="Long Term Capital Gain"
        tip="Long-term capital gains (preferential rates) (USD)."
        value={spouse.longTermGain}
        onChange={(v) => set({ longTermGain: v })}
      />
      <MoneyRow
        id={`${prefix}-qd`}
        label="Qualified Dividends"
        tip="Qualified dividends (preferential rates) (USD)."
        value={spouse.qualifiedDividends}
        onChange={(v) => set({ qualifiedDividends: v })}
      />
      <MoneyRow
        id={`${prefix}-ira`}
        label="401K, IRA... Savings"
        tip="Above-the-line retirement contributions reducing AGI (USD)."
        value={spouse.retirementSavings}
        onChange={(v) => set({ retirementSavings: v })}
      />

      <div>
        <label className={labelClass} htmlFor={`${prefix}-status`}>
          File Status (Before Marriage)
        </label>
        <select
          id={`${prefix}-status`}
          className={selectClass}
          value={spouse.fileStatus}
          onChange={(e) =>
            set({ fileStatus: e.target.value as PreMarriageStatus })
          }
        >
          <option value="single">Single</option>
          <option value="head-of-household">Head of household</option>
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor={`${prefix}-deps`}>
          No. of Dependents
        </label>
        <FieldShell>
          <input
            id={`${prefix}-deps`}
            className={inputClass}
            inputMode="numeric"
            value={spouse.dependents}
            onChange={(e) => set({ dependents: e.target.value })}
          />
        </FieldShell>
      </div>

      <fieldset>
        <legend className={labelClass}>Use Standard Deduction?</legend>
        <div className="flex gap-4">
          {(['yes', 'no'] as const).map((v) => (
            <label key={v} className="flex items-center gap-1.5 text-sm text-accent">
              <input
                type="radio"
                name={`${prefix}-std`}
                className="accent-primary"
                checked={spouse.useStandardDeduction === v}
                onChange={() => set({ useStandardDeduction: v })}
              />
              {v}
            </label>
          ))}
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
          Itemized categories (mortgage interest, charity, student loan ≤$2,500, child care ≤$3,000,
 education ≤$4,000) are noted for reference. Dollar itemized inputs are not collected; 
          choosing No uses $0 itemized.
        </p>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor={`${prefix}-state`}>
          State+City Tax Rate
        </label>
        <FieldShell>
          <input
            id={`${prefix}-state`}
            className={inputClass}
            inputMode="decimal"
            value={spouse.stateCityTaxRatePercent}
            onChange={(e) => set({ stateCityTaxRatePercent: e.target.value })}
          />
          <span className="pr-2 text-xs text-muted-foreground">%</span>
        </FieldShell>
      </div>

      <fieldset>
        <legend className={labelClass}>Self-Employed</legend>
        <div className="flex gap-4">
          {(['yes', 'no'] as const).map((v) => (
            <label key={v} className="flex items-center gap-1.5 text-sm text-accent">
              <input
                type="radio"
                name={`${prefix}-se`}
                className="accent-primary"
                checked={spouse.selfEmployed === v}
                onChange={() => set({ selfEmployed: v })}
              />
              {v}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

interface MarriageTaxFormProps {
  input: MarriageTaxInput;
  errors: MarriageTaxFieldErrors;
  result: MarriageTaxResult | null;
  onChange: (input: MarriageTaxInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function MarriageTaxForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: MarriageTaxFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-foreground/90">
        Compares estimated <strong>2026</strong> U.S. tax if each person files under their
        before-marriage status versus married filing jointly. Marital status for the year is
 generally determined on the last day of the tax year. Educational estimate; not tax advice.
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <SpouseColumn
          title="Spouse 1"
          tone="sky"
          prefix="mt-s1"
          spouse={input.spouse1}
          onChange={(spouse1) => onChange({ ...input, spouse1 })}
        />
        <SpouseColumn
          title="Spouse 2"
          tone="emerald"
          prefix="mt-s2"
          spouse={input.spouse2}
          onChange={(spouse2) => onChange({ ...input, spouse2 })}
        />
      </div>

      {errors.spouse1 ? (
        <p className="text-xs text-rose-600">{errors.spouse1}</p>
      ) : null}
      {errors.spouse2 ? (
        <p className="text-xs text-rose-600">{errors.spouse2}</p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:opacity-95"
        >
          Calculate
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-accent hover:bg-muted/30"
        >
          Clear
        </button>
      </div>

      {result ? (
        <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <h3 className="text-sm font-semibold text-accent">Results (TY 2026 estimate)</h3>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {result.beforeMarriage.label}
              </dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-accent">
                ${result.beforeMarriage.formattedTotalTax}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {result.afterMarriage.label}
              </dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-accent">
                ${result.afterMarriage.formattedTotalTax}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">
                Marriage {result.verdict === 'penalty' ? 'penalty' : result.verdict === 'bonus' ? 'bonus' : 'difference'}
              </dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-accent">
                {result.verdict === 'neutral'
                  ? '$0 (neutral)'
                  : `${result.verdict === 'penalty' ? '+' : '−'}$${result.formattedDifference}`}
              </dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.assumptionsNote}
          </p>
        </div>
      ) : null}
    </form>
  );
}
