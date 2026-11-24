/**
 * Fish Oil Calculator — educational EPA/DHA & ALA guidance (ADR-018).
 *
 * Primary sources only:
 * - NIH ODS Omega-3 Fatty Acids (consumer + health professional): no EPA/DHA AI;
 *   infant total omega-3 AI; ALA AIs from age 1+; FDA ≤5 g/day EPA+DHA from supplements;
 *   ~250 mg/day EPA+DHA average from ~8 oz seafood/week food pattern.
 * - AHA science advisories: ~1 g/day EPA+DHA for CHD (preferably fish; supplements
 *   with clinician direction); 4 g/day prescription omega-3 for very high TG (not OTC).
 *
 * Screenshot age bands are not IOM life-stage AIs. Overlaps and absence of validated
 * fish-oil mg-by-age guidance are reported explicitly — no invented clinical tables.
 */

import type {
  FishOilAgeBandId,
  FishOilAgeGuidance,
  FishOilInput,
  FishOilResult,
  FishOilSpecialGuidance,
  FishOilSpecialRequirementId,
} from './types';

export const SOURCE_NOTE =
  'NIH ODS Omega-3 fact sheets (IOM ALA/total omega-3 AIs; no EPA/DHA AI; FDA ≤5 g/day EPA+DHA from supplements; ~250 mg/day EPA+DHA food-pattern average from ~8 oz seafood/week); AHA advisories (~1 g/day EPA+DHA CHD, preferably fish; 4 g/day prescription omega-3 for very high triglycerides — not OTC fish oil).';

export const DISCLAIMER =
  'Educational citation of published omega-3 guidance — not individualized medical nutrition therapy, not a prescription, and not a product-specific dosing label.';

/** Food-pattern average EPA+DHA (mg/day) cited by NIH ODS for ~8 oz seafood/week. */
export const ADULT_SEAFOOD_PATTERN_EPA_DHA_MG = 250;

/** AHA CHD secondary-prevention EPA+DHA target (mg/day), preferably from oily fish. */
export const CHD_SECONDARY_EPA_DHA_MG = 1000;

/** AHA / FDA-labeled prescription omega-3 dose for very high triglycerides (mg/day). */
export const VERY_HIGH_TG_RX_OMEGA3_MG = 4000;

/** FDA recommended maximum combined EPA+DHA from dietary supplements (mg/day). */
export const FDA_SUPPLEMENT_EPA_DHA_UPPER_MG = 5000;

/** IOM ALA AI (g/day) reference rows used only for context — not fish-oil EPA/DHA. */
export const IOM_ALA_AI_G = {
  infantTotalOmega3_0_12mo: 0.5,
  ala_1_3y: 0.7,
  ala_4_8y: 0.9,
  ala_9_13y_male: 1.2,
  ala_9_13y_female: 1.0,
  ala_adult_male: 1.6,
  ala_adult_female: 1.1,
  ala_pregnancy: 1.4,
  ala_lactation: 1.3,
} as const;

export function ageGuidanceForBand(ageBand: FishOilAgeBandId): FishOilAgeGuidance {
  const base = {
    ageBand,
    epaDhaAiMg: null as number | null,
    recommendedFishOilDosageLabel: 'No EPA/DHA AI established',
  };

  switch (ageBand) {
    case '6_24_months':
      return {
        ...base,
        detail:
          'NIH ODS: no Adequate Intake for EPA or DHA at any age. This band is not a fish-oil milligram schedule.',
        alaContext: `IOM context (not EPA/DHA): birth–12 months total omega-3 AI ${IOM_ALA_AI_G.infantTotalOmega3_0_12mo} g/day; ages 1–3 years ALA AI ${IOM_ALA_AI_G.ala_1_3y} g/day.`,
        boundaryNote:
          'Band spans 6–12 months (infant total omega-3 AI) and 12–24 months (ALA AI for 1–3 years). Endpoints overlap two IOM life stages — no single validated fish-oil mg.',
      };
    case '2_4_years':
      return {
        ...base,
        detail:
          'NIH ODS: EPA and DHA AIs are not established. Do not treat this radio as an OTC fish-oil dose.',
        alaContext: `IOM ALA AI context: 1–3 years ${IOM_ALA_AI_G.ala_1_3y} g/day; 4–8 years ${IOM_ALA_AI_G.ala_4_8y} g/day.`,
        boundaryNote:
          'Age 4 sits on the 1–3 / 4–8 IOM boundary. The screenshot band does not map 1:1 to a single ALA AI row.',
      };
    case '4_6_years':
      return {
        ...base,
        detail:
          'NIH ODS: no EPA/DHA recommended amount. Softgel total oil mg ≠ EPA+DHA mg on the label.',
        alaContext: `Within IOM 4–8 years ALA AI ${IOM_ALA_AI_G.ala_4_8y} g/day (ALA only — not fish-oil EPA/DHA).`,
        boundaryNote: null,
      };
    case '6_10_years':
      return {
        ...base,
        detail:
          'NIH ODS: EPA/DHA AI not established for children. No sex field is shown, so later childhood ALA AIs cannot be collapsed to one number.',
        alaContext: `IOM ALA AI context: 4–8 years ${IOM_ALA_AI_G.ala_4_8y} g/day; 9–13 years ${IOM_ALA_AI_G.ala_9_13y_male} g/day (boys) / ${IOM_ALA_AI_G.ala_9_13y_female} g/day (girls).`,
        boundaryNote:
          'Band overlaps 4–8 and 9–13 IOM stages at ages 6–10. Absence of validated fish-oil mg-by-age guidance is intentional.',
      };
    case '10_plus_years':
      return {
        ...base,
        detail:
          'NIH ODS: EPA/DHA AIs remain unset for adolescents and adults. Adult ALA AIs differ by sex; this panel has no sex selector.',
        alaContext: `IOM ALA AI context examples: 9–13 y ${IOM_ALA_AI_G.ala_9_13y_male}/${IOM_ALA_AI_G.ala_9_13y_female} g/day (M/F); adults ${IOM_ALA_AI_G.ala_adult_male}/${IOM_ALA_AI_G.ala_adult_female} g/day (M/F).`,
        boundaryNote:
          '“10+ years” spans multiple IOM life stages. No single EPA/DHA or ALA milligram fish-oil dose is validated for this radio alone.',
      };
  }
}

