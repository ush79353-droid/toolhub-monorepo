'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  BinaryToHexResult,
  DecimalToHexResult,
  HexFieldErrors,
  HexToBothResult,
} from './types';

export interface HexadecimalDraft {
  decimal: string;
  binary: string;
  hex: string;
  decimalOpen: boolean;
  binaryOpen: boolean;
  hexOpen: boolean;
  decimalStepsOpen: boolean;
  binaryStepsOpen: boolean;
  hexStepsOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): HexadecimalDraft {
  return {
    decimal: '',
    binary: '',
    hex: '',
    decimalOpen: true,
    binaryOpen: true,
    hexOpen: true,
    decimalStepsOpen: false,
    binaryStepsOpen: false,
    hexStepsOpen: false,
  };
}

export function emptyDraft(): HexadecimalDraft {
  return defaultDraft();
}

interface HexadecimalFormProps {
  draft: HexadecimalDraft;
  errors: HexFieldErrors;
  decimalResult: DecimalToHexResult | null;
  binaryResult: BinaryToHexResult | null;
  hexResult: HexToBothResult | null;
  onDraftChange: (draft: HexadecimalDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4 | 5) => void;
  children?: ReactNode;
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

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border/60 py-1.5 first:border-t-0 first:pt-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="break-all font-mono text-sm font-semibold tabular-nums text-accent">
        {value}
      </span>
    </div>
  );
}

function StepsToggle({
  open,
  onToggle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>Show conversion steps</span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open ? <div className="space-y-2 border-t border-border px-3 py-2.5 text-xs">{children}</div> : null}
    </div>
  );
}

