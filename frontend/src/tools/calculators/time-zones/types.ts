export type ZoneKind = 'fixed' | 'iana';
export type HourCycle = 'h12' | 'h23';
export type Disambiguation = 'earlier' | 'later';
export type ConvertStatus = 'unique' | 'ambiguous' | 'nonexistent' | 'invalid';

export interface WallClock {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface ZoneDef {
  id: string;
  label: string;
  city: string;
  kind: ZoneKind;
  /** Fixed offset from UTC in minutes (east positive). */
  offsetMinutes?: number;
  /** IANA identifier for DST-aware geographic zones. */
  iana?: string;
}

export interface ZoneGroup {
  id: string;
  title: string;
  zoneIds: readonly string[];
}

export interface ZoneInstant {
  date: string;
  time: string;
  time12: string;
  offsetLabel: string;
  offsetMinutes: number;
  abbreviation: string;
  dayDelta?: number;
  iana?: string;
}

export interface ConvertResult {
  status: ConvertStatus;
  instants: Date[];
}

export type TimeZonesFieldErrors = Partial<Record<string, string>>;
