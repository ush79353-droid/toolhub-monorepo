/**
 * Run: npx tsx calculation.test.ts
 */
import {
  APPROXIMATE_RULE_OF_THREE,
  calculateHematocritHemoglobinRatio,
  hctToHgbRatio,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHematocritHemoglobinRatioInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateHematocritHemoglobinRatio(createDefaultInput());
  assert(r.ratio === APPROXIMATE_RULE_OF_THREE, 'blank shows rule of three');
  assert(r.isApproximateRuleOfThree, 'blank is approximate');
}

{
  const r = calculateHematocritHemoglobinRatio({
    hematocritPercentText: '42',
    hemoglobinGdlText: '14',
  });
  assert(r.ratio === 3, '42/14 = 3');
  assert(!r.isApproximateRuleOfThree, 'computed not approximate');
}

{
  let threw = false;
  try {
    hctToHgbRatio(42, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero hemoglobin guarded');
}

{
  const v = validateHematocritHemoglobinRatioInput({
    hematocritPercentText: '42',
    hemoglobinGdlText: '0',
  });
  assert(v.errors.hemoglobinGdlText, 'zero hgb field error');
}

console.log('hematocrit-hemoglobin-ratio calculation.test.ts: ok');
