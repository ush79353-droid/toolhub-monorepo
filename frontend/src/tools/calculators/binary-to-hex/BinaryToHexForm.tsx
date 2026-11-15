'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BinaryConversionResult, BinaryHexFieldErrors, HexToBinaryResult } from './types';
import { MAX_BINARY_INPUT_LENGTH, MAX_HEX_INPUT_LENGTH } from './types';

export interface BinaryToHexDraft {
  binary: string;
  hex: string;
  stepsOpen: boolean;
  reverseOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): BinaryToHexDraft {
  return {
    binary: '',
    hex: '',
    stepsOpen: false,
    reverseOpen: false,
  };
}

export function emptyDraft(): BinaryToHexDraft {
  return defaultDraft();
}

interface BinaryToHexFormProps {
  draft: BinaryToHexDraft;
  errors: BinaryHexFieldErrors;
  forward: BinaryConversionResult | null;
  reverse: HexToBinaryResult | null;
  onDraftChange: (draft: BinaryToHexDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4 | 5) => void;
  children?: ReactNode;
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

export function BinaryToHexForm({
  draft,
  errors,
  forward,
  reverse,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: BinaryToHexFormProps) {
  const set = (patch: Partial<BinaryToHexDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert base-2 integers to hexadecimal by grouping bits in fours. Also shows decimal and
        octal. Large values use precision-safe integer arithmetic (no floating-point).
      </div>

      <div className="space-y-1.5">
        <label htmlFor="b2h-binary" className={labelClass}>
          Binary (Base 2)
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="b2h-binary"
            inputMode="numeric"
            spellCheck={false}
            autoComplete="off"
            className={inputClass}
            value={draft.binary}
            maxLength={MAX_BINARY_INPUT_LENGTH}
            placeholder="Enter binary number: 10110110"
            aria-invalid={Boolean(errors.binary)}
            aria-describedby="b2h-binary-hint"
            onChange={(event) => set({ binary: event.target.value })}
          />
        </div>
        <p id="b2h-binary-hint" className="text-xs text-muted-foreground">
          Digits 0 and 1 only. Max {MAX_BINARY_INPUT_LENGTH} bits.
        </p>
        {errors.binary ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.binary}
          </p>
        ) : null}
      </div>

      {children}

      <AccordionSection
        title="Show conversion steps"
        open={draft.stepsOpen}
        onToggle={() => set({ stepsOpen: !draft.stepsOpen })}
      >
        {forward ? (
          <div className="space-y-3">
            <ol className="list-decimal space-y-1.5 ps-5 text-sm text-foreground/85">
              <li>
                Group from the right into 4-bit nibbles, then pad the left group:{' '}
                <span className="font-mono tabular-nums text-accent">
                  {forward.paddedBinary.match(/.{1,4}/g)?.join(' ')}
                </span>
              </li>
              <li>Convert each nibble with the binary→hex map.</li>
              <li>
                Combine digits and drop leading zeros:{' '}
                <span className="font-mono font-semibold text-accent">
                  {forward.hexadecimal}
                </span>
              </li>
            </ol>
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[220px] text-left text-sm">
                <caption className="sr-only">Binary group to hexadecimal digit</caption>
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Binary group
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Hexadecimal digit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {forward.steps.map((step) => (
                    <tr
                      key={`${step.binaryGroup}-${step.hexadecimalDigit}`}
                      className="border-t border-border"
                    >
                      <td className="px-3 py-2 font-mono tabular-nums text-accent">
                        {step.binaryGroup}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums text-accent">
                        {step.hexadecimalDigit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter a valid binary value to see the four-bit grouping steps.
          </p>
        )}
      </AccordionSection>

      <AccordionSection
        title="Reverse: hexadecimal to binary"
        open={draft.reverseOpen}
        onToggle={() => set({ reverseOpen: !draft.reverseOpen })}
      >
        <div className="space-y-1.5">
          <label htmlFor="b2h-hex" className={labelClass}>
            Hexadecimal (Base 16)
          </label>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="b2h-hex"
              inputMode="text"
              spellCheck={false}
              autoComplete="off"
              className={inputClass}
              value={draft.hex}
              maxLength={MAX_HEX_INPUT_LENGTH}
              placeholder="e.g. B6 or 2AF"
              aria-invalid={Boolean(errors.hex)}
              onChange={(event) => set({ hex: event.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Digits 0–9 and A–F (case-insensitive). Independent of the binary field above.
          </p>
          {errors.hex ? (
            <p className="text-xs text-red-600" role="alert">
              {errors.hex}
            </p>
          ) : null}
        </div>
        {reverse ? (
          <div className="space-y-2 rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Binary result
            </p>
            <p className="break-all font-mono text-sm font-semibold tabular-nums text-accent">
              {reverse.binary}
            </p>
            <p className="text-xs text-muted-foreground">
              Nibbles:{' '}
              <span className="font-mono tabular-nums text-accent">{reverse.binaryGrouped}</span>
            </p>
          </div>
        ) : null}
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '10110110 → B6'],
              [2, '110101 → 35'],
              [3, '11111111 → FF'],
              [4, '110101101 → 1AD'],
              [5, 'Hex 2AF → binary'],
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
