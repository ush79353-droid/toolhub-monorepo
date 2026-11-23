/**
 * ANC without Bands — assert-based engine check.
 * Run: npx tsx src/tools/calculators/anc-without-bands/calculation.test.ts
 */
import {
  absoluteNeutrophilCountCellsPerMicroliter,
  calculateAncWithoutBands,
  combinedNeutrophilPercent,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAncWithoutBandsInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Authoritative: WBC 5 ×10³/µL, NEUT 40% → 2,000 cells/µL
{
  const anc = absoluteNeutrophilCountCellsPerMicroliter(5, 40);
  assert(anc === 2000, `fixture ${anc}`);
}

{
  const combined = combinedNeutrophilPercent('segs_plus_bands', 35, 5);
  assert(combined === 40, 'segs+bands');
}

{
  let threw = false;
  try {
    combinedNeutrophilPercent('poly_plus_bands', 70, 40);
  } catch {
    threw = true;
  }
  assert(threw, 'sum > 100 throws');
}

{
  const r = calculateAncWithoutBands({
    wbcText: '5',
    labReportMode: 'neut',
    primaryPercentText: '40',
    bandsPercentText: '',
  });
  assert(r.ancCellsPerMicroliter === 2000, 'neut path');
}

{
  const v = validateAncWithoutBandsInput(createDefaultInput());
  assert(v.result != null && v.result.ancCellsPerMicroliter == null, 'blank');
}

{
  const next = {
    wbcText: '5',
    labReportMode: 'neut' as const,
    primaryPercentText: '40',
    bandsPercentText: '',
  };
  const switched = {
    ...next,
    labReportMode: 'segs_plus_bands' as const,
    bandsPercentText: '',
  };
  const partial = validateAncWithoutBandsInput(switched);
  assert(
    partial.result != null && partial.result.ancCellsPerMicroliter == null,
    'bands required in segs mode',
  );
}

console.log('anc-without-bands calculation.test.ts: ok');