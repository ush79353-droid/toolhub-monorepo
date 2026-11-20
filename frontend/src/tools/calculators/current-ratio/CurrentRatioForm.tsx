'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CurrentRatioFieldErrors,
  CurrentRatioInput,
  CurrentRatioMode,
  CurrentRatioResult,
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

interface CurrentRatioFormProps {
  input: CurrentRatioInput;
  errors: CurrentRatioFieldErrors;
  result: CurrentRatioResult | null;
  onChange: (input: CurrentRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function CurrentRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: CurrentRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const assetsReadOnly = input.mode === 'currentAssets';
  const liabilitiesReadOnly = input.mode === 'currentLiabilities';
  const ratioReadOnly = input.mode === 'currentRatio';

  const set = (patch: Partial<CurrentRatioInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMode = (mode: CurrentRatioMode) => {
    if (mode === input.mode) return;
    set({ mode });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values. Current ratio =
          current assets ÷ current liabilities (dimensionless).
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="cr-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculate</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="cr-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'currentRatio'}
              onChange={() => setMode('currentRatio')}
            />
            Current ratio
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="cr-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'currentAssets'}
              onChange={() => setMode('currentAssets')}
            />
            Current assets
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="cr-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'currentLiabilities'}
              onChange={() => setMode('currentLiabilities')}
            />
            Current liabilities
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="cr-assets" className={labelClass}>
          <span>Current assets</span>
          <InfoTooltip
            label="Current assets"
            text="Assets expected to be realized, sold, consumed, or converted into cash within the normal operating cycle or short-term reporting period — e.g. cash, receivables, inventory, short-term investments, prepaid expenses."
          />
        </label>
        <FieldShell error={errors.currentAssets} muted={assetsReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cr-assets"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={assetsReadOnly}
            tabIndex={assetsReadOnly ? -1 : undefined}
            value={
              assetsReadOnly
                ? (result?.formattedCurrentAssets ?? '')
                : input.currentAssets
            }
            aria-invalid={errors.currentAssets ? true : undefined}
            aria-live={assetsReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ currentAssets: e.target.value })}
          />
        </FieldShell>
        {errors.currentAssets ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currentAssets}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cr-liabilities" className={labelClass}>
          <span>Current liabilities</span>
          <InfoTooltip
            label="Current liabilities"
            text="Obligations expected to be settled within the operating cycle or short-term reporting period — e.g. accounts payable, short-term debt, accruals, current portion of long-term debt, taxes payable."
          />
        </label>
        <FieldShell
          error={errors.currentLiabilities}
          muted={liabilitiesReadOnly}
        >
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cr-liabilities"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={liabilitiesReadOnly}
            tabIndex={liabilitiesReadOnly ? -1 : undefined}
            value={
              liabilitiesReadOnly
                ? (result?.formattedCurrentLiabilities ?? '')
                : input.currentLiabilities
            }
            aria-invalid={errors.currentLiabilities ? true : undefined}
            aria-live={liabilitiesReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ currentLiabilities: e.target.value })}
          />
        </FieldShell>
        {errors.currentLiabilities ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.currentLiabilities}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cr-ratio" className={labelClass}>
          <span>Current ratio</span>
          <InfoTooltip
            label="Current ratio"
            text="Current assets ÷ current liabilities. Dimensionless — not a currency amount or percentage. Also called the working capital ratio."
          />
        </label>
        <FieldShell error={errors.currentRatio} muted={ratioReadOnly}>
          <input
            id="cr-ratio"
            type="text"
            inputMode="decimal"
            className={`${inputClass} font-semibold`}
            readOnly={ratioReadOnly}
            tabIndex={ratioReadOnly ? -1 : undefined}
            value={
              ratioReadOnly
                ? (result?.formattedCurrentRatio ?? '')
                : input.currentRatio
            }
            aria-invalid={errors.currentRatio ? true : undefined}
            aria-live={ratioReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ currentRatio: e.target.value })}
          />
          {ratioReadOnly && result ? (
            <span className="pr-3 text-xs text-muted-foreground">
              ({result.formattedCurrentRatioColon})
            </span>
          ) : null}
        </FieldShell>
        {errors.currentRatio ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currentRatio}</p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-amber-800" role="status">
            {errors.form}
          </p>
        ) : null}
      </div>
    </form>
  );
}
