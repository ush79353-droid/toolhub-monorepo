'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromCm, parseNumber, toCm } from './calculation';
import type {
  LengthUnit,
  NavyBodyFatFieldErrors,
  NavyBodyFatInput,
  NavyBodyFatResult,
  NavySex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

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

function switchLength(
  value: string,
  from: LengthUnit,
  to: LengthUnit,
): string {
  if (from === to) return value;
  const n = parseNumber(value);
  if (n == null || !(n > 0)) return value;
  const cm = toCm(n, from);
  const next = fromCm(cm, to);
  const digits = to === 'cm' ? 1 : 2;
  return Number(next.toFixed(digits)).toString();
}

interface NavyBodyFatFormProps {
  input: NavyBodyFatInput;
  errors: NavyBodyFatFieldErrors;
  result: NavyBodyFatResult | null;
  onChange: (input: NavyBodyFatInput) => void;
}

export function NavyBodyFatForm({
  input,
  errors,
  result,
  onChange,
}: NavyBodyFatFormProps) {
  const set = (patch: Partial<NavyBodyFatInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational Navy circumference estimate — not official BCA scoring
        </p>
        <p className="mt-1.5 text-foreground/85">
          Uses Hodgdon &amp; Beckett / NHRC U.S. Navy tape equations. Distinct from
          current Navy Body Composition Assessment official paperwork. Not
          medical advice.
        </p>
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="navy-age">
          Age
        </label>
        <FieldShell error={errors.age}>
          <input
            id="navy-age"
            className={inputClass}
            inputMode="decimal"
            value={input.age}
            onChange={(e) => set({ age: e.target.value })}
            aria-invalid={Boolean(errors.age)}
          />
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.age ? (
          <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          Age is not used in the circumference equation; optional for your notes.
        </p>
      </div>

      <fieldset>
        <legend className={labelClass}>Sex</legend>
        <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
          {(['male', 'female'] as const).map((sex) => (
            <label
              key={sex}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="navy-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === sex}
                onChange={() => set({ sex: sex as NavySex })}
              />
              <span className="capitalize">{sex}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="navy-height">
          Height
        </label>
        <FieldShell error={errors.height}>
          <input
            id="navy-height"
            className={inputClass}
            inputMode="decimal"
            value={input.height}
            onChange={(e) => set({ height: e.target.value })}
            aria-invalid={Boolean(errors.height)}
          />
          <select
            className={unitSelectClass}
            aria-label="Height unit"
            value={input.heightUnit}
            onChange={(e) => {
              const next = e.target.value as LengthUnit;
              set({
                heightUnit: next,
                height: switchLength(
                  input.height,
                  input.heightUnit,
                  next,
                ),
              });
            }}
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </FieldShell>
        {errors.height ? (
          <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="navy-neck">
          <span>Neck circumference</span>
          <InfoTooltip
            label="Neck"
            text="Measure just below the larynx (Adam’s apple), tape perpendicular to the long axis of the neck."
          />
        </label>
        <FieldShell error={errors.neck}>
          <input
            id="navy-neck"
            className={inputClass}
            inputMode="decimal"
            value={input.neck}
            onChange={(e) => set({ neck: e.target.value })}
            aria-invalid={Boolean(errors.neck)}
          />
          <select
            className={unitSelectClass}
            aria-label="Neck unit"
            value={input.neckUnit}
            onChange={(e) => {
              const next = e.target.value as LengthUnit;
              set({
                neckUnit: next,
                neck: switchLength(input.neck, input.neckUnit, next),
              });
            }}
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </FieldShell>
        {errors.neck ? (
          <p className="mt-1 text-xs text-rose-600">{errors.neck}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="navy-waist">
          <span>Waist circumference</span>
          <InfoTooltip
            label="Waist"
            text="Men: measure at the navel. Women: measure at the narrowest point of the abdomen (or per your protocol)."
          />
        </label>
        <FieldShell error={errors.waist}>
          <input
            id="navy-waist"
            className={inputClass}
            inputMode="decimal"
            value={input.waist}
            onChange={(e) => set({ waist: e.target.value })}
            aria-invalid={Boolean(errors.waist)}
          />
          <select
            className={unitSelectClass}
            aria-label="Waist unit"
            value={input.waistUnit}
            onChange={(e) => {
              const next = e.target.value as LengthUnit;
              set({
                waistUnit: next,
                waist: switchLength(input.waist, input.waistUnit, next),
              });
            }}
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </FieldShell>
        {errors.waist ? (
          <p className="mt-1 text-xs text-rose-600">{errors.waist}</p>
        ) : null}
      </div>

      {input.sex === 'female' ? (
        <div>
          <label className={labelClass} htmlFor="navy-hip">
            <span>Hip circumference</span>
            <InfoTooltip
              label="Hip"
              text="Required for the Navy female equation. Measure at the widest point of the hips/buttocks."
            />
          </label>
          <FieldShell error={errors.hip}>
            <input
              id="navy-hip"
              className={inputClass}
              inputMode="decimal"
              value={input.hip}
              onChange={(e) => set({ hip: e.target.value })}
              aria-invalid={Boolean(errors.hip)}
            />
            <select
              className={unitSelectClass}
              aria-label="Hip unit"
              value={input.hipUnit}
              onChange={(e) => {
                const next = e.target.value as LengthUnit;
                set({
                  hipUnit: next,
                  hip: switchLength(input.hip, input.hipUnit, next),
                });
              }}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.hip ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hip}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="navy-bf">
          Body fat
        </label>
        <FieldShell muted>
          <output
            id="navy-bf"
            className="h-11 w-full min-w-0 px-3 text-sm font-semibold tabular-nums text-accent"
            aria-live="polite"
          >
            {result ? result.formattedBodyFatPercent : '—'}
          </output>
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">%</span>
        </FieldShell>
        {!result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter height, neck, and waist
            {input.sex === 'female' ? ', plus hip,' : ''} to estimate body fat.
          </p>
        ) : null}
      </div>
    </form>
  );
}
