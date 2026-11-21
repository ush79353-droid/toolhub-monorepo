'use client';

import type { ReactNode } from 'react';
import type {
  IbuprofenDosageFieldErrors,
  IbuprofenDosageInput,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface IbuprofenDosageFormProps {
  input: IbuprofenDosageInput;
  errors: IbuprofenDosageFieldErrors;
  onChange: (input: IbuprofenDosageInput) => void;
  onLoadExample: (kg: number) => void;
}

export function IbuprofenDosageForm({
  input,
  errors,
  onChange,
  onLoadExample,
}: IbuprofenDosageFormProps) {
  const set = (patch: Partial<IbuprofenDosageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-3.5"
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <div className={sectionClass}>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            checked={input.isSixMonthsOrOlder}
            onChange={(event) =>
              set({ isSixMonthsOrOlder: event.target.checked })
            }
          />
          <span>The child is 6+ months old</span>
        </label>

        <div>
          <label htmlFor="ibuprofen-weight" className={labelClass}>
            Child&apos;s weight
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightText}>
              <input
                id="ibuprofen-weight"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder=""
                aria-invalid={Boolean(errors.weightText)}
                className={inputClass}
                value={input.weightText}
                onChange={(event) => set({ weightText: event.target.value })}
              />
            </FieldShell>
            <select
              aria-label="Weight unit"
              className="h-11 w-[4.5rem] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.weightUnit}
              onChange={(event) =>
                set({ weightUnit: event.target.value as WeightUnit })
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <div className="rounded-lg border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-accent">
          This tool is for information purposes only and ibuprofen dosages
          should always be calculated separately as well as double-checked by
          health care provider. Always check the dosing information and
          contraindications on the leaflet. Consult your health provider before
          administering.
        </div>

        <div>
          <p className="mb-2 text-[13px] font-medium text-accent">
            Check our examples:
          </p>
          <ul className="space-y-1.5 text-sm text-accent">
            <li>
              <button
                type="button"
                className="text-primary underline-offset-2 hover:underline"
                onClick={() => onLoadExample(9.6)}
              >
                Example 1
              </button>
              <span className="text-muted-foreground"> — Dose for 9.6 kg</span>
            </li>
            <li>
              <button
                type="button"
                className="text-primary underline-offset-2 hover:underline"
                onClick={() => onLoadExample(31.8)}
              >
                Example 2
              </button>
              <span className="text-muted-foreground"> — Dose for 31.8 kg</span>
            </li>
          </ul>
        </div>
      </div>
    </form>
  );
}
