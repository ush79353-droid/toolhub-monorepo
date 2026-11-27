/**
 * Run: cd frontend && npx tsx src/tools/calculators/healthy-weight/calculation.test.ts
 */
import {
  calculateHealthyWeight,
  formatKg,
  healthyWeightBandKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHealthyWeightInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: 180 cm → 59.94 kg lower; 81.00 kg exclusive upper
  const band = healthyWeightBandKg(1.8);
  assert(Math.abs(band.minKg - 59.94) < 1e-9, `min ${band.minKg}`);
  assert(Math.abs(band.maxExclusiveKg - 81) < 1e-9, `max ${band.maxExclusiveKg}`);
  assert(formatKg(band.minKg) === '59.94', formatKg(band.minKg));
  assert(formatKg(band.maxExclusiveKg) === '81.00', formatKg(band.maxExclusiveKg));
}

{
  const r = calculateHealthyWeight({
    unitSystem: 'metric',
    heightCm: '180',
    heightFt: '',
    heightIn: '',
  });
  assert(r != null, 'result');
  assert(Math.abs(r!.minKg - 59.94) < 1e-9, `r.min ${r!.minKg}`);
  assert(r!.formattedRange.includes('59.94'), r!.formattedRange);
  assert(r!.formattedRange.includes('81.00'), r!.formattedRange);
  assert(r!.formattedRange.includes('<'), 'exclusive marker');
}

{
  // US ~5 ft 11 in ≈ 180.34 cm — still finite band
  const r = calculateHealthyWeight({
    unitSystem: 'us',
    heightCm: '',
    heightFt: '5',
    heightIn: '11',
  });
  assert(r != null && r.minKg > 0 && r.maxExclusiveKg > r.minKg, 'us band');
  assert(r!.formattedRange.includes('lb'), r!.formattedRange);
}

{
  const v = validateHealthyWeightInput(createDefaultInput(), {
    requireComplete: true,
  });
  assert(v.result != null, 'default calculate');
  assert(Math.abs(v.result!.minKg - 59.94) < 1e-9, 'default min');
}

{
  const v = validateHealthyWeightInput(
    {
      unitSystem: 'metric',
      heightCm: '0',
      heightFt: '',
      heightIn: '',
    },
    { requireComplete: true },
  );
  assert(v.errors.height != null, 'zero height');
}

console.log('healthy-weight calculation.test.ts: ok');
