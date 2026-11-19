'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AdvancedBenefitsInput,
  AdvancedCostsInput,
  BillingFrequency,
  HrSoftwareRoiFieldErrors,
  HrSoftwareRoiInput,
  HrSoftwareRoiResult,
  PeriodPreset,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-white/70 p-3';

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

function MoneyField({
  id,
  label,
  tooltip,
  value,
  error,
  symbol,
  onChange,
}: {
  id: string;
  label: string;
  tooltip?: string;
  value: string;
  error?: string;
  symbol: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tooltip ? <InfoTooltip label={label} text={tooltip} /> : null}
      </label>
      <FieldShell error={error}>
        <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function NumField({
  id,
  label,
  value,
  onChange,
  unit,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
      </label>
      <FieldShell>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {unit ? (
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">{unit}</span>
        ) : null}
      </FieldShell>
    </div>
  );
}

interface HrSoftwareRoiFormProps {
  input: HrSoftwareRoiInput;
  errors: HrSoftwareRoiFieldErrors;
  result: HrSoftwareRoiResult | null;
  onChange: (input: HrSoftwareRoiInput) => void;
  onCurrencyChange: (currency: HrSoftwareRoiInput['currency']) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function HrSoftwareRoiForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
  onClear,
  onReset,
}: HrSoftwareRoiFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const setCost = (patch: Partial<AdvancedCostsInput>) =>
    onChange({ ...input, costs: { ...input.costs, ...patch } });
  const setBenefit = (patch: Partial<AdvancedBenefitsInput>) =>
    onChange({ ...input, benefits: { ...input.benefits, ...patch } });

  const freqSelect = (
    id: string,
    value: BillingFrequency,
    onFreq: (f: BillingFrequency) => void,
  ) => (
    <select
      id={id}
      className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
      value={value}
      onChange={(e) => onFreq(e.target.value as BillingFrequency)}
    >
      <option value="monthly">Monthly</option>
      <option value="quarterly">Quarterly</option>
      <option value="annually">Annually</option>
      <option value="one-time">One-time</option>
    </select>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-foreground/90">
        The simple version calculates ROI using the total software investment cost and the
        financial benefits received. For a detailed calculation, enable the breakdown of costs and
        benefits.
      </p>
      <p className="text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border"
          checked={input.showAdvanced}
          onChange={(e) => onChange({ ...input, showAdvanced: e.target.checked })}
        />
        <span>Show an itemized breakdown of costs and benefits</span>
      </label>

      <div>
        <label className={labelClass} htmlFor="hr-roi-currency">
          <span>Display currency</span>
        </label>
        <CurrencySelect
          id="hr-roi-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Display currency"
        />
      </div>

      {input.showAdvanced ? (
        <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <div>
            <label className={labelClass} htmlFor="hr-period">
              <span>Evaluation period</span>
            </label>
            <select
              id="hr-period"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.periodPreset}
              onChange={(e) =>
                onChange({ ...input, periodPreset: e.target.value as PeriodPreset })
              }
            >
              <option value="1y">1 year</option>
              <option value="2y">2 years</option>
              <option value="3y">3 years</option>
              <option value="5y">5 years</option>
              <option value="custom">Custom months</option>
            </select>
          </div>
          {input.periodPreset === 'custom' ? (
            <NumField
              id="hr-custom-months"
              label="Custom months"
              value={input.customMonths}
              onChange={(customMonths) => onChange({ ...input, customMonths })}
              unit="months"
            />
          ) : null}
          {errors.customMonths ? (
            <p className="text-xs text-rose-600">{errors.customMonths}</p>
          ) : null}

          <div className={sectionClass}>
            <h3 className="text-sm font-semibold text-accent">HR software investment costs</h3>
            <MoneyField
              id="c-license"
              label="Initial software/license purchase"
              symbol={symbol}
              value={input.costs.initialLicense}
              onChange={(initialLicense) => setCost({ initialLicense })}
            />
            <MoneyField
              id="c-impl"
              label="Implementation and configuration"
              symbol={symbol}
              value={input.costs.implementation}
              onChange={(implementation) => setCost({ implementation })}
            />
            <MoneyField
              id="c-migrate"
              label="Data migration"
              symbol={symbol}
              value={input.costs.dataMigration}
              onChange={(dataMigration) => setCost({ dataMigration })}
            />
            <MoneyField
              id="c-train"
              label="Employee training"
              symbol={symbol}
              value={input.costs.training}
              onChange={(training) => setCost({ training })}
            />
            <MoneyField
              id="c-int"
              label="Software integration"
              symbol={symbol}
              value={input.costs.integration}
              onChange={(integration) => setCost({ integration })}
            />
            <MoneyField
              id="c-sub"
              label="Subscription cost"
              symbol={symbol}
              value={input.costs.subscriptionAmount}
              onChange={(subscriptionAmount) => setCost({ subscriptionAmount })}
            />
            <div>
              <label className={labelClass} htmlFor="c-sub-freq">
                Subscription billing frequency
              </label>
              {freqSelect('c-sub-freq', input.costs.subscriptionFrequency, (subscriptionFrequency) =>
                setCost({ subscriptionFrequency }),
              )}
            </div>
            <MoneyField
              id="c-maint"
              label="Maintenance and technical support"
              symbol={symbol}
              value={input.costs.maintenance}
              onChange={(maintenance) => setCost({ maintenance })}
            />
            <div>
              <label className={labelClass} htmlFor="c-maint-freq">
                Maintenance billing frequency
              </label>
              {freqSelect('c-maint-freq', input.costs.maintenanceFrequency, (maintenanceFrequency) =>
                setCost({ maintenanceFrequency }),
              )}
            </div>
            <NumField
              id="c-hours"
              label="Internal implementation hours"
              value={input.costs.implHours}
              onChange={(implHours) => setCost({ implHours })}
              unit="hours"
            />
            <MoneyField
              id="c-hourly"
              label="Loaded hourly labor cost"
              symbol={symbol}
              value={input.costs.loadedHourlyCost}
              onChange={(loadedHourlyCost) => setCost({ loadedHourlyCost })}
            />
            <MoneyField
              id="c-other"
              label="Other HR software expenses"
              symbol={symbol}
              value={input.costs.otherCosts}
              onChange={(otherCosts) => setCost({ otherCosts })}
            />
          </div>

          <div className={sectionClass}>
            <h3 className="text-sm font-semibold text-accent">HR software financial benefits</h3>
            <p className="text-xs text-muted-foreground">
              Time savings are estimated labor value unless staffing costs actually fall. Count each
              benefit only once — avoid double-counting overlapping savings.
            </p>
            <NumField
              id="b-emp"
              label="HR employees affected"
              value={input.benefits.hrEmployees}
              onChange={(hrEmployees) => setBenefit({ hrEmployees })}
            />
            <NumField
              id="b-hrs"
              label="Hours saved per employee per week"
              value={input.benefits.hoursSavedPerWeek}
              onChange={(hoursSavedPerWeek) => setBenefit({ hoursSavedPerWeek })}
            />
            <MoneyField
              id="b-admin-rate"
              label="Loaded hourly labor cost (admin)"
              symbol={symbol}
              value={input.benefits.adminHourlyCost}
              onChange={(adminHourlyCost) => setBenefit({ adminHourlyCost })}
            />
            <NumField
              id="b-weeks"
              label="Working weeks per year"
              value={input.benefits.workingWeeks}
              onChange={(workingWeeks) => setBenefit({ workingWeeks })}
            />
            <MoneyField
              id="b-pay-old"
              label="Current payroll processing cost / month"
              symbol={symbol}
              value={input.benefits.payrollCurrentMonthly}
              onChange={(payrollCurrentMonthly) => setBenefit({ payrollCurrentMonthly })}
            />
            <MoneyField
              id="b-pay-new"
              label="Expected payroll cost / month after"
              symbol={symbol}
              value={input.benefits.payrollNewMonthly}
              onChange={(payrollNewMonthly) => setBenefit({ payrollNewMonthly })}
            />
            <NumField
              id="b-hires"
              label="Annual number of hires"
              value={input.benefits.annualHires}
              onChange={(annualHires) => setBenefit({ annualHires })}
            />
            <MoneyField
              id="b-hire-old"
              label="Previous cost per hire"
              symbol={symbol}
              value={input.benefits.oldCostPerHire}
              onChange={(oldCostPerHire) => setBenefit({ oldCostPerHire })}
            />
            <MoneyField
              id="b-hire-new"
              label="Expected cost per hire after"
              symbol={symbol}
              value={input.benefits.newCostPerHire}
              onChange={(newCostPerHire) => setBenefit({ newCostPerHire })}
            />
            <NumField
              id="b-ret-emp"
              label="Employees (retention model)"
              value={input.benefits.retentionEmployees}
              onChange={(retentionEmployees) => setBenefit({ retentionEmployees })}
            />
            <NumField
              id="b-turn-old"
              label="Previous annual turnover %"
              value={input.benefits.oldTurnoverPercent}
              onChange={(oldTurnoverPercent) => setBenefit({ oldTurnoverPercent })}
              unit="%"
            />
            <NumField
              id="b-turn-new"
              label="Expected annual turnover %"
              value={input.benefits.newTurnoverPercent}
              onChange={(newTurnoverPercent) => setBenefit({ newTurnoverPercent })}
              unit="%"
            />
            <MoneyField
              id="b-replace"
              label="Replacement cost per employee"
              symbol={symbol}
              value={input.benefits.replacementCost}
              onChange={(replacementCost) => setBenefit({ replacementCost })}
            />
            <NumField
              id="b-errors"
              label="Estimated annual errors avoided"
              value={input.benefits.avoidedErrors}
              onChange={(avoidedErrors) => setBenefit({ avoidedErrors })}
            />
            <MoneyField
              id="b-err-cost"
              label="Average cost per error"
              symbol={symbol}
              value={input.benefits.costPerError}
              onChange={(costPerError) => setBenefit({ costPerError })}
            />
            <MoneyField
              id="b-docs-old"
              label="Document processing cost / month before"
              symbol={symbol}
              value={input.benefits.docsCurrentMonthly}
              onChange={(docsCurrentMonthly) => setBenefit({ docsCurrentMonthly })}
            />
            <MoneyField
              id="b-docs-new"
              label="Document processing cost / month after"
              symbol={symbol}
              value={input.benefits.docsNewMonthly}
              onChange={(docsNewMonthly) => setBenefit({ docsNewMonthly })}
            />
            <MoneyField
              id="b-third"
              label="Third-party service savings (annual)"
              symbol={symbol}
              value={input.benefits.thirdPartySavings}
              onChange={(thirdPartySavings) => setBenefit({ thirdPartySavings })}
            />
            <MoneyField
              id="b-other"
              label="Other verified or projected savings (annual)"
              symbol={symbol}
              value={input.benefits.otherBenefits}
              onChange={(otherBenefits) => setBenefit({ otherBenefits })}
            />
          </div>
        </div>
      ) : null}

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-sm font-semibold text-accent">The software ROI for the period</h3>

        {!input.showAdvanced ? (
          <>
            <MoneyField
              id="hr-cost"
              label="Cost of investment"
              tooltip="Enter the total cost of purchasing, implementing, and operating the HR software during the evaluation period."
              symbol={symbol}
              value={input.simpleCost}
              error={errors.simpleCost}
              onChange={(simpleCost) => onChange({ ...input, simpleCost })}
            />
            <MoneyField
              id="hr-benefit"
              label="Benefit of investment"
              tooltip="Enter the total measurable financial savings and benefits generated by your HR software, before subtracting its investment cost."
              symbol={symbol}
              value={input.simpleBenefit}
              error={errors.simpleBenefit}
              onChange={(simpleBenefit) => onChange({ ...input, simpleBenefit })}
            />
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Totals below are calculated from the itemized breakdown for the selected period.
          </p>
        )}

        <div>
          <p className={labelClass}>Software ROI</p>
          <FieldShell>
            <input
              className={`${inputClass} text-primary`}
              readOnly
              value={result?.formattedRoiPercentage ?? ''}
              aria-readonly="true"
              aria-label="Software ROI percent"
            />
            <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
        </div>
      </form>

      <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">HR software ROI summary</h3>
        {result ? (
          <ul className="space-y-1.5 text-sm text-foreground/90">
            <li>Evaluation period: {result.periodLabel}</li>
            <li>
              Total investment: {symbol}
              {result.formattedInvestmentCost}
            </li>
            <li>
              Total financial benefits: {symbol}
              {result.formattedGrossBenefit}
            </li>
            <li>
              Net financial benefit: {symbol}
              {result.formattedNetBenefit}
            </li>
            <li>Software ROI: {result.formattedRoiPercentage}%</li>
            <li>Benefit-cost ratio: {result.formattedBenefitCostRatio}</li>
            {result.paybackYears !== null ? (
              <li>Estimated payback: {result.formattedPaybackYears} years</li>
            ) : result.paybackMessage ? (
              <li>{result.paybackMessage}</li>
            ) : null}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter investment cost and benefits to see ROI.
          </p>
        )}
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground" role="status">
            {result.interpretation} ROI alone does not prove an investment is good or bad — weigh
            assumptions, adoption risk, and nonfinancial value.
          </p>
        ) : null}
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
          Load example (50%)
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
