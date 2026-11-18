import { parseDateTime } from '../time-zones/calculation';
import { parseClockTime } from './calculation';

export function parseTimeField(raw: string): {
  blank: boolean;
  incomplete: boolean;
  error?: string;
  time24?: string;
} {
  const trimmed = raw.trim();
  if (trimmed === '') return { blank: true, incomplete: false };
  if (
    trimmed === ':' ||
    /^\d{1,2}:$/.test(trimmed) ||
    /^\d{1,2}:\d$/.test(trimmed) ||
    /[AaPp]$/.test(trimmed)
  ) {
    return { blank: false, incomplete: true };
  }
  const parsed = parseClockTime(trimmed);
  if (!parsed) {
    return { blank: false, incomplete: false, error: 'Enter a valid time such as 12:00, 12:00Z, or 7:00 AM.' };
  }
  const hh = String(parsed.hour).padStart(2, '0');
  const mm = String(parsed.minute).padStart(2, '0');
  const ss = parsed.second ? `:${String(parsed.second).padStart(2, '0')}` : '';
  return { blank: false, incomplete: false, time24: `${hh}:${mm}${ss}` };
}

export function parseDateField(raw: string): {
  blank: boolean;
  incomplete: boolean;
  error?: string;
  date?: string;
} {
  const trimmed = raw.trim();
  if (trimmed === '') return { blank: true, incomplete: false };
  if (/^\d{4}-?\d{0,2}-?\d{0,2}$/.test(trimmed) && trimmed.length < 10) {
    return { blank: false, incomplete: true };
  }
  const clock = parseDateTime(trimmed, '00:00');
  if (!clock) {
    return { blank: false, incomplete: false, error: 'Enter a valid calendar date.' };
  }
  return { blank: false, incomplete: false, date: trimmed };
}
