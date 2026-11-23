'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ILLUSTRATIVE_COMPARISONS,
  formatPearlIndex,
  monthsToDurationUnit,
  parseNumber,
  durationToMonths,
} from './calculation';
import type {
  DurationUnit,
  PearlIndexFieldErrors,
  PearlIndexInput,
  PearlIndexResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/30 px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

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

interface FormProps {
  input: PearlIndexInput;
  errors: PearlIndexFieldErrors;
  result: PearlIndexResult | null;
  onChange: (input: PearlIndexInput) => void;
}

export function PearlIndexForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<PearlIndexInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p className="font-semibold text-amber-950">
          Educational Pearl Index — not contraceptive advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          Assumes equal full follow-up for every participant. The index is a
          failure <em>rate</em> (pregnancies per 100 woman-years), not a personal
          probability. Values stay in your browser; share uses the page URL only.
        </p>
      </div>

      <section className={sectionClass} aria-label="Pearl Index inputs">
        <div>
          <label className={labelClass} htmlFor="pi-women">
            No. of women in the study
            <InfoTooltip text="Participants with equal full follow-up for the study duration." />
          </label>
          <FieldShell error={errors.womenText}>
            <input
              id="pi-women"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.womenText}
              onChange={(e) => set({ womenText: e.target.value })}
            />
            <span className={unitFixed}>#</span>
          </FieldShell>
          {errors.womenText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.womenText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pi-duration">
            Study duration
          </label>
          <FieldShell error={errors.durationText}>
            <input
              id="pi-duration"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.durationText}
              onChange={(e) => set({ durationText: e.target.value })}
            />
            <select
              aria-label="Duration unit"
              className={selectClass}
              value={input.durationUnit}
              onChange={(e) => {
                const next = e.target.value as DurationUnit;
                const n = parseNumber(input.durationText);
                if (n != null && n > 0) {
                  const months = durationToMonths(n, input.durationUnit);
                  const converted = monthsToDurationUnit(months, next);
                  set({
                    durationUnit: next,
                    durationText: String(
                      Math.round(converted * 1e6) / 1e6,
                    ),
                  });
                } else {
                  set({ durationUnit: next });
                }
              }}
            >
              <option value="months">mos</option>
              <option value="years">yrs</option>
            </select>
          </FieldShell>
          {errors.durationText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.durationText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pi-preg">
            No. of pregnancies
            <InfoTooltip text="Unintended pregnancies observed during the exposure period." />
          </label>
          <FieldShell error={errors.pregnanciesText}>
            <input
              id="pi-preg"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.pregnanciesText}
              onChange={(e) => set({ pregnanciesText: e.target.value })}
            />
            <span className={unitFixed}>#</span>
          </FieldShell>
          {errors.pregnanciesText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pregnanciesText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pi-result">
            Pearl Index
          </label>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
            <input
              id="pi-result"
              type="text"
              readOnly
              aria-label="Pearl Index result"
              className="h-11 w-full min-w-0 bg-transparent text-sm tabular-nums text-accent outline-none"
              value={formatPearlIndex(result?.pearlIndex ?? null)}
            />
          </div>
          {result?.womanYears != null ? (
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : result?.statusDetail ? (
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>

      <div className="rounded-xl border border-sky-200/80 bg-sky-50/70 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p>
          💡 The <strong>lower</strong> the index, the <strong>better</strong>{' '}
          the contraception.
        </p>
        <p className="mt-2 text-muted-foreground">
          Let&apos;s compare it with other methods&apos; results (illustrative
          reference-UI figures — populations and perfect vs typical use vary in
          published tables):
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {ILLUSTRATIVE_COMPARISONS.map((row) => (
            <li key={row.method}>
              {row.method}: {row.pearl}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
