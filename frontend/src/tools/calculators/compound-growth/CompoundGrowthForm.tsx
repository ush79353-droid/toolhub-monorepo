'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUND_OPTIONS,
  CONTRIBUTION_FREQUENCY_OPTIONS,
  type CompoundFrequency,
  type CompoundGrowthFieldErrors,
  type CompoundGrowthInput,
  type ContributionFrequency,
  type ContributionTiming,
} from './types';

interface CompoundGrowthFormProps {
  input: CompoundGrowthInput;
  errors: CompoundGrowthFieldErrors;
  onChange: (input: CompoundGrowthInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent focus:outline-none focus:ring-2 focus:ring-ring';

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

export function CompoundGrowthForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onReset,
}: CompoundGrowthFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CompoundGrowthInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="cg-initial"
          label="Initial deposit"
          tip="Starting principal. Currency labels denomination only."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="cg-initial"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.initialDeposit}
              aria-invalid={Boolean(errors.initialDeposit)}
              onChange={(e) => set({ initialDeposit: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="cg-initial-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
        {errors.initialDeposit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.initialDeposit}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="cg-rate"
          label="Interest rate"
          tip="Nominal annual interest rate. Period rate = r / compounding frequency."
        />
        <div className="relative">
          <input
            id="cg-rate"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.interestRate}
            aria-invalid={Boolean(errors.interestRate)}
            onChange={(e) => set({ interestRate: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
        {errors.interestRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel label="Term" tip="Investment length in years and months (0–11 months)." />
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              id="cg-years"
              className={`${inputClass} pr-10`}
              inputMode="numeric"
              value={input.termYears}
              aria-invalid={Boolean(errors.termYears)}
              aria-label="Term years"
              onChange={(e) => set({ termYears: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              yrs
            </span>
          </div>
          <div className="relative">
            <input
              id="cg-months"
              className={`${inputClass} pr-10`}
              inputMode="numeric"
              value={input.termMonths}
              aria-invalid={Boolean(errors.termMonths)}
              aria-label="Term months"
              onChange={(e) => set({ termMonths: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              mos
            </span>
          </div>
        </div>
        {errors.termYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
        ) : null}
        {errors.termMonths ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="cg-compound"
          label="Compounding frequency"
          tip="How many times per year interest compounds (n)."
        />
        <select
          id="cg-compound"
          className={selectClass}
          value={input.compoundFrequency}
          onChange={(e) =>
            set({ compoundFrequency: e.target.value as CompoundFrequency })
          }
        >
          {COMPOUND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-4 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Additional contribution
        </legend>

        <div>
          <FieldLabel
            htmlFor="cg-contrib-freq"
            label="How often?"
            tip="How often additional deposits are made. Should align with compounding when possible."
          />
          <select
            id="cg-contrib-freq"
            className={selectClass}
            value={input.contributionFrequency}
            onChange={(e) =>
              set({ contributionFrequency: e.target.value as ContributionFrequency })
            }
          >
            {CONTRIBUTION_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel
            htmlFor="cg-contrib-amt"
            label="How much?"
            tip="Amount of each additional contribution."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="cg-contrib-amt"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.contributionAmount}
                aria-invalid={Boolean(errors.contributionAmount)}
                onChange={(e) => set({ contributionAmount: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cg-contrib-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Contribution currency"
              />
            </div>
          </div>
          {errors.contributionAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.contributionAmount}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="cg-when"
            label="When?"
            tip="Beginning: deposit before interest each period. End: deposit after interest."
          />
          <select
            id="cg-when"
            className={selectClass}
            value={input.contributionTiming}
            onChange={(e) =>
              set({ contributionTiming: e.target.value as ContributionTiming })
            }
          >
            <option value="beginning">Beginning of period</option>
            <option value="end">End of period</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel
              htmlFor="cg-annual-growth"
              label="Annual growth rate"
              tip="Raises the contribution amount once per completed year (separate from periodic growth)."
            />
            <div className="relative">
              <input
                id="cg-annual-growth"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.annualContributionGrowth}
                aria-invalid={Boolean(errors.annualContributionGrowth)}
                onChange={(e) => set({ annualContributionGrowth: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </div>
            {errors.annualContributionGrowth ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualContributionGrowth}</p>
            ) : null}
          </div>
          <div>
            <FieldLabel
              htmlFor="cg-periodic-growth"
              label="Periodic growth rate"
              tip="Raises the contribution amount after each contribution event."
            />
            <div className="relative">
              <input
                id="cg-periodic-growth"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.periodicContributionGrowth}
                aria-invalid={Boolean(errors.periodicContributionGrowth)}
                onChange={(e) => set({ periodicContributionGrowth: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </div>
            {errors.periodicContributionGrowth ? (
              <p className="mt-1 text-xs text-rose-600">{errors.periodicContributionGrowth}</p>
            ) : null}
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
