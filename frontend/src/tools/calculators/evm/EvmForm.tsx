'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { EvmFieldErrors, EvmInput } from './types';
import { parseOptionalNumber } from './validation';

export interface EvmDraft {
  scheduledProgressPercent: string;
  actualProgressPercent: string;
  budget: string;
  costs: string;
  currency: EvmInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(currency: EvmInput['currency'] = 'PKR'): EvmDraft {
  return {
    scheduledProgressPercent: '',
    actualProgressPercent: '',
    budget: '',
    costs: '',
    currency,
  };
}

export function draftToInput(draft: EvmDraft): EvmInput {
  return {
    scheduledProgressPercent: parseOptionalNumber(draft.scheduledProgressPercent),
    actualProgressPercent: parseOptionalNumber(draft.actualProgressPercent),
    budget: parseOptionalNumber(draft.budget),
    costs: parseOptionalNumber(draft.costs),
    currency: draft.currency,
  };
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface EvmFormProps {
  draft: EvmDraft;
  errors: EvmFieldErrors;
  onDraftChange: (draft: EvmDraft) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function EvmForm({
  draft,
  errors,
  onDraftChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: EvmFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<EvmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate autoComplete="off">
      <section
        aria-labelledby="evm-task-heading"
        className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4"
      >
        <h3 id="evm-task-heading" className="text-sm font-semibold text-accent">
          Task #1
        </h3>

        <div>
          <label className={labelClass} htmlFor="evm-scheduled">
            <span>Scheduled progress</span>
            <InfoTooltip
              label="Scheduled progress"
              text="Percent of the budgeted work planned to be complete by this date (used for Planned Value)."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.scheduledProgressPercent}>
              <input
                id="evm-scheduled"
                inputMode="decimal"
                className={`${inputClass} pr-8`}
                value={draft.scheduledProgressPercent}
                onChange={(event) => set({ scheduledProgressPercent: event.target.value })}
                aria-invalid={Boolean(errors.scheduledProgressPercent)}
                aria-describedby={
                  errors.scheduledProgressPercent ? 'evm-scheduled-error' : undefined
                }
              />
            </FieldShell>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {errors.scheduledProgressPercent ? (
            <p id="evm-scheduled-error" className="mt-1 text-xs text-rose-600">
              {errors.scheduledProgressPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="evm-actual">
            <span>Actual progress</span>
            <InfoTooltip
              label="Actual progress"
              text="Percent of the budgeted work actually complete (used for Earned Value)."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.actualProgressPercent}>
              <input
                id="evm-actual"
                inputMode="decimal"
                className={`${inputClass} pr-8`}
                value={draft.actualProgressPercent}
                onChange={(event) => set({ actualProgressPercent: event.target.value })}
                aria-invalid={Boolean(errors.actualProgressPercent)}
                aria-describedby={errors.actualProgressPercent ? 'evm-actual-error' : undefined}
              />
            </FieldShell>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {errors.actualProgressPercent ? (
            <p id="evm-actual-error" className="mt-1 text-xs text-rose-600">
              {errors.actualProgressPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="evm-budget">
            <span>Budget</span>
            <InfoTooltip
              label="Budget"
              text="Budget at Completion (BAC) for the task: the total authorized budget for the work."
            />
          </label>
          <div className="flex items-center gap-2">
            <FieldShell error={errors.budget}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="evm-budget"
                inputMode="decimal"
                className={inputClass}
                value={draft.budget}
                onChange={(event) => set({ budget: event.target.value })}
                aria-invalid={Boolean(errors.budget)}
                aria-describedby={errors.budget ? 'evm-budget-error' : undefined}
              />
            </FieldShell>
            <div className="w-[120px] shrink-0 sm:w-[130px]">
              <CurrencySelect
                id="evm-budget-currency"
                aria-label="Budget currency"
                value={draft.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.budget ? (
            <p id="evm-budget-error" className="mt-1 text-xs text-rose-600">
              {errors.budget}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="evm-costs">
            <span>Costs</span>
            <InfoTooltip
              label="Costs"
              text="Actual Cost (AC); money spent on the task to date."
            />
          </label>
          <div className="flex items-center gap-2">
            <FieldShell error={errors.costs}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="evm-costs"
                inputMode="decimal"
                className={inputClass}
                value={draft.costs}
                onChange={(event) => set({ costs: event.target.value })}
                aria-invalid={Boolean(errors.costs)}
                aria-describedby={errors.costs ? 'evm-costs-error' : undefined}
              />
            </FieldShell>
            <div className="w-[120px] shrink-0 sm:w-[130px]">
              <CurrencySelect
                id="evm-costs-currency"
                aria-label="Costs currency"
                value={draft.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.costs ? (
            <p id="evm-costs-error" className="mt-1 text-xs text-rose-600">
              {errors.costs}
            </p>
          ) : null}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
