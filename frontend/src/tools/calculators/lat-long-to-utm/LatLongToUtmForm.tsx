'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import {
  decimalDegreesToDmsDisplay,
  formatDd,
  formatSecondsField,
  latitudeHemisphereFromSigned,
  longitudeHemisphereFromSigned,
} from './calculation';
import {
  MAX_ABS_LATITUDE,
  MAX_ABS_LONGITUDE,
  type CoordinateType,
  type LatLongToUtmFieldErrors,
  type LatitudeHemisphere,
  type LongitudeHemisphere,
} from './types';

export interface LatLongToUtmDraft {
  coordinateType: CoordinateType;
  latDd: string;
  lonDd: string;
  latDegrees: string;
  latMinutes: string;
  latSeconds: string;
  lonDegrees: string;
  lonMinutes: string;
  lonSeconds: string;
  latitudeHemisphere: LatitudeHemisphere;
  longitudeHemisphere: LongitudeHemisphere;
  gpsOpen: boolean;
  /** Canonical signed DD while valid; null when blank/invalid. */
  latitude: number | null;
  longitude: number | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): LatLongToUtmDraft {
  return {
    coordinateType: 'DD',
    latDd: '',
    lonDd: '',
    latDegrees: '',
    latMinutes: '',
    latSeconds: '',
    lonDegrees: '',
    lonMinutes: '',
    lonSeconds: '',
    latitudeHemisphere: 'N',
    longitudeHemisphere: 'E',
    gpsOpen: true,
    latitude: null,
    longitude: null,
  };
}

function axisFromSigned(
  signed: number | null,
  coordinateType: CoordinateType
): { dd: string; degrees: string; minutes: string; seconds: string } {
  if (signed === null) {
    return { dd: '', degrees: '', minutes: '', seconds: '' };
  }
  if (coordinateType === 'DD') {
    return {
      dd: formatDd(signed),
      degrees: '',
      minutes: '',
      seconds: '',
    };
  }
  const parts = decimalDegreesToDmsDisplay(signed);
  return {
    dd: '',
    degrees: String(parts.degrees),
    minutes: String(parts.minutes),
    seconds: formatSecondsField(parts.seconds),
  };
}

/** Rewrite visible fields from canonical signed coordinates. */
export function draftFromCanonical(
  draft: LatLongToUtmDraft,
  latitude: number | null,
  longitude: number | null
): LatLongToUtmDraft {
  const lat = axisFromSigned(latitude, draft.coordinateType);
  const lon = axisFromSigned(longitude, draft.coordinateType);
  return {
    ...draft,
    latitude,
    longitude,
    latitudeHemisphere:
      latitude === null ? draft.latitudeHemisphere : latitudeHemisphereFromSigned(latitude),
    longitudeHemisphere:
      longitude === null ? draft.longitudeHemisphere : longitudeHemisphereFromSigned(longitude),
    latDd: lat.dd,
    lonDd: lon.dd,
    latDegrees: lat.degrees,
    latMinutes: lat.minutes,
    latSeconds: lat.seconds,
    lonDegrees: lon.degrees,
    lonMinutes: lon.minutes,
    lonSeconds: lon.seconds,
  };
}

