'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PostJudgmentInterestFieldErrors,
  PostJudgmentInterestInput,
  PostJudgmentInterestResult,
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

interface PostJudgmentInterestFormProps {
  input: PostJudgmentInterestInput;
  errors: PostJudgmentInterestFieldErrors;
  result: PostJudgmentInterestResult | null;
  onChange: (input: PostJudgmentInterestInput) => void;
}

export function PostJudgmentInterestForm({
  input,
  errors,
  result,
  onChange,
}: PostJudgmentInterestFormProps) {
  const set = (patch: Partial<PostJudgmentInterestInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Post-judgment interest
        </legend>

        <div>
          <label className={labelClass} htmlFor="pji-amount">
            <span>Judgment amount</span>
            <InfoTooltip
              label="Judgment amount"
              text="Principal judgment amount in USD. Fixed denomination; no currency conversion."
            />
          </label>
          <FieldShell error={errors.judgmentAmount}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="pji-amount"
              className={inputClass}
              inputMode="decimal"
              value={input.judgmentAmount}
              aria-invalid={Boolean(errors.judgmentAmount)}
              onChange={(e) => set({ judgmentAmount: e.target.value })}
            />
          </FieldShell>
          {errors.judgmentAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.judgmentAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pji-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Annual simple interest rate (%). Confirm the applicable statutory rate; this tool does not fetch a rate."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="pji-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pji-judgment-date">
            <span>Date of judgment</span>
            <InfoTooltip
              label="Date of judgment"
              text="Civil date the judgment was entered. Interest accrues from this date to the writ date."
            />
          </label>
          <FieldShell error={errors.judgmentDate}>
            <input
              id="pji-judgment-date"
              type="date"
              className={inputClass}
              value={input.judgmentDate}
              aria-invalid={Boolean(errors.judgmentDate)}
              onChange={(e) => set({ judgmentDate: e.target.value })}
            />
          </FieldShell>
          {errors.judgmentDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.judgmentDate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pji-writ-date">
            <span>Date of writ</span>
            <InfoTooltip
              label="Date of writ"
              text="Civil end date for the accrual period (for example, writ of execution). Must be on or after the judgment date."
            />
          </label>
          <FieldShell error={errors.writDate}>
            <input
              id="pji-writ-date"
              type="date"
              className={inputClass}
              value={input.writDate}
              aria-invalid={Boolean(errors.writDate)}
              onChange={(e) => set({ writDate: e.target.value })}
            />
          </FieldShell>
          {errors.writDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.writDate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pji-weeks">
            <span>Time passed</span>
            <InfoTooltip
              label="Time passed"
              text="Elapsed civil days between judgment and writ, shown as whole weeks and leftover days."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell muted>
              <input
                id="pji-weeks"
                className={`${inputClass} pr-10 font-semibold`}
                readOnly
                value={result ? result.formattedWeeks : ''}
                aria-live="polite"
                aria-label="Weeks passed"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                wks
              </span>
            </FieldShell>
            <FieldShell muted>
              <input
                id="pji-days"
                className={`${inputClass} pr-12 font-semibold`}
                readOnly
                value={result ? result.formattedLeftoverDays : ''}
                aria-live="polite"
                aria-label="Leftover days"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                days
              </span>
            </FieldShell>
          </div>
          {result ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.elapsedDays} calendar day{result.elapsedDays === 1 ? '' : 's'} elapsed
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pji-interest">
            <span>Accumulated interest</span>
            <InfoTooltip
              label="Accumulated interest"
              text="Simple interest = judgment × (rate/100) × (elapsed days/365). Full precision; rounded for display only."
            />
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="pji-interest"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedAccumulatedInterest : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div className="rounded-lg border border-brand-softTeal/60 bg-brand-softTeal/30 px-3 py-2.5 text-xs leading-relaxed text-accent sm:text-sm">
          Check the interest rate value on the{' '}
          <a
            href="https://www.federalreserve.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Federal Reserve website
          </a>
          !
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
