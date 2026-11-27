import assert from 'node:assert/strict';
import {
  bagDurationHours,
  calculateDripRate,
  concentrationFromBag,
  doseToMgPerKgPerMin,
  dripRateMlPerH,
  flowRateGttsPerMin,
} from './calculation';
import { createDefaultInput } from './types';

function base() {
  return createDefaultInput();
}

// Fixture: 0.02 mg/kg/min · 85 kg · 10 mg / 40 mL · drop 10 → 408 mL/h · 68 gtts/min
{
  const conc = concentrationFromBag(10, 40);
  assert.equal(conc, 250);
  const drip = dripRateMlPerH(0.02, 85, conc);
  assert.equal(drip, 408);
  assert.equal(flowRateGttsPerMin(drip, 10), 68);
  assert.ok(Math.abs(bagDurationHours(40, 408) - 40 / 408) < 1e-12);
}

// mcg dose equivalent: 20 mcg/kg/min = 0.02 mg/kg/min
{
  const asMcg = doseToMgPerKgPerMin(20, 'mcg', 'kg', 'min');
  assert.equal(asMcg, 0.02);
}

// End-to-end solve via bag fields (concentration blank)
{
  const input = {
    ...base(),
    doseText: '0.02',
    weightText: '85',
    bagVolumeText: '40',
    drugInBagText: '10',
    dropFactorText: '10',
    source: 'drugInBag' as const,
  };
  const { result } = calculateDripRate(input);
  assert.equal(result.dripRateMlPerH, 408);
  assert.equal(result.flowRateGttsPerMin, 68);
  assert.ok(result.concentrationMgPerL === 250);
}

// Direct concentration precedence
{
  const input = {
    ...base(),
    doseText: '0.02',
    weightText: '85',
    concentrationText: '250',
    concentrationUnit: 'mg/L' as const,
    bagVolumeText: '40',
    drugInBagText: '999', // conflicting — ignored when source is concentration
    dropFactorText: '10',
    source: 'concentration' as const,
  };
  const { result } = calculateDripRate(input);
  assert.equal(result.dripRateMlPerH, 408);
}

// Zero / missing → no finite drip
{
  const { result } = calculateDripRate(base());
  assert.equal(result.dripRateMlPerH, null);
}

// Reject zero concentration path via bag
{
  const input = {
    ...base(),
    doseText: '0.02',
    weightText: '85',
    bagVolumeText: '40',
    drugInBagText: '0',
    source: 'drugInBag' as const,
  };
  const { result } = calculateDripRate(input);
  assert.equal(result.dripRateMlPerH, null);
}

console.log('drip-rate calculation.test.ts: ok');
