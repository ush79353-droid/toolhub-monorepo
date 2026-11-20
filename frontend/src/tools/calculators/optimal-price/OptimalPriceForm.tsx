'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  OptimalPriceFieldErrors,
  OptimalPriceInput,
  OptimalPriceResult,
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

function MoneyInput({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          aria-invalid={Boolean(error)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function QtyInput({
  id,
  label,
  tip,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          aria-invalid={Boolean(error)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ReadOnlyMoney({
  id,
  label,
  tip,
  value,
  symbol,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  symbol: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <FieldShell muted>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default text-muted-foreground`}
          value={value}
          placeholder="—"
          aria-readonly="true"
        />
      </FieldShell>
    </div>
  );
}

interface OptimalPriceFormProps {
  input: OptimalPriceInput;
  errors: OptimalPriceFieldErrors;
  result: OptimalPriceResult | null;
  onChange: (input: OptimalPriceInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function OptimalPriceForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: OptimalPriceFormProps) {
  const [mcOpen, setMcOpen] = useState(true);
  const [pedOpen, setPedOpen] = useState(true);
  const [optOpen, setOptOpen] = useState(true);
  const [profitOpen, setProfitOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<OptimalPriceInput>) => {
    onChange({ ...input, ...patch });
  };

  const noOptimum = result?.status === 'noFiniteOptimum';

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
          aria-label="Currency for prices and costs"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (no FX conversion). Optimization uses
        constant-elasticity demand calibrated from the two price–quantity
        observations; MR is optional and diagnostic only.
      </p>

      <CollapsibleSection
        title="Marginal cost and revenue"
        open={mcOpen}
        onToggle={() => setMcOpen((o) => !o)}
      >
        <MoneyInput
          id="op-mc"
          label="Marginal costs"
          tip="Additional cost of producing or selling one more unit (constant MC assumed)."
          value={input.marginalCost}
          error={errors.marginalCost}
          symbol={symbol}
          onChange={(v) => set({ marginalCost: v })}
        />
        <MoneyInput
          id="op-mr"
          label="Marginal revenue"
          tip="Optional observed MR for diagnostic comparison with MR implied at the initial price."
          value={input.marginalRevenue}
          error={errors.marginalRevenue}
          symbol={symbol}
          onChange={(v) => set({ marginalRevenue: v })}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Price elasticity of demand"
        open={pedOpen}
        onToggle={() => setPedOpen((o) => !o)}
      >
        <MoneyInput
          id="op-p1"
          label="Initial price"
          tip="Original selling price before the observed change."
          value={input.initialPrice}
          error={errors.initialPrice}
          symbol={symbol}
          onChange={(v) => set({ initialPrice: v })}
        />
        <QtyInput
          id="op-q1"
          label="Initial quantity"
          tip="Units demanded at the initial price (must be positive for log calibration)."
          value={input.initialQuantity}
          error={errors.initialQuantity}
          onChange={(v) => set({ initialQuantity: v })}
        />
        <MoneyInput
          id="op-p2"
          label="Final price"
          tip="New selling price after the observed change (must differ from initial)."
          value={input.finalPrice}
          error={errors.finalPrice}
          symbol={symbol}
          onChange={(v) => set({ finalPrice: v })}
        />
        <QtyInput
          id="op-q2"
          label="Final quantity"
          tip="Units demanded at the final price (must be positive for log calibration)."
          value={input.finalQuantity}
          error={errors.finalQuantity}
          onChange={(v) => set({ finalQuantity: v })}
        />
        <div>
          <label htmlFor="op-ped" className={labelClass}>
            Price elasticity of demand
            <InfoTooltip
              label="Price elasticity of demand"
              text="Constant-elasticity calibration ε = ln(Q2/Q1)/ln(P2/P1). Dimensionless."
            />
          </label>
          <FieldShell muted>
            <input
              id="op-ped"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedConstantElasticity ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
          {result?.formattedMidpointElasticity ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Midpoint (arc) estimate: {result.formattedMidpointElasticity}{' '}
              (descriptive only)
            </p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Optimum"
        open={optOpen}
        onToggle={() => setOptOpen((o) => !o)}
      >
        <ReadOnlyMoney
          id="op-pstar"
          label="Optimal price"
          tip="P* = MC × ε/(ε+1) when MC > 0 and ε < −1."
          value={
            noOptimum
              ? 'Unavailable'
              : (result?.formattedOptimalPrice ?? '')
          }
          symbol={noOptimum ? '' : symbol}
        />
        <div>
          <label htmlFor="op-qstar" className={labelClass}>
            Optimal quantity
            <InfoTooltip
              label="Optimal quantity"
              text="Q* = Q0 × (P*/P0)^ε under constant-elasticity demand."
            />
          </label>
          <FieldShell muted>
            <input
              id="op-qstar"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                noOptimum
                  ? 'Unavailable'
                  : (result?.formattedOptimalQuantity ?? '')
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Total profit figures"
        open={profitOpen}
        onToggle={() => setProfitOpen((o) => !o)}
      >
        <ReadOnlyMoney
          id="op-pi1"
          label="Profit at initial price"
          tip="Estimated profit before fixed costs: (P1 − MC) × Q1."
          value={result?.formattedProfitAtInitial ?? ''}
          symbol={symbol}
        />
        <ReadOnlyMoney
          id="op-pi2"
          label="Profit at final price"
          tip="Estimated profit before fixed costs: (P2 − MC) × Q2."
          value={result?.formattedProfitAtFinal ?? ''}
          symbol={symbol}
        />
        <ReadOnlyMoney
          id="op-pistar"
          label="Profit at optimal price"
          tip="Estimated profit before fixed costs at P* and Q*."
          value={
            noOptimum
              ? 'Unavailable'
              : (result?.formattedProfitAtOptimal ?? '')
          }
          symbol={noOptimum ? '' : symbol}
        />
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
