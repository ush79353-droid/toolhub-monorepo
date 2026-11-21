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
  type GdpDeflatorFieldErrors,
  type GdpDeflatorInput,
  type GdpDeflatorMode,
  type GdpDeflatorResult,
  type GdpMagnitude,
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

const MODES: { id: GdpDeflatorMode; label: string }[] = [
  { id: 'deflator', label: 'GDP Deflator' },
  { id: 'nominal', label: 'Nominal GDP' },
  { id: 'real', label: 'Real GDP' },
];

interface GdpDeflatorFormProps {
  input: GdpDeflatorInput;
  errors: GdpDeflatorFieldErrors;
  result: GdpDeflatorResult | null;
  onChange: (input: GdpDeflatorInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function GdpDeflatorForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: GdpDeflatorFormProps) {
  const [showInflation, setShowInflation] = useState(false);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<GdpDeflatorInput>) =>
    onChange({ ...input, ...patch });

  const setMode = (mode: GdpDeflatorMode) => {
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
        GDP Deflator = (Nominal GDP / Real GDP) × 100. The result is a
        price-level index (reference 100), not a one-year inflation percentage.
        Currency is denomination only — both GDP values share the same currency;
        magnitudes convert to common base units before the ratio.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="gdpd-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="GDP currency denomination"
        />
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Calculation mode"
      >
        {MODES.map((m) => (
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
            Calculate {m.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load worked example (25T / 20T → 125)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="gdpd-nominal" className={labelClass}>
          Nominal GDP
          <InfoTooltip
            label="Nominal GDP"
            text="Nominal GDP measures the market value of final goods and services produced within an economy using current-period prices."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.nominalGdp} muted={!nominalEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gdpd-nominal"
              type="text"
              inputMode="decimal"
              readOnly={!nominalEditable}
              tabIndex={nominalEditable ? 0 : -1}
              className={`${inputClass} ${!nominalEditable ? 'cursor-default font-semibold' : ''}`}
              value={nominalDisplay}
              onChange={(e) => set({ nominalGdp: e.target.value })}
              placeholder="25"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="Nominal GDP magnitude"
            value={input.nominalMagnitude}
            disabled={!nominalEditable}
            onChange={(e) =>
              set({ nominalMagnitude: e.target.value as GdpMagnitude })
            }
          >
            {GDP_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.nominalGdp ? (
          <p className="mt-1 text-xs text-rose-600">{errors.nominalGdp}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdpd-real" className={labelClass}>
          Real GDP
          <InfoTooltip
            label="Real GDP"
            text="Real GDP measures the value of final goods and services produced using constant prices from a selected reference period."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.realGdp} muted={!realEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gdpd-real"
              type="text"
              inputMode="decimal"
              readOnly={!realEditable}
              tabIndex={realEditable ? 0 : -1}
              className={`${inputClass} ${!realEditable ? 'cursor-default font-semibold' : ''}`}
              value={realDisplay}
              onChange={(e) => set({ realGdp: e.target.value })}
              placeholder="20"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="Real GDP magnitude"
            value={input.realMagnitude}
            disabled={!realEditable}
            onChange={(e) =>
              set({ realMagnitude: e.target.value as GdpMagnitude })
            }
          >
            {GDP_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.realGdp ? (
          <p className="mt-1 text-xs text-rose-600">{errors.realGdp}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdpd-deflator" className={labelClass}>
          GDP Deflator
          <InfoTooltip
            label="GDP Deflator"
            text="The GDP deflator is a price-level index calculated by dividing nominal GDP by real GDP and multiplying by 100."
          />
        </label>
        <FieldShell error={errors.deflator} muted={!deflatorEditable}>
          <input
            id="gdpd-deflator"
            type="text"
            inputMode="decimal"
            readOnly={!deflatorEditable}
            tabIndex={deflatorEditable ? 0 : -1}
            className={`${inputClass} ${!deflatorEditable ? 'cursor-default font-semibold' : ''}`}
            value={deflatorDisplay}
            onChange={(e) => set({ deflator: e.target.value })}
            placeholder="—"
          />
          <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
            index
          </span>
        </FieldShell>
        {errors.deflator ? (
          <p className="mt-1 text-xs text-rose-600">{errors.deflator}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-semibold text-accent"
          onClick={() => setShowInflation((v) => !v)}
          aria-expanded={showInflation}
        >
          Optional: GDP deflator inflation rate
          <span className="text-muted-foreground">
            {showInflation ? 'Hide' : 'Show'}
          </span>
        </button>
        {showInflation ? (
          <div className="space-y-3 border-t border-border p-3">
            <p className="text-xs text-muted-foreground">
              Inflation needs two periods: (D_t − D_t−1) / D_t−1 × 100. Distinct
              from a single deflator index reading.
            </p>
            <div>
              <label htmlFor="gdpd-prev" className={labelClass}>
                Previous-period GDP deflator
              </label>
              <FieldShell error={errors.previousDeflator}>
                <input
                  id="gdpd-prev"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.previousDeflator}
                  onChange={(e) => set({ previousDeflator: e.target.value })}
                  placeholder="120"
                />
              </FieldShell>
              {errors.previousDeflator ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.previousDeflator}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="gdpd-curr" className={labelClass}>
                Current-period GDP deflator
              </label>
              <FieldShell error={errors.currentDeflator}>
                <input
                  id="gdpd-curr"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.currentDeflator}
                  onChange={(e) => set({ currentDeflator: e.target.value })}
                  placeholder="126"
                />
              </FieldShell>
              {errors.currentDeflator ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.currentDeflator}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
