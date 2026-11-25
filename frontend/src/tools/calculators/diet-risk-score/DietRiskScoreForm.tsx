'use client';

import type {
  DietFrequency,
  DietRiskItemId,
  DietRiskScoreFieldErrors,
  DietRiskScoreInput,
  DietRiskScoreResult,
} from './types';
import { DIET_RISK_ITEMS, FREQUENCY_OPTIONS } from './types';

const legendClass = 'text-[13px] font-medium text-accent';

interface Props {
  input: DietRiskScoreInput;
  errors: DietRiskScoreFieldErrors;
  result: DietRiskScoreResult | null;
  onChange: (input: DietRiskScoreInput) => void;
}

export function DietRiskScoreForm({ input, errors, result, onChange }: Props) {
  const setItem = (id: DietRiskItemId, frequency: DietFrequency) =>
    onChange({ ...input, [id]: frequency });

  const unanswered = new Set(result?.unansweredItems ?? []);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5" noValidate autoComplete="off">
      <p className="text-xs text-muted-foreground">
        9-item Diet Risk Score (DRS). Select frequency for each food group. Educational screening only.
      </p>
      {DIET_RISK_ITEMS.map((item) => (
        <fieldset
          key={item.id}
          className={`space-y-2 rounded-lg border p-3 ${unanswered.has(item.id) ? 'border-amber-300 bg-amber-50/40' : 'border-border'}`}
        >
          <legend className={legendClass}>{item.label}</legend>
          <div className="flex flex-wrap gap-2">
            {FREQUENCY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-white px-2 py-1.5 text-xs text-accent">
                <input
                  type="radio"
                  name={item.id}
                  className="h-3.5 w-3.5 accent-primary"
                  checked={input[item.id] === opt.value}
                  onChange={() => setItem(item.id, opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div>
        <div className={legendClass}>Points</div>
        <div className="mt-1.5 flex h-11 items-center rounded-lg border border-border bg-muted/25 px-3 text-sm font-semibold tabular-nums text-primary" aria-live="polite">
          {result?.complete ? result.formattedScore : ''}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {result?.complete
            ? result.riskLabel
            : result?.statusDetail ?? errors.form}
        </p>
      </div>
    </form>
  );
}