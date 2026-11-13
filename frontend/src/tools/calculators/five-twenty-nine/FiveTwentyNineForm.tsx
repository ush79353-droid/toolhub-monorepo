'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type {
  CollegePaymentTiming,
  ContributionTiming,
  FiveTwentyNineFieldErrors,
  FiveTwentyNineInput,
} from './types';

export interface FiveTwentyNineDraft {
  currentAge: string;
  collegeStartAge: string;
  collegeYears: string;
  currentAnnualCost: string;
  educationInflationPercent: string;
  annualScholarship: string;
  currentBalance: string;
  initialLumpSum: string;
  monthlyContribution: string;
  annualReturnPercent: string;
  annualFeePercent: string;
  contributionTiming: ContributionTiming;
  annualContributionGrowthPercent: string;
  additionalAnnualContribution: string;
  targetFundingPercent: string;
  collegePaymentTiming: CollegePaymentTiming;
  annualContributionAlert: string;
  currency: FiveTwentyNineInput['currency'];
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

const NUMBER_KEYS = [
  'currentAge',
  'collegeStartAge',
  'collegeYears',
  'currentAnnualCost',
  'educationInflationPercent',
  'annualScholarship',
  'currentBalance',
  'initialLumpSum',
  'monthlyContribution',
  'annualReturnPercent',
  'annualFeePercent',
  'annualContributionGrowthPercent',
  'additionalAnnualContribution',
  'targetFundingPercent',
] as const satisfies readonly (keyof FiveTwentyNineDraft)[];

export function inputToDraft(input: FiveTwentyNineInput): FiveTwentyNineDraft {
  return {
    currentAge: String(input.currentAge),
    collegeStartAge: String(input.collegeStartAge),
    collegeYears: String(input.collegeYears),
    currentAnnualCost: String(input.currentAnnualCost),
    educationInflationPercent: String(input.educationInflationPercent),
    annualScholarship: String(input.annualScholarship),
    currentBalance: String(input.currentBalance),
    initialLumpSum: String(input.initialLumpSum),
    monthlyContribution: String(input.monthlyContribution),
    annualReturnPercent: String(input.annualReturnPercent),
    annualFeePercent: String(input.annualFeePercent),
    contributionTiming: input.contributionTiming,
    annualContributionGrowthPercent: String(input.annualContributionGrowthPercent),
    additionalAnnualContribution: String(input.additionalAnnualContribution),
    targetFundingPercent: String(input.targetFundingPercent),
    collegePaymentTiming: input.collegePaymentTiming,
    annualContributionAlert: input.annualContributionAlert === null ? '' : String(input.annualContributionAlert),
    currency: input.currency,
  };
}

function parseDraftNumber(raw: string): number {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') return Number.NaN;
  return Number(cleaned);
}

export function draftToInput(draft: FiveTwentyNineDraft): FiveTwentyNineInput {
  const numbers = Object.fromEntries(
    NUMBER_KEYS.map((key) => [key, parseDraftNumber(draft[key])])
  ) as Pick<FiveTwentyNineInput, (typeof NUMBER_KEYS)[number]>;
  const alert = draft.annualContributionAlert.trim();
  return {
    ...numbers,
    contributionTiming: draft.contributionTiming,
    collegePaymentTiming: draft.collegePaymentTiming,
    annualContributionAlert: alert === '' ? null : parseDraftNumber(alert),
    currency: draft.currency,
  };
}

interface FiveTwentyNineFormProps {
  draft: FiveTwentyNineDraft;
  errors: FiveTwentyNineFieldErrors;
  onDraftChange: (draft: FiveTwentyNineDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function FiveTwentyNineForm({ draft, errors, onDraftChange, onSubmit, onReset }: FiveTwentyNineFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<FiveTwentyNineDraft>) => onDraftChange({ ...draft, ...next });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset className="space-y-3">
        <legend className="text-[13px] font-semibold text-accent">Student and education</legend>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Field id="ftn-age" label="Student's current age" value={draft.currentAge} error={errors.currentAge} onChange={(currentAge) => patch({ currentAge })} />
          <Field id="ftn-start-age" label="Age when college starts" value={draft.collegeStartAge} error={errors.collegeStartAge} hint="Assumed 18 unless you change it." onChange={(collegeStartAge) => patch({ collegeStartAge })} />
          <Field id="ftn-years" label="Number of college years" value={draft.collegeYears} error={errors.collegeYears} hint="Assumed 4 unless you change it." onChange={(collegeYears) => patch({ collegeYears })} />
          <Field id="ftn-cost" label="Current annual education cost" prefix={symbol} value={draft.currentAnnualCost} error={errors.currentAnnualCost} hint="An amount you enter. The default is an illustration, not a tuition survey." onChange={(currentAnnualCost) => patch({ currentAnnualCost })} />
          <Field id="ftn-inflation" label="Expected annual education inflation" suffix="%" value={draft.educationInflationPercent} error={errors.educationInflationPercent} onChange={(educationInflationPercent) => patch({ educationInflationPercent })} />
          <Field id="ftn-scholarship" label="Annual scholarship or grant" prefix={symbol} value={draft.annualScholarship} error={errors.annualScholarship} hint="Today's annual amount. It grows with the same inflation rate and is capped at that year's cost." onChange={(annualScholarship) => patch({ annualScholarship })} />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-[13px] font-semibold text-accent">529 savings</legend>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Field id="ftn-balance" label="Current 529 balance" prefix={symbol} value={draft.currentBalance} error={errors.currentBalance} onChange={(currentBalance) => patch({ currentBalance })} />
          <Field id="ftn-lump" label="Initial lump-sum contribution" prefix={symbol} value={draft.initialLumpSum} error={errors.initialLumpSum} hint="Added today, separate from the monthly deposit." onChange={(initialLumpSum) => patch({ initialLumpSum })} />
          <Field id="ftn-monthly" label="Regular monthly contribution" prefix={symbol} value={draft.monthlyContribution} error={errors.monthlyContribution} onChange={(monthlyContribution) => patch({ monthlyContribution })} />
          <Field id="ftn-return" label="Expected annual investment return" suffix="%" value={draft.annualReturnPercent} error={errors.annualReturnPercent} hint="Divided by 12 for each month. Not a guaranteed return." onChange={(annualReturnPercent) => patch({ annualReturnPercent })} />
          <Field id="ftn-fee" label="Annual investment fees" suffix="%" value={draft.annualFeePercent} error={errors.annualFeePercent} hint="Charged on the balance each month, separate from growth." onChange={(annualFeePercent) => patch({ annualFeePercent })} />
          <SelectField
            id="ftn-timing"
            label="Contribution timing"
            value={draft.contributionTiming}
            error={errors.contributionTiming}
            onChange={(contributionTiming) => patch({ contributionTiming: contributionTiming as ContributionTiming })}
            options={[
              { value: 'end', label: 'End of month' },
              { value: 'beginning', label: 'Beginning of month' },
            ]}
          />
        </div>
      </fieldset>

      <details className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <summary className="cursor-pointer text-[13px] font-semibold text-accent">Advanced options</summary>
        <div className="mt-3 grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Field id="ftn-growth" label="Annual contribution growth" suffix="%" value={draft.annualContributionGrowthPercent} error={errors.annualContributionGrowthPercent} hint="The monthly deposit is multiplied by this rate once each savings year." onChange={(annualContributionGrowthPercent) => patch({ annualContributionGrowthPercent })} />
          <Field id="ftn-extra" label="Additional annual contribution" prefix={symbol} value={draft.additionalAnnualContribution} error={errors.additionalAnnualContribution} hint="Paid at the start of each savings year, including today." onChange={(additionalAnnualContribution) => patch({ additionalAnnualContribution })} />
          <Field id="ftn-target" label="Target share of college expenses" suffix="%" value={draft.targetFundingPercent} error={errors.targetFundingPercent} hint="Share of cost after scholarships that the plan should cover." onChange={(targetFundingPercent) => patch({ targetFundingPercent })} />
          <SelectField
            id="ftn-pay"
            label="College cost payment timing"
            value={draft.collegePaymentTiming}
            error={errors.collegePaymentTiming}
            onChange={(collegePaymentTiming) => patch({ collegePaymentTiming: collegePaymentTiming as CollegePaymentTiming })}
            options={[
              { value: 'start', label: 'Start of each college year' },
              { value: 'end', label: 'End of each college year' },
            ]}
          />
          <div className="min-[420px]:col-span-2">
            <Field
              id="ftn-alert"
              label="Optional annual contribution alert"
              prefix={symbol}
              value={draft.annualContributionAlert}
              error={errors.annualContributionAlert}
              hint="A personal reminder, not an IRS or gift-tax limit. Leave blank to skip it."
              onChange={(annualContributionAlert) => patch({ annualContributionAlert })}
            />
          </div>
        </div>
      </details>

      <div className="flex flex-wrap gap-2.5 pt-1">
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
  error,
  hint,
  prefix,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
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
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        />
        {suffix ? (
          <span className="shrink-0 pr-3 text-xs text-muted-foreground" aria-hidden="true">
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

function SelectField({
  id,
  label,
  value,
  error,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-accent ${
          error ? 'border-rose-500' : 'border-border'
        }`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
