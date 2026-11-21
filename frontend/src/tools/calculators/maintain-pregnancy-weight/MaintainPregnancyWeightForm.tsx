'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type {
  HeightUnit,
  MaintainPregnancyWeightFieldErrors,
  MaintainPregnancyWeightInput,
  MaintainPregnancyWeightResult,
  WeightUnit,
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

export function MaintainPregnancyWeightForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: {
  input: MaintainPregnancyWeightInput;
  errors: MaintainPregnancyWeightFieldErrors;
  result: MaintainPregnancyWeightResult | null;
  onChange: (input: MaintainPregnancyWeightInput) => void;
  onLoadExample: () => void;
}) {
  const set = (patch: Partial<MaintainPregnancyWeightInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <fieldset className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.beforeOpen}
          onClick={() => set({ beforeOpen: !input.beforeOpen })}
        >
          <span>Before pregnancy</span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              input.beforeOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.beforeOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <div>
              <label className={labelClass} htmlFor="mpw-height">
                Height
              </label>
              <FieldShell error={errors.height}>
                <input
                  id="mpw-height"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.height}
                  onChange={(e) => set({ height: e.target.value })}
                />
                <select
                  className={unitSelectClass}
                  value={input.heightUnit}
                  onChange={(e) =>
                    set({ heightUnit: e.target.value as HeightUnit })
                  }
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                </select>
              </FieldShell>
              {errors.height ? (
                <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="mpw-weight">
                Weight
              </label>
              <FieldShell error={errors.weight}>
                <input
                  id="mpw-weight"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.weight}
                  onChange={(e) => set({ weight: e.target.value })}
                />
                <select
                  className={unitSelectClass}
                  value={input.weightUnit}
                  onChange={(e) =>
                    set({ weightUnit: e.target.value as WeightUnit })
                  }
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </FieldShell>
              {errors.weight ? (
                <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="mpw-bmi">
                BMI
              </label>
              <FieldShell muted>
                <input
                  id="mpw-bmi"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedBmi ?? ''}
                />
              </FieldShell>
              {result ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {result.bmiCategoryLabel}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <div className="space-y-3.5 rounded-xl border border-border bg-white p-3.5">
        <p className="text-[13px] font-semibold text-accent">
          Weight during pregnancy
        </p>
        <div>
          <label className={labelClass} htmlFor="mpw-week">
            Week
          </label>
          <FieldShell error={errors.week}>
            <input
              id="mpw-week"
              className={inputClass}
              inputMode="decimal"
              value={input.week}
              onChange={(e) => set({ week: e.target.value })}
            />
          </FieldShell>
          {errors.week ? (
            <p className="mt-1 text-xs text-rose-600">{errors.week}</p>
          ) : null}
        </div>
        <div>
          <div className={labelClass}>Are you expecting twins?</div>
          <div className="flex flex-col gap-2" role="radiogroup">
            {(
              [
                [false, 'No'],
                [true, 'Yes'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={label}
                className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-sm ${
                  input.twins === value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="mpw-twins"
                  checked={input.twins === value}
                  onChange={() => set({ twins: value })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {(
          [
            ['Min. recommended weight', result?.formattedMinWeight],
            ['Max. weight', result?.formattedMaxWeight],
            ['Min. weight gain', result?.formattedMinGain],
            ['Max. weight gain', result?.formattedMaxGain],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <label className={labelClass}>{label}</label>
            <FieldShell muted>
              <input
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={value ?? ''}
              />
            </FieldShell>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (165 cm · 60 kg · week 40)
      </button>
    </form>
  );
}
