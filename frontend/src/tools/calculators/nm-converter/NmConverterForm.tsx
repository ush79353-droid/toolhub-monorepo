'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_IMPERIAL_UNIT,
  DEFAULT_METRIC_UNIT,
  DEFAULT_OTHER_UNIT,
  IMPERIAL_UNITS,
  METRIC_UNITS,
  OTHER_UNITS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type ImperialUnit,
  type MetricUnit,
  type NmFieldErrors,
  type NmUnit,
  type OtherUnit,
} from './types';

export interface NmDraft {
  texts: Record<NmUnit, string>;
  activeField: NmUnit | null;
  metricOpen: boolean;
  imperialOpen: boolean;
  otherOpen: boolean;
  metricUnit: MetricUnit;
  imperialUnit: ImperialUnit;
  otherUnit: OtherUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function emptyTexts(): Record<NmUnit, string> {
  return {
    nm: '',
    pm: '',
    um: '',
    mm: '',
    cm: '',
    m: '',
    km: '',
    in: '',
    ft: '',
    yd: '',
    mi: '',
    angstrom: '',
  };
}

export function emptyDraft(): NmDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    metricOpen: true,
    imperialOpen: true,
    otherOpen: true,
    metricUnit: DEFAULT_METRIC_UNIT,
    imperialUnit: DEFAULT_IMPERIAL_UNIT,
    otherUnit: DEFAULT_OTHER_UNIT,
  };
}

interface NmConverterFormProps {
  draft: NmDraft;
  errors: NmFieldErrors;
  onDraftChange: (draft: NmDraft) => void;
  onMetricUnitChange: (unit: MetricUnit) => void;
  onImperialUnitChange: (unit: ImperialUnit) => void;
  onOtherUnitChange: (unit: OtherUnit) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  field,
  draft,
  errors,
  onDraftChange,
}: {
  field: NmUnit;
  draft: NmDraft;
  errors: NmFieldErrors;
  onDraftChange: (draft: NmDraft) => void;
}) {
  const id = `nm-conv-${field}`;
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {UNIT_LABELS[field]}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.texts[field]}
            placeholder=""
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                texts: { ...draft.texts, [field]: event.target.value },
                activeField: field,
              })
            }
          />
        </div>
        <span className="flex h-11 min-w-[4.25rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {UNIT_SYMBOLS[field]}
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

export function NmConverterForm({
  draft,
  errors,
  onDraftChange,
  onMetricUnitChange,
  onImperialUnitChange,
  onOtherUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: NmConverterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact SI: 1 nm = 10⁻⁹ m. Convert nanometers to metric, imperial, and ångström units. Enter
        any field — all stay linked through meters. Scientific notation appears for very small or
        large values. Signed mathematical values are allowed.
      </div>

      <FieldRow field="nm" draft={draft} errors={errors} onDraftChange={onDraftChange} />

      <AccordionSection
        title="Metric"
        open={draft.metricOpen}
        onToggle={() => onDraftChange({ ...draft, metricOpen: !draft.metricOpen })}
      >
        <div className="space-y-1.5">
          <label htmlFor="nm-metric-unit" className={labelClass}>
            Metric units
          </label>
          <select
            id="nm-metric-unit"
            className={selectClass}
            value={draft.metricUnit}
            onChange={(event) => onMetricUnitChange(event.target.value as MetricUnit)}
          >
            {METRIC_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.metricUnit}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      <AccordionSection
        title="Imperial / US"
        open={draft.imperialOpen}
        onToggle={() => onDraftChange({ ...draft, imperialOpen: !draft.imperialOpen })}
      >
        <div className="space-y-1.5">
          <label htmlFor="nm-imperial-unit" className={labelClass}>
            Imperial units
          </label>
          <select
            id="nm-imperial-unit"
            className={selectClass}
            value={draft.imperialUnit}
            onChange={(event) => onImperialUnitChange(event.target.value as ImperialUnit)}
          >
            {IMPERIAL_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.imperialUnit}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      <AccordionSection
        title="Others"
        open={draft.otherOpen}
        onToggle={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
      >
        <div className="space-y-1.5">
          <label htmlFor="nm-other-unit" className={labelClass}>
            Other units
          </label>
          <select
            id="nm-other-unit"
            className={selectClass}
            value={draft.otherUnit}
            onChange={(event) => onOtherUnitChange(event.target.value as OtherUnit)}
          >
            {OTHER_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.otherUnit}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      <p className="text-xs text-muted-foreground">
        1 nm = 10⁻⁹ m · 1 nm = 0.001 µm · 1 nm = 10 Å · 1 mm = 1,000,000 nm
      </p>

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
