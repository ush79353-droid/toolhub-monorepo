import { parseMilitaryTime } from './calculation';
import type { DayPeriod, ParsedMilitaryTime } from './types';

export function parseMilitaryInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: ParsedMilitaryTime | null;
  error?: string;
} {
  const trimmed = raw.trim();
  if (trimmed === '') return { blank: true, incomplete: false, value: null };

  if (/^\d{1,3}$/.test(trimmed) || /^\d{1,2}:$/.test(trimmed) || /^\d{1,2}:\d{0,1}$/.test(trimmed)) {
    return { blank: false, incomplete: true, value: null };
  }

  try {
    return { blank: false, incomplete: false, value: parseMilitaryTime(trimmed) };
  } catch {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Enter a valid military time from 0000 to 2359 (or 00:00–23:59).',
    };
  }
}

export function parseStandardParts(
  hours: number,
  minutes: number,
  period: DayPeriod,
): { ok: true } | { ok: false; error: string } {
  if (!Number.isInteger(hours) || hours < 1 || hours > 12) {
    return { ok: false, error: 'Hour must be between 1 and 12.' };
  }
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    return { ok: false, error: 'Minutes must be between 00 and 59.' };
  }
  if (period !== 'AM' && period !== 'PM') {
    return { ok: false, error: 'Select AM or PM.' };
  }
  return { ok: true };
}
