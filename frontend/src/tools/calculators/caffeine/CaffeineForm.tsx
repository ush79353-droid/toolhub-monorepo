'use client';

import type {
  CaffeineDrinkId,
  CaffeineFieldErrors,
  CaffeineInput,
  CaffeinePopulation,
  CaffeineResult,
} from './types';
import { DRINK_OPTIONS, POPULATION_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface Props {
  input: CaffeineInput;
  errors: CaffeineFieldErrors;
  result: CaffeineResult | null;
  onChange: (input: CaffeineInput) => void;
  onLoadExample: () => void;
}

function parseCount(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function CaffeineForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<CaffeineInput>) =>
    onChange({ ...input, ...patch });

  const drinkSelect = (
    id: string,
    label: string,
    value: CaffeineDrinkId,
    onPick: (v: CaffeineDrinkId) => void,
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={selectClass}
        value={value}
        onChange={(e) => onPick(e.target.value as CaffeineDrinkId)}
      >
        {DRINK_OPTIONS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.label}
          </option>
        ))}
      </select>
    </div>
  );

  const countInput = (
    id: string,
    value: number | null,
    onPick: (v: number | null) => void,
    error?: string,
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        How many?
      </label>
      <input
        id={id}
        className={`${inputClass} ${error ? 'border-rose-400' : ''}`}
        inputMode="decimal"
        value={value ?? ''}
        onChange={(e) => onPick(parseCount(e.target.value))}
      />
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational daily caffeine intake from documented drink servings.
        Population max values are upper-limit references, not goals. Entries
        stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (2 mugs filter coffee → 280 mg)
        </button>
      </p>

      {drinkSelect('caf-d1', 'I had...', input.drink1, (v) =>
        set({ drink1: v }),
      )}
      {countInput('caf-c1', input.count1, (v) => set({ count1: v }), errors.count1)}

      {drinkSelect('caf-d2', 'I also had...', input.drink2, (v) =>
        set({ drink2: v }),
      )}
      {countInput('caf-c2', input.count2, (v) => set({ count2: v }), errors.count2)}

      {drinkSelect('caf-d3', 'And I had...', input.drink3, (v) =>
        set({ drink3: v }),
      )}
      {countInput('caf-c3', input.count3, (v) => set({ count3: v }), errors.count3)}

      <div>
        <div className={labelClass}>Your daily caffeine intake</div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result ? result.formattedTotal : '—'}
          </div>
          <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
            mg
          </span>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>I am...</legend>
        {POPULATION_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name="caf-pop"
              className="h-4 w-4 accent-primary"
              checked={input.population === opt.value}
              onChange={() =>
                set({ population: opt.value as CaffeinePopulation })
              }
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </fieldset>

      <div>
        <div className={labelClass}>Max recommended daily dose</div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/25">
          <div className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-accent">
            {result ? result.formattedMax : '400'}
          </div>
          <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
            mg
          </span>
        </div>
      </div>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
          {result.overLimit
            ? ' Current total is above that reference upper limit.'
            : ''}
        </p>
      ) : null}
    </form>
  );
}
