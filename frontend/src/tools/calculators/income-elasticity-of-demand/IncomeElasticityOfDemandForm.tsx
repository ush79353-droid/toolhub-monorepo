'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  IncomeElasticityMethod,
  IncomeElasticityOfDemandFieldErrors,
  IncomeElasticityOfDemandInput,
  IncomeElasticityOfDemandResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface IncomeElasticityOfDemandFormProps {
  input: IncomeElasticityOfDemandInput;
  errors: IncomeElasticityOfDemandFieldErrors;
  result: IncomeElasticityOfDemandResult | null;
  onChange: (input: IncomeElasticityOfDemandInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function IncomeElasticityOfDemandForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: IncomeElasticityOfDemandFormProps) {
  const [methodOpen, setMethodOpen] = useState(true);
  const [incomeOpen, setIncomeOpen] = useState(true);
  const [demandOpen, setDemandOpen] = useState(true);
  const [resultOpen, setResultOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<IncomeElasticityOfDemandInput>) => {
    onChange({ ...input, ...patch });
  };

  const incomeChangeDisplay = result
    ? `${result.formattedIncomePercentageChange}%`
    : '';
  const quantityChangeDisplay = result
    ? `${result.formattedQuantityPercentageChange}%`
    : '';
  const yedDisplay = result?.formattedIncomeElasticity ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for income amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Income uses one display currency (denomination). Changing currency does
        not convert figures. Quantity has no currency symbol. YED is
 dimensionless; not a percent.
      </p>

      <CollapsibleSection
        title="Method"
        open={methodOpen}
        onToggle={() => setMethodOpen((o) => !o)}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="yed-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'standard'}
              onChange={() =>
                set({ method: 'standard' satisfies IncomeElasticityMethod })
              }
            />
            Standard
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="yed-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'midpoint'}
              onChange={() =>
                set({ method: 'midpoint' satisfies IncomeElasticityMethod })
              }
            />
            Midpoint
          </label>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {input.method === 'midpoint'
            ? 'Midpoint percentages use averages of the two observations and are symmetric if you reverse the points.'
            : 'Standard percentages divide by period-1 values. Reversing observation order can change the coefficient.'}
        </p>
      </CollapsibleSection>

      <CollapsibleSection
        title="Income"
        open={incomeOpen}
        onToggle={() => setIncomeOpen((o) => !o)}
      >
        <div>
          <label htmlFor="yed-y1" className={labelClass}>
            Income in period 1
            <InfoTooltip
              label="Income in period 1"
              text="Consumer income in the initial observation period. Must be positive."
            />
          </label>
          <FieldShell error={errors.incomePeriod1}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="yed-y1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.incomePeriod1}
              onChange={(e) => set({ incomePeriod1: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.incomePeriod1)}
            />
          </FieldShell>
          {errors.incomePeriod1 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.incomePeriod1}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="yed-y2" className={labelClass}>
            Income in period 2
            <InfoTooltip
              label="Income in period 2"
              text="Consumer income in the second observation period. Must be positive."
            />
          </label>
          <FieldShell error={errors.incomePeriod2}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="yed-y2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.incomePeriod2}
              onChange={(e) => set({ incomePeriod2: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.incomePeriod2)}
            />
          </FieldShell>
          {errors.incomePeriod2 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.incomePeriod2}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="yed-dy" className={labelClass}>
            Change in income
            <InfoTooltip
              label="Change in income"
              text="Percentage change in income under the selected Standard or Midpoint method."
            />
          </label>
          <FieldShell muted>
            <input
              id="yed-dy"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={incomeChangeDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Demand"
        open={demandOpen}
        onToggle={() => setDemandOpen((o) => !o)}
      >
        <div>
          <label htmlFor="yed-q1" className={labelClass}>
            Quantity demanded in period 1
            <InfoTooltip
              label="Quantity demanded in period 1"
              text="Quantity demanded in the initial period. Must be positive for the Standard method. No currency symbol."
            />
          </label>
          <FieldShell error={errors.quantityPeriod1}>
            <input
              id="yed-q1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.quantityPeriod1}
              onChange={(e) => set({ quantityPeriod1: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.quantityPeriod1)}
            />
          </FieldShell>
          {errors.quantityPeriod1 ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.quantityPeriod1}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="yed-q2" className={labelClass}>
            Quantity demanded in period 2
            <InfoTooltip
              label="Quantity demanded in period 2"
              text="Quantity demanded in the second period. Zero is allowed; negatives are not."
            />
          </label>
          <FieldShell error={errors.quantityPeriod2}>
            <input
              id="yed-q2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.quantityPeriod2}
              onChange={(e) => set({ quantityPeriod2: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.quantityPeriod2)}
            />
          </FieldShell>
          {errors.quantityPeriod2 ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.quantityPeriod2}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="yed-dq" className={labelClass}>
            Change in quantity
            <InfoTooltip
              label="Change in quantity"
              text="Percentage change in quantity demanded under the selected method."
            />
          </label>
          <FieldShell muted>
            <input
              id="yed-dq"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={quantityChangeDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Result"
        open={resultOpen}
        onToggle={() => setResultOpen((o) => !o)}
      >
        <div>
          <label htmlFor="yed-result" className={labelClass}>
            Income elasticity of demand
            <InfoTooltip
              label="Income elasticity of demand"
              text="YED = %Δ quantity ÷ %Δ income. Dimensionless coefficient; no % or currency symbol."
            />
          </label>
          <FieldShell muted>
            <input
              id="yed-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={yedDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
