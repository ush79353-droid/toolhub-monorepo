'use client';

import type {
  CiwaFieldErrors,
  CiwaInput,
  CiwaItemId,
  CiwaResult,
  CiwaScoreValue,
} from './types';
import { CIWA_ITEMS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface Props {
  input: CiwaInput;
  errors: CiwaFieldErrors;
  result: CiwaResult | null;
  onChange: (input: CiwaInput) => void;
  onLoadExample: () => void;
}

const UNASSESSED = '__unassessed__';

export function CiwaForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const setItem = (id: CiwaItemId, value: CiwaScoreValue) =>
    onChange({ ...input, [id]: value });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational CIWA-Ar worksheet (Sullivan et al., 1989). Score 0 means
        observed absence; choose “Not assessed” if the item was not rated.
        Entries stay in your browser. Not a diagnosis or medication order.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (nausea 4 + tremor 4 → total 8)
        </button>
      </p>

      {CIWA_ITEMS.map((item) => {
        const raw = input[item.id];
        const selectValue = raw == null ? UNASSESSED : String(raw);
        const error = errors[item.id];
        return (
          <div key={item.id}>
            <label className={labelClass} htmlFor={`ciwa-${item.id}`}>
              {item.label}
            </label>
            <p className="mb-1 text-[11px] text-muted-foreground">
              {item.prompt} · max {item.max}
            </p>
            <select
              id={`ciwa-${item.id}`}
              className={`${selectClass} ${error ? 'border-rose-400' : ''}`}
              value={selectValue}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === UNASSESSED) setItem(item.id, null);
                else setItem(item.id, Number(v));
              }}
            >
              <option value={UNASSESSED}>Not assessed</option>
              {item.options.map((opt) => (
                <option key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error ? (
              <p className="mt-1 text-xs text-destructive">{error}</p>
            ) : null}
          </div>
        );
      })}

      <div>
        <div className={labelClass}>CIWA-Ar score</div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result ? result.formattedTotal : '—'}
          </div>
          <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
            / {result?.maxTotal ?? 67}
          </span>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-destructive">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
