'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatKitchen, formatMeasure, gramsPerTablespoon } from './calculation';
import {
  DEFAULT_INGREDIENT_ID,
  INGREDIENT_DENSITIES,
  findIngredient,
} from './ingredients';
import {
  US_TABLESPOON_ML,
  type TbspGramsSource,
  type TbspToGramsFieldErrors,
  type TbspToGramsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface TbspToGramsDraft {
  source: TbspGramsSource;
  ingredientId: string;
  tablespoons: string;
  grams: string;
  showDensity: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-sky-200 bg-sky-50 px-3 text-sm font-medium text-sky-800';

export function emptyDraft(): TbspToGramsDraft {
  return {
    source: 'tablespoons',
    ingredientId: DEFAULT_INGREDIENT_ID,
    tablespoons: '',
    grams: '',
    showDensity: false,
  };
}

export function draftToInput(draft: TbspToGramsDraft): TbspToGramsInput {
  return {
    source: draft.source,
    ingredientId: draft.ingredientId,
    tablespoons: parseOptionalNumber(draft.tablespoons),
    grams: parseOptionalNumber(draft.grams),
  };
}

interface TbspToGramsFormProps {
  draft: TbspToGramsDraft;
  errors: TbspToGramsFieldErrors;
  onDraftChange: (draft: TbspToGramsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TbspToGramsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: TbspToGramsFormProps) {
  const set = (patch: Partial<TbspToGramsDraft>) => onDraftChange({ ...draft, ...patch });
  const ingredient = findIngredient(draft.ingredientId);
  const density = ingredient?.densityGPerMl ?? 0;
  const gPerTbsp = density > 0 ? gramsPerTablespoon(density) : 0;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert US tablespoons ({US_TABLESPOON_ML} mL) to grams using the selected ingredient&apos;s
        approximate density. Edit either field — the other updates instantly. Densities are
        estimates for level spoons.
      </div>

      <FieldShell
        label="Ingredient"
        htmlFor="tbsp-g-ingredient"
        tip="Density determines grams per tablespoon. Defaults to Butter."
        error={errors.ingredientId}
      >
        <select
          id="tbsp-g-ingredient"
          className={selectClass}
          value={draft.ingredientId}
          onChange={(event) => set({ ingredientId: event.target.value })}
        >
          {INGREDIENT_DENSITIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell
        label="Tablespoons"
        htmlFor="tbsp-g-tbsp"
        tip={`US tbsp = ${US_TABLESPOON_ML} mL. grams = tbsp × ${US_TABLESPOON_ML} × density.`}
        error={errors.tablespoons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="tbsp-g-tbsp"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.tablespoons}
              placeholder="Enter amount"
              aria-invalid={Boolean(errors.tablespoons)}
              onChange={(event) =>
                set({ source: 'tablespoons', tablespoons: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            tbsp
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Grams"
        htmlFor="tbsp-g-grams"
        tip="Enter grams to convert back to US tablespoons for the selected ingredient."
        error={errors.grams}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="tbsp-g-grams"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.grams}
              placeholder="Calculated mass"
              aria-invalid={Boolean(errors.grams)}
              onChange={(event) => set({ source: 'grams', grams: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            g
          </span>
        </div>
      </FieldShell>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
          checked={draft.showDensity}
          onChange={(event) => set({ showDensity: event.target.checked })}
        />
        Show ingredient density
      </label>

      {draft.showDensity && ingredient ? (
        <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3 text-sm text-foreground/85">
          <p className="font-medium text-accent">Ingredient: {ingredient.name}</p>
          <p className="mt-1 font-mono text-xs tabular-nums sm:text-sm">
            Density: {formatMeasure(ingredient.densityGPerMl)} g/mL
          </p>
          <p className="mt-1 font-mono text-xs tabular-nums sm:text-sm">
            Approximate mass of 1 US tablespoon: {formatKitchen(gPerTbsp)} grams
          </p>
          {ingredient.notes ? (
            <p className="mt-2 text-xs text-muted-foreground">{ingredient.notes}</p>
          ) : null}
        </div>
      ) : null}

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
