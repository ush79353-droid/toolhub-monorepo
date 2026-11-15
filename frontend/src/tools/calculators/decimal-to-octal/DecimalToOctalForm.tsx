'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  ConversionDirection,
  DecimalOctalFieldErrors,
  DecimalOctalResult,
} from './types';
import { MAX_INPUT_LENGTH } from './types';

export interface DecimalToOctalDraft {
  direction: ConversionDirection;
  input: string;
  stepsOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): DecimalToOctalDraft {
  return {
    direction: 'decimal-to-octal',
    input: '',
    stepsOpen: false,
  };
}

export function emptyDraft(): DecimalToOctalDraft {
  return defaultDraft();
}

interface DecimalToOctalFormProps {
  draft: DecimalToOctalDraft;
  errors: DecimalOctalFieldErrors;
  result: DecimalOctalResult | null;
  onDraftChange: (draft: DecimalToOctalDraft) => void;
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

export function DecimalToOctalForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: DecimalToOctalFormProps) {
  const set = (patch: Partial<DecimalToOctalDraft>) => onDraftChange({ ...draft, ...patch });
  const isDecimalMode = draft.direction === 'decimal-to-octal';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert between base-10 (decimal) and base-8 (octal) using exact BigInt arithmetic.
        Non-negative whole numbers only — octal digits are 0–7.
      </div>

      <fieldset>
        <legend className={labelClass}>Conversion Direction</legend>
        <div className="mt-2 space-y-2">
          {(
            [
              ['decimal-to-octal', 'Decimal to Octal'],
              ['octal-to-decimal', 'Octal to Decimal'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={radioClass(draft.direction === value)}>
              <input
                type="radio"
                name="d2o-direction"
                checked={draft.direction === value}
                onChange={() => set({ direction: value, input: '' })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="d2o-input" className={labelClass}>
          {isDecimalMode ? 'Decimal Number' : 'Octal Number'}
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="d2o-input"
            inputMode="numeric"
            spellCheck={false}
            autoComplete="off"
            className={inputClass}
            value={draft.input}
            maxLength={MAX_INPUT_LENGTH}
            placeholder={isDecimalMode ? 'e.g. 125' : 'e.g. 175'}
            aria-invalid={Boolean(errors.input)}
            aria-describedby="d2o-input-hint"
            onChange={(event) => set({ input: event.target.value })}
          />
        </div>
        <p id="d2o-input-hint" className="text-xs text-muted-foreground">
          {isDecimalMode
            ? 'Non-negative whole number (digits 0–9).'
            : 'Octal digits 0–7 only.'}
        </p>
        {errors.input ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.input}
          </p>
        ) : null}
      </div>

      {children}

      <AccordionSection
        title="Show calculation steps"
        open={draft.stepsOpen}
        onToggle={() => set({ stepsOpen: !draft.stepsOpen })}
      >
        {result ? (
          <div className="space-y-3 text-sm text-foreground/85">
            {result.divisionSteps ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Repeated division by 8 (remainders read bottom → top):
                </p>
                <ul className="space-y-1 font-mono text-xs tabular-nums text-accent">
                  {result.divisionSteps.map((step) => (
                    <li key={`${step.dividend}-${step.remainder}`}>
                      {step.dividend} ÷ 8 = {step.quotient} remainder {step.remainder}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {result.positionalSteps ? (
              <>
                <p className="text-xs text-muted-foreground">Positional base-8 expansion:</p>
                <ul className="space-y-1 font-mono text-xs tabular-nums text-accent">
                  {result.positionalSteps.map((step) => (
                    <li key={`${step.digit}-${step.power}`}>
                      {step.digit} × 8^{step.power} = {step.contribution}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {result.stepsTruncated ? (
              <p className="text-xs text-muted-foreground">
                Step list truncated for long inputs; the final result remains exact.
              </p>
            ) : null}
            <p className="font-mono font-semibold text-accent">{result.formula}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a value to see calculation steps.</p>
        )}
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '125 → 175'],
              [2, '255 → 377'],
              [3, '175₈ → 125'],
              [4, '2026 → 3752'],
              [5, '1000₈ → 512'],
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
