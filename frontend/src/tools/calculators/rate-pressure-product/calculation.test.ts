/**
 * Rate Pressure Product — assert-based engine check.
 * Run: npx tsx src/tools/calculators/rate-pressure-product/calculation.test.ts
 */
import {
  calculateRatePressureProduct,
  formatProduct,
  ratePressureProduct,
} from './calculation';
import { createDefaultInput } from './types';
import { validateRatePressureProductInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: 150 × 160 = 24,000
{
  const p = ratePressureProduct(150, 160);
  assert(p === 24000, `product ${p}`);
  assert(formatProduct(p) === '24,000', `fmt ${formatProduct(p)}`);
}

{
  let threw = false;
  try {
    ratePressureProduct(-10, 120);
  } catch {
    threw = true;
  }
  assert(threw, 'negative HR throws');
}

{
  let threw = false;
  try {
    ratePressureProduct(150, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero SBP throws');
}

{
  const v = validateRatePressureProductInput(createDefaultInput());
  assert(v.result != null && v.result.product == null, 'blank');
}

{
  const v = validateRatePressureProductInput({
    heartRateText: '150',
    systolicBpText: '',
  });
  assert(v.result != null && v.result.product == null, 'partial');
}

{
  const v = validateRatePressureProductInput({
    heartRateText: '-5',
    systolicBpText: '120',
  });
  assert(v.errors.heartRateText != null, 'neg error');
  assert(v.result == null, 'invalid null result');
}

{
  const r = calculateRatePressureProduct({
    heartRateText: '150',
    systolicBpText: '160',
  });
  assert(r.product === 24000, 'calc path');
}

console.log('rate-pressure-product calculation.test.ts: ok');
