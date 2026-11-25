'use client';

import type { PsiFieldErrors, PsiInput, PsiResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-2.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: PsiInput;
  errors: PsiFieldErrors;
  result: PsiResult | null;
  onChange: (input: PsiInput) => void;
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-accent">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export function PsiPortForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<PsiInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Patient's characteristics">
        <h3 className="text-sm font-semibold text-accent">Patient&apos;s characteristics</h3>

        <div>
          <div className={labelClass}>Sex</div>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(
              [
                ['female', 'Female'],
                ['male', 'Male'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="psi-sex"
                  checked={input.sex === value}
                  onChange={() => set({ sex: value })}
                />
                {label}
              </label>
            ))}
          </div>
          {errors.sex ? (
            <p className="mt-1 text-xs text-destructive">{errors.sex}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="psi-age">
            Age
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.ageText ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="psi-age"
              className={inputClass}
              inputMode="numeric"
              value={input.ageText}
              onChange={(e) => set({ ageText: e.target.value })}
            />
            <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
              years
            </span>
          </div>
          {errors.ageText ? (
            <p className="mt-1 text-xs text-destructive">{errors.ageText}</p>
          ) : null}
        </div>

        <CheckRow
          checked={input.nursingHome}
          onChange={(v) => set({ nursingHome: v })}
          label="Nursing home resident"
        />
        <CheckRow
          checked={input.renalDisease}
          onChange={(v) => set({ renalDisease: v })}
          label="History of renal disease"
        />
        <CheckRow
          checked={input.cerebrovascularDisease}
          onChange={(v) => set({ cerebrovascularDisease: v })}
          label="Cerebrovascular disease"
        />
        <CheckRow
          checked={input.liverDisease}
          onChange={(v) => set({ liverDisease: v })}
          label="Liver disease"
        />
        <CheckRow
          checked={input.neoplasm}
          onChange={(v) => set({ neoplasm: v })}
          label="Neoplasm"
        />
        <CheckRow
          checked={input.chf}
          onChange={(v) => set({ chf: v })}
          label="CHF (congestive heart failure)"
        />
      </section>

      <section className={sectionClass} aria-label="On examination">
        <h3 className="text-sm font-semibold text-accent">On examination</h3>
        <CheckRow
          checked={input.alteredMentalStatus}
          onChange={(v) => set({ alteredMentalStatus: v })}
          label="Altered mental status"
        />
        <CheckRow
          checked={input.pleuralEffusion}
          onChange={(v) => set({ pleuralEffusion: v })}
          label="Pleural effusion (visible on X-ray)"
        />
        <CheckRow
          checked={input.respiratoryRateOver30}
          onChange={(v) => set({ respiratoryRateOver30: v })}
          label="Respiratory rate > 30 breaths/min"
        />
        <CheckRow
          checked={input.pulseOver125}
          onChange={(v) => set({ pulseOver125: v })}
          label="Pulse > 125 BPM"
        />
        <CheckRow
          checked={input.systolicBpUnder90}
          onChange={(v) => set({ systolicBpUnder90: v })}
          label="Blood pressure: Systolic BP < 90 mmHg"
        />
        <CheckRow
          checked={input.temperatureAbnormal}
          onChange={(v) => set({ temperatureAbnormal: v })}
          label="Temperature < 95 °F or > 103.9 °F (< 35 °C or > 39.9 °C)"
        />
      </section>

      <section className={sectionClass} aria-label="Laboratory findings">
        <h3 className="text-sm font-semibold text-accent">Laboratory findings</h3>
        <CheckRow
          checked={input.bunOverThreshold}
          onChange={(v) => set({ bunOverThreshold: v })}
          label="Blood Urea Nitrogen: BUN > 30 mg/dL (11 mmol/L)"
        />
        <CheckRow
          checked={input.hematocritUnder30}
          onChange={(v) => set({ hematocritUnder30: v })}
          label="Hematocrit < 30%"
        />
        <CheckRow
          checked={input.sodiumUnder130}
          onChange={(v) => set({ sodiumUnder130: v })}
          label="Sodium < 130 mmol/L (or 130 mEq/L)"
        />
        <CheckRow
          checked={input.glucoseOver250}
          onChange={(v) => set({ glucoseOver250: v })}
          label="Glucose > 250 mg/dL (14 mmol/L)"
        />
        <CheckRow
          checked={input.arterialPhUnder735}
          onChange={(v) => set({ arterialPhUnder735: v })}
          label="pH < 7.35"
        />
        <CheckRow
          checked={input.po2Under60}
          onChange={(v) => set({ po2Under60: v })}
          label="Partial pressure of oxygen: pO₂ < 60 mmHg (8 kPa)"
        />
      </section>

      <div>
        <div className={labelClass}>PSI/PORT</div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result?.formattedPoints ? result.formattedPoints : '—'}
          </div>
          <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
            points
          </span>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.classLabel ? `${result.classLabel}. ` : ''}
            {result.statusDetail}
          </p>
        ) : null}
      </div>
    </form>
  );
}