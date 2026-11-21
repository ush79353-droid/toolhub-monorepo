'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { DEFAULT_SDLT_SCHEDULE } from './rates';
import type {
  SdltBuyerScenario,
  SdltResidency,
  StampDutyLandTaxUkFieldErrors,
  StampDutyLandTaxUkInput,
  StampDutyLandTaxUkResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

function RadioRow({
  name,
  checked,
  onChange,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
      <input
        type="radio"
        name={name}
        className="h-4 w-4 accent-primary"
        checked={checked}
        onChange={onChange}
      />
      <span className={checked ? 'font-semibold' : 'font-normal'}>
        {children}
      </span>
    </label>
  );
}

const BUYER_OPTIONS: { value: SdltBuyerScenario; label: string }[] = [
  { value: 'first_time_buyer', label: 'a first-time buyer' },
  { value: 'moving_home', label: 'moving home' },
  { value: 'additional_property', label: 'buying additional property' },
  { value: 'let_or_flip', label: 'buying a property to let or flip' },
];

const RESIDENCY_OPTIONS: { value: SdltResidency; label: string }[] = [
  { value: 'uk', label: 'UK resident' },
  { value: 'non_uk', label: 'Non-UK resident' },
];

interface StampDutyLandTaxUkFormProps {
  input: StampDutyLandTaxUkInput;
  errors: StampDutyLandTaxUkFieldErrors;
  result: StampDutyLandTaxUkResult | null;
  onChange: (input: StampDutyLandTaxUkInput) => void;
  onLoadExample: () => void;
}

export function StampDutyLandTaxUkForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: StampDutyLandTaxUkFormProps) {
  const set = (patch: Partial<StampDutyLandTaxUkInput>) =>
    onChange({ ...input, ...patch });

  const stampDisplay = result?.formattedStampDuty ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        England &amp; Northern Ireland residential SDLT ({DEFAULT_SDLT_SCHEDULE.label}).
        Fixed £ — no FX. Not Scotland or Wales.{' '}
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example
        </button>
      </p>

      <fieldset className={sectionClass}>
        <legend className={labelClass}>
          I am…
          <InfoTooltip text="Choose the buyer scenario that matches your purchase. Additional / let-or-flip use higher rates (+5 pp from 1 April 2025)." />
        </legend>
        <div className="space-y-2.5">
          {BUYER_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.value}
              name="sdlt-buyer"
              checked={input.buyerScenario === opt.value}
              onChange={() => set({ buyerScenario: opt.value })}
            >
              {opt.label}
            </RadioRow>
          ))}
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={labelClass}>
          Residency
          <InfoTooltip text="Non-UK residents usually pay a further 2% surcharge on residential SDLT in England and Northern Ireland." />
        </legend>
        <div className="space-y-2.5">
          {RESIDENCY_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.value}
              name="sdlt-residency"
              checked={input.residency === opt.value}
              onChange={() => set({ residency: opt.value })}
            >
              {opt.label}
            </RadioRow>
          ))}
        </div>
      </fieldset>

      <div className={sectionClass}>
        <div>
          <label htmlFor="sdlt-property-price" className={labelClass}>
            Property price
          </label>
          <FieldShell error={errors.propertyPrice}>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              £
            </span>
            <input
              id="sdlt-property-price"
              inputMode="decimal"
              className="h-11 w-full min-w-0 bg-transparent px-2 text-sm tabular-nums text-accent outline-none"
              value={input.propertyPrice}
              onChange={(e) => set({ propertyPrice: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.propertyPrice)}
            />
          </FieldShell>
          {errors.propertyPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.propertyPrice}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sdlt-stamp-duty" className={labelClass}>
            Stamp duty
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              £
            </span>
            <input
              id="sdlt-stamp-duty"
              readOnly
              tabIndex={-1}
              className="h-11 w-full min-w-0 cursor-default bg-transparent px-2 text-sm tabular-nums text-accent outline-none"
              value={stampDisplay}
              placeholder="—"
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
