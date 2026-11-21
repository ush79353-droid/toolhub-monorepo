'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { UK_CGT_YEAR_RULES } from './rates';
import type {
  CapitalGainsTaxUkFieldErrors,
  CapitalGainsTaxUkInput,
  CapitalGainsTaxUkResult,
  UkCgtAssetType,
  UkCgtTaxYearId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
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

function RadioPill({
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
    <label
      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
        checked
          ? 'border-primary bg-primary/10 font-semibold text-accent'
          : 'border-border bg-white text-muted-foreground hover:text-foreground'
      }`}
    >
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      {children}
    </label>
  );
}

const ASSET_OPTIONS: { value: UkCgtAssetType; label: string }[] = [
  { value: 'shares', label: 'Shares' },
  { value: 'property', label: 'Property' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'other', label: 'Other' },
];

interface CapitalGainsTaxUkFormProps {
  input: CapitalGainsTaxUkInput;
  errors: CapitalGainsTaxUkFieldErrors;
  result: CapitalGainsTaxUkResult | null;
  onChange: (input: CapitalGainsTaxUkInput) => void;
  onLoadExample: () => void;
}

export function CapitalGainsTaxUkForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: CapitalGainsTaxUkFormProps) {
  const set = (patch: Partial<CapitalGainsTaxUkInput>) =>
    onChange({ ...input, ...patch });

  const totalDisplay =
    result?.formattedTotalAnnualIncome ??
    (() => {
      const a = Number(String(input.annualIncome).replace(/,/g, ''));
      const o = Number(String(input.otherIncome).replace(/,/g, ''));
      if (!Number.isFinite(a) || !Number.isFinite(o)) return '';
      return (a + o).toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    })();

  const taxDisplay = result?.formattedCapitalGainsTax ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        UK Capital Gains Tax estimate (fixed £). Tax years follow current HMRC
        rates (18%/24% for individuals; 24% for most trustees). Not tax advice.
      </p>

      <fieldset className={sectionClass}>
        <legend className={labelClass}>Tax year</legend>
        <div className="flex flex-wrap gap-2">
          {UK_CGT_YEAR_RULES.map((y) => (
            <RadioPill
              key={y.id}
              name="uk-cgt-tax-year"
              checked={input.taxYear === y.id}
              onChange={() => set({ taxYear: y.id as UkCgtTaxYearId })}
            >
              {y.label}
            </RadioPill>
          ))}
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="text-[13px] font-semibold text-accent">
          Capital gains
        </legend>

        <div>
          <label htmlFor="uk-cgt-gains" className={labelClass}>
            Capital gains
          </label>
          <FieldShell error={errors.capitalGains}>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              £
            </span>
            <input
              id="uk-cgt-gains"
              className={inputClass}
              inputMode="decimal"
              value={input.capitalGains}
              onChange={(e) => set({ capitalGains: e.target.value })}
              placeholder="0.00"
            />
          </FieldShell>
          {errors.capitalGains ? (
            <p className="mt-1 text-xs text-rose-600">{errors.capitalGains}</p>
          ) : null}
        </div>

        <div>
          <p className={labelClass}>Asset type</p>
          <div className="flex flex-wrap gap-2">
            {ASSET_OPTIONS.map((opt) => (
              <RadioPill
                key={opt.value}
                name="uk-cgt-asset"
                checked={input.assetType === opt.value}
                onChange={() => set({ assetType: opt.value })}
              >
                {opt.label}
              </RadioPill>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClass}>Are the assets in a trust?</p>
          <div className="flex flex-wrap gap-2">
            <RadioPill
              name="uk-cgt-trust"
              checked={!input.assetsInTrust}
              onChange={() => set({ assetsInTrust: false })}
            >
              No
            </RadioPill>
            <RadioPill
              name="uk-cgt-trust"
              checked={input.assetsInTrust}
              onChange={() => set({ assetsInTrust: true })}
            >
              Yes
            </RadioPill>
          </div>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="text-[13px] font-semibold text-accent">
          Total annual income
        </legend>

        <div>
          <label htmlFor="uk-cgt-annual" className={labelClass}>
            Annual income
            <InfoTooltip
              label="Annual income"
              text="Enter taxable income after Personal Allowance and Income Tax reliefs (HMRC CGT method). Do not enter gross pay if you have not already deducted the Personal Allowance."
            />
          </label>
          <FieldShell error={errors.annualIncome}>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              £
            </span>
            <input
              id="uk-cgt-annual"
              className={inputClass}
              inputMode="decimal"
              value={input.annualIncome}
              onChange={(e) => set({ annualIncome: e.target.value })}
              placeholder="0.00"
            />
          </FieldShell>
          {errors.annualIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualIncome}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="uk-cgt-other" className={labelClass}>
            Other income
            <InfoTooltip
              label="Other income"
              text="Additional taxable income for the same tax year that should count toward your basic-rate band usage (for example other taxable earnings already reduced for Personal Allowance)."
            />
          </label>
          <FieldShell error={errors.otherIncome}>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              £
            </span>
            <input
              id="uk-cgt-other"
              className={inputClass}
              inputMode="decimal"
              value={input.otherIncome}
              onChange={(e) => set({ otherIncome: e.target.value })}
              placeholder="0.00"
            />
          </FieldShell>
          {errors.otherIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.otherIncome}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="uk-cgt-total" className={labelClass}>
            Total annual income
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              £
            </span>
            <input
              id="uk-cgt-total"
              className={inputClass}
              readOnly
              aria-readonly
              value={totalDisplay}
              tabIndex={-1}
            />
          </FieldShell>
        </div>
      </fieldset>

      <div>
        <label htmlFor="uk-cgt-tax" className={labelClass}>
          Capital gains tax
        </label>
        <FieldShell muted>
          <span
            className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
            aria-hidden
          >
            £
          </span>
          <input
            id="uk-cgt-tax"
            className={inputClass}
            readOnly
            aria-readonly
            aria-live="polite"
            value={taxDisplay}
            placeholder="0.00"
            tabIndex={-1}
          />
        </FieldShell>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load GOV.UK example (2026/27 · £12,600 gain · £20,000 income → £1,728)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
