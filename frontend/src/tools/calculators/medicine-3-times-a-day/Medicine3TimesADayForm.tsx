'use client';

import type { ReactNode } from 'react';
import { Clock } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DOSE_ORDINAL_LABELS,
  DOSE_SCHEDULE_MODE_LABELS,
  DOSE_SCHEDULE_MODES,
  doseCountForMode,
  type DoseScheduleMode,
  type Medicine3TimesADayFieldErrors,
  type Medicine3TimesADayInput,
  type Medicine3TimesADayResult,
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

interface Props {
  input: Medicine3TimesADayInput;
  errors: Medicine3TimesADayFieldErrors;
  result: Medicine3TimesADayResult | null;
  onChange: (input: Medicine3TimesADayInput) => void;
  onLoadExample: () => void;
}

export function Medicine3TimesADayForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<Medicine3TimesADayInput>) =>
    onChange({ ...input, ...patch });

  const doseCount = doseCountForMode(input.mode);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational clock spacing only. “3 times a day” on a label is not always
        every 8 hours — confirm with your pharmacist. Entries stay in your
        browser.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (3 doses · 07:00 AM → 03:00 PM · 11:00 PM)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>Doses per day</span>
          <InfoTooltip
            label="Doses per day"
            text="2 and 3 doses use around-the-clock 24÷n hours. Four waking-hours uses a 15-hour first-to-last window. Four every 6 hours is strict q6h."
          />
        </legend>
        <div
          className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2"
          role="radiogroup"
          aria-label="Doses per day"
        >
          {DOSE_SCHEDULE_MODES.map((mode) => (
            <label
              key={mode}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="medicine-3-times-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === mode}
                onChange={() => set({ mode: mode as DoseScheduleMode })}
              />
              <span>{DOSE_SCHEDULE_MODE_LABELS[mode]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {Array.from({ length: doseCount }, (_, index) => {
        const label = DOSE_ORDINAL_LABELS[index] ?? `Dose ${index + 1}`;
        const fieldId = `m3d-dose-${index}`;
        const isFirst = index === 0;
        const display = isFirst
          ? input.firstDoseTime
          : (result?.formattedDoseTimes[index] ?? '');

        return (
          <div key={fieldId}>
            <label className={labelClass} htmlFor={fieldId}>
              <span>{label}</span>
              {isFirst ? (
                <InfoTooltip
                  label="First dose"
                  text="Clock time of the first dose. Later doses are calculated from this time and the selected mode."
                />
              ) : (
                <InfoTooltip
                  label={label}
                  text="Calculated from the first dose and selected spacing mode. Read-only."
                />
              )}
            </label>
            {isFirst ? (
              <FieldShell error={errors.firstDoseTime}>
                <input
                  id={fieldId}
                  type="time"
                  step={60}
                  className={inputClass}
                  value={input.firstDoseTime}
                  aria-invalid={Boolean(errors.firstDoseTime)}
                  onChange={(e) => set({ firstDoseTime: e.target.value })}
                />
                <Clock
                  className="mr-3 h-4 w-4 shrink-0 text-primary/70"
                  aria-hidden
                />
              </FieldShell>
            ) : (
              <FieldShell muted>
                <output
                  id={fieldId}
                  className="flex w-full items-center gap-2 px-3 text-sm tabular-nums"
                  aria-live="polite"
                >
                  <span className="font-medium text-primary">
                    {display || '\u00a0'}
                  </span>
                  <Clock
                    className="ml-auto h-4 w-4 shrink-0 text-primary/70"
                    aria-hidden
                  />
                </output>
              </FieldShell>
            )}
            {isFirst && errors.firstDoseTime ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.firstDoseTime}
              </p>
            ) : null}
          </div>
        );
      })}

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result?.disclaimer ??
          'Educational interval worksheet only — not a prescription or medical advice.'}
      </p>
    </form>
  );
}
