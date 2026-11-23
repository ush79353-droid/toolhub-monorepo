/**
 * Run: npx tsx src/tools/calculators/flange-size/calculation.test.ts
 */
import {
  MAX_SUPPORTED_MM,
  diameterToMm,
  mmToDiameterUnit,
  suggestSpectraFlangeMm,
} from './calculation';
import { validateFlangeSizeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(suggestSpectraFlangeMm(12).flangeMm === 16, '12 → 16');
assert(suggestSpectraFlangeMm(12.01).flangeMm === 20, 'just over 12 → 20');
assert(suggestSpectraFlangeMm(16).flangeMm === 20, '16 → 20');
assert(suggestSpectraFlangeMm(20).flangeMm === 24, '20 → 24');
assert(suggestSpectraFlangeMm(24).flangeMm === 28, '24 → 28');
assert(suggestSpectraFlangeMm(28).flangeMm === 32, '28 → 32');
assert(suggestSpectraFlangeMm(28.01).status === 'outOfRangeHigh', '>28 high');
assert(suggestSpectraFlangeMm(0).status === 'outOfRangeLow', '0 low');
assert(suggestSpectraFlangeMm(18).flangeMm === 24, '18 → 24');

assert(diameterToMm(1, 'in') === 25.4, '1 in → 25.4 mm');
assert(Math.abs(mmToDiameterUnit(25.4, 'in') - 1) < 1e-12, 'round-trip in');

const ok = validateFlangeSizeInput({
  diameterValue: '18',
  diameterUnit: 'mm',
});
assert(ok.isValid && ok.result?.flangeSizeMm === 24, 'validate 18→24');

const blank = validateFlangeSizeInput({
  diameterValue: '',
  diameterUnit: 'mm',
});
assert(!blank.isValid && blank.result === null, 'blank');

const high = validateFlangeSizeInput({
  diameterValue: String(MAX_SUPPORTED_MM + 1),
  diameterUnit: 'mm',
});
assert(high.isValid && high.result?.fitStatus === 'outOfRangeHigh', 'high');

console.log('flange-size calculation.test.ts: ok');
