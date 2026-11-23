/**
 * Allowable Blood Loss — assert-based engine check.
 * Run: npx tsx src/tools/calculators/allowable-blood-loss/calculation.test.ts
 */
import {
  allowableBloodLossMl,
  calculateAllowableBloodLoss,
  estimatedBloodVolumeMl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAllowableBloodLossInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const mabl = allowableBloodLossMl(4550, 12, 12);
  assert(mabl === 0, `equal Hb MABL ${mabl}`);
}

{
  let threw = false;
  try {
    allowableBloodLossMl(4550, 10, 12);
  } catch {
    threw = true;
  }
  assert(threw, 'lowest > initial throws');
}

{
  const ebv = estimatedBloodVolumeMl(70, 'adult_female');
  assert(ebv === 4550, `EBV ${ebv}`);
  const mabl = allowableBloodLossMl(ebv, 14, 10);
  assert(Math.round(mabl) === 1517, `MABL ${mabl}`);
}

{
  const v = validateAllowableBloodLossInput(createDefaultInput());
  assert(v.result != null && v.result.allowableBloodLossMl == null, 'blank');
}

{
  const v = validateAllowableBloodLossInput({
    ...createDefaultInput(),
    weightKgText: '70',
    initialHemoglobinGPerDlText: '10',
    lowestAcceptableHemoglobinGPerDlText: '11',
  });
  assert(
    v.errors.lowestAcceptableHemoglobinGPerDlText != null,
    'ordering error',
  );
}

{
  const r = calculateAllowableBloodLoss({
    ageSexCategory: 'adult_female',
    weightKgText: '70',
    initialHemoglobinGPerDlText: '14',
    lowestAcceptableHemoglobinGPerDlText: '10',
  });
  assert(r.allowableBloodLossMl != null && Math.round(r.allowableBloodLossMl) === 1517, 'calc path');
}

console.log('allowable-blood-loss calculation.test.ts: ok');