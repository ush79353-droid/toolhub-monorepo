'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  BinaryOctalFieldErrors,
  BinaryOctalResult,
  ConversionDirection,
} from './types';
import { MAX_BINARY_OCTAL_INPUT_LENGTH } from './types';

export interface BinaryToOctalDraft {
  direction: ConversionDirection;
  input: string;
  stepsOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): BinaryToOctalDraft {
  return {
    direction: 'binary-to-octal',
    input: '',
    stepsOpen: false,
  };
}

export function emptyDraft(): BinaryToOctalDraft {
  return defaultDraft();
}

interface BinaryToOctalFormProps {
  draft: BinaryToOctalDraft;
  errors: BinaryOctalFieldErrors;
  result: BinaryOctalResult | null;
  onDraftChange: (draft: BinaryToOctalDraft) => void;
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

export function BinaryToOctalForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: BinaryToOctalFormProps) {
  const set = (patch: Partial<BinaryToOctalDraft>) =>
    onDraftChange({ ...draft, ...patch });

  const isBinaryMode = draft.direction === 'binary-to-octal';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert between base-2 and base-8 using exact three-bit groups (because 8 = 2³). Large
 integers use direct triad lookup; no floating-point precision loss.
      </div>

      <fieldset>
        <legend className={labelClass}>Convert…</legend>
        <div className="mt-2 space-y-2">
          {(
            [
              ['binary-to-octal', 'Binary to octal'],
              ['octal-to-binary', 'Octal to binary'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={radioClass(draft.direction === value)}>
              <input
                type="radio"
                name="b2o-direction"
                checked={draft.direction === value}
                onChange={() => set({ direction: value, input: '' })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="b2o-input" className={labelClass}>
          {isBinaryMode ? 'Binary input' : 'Octal input'}
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="b2o-input"
            inputMode="numeric"
            spellCheck={false}
            autoComplete="off"
            className={inputClass}
            value={draft.input}
            maxLength={MAX_BINARY_OCTAL_INPUT_LENGTH}
            placeholder={isBinaryMode ? 'e.g. 11010110' : 'e.g. 326'}
            aria-invalid={Boolean(errors.input)}
            aria-describedby="b2o-input-hint"
            onChange={(event) => set({ input: event.target.value })}
          />
        </div>
        <p id="b2o-input-hint" className="text-xs text-muted-foreground">
          {isBinaryMode
            ? 'Digits 0 and 1 only. Non-negative integers.'
            : 'Digits 0–7 only. Non-negative integers.'}
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
          <div className="space-y-3">
            <ol className="list-decimal space-y-1.5 ps-5 text-sm text-foreground/85">
              {isBinaryMode ? (
                <>
                  <li>
                    Group bits from the right into threes, pad left if needed:{' '}
                    <span className="font-mono tabular-nums text-accent">
                      {result.paddedInput.match(/.{1,3}/g)?.join(' ')}
                    </span>
                  </li>
                  <li>Convert each triad with the binary→octal map.</li>
                  <li>
                    Combine digits and drop leading zeros:{' '}
                    <span className="font-mono font-semibold text-accent">{result.output}</span>
                  </li>
                </>
              ) : (
                <>
                  <li>Replace each octal digit with its three-bit binary group.</li>
                  <li>
                    Combine groups:{' '}
                    <span className="font-mono tabular-nums text-accent">
                      {result.steps.map((s) => s.outputGroup).join('')}
                    </span>
                  </li>
                  <li>
                    Remove unnecessary leading zeros:{' '}
                    <span className="font-mono font-semibold text-accent">{result.output}</span>
                  </li>
                </>
              )}
            </ol>
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[220px] text-left text-sm">
                <caption className="sr-only">Conversion step groups</caption>
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">
                      {isBinaryMode ? 'Binary group' : 'Octal digit'}
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      {isBinaryMode ? 'Octal digit' : 'Binary group'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step) => (
                    <tr
                      key={`${step.inputGroup}-${step.outputGroup}`}
                      className="border-t border-border"
                    >
                      <td className="px-3 py-2 font-mono tabular-nums text-accent">
                        {step.inputGroup}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums text-accent">
                        {step.outputGroup}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter a valid value to see the three-bit grouping steps.
          </p>
        )}
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '11010110 → 326'],
              [2, '1010 → 12'],
              [3, '111111111 → 777'],
              [4, 'Octal 472 → binary'],
              [5, 'Octal 10 → binary'],
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
