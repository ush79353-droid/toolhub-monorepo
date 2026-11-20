'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ConsumerSurplusFieldErrors,
  ConsumerSurplusInput,
  ConsumerSurplusMode,
  ConsumerSurplusResult,
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

interface ConsumerSurplusFormProps {
  input: ConsumerSurplusInput;
  errors: ConsumerSurplusFieldErrors;
  result: ConsumerSurplusResult | null;
  onChange: (input: ConsumerSurplusInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ConsumerSurplusForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ConsumerSurplusFormProps) {
  const [relatedOpen, setRelatedOpen] = useState(false);
  const symbol = getCurrencySymbol(input.currency);
  const actualReadOnly = input.mode === 'actualPrice';
  const willingReadOnly = input.mode === 'willingPrice';
  const surplusReadOnly = input.mode === 'consumerSurplus';

  const set = (patch: Partial<ConsumerSurplusInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMode = (mode: ConsumerSurplusMode) => {
    if (mode === input.mode) return;
    set({ mode });
  };

  const surplusDisplay =
    surplusReadOnly
      ? result?.status === 'priceExceedsWillingness'
        ? result.formattedSignedDifference
        : (result?.formattedConsumerSurplus ?? '')
      : input.consumerSurplus;

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
          changes the symbol only — it does not convert values. CS = willing
          price − actual price.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="cs-currency"
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
              name="cs-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'consumerSurplus'}
              onChange={() => setMode('consumerSurplus')}
            />
            Consumer surplus
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="cs-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'willingPrice'}
              onChange={() => setMode('willingPrice')}
            />
            Willing price
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="cs-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'actualPrice'}
              onChange={() => setMode('actualPrice')}
            />
            Actual price
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="cs-actual" className={labelClass}>
          <span>Actual price</span>
          <InfoTooltip
            label="Actual price"
            text="The amount paid by the consumer for the product or service."
          />
        </label>
        <FieldShell error={errors.actualPrice} muted={actualReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cs-actual"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={actualReadOnly}
            tabIndex={actualReadOnly ? -1 : undefined}
            value={
              actualReadOnly
                ? (result?.formattedActualPrice ?? '')
                : input.actualPrice
            }
            aria-invalid={errors.actualPrice ? true : undefined}
            aria-live={actualReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ actualPrice: e.target.value })}
          />
        </FieldShell>
        {errors.actualPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.actualPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cs-willing" className={labelClass}>
          <span>Willing price</span>
          <InfoTooltip
            label="Maximum willingness to pay"
            text="The maximum amount a consumer would be prepared to pay for the product or service."
          />
        </label>
        <FieldShell error={errors.willingPrice} muted={willingReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cs-willing"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={willingReadOnly}
            tabIndex={willingReadOnly ? -1 : undefined}
            value={
              willingReadOnly
                ? (result?.formattedWillingPrice ?? '')
                : input.willingPrice
            }
            aria-invalid={errors.willingPrice ? true : undefined}
            aria-live={willingReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ willingPrice: e.target.value })}
          />
        </FieldShell>
        {errors.willingPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.willingPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cs-surplus" className={labelClass}>
          <span>Consumer surplus</span>
          <InfoTooltip
            label="Consumer surplus"
            text="CS = willing price − actual price. When actual price exceeds willingness to pay, the signed difference is shown with a warning — realized surplus from a voluntary purchase is not applicable."
          />
        </label>
        <FieldShell error={errors.consumerSurplus} muted={surplusReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cs-surplus"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={surplusReadOnly}
            tabIndex={surplusReadOnly ? -1 : undefined}
            value={surplusDisplay}
            aria-invalid={errors.consumerSurplus ? true : undefined}
            aria-live={surplusReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ consumerSurplus: e.target.value })}
          />
        </FieldShell>
        {errors.consumerSurplus ? (
          <p className="mt-1 text-xs text-rose-600">{errors.consumerSurplus}</p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-amber-700" role="status">
            {errors.form}
          </p>
        ) : null}
      </div>

      <fieldset className="rounded-xl border border-border bg-muted/15">
        <legend className="sr-only">Related information</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={relatedOpen}
          onClick={() => setRelatedOpen((o) => !o)}
        >
          <span>Related information</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              relatedOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {relatedOpen ? (
          <div className="space-y-2 border-t border-border px-3.5 py-3.5 text-xs leading-relaxed text-muted-foreground sm:px-4 sm:py-4 sm:text-sm">
            <p>
              <strong className="text-accent">Consumer surplus</strong> is the
              benefit from paying less than maximum willingness to pay: CS =
              WTP − P.
            </p>
            <p>
              <strong className="text-accent">Positive</strong> surplus means the
              purchase price is below WTP.{' '}
              <strong className="text-accent">Zero</strong> means they are equal.
            </p>
            <p>
              When actual price exceeds WTP, the signed difference is negative.
              Under a voluntary-purchase model, realized surplus is not
              applicable — not buying yields zero surplus.
            </p>
            <p>
              <strong className="text-accent">Producer surplus</strong> is the
              producer-side analogue when market price exceeds the minimum
              acceptable supply price — distinct from consumer surplus.
            </p>
            <p>
              Savings % relative to WTP uses (WTP − P) / WTP × 100 when WTP &gt;
              0. It is not a retail-list discount unless WTP equals the listed
              price.
            </p>
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}
