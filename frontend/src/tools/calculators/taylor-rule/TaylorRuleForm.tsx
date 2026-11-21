'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  GDP_MAGNITUDE_OPTIONS,
  type TaylorRuleFieldErrors,
  type TaylorRuleInput,
  type TaylorRuleResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-xs text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface TaylorRuleFormProps {
  input: TaylorRuleInput;
  errors: TaylorRuleFieldErrors;
  result: TaylorRuleResult | null;
  onChange: (input: TaylorRuleInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function TaylorRuleForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: TaylorRuleFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<TaylorRuleInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        i = r* + π + a(π − π*) + b·y. Default a = b = 0.5. GDP currency is
        denomination only (not FX). Prefer real GDP for meaningful gaps. The
        Taylor rule is a guideline, not an official Fed decision.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">GDP currency</span>
        <CurrencySelect
          id="tr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="GDP currency denomination"
        />
      </div>

      <div>
        <label htmlFor="tr-magnitude" className={labelClass}>
          GDP magnitude
        </label>
        <select
          id="tr-magnitude"
          className={`${selectClass} w-full sm:w-auto`}
          value={input.magnitude}
          onChange={(e) =>
            set({
              magnitude: e.target.value as TaylorRuleInput['magnitude'],
            })
          }
        >
          {GDP_MAGNITUDE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (π 4% · π* 2% · Y 21T · Y* 20T → i 9.5%)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Inflation Rate Gap</h3>
        <div>
          <label htmlFor="tr-pi" className={labelClass}>
            Current Inflation Rate (π)
            <InfoTooltip content="The current inflation rate measures the rate at which the general price level is increasing." />
          </label>
          <FieldShell error={errors.currentInflation}>
            <input
              id="tr-pi"
              className={inputClass}
              inputMode="decimal"
              value={input.currentInflation}
              onChange={(e) => set({ currentInflation: e.target.value })}
              placeholder="4"
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.currentInflation ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.currentInflation}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tr-pi-star" className={labelClass}>
            Target Inflation Rate (π*)
            <InfoTooltip content="The target inflation rate is the inflation rate a central bank aims to achieve over time." />
          </label>
          <FieldShell error={errors.targetInflation}>
            <input
              id="tr-pi-star"
              className={inputClass}
              inputMode="decimal"
              value={input.targetInflation}
              onChange={(e) => set({ targetInflation: e.target.value })}
              placeholder="2"
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.targetInflation ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.targetInflation}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tr-inf-gap" className={labelClass}>
            Inflation Rate Gap
          </label>
          <FieldShell muted>
            <input
              id="tr-inf-gap"
              className={inputClass}
              readOnly
              aria-readonly
              value={result?.formattedInflationGap ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">Output Gap</h3>
        <div>
          <label htmlFor="tr-y" className={labelClass}>
            Current GDP (Y)
            <InfoTooltip content="Current GDP is the economy's actual output during the period. Prefer real GDP for meaningful comparisons." />
          </label>
          <FieldShell error={errors.actualGdp}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="tr-y"
              className={inputClass}
              inputMode="decimal"
              value={input.actualGdp}
              onChange={(e) => set({ actualGdp: e.target.value })}
              placeholder="21"
            />
          </FieldShell>
          {errors.actualGdp ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.actualGdp}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tr-y-star" className={labelClass}>
            Potential GDP (Y*)
            <InfoTooltip content="Potential GDP is the estimated level of output the economy can sustainably produce at normal utilization of labor and capital." />
          </label>
          <FieldShell error={errors.potentialGdp}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="tr-y-star"
              className={inputClass}
              inputMode="decimal"
              value={input.potentialGdp}
              onChange={(e) => set({ potentialGdp: e.target.value })}
              placeholder="20"
            />
          </FieldShell>
          {errors.potentialGdp ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.potentialGdp}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tr-out-gap" className={labelClass}>
            Output Gap
          </label>
          <FieldShell muted>
            <input
              id="tr-out-gap"
              className={inputClass}
              readOnly
              aria-readonly
              value={result?.formattedOutputGap ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">
          Taylor Rule Recommended Rate
        </h3>
        <div>
          <label htmlFor="tr-r-star" className={labelClass}>
            Neutral Real Interest Rate (r*)
            <InfoTooltip content="The neutral real interest rate is the estimated inflation-adjusted policy rate consistent with an economy operating near its potential and inflation near target. It is a model assumption, not an observed constant." />
          </label>
          <FieldShell error={errors.neutralRealRate}>
            <input
              id="tr-r-star"
              className={inputClass}
              inputMode="decimal"
              value={input.neutralRealRate}
              onChange={(e) => set({ neutralRealRate: e.target.value })}
              placeholder="2"
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.neutralRealRate ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.neutralRealRate}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tr-rate" className={labelClass}>
            Taylor Rule Recommended Rate
          </label>
          <FieldShell muted>
            <input
              id="tr-rate"
              className={inputClass}
              readOnly
              aria-readonly
              value={result?.formattedCustomRate ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-medium text-accent"
          aria-expanded={showAdvanced}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          Advanced Taylor Rule Settings
          <span className="text-muted-foreground">
            {showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>
        {showAdvanced ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <div>
              <label htmlFor="tr-a" className={labelClass}>
                Inflation response coefficient (a)
              </label>
              <FieldShell error={errors.inflationCoefficient}>
                <input
                  id="tr-a"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.inflationCoefficient}
                  onChange={(e) =>
                    set({ inflationCoefficient: e.target.value })
                  }
                  placeholder="0.5"
                />
              </FieldShell>
              {errors.inflationCoefficient ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.inflationCoefficient}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tr-b" className={labelClass}>
                Output-gap response coefficient (b)
              </label>
              <FieldShell error={errors.outputCoefficient}>
                <input
                  id="tr-b"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.outputCoefficient}
                  onChange={(e) => set({ outputCoefficient: e.target.value })}
                  placeholder="0.5"
                />
              </FieldShell>
              {errors.outputCoefficient ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.outputCoefficient}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tr-pe" className={labelClass}>
                Expected inflation πᵉ (optional)
              </label>
              <FieldShell error={errors.expectedInflation}>
                <input
                  id="tr-pe"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.expectedInflation}
                  onChange={(e) => set({ expectedInflation: e.target.value })}
                  placeholder="e.g. 4"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Used only for approximate ex-ante real rate r ≈ i − πᵉ. Do not
                assume current inflation equals expected inflation without
                stating that assumption.
              </p>
              {errors.expectedInflation ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.expectedInflation}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tr-floor" className={labelClass}>
                Policy-rate floor (optional comparison)
              </label>
              <FieldShell error={errors.policyFloor}>
                <input
                  id="tr-floor"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.policyFloor}
                  onChange={(e) => set({ policyFloor: e.target.value })}
                  placeholder="e.g. 0"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              <p className="mt-1 text-[11px] text-muted-foreground">
 Comparison only; not auto-imposed. Some central banks have used
                negative nominal policy rates.
              </p>
              {errors.policyFloor ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.policyFloor}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
