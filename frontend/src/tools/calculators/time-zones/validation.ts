import { parseDateTime } from './calculation';

export function parseDateTimeInput(
  dateStr: string,
  timeStr: string,
): { blank: boolean; incomplete: boolean; error?: string; clock: ReturnType<typeof parseDateTime> } {
  const date = dateStr.trim();
  const time = timeStr.trim();
  if (date === '' && time === '') return { blank: true, incomplete: false, clock: null };
  if (date === '' || time === '') return { blank: false, incomplete: true, clock: null };
  if (/^\d{1,2}:$/.test(time) || /^\d{1,2}:\d{0,1}$/.test(time)) {
    return { blank: false, incomplete: true, clock: null };
  }
  const clock = parseDateTime(date, time);
  if (!clock) {
    return {
      blank: false,
      incomplete: false,
      clock: null,
      error: 'Enter a valid date and time (YYYY-MM-DD and HH:MM).',
    };
  }
  return { blank: false, incomplete: false, clock };
}
