'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AccountType,
  ContributionFrequency,
  ContributionKind,
  ContributionTiming,
  FourZeroThreeBFieldErrors,
  FourZeroThreeBInput,
  FourZeroThreeBMode,
  MatchKind,
  RateConvention,
  ScenarioSolve,
} from './types';
import { parseOptionalNumber } from './validation';

export interface FourZeroThreeBDraft {
  mode: FourZeroThreeBMode;
  scenarioSolve: ScenarioSolve;
  currentAge: string;
  retirementAge: string;
  balance: string;
  annualSalary: string;
  salaryGrowthPercent: string;
  contributionKind: ContributionKind;
  employeePercent: string;
  employeeFixedAnnual: string;
  contributionIncrease: string;
  matchKind: MatchKind;
  matchRatePercent: string;
  matchUpToPercent: string;
  fixedEmployerPercent: string;
  annualReturnPercent: string;
  annualFeePercent: string;
  frequency: ContributionFrequency;
  targetBalance: string;
  accountType: AccountType;
  inflationPercent: string;
  vestingPercent: string;
  timing: ContributionTiming;
  rateConvention: RateConvention;
  applyLimits: boolean;
  electiveDeferralLimit: string;
  catchUpAge: string;
  catchUpAmount: string;
  annualAdditionsLimit: string;
  currency: FourZeroThreeBInput['currency'];
}

export const DEFAULT_FOUR_ZERO_THREE_B_DRAFT: FourZeroThreeBDraft = {
  mode: 'balance',
  scenarioSolve: 'salary',
  currentAge: '35',
  retirementAge: '65',
  balance: '10000',
  annualSalary: '60000',
  salaryGrowthPercent: '2',
  contributionKind: 'percent',
  employeePercent: '6',
  employeeFixedAnnual: '3600',
  contributionIncrease: '0',
  matchKind: 'percent-of-contribution',
  matchRatePercent: '50',
  matchUpToPercent: '6',
  fixedEmployerPercent: '3',
  annualReturnPercent: '6',
  annualFeePercent: '0.2',
  frequency: 'monthly',
  targetBalance: '500000',
  accountType: 'traditional',
  inflationPercent: '2',
  vestingPercent: '100',
  timing: 'end',
  rateConvention: 'nominal',
  applyLimits: false,
  electiveDeferralLimit: '',
  catchUpAge: '50',
  catchUpAmount: '',
  annualAdditionsLimit: '',
  currency: 'USD',
};

function finiteOrNaN(raw: string): number {
  const parsed = parseOptionalNumber(raw);
  return parsed === null || !Number.isFinite(parsed) ? Number.NaN : parsed;
}

function percentOrNaN(raw: string): number {
  const parsed = finiteOrNaN(raw);
  return Number.isFinite(parsed) ? parsed / 100 : Number.NaN;
}

export function draftToInput(draft: FourZeroThreeBDraft): FourZeroThreeBInput {
  const solvingEmployee = draft.mode === 'employee-contribution';
  const solvingSalary = draft.mode === 'scenario' && draft.scenarioSolve === 'salary';
  const solvingEmployer = draft.mode === 'scenario' && draft.scenarioSolve === 'employer';
  return {
    mode: draft.mode,
    scenarioSolve: draft.scenarioSolve,
    currentAge: finiteOrNaN(draft.currentAge),
    retirementAge: finiteOrNaN(draft.retirementAge),
    balance: finiteOrNaN(draft.balance),
    annualSalary: solvingSalary ? 0 : finiteOrNaN(draft.annualSalary),
    salaryGrowthRate: percentOrNaN(draft.salaryGrowthPercent),
    contributionKind: draft.contributionKind,
    employeePercent: solvingEmployee && draft.contributionKind === 'percent' ? 0 : percentOrNaN(draft.employeePercent),
    employeeFixedAnnual:
      solvingEmployee && draft.contributionKind === 'fixed' ? 0 : finiteOrNaN(draft.employeeFixedAnnual),
    contributionIncrease: percentOrNaN(draft.contributionIncrease),
    matchKind: draft.matchKind,
    matchRate: solvingEmployer && draft.matchKind === 'percent-of-contribution' ? 0 : percentOrNaN(draft.matchRatePercent),
    matchUpToPercent: percentOrNaN(draft.matchUpToPercent),
    fixedEmployerPercent:
      solvingEmployer && draft.matchKind !== 'percent-of-contribution' ? 0 : percentOrNaN(draft.fixedEmployerPercent),
    annualReturn: percentOrNaN(draft.annualReturnPercent),
    annualFeeRate: percentOrNaN(draft.annualFeePercent),
    frequency: draft.frequency,
    targetBalance: draft.mode === 'balance' ? null : parseOptionalNumber(draft.targetBalance),
    accountType: draft.accountType,
    inflationRate: percentOrNaN(draft.inflationPercent),
    vestingPercent: percentOrNaN(draft.vestingPercent),
    timing: draft.timing,
    rateConvention: draft.rateConvention,
    applyLimits: draft.applyLimits,
    electiveDeferralLimit: draft.applyLimits ? parseOptionalNumber(draft.electiveDeferralLimit) : null,
    catchUpAge: draft.applyLimits ? finiteOrNaN(draft.catchUpAge) : null,
    catchUpAmount: draft.applyLimits ? parseOptionalNumber(draft.catchUpAmount) : null,
    annualAdditionsLimit: draft.applyLimits ? parseOptionalNumber(draft.annualAdditionsLimit) : null,
    currency: draft.currency,
  };
}

