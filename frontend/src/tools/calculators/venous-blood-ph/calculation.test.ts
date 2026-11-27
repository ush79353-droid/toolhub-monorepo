/**
 * Run: cd frontend && npx tsx src/tools/calculators/venous-blood-ph/calculation.test.ts
 */
import {
  calculateVenousBloodPh,
  hendersonHasselbalchPh,
  paco2ToMmHg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateVenousBloodPhInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const ph = hendersonHasselbalchPh(24, 40);
  assert(Math.abs(ph - 7.39) < 0.005, `fixture ${ph}`);

  const r = calculateVenousBloodPh({
    ...createDefaultInput(),
    bicarbonateText: '24',
    paco2Text: '40',
    paco2Unit: 'mmHg',
  });
  assert(r.ph != null && Math.abs(r.ph - 7.39) < 0.005, 'wired');
  assert(r.formattedPh === '7.39', `fmt ${r.formattedPh}`);
  assert(/estimated/i.test(r.statusHeadline), 'estimate wording');
}

{
  const mmHg = paco2ToMmHg(5.333, 'kPa');
  const r = calculateVenousBloodPh({
    ...createDefaultInput(),
    bicarbonateText: '24',
    paco2Text: '5.333',
    paco2Unit: 'kPa',
  });
  assert(
    r.ph != null && Math.abs(r.ph - hendersonHasselbalchPh(24, mmHg)) < 1e-12,
    'kPa',
  );
}

{
  const r = calculateVenousBloodPh({
    ...createDefaultInput(),
    bicarbonateText: '0',
    paco2Text: '40',
  });
  assert(r.ph == null, 'reject zero hco3');
}

{
  const r = calculateVenousBloodPh({
    ...createDefaultInput(),
    bicarbonateText: '24',
    paco2Text: '-1',
  });
  assert(r.ph == null, 'reject negative paco2');
}

{
  const v = validateVenousBloodPhInput(createDefaultInput());
  assert(v.result != null && v.result.ph == null, 'blank');
}

console.log('venous-blood-ph calculation.test.ts: ok');
