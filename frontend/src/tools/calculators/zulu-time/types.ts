import type { Disambiguation, HourCycle } from '../time-zones/types';

export type SelectMode = 'country' | 'zone';
export type ClockSource = 'zulu' | 'local';

export type { Disambiguation, HourCycle };

export type ZuluTimeFieldErrors = Partial<Record<'date' | 'zulu' | 'local' | 'zone', string>>;

export interface ZuluConversion {
  instant: Date;
  zuluDate: string;
  zuluTime: string;
  zuluTime12: string;
  localDate: string;
  localTime: string;
  localTime12: string;
  offsetLabel: string;
  offsetMinutes: number;
  abbreviation: string;
  iana: string;
  dstActive: boolean;
  status: 'unique' | 'ambiguous' | 'nonexistent' | 'invalid';
  dayDelta: number;
}
