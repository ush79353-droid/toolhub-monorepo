/**
 * Run: cd frontend && npx tsx src/tools/calculators/bicarbonate-deficit/calculation.test.ts
 */
import {
  bicarbonateDeficitMmol,
  calculateBicarbonateDeficit,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBicarbonateDeficitInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: 72 kg · actual 19 · desired 24 → 180 mmol
  assert(bicarbonateDeficitMmol(72, 19, 24) === 180, '180 mmol');
  const r = calculateBicarbonateDeficit({
    weightText: '72',
    weightUnit: 'kg',
    actualBicarbText: '19',
    desiredBicarbText: '24',
  });
  assert(r.deficitMmol === 180, `deficit ${r.deficitMmol}`);
  assert(r.concentrationGapMmolL === 5, `gap ${r.concentrationGapMmolL}`);
  assert(r.formattedDeficit === '180', `fmt ${r.formattedDeficit}`);
}

{
  // Equal levels → zero amount
  const r = calculateBicarbonateDeficit({
    weightText: '70',
    weightUnit: 'kg',
    actualBicarbText: '24',
    desiredBicarbText: '24',
  });
  assert(r.deficitMmol === 0, `zero ${r.deficitMmol}`);
  assert(r.concentrationGapMmolL === 0, 'gap0');
}

{
  // lb parity: 72 / 0.45359237 ≈ 158.733 lb → same rounded mmol
  const lb = 72 / 0.45359237;
  const kg = weightToKg(lb, 'lb');
  assert(Math.abs(kg - 72) < 1e-9, `lb→kg ${kg}`);
  const r = calculateBicarbonateDeficit({
    weightText: String(lb),
    weightUnit: 'lb',
    actualBicarbText: '19',
    desiredBicarbText: '24',
  });
  assert(r.deficitMmol === 180, `lb deficit ${r.deficitMmol}`);
}

{
  const v = validateBicarbonateDeficitInput(createDefaultInput());
  assert(v.result != null && v.result.deficitMmol == null, 'blank weight');
  assert(createDefaultInput().desiredBicarbText === '24', 'default 24');
}

{
  const v = validateBicarbonateDeficitInput({
    weightText: '0',
    weightUnit: 'kg',
    actualBicarbText: '19',
    desiredBicarbText: '24',
  });
  assert(v.errors.weightText != null, 'zero weight');
}

{
  // Actual above desired → negative deficit (surplus), still finite
  const r = calculateBicarbonateDeficit({
    weightText: '80',
    weightUnit: 'kg',
    actualBicarbText: '28',
    desiredBicarbText: '24',
  });
  assert(r.deficitMmol === -160, `surplus ${r.deficitMmol}`);
}

console.log('bicarbonate-deficit calculation.test.ts: ok');
