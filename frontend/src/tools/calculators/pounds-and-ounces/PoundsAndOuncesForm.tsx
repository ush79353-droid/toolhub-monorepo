'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure, gramsToMetric, metricToGrams } from './calculation';
import {
  METRIC_UNIT_OPTIONS,
  type AdditionResult,
  type EquivalenceFieldErrors,
  type EquivalenceResult,
  type EquivSource,
  type MetricUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AddRowDraft {
  id: string;
  pounds: string;
  ounces: string;
}

export interface PoundsAndOuncesDraft {
  equivSource: EquivSource;
  pounds: string;
  ounces: string;
  mixedPounds: string;
  mixedOunces: string;
  metric: string;
  metricUnit: MetricUnit;
  stones: string;
  equivOpen: boolean;
  addOpen: boolean;
  addRows: AddRowDraft[];
  nextRowId: number;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraftFromResult(result: EquivalenceResult): PoundsAndOuncesDraft {
  return {
    equivSource: 'pounds',
    pounds: formatMeasure(result.decimalPounds),
    ounces: formatMeasure(result.totalOuncesDisplay),
    mixedPounds: formatMeasure(result.mixed.pounds),
    mixedOunces: formatMeasure(result.mixed.ounces),
    metric: formatMeasure(result.metric),
    metricUnit: result.metricUnit,
    stones: formatMeasure(result.stones),
    equivOpen: true,
    addOpen: true,
    addRows: [
      { id: 'row-1', pounds: '2', ounces: '10' },
      { id: 'row-2', pounds: '3', ounces: '9' },
    ],
    nextRowId: 3,
  };
}

export function emptyDraft(): PoundsAndOuncesDraft {
  return {
    equivSource: 'pounds',
    pounds: '',
    ounces: '',
    mixedPounds: '',
    mixedOunces: '',
    metric: '',
    metricUnit: 'g',
    stones: '',
    equivOpen: true,
    addOpen: true,
    addRows: [
      { id: 'row-1', pounds: '', ounces: '' },
      { id: 'row-2', pounds: '', ounces: '' },
    ],
    nextRowId: 3,
  };
}

interface PoundsAndOuncesFormProps {
  draft: PoundsAndOuncesDraft;
  equivErrors: EquivalenceFieldErrors;
  addErrors: Record<string, string | undefined>;
  equivResult: EquivalenceResult | null;
  addResult: AdditionResult | null;
  onDraftChange: (draft: PoundsAndOuncesDraft) => void;
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

export function PoundsAndOuncesForm({
  draft,
  equivErrors,
  addErrors,
  equivResult,
  addResult,
  onDraftChange,
  onSubmit,
  onReset,
}: PoundsAndOuncesFormProps) {
  const set = (patch: Partial<PoundsAndOuncesDraft>) =>
    onDraftChange({ ...draft, ...patch });

  const changeMetricUnit = (nextUnit: MetricUnit) => {
    const parsed = parseOptionalNumber(draft.metric);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ metricUnit: nextUnit, equivSource: 'metric' });
      return;
    }
    const grams = metricToGrams(parsed, draft.metricUnit);
    set({
      metricUnit: nextUnit,
      metric: formatMeasure(gramsToMetric(grams, nextUnit)),
      equivSource: 'metric',
    });
  };

  const addRow = () => {
    const id = `row-${draft.nextRowId}`;
    set({
      addRows: [...draft.addRows, { id, pounds: '', ounces: '' }],
      nextRowId: draft.nextRowId + 1,
    });
  };

  const removeRow = (id: string) => {
    if (draft.addRows.length <= 2) return;
    set({ addRows: draft.addRows.filter((row) => row.id !== id) });
  };

  const updateRow = (id: string, patch: Partial<AddRowDraft>) => {
    set({
      addRows: draft.addRows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.equivOpen}
          onClick={() => set({ equivOpen: !draft.equivOpen })}
        >
          <span>Pounds and ounces equivalences</span>
          {draft.equivOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.equivOpen ? (
          <div className="space-y-4 border-t border-border px-3.5 pb-3.5 pt-3">
            <FieldShell
              label="Pounds"
              htmlFor="lb-oz-pounds"
              tip="Editing decimal pounds updates ounces, mixed lb+oz, metric, and stones. 1 lb = 16 oz."
              error={equivErrors.pounds}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="lb-oz-pounds"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.pounds}
                    placeholder="Enter pounds"
                    aria-invalid={Boolean(equivErrors.pounds)}
                    onChange={(event) =>
                      set({ equivSource: 'pounds', pounds: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass}>lb</span>
              </div>
            </FieldShell>

            <FieldShell
              label="Ounces"
              htmlFor="lb-oz-ounces"
              tip="Total avoirdupois ounces (mass). Not fluid ounces."
              error={equivErrors.ounces}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="lb-oz-ounces"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.ounces}
                    placeholder="Enter ounces"
                    aria-invalid={Boolean(equivErrors.ounces)}
                    onChange={(event) =>
                      set({ equivSource: 'ounces', ounces: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass}>oz</span>
              </div>
            </FieldShell>

            <div>
              <p className={labelClass}>Pounds and ounces</p>
              <p className="mb-2 text-xs text-muted-foreground">
                Ounces ≥ 16 normalize into whole pounds. Decimal ounces are kept.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <FieldShell
                  label="Pounds"
                  htmlFor="lb-oz-mixed-lb"
                  error={equivErrors.mixedPounds}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="lb-oz-mixed-lb"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.mixedPounds}
                        placeholder="lb"
                        aria-invalid={Boolean(equivErrors.mixedPounds)}
                        onChange={(event) =>
                          set({
                            equivSource: 'mixed',
                            mixedPounds: event.target.value,
                          })
                        }
                      />
                    </div>
                    <span className={unitBadgeClass}>lb</span>
                  </div>
                </FieldShell>
                <FieldShell
                  label="Ounces"
                  htmlFor="lb-oz-mixed-oz"
                  error={equivErrors.mixedOunces}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="lb-oz-mixed-oz"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.mixedOunces}
                        placeholder="oz"
                        aria-invalid={Boolean(equivErrors.mixedOunces)}
                        onChange={(event) =>
                          set({
                            equivSource: 'mixed',
                            mixedOunces: event.target.value,
                          })
                        }
                      />
                    </div>
                    <span className={unitBadgeClass}>oz</span>
                  </div>
                </FieldShell>
              </div>
            </div>

            <FieldShell
              label="Metric equivalents"
              htmlFor="lb-oz-metric"
              tip="Exact: 1 lb = 453.59237 g. Editing metric updates imperial fields."
              error={equivErrors.metric}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="lb-oz-metric"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.metric}
                    placeholder="Enter mass"
                    aria-invalid={Boolean(equivErrors.metric)}
                    onChange={(event) =>
                      set({ equivSource: 'metric', metric: event.target.value })
                    }
                  />
                </div>
                <select
                  className={selectClass}
                  aria-label="Metric unit"
                  value={draft.metricUnit}
                  onChange={(event) =>
                    changeMetricUnit(event.target.value as MetricUnit)
                  }
                >
                  {METRIC_UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>

            <FieldShell
              label="Imperial equivalents (stones)"
              htmlFor="lb-oz-stones"
              tip="1 stone = 14 lb = 224 oz. Not a metric tonne."
              error={equivErrors.stones}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="lb-oz-stones"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.stones}
                    placeholder="Enter stones"
                    aria-invalid={Boolean(equivErrors.stones)}
                    onChange={(event) =>
                      set({ equivSource: 'stones', stones: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass}>st</span>
              </div>
            </FieldShell>

            {equivResult ? (
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                Mixed: {formatMeasure(equivResult.mixed.pounds)} lb{' '}
                {formatMeasure(equivResult.mixed.ounces)} oz ·{' '}
                {formatMeasure(equivResult.grams)} g ·{' '}
                {formatMeasure(equivResult.stones)} st
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.addOpen}
          onClick={() => set({ addOpen: !draft.addOpen })}
        >
          <span>Add up pounds and ounces</span>
          {draft.addOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.addOpen ? (
          <div className="space-y-4 border-t border-border px-3.5 pb-3.5 pt-3">
            {draft.addRows.map((row, index) => (
              <div key={row.id} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-accent">
                    Measurement {index + 1}
                  </p>
                  {draft.addRows.length > 2 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9"
                      onClick={() => removeRow(row.id)}
                      aria-label={`Remove measurement ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldShell
                    label="Pounds"
                    htmlFor={`${row.id}-lb`}
                    error={addErrors[`${row.id}:pounds`]}
                  >
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                        <input
                          id={`${row.id}-lb`}
                          inputMode="decimal"
                          className={inputClass}
                          value={row.pounds}
                          placeholder="lb"
                          onChange={(event) =>
                            updateRow(row.id, { pounds: event.target.value })
                          }
                        />
                      </div>
                      <span className={unitBadgeClass}>lb</span>
                    </div>
                  </FieldShell>
                  <FieldShell
                    label="Ounces"
                    htmlFor={`${row.id}-oz`}
                    error={addErrors[`${row.id}:ounces`]}
                  >
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                        <input
                          id={`${row.id}-oz`}
                          inputMode="decimal"
                          className={inputClass}
                          value={row.ounces}
                          placeholder="oz"
                          onChange={(event) =>
                            updateRow(row.id, { ounces: event.target.value })
                          }
                        />
                      </div>
                      <span className={unitBadgeClass}>oz</span>
                    </div>
                  </FieldShell>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" className="h-10" onClick={addRow}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add another measurement
            </Button>

            {addResult ? (
              <div className="rounded-lg border border-border bg-brand-softTeal/40 px-3.5 py-3 text-sm text-accent">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums">
                  {formatMeasure(addResult.mixed.pounds)} lb{' '}
                  {formatMeasure(addResult.mixed.ounces)} oz
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatMeasure(addResult.totalOunces)} oz total ·{' '}
                  {formatMeasure(addResult.decimalPounds)} lb decimal
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter at least one measurement to see the normalized total.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
        Uses avoirdupois mass: 1 lb = 16 oz exactly. Mass ounces are not fluid ounces.
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
