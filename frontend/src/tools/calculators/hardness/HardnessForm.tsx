'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HARDNESS_MATERIAL_LABELS,
  HARDNESS_MATERIALS,
  HARDNESS_SCALE_LABELS,
  HARDNESS_SCALES,
  type HardnessFieldErrors,
  type HardnessMaterial,
  type HardnessScale,
} from './types';

export interface HardnessDraft {
  scale: HardnessScale;
  material: HardnessMaterial;
  value: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): HardnessDraft {
  return {
    scale: 'HBW',
    material: 'nonAusteniticSteel',
    value: '',
  };
}

interface HardnessFormProps {
  draft: HardnessDraft;
  errors: HardnessFieldErrors;
  onDraftChange: (draft: HardnessDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function HardnessForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: HardnessFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Hardness conversions are approximate and apply only to the selected material family. Unsupported
 ranges show as unavailable; values are never invented.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="hardness-material" className={labelClass}>
          Material
        </label>
        <select
          id="hardness-material"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
          value={draft.material}
          onChange={(event) =>
            onDraftChange({
              ...draft,
              material: event.target.value as HardnessMaterial,
            })
          }
        >
          {HARDNESS_MATERIALS.map((material) => (
            <option key={material} value={material}>
              {HARDNESS_MATERIAL_LABELS[material]}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>I want to enter hardness in…</legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Hardness scale">
          {HARDNESS_SCALES.map((scale) => (
            <label
              key={scale}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
            >
              <input
                type="radio"
                name="hardness-scale"
                value={scale}
                checked={draft.scale === scale}
                className="h-4 w-4 accent-primary"
                onChange={() => onDraftChange({ ...draft, scale })}
              />
              <span>{HARDNESS_SCALE_LABELS[scale]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="hardness-value" className={labelClass}>
          Enter hardness ({draft.scale})
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hardness-value"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.value}
              placeholder="e.g. 350"
              aria-invalid={Boolean(errors.value)}
              aria-describedby={errors.value ? 'hardness-value-error' : undefined}
              onChange={(event) => onDraftChange({ ...draft, value: event.target.value })}
            />
          </div>
          <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
            {draft.scale}
          </span>
        </div>
        {errors.value ? (
          <p id="hardness-value-error" className="text-xs text-red-600" role="alert">
            {errors.value}
          </p>
        ) : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
