import assert from 'node:assert/strict';
import { buildEmvResult, calculateRiskEmv, calculateTotalEmv } from './calculation';
import { createDefaultDraft } from './types';
import { resizeRisks, validateEmvDraft } from './validation';

// Reference: 10,000×30% + 5,000×20% = 4,000
{
  assert.equal(calculateRiskEmv(10_000, 30), 3_000);
  assert.equal(calculateRiskEmv(5_000, 20), 1_000);
  const risks = [
    { impact: 10_000, probability: 30, riskEmv: 3_000 },
    { impact: 5_000, probability: 20, riskEmv: 1_000 },
  ];
  assert.equal(calculateTotalEmv(risks), 4_000);
  const result = buildEmvResult(risks, 'PKR');
  assert.ok(result);
  assert.equal(result!.totalEmv, 4_000);
}

// Signed opportunity (negative impact)
{
  assert.equal(calculateRiskEmv(-8_000, 25), -2_000);
}

// Invalid probability
{
  assert.ok(Number.isNaN(calculateRiskEmv(100, -1)));
  assert.ok(Number.isNaN(calculateRiskEmv(100, 101)));
}

// Defaults: one blank risk
{
  const d = createDefaultDraft();
  assert.equal(d.riskCount, 1);
  assert.equal(d.risks.length, 1);
  assert.equal(d.risks[0].impact, '');
}

// Resize preserves prior risk
{
  const grown = resizeRisks(
    {
      riskCount: 1,
      risks: [{ impact: '100', probability: '10' }],
      currency: 'PKR',
    },
    2
  );
  assert.equal(grown.riskCount, 2);
  assert.equal(grown.risks[0].impact, '100');
  assert.equal(grown.risks[1].impact, '');
}

// Draft validation
{
  const v = validateEmvDraft({
    riskCount: 2,
    currency: 'PKR',
    risks: [
      { impact: '10000', probability: '30' },
      { impact: '5000', probability: '20' },
    ],
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result!.totalEmv, 4_000);
}

console.log('emv calculation.test.ts: ok');
