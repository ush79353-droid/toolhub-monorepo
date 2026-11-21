import assert from 'node:assert/strict';
import {
  calculateNaturalUnemploymentRate,
  convertPopulationDisplay,
  populationToPeople,
} from './calculation';

// 2M frictional + 3M structural / 100M labor force → 5%
{
  const frictionalPeople = populationToPeople(2, 'million');
  const structuralPeople = populationToPeople(3, 'million');
  const laborForcePeople = populationToPeople(100, 'million');
  const rate = calculateNaturalUnemploymentRate({
    frictionalPeople,
    structuralPeople,
    laborForcePeople,
  });
  assert.equal(rate, 5);
}

// Zero unemployment → 0%
{
  const rate = calculateNaturalUnemploymentRate({
    frictionalPeople: 0,
    structuralPeople: 0,
    laborForcePeople: 50_000_000,
  });
  assert.equal(rate, 0);
}

// Mixed units: 500 thousand + 1.5 million / 80 million
{
  const rate = calculateNaturalUnemploymentRate({
    frictionalPeople: populationToPeople(500, 'thousand'),
    structuralPeople: populationToPeople(1.5, 'million'),
    laborForcePeople: populationToPeople(80, 'million'),
  });
  assert.ok(rate !== null);
  assert.ok(Math.abs(rate! - 2.5) < 1e-12);
}

// Reject labor force ≤ 0 and over-count
{
  assert.equal(
    calculateNaturalUnemploymentRate({
      frictionalPeople: 1,
      structuralPeople: 0,
      laborForcePeople: 0,
    }),
    null
  );
  assert.equal(
    calculateNaturalUnemploymentRate({
      frictionalPeople: 60,
      structuralPeople: 50,
      laborForcePeople: 100,
    }),
    null
  );
}

// Unit change preserves people
{
  const converted = convertPopulationDisplay(2, 'million', 'thousand');
  assert.equal(converted, 2000);
  assert.equal(convertPopulationDisplay(2000, 'thousand', 'people'), 2_000_000);
}

console.log('natural-rate-of-unemployment/calculation.test.ts: ok');
