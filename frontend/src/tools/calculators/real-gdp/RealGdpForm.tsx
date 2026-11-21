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
  REAL_GDP_MODE_OPTIONS,
  type RealGdpFieldErrors,
  type RealGdpInput,
  type RealGdpMode,
  type RealGdpResult,
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

interface RealGdpFormProps {
  input: RealGdpInput;
  errors: RealGdpFieldErrors;
  result: RealGdpResult | null;
  onChange: (input: RealGdpInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function RealGdpForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: RealGdpFormProps) {
  const [showGrowth, setShowGrowth] = useState(false);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RealGdpInput>) =>
    onChange({ ...input, ...patch });

  const setMode = (mode: RealGdpMode) => {
    if (mode === input.mode) return;
    onChange({ ...input, mode });
  };

  const nominalEditable = input.mode !== 'nominal';
  const realEditable = input.mode !== 'real';
  const deflatorEditable = input.mode !== 'deflator';

  const nominalDisplay = nominalEditable
    ? input.nominalGdp
    : (result?.displayNominal ?? '');
  const realDisplay = realEditable
    ? input.realGdp
    : (result?.displayReal ?? '');
  const deflatorDisplay = deflatorEditable
    ? input.deflator
    : (result?.displayDeflator ?? '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Real GDP = (Nominal GDP / GDP Deflator) × 100. Currency is denomination
        only — not live FX conversion. The deflator is a base-year price index
        (100), not a one-year inflation rate.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="rgdp-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="GDP currency denomination"
        />
      </div>

      <div>
        <label htmlFor="rgdp-magnitude" className={labelClass}>
          GDP magnitude
        </label>
        <select
          id="rgdp-magnitude"
          className={`${selectClass} w-full sm:w-auto`}
          value={input.magnitude}
          onChange={(e) =>
            set({
              magnitude: e.target.value as RealGdpInput['magnitude'],
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

      <div>
        <span className={labelClass}>Calculate</span>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Calculation mode"
        >
          {REAL_GDP_MODE_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={input.mode === m.id}
              onClick={() => setMode(m.id)}
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
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (25,000 billion / 125 → 20,000)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="rgdp-nominal" className={labelClass}>
          Nominal GDP
          <InfoTooltip content="Nominal GDP measures the value of final goods and services produced in an economy using current prices." />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.nominalGdp} muted={!nominalEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rgdp-nominal"
              className={inputClass}
              inputMode="decimal"
              readOnly={!nominalEditable}
              aria-readonly={!nominalEditable}
              value={nominalDisplay}
              onChange={(e) => set({ nominalGdp: e.target.value })}
              placeholder="25,000"
            />
          </FieldShell>
        </div>
        {errors.nominalGdp ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.nominalGdp}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rgdp-deflator" className={labelClass}>
          GDP Deflator
          <InfoTooltip content="The GDP deflator is a broad price index comparing nominal GDP with real GDP. It is typically expressed relative to a base year assigned a value of 100." />
        </label>
        <FieldShell error={errors.deflator} muted={!deflatorEditable}>
          <input
            id="rgdp-deflator"
            className={inputClass}
            inputMode="decimal"
            readOnly={!deflatorEditable}
            aria-readonly={!deflatorEditable}
            value={deflatorDisplay}
            onChange={(e) => set({ deflator: e.target.value })}
            placeholder="125"
          />
          <span className="pr-3 text-xs text-muted-foreground">Index</span>
        </FieldShell>
        {errors.deflator ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.deflator}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rgdp-real" className={labelClass}>
          Real GDP
          <InfoTooltip content="Real GDP values output at constant (base-year) prices so quantity changes can be separated from price changes." />
        </label>
        <FieldShell error={errors.realGdp} muted={!realEditable}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rgdp-real"
            className={inputClass}
            inputMode="decimal"
            readOnly={!realEditable}
            aria-readonly={!realEditable}
            value={realDisplay}
            onChange={(e) => set({ realGdp: e.target.value })}
            placeholder="20,000"
          />
        </FieldShell>
        {errors.realGdp ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.realGdp}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-medium text-accent"
          aria-expanded={showGrowth}
          onClick={() => setShowGrowth((v) => !v)}
        >
          Optional: real GDP growth rate
          <span className="text-muted-foreground">
            {showGrowth ? 'Hide' : 'Show'}
          </span>
        </button>
        {showGrowth ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-xs text-muted-foreground">
              g = (Rₜ − Rₜ₋₁) / Rₜ₋₁ × 100. Uses the same magnitude as above.
            </p>
            <div>
              <label htmlFor="rgdp-prev-real" className={labelClass}>
                Previous real GDP
              </label>
              <FieldShell error={errors.previousRealGdp}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="rgdp-prev-real"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.previousRealGdp}
                  onChange={(e) => set({ previousRealGdp: e.target.value })}
                />
              </FieldShell>
              {errors.previousRealGdp ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.previousRealGdp}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="rgdp-curr-real" className={labelClass}>
                Current real GDP
              </label>
              <FieldShell error={errors.currentRealGdp}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="rgdp-curr-real"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.currentRealGdp}
                  onChange={(e) => set({ currentRealGdp: e.target.value })}
                />
              </FieldShell>
              {errors.currentRealGdp ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.currentRealGdp}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
