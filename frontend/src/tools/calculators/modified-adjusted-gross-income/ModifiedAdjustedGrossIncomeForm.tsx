'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MagiFieldErrors,
  MagiInput,
  MagiMoneyFieldKey,
  MagiResult,
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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface MoneyFieldProps {
  id: string;
  label: string;
  tip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  readOnly?: boolean;
  resultValue?: string;
  onValueChange: (v: string) => void;
  onCurrencyChange: (c: SupportedCurrency) => void;
}

function MoneyFieldRow({
  id,
  label,
  tip,
  value,
  currency,
  error,
  readOnly,
  resultValue,
  onValueChange,
  onCurrencyChange,
}: MoneyFieldProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error} muted={readOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden
          >
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} ${readOnly ? 'text-primary' : ''}`}
            inputMode="decimal"
            value={readOnly ? (resultValue ?? '') : value}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : 0}
            aria-invalid={Boolean(error)}
            aria-live={readOnly ? 'polite' : undefined}
            onChange={
              readOnly ? undefined : (e) => onValueChange(e.target.value)
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export interface ModifiedAdjustedGrossIncomeFormProps {
  input: MagiInput;
  errors: MagiFieldErrors;
  result: MagiResult | null;
  onChange: (input: MagiInput) => void;
  onFieldCurrencyChange: (
    field: MagiMoneyFieldKey,
    next: SupportedCurrency
  ) => void;
  onMagiCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

const INCOME_FIELDS: {
  key: MagiMoneyFieldKey;
  id: string;
  label: string;
  tip: string;
}[] = [
  {
    key: 'agi',
    id: 'magi-agi',
    label: 'Adjusted gross income (AGI)',
    tip: 'Your starting AGI from your tax return or AGI estimate. May be negative in rare cases. Blank keeps the result incomplete.',
  },
  {
    key: 'foreignEarnedIncome',
    id: 'magi-foreign-earned',
    label: 'Foreign-earned income',
    tip: 'Enter only qualifying amounts you are adding back per your intended MAGI definition—not wages already included in AGI.',
  },
  {
    key: 'foreignHousingCost',
    id: 'magi-foreign-housing',
    label: 'Foreign housing cost',
    tip: 'Housing exclusion or cost add-backs relevant to your estimate. Not ordinary domestic rent.',
  },
  {
    key: 'nonTaxableSocialBenefits',
    id: 'magi-social-benefits',
    label: 'Non-taxable social benefits',
    tip: 'Nontaxable Social Security or similar benefits only when your MAGI purpose requires adding them back.',
  },
  {
    key: 'selfEmploymentTaxes',
    id: 'magi-se-tax',
    label: 'Self-employment taxes',
    tip: 'User-entered add-back (e.g. deductible half of SE tax)—not the full SE tax unless that is what you intend to add.',
  },
  {
    key: 'iraContributions',
    id: 'magi-ira',
    label: 'IRA contributions',
    tip: 'Traditional IRA deduction or other IRA-related add-backs only when required for your MAGI purpose.',
  },
  {
    key: 'passiveIncomeOrLosses',
    id: 'magi-passive',
    label: 'Passive income or losses',
    tip: 'Signed values allowed. Enter net passive activity amounts your definition requires.',
  },
  {
    key: 'others',
    id: 'magi-others',
    label: 'Others',
    tip: 'Documented qualifying adjustments only—not a catch-all for unrelated income.',
  },
];

const OTHER_FIELDS: {
  key: MagiMoneyFieldKey;
  id: string;
  label: string;
  tip: string;
}[] = [
  {
    key: 'employerPaidAdoptionBenefits',
    id: 'magi-adoption',
    label: 'Employer-paid adoption benefits',
    tip: 'Excluded adoption assistance that must be added back when applicable.',
  },
  {
    key: 'savingsBondInterest',
    id: 'magi-savings-bond',
    label: 'Savings bond interest',
    tip: 'Tax-exempt savings bond interest add-back when required—avoid double-counting taxable bond interest already in AGI.',
  },
  {
    key: 'studentLoanInterest',
    id: 'magi-student-loan',
    label: 'Student loan interest',
    tip: 'Typically the deductible student loan interest add-back—not total interest paid if none was deducted.',
  },
  {
    key: 'qualifiedTuitionExpenses',
    id: 'magi-tuition',
    label: 'Qualified tuition expenses and fees',
    tip: 'Tuition-related deduction or exclusion add-back when your MAGI definition requires it.',
  },
];

export function ModifiedAdjustedGrossIncomeForm({
  input,
  errors,
  result,
  onChange,
  onFieldCurrencyChange,
  onMagiCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: ModifiedAdjustedGrossIncomeFormProps) {
  const [incomeOpen, setIncomeOpen] = useState(input.incomeExpensesOpen);
  const [otherOpen, setOtherOpen] = useState(input.otherIncomeOpen);

  const set = (patch: Partial<MagiInput>) => {
    onChange({ ...input, ...patch });
  };

  const renderField = (field: (typeof INCOME_FIELDS)[number]) => {
    const currencyKey = `${field.key}Currency` as keyof MagiInput;
    return (
      <MoneyFieldRow
        key={field.key}
        id={field.id}
        label={field.label}
        tip={field.tip}
        value={input[field.key]}
        currency={input[currencyKey] as SupportedCurrency}
        error={errors[field.key]}
        onValueChange={(v) => set({ [field.key]: v })}
        onCurrencyChange={(c) => onFieldCurrencyChange(field.key, c)}
      />
    );
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-950">
        Illustrative simplified MAGI estimate only—not IRA, Roth, ACA, or
        education program eligibility. Enter qualifying add-backs; avoid
        double-counting amounts already in AGI.
      </p>

      <CollapsibleSection
        title="Income and expenses"
        open={incomeOpen}
        onToggle={() => {
          const next = !incomeOpen;
          setIncomeOpen(next);
          set({ incomeExpensesOpen: next });
        }}
      >
        {INCOME_FIELDS.map(renderField)}
      </CollapsibleSection>

      <CollapsibleSection
        title="Other income and expenses"
        open={otherOpen}
        onToggle={() => {
          const next = !otherOpen;
          setOtherOpen(next);
          set({ otherIncomeOpen: next });
        }}
      >
        {OTHER_FIELDS.map(renderField)}
      </CollapsibleSection>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <MoneyFieldRow
          id="magi-result"
          label="Modified adjusted gross income (MAGI)"
          tip="Sum of AGI and all listed fields after FX into the AGI currency, shown in your chosen result currency."
          value=""
          currency={input.magiCurrency}
          readOnly
          resultValue={result?.formattedMagi ?? ''}
          onValueChange={() => undefined}
          onCurrencyChange={onMagiCurrencyChange}
        />
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
