'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PriceElasticityOfDemandFieldErrors,
  PriceElasticityOfDemandInput,
  PriceElasticityOfDemandResult,
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

function ReadOnlyField({
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
  symbol?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <FieldShell muted>
        {symbol ? (
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
        ) : null}
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

interface PriceElasticityOfDemandFormProps {
  input: PriceElasticityOfDemandInput;
  errors: PriceElasticityOfDemandFieldErrors;
  result: PriceElasticityOfDemandResult | null;
  onChange: (input: PriceElasticityOfDemandInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PriceElasticityOfDemandForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: PriceElasticityOfDemandFormProps) {
  const [pedOpen, setPedOpen] = useState(true);
  const [revenueOpen, setRevenueOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<PriceElasticityOfDemandInput>) => {
    onChange({ ...input, ...patch });
  };

  const pedDisplay = result?.formattedPriceElasticity ?? '';
  const classDisplay =
    result && result.classification !== 'unavailable'
      ? result.classificationLabel
      : '';
  const revIncDisplay =
    result?.formattedRevenueIncrease ??
    result?.revenueIncreaseUndefinedReason ??
    '';

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
          aria-label="Currency for prices and revenue"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (no FX conversion). PED is
 dimensionless; not a percent or a currency amount.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <CollapsibleSection
        title="Price elasticity of demand"
        open={pedOpen}
        onToggle={() => setPedOpen((o) => !o)}
      >
        <MoneyInput
          id="ped-p1"
          label="Initial price"
          tip="Original selling price before the observed price change."
          value={input.initialPrice}
          error={errors.initialPrice}
          symbol={symbol}
          onChange={(v) => set({ initialPrice: v })}
        />
        <QtyInput
          id="ped-q1"
          label="Initial quantity"
          tip="Units demanded or sold at the initial price (same unit as final quantity)."
          value={input.initialQuantity}
          error={errors.initialQuantity}
          onChange={(v) => set({ initialQuantity: v })}
        />
        <MoneyInput
          id="ped-p2"
          label="Final price"
          tip="New selling price of the same product after the price change."
          value={input.finalPrice}
          error={errors.finalPrice}
          symbol={symbol}
          onChange={(v) => set({ finalPrice: v })}
        />
        <QtyInput
          id="ped-q2"
          label="Final quantity"
          tip="Units demanded or sold at the final price."
          value={input.finalQuantity}
          error={errors.finalQuantity}
          onChange={(v) => set({ finalQuantity: v })}
        />
        <ReadOnlyField
          id="ped-result"
          label="Price elasticity of demand"
          tip="Midpoint (arc) PED = (%ΔQ midpoint) ÷ (%ΔP midpoint). Signed and dimensionless."
          value={pedDisplay}
        />
        <ReadOnlyField
          id="ped-class"
          label="Elasticity"
          tip="Classification from |PED|: elastic (>1), unit (=1), inelastic (0–1), or perfectly inelastic (0)."
          value={classDisplay}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Revenue"
        open={revenueOpen}
        onToggle={() => setRevenueOpen((o) => !o)}
      >
        <ReadOnlyField
          id="ped-r1"
          label="Initial revenue"
          tip="Initial revenue = initial price × initial quantity."
          value={result?.formattedInitialRevenue ?? ''}
          symbol={symbol}
        />
        <ReadOnlyField
          id="ped-r2"
          label="Final revenue"
          tip="Final revenue = final price × final quantity."
          value={result?.formattedFinalRevenue ?? ''}
          symbol={symbol}
        />
        <ReadOnlyField
          id="ped-rinc"
          label="Revenue increase"
          tip="((Final revenue − Initial revenue) ÷ Initial revenue) × 100. Undefined when initial revenue is zero."
          value={revIncDisplay}
        />
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
