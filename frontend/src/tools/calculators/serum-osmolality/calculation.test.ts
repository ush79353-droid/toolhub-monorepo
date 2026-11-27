/**
 * Run: cd frontend && npx tsx src/tools/calculators/serum-osmolality/calculation.test.ts
 */
import {
  calculatedSerumOsmolality,
  calculateSerumOsmolality,
  ethanolToMgDl,
  parseMeasuredOsmolality,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSerumOsmolalityInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const osm = calculatedSerumOsmolality(140, 14, 90, 37);
  assert(Math.abs(osm - 300) < 1e-9, `fixture ${osm}`);
}

{
  const r = calculateSerumOsmolality({
    ...createDefaultInput(),
    sodiumText: '140',
    bunText: '14',
    glucoseText: '90',
    ethanolText: '37',
    ethanolUnit: 'mg_dl',
  });
  assert(r.osmolality != null && Math.abs(r.osmolality - 300) < 1e-9, 'wired');
  assert(r.formattedOsmolality === '300', `fmt ${r.formattedOsmolality}`);
  assert(r.osmoticGap == null, 'no gap without measured');
}

{
  const mmol = 37 / 4.607;
  assert(Math.abs(ethanolToMgDl(mmol, 'mmol_l') - 37) < 1e-9, 'etoh conv');
  const r = calculateSerumOsmolality({
    ...createDefaultInput(),
    sodiumText: '140',
    bunText: '14',
    glucoseText: '90',
    ethanolText: String(mmol),
    ethanolUnit: 'mmol_l',
  });
  assert(r.osmolality != null && Math.abs(r.osmolality - 300) < 1e-6, 'mmol etoh');
}

{
  assert(parseMeasuredOsmolality('0') == null, 'zero empty');
  assert(parseMeasuredOsmolality('') == null, 'blank');
  const r = calculateSerumOsmolality({
    ...createDefaultInput(),
    sodiumText: '140',
    bunText: '14',
    glucoseText: '90',
    ethanolText: '37',
    ethanolUnit: 'mg_dl',
    measuredText: '310',
  });
  assert(r.osmoticGap != null && Math.abs(r.osmoticGap - 10) < 1e-9, 'gap');
}

{
  const v = validateSerumOsmolalityInput(createDefaultInput());
  assert(v.result != null && v.result.osmolality == null, 'blank');
}

console.log('serum-osmolality calculation.test.ts: ok');
