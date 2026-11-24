/**
 * Medicine 3 Times a Day Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/medicine-3-times-a-day/calculation.test.ts
 */
import {
  buildDoseMinutesOfDay,
  calculateMedicine3TimesADay,
  formatMinutesOfDay12h,
  intervalMinutesForMode,
  parseHhMm,
  WAKING_WINDOW_MINUTES,
} from './calculation';
import { createExampleInput } from './types';
import { validateMedicine3TimesADayInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Screenshot fixture: 3 doses · 07:00 → 03:00 PM · 11:00 PM
{
  const r = calculateMedicine3TimesADay(createExampleInput());
  assert(r != null, 'example result');
  assert(r.intervalMinutes === 8 * 60, '3 doses → 8h');
  assert(
    r.formattedDoseTimes.join('|') === '07:00 AM|03:00 PM|11:00 PM',
    `screenshot times got ${r.formattedDoseTimes.join('|')}`,
  );
}

// 2 doses → 12h
{
  const r = calculateMedicine3TimesADay({
    mode: 'two',
    firstDoseTime: '08:00',
  });
  assert(r?.intervalMinutes === 12 * 60, '2 doses → 12h');
  assert(
    r?.formattedDoseTimes.join('|') === '08:00 AM|08:00 PM',
    '2-dose schedule',
  );
}

// 4 waking hours: 15h window / 3 = 5h → 7, 12, 5, 10
{
  assert(intervalMinutesForMode('four_waking') === 5 * 60, 'waking 5h');
  assert(WAKING_WINDOW_MINUTES === 15 * 60, '15h waking window');
  const r = calculateMedicine3TimesADay({
    mode: 'four_waking',
    firstDoseTime: '07:00',
  });
  assert(
    r?.formattedDoseTimes.join('|') ===
      '07:00 AM|12:00 PM|05:00 PM|10:00 PM',
    `waking got ${r?.formattedDoseTimes.join('|')}`,
  );
}

// 4 every 6 hours + midnight rollover: 7 → 1 → 7 → 1 AM
{
  const r = calculateMedicine3TimesADay({
    mode: 'four_q6h',
    firstDoseTime: '07:00',
  });
  assert(r?.intervalMinutes === 6 * 60, 'q6h → 6h');
  assert(
    r?.formattedDoseTimes.join('|') ===
      '07:00 AM|01:00 PM|07:00 PM|01:00 AM',
    `q6h got ${r?.formattedDoseTimes.join('|')}`,
  );
}

// Explicit midnight wrap from late first dose
{
  const times = buildDoseMinutesOfDay(22 * 60, 3, 8 * 60);
  assert(
    times.map(formatMinutesOfDay12h).join('|') ===
      '10:00 PM|06:00 AM|02:00 PM',
    '3-dose midnight rollover',
  );
}

// parse / format edges
assert(parseHhMm('07:00') === 7 * 60, 'parse 07:00');
assert(parseHhMm('24:00') == null, 'reject 24:00');
assert(parseHhMm('') == null, 'reject empty');
assert(formatMinutesOfDay12h(0) === '12:00 AM', 'midnight label');
assert(formatMinutesOfDay12h(12 * 60) === '12:00 PM', 'noon label');

// Validation
{
  const blank = validateMedicine3TimesADayInput({
    mode: 'three',
    firstDoseTime: '',
  });
  assert(!blank.isValid && !blank.result, 'blank first dose');

  const bad = validateMedicine3TimesADayInput({
    mode: 'three',
    firstDoseTime: '99:99',
  });
  assert(bad.errors.firstDoseTime, 'invalid time');

  const ok = validateMedicine3TimesADayInput(createExampleInput());
  assert(ok.isValid && ok.result?.doseCount === 3, 'valid example');
}

console.log('medicine-3-times-a-day calculation.test.ts: ok');
