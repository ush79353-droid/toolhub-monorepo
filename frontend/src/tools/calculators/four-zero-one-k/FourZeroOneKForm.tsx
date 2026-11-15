'use client';

import type { FormEvent } from 'react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AccountType,
  ContributionFrequency,
  ContributionKind,
  ContributionTiming,
  FourZeroOneKFieldErrors,
  FourZeroOneKInput,
  FourZeroOneKMode,
  MatchKind,
} from './types';
import { parseOptionalNumber } from './validation';

export interface FourZeroOneKDraft {
  mode: FourZeroOneKMode;
  currentAge: string;
  retirementAge: string;
  balance: string;
  annualSalary: string;
  salaryGrowthPercent: string;
  salaryCap: string;
  contributionKind: ContributionKind;
  employeePercent: string;
  employeeFixedAnnual: string;
  contributionIncrease: string;
  matchKind: MatchKind;
  matchRatePercent: string;
  matchUpToPercent: string;
  fixedEmployerPercent: string;
  extraEmployerAnnual: string;
  annualReturnPercent: string;
  annualFeePercent: string;
  frequency: ContributionFrequency;
  targetBalance: string;
  accountType: AccountType;
  inflationPercent: string;
  vestingPercent: string;
  timing: ContributionTiming;
  applyLimits: boolean;
  electiveDeferralLimit: string;
  catchUpAge: string;
  catchUpAmount: string;
  annualAdditionsLimit: string;
  withdrawalPercent: string;
  currency: FourZeroOneKInput['currency'];
}

export const DEFAULT_FOUR_ZERO_ONE_K_DRAFT: FourZeroOneKDraft = {
  mode: 'balance',
  currentAge: '35',
  retirementAge: '65',
  balance: '25000',
  annualSalary: '80000',
  salaryGrowthPercent: '2',
  salaryCap: '',
  contributionKind: 'percent',
  employeePercent: '6',
  employeeFixedAnnual: '4800',
  contributionIncrease: '0',
  matchKind: 'partial',
  matchRatePercent: '50',
  matchUpToPercent: '6',
  fixedEmployerPercent: '3',
  extraEmployerAnnual: '0',
  annualReturnPercent: '6',
  annualFeePercent: '0.2',
  frequency: 'monthly',
  targetBalance: '1000000',
  accountType: 'traditional',
  inflationPercent: '2',
  vestingPercent: '100',
  timing: 'end',
  applyLimits: false,
  electiveDeferralLimit: '',
  catchUpAge: '',
  catchUpAmount: '',
  annualAdditionsLimit: '',
  withdrawalPercent: '4',
  currency: 'USD',
};

function finiteOrNaN(raw: string): number {
  const value = parseOptionalNumber(raw);
  return value === null ? Number.NaN : value;
}

function percentOrNaN(raw: string): number {
  const value = finiteOrNaN(raw);
  return Number.isFinite(value) ? value / 100 : Number.NaN;
}

