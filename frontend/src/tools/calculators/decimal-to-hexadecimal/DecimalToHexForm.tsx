'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  ConversionDirection,
  DecimalHexFieldErrors,
  DecimalHexResult,
  HexRepresentation,
} from './types';
import { INT16_MAX, INT16_MIN, MAX_DECIMAL_INPUT_LENGTH, MAX_HEX_INPUT_LENGTH } from './types';

export interface DecimalToHexDraft {
  direction: ConversionDirection;
  representation: HexRepresentation;
  fixedWidth: boolean;
  input: string;
  stepsOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): DecimalToHexDraft {
  return {
    direction: 'decimal-to-hex',
    representation: 'unsigned',
    fixedWidth: false,
    input: '',
    stepsOpen: false,
  };
}

export function emptyDraft(): DecimalToHexDraft {
  return defaultDraft();
}

interface DecimalToHexFormProps {
  draft: DecimalToHexDraft;
  errors: DecimalHexFieldErrors;
  result: DecimalHexResult | null;
  onDraftChange: (draft: DecimalToHexDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4 | 5) => void;
  children?: ReactNode;
}

function radioClass(selected: boolean): string {
  return `flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
    selected ? 'border-primary bg-primary/5 text-accent' : 'border-border'
  }`;
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

export function DecimalToHexForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: DecimalToHexFormProps) {
  const set = (patch: Partial<DecimalToHexDraft>) => onDraftChange({ ...draft, ...patch });
  const isDecimalMode = draft.direction === 'decimal-to-hex';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        You can enter a decimal number between {INT16_MIN.toLocaleString('en-US')} and{' '}
        {INT16_MAX.toLocaleString('en-US')}. Negative values use 16-bit two&apos;s-complement hex
        (four digits). Positive values use minimal hex unless fixed-width is enabled.
      </div>

      <fieldset>
        <legend className={labelClass}>Convert…</legend>
        <div className="mt-2 space-y-2">
          {(
            [
              ['decimal-to-hex', 'Decimal to hexadecimal'],
              ['hex-to-decimal', 'Hexadecimal to decimal'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={radioClass(draft.direction === value)}>
              <input
                type="radio"
                name="d2h-direction"
                checked={draft.direction === value}
                onChange={() =>
                  set({
                    direction: value,
                    input: '',
                    representation: value === 'hex-to-decimal' ? draft.representation : 'unsigned',
                  })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="d2h-input" className={labelClass}>
          {isDecimalMode ? 'Decimal' : 'Hexadecimal'}
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="d2h-input"
            inputMode={isDecimalMode ? 'numeric' : 'text'}
            spellCheck={false}
            autoComplete="off"
            className={inputClass}
            value={draft.input}
            maxLength={isDecimalMode ? MAX_DECIMAL_INPUT_LENGTH : MAX_HEX_INPUT_LENGTH}
            placeholder={isDecimalMode ? 'e.g. 255' : 'e.g. FF'}
            aria-invalid={Boolean(errors.input)}
            aria-describedby="d2h-input-hint"
            onChange={(event) => set({ input: event.target.value })}
          />
        </div>
        <p id="d2h-input-hint" className="text-xs text-muted-foreground">
          {isDecimalMode
            ? `Signed 16-bit range: ${INT16_MIN} … ${INT16_MAX}.`
            : 'Digits 0–9 and A–F (case-insensitive).'}
        </p>
        {errors.input ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.input}
          </p>
        ) : null}
      </div>

      {isDecimalMode ? (
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={draft.fixedWidth}
            onChange={(event) => set({ fixedWidth: event.target.checked })}
          />
          <span>
            <span className="font-medium">Fixed-width 16-bit hex (4 digits)</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Pads positive results (255 → 00FF). Negatives are always four digits.
            </span>
          </span>
        </label>
      ) : (
        <fieldset>
          <legend className={labelClass}>Representation</legend>
          <div className="mt-2 space-y-2">
            {(
              [
                ['unsigned', 'Unsigned hexadecimal'],
                ['signed-16', 'Signed 16-bit hexadecimal'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className={radioClass(draft.representation === value)}>
                <input
                  type="radio"
                  name="d2h-repr"
                  checked={draft.representation === value}
                  onChange={() => set({ representation: value })}
                />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Example: FFFF is 65535 unsigned, or −1 as signed 16-bit.
          </p>
        </fieldset>
      )}

      {children}

      <AccordionSection
        title="Show conversion steps"
        open={draft.stepsOpen}
        onToggle={() => set({ stepsOpen: !draft.stepsOpen })}
      >
        {result ? (
          <div className="space-y-3 text-sm text-foreground/85">
            {result.signedNote ? (
              <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                {result.signedNote}
              </p>
            ) : null}
            {result.divisionSteps ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Repeated division by 16 (remainders read last→first for the hex digits):
                </p>
                <ul className="space-y-1 font-mono text-xs tabular-nums text-accent">
                  {result.divisionSteps.map((step) => (
                    <li key={`${step.dividend}-${step.remainder}`}>
                      {step.dividend} ÷ 16 = {step.quotient} rem {step.remainder} ({step.hexDigit})
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {result.positionalSteps ? (
              <>
                <p className="text-xs text-muted-foreground">Positional base-16 sum:</p>
                <ul className="space-y-1 font-mono text-xs tabular-nums text-accent">
                  {result.positionalSteps.map((step) => (
                    <li key={`${step.digit}-${step.power}`}>
                      {step.digit} × 16^{step.power} = {step.contribution}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="font-mono font-semibold text-accent">{result.formula}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a value to see conversion steps.</p>
        )}
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, 'Decimal 255 → FF'],
              [2, 'Decimal −10 → FFF6'],
              [3, 'Hex FF → 255'],
              [4, 'Hex FFFF signed → −1'],
              [5, 'Decimal 123 → 7B'],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                className="text-left text-primary underline-offset-2 hover:underline"
                onClick={() => onApplyExample(id)}
              >
 Example {id}; {label}
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
