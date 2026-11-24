'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CarboplatinForm } from './CarboplatinForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type CarboplatinFieldErrors,
  type CarboplatinInput,
  type CarboplatinResult,
} from './types';
import { validateCarboplatinInput } from './validation';

export function CarboplatinCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(initial);
  const [input, setInput] = React.useState(initial);
  const [errors, setErrors] = React.useState<CarboplatinFieldErrors>({});
  const [result, setResult] = React.useState<CarboplatinResult | null>(() =>
    validateCarboplatinInput(initial).result,
  );

  const apply = (next: CarboplatinInput) => {
    const v = validateCarboplatinInput(next);
    setInput(next);
    setErrors(v.errors);
    setResult(v.result);
  };

  const reload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateCarboplatinInput(fresh).result);
  };

  const clear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateCarboplatinInput(fresh).result);
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
        <CarboplatinForm input={input} errors={errors} result={result} onChange={apply} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyTextToClipboard(pageUrl)}
            className="rounded-xl border px-4 py-2 text-xs font-semibold"
          >
            Share result
          </button>
          <button type="button" onClick={reload} className="rounded-xl border px-4 py-2 text-xs font-semibold">
            Reload calculator
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={clear}
            className="rounded-xl border px-4 py-2 text-xs font-semibold disabled:opacity-40"
          >
            Clear all changes
          </button>
        </div>
      </div>
    </section>
  );
}