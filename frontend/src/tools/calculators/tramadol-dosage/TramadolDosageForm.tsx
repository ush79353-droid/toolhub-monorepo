'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AgeBand,
  PainKind,
  TabletStrengthMg,
  TramadolDosageFieldErrors,
  TramadolDosageInput,
  TramadolDosageResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

interface TramadolDosageFormProps {
  input: TramadolDosageInput;
  errors: TramadolDosageFieldErrors;
  result: TramadolDosageResult;
  onChange: (input: TramadolDosageInput) => void;
  onLoadExample: () => void;
}

export function TramadolDosageForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: TramadolDosageFormProps) {
  const set = (patch: Partial<TramadolDosageInput>) =>
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

      <fieldset>
        <legend className={labelClass}>Age</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {(
            [
              ['under_17', '< 17 years'],
              ['adult', '17 - 75 years'],
              ['over_75', '> 75 years'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="tramadol-age"
                checked={input.ageBand === value}
                onChange={() => set({ ageBand: value as AgeBand })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Kidney / liver insufficiency?</legend>
        <label className="inline-flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            checked={input.organInsufficiency}
            onChange={(e) => set({ organInsufficiency: e.target.checked })}
          />
          CrCl &lt; 30 mL/min or cirrhosis
        </label>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Dosage for:</legend>
        <div className="flex flex-wrap gap-4">
          {(
            [
              ['acute', 'Acute pain'],
              ['chronic', 'Chronic pain'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="tramadol-pain"
                checked={input.painKind === value}
                onChange={() => set({ painKind: value as PainKind })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          Tablets strength
          <InfoTooltip text="Extended-release tablet strengths. Do not crush, chew, or split ER tablets." />
        </legend>
        <div className="flex flex-wrap gap-3">
          {([100, 150, 200, 300] as const).map((mg) => (
            <label
              key={mg}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="tramadol-strength"
                checked={input.tabletStrengthMg === mg}
                onChange={() =>
                  set({ tabletStrengthMg: mg as TabletStrengthMg })
                }
              />
              {mg} mg
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="tramadol-daily">
          Desired daily dosage
          <InfoTooltip text="Enter the total daily milligrams your clinician prescribed — not a self-chosen starting dose." />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.dailyMg ? 'border-rose-400' : ''
          }`}
        >
          <input
            id="tramadol-daily"
            className={inputClass}
            inputMode="decimal"
            value={input.dailyMg}
            onChange={(e) =>
              onChange({
                ...input,
                dailyMg: e.target.value,
                lastEdited: 'dailyMg',
              })
            }
            aria-invalid={Boolean(errors.dailyMg)}
          />
          <span className={unitSelectClass}>mg</span>
        </div>
        {errors.dailyMg ? (
          <p className="mt-1 text-xs text-rose-600">{errors.dailyMg}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="tramadol-tablets">
          Number of tablets needed
          <InfoTooltip text="Whole ER tablets only. Changing tablets updates the daily mg total." />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.tablets ? 'border-rose-400' : ''
          }`}
        >
          <input
            id="tramadol-tablets"
            className={inputClass}
            inputMode="decimal"
            value={input.tablets}
            onChange={(e) =>
              onChange({
                ...input,
                tablets: e.target.value,
                lastEdited: 'tablets',
              })
            }
            aria-invalid={Boolean(errors.tablets)}
          />
        </div>
        {errors.tablets ? (
          <p className="mt-1 text-xs text-rose-600">{errors.tablets}</p>
        ) : null}
      </div>

      <div
        className="space-y-2 rounded-lg border border-border bg-muted/20 px-3.5 py-3 text-sm leading-relaxed text-accent"
        aria-live="polite"
      >
        <p className="text-xs font-medium text-muted-foreground">
          {result.titrationBlockedNote}
        </p>
        {result.status === 'contraindicated_age' ? (
          <p className="text-rose-700" role="status">
            {result.statusNote}
          </p>
        ) : result.status === 'ready' || result.status === 'over_max' ? (
          <>
            <p>
              Converted amount:{' '}
              <strong>{result.formattedDailyMg} mg/day</strong>
              {result.formattedTablets
                ? ` · ${result.formattedTablets} tablet(s) of ${input.tabletStrengthMg} mg`
                : null}
              .
            </p>
            {result.maxNote ? (
              <p className="text-muted-foreground">{result.maxNote}</p>
            ) : null}
            {result.statusNote ? (
              <p
                className={
                  result.status === 'over_max'
                    ? 'text-amber-900'
                    : 'text-muted-foreground'
                }
              >
                {result.statusNote}
              </p>
            ) : null}
          </>
        ) : (
          <p
            className={
              result.status === 'not_divisible'
                ? 'text-amber-900'
                : 'text-muted-foreground'
            }
          >
            {result.statusNote}
          </p>
        )}
        {result.maxNote &&
        result.status !== 'ready' &&
        result.status !== 'over_max' &&
        result.status !== 'contraindicated_age' ? (
          <p className="text-xs text-muted-foreground">{result.maxNote}</p>
        ) : null}
        <p className="text-xs italic text-muted-foreground">
          {result.disclaimer}
        </p>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (300 mg/day · 100 mg tablets)
      </button>
    </form>
  );
}
