/**
 * Run: cd frontend && npx tsx src/tools/calculators/plasma-osmolality/calculation.test.ts
 */
import {
  bunToMgDl,
  calculatedPlasmaOsmolality,
  calculatePlasmaOsmolality,
  glucoseToMgDl,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePlasmaOsmolalityInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const osm = calculatedPlasmaOsmolality(140, 90, 14);
  assert(Math.abs(osm - 290) < 1e-9, `fixture ${osm}`);
}

{
  const r = calculatePlasmaOsmolality({
    ...createDefaultInput(),
    sodiumText: '140',
    glucoseText: '90',
    bunText: '14',
  });
  assert(r.osmolality != null && Math.abs(r.osmolality - 290) < 1e-9, 'wired');
  assert(r.formattedOsmolality === '290', `fmt ${r.formattedOsmolality}`);
}

{
  // glucose 5 mmol/L = 90 mg/dL
  assert(Math.abs(glucoseToMgDl(5, 'mmol_l') - 90) < 1e-9, 'glu mmol');
  const r = calculatePlasmaOsmolality({
    ...createDefaultInput(),
    sodiumText: '140',
    glucoseText: '5',
    glucoseUnit: 'mmol_l',
    bunText: '14',
  });
  assert(r.osmolality != null && Math.abs(r.osmolality - 290) < 1e-9, 'glu unit');
}

{
  // urea mmol/L 5 → BUN 14 mg/dL
  assert(Math.abs(bunToMgDl(5, 'mmol_l_urea') - 14) < 1e-9, 'urea mmol');
  const r = calculatePlasmaOsmolality({
    ...createDefaultInput(),
    sodiumText: '140',
    glucoseText: '90',
    bunText: '5',
    bunUnit: 'mmol_l_urea',
  });
  assert(r.osmolality != null && Math.abs(r.osmolality - 290) < 1e-9, 'bun unit');
}

{
  // urea mg/dL 30 → BUN 14 mg/dL (30 × 28/60)
  assert(Math.abs(bunToMgDl(30, 'mg_dl_urea') - 14) < 1e-9, 'urea mass');
}

{
  const r = calculatePlasmaOsmolality({
    ...createDefaultInput(),
    sodiumText: '-1',
    glucoseText: '90',
    bunText: '14',
  });
  assert(r.osmolality == null, 'reject negative');
}

{
  const v = validatePlasmaOsmolalityInput(createDefaultInput());
  assert(v.result != null && v.result.osmolality == null, 'blank');
}

console.log('plasma-osmolality calculation.test.ts: ok');
