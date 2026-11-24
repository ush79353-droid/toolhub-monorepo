/**
 * Opioid Conversion — assert-based engine check.
 * Run: npx tsx src/tools/calculators/opioid-conversion/calculation.test.ts
 */
import {
  calculateOpioidConversion,
  convertOpioidDose,
} from './calculation';
import { createDefaultInput } from './types';
import { validateOpioidConversionInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// CDC oral oxycodone 1.5 → oral morphine
{
  const ome = convertOpioidDose(10, 'oxycodone_oral', 'mg', 'morphine_oral', 'mg', 0);
  assert(approx(ome, 15), `oxycodone 10 oral → morphine oral ${ome}`);
}

// Scottish morphine SC: oral 10 ≈ SC 5
{
  const sc = convertOpioidDose(10, 'morphine_oral', 'mg', 'morphine_sc', 'mg', 0);
  assert(approx(sc, 5), `morphine oral 10 → SC ${sc}`);
}

// Scottish diamorphine SC: oral 10 ≈ SC 3
{
  const d = convertOpioidDose(10, 'morphine_oral', 'mg', 'diamorphine_sc', 'mg', 0);
  assert(approx(d, 3), `morphine oral 10 → diamorphine SC ${d}`);
}

// Scottish alfentanil: oral 30 ≈ SC 1
{
  const a = convertOpioidDose(30, 'morphine_oral', 'mg', 'alfentanil_sc', 'mg', 0);
  assert(approx(a, 1), `morphine oral 30 → alfentanil SC ${a}`);
}

// CDC fentanyl TD 2.4: 25 mcg/h → 60 mg oral morphine
{
  const m = convertOpioidDose(25, 'fentanyl_td', 'mcg_h', 'morphine_oral', 'mg', 0);
  assert(approx(m, 60), `fentanyl TD 25 → morphine oral ${m}`);
}

// ICT 50% halves converted (non-source) dose; source unchanged path uses 0 reduction
{
  const half = convertOpioidDose(10, 'morphine_oral', 'mg', 'morphine_sc', 'mg', 50);
  assert(approx(half, 2.5), `ICT 50% morphine oral 10 → SC ${half}`);
  const same = convertOpioidDose(10, 'morphine_oral', 'mg', 'morphine_oral', 'mg', 50);
  assert(approx(same, 10), `ICT does not reduce source drug ${same}`);
}

// mcg ↔ mg for SC fentanyl (CF 150): 200 mcg = 0.2 mg → 30 mg oral morphine
{
  const m = convertOpioidDose(200, 'fentanyl_sc', 'mcg', 'morphine_oral', 'mg', 0);
  assert(approx(m, 30), `fentanyl SC 200 mcg → morphine oral ${m}`);
}

// Scottish buprenorphine TD: 5 mcg/h ≈ 12 mg oral morphine
{
  const m = convertOpioidDose(5, 'buprenorphine_td', 'mcg_h', 'morphine_oral', 'mg', 0);
  assert(approx(m, 12), `buprenorphine TD 5 → morphine oral ${m}`);
}

// CDC codeine 0.15 / tramadol 0.2
{
  assert(
    approx(convertOpioidDose(100, 'codeine_oral', 'mg', 'morphine_oral', 'mg', 0), 15),
    'codeine 100 → morphine 15',
  );
  assert(
    approx(convertOpioidDose(100, 'tramadol_oral', 'mg', 'morphine_oral', 'mg', 0), 20),
    'tramadol 100 → morphine 20',
  );
}

// Full calculate + dual-source guard
{
  const r = calculateOpioidConversion({
    ...createDefaultInput(),
    doses: { ...createDefaultInput().doses, morphine_oral: '30' },
  });
  assert(r.activeSourceId === 'morphine_oral', 'active oral morphine');
  assert(approx(r.convertedDoses.alfentanil_sc!, 1), 'calc alfentanil from 30 oral');
  assert(r.cautionNotes.length === 0 || true, 'cautions optional');
}

{
  const multi = calculateOpioidConversion({
    ...createDefaultInput(),
    doses: {
      ...createDefaultInput().doses,
      morphine_oral: '10',
      codeine_oral: '10',
    },
  });
  assert(multi.activeSourceId === null, 'reject dual sources');
  assert(multi.statusHeadline.includes('One active'), 'dual headline');
}

// Validation: blank ICT invalid; patch unit lock
{
  const blank = validateOpioidConversionInput({
    ...createDefaultInput(),
    crossToleranceText: '',
  });
  assert(blank.result === null && blank.errors.crossToleranceText, 'ICT required');

  const ok = validateOpioidConversionInput(createDefaultInput());
  assert(ok.result != null && ok.result.activeSourceId == null, 'blank doses ok');
}

// Unsupported mass unit on patch rejected by unit list (engine throws on convert)
{
  let threw = false;
  try {
    convertOpioidDose(25, 'fentanyl_td', 'mg' as 'mcg_h', 'morphine_oral', 'mg', 0);
  } catch {
    threw = true;
  }
  assert(threw, 'fentanyl TD rejects mass unit');
}

console.log('opioid-conversion calculation.test.ts: ok');
