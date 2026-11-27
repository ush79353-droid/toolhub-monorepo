/**
 * NLR Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/nlr/calculation.test.ts
 */
import {
  calculateNlr,
  formatNlr,
  neutrophilLymphocyteRatio,
} from './calculation';
import { createDefaultInput } from './types';
import { validateNlrInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: 4/2 → 2
{
  const nlr = neutrophilLymphocyteRatio(4, 2);
  assert(nlr === 2, `fixture NLR ${nlr}`);
  assert(formatNlr(nlr) === '2', `fmt ${formatNlr(nlr)}`);
}

{
  const r = calculateNlr({
    mode: 'absolute',
    neutrophilText: '4',
    lymphocyteText: '2',
  });
  assert(r.nlr === 2, 'absolute 4/2');
  assert(r.formattedNlr === '2', 'formatted 2');
}

{
  const r = calculateNlr({
    mode: 'percent',
    neutrophilText: '70',
    lymphocyteText: '20',
  });
  assert(r.nlr === 3.5, `percent 70/20 → ${r.nlr}`);
}

{
  let threw = false;
  try {
    neutrophilLymphocyteRatio(4, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero lymphocytes throws');
}

{
  const r = calculateNlr({
    mode: 'absolute',
    neutrophilText: '4',
    lymphocyteText: '0',
  });
  assert(r.nlr === null, 'zero ALC null');
  assert(/zero/i.test(r.statusDetail), 'zero message');
}

{
  const v = validateNlrInput(createDefaultInput());
  assert(v.result != null && v.result.nlr == null, 'blank inputs');
}

{
  const v = validateNlrInput({
    mode: 'absolute',
    neutrophilText: '4',
    lymphocyteText: '0',
  });
  assert(v.errors.lymphocyteText != null, 'zero ALC field error');
  assert(v.result == null, 'invalid null result');
}

{
  const v = validateNlrInput({
    mode: 'percent',
    neutrophilText: '150',
    lymphocyteText: '20',
  });
  assert(v.errors.neutrophilText != null, 'neutrophil % > 100');
}

{
  const v = validateNlrInput({
    mode: 'percent',
    neutrophilText: '60',
    lymphocyteText: '30',
  });
  assert(v.result?.nlr === 2, 'percent 60/30');
}

console.log('nlr calculation.test.ts: ok');
