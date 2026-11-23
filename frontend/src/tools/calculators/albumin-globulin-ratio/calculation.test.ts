/**
 * Run: cd frontend && npx tsx src/tools/calculators/albumin-globulin-ratio/calculation.test.ts
 */
import {
  agRatio,
  calculateAlbuminGlobulinRatio,
  globulinFromAlbuminAndTotal,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAlbuminGlobulinRatioInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const g = globulinFromAlbuminAndTotal(4, 7);
  assert(g === 3, `globulin ${g}`);
  const r = agRatio(4, 3);
  assert(Math.round(r * 100) === 133, `ratio ${r}`);
}

{
  const r = calculateAlbuminGlobulinRatio({
    albuminText: '4',
    totalProteinText: '7',
  });
  assert(r.globulin === 3, 'g 3');
  assert(r.agRatio === 1.33, `ag ${r.agRatio}`);
}

{
  const r = calculateAlbuminGlobulinRatio({
    albuminText: '7',
    totalProteinText: '7',
  });
  assert(r.agRatio == null, 'zero globulin undefined ratio');
}

{
  let threw = false;
  try {
    agRatio(4, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero globulin throws');
}

{
  const v = validateAlbuminGlobulinRatioInput(createDefaultInput());
  assert(v.result != null && v.result.agRatio == null, 'blank');
}

{
  const v = validateAlbuminGlobulinRatioInput({
    albuminText: '5',
    totalProteinText: '4',
  });
  assert(v.errors.totalProteinText != null, 'total < albumin');
}

console.log('albumin-globulin-ratio calculation.test.ts: ok');