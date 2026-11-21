'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { US_STATES, type UsStateCode } from './poverty-guidelines';
import { POVERTY_GUIDELINE_YEARS } from './poverty-guidelines';
import { REPAYMENT_STANDARDS, type MaritalStatus } from './repayment-standards';
import type {
  CalculationPurpose,
  DiscretionaryIncomeFieldErrors,
  DiscretionaryIncomeInput,
  DiscretionaryIncomeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3 rounded-xl border border-border bg-muted/10 p-3 sm:p-4';

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

interface DiscretionaryIncomeFormProps {
  input: DiscretionaryIncomeInput;
  errors: DiscretionaryIncomeFieldErrors;
  result: DiscretionaryIncomeResult | null;
  onChange: (input: DiscretionaryIncomeInput) => void;
}

export function DiscretionaryIncomeForm({
  input,
  errors,
  result,
  onChange,
}: DiscretionaryIncomeFormProps) {
  const [stateQuery, setStateQuery] = useState('');
  const set = (patch: Partial<DiscretionaryIncomeInput>) =>
    onChange({ ...input, ...patch });

  const filteredStates = useMemo(() => {
    const q = stateQuery.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );
  }, [stateQuery]);

  const showSpouse =
    input.purpose === 'studentLoan' &&
    (input.maritalStatus === 'marriedFilingJointly' ||
      (input.maritalStatus === 'marriedFilingSeparately' &&
        REPAYMENT_STANDARDS.find((p) => p.id === input.repaymentStandardId)
          ?.includeSpouseIncomeWhenMfs === true));

  const expenseFields: {
    key: keyof DiscretionaryIncomeInput;
    err: keyof DiscretionaryIncomeFieldErrors;
    label: string;
  }[] = [
    { key: 'housing', err: 'housing', label: 'Housing' },
    { key: 'utilities', err: 'utilities', label: 'Utilities' },
    { key: 'groceries', err: 'groceries', label: 'Groceries' },
    { key: 'transportation', err: 'transportation', label: 'Transportation' },
    { key: 'insurance', err: 'insurance', label: 'Insurance' },
    { key: 'minDebt', err: 'minDebt', label: 'Minimum debt payments' },
    { key: 'healthcare', err: 'healthcare', label: 'Essential healthcare' },
    { key: 'childcare', err: 'childcare', label: 'Childcare' },
    { key: 'otherNecessary', err: 'otherNecessary', label: 'Other necessary' },
  ];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Amounts are USD. Student-loan discretionary income uses HHS poverty
 guidelines and a named calculation standard; it is not the same as
        budgeting discretionary income or disposable income after taxes.
      </p>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Calculation purpose">
        {(
          [
            { id: 'studentLoan', label: 'Student-loan discretionary income' },
            { id: 'budgeting', label: 'General discretionary income' },
          ] as { id: CalculationPurpose; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={input.purpose === m.id}
            onClick={() => set({ purpose: m.id })}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              input.purpose === m.id
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-accent hover:bg-muted/30'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {input.purpose === 'studentLoan' ? (
        <>
          <section className={sectionClass} aria-labelledby="di-status">
            <h3 id="di-status" className="text-sm font-semibold text-accent">
              Household
            </h3>
            <fieldset>
              <legend className={labelClass}>
                Marital status
                <InfoTooltip
                  label="Marital status"
                  text="Marital status, tax filing status, and the selected repayment standard can change applicable AGI and family size. Rules differ by plan."
                />
              </legend>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {(
                  [
                    { id: 'single', label: 'Single' },
                    { id: 'marriedFilingJointly', label: 'Married filing jointly' },
                    {
                      id: 'marriedFilingSeparately',
                      label: 'Married filing separately',
                    },
                  ] as { id: MaritalStatus; label: string }[]
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="di-marital"
                      checked={input.maritalStatus === opt.id}
                      onChange={() => set({ maritalStatus: opt.id })}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="di-state-search" className={labelClass}>
                State
              </label>
              <input
                id="di-state-search"
                type="search"
                className="mb-2 h-9 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                placeholder="Search states…"
                value={stateQuery}
                onChange={(e) => setStateQuery(e.target.value)}
                aria-label="Filter states"
              />
              <FieldShell error={errors.state}>
                <select
                  id="di-state"
                  className={`${inputClass} appearance-none`}
                  value={input.state}
                  onChange={(e) =>
                    set({ state: e.target.value as UsStateCode })
                  }
                  aria-invalid={Boolean(errors.state)}
                >
                  {filteredStates.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.state ? (
                <p className="mt-1 text-xs text-rose-600">{errors.state}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="di-agi" className={labelClass}>
                Annual adjusted gross income (AGI)
                <InfoTooltip
                  label="AGI"
                  text="Adjusted gross income is generally your total income minus certain adjustments on your federal income tax return; not take-home pay."
                />
              </label>
              <FieldShell error={errors.annualAgi}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="di-agi"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.annualAgi}
                  onChange={(e) => set({ annualAgi: e.target.value })}
                  aria-invalid={Boolean(errors.annualAgi)}
                />
              </FieldShell>
              {errors.annualAgi ? (
                <p className="mt-1 text-xs text-rose-600">{errors.annualAgi}</p>
              ) : null}
            </div>

            {showSpouse ? (
              <div>
                <label htmlFor="di-spouse" className={labelClass}>
                  Spouse annual AGI
                </label>
                <FieldShell error={errors.spouseAgi}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    $
                  </span>
                  <input
                    id="di-spouse"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.spouseAgi}
                    onChange={(e) => set({ spouseAgi: e.target.value })}
                  />
                </FieldShell>
                {errors.spouseAgi ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.spouseAgi}</p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label htmlFor="di-dep" className={labelClass}>
                Number of dependents
                <InfoTooltip
                  label="Dependents"
                  text="Enter qualifying dependents relevant to the family-size rules of the selected repayment standard. Family size is not always dependents + 1."
                />
              </label>
              <FieldShell error={errors.dependents}>
                <input
                  id="di-dep"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.dependents}
                  onChange={(e) => set({ dependents: e.target.value })}
                />
              </FieldShell>
              {errors.dependents ? (
                <p className="mt-1 text-xs text-rose-600">{errors.dependents}</p>
              ) : null}
            </div>
          </section>

          <section className={sectionClass} aria-labelledby="di-plan">
            <h3 id="di-plan" className="text-sm font-semibold text-accent">
              Calculation standard
            </h3>
            <div>
              <label htmlFor="di-standard" className={labelClass}>
                Repayment plan / calculation standard
              </label>
              <FieldShell error={errors.repaymentStandardId}>
                <select
                  id="di-standard"
                  className={`${inputClass} appearance-none`}
                  value={input.repaymentStandardId}
                  onChange={(e) =>
                    set({ repaymentStandardId: e.target.value })
                  }
                >
                  {REPAYMENT_STANDARDS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.shortLabel} ({p.availability})
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.repaymentStandardId ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.repaymentStandardId}
                </p>
              ) : null}
              {(() => {
                const p = REPAYMENT_STANDARDS.find(
                  (x) => x.id === input.repaymentStandardId
                );
                if (!p) return null;
                return (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {p.name}. {p.regulatoryBasis}. Protection{' '}
                    {(p.protectionMultiplier * 100).toFixed(0)}% FPL · assessment{' '}
                    {(p.assessmentRate * 100).toFixed(0)}% of DI. {p.notes}
                  </p>
                );
              })()}
            </div>
            <div>
              <label htmlFor="di-year" className={labelClass}>
                Poverty guideline year
              </label>
              <FieldShell error={errors.povertyYear}>
                <select
                  id="di-year"
                  className={`${inputClass} appearance-none`}
                  value={input.povertyYear}
                  onChange={(e) => set({ povertyYear: e.target.value })}
                >
                  {POVERTY_GUIDELINE_YEARS.map((y) => (
                    <option key={y.year} value={String(y.year)}>
                      {y.year}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.povertyYear ? (
                <p className="mt-1 text-xs text-rose-600">{errors.povertyYear}</p>
              ) : null}
            </div>
          </section>

          <div>
            <label htmlFor="di-out-annual" className={labelClass}>
              Annual discretionary income
            </label>
            <FieldShell muted>
              <input
                id="di-out-annual"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedAnnualDi ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </>
      ) : (
        <section className={sectionClass} aria-labelledby="di-budget">
          <h3 id="di-budget" className="text-sm font-semibold text-accent">
            Monthly budgeting
          </h3>
          <div>
            <label htmlFor="di-takehome" className={labelClass}>
              Monthly take-home income
            </label>
            <FieldShell error={errors.monthlyTakeHome}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="di-takehome"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.monthlyTakeHome}
                onChange={(e) => set({ monthlyTakeHome: e.target.value })}
              />
            </FieldShell>
            {errors.monthlyTakeHome ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.monthlyTakeHome}
              </p>
            ) : null}
          </div>
          <p className="text-xs font-medium text-accent">Necessary expenses</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {expenseFields.map((f) => (
              <div key={f.key}>
                <label htmlFor={`di-${f.key}`} className={labelClass}>
                  {f.label}
                </label>
                <FieldShell error={errors[f.err]}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    $
                  </span>
                  <input
                    id={`di-${f.key}`}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={String(input[f.key])}
                    onChange={(e) =>
                      set({ [f.key]: e.target.value } as Partial<DiscretionaryIncomeInput>)
                    }
                  />
                </FieldShell>
                {errors[f.err] ? (
                  <p className="mt-1 text-xs text-rose-600">{errors[f.err]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}
    </form>
  );
}
