'use client';

import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  COUNTRIES,
  DEFAULT_COUNTRY_ID,
  DEFAULT_IANA,
  allIanaOptions,
  zonesForCountry,
} from './countries';
import type {
  ClockSource,
  Disambiguation,
  HourCycle,
  SelectMode,
  ZuluTimeFieldErrors,
} from './types';

export interface ZuluTimeDraft {
  mode: SelectMode;
  countryId: string;
  iana: string;
  date: string;
  zuluTime: string;
  localTime: string;
  hourCycle: HourCycle;
  disambiguation: Disambiguation;
  source: ClockSource;
  countryOpen: boolean;
  converterOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function defaultDraft(now = new Date()): ZuluTimeDraft {
  return {
    mode: 'country',
    countryId: DEFAULT_COUNTRY_ID,
    iana: DEFAULT_IANA,
    date: now.toISOString().slice(0, 10),
    zuluTime: '12:00',
    localTime: '',
    hourCycle: 'h12',
    disambiguation: 'earlier',
    source: 'zulu',
    countryOpen: true,
    converterOpen: true,
  };
}

export function emptyDraft(base: Pick<ZuluTimeDraft, 'mode' | 'countryId' | 'iana' | 'hourCycle'>): ZuluTimeDraft {
  return {
    ...defaultDraft(new Date(0)),
    ...base,
    date: '',
    zuluTime: '',
    localTime: '',
    source: 'zulu',
  };
}

interface ZuluTimeFormProps {
  draft: ZuluTimeDraft;
  errors: ZuluTimeFieldErrors;
  dstActive: boolean;
  ambiguous: boolean;
  onDraftChange: (draft: ZuluTimeDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) => option.label.toLowerCase().includes(q) || option.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={`${id}-search`}
        className="h-9 w-full rounded-lg border border-border bg-muted/30 px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
        value={query}
        placeholder={`Search ${label.toLowerCase()}`}
        aria-label={`Search ${label}`}
        onChange={(event) => setQuery(event.target.value)}
      />
      <select
        id={id}
        className={selectClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {filtered.length === 0 ? (
          <option value={value}>No matches</option>
        ) : (
          filtered.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

export function ZuluTimeForm({
  draft,
  errors,
  dstActive,
  ambiguous,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: ZuluTimeFormProps) {
  const countryZones = zonesForCountry(draft.countryId);
  const ianaOptions = useMemo(() => allIanaOptions(), []);
  const countryOptions = COUNTRIES.map((country) => ({ value: country.id, label: country.name }));

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.countryOpen}
          onClick={() => onDraftChange({ ...draft, countryOpen: !draft.countryOpen })}
        >
          <span>Select country/time zone</span>
          {draft.countryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.countryOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <fieldset className="space-y-2">
              <legend className={labelClass}>I want to select:</legend>
              {(['country', 'zone'] as const).map((mode) => (
                <label key={mode} className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
                  <input
                    type="radio"
                    name="zulu-select-mode"
                    className="h-4 w-4 accent-primary"
                    checked={draft.mode === mode}
                    onChange={() => onDraftChange({ ...draft, mode })}
                  />
                  <span>{mode === 'country' ? 'Country' : 'Time zone'}</span>
                </label>
              ))}
            </fieldset>

            {draft.mode === 'country' ? (
              <>
                <FilterSelect
                  id="zulu-country"
                  label="Country"
                  value={draft.countryId}
                  options={countryOptions}
                  onChange={(countryId) => {
                    const nextZones = zonesForCountry(countryId);
                    const iana =
                      nextZones.some((zone) => zone.iana === draft.iana)
                        ? draft.iana
                        : (nextZones[0]?.iana ?? draft.iana);
                    onDraftChange({ ...draft, countryId, iana });
                  }}
                />
                <div className="space-y-1.5">
                  <label htmlFor="zulu-country-zone" className={labelClass}>
                    Time zone
                  </label>
                  <select
                    id="zulu-country-zone"
                    className={selectClass}
                    value={draft.iana}
                    onChange={(event) => onDraftChange({ ...draft, iana: event.target.value })}
                  >
                    {countryZones.map((zone) => (
                      <option key={zone.iana} value={zone.iana}>
                        {zone.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <FilterSelect
                id="zulu-iana"
                label="Time zone"
                value={draft.iana}
                options={ianaOptions.map((zone) => ({ value: zone.iana, label: zone.label }))}
                onChange={(iana) => onDraftChange({ ...draft, iana })}
              />
            )}
            {errors.zone ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.zone}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.converterOpen}
          onClick={() => onDraftChange({ ...draft, converterOpen: !draft.converterOpen })}
        >
          <span>Zulu time converter</span>
          {draft.converterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.converterOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <label className="flex items-start gap-2.5 text-sm text-accent">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-primary"
                checked={dstActive}
                disabled
                aria-disabled="true"
              />
              <span>
                Daylight saving time is active
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  Determined from the selected IANA zone and date. Not a manual override.
                </span>
              </span>
            </label>

            <fieldset className="space-y-2">
              <legend className={labelClass}>Time format</legend>
              <div className="flex flex-wrap gap-3">
                {(['h12', 'h23'] as const).map((cycle) => (
                  <label key={cycle} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
                    <input
                      type="radio"
                      name="zulu-hour-cycle"
                      className="h-4 w-4 accent-primary"
                      checked={draft.hourCycle === cycle}
                      onChange={() => onDraftChange({ ...draft, hourCycle: cycle })}
                    />
                    <span>{cycle === 'h12' ? '12-hour' : '24-hour / Zulu'}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <label htmlFor="zulu-date" className={labelClass}>
                Conversion date
              </label>
              <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="zulu-date"
                  type="date"
                  className={inputClass}
                  value={draft.date}
                  aria-invalid={Boolean(errors.date)}
                  onChange={(event) =>
                    onDraftChange({ ...draft, date: event.target.value, source: draft.source })
                  }
                />
              </div>
              {errors.date ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.date}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="zulu-time" className={labelClass}>
                Zulu time
              </label>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="zulu-time"
                    type="time"
                    step={60}
                    className={inputClass}
                    value={draft.zuluTime.slice(0, 5)}
                    aria-invalid={Boolean(errors.zulu)}
                    onChange={(event) =>
                      onDraftChange({ ...draft, zuluTime: event.target.value, source: 'zulu' })
                    }
                  />
                </div>
                <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-accent">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Clock</span>
                </span>
              </div>
              {errors.zulu ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.zulu}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="zulu-local" className={labelClass}>
                Local time
              </label>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="zulu-local"
                    type="time"
                    step={60}
                    className={inputClass}
                    value={draft.localTime.slice(0, 5)}
                    aria-invalid={Boolean(errors.local)}
                    onChange={(event) =>
                      onDraftChange({ ...draft, localTime: event.target.value, source: 'local' })
                    }
                  />
                </div>
                <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-accent">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Clock</span>
                </span>
              </div>
              {errors.local ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.local}
                </p>
              ) : null}
            </div>

            {ambiguous ? (
              <fieldset className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
                <legend className="text-xs font-medium text-amber-950">
                  This local time is ambiguous (clocks fell back)
                </legend>
                {(['earlier', 'later'] as const).map((choice) => (
                  <label key={choice} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
                    <input
                      type="radio"
                      name="zulu-fold"
                      className="h-4 w-4 accent-primary"
                      checked={draft.disambiguation === choice}
                      onChange={() =>
                        onDraftChange({ ...draft, disambiguation: choice, source: 'local' })
                      }
                    />
                    <span>{choice === 'earlier' ? 'Earlier occurrence (DST still on)' : 'Later occurrence (standard time)'}</span>
                  </label>
                ))}
              </fieldset>
            ) : null}
          </div>
        ) : null}
      </div>

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
