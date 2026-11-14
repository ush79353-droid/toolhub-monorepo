'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { MillionThousandFieldErrors, SourceField } from './types';

export interface MillionToThousandDraft {
  sourceField: SourceField;
  millions: string;
  thousands: string;
  decimal: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraft(): MillionToThousandDraft {
  return {
    sourceField: 'millions',
    millions: '1',
    thousands: '1000',
    decimal: '1000000',
  };
}

export function emptyDraft(): MillionToThousandDraft {
  return {
    sourceField: 'millions',
    millions: '',
    thousands: '',
    decimal: '',
  };
}

interface MillionToThousandFormProps {
  draft: MillionToThousandDraft;
  errors: MillionThousandFieldErrors;
  onDraftChange: (draft: MillionToThousandDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4 | 5) => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
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

export function MillionToThousandForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: MillionToThousandFormProps) {
  const set = (patch: Partial<MillionToThousandDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 million = 1,000 thousands = 1,000,000. M = millions, K = thousands. The decimal
        field accepts plain numbers or scientific notation (1e6, 1 × 10⁶).
      </div>

      <FieldShell label="Value in millions" htmlFor="m2k-millions" error={errors.millions}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2k-millions"
              inputMode="decimal"
              className={inputClass}
              value={draft.millions}
              placeholder="Enter millions"
              aria-invalid={Boolean(errors.millions)}
              onChange={(event) =>
                set({ sourceField: 'millions', millions: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} title="Millions" aria-label="Millions unit">
            M
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Value in thousands" htmlFor="m2k-thousands" error={errors.thousands}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2k-thousands"
              inputMode="decimal"
              className={inputClass}
              value={draft.thousands}
              placeholder="Enter thousands"
              aria-invalid={Boolean(errors.thousands)}
              onChange={(event) =>
                set({ sourceField: 'thousands', thousands: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} title="Thousands" aria-label="Thousands unit">
            K
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Decimal number" htmlFor="m2k-decimal" error={errors.decimal}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2k-decimal"
              inputMode="text"
              className={inputClass}
              value={draft.decimal}
              placeholder="e.g. 1000000 or 1e6"
              aria-invalid={Boolean(errors.decimal)}
              aria-describedby="m2k-decimal-hint"
              onChange={(event) =>
                set({ sourceField: 'decimal', decimal: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} title="Scientific / absolute" aria-label="Ten to the n">
            10ⁿ
          </span>
        </div>
        <p id="m2k-decimal-hint" className="text-xs text-muted-foreground">
          Absolute value as a plain number or scientific notation.
        </p>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '1 million = 1,000 thousands'],
              [2, '2.5 million = 2,500 thousands'],
              [3, '0.5 million = 500 thousands'],
              [4, '2,500 thousands = 2.5 million'],
              [5, '1e9 = 1,000 million'],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                className="text-left text-primary underline-offset-2 hover:underline"
                onClick={() => onApplyExample(id)}
              >
                Example {id} — {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

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
