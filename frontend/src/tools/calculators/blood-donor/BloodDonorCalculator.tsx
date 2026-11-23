'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { BloodDonorForm } from './BloodDonorForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type BloodDonorFieldErrors,
  type BloodDonorInput,
  type BloodDonorResult,
} from './types';
import { validateBloodDonorInput } from './validation';

export function BloodDonorCalculator({
  metadata,
  className = '',
  presentation = 'default',
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(initial);
  const [input, setInput] = React.useState(initial);
  const [errors, setErrors] = React.useState<BloodDonorFieldErrors>({});
  const [result, setResult] = React.useState<BloodDonorResult | null>(() =>
    validateBloodDonorInput(initial).result,
  );

  const apply = (next: BloodDonorInput) => {
    const v = validateBloodDonorInput(next);
    setInput(next);
    setErrors(v.errors);
    setResult(v.result);
  };

  const dirty = !inputsEqual(input, baseline);

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
          ABO/Rh donor and recipient compatibility.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <BloodDonorForm input={input} errors={errors} result={result} onChange={apply} />
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="text-xs font-semibold text-accent underline"
            onClick={() => {
              const fresh = createDefaultInput();
              setInput(fresh);
              setBaseline(fresh);
              setResult(validateBloodDonorInput(fresh).result);
            }}
          >
            Reload calculator
          </button>
          <button
            type="button"
            className="text-xs font-semibold text-muted-foreground underline disabled:opacity-40"
            disabled={!dirty}
            onClick={() => apply(createEmptyInput())}
          >
            Clear all changes
          </button>
        </div>
      </div>
    </section>
  );
}