'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  JensensAlphaFieldErrors,
  JensensAlphaInput,
  JensensAlphaResult,
} from './types';

interface JensensAlphaFormProps {
  input: JensensAlphaInput;
  errors: JensensAlphaFieldErrors;
  result: JensensAlphaResult | null;
  onChange: (input: JensensAlphaInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
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

export function JensensAlphaForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: JensensAlphaFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<JensensAlphaInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Portfolio&apos;s return</legend>

        <div>
          <FieldLabel
            htmlFor="ja-begin"
            label="Beginning portfolio value"
            tip="Portfolio value at the start of the period. Must be greater than zero."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ja-begin"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.beginningValue}
                aria-invalid={Boolean(errors.beginningValue)}
                onChange={(e) => set({ beginningValue: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ja-begin-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.beginningValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.beginningValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ja-end"
            label="Ending portfolio value"
            tip="Portfolio value at the end of the period. May be below beginning (negative return)."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ja-end"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.endingValue}
                aria-invalid={Boolean(errors.endingValue)}
                onChange={(e) => set({ endingValue: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ja-end-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.endingValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.endingValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ja-portfolio-return"
            label="Portfolio's return"
            tip="((Ending − Beginning) ÷ Beginning) × 100"
          />
          <div className="relative">
            <input
              id="ja-portfolio-return"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
              value={result ? result.formattedPortfolioReturn : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Jensen&apos;s alpha</legend>

        <div>
          <FieldLabel
            htmlFor="ja-rf"
            label="Risk-free rate"
            tip="Risk-free rate for the same period (%). Negatives are allowed."
          />
          <div className="relative">
            <input
              id="ja-rf"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.riskFreeRate}
              aria-invalid={Boolean(errors.riskFreeRate)}
              onChange={(e) => set({ riskFreeRate: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.riskFreeRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.riskFreeRate}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ja-beta"
            label="Portfolio's beta"
            tip="Portfolio beta versus the market. Zero beta is allowed."
          />
          <input
            id="ja-beta"
            className={inputClass}
            inputMode="decimal"
            value={input.beta}
            aria-invalid={Boolean(errors.beta)}
            onChange={(e) => set({ beta: e.target.value })}
          />
          {errors.beta ? <p className="mt-1 text-xs text-rose-600">{errors.beta}</p> : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ja-market"
            label="Market rate of return"
            tip="Market (benchmark) return for the same period (%). Default 11%."
          />
          <div className="relative">
            <input
              id="ja-market"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.marketReturn}
              aria-invalid={Boolean(errors.marketReturn)}
              onChange={(e) => set({ marketReturn: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.marketReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.marketReturn}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ja-result"
            label="Jensen's alpha"
            tip="Portfolio return − CAPM expected return"
          />
          <div className="relative">
            <input
              id="ja-result"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/20 pr-8 font-semibold text-accent`}
              value={result ? result.formattedJensensAlpha : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
