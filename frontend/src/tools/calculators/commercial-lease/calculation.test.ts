import assert from 'node:assert/strict';
import {
  SQ_FT_TO_M2,
  areaToSquareMetres,
  calculateCommercialLease,
  rateToPerSquareMetre,
  rateToPerYear,
} from './calculation';

// 100 m² · 1,000 /m²/yr base · 200 /m²/yr opex · 6% of 2 years
{
  const calc = calculateCommercialLease({
    areaM2: 100,
    baseRatePerM2PerYear: 1000,
    opexPerM2PerYear: 200,
    agentPercent: 6,
    agentYears: 2,
  });
  assert.ok(calc);
  assert.equal(calc.totalRatePerM2PerYear, 1200);
  assert.equal(calc.annualRent, 120_000);
  assert.equal(calc.fee, 14_400);
}

// Monthly base rate normalizes × 12; ft² area converts to m²
{
  const areaM2 = areaToSquareMetres(1000, 'ft2');
  assert.ok(Math.abs(areaM2 - 1000 * SQ_FT_TO_M2) < 1e-9);
  const basePerM2 = rateToPerSquareMetre(10, 'ft2');
  const basePerYear = rateToPerYear(basePerM2, 'mo');
  const calc = calculateCommercialLease({
    areaM2,
    baseRatePerM2PerYear: basePerYear,
    opexPerM2PerYear: 0,
    agentPercent: 0,
    agentYears: 0,
  });
  assert.ok(calc);
  // 10 /ft²/mo → (10/SQ_FT_TO_M2) /m²/mo → ×12 /m²/yr × area
  const expectedAnnual = (10 / SQ_FT_TO_M2) * 12 * areaM2;
  assert.ok(Math.abs(calc.annualRent - expectedAnnual) < 1e-6);
  assert.equal(calc.fee, 0);
}

// Reject non-positive area
{
  const calc = calculateCommercialLease({
    areaM2: 0,
    baseRatePerM2PerYear: 100,
    opexPerM2PerYear: 0,
    agentPercent: 6,
    agentYears: 2,
  });
  assert.equal(calc, null);
}

console.log('commercial-lease/calculation.test.ts: ok');
