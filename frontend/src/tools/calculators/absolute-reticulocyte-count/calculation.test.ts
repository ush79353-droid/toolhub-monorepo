/**
 * Absolute Reticulocyte Count — assert-based engine check.
 * Run: npx tsx src/tools/calculators/absolute-reticulocyte-count/calculation.test.ts
 */
import {
  absoluteReticulocyteCountFromHematocrit,
  absoluteReticulocyteCountFromRbc,
  calculateAbsoluteReticulocyteCount,
  correctedReticulocytePercent,
  formatCellsPerUl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAbsoluteReticulocyteCountInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: RBC 5 million/µL × 1% → 50,000 cells/µL
{
  const arc = absoluteReticulocyteCountFromRbc(5_000_000, 1);
  assert(arc === 50_000, `RBC fixture ARC ${arc}`);
  assert(formatCellsPerUl(arc) === '50,000', `fmt ${formatCellsPerUl(arc)}`);
}

// Hct-based estimate at reference 45% with same effective RBC anchor
{
  const arc = absoluteReticulocyteCountFromHematocrit(45, 45, 1);
  assert(arc === 50_000, `Hct fixture ARC ${arc}`);
}

{
  const corrected = correctedReticulocytePercent(2, 22.5, 45);
  assert(corrected === 1, `corrected retic ${corrected}`);
}

{
  const arc = absoluteReticulocyteCountFromHematocrit(22.5, 45, 2);
  assert(arc === 50_000, `anemia fixture ARC ${arc}`);
}

{
  let threw = false;
  try {
    absoluteReticulocyteCountFromRbc(-1, 1);
  } catch {
    threw = true;
  }
  assert(threw, 'negative RBC throws');
}

{
  let threw = false;
  try {
    absoluteReticulocyteCountFromRbc(5_000_000, 101);
  } catch {
    threw = true;
  }
  assert(threw, 'retic > 100 throws');
}

{
  const v = validateAbsoluteReticulocyteCountInput(createDefaultInput());
  assert(
    v.result != null && v.result.absoluteCountCellsPerMicroliter == null,
    'blank inputs',
  );
}

{
  const v = validateAbsoluteReticulocyteCountInput({
    hematocritPercentText: '45',
    referenceHematocritPercentText: '45',
    reticulocytePercentText: '150',
  });
  assert(v.errors.reticulocytePercentText != null, 'retic > 100 error');
  assert(v.result == null, 'invalid null result');
}

{
  const r = calculateAbsoluteReticulocyteCount({
    hematocritPercentText: '45',
    referenceHematocritPercentText: '45',
    reticulocytePercentText: '1',
  });
  assert(r.absoluteCountCellsPerMicroliter === 50_000, 'calc path 45/45 @ 1%');
  assert(r.correctedReticulocytePercent === 1, 'corrected pct');
}

console.log('absolute-reticulocyte-count calculation.test.ts: ok');