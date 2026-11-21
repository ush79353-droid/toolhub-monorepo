'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AmtFieldErrors,
  AmtFilingStatus,
  AmtInput,
  AmtResult,
  AmtTaxYear,
} from './types';
import { FILING_STATUS_OPTIONS, TAX_YEAR_OPTIONS } from './types';

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

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  onChange,
  readOnly,
  note,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  note?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error} muted={readOnly}>
        <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
          $
        </span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={value}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          aria-invalid={Boolean(error)}
          aria-readonly={readOnly ? 'true' : undefined}
          onChange={readOnly || !onChange ? undefined : (e) => onChange(e.target.value)}
        />
      </FieldShell>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
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
    <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left text-sm font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-0' : '-rotate-90'
          }`}
          aria-hidden
        />
        {title}
      </button>
      {open ? <div className="space-y-3.5 border-t border-border pt-3.5">{children}</div> : null}
    </div>
  );
}

interface AmtFormProps {
  input: AmtInput;
  errors: AmtFieldErrors;
  result: AmtResult | null;
  incomeOpen: boolean;
  taxableOpen: boolean;
  dirty: boolean;
  onChange: (input: AmtInput) => void;
  onToggleIncome: () => void;
  onToggleTaxable: () => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function AmtForm({
  input,
  errors,
  result,
  incomeOpen,
  taxableOpen,
  dirty,
  onChange,
  onToggleIncome,
  onToggleTaxable,
  onLoadExample,
  onClear,
  onReset,
}: AmtFormProps) {
  const set = (patch: Partial<AmtInput>) => onChange({ ...input, ...patch });

  const setYear = (taxYear: AmtTaxYear) => set({ taxYear });
  const setFiling = (filingStatus: AmtFilingStatus) => set({ filingStatus });

  const setAgi = (adjustedGrossIncome: string) =>
    set({ adjustedGrossIncome, amtiSource: 'suggested' });
  const setNonDed = (nonDeductibleTaxes: string) =>
    set({ nonDeductibleTaxes, amtiSource: 'suggested' });
  const setAmti = (amti: string) => set({ amti, amtiSource: 'manual' });

  const taxableIncomeDisplay = result?.formattedTaxableExcess ?? '';

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Historical US federal alternative minimum tax (AMT) estimate for tax years 2022 and 2023.
 Amounts are fixed USD. AMTI is the Form 6251-style base; AGI plus non-deductible taxes is
        only a starting suggestion when preference items or other adjustments apply.
      </p>

      <CollapsibleSection
        title="Alternative Minimum Tax Income"
        open={incomeOpen}
        onToggle={onToggleIncome}
      >
        <fieldset>
          <legend className={labelClass}>
            <span>Year</span>
            <InfoTooltip
              label="Year"
              text="Select the historical tax year. Exemption amounts, phaseouts, and 26%/28% AMT brackets follow that year’s IRS Form 6251 instructions; current-year figures are never applied."
            />
          </legend>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {TAX_YEAR_OPTIONS.map((opt) => (
              <label key={opt.year} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="amt-tax-year"
                  checked={input.taxYear === opt.year}
                  onChange={() => setYear(opt.year)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <MoneyField
          id="amt-agi"
          label="Adjusted Gross Income (AGI)"
          tip="Form 1040 AGI. Used only to suggest AMTI when you have not typed AMTI manually. AGI alone does not equal AMTI when AMT adjustments or preference items apply."
          value={input.adjustedGrossIncome}
          error={errors.adjustedGrossIncome}
          onChange={setAgi}
        />

        <MoneyField
          id="amt-nonded"
          label="Non-deductible taxes"
          tip="Taxes that are added back for AMT purposes (for example, certain state and local taxes disallowed under AMT rules). Combined with AGI only as a suggested AMTI starting point."
          value={input.nonDeductibleTaxes}
          error={errors.nonDeductibleTaxes}
          onChange={setNonDed}
        />

        <MoneyField
          id="amt-amti"
          label="AMTI"
          tip="Alternative Minimum Taxable Income: the authoritative base for this calculator (Form 6251 line 4 style). Edit directly when you have AMT adjustments or preference items beyond AGI + non-deductible taxes. Editing AMTI stops auto-suggest from AGI fields."
          value={input.amti}
          error={errors.amti}
          onChange={setAmti}
          note={
            input.amtiSource === 'suggested'
              ? 'Suggested from AGI + non-deductible taxes (edit to override).'
              : 'Manual AMTI entry (Form 6251 line 4 style).'
          }
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Taxable Income"
        open={taxableOpen}
        onToggle={onToggleTaxable}
      >
        <fieldset>
          <legend className={labelClass}>Filing status</legend>
          <div className="flex flex-col gap-2">
            {FILING_STATUS_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="amt-filing-status"
                  checked={input.filingStatus === opt.value}
                  onChange={() => setFiling(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <MoneyField
          id="amt-taxable-income"
          label="Taxable income"
          tip="AMT taxable excess after the year- and status-specific exemption (and MFS add-on when applicable): max(0, adjusted AMTI − allowed exemption). Read-only."
          value={taxableIncomeDisplay}
          readOnly
        />
      </CollapsibleSection>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold tracking-tight text-accent">Alternative Minimum Tax</h3>

        <MoneyField
          id="amt-credits"
          label="Tax credits"
          tip="AMT-permitted credits that reduce tentative minimum tax (for example, the AMT foreign tax credit on Form 6251). Default $0. Credits cannot create a negative AMT figure here."
          value={input.taxCredits}
          error={errors.taxCredits}
          onChange={(taxCredits) => set({ taxCredits })}
        />

        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}

        {result ? (
          <div className="space-y-2 rounded-lg border border-border bg-white p-3">
            <p className="text-[13px] font-medium text-accent">Tentative AMT after credits</p>
            <p className="text-2xl font-semibold tabular-nums text-primary">
              ${result.formattedTentativeAmtAfterCredits}
            </p>
            <dl className="grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
              <div className="flex justify-between gap-2 sm:block">
                <dt>Adjusted AMTI</dt>
                <dd className="tabular-nums text-accent">${result.formattedAmtiAdjusted}</dd>
              </div>
              <div className="flex justify-between gap-2 sm:block">
                <dt>Exemption allowed</dt>
                <dd className="tabular-nums text-accent">${result.formattedExemptionAllowed}</dd>
              </div>
              <div className="flex justify-between gap-2 sm:block">
                <dt>Taxable excess</dt>
                <dd className="tabular-nums text-accent">${result.formattedTaxableExcess}</dd>
              </div>
              <div className="flex justify-between gap-2 sm:block">
                <dt>Tentative minimum tax</dt>
                <dd className="tabular-nums text-accent">
                  ${result.formattedTentativeMinimumTax}
                </dd>
              </div>
              <div className="flex justify-between gap-2 sm:block">
                <dt>Credits applied</dt>
                <dd className="tabular-nums text-accent">${result.formattedCreditsApplied}</dd>
              </div>
            </dl>
            <p className="text-xs leading-relaxed text-muted-foreground">{result.summaryText}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
 Example: $200k AMTI
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-11"
          disabled={!dirty}
          onClick={onClear}
        >
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
