'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EmploymentStatus,
  PhilippinesIncomeTaxFieldErrors,
  PhilippinesIncomeTaxInput,
  PhilippinesIncomeTaxResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function MoneyOut({
  id,
  label,
  tip,
  value,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell muted>
        <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
          ₱
        </span>
        <input
          id={id}
          className={`${inputClass} pl-1`}
          readOnly
          tabIndex={-1}
          value={value}
          aria-readonly="true"
        />
      </FieldShell>
    </div>
  );
}

interface PhilippinesIncomeTaxFormProps {
  input: PhilippinesIncomeTaxInput;
  errors: PhilippinesIncomeTaxFieldErrors;
  result: PhilippinesIncomeTaxResult | null;
  onChange: (input: PhilippinesIncomeTaxInput) => void;
}

export function PhilippinesIncomeTaxForm({
  input,
  errors,
  result,
  onChange,
}: PhilippinesIncomeTaxFormProps) {
  const [salaryOpen, setSalaryOpen] = React.useState(true);
  const [contribOpen, setContribOpen] = React.useState(true);
  const [taxOpen, setTaxOpen] = React.useState(true);

  const set = (patch: Partial<PhilippinesIncomeTaxInput>) =>
    onChange({ ...input, ...patch });

  const contribTitle =
    result?.contributionsSectionTitle ??
    (input.employmentStatus === 'employed'
      ? 'Contributions for employed individuals'
      : 'Contributions for self-employed individuals');
  const taxLabel = result?.taxLabel ?? 'Withholding tax';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <SectionCard
        title="Salary overview"
        open={salaryOpen}
        onToggle={() => setSalaryOpen((v) => !v)}
      >
        <fieldset>
          <legend className={labelClass}>
            <span>Employment status</span>
            <InfoTooltip
              label="Employment status"
              text="Employed uses employee contribution shares and BIR monthly withholding. Self-employed uses member-paid contribution rules and estimated graduated tax — not payroll withholding."
            />
          </legend>
          <div className="mt-1 space-y-2">
            {(
              [
                ['employed', 'Employed'],
                ['self-employed', 'Self-employed'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ph-employment-status"
                  className="h-4 w-4 accent-primary"
                  checked={input.employmentStatus === value}
                  onChange={() =>
                    set({ employmentStatus: value as EmploymentStatus })
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="ph-monthly-income">
            <span>Monthly income</span>
            <InfoTooltip
              label="Monthly income"
              text="Monthly gross basic pay (employed) or declared monthly income (self-employed) in Philippine pesos. Fixed ₱ — no currency conversion."
            />
          </label>
          <FieldShell error={errors.monthlyIncome}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              ₱
            </span>
            <input
              id="ph-monthly-income"
              className={`${inputClass} pl-1`}
              inputMode="decimal"
              value={input.monthlyIncome}
              aria-invalid={Boolean(errors.monthlyIncome)}
              onChange={(e) => set({ monthlyIncome: e.target.value })}
            />
          </FieldShell>
          {errors.monthlyIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyIncome}</p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title={contribTitle}
        open={contribOpen}
        onToggle={() => setContribOpen((v) => !v)}
      >
        <MoneyOut
          id="ph-sss"
          label="SSS"
          tip="Social Security System member share for CY 2025 (SSS Circular 2024-006/008). Employer EC is excluded."
          value={result?.formattedSss ?? ''}
        />
        <MoneyOut
          id="ph-philhealth"
          label="PhilHealth"
          tip="PhilHealth member share for CY 2025 (Advisory 2025-0002). Employed = half of 5% premium; self-employed = full premium."
          value={result?.formattedPhilHealth ?? ''}
        />
        <MoneyOut
          id="ph-pagibig"
          label="Pag-IBIG"
          tip="Pag-IBIG Fund member savings under Circular 460 (max fund salary ₱10,000). Employed = employee share only; self-employed = employee + employer counterparts."
          value={result?.formattedPagIbig ?? ''}
        />
        <MoneyOut
          id="ph-total-contrib"
          label="Total contributions"
          tip="Sum of SSS + PhilHealth + Pag-IBIG amounts shown above (member-paid only)."
          value={result?.formattedTotalContributions ?? ''}
        />
      </SectionCard>

      <SectionCard
        title="Deductions and tax expenses"
        open={taxOpen}
        onToggle={() => setTaxOpen((v) => !v)}
      >
        <MoneyOut
          id="ph-taxable"
          label="Taxable income"
          tip="Monthly income minus applicable member contributions. Amounts are monthly."
          value={result?.formattedTaxableIncome ?? ''}
        />
        <MoneyOut
          id="ph-tax"
          label={taxLabel}
          tip="Employed: BIR monthly withholding table (Jan 2023+). Self-employed: estimated monthly tax from annual graduated rates ÷ 12. Not identical to final annual ITR liability."
          value={result?.formattedWithholdingTax ?? ''}
        />
        <MoneyOut
          id="ph-net-tax"
          label="Net pay after tax"
          tip="Monthly income minus tax only (contributions not subtracted on this line)."
          value={result?.formattedNetPayAfterTax ?? ''}
        />
        <MoneyOut
          id="ph-total-ded"
          label="Total deductions"
          tip="Tax + total member contributions."
          value={result?.formattedTotalDeductions ?? ''}
        />
        <MoneyOut
          id="ph-net-ded"
          label="Net pay after deductions"
          tip="Monthly take-home estimate: monthly income − tax − member contributions."
          value={result?.formattedNetPayAfterDeductions ?? ''}
        />
      </SectionCard>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          CY {result.taxYearLabel} estimate. Employer-paid shares are not deducted. Payroll
          withholding is not the same as final annual tax due.
        </p>
      ) : null}
    </form>
  );
}
