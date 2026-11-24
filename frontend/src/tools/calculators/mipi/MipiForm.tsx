'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { MipiFieldErrors, MipiInput, MipiResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

interface Props {
  input: MipiInput;
  errors: MipiFieldErrors;
  result: MipiResult | null;
  onChange: (input: MipiInput) => void;
}

export function MipiForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<MipiInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <div>
        <label className={labelClass} htmlFor="mipi-age">
          Age in years
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.ageYearsText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="mipi-age"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.ageYearsText}
            onChange={(e) => set({ ageYearsText: e.target.value })}
          />
          <span className={unitFixed}>yrs</span>
        </div>
        {errors.ageYearsText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className={`${labelClass} flex items-center gap-1.5`}>
          ECOG
          <InfoTooltip text="ECOG performance status: 0–1 vs 2–4. ECOG >1 adds 0.6978 to continuous MIPI." />
        </legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            className="h-4 w-4 accent-primary"
            checked={input.ecog === 'zero_one'}
            onChange={() => set({ ecog: 'zero_one' })}
          />
          0–1
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            className="h-4 w-4 accent-primary"
            checked={input.ecog === 'two_four'}
            onChange={() => set({ ecog: 'two_four' })}
          />
          2–4
        </label>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="mipi-ldh">
          Serum LDH
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.serumLdhText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="mipi-ldh"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.serumLdhText}
            onChange={(e) => set({ serumLdhText: e.target.value })}
          />
          <span className={unitFixed}>U/l</span>
        </div>
        {errors.serumLdhText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.serumLdhText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mipi-uln">
          Upper normal limit of serum LDH
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.ldhUlnText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="mipi-uln"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.ldhUlnText}
            onChange={(e) => set({ ldhUlnText: e.target.value })}
          />
          <span className={unitFixed}>U/l</span>
        </div>
        {errors.ldhUlnText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ldhUlnText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mipi-wbc">
          White Blood Cells
          <InfoTooltip text="Enter WBC in ×1000/µL (e.g. 7 = 7000/µL). The formula uses log10 of the count per µL." />
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.wbcThousandPerUlText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="mipi-wbc"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.wbcThousandPerUlText}
            onChange={(e) => set({ wbcThousandPerUlText: e.target.value })}
          />
          <span className={unitFixed}>× 1000/µl</span>
        </div>
        {errors.wbcThousandPerUlText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.wbcThousandPerUlText}</p>
        ) : null}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 accent-primary"
          checked={input.knowKi67}
          onChange={(e) => set({ knowKi67: e.target.checked })}
        />
        I know the level of Ki-67 (optional)
      </label>

      {input.knowKi67 ? (
        <div>
          <label className={labelClass} htmlFor="mipi-ki67">
            Ki-67
          </label>
          <div
            className={`flex h-11 items-center rounded-lg border ${
              errors.ki67PercentText ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="mipi-ki67"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ki67PercentText}
              onChange={(e) => set({ ki67PercentText: e.target.value })}
            />
            <span className={unitFixed}>%</span>
          </div>
          {errors.ki67PercentText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ki67PercentText}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="mipi-out">
          MIPI
        </label>
        <div className="flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60">
          <input
            id="mipi-out"
            readOnly
            className={`${inputClass} text-muted-foreground`}
            value={result?.formattedScore ?? ''}
            aria-live="polite"
          />
        </div>
        {result?.riskGroupLabel ? (
          <p className="mt-2 text-xs font-medium text-accent">{result.riskGroupLabel}</p>
        ) : null}
        {result?.statusDetail ? (
          <p className="mt-1 text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </div>
    </form>
  );
}
