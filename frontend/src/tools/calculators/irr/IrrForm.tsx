'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { IrrFieldErrors, IrrInput, IrrResult } from './types';

interface IrrFormProps {
  input: IrrInput;
  errors: IrrFieldErrors;
  result: IrrResult | null;
  onChange: (input: IrrInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

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

export function IrrForm({ input, errors, result, onChange, onReset }: IrrFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const setCashFlow = (index: number, value: string) => {
    const cashFlows = input.cashFlows.map((cf, i) => (i === index ? value : cf));
    onChange({ ...input, cashFlows });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
        Enter the total amount you invested upfront, and the money you earned or spent each year
        (cash flows), to calculate your internal rate of return (IRR).
      </p>

      <div>
        <FieldLabel
          htmlFor="irr-initial"
          label="Initial investment"
          tip="Upfront outflow. Must be greater than zero. Currency labels denomination only."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="irr-initial"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.initialInvestment}
              aria-invalid={Boolean(errors.initialInvestment)}
              onChange={(e) => onChange({ ...input, initialInvestment: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="irr-initial-currency"
              value={input.currency}
              onChange={(currency) => onChange({ ...input, currency })}
            />
          </div>
        </div>
        {errors.initialInvestment ? (
          <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
        ) : null}
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Input the annual cash flows (up to 30 years)
        </legend>
        <p className="text-xs text-muted-foreground">
          Tip: Use positive numbers for earnings, and negative numbers for expenses or losses.
          Additional year fields appear automatically as you type.
        </p>

        <div className="space-y-3">
          {input.cashFlows.map((cf, index) => {
            const year = index + 1;
            const err = errors[`year${year}`];
            return (
              <div key={year}>
                <FieldLabel
                  htmlFor={`irr-year-${year}`}
                  label={`Year ${year}`}
                  tip={`Cash flow at the end of year ${year}. Positive = inflow; negative = outflow.`}
                />
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      {symbol}
                    </span>
                    <input
                      id={`irr-year-${year}`}
                      className={`${inputClass} pl-8`}
                      inputMode="decimal"
                      value={cf}
                      aria-invalid={Boolean(err)}
                      onChange={(e) => setCashFlow(index, e.target.value)}
                    />
                  </div>
                  <div className="w-[110px] shrink-0 sm:w-[120px]">
                    <CurrencySelect
                      id={`irr-year-${year}-currency`}
                      value={input.currency}
                      onChange={(currency) => onChange({ ...input, currency })}
                    />
                  </div>
                </div>
                {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
              </div>
            );
          })}
        </div>
      </fieldset>

      <section
        className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        aria-labelledby="irr-result-heading"
      >
        <h3 id="irr-result-heading" className="text-[13px] font-semibold text-accent">
          Internal rate of return
        </h3>
        <FieldLabel
          htmlFor="irr-result"
          label="IRR"
          tip="Annual rate r that makes NPV of the investment and cash flows equal zero."
        />
        <div className="relative">
          <input
            id="irr-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/20 pr-8 font-semibold text-accent`}
            value={result ? result.formattedIrr : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Your internal rate of return (IRR) is {result.formattedIrr}% over {result.yearsUsed}{' '}
            {result.yearsUsed === 1 ? 'year' : 'years'}.
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            The IRR result will appear once you&apos;ve entered the initial investment and at least
            one year of returns.
          </p>
        )}
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
