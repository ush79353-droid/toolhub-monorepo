'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { KnowRevenue, RoasFieldErrors, RoasInput, RoasResult } from './types';

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

interface RoasFormProps {
  input: RoasInput;
  errors: RoasFieldErrors;
  result: RoasResult | null;
  onChange: (input: RoasInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function RoasForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: RoasFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RoasInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          Return on ad spend (ROAS)
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          <div>
            <label className={labelClass} htmlFor="roas-spend">
              <span>Ad spend</span>
              <InfoTooltip
                label="Ad spend"
                text="Total advertising cost for the campaign period. Must be greater than zero."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.adSpend}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  {symbol}
                </span>
                <input
                  id="roas-spend"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.adSpend}
                  aria-invalid={Boolean(errors.adSpend)}
                  onChange={(event) => set({ adSpend: event.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="roas-spend-currency"
                  value={input.currency}
                  onChange={onCurrencyChange}
                  aria-label="Ad spend currency"
                />
              </div>
            </div>
            {errors.adSpend ? <p className="mt-1 text-xs text-rose-600">{errors.adSpend}</p> : null}
          </div>

          <fieldset>
            <legend className={`${labelClass} mb-2`}>Do you know your revenue?</legend>
            <div className="flex flex-wrap gap-4">
              {(['yes', 'no'] as const).map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-accent">
                  <input
                    type="radio"
                    name="roas-know-revenue"
                    className="h-4 w-4 border-border"
                    checked={input.knowRevenue === option}
                    onChange={() => set({ knowRevenue: option as KnowRevenue })}
                  />
                  {option === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </fieldset>

          {input.knowRevenue === 'yes' ? (
            <div>
              <label className={labelClass} htmlFor="roas-revenue">
                <span>Ad revenue</span>
                <InfoTooltip
                  label="Ad revenue"
                  text="Revenue attributed to the ads. Zero is allowed."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.adRevenue}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                    {symbol}
                  </span>
                  <input
                    id="roas-revenue"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.adRevenue}
                    aria-invalid={Boolean(errors.adRevenue)}
                    onChange={(event) => set({ adRevenue: event.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="roas-revenue-currency"
                    value={input.currency}
                    onChange={onCurrencyChange}
                    aria-label="Ad revenue currency"
                  />
                </div>
              </div>
              {errors.adRevenue ? (
                <p className="mt-1 text-xs text-rose-600">{errors.adRevenue}</p>
              ) : null}
            </div>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Enter ad revenue to calculate ROAS. This tool does not estimate revenue from other
              inputs.
            </p>
          )}

          <div>
            <label className={labelClass} htmlFor="roas-output">
              <span>ROAS</span>
              <InfoTooltip
                label="ROAS"
                text="Return on ad spend = (ad revenue ÷ ad spend) × 100. Shown as a percent; the ratio is also available in share text."
              />
            </label>
            <FieldShell muted>
              <input
                id="roas-output"
                className={`${inputClass} cursor-default pr-8 font-semibold`}
                readOnly
                value={result?.formattedRoasPercent ?? ''}
                placeholder="—"
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </FieldShell>
            {result ? (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Ratio {result.formattedRoasRatio} (ad revenue per unit of ad spend). Distinct from
                ROI below.
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        open={input.roiOpen}
        className="rounded-xl border border-border bg-muted/15"
        onToggle={(event) => {
          const nextOpen = (event.target as HTMLDetailsElement).open;
          if (nextOpen !== input.roiOpen) set({ roiOpen: nextOpen });
        }}
      >
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          Return on investment (ROI)
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ad-only ROI uses ad spend as the sole cost basis. It is not overall business profit.
          </p>
          <div>
            <label className={labelClass} htmlFor="roas-roi">
              <span>Ad-only ROI</span>
              <InfoTooltip
                label="Ad-only ROI"
                text="((Ad revenue − ad spend) ÷ ad spend) × 100. Ignores product costs and other expenses."
              />
            </label>
            <FieldShell muted>
              <input
                id="roas-roi"
                className={`${inputClass} cursor-default pr-8 font-semibold`}
                readOnly
                value={result?.formattedAdOnlyRoiPercent ?? ''}
                placeholder="—"
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </FieldShell>
          </div>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