export function HexadecimalForm({
  draft,
  errors,
  decimalResult,
  binaryResult,
  hexResult,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: HexadecimalFormProps) {
  const set = (patch: Partial<HexadecimalDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Three independent converters: decimal→hex, binary→hex, and hex→decimal/binary. Editing one
        section does not overwrite the others. Non-negative integers only.
      </div>

      <AccordionSection
        title="Decimal to hexadecimal"
        open={draft.decimalOpen}
        onToggle={() => set({ decimalOpen: !draft.decimalOpen })}
      >
        <FieldShell label="Decimal number" htmlFor="hex-decimal" error={errors.decimal}>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hex-decimal"
              inputMode="numeric"
              autoComplete="off"
              className={inputClass}
              value={draft.decimal}
              placeholder="e.g. 255"
              aria-invalid={Boolean(errors.decimal)}
              onChange={(event) => set({ decimal: event.target.value })}
            />
          </div>
        </FieldShell>
        {decimalResult ? (
          <div className="rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2.5">
            <ResultRow label="Decimal" value={decimalResult.decimal} />
            <ResultRow label="Hexadecimal" value={decimalResult.hexadecimal} />
          </div>
        ) : null}
        {decimalResult ? (
          <StepsToggle
            open={draft.decimalStepsOpen}
            onToggle={() => set({ decimalStepsOpen: !draft.decimalStepsOpen })}
          >
            <p className="text-muted-foreground">
              Repeated division by 16 (remainders read bottom → top for the final digits):
            </p>
            <ul className="space-y-1 font-mono tabular-nums text-accent">
              {decimalResult.divisionSteps.map((step) => (
                <li key={`${step.dividend}-${step.remainder}`}>
                  {step.dividend} ÷ 16 = {step.quotient} rem {step.remainder} ({step.hexDigit})
                </li>
              ))}
            </ul>
            <p className="font-mono text-accent">
              {decimalResult.decimal}
              <sub className="font-sans">₁₀</sub> = {decimalResult.hexadecimal}
              <sub className="font-sans">₁₆</sub>
            </p>
          </StepsToggle>
        ) : null}
      </AccordionSection>

      <AccordionSection
        title="Binary to hexadecimal"
        open={draft.binaryOpen}
        onToggle={() => set({ binaryOpen: !draft.binaryOpen })}
      >
        <FieldShell label="Binary number" htmlFor="hex-binary" error={errors.binary}>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hex-binary"
              inputMode="numeric"
              spellCheck={false}
              autoComplete="off"
              className={inputClass}
              value={draft.binary}
              placeholder="e.g. 11010110"
              aria-invalid={Boolean(errors.binary)}
              onChange={(event) => set({ binary: event.target.value })}
            />
          </div>
        </FieldShell>
        {binaryResult ? (
          <div className="rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2.5">
            <ResultRow label="Binary" value={binaryResult.binaryNormalized} />
            <ResultRow label="Hexadecimal" value={binaryResult.hexadecimal} />
          </div>
        ) : null}
        {binaryResult ? (
          <StepsToggle
            open={draft.binaryStepsOpen}
            onToggle={() => set({ binaryStepsOpen: !draft.binaryStepsOpen })}
          >
            <p className="text-muted-foreground">
              Four-bit groups (padded left if needed): {binaryResult.paddedBinary.replace(/(.{4})/g, '$1 ').trim()}
            </p>
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full text-left">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Binary</th>
                    <th className="px-2 py-1.5 font-medium">Hex</th>
                  </tr>
                </thead>
                <tbody>
                  {binaryResult.steps.map((step) => (
                    <tr key={step.inputGroup} className="border-t border-border font-mono">
                      <td className="px-2 py-1.5">{step.inputGroup}</td>
                      <td className="px-2 py-1.5">{step.outputGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-mono text-accent">
              {binaryResult.binaryNormalized}
              <sub className="font-sans">₂</sub> = {binaryResult.hexadecimal}
              <sub className="font-sans">₁₆</sub>
            </p>
          </StepsToggle>
        ) : null}
      </AccordionSection>

      <AccordionSection
        title="Hexadecimal to decimal/binary"
        open={draft.hexOpen}
        onToggle={() => set({ hexOpen: !draft.hexOpen })}
      >
        <FieldShell label="Hexadecimal number" htmlFor="hex-hex" error={errors.hex}>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hex-hex"
              spellCheck={false}
              autoComplete="off"
              className={inputClass}
              value={draft.hex}
              placeholder="e.g. 1A3F"
              aria-invalid={Boolean(errors.hex)}
              onChange={(event) => set({ hex: event.target.value })}
            />
          </div>
        </FieldShell>
        {hexResult ? (
          <div className="rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2.5">
            <ResultRow label="Hexadecimal" value={hexResult.hexadecimalNormalized} />
            <ResultRow label="Binary" value={hexResult.binary} />
            <ResultRow label="Decimal" value={hexResult.decimal} />
          </div>
        ) : null}
        {hexResult ? (
          <StepsToggle
            open={draft.hexStepsOpen}
            onToggle={() => set({ hexStepsOpen: !draft.hexStepsOpen })}
          >
            <p className="font-medium text-accent">Positional (base 16)</p>
            <ul className="space-y-1 font-mono tabular-nums text-accent">
              {hexResult.positionalSteps.map((step) => (
                <li key={`${step.digit}-${step.power}`}>
                  {step.digit} × 16^{step.power} = {step.contribution}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">Sum = {hexResult.decimal}</p>
            <p className="font-medium text-accent">Nibble → binary</p>
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full text-left">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Hex</th>
                    <th className="px-2 py-1.5 font-medium">Binary</th>
                  </tr>
                </thead>
                <tbody>
                  {hexResult.nibbleSteps.map((step) => (
                    <tr key={`${step.inputGroup}-${step.outputGroup}`} className="border-t border-border font-mono">
                      <td className="px-2 py-1.5">{step.inputGroup}</td>
                      <td className="px-2 py-1.5">{step.outputGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-mono text-accent">
              {hexResult.hexadecimalNormalized}
              <sub className="font-sans">₁₆</sub> = {hexResult.decimal}
              <sub className="font-sans">₁₀</sub> = {hexResult.binary}
              <sub className="font-sans">₂</sub>
            </p>
          </StepsToggle>
        ) : null}
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, 'Decimal 255 → FF'],
              [2, 'Binary 11010110 → D6'],
              [3, 'Hex 1A3F → 6719 / 1101000111111'],
              [4, 'Decimal 100 → 64'],
              [5, 'Hex FF → 255 / 11111111'],
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

      {children}
    </form>
  );
}
