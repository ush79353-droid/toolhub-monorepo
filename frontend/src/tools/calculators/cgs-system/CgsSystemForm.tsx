'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_QUANTITY,
  DEFAULT_SI,
  QUANTITIES,
  QUANTITY_LIST,
  type CgsField,
  type CgsFieldErrors,
  type QuantityId,
} from './types';
import { formatAmount, siToCgs } from './calculation';

export interface CgsSystemDraft {
  quantity: QuantityId;
  si: string;
  cgs: string;
  activeField: CgsField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function defaultDraft(): CgsSystemDraft {
  return {
    quantity: DEFAULT_QUANTITY,
    si: String(DEFAULT_SI),
    cgs: formatAmount(siToCgs(DEFAULT_SI, DEFAULT_QUANTITY)),
    activeField: null,
  };
}

export function emptyDraft(quantity: QuantityId = DEFAULT_QUANTITY): CgsSystemDraft {
  return {
    quantity,
    si: '',
    cgs: '',
    activeField: null,
  };
}

interface CgsSystemFormProps {
  draft: CgsSystemDraft;
  errors: CgsFieldErrors;
  onDraftChange: (draft: CgsSystemDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function CgsSystemForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CgsSystemFormProps) {
  const def = QUANTITIES[draft.quantity];

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert mechanical CGS ↔ SI quantities. Gal is the galileo (acceleration), not gallon.
 Electromagnetic CGS conventions are explained in the article; they are not mixed into this
        mechanical converter.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="cgs-quantity" className={labelClass}>
          Select the type of conversion you need
        </label>
        <select
          id="cgs-quantity"
          className={selectClass}
          value={draft.quantity}
          onChange={(event) =>
            onDraftChange({
              ...emptyDraft(event.target.value as QuantityId),
              quantity: event.target.value as QuantityId,
              activeField: null,
            })
          }
        >
          {QUANTITY_LIST.map((q) => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-border px-3.5 py-3.5 space-y-3">
        <p className="text-sm font-semibold text-accent">{def.label}</p>
        <p className="text-xs text-muted-foreground font-mono">{def.formula}</p>

        <div className="space-y-1.5">
          <label htmlFor="cgs-si" className={labelClass}>
            SI
          </label>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cgs-si"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                className={inputClass}
                value={draft.si}
                placeholder="Enter SI value"
                aria-invalid={Boolean(errors.si)}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    si: event.target.value,
                    activeField: 'si',
                  })
                }
              />
            </div>
            <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
              {def.siUnit}
            </span>
          </div>
          {errors.si ? (
            <p className="text-xs text-red-600" role="alert">
              {errors.si}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cgs-cgs" className={labelClass}>
            CGS
          </label>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cgs-cgs"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                className={inputClass}
                value={draft.cgs}
                placeholder="Enter CGS value"
                aria-invalid={Boolean(errors.cgs)}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    cgs: event.target.value,
                    activeField: 'cgs',
                  })
                }
              />
            </div>
            <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
              {def.cgsUnit}
            </span>
          </div>
          {errors.cgs ? (
            <p className="text-xs text-red-600" role="alert">
              {errors.cgs}
            </p>
          ) : null}
        </div>
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
