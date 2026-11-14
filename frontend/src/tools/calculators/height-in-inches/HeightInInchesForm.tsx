'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLength } from './calculation';
import {
  type HeightInInchesFieldErrors,
  type HeightInInchesInput,
  type HeightSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface HeightInInchesDraft {
  source: HeightSource;
  feet: string;
  inches: string;
  totalInches: string;
  centimeters: string;
  meters: string;
  metricOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: HeightInInchesInput, metricOpen = false): HeightInInchesDraft {
  return {
    source: input.source,
    feet: input.feet === null ? '' : formatLength(input.feet),
    inches: input.inches === null ? '' : formatLength(input.inches),
    totalInches: input.totalInches === null ? '' : formatLength(input.totalInches),
    centimeters: input.centimeters === null ? '' : formatLength(input.centimeters),
    meters: input.meters === null ? '' : formatLength(input.meters),
    metricOpen,
  };
}

export function draftToInput(draft: HeightInInchesDraft): HeightInInchesInput {
  return {
    source: draft.source,
    feet: parseOptionalNumber(draft.feet),
    inches: parseOptionalNumber(draft.inches),
    totalInches: parseOptionalNumber(draft.totalInches),
    centimeters: parseOptionalNumber(draft.centimeters),
    meters: parseOptionalNumber(draft.meters),
  };
}

interface HeightInInchesFormProps {
  draft: HeightInInchesDraft;
  errors: HeightInInchesFieldErrors;
  onDraftChange: (draft: HeightInInchesDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
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

export function HeightInInchesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: HeightInInchesFormProps) {
  const set = (patch: Partial<HeightInInchesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <p className={labelClass}>
          Height
          <InfoTooltip
            label="Height"
            text="Enter feet and inches. Values such as 5 ft 14 in normalize to 6 ft 2 in in the result."
          />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="height-feet"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.feet}
                  placeholder="Feet"
                  aria-label="Feet"
                  aria-invalid={Boolean(errors.feet)}
                  onChange={(event) => set({ source: 'feetInches', feet: event.target.value })}
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                ft
              </span>
            </div>
            {errors.feet ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.feet}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="height-inches-part"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.inches}
                  placeholder="Inches"
                  aria-label="Inches"
                  aria-invalid={Boolean(errors.inches)}
                  onChange={(event) => set({ source: 'feetInches', inches: event.target.value })}
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                in
              </span>
            </div>
            {errors.inches ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.inches}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <FieldShell
        label="Height in inches"
        htmlFor="height-total-inches"
        tip="Edit total inches to update feet, remaining inches, centimeters, and meters."
        error={errors.totalInches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="height-total-inches"
              inputMode="decimal"
              className={inputClass}
              value={draft.totalInches}
              placeholder="Total inches"
              aria-invalid={Boolean(errors.totalInches)}
              onChange={(event) =>
                set({ source: 'totalInches', totalInches: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.metricOpen}
          onClick={() => set({ metricOpen: !draft.metricOpen })}
        >
          <span>Centimeters &amp; meters</span>
          {draft.metricOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.metricOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            <FieldShell
              label="Centimeters"
              htmlFor="height-cm"
              tip="1 inch = 2.54 cm exactly. Editing centimeters updates all imperial values."
              error={errors.centimeters}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="height-cm"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.centimeters}
                    placeholder="Enter centimeters"
                    aria-invalid={Boolean(errors.centimeters)}
                    onChange={(event) =>
                      set({ source: 'centimeters', centimeters: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  cm
                </span>
              </div>
            </FieldShell>
            <FieldShell
              label="Meters"
              htmlFor="height-m"
              tip="1 inch = 0.0254 m exactly. Editing meters updates inches and feet."
              error={errors.meters}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="height-m"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.meters}
                    placeholder="Enter meters"
                    aria-invalid={Boolean(errors.meters)}
                    onChange={(event) => set({ source: 'meters', meters: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  m
                </span>
              </div>
            </FieldShell>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
