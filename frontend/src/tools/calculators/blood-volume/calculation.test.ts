/**
 * Run: npx tsx src/tools/calculators/blood-volume/calculation.test.ts
 */
import {
  nadlerBloodVolumeMl,
  lemmensBernsteinBrodskyBloodVolumeMl,
  weightBasedBloodVolumeMl,
  calculateBloodVolume,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBloodVolumeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Weight-only method depends only on weight (not height)
{
  const w = 80;
  const male70 = weightBasedBloodVolumeMl('male', w);
  const female65 = weightBasedBloodVolumeMl('female', w);
  assert(male70 === 5600, `male weight-only ${male70}`);
  assert(female65 === 5200, `female weight-only ${female65}`);
}

// Nadler 180 cm, 80 kg male ≈ 5304 mL (PMC cm³ form)
{
  const v = nadlerBloodVolumeMl('male', 180, 80);
  assert(Math.abs(v - 5304.1) < 2, `nadler male ${v}`);
}

// LBB increases with leaner BMI scaling at fixed weight
{
  const tall = lemmensBernsteinBrodskyBloodVolumeMl('male', 80, 180);
  const short = lemmensBernsteinBrodskyBloodVolumeMl('male', 80, 160);
  assert(tall > short, 'lower BMI at taller height → higher LBB volume at same weight');
}

{
  const r = calculateBloodVolume({
    ...createDefaultInput(),
    heightText: '180',
    weightText: '80',
  });
  assert(r.weightMaleMl === 5600 && r.nadlerMaleMl != null, 'full calc');
}

{
  const v = validateBloodVolumeInput(createDefaultInput());
  assert(v.result != null && v.result.nadlerMaleMl == null, 'blank');
}

console.log('blood-volume calculation.test.ts: ok');