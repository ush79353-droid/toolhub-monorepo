'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ArmyBodyFatFieldErrors,
  ArmyBodyFatInput,
  ArmyBodyFatResult,
  ArmyLengthUnit,
  ArmyMassUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface ArmyBodyFatFormProps {
  input: ArmyBodyFatInput;
  errors: ArmyBodyFatFieldErrors;
  result: ArmyBodyFatResult | null;
  onChange: (input: ArmyBodyFatInput) => void;
}

export function ArmyBodyFatForm({
  input,
  errors,
  result,
  onChange,
}: ArmyBodyFatFormProps) {
  const lengthSelect = (
    id: string,
    value: ArmyLengthUnit,
    onUnit: (u: ArmyLengthUnit) => void,
  ) => (
    <select
      id={id}
      className={selectClass}
      value={value}
      aria-label="Length unit"
      onChange={(e) => onUnit(e.target.value as ArmyLengthUnit)}
    >
      <option value="cm">cm</option>
      <option value="in">in</option>
    </select>
  );

  const massSelect = (
    id: string,
    value: ArmyMassUnit,
    onUnit: (u: ArmyMassUnit) => void,
  ) => (
    <select
      id={id}
      className={selectClass}
      value={value}
      aria-label="Weight unit"
      onChange={(e) => onUnit(e.target.value as ArmyMassUnit)}
    >
      <option value="lb">lb</option>
      <option value="kg">kg</option>
    </select>
  );

  return (
    <form className="space-y-4" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational body-fat estimate for the Army Body Composition Program.
        Active duty uses the authorized one-site abdomen method (effective 9
        June 2023). Uncheck for a legacy multi-site circumference estimate.
        Not medical advice or an official DA Form 5500/5501 result.
      </p>

      <label className="flex items-center gap-2.5 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
          checked={input.activeDuty}
          onChange={(e) =>
            onChange({ ...input, activeDuty: e.target.checked })
          }
        />
        I am on active duty
      </label>

      {!input.activeDuty ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs leading-relaxed text-amber-950/90">
          Legacy multi-site mode (DoDI 1308.3 / AR 600-9 equations). This is
          not the current Army-authorized tape method.
        </p>
      ) : null}

      <fieldset className="space-y-2">
        <legend className={labelClass}>Sex</legend>
        <div className="flex flex-wrap gap-4">
          {(
            [
              { value: 'female' as const, label: 'Female' },
              { value: 'male' as const, label: 'Male' },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="army-bf-sex"
                className="h-4 w-4 border-border text-primary focus:ring-ring"
                checked={input.sex === opt.value}
                onChange={() => onChange({ ...input, sex: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="army-bf-age" className={labelClass}>
          Age
          <InfoTooltip
            label="Age"
            text="Optional. Used only to compare your estimate against AR 600-9 / ALARACT Table B–2 maximum allowable body-fat standards by age group (17–20, 21–27, 28–39, 40+)."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.ageYears}>
            <input
              id="army-bf-age"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.ageYears}
              placeholder=""
              aria-invalid={Boolean(errors.ageYears)}
              onChange={(e) =>
                onChange({ ...input, ageYears: e.target.value })
              }
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              years
            </span>
          </FieldShell>
        </div>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.ageYears}
          </p>
        ) : null}
      </div>

      {input.activeDuty ? (
        <>
          <div>
            <label htmlFor="army-bf-weight" className={labelClass}>
              Body weight
              <InfoTooltip
                label="Body weight"
                text="Required for the authorized one-site equations. Enter weight in pounds or kilograms; the formula uses pounds."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.weight}>
                <input
                  id="army-bf-weight"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.weight}
                  aria-invalid={Boolean(errors.weight)}
                  onChange={(e) =>
                    onChange({ ...input, weight: e.target.value })
                  }
                />
              </FieldShell>
              {massSelect('army-bf-weight-unit', input.weightUnit, (u) =>
                onChange({ ...input, weightUnit: u }),
              )}
            </div>
            {errors.weight ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.weight}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="army-bf-abdomen" className={labelClass}>
              Abdomen circumference
              <InfoTooltip
                label="Abdomen circumference"
                text="Measure at the level of the navel (umbilicus), tape parallel to the floor. Official worksheets average three measurements to the nearest half inch."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.abdomen}>
                <input
                  id="army-bf-abdomen"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.abdomen}
                  aria-invalid={Boolean(errors.abdomen)}
                  onChange={(e) =>
                    onChange({ ...input, abdomen: e.target.value })
                  }
                />
              </FieldShell>
              {lengthSelect('army-bf-abdomen-unit', input.abdomenUnit, (u) =>
                onChange({ ...input, abdomenUnit: u }),
              )}
            </div>
            {errors.abdomen ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.abdomen}
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="army-bf-height" className={labelClass}>
              Height
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.height}>
                <input
                  id="army-bf-height"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.height}
                  aria-invalid={Boolean(errors.height)}
                  onChange={(e) =>
                    onChange({ ...input, height: e.target.value })
                  }
                />
              </FieldShell>
              {lengthSelect('army-bf-height-unit', input.heightUnit, (u) =>
                onChange({ ...input, heightUnit: u }),
              )}
            </div>
            {errors.height ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.height}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="army-bf-neck" className={labelClass}>
              Neck circumference
              <InfoTooltip
                label="Neck circumference"
                text="Just below the larynx (Adam’s apple), tape perpendicular to the long axis of the neck."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.neck}>
                <input
                  id="army-bf-neck"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.neck}
                  aria-invalid={Boolean(errors.neck)}
                  onChange={(e) =>
                    onChange({ ...input, neck: e.target.value })
                  }
                />
              </FieldShell>
              {lengthSelect('army-bf-neck-unit', input.neckUnit, (u) =>
                onChange({ ...input, neckUnit: u }),
              )}
            </div>
            {errors.neck ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.neck}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="army-bf-waist" className={labelClass}>
              {input.sex === 'male'
                ? 'Waist circumference (abdomen)'
                : 'Waist circumference'}
              <InfoTooltip
                label="Waist circumference"
                text={
                  input.sex === 'male'
                    ? 'Legacy male method: abdomen at the navel.'
                    : 'Legacy female method: narrowest portion of the abdomen.'
                }
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.waist}>
                <input
                  id="army-bf-waist"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.waist}
                  aria-invalid={Boolean(errors.waist)}
                  onChange={(e) =>
                    onChange({ ...input, waist: e.target.value })
                  }
                />
              </FieldShell>
              {lengthSelect('army-bf-waist-unit', input.waistUnit, (u) =>
                onChange({ ...input, waistUnit: u }),
              )}
            </div>
            {errors.waist ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.waist}
              </p>
            ) : null}
          </div>

          {input.sex === 'female' ? (
            <div>
              <label htmlFor="army-bf-hip" className={labelClass}>
                Hip circumference
                <InfoTooltip
                  label="Hip circumference"
                  text="Legacy female method: widest point of the hips/buttocks."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.hip}>
                  <input
                    id="army-bf-hip"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.hip}
                    aria-invalid={Boolean(errors.hip)}
                    onChange={(e) =>
                      onChange({ ...input, hip: e.target.value })
                    }
                  />
                </FieldShell>
                {lengthSelect('army-bf-hip-unit', input.hipUnit, (u) =>
                  onChange({ ...input, hipUnit: u }),
                )}
              </div>
              {errors.hip ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.hip}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      )}

      <div>
        <label htmlFor="army-bf-result" className={labelClass}>
          Body fat
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-border bg-muted/30">
          <input
            id="army-bf-result"
            type="text"
            readOnly
            className={`${inputClass} cursor-default text-accent`}
            value={result ? result.formattedBodyFatPercent : ''}
            aria-live="polite"
          />
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">%</span>
        </div>
        {result?.maxStandard ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Age group {result.maxStandard.ageGroupLabel} max:{' '}
            {result.maxStandard.maxPercent}%
            {result.withinStandard == null
              ? ''
              : result.withinStandard
                ? ' — within standard (estimate)'
                : ' — above standard (estimate)'}
          </p>
        ) : null}
        {result ? (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        ) : null}
      </div>
    </form>
  );
}
