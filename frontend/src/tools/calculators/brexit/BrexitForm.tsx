'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BrexitFieldErrors,
  BrexitInput,
  BrexitResult,
  CostRateUnit,
  SpendingDetailsInput,
} from './types';
import { spendingDetailsSum } from './types';
import { formatGbp } from './calculation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none bg-transparent px-3 text-sm text-accent outline-none';

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

const RATE_UNITS: { value: CostRateUnit; label: string }[] = [
  { value: 'sec', label: '/ sec' },
  { value: 'day', label: '/ day' },
  { value: 'wk', label: '/ wk' },
  { value: 'yr', label: '/ yr' },
];

interface BrexitFormProps {
  input: BrexitInput;
  errors: BrexitFieldErrors;
  result: BrexitResult | null;
  onChange: (input: BrexitInput) => void;
}

export function BrexitForm({
  input,
  errors,
  result,
  onChange,
}: BrexitFormProps) {
  const set = (patch: Partial<BrexitInput>) => onChange({ ...input, ...patch });

  const setDetail = (patch: Partial<SpendingDetailsInput>) => {
    const spendingDetails = { ...input.spendingDetails, ...patch };
    const sum = spendingDetailsSum(spendingDetails);
    set({
      spendingDetails,
      governmentSpending:
        sum != null ? String(Math.round(sum)) : input.governmentSpending,
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Illustrative educational estimate of unrealised GDP growth plus a
        lump-sum spending add-on — not an official public-finance account.
        Fixed <span className="font-medium text-accent">GBP (£)</span>; no FX
        conversion.
      </p>

      <fieldset className="space-y-4">
        <legend className="text-[15px] font-semibold text-accent">
          How much has Brexit cost?
        </legend>

        <div>
          <label htmlFor="brexit-since" className={labelClass}>
            Since referendum on…
            <InfoTooltip
              label="Since referendum"
              text="Start of the illustrative running total. Default is the June 2016 referendum evening."
            />
          </label>
          <FieldShell error={errors.sinceIsoLocal}>
            <input
              id="brexit-since"
              type="datetime-local"
              className={inputClass}
              value={input.sinceIsoLocal}
              onChange={(e) => set({ sinceIsoLocal: e.target.value })}
              aria-invalid={Boolean(errors.sinceIsoLocal)}
            />
          </FieldShell>
          {errors.sinceIsoLocal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sinceIsoLocal}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="brexit-till" className={labelClass}>
            Till…
            <InfoTooltip
              label="Till"
              text="End of the illustrative window. Leave “Follow live clock” on to keep the total ticking."
            />
          </label>
          <FieldShell error={errors.tillIsoLocal} muted={input.tillFollowsNow}>
            <input
              id="brexit-till"
              type="datetime-local"
              className={inputClass}
              value={input.tillIsoLocal}
              disabled={input.tillFollowsNow}
              onChange={(e) =>
                set({
                  tillIsoLocal: e.target.value,
                  tillFollowsNow: false,
                })
              }
              aria-invalid={Boolean(errors.tillIsoLocal)}
            />
          </FieldShell>
          <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.tillFollowsNow}
              onChange={(e) => set({ tillFollowsNow: e.target.checked })}
            />
            Follow live clock (cost ticks while this page is open)
          </label>
          {errors.tillIsoLocal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.tillIsoLocal}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="brexit-current-cost" className={labelClass}>
            Current cost
            <InfoTooltip
              label="Current cost"
              text="Editable post-2020 weekly GDP-loss rate (default ≈ £70bn ÷ 52). Pre-2020 still uses £440m/week in the model."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentCost}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                £
              </span>
              <input
                id="brexit-current-cost"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.currentCost}
                onChange={(e) => set({ currentCost: e.target.value })}
                aria-invalid={Boolean(errors.currentCost)}
              />
            </FieldShell>
            <div className="w-[7.5rem] shrink-0">
              <FieldShell>
                <select
                  className={selectClass}
                  value={input.currentCostUnit}
                  onChange={(e) =>
                    set({
                      currentCostUnit: e.target.value as CostRateUnit,
                    })
                  }
                  aria-label="Current cost unit"
                >
                  {RATE_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>
          </div>
          {errors.currentCost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentCost}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="brexit-gov" className={labelClass}>
            Total government spending
            <InfoTooltip
              label="Total government spending"
              text="Lump-sum add-on for direct Brexit-related public spending in the illustrative model. Expand details to edit line items."
            />
          </label>
          <FieldShell
            error={errors.governmentSpending}
            muted={input.showCostDetails}
          >
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              £
            </span>
            <input
              id="brexit-gov"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.governmentSpending}
              disabled={input.showCostDetails}
              onChange={(e) => set({ governmentSpending: e.target.value })}
              aria-invalid={Boolean(errors.governmentSpending)}
            />
          </FieldShell>
          {errors.governmentSpending ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.governmentSpending}
            </p>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showCostDetails}
            onChange={(e) => set({ showCostDetails: e.target.checked })}
          />
          Do you want to view and edit cost details?
          <span className="text-xs font-medium text-muted-foreground">
            {input.showCostDetails ? 'Yes' : 'No'}
          </span>
        </label>

        {input.showCostDetails ? (
          <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3">
            {(
              [
                ['euReferendum', 'EU referendum'],
                ['generalElections', 'General elections'],
                ['mpWindingUp', 'MP winding-up costs'],
                ['departmentSpending', 'Department spending (illustrative)'],
                ['euElections2019', '2019 EU elections'],
                ['otherDocumented', 'Other documented add-ons'],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={`brexit-detail-${key}`} className={labelClass}>
                  {label}
                </label>
                <FieldShell error={errors.spendingDetails}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    £
                  </span>
                  <input
                    id={`brexit-detail-${key}`}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.spendingDetails[key]}
                    onChange={(e) => setDetail({ [key]: e.target.value })}
                  />
                </FieldShell>
              </div>
            ))}
            {errors.spendingDetails ? (
              <p className="text-xs text-rose-600">{errors.spendingDetails}</p>
            ) : null}
            {result ? (
              <p className="text-xs text-muted-foreground">
                Details sum to {result.formattedGovernmentSpending}. Breakdown:{' '}
                pre-2020 {formatGbp(result.pre2020LossGbp)} · post-2020{' '}
                {formatGbp(result.post2020LossGbp)}.
              </p>
            ) : null}
          </div>
        ) : null}

        <div>
          <p className={labelClass}>Cost so far</p>
          <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
            <p className="text-2xl font-semibold tabular-nums text-accent">
              {result ? result.formattedCostSoFar : '—'}
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            At refresh, the cost has gone up since you loaded the page. See the
            guide for sources and the dual-rate GDP-loss assumptions.
          </p>
        </div>
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </fieldset>
    </form>
  );
}
