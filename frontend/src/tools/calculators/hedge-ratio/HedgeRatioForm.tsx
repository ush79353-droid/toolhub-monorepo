'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { HedgeRatioFieldErrors, HedgeRatioInput, HedgeRatioResult } from './types';

interface HedgeRatioFormProps {
  input: HedgeRatioInput;
  errors: HedgeRatioFieldErrors;
  result: HedgeRatioResult | null;
  onChange: (input: HedgeRatioInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function HedgeRatioForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: HedgeRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<HedgeRatioInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="hr-exposure"
          label="Value of total exposure"
          tip="Size of the position being hedged. Must be greater than zero. Currency labels denomination only."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="hr-exposure"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.totalExposure}
              aria-invalid={Boolean(errors.totalExposure)}
              onChange={(e) => set({ totalExposure: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="hr-exposure-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
        </div>
        {errors.totalExposure ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalExposure}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="hr-hedge"
          label="Value of hedge position"
          tip="Notional of the hedge. Zero is allowed; values above exposure show overhedging. Currency labels denomination only."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="hr-hedge"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.hedgePosition}
              aria-invalid={Boolean(errors.hedgePosition)}
              onChange={(e) => set({ hedgePosition: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="hr-hedge-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
        </div>
        {errors.hedgePosition ? (
          <p className="mt-1 text-xs text-rose-600">{errors.hedgePosition}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="hr-result"
          label="Hedge ratio"
          tip="(Hedge position ÷ total exposure) × 100. Above 100% means overhedging."
        />
        <div className="relative">
          <input
            id="hr-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
            value={result ? result.formattedHedgeRatio : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
