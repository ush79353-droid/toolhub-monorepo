'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { BenzodiazepineConversionForm } from './BenzodiazepineConversionForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type BenzodiazepineConversionInput,
  type BenzodiazepineConversionResult,
  type BenzodiazepineFieldErrors,
} from './types';
import { validateBenzodiazepineConversionInput } from './validation';

export function BenzodiazepineConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [input, setInput] = React.useState(initial);
  const [errors, setErrors] = React.useState<BenzodiazepineFieldErrors>({});
  const [result, setResult] = React.useState<BenzodiazepineConversionResult | null>(() =>
    validateBenzodiazepineConversionInput(initial).result,
  );

  const apply = (next: BenzodiazepineConversionInput) => {
    const v = validateBenzodiazepineConversionInput(next);
    setInput(next);
    setErrors(v.errors);
    setResult(v.result);
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
        <p className="text-xs text-muted-foreground">
          Approximate benzodiazepine dose equivalents by duration class.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <BenzodiazepineConversionForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="text-xs font-semibold text-accent underline"
            onClick={() => apply(createDefaultInput())}
          >
            Reload calculator
          </button>
          <button
            type="button"
            className="text-xs font-semibold text-muted-foreground underline"
            onClick={() => apply(createEmptyInput())}
            disabled={inputsEqual(input, createEmptyInput())}
          >
            Clear all changes
          </button>
        </div>
      </div>
    </section>
  );
}