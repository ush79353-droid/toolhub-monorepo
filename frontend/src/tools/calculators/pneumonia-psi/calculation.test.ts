import {
  agePoints,
  calculatePsi,
  qualifiesClassI,
  riskClassFromPoints,
  sumBreakdown,
  computeBreakdown,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePsiInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(agePoints(50, 'male') === 50, 'male age');
assert(agePoints(50, 'female') === 40, 'female age adjust');
assert(agePoints(5, 'female') === 0, 'female floor');

assert(riskClassFromPoints(70) === 'II', 'II high');
assert(riskClassFromPoints(71) === 'III', 'III low');
assert(riskClassFromPoints(90) === 'III', 'III high');
assert(riskClassFromPoints(91) === 'IV', 'IV low');
assert(riskClassFromPoints(131) === 'V', 'V');

const base = createDefaultInput();
const classI = calculatePsi({ ...base, sex: 'female', ageText: '45' });
assert(classI.classIPathway && classI.riskClass === 'I', 'class I');
assert(qualifiesClassI({ ...base, sex: 'female', ageText: '49' }, 49), 'qual I');

const male60 = calculatePsi({ ...base, sex: 'male', ageText: '60' });
assert(male60.totalPoints === 60 && male60.riskClass === 'II', 'male 60');

const withNeo = calculatePsi({
  ...base,
  sex: 'male',
  ageText: '60',
  neoplasm: true,
});
assert(withNeo.totalPoints === 90 && withNeo.riskClass === 'III', 'neo +30');

const femaleAdj = computeBreakdown(
  { ...base, sex: 'female' },
  55,
  'female',
);
assert(sumBreakdown(femaleAdj) === 45, 'female 55 alone');

assert(validatePsiInput(createDefaultInput()).result === null, 'blank age');

const sodiumOnly = calculatePsi({
  ...base,
  sex: 'female',
  ageText: '55',
  sodiumUnder130: true,
});
assert(sodiumOnly.totalPoints === 65, 'sodium 130 threshold');

console.log('pneumonia-psi calculation.test.ts: ok');