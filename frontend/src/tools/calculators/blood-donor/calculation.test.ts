/**
 * Blood Donor — assert-based engine check.
 * Run: npx tsx src/tools/calculators/blood-donor/calculation.test.ts
 */
import { calculateBloodDonor, compatibleBloodTypes } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const types = compatibleBloodTypes('donate', 'blood', 'O-');
  assert(types.length === 8, 'O- universal RBC donor');
}

{
  const types = compatibleBloodTypes('donate', 'plasma', 'AB+');
  assert(types.length === 8, 'AB universal plasma donor');
}

{
  const types = compatibleBloodTypes('receive', 'blood', 'AB+');
  assert(types.length === 8, 'AB+ universal RBC recipient');
}

{
  const types = compatibleBloodTypes('receive', 'plasma', 'O-');
  assert(types.length === 8, 'O- universal plasma recipient');
  const aNegPlasmaDonors = compatibleBloodTypes('receive', 'plasma', 'A-');
  assert(
    aNegPlasmaDonors.join(',') === 'A-,A+,AB-,AB+',
    `A- plasma donors ${aNegPlasmaDonors.join(',')}`,
  );
  assert(!aNegPlasmaDonors.includes('O-') && !aNegPlasmaDonors.includes('O+'), 'O plasma not for A recipient');
}

{
  const r = calculateBloodDonor({
    intent: 'donate',
    component: 'blood',
    bloodType: 'O-',
  });
  assert(r.compatibleTypes.length === 8, 'O- donate blood');
}

{
  const r = calculateBloodDonor(createDefaultInput());
  assert(r.compatibleTypes.length === 0, 'empty type');
}

console.log('blood-donor calculation.test.ts: ok');