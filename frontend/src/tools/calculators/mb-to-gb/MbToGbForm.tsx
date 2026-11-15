'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NUMBER_SYSTEM_LABELS,
  type DataUnit,
  type MbToGbFieldErrors,
  type NumberSystem,
} from './types';

export interface MbToGbDraft {
  texts: Record<DataUnit, string>;
  numberSystem: NumberSystem;
  activeField: DataUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): MbToGbDraft {
  return {
    texts: { MB: '1000', GB: '1' },
    numberSystem: 'decimal',
    activeField: null,
  };
}

export function emptyDraft(numberSystem: NumberSystem = 'decimal'): MbToGbDraft {
  return {
    texts: { MB: '', GB: '' },
    numberSystem,
    activeField: null,
  };
}

interface MbToGbFormProps {
  draft: MbToGbDraft;
  errors: MbToGbFieldErrors;
  onDraftChange: (draft: MbToGbDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function MbToGbForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MbToGbFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className={labelClass}>Number system</legend>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
          {(['decimal', 'binary'] as const).map((system) => (
            <label
              key={system}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="mb-gb-number-system"
                className="h-4 w-4 accent-primary"
                checked={draft.numberSystem === system}
                onChange={() =>
                  onDraftChange({
                    ...draft,
                    numberSystem: system,
                    // Keep the active (or MB) numeric text fixed; recalculate the other field.
                    activeField: draft.activeField ?? 'MB',
                  })
                }
              />
              <span>{NUMBER_SYSTEM_LABELS[system]}</span>
            </label>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Decimal uses SI <strong>1 GB = 1000 MB</strong>. Binary mode uses a legacy{' '}
          <strong>÷/× 1024</strong> factor (IEC equivalents are MiB/GiB). Switching modes keeps the
          edited number and recalculates the other field.
        </p>
      </fieldset>

      {(['MB', 'GB'] as const).map((field) => {
        const id = `mb-gb-${field}`;
        const error = errors[field];
        const label = field === 'MB' ? 'Megabytes' : 'Gigabytes';
        return (
          <div key={field} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {label}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.texts[field]}
                  placeholder={field === 'MB' ? 'e.g. 1000' : 'e.g. 1'}
                  aria-invalid={Boolean(error)}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      texts: { ...draft.texts, [field]: event.target.value },
                      activeField: field,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                {field}
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
