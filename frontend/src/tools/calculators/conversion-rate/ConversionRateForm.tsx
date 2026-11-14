'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import {
  CONVERSION_MODES,
  type ConversionMode,
  type ConversionRateFieldErrors,
} from './types';

export interface ConversionRateDraft {
  mode: ConversionMode;
  totalConversions: string;
  totalClicksOrVisits: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

const MODE_OPTIONS: { value: ConversionMode; label: string }[] = [
  { value: 'ads', label: 'Ads, posts or links' },
  { value: 'websites', label: 'Websites' },
];

export function emptyDraft(): ConversionRateDraft {
  return { mode: 'ads', totalConversions: '', totalClicksOrVisits: '' };
}

interface ConversionRateFormProps {
  draft: ConversionRateDraft;
  rateDisplay: string;
  errors: ConversionRateFieldErrors;
  onDraftChange: (draft: ConversionRateDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
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

export function ConversionRateForm({
  draft,
  rateDisplay,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: ConversionRateFormProps) {
  const set = (patch: Partial<ConversionRateDraft>) => onDraftChange({ ...draft, ...patch });
  const denomLabel = draft.mode === 'websites' ? 'Website visits' : 'Number of clicks';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-accent">
          Calculate conversion rate for…
        </legend>
        <div role="radiogroup" aria-label="Conversion rate mode" className="space-y-2">
          {MODE_OPTIONS.map((option) => {
            const active = draft.mode === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                  active
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="conversion-mode"
                  className="accent-[hsl(var(--primary))]"
                  checked={active}
                  value={option.value}
                  onChange={() => {
                    if (!CONVERSION_MODES.includes(option.value)) return;
                    set({ mode: option.value });
                  }}
                />
                <span className="font-medium text-accent">{option.label}</span>
              </label>
            );
          })}
        </div>
        {errors.mode ? <p className="mt-1 text-xs text-red-600">{errors.mode}</p> : null}
      </fieldset>

      <FieldShell
        label="Total conversions"
        htmlFor="conv-conversions"
        error={errors.totalConversions}
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="conv-conversions"
            inputMode="decimal"
            className={inputClass}
            value={draft.totalConversions}
            aria-invalid={Boolean(errors.totalConversions)}
            onChange={(event) => set({ totalConversions: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell
        label={denomLabel}
        htmlFor="conv-denom"
        error={errors.totalClicksOrVisits}
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="conv-denom"
            inputMode="decimal"
            className={inputClass}
            value={draft.totalClicksOrVisits}
            aria-invalid={Boolean(errors.totalClicksOrVisits)}
            onChange={(event) => set({ totalClicksOrVisits: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell label="Conversion rate" htmlFor="conv-rate">
        <div className="relative rounded-lg border border-border bg-muted/30">
          <input
            id="conv-rate"
            readOnly
            tabIndex={0}
            className={`${inputClass} cursor-default pr-10 font-semibold text-accent`}
            value={rateDisplay}
            placeholder="—"
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </FieldShell>

      {errors.form ? (
        <p className="text-xs text-red-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
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
