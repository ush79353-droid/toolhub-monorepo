'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CAPACITANCE_UNIT_BY_ID,
  CAP_FIELDS,
  type CapacitanceFieldErrors,
  type CapacitanceUnit,
} from './types';

export interface CapacitanceDraft {
  texts: Record<CapacitanceUnit, string>;
  activeField: CapacitanceUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): CapacitanceDraft {
  return {
    texts: {
      F: '1',
      mF: '1000',
      uF: '1000000',
      nF: '1000000000',
      pF: '1000000000000',
    },
    activeField: null,
  };
}

export function emptyDraft(): CapacitanceDraft {
  return {
    texts: { F: '', mF: '', uF: '', nF: '', pF: '' },
    activeField: null,
  };
}

interface CapacitanceFormProps {
  draft: CapacitanceDraft;
  errors: CapacitanceFieldErrors;
  onDraftChange: (draft: CapacitanceDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function CapacitanceForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CapacitanceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Edit any field: the others update from the same farad quantity. Adjacent SI prefixes differ
        by a factor of <strong>1000</strong> (1 µF = 1000 nF = 1,000,000 pF).
      </div>

      {CAP_FIELDS.map((field) => {
        const id = `cap-conv-${field}`;
        const error = errors[field];
        const def = CAPACITANCE_UNIT_BY_ID[field];
        return (
          <div key={field} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {def.label}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.texts[field]}
                  placeholder={field === 'F' ? 'e.g. 1' : 'e.g. 4.7'}
                  aria-invalid={Boolean(error)}
                  onChange={(event) =>
                    onDraftChange({
                      texts: { ...draft.texts, [field]: event.target.value },
                      activeField: field,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                {def.symbol}
              </span>
            </div>
            {error ? (
              <p className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
