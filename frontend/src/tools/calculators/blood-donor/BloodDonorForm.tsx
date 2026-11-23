'use client';

import type { BloodDonorFieldErrors, BloodDonorInput, BloodDonorResult } from './types';
import { BLOOD_TYPE_OPTIONS } from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface Props {
  input: BloodDonorInput;
  errors: BloodDonorFieldErrors;
  result: BloodDonorResult | null;
  onChange: (input: BloodDonorInput) => void;
}

export function BloodDonorForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<BloodDonorInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate>
      <section className={sectionClass}>
        <p className={labelClass}>I want to…</p>
        <fieldset className="space-y-2">
          {(['donate', 'receive'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                className="h-4 w-4 accent-primary"
                checked={input.intent === v}
                onChange={() => set({ intent: v })}
              />
              {v}
            </label>
          ))}
        </fieldset>
      </section>
      <section className={sectionClass}>
        <p className={labelClass}>Blood or blood plasma?</p>
        <fieldset className="space-y-2">
          {(['blood', 'plasma'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                className="h-4 w-4 accent-primary"
                checked={input.component === v}
                onChange={() => set({ component: v })}
              />
              {v === 'blood' ? 'Blood' : 'Blood plasma'}
            </label>
          ))}
        </fieldset>
      </section>
      <section className={sectionClass}>
        <label className={labelClass} htmlFor="blood-type">
          My blood type
        </label>
        <select
          id="blood-type"
          className={selectClass}
          value={input.bloodType}
          onChange={(e) =>
            set({ bloodType: e.target.value as BloodDonorInput['bloodType'] })
          }
          aria-invalid={Boolean(errors.bloodType)}
        >
          <option value="">Select</option>
          {BLOOD_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {result?.compatibleTypes.length ? (
          <ul className="mt-3 list-inside list-disc text-sm text-accent">
            {result.compatibleTypes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}
        {result?.statusDetail ? (
          <p className="mt-2 text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </section>
    </form>
  );
}