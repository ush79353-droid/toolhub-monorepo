'use client';

import type { ReactNode } from 'react';
import { DISCLAIMER, formatDoseMg } from './calculation';
import { ADULT_REGIMENS, PEDIATRIC_REGIMENS } from './labeling-data';
import type {
  CefdinirDoseFieldErrors,
  CefdinirDoseInput,
  CefdinirDoseResult,
  CefdinirIndicationId,
} from './types';
import { indicationValidForAgeGroup } from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';

interface Props {
  input: CefdinirDoseInput;
  errors: CefdinirDoseFieldErrors;
  result: CefdinirDoseResult | null;
  onChange: (input: CefdinirDoseInput) => void;
}

export function CefdinirDoseForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<CefdinirDoseInput>) => {
    const next = { ...input, ...patch };
    if (patch.ageGroup && patch.ageGroup !== input.ageGroup) {
      if (
        next.indication &&
        !indicationValidForAgeGroup(
          patch.ageGroup as 'adult' | 'pediatric',
          next.indication as CefdinirIndicationId,
        )
      ) {
        next.indication = '';
      }
    }
    onChange(next);
  };

  const indicationOptions =
    input.ageGroup === 'pediatric'
      ? PEDIATRIC_REGIMENS
      : input.ageGroup === 'adult'
        ? ADULT_REGIMENS
        : [];

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate>
      <section className={sectionClass} aria-label="Patient age group">
        <p className={labelClass}>Patient</p>
        <fieldset className="space-y-2.5">
          <legend className="sr-only">Patient age group</legend>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
            <input
              type="radio"
              name="cefdinir-age"
              className="h-4 w-4 accent-primary"
              checked={input.ageGroup === 'adult'}
              onChange={() => set({ ageGroup: 'adult' })}
            />
            Adults and adolescents &gt;13 years
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
            <input
              type="radio"
              name="cefdinir-age"
              className="h-4 w-4 accent-primary"
              checked={input.ageGroup === 'pediatric'}
              onChange={() => set({ ageGroup: 'pediatric' })}
            />
            Children 6 months – 12 years old
          </label>
        </fieldset>
        {errors.ageGroup ? (
          <p className="text-xs text-rose-600">{errors.ageGroup}</p>
        ) : null}
      </section>

      {input.ageGroup === 'pediatric' ? (
        <section className={sectionClass} aria-label="Patient weight">
          <label className={labelClass} htmlFor="cefdinir-weight">
            Body weight
          </label>
          <MotionRow>
            <input
              id="cefdinir-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightKgText}
              onChange={(e) => set({ weightKgText: e.target.value })}
              aria-invalid={Boolean(errors.weightKgText)}
              autoComplete="off"
            />
            <span className="shrink-0 text-xs text-muted-foreground">kg</span>
          </MotionRow>
          {errors.weightKgText ? (
            <p className="text-xs text-rose-600">{errors.weightKgText}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Required for weight-based pediatric dosing (oral suspension).
            </p>
          )}
        </section>
      ) : null}

      <section className={sectionClass} aria-label="Indication">
        <label className={labelClass} htmlFor="cefdinir-indication">
          Indication
        </label>
        <select
          id="cefdinir-indication"
          className={selectClass}
          value={input.indication}
          onChange={(e) =>
            set({ indication: e.target.value as CefdinirIndicationId | '' })
          }
          disabled={!input.ageGroup}
          aria-invalid={Boolean(errors.indication)}
        >
          <option value="">Select indication</option>
          {indicationOptions.map((row) => (
            <option key={row.id} value={row.id}>
              {row.label}
            </option>
          ))}
        </select>
        {errors.indication ? (
          <p className="text-xs text-rose-600">{errors.indication}</p>
        ) : null}
      </section>

      {result ? (
        <section
          className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          aria-live="polite"
        >
          {result.dosingSentence && result.doseMgPerAdministration != null ? (
            <p className="text-sm leading-relaxed text-accent">
              <span aria-hidden className="mr-1">
                💊
              </span>
              The patient should take{' '}
              <strong>{formatDoseMg(result.doseMgPerAdministration)} mg</strong> of Omnicef{' '}
              <strong>
                {result.intervalHours === 12
                  ? 'every 12 hours'
                  : result.intervalHours === 24
                    ? 'once daily'
                    : `every ${result.intervalHours} hours`}
              </strong>{' '}
              for <strong>{result.durationLabel}</strong>.
            </p>
          ) : (
            <p className="text-sm font-medium text-accent">{result.statusHeadline}</p>
          )}
          {result.dosingSentence && result.statusDetail ? (
            <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
          ) : !result.dosingSentence && result.statusDetail ? (
            <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
          ) : null}
          {result.renalNote ? (
            <p className="text-xs italic leading-relaxed text-muted-foreground">
              {result.renalNote}
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="text-xs italic leading-relaxed text-muted-foreground">
        {DISCLAIMER}
      </p>
    </form>
  );
}

function MotionRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>;
}