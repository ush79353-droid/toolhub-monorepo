export type UnixUnit = 'seconds' | 'milliseconds';

export type ZoneKind = 'fixed' | 'iana';

export interface ZoneEntry {
  id: string;
  label: string;
  kind: ZoneKind;
  /** Fixed offset from UTC in minutes (east positive). */
  offsetMinutes?: number;
  /** IANA identifier for geographical / DST-aware zones. */
  iana?: string;
}

export interface ZoneGroup {
  id: string;
  title: string;
  zones: readonly ZoneEntry[];
}

export type UnixFieldErrors = Partial<Record<'unix' | 'utcDate' | 'utcTime' | 'form', string>>;

export const DEFAULT_UNIX_SECONDS = 1_794_744_000; // 2026-11-15T12:00:00.000Z
export const DEFAULT_UNIT: UnixUnit = 'seconds';

export const UNIT_LABELS: Record<UnixUnit, string> = {
  seconds: 'Seconds (s)',
  milliseconds: 'Milliseconds (ms)',
};
