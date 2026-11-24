'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CarbohydrateCalculatorForm } from './CarbohydrateCalculatorForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type CarbohydrateCalculatorFieldErrors,
  type CarbohydrateCalculatorInput,
  type CarbohydrateCalculatorResult,
} from './types';
import { validateCarbohydrateCalculatorInput } from './validation';

export function CarbohydrateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState(defaults);
  const [input, setInput] = React.useState(defaults);
  const [errors, setErrors] = React.useState<CarbohydrateCalculatorFieldErrors>({});
  const [result, setResult] = React.useState<CarbohydrateCalculatorResult | null>(null);

  const handleChange = (next: CarbohydrateCalculatorInput) => {
    setInput(next);
    setErrors({});
    setResult(null);
  };

  const handleCalculate = () => {
    const submitted = { ...input, isSubmitted: true };
    setInput(submitted);
    const validation = validateCarbohydrateCalculatorInput(submitted);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
  };

  const handleClear = () => {
    setInput(createEmptyInput());
    setErrors({});
    setResult(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
        {headerActions}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CarbohydrateCalculatorForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCalculate={handleCalculate}
          onClear={handleClear}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyTextToClipboard(pageUrl)}
            className="rounded-xl border px-4 py-2 text-xs font-semibold"
          >
            Share result
          </button>
          <button type="button" onClick={handleReload} className="rounded-xl border px-4 py-2 text-xs font-semibold">
            Reload calculator
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={handleClear}
            className="rounded-xl border px-4 py-2 text-xs font-semibold disabled:opacity-40"
          >
            Clear all changes
          </button>
        </div>
      </div>
    </section>
  );
}