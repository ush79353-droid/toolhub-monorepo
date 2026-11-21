/**
 * Tylenol Dosage — engine self-check.
 * Run: npx --yes tsx src/tools/calculators/tylenol-dosage/calculation.test.ts
 */

import {
  buildDoseLine,
  buildMaxLine,
  calculateTylenolDosage,
  productMatchesSymptom,
} from './calculation';
import { createDefaultInput, getProduct } from './types';
import { validateTylenolDosageInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const regular = getProduct('regular_strength');
assert(
  buildDoseLine(regular) ===
    'Take 2 tablets every 4 to 6 hours while symptoms last.',
  'regular dose line',
);
assert(buildMaxLine(regular).includes('10 tablets'), 'regular max 10');
assert(regular.maxAcetaminophenMgPer24Hours === 3250, 'regular 3250 mg');

const extra = getProduct('extra_strength');
assert(
  buildDoseLine(extra) === 'Take 2 caplets every 6 hours while symptoms last.',
  'extra strength every 6h (not legacy 4–6)',
);
assert(extra.maxUnitsPer24Hours === 6, 'extra max 6');

const pm = getProduct('pm_extra_strength');
assert(buildDoseLine(pm) === 'Take 2 caplets at bedtime.', 'PM bedtime');
assert(pm.maxUnitsPer24Hours === 2, 'PM max 2');

assert(
  productMatchesSymptom(regular, 'headache_muscle'),
  'regular matches headache',
);
assert(
  !productMatchesSymptom(regular, 'sinus'),
  'regular does not match sinus',
);

{
  const v = validateTylenolDosageInput(createDefaultInput());
  assert(v.isValid && v.result != null, 'default valid');
  assert(v.result!.mismatchMessage == null, 'default no mismatch');
  assert(v.result!.doseLine.includes('2 tablets'), 'default 2 tablets');
}

{
  const r = calculateTylenolDosage({
    symptom: 'sinus',
    product: 'regular_strength',
  });
  assert(r.mismatchMessage != null, 'mismatch when product wrong for symptom');
}

{
  const r = calculateTylenolDosage({
    symptom: 'cold_flu',
    product: 'cold_flu_severe',
  });
  assert(r.mismatchMessage == null, 'cold flu match');
  assert(r.ingredientsLine.includes('Dextromethorphan'), 'cold combo actives');
  assert(r.comboWarning.toLowerCase().includes('acetaminophen'), 'APAP warn');
}

console.log('tylenol-dosage calculation.test.ts: ok');