export function draftToInput(draft: FourZeroOneKDraft): FourZeroOneKInput {
  const solving = draft.mode === 'required';
  const withdrawal = parseOptionalNumber(draft.withdrawalPercent);
  return {
    mode: draft.mode,
    currentAge: finiteOrNaN(draft.currentAge),
    retirementAge: finiteOrNaN(draft.retirementAge),
    balance: finiteOrNaN(draft.balance),
    annualSalary: finiteOrNaN(draft.annualSalary),
    salaryGrowthRate: percentOrNaN(draft.salaryGrowthPercent),
    salaryCap: parseOptionalNumber(draft.salaryCap),
    contributionKind: draft.contributionKind,
    employeePercent: solving && draft.contributionKind === 'percent' ? 0 : percentOrNaN(draft.employeePercent),
    employeeFixedAnnual:
      solving && draft.contributionKind === 'fixed' ? 0 : finiteOrNaN(draft.employeeFixedAnnual),
    contributionIncrease: percentOrNaN(draft.contributionIncrease),
    matchKind: draft.matchKind,
    matchRate: draft.matchKind === 'dollar-for-dollar' ? 1 : percentOrNaN(draft.matchRatePercent),
    matchUpToPercent: percentOrNaN(draft.matchUpToPercent),
    fixedEmployerPercent: percentOrNaN(draft.fixedEmployerPercent),
    extraEmployerAnnual: finiteOrNaN(draft.extraEmployerAnnual),
    annualReturn: percentOrNaN(draft.annualReturnPercent),
    annualFeeRate: percentOrNaN(draft.annualFeePercent),
    frequency: draft.frequency,
    targetBalance:
      draft.mode === 'required' || draft.targetBalance.trim() !== ''
        ? parseOptionalNumber(draft.targetBalance)
        : null,
    accountType: draft.accountType,
    inflationRate: percentOrNaN(draft.inflationPercent),
    vestingPercent: percentOrNaN(draft.vestingPercent),
    timing: draft.timing,
    applyLimits: draft.applyLimits,
    electiveDeferralLimit: draft.applyLimits ? parseOptionalNumber(draft.electiveDeferralLimit) : null,
    catchUpAge: draft.applyLimits && draft.catchUpAge.trim() !== '' ? finiteOrNaN(draft.catchUpAge) : null,
    catchUpAmount: draft.applyLimits && draft.catchUpAmount.trim() !== '' ? parseOptionalNumber(draft.catchUpAmount) : null,
    annualAdditionsLimit: draft.applyLimits ? parseOptionalNumber(draft.annualAdditionsLimit) : null,
    withdrawalRate: withdrawal === null ? null : withdrawal / 100,
    currency: draft.currency,
  };
}

const labelClass = 'mb-1.5 flex items-center gap-1 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

const MODES = [
  ['balance', 'Projected balance'],
  ['required', 'Contribution needed'],
] as const;

interface FourZeroOneKFormProps {
  draft: FourZeroOneKDraft;
  errors: FourZeroOneKFieldErrors;
  onDraftChange: (draft: FourZeroOneKDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function FourZeroOneKForm({ draft, errors, onDraftChange, onSubmit, onReset }: FourZeroOneKFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<FourZeroOneKDraft>) => onDraftChange({ ...draft, ...next });
  const solving = draft.mode === 'required';
  const increaseLabel =
    draft.contributionKind === 'percent' ? 'Yearly contribution increase' : 'Yearly dollar-contribution growth';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div
        role="group"
        aria-label="Calculation mode"
        className="grid grid-cols-1 gap-1 rounded-lg border border-border bg-muted/40 p-1 min-[560px]:grid-cols-2"
      >
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

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <Field id="fok-current-age" label="Current age" value={draft.currentAge} error={errors.currentAge} suffix="yrs" onChange={(currentAge) => patch({ currentAge })} />
        <Field id="fok-retirement-age" label="Retirement age" value={draft.retirementAge} error={errors.retirementAge} suffix="yrs" onChange={(retirementAge) => patch({ retirementAge })} />
        <Field id="fok-balance" label="Current 401(k) balance" prefix={symbol} value={draft.balance} error={errors.balance} onChange={(balance) => patch({ balance })} />
        <Field id="fok-salary" label="Annual gross salary" prefix={symbol} value={draft.annualSalary} error={errors.annualSalary} onChange={(annualSalary) => patch({ annualSalary })} />
        <Field id="fok-salary-growth" label="Expected salary increase" value={draft.salaryGrowthPercent} error={errors.salaryGrowthPercent} suffix="%" onChange={(salaryGrowthPercent) => patch({ salaryGrowthPercent })} />
        <Field
          id="fok-salary-cap"
          label="Annual salary cap"
          prefix={symbol}
          value={draft.salaryCap}
          error={errors.salaryCap}
          hint="Optional. Leave blank for no cap. Growth is applied first, then the cap."
          onChange={(salaryCap) => patch({ salaryCap })}
        />
        <Field
          id="fok-target"
          label={solving ? 'Target balance at retirement' : 'Target balance for progress'}
          prefix={symbol}
          value={draft.targetBalance}
          error={errors.targetBalance}
          hint={solving ? 'Nominal balance in the retirement year.' : 'Optional. Used only to show funding progress.'}
          onChange={(targetBalance) => patch({ targetBalance })}
        />
      </div>

      <fieldset className="space-y-3.5">
        <legend className={labelClass}>
          Employee contribution
          <InfoTooltip
            label="Employee contribution"
            text="Percent of that year's salary, or a fixed annual amount. Traditional and Roth change the tax story, not the investment math, when the dollar deposited is the same."
          />
        </legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1" role="group" aria-label="Contribution basis">
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
          {solving ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {draft.contributionKind === 'percent'
                ? 'The employee percent is the unknown. The result is the lowest percent of salary that reaches the target.'
                : 'The fixed annual amount is the unknown. The result is the lowest starting dollar deferral that reaches the target.'}
            </p>
          ) : draft.contributionKind === 'percent' ? (
            <Field id="fok-employee-percent" label="Employee contribution" value={draft.employeePercent} error={errors.employeePercent} suffix="%" onChange={(employeePercent) => patch({ employeePercent })} />
          ) : (
            <Field id="fok-employee-fixed" label="Fixed annual contribution" prefix={symbol} value={draft.employeeFixedAnnual} error={errors.employeeFixedAnnual} onChange={(employeeFixedAnnual) => patch({ employeeFixedAnnual })} />
          )}
          <Field
            id="fok-increase"
            label={increaseLabel}
            value={draft.contributionIncrease}
            error={errors.contributionIncrease}
            suffix="%"
            hint={
              draft.contributionKind === 'percent'
                ? 'Percentage points added each year. 1 means 6% becomes 7%.'
                : 'Percent growth of the fixed dollar amount. Salary growth is separate.'
            }
            onChange={(contributionIncrease) => patch({ contributionIncrease })}
          />
          <Select
            id="fok-frequency"
            label="Contribution frequency"
            value={draft.frequency}
            onChange={(frequency) => patch({ frequency })}
            options={[
              ['monthly', 'Monthly'],
              ['biweekly', 'Biweekly (26)'],
              ['yearly', 'Annual'],
            ]}
          />
          <Select
            id="fok-account"
            label="Traditional or Roth"
            value={draft.accountType}
            onChange={(accountType) => patch({ accountType })}
            options={[
              ['traditional', 'Traditional (pre-tax)'],
              ['roth', 'Roth (after-tax)'],
            ]}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3.5">
        <legend className={labelClass}>
          Employer contribution
          <InfoTooltip
            label="Employer match"
            text="A 50% match on the first 6% of an $80,000 salary, with a 6% employee deferral, is $4,800 from the employee and $2,400 from the employer. Matching is not assumed."
          />
        </legend>
        <Select
          id="fok-match"
          label="Match formula"
          value={draft.matchKind}
          onChange={(matchKind) => patch({ matchKind })}
          options={[
            ['none', 'No employer matching'],
            ['dollar-for-dollar', 'Dollar-for-dollar'],
            ['partial', 'Partial match'],
            ['fixed', 'Fixed percent of salary'],
          ]}
        />
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          {draft.matchKind === 'partial' ? (
            <Field id="fok-match-rate" label="Employer match" value={draft.matchRatePercent} error={errors.matchRatePercent} suffix="%" hint="50 means the employer adds $0.50 per $1 of eligible deferral." onChange={(matchRatePercent) => patch({ matchRatePercent })} />
          ) : null}
          {draft.matchKind === 'dollar-for-dollar' || draft.matchKind === 'partial' ? (
            <Field id="fok-match-up-to" label="Salary eligible for match" value={draft.matchUpToPercent} error={errors.matchUpToPercent} suffix="%" hint="6 means only the first 6% of salary is matched." onChange={(matchUpToPercent) => patch({ matchUpToPercent })} />
          ) : null}
          {draft.matchKind === 'fixed' ? (
            <Field id="fok-fixed-employer" label="Employer contribution" value={draft.fixedEmployerPercent} error={errors.fixedEmployerPercent} suffix="%" hint="Share of salary, whether or not the employee defers." onChange={(fixedEmployerPercent) => patch({ fixedEmployerPercent })} />
          ) : null}
          <Field id="fok-extra-employer" label="Extra employer amount" prefix={symbol} value={draft.extraEmployerAnnual} error={errors.extraEmployerAnnual} hint="Flat annual dollars, not tied to the match and not grown." onChange={(extraEmployerAnnual) => patch({ extraEmployerAnnual })} />
          <Field id="fok-vesting" label="Vested share of employer deposits" value={draft.vestingPercent} error={errors.vestingPercent} suffix="%" hint="100 counts the full employer deposit. 0 keeps it out of the balance." onChange={(vestingPercent) => patch({ vestingPercent })} />
        </div>
      </fieldset>

