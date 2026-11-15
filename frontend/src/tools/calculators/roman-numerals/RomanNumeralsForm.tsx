'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConversionDirection, RomanFieldErrors, RomanResult } from './types';
import { MAX_ARABIC, MAX_INPUT_LENGTH, MIN_ARABIC } from './types';

export interface RomanNumeralsDraft {
  direction: ConversionDirection;
  input: string;
  stepsOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): RomanNumeralsDraft {
  return {
    direction: 'arabic-to-roman',
    input: '',
    stepsOpen: false,
  };
}

export function emptyDraft(): RomanNumeralsDraft {
  return defaultDraft();
}

interface RomanNumeralsFormProps {
  draft: RomanNumeralsDraft;
  errors: RomanFieldErrors;
  result: RomanResult | null;
  onDraftChange: (draft: RomanNumeralsDraft) => void;
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

export function RomanNumeralsForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: RomanNumeralsFormProps) {
  const set = (patch: Partial<RomanNumeralsDraft>) => onDraftChange({ ...draft, ...patch });
  const isArabicMode = draft.direction === 'arabic-to-roman';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert between Arabic numbers and standard Roman numerals ({MIN_ARABIC}–{MAX_ARABIC}).
        Additive and subtractive notation only — no zero, negatives, or overline extensions.
      </div>

      <fieldset>
        <legend className={labelClass}>Conversion direction</legend>
        <div className="mt-2 space-y-2">
          {(
            [
              ['arabic-to-roman', 'Arabic numbers to Roman numerals'],
              ['roman-to-arabic', 'Roman numerals to Arabic numbers'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={radioClass(draft.direction === value)}>
              <input
                type="radio"
                name="roman-direction"
                checked={draft.direction === value}
                onChange={() => set({ direction: value, input: '' })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="roman-input" className={labelClass}>
          {isArabicMode ? 'Number' : 'Roman Numeral'}
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="roman-input"
            inputMode={isArabicMode ? 'numeric' : 'text'}
            spellCheck={false}
            autoComplete="off"
            className={inputClass}
            value={draft.input}
            maxLength={MAX_INPUT_LENGTH}
            placeholder={isArabicMode ? 'e.g. 2026' : 'e.g. MMXXVI'}
            aria-invalid={Boolean(errors.input)}
            aria-describedby="roman-input-hint"
            onChange={(event) => set({ input: event.target.value })}
          />
        </div>
        <p id="roman-input-hint" className="text-xs text-muted-foreground">
          {isArabicMode
            ? `Whole number from ${MIN_ARABIC} to ${MAX_ARABIC}.`
            : 'Symbols I, V, X, L, C, D, M — uppercase or lowercase.'}
        </p>
        {errors.input ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.input}
          </p>
        ) : null}
      </div>

      {children}

      <AccordionSection
        title="Show conversion steps"
        open={draft.stepsOpen}
        onToggle={() => set({ stepsOpen: !draft.stepsOpen })}
      >
        {result ? (
          <div className="space-y-3 text-sm text-foreground/85">
            <ul className="space-y-1 font-mono text-xs tabular-nums text-accent">
              {result.steps.map((step, index) => (
                <li key={`${step.symbol}-${index}`}>
                  {isArabicMode
                    ? `${step.count} × ${step.value} = ${step.symbol.repeat(step.count)}`
                    : `${step.symbol} = ${step.value}`}
                </li>
              ))}
            </ul>
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
              [1, '2026 → MMXXVI'],
              [2, '1994 → MCMXCIV'],
              [3, 'XLIX → 49'],
              [4, '1987 → MCMLXXXVII'],
              [5, 'MMMCMXCIX → 3999'],
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
