'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_IMPERIAL_EXTRA,
  DEFAULT_METRIC_EXTRA,
  DEFAULT_OTHER_EXTRA,
  IMPERIAL_OTHER,
  IMPERIAL_PRIMARY,
  LENGTH_UNITS,
  METRIC_OTHER,
  METRIC_PRIMARY,
  OTHER_EXTRA,
  OTHER_PRIMARY,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type LengthUnit,
  type MeterFieldErrors,
} from './types';

export interface MeterDraft {
  texts: Record<LengthUnit, string>;
  activeField: LengthUnit | null;
  metricOpen: boolean;
  imperialOpen: boolean;
  otherOpen: boolean;
  metricExtra: LengthUnit;
  imperialExtra: LengthUnit;
  otherExtra: LengthUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function emptyTexts(): Record<LengthUnit, string> {
  const texts = {} as Record<LengthUnit, string>;
  for (const unit of LENGTH_UNITS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): MeterDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    metricOpen: true,
    imperialOpen: true,
    otherOpen: true,
    metricExtra: DEFAULT_METRIC_EXTRA,
    imperialExtra: DEFAULT_IMPERIAL_EXTRA,
    otherExtra: DEFAULT_OTHER_EXTRA,
  };
}

interface MeterConverterFormProps {
  draft: MeterDraft;
  errors: MeterFieldErrors;
  onDraftChange: (draft: MeterDraft) => void;
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
  field: LengthUnit;
  draft: MeterDraft;
  errors: MeterFieldErrors;
  onDraftChange: (draft: MeterDraft) => void;
}) {
  const id = `meter-conv-${field}`;
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

export function MeterConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MeterConverterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Enter a length in meters or any other field. All values stay linked through the SI meter.
        Statute miles are distinct from nautical miles. “Kilotors” is not a recognized length unit
        and is omitted.
      </div>

      <FieldRow field="m" draft={draft} errors={errors} onDraftChange={onDraftChange} />

      <AccordionSection
        title="Metric units"
        open={draft.metricOpen}
        onToggle={() => onDraftChange({ ...draft, metricOpen: !draft.metricOpen })}
      >
        {METRIC_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="metric-extra" className={labelClass}>
            Other metric units
          </label>
          <select
            id="metric-extra"
            className={selectClass}
            value={draft.metricExtra}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                metricExtra: event.target.value as LengthUnit,
              })
            }
          >
            {METRIC_OTHER.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.metricExtra}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      <AccordionSection
        title="Imperial / US units"
        open={draft.imperialOpen}
        onToggle={() => onDraftChange({ ...draft, imperialOpen: !draft.imperialOpen })}
      >
        {IMPERIAL_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="imperial-extra" className={labelClass}>
            Other imperial units
          </label>
          <select
            id="imperial-extra"
            className={selectClass}
            value={draft.imperialExtra}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                imperialExtra: event.target.value as LengthUnit,
              })
            }
          >
            {IMPERIAL_OTHER.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.imperialExtra}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      <AccordionSection
        title="Other units"
        open={draft.otherOpen}
        onToggle={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
      >
        {OTHER_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="other-extra" className={labelClass}>
            Additional specialized units
          </label>
          <select
            id="other-extra"
            className={selectClass}
            value={draft.otherExtra}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                otherExtra: event.target.value as LengthUnit,
              })
            }
          >
            {OTHER_EXTRA.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.otherExtra}
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
