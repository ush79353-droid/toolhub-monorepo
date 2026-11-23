/**
 * Benzodiazepine Conversion — assert-based engine check.
 * Run: npx tsx src/tools/calculators/benzodiazepine-conversion/calculation.test.ts
 */
import {
  calculateBenzodiazepineConversion,
  convertBenzodiazepineDose,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBenzodiazepineConversionInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const lor = convertBenzodiazepineDose(2, 'midazolam_iv', 'lorazepam');
  assert(lor === 1, `midazolam IV 2 → lorazepam ${lor}`);
}

{
  const dia = convertBenzodiazepineDose(1, 'lorazepam', 'diazepam');
  assert(dia === 10, 'lorazepam 1 → diazepam 10');
}

{
  const r = calculateBenzodiazepineConversion({
    doses: {
      ...createDefaultInput().doses,
      lorazepam: '1',
    },
  });
  assert(r.convertedDoses.diazepam === 10, 'calc diazepam from lorazepam');
  assert(r.activeSourceId === 'lorazepam', 'active lorazepam');
}

{
  const v = validateBenzodiazepineConversionInput(createDefaultInput());
  assert(v.result != null && v.result.activeSourceId == null, 'blank');
}

console.log('benzodiazepine-conversion calculation.test.ts: ok');