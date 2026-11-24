'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  AGE_BAND_OPTIONS,
  SPECIAL_REQUIREMENT_OPTIONS,
  type FishOilFieldErrors,
  type FishOilInput,
  type FishOilResult,
  type FishOilSpecialRequirementId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-ring';

interface Props {
  input: FishOilInput;
  errors: FishOilFieldErrors;
  result: FishOilResult | null;
  onChange: (input: FishOilInput) => void;
}

export function FishOilForm({ input, errors, result, onChange }: Props) {
  const [ageOpen, setAgeOpen] = useState(true);
  const [specialOpen, setSpecialOpen] = useState(true);

  const set = (patch: Partial<FishOilInput>) => onChange({ ...input, ...patch });

  const specialMg =
    result?.specialGuidance?.fishOilDosageMg != null
      ? String(result.specialGuidance.fishOilDosageMg)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          onClick={() => setAgeOpen((v) => !v)}
          aria-expanded={ageOpen}
        >
          <span className="text-sm font-semibold text-accent">
            Dosage based on age
          </span>
          {ageOpen ? (
            <ChevronUp className="h-4 w-4 text-primary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary" />
          )}
        </button>
        {ageOpen ? (
          <div className="space-y-3.5 border-t border-border px-4 py-3">
            <fieldset>
              <legend className={labelClass}>Age</legend>
              <div
                className="space-y-2.5"
                role="radiogroup"
                aria-label="Age band"
              >
                {AGE_BAND_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="fish-oil-age-band"
                      className="h-4 w-4 accent-primary"
                      checked={input.ageBand === opt.id}
                      onChange={() => set({ ageBand: opt.id })}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.ageBand ? (
                <p className="mt-1 text-xs text-rose-600">{errors.ageBand}</p>
              ) : null}
            </fieldset>

            <div aria-live="polite">
              <p className="text-sm text-accent">
                Recommended fish oil dosage:
                {result?.ageGuidance?.recommendedFishOilDosageLabel ? (
                  <span className="ml-1 font-semibold">
                    {result.ageGuidance.recommendedFishOilDosageLabel}
                  </span>
                ) : null}
              </p>
              {result?.ageGuidance?.detail ? (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {result.ageGuidance.detail}
                </p>
              ) : null}
              {result?.ageGuidance?.alaContext ? (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {result.ageGuidance.alaContext}
                </p>
              ) : null}
              {result?.ageGuidance?.boundaryNote ? (
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  {result.ageGuidance.boundaryNote}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          onClick={() => setSpecialOpen((v) => !v)}
          aria-expanded={specialOpen}
        >
          <span className="text-sm font-semibold text-accent">
            Dosage based on special nutritional needs/health condition
          </span>
          {specialOpen ? (
            <ChevronUp className="h-4 w-4 text-primary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary" />
          )}
        </button>
        {specialOpen ? (
          <div className="space-y-3.5 border-t border-border px-4 py-3">
            <div>
              <label className={labelClass} htmlFor="fish-oil-special">
                Special requirement
              </label>
              <select
                id="fish-oil-special"
                className={selectClass}
                value={input.specialRequirement}
                onChange={(e) =>
                  set({
                    specialRequirement: e.target
                      .value as FishOilSpecialRequirementId | '',
                  })
                }
                aria-invalid={Boolean(errors.specialRequirement)}
              >
                <option value="">Select</option>
                {SPECIAL_REQUIREMENT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.specialRequirement ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.specialRequirement}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="fish-oil-special-dosage">
                Fish oil dosage
                <InfoTooltip text="Milligrams refer to combined EPA+DHA (or a labeled upper limit) from primary sources—not total softgel oil weight. Blank when no validated EPA/DHA dose applies." />
              </label>
              <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-sky-200 bg-sky-50/60">
                <input
                  id="fish-oil-special-dosage"
                  readOnly
                  className="h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-muted-foreground outline-none"
                  value={specialMg}
                  aria-live="polite"
                />
                <span className="shrink-0 border-l border-border px-3 font-mono text-xs font-semibold text-primary">
                  {input.dosageUnit}
                </span>
              </div>
              {result?.specialGuidance?.detail ? (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {result.specialGuidance.detail}
                </p>
              ) : null}
              {result?.specialGuidance?.productNote ? (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {result.specialGuidance.productNote}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
