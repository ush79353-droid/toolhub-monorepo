'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CentimeterFieldErrors } from './types';
import {
  CORE_IMPERIAL,
  CORE_METRIC,
  DEFAULT_OTHER_IMPERIAL,
  DEFAULT_OTHER_METRIC,
  OTHER_IMPERIAL,
  OTHER_METRIC,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type LengthUnit,
  type OtherImperialUnit,
  type OtherMetricUnit,
} from './units';

export interface CentimeterDraft {
  texts: Partial<Record<LengthUnit, string>>;
  activeField: LengthUnit | null;
  openGroups: { imperial: boolean; metric: boolean };
  otherImperial: OtherImperialUnit;
  otherMetric: OtherMetricUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): CentimeterDraft {
  return {
    texts: {},
    activeField: null,
    openGroups: { imperial: true, metric: true },
    otherImperial: DEFAULT_OTHER_IMPERIAL,
    otherMetric: DEFAULT_OTHER_METRIC,
  };
}

interface CentimeterFormProps {
  draft: CentimeterDraft;
  errors: CentimeterFieldErrors;
  onDraftChange: (draft: CentimeterDraft) => void;
  onOtherImperialChange: (unit: OtherImperialUnit) => void;
  onOtherMetricChange: (unit: OtherMetricUnit) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
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

function FieldRow({
  unit,
  draft,
  errors,
  onDraftChange,
}: {
  unit: LengthUnit;
  draft: CentimeterDraft;
  errors: CentimeterFieldErrors;
  onDraftChange: (draft: CentimeterDraft) => void;
}) {
  const id = `cm-calc-${unit}`;
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
        <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
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

export function CentimeterForm({
  draft,
  errors,
  onDraftChange,
  onOtherImperialChange,
  onOtherMetricChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CentimeterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Edit centimeters or any related unit — all fields stay linked through meters. Exact factors:
        1 in = 2.54 cm, 1 ft = 30.48 cm, 1 m = 100 cm.
      </div>

      <div className="rounded-xl border border-border">
        <div className="px-3.5 py-3 text-sm font-medium text-accent">Centimeters</div>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
          <FieldRow unit="cm" draft={draft} errors={errors} onDraftChange={onDraftChange} />
        </div>
      </div>

      <AccordionSection
        title="Imperial/US units"
        open={draft.openGroups.imperial}
        onToggle={() =>
          onDraftChange({
            ...draft,
            openGroups: { ...draft.openGroups, imperial: !draft.openGroups.imperial },
          })
        }
      >
        {CORE_IMPERIAL.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="cm-other-imperial" className={labelClass}>
            Other imperial units
          </label>
          <select
            id="cm-other-imperial"
            className={selectClass}
            value={draft.otherImperial}
            onChange={(event) =>
              onOtherImperialChange(event.target.value as OtherImperialUnit)
            }
          >
            {OTHER_IMPERIAL.map((unit) => (
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
        title="Metric units"
        open={draft.openGroups.metric}
        onToggle={() =>
          onDraftChange({
            ...draft,
            openGroups: { ...draft.openGroups, metric: !draft.openGroups.metric },
          })
        }
      >
        {CORE_METRIC.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="cm-other-metric" className={labelClass}>
            Other metric units
          </label>
          <select
            id="cm-other-metric"
            className={selectClass}
            value={draft.otherMetric}
            onChange={(event) => onOtherMetricChange(event.target.value as OtherMetricUnit)}
          >
            {OTHER_METRIC.map((unit) => (
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
