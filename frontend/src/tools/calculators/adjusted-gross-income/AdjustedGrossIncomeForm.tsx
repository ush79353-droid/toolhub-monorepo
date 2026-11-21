'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AdjustedGrossIncomeFieldErrors,
  AdjustedGrossIncomeInput,
  AdjustedGrossIncomeResult,
  FilingStatus,
  HsaCoverage,
  MoneyFieldKey,
  ResultCurrencyKey,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface MoneyRowProps {
  id: string;
  label: string;
  tooltip: string;
  amountKey: MoneyFieldKey;
  currencyKey: `${MoneyFieldKey}Currency`;
  input: AdjustedGrossIncomeInput;
  error?: string;
  onChange: (input: AdjustedGrossIncomeInput) => void;
  onCurrencyChange: (
    amountKey: MoneyFieldKey,
    next: SupportedCurrency
  ) => void;
  allowNegative?: boolean;
}

function MoneyRow({
  id,
  label,
  tooltip,
  amountKey,
  currencyKey,
  input,
  error,
  onChange,
  onCurrencyChange,
}: MoneyRowProps) {
  const currency = input[currencyKey] as SupportedCurrency;
  const amount = input[amountKey] as string;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {getCurrencySymbol(currency)}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={amount}
            aria-invalid={Boolean(error)}
            onChange={(e) =>
              onChange({ ...input, [amountKey]: e.target.value })
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={(next) => onCurrencyChange(amountKey, next)}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface ResultRowProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  currencyKey: ResultCurrencyKey;
  onCurrencyChange: (key: ResultCurrencyKey, next: SupportedCurrency) => void;
}

function ResultRow({
  id,
  label,
  tooltip,
  value,
  currency,
  currencyKey,
  onCurrencyChange,
}: ResultRowProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {getCurrencySymbol(currency)}
          </span>
          <input
            id={id}
            className={`${inputClass} text-primary`}
            readOnly
            tabIndex={-1}
            value={value}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={(next) => onCurrencyChange(currencyKey, next)}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );
}

