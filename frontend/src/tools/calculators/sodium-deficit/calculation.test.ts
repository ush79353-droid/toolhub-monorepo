/**
 * Run: cd frontend && npx tsx src/tools/calculators/sodium-deficit/calculation.test.ts
 */
import {
  calculateSodiumDeficit,
  sodiumDeficitMmol,
  TBW_FRACTION,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSodiumDeficitInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(TBW_FRACTION.adult_female === 0.5, 'af');
  assert(TBW_FRACTION.elderly_female === 0.45, 'ef');
}

{
  // Omni FAQ: 55 kg adult woman, Na 125, desired 140 → 412.5 mmol
  const d = sodiumDeficitMmol(55, 0.5, 125, 140);
  assert(Math.abs(d - 412.5) < 1e-9, `omni ${d}`);
  const r = calculateSodiumDeficit({
    category: 'adult_female',
    weightText: '55',
    weightUnit: 'kg',
    sodiumText: '125',
    desiredSodiumText: '140',
  });
  assert(r.deficitMmol === 412.5, `display ${r.deficitMmol}`);
  assert(r.formattedDeficit === '412.5', `fmt ${r.formattedDeficit}`);
}

{
  const r = calculateSodiumDeficit({
    category: 'adult_female',
    weightText: '60',
    weightUnit: 'kg',
    sodiumText: '140',
    desiredSodiumText: '140',
  });
  assert(r.deficitMmol === 0, `eq ${r.deficitMmol}`);
}

{
  // Hypernatremia relative to desired → negative / out of scope
  const r = calculateSodiumDeficit({
    category: 'adult_male',
    weightText: '70',
    weightUnit: 'kg',
    sodiumText: '150',
    desiredSodiumText: '140',
  });
  // TBW 42; 42*(140-150)= -420
  assert(r.deficitMmol === -420, `hyper ${r.deficitMmol}`);
  assert(r.statusHeadline.includes('Out of scope'), 'oos');
}

{
  const v = validateSodiumDeficitInput(createDefaultInput());
  assert(v.result != null && v.result.deficitMmol == null, 'blank');
}

{
  const v = validateSodiumDeficitInput({
    ...createDefaultInput(),
    weightText: '0',
    sodiumText: '125',
  });
  assert(v.errors.weightText != null, 'zero weight');
}

console.log('sodium-deficit calculation.test.ts: ok');
