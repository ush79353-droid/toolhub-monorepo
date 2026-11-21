'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HomeValueMetroOption,
  HomeValueUsFieldErrors,
  HomeValueUsInput,
  IndexSeriesSnapshot,
  ValuationMode,
} from './types';
import { MONTH_OPTIONS, periodLabel } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function yearsInRange(firstPeriod: string, latestPeriod: string): number[] {
  const firstYear = Number(firstPeriod.slice(0, 4));
  const latestYear = Number(latestPeriod.slice(0, 4));
  if (!Number.isFinite(firstYear) || !Number.isFinite(latestYear)) return [];
  const years: number[] = [];
  for (let y = latestYear; y >= firstYear; y -= 1) years.push(y);
  return years;
}

function monthsForYear(
  year: string,
  firstPeriod: string,
  latestPeriod: string
): typeof MONTH_OPTIONS[number][] {
  if (!year) return [...MONTH_OPTIONS];
  return MONTH_OPTIONS.filter((m) => {
    const period = `${year}-${m.value}`;
    return period >= firstPeriod && period <= latestPeriod;
  });
}

interface HomeValueUsFormProps {
  input: HomeValueUsInput;
  errors: HomeValueUsFieldErrors;
  metros: HomeValueMetroOption[];
  homeIndex: IndexSeriesSnapshot | null;
  loadingData: boolean;
  dataError: string | null;
  onChange: (input: HomeValueUsInput) => void;
}

export function HomeValueUsForm({
  input,
  errors,
  metros,
  homeIndex,
  loadingData,
  dataError,
  onChange,
}: HomeValueUsFormProps) {
  const set = (patch: Partial<HomeValueUsInput>) =>
    onChange({ ...input, ...patch });

  const firstPeriod = homeIndex?.firstPeriod ?? '1987-01';
  const latestPeriod = homeIndex?.latestPeriod ?? '2026-08';
  const yearOptions = yearsInRange(firstPeriod, latestPeriod);
  const purchaseMonths = monthsForYear(
    input.purchaseYear,
    firstPeriod,
    latestPeriod
  );
  const valuationMonths = monthsForYear(
    input.valuationYear,
    firstPeriod,
    latestPeriod
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-xs text-muted-foreground">
        USD-only estimate using verified S&P CoreLogic Case-Shiller metro
 indices and CPI-U (NSA) from FRED. Index points are not dollar amounts; 
        their ratio scales your purchase price.
      </p>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.yourHomeOpen}
        onToggle={(event) => set({ yourHomeOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.yourHomeOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Your home</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="hvu-metro">
              <span>Your metro area</span>
              <InfoTooltip
                label="Metro area"
                text="Only metros with a published Case-Shiller series on FRED are listed. The selected series determines available dates."
              />
            </label>
            <select
              id="hvu-metro"
              className={selectClass}
              value={input.metroId}
              aria-invalid={Boolean(errors.metroId)}
              onChange={(e) =>
                set({
                  metroId: e.target.value,
                  purchaseYear: '',
                  purchaseMonth: '',
                  valuationYear: '',
                  valuationMonth: '',
                })
              }
            >
              {metros.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            {errors.metroId ? (
              <p className="mt-1 text-xs text-rose-600">{errors.metroId}</p>
            ) : null}
            {homeIndex ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Coverage: {periodLabel(homeIndex.firstPeriod)} –{' '}
                {periodLabel(homeIndex.latestPeriod)} · {homeIndex.fredSeriesId}
                {loadingData ? ' · refreshing…' : ''}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                {loadingData
                  ? 'Loading Case-Shiller observations from FRED…'
                  : 'Select a metro to load index history.'}
              </p>
            )}
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="hvu-year">
                <span>Year of purchase</span>
              </label>
              <select
                id="hvu-year"
                className={selectClass}
                value={input.purchaseYear}
                disabled={!homeIndex}
                aria-invalid={Boolean(errors.purchaseYear)}
                onChange={(e) =>
                  set({ purchaseYear: e.target.value, purchaseMonth: '' })
                }
              >
                <option value="">Select year</option>
                {yearOptions.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.purchaseYear ? (
                <p className="mt-1 text-xs text-rose-600">{errors.purchaseYear}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="hvu-month">
                <span>Month of purchase</span>
              </label>
              <select
                id="hvu-month"
                className={selectClass}
                value={input.purchaseMonth}
                disabled={!homeIndex || !input.purchaseYear}
                aria-invalid={Boolean(errors.purchaseMonth)}
                onChange={(e) => set({ purchaseMonth: e.target.value })}
              >
                <option value="">Select month</option>
                {purchaseMonths.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {errors.purchaseMonth ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.purchaseMonth}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="hvu-price">
              <span>Your home purchase price</span>
              <InfoTooltip
                label="Purchase price"
                text="Original US dollar purchase price. No FX conversion; this calculator is USD-only."
              />
            </label>
            <FieldShell error={errors.purchasePrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden
              >
                $
              </span>
              <input
                id="hvu-price"
                className={inputClass}
                inputMode="decimal"
                value={input.purchasePrice}
                aria-invalid={Boolean(errors.purchasePrice)}
                onChange={(e) => set({ purchasePrice: e.target.value })}
              />
            </FieldShell>
            {errors.purchasePrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.purchasePrice}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.valuationOpen}
        onToggle={(event) => set({ valuationOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.valuationOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Home valuation</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <fieldset>
            <legend className={labelClass}>I would like to know the</legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="hvu-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.valuationMode === 'present'}
                  onChange={() =>
                    set({
                      valuationMode: 'present' satisfies ValuationMode,
                      valuationYear: '',
                      valuationMonth: '',
                    })
                  }
                />
                Present value
              </label>
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="hvu-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.valuationMode === 'past'}
                  onChange={() =>
                    set({ valuationMode: 'past' satisfies ValuationMode })
                  }
                />
                Past value
              </label>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Present value uses the latest published Case-Shiller observation
              for the selected metro
              {homeIndex
                ? ` (${periodLabel(homeIndex.latestPeriod)})`
                : ''}
              , which may lag the current calendar month.
            </p>
          </fieldset>

          {input.valuationMode === 'past' ? (
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="hvu-val-year">
                  <span>Valuation year</span>
                </label>
                <select
                  id="hvu-val-year"
                  className={selectClass}
                  value={input.valuationYear}
                  disabled={!homeIndex}
                  aria-invalid={Boolean(errors.valuationYear)}
                  onChange={(e) =>
                    set({ valuationYear: e.target.value, valuationMonth: '' })
                  }
                >
                  <option value="">Select year</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
                {errors.valuationYear ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.valuationYear}
                  </p>
                ) : null}
              </div>
              <div>
                <label className={labelClass} htmlFor="hvu-val-month">
                  <span>Valuation month</span>
                </label>
                <select
                  id="hvu-val-month"
                  className={selectClass}
                  value={input.valuationMonth}
                  disabled={!homeIndex || !input.valuationYear}
                  aria-invalid={Boolean(errors.valuationMonth)}
                  onChange={(e) => set({ valuationMonth: e.target.value })}
                >
                  <option value="">Select month</option>
                  {valuationMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {errors.valuationMonth ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.valuationMonth}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </details>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {dataError ? (
        <p className="text-xs text-rose-600" role="alert">
          {dataError}
        </p>
      ) : null}
      {errors.data ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.data}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
