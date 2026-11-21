import { allFromMeters, formatLength } from '../meter-converter/calculation';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'mm Calculator | Omega Calculators',
    '',
    `${formatLength(values.mm)} mm = ${formatLength(values.cm)} cm`,
    `${formatLength(values.mm)} mm = ${formatLength(values.m)} m`,
    `${formatLength(values.mm)} mm ≈ ${formatLength(values.in)} in`,
    '',
    '/tools/mm-calculator',
  ].join('\n');
}
