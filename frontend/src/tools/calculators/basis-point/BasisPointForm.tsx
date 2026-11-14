'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AmountSnapshot,
  BasisPointFieldErrors,
  BasisPointInput,
  ConversionField,
} from './types';

interface BasisPointFormProps {
  input: BasisPointInput;
  errors: BasisPointFieldErrors;
  amount: AmountSnapshot | null;
  onConversionEdit: (field: ConversionField, value: string) => void;
  onAmountEdit: (patch: Partial<Pick<BasisPointInput, 'xBps' | 'ofAmount' | 'currency'>>) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
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

function SuffixInput({
  id,
  value,
  suffix,
  error,
  onChange,
  readOnly,
}: {
  id: string;
  value: string;
  suffix?: string;
  error?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          className={`${inputClass} ${suffix ? 'pr-12' : ''} ${readOnly ? 'bg-muted/10 font-semibold text-accent' : ''}`}
          inputMode="decimal"
          value={value}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-live={readOnly ? 'polite' : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export function BasisPointForm({
  input,
  errors,
  amount,
  onConversionEdit,
  onAmountEdit,
  onReset,
}: BasisPointFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-4 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Basis Point Conversion
        </legend>
        <p className="text-xs text-muted-foreground">
          1 bps = 0.01% = 0.0001 decimal = 0.1‰. Edit any field to update the others.
        </p>

        <div>
          <FieldLabel
            htmlFor="bps-decimal"
            label="Decimal value"
            tip="Proportion as a decimal. Example: 0.01 = 1% = 100 bps."
          />
          <SuffixInput
            id="bps-decimal"
            value={input.decimal}
            error={errors.decimal}
            onChange={(value) => onConversionEdit('decimal', value)}
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="bps-percent"
            label="Percent"
            tip="Percent form of the same rate. Example: 1% = 100 bps."
          />
          <SuffixInput
            id="bps-percent"
            value={input.percent}
            suffix="%"
            error={errors.percent}
            onChange={(value) => onConversionEdit('percent', value)}
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="bps-permille"
            label="Permille"
            tip="Per-thousand form. Example: 10‰ = 100 bps."
          />
          <SuffixInput
            id="bps-permille"
            value={input.permille}
            suffix="‰"
            error={errors.permille}
            onChange={(value) => onConversionEdit('permille', value)}
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="bps-basis-points"
            label="Basis points"
            tip="Hundredths of a percent. Example: 100 bps = 1%."
          />
          <SuffixInput
            id="bps-basis-points"
            value={input.basisPoints}
            suffix="bps"
            error={errors.basisPoints}
            onChange={(value) => onConversionEdit('basisPoints', value)}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">What is x bps of y?</legend>

        <div>
          <FieldLabel
            htmlFor="bps-x"
            label="x bps"
            tip="How many basis points to apply to the amount."
          />
          <SuffixInput
            id="bps-x"
            value={input.xBps}
            suffix="bps"
            error={errors.xBps}
            onChange={(value) => onAmountEdit({ xBps: value })}
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="bps-of"
            label="Of"
            tip="Monetary base amount. Currency labels the denomination only."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="bps-of"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.ofAmount}
                aria-invalid={Boolean(errors.ofAmount)}
                onChange={(e) => onAmountEdit({ ofAmount: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bps-of-currency"
                value={input.currency}
                onChange={(currency) => onAmountEdit({ currency })}
              />
            </div>
          </div>
          {errors.ofAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ofAmount}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="bps-equals"
            label="Equals"
            tip="(x bps ÷ 10,000) × amount."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="bps-equals"
                className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
                readOnly
                value={amount ? amount.formattedEquals : ''}
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bps-equals-currency"
                value={input.currency}
                onChange={(currency) => onAmountEdit({ currency })}
                aria-label="Equals currency"
              />
            </div>
          </div>
        </div>

        {amount ? (
          <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs leading-relaxed text-accent sm:text-sm">
            {amount.explanation}
            {'. '}
            Example: if a value of {symbol}
            {amount.ofAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            changes by {amount.xBps} bps, it moves by {symbol}
            {amount.formattedEquals}, for a new total of {symbol}
            {(amount.ofAmount + amount.equals).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            .
          </p>
        ) : null}
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
