'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import {
  formatDd,
  formatMinutesField,
  formatSecondsField,
  decimalDegreesToDdmDisplay,
  decimalDegreesToDmsDisplay,
} from './calculation';
import {
  MAX_ABS_LATITUDE,
  MAX_ABS_LONGITUDE,
  type CoordinateFormat,
  type CoordinatesFieldErrors,
  type LatitudeHemisphere,
  type LongitudeHemisphere,
} from './types';

export interface CoordinatesDraft {
  format: CoordinateFormat;
  showLetters: boolean;
  latitudeHemisphere: LatitudeHemisphere;
  longitudeHemisphere: LongitudeHemisphere;
  latDegrees: string;
  latMinutes: string;
  latSeconds: string;
  latDecimalMinutes: string;
  lonDegrees: string;
  lonMinutes: string;
  lonSeconds: string;
  lonDecimalMinutes: string;
  formatsOpen: boolean;
  latitudeOpen: boolean;
  longitudeOpen: boolean;
  /** Last-known signed canonical degrees (null while blank/invalid). */
  latitude: number | null;
  longitude: number | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): CoordinatesDraft {
  return {
    format: 'DD',
    showLetters: true,
    latitudeHemisphere: 'N',
    longitudeHemisphere: 'E',
    latDegrees: '',
    latMinutes: '',
    latSeconds: '',
    latDecimalMinutes: '',
    lonDegrees: '',
    lonMinutes: '',
    lonSeconds: '',
    lonDecimalMinutes: '',
    formatsOpen: true,
    latitudeOpen: true,
    longitudeOpen: true,
    latitude: null,
    longitude: null,
  };
}

function axisFieldsFromSigned(
  signed: number | null,
  format: CoordinateFormat,
  showLetters: boolean
): {
  degrees: string;
  minutes: string;
  seconds: string;
  decimalMinutes: string;
} {
  if (signed === null) {
    return { degrees: '', minutes: '', seconds: '', decimalMinutes: '' };
  }
  const magnitude = Math.abs(signed);
  if (format === 'DD') {
    return {
      degrees: formatDd(showLetters ? magnitude : signed),
      minutes: '',
      seconds: '',
      decimalMinutes: '',
    };
  }
  if (format === 'DMS') {
    const parts = decimalDegreesToDmsDisplay(signed);
    return {
      degrees: String(parts.degrees),
      minutes: String(parts.minutes),
      seconds: formatSecondsField(parts.seconds),
      decimalMinutes: '',
    };
  }
  const parts = decimalDegreesToDdmDisplay(signed);
  return {
    degrees: String(parts.degrees),
    minutes: '',
    seconds: '',
    decimalMinutes: formatMinutesField(parts.decimalMinutes),
  };
}

/** Fill visible raw fields from signed canonical coordinates. */
export function draftFromCanonical(
  draft: CoordinatesDraft,
  latitude: number | null,
  longitude: number | null
): CoordinatesDraft {
  const lat = axisFieldsFromSigned(latitude, draft.format, draft.showLetters);
  const lon = axisFieldsFromSigned(longitude, draft.format, draft.showLetters);
  return {
    ...draft,
    latitude,
    longitude,
    latDegrees: lat.degrees,
    latMinutes: lat.minutes,
    latSeconds: lat.seconds,
    latDecimalMinutes: lat.decimalMinutes,
    lonDegrees: lon.degrees,
    lonMinutes: lon.minutes,
    lonSeconds: lon.seconds,
    lonDecimalMinutes: lon.decimalMinutes,
  };
}

interface CoordinatesFormProps {
  draft: CoordinatesDraft;
  errors: CoordinatesFieldErrors;
  onDraftChange: (draft: CoordinatesDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
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
      {open ? <div className="space-y-4 border-t border-border px-3.5 pb-3.5 pt-3">{children}</div> : null}
    </div>
  );
}

function radioClass(selected: boolean): string {
  return `flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
    selected ? 'border-primary bg-primary/5 text-accent' : 'border-border'
  }`;
}

