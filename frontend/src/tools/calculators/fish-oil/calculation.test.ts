import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ADULT_SEAFOOD_PATTERN_EPA_DHA_MG,
  CHD_SECONDARY_EPA_DHA_MG,
  FDA_SUPPLEMENT_EPA_DHA_UPPER_MG,
  VERY_HIGH_TG_RX_OMEGA3_MG,
  ageGuidanceForBand,
  calculateFishOil,
  specialGuidanceForRequirement,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateFishOilInput } from './validation';

describe('Fish Oil Calculator engine', () => {
  it('screenshot defaults leave both guidance panels empty', () => {
    const result = calculateFishOil(createDefaultInput());
    assert.equal(result.ageGuidance, null);
    assert.equal(result.specialGuidance, null);
    assert.match(result.statusHeadline, /Select/i);
  });

  it('clear/empty input matches screenshot defaults', () => {
    assert.deepEqual(createEmptyInput(), createDefaultInput());
  });

  it('every age band reports no EPA/DHA AI and null mg', () => {
    const bands = [
      '6_24_months',
      '2_4_years',
      '4_6_years',
      '6_10_years',
      '10_plus_years',
    ] as const;

    for (const band of bands) {
      const g = ageGuidanceForBand(band);
      assert.equal(g.epaDhaAiMg, null);
      assert.match(g.recommendedFishOilDosageLabel, /No EPA\/DHA AI/i);
    }
  });

  it('flags IOM boundary overlap on 6–24 months and 2–4 years', () => {
    const a = ageGuidanceForBand('6_24_months');
    const b = ageGuidanceForBand('2_4_years');
    assert.ok(a.boundaryNote && /overlap|boundary/i.test(a.boundaryNote));
    assert.ok(b.boundaryNote && /boundary/i.test(b.boundaryNote));
  });

  it('4–6 years maps inside 4–8 ALA context without inventing EPA/DHA mg', () => {
    const g = ageGuidanceForBand('4_6_years');
    assert.equal(g.epaDhaAiMg, null);
    assert.ok(g.alaContext && /0\.9/.test(g.alaContext));
    assert.equal(g.boundaryNote, null);
  });

  it('adult seafood pattern cites ~250 mg EPA+DHA food average', () => {
    const g = specialGuidanceForRequirement('adult_seafood_pattern');
    assert.equal(g.fishOilDosageMg, ADULT_SEAFOOD_PATTERN_EPA_DHA_MG);
    assert.equal(g.dosageKind, 'food_pattern_average');
  });

  it('CHD secondary cites ~1000 mg EPA+DHA physician-directed target', () => {
    const g = specialGuidanceForRequirement('chd_secondary_epa_dha');
    assert.equal(g.fishOilDosageMg, CHD_SECONDARY_EPA_DHA_MG);
    assert.equal(g.dosageKind, 'physician_directed_target');
  });

  it('very high TG uses 4000 mg prescription-only framing', () => {
    const g = specialGuidanceForRequirement('very_high_triglycerides_rx');
    assert.equal(g.fishOilDosageMg, VERY_HIGH_TG_RX_OMEGA3_MG);
    assert.equal(g.dosageKind, 'prescription_only');
    assert.match(g.detail, /not self-treatment|not OTC|prescription/i);
  });

  it('pregnancy/lactation leaves EPA/DHA mg blank (ALA only)', () => {
    const g = specialGuidanceForRequirement('pregnancy_lactation_ala_only');
    assert.equal(g.fishOilDosageMg, null);
    assert.equal(g.dosageKind, 'ala_ai_not_epa_dha');
  });

  it('FDA supplement upper limit is 5000 mg EPA+DHA', () => {
    const g = specialGuidanceForRequirement('fda_supplement_upper_limit');
    assert.equal(g.fishOilDosageMg, FDA_SUPPLEMENT_EPA_DHA_UPPER_MG);
    assert.equal(g.dosageKind, 'supplement_upper_limit');
  });

  it('combined age + special selection returns both guidance blocks', () => {
    const result = calculateFishOil({
      ageBand: '4_6_years',
      specialRequirement: 'adult_seafood_pattern',
      dosageUnit: 'mg',
    });
    assert.ok(result.ageGuidance);
    assert.ok(result.specialGuidance);
    assert.equal(result.specialGuidance?.fishOilDosageMg, 250);
  });

  it('validation rejects unknown age band ids', () => {
    const v = validateFishOilInput({
      ageBand: 'not_a_band' as never,
      specialRequirement: '',
      dosageUnit: 'mg',
    });
    assert.ok(v.errors.ageBand);
    assert.equal(v.result, null);
  });

  it('validation accepts screenshot defaults', () => {
    const v = validateFishOilInput(createDefaultInput());
    assert.deepEqual(v.errors, {});
    assert.ok(v.result);
    assert.equal(v.result?.ageGuidance, null);
  });
});