      <fieldset className="space-y-3.5">
        <legend className={labelClass}>Investment assumptions</legend>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Field id="fok-return" label="Expected annual return" value={draft.annualReturnPercent} error={errors.annualReturnPercent} suffix="%" hint="Effective annual rate. Each period uses the rate that compounds to this figure." onChange={(annualReturnPercent) => patch({ annualReturnPercent })} />
          <Field id="fok-fee" label="Annual investment fees" value={draft.annualFeePercent} error={errors.annualFeePercent} suffix="%" onChange={(annualFeePercent) => patch({ annualFeePercent })} />
          <Field id="fok-inflation" label="Expected inflation" value={draft.inflationPercent} error={errors.inflationPercent} suffix="%" hint="Used only to restate the final balance in today's purchasing power." onChange={(inflationPercent) => patch({ inflationPercent })} />
          <Select
            id="fok-timing"
            label="Contribution timing"
            value={draft.timing}
            onChange={(timing) => patch({ timing })}
            options={[
              ['end', 'End of each period'],
              ['beginning', 'Beginning of each period'],
            ]}
          />
          <Field id="fok-withdrawal" label="Illustrative withdrawal rate" value={draft.withdrawalPercent} error={errors.withdrawalPercent} suffix="%" hint="Optional. A planning assumption, not a guaranteed income." onChange={(withdrawalPercent) => patch({ withdrawalPercent })} />
        </div>
      </fieldset>

      <fieldset className="space-y-3.5">
        <legend className={labelClass}>Contribution limits</legend>
        <label className="flex items-start gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primary"
            checked={draft.applyLimits}
            onChange={(event) => patch({ applyLimits: event.target.checked })}
          />
          <span>Apply a tax-year elective deferral limit I enter. No IRS table is built in.</span>
        </label>
        {draft.applyLimits ? (
          <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
            <Field id="fok-limit" label="Elective deferral limit (USD)" prefix="$" value={draft.electiveDeferralLimit} error={errors.electiveDeferralLimit} hint="The published dollar cap for the year you mean. Leave catch-up blank if it does not apply." onChange={(electiveDeferralLimit) => patch({ electiveDeferralLimit })} />
            <Field id="fok-catch-age" label="Catch-up starting age" value={draft.catchUpAge} error={errors.catchUpAge} suffix="yrs" onChange={(catchUpAge) => patch({ catchUpAge })} />
            <Field id="fok-catch-amount" label="Catch-up amount (USD)" prefix="$" value={draft.catchUpAmount} error={errors.catchUpAmount} onChange={(catchUpAmount) => patch({ catchUpAmount })} />
            <Field id="fok-additions" label="Annual additions limit (USD)" prefix="$" value={draft.annualAdditionsLimit} error={errors.annualAdditionsLimit} hint="Optional combined cap on employee plus employer deposits." onChange={(annualAdditionsLimit) => patch({ annualAdditionsLimit })} />
          </div>
        ) : null}
      </fieldset>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="sr-only">
          Update projection
        </button>
        <button
          type="button"
          onClick={onReset}
          className="h-10 rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reset
        </button>
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
