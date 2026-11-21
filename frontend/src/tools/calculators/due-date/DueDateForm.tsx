'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DueDateFieldErrors,
  DueDateInput,
  DueDateResult,
} from './types';
import { MAX_CYCLE_DAYS, MIN_CYCLE_DAYS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

interface DueDateFormProps {
  input: DueDateInput;
  errors: DueDateFieldErrors;
  result: DueDateResult | null;
  onChange: (input: DueDateInput) => void;
}

export function DueDateForm({
  input,
  errors,
  result,
  onChange,
}: DueDateFormProps) {
  return (
    <form
      className="space-y-4"
      noValidate
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Tell us when you conceived, or some information on your period if you
        are not sure, and we&apos;ll tell you when to expect the birth of your
        child. Educational ACOG-style calendar dating only — not ultrasound
        dating or medical advice.
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Pregnancy due date
        </legend>

        <div>
          <div className={labelClass}>
            Method
            <InfoTooltip
              label="Method"
              text="Last menstrual period (LMP) uses Naegele-style dating: LMP + 280 days, adjusted when your average cycle is not 28 days. Conception dating adds 266 days from the conception date."
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="inline-flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="due-date-method"
                className="h-4 w-4 border-border text-primary focus:ring-ring"
                checked={input.method === 'lmp'}
                onChange={() => onChange({ ...input, method: 'lmp' })}
              />
              First day of my last period
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="due-date-method"
                className="h-4 w-4 border-border text-primary focus:ring-ring"
                checked={input.method === 'conception'}
                onChange={() => onChange({ ...input, method: 'conception' })}
              />
              Date I conceived
            </label>
          </div>
        </div>

        {input.method === 'lmp' ? (
          <>
            <div>
              <label htmlFor="due-lmp" className={labelClass}>
                My last period started on
                <InfoTooltip
                  label="Last period start"
                  text="Enter the first day of your last menstrual period (bleeding). Dates are handled as calendar dates only."
                />
              </label>
              <div
                className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
                  errors.lmpDate ? 'border-rose-400' : ''
                }`}
              >
                <input
                  id="due-lmp"
                  type="date"
                  className={inputClass}
                  value={input.lmpDate}
                  aria-invalid={Boolean(errors.lmpDate)}
                  onChange={(e) =>
                    onChange({ ...input, lmpDate: e.target.value })
                  }
                />
              </div>
              {errors.lmpDate ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.lmpDate}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="due-cycle" className={labelClass}>
                My average cycle lasts
                <InfoTooltip
                  label="Average cycle"
                  text={`Typical regular cycles supported here are ${MIN_CYCLE_DAYS}–${MAX_CYCLE_DAYS} days. The estimate adds (cycle − 28) days to the standard 280-day LMP rule.`}
                />
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
                    errors.cycleDays ? 'border-rose-400' : ''
                  }`}
                >
                  <input
                    id="due-cycle"
                    type="number"
                    inputMode="numeric"
                    min={MIN_CYCLE_DAYS}
                    max={MAX_CYCLE_DAYS}
                    step={1}
                    className={inputClass}
                    value={input.cycleDays}
                    aria-invalid={Boolean(errors.cycleDays)}
                    onChange={(e) =>
                      onChange({ ...input, cycleDays: e.target.value })
                    }
                  />
                </div>
                <span className="shrink-0 text-sm text-muted-foreground">
                  days
                </span>
              </div>
              {errors.cycleDays ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.cycleDays}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="due-conception" className={labelClass}>
              I conceived on
              <InfoTooltip
                label="Conception date"
                text="Adds 266 days (about 38 weeks) from the conception date for an educational estimated due date."
              />
            </label>
            <div
              className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.conceptionDate ? 'border-rose-400' : ''
              }`}
            >
              <input
                id="due-conception"
                type="date"
                className={inputClass}
                value={input.conceptionDate}
                aria-invalid={Boolean(errors.conceptionDate)}
                onChange={(e) =>
                  onChange({ ...input, conceptionDate: e.target.value })
                }
              />
            </div>
            {errors.conceptionDate ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.conceptionDate}
              </p>
            ) : null}
          </div>
        )}

        <div>
          <label htmlFor="due-result" className={labelClass}>
            Estimated due date
          </label>
          <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3 text-sm text-accent">
            <output id="due-result" aria-live="polite" className="truncate">
              {result ? result.formattedDueDate : '—'}
            </output>
          </div>
          {result ? (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {result.disclaimer}
            </p>
          ) : null}
        </div>
      </fieldset>
    </form>
  );
}
