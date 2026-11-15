'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CalculateAverageMode,
  TurnoverRateFieldErrors,
  TurnoverRateInput,
  TurnoverRateResult,
} from './types';

interface TurnoverRateFormProps {
  input: TurnoverRateInput;
  errors: TurnoverRateFieldErrors;
  result: TurnoverRateResult | null;
  onInputChange: (field: keyof TurnoverRateInput, value: string) => void;
  onModeChange: (mode: CalculateAverageMode) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
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

export function TurnoverRateForm({
  input,
  errors,
  result,
  onInputChange,
  onModeChange,
  onReset,
}: TurnoverRateFormProps) {
  const calculateAverage = input.calculateAverage === 'yes';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-medium text-accent">
          Calculate average number of employees?
        </legend>
        <div
          className="mt-1 flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Calculate average number of employees?"
        >
          {(['no', 'yes'] as const).map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="turnover-calculate-average"
                className="h-4 w-4 border-border"
                checked={input.calculateAverage === option}
                onChange={() => onModeChange(option)}
              />
              {option === 'yes' ? 'Yes' : 'No'}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {calculateAverage
            ? 'Enter start and end headcount; average is filled automatically.'
            : 'Enter the average headcount directly.'}
        </p>
      </fieldset>

      <div className="space-y-4 rounded-xl border border-border p-3.5 sm:p-4">
        <h3 className="text-[13px] font-semibold text-accent">Turnover rate calculation</h3>

        {calculateAverage ? (
          <>
            <div>
              <FieldLabel
                htmlFor="turnover-start"
                label="Employees at start"
                tip="Headcount at the beginning of the measurement period."
              />
              <input
                id="turnover-start"
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={input.employeesAtStart}
                aria-invalid={Boolean(errors.employeesAtStart)}
                onChange={(e) => onInputChange('employeesAtStart', e.target.value)}
              />
              {errors.employeesAtStart ? (
                <p className="mt-1 text-xs text-rose-600">{errors.employeesAtStart}</p>
              ) : null}
            </div>

            <div>
              <FieldLabel
                htmlFor="turnover-end"
                label="Employees at end"
                tip="Headcount at the end of the measurement period."
              />
              <input
                id="turnover-end"
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={input.employeesAtEnd}
                aria-invalid={Boolean(errors.employeesAtEnd)}
                onChange={(e) => onInputChange('employeesAtEnd', e.target.value)}
              />
              {errors.employeesAtEnd ? (
                <p className="mt-1 text-xs text-rose-600">{errors.employeesAtEnd}</p>
              ) : null}
            </div>
          </>
        ) : null}

        <div>
          <FieldLabel
            htmlFor="turnover-average"
            label="Average number of employees"
            tip={
              calculateAverage
                ? 'Automatically calculated as (employees at start + employees at end) ÷ 2.'
                : 'Average headcount for the period. Must be greater than zero.'
            }
          />
          <input
            id="turnover-average"
            type="text"
            inputMode="numeric"
            className={`${inputClass}${calculateAverage ? ' bg-muted/10' : ''}`}
            value={input.averageEmployees}
            readOnly={calculateAverage}
            aria-invalid={Boolean(errors.averageEmployees)}
            onChange={(e) => {
              if (!calculateAverage) onInputChange('averageEmployees', e.target.value);
            }}
          />
          {errors.averageEmployees ? (
            <p className="mt-1 text-xs text-rose-600">{errors.averageEmployees}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="turnover-left"
            label="Number of employees who left"
            tip="Employees who left during the period (voluntary or involuntary)."
          />
          <input
            id="turnover-left"
            type="text"
            inputMode="numeric"
            className={inputClass}
            value={input.employeesWhoLeft}
            aria-invalid={Boolean(errors.employeesWhoLeft)}
            onChange={(e) => onInputChange('employeesWhoLeft', e.target.value)}
          />
          {errors.employeesWhoLeft ? (
            <p className="mt-1 text-xs text-rose-600">{errors.employeesWhoLeft}</p>
          ) : null}
        </div>

        {errors.general ? <p className="text-xs text-rose-600">{errors.general}</p> : null}

        <div>
          <FieldLabel
            htmlFor="turnover-rate"
            label="Turnover rate"
            tip="(Employees who left ÷ average employees) × 100. Not capped at 100%."
          />
          <div className="relative">
            <input
              id="turnover-rate"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
              value={result ? result.formattedRate : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