interface LatLongToUtmFormProps {
  draft: LatLongToUtmDraft;
  errors: LatLongToUtmFieldErrors;
  onDraftChange: (draft: LatLongToUtmDraft) => void;
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

export function LatLongToUtmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
}: LatLongToUtmFormProps) {
  const set = (patch: Partial<LatLongToUtmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts WGS84 latitude and longitude to UTM zone, hemisphere, easting, and northing
        (meters). Standard UTM coverage is 80°S to 84°N. Signed decimal degrees: +N/+E, −S/−W.
      </div>

      <fieldset>
        <legend className={labelClass}>Coordinate type</legend>
        <div className="mt-2 space-y-2">
          <label className={radioClass(draft.coordinateType === 'DD')}>
            <input
              type="radio"
              name="utm-coord-type"
              checked={draft.coordinateType === 'DD'}
              onChange={() => set({ coordinateType: 'DD' })}
            />
            Decimal degrees
          </label>
          <label className={radioClass(draft.coordinateType === 'DMS')}>
            <input
              type="radio"
              name="utm-coord-type"
              checked={draft.coordinateType === 'DMS'}
              onChange={() => set({ coordinateType: 'DMS' })}
            />
            Degrees, minutes, seconds
          </label>
        </div>
      </fieldset>

      <AccordionSection
        title="Latitude & longitude (GPS coordinates)"
        open={draft.gpsOpen}
        onToggle={() => set({ gpsOpen: !draft.gpsOpen })}
      >
        {draft.coordinateType === 'DD' ? (
          <>
            <FieldShell
              label="Latitude"
              htmlFor="utm-lat-dd"
              error={errors.latitude || errors.coverage}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="utm-lat-dd"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.latDd}
                    placeholder={`−${MAX_ABS_LATITUDE} to ${MAX_ABS_LATITUDE}`}
                    aria-invalid={Boolean(errors.latitude || errors.coverage)}
                    onChange={(event) => set({ latDd: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  °
                </span>
              </div>
            </FieldShell>
            <FieldShell label="Longitude" htmlFor="utm-lon-dd" error={errors.longitude}>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="utm-lon-dd"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.lonDd}
                    placeholder={`−${MAX_ABS_LONGITUDE} to ${MAX_ABS_LONGITUDE}`}
                    aria-invalid={Boolean(errors.longitude)}
                    onChange={(event) => set({ lonDd: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  °
                </span>
              </div>
            </FieldShell>
            <p className="text-xs text-muted-foreground">
              Positive latitude = North; negative = South. Positive longitude = East; negative =
              West.
            </p>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <p className="text-sm font-medium text-accent">Latitude</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldShell
                  label="Degrees"
                  htmlFor="utm-lat-d"
                  error={errors.latDegrees || errors.latitude || errors.coverage}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="utm-lat-d"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.latDegrees}
                        onChange={(event) => set({ latDegrees: event.target.value })}
                      />
                    </div>
                    <span className={unitBadgeClass}>°</span>
                  </div>
                </FieldShell>
                <FieldShell label="Minutes" htmlFor="utm-lat-m" error={errors.latMinutes}>
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="utm-lat-m"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.latMinutes}
                        onChange={(event) => set({ latMinutes: event.target.value })}
                      />
                    </div>
                    <span className={unitBadgeClass}>′</span>
                  </div>
                </FieldShell>
                <FieldShell label="Seconds" htmlFor="utm-lat-s" error={errors.latSeconds}>
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="utm-lat-s"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.latSeconds}
                        onChange={(event) => set({ latSeconds: event.target.value })}
                      />
                    </div>
                    <span className={unitBadgeClass}>″</span>
                  </div>
                </FieldShell>
                <div className="space-y-1.5">
                  <label htmlFor="utm-lat-hemi" className={labelClass}>
                    Hemisphere
                  </label>
                  <select
                    id="utm-lat-hemi"
                    className={selectClass}
                    value={draft.latitudeHemisphere}
                    onChange={(event) =>
                      set({ latitudeHemisphere: event.target.value as LatitudeHemisphere })
                    }
                  >
                    <option value="N">N</option>
                    <option value="S">S</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-accent">Longitude</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldShell
                  label="Degrees"
                  htmlFor="utm-lon-d"
                  error={errors.lonDegrees || errors.longitude}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="utm-lon-d"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.lonDegrees}
                        onChange={(event) => set({ lonDegrees: event.target.value })}
                      />
                    </div>
                    <span className={unitBadgeClass}>°</span>
                  </div>
                </FieldShell>
                <FieldShell label="Minutes" htmlFor="utm-lon-m" error={errors.lonMinutes}>
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="utm-lon-m"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.lonMinutes}
                        onChange={(event) => set({ lonMinutes: event.target.value })}
                      />
                    </div>
                    <span className={unitBadgeClass}>′</span>
                  </div>
                </FieldShell>
                <FieldShell label="Seconds" htmlFor="utm-lon-s" error={errors.lonSeconds}>
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="utm-lon-s"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.lonSeconds}
                        onChange={(event) => set({ lonSeconds: event.target.value })}
                      />
                    </div>
                    <span className={unitBadgeClass}>″</span>
                  </div>
                </FieldShell>
                <div className="space-y-1.5">
                  <label htmlFor="utm-lon-hemi" className={labelClass}>
                    Hemisphere
                  </label>
                  <select
                    id="utm-lon-hemi"
                    className={selectClass}
                    value={draft.longitudeHemisphere}
                    onChange={(event) =>
                      set({ longitudeHemisphere: event.target.value as LongitudeHemisphere })
                    }
                  >
                    <option value="E">E</option>
                    <option value="W">W</option>
                  </select>
                </div>
              </div>
            </div>
          </>
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
