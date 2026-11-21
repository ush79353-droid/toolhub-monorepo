import assert from 'node:assert/strict';
import {
  allowedExemption,
  calculateAmt,
  formatUsd,
  mfsLine4Addon,
  roundAmtDollar,
  suggestAmtiFromParts,
  tentativeMinimumTax,
} from './calculation';
import { AMT_PARAMS } from './amt-parameters';
import { createDefaultInput, createExampleInput } from './types';
import { validateAmtInput } from './validation';

assert.equal(suggestAmtiFromParts(180_000, 20_000), 200_000);
assert.equal(roundAmtDollar(10.4), 10);
assert.equal(roundAmtDollar(10.5), 11);
assert.equal(formatUsd(32266), '32,266');

{
  // 2022 single — example AMTI $200,000, no phaseout, 26% bracket
  const r = calculateAmt({
    taxYear: 2022,
    filingStatus: 'single',
    amti: 200_000,
    taxCredits: 0,
  });
  assert.equal(r.exemptionAllowed, 75_900);
  assert.equal(r.taxableExcess, 124_100);
  assert.equal(r.tentativeMinimumTax, 32_266);
  assert.equal(r.tentativeAmtAfterCredits, 32_266);
  assert.equal(r.mfsAddon, 0);
}

{
  // Credits cannot exceed tentative minimum tax
  const r = calculateAmt({
    taxYear: 2022,
    filingStatus: 'single',
    amti: 200_000,
    taxCredits: 50_000,
  });
  assert.equal(r.creditsApplied, 32_266);
  assert.equal(r.tentativeAmtAfterCredits, 0);
}

{
  // 2022 single with exemption phaseout
  const r = calculateAmt({
    taxYear: 2022,
    filingStatus: 'single',
    amti: 600_000,
    taxCredits: 0,
  });
  const { phasedOut, allowed } = allowedExemption(600_000, 75_900, 539_900);
  assert.equal(phasedOut, 15_025);
  assert.equal(allowed, 60_875);
  assert.equal(r.exemptionAllowed, 60_875);
  assert.equal(r.taxableExcess, 539_125);
  assert.equal(r.tentativeMinimumTax, 146_833);
}

{
  // 2023 MFJ — AMTI fully covered by exemption
  const r = calculateAmt({
    taxYear: 2023,
    filingStatus: 'married-joint',
    amti: 100_000,
    taxCredits: 0,
  });
  assert.equal(r.exemptionAllowed, 126_500);
  assert.equal(r.taxableExcess, 0);
  assert.equal(r.tentativeMinimumTax, 0);
  assert.equal(r.tentativeAmtAfterCredits, 0);
}

{
  // 2022 MFS line-4 add-on between phaseoutComplete and full-add threshold
  const params = AMT_PARAMS[2022]['married-separate'];
  const addon = mfsLine4Addon(800_000, params);
  assert.equal(addon, 5_975);
  const r = calculateAmt({
    taxYear: 2022,
    filingStatus: 'married-separate',
    amti: 800_000,
    taxCredits: 0,
  });
  assert.equal(r.mfsAddon, 5_975);
  assert.equal(r.amtiAdjusted, 805_975);
  assert.equal(r.exemptionAllowed, 0);
  assert.equal(r.taxableExcess, 805_975);
  assert.equal(r.tentativeMinimumTax, 223_612);
}

{
  // 2023 MFS full add-on at/above mfsAddonFullAt
  const params = AMT_PARAMS[2023]['married-separate'];
  assert.equal(mfsLine4Addon(1_084_150, params), 63_250);
  assert.equal(mfsLine4Addon(831_150, params), 0);
}

{
  // 26%/28% continuity at the 2023 single ceiling
  assert.equal(tentativeMinimumTax(220_700, 220_700, 4_414), 57_382);
  assert.equal(tentativeMinimumTax(220_701, 220_700, 4_414), 57_382);
}

{
  // Zero and negative AMTI → no tax
  const zero = calculateAmt({
    taxYear: 2023,
    filingStatus: 'single',
    amti: 0,
    taxCredits: 0,
  });
  assert.equal(zero.tentativeAmtAfterCredits, 0);

  const neg = calculateAmt({
    taxYear: 2023,
    filingStatus: 'single',
    amti: -10_000,
    taxCredits: 100,
  });
  assert.equal(neg.taxableExcess, 0);
  assert.equal(neg.tentativeMinimumTax, 0);
  assert.equal(neg.creditsApplied, 0);
  assert.equal(neg.tentativeAmtAfterCredits, 0);
}

{
  // Validation: suggested AMTI sync + example
  const example = validateAmtInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.ok(example.result);
  assert.equal(example.result!.amtiEntered, 200_000);
  assert.equal(example.result!.tentativeAmtAfterCredits, 32_266);

  const suggested = validateAmtInput({
    ...createDefaultInput(),
    adjustedGrossIncome: '50,000',
    nonDeductibleTaxes: '5,000',
    amtiSource: 'suggested',
  });
  assert.equal(suggested.syncedInput.amti, '55000');
  assert.equal(suggested.isValid, true);
  assert.ok(suggested.result);

  const badCredits = validateAmtInput({
    ...createExampleInput(),
    taxCredits: '-1',
  });
  assert.equal(badCredits.isValid, false);
  assert.ok(badCredits.errors.taxCredits);

  const empty = validateAmtInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.ok(empty.errors.amti);
}

console.log('amt calculation.test.ts: all assertions passed');
