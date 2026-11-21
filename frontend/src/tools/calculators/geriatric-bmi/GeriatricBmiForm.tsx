'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertHeight, convertWeight } from './calculation';
import type {
  GeriatricBmiFieldErrors,
  GeriatricBmiInput,
  GeriatricBmiResult,
  HeightUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface Props {
  input: GeriatricBmiInput;
  errors: GeriatricBmiFieldErrors;
  result: GeriatricBmiResult | null;
  onChange: (input: GeriatricBmiInput) => void;
}

export function GeriatricBmiForm({ input, errors, result, onChange }: Props) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Quetelet BMI for older adults using elevated cut-points (&lt;23 /
        23–29.9 / ≥30). Educational screening only — not a diagnosis.
      </p>

      <div>
        <label htmlFor="gbmi-age" className={labelClass}>
          Age
          <InfoTooltip
            label="Age"
            text="Default example age is 70. Bands are intended for older-adult interpretation; confirm clinical guidance for your cohort."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.ageYears}>
            <input
              id="gbmi-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageYears}
              onChange={(e) =>
                onChange({ ...input, ageYears: e.target.value })
              }
            />
          </FieldShell>
          <span className={`${selectClass} flex w-[4.5rem] items-center justify-center text-muted-foreground`}>
            yrs
          </span>
        </div>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gbmi-weight" className={labelClass}>
          Weight
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.weightValue}>
            <input
              id="gbmi-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightValue}
              onChange={(e) =>
                onChange({ ...input, weightValue: e.target.value })
              }
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[5.5rem]`}
            value={input.weightUnit}
            onChange={(e) => {
              const next = e.target.value as WeightUnit;
              const n = Number(input.weightValue.trim().replace(/,/g, ''));
              if (Number.isFinite(n) && n > 0) {
                const c = convertWeight(n, input.weightUnit, next);
                if (c != null) {
                  onChange({
                    ...input,
                    weightUnit: next,
                    weightValue: String(Number(c.toPrecision(8))),
                  });
                  return;
                }
              }
              onChange({ ...input, weightUnit: next });
            }}
            aria-label="Weight unit"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="st">st</option>
          </select>
        </div>
        {errors.weightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gbmi-height" className={labelClass}>
          Height
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.heightValue}>
            <input
              id="gbmi-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightValue}
              onChange={(e) =>
                onChange({ ...input, heightValue: e.target.value })
              }
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[5.5rem]`}
            value={input.heightUnit}
            onChange={(e) => {
              const next = e.target.value as HeightUnit;
              const n = Number(input.heightValue.trim().replace(/,/g, ''));
              if (Number.isFinite(n) && n > 0) {
                const c = convertHeight(n, input.heightUnit, next);
                if (c != null) {
                  onChange({
                    ...input,
                    heightUnit: next,
                    heightValue: String(Number(c.toPrecision(8))),
                  });
                  return;
                }
              }
              onChange({ ...input, heightUnit: next });
            }}
            aria-label="Height unit"
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
            <option value="ft">ft</option>
          </select>
        </div>
        {errors.heightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gbmi-bmi" className={labelClass}>
          Body mass index (BMI)
        </label>
        <FieldShell>
          <input
            id="gbmi-bmi"
            type="text"
            readOnly
            className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
            value={
              result
                ? `${result.formattedBmi} (${result.categoryLabel})`
                : ''
            }
            placeholder="—"
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="border-b border-border bg-muted/30 px-3 py-2 text-xs font-semibold text-accent">
          Results interpretation:
        </div>
        <table className="w-full text-left text-xs text-accent">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-3 py-2 font-medium">BMI</th>
              <th className="px-3 py-2 font-medium">Weight Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-3 py-2">&lt; 23</td>
              <td className="px-3 py-2">Underweight</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">23 – 29.9</td>
              <td className="px-3 py-2">Normal</td>
            </tr>
            <tr>
              <td className="px-3 py-2">&gt; 30</td>
              <td className="px-3 py-2">Overweight/obese</td>
            </tr>
          </tbody>
        </table>
        <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
          Classification uses BMI &lt; 23, 23 ≤ BMI &lt; 30, and BMI ≥ 30
          (table labels 23–29.9 / &gt; 30).
        </p>
      </div>
    </form>
  );
}