interface AdjustedGrossIncomeFormProps {
  input: AdjustedGrossIncomeInput;
  errors: AdjustedGrossIncomeFieldErrors;
  result: AdjustedGrossIncomeResult | null;
  onChange: (input: AdjustedGrossIncomeInput) => void;
  onMoneyCurrencyChange: (
    field: MoneyFieldKey,
    next: SupportedCurrency
  ) => void;
  onResultCurrencyChange: (
    key: ResultCurrencyKey,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function AdjustedGrossIncomeForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  onResultCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: AdjustedGrossIncomeFormProps) {
  const set = (patch: Partial<AdjustedGrossIncomeInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
 Educational simplified Form 1040–style AGI estimate for Tax Year 2025; 
        not a complete IRS filing. Enter income and deductions below; AGI appears
        at the bottom. Checkboxes reveal extra fields. IRS limits apply in USD
        after FX conversion.
      </p>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.filingDetailsOpen}
        onToggle={(event) =>
          set({ filingDetailsOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.filingDetailsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Filing details</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="agi-filing">
              <span>Filing status</span>
              <InfoTooltip
                label="Filing status"
                text="Used for capital-loss limits and IRA / student-loan MAGI phaseouts."
              />
            </label>
            <select
              id="agi-filing"
              className={selectClass}
              value={input.filingStatus}
              onChange={(e) =>
                set({ filingStatus: e.target.value as FilingStatus })
              }
            >
              <option value="single">Single</option>
              <option value="married-joint">Married filing jointly</option>
              <option value="married-separate">Married filing separately</option>
              <option value="head-of-household">Head of household</option>
              <option value="qualifying-surviving-spouse">
                Qualifying surviving spouse
              </option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="agi-hsa-coverage">
              <span>HSA HDHP coverage</span>
            </label>
            <select
              id="agi-hsa-coverage"
              className={selectClass}
              value={input.hsaCoverage}
              onChange={(e) =>
                set({ hsaCoverage: e.target.value as HsaCoverage })
              }
            >
              <option value="self-only">Self-only</option>
              <option value="family">Family</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.age50OrOver}
              onChange={(e) => set({ age50OrOver: e.target.checked })}
            />
            Age 50 or over (IRA catch-up)
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.age55OrOver}
              onChange={(e) => set({ age55OrOver: e.target.checked })}
            />
            Age 55 or over (HSA catch-up)
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.coveredByWorkplacePlan}
              onChange={(e) =>
                set({ coveredByWorkplacePlan: e.target.checked })
              }
            />
            Covered by a workplace retirement plan
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.selfEmployedHealthInsurance}
              onChange={(e) =>
                set({ selfEmployedHealthInsurance: e.target.checked })
              }
            />
            Self-employed health insurance eligible (Schedule 1)
          </label>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.grossIncomeOpen}
        onToggle={(event) => set({ grossIncomeOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.grossIncomeOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Gross income</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <MoneyRow
            id="agi-wages"
            label="Salary, wages and tips"
            tooltip="Form W-2 box 1 wages and tips (taxable). Do not add amounts already excluded from box 1."
            amountKey="wages"
            currencyKey="wagesCurrency"
            input={input}
            error={errors.wages}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />
          <MoneyRow
            id="agi-business"
            label="Business / self-employment"
            tooltip="Net profit from self-employment (Schedule C style). Used for SE health insurance and half of SE tax estimates."
            amountKey="business"
            currencyKey="businessCurrency"
            input={input}
            error={errors.business}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />
          <MoneyRow
            id="agi-interest"
            label="Interest, dividends, royalties, etc."
            tooltip="Taxable interest, ordinary dividends, royalties, and similar portfolio income."
            amountKey="interestDividends"
            currencyKey="interestDividendsCurrency"
            input={input}
            error={errors.interestDividends}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />
          <MoneyRow
            id="agi-capital"
            label="Capital gains and losses"
            tooltip="Net capital gain or loss. Net losses included in AGI are limited to $3,000 ($1,500 MFS)."
            amountKey="capitalGains"
            currencyKey="capitalGainsCurrency"
            input={input}
            error={errors.capitalGains}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
            allowNegative
          />
          <MoneyRow
            id="agi-pension"
            label="Pension / Annuity / IRA distributions"
            tooltip="Enter the taxable portion of pensions, annuities, and IRA distributions."
            amountKey="retirementDistributions"
            currencyKey="retirementDistributionsCurrency"
            input={input}
            error={errors.retirementDistributions}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />

          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.showMoreIncome}
              onChange={(e) => set({ showMoreIncome: e.target.checked })}
            />
            Show more income sources
          </label>

          {input.showMoreIncome ? (
            <div className="space-y-3.5 border-t border-dashed border-border pt-3.5">
              <MoneyRow
                id="agi-unemployment"
                label="Unemployment compensation"
                tooltip="Taxable unemployment benefits."
                amountKey="unemployment"
                currencyKey="unemploymentCurrency"
                input={input}
                error={errors.unemployment}
                onChange={onChange}
                onCurrencyChange={onMoneyCurrencyChange}
              />
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="checkbox"
                  checked={input.alimonyReceivedPre2019}
                  onChange={(e) =>
                    set({ alimonyReceivedPre2019: e.target.checked })
                  }
                />
                Alimony received under a pre-2019 instrument
              </label>
              <MoneyRow
                id="agi-alimony-rec"
                label="Alimony received"
                tooltip="Included only when the divorce/separation instrument was executed on or before Dec 31, 2018."
                amountKey="alimonyReceived"
                currencyKey="alimonyReceivedCurrency"
                input={input}
                error={errors.alimonyReceived}
                onChange={onChange}
                onCurrencyChange={onMoneyCurrencyChange}
              />
              <MoneyRow
                id="agi-ss"
                label="Taxable Social Security benefits"
                tooltip="Enter the taxable portion already figured (Worksheet in Form 1040 instructions). This tool does not recompute the taxable percentage."
                amountKey="taxableSocialSecurity"
                currencyKey="taxableSocialSecurityCurrency"
                input={input}
                error={errors.taxableSocialSecurity}
                onChange={onChange}
                onCurrencyChange={onMoneyCurrencyChange}
              />
              <MoneyRow
                id="agi-other"
                label="Other taxable income"
                tooltip="Other taxable income not listed above. Avoid double-counting."
                amountKey="otherIncome"
                currencyKey="otherIncomeCurrency"
                input={input}
                error={errors.otherIncome}
                onChange={onChange}
                onCurrencyChange={onMoneyCurrencyChange}
              />
            </div>
          ) : null}
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.deductionsOpen}
        onToggle={(event) => set({ deductionsOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.deductionsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Deductions</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Insert positive values; we&apos;ll subtract eligible above-the-line
            adjustments from your income. These are not standard/itemized
            deductions.
          </p>
          <MoneyRow
            id="agi-ira"
            label="Contributions to retirement / IRAs"
            tooltip="Deductible traditional IRA contributions (Pub. 590-A). Not for 401(k) amounts already excluded from W-2 box 1. Caps and workplace-plan phaseouts apply."
            amountKey="iraContributions"
            currencyKey="iraContributionsCurrency"
            input={input}
            error={errors.iraContributions}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />
          <MoneyRow
            id="agi-student"
            label="Student loan interest"
            tooltip="Qualified student loan interest, max $2,500 with MAGI phaseout (Pub. 970). Not allowed if married filing separately."
            amountKey="studentLoanInterest"
            currencyKey="studentLoanInterestCurrency"
            input={input}
            error={errors.studentLoanInterest}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />
          <MoneyRow
            id="agi-educator"
            label="Educator expenses"
            tooltip="Eligible educator unreimbursed expenses, up to $300 for Tax Year 2025."
            amountKey="educatorExpenses"
            currencyKey="educatorExpensesCurrency"
            input={input}
            error={errors.educatorExpenses}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />
          <MoneyRow
            id="agi-hsa"
            label="Healthcare savings account (HSA) contributions"
            tooltip="Your HSA contributions (not employer cafeteria contributions). 2025 limits: $4,300 self-only / $8,550 family (+$1,000 age 55+)."
            amountKey="hsaContributions"
            currencyKey="hsaContributionsCurrency"
            input={input}
            error={errors.hsaContributions}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />
          <MoneyRow
            id="agi-health"
            label="Health insurance premiums"
            tooltip="Only self-employed health insurance (Schedule 1) when marked eligible and business income supports it. Ordinary employee premiums are not deducted here."
            amountKey="healthInsurancePremiums"
            currencyKey="healthInsurancePremiumsCurrency"
            input={input}
            error={errors.healthInsurancePremiums}
            onChange={onChange}
            onCurrencyChange={onMoneyCurrencyChange}
          />

          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.showMoreDeductions}
              onChange={(e) => set({ showMoreDeductions: e.target.checked })}
            />
            Show more deductions
          </label>

          {input.showMoreDeductions ? (
            <div className="space-y-3.5 border-t border-dashed border-border pt-3.5">
              <p className="text-xs text-muted-foreground">
                Half of self-employment tax is estimated automatically from
                business income when present (simplified Schedule SE).
              </p>
              <MoneyRow
                id="agi-penalty"
                label="Penalty on early withdrawal of savings"
                tooltip="Early withdrawal penalty reported on Form 1099-INT (Schedule 1)."
                amountKey="earlyWithdrawalPenalty"
                currencyKey="earlyWithdrawalPenaltyCurrency"
                input={input}
                error={errors.earlyWithdrawalPenalty}
                onChange={onChange}
                onCurrencyChange={onMoneyCurrencyChange}
              />
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="checkbox"
                  checked={input.alimonyPaidPre2019}
                  onChange={(e) =>
                    set({ alimonyPaidPre2019: e.target.checked })
                  }
                />
                Alimony paid under a pre-2019 instrument
              </label>
              <MoneyRow
                id="agi-alimony-paid"
                label="Alimony paid"
                tooltip="Deductible only for instruments executed on or before Dec 31, 2018."
                amountKey="alimonyPaid"
                currencyKey="alimonyPaidCurrency"
                input={input}
                error={errors.alimonyPaid}
                onChange={onChange}
                onCurrencyChange={onMoneyCurrencyChange}
              />
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="checkbox"
                  checked={input.armedForcesMove}
                  onChange={(e) => set({ armedForcesMove: e.target.checked })}
                />
                Armed Forces move (moving expense eligibility)
              </label>
              <MoneyRow
                id="agi-moving"
                label="Moving expenses"
                tooltip="Deductible moving expenses are generally limited to members of the Armed Forces on active duty who move pursuant to a military order."
                amountKey="movingExpenses"
                currencyKey="movingExpensesCurrency"
                input={input}
                error={errors.movingExpenses}
                onChange={onChange}
                onCurrencyChange={onMoneyCurrencyChange}
              />
            </div>
          ) : null}
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.resultsOpen}
        onToggle={(event) => set({ resultsOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.resultsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Results</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <ResultRow
            id="agi-gross"
            label="Gross income"
            tooltip="Sum of included taxable income sources after the capital-loss limitation."
            value={result?.formattedGrossIncome ?? ''}
            currency={input.grossIncomeCurrency}
            currencyKey="grossIncomeCurrency"
            onCurrencyChange={onResultCurrencyChange}
          />
          <ResultRow
            id="agi-adj"
            label="Total adjustments to income"
            tooltip="Sum of eligible Schedule 1 above-the-line adjustments after IRS caps and phaseouts."
            value={result?.formattedTotalAdjustments ?? ''}
            currency={input.totalAdjustmentsCurrency}
            currencyKey="totalAdjustmentsCurrency"
            onCurrencyChange={onResultCurrencyChange}
          />
          <ResultRow
            id="agi-result"
            label="Adjusted gross income"
            tooltip="Gross income minus total adjustments (AGI)."
            value={result?.formattedAgi ?? ''}
            currency={input.agiCurrency}
            currencyKey="agiCurrency"
            onCurrencyChange={onResultCurrencyChange}
          />
          {result?.notes?.length ? (
            <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </details>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
