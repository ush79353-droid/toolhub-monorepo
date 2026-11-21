'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { EstateTaxFieldErrors, EstateTaxInput } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

const ASSET_FIELDS: {
  key: keyof EstateTaxInput;
  label: string;
  tip: string;
}[] = [
  {
    key: 'residence',
    label: 'Residence & Other Real Estate',
    tip: 'Fair market value of residence and other real property included in the gross estate.',
  },
  {
    key: 'investments',
    label: 'Stocks, Bonds, and Other Investments',
    tip: 'Marketable securities and similar investments includible in the gross estate.',
  },
  {
    key: 'savings',
    label: 'Savings, CDs, and Checking Account Balance',
    tip: 'Cash and cash equivalents at date of death.',
  },
  {
    key: 'vehicles',
    label: 'Vehicles, Boats, and Other Properties',
    tip: 'Tangible personal property such as vehicles and boats.',
  },
  {
    key: 'retirement',
    label: 'Retirement Plans',
    tip: 'Assume includible retirement balances (IRA, 401(k), etc.) unless excluded by law.',
  },
  {
    key: 'lifeInsurance',
    label: 'Life Insurance Benefit',
    tip: 'Assumed includible under IRC §2042 when the decedent retained incidents of ownership or the estate is beneficiary.',
  },
  {
    key: 'otherAssets',
    label: 'Other Assets',
    tip: 'Any other property included in the gross estate.',
  },
];

const DEDUCTION_FIELDS: {
  key: keyof EstateTaxInput;
  label: string;
  tip: string;
}[] = [
  {
    key: 'debts',
    label: 'Debts (mortgages, loans, credit cards, etc.)',
    tip: 'Allowable debts and mortgages deducted from the gross estate.',
  },
  {
    key: 'funeralAdmin',
    label: 'Funeral, Administration, and Claims Expenses',
    tip: 'Funeral and administration expenses and claims against the estate.',
  },
  {
    key: 'charitable',
    label: 'Charitable Contributions',
    tip: 'Qualifying charitable bequests deducted from the gross estate.',
  },
  {
    key: 'stateDeathTaxes',
    label: 'State Inheritance or Estate Taxes',
    tip: 'State death taxes deducted when computing the taxable estate (federal estimate only).',
  },
];

interface EstateTaxFormProps {
  input: EstateTaxInput;
  errors: EstateTaxFieldErrors;
  onChange: (input: EstateTaxInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function EstateTaxForm({
  input,
  errors,
  onChange,
  onCalculate,
  onClear,
}: EstateTaxFormProps) {
  const set =
    (key: keyof EstateTaxInput) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...input, [key]: event.target.value });
    };

  const moneyField = (
    key: keyof EstateTaxInput,
    label: string,
    tip: string,
    id: string
  ) => (
    <div key={key}>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={errors[key]}>
        <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
          $
        </span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={input[key]}
          aria-invalid={Boolean(errors[key])}
          onChange={set(key)}
        />
      </FieldShell>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2 text-xs leading-relaxed text-accent">
        Modify the values and click Calculate. Fixed USD. Estimate for decedents dying in{' '}
        <strong>2026</strong> (Form 706 Rev. July 2026).
      </p>

      <section className={sectionClass} aria-labelledby="estate-assets-heading">
        <h3 id="estate-assets-heading" className="text-sm font-semibold text-accent">
          Assets
        </h3>
        <div className="space-y-3">
          {ASSET_FIELDS.map((f) =>
            moneyField(f.key, f.label, f.tip, `estate-tax-${f.key}`)
          )}
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="estate-deductions-heading">
        <h3 id="estate-deductions-heading" className="text-sm font-semibold text-accent">
          Liabilities, Costs, and Deductibles
        </h3>
        <div className="space-y-3">
          {DEDUCTION_FIELDS.map((f) =>
            moneyField(f.key, f.label, f.tip, `estate-tax-${f.key}`)
          )}
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="estate-gifts-heading">
        <h3 id="estate-gifts-heading" className="text-sm font-semibold text-accent">
          Lifetime Gifted Amount
        </h3>
        {moneyField(
          'taxFreeLifetimeGifts',
          "Total amount you've gifted tax free in your lifetime",
          'Informational only. Tax-free (annual-exclusion style) gifts are not treated as adjusted taxable gifts and do not change the basic exclusion in this estimate.',
          'estate-tax-taxFreeLifetimeGifts'
        )}
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          className="h-11 min-w-[140px] rounded-xl px-5 text-sm font-semibold"
        >
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl border-border px-5 text-sm font-semibold text-accent"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
