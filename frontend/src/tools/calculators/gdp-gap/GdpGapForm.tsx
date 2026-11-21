'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  GDP_MAGNITUDE_OPTIONS,
  type GdpGapFieldErrors,
  type GdpGapInput,
  type GdpGapMode,
  type GdpGapResult,
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

const MODES: { id: GdpGapMode; label: string }[] = [
  { id: 'gap', label: 'GDP Gap %' },
  { id: 'actual', label: 'Actual GDP' },
  { id: 'potential', label: 'Potential GDP' },
];

interface GdpGapFormProps {
  input: GdpGapInput;
  errors: GdpGapFieldErrors;
  result: GdpGapResult | null;
  onChange: (input: GdpGapInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function GdpGapForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: GdpGapFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<GdpGapInput>) => onChange({ ...input, ...patch });

  const setMode = (mode: GdpGapMode) => {
    if (mode === input.mode) return;
    onChange({ ...input, mode });
  };

  const actualEditable = input.mode !== 'actual';
  const potentialEditable = input.mode !== 'potential';
  const gapEditable = input.mode !== 'gap';

  const actualDisplay = actualEditable
    ? input.actualGdp
    : (result?.displayActual ?? '');
  const potentialDisplay = potentialEditable
    ? input.potentialGdp
    : (result?.displayPotential ?? '');
  const gapDisplay = gapEditable
    ? input.gapPercent
    : (result?.displayGap ?? '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        GDP Gap (%) = ((Actual − Potential) / Potential) × 100. Use real GDP on
        a consistent price basis. Potential GDP is an estimate of sustainable
        capacity. Currency is denomination only; magnitudes convert to a common
        base before the ratio.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="gdpg-currency"
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
        Load worked example (18T / 20T → −10%)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="gdpg-actual" className={labelClass}>
          Actual GDP (Y)
          <InfoTooltip
            label="Actual GDP"
            text="Actual GDP represents the economy's measured output during a given period. For GDP gap calculations, use real GDP measured in consistent prices."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.actualGdp} muted={!actualEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gdpg-actual"
              type="text"
              inputMode="decimal"
              readOnly={!actualEditable}
              tabIndex={actualEditable ? 0 : -1}
              className={`${inputClass} ${!actualEditable ? 'cursor-default font-semibold' : ''}`}
              value={actualDisplay}
              onChange={(e) => set({ actualGdp: e.target.value })}
              placeholder="18"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="Actual GDP magnitude"
            value={input.actualMagnitude}
            disabled={!actualEditable}
            onChange={(e) =>
              set({ actualMagnitude: e.target.value as GdpMagnitude })
            }
          >
            {GDP_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.actualGdp ? (
          <p className="mt-1 text-xs text-rose-600">{errors.actualGdp}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdpg-potential" className={labelClass}>
          Potential GDP (Y*)
          <InfoTooltip
            label="Potential GDP"
            text="Potential GDP is an estimate of the output an economy can sustainably produce when labor, capital, and other resources are used at normal sustainable levels."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.potentialGdp} muted={!potentialEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gdpg-potential"
              type="text"
              inputMode="decimal"
              readOnly={!potentialEditable}
              tabIndex={potentialEditable ? 0 : -1}
              className={`${inputClass} ${!potentialEditable ? 'cursor-default font-semibold' : ''}`}
              value={potentialDisplay}
              onChange={(e) => set({ potentialGdp: e.target.value })}
              placeholder="20"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="Potential GDP magnitude"
            value={input.potentialMagnitude}
            disabled={!potentialEditable}
            onChange={(e) =>
              set({ potentialMagnitude: e.target.value as GdpMagnitude })
            }
          >
            {GDP_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.potentialGdp ? (
          <p className="mt-1 text-xs text-rose-600">{errors.potentialGdp}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdpg-gap" className={labelClass}>
          GDP Gap (%)
          <InfoTooltip
            label="GDP Gap"
            text="The GDP gap is the percentage difference between actual GDP and potential GDP, expressed relative to potential GDP."
          />
        </label>
        <FieldShell error={errors.gapPercent} muted={!gapEditable}>
          <input
            id="gdpg-gap"
            type="text"
            inputMode="decimal"
            readOnly={!gapEditable}
            tabIndex={gapEditable ? 0 : -1}
            className={`${inputClass} ${!gapEditable ? 'cursor-default font-semibold' : ''}`}
            value={gapDisplay}
            onChange={(e) => set({ gapPercent: e.target.value })}
            placeholder="—"
          />
          <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.gapPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.gapPercent}</p>
        ) : null}
      </div>
    </form>
  );
}
