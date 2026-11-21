'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatRoaMoney, formatRoaPercent } from './calculation';
import type {
  ReturnOnAssetsFieldErrors,
  ReturnOnAssetsInput,
  ReturnOnAssetsResult,
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

interface ReturnOnAssetsFormProps {
  input: ReturnOnAssetsInput;
  errors: ReturnOnAssetsFieldErrors;
  result: ReturnOnAssetsResult | null;
  onChange: (input: ReturnOnAssetsInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ReturnOnAssetsForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ReturnOnAssetsFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ReturnOnAssetsInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        ROA = (net income ÷ total assets) × 100. Optional average assets =
        (beginning + ending) ÷ 2.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="roa-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for ROA monetary inputs"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Money fields share one currency and scale (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is return on assets?
        </a>
      </p>

      <div>
        <label htmlFor="roa-ni" className={labelClass}>
          Net income
          <InfoTooltip
            label="Net income"
            text="Net income is the company's profit after deducting all expenses, interest, and taxes during the selected accounting period."
          />
        </label>
        <FieldShell error={errors.netIncome}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="roa-ni"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.netIncome}
            onChange={(e) => set({ netIncome: e.target.value })}
            placeholder="150,000"
            aria-invalid={Boolean(errors.netIncome)}
          />
        </FieldShell>
        {errors.netIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
          checked={input.useAverageAssets}
          onChange={(e) => set({ useAverageAssets: e.target.checked })}
        />
        <span>Calculate using average total assets</span>
      </label>

      {!input.useAverageAssets ? (
        <div>
          <label htmlFor="roa-assets" className={labelClass}>
            Total assets
            <InfoTooltip
              label="Total assets"
              text="Total assets represent the combined value of the company's current and non-current assets. For period-based ROA analysis, average total assets may provide a more representative measure."
            />
          </label>
          <FieldShell error={errors.totalAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="roa-assets"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalAssets}
              onChange={(e) => set({ totalAssets: e.target.value })}
              placeholder="1,000,000"
              aria-invalid={Boolean(errors.totalAssets)}
            />
          </FieldShell>
          {errors.totalAssets ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalAssets}</p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3.5 rounded-lg border border-border bg-muted/15 p-3">
          <div>
            <label htmlFor="roa-begin" className={labelClass}>
              Beginning total assets
            </label>
            <FieldShell error={errors.beginningAssets}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roa-begin"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.beginningAssets}
                onChange={(e) => set({ beginningAssets: e.target.value })}
                placeholder="900,000"
                aria-invalid={Boolean(errors.beginningAssets)}
              />
            </FieldShell>
            {errors.beginningAssets ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.beginningAssets}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="roa-end" className={labelClass}>
              Ending total assets
            </label>
            <FieldShell error={errors.endingAssets}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roa-end"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.endingAssets}
                onChange={(e) => set({ endingAssets: e.target.value })}
                placeholder="1,100,000"
                aria-invalid={Boolean(errors.endingAssets)}
              />
            </FieldShell>
            {errors.endingAssets ? (
              <p className="mt-1 text-xs text-rose-600">{errors.endingAssets}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="roa-avg" className={labelClass}>
              Average total assets
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roa-avg"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result?.usedAverageAssets
                    ? formatRoaMoney(result.assetBase, input.currency)
                    : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="roa-result" className={labelClass}>
          Return on assets (ROA)
        </label>
        <FieldShell muted>
          <input
            id="roa-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={
              result?.roaPercentage != null
                ? formatRoaPercent(result.roaPercentage)
                : ''
            }
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
