'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { QUARANTINE_ACTIVITIES } from './activities';
import { heightToCm, parseNumber, weightToKg } from './calculation';
import type {
  ActivityLevel,
  ActivitySlot,
  HeightUnit,
  QuarantineActivityFieldErrors,
  QuarantineActivityInput,
  QuarantineActivityResult,
  TimeUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

const WORK_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 0, label: 'Does watching Netflix count?' },
  { value: 1, label: 'Home office' },
  { value: 2, label: "I'm moving around for the whole day" },
  { value: 3, label: 'I have a physical job' },
];

const HOME_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 0, label: 'Still trying to avoid them' },
  { value: 1, label: 'Basic stuff (e.g. cooking, cleaning)' },
  { value: 2, label: 'Never done so much cleaning' },
  { value: 3, label: "I'm very active (e.g. gardening, renovation)" },
];

const EXERCISE_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 0, label: 'Trips to the fridge' },
  { value: 1, label: 'Light (e.g. yoga, stretching)' },
  { value: 2, label: 'Moderate (e.g. cardio, interval)' },
  { value: 3, label: 'Strenuous (e.g. garden marathon)' },
];

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function RadioGroup({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: ActivityLevel;
  options: { value: ActivityLevel; label: string }[];
  onChange: (v: ActivityLevel) => void;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="space-y-2" role="radiogroup" aria-label={legend}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name={name}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function slotFilled(slot: ActivitySlot): boolean {
  return Boolean(slot.activityId) && slot.timeText.trim() !== '';
}

/** Progressive rows: always show first; show next when prior is complete (max 3). */
function visibleSlotCount(slots: ActivitySlot[]): number {
  let n = 1;
  for (let i = 0; i < 2; i++) {
    if (slotFilled(slots[i]!)) n = i + 2;
    else break;
  }
  return Math.min(3, n);
}

function formatConverted(n: number, digits: number): string {
  if (!Number.isFinite(n)) return '';
  return String(Number(n.toFixed(digits)));
}

interface Props {
  input: QuarantineActivityInput;
  errors: QuarantineActivityFieldErrors;
  result: QuarantineActivityResult | null;
  openPersonal: boolean;
  openActivity: boolean;
  openRemoved: boolean;
  openAdded: boolean;
  onTogglePersonal: () => void;
  onToggleActivity: () => void;
  onToggleRemoved: () => void;
  onToggleAdded: () => void;
  onChange: (input: QuarantineActivityInput) => void;
}

export function QuarantineActivityForm({
  input,
  errors,
  result,
  openPersonal,
  openActivity,
  openRemoved,
  openAdded,
  onTogglePersonal,
  onToggleActivity,
  onToggleRemoved,
  onToggleAdded,
  onChange,
}: Props) {
  const set = (patch: Partial<QuarantineActivityInput>) =>
    onChange({ ...input, ...patch });

  const switchHeight = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseNumber(input.heightText);
    if (raw === null) {
      set({ heightUnit: next });
      return;
    }
    const cm = heightToCm(raw, input.heightUnit);
    const converted = next === 'cm' ? cm : cm / 2.54;
    set({
      heightUnit: next,
      heightText: formatConverted(converted, next === 'cm' ? 1 : 2),
    });
  };

  const switchWeight = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weightText);
    if (raw === null) {
      set({ weightUnit: next });
      return;
    }
    const kg = weightToKg(raw, input.weightUnit);
    const converted = next === 'kg' ? kg : kg / 0.45359237;
    set({
      weightUnit: next,
      weightText: formatConverted(converted, 1),
    });
  };

  const patchSlot = (
    group: 'removed' | 'added',
    index: number,
    patch: Partial<ActivitySlot>,
  ) => {
    const next = input[group].map((s, i) =>
      i === index ? { ...s, ...patch } : s,
    );
    set({ [group]: next });
  };

  const switchTimeUnit = (
    group: 'removed' | 'added',
    index: number,
    next: TimeUnit,
  ) => {
    const slot = input[group][index]!;
    if (next === slot.timeUnit) return;
    const raw = parseNumber(slot.timeText);
    if (raw === null) {
      patchSlot(group, index, { timeUnit: next });
      return;
    }
    const minutes = slot.timeUnit === 'min' ? raw : raw * 60;
    const converted = next === 'min' ? minutes : minutes / 60;
    patchSlot(group, index, {
      timeUnit: next,
      timeText: formatConverted(converted, next === 'min' ? 0 : 2),
    });
  };

  const renderActivityRows = (
    group: 'removed' | 'added',
    activityLabel: string,
  ) => {
    const slots = input[group];
    const count = visibleSlotCount(slots);
    const timeErrorKeys =
      group === 'removed'
        ? (['removedTime0', 'removedTime1', 'removedTime2'] as const)
        : (['addedTime0', 'addedTime1', 'addedTime2'] as const);

    return (
      <div className="space-y-3.5">
        {Array.from({ length: count }, (_, i) => {
          const slot = slots[i]!;
          const timeErr = errors[timeErrorKeys[i]!];
          return (
            <div key={`${group}-${i}`} className="space-y-3">
              <div>
                <label
                  className={labelClass}
                  htmlFor={`qa-${group}-act-${i}`}
                >
                  {activityLabel}
                </label>
                <select
                  id={`qa-${group}-act-${i}`}
                  className={selectClass}
                  value={slot.activityId}
                  onChange={(e) =>
                    patchSlot(group, i, { activityId: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {QUARANTINE_ACTIVITIES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={labelClass}
                  htmlFor={`qa-${group}-time-${i}`}
                >
                  Time
                </label>
                <FieldShell error={timeErr}>
                  <input
                    id={`qa-${group}-time-${i}`}
                    className={inputClass}
                    inputMode="decimal"
                    value={slot.timeText}
                    onChange={(e) =>
                      patchSlot(group, i, { timeText: e.target.value })
                    }
                    aria-invalid={Boolean(timeErr)}
                  />
                  <select
                    className={unitSelectClass}
                    value={slot.timeUnit}
                    onChange={(e) =>
                      switchTimeUnit(
                        group,
                        i,
                        e.target.value as TimeUnit,
                      )
                    }
                    aria-label={`${activityLabel} time unit ${i + 1}`}
                  >
                    <option value="min">min</option>
                    <option value="hrs">hrs</option>
                  </select>
                </FieldShell>
                {timeErr ? (
                  <p className="mt-1 text-xs text-rose-600">{timeErr}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <CollapsibleSection
        title="Personal information"
        open={openPersonal}
        onToggle={onTogglePersonal}
      >
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Sex"
          >
            {(['female', 'male'] as const).map((sex) => (
              <label
                key={sex}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="qa-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === sex}
                  onChange={() => set({ sex })}
                />
                <span className="capitalize">{sex}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="qa-age">
            Age
            <InfoTooltip text="Chronological age in years for Mifflin–St Jeor (adult eligibility 15–100)." />
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="qa-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYearsText}
              onChange={(e) => set({ ageYearsText: e.target.value })}
              aria-invalid={Boolean(errors.ageYearsText)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.ageYearsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="qa-height">
            Height
            <InfoTooltip text="Converted to centimetres before BMR. Switching units preserves physical height." />
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="qa-height"
              className={inputClass}
              inputMode="decimal"
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) => switchHeight(e.target.value as HeightUnit)}
              aria-label="Height unit"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="qa-weight">
            Weight
            <InfoTooltip text="Converted to kilograms before BMR and MET calories. Switching units preserves mass." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="qa-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) => switchWeight(e.target.value as WeightUnit)}
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Current physical activity"
        open={openActivity}
        onToggle={onToggleActivity}
      >
        <RadioGroup
          legend="Work"
          name="qa-work"
          value={input.work}
          options={WORK_OPTIONS}
          onChange={(work) => set({ work })}
        />
        <RadioGroup
          legend="Home"
          name="qa-home"
          value={input.home}
          options={HOME_OPTIONS}
          onChange={(home) => set({ home })}
        />
        <RadioGroup
          legend="Exercises"
          name="qa-exercise"
          value={input.exercise}
          options={EXERCISE_OPTIONS}
          onChange={(exercise) => set({ exercise })}
        />

        <div aria-live="polite">
          <label className={labelClass} htmlFor="qa-pal">
            ∑ PAL
            <InfoTooltip text="Physical activity level from work + home + exercise scores (Omni quarantine map)." />
          </label>
          <FieldShell muted>
            <input
              id="qa-pal"
              readOnly
              className={`${inputClass} bg-sky-50/60`}
              value={result?.palDisplay ?? ''}
              aria-label="Physical activity level"
            />
          </FieldShell>
        </div>

        <div aria-live="polite">
          <label className={labelClass} htmlFor="qa-maint">
            🔥 Calories to maintain weight
            <InfoTooltip text="Mifflin–St Jeor BMR × PAL (kcal/day). Activity swaps are shown separately." />
          </label>
          <FieldShell muted>
            <input
              id="qa-maint"
              readOnly
              className={`${inputClass} bg-sky-50/60`}
              value={result?.maintenanceDisplay ?? ''}
              aria-label="Calories to maintain weight"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-accent">
              {result.statusHeadline}
            </p>
            <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
            {result.deltaDisplay ? (
              <p className="text-sm text-muted-foreground">{result.deltaDisplay}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
          </div>
        ) : null}
      </CollapsibleSection>

      <CollapsibleSection
        title="Everyday activities you had to give up (you can add up to 3 activities)"
        open={openRemoved}
        onToggle={onToggleRemoved}
      >
        {renderActivityRows('removed', 'Activity')}
      </CollapsibleSection>

      <CollapsibleSection
        title="Everyday activities you added to your routine (you can add up to 3 activities)"
        open={openAdded}
        onToggle={onToggleAdded}
      >
        {renderActivityRows('added', 'New activity')}
      </CollapsibleSection>
    </form>
  );
}
