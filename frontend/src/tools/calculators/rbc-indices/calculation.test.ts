/**
 * Run: cd frontend && npx tsx src/tools/calculators/rbc-indices/calculation.test.ts
 */
import {
  calculateRbcIndices,
  meanCorpuscularHemoglobin,
  meanCorpuscularHemoglobinConcentration,
  meanCorpuscularVolume,
} from './calculation';
import { createDefaultInput } from './types';
import { validateRbcIndicesInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: Hb 15 / Hct 45 / RBC 5 → 30 / 33.33 / 90
  assert(meanCorpuscularHemoglobin(15, 5) === 30, 'mch');
  assert(
    Math.abs(meanCorpuscularHemoglobinConcentration(15, 45) - 33.3333333333) <
      1e-9,
    'mchc raw',
  );
  assert(meanCorpuscularVolume(45, 5) === 90, 'mcv');

  const r = calculateRbcIndices({
    sex: 'female',
    hemoglobinText: '15',
    hematocritText: '45',
    rbcText: '5',
  });
  assert(r.mchPg === 30, `mch ${r.mchPg}`);
  assert(r.mchcGDl === 33.33, `mchc ${r.mchcGDl}`);
  assert(r.mcvFl === 90, `mcv ${r.mcvFl}`);
  assert(r.formattedMch === '30', r.formattedMch);
  assert(r.formattedMchc === '33.33', r.formattedMchc);
  assert(r.formattedMcv === '90', r.formattedMcv);
}

{
  const v = validateRbcIndicesInput(createDefaultInput());
  assert(v.result != null && v.result.mchPg == null, 'blank');
  assert(createDefaultInput().sex === 'female', 'female default');
}

{
  const v = validateRbcIndicesInput({
    sex: 'male',
    hemoglobinText: '0',
    hematocritText: '45',
    rbcText: '5',
  });
  assert(v.errors.hemoglobinText != null, 'zero hb');
}

{
  const v = validateRbcIndicesInput({
    sex: 'female',
    hemoglobinText: '15',
    hematocritText: '45',
    rbcText: '0',
  });
  assert(v.errors.rbcText != null, 'zero rbc');
}

console.log('rbc-indices calculation.test.ts: ok');
