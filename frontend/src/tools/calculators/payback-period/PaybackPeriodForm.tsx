'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  BASE_YEAR_COUNT,
  EXTENDED_YEAR_COUNT,
  type PaybackPeriodFieldErrors,
  type PaybackPeriodInput,
  type PaybackPeriodResult,
  type PaybackUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="rounded-xl border border-border bg-muted/15">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3.5 px-4 pb-4">{children}</div>
    </details>
  );
}

interface PaybackPeriodFormProps {
  input: PaybackPeriodInput;
  errors: PaybackPeriodFieldErrors;
  result: PaybackPeriodResult | null;
  onChange: (input: PaybackPeriodInput) => void;
  onReset: () => void;
}

export function PaybackPeriodForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: PaybackPeriodFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PaybackPeriodInput>) => onChange({ ...input, ...patch });
  const yearCount = input.includeMoreYears ? EXTENDED_YEAR_COUNT : BASE_YEAR_COUNT;

  const setYear = (index: number, value: string) => {
    const next = [...input.yearCashFlows];
    while (next.length < EXTENDED_YEAR_COUNT) next.push('0.00');
    next[index] = value;
    set({ yearCashFlows: next });
  };

  const unitSelect = (
    id: string,
    value: PaybackUnit,
    onUnit: (unit: PaybackUnit) => void,
    ariaLabel: string
  ) => (
    <select
      id={id}
      className={selectClass}
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onUnit(event.target.value as PaybackUnit)}
    >
      <option value="years">yrs</option>
      <option value="months">mos</option>
    </select>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <Section title="Main inputs">
        <div>
          <label className={labelClass} htmlFor="pp-discount">
            <span>Discount rate</span>
            <InfoTooltip
              label="Discount rate"
              text="Annual discount rate for discounted payback. Blank is treated as 0%."
            />
          </label>
          <FieldShell error={errors.discountRate}>
            <input
              id="pp-discount"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.discountRate}
              aria-invalid={Boolean(errors.discountRate)}
              onChange={(event) => set({ discountRate: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.discountRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountRate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pp-investment">
            <span>Initial investment</span>
            <InfoTooltip
              label="Initial investment"
              text="Upfront project cost to recover from cash flows."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialInvestment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="pp-investment"
                className={inputClass}
                inputMode="decimal"
                value={input.initialInvestment}
                aria-invalid={Boolean(errors.initialInvestment)}
                onChange={(event) => set({ initialInvestment: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pp-investment-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Initial investment currency"
              />
            </div>
          </div>
          {errors.initialInvestment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
          ) : null}
        </div>
      </Section>

      <Section title="Steady cash flow">
        <div>
          <label className={labelClass} htmlFor="pp-annual-cf">
            <span>Annual cash flow</span>
            <InfoTooltip
              label="Annual cash flow"
              text="Level annual cash inflow used only for the steady scenario (not added to irregular years)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualCashFlow}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="pp-annual-cf"
                className={inputClass}
                inputMode="decimal"
                value={input.annualCashFlow}
                aria-invalid={Boolean(errors.annualCashFlow)}
                onChange={(event) => set({ annualCashFlow: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pp-annual-cf-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Annual cash flow currency"
              />
            </div>
          </div>
          {errors.annualCashFlow ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualCashFlow}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pp-steady-payback">
            Payback period
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <input
                id="pp-steady-payback"
                className={`${inputClass} cursor-default font-semibold`}
                readOnly
                value={result?.steadyPaybackDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </FieldShell>
            {unitSelect(
              'pp-steady-payback-unit',
              input.steadyPaybackUnit,
              (steadyPaybackUnit) => set({ steadyPaybackUnit }),
              'Steady payback unit'
            )}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="pp-steady-discounted">
            <span>Discounted payback period</span>
            <InfoTooltip
              label="Discounted payback period"
              text="Years until discounted steady cash flows recover the initial investment."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <input
                id="pp-steady-discounted"
                className={`${inputClass} cursor-default font-semibold`}
                readOnly
                value={result?.steadyDiscountedDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </FieldShell>
            {unitSelect(
              'pp-steady-discounted-unit',
              input.steadyDiscountedUnit,
              (steadyDiscountedUnit) => set({ steadyDiscountedUnit }),
              'Steady discounted payback unit'
            )}
          </div>
        </div>
      </Section>

      <Section title="Irregular cash flow">
        {Array.from({ length: yearCount }, (_, index) => {
          const id = `pp-year-${index + 1}`;
          return (
            <div key={id}>
              <label className={labelClass} htmlFor={id}>
                Year {index + 1}
              </label>
              <div className="flex gap-2">
                <FieldShell>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                    {symbol}
                  </span>
                  <input
                    id={id}
                    className={inputClass}
                    inputMode="decimal"
                    value={input.yearCashFlows[index] ?? '0.00'}
                    onChange={(event) => setYear(index, event.target.value)}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id={`${id}-currency`}
                    value={input.currency}
                    onChange={(currency) => set({ currency })}
                    aria-label={`Year ${index + 1} currency`}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.includeMoreYears}
            onChange={(event) => set({ includeMoreYears: event.target.checked })}
          />
          Include more years
        </label>
        {errors.years ? <p className="text-xs text-rose-600">{errors.years}</p> : null}

        <div>
          <label className={labelClass} htmlFor="pp-irregular-payback">
            Payback period
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <input
                id="pp-irregular-payback"
                className={`${inputClass} cursor-default font-semibold`}
                readOnly
                value={result?.irregularPaybackDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </FieldShell>
            {unitSelect(
              'pp-irregular-payback-unit',
              input.irregularPaybackUnit,
              (irregularPaybackUnit) => set({ irregularPaybackUnit }),
              'Irregular payback unit'
            )}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="pp-irregular-discounted">
            Discounted payback period
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <input
                id="pp-irregular-discounted"
                className={`${inputClass} cursor-default font-semibold`}
                readOnly
                value={result?.irregularDiscountedDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </FieldShell>
            {unitSelect(
              'pp-irregular-discounted-unit',
              input.irregularDiscountedUnit,
              (irregularDiscountedUnit) => set({ irregularDiscountedUnit }),
              'Irregular discounted payback unit'
            )}
          </div>
        </div>
      </Section>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
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
