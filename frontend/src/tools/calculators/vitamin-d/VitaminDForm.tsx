'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure } from './calculation';
import type {
  AgeUnit,
  SerumKnown,
  SerumUnit,
  VitaminDFieldErrors,
  VitaminDInput,
  VitaminDResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const radioRow = 'flex flex-wrap gap-4 text-sm text-accent';

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
  input: VitaminDInput;
  errors: VitaminDFieldErrors;
  result: VitaminDResult | null;
  onChange: (input: VitaminDInput) => void;
}

export function VitaminDForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<VitaminDInput>) =>
    onChange({ ...input, ...patch });

  const showSerum = input.serumKnown === 'yes';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Vitamin D inputs">
        <div>
          <label className={labelClass} htmlFor="vitd-age">
            Age
            <InfoTooltip text="Chronological age for the NIH ODS / IOM vitamin D AI or RDA life-stage row. Use months for infants under 1 year when helpful." />
          </label>
          <FieldShell error={errors.ageText}>
            <input
              id="vitd-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageText}
              onChange={(e) => set({ ageText: e.target.value })}
              aria-invalid={Boolean(errors.ageText)}
            />
            <select
              className={unitSelectClass}
              value={input.ageUnit}
              onChange={(e) =>
                set({ ageUnit: e.target.value as AgeUnit })
              }
              aria-label="Age unit"
            >
              <option value="yrs">yrs</option>
              <option value="mo">mo</option>
            </select>
          </FieldShell>
          {errors.ageText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>
            Do you know your vitamin D serum level?
            <InfoTooltip text="No keeps the worksheet on dietary reference intake by age only. Yes reveals 25(OH)D with ng/mL or nmol/L — status bands stay separate from DRI and never become a treatment dose." />
          </legend>
          <div
            className={radioRow}
            role="radiogroup"
            aria-label="Know vitamin D serum level"
          >
            {([
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ] as const).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  name="vitd-serum-known"
                  className="h-4 w-4 accent-primary"
                  checked={input.serumKnown === opt.value}
                  onChange={() =>
                    set({
                      serumKnown: opt.value as SerumKnown,
                      // Mode reset: clear lab entry when returning to No.
                      ...(opt.value === 'no'
                        ? { serumValueText: '', serumUnit: 'ng_mL' as SerumUnit }
                        : {}),
                    })
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {showSerum ? (
          <div className="space-y-3.5 border-t border-border pt-3.5">
            <div>
              <label className={labelClass} htmlFor="vitd-analyte">
                Analyte
                <InfoTooltip text="NIH ODS: serum 25(OH)D is the main vitamin D status indicator. 1,25(OH)₂D is not used as a routine status marker here." />
              </label>
              <FieldShell>
                <input
                  id="vitd-analyte"
                  type="text"
                  readOnly
                  className={`${inputClass} text-muted-foreground`}
                  value="25(OH)D"
                  aria-label="Serum analyte 25(OH)D"
                />
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="vitd-serum">
                Serum 25(OH)D
                <InfoTooltip text="Enter the lab concentration. Switch ng/mL ↔ nmol/L; physical value is preserved (1 ng/mL = 2.5 nmol/L per NIH ODS)." />
              </label>
              <FieldShell error={errors.serumValueText}>
                <input
                  id="vitd-serum"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.serumValueText}
                  onChange={(e) => set({ serumValueText: e.target.value })}
                  aria-invalid={Boolean(errors.serumValueText)}
                />
                <select
                  className={unitSelectClass}
                  value={input.serumUnit}
                  onChange={(e) => {
                    const nextUnit = e.target.value as SerumUnit;
                    const raw = input.serumValueText.trim();
                    if (raw === '' || nextUnit === input.serumUnit) {
                      set({ serumUnit: nextUnit });
                      return;
                    }
                    const n = Number(raw.replace(/,/g, ''));
                    if (!Number.isFinite(n)) {
                      set({ serumUnit: nextUnit });
                      return;
                    }
                    // Preserve physical concentration on unit switch.
                    const ng =
                      input.serumUnit === 'ng_mL' ? n : n / 2.5;
                    const nextVal =
                      nextUnit === 'ng_mL' ? ng : ng * 2.5;
                    set({
                      serumUnit: nextUnit,
                      serumValueText: formatMeasure(nextVal, 4),
                    });
                  }}
                  aria-label="Serum unit"
                >
                  <option value="ng_mL">ng/mL</option>
                  <option value="nmol_L">nmol/L</option>
                </select>
              </FieldShell>
              {errors.serumValueText ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.serumValueText}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <p className="text-xs italic leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Always double-check the calculations, the dosing information, and the contraindications on the leaflet. Consult your health provider before administering any medication or supplements. This tool cannot replace real medical consultation.'}
        </p>
      </section>
    </form>
  );
}
