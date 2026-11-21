'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { GSS_I_INFO } from './types';
import type {
  CaliforniaStimulusCheckIiFieldErrors,
  CaliforniaStimulusCheckIiInput,
  CaliforniaStimulusCheckIiResult,
  PaymentMethod,
  TaxFileId,
  YesNo,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function RadioYesNo({
  name,
  value,
  onChange,
}: {
  name: string;
  value: YesNo;
  onChange: (next: YesNo) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-accent">
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === 'yes'}
          onChange={() => onChange('yes')}
        />
        Yes
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={value === 'no'}
          onChange={() => onChange('no')}
        />
        No
      </label>
    </div>
  );
}

interface CaliforniaStimulusCheckIiFormProps {
  input: CaliforniaStimulusCheckIiInput;
  errors: CaliforniaStimulusCheckIiFieldErrors;
  result: CaliforniaStimulusCheckIiResult | null;
  onChange: (input: CaliforniaStimulusCheckIiInput) => void;
}

export function CaliforniaStimulusCheckIiForm({
  input,
  errors,
  result,
  onChange,
}: CaliforniaStimulusCheckIiFormProps) {
  const set = (patch: Partial<CaliforniaStimulusCheckIiInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-border bg-muted/15 p-3.5 text-[13px] leading-relaxed text-foreground/85 sm:p-4 sm:text-sm">
        <p>
          On August 27, 2021, Californians began receiving the second round of Golden State Stimulus
          payments introduced by Gavin Newsom, the governor of California. This stimulus check is
          expected to{' '}
          <strong className="font-semibold text-accent">
            provide a short-term financial boost to more than 66% of Californians.
          </strong>{' '}
          This tool helps you calculate the stimulus you are eligible for under the{' '}
          <strong className="font-semibold text-accent">Golden State Stimulus II.</strong>
        </p>
        {result ? (
          <p className="mt-3 text-xs leading-relaxed text-amber-900 sm:text-[13px]">
            {result.programClosedNotice}
          </p>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-amber-900 sm:text-[13px]">
 Historical program only; GSS II distributions concluded; FTB reports no new Golden State
            Stimulus payments since July 15, 2022.
          </p>
        )}
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Golden State Stimulus II criteria
        </legend>

        <div>
          <label className={labelClass} htmlFor="gss2-agi">
            <span>What is your California Adjusted Gross Income?</span>
          </label>
          <FieldShell error={errors.californiaAgi}>
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <input
              id="gss2-agi"
              className={`${inputClass} pl-7`}
              inputMode="decimal"
              value={input.californiaAgi}
              aria-invalid={Boolean(errors.californiaAgi)}
              onChange={(e) => set({ californiaAgi: e.target.value })}
            />
          </FieldShell>
          {errors.californiaAgi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.californiaAgi}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Fixed USD. Use 2020 California AGI (Form 540 line 17 or 540 2EZ line 16).
            </p>
          )}
        </div>

        <div>
          <p className={labelClass}>
            <span>Have you been a California resident for more than half of 2020?</span>
          </p>
          <RadioYesNo
            name="gss2-resident"
            value={input.californiaResident2020}
            onChange={(californiaResident2020) => set({ californiaResident2020 })}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Golden State Stimulus II</legend>

        <div>
          <p className={labelClass}>
            <span>Tax file</span>
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gss2-tax-file"
                checked={input.taxFileId === 'ssn'}
                onChange={() => set({ taxFileId: 'ssn' as TaxFileId })}
              />
              SSN
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gss2-tax-file"
                checked={input.taxFileId === 'itin'}
                onChange={() => set({ taxFileId: 'itin' as TaxFileId })}
              />
              ITIN
            </label>
          </div>
        </div>

        <div>
          <p className={labelClass}>
            <span>Are you qualified for the Golden State Stimulus I?</span>
            <InfoTooltip label="Golden State Stimulus I" text={GSS_I_INFO} />
          </p>
          <RadioYesNo
            name="gss2-gssi"
            value={input.qualifiedGssI}
            onChange={(qualifiedGssI) => set({ qualifiedGssI })}
          />
        </div>

        <div>
          <p className={labelClass}>
            <span>Have you claimed at least one child dependent?</span>
          </p>
          <RadioYesNo
            name="gss2-dependent"
            value={input.claimedChildDependent}
            onChange={(claimedChildDependent) => set({ claimedChildDependent })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Maps to claiming a dependent exemption credit on the 2020 California return (FTB /
            §8150.2).
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          When will you receive the payment?
        </legend>

        <div>
          <p className={labelClass}>
            <span>What payment method did you opt for?</span>
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gss2-pay-method"
                checked={input.paymentMethod === 'direct-deposit'}
                onChange={() => set({ paymentMethod: 'direct-deposit' as PaymentMethod })}
              />
              Direct deposit
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gss2-pay-method"
                checked={input.paymentMethod === 'paper-check'}
                onChange={() => set({ paymentMethod: 'paper-check' as PaymentMethod })}
              />
              Paper check
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="gss2-filing-date">
            <span>Tax filing date</span>
          </label>
          <FieldShell error={errors.taxFilingDate}>
            <input
              id="gss2-filing-date"
              type="date"
              className={inputClass}
              value={input.taxFilingDate}
              aria-invalid={Boolean(errors.taxFilingDate)}
              onChange={(e) => set({ taxFilingDate: e.target.value })}
            />
          </FieldShell>
          {errors.taxFilingDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.taxFilingDate}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Historical 2020 California return filing date (MM/DD/YYYY via date picker). Used for
 deadline and timing guidance only; not a fabricated personal payment date.
            </p>
          )}
        </div>
      </fieldset>

      {result ? (
        <div
          className="space-y-2.5 rounded-xl border border-border bg-white px-3.5 py-3 sm:px-4"
          role="status"
        >
          <p className="text-[13px] font-semibold text-accent sm:text-sm">Historical estimate</p>
          {result.formattedPaymentAmount ? (
            <p className="text-2xl font-semibold tabular-nums text-accent">
              {result.formattedPaymentAmount}
            </p>
          ) : (
            <p className="text-sm font-medium text-accent">No GSS II payment under these answers</p>
          )}
          <p className="text-xs leading-relaxed text-foreground/85 sm:text-[13px]">
            {result.eligibilitySummary}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">Payment timing (historical): </span>
            {result.historicalTimingGuidance}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">{result.assumptionsNote}</p>
        </div>
      ) : null}

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
