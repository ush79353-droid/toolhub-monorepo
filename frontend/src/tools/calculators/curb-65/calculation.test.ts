import { calculateCurb65, bunToUreaMmol } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(bunToUreaMmol(19.6, 'mg_dl_bun') === 7, '19.6 mg/dL BUN → 7 mmol/L');

const base = {
  ...createDefaultInput(),
  confusion: 'no' as const,
  bunText: '15',
  bunUnit: 'mg_dl_bun' as const,
  respiratoryRateText: '20',
  systolicBpText: '110',
  diastolicBpText: '70',
  ageText: '65',
};

const age65 = calculateCurb65(base);
assert(age65.score === 1, `age 65 alone → 1, got ${age65.score}`);
assert(age65.points?.age === 1, 'age point');

const sbp90 = calculateCurb65({ ...base, ageText: '40', systolicBpText: '90' });
assert(sbp90.score === 0, `SBP 90 alone → 0, got ${sbp90.score}`);

const sbp89 = calculateCurb65({ ...base, ageText: '40', systolicBpText: '89' });
assert(sbp89.score === 1, `SBP 89 → 1, got ${sbp89.score}`);

const dbp60 = calculateCurb65({
  ...base,
  ageText: '40',
  systolicBpText: '110',
  diastolicBpText: '60',
});
assert(dbp60.score === 1, `DBP 60 → 1, got ${dbp60.score}`);

const bothBp = calculateCurb65({
  ...base,
  ageText: '40',
  systolicBpText: '80',
  diastolicBpText: '50',
});
assert(bothBp.score === 1, `both BP abnormal still 1 point, got ${bothBp.score}`);

const urea = calculateCurb65({
  ...base,
  ageText: '40',
  bunText: '20',
});
assert(urea.points?.urea === 1, 'BUN 20 > 19.6 threshold');

console.log('curb-65 calculation.test.ts: ok');
