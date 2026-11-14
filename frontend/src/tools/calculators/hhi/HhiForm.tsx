'use client';

import type { ReactNode } from 'react';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MAX_FIRMS, MIN_FIRMS, type HhiFieldErrors, type HhiInput, type HhiResult } from './types';

interface HhiFormProps {
  input: HhiInput;
  errors: HhiFieldErrors;
  result: HhiResult | null;
  onChange: (input: HhiInput) => void;
  onReset: () => void;
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 pr-8 text-sm tabular-nums text-accent outline-none';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

export function HhiForm({ input, errors, result, onChange, onReset }: HhiFormProps) {
  const setShare = (index: number, value: string) => {
    const shares = input.shares.map((share, i) => (i === index ? value : share));
    onChange({ shares });
  };

  const addFirm = () => {
    if (input.shares.length >= MAX_FIRMS) return;
    onChange({ shares: [...input.shares, ''] });
  };

  const removeFirm = (index: number) => {
    if (input.shares.length <= MIN_FIRMS) return;
    onChange({ shares: input.shares.filter((_, i) => i !== index) });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-4">
        <h3 className="text-sm font-semibold text-accent">Market shares (up to 15 numbers)</h3>

        {input.shares.map((share, index) => {
          const fieldError = errors.shares?.[index];
          const id = `hhi-firm-${index + 1}`;
          return (
            <div key={id}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className={labelClass} htmlFor={id}>
                  <span>{`Firm ${index + 1}`}</span>
                  {index === 0 ? (
                    <InfoTooltip
                      label="Market share"
                      text="Enter each firm’s market share as a percentage (0–100). Blank rows are skipped. Combined shares cannot exceed 100%."
                    />
                  ) : null}
                </label>
                {input.shares.length > MIN_FIRMS ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2 text-muted-foreground"
                    aria-label={`Remove Firm ${index + 1}`}
                    onClick={() => removeFirm(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              <FieldShell error={fieldError}>
                <input
                  id={id}
                  className={inputClass}
                  inputMode="decimal"
                  value={share}
                  aria-invalid={Boolean(fieldError)}
                  onChange={(event) => setShare(index, event.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {fieldError ? <p className="mt-1 text-xs text-rose-600">{fieldError}</p> : null}
            </div>
          );
        })}

        {input.shares.length < MAX_FIRMS ? (
          <Button type="button" variant="outline" className="h-10" onClick={addFirm}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add firm
          </Button>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="hhi-result">
          <span>Herfindahl-Hirschman Index (HHI)</span>
          <InfoTooltip
            label="HHI"
            text="Sum of the squares of each entered market share percentage."
          />
        </label>
        <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30">
          <input
            id="hhi-result"
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={result?.formattedHhi ?? ''}
            placeholder=""
            aria-live="polite"
          />
        </div>
        {result?.coversPartialMarket ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Based on {result.firmCount} listed firm
            {result.firmCount === 1 ? '' : 's'} totaling {result.formattedShareTotal}% of the
            market (not a full 100%).
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
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
