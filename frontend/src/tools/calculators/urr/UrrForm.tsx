'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { KTV_RELATED_SLUG } from './calculation';
import type { UreaUnit, UrrFieldErrors, UrrInput, UrrResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const UREA_UNITS: { value: UreaUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'mmol_l', label: 'mmol/L' },
];

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: UrrInput;
  errors: UrrFieldErrors;
  result: UrrResult | null;
  onChange: (input: UrrInput) => void;
}

export function UrrForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<UrrInput>) => onChange({ ...input, ...patch });
  const urrDisplay = result?.urrPercent != null ? result.formattedUrr : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="URR dialysis urea inputs">
        <div>
          <label className={labelClass} htmlFor="urr-pre">
            Pre-dialysis urea level
            <InfoTooltip text="Blood urea before the hemodialysis session. Use the same analyte as the post sample." />
          </label>
          <FieldShell error={errors.preUreaText}>
            <input
              id="urr-pre"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.preUreaText}
              onChange={(e) => set({ preUreaText: e.target.value })}
              aria-invalid={Boolean(errors.preUreaText)}
            />
            <select
              className={unitSelectClass}
              value={input.preUnit}
              onChange={(e) => set({ preUnit: e.target.value as UreaUnit })}
              aria-label="Pre-dialysis urea unit"
            >
              {UREA_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.preUreaText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.preUreaText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="urr-post">
            Post dialysis urea level
            <InfoTooltip text="Blood urea after the hemodialysis session. Match analyte and convert units consistently." />
          </label>
          <FieldShell error={errors.postUreaText}>
            <input
              id="urr-post"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.postUreaText}
              onChange={(e) => set({ postUreaText: e.target.value })}
              aria-invalid={Boolean(errors.postUreaText)}
            />
            <select
              className={unitSelectClass}
              value={input.postUnit}
              onChange={(e) => set({ postUnit: e.target.value as UreaUnit })}
              aria-label="Post-dialysis urea unit"
            >
              {UREA_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.postUreaText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.postUreaText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="urr-result">
            Urea reduction ratio (URR)
            <InfoTooltip text="Percent reduction in urea across the dialysis session." />
          </label>
          <FieldShell muted>
            <input
              id="urr-result"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={urrDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            If you&apos;re looking for the{' '}
            <Link
              href={`/tools/${KTV_RELATED_SLUG}`}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Kt/V vs. URR relationship
            </Link>
            , try the Kt/V calculator.
          </p>
        </div>

        {result?.urrPercent != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
