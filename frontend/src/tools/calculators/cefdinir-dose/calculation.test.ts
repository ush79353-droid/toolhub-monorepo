/**
 * Cefdinir Dose — assert-based engine check.
 * Run: npx tsx src/tools/calculators/cefdinir-dose/calculation.test.ts
 */
import {
  ageYearsEligibleForAdultRegimen,
  ageYearsEligibleForPediatricRegimen,
  calculateCefdinirDose,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateCefdinirDoseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateCefdinirDose(createDefaultInput());
  assert(
    r.dosingSentence ===
      'The patient should take 300 mg of Omnicef every 12 hours for 10 days.',
    'adult CAP default',
  );
  assert(
    r.renalNote.includes('creatinine clearance <30'),
    'adult renal note',
  );
}

{
  const r = calculateCefdinirDose({
    ageGroup: 'pediatric',
    indication: 'acute_bacterial_otitis_media',
    weightKgText: '15',
  });
  assert(
    r.dosingSentence ===
      'The patient should take 105 mg of Omnicef every 12 hours for 5 to 10 days.',
    'pediatric otitis 15 kg',
  );
  assert(r.renalNote.includes('7 mg/kg'), 'pediatric renal note');
}

{
  assert(ageYearsEligibleForPediatricRegimen(12), '12y pediatric');
  assert(!ageYearsEligibleForPediatricRegimen(13), '13y not pediatric band');
  assert(ageYearsEligibleForAdultRegimen(13), '13y adult');
  assert(!ageYearsEligibleForAdultRegimen(12), '12y not adult band');
}

{
  const r = calculateCefdinirDose({
    ageGroup: 'pediatric',
    indication: 'community_acquired_pneumonia',
    weightKgText: '20',
  });
  assert(r.dosingSentence === '', 'CAP not labeled pediatric');
  assert(r.statusHeadline.includes('not labeled'), 'pediatric CAP headline');
}

{
  const r = calculateCefdinirDose({
    ageGroup: 'adult',
    indication: 'acute_bacterial_otitis_media',
    weightKgText: '',
  });
  assert(r.dosingSentence === '', 'otitis not labeled adult');
}

{
  const v = validateCefdinirDoseInput({
    ageGroup: 'pediatric',
    indication: 'pharyngitis_tonsillitis',
    weightKgText: '',
  });
  assert(v.errors.weightKgText, 'pediatric missing weight');
  assert(v.result?.dosingSentence === '', 'no dose without weight');
}

{
  const v = validateCefdinirDoseInput(createEmptyInput());
  assert(v.errors.ageGroup, 'empty age');
  assert(v.result?.dosingSentence === '', 'empty no sentence');
}

{
  const r = calculateCefdinirDose({
    ageGroup: 'pediatric',
    indication: 'uncomplicated_skin',
    weightKgText: '50',
  });
  assert(r.doseMgPerAdministration === 300, 'pediatric dose capped 300 mg');
}

{
  const v = validateCefdinirDoseInput({
    ageGroup: 'adult',
    indication: 'acute_maxillary_sinusitis',
    weightKgText: '',
  });
  assert(!v.errors.weightKgText, 'adult no weight required');
  assert(v.result?.doseMgPerAdministration === 300, 'adult sinusitis 300 mg');
}

console.log('cefdinir-dose calculation.test.ts: ok');