'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { TrirBand, TrirDriver, TrirFieldErrors, TrirInput, TrirResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function bandLabel(band: TrirBand): string {
  if (band === 'low') return 'Low (illustrative)';
  if (band === 'moderate') return 'Moderate (illustrative)';
  return 'High (illustrative)';
}

function bandTone(band: TrirBand): string {
  if (band === 'low') return 'bg-emerald-500';
  if (band === 'moderate') return 'bg-amber-400';
  return 'bg-rose-500';
}

interface TrirFormProps {
  input: TrirInput;
  errors: TrirFieldErrors;
  result: TrirResult | null;
  onChange: (input: TrirInput) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function TrirForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
  onClear,
  onReset,
}: TrirFormProps) {
  const setField = (field: TrirDriver, value: string) => {
    onChange({ ...input, [field]: value, driver: field });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
 Total Recordable Incident Rate; TRIR = (recordable cases × 200,000) ÷ hours worked. Not a
        percentage of injured employees.
      </p>

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <div>
          <label className={labelClass} htmlFor="trir-hours">
            <span>Hours worked</span>
            <InfoTooltip
              label="Hours worked"
              text="Enter total employee hours worked in the same reporting period used for recordable cases, including overtime. Do not use headcount alone or calendar hours as a substitute."
            />
          </label>
          <FieldShell error={errors.hoursWorked}>
            <input
              id="trir-hours"
              className={inputClass}
              inputMode="decimal"
              value={input.hoursWorked}
              aria-invalid={Boolean(errors.hoursWorked)}
              placeholder="0"
              onChange={(e) => setField('hoursWorked', e.target.value)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">hrs</span>
          </FieldShell>
          {errors.hoursWorked ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursWorked}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="trir-injuries">
            <span>Number of injuries</span>
            <InfoTooltip
              label="Number of injuries"
              text="Enter OSHA-recordable work-related injury and illness cases for the period; not every first-aid or minor incident. Apply official OSHA recordkeeping criteria."
            />
          </label>
          <FieldShell error={errors.injuries}>
            <input
              id="trir-injuries"
              className={inputClass}
              inputMode="numeric"
              value={input.injuries}
              aria-invalid={Boolean(errors.injuries)}
              placeholder="0"
              onChange={(e) => setField('injuries', e.target.value)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">incidents</span>
          </FieldShell>
          {errors.injuries ? (
            <p className="mt-1 text-xs text-rose-600">{errors.injuries}</p>
          ) : null}
          {result?.injuriesEstimated ? (
            <p className="mt-1 text-xs text-muted-foreground">
 Estimated cases (may be fractional; not an observed count).
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="trir-rate">
            <span>TRIR</span>
            <InfoTooltip
              label="TRIR"
              text="Total Recordable Incident Rate. Editing this field estimates cases from TRIR and hours, or solves hours when cases and TRIR are known."
            />
          </label>
          <FieldShell error={errors.trir}>
            <input
              id="trir-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.trir}
              aria-invalid={Boolean(errors.trir)}
              onChange={(e) => setField('trir', e.target.value)}
            />
          </FieldShell>
          {errors.trir ? <p className="mt-1 text-xs text-rose-600">{errors.trir}</p> : null}
          <p className="mt-1.5 text-xs text-muted-foreground">
            Recordable cases per 100 full-time-equivalent workers
          </p>
        </div>
      </form>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Understanding your TRIR</h3>
        {result ? (
          <>
            <div className="flex items-center gap-2 text-sm text-accent">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-sm ${bandTone(result.band)}`}
                aria-hidden
              />
              <span>{bandLabel(result.band)}</span>
              <span className="tabular-nums font-semibold">{result.formattedTrir}</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90" role="status">
              {result.interpretation}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter hours worked and recordable incidents to calculate TRIR.
          </p>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Low (&lt;3) / moderate (3–8) / high (&gt;8) bands are illustrative reference categories from
 the product guide; not OSHA or BLS official thresholds. A low TRIR alone does not prove a
          workplace is safe.
        </p>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
          Load example (0.20)
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
