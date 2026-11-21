'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RefinanceFieldErrors,
  RefinanceInput,
  RefinanceResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface RefinanceFormProps {
  input: RefinanceInput;
  errors: RefinanceFieldErrors;
  result: RefinanceResult | null;
  onChange: (input: RefinanceInput) => void;
}

export function RefinanceForm({
  input,
  errors,
  result,
  onChange,
}: RefinanceFormProps) {
  const set = (patch: Partial<RefinanceInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-accent">Current loan</h3>
          <div>
            <label className={labelClass} htmlFor="refi-method">
              <span>Calculation method</span>
            </label>
            <FieldShell>
              <select
                id="refi-method"
                className={`${inputClass} appearance-none`}
                value={input.method}
                onChange={() => set({ method: 'know-balance' })}
              >
                <option value="know-balance">I know my remaining balance</option>
              </select>
            </FieldShell>
          </div>
          <div>
            <label className={labelClass} htmlFor="refi-balance">
              <span>Remaining balance</span>
            </label>
            <FieldShell error={errors.remainingBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="refi-balance"
                className={inputClass}
                inputMode="decimal"
                value={input.remainingBalance}
                aria-invalid={Boolean(errors.remainingBalance)}
                onChange={(e) => set({ remainingBalance: e.target.value })}
              />
            </FieldShell>
            {errors.remainingBalance ? (
              <p className="mt-1 text-xs text-rose-600">{errors.remainingBalance}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="refi-payment">
              <span>Monthly payment</span>
            </label>
            <FieldShell error={errors.monthlyPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="refi-payment"
                className={inputClass}
                inputMode="decimal"
                value={input.monthlyPayment}
                aria-invalid={Boolean(errors.monthlyPayment)}
                onChange={(e) => set({ monthlyPayment: e.target.value })}
              />
            </FieldShell>
            {errors.monthlyPayment ? (
              <p className="mt-1 text-xs text-rose-600">{errors.monthlyPayment}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="refi-current-rate">
              <span>Interest rate</span>
            </label>
            <FieldShell error={errors.currentRatePercent}>
              <input
                id="refi-current-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.currentRatePercent}
                aria-invalid={Boolean(errors.currentRatePercent)}
                onChange={(e) => set({ currentRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.currentRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.currentRatePercent}</p>
            ) : null}
          </div>
        </div>

        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-accent">New loan</h3>
          <div>
            <label className={labelClass} htmlFor="refi-term">
              <span>New loan term</span>
            </label>
            <FieldShell error={errors.newTermYears}>
              <input
                id="refi-term"
                className={`${inputClass} pr-14`}
                inputMode="decimal"
                value={input.newTermYears}
                aria-invalid={Boolean(errors.newTermYears)}
                onChange={(e) => set({ newTermYears: e.target.value })}
              />
              <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
                years
              </span>
            </FieldShell>
            {errors.newTermYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.newTermYears}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="refi-new-rate">
              <span>Interest rate</span>
            </label>
            <FieldShell error={errors.newRatePercent}>
              <input
                id="refi-new-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.newRatePercent}
                aria-invalid={Boolean(errors.newRatePercent)}
                onChange={(e) => set({ newRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.newRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.newRatePercent}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="refi-points">
              <span>Points</span>
              <InfoTooltip
                label="Points"
                text="Upfront cost = new loan amount × points ÷ 100. Not financed into principal in this tool."
              />
            </label>
            <FieldShell error={errors.points}>
              <input
                id="refi-points"
                className={inputClass}
                inputMode="decimal"
                value={input.points}
                aria-invalid={Boolean(errors.points)}
                onChange={(e) => set({ points: e.target.value })}
              />
            </FieldShell>
            {errors.points ? (
              <p className="mt-1 text-xs text-rose-600">{errors.points}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="refi-fees">
              <span>Costs and fees</span>
              <InfoTooltip
                label="Costs and fees"
                text="Other upfront closing costs in USD, added to points for total closing costs."
              />
            </label>
            <FieldShell error={errors.costsAndFees}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="refi-fees"
                className={inputClass}
                inputMode="decimal"
                value={input.costsAndFees}
                aria-invalid={Boolean(errors.costsAndFees)}
                onChange={(e) => set({ costsAndFees: e.target.value })}
              />
            </FieldShell>
            {errors.costsAndFees ? (
              <p className="mt-1 text-xs text-rose-600">{errors.costsAndFees}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="refi-cashout">
              <span>Cash out amount</span>
              <InfoTooltip
                label="Cash out amount"
                text="Extra cash borrowed above the remaining balance. Added to the new loan principal."
              />
            </label>
            <FieldShell error={errors.cashOutAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="refi-cashout"
                className={inputClass}
                inputMode="decimal"
                value={input.cashOutAmount}
                aria-invalid={Boolean(errors.cashOutAmount)}
                onChange={(e) => set({ cashOutAmount: e.target.value })}
              />
            </FieldShell>
            {errors.cashOutAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.cashOutAmount}</p>
            ) : null}
          </div>
        </div>
      </div>

      {result ? (
        <div className={`${sectionClass} space-y-2 text-sm text-accent`}>
          <h3 className="text-sm font-semibold">Results</h3>
          <p>
            Current remaining term:{' '}
            <strong>{result.currentRemainingTermLabel}</strong>
          </p>
          <p>
            Current remaining interest: ${result.formatted.currentInterest}
          </p>
          <p>
            New monthly payment: ${result.formatted.newPayment}
          </p>
          <p>
            New loan amount: ${result.formatted.newLoanAmount}
          </p>
          <p>
            Points cost: ${result.formatted.pointsCost} · Closing costs: $
            {result.formatted.closingCosts}
          </p>
          <p>
            Monthly payment difference: ${result.formatted.monthlyDiff}
          </p>
          <p>
            Interest (current remaining vs new): ${result.formatted.currentTotalInterest}{' '}
            vs ${result.formatted.newTotalInterest} (diff ${result.formatted.interestDiff})
          </p>
          <p>
            Break-even: <strong>{result.breakEvenLabel}</strong>
          </p>
          <p>
            Net savings after closing costs: ${result.formatted.netSavings}
          </p>
        </div>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">Amounts are fixed USD.</p>
    </form>
  );
}
