'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { FilingStatus, TaxYear } from './tax-parameters';
import type {
  IncomeTaxFieldErrors,
  IncomeTaxInput,
  IncomeTaxResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-3 pr-8 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  onChange,
  note,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  note?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
          $
        </span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldShell>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-semibold tracking-tight text-accent">{children}</h3>
  );
}

interface IncomeTaxFormProps {
  input: IncomeTaxInput;
  errors: IncomeTaxFieldErrors;
  result: IncomeTaxResult | null;
  onChange: (input: IncomeTaxInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function IncomeTaxForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: IncomeTaxFormProps) {
  const set = (patch: Partial<IncomeTaxInput>) => onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-4"
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
    >
      <p className="text-sm leading-relaxed text-foreground/90">
        Modify the values and click Calculate. Amounts are fixed USD. This estimates federal
        income tax for tax years 2025 and 2026 (including OBBBA adjustments) — not a complete
        return.
      </p>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <SectionTitle>Basic tax information</SectionTitle>

        <div>
          <label className={labelClass} htmlFor="income-tax-filing-status">
            <span>Filing status</span>
            <InfoTooltip
              label="Filing status"
              text="IRS filing status used for brackets, standard deduction, and credit phaseouts."
            />
          </label>
          <select
            id="income-tax-filing-status"
            className={selectClass}
            value={input.filingStatus}
            onChange={(e) => set({ filingStatus: e.target.value as FilingStatus })}
          >
            <option value="single">Single</option>
            <option value="married-joint">Married Filing Jointly</option>
            <option value="married-separate">Married Filing Separately</option>
            <option value="head-of-household">Head of Household</option>
            <option value="qualifying-surviving-spouse">Qualifying Surviving Spouse</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="income-tax-young-deps">
              <span>No. of young dependents</span>
              <InfoTooltip
                label="Young dependents"
                text="Qualifying children ages 0–16 for the Child Tax Credit (Schedule 8812)."
              />
            </label>
            <FieldShell error={errors.youngDependents}>
              <input
                id="income-tax-young-deps"
                className={inputClass}
                inputMode="numeric"
                value={input.youngDependents}
                aria-invalid={Boolean(errors.youngDependents)}
                onChange={(e) => set({ youngDependents: e.target.value })}
              />
            </FieldShell>
            <p className="mt-1 text-xs text-muted-foreground">Age 0–16</p>
            {errors.youngDependents ? (
              <p className="mt-1 text-xs text-rose-600">{errors.youngDependents}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="income-tax-other-deps">
              <span>No. of other dependents</span>
              <InfoTooltip
                label="Other dependents"
                text="Dependents age 17 or older (or other dependents) for the $500 Credit for Other Dependents."
              />
            </label>
            <FieldShell error={errors.otherDependents}>
              <input
                id="income-tax-other-deps"
                className={inputClass}
                inputMode="numeric"
                value={input.otherDependents}
                aria-invalid={Boolean(errors.otherDependents)}
                onChange={(e) => set({ otherDependents: e.target.value })}
              />
            </FieldShell>
            <p className="mt-1 text-xs text-muted-foreground">Age 17 or older</p>
            {errors.otherDependents ? (
              <p className="mt-1 text-xs text-rose-600">{errors.otherDependents}</p>
            ) : null}
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Tax year</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {(
              [
                { year: 2026 as TaxYear, label: '2026 (return filed in 2027)' },
                { year: 2025 as TaxYear, label: '2025 (return filed in 2026)' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.year}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="income-tax-year"
                  checked={input.taxYear === opt.year}
                  onChange={() => set({ taxYear: opt.year })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <SectionTitle>Income</SectionTitle>

        <div>
          <label className={labelClass} htmlFor="income-tax-age">
            <span>Age</span>
            <InfoTooltip
              label="Age"
              text="Used for the additional standard deduction at age 65 or older."
            />
          </label>
          <FieldShell error={errors.age}>
            <input
              id="income-tax-age"
              className={inputClass}
              inputMode="numeric"
              value={input.age}
              aria-invalid={Boolean(errors.age)}
              onChange={(e) => set({ age: e.target.value })}
            />
          </FieldShell>
          {errors.age ? <p className="mt-1 text-xs text-rose-600">{errors.age}</p> : null}
        </div>

        <MoneyField
          id="income-tax-wages"
          label="Wages, tips, other compensation"
          tip="Form W-2 box 1 wages. Tips and overtime included here are not added again as income."
          value={input.wages}
          error={errors.wages}
          onChange={(v) => set({ wages: v })}
          note="W-2 box 1"
        />
        <MoneyField
          id="income-tax-fed-withheld"
          label="Federal income tax withheld"
          tip="Form W-2 box 2. Compared to federal liability for refund or amount owed."
          value={input.federalWithheld}
          error={errors.federalWithheld}
          onChange={(v) => set({ federalWithheld: v })}
          note="W-2 box 2"
        />
        <MoneyField
          id="income-tax-state-withheld"
          label="State income tax withheld"
          tip="W-2 box 17. Not federal withholding; may count toward the SALT itemized deduction."
          value={input.stateWithheld}
          error={errors.stateWithheld}
          onChange={(v) => set({ stateWithheld: v })}
          note="W-2 box 17"
        />
        <MoneyField
          id="income-tax-local-withheld"
          label="Local income tax withheld"
          tip="W-2 box 19. Not federal withholding; may count toward SALT."
          value={input.localWithheld}
          error={errors.localWithheld}
          onChange={(v) => set({ localWithheld: v })}
          note="W-2 box 19"
        />

        <fieldset>
          <legend className={labelClass}>Has business or self-employment income?</legend>
          <div className="flex gap-4">
            {(['yes', 'no'] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="income-tax-se"
                  checked={input.hasSelfEmployment === opt}
                  onChange={() => set({ hasSelfEmployment: opt })}
                />
                {opt}
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Indicator only — no SE net-profit field on this form, so SE tax is not computed.
          </p>
        </fieldset>

        <MoneyField
          id="income-tax-ss"
          label="Social Security income"
          tip="SSA-1099 / RRB-1099 benefits. Taxable portion uses the Pub. 915 worksheet."
          value={input.socialSecurity}
          error={errors.socialSecurity}
          onChange={(v) => set({ socialSecurity: v })}
          note="SSA-1099, RRB-1099"
        />
        <MoneyField
          id="income-tax-interest"
          label="Interest income"
          tip="Taxable interest from Form 1099-INT."
          value={input.interestIncome}
          error={errors.interestIncome}
          onChange={(v) => set({ interestIncome: v })}
          note="1099-INT"
        />
        <MoneyField
          id="income-tax-ord-div"
          label="Ordinary dividends"
          tip="Total ordinary dividends (includes qualified dividends)."
          value={input.ordinaryDividends}
          error={errors.ordinaryDividends}
          onChange={(v) => set({ ordinaryDividends: v })}
        />
        <MoneyField
          id="income-tax-qdiv"
          label="Qualified dividends"
          tip="Preferentially taxed portion from Form 1099-DIV; capped at ordinary dividends."
          value={input.qualifiedDividends}
          error={errors.qualifiedDividends}
          onChange={(v) => set({ qualifiedDividends: v })}
          note="1099-DIV"
        />
        <MoneyField
          id="income-tax-passive"
          label="Passive incomes"
          tip="Rentals, royalties, and similar passive income (simplified — no passive-loss limitation)."
          value={input.passiveIncome}
          error={errors.passiveIncome}
          onChange={(v) => set({ passiveIncome: v })}
          note="e.g. rentals and real estate, royalties"
        />
        <MoneyField
          id="income-tax-stcg"
          label="Short-term capital gains"
          tip="Net short-term gains taxed as ordinary income."
          value={input.shortTermGains}
          error={errors.shortTermGains}
          onChange={(v) => set({ shortTermGains: v })}
        />
        <MoneyField
          id="income-tax-ltcg"
          label="Long-term capital gains"
          tip="Net long-term gains eligible for preferential 0%/15%/20% rates."
          value={input.longTermGains}
          error={errors.longTermGains}
          onChange={(v) => set({ longTermGains: v })}
        />
        <MoneyField
          id="income-tax-other-inc"
          label="Other income"
          tip="Unemployment (1099-G), retirement (1099-R), and similar other income."
          value={input.otherIncome}
          error={errors.otherIncome}
          onChange={(v) => set({ otherIncome: v })}
          note="e.g. unemployment pay (1099-G), retirement pay (1099-R)"
        />

        <div>
          <label className={labelClass} htmlFor="income-tax-salt-rate">
            <span>State+local tax rate</span>
            <InfoTooltip
              label="State+local tax rate"
              text="Optional estimate of state/local income tax for the SALT itemized deduction. Not a federal rate."
            />
          </label>
          <FieldShell error={errors.stateLocalTaxRatePercent}>
            <input
              id="income-tax-salt-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.stateLocalTaxRatePercent}
              aria-invalid={Boolean(errors.stateLocalTaxRatePercent)}
              onChange={(e) => set({ stateLocalTaxRatePercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.stateLocalTaxRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.stateLocalTaxRatePercent}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <SectionTitle>Deductions &amp; credits</SectionTitle>

        <MoneyField
          id="income-tax-tips"
          label="Tips income"
          tip="Qualified tips amount for the OBBBA above-the-line tips deduction (not added again as wages)."
          value={input.tipsIncome}
          error={errors.tipsIncome}
          onChange={(v) => set({ tipsIncome: v })}
        />
        <MoneyField
          id="income-tax-ot"
          label="Overtime income"
          tip="Qualified overtime for the OBBBA above-the-line overtime deduction."
          value={input.overtimeIncome}
          error={errors.overtimeIncome}
          onChange={(v) => set({ overtimeIncome: v })}
        />
        <MoneyField
          id="income-tax-car"
          label="Car loan interest"
          tip="Interest on a loan for a qualified personal vehicle purchase (OBBBA)."
          value={input.carLoanInterest}
          error={errors.carLoanInterest}
          onChange={(v) => set({ carLoanInterest: v })}
          note="Max $10,000 for qualified vehicle purchase."
        />
        <MoneyField
          id="income-tax-ira"
          label="IRA contributions"
          tip="Traditional IRA contributions treated as an above-the-line adjustment (simplified)."
          value={input.iraContributions}
          error={errors.iraContributions}
          onChange={(v) => set({ iraContributions: v })}
        />
        <MoneyField
          id="income-tax-re"
          label="Real estate tax"
          tip="Deductible real estate taxes for Schedule A / SALT (subject to the OBBBA SALT cap)."
          value={input.realEstateTax}
          error={errors.realEstateTax}
          onChange={(v) => set({ realEstateTax: v })}
        />
        <MoneyField
          id="income-tax-mortgage"
          label="Mortgage interest"
          tip="Qualified residence interest for itemized deductions (acquisition debt limits not fully modeled)."
          value={input.mortgageInterest}
          error={errors.mortgageInterest}
          onChange={(v) => set({ mortgageInterest: v })}
        />
        <MoneyField
          id="income-tax-charity"
          label="Charitable donations"
          tip="Cash charitable contributions for itemized deductions (AGI % limits not fully modeled)."
          value={input.charitableDonations}
          error={errors.charitableDonations}
          onChange={(v) => set({ charitableDonations: v })}
        />
        <MoneyField
          id="income-tax-student-loan"
          label="Student loan interest"
          tip="Above-the-line student loan interest deduction (§221), max $2,500 with MAGI phaseout."
          value={input.studentLoanInterest}
          error={errors.studentLoanInterest}
          onChange={(v) => set({ studentLoanInterest: v })}
          note="Max $2,500/person."
        />
        <MoneyField
          id="income-tax-childcare"
          label="Child & dependent care expense"
          tip="Form 2441 expenses. Max $3,000 for one qualifying person, $6,000 total."
          value={input.childCareExpense}
          error={errors.childCareExpense}
          onChange={(v) => set({ childCareExpense: v })}
          note="Max $3,000/person, $6,000 total, up to age 13."
        />

        <div>
          <p className={labelClass}>College education expense</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['collegeStudent1', 'Student 1', errors.collegeStudent1],
                ['collegeStudent2', 'Student 2', errors.collegeStudent2],
                ['collegeStudent3', 'Student 3', errors.collegeStudent3],
                ['collegeStudent4', 'Student 4', errors.collegeStudent4],
              ] as const
            ).map(([key, label, err]) => (
              <MoneyField
                key={key}
                id={`income-tax-${key}`}
                label={label}
                tip="Qualified education expenses for the American Opportunity Credit (up to $2,500 per student, income phaseouts apply)."
                value={input[key]}
                error={err}
                onChange={(v) => set({ [key]: v })}
              />
            ))}
          </div>
        </div>

        <MoneyField
          id="income-tax-other-ded"
          label="Other deductibles"
          tip="Additional itemized deductions not listed above (simplified total)."
          value={input.otherDeductibles}
          error={errors.otherDeductibles}
          onChange={(v) => set({ otherDeductibles: v })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="h-11 rounded-xl px-5 font-semibold">
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl border-border px-5 font-semibold text-accent"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <IncomeTaxResultsPanel result={result} />
    </form>
  );
}

function IncomeTaxResultsPanel({ result }: { result: IncomeTaxResult | null }) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        Enter your details and click Calculate for an estimated federal refund or amount owed.
      </div>
    );
  }

  const primaryLabel = result.isRefund ? 'Estimated refund' : 'Estimated tax owed';
  const rows: { label: string; value: string }[] = [
    { label: 'Total reported income', value: `$${result.formattedTotalReportedIncome}` },
    { label: 'Adjusted gross income (AGI)', value: `$${result.formattedAdjustedGrossIncome}` },
    {
      label: `Total deductions (${result.deductionType})`,
      value: `$${result.formattedTotalDeductions}`,
    },
    { label: 'Taxable income', value: `$${result.formattedTaxableIncome}` },
    {
      label: 'Federal income tax before credits',
      value: `$${result.formattedTaxBeforeCredits}`,
    },
    { label: 'Applied credits', value: `$${result.formattedTotalCredits}` },
    {
      label: 'Final estimated federal income tax',
      value: `$${result.formattedTaxAfterCredits}`,
    },
    { label: 'Federal withholding', value: `$${result.formattedFederalWithholding}` },
    { label: primaryLabel, value: `$${result.formattedRefundOrOwed}` },
    {
      label: 'Effective federal income tax rate',
      value: result.formattedEffectiveRate,
    },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <div>
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Tax year {result.taxYear} · fixed USD · educational federal estimate
        </p>
      </div>
      <div className="rounded-lg border border-border bg-brand-softTeal/30 px-3 py-3">
        <p className="text-xs font-medium text-muted-foreground">{primaryLabel}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-accent">
          ${result.formattedRefundOrOwed}
        </p>
        <p className="mt-1 text-sm text-foreground/90">{result.summaryText}</p>
      </div>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-3 border-b border-border/70 pb-2 last:border-b-0 last:pb-0"
          >
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-accent">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
        {result.disclosures.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