export function specialGuidanceForRequirement(
  id: FishOilSpecialRequirementId,
): FishOilSpecialGuidance {
  switch (id) {
    case 'adult_seafood_pattern':
      return {
        specialRequirement: id,
        fishOilDosageMg: ADULT_SEAFOOD_PATTERN_EPA_DHA_MG,
        dosageKind: 'food_pattern_average',
        detail: `About ${ADULT_SEAFOOD_PATTERN_EPA_DHA_MG} mg/day combined EPA+DHA is the average cited by NIH ODS for people who eat about 8 ounces of seafood per week — a food pattern, not an OTC capsule prescription.`,
        productNote:
          'Prefer seafood variety; supplement labels list EPA and DHA separately from total fish oil mg.',
      };
    case 'chd_secondary_epa_dha':
      return {
        specialRequirement: id,
        fishOilDosageMg: CHD_SECONDARY_EPA_DHA_MG,
        dosageKind: 'physician_directed_target',
        detail: `AHA framing for people with coronary heart disease: approximately ${CHD_SECONDARY_EPA_DHA_MG} mg/day EPA+DHA, preferably from oily fish; supplements only under clinician direction.`,
        productNote:
          'Not a primary-prevention OTC “take fish oil” order. Product EPA+DHA content varies — read the Supplement Facts panel.',
      };
    case 'very_high_triglycerides_rx':
      return {
        specialRequirement: id,
        fishOilDosageMg: VERY_HIGH_TG_RX_OMEGA3_MG,
        dosageKind: 'prescription_only',
        detail: `AHA science advisory: ${VERY_HIGH_TG_RX_OMEGA3_MG} mg/day (4 g/day) prescription omega-3 (EPA+DHA or EPA-only) for very high triglycerides — pharmacological dosing, not self-treatment with OTC fish oil.`,
        productNote:
          'OTC fish-oil supplements are not interchangeable with FDA-approved prescription omega-3 medications for this indication.',
      };
    case 'pregnancy_lactation_ala_only':
      return {
        specialRequirement: id,
        fishOilDosageMg: null,
        dosageKind: 'ala_ai_not_epa_dha',
        detail: `IOM ALA AIs: pregnancy ${IOM_ALA_AI_G.ala_pregnancy} g/day; lactation ${IOM_ALA_AI_G.ala_lactation} g/day. NIH ODS: no EPA/DHA AI — this tool leaves the mg fish-oil field blank rather than inventing one.`,
        productNote:
          'Prenatal DHA advice is product- and clinician-specific; this calculator does not invent a pregnancy fish-oil milligram table.',
      };
    case 'fda_supplement_upper_limit':
      return {
        specialRequirement: id,
        fishOilDosageMg: FDA_SUPPLEMENT_EPA_DHA_UPPER_MG,
        dosageKind: 'supplement_upper_limit',
        detail: `FDA recommends no more than ${FDA_SUPPLEMENT_EPA_DHA_UPPER_MG} mg/day (5 g/day) combined EPA+DHA from dietary supplements. This is an upper limit, not a recommended daily dose.`,
        productNote:
          'Total fish-oil softgel weight can exceed EPA+DHA content; use labeled EPA+DHA when comparing to this limit.',
      };
  }
}

export function calculateFishOil(input: FishOilInput): FishOilResult {
  const ageGuidance = input.ageBand
    ? ageGuidanceForBand(input.ageBand)
    : null;
  const specialGuidance = input.specialRequirement
    ? specialGuidanceForRequirement(input.specialRequirement)
    : null;

  if (!ageGuidance && !specialGuidance) {
    return {
      ageGuidance: null,
      specialGuidance: null,
      statusHeadline: 'Select an age band or special requirement',
      statusDetail:
        'Screenshot defaults leave both panels empty until a selection is made.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const parts: string[] = [];
  if (ageGuidance) {
    parts.push(
      `Age (${ageGuidance.ageBand}): EPA/DHA AI not established — ${ageGuidance.recommendedFishOilDosageLabel}.`,
    );
  }
  if (specialGuidance) {
    if (specialGuidance.fishOilDosageMg != null) {
      parts.push(
        `Special (${specialGuidance.specialRequirement}): ${specialGuidance.fishOilDosageMg} mg (${specialGuidance.dosageKind}).`,
      );
    } else {
      parts.push(
        `Special (${specialGuidance.specialRequirement}): no validated EPA/DHA mg in this tool.`,
      );
    }
  }

  return {
    ageGuidance,
    specialGuidance,
    statusHeadline: 'Educational omega-3 guidance',
    statusDetail: parts.join(' '),
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatMg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}
