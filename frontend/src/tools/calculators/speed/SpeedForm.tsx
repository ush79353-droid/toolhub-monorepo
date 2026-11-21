'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  IMPERIAL_OTHER,
  IMPERIAL_PRIMARY,
  METRIC_OTHER,
  METRIC_PRIMARY,
  OTHER_PRIMARY,
  PACE_FIELD_LABELS,
  PACE_OTHER,
  PACE_PRIMARY,
  PACE_UNIT_SYMBOLS,
  SPEED_FIELD_LABELS,
  SPEED_UNIT_SYMBOLS,
  type PaceUnit,
  type SpeedField,
  type SpeedFieldErrors,
  type SpeedUnit,
} from './types';

export interface SpeedDraft {
  texts: Record<SpeedField, string>;
  activeField: SpeedField | null;
  imperialOpen: boolean;
  metricOpen: boolean;
  otherOpen: boolean;
  paceOpen: boolean;
  imperialExtra: SpeedUnit;
  metricExtra: SpeedUnit;
  paceExtra: PaceUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<SpeedField, string> {
  return {
    mph: '',
    ftPerSec: '',
    ydPerSec: '',
    miPerSec: '',
    ftPerMin: '',
    kmh: '',
    mps: '',
    kmPerSec: '',
    mPerMin: '',
    cmPerSec: '',
    mmPerSec: '',
    knot: '',
    c: '',
    minPerKm: '',
    secPerKm: '',
    minPerMile: '',
    secPerMile: '',
    minPer100m: '',
    secPer100m: '',
  };
}

export function emptyDraft(): SpeedDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    imperialOpen: true,
    metricOpen: true,
    otherOpen: true,
    paceOpen: true,
    imperialExtra: 'miPerSec',
    metricExtra: 'mPerMin',
    paceExtra: 'minPer100m',
  };
}

interface SpeedFormProps {
  draft: SpeedDraft;
  errors: SpeedFieldErrors;
  paceUndefined: boolean;
  onDraftChange: (draft: SpeedDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  field,
  label,
  symbol,
  draft,
  errors,
  onDraftChange,
}: {
  field: SpeedField;
  label: string;
  symbol: string;
  draft: SpeedDraft;
  errors: SpeedFieldErrors;
  onDraftChange: (draft: SpeedDraft) => void;
}) {
  const id = `speed-${field}`;
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
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
          {symbol}
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

export function SpeedForm({
  draft,
  errors,
  paceUndefined,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SpeedFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Enter a speed in any field to convert all others via meters per second. Running pace is
 inverse speed (time per distance); zero speed leaves pace undefined. Negative values are
        not accepted. Mach is omitted (depends on medium and temperature).
      </div>

      <AccordionSection
        title="Imperial / US"
        open={draft.imperialOpen}
        onToggle={() => onDraftChange({ ...draft, imperialOpen: !draft.imperialOpen })}
      >
        {IMPERIAL_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            label={SPEED_FIELD_LABELS[unit]}
            symbol={SPEED_UNIT_SYMBOLS[unit]}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="imperial-extra" className={labelClass}>
            Other imperial / US units
          </label>
          <select
            id="imperial-extra"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={draft.imperialExtra}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                imperialExtra: event.target.value as SpeedUnit,
              })
            }
          >
            {IMPERIAL_OTHER.map((unit) => (
              <option key={unit} value={unit}>
                {SPEED_FIELD_LABELS[unit]} ({SPEED_UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.imperialExtra}
          label={SPEED_FIELD_LABELS[draft.imperialExtra]}
          symbol={SPEED_UNIT_SYMBOLS[draft.imperialExtra]}
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
        {METRIC_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            label={SPEED_FIELD_LABELS[unit]}
            symbol={SPEED_UNIT_SYMBOLS[unit]}
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
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={draft.metricExtra}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                metricExtra: event.target.value as SpeedUnit,
              })
            }
          >
            {METRIC_OTHER.map((unit) => (
              <option key={unit} value={unit}>
                {SPEED_FIELD_LABELS[unit]} ({SPEED_UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.metricExtra}
          label={SPEED_FIELD_LABELS[draft.metricExtra]}
          symbol={SPEED_UNIT_SYMBOLS[draft.metricExtra]}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </AccordionSection>

      <AccordionSection
        title="Other"
        open={draft.otherOpen}
        onToggle={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
      >
        {OTHER_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            label={SPEED_FIELD_LABELS[unit]}
            symbol={SPEED_UNIT_SYMBOLS[unit]}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="Run pace"
        open={draft.paceOpen}
        onToggle={() => onDraftChange({ ...draft, paceOpen: !draft.paceOpen })}
      >
        {paceUndefined ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900" role="status">
            Pace is undefined at zero speed (division by zero). Enter a positive speed to see pace.
          </p>
        ) : null}
        {PACE_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            label={PACE_FIELD_LABELS[unit]}
            symbol={PACE_UNIT_SYMBOLS[unit]}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
        <div className="space-y-1.5">
          <label htmlFor="pace-extra" className={labelClass}>
            Other pace units
          </label>
          <select
            id="pace-extra"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={draft.paceExtra}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                paceExtra: event.target.value as PaceUnit,
              })
            }
          >
            {PACE_OTHER.map((unit) => (
              <option key={unit} value={unit}>
                {PACE_FIELD_LABELS[unit]} ({PACE_UNIT_SYMBOLS[unit]})
              </option>
            ))}
          </select>
        </div>
        <FieldRow
          field={draft.paceExtra}
          label={PACE_FIELD_LABELS[draft.paceExtra]}
          symbol={PACE_UNIT_SYMBOLS[draft.paceExtra]}
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
