'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AgeBand,
  Cha2ds2VascInput,
  Cha2ds2VascResult,
  YesNo,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

interface Props {
  input: Cha2ds2VascInput;
  result: Cha2ds2VascResult;
  onChange: (input: Cha2ds2VascInput) => void;
}

function YesNoRow({
  id,
  label,
  tip,
  value,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div>
      <p id={`${id}-label`} className={labelClass}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </p>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-labelledby={`${id}-label`}
      >
        {(['yes', 'no'] as const).map((opt) => (
          <label
            key={opt}
            htmlFor={`${id}-${opt}`}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
          >
            <input
              id={`${id}-${opt}`}
              type="radio"
              name={id}
              value={opt}
              checked={value === opt}
              className="h-4 w-4 accent-primary"
              onChange={() => onChange(opt)}
            />
            <span>{opt === 'yes' ? 'Yes' : 'No'}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function Cha2ds2VascForm({ input, result, onChange }: Props) {
  const set = (patch: Partial<Cha2ds2VascInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-muted-foreground">
        If your patient presents a condition, select &apos;Yes&apos;
      </p>

      <div className={sectionClass}>
        <YesNoRow
          id="cha2-chf"
          label="Congestive heart failure"
          tip="Congestive heart failure or left ventricular systolic dysfunction — 1 point."
          value={input.chf}
          onChange={(chf) => set({ chf })}
        />
        <YesNoRow
          id="cha2-htn"
          label="Hypertension"
          tip="History of hypertension — 1 point."
          value={input.hypertension}
          onChange={(hypertension) => set({ hypertension })}
        />

        <div>
          <p id="cha2-age-label" className={labelClass}>
            <span>Age</span>
            <InfoTooltip
              label="Age"
              text="<65 → 0 points; 65–74 → 1 point; ≥75 → 2 points."
            />
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="cha2-age-label"
          >
            {(
              [
                { id: 'under65', label: '< 65' },
                { id: '65to74', label: '65 - 74' },
                { id: 'ge75', label: '≥ 75' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.id}
                htmlFor={`cha2-age-${opt.id}`}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
              >
                <input
                  id={`cha2-age-${opt.id}`}
                  type="radio"
                  name="cha2-age"
                  value={opt.id}
                  checked={input.ageBand === opt.id}
                  className="h-4 w-4 accent-primary"
                  onChange={() => set({ ageBand: opt.id as AgeBand })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <YesNoRow
          id="cha2-dm"
          label="Diabetes"
          tip="Diabetes mellitus — 1 point."
          value={input.diabetes}
          onChange={(diabetes) => set({ diabetes })}
        />
        <YesNoRow
          id="cha2-female"
          label="Female gender?"
          tip="Female sex category — 1 point."
          value={input.female}
          onChange={(female) => set({ female })}
        />
        <YesNoRow
          id="cha2-stroke"
          label="Stroke, TIA or thromboembolism history"
          tip="Prior stroke, TIA, or thromboembolism — 2 points."
          value={input.priorStrokeTie}
          onChange={(priorStrokeTie) => set({ priorStrokeTie })}
        />
        <YesNoRow
          id="cha2-vasc"
          label="Vascular disease"
          tip="Prior MI, peripheral artery disease, or aortic plaque — 1 point."
          value={input.vascularDisease}
          onChange={(vascularDisease) => set({ vascularDisease })}
        />
      </div>

      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="cha2-score">
            <span>Result</span>
            <InfoTooltip
              label="CHA2DS2-VASc score"
              text="Sum of factor points (0–9). Annual rates use Friberg 2012 Swedish AF cohort (never on warfarin)."
            />
          </label>
          <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-border bg-muted/30">
            <input
              id="cha2-score"
              type="text"
              readOnly
              className={`${inputClass} cursor-default`}
              value={result.formattedScore}
              aria-live="polite"
            />
          </div>
        </div>
        <p className="text-sm leading-relaxed text-accent" aria-live="polite">
          {result.interpretation}
        </p>
        {result.femaleSexOnlyNote ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.femaleSexOnlyNote}
          </p>
        ) : null}
        <p className="text-xs italic leading-relaxed text-muted-foreground">
          Educational score for nonvalvular atrial fibrillation context. Does
          not prescribe or withhold anticoagulation — discuss with a clinician.
          {` ${result.rateSourceNote}`}
        </p>
      </div>
    </form>
  );
}
