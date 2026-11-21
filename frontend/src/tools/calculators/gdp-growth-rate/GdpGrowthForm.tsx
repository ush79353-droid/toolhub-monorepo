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
  type GdpGrowthFieldErrors,
  type GdpGrowthInput,
  type GdpGrowthMode,
  type GdpGrowthResult,
  type GdpMagnitude,
  type GdpMeasureType,
  type GdpPeriod,
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

const MODES: { id: GdpGrowthMode; label: string }[] = [
  { id: 'growth', label: 'GDP Growth %' },
  { id: 'current', label: 'Current GDP' },
  { id: 'previous', label: 'Previous GDP' },
];

interface GdpGrowthFormProps {
  input: GdpGrowthInput;
  errors: GdpGrowthFieldErrors;
  result: GdpGrowthResult | null;
  onChange: (input: GdpGrowthInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function GdpGrowthForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: GdpGrowthFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<GdpGrowthInput>) =>
    onChange({ ...input, ...patch });

  const setMode = (mode: GdpGrowthMode) => {
    if (mode === input.mode) return;
    onChange({ ...input, mode });
  };

  const currentEditable = input.mode !== 'current';
  const previousEditable = input.mode !== 'previous';
  const growthEditable = input.mode !== 'growth';

  const currentDisplay = currentEditable
    ? input.currentGdp
    : (result?.displayCurrent ?? '');
  const previousDisplay = previousEditable
    ? input.previousGdp
    : (result?.displayPrevious ?? '');
  const growthDisplay = growthEditable
    ? input.growthPercent
    : (result?.displayGrowth ?? '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        GDP Growth (%) = ((Current − Previous) / Previous) × 100. Prefer real
        GDP for volume growth; nominal growth includes prices. Do not mix
        measures or currencies. Annualized quarterly growth is optional and
        labeled separately.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="gdgr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="GDP currency denomination"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="gdgr-period" className={labelClass}>
            Comparison period
          </label>
          <select
            id="gdgr-period"
            className={`${selectClass} w-full`}
            value={input.period}
            onChange={(e) => set({ period: e.target.value as GdpPeriod })}
          >
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label htmlFor="gdgr-measure" className={labelClass}>
            GDP measure
          </label>
          <select
            id="gdgr-measure"
            className={`${selectClass} w-full`}
            value={input.measureType}
            onChange={(e) =>
              set({ measureType: e.target.value as GdpMeasureType })
            }
          >
            <option value="real">Real GDP</option>
            <option value="nominal">Nominal GDP</option>
            <option value="unspecified">Unspecified</option>
          </select>
        </div>
      </div>

      {input.period === 'quarterly' ? (
        <label className="flex items-start gap-2 text-xs text-accent">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={input.annualizeQuarterly}
            onChange={(e) => set({ annualizeQuarterly: e.target.checked })}
          />
          <span>
            Also show annualized quarter-over-quarter growth
 ((Current/Previous)⁴ − 1); labeled separately, not a substitute for
            the period growth rate.
          </span>
        </label>
      ) : null}

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
        Load worked example (21T / 20T → +5%)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="gdgr-current" className={labelClass}>
          GDP in the Current Period
          <InfoTooltip
            label="Current GDP"
            text="The current-period GDP is the value of economic output measured during the period being compared with the previous period."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.currentGdp} muted={!currentEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gdgr-current"
              type="text"
              inputMode="decimal"
              readOnly={!currentEditable}
              tabIndex={currentEditable ? 0 : -1}
              className={`${inputClass} ${!currentEditable ? 'cursor-default font-semibold' : ''}`}
              value={currentDisplay}
              onChange={(e) => set({ currentGdp: e.target.value })}
              placeholder="21"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="Current GDP magnitude"
            value={input.currentMagnitude}
            disabled={!currentEditable}
            onChange={(e) =>
              set({ currentMagnitude: e.target.value as GdpMagnitude })
            }
          >
            {GDP_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.currentGdp ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currentGdp}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdgr-previous" className={labelClass}>
          GDP in the Previous Period
          <InfoTooltip
            label="Previous GDP"
            text="The previous-period GDP is the GDP value from the earlier comparison period and serves as the denominator in the growth rate formula."
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FieldShell error={errors.previousGdp} muted={!previousEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gdgr-previous"
              type="text"
              inputMode="decimal"
              readOnly={!previousEditable}
              tabIndex={previousEditable ? 0 : -1}
              className={`${inputClass} ${!previousEditable ? 'cursor-default font-semibold' : ''}`}
              value={previousDisplay}
              onChange={(e) => set({ previousGdp: e.target.value })}
              placeholder="20"
            />
          </FieldShell>
          <select
            className={selectClass}
            aria-label="Previous GDP magnitude"
            value={input.previousMagnitude}
            disabled={!previousEditable}
            onChange={(e) =>
              set({ previousMagnitude: e.target.value as GdpMagnitude })
            }
          >
            {GDP_MAGNITUDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {errors.previousGdp ? (
          <p className="mt-1 text-xs text-rose-600">{errors.previousGdp}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gdgr-growth" className={labelClass}>
          GDP Growth
          <InfoTooltip
            label="GDP Growth"
            text="GDP growth measures the percentage increase or decrease in GDP between two periods, relative to the previous period."
          />
        </label>
        <FieldShell error={errors.growthPercent} muted={!growthEditable}>
          <input
            id="gdgr-growth"
            type="text"
            inputMode="decimal"
            readOnly={!growthEditable}
            tabIndex={growthEditable ? 0 : -1}
            className={`${inputClass} ${!growthEditable ? 'cursor-default font-semibold' : ''}`}
            value={growthDisplay}
            onChange={(e) => set({ growthPercent: e.target.value })}
            placeholder="—"
          />
          <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.growthPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.growthPercent}</p>
        ) : null}
      </div>
    </form>
  );
}
