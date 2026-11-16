'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AlcoholMode, GramsToCaloriesFieldErrors, MacroField } from './types';

export interface GramsToCaloriesDraft {
  carbs: string;
  protein: string;
  fat: string;
  alcoholMode: AlcoholMode;
  alcoholGrams: string;
  volumeMl: string;
  abv: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): GramsToCaloriesDraft {
  return {
    carbs: '',
    protein: '',
    fat: '',
    alcoholMode: 'none',
    alcoholGrams: '',
    volumeMl: '',
    abv: '',
  };
}

interface GramsToCaloriesFormProps {
  draft: GramsToCaloriesDraft;
  errors: GramsToCaloriesFieldErrors;
  onDraftChange: (draft: GramsToCaloriesDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function NumberField({
  id,
  label,
  unit,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={value}
            placeholder="0"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <span className="flex h-11 min-w-[3rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {unit}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function GramsToCaloriesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GramsToCaloriesFormProps) {
  const setField = (field: MacroField | 'carbs' | 'protein' | 'fat', value: string) => {
    onDraftChange({ ...draft, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Estimate food energy from macronutrient grams using Atwater factors: carbs 4 kcal/g, protein
        4 kcal/g, fat 9 kcal/g, alcohol (ethanol) 7 kcal/g. Results are nutritional approximations
        in kilocalories (kcal).
      </div>

      <NumberField
        id="gtc-carbs"
        label="Carbohydrates"
        unit="g"
        value={draft.carbs}
        error={errors.carbs}
        onChange={(value) => setField('carbs', value)}
      />
      <NumberField
        id="gtc-protein"
        label="Protein"
        unit="g"
        value={draft.protein}
        error={errors.protein}
        onChange={(value) => setField('protein', value)}
      />
      <NumberField
        id="gtc-fat"
        label="Fat"
        unit="g"
        value={draft.fat}
        error={errors.fat}
        onChange={(value) => setField('fat', value)}
      />

      <fieldset className="space-y-3 rounded-xl border border-border p-3.5">
        <legend className="px-1 text-[13px] font-medium text-accent">Alcohol</legend>
        <p className="text-xs text-muted-foreground">How much alcohol did you drink?</p>
        {(
          [
            { mode: 'grams' as const, label: 'I know how many grams I drank' },
            { mode: 'volume' as const, label: "I don't know how many grams I drank" },
            { mode: 'none' as const, label: "I haven't drunk any alcohol" },
          ] as const
        ).map((option) => (
          <label key={option.mode} className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="gtc-alcohol-mode"
              checked={draft.alcoholMode === option.mode}
              onChange={() => onDraftChange({ ...draft, alcoholMode: option.mode })}
            />
            {option.label}
          </label>
        ))}

        {draft.alcoholMode === 'grams' ? (
          <NumberField
            id="gtc-alcohol-g"
            label="Alcohol consumed"
            unit="g"
            value={draft.alcoholGrams}
            error={errors.alcoholGrams}
            onChange={(value) => setField('alcoholGrams', value)}
          />
        ) : null}

        {draft.alcoholMode === 'volume' ? (
          <div className="space-y-3">
            <NumberField
              id="gtc-volume"
              label="Alcoholic beverage volume"
              unit="mL"
              value={draft.volumeMl}
              error={errors.volumeMl}
              onChange={(value) => setField('volumeMl', value)}
            />
            <NumberField
              id="gtc-abv"
              label="Alcohol by volume (ABV)"
              unit="%"
              value={draft.abv}
              error={errors.abv}
              onChange={(value) => setField('abv', value)}
            />
            <p className="text-xs text-muted-foreground">
              Ethanol mass ≈ volume (mL) × ABV/100 × 0.789 g/mL. Estimates ethanol only — not
              sugars or mixers.
            </p>
          </div>
        ) : null}
      </fieldset>

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
