'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  PES_METHOD_OPTIONS,
  type PesMethod,
  type PriceElasticityOfSupplyFieldErrors,
  type PriceElasticityOfSupplyInput,
  type PriceElasticityOfSupplyResult,
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

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-rose-600" role="alert">
      {msg}
    </p>
  );
}

interface Props {
  input: PriceElasticityOfSupplyInput;
  errors: PriceElasticityOfSupplyFieldErrors;
  result: PriceElasticityOfSupplyResult | null;
  onChange: (input: PriceElasticityOfSupplyInput) => void;
  onLoadExample: () => void;
}

export function PriceElasticityOfSupplyForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PriceElasticityOfSupplyInput>) =>
    onChange({ ...input, ...patch });
  const symbol = getCurrencySymbol(input.currency);
  const methodHelp =
    PES_METHOD_OPTIONS.find((o) => o.id === input.method)?.short ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Calculate how responsive quantity supplied is to price changes. Compare
        two observations with the standard or midpoint (arc) method. PES is
        dimensionless.
      </p>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Method</h3>
        <div>
          <label htmlFor="pes-method" className={labelClass}>
            Calculation method
            <InfoTooltip
              label="Method"
              text="Standard uses Period 1 as the base. Midpoint uses averages of both observations and is reverse-symmetric."
            />
          </label>
          <select
            id="pes-method"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
            value={input.method}
            onChange={(e) => set({ method: e.target.value as PesMethod })}
          >
            {PES_METHOD_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-muted-foreground">{methodHelp}</p>
        </div>
        <div>
          <span className={labelClass}>Price currency (denomination)</span>
          <CurrencySelect
            value={input.currency}
            onChange={(currency: SupportedCurrency) => set({ currency })}
          />
        </div>
        <button
          type="button"
          onClick={onLoadExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (P 100→120, Qs 500→600)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Price</h3>
        <div>
          <label htmlFor="pes-p1" className={labelClass}>
            Price in Period 1 (P₁)
          </label>
          <FieldShell error={errors.price1}>
            <span className="pl-3 text-xs text-muted-foreground">{symbol}</span>
            <input
              id="pes-p1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.price1}
              onChange={(e) => set({ price1: e.target.value })}
              placeholder="100"
            />
          </FieldShell>
          <Err msg={errors.price1} />
        </div>
        <div>
          <label htmlFor="pes-p2" className={labelClass}>
            Price in Period 2 (P₂)
          </label>
          <FieldShell error={errors.price2}>
            <span className="pl-3 text-xs text-muted-foreground">{symbol}</span>
            <input
              id="pes-p2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.price2}
              onChange={(e) => set({ price2: e.target.value })}
              placeholder="120"
            />
          </FieldShell>
          <Err msg={errors.price2} />
        </div>
        <div>
          <label className={labelClass}>Change in price (%)</label>
          <FieldShell muted>
            <input
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold`}
              value={result?.formattedPercentPrice ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Supply</h3>
        <div>
          <label htmlFor="pes-q1" className={labelClass}>
            Quantity supplied in Period 1 (Q₁)
          </label>
          <FieldShell error={errors.quantity1}>
            <input
              id="pes-q1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.quantity1}
              onChange={(e) => set({ quantity1: e.target.value })}
              placeholder="500"
            />
            <span className="pr-3 text-xs text-muted-foreground">units</span>
          </FieldShell>
          <Err msg={errors.quantity1} />
        </div>
        <div>
          <label htmlFor="pes-q2" className={labelClass}>
            Quantity supplied in Period 2 (Q₂)
          </label>
          <FieldShell error={errors.quantity2}>
            <input
              id="pes-q2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.quantity2}
              onChange={(e) => set({ quantity2: e.target.value })}
              placeholder="600"
            />
            <span className="pr-3 text-xs text-muted-foreground">units</span>
          </FieldShell>
          <Err msg={errors.quantity2} />
        </div>
        <div>
          <label className={labelClass}>Change in quantity supplied (%)</label>
          <FieldShell muted>
            <input
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold`}
              value={result?.formattedPercentQuantity ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>

      <Err msg={errors.form} />
    </form>
  );
}
