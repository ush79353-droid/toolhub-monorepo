'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { solveTargetsForMode } from './calculation';
import {
  AGGREGATE_OPTIONS,
  MONEY_MAGNITUDE_OPTIONS,
  PERIOD_OPTIONS,
  type MeasurementPeriod,
  type MoneyAggregate,
  type MoneyMagnitude,
  type TransactionSource,
  type VelocityMode,
  type VelocityOfMoneyFieldErrors,
  type VelocityOfMoneyInput,
  type VelocityOfMoneyResult,
  type VelocitySolveTarget,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

const SOLVE_LABELS: Record<VelocitySolveTarget, string> = {
  velocity: 'Velocity (V)',
  moneySupply: 'Money stock (M)',
  nominalFlow: 'Nominal flow (T or GDP)',
  priceIndex: 'Price index (P)',
  volume: 'Transaction volume (N)',
};

interface VelocityOfMoneyFormProps {
  input: VelocityOfMoneyInput;
  errors: VelocityOfMoneyFieldErrors;
  result: VelocityOfMoneyResult | null;
  onChange: (input: VelocityOfMoneyInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
  onLoadGdpExample: () => void;
}

export function VelocityOfMoneyForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
  onLoadGdpExample,
}: VelocityOfMoneyFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<VelocityOfMoneyInput>) =>
    onChange({ ...input, ...patch });

  const targets = solveTargetsForMode(input.mode, input.transactionSource);
  const solving = (t: VelocitySolveTarget) => input.solveTarget === t;

  const setMode = (mode: VelocityMode) => {
    const nextTargets = solveTargetsForMode(
      mode,
      mode === 'gdp' ? 'direct' : input.transactionSource
    );
    const solveTarget = nextTargets.includes(input.solveTarget)
      ? input.solveTarget
      : 'velocity';
    set({
      mode,
      solveTarget,
      transactionSource: mode === 'gdp' ? 'direct' : input.transactionSource,
    });
  };

  const setSource = (transactionSource: TransactionSource) => {
    const nextTargets = solveTargetsForMode(input.mode, transactionSource);
    const solveTarget = nextTargets.includes(input.solveTarget)
      ? input.solveTarget
      : 'velocity';
    set({ transactionSource, solveTarget });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        V = nominal flow ÷ money stock for a chosen period. Transaction velocity
 and GDP (income) velocity use different numerators; do not mix them in
        one result. Currency is denomination only (not FX). A price index is
        dimensionless; converting it to money requires a base basket price.
      </p>

      <div
        role="radiogroup"
        aria-label="Velocity mode"
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {(
          [
            ['transactions', 'Transaction-based (MV = PT)'],
            ['gdp', 'GDP-based (MV = PY)'],
          ] as const
        ).map(([id, label]) => (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
              input.mode === id
                ? 'border-primary bg-primary/5 font-medium text-accent'
                : 'border-border bg-white text-muted-foreground'
            }`}
          >
            <input
              type="radio"
              name="vom-mode"
              className="accent-primary"
              checked={input.mode === id}
              onChange={() => setMode(id)}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="vom-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="vom-mag" className={labelClass}>
            Amount magnitude
          </label>
          <select
            id="vom-mag"
            className={selectClass}
            value={input.magnitude}
            onChange={(e) =>
              set({ magnitude: e.target.value as MoneyMagnitude })
            }
          >
            {MONEY_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="vom-period" className={labelClass}>
            Measurement period
          </label>
          <select
            id="vom-period"
            className={selectClass}
            value={input.period}
            onChange={(e) =>
              set({ period: e.target.value as MeasurementPeriod })
            }
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="vom-agg" className={labelClass}>
            Money aggregate
          </label>
          <select
            id="vom-agg"
            className={selectClass}
            value={input.moneyAggregate}
            onChange={(e) =>
              set({ moneyAggregate: e.target.value as MoneyAggregate })
            }
          >
            {AGGREGATE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="vom-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="vom-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({ solveTarget: e.target.value as VelocitySolveTarget })
          }
        >
          {targets.map((t) => (
            <option key={t} value={t}>
              {SOLVE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onLoadExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load transaction example (V = 3)
        </button>
        <button
          type="button"
          onClick={onLoadGdpExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load GDP example (V = 1.25)
        </button>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {input.mode === 'transactions' ? (
        <div
          role="radiogroup"
          aria-label="Transaction value source"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {(
            [
              ['direct', 'Enter total transactions (T) directly'],
              ['derived', 'Derive T from price index & volume'],
            ] as const
          ).map(([id, label]) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                input.transactionSource === id
                  ? 'border-primary bg-primary/5 font-medium text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="vom-src"
                className="accent-primary"
                checked={input.transactionSource === id}
                onChange={() => setSource(id)}
              />
              {label}
            </label>
          ))}
        </div>
      ) : null}

      {input.mode === 'transactions' &&
      input.transactionSource === 'derived' ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <h3 className="text-sm font-semibold text-accent">
            Price index & volume
          </h3>
          <div>
            <label htmlFor="vom-p" className={labelClass}>
              Price index (P)
              <InfoTooltip
                label="Price index"
                text="Dimensionless average price level (e.g. 110 with base 100). Not a currency price by itself."
              />
            </label>
            <FieldShell
              error={errors.priceIndex}
              muted={solving('priceIndex')}
            >
              <input
                id="vom-p"
                className={inputClass}
                inputMode="decimal"
                readOnly={solving('priceIndex')}
                aria-readonly={solving('priceIndex')}
                value={
                  solving('priceIndex')
                    ? (result?.priceIndex?.toString() ?? '')
                    : input.priceIndex
                }
                onChange={(e) => set({ priceIndex: e.target.value })}
                placeholder="110"
              />
            </FieldShell>
            {errors.priceIndex ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.priceIndex}
              </p>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="vom-base-idx" className={labelClass}>
                Index base
              </label>
              <FieldShell error={errors.indexBase}>
                <input
                  id="vom-base-idx"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.indexBase}
                  onChange={(e) => set({ indexBase: e.target.value })}
                  placeholder="100"
                />
              </FieldShell>
              {errors.indexBase ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.indexBase}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="vom-base-price" className={labelClass}>
                Base basket price
                <InfoTooltip
                  label="Base basket price"
                  text="Monetary price of one standardized transaction basket at the index base. Required to convert P into money units."
                />
              </label>
              <FieldShell error={errors.basePrice}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="vom-base-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.basePrice}
                  onChange={(e) => set({ basePrice: e.target.value })}
                  placeholder="100"
                />
              </FieldShell>
              {errors.basePrice ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.basePrice}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="vom-n" className={labelClass}>
              Volume of transactions (N)
              <InfoTooltip
                label="Transaction volume"
                text="Number of equivalent transaction baskets (or a real volume index) during the period."
              />
            </label>
            <FieldShell error={errors.volume} muted={solving('volume')}>
              <input
                id="vom-n"
                className={inputClass}
                inputMode="decimal"
                readOnly={solving('volume')}
                aria-readonly={solving('volume')}
                value={
                  solving('volume')
                    ? (result?.volume?.toString() ?? '')
                    : input.volume
                }
                onChange={(e) => set({ volume: e.target.value })}
                placeholder="500000"
              />
            </FieldShell>
            {errors.volume ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.volume}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {input.mode === 'transactions' &&
      input.transactionSource === 'direct' ? (
        <div>
          <label htmlFor="vom-t" className={labelClass}>
            Sum of all transactions (T)
            <InfoTooltip
              label="Transaction total"
              text="Total nominal monetary value of transactions in the period; distinct from transaction count."
            />
          </label>
          <FieldShell
            error={errors.nominalTransactionValue}
            muted={solving('nominalFlow')}
          >
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="vom-t"
              className={inputClass}
              inputMode="decimal"
              readOnly={solving('nominalFlow')}
              aria-readonly={solving('nominalFlow')}
              value={
                solving('nominalFlow')
                  ? (result
                      ? String(
                          result.numeratorBase /
                            (MONEY_MAGNITUDE_OPTIONS.find(
                              (m) => m.id === input.magnitude
                            )?.factor ?? 1)
                        )
                      : '')
                  : input.nominalTransactionValue
              }
              onChange={(e) =>
                set({ nominalTransactionValue: e.target.value })
              }
              placeholder="1500000"
            />
          </FieldShell>
          {errors.nominalTransactionValue ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.nominalTransactionValue}
            </p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'gdp' ? (
        <div>
          <label htmlFor="vom-gdp" className={labelClass}>
            Nominal GDP
            <InfoTooltip
              label="Nominal GDP"
              text="PY in the income form of the equation of exchange. Not the same as total transactions."
            />
          </label>
          <FieldShell
            error={errors.nominalGdp}
            muted={solving('nominalFlow')}
          >
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="vom-gdp"
              className={inputClass}
              inputMode="decimal"
              readOnly={solving('nominalFlow')}
              aria-readonly={solving('nominalFlow')}
              value={
                solving('nominalFlow')
                  ? (result
                      ? String(
                          result.numeratorBase /
                            (MONEY_MAGNITUDE_OPTIONS.find(
                              (m) => m.id === input.magnitude
                            )?.factor ?? 1)
                        )
                      : '')
                  : input.nominalGdp
              }
              onChange={(e) => set({ nominalGdp: e.target.value })}
              placeholder="25"
            />
          </FieldShell>
          {errors.nominalGdp ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.nominalGdp}
            </p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="vom-m" className={labelClass}>
          Amount of money in circulation (M)
          <InfoTooltip
            label="Money stock"
            text="Selected monetary aggregate for the period. M1, M2, and the monetary base are not equivalent."
          />
        </label>
        <FieldShell
          error={errors.moneySupply}
          muted={solving('moneySupply')}
        >
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="vom-m"
            className={inputClass}
            inputMode="decimal"
            readOnly={solving('moneySupply')}
            aria-readonly={solving('moneySupply')}
            value={
              solving('moneySupply')
                ? (result
                    ? String(
                        result.moneySupplyBase /
                          (MONEY_MAGNITUDE_OPTIONS.find(
                            (m) => m.id === input.magnitude
                          )?.factor ?? 1)
                      )
                    : '')
                : input.moneySupply
            }
            onChange={(e) => set({ moneySupply: e.target.value })}
            placeholder="500000"
          />
        </FieldShell>
        {errors.moneySupply ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.moneySupply}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="vom-v" className={labelClass}>
          Velocity of money (V)
        </label>
        <FieldShell error={errors.velocity} muted={solving('velocity')}>
          <input
            id="vom-v"
            className={inputClass}
            inputMode="decimal"
            readOnly={solving('velocity')}
            aria-readonly={solving('velocity')}
            value={
              solving('velocity')
                ? (result?.velocity.toString() ?? '')
                : input.velocity
            }
            onChange={(e) => set({ velocity: e.target.value })}
            placeholder="3"
          />
          <span className="whitespace-nowrap pr-3 text-xs text-muted-foreground">
            {PERIOD_OPTIONS.find((p) => p.id === input.period)?.unitSuffix}
          </span>
        </FieldShell>
        {errors.velocity ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.velocity}
          </p>
        ) : null}
      </div>
    </form>
  );
}
