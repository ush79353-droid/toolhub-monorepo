'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_IMPERIAL_OTHER,
  DEFAULT_METRIC_OTHER,
  IMPERIAL_CORE,
  IMPERIAL_OTHER,
  METERS_PER_MM,
  METRIC_CORE,
  METRIC_OTHER,
  MM_PER_INCH,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type ImperialOtherUnit,
  type LengthUnit,
  type MetricOtherUnit,
  type MillimeterFieldErrors,
} from './types';

export interface MillimeterDraft {
  texts: Partial<Record<LengthUnit, string>>;
  activeField: LengthUnit | null;
  imperialOpen: boolean;
  metricOpen: boolean;
  otherImperial: ImperialOtherUnit;
  otherMetric: MetricOtherUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): MillimeterDraft {
  return {
    texts: {},
    activeField: null,
    imperialOpen: true,
    metricOpen: true,
    otherImperial: DEFAULT_IMPERIAL_OTHER,
    otherMetric: DEFAULT_METRIC_OTHER,
  };
}

interface MillimeterFormProps {
  draft: MillimeterDraft;
  errors: MillimeterFieldErrors;
  onDraftChange: (draft: MillimeterDraft) => void;
  onOtherImperialChange: (unit: ImperialOtherUnit) => void;
  onOtherMetricChange: (unit: MetricOtherUnit) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  unit,
  draft,
  errors,
  onDraftChange,
}: {
  unit: LengthUnit;
  draft: MillimeterDraft;
  errors: MillimeterFieldErrors;
  onDraftChange: (draft: MillimeterDraft) => void;
}) {
  const id = `mm-calc-${unit}`;
  const error = errors[unit];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {UNIT_LABELS[unit]}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.texts[unit] ?? ''}
            placeholder="Enter value"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                texts: { ...draft.texts, [unit]: event.target.value },
                activeField: unit,
              })
            }
          />
        </div>
        <span className="flex h-11 min-w-[4.25rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {UNIT_SYMBOLS[unit]}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
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
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open ? <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">{children}</div> : null}
    </div>
  );
}

export function MillimeterForm({
  draft,
  errors,
  onDraftChange,
  onOtherImperialChange,
  onOtherMetricChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MillimeterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert millimeters (1 mm = {METERS_PER_MM} m exactly). Exact inch definition: 1 in ={' '}
        {MM_PER_INCH} mm. Enter any field; all stay linked through meters.
      </div>

      <div className="rounded-xl border border-border p-3.5 sm:p-4">
        <p className="mb-3 text-sm font-medium text-accent">Millimeters</p>
        <FieldRow unit="mm" draft={draft} errors={errors} onDraftChange={onDraftChange} />
      </div>

      <AccordionSection
        title="Imperial/US"
        open={draft.imperialOpen}
        onToggle={() => onDraftChange({ ...draft, imperialOpen: !draft.imperialOpen })}
      >
        {IMPERIAL_CORE.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="mm-other-imperial" className={labelClass}>
            Other imperial/US units
          </label>
          <select
            id="mm-other-imperial"
            className={selectClass}
            value={draft.otherImperial}
            onChange={(event) => onOtherImperialChange(event.target.value as ImperialOtherUnit)}
          >
            {IMPERIAL_OTHER.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          unit={draft.otherImperial}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      <AccordionSection
        title="Metric"
        open={draft.metricOpen}
        onToggle={() => onDraftChange({ ...draft, metricOpen: !draft.metricOpen })}
      >
        {METRIC_CORE.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="mm-other-metric" className={labelClass}>
            Other metric units
          </label>
          <select
            id="mm-other-metric"
            className={selectClass}
            value={draft.otherMetric}
            onChange={(event) => onOtherMetricChange(event.target.value as MetricOtherUnit)}
          >
            {METRIC_OTHER.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          unit={draft.otherMetric}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
