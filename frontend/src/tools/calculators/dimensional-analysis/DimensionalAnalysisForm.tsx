'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_BASE_QUANTITY,
  DEFAULT_DERIVED_QUANTITY,
  getQuantity,
  quantitiesByKind,
} from './catalog';
import type { CalcMode, FieldErrors, UnitType } from './types';

export interface DimensionalDraft {
  mode: CalcMode;
  unitType: UnitType;
  quantityId: string;
  value1: string;
  unit1Id: string;
  value2: string;
  unit2Id: string;
  value: string;
  fromId: string;
  toId: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function defaultsForQuantity(quantityId: string): Pick<
  DimensionalDraft,
  'unit1Id' | 'unit2Id' | 'fromId' | 'toId'
> {
  const q = getQuantity(quantityId);
  const units = q?.units ?? [];
  const first = units[0]?.id ?? '';
  const second = units[1]?.id ?? first;
  return {
    unit1Id: q?.defaultUnitId ?? first,
    unit2Id: second,
    fromId: q?.defaultUnitId ?? first,
    toId: second,
  };
}

export function emptyDraft(): DimensionalDraft {
  const quantityId = DEFAULT_BASE_QUANTITY;
  return {
    mode: 'compare',
    unitType: 'base',
    quantityId,
    value1: '',
    value2: '',
    value: '',
    ...defaultsForQuantity(quantityId),
  };
}

export function draftForUnitType(unitType: UnitType, prev: DimensionalDraft): DimensionalDraft {
  const list = quantitiesByKind(unitType);
  const quantityId =
    list.find((q) => q.id === prev.quantityId)?.id ??
    (unitType === 'base' ? DEFAULT_BASE_QUANTITY : DEFAULT_DERIVED_QUANTITY);
  return {
    ...prev,
    unitType,
    quantityId,
    value1: '',
    value2: '',
    value: '',
    ...defaultsForQuantity(quantityId),
  };
}

export function draftForQuantity(quantityId: string, prev: DimensionalDraft): DimensionalDraft {
  return {
    ...prev,
    quantityId,
    value1: '',
    value2: '',
    value: '',
    ...defaultsForQuantity(quantityId),
  };
}

interface DimensionalAnalysisFormProps {
  draft: DimensionalDraft;
  errors: FieldErrors;
  onDraftChange: (draft: DimensionalDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function DimensionalAnalysisForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DimensionalAnalysisFormProps) {
  const quantity = getQuantity(draft.quantityId);
  const quantities = quantitiesByKind(draft.unitType);
  const units = quantity?.units ?? [];

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className="text-[13px] font-medium text-accent">I want to...</legend>
        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            name="da-mode"
            checked={draft.mode === 'compare'}
            onChange={() =>
              onDraftChange({
                ...draft,
                mode: 'compare',
                value1: '',
                value2: '',
                value: '',
              })
            }
          />
          Compare two values
        </label>
        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            name="da-mode"
            checked={draft.mode === 'convert'}
            onChange={() =>
              onDraftChange({
                ...draft,
                mode: 'convert',
                value1: '',
                value2: '',
                value: '',
              })
            }
          />
          Convert units
        </label>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[13px] font-medium text-accent">Choose a unit type</legend>
        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            name="da-unit-type"
            checked={draft.unitType === 'base'}
            onChange={() => onDraftChange(draftForUnitType('base', draft))}
          />
          Base units
        </label>
        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            name="da-unit-type"
            checked={draft.unitType === 'derived'}
            onChange={() => onDraftChange(draftForUnitType('derived', draft))}
          />
          Derived units
        </label>
      </fieldset>

      <div>
        <label htmlFor="da-quantity" className={labelClass}>
          Physical quantity
        </label>
        <select
          id="da-quantity"
          className={selectClass}
          value={draft.quantityId}
          onChange={(event) => onDraftChange(draftForQuantity(event.target.value, draft))}
        >
          {quantities.map((q) => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>
        {errors.quantity ? (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.quantity}
          </p>
        ) : null}
      </div>

      {draft.mode === 'compare' ? (
        <>
          <div className="space-y-1.5">
            <label htmlFor="da-value1" className={labelClass}>
              Value 1
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="da-value1"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.value1}
                  aria-invalid={Boolean(errors.value1)}
                  onChange={(event) => onDraftChange({ ...draft, value1: event.target.value })}
                />
              </div>
              <select
                className={`${selectClass} w-[7.5rem] shrink-0`}
                value={draft.unit1Id}
                aria-label="Unit for value 1"
                onChange={(event) => onDraftChange({ ...draft, unit1Id: event.target.value })}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.symbol}
                  </option>
                ))}
              </select>
            </div>
            {errors.value1 ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.value1}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="da-value2" className={labelClass}>
              Value 2
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="da-value2"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.value2}
                  aria-invalid={Boolean(errors.value2)}
                  onChange={(event) => onDraftChange({ ...draft, value2: event.target.value })}
                />
              </div>
              <select
                className={`${selectClass} w-[7.5rem] shrink-0`}
                value={draft.unit2Id}
                aria-label="Unit for value 2"
                onChange={(event) => onDraftChange({ ...draft, unit2Id: event.target.value })}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.symbol}
                  </option>
                ))}
              </select>
            </div>
            {errors.value2 ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.value2}
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1.5">
            <label htmlFor="da-value" className={labelClass}>
              Value
            </label>
            <div className="min-w-0 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="da-value"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.value}
                aria-invalid={Boolean(errors.value)}
                onChange={(event) => onDraftChange({ ...draft, value: event.target.value })}
              />
            </div>
            {errors.value ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.value}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="da-from" className={labelClass}>
                From
              </label>
              <select
                id="da-from"
                className={selectClass}
                value={draft.fromId}
                onChange={(event) => onDraftChange({ ...draft, fromId: event.target.value })}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="da-to" className={labelClass}>
                To
              </label>
              <select
                id="da-to"
                className={selectClass}
                value={draft.toId}
                onChange={(event) => onDraftChange({ ...draft, toId: event.target.value })}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

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
          Calculate
        </button>
      </div>
    </form>
  );
}
