/**
 * Run: npx tsx src/tools/calculators/carboplatin/calculation.test.ts
 */
import {
  cockcroftGaultGfrMlMin,
  calvertDoseMg,
  calculateCarboplatin,
  EXAMPLE_MALE,
  GFR_CAP_ML_MIN,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCarboplatinInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const gfr = cockcroftGaultGfrMlMin(
    EXAMPLE_MALE.sex,
    EXAMPLE_MALE.age,
    EXAMPLE_MALE.weightKg,
    EXAMPLE_MALE.scrMgDl,
  );
  assert(Math.abs(gfr - 100) < 0.5, `male GFR ${gfr}`);
  const dose = calvertDoseMg(EXAMPLE_MALE.targetAuc, gfr);
  assert(Math.abs(dose - 625) < 0.5, `dose ${dose}`);
}

{
  const gfr = cockcroftGaultGfrMlMin('female', 60, 65, 1.2);
  const male = cockcroftGaultGfrMlMin('male', 60, 65, 1.2);
  assert(gfr < male, 'female 0.85 factor');
}

{
  const r = calculateCarboplatin({
    ...createDefaultInput(),
    ageYearsText: '50',
    weightText: '80',
    scrMgDlText: '1',
    targetAucText: '5',
  });
  assert(
    r.gfrMlMin != null &&
      Math.abs(r.carboplatinDoseMg! - 625) < 1 &&
      r.maximumDoseMg! >= r.carboplatinDoseMg!,
    'full calc',
  );
}

{
  const highGfr = cockcroftGaultGfrMlMin('male', 25, 90, 0.7);
  assert(highGfr > GFR_CAP_ML_MIN, 'high gfr for cap test');
  const r = calculateCarboplatin({
    ...createDefaultInput(),
    ageYearsText: '25',
    weightText: '90',
    scrMgDlText: '0.7',
    targetAucText: '6',
  });
  assert(r.gfrUsedForMax === GFR_CAP_ML_MIN, 'cap applied');
}

{
  const v = validateCarboplatinInput(createDefaultInput());
  assert(v.result != null && v.result.gfrMlMin == null, 'blank');
}

console.log('carboplatin calculation.test.ts: ok');