'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ALL_FIELDS,
  BIT_FIELDS,
  BYTE_FIELDS,
  DATA_RATE_UNIT_BY_ID,
  PRIMARY_FIELDS,
  type DataRateUnit,
  type MbpsFieldErrors,
} from './types';

export interface MbpsDraft {
  texts: Record<DataRateUnit, string>;
  activeField: DataRateUnit | null;
  primaryOpen: boolean;
  bitsOpen: boolean;
  bytesOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<DataRateUnit, string> {
  return Object.fromEntries(ALL_FIELDS.map((f) => [f, ''])) as Record<DataRateUnit, string>;
}

export function defaultDraft(): MbpsDraft {
  return {
    texts: {
      'Mbit/s': '100',
      'MB/s': '12.5',
      'bit/s': '100000000',
      'kbit/s': '100000',
      'Gbit/s': '0.1',
      'B/s': '12500000',
      'kB/s': '12500',
      'GB/s': '0.0125',
    },
    activeField: null,
    primaryOpen: true,
    bitsOpen: false,
    bytesOpen: false,
  };
}

export function emptyDraft(): MbpsDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    primaryOpen: true,
    bitsOpen: false,
    bytesOpen: false,
  };
}

interface MbpsFormProps {
  draft: MbpsDraft;
  errors: MbpsFieldErrors;
  onDraftChange: (draft: MbpsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2) => void;
  children?: ReactNode;
}

function FieldRow({
  field,
  draft,
  errors,
  onDraftChange,
}: {
  field: DataRateUnit;
  draft: MbpsDraft;
  errors: MbpsFieldErrors;
  onDraftChange: (draft: MbpsDraft) => void;
}) {
  const id = `mbps-calc-${field.replace('/', '-')}`;
  const error = errors[field];
  const def = DATA_RATE_UNIT_BY_ID[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {field === 'Mbit/s' ? 'Megabits' : field === 'MB/s' ? 'Megabytes' : def.label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.texts[field]}
            placeholder="0"
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
}

function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open ? <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">{children}</div> : null}
    </div>
  );
}

export function MbpsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: MbpsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Lowercase <strong>b</strong> means bits; uppercase <strong>B</strong> means bytes. Edit any
 field; all others update from the same bit rate. <strong>1 MB/s = 8 Mbit/s</strong>.
      </div>

      <AccordionSection
        title="Megabits / Megabytes"
        open={draft.primaryOpen}
        onToggle={() => onDraftChange({ ...draft, primaryOpen: !draft.primaryOpen })}
      >
        {PRIMARY_FIELDS.map((field) => (
          <FieldRow
            key={field}
            field={field}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="Other data transfer units (bits)"
        open={draft.bitsOpen}
        onToggle={() => onDraftChange({ ...draft, bitsOpen: !draft.bitsOpen })}
      >
        {BIT_FIELDS.map((field) => (
          <FieldRow
            key={field}
            field={field}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="Other data transfer units (bytes)"
        open={draft.bytesOpen}
        onToggle={() => onDraftChange({ ...draft, bytesOpen: !draft.bytesOpen })}
      >
        {BYTE_FIELDS.map((field) => (
          <FieldRow
            key={field}
            field={field}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Check our examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(1)}
            >
 Example 1: 100 Mbps to MB/s
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(2)}
            >
 Example 2: 1 Gbps to Mbps
            </button>
          </li>
        </ul>
      </div>

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
