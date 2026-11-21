'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DeadweightLossFieldErrors,
  DeadweightLossInput,
  DeadweightLossMode,
  DeadweightLossResult,
  QuantityUnitLabel,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3 rounded-xl border border-border bg-muted/10 p-3 sm:p-4';

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

interface DeadweightLossFormProps {
  input: DeadweightLossInput;
  errors: DeadweightLossFieldErrors;
  result: DeadweightLossResult | null;
  onChange: (input: DeadweightLossInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

const MODES: { id: DeadweightLossMode; label: string }[] = [
  { id: 'triangle', label: 'Simple triangle' },
  { id: 'tax', label: 'Per-unit tax' },
  { id: 'linear', label: 'Linear S&D' },
];

export function DeadweightLossForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: DeadweightLossFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<DeadweightLossInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
 Currency changes the display symbol only; values are not converted.
          For taxes and wedges, the vertical height should be the economic
          wedge (e.g. Pc − Pp), not necessarily one observed transaction price.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="dwl-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Calculation mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={input.mode === m.id}
            onClick={() => set({ mode: m.id })}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              input.mode === m.id
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-accent hover:bg-muted/30'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="dwl-unit" className="text-xs font-medium text-accent">
          Quantity unit
        </label>
        <select
          id="dwl-unit"
          className="h-9 rounded-lg border border-border bg-white px-2 text-xs text-accent"
          value={input.quantityUnit}
          onChange={(e) =>
            set({ quantityUnit: e.target.value as QuantityUnitLabel })
          }
        >
          <option value="units">Units</option>
          <option value="items">Items</option>
          <option value="products">Products</option>
          <option value="transactions">Transactions</option>
        </select>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {input.mode === 'triangle' ? (
        <section className={sectionClass} aria-labelledby="dwl-triangle">
          <h3 id="dwl-triangle" className="text-sm font-semibold text-accent">
            Price &amp; quantity comparison
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="dwl-p1" className={labelClass}>
                Original price
                <InfoTooltip
                  label="Original price"
                  text="Price per unit at the efficient or baseline quantity."
                />
              </label>
              <FieldShell error={errors.originalPrice}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dwl-p1"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.originalPrice}
                  onChange={(e) => set({ originalPrice: e.target.value })}
                  aria-invalid={Boolean(errors.originalPrice)}
                />
              </FieldShell>
              {errors.originalPrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.originalPrice}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dwl-p2" className={labelClass}>
                New price
                <InfoTooltip
                  label="New price"
                  text="Comparison price for the vertical height of the loss triangle. For a tax, prefer the full wedge (buyer price − seller price)."
                />
              </label>
              <FieldShell error={errors.newPrice}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dwl-p2"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.newPrice}
                  onChange={(e) => set({ newPrice: e.target.value })}
                  aria-invalid={Boolean(errors.newPrice)}
                />
              </FieldShell>
              {errors.newPrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.newPrice}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dwl-q1" className={labelClass}>
                Original quantity
              </label>
              <FieldShell error={errors.originalQuantity}>
                <input
                  id="dwl-q1"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.originalQuantity}
                  onChange={(e) => set({ originalQuantity: e.target.value })}
                  aria-invalid={Boolean(errors.originalQuantity)}
                />
                <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
                  {input.quantityUnit}
                </span>
              </FieldShell>
              {errors.originalQuantity ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.originalQuantity}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dwl-q2" className={labelClass}>
                New quantity
              </label>
              <FieldShell error={errors.newQuantity}>
                <input
                  id="dwl-q2"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.newQuantity}
                  onChange={(e) => set({ newQuantity: e.target.value })}
                  aria-invalid={Boolean(errors.newQuantity)}
                />
                <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
                  {input.quantityUnit}
                </span>
              </FieldShell>
              {errors.newQuantity ? (
                <p className="mt-1 text-xs text-rose-600">{errors.newQuantity}</p>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="dwl-out" className={labelClass}>
              Deadweight loss
            </label>
            <FieldShell muted>
              <input
                id="dwl-out"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={result?.formattedDeadweightLoss ?? ''}
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
        </section>
      ) : null}

      {input.mode === 'tax' ? (
        <section className={sectionClass} aria-labelledby="dwl-tax">
          <h3 id="dwl-tax" className="text-sm font-semibold text-accent">
            Per-unit tax
          </h3>
          <p className="text-xs text-muted-foreground">
            DWL = ½ × t × |Qe − Qt|. Tax revenue = t × Qt (a transfer, not DWL).
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="dwl-qe" className={labelClass}>
                Efficient quantity (Qe)
              </label>
              <FieldShell error={errors.efficientQuantity}>
                <input
                  id="dwl-qe"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.efficientQuantity}
                  onChange={(e) => set({ efficientQuantity: e.target.value })}
                />
              </FieldShell>
              {errors.efficientQuantity ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.efficientQuantity}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dwl-qt" className={labelClass}>
                After-tax quantity (Qt)
              </label>
              <FieldShell error={errors.afterTaxQuantity}>
                <input
                  id="dwl-qt"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.afterTaxQuantity}
                  onChange={(e) => set({ afterTaxQuantity: e.target.value })}
                />
              </FieldShell>
              {errors.afterTaxQuantity ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.afterTaxQuantity}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="dwl-t" className={labelClass}>
                Per-unit tax wedge (t)
                <InfoTooltip
                  label="Tax wedge"
                  text="t = buyer price − seller price after the tax, under standard incidence assumptions."
                />
              </label>
              <FieldShell error={errors.taxWedge}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dwl-t"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.taxWedge}
                  onChange={(e) => set({ taxWedge: e.target.value })}
                />
              </FieldShell>
              {errors.taxWedge ? (
                <p className="mt-1 text-xs text-rose-600">{errors.taxWedge}</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {input.mode === 'linear' ? (
        <section className={sectionClass} aria-labelledby="dwl-linear">
          <h3 id="dwl-linear" className="text-sm font-semibold text-accent">
            Linear supply &amp; demand
          </h3>
          <p className="text-xs text-muted-foreground">
            PD = a − bQ · PS = c + dQ · Qe = (a−c)/(b+d) · DWL =
            ½(b+d)(Qe−Qd)²
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="dwl-a" className={labelClass}>
                Demand intercept a
              </label>
              <FieldShell error={errors.demandIntercept}>
                <input
                  id="dwl-a"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.demandIntercept}
                  onChange={(e) => set({ demandIntercept: e.target.value })}
                />
              </FieldShell>
              {errors.demandIntercept ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.demandIntercept}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dwl-b" className={labelClass}>
                Demand slope b (&gt; 0)
              </label>
              <FieldShell error={errors.demandSlope}>
                <input
                  id="dwl-b"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.demandSlope}
                  onChange={(e) => set({ demandSlope: e.target.value })}
                />
              </FieldShell>
              {errors.demandSlope ? (
                <p className="mt-1 text-xs text-rose-600">{errors.demandSlope}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dwl-c" className={labelClass}>
                Supply intercept c
              </label>
              <FieldShell error={errors.supplyIntercept}>
                <input
                  id="dwl-c"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.supplyIntercept}
                  onChange={(e) => set({ supplyIntercept: e.target.value })}
                />
              </FieldShell>
              {errors.supplyIntercept ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.supplyIntercept}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dwl-d" className={labelClass}>
                Supply slope d (&gt; 0)
              </label>
              <FieldShell error={errors.supplySlope}>
                <input
                  id="dwl-d"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.supplySlope}
                  onChange={(e) => set({ supplySlope: e.target.value })}
                />
              </FieldShell>
              {errors.supplySlope ? (
                <p className="mt-1 text-xs text-rose-600">{errors.supplySlope}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="dwl-qd" className={labelClass}>
                Distorted quantity (Qd)
              </label>
              <FieldShell error={errors.distortedQuantity}>
                <input
                  id="dwl-qd"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.distortedQuantity}
                  onChange={(e) => set({ distortedQuantity: e.target.value })}
                />
              </FieldShell>
              {errors.distortedQuantity ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.distortedQuantity}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </form>
  );
}
