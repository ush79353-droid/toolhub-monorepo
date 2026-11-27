/**
 * Run: cd frontend && npx tsx src/tools/calculators/winters-formula/calculation.test.ts
 */
import {
  calculateWintersFormula,
  expectedPco2MmHg,
  fromMmHg,
  mmHgToKpa,
} from './calculation';
import { createDefaultInput } from './types';
import { validateWintersFormulaInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // HCO3 12 → 26 mmHg, range 24–28
  assert(expectedPco2MmHg(12) === 26, '26');
  const r = calculateWintersFormula({
    bicarbonateText: '12',
    bicarbonateUnit: 'mmol_l',
    resultUnit: 'mmHg',
    showRangeLimits: true,
  });
  assert(r.expectedDisplay === 26, `exp ${r.expectedDisplay}`);
  assert(r.lowerDisplay === 24, `lo ${r.lowerDisplay}`);
  assert(r.upperDisplay === 28, `hi ${r.upperDisplay}`);
}

{
  const r = calculateWintersFormula({
    bicarbonateText: '12',
    bicarbonateUnit: 'meq_l',
    resultUnit: 'kPa',
    showRangeLimits: false,
  });
  const expected = Math.round(mmHgToKpa(26) * 100) / 100;
  assert(r.expectedDisplay === expected, `kPa ${r.expectedDisplay}`);
  assert(
    Math.abs(fromMmHg(26, 'kPa') - mmHgToKpa(26)) < 1e-12,
    'bridge',
  );
}

{
  const v = validateWintersFormulaInput(createDefaultInput());
  assert(v.result != null && v.result.expectedDisplay == null, 'blank');
}

{
  const v = validateWintersFormulaInput({
    bicarbonateText: '0',
    bicarbonateUnit: 'mmol_l',
    resultUnit: 'kPa',
    showRangeLimits: false,
  });
  assert(v.errors.bicarbonateText != null, 'zero');
}

console.log('winters-formula calculation.test.ts: ok');
