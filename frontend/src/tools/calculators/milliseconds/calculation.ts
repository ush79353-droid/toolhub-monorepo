import type { DecimalValue } from '../billion-to-trillion/types';
import {
  convertTime,
  formatTimeValue,
  fromSeconds,
  toSeconds,
  TIME_UNIT_SECONDS,
} from '../time-unit/calculation';
import {
  CORE_UNITS,
  MS_PER_SECOND,
  TIME_UNIT_DEFS,
  type CoreTimeUnit,
  type OtherTimeUnit,
  type TimeUnit,
} from './types';

export {
  convertTime,
  formatTimeValue,
  fromSeconds,
  toSeconds,
  TIME_UNIT_SECONDS,
  MS_PER_SECOND,
};

export function syncFromSeconds(
  seconds: DecimalValue,
  otherUnit: OtherTimeUnit,
): { texts: Record<CoreTimeUnit, string>; otherText: string } {
  const texts = {} as Record<CoreTimeUnit, string>;
  for (const unit of CORE_UNITS) {
    texts[unit] = formatTimeValue(fromSeconds(seconds, unit));
  }
  return {
    texts,
    otherText: formatTimeValue(fromSeconds(seconds, otherUnit)),
  };
}

export function shareResultText(seconds: DecimalValue): string {
  const ms = formatTimeValue(fromSeconds(seconds, 'milliseconds'));
  const s = formatTimeValue(fromSeconds(seconds, 'seconds'));
  const min = formatTimeValue(fromSeconds(seconds, 'minutes'));
  const h = formatTimeValue(fromSeconds(seconds, 'hours'));
  return [
    'Milliseconds Converter | Omega Calculators',
    '',
    `${ms} ms =`,
    `${s} second${s === '1' ? '' : 's'}`,
    `${min} minutes`,
    `${h} hours`,
    '',
    `1 second = ${MS_PER_SECOND} milliseconds`,
    '',
    'Years use the shared Julian convention: 1 average year = 365.25 days.',
    '',
    '/tools/milliseconds-converter',
  ].join('\n');
}

export function summaryRows(
  seconds: DecimalValue,
): readonly { unit: TimeUnit; value: string }[] {
  return (['milliseconds', 'seconds', 'minutes', 'hours'] as const).map((unit) => ({
    unit,
    value: formatTimeValue(fromSeconds(seconds, unit)),
  }));
}

export { TIME_UNIT_DEFS };
