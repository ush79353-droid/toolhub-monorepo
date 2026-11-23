/**
 * Nuchal Translucency — assert-based engine check.
 * Run: npx tsx src/tools/calculators/nuchal-translucency/calculation.test.ts
 * componentKey: NuchalTranslucencyCalculator
 */
import {
  centileNtAtCrl,
  centileSnapshotAtCrl,
  expectedNtMmFromCrl,
  gestationalAgeDaysFromCrlMm,
  percentileFromNtAtCrl,
} from './calculation';
import { validateNuchalTranslucencyInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Chung expected NT at CRL 45 → ~1.32 mm
{
  const nt = expectedNtMmFromCrl(45);
  assert(nt != null && Math.abs(nt - 1.32) < 0.005, 'Chung CRL 45 → 1.32');
}

// Robinson CRL 45 → 78 days (not screenshot 79)
assert(gestationalAgeDaysFromCrlMm(45) === 78, 'Robinson 45 → 78 days');

// Percentile interpolation: CRL 45, NT 1.34 between 75th (1.1) and 95th (1.8) ~82nd
{
  const snap = centileSnapshotAtCrl(45);
  assert(Math.abs(snap.p75 - 1.1) < 0.01, 'table 75th at CRL 45');
  assert(Math.abs(snap.p95 - 1.8) < 0.01, 'table 95th at CRL 45');
  const p = percentileFromNtAtCrl(1.34, 45);
  assert(p > 75 && p < 95, '1.34 not forced to 75th');
  assert(p >= 80 && p <= 84, '~82nd for 1.34 at CRL 45');
  assert(p !== 75, 'do not assert screenshot 75th claim');
}

// Centile interpolation between knots
{
  const nt55 = centileNtAtCrl(55, 50);
  assert(Math.abs(nt55 - 1.2) < 0.001, '50th at CRL 55');
  const nt525 = centileNtAtCrl(52.5, 50);
  assert(nt525 > 1.1 && nt525 < 1.2, '50th midway 50–55 CRL');
}

// Blank inactive
{
  const v = validateNuchalTranslucencyInput({
    crlMm: '',
    estimateGaDays: '',
    gaDisplayUnit: 'days',
    estimateLastEdit: null,
    measuredNtMm: '',
    assessGaDays: '',
    assessGaDisplayUnit: 'days',
    assessGaMode: 'synced',
    estimateSectionOpen: true,
    assessSectionOpen: true,
  });
  assert(!v.isValid && !v.result, 'blank form inactive');
}

// Below 95th → normal range
{
  const v = validateNuchalTranslucencyInput({
    crlMm: '45',
    estimateGaDays: '78',
    gaDisplayUnit: 'days',
    estimateLastEdit: 'crl',
    measuredNtMm: '1.0',
    assessGaDays: '78',
    assessGaDisplayUnit: 'days',
    assessGaMode: 'synced',
    estimateSectionOpen: true,
    assessSectionOpen: true,
  });
  assert(v.result?.assess?.withinNormalRange === true, 'NT 1.0 below 95th');
}

// At/above 95th
{
  const v = validateNuchalTranslucencyInput({
    crlMm: '45',
    estimateGaDays: '78',
    gaDisplayUnit: 'days',
    estimateLastEdit: 'crl',
    measuredNtMm: '2.0',
    assessGaDays: '78',
    assessGaDisplayUnit: 'days',
    assessGaMode: 'synced',
    estimateSectionOpen: true,
    assessSectionOpen: true,
  });
  assert(v.result?.assess?.withinNormalRange === false, 'NT 2.0 above 95th');
}

// Example fixture estimate
{
  const v = validateNuchalTranslucencyInput({
    crlMm: '45',
    estimateGaDays: '78',
    gaDisplayUnit: 'days',
    estimateLastEdit: 'crl',
    measuredNtMm: '1.34',
    assessGaDays: '78',
    assessGaDisplayUnit: 'days',
    assessGaMode: 'synced',
    estimateSectionOpen: true,
    assessSectionOpen: true,
  });
  assert(
    v.result?.estimate?.expectedNtMm != null &&
      Math.abs(v.result.estimate.expectedNtMm - 1.32) < 0.01,
    'example expected NT',
  );
  const p = v.result?.assess?.percentile;
  assert(p != null && p > 75 && p < 95, 'example NT percentile band');
}

console.log('nuchal-translucency calculation.test.ts: ok');