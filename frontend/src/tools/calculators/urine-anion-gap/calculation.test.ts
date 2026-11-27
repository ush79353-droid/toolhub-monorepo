/**
 * Urine Anion Gap — assert-based engine check.
 * Run: npx tsx src/tools/calculators/urine-anion-gap/calculation.test.ts
 */
import {
  calculateUrineAnionGap,
  formatGap,
  urineAnionGap,
} from './calculation';
import { createDefaultInput } from './types';
import { validateUrineAnionGapInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: 40+20−80 = −20
{
  const gap = urineAnionGap(40, 20, 80);
  assert(gap === -20, `fixture ${gap}`);
  assert(formatGap(gap) === '-20', `fmt ${formatGap(gap)}`);
}

{
  const r = calculateUrineAnionGap({
    sodiumText: '40',
    potassiumText: '20',
    chlorideText: '80',
  });
  assert(r.urineAnionGap === -20, 'calc path');
}

{
  const r = calculateUrineAnionGap({
    sodiumText: '40',
    potassiumText: '20',
    chlorideText: '0',
  });
  assert(r.urineAnionGap === 60, 'zero chloride allowed');
}

{
  const r = calculateUrineAnionGap({
    sodiumText: '40',
    potassiumText: '20',
    chlorideText: '',
  });
  assert(r.urineAnionGap === null, 'blank chloride');
}

{
  const v = validateUrineAnionGapInput(createDefaultInput());
  assert(v.result != null && v.result.urineAnionGap == null, 'blank inputs');
}

{
  const v = validateUrineAnionGapInput({
    sodiumText: 'abc',
    potassiumText: '20',
    chlorideText: '80',
  });
  assert(v.errors.sodiumText != null, 'invalid Na');
}

console.log('urine-anion-gap calculation.test.ts: ok');
