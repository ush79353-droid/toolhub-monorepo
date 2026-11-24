/**
 * Steroid Conversion — assert-based engine check (published-table factors).
 * Run: npx tsx src/tools/calculators/steroid-conversion/calculation.test.ts
 */
import {
  calculateSteroidConversion,
  convertSteroidDose,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSteroidConversionInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Identity
{
  const same = convertSteroidDose(20, 'hydrocortisone', 'hydrocortisone');
  assert(same === 20, `identity hydrocortisone ${same}`);
}

// Classic: hydrocortisone 20 ≈ prednisone 5
{
  const pred = convertSteroidDose(20, 'hydrocortisone', 'prednisone');
  assert(approx(pred, 5), `HC 20 → prednisone ${pred}`);
}

// Inverse: prednisone 5 → hydrocortisone 20
{
  const hc = convertSteroidDose(5, 'prednisone', 'hydrocortisone');
  assert(approx(hc, 20), `prednisone 5 → HC ${hc}`);
}

// Methylprednisolone 4 ≈ dexamethasone 0.75
{
  const dex = convertSteroidDose(4, 'methylprednisolone', 'dexamethasone');
  assert(approx(dex, 0.75), `MP 4 → dex ${dex}`);
}

// Betamethasone BNF 0.75 row: prednisolone 5 → betamethasone 0.75
{
  const beta = convertSteroidDose(5, 'prednisolone', 'betamethasone');
  assert(approx(beta, 0.75), `prednisolone 5 → beta ${beta}`);
}

// Cortisone 25 ≈ hydrocortisone 20
{
  const hc = convertSteroidDose(25, 'cortisone', 'hydrocortisone');
  assert(approx(hc, 20), `cortisone 25 → HC ${hc}`);
}

// Triamcinolone 4 ≈ prednisone 5
{
  const pred = convertSteroidDose(4, 'triamcinolone', 'prednisone');
  assert(approx(pred, 5), `TAC 4 → prednisone ${pred}`);
}

// Calculator path: prednisone 5 fills table
{
  const r = calculateSteroidConversion({
    doses: {
      ...createDefaultInput().doses,
      prednisone: '5',
    },
  });
  assert(r.activeSourceId === 'prednisone', 'active prednisone');
  assert(approx(r.convertedDoses.hydrocortisone!, 20), 'calc HC');
  assert(approx(r.convertedDoses.methylprednisolone!, 4), 'calc MP');
  assert(approx(r.convertedDoses.dexamethasone!, 0.75), 'calc dex');
  assert(approx(r.convertedDoses.betamethasone!, 0.75), 'calc beta');
  assert(approx(r.convertedDoses.cortisone!, 25), 'calc cortisone');
}

// Two sources blocked
{
  const r = calculateSteroidConversion({
    doses: {
      ...createDefaultInput().doses,
      prednisone: '5',
      hydrocortisone: '20',
    },
  });
  assert(r.activeSourceId === null, 'two sources → null active');
  assert(Object.keys(r.convertedDoses).length === 0, 'two sources → no doses');
}

// Blank
{
  const v = validateSteroidConversionInput(createDefaultInput());
  assert(v.result != null && v.result.activeSourceId == null, 'blank');
}

// Invalid
{
  const v = validateSteroidConversionInput({
    doses: { ...createDefaultInput().doses, prednisone: 'abc' },
  });
  assert(v.result === null && v.errors.prednisone, 'invalid dose');
}

// Negative rejected
{
  let threw = false;
  try {
    convertSteroidDose(-1, 'prednisone', 'hydrocortisone');
  } catch {
    threw = true;
  }
  assert(threw, 'negative dose throws');
}

console.log('steroid-conversion calculation.test.ts: ok');
