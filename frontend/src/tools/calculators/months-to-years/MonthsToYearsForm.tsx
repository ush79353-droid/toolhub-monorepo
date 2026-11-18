'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MONTHS_PER_YEAR, type MonthsToYearsFieldErrors, type MonthsToYearsInput, type MonthsToYearsSource } from './types';
import { parseOptionalNumber } from './validation';

export interface MonthsToYearsDraft {
  source: MonthsToYearsSource;
  months: string;
  years: string;
  yearsPart: string;
  monthsPart: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): MonthsToYearsDraft {
  return { source: 'months', months: '', years: '', yearsPart: '', monthsPart: '' };
}

export function draftToInput(draft: MonthsToYearsDraft): MonthsToYearsInput {
  return {
    source: draft.source,
    months: parseOptionalNumber(draft.months),
    years: parseOptionalNumber(draft.years),
    yearsPart: parseOptionalNumber(draft.yearsPart),
    monthsPart: parseOptionalNumber(draft.monthsPart),
  };
}

interface MonthsToYearsFormProps {
  draft: MonthsToYearsDraft;
  errors: MonthsToYearsFieldErrors;
  onDraftChange: (draft: MonthsToYearsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function MonthsToYearsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MonthsToYearsFormProps) {
  const set = (patch: Partial<MonthsToYearsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact calendar convention: 1 year = {MONTHS_PER_YEAR} months. This is duration arithmetic —
        not calendar-date math. Decimal years (e.g. 1.5) differ from years+months notation (1 yr 6
        mo). Signed values are allowed; combined breakdown keeps a single sign on both parts.
      </div>

      <FieldShell
        label="Months"
        htmlFor="mo-yr-months"
        tip={`years = months ÷ ${MONTHS_PER_YEAR}.`}
        error={errors.months}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mo-yr-months"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.months}
              placeholder="Enter months"
              aria-invalid={Boolean(errors.months)}
              onChange={(event) => set({ source: 'months', months: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mo
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Years"
        htmlFor="mo-yr-years"
        tip={`months = years × ${MONTHS_PER_YEAR}.`}
        error={errors.years}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mo-yr-years"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.years}
              placeholder="Enter years"
              aria-invalid={Boolean(errors.years)}
              onChange={(event) => set({ source: 'years', years: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            yr
          </span>
        </div>
      </FieldShell>

      <div>
        <p className={labelClass}>
          Years / Months
          <InfoTooltip
            label="Years / Months"
            text="Enter whole years and remaining months. Values like 2 yr + 15 mo normalize to 3 yr 3 mo."
          />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="mo-yr-years-part"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.yearsPart}
                  placeholder="Years"
                  aria-label="Years part"
                  aria-invalid={Boolean(errors.yearsPart)}
                  onChange={(event) =>
                    set({ source: 'yearsMonths', yearsPart: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                yr
              </span>
            </div>
            {errors.yearsPart ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.yearsPart}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="mo-yr-months-part"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.monthsPart}
                  placeholder="Months"
                  aria-label="Months part"
                  aria-invalid={Boolean(errors.monthsPart)}
                  onChange={(event) =>
                    set({ source: 'yearsMonths', monthsPart: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                mo
              </span>
            </div>
            {errors.monthsPart ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.monthsPart}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        1 yr = {MONTHS_PER_YEAR} mo · years = months ÷ {MONTHS_PER_YEAR}
      </p>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
