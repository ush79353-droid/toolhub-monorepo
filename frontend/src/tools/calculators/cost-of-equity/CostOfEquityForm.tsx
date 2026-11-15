'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CostOfEquityFieldErrors,
  CostOfEquityInput,
  CostOfEquityMode,
  CostOfEquityResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface CostOfEquityFormProps {
  input: CostOfEquityInput;
  errors: CostOfEquityFieldErrors;
  result: CostOfEquityResult | null;
  onChange: (input: CostOfEquityInput) => void;
  onReset: () => void;
}

export function CostOfEquityForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: CostOfEquityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CostOfEquityInput>) => onChange({ ...input, ...patch });
  const setMode = (mode: CostOfEquityMode) => set({ mode });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Cost of equity</legend>

        <fieldset className="space-y-2">
          <legend className="text-[13px] font-medium text-accent">
            Does the company pay a dividend?
          </legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="coe-dividend-mode"
                checked={input.mode === 'dividend'}
                onChange={() => setMode('dividend')}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="coe-dividend-mode"
                checked={input.mode === 'no-dividend'}
                onChange={() => setMode('no-dividend')}
              />
              No
            </label>
          </div>
        </fieldset>

        {input.mode === 'dividend' ? (
          <>
            <div>
              <label className={labelClass} htmlFor="coe-dividend">
                <span>Dividend per share</span>
                <InfoTooltip
                  label="Dividend per share"
                  text="Expected dividend next year (D₁). Currency labels amounts only; it does not convert."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.dividendPerShare}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                    {symbol}
                  </span>
                  <input
                    id="coe-dividend"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.dividendPerShare}
                    aria-invalid={Boolean(errors.dividendPerShare)}
                    onChange={(e) => set({ dividendPerShare: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="coe-dividend-currency"
                    value={input.currency}
                    onChange={(currency) => set({ currency })}
                    aria-label="Dividend currency"
                  />
                </div>
              </div>
              {errors.dividendPerShare ? (
                <p className="mt-1 text-xs text-rose-600">{errors.dividendPerShare}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="coe-price">
                <span>Current share price</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.sharePrice}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                    {symbol}
                  </span>
                  <input
                    id="coe-price"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.sharePrice}
                    aria-invalid={Boolean(errors.sharePrice)}
                    onChange={(e) => set({ sharePrice: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="coe-price-currency"
                    value={input.currency}
                    onChange={(currency) => set({ currency })}
                    aria-label="Share price currency"
                  />
                </div>
              </div>
              {errors.sharePrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.sharePrice}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="coe-growth">
                <span>Growth rate of dividend</span>
                <InfoTooltip
                  label="Growth rate of dividend"
                  text="Constant expected growth of the dividend, in percent. Zero growth is allowed."
                />
              </label>
              <FieldShell error={errors.growthRatePercent}>
                <input
                  id="coe-growth"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.growthRatePercent}
                  aria-invalid={Boolean(errors.growthRatePercent)}
                  onChange={(e) => set({ growthRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.growthRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.growthRatePercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="coe-result">
                <span>Cost of equity</span>
                <InfoTooltip
                  label="Cost of equity"
                  text="(D₁ ÷ P₀) × 100 + growth rate %. D₁ is the expected next-year dividend."
                />
              </label>
              <FieldShell muted>
                <input
                  id="coe-result"
                  className={`${inputClass} pr-8 font-semibold`}
                  readOnly
                  value={result ? result.formattedCostOfEquity : ''}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Non-dividend mode (typically CAPM) is not available yet. The reference screenshot does
            not confirm its inputs. Use the CAPM Calculator for Rf, Rm, and beta, or switch back to
            Yes for the dividend growth model.
          </p>
        )}

        {errors.form && input.mode === 'dividend' ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
