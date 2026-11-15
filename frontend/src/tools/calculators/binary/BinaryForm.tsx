'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { formatRangeLabel } from './calculation';
import type { BinaryFieldErrors, BinaryWidth } from './types';
import { BINARY_WIDTHS, DEFAULT_BINARY_WIDTH } from './types';

export interface BinaryDraft {
  bits: BinaryWidth;
  decimal: string;
  binary: string;
  decimalOpen: boolean;
  binaryOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): BinaryDraft {
  return {
    bits: DEFAULT_BINARY_WIDTH,
    decimal: '',
    binary: '',
    decimalOpen: true,
    binaryOpen: true,
  };
}

export function emptyDraft(bits: BinaryWidth = DEFAULT_BINARY_WIDTH): BinaryDraft {
  return {
    bits,
    decimal: '',
    binary: '',
    decimalOpen: true,
    binaryOpen: true,
  };
}

interface BinaryFormProps {
  draft: BinaryDraft;
  errors: BinaryFieldErrors;
  binaryHint?: string;
  decimalResult: string | null;
  binaryResult: string | null;
  onDraftChange: (draft: BinaryDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4 | 5) => void;
  onCopyBinaryToInput?: () => void;
  onCopyDecimalToInput?: () => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
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
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
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
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">{children}</div>
      ) : null}
    </div>
  );
}

export function BinaryForm({
  draft,
  errors,
  binaryHint,
  decimalResult,
  binaryResult,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  onCopyBinaryToInput,
  onCopyDecimalToInput,
}: BinaryFormProps) {
  const set = (patch: Partial<BinaryDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Signed two&apos;s-complement integer conversion. Decimal→binary and binary→decimal are
        independent — editing one does not overwrite the other.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="bin-width" className={labelClass}>
          Binary number representation
        </label>
        <Select
          id="bin-width"
          value={String(draft.bits)}
          className="h-11 rounded-lg border-border bg-white text-sm"
          aria-describedby="bin-width-hint"
          onChange={(event) =>
            set({ bits: Number(event.target.value) as BinaryWidth })
          }
        >
          {BINARY_WIDTHS.map((width) => (
            <option key={width} value={width}>
              {width}-bit
            </option>
          ))}
        </Select>
        <p id="bin-width-hint" className="text-xs text-muted-foreground">
          Signed {draft.bits}-bit two&apos;s complement · range {formatRangeLabel(draft.bits)}.
        </p>
        {errors.bits ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.bits}
          </p>
        ) : null}
      </div>

      <AccordionSection
        title="Decimal to binary"
        open={draft.decimalOpen}
        onToggle={() => set({ decimalOpen: !draft.decimalOpen })}
      >
        <p className="text-xs text-muted-foreground">
          Convert a decimal integer into its fixed-width binary representation. Enter a decimal
          integer between {formatRangeLabel(draft.bits)} for signed {draft.bits}-bit mode.
        </p>
        <FieldShell label="Decimal" htmlFor="bin-decimal" error={errors.decimal}>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="bin-decimal"
              inputMode="numeric"
              className={inputClass}
              value={draft.decimal}
              placeholder="e.g. -5"
              aria-invalid={Boolean(errors.decimal)}
              onChange={(event) => set({ decimal: event.target.value })}
            />
          </div>
        </FieldShell>
        {binaryResult ? (
          <div className="rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Binary ({draft.bits}-bit)
            </p>
            <p className="mt-1 break-all font-mono text-sm font-semibold tabular-nums text-accent">
              {binaryResult}
            </p>
            {onCopyBinaryToInput ? (
              <button
                type="button"
                className="mt-2 text-xs text-primary underline-offset-2 hover:underline"
                onClick={onCopyBinaryToInput}
              >
                Use this binary in Binary to decimal
              </button>
            ) : null}
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection
        title="Binary to decimal"
        open={draft.binaryOpen}
        onToggle={() => set({ binaryOpen: !draft.binaryOpen })}
      >
        <p className="text-xs text-muted-foreground">
          Convert a binary number into its signed decimal integer equivalent. Enter a binary number
          using only the digits 0 and 1 — exactly {draft.bits} digits for this representation.
        </p>
        <FieldShell
          label="Binary"
          htmlFor="bin-binary"
          error={errors.binary}
          hint={!errors.binary ? binaryHint : undefined}
        >
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="bin-binary"
              inputMode="numeric"
              spellCheck={false}
              autoComplete="off"
              className={inputClass}
              value={draft.binary}
              placeholder={'0'.repeat(Math.min(draft.bits, 16)) + (draft.bits > 16 ? '…' : '')}
              aria-invalid={Boolean(errors.binary)}
              onChange={(event) => set({ binary: event.target.value })}
            />
          </div>
        </FieldShell>
        {decimalResult ? (
          <div className="rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Decimal (signed {draft.bits}-bit)
            </p>
            <p className="mt-1 break-all font-mono text-sm font-semibold tabular-nums text-accent">
              {decimalResult}
            </p>
            {onCopyDecimalToInput ? (
              <button
                type="button"
                className="mt-2 text-xs text-primary underline-offset-2 hover:underline"
                onClick={onCopyDecimalToInput}
              >
                Use this decimal in Decimal to binary
              </button>
            ) : null}
          </div>
        ) : null}
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, 'Decimal 5 → 00000101'],
              [2, 'Decimal −5 → 11111011'],
              [3, 'Binary 01111111 → 127'],
              [4, 'Binary 10000000 → −128'],
              [5, 'Decimal −1 → all ones'],
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
