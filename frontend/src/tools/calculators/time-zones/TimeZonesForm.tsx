'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Disambiguation, HourCycle, TimeZonesFieldErrors, ZoneInstant } from './types';
import {
  ADDABLE_ZONE_IDS,
  EASTERN_ZONE_IDS,
  WESTERN_ZONE_IDS,
  ZONE_BY_ID,
  ZONE_CATALOG,
} from './zones';

export interface TimeZonesDraft {
  referenceZoneId: string;
  date: string;
  time: string;
  hourCycle: HourCycle;
  disambiguation: Disambiguation;
  extraZoneIds: string[];
  addQuery: string;
  referenceOpen: boolean;
  easternOpen: boolean;
  westernOpen: boolean;
  extrasOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function defaultDraft(now = new Date()): TimeZonesDraft {
  const iso = now.toISOString();
  return {
    referenceZoneId: 'utc',
    date: iso.slice(0, 10),
    time: iso.slice(11, 16),
    hourCycle: 'h23',
    disambiguation: 'earlier',
    extraZoneIds: [],
    addQuery: '',
    referenceOpen: true,
    easternOpen: true,
    westernOpen: false,
    extrasOpen: true,
  };
}

export function emptyDraft(): TimeZonesDraft {
  return {
    ...defaultDraft(new Date(0)),
    date: '',
    time: '',
    extraZoneIds: [],
  };
}

interface TimeZonesFormProps {
  draft: TimeZonesDraft;
  errors: TimeZonesFieldErrors;
  views: Record<string, ZoneInstant>;
  localZoneLabel: string;
  onDraftChange: (draft: TimeZonesDraft) => void;
  onReferenceChange: (date: string, time: string) => void;
  onZoneEdit: (zoneId: string, date: string, time: string) => void;
  onUseCurrent: () => void;
  onResetUtc: () => void;
  onAddZone: (zoneId: string) => void;
  onRemoveZone: (zoneId: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function Accordion({
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

function ZoneRow({
  zoneId,
  view,
  error,
  hourCycle,
  removable,
  onEdit,
  onRemove,
}: {
  zoneId: string;
  view?: ZoneInstant;
  error?: string;
  hourCycle: HourCycle;
  removable?: boolean;
  onEdit: (date: string, time: string) => void;
  onRemove?: () => void;
}) {
  const zone = ZONE_BY_ID[zoneId];
  if (!zone) return null;
  const dateId = `tz-${zoneId}-date`;
  const timeId = `tz-${zoneId}-time`;
  const dayNote =
    view?.dayDelta === 1 ? 'next day' : view?.dayDelta === -1 ? 'previous day' : view?.dayDelta && view.dayDelta > 1 ? `+${view.dayDelta} days` : view?.dayDelta && view.dayDelta < -1 ? `${view.dayDelta} days` : null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <label className={labelClass} htmlFor={dateId}>
          {zone.city}
          <span className="ml-1.5 font-normal text-muted-foreground">
            {zone.kind === 'fixed' ? 'fixed offset' : zone.iana}
          </span>
        </label>
        {removable && onRemove ? (
          <button type="button" className="text-xs text-primary underline-offset-2 hover:underline" onClick={onRemove}>
            Remove
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={dateId}
            type="date"
            className={inputClass}
            value={view?.date ?? ''}
            aria-invalid={Boolean(error)}
            onChange={(event) => onEdit(event.target.value, view?.time ?? '')}
          />
        </div>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={timeId}
            type="time"
            step={60}
            className={inputClass}
            value={(view?.time ?? '').slice(0, 5)}
            aria-invalid={Boolean(error)}
            aria-label={`${zone.city} time`}
            onChange={(event) => onEdit(view?.date ?? '', event.target.value)}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {view
          ? `${hourCycle === 'h12' ? view.time12 : view.time} · ${view.offsetLabel}${
              view.abbreviation && view.abbreviation !== view.offsetLabel ? ` · ${view.abbreviation}` : ''
            }${dayNote ? ` · ${dayNote}` : ''}`
          : 'Enter a valid reference time'}
      </p>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TimeZonesForm({
  draft,
  errors,
  views,
  localZoneLabel,
  onDraftChange,
  onReferenceChange,
  onZoneEdit,
  onUseCurrent,
  onResetUtc,
  onAddZone,
  onRemoveZone,
  onSubmit,
  onReset,
  onReload,
  children,
}: TimeZonesFormProps) {
  const addable = ADDABLE_ZONE_IDS.filter((id) => !draft.extraZoneIds.includes(id)).filter((id) => {
    const zone = ZONE_BY_ID[id];
    if (!zone) return false;
    if (!draft.addQuery.trim()) return true;
    const q = draft.addQuery.trim().toLowerCase();
    return (
      zone.city.toLowerCase().includes(q) ||
      zone.label.toLowerCase().includes(q) ||
      (zone.iana ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        All fields share one instant in time. Geographic zones use IANA rules including daylight
        saving. Fixed offsets never change. Detected local zone: <strong>{localZoneLabel}</strong>.
      </div>

      <fieldset className="flex flex-wrap gap-3">
        <legend className="sr-only">Time display format</legend>
        {(['h23', 'h12'] as const).map((cycle) => (
          <label key={cycle} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="tz-hour-cycle"
              className="h-4 w-4 accent-primary"
              checked={draft.hourCycle === cycle}
              onChange={() => onDraftChange({ ...draft, hourCycle: cycle })}
            />
            {cycle === 'h23' ? '24-hour' : '12-hour'}
          </label>
        ))}
      </fieldset>

      <Accordion
        title="Reference time"
        open={draft.referenceOpen}
        onToggle={() => onDraftChange({ ...draft, referenceOpen: !draft.referenceOpen })}
      >
        <div className="space-y-1.5">
          <label htmlFor="tz-ref-zone" className={labelClass}>
            Reference time zone
          </label>
          <select
            id="tz-ref-zone"
            className={selectClass}
            value={draft.referenceZoneId}
            onChange={(event) => onDraftChange({ ...draft, referenceZoneId: event.target.value })}
          >
            {ZONE_CATALOG.map((zone) => (
              <option key={zone.id} value={zone.id}>
 {zone.city}; {zone.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="tz-ref-date" className={labelClass}>
              Date
            </label>
            <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="tz-ref-date"
                type="date"
                className={inputClass}
                value={draft.date}
                aria-invalid={Boolean(errors.reference)}
                onChange={(event) => onReferenceChange(event.target.value, draft.time)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="tz-ref-time" className={labelClass}>
              Time
            </label>
            <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="tz-ref-time"
                type="time"
                step={60}
                className={inputClass}
                value={draft.time}
                aria-invalid={Boolean(errors.reference)}
                onChange={(event) => onReferenceChange(draft.date, event.target.value)}
              />
            </div>
          </div>
        </div>
        {errors.reference ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.reference}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Times are local to the selected reference zone, not the browser locale.
          </p>
        )}
        {errors.ambiguous ? (
          <fieldset className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <legend className="text-xs font-medium text-amber-950">This local time occurs twice</legend>
            {(['earlier', 'later'] as const).map((choice) => (
              <label key={choice} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="tz-disambiguation"
                  className="h-4 w-4 accent-primary"
                  checked={draft.disambiguation === choice}
                  onChange={() => onDraftChange({ ...draft, disambiguation: choice })}
                />
                Use the {choice} occurrence
              </label>
            ))}
          </fieldset>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="h-10" onClick={onUseCurrent}>
            Use current date and time
          </Button>
          <Button type="button" variant="outline" className="h-10" onClick={onResetUtc}>
            Reset to UTC
          </Button>
        </div>
      </Accordion>

      <Accordion
        title="Eastern time zones"
        open={draft.easternOpen}
        onToggle={() => onDraftChange({ ...draft, easternOpen: !draft.easternOpen })}
      >
        {EASTERN_ZONE_IDS.map((id) => (
          <ZoneRow
            key={id}
            zoneId={id}
            view={views[id]}
            error={errors[id]}
            hourCycle={draft.hourCycle}
            onEdit={(date, time) => onZoneEdit(id, date, time)}
          />
        ))}
      </Accordion>

      <Accordion
        title="Western time zones"
        open={draft.westernOpen}
        onToggle={() => onDraftChange({ ...draft, westernOpen: !draft.westernOpen })}
      >
        {WESTERN_ZONE_IDS.map((id) => (
          <ZoneRow
            key={id}
            zoneId={id}
            view={views[id]}
            error={errors[id]}
            hourCycle={draft.hourCycle}
            onEdit={(date, time) => onZoneEdit(id, date, time)}
          />
        ))}
      </Accordion>

      <Accordion
        title="Add another time zone"
        open={draft.extrasOpen}
        onToggle={() => onDraftChange({ ...draft, extrasOpen: !draft.extrasOpen })}
      >
        <div className="space-y-1.5">
          <label htmlFor="tz-add-search" className={labelClass}>
            Search cities
          </label>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="tz-add-search"
              className={inputClass}
              value={draft.addQuery}
              placeholder="London, Seoul, Toronto…"
              onChange={(event) => onDraftChange({ ...draft, addQuery: event.target.value })}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            id="tz-add-select"
            className={selectClass}
            defaultValue=""
            aria-label="Add a time zone"
            onChange={(event) => {
              if (event.target.value) onAddZone(event.target.value);
              event.target.value = '';
            }}
          >
            <option value="">Select a city to add</option>
            {addable.map((id) => {
              const zone = ZONE_BY_ID[id];
              return (
                <option key={id} value={id}>
 {zone.city}; {zone.label}
                </option>
              );
            })}
          </select>
        </div>
        {draft.extraZoneIds.map((id) => (
          <ZoneRow
            key={id}
            zoneId={id}
            view={views[id]}
            error={errors[id]}
            hourCycle={draft.hourCycle}
            removable
            onEdit={(date, time) => onZoneEdit(id, date, time)}
            onRemove={() => onRemoveZone(id)}
          />
        ))}
      </Accordion>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
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