const labelClass = 'mb-1.5 flex items-center gap-1 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

const MODES = [
  ['balance', 'Final balance'],
  ['employee-contribution', 'Contribution needed'],
  ['scenario', 'Salary or match'],
] as const;

interface FourZeroThreeBFormProps {
  draft: FourZeroThreeBDraft;
  errors: FourZeroThreeBFieldErrors;
  onDraftChange: (draft: FourZeroThreeBDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function FourZeroThreeBForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: FourZeroThreeBFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<FourZeroThreeBDraft>) => onDraftChange({ ...draft, ...next });
  const solvingEmployee = draft.mode === 'employee-contribution';
  const solvingSalary = draft.mode === 'scenario' && draft.scenarioSolve === 'salary';
  const solvingEmployer = draft.mode === 'scenario' && draft.scenarioSolve === 'employer';
  const increaseLabel =
    draft.contributionKind === 'percent' ? 'Yearly deferral increase' : 'Yearly dollar-contribution growth';
  const increaseHint =
    draft.contributionKind === 'percent'
      ? 'Percentage points added each year. 1 means 6% becomes 7%.'
      : 'Percent growth of the fixed dollar amount. Salary growth is separate.';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div role="group" aria-label="Calculation mode" className="grid grid-cols-1 gap-1 rounded-lg border border-border bg-muted/40 p-1 min-[560px]:grid-cols-3">
        {MODES.map(([value, label]) => {
          const active = draft.mode === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              className={`h-10 rounded-md px-2 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => patch({ mode: value })}
            >
              {label}
            </button>
          );
        })}
      </div>

      {draft.mode === 'scenario' ? (
        <div role="group" aria-label="Value to solve" className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {(
            [
              ['salary', 'Salary needed'],
              ['employer', 'Employer contribution needed'],
            ] as const
          ).map(([value, label]) => {
            const active = draft.scenarioSolve === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                className={`h-10 rounded-md px-2 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => patch({ scenarioSolve: value })}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : null}
      {errors.scenario ? <p className="text-xs text-rose-600">{errors.scenario}</p> : null}

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <Field id="fztb-current-age" label="Current age" value={draft.currentAge} error={errors.currentAge} suffix="yrs" onChange={(currentAge) => patch({ currentAge })} />
        <Field id="fztb-retirement-age" label="Retirement age" value={draft.retirementAge} error={errors.retirementAge} suffix="yrs" onChange={(retirementAge) => patch({ retirementAge })} />
        <Field id="fztb-balance" label="Current 403(b) balance" prefix={symbol} value={draft.balance} error={errors.balance} onChange={(balance) => patch({ balance })} />
        {solvingSalary ? null : (
          <Field id="fztb-salary" label="Annual gross salary" prefix={symbol} value={draft.annualSalary} error={errors.annualSalary} onChange={(annualSalary) => patch({ annualSalary })} />
        )}
        <Field id="fztb-salary-growth" label="Annual salary growth" value={draft.salaryGrowthPercent} error={errors.salaryGrowthPercent} suffix="%" onChange={(salaryGrowthPercent) => patch({ salaryGrowthPercent })} />
        {draft.mode === 'balance' ? null : (
          <Field
            id="fztb-target"
            label="Target balance at retirement"
            prefix={symbol}
            value={draft.targetBalance}
            error={errors.targetBalance}
            hint="Nominal dollars in the retirement year, before inflation adjustment."
            onChange={(targetBalance) => patch({ targetBalance })}
          />
        )}
      </div>

      <fieldset className="space-y-3.5">
        <legend className={labelClass}>Employee contribution</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {(
            [
              ['percent', 'Percent of salary'],
              ['fixed', 'Fixed annual amount'],
            ] as const
          ).map(([value, label]) => {
            const active = draft.contributionKind === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                className={`h-10 rounded-md px-2 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => patch({ contributionKind: value })}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          {solvingEmployee ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {draft.contributionKind === 'percent'
                ? 'The employee percent is the unknown. The result is the lowest percent of salary that reaches the target.'
                : 'The fixed annual amount is the unknown. The result is the lowest starting dollar deferral that reaches the target.'}
            </p>
          ) : draft.contributionKind === 'percent' ? (
            <Field id="fztb-employee-percent" label="Employee deferral" value={draft.employeePercent} error={errors.employeePercent} suffix="%" onChange={(employeePercent) => patch({ employeePercent })} />
          ) : (
            <Field id="fztb-employee-fixed" label="Fixed annual deferral" prefix={symbol} value={draft.employeeFixedAnnual} error={errors.employeeFixedAnnual} onChange={(employeeFixedAnnual) => patch({ employeeFixedAnnual })} />
          )}
          <Field id="fztb-increase" label={increaseLabel} value={draft.contributionIncrease} error={errors.contributionIncrease} suffix="%" hint={increaseHint} onChange={(contributionIncrease) => patch({ contributionIncrease })} />
        </div>
      </fieldset>

      <fieldset className="space-y-3.5">
        <legend className={labelClass}>
          Employer contribution
          <InfoTooltip
            label="Employer match"
            text="No plan has to match. A 50% match on the first 6% of a 60,000 salary, with a 6% deferral, is 3,600 from the employee and 1,800 from the employer. A fixed percent is deposited even if the employee contributes nothing."
          />
        </legend>
        <Select
          id="fztb-match-kind"
          label="Match formula"
          value={draft.matchKind}
          onChange={(matchKind) => patch({ matchKind })}
          options={[
            ['none', 'No employer match'],
            ['percent-of-contribution', 'Percent of employee deferrals, up to a cap'],
            ['fixed-percent', 'Fixed percent of salary'],
          ]}
        />
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          {draft.matchKind === 'percent-of-contribution' ? (
            <>
              {solvingEmployer ? (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  The match rate is the unknown. The cap below stays fixed.
                </p>
              ) : (
                <Field id="fztb-match-rate" label="Match rate" value={draft.matchRatePercent} error={errors.matchRatePercent} suffix="%" hint="100 means dollar-for-dollar. 50 means half of the eligible deferral." onChange={(matchRatePercent) => patch({ matchRatePercent })} />
              )}
              <Field id="fztb-match-up-to" label="Eligible deferral cap" value={draft.matchUpToPercent} error={errors.matchUpToPercent} suffix="%" hint="Share of salary the match applies to. 6 means the first 6%." onChange={(matchUpToPercent) => patch({ matchUpToPercent })} />
            </>
          ) : null}
          {draft.matchKind === 'fixed-percent' && !solvingEmployer ? (
            <Field id="fztb-fixed-employer" label="Employer percent of salary" value={draft.fixedEmployerPercent} error={errors.fixedEmployerPercent} suffix="%" onChange={(fixedEmployerPercent) => patch({ fixedEmployerPercent })} />
          ) : null}
          {draft.matchKind === 'none' && solvingEmployer ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              This scenario solves a flat employer percent of salary. It does not assume a match formula.
            </p>
          ) : null}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <Field id="fztb-return" label="Expected annual return" value={draft.annualReturnPercent} error={errors.annualReturnPercent} suffix="%" hint="An assumption, not a promised return. Negative values are allowed." onChange={(annualReturnPercent) => patch({ annualReturnPercent })} />
        <Field id="fztb-fee" label="Annual fees" value={draft.annualFeePercent} error={errors.annualFeePercent} suffix="%" hint="Investment and administration fees, as a percent of the invested balance." onChange={(annualFeePercent) => patch({ annualFeePercent })} />
        <Select
          id="fztb-frequency"
          label="Contribution frequency"
          value={draft.frequency}
          onChange={(frequency) => patch({ frequency })}
          options={[
            ['monthly', 'Monthly (12)'],
            ['biweekly', 'Biweekly (26)'],
            ['yearly', 'Yearly (1)'],
          ]}
        />
      </div>

      <details className="rounded-lg border border-border px-3 py-2">
        <summary className="cursor-pointer text-[13px] font-medium text-accent">Advanced assumptions</summary>
        <div className="mt-3 grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Select
            id="fztb-account"
            label="Account type"
            value={draft.accountType}
            onChange={(accountType) => patch({ accountType })}
            options={[
              ['traditional', 'Traditional 403(b)'],
              ['roth', 'Roth 403(b)'],
            ]}
          />
          <Field id="fztb-inflation" label="Annual inflation" value={draft.inflationPercent} error={errors.inflationPercent} suffix="%" hint="Used only to show today's purchasing power. It does not change the nominal balance." onChange={(inflationPercent) => patch({ inflationPercent })} />
          <Field id="fztb-vesting" label="Employer vesting" value={draft.vestingPercent} error={errors.vestingPercent} suffix="%" hint="Flat share of each employer deposit that counts. 100 means fully vested. This is not a graded schedule." onChange={(vestingPercent) => patch({ vestingPercent })} />
          <Select
            id="fztb-timing"
            label="Contribution timing"
            value={draft.timing}
            onChange={(timing) => patch({ timing })}
            options={[
              ['end', 'End of each period'],
              ['beginning', 'Beginning of each period'],
            ]}
          />
          <Select
            id="fztb-convention"
            label="Compounding convention"
            value={draft.rateConvention}
            onChange={(rateConvention) => patch({ rateConvention })}
            options={[
              ['nominal', 'Nominal (annual rate ÷ periods)'],
              ['effective', 'Effective annual rate'],
            ]}
          />
        </div>
        <div className="mt-3">
          <label className="flex items-start gap-2 text-[13px] text-accent">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-primary"
              checked={draft.applyLimits}
              onChange={(event) => patch({ applyLimits: event.target.checked })}
            />
            <span>
              Apply contribution limits I enter
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                Type the employee deferral cap, and optionally a catch-up and an overall annual-additions cap, for the tax year you want to model. This calculator does not store an IRS schedule.
              </span>
            </span>
          </label>
        </div>
        {draft.applyLimits ? (
          <div className="mt-3 grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
            <Field id="fztb-elective" label="Employee deferral limit" prefix={symbol} value={draft.electiveDeferralLimit} error={errors.electiveDeferralLimit} onChange={(electiveDeferralLimit) => patch({ electiveDeferralLimit })} />
            <Field id="fztb-catch-up-age" label="Catch-up starting age" value={draft.catchUpAge} error={errors.catchUpAge} suffix="yrs" hint="Used only when a catch-up amount is entered. Age is measured at the start of each projection year." onChange={(catchUpAge) => patch({ catchUpAge })} />
            <Field id="fztb-catch-up" label="Catch-up amount" prefix={symbol} value={draft.catchUpAmount} error={errors.catchUpAmount} hint="Extra employee room. Leave blank to skip catch-up. A special 15-year 403(b) catch-up belongs in this amount if it applies to you." onChange={(catchUpAmount) => patch({ catchUpAmount })} />
            <Field id="fztb-additions" label="Annual additions limit" prefix={symbol} value={draft.annualAdditionsLimit} error={errors.annualAdditionsLimit} hint="Optional cap on employee plus employer dollars. Leave blank to cap only the employee deferral. Excess employer money is reduced first." onChange={(annualAdditionsLimit) => patch({ annualAdditionsLimit })} />
          </div>
        ) : null}
      </details>

      <div className="flex gap-2">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  prefix,
  suffix,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  const errorId = `${id}-error`;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex h-11 items-center overflow-hidden rounded-lg border bg-white ${
          error ? 'border-rose-500' : 'border-border'
        } focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1`}
      >
        {prefix ? (
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, error ? errorId : undefined].filter(Boolean).join(' ') || undefined}
        />
        {suffix ? (
          <span className="pr-3 text-xs text-muted-foreground" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly (readonly [T, string])[];
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
