'use client';

import type { CageFieldErrors, CageInput, CageResult } from './types';
import { CAGE_ITEMS } from './types';

const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface FormProps {
  input: CageInput;
  errors: CageFieldErrors;
  result: CageResult | null;
  onChange: (input: CageInput) => void;
}

export function CageForm({ input, result, onChange }: FormProps) {
  const set = (key: keyof CageInput, value: boolean) =>
    onChange({ ...input, [key]: value });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
    >
      <section className={sectionClass} aria-label="CAGE items">
        <p className="text-sm text-muted-foreground">
          Please tick the corresponding box if you ever…
        </p>
        <ul className="space-y-3">
          {CAGE_ITEMS.map((item) => (
            <li key={item.key}>
              <label className="flex items-start gap-3 text-sm text-accent">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-primary"
                  checked={input[item.key]}
                  onChange={(e) => set(item.key, e.target.checked)}
                />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>

        {result ? (
          <p
            className="rounded-lg bg-muted/30 px-3 py-2 text-sm leading-relaxed text-accent"
            aria-live="polite"
          >
            <span className="font-semibold">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
