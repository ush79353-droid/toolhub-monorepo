'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromMm, parseNumber, toMm } from './calculation';
import {
  AGE_BAND_OPTIONS,
  type SkinfoldAgeBand,
  type SkinfoldBodyFatFieldErrors,
  type SkinfoldBodyFatInput,
  type SkinfoldSex,
  type SkinfoldUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 cursor-pointer bg-transparent px-3 text-sm font-semibold text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

function switchUnit(value: string, from: SkinfoldUnit, to: SkinfoldUnit): string {
  if (from === to) return value;
  const n = parseNumber(value);
  if (n == null || !(n > 0)) return value;
  const mm = toMm(n, from);
  const next = fromMm(mm, to);
  const digits = to === 'mm' ? 1 : 3;
  return Number(next.toFixed(digits)).toString();
}

function SiteDiagram({ label }: { label: string }) {
  // Accessible CSS diagram placeholders (not copied screenshot art).
  return (
    <div
      className="flex h-16 w-14 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white/80 text-center"
      aria-hidden
    >
      <span className="text-[10px] font-medium leading-tight text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

interface SkinfoldBodyFatFormProps {
  input: SkinfoldBodyFatInput;
  errors: SkinfoldBodyFatFieldErrors;
  gateMessage: string | null;
  aboutOpen: boolean;
  sitesOpen: boolean;
  resultOpen: boolean;
  onAboutOpenChange: (open: boolean) => void;
  onSitesOpenChange: (open: boolean) => void;
  onResultOpenChange: (open: boolean) => void;
  onChange: (input: SkinfoldBodyFatInput) => void;
  formattedBodyFat: string;
}

export function SkinfoldBodyFatForm({
  input,
  errors,
  gateMessage,
  aboutOpen,
  sitesOpen,
  resultOpen,
  onAboutOpenChange,
  onSitesOpenChange,
  onResultOpenChange,
  onChange,
  formattedBodyFat,
}: SkinfoldBodyFatFormProps) {
  const set = (patch: Partial<SkinfoldBodyFatInput>) =>
    onChange({ ...input, ...patch });

  const setUnit = (unit: SkinfoldUnit) => {
    if (unit === input.unit) return;
    set({
      unit,
      bicep: switchUnit(input.bicep, input.unit, unit),
      subscapular: switchUnit(input.subscapular, input.unit, unit),
      suprailiac: switchUnit(input.suprailiac, input.unit, unit),
      tricep: switchUnit(input.tricep, input.unit, unit),
    });
  };

  const measureField = (
    id: string,
    label: string,
    key: 'bicep' | 'subscapular' | 'suprailiac' | 'tricep',
    tip: string
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={errors[key]}>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={input[key]}
          aria-invalid={Boolean(errors[key])}
          onChange={(e) => set({ [key]: e.target.value })}
        />
        <select
          className={unitSelectClass}
          aria-label={`${label} unit`}
          value={input.unit}
          onChange={(e) => setUnit(e.target.value as SkinfoldUnit)}
        >
          <option value="mm">mm</option>
          <option value="in">in</option>
        </select>
      </FieldShell>
      {errors[key] ? (
        <p className="mt-1 text-xs text-rose-600">{errors[key]}</p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational Durnin–Womersley estimate — not medical advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          Uses four skinfolds (biceps, triceps, subscapular, suprailiac) with
          sex- and age-band density equations, then Siri % body fat. Ages under
          17 are not estimated with adult coefficients.
        </p>
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          aria-expanded={aboutOpen}
          onClick={() => onAboutOpenChange(!aboutOpen)}
        >
          <span className="text-[13px] font-semibold text-accent">About you</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition ${aboutOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {aboutOpen ? (
          <div className="space-y-3.5 pt-1">
            <fieldset>
              <legend className={labelClass}>Sex</legend>
              <div
                className="flex flex-col gap-2.5"
                role="radiogroup"
                aria-label="Sex"
              >
                {(
                  [
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="skinfold-sex"
                      className="h-4 w-4 accent-primary"
                      checked={input.sex === opt.value}
                      onChange={() => set({ sex: opt.value as SkinfoldSex })}
                    />
                    <span
                      className={
                        input.sex === opt.value ? 'font-semibold' : undefined
                      }
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className={labelClass} htmlFor="skinfold-age">
                <span>Age</span>
                <InfoTooltip
                  label="Age"
                  text="Durnin–Womersley bands from the 1974 tables. Under 17 is listed for UI parity but does not run the adult equations."
                />
              </label>
              <FieldShell error={errors.ageBand}>
                <select
                  id="skinfold-age"
                  className={selectClass}
                  value={input.ageBand}
                  aria-invalid={Boolean(errors.ageBand)}
                  onChange={(e) =>
                    set({ ageBand: e.target.value as SkinfoldAgeBand })
                  }
                >
                  {AGE_BAND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.ageBand ? (
                <p className="mt-1 text-xs text-rose-600">{errors.ageBand}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          aria-expanded={sitesOpen}
          onClick={() => onSitesOpenChange(!sitesOpen)}
        >
          <span className="text-[13px] font-semibold text-accent">
            Skinfold measurements
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition ${sitesOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {sitesOpen ? (
          <div className="space-y-3.5 pt-1">
            <p className="text-[13px] leading-relaxed text-foreground/85">
              Measure a vertical or diagonal double fold at each labeled site
              with calibrated calipers. See the guide article for site
              descriptions.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <SiteDiagram label="Suprailiac" />
              <SiteDiagram label="Subscapular" />
              <SiteDiagram label="Bicep" />
              <SiteDiagram label="Tricep" />
            </div>
            {measureField(
              'skinfold-bicep',
              'Bicep measurement',
              'bicep',
              'Anterior midline of the upper arm over the biceps, midway between shoulder and elbow.'
            )}
            {measureField(
              'skinfold-subscapular',
              'Subscapular measurement',
              'subscapular',
              'Just below the inferior angle of the scapula, typically a diagonal fold.'
            )}
            {measureField(
              'skinfold-suprailiac',
              'Suprailiac measurement',
              'suprailiac',
              'Immediately above the iliac crest in the midaxillary line (diagonal fold).'
            )}
            {measureField(
              'skinfold-tricep',
              'Tricep measurement',
              'tricep',
              'Posterior midline of the upper arm over the triceps, midway between shoulder and elbow.'
            )}
          </div>
        ) : null}
      </section>

      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          aria-expanded={resultOpen}
          onClick={() => onResultOpenChange(!resultOpen)}
        >
          <span className="text-[13px] font-semibold text-accent">Body fat</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition ${resultOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {resultOpen ? (
          <div className="space-y-2 pt-1">
            <label className={labelClass} htmlFor="skinfold-bf">
              Body fat percentage
            </label>
            <FieldShell muted>
              <input
                id="skinfold-bf"
                className={inputClass}
                readOnly
                value={formattedBodyFat}
                aria-readonly="true"
              />
              <span className="shrink-0 pr-3 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {gateMessage ? (
              <p className="text-[13px] text-amber-900">{gateMessage}</p>
            ) : null}
          </div>
        ) : null}
      </section>
    </form>
  );
}
