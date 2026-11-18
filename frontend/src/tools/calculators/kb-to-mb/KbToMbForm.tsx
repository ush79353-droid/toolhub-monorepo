'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  KILO_UNIT_LABELS,
  type FieldUnit,
  type KbToMbFieldErrors,
  type KiloUnit,
} from './types';

export interface KbToMbDraft {
  texts: Record<FieldUnit, string>;
  kiloUnit: KiloUnit;
  activeField: FieldUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): KbToMbDraft {
  return {
    texts: { kilo: '1024', MiB: '0.9765625', MB: '1.024' },
    kiloUnit: 'kB',
    activeField: null,
  };
}

export function emptyDraft(kiloUnit: KiloUnit = 'kB'): KbToMbDraft {
  return {
    texts: { kilo: '', MiB: '', MB: '' },
    kiloUnit,
    activeField: null,
  };
}

interface KbToMbFormProps {
  draft: KbToMbDraft;
  errors: KbToMbFieldErrors;
  onDraftChange: (draft: KbToMbDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function KbToMbForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KbToMbFormProps) {
  const kiloLabel = draft.kiloUnit === 'kB' ? 'Kilobytes' : 'Kibibytes';
  const kiloSuffix = draft.kiloUnit;

  const fields: { key: FieldUnit; label: string; suffix: string; hint: string }[] = [
    {
      key: 'kilo',
      label: kiloLabel,
      suffix: kiloSuffix,
      hint:
        draft.kiloUnit === 'kB'
          ? 'SI: 1 kB = 1000 bytes'
          : 'IEC: 1 KiB = 1024 bytes',
    },
    {
      key: 'MiB',
      label: 'Megabytes (binary)',
      suffix: 'MiB',
      hint: 'IEC: 1 MiB = 1,048,576 bytes',
    },
    {
      key: 'MB',
      label: 'Megabytes (SI)',
      suffix: 'MB',
      hint: 'SI: 1 MB = 1,000,000 bytes',
    },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className={labelClass}>Input unit for the first field</legend>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
          {(['kB', 'KiB'] as const).map((unit) => (
            <label
              key={unit}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="kb-mb-kilo-unit"
                className="h-4 w-4 accent-primary"
                checked={draft.kiloUnit === unit}
                onChange={() =>
                  onDraftChange({
                    ...draft,
                    kiloUnit: unit,
                    activeField: draft.activeField ?? 'kilo',
                  })
                }
              />
              <span>{KILO_UNIT_LABELS[unit]}</span>
            </label>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Switching units keeps the edited numeric text and recalculates MB / MiB from the correct
          byte size. kB and KiB are not the same.
        </p>
      </fieldset>

      {fields.map((field) => {
        const id = `kb-mb-${field.key}`;
        const error = errors[field.key];
        return (
          <div key={field.key} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {field.label}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.texts[field.key]}
                  placeholder="0"
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${id}-hint`}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      texts: { ...draft.texts, [field.key]: event.target.value },
                      activeField: field.key,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                {field.suffix}
              </span>
            </div>
            <p id={`${id}-hint`} className="text-xs text-muted-foreground">
              {field.hint}
            </p>
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
          Convert
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