export function CoordinatesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
}: CoordinatesFormProps) {
  const set = (patch: Partial<CoordinatesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert the same geographic location between Decimal Degrees (DD), Degrees Minutes Seconds
        (DMS), and Degrees Decimal Minutes (DDM). Changing format preserves the location. This tool
        does not convert projected systems (UTM, MGRS) or perform geocoding.
      </div>

      <AccordionSection
        title="Coordinates formats"
        open={draft.formatsOpen}
        onToggle={() => set({ formatsOpen: !draft.formatsOpen })}
      >
        <fieldset>
          <legend className={labelClass}>I have the coordinates in…</legend>
          <div className="mt-2 space-y-2">
            {(
              [
                ['DD', 'DD – decimal degrees'],
                ['DMS', 'DMS – degrees with minutes and seconds'],
                ['DDM', 'DDM – degrees with decimal minutes'],
              ] as const
            ).map(([format, label]) => (
              <label key={format} className={radioClass(draft.format === format)}>
                <input
                  type="radio"
                  name="coord-format"
                  checked={draft.format === format}
                  onChange={() => set({ format })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={draft.showLetters}
            onChange={(event) => set({ showLetters: event.target.checked })}
          />
          My coordinates show letters
        </label>
      </AccordionSection>

      <AccordionSection
        title="Latitude"
        open={draft.latitudeOpen}
        onToggle={() => set({ latitudeOpen: !draft.latitudeOpen })}
      >
        {draft.format === 'DD' ? (
          <FieldShell label="Degrees" htmlFor="coord-lat-deg" error={errors.latDegrees || errors.latitude}>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="coord-lat-deg"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.latDegrees}
                  placeholder={`−${MAX_ABS_LATITUDE} to ${MAX_ABS_LATITUDE}`}
                  aria-invalid={Boolean(errors.latDegrees || errors.latitude)}
                  onChange={(event) => set({ latDegrees: event.target.value })}
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                °
              </span>
            </div>
          </FieldShell>
        ) : null}

        {draft.format === 'DMS' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FieldShell label="Degrees" htmlFor="coord-lat-d" error={errors.latDegrees || errors.latitude}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lat-d"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.latDegrees}
                    onChange={(event) => set({ latDegrees: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>°</span>
              </div>
            </FieldShell>
            <FieldShell label="Minutes" htmlFor="coord-lat-m" error={errors.latMinutes}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lat-m"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.latMinutes}
                    onChange={(event) => set({ latMinutes: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>′</span>
              </div>
            </FieldShell>
            <FieldShell label="Seconds" htmlFor="coord-lat-s" error={errors.latSeconds}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lat-s"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.latSeconds}
                    onChange={(event) => set({ latSeconds: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>″</span>
              </div>
            </FieldShell>
          </div>
        ) : null}

        {draft.format === 'DDM' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldShell label="Degrees" htmlFor="coord-lat-ddm-d" error={errors.latDegrees || errors.latitude}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lat-ddm-d"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.latDegrees}
                    onChange={(event) => set({ latDegrees: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>°</span>
              </div>
            </FieldShell>
            <FieldShell label="Decimal minutes" htmlFor="coord-lat-ddm-m" error={errors.latDecimalMinutes}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lat-ddm-m"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.latDecimalMinutes}
                    onChange={(event) => set({ latDecimalMinutes: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>′</span>
              </div>
            </FieldShell>
          </div>
        ) : null}

        {draft.showLetters ? (
          <fieldset>
            <legend className={labelClass}>Cardinal direction</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(['N', 'S'] as const).map((h) => (
                <label key={h} className={radioClass(draft.latitudeHemisphere === h)}>
                  <input
                    type="radio"
                    name="lat-hemi"
                    checked={draft.latitudeHemisphere === h}
                    onChange={() => set({ latitudeHemisphere: h })}
                  />
                  {h === 'N' ? 'N (North)' : 'S (South)'}
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="text-xs text-muted-foreground">
            Signed latitude: positive = North, negative = South.
          </p>
        )}
      </AccordionSection>

      <AccordionSection
        title="Longitude"
        open={draft.longitudeOpen}
        onToggle={() => set({ longitudeOpen: !draft.longitudeOpen })}
      >
        {draft.format === 'DD' ? (
          <FieldShell label="Degrees" htmlFor="coord-lon-deg" error={errors.lonDegrees || errors.longitude}>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="coord-lon-deg"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.lonDegrees}
                  placeholder={`−${MAX_ABS_LONGITUDE} to ${MAX_ABS_LONGITUDE}`}
                  aria-invalid={Boolean(errors.lonDegrees || errors.longitude)}
                  onChange={(event) => set({ lonDegrees: event.target.value })}
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                °
              </span>
            </div>
          </FieldShell>
        ) : null}

        {draft.format === 'DMS' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FieldShell label="Degrees" htmlFor="coord-lon-d" error={errors.lonDegrees || errors.longitude}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lon-d"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.lonDegrees}
                    onChange={(event) => set({ lonDegrees: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>°</span>
              </div>
            </FieldShell>
            <FieldShell label="Minutes" htmlFor="coord-lon-m" error={errors.lonMinutes}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lon-m"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.lonMinutes}
                    onChange={(event) => set({ lonMinutes: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>′</span>
              </div>
            </FieldShell>
            <FieldShell label="Seconds" htmlFor="coord-lon-s" error={errors.lonSeconds}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lon-s"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.lonSeconds}
                    onChange={(event) => set({ lonSeconds: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>″</span>
              </div>
            </FieldShell>
          </div>
        ) : null}

        {draft.format === 'DDM' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldShell label="Degrees" htmlFor="coord-lon-ddm-d" error={errors.lonDegrees || errors.longitude}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lon-ddm-d"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.lonDegrees}
                    onChange={(event) => set({ lonDegrees: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>°</span>
              </div>
            </FieldShell>
            <FieldShell label="Decimal minutes" htmlFor="coord-lon-ddm-m" error={errors.lonDecimalMinutes}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="coord-lon-ddm-m"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.lonDecimalMinutes}
                    onChange={(event) => set({ lonDecimalMinutes: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass}>′</span>
              </div>
            </FieldShell>
          </div>
        ) : null}

        {draft.showLetters ? (
          <fieldset>
            <legend className={labelClass}>Cardinal direction</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(['E', 'W'] as const).map((h) => (
                <label key={h} className={radioClass(draft.longitudeHemisphere === h)}>
                  <input
                    type="radio"
                    name="lon-hemi"
                    checked={draft.longitudeHemisphere === h}
                    onChange={() => set({ longitudeHemisphere: h })}
                  />
                  {h === 'E' ? 'E (East)' : 'W (West)'}
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="text-xs text-muted-foreground">
            Signed longitude: positive = East, negative = West.
          </p>
        )}
      </AccordionSection>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
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
