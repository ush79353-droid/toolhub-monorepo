/**
 * Run: cd frontend && npx tsx src/tools/calculators/sodium-correction-rate/calculation.test.ts
 */
import {
  calculateSodiumCorrectionRate,
  changePerLiterMeq,
  flowMlPerHour,
  TBW_FRACTION,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSodiumCorrectionRateInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 0.05): boolean {
  return Math.abs(a - b) <= eps;
}

// Fixture: adult male 70 kg, Na 120, 2% NaCl (342), aimed 0.5 → ~97 mL/h (Omni FAQ)
{
  const tbw = 70 * TBW_FRACTION.adult_male;
  assert(tbw === 42, `tbw expected 42 got ${tbw}`);
  const delta = changePerLiterMeq(342, 0, 120, tbw);
  assert(approx(delta, 222 / 43, 0.01), `delta ${delta}`);
  const flow = flowMlPerHour(0.5, delta);
  assert(flow !== null && approx(flow, 97, 0.5), `flow ${flow}`);
}

{
  const r = calculateSodiumCorrectionRate({
    category: 'adult_male',
    weightText: '70',
    weightUnit: 'kg',
    sodiumText: '120',
    fluid: 'nacl_2',
    aimedChangeText: '0.5',
  });
  assert(r.tbwL === 42, 'tbwL');
  assert(r.flowMlPerHr !== null && approx(r.flowMlPerHr, 97, 0.5), `flow result ${r.flowMlPerHr}`);
  assert(r.showAdvanced, 'advanced fields');
}

// 70 kg man, Na 110, 3% saline → ΔNa/L ≈ 9.37
{
  const r = calculateSodiumCorrectionRate({
    category: 'adult_male',
    weightText: '70',
    weightUnit: 'kg',
    sodiumText: '110',
    fluid: 'nacl_3',
    aimedChangeText: '0.5',
  });
  assert(
    r.changePerLiter !== null && approx(r.changePerLiter, 9.37, 0.02),
    `3% delta ${r.changePerLiter}`,
  );
}

// Infusate matches serum → zero delta
{
  const r = calculateSodiumCorrectionRate({
    category: 'adult_male',
    weightText: '70',
    weightUnit: 'kg',
    sodiumText: '154',
    fluid: 'nacl_09',
    aimedChangeText: '0.5',
  });
  assert(r.changePerLiter === 0, 'zero delta');
  assert(r.flowMlPerHr == null, 'no flow when delta 0');
}

// Defaults: adult male, blank → no advanced until weight+Na
{
  const v = validateSodiumCorrectionRateInput(createDefaultInput());
  assert(v.result !== null && v.result.showAdvanced === false, 'default blank');
}

console.log('sodium-correction-rate calculation.test.ts: ok');
