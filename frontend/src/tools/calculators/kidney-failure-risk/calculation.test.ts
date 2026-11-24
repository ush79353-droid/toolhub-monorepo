import {
  acrPoints,
  assertKidneyFailureRiskFixtures,
  calculateKidneyFailureRisk,
  egfrPoints,
} from './calculation';
import { createExampleInput } from './types';
import { validateKidneyFailureRiskInput } from './validation';

assertKidneyFailureRiskFixtures();

const example = validateKidneyFailureRiskInput(createExampleInput());
if (!example.isValid || !example.result || example.result.totalPoints !== -27) {
  throw new Error('example input must score −27 pts');
}

const blank = validateKidneyFailureRiskInput({
  ...createExampleInput(),
  egfr: '',
});
if (blank.isValid || blank.result) {
  throw new Error('blank eGFR must withhold score');
}

const highEgfr = validateKidneyFailureRiskInput({
  ...createExampleInput(),
  egfr: '60',
});
if (highEgfr.isValid || highEgfr.result) {
  throw new Error('eGFR 60 must withhold score');
}

if (acrPoints('lt30') !== 0 || acrPoints('30to300') !== -14) {
  throw new Error('ACR categorical points mismatch');
}

if (egfrPoints(14.9) !== -35 || egfrPoints(15) !== -30 || egfrPoints(54.9) !== 5) {
  throw new Error('eGFR band edges mismatch');
}

const edgeAcr = calculateKidneyFailureRisk(
  {
    sex: 'female',
    ageYears: '45',
    acrBand: 'lt30',
    egfr: '45',
    albuminValue: '4',
    albuminUnit: 'g_dl',
    bicarbonateValue: '26',
    bicarbonateUnit: 'meq_l',
    calciumValue: '9.2',
    calciumUnit: 'mg_dl',
    phosphorusValue: '4',
    phosphorusUnit: 'mg_dl',
  },
  45,
  45,
  4,
  26,
  9.2,
  4
);
if (!edgeAcr || edgeAcr.breakdown.acrPoints !== 0) {
  throw new Error('ACR <30 must contribute 0 points (no midpoint)');
}

console.log('kidney-failure-risk calculation.test.ts: ok');
