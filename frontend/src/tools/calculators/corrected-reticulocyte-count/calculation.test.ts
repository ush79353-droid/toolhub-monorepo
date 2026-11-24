/**
 * Run: npx tsx calculation.test.ts
 */
import {
  calculateCorrectedReticulocyteCount,
  maturationFactorForHematocrit,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCorrectedReticulocyteCountInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateCorrectedReticulocyteCount(createDefaultInput());
  assert(r.correctedReticulocytePercent === null, 'empty inputs no CRC');
}

{
  const r = calculateCorrectedReticulocyteCount({
    ...createDefaultInput(),
    hematocritPercentText: '45',
    reticulocytePercentText: '2',
  });
  assert(r.correctedReticulocytePercent === 2, 'patient Hct equals reference');
}

{
  const r = calculateCorrectedReticulocyteCount({
    hematocritPercentText: '30',
    reticulocytePercentText: '3',
    useCustomReferenceHematocrit: true,
    referenceHematocritPercentText: '45',
    showMaturationIndex: false,
  });
  assert(
    Math.abs((r.correctedReticulocytePercent ?? 0) - 2) < 0.0001,
    'CRC = 3 × 30/45 = 2',
  );
}

{
  const r = calculateCorrectedReticulocyteCount({
    hematocritPercentText: '30',
    reticulocytePercentText: '3',
    useCustomReferenceHematocrit: false,
    referenceHematocritPercentText: '',
    showMaturationIndex: true,
  });
  assert(r.maturationFactor === 2.0, 'Hct 30 maturation 2.0');
  assert(
    Math.abs((r.reticulocyteProductionIndex ?? 0) - 1) < 0.0001,
    'RPI = CRC 2 / 2.0',
  );
}

assert(maturationFactorForHematocrit(45) === 1, 'mf 45');
assert(maturationFactorForHematocrit(24) === 2.5, 'mf low Hct');

{
  const v = validateCorrectedReticulocyteCountInput({
    ...createDefaultInput(),
    useCustomReferenceHematocrit: true,
    referenceHematocritPercentText: '0',
  });
  assert(v.errors.referenceHematocritPercentText, 'ref Hct must be >0');
}

console.log('corrected-reticulocyte-count calculation.test.ts: ok');