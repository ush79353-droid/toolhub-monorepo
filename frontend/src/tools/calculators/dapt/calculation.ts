/**
 * DAPT Score (Yeh et al., JAMA 2016) — educational point total.
 *
 * Applies to patients who completed ~12 months of DAPT after PCI without a
 * major ischemic or bleeding event (derivation/validation framing). This tool
 * does not recommend starting, stopping, or prolonging therapy.
 *
 * Points (ACC/AHA 2016 focused update Table 5 / Yeh JAMA 2016):
 * - Age &lt;65: 0; 65–&lt;75: −1; ≥75: −2
 * - +1 each: diabetes, smoking (current or within past year), MI at
 *   presentation, prior MI/PCI, stent diameter &lt;3 mm, paclitaxel-eluting stent
 * - +2 each: CHF or LVEF &lt;30%, vein-graft stent
 * Range −2…10. Score ≥2 framed as higher ischemic-relative band in the paper.
 */

import type { DaptAgeBand, DaptBreakdown, DaptInput, DaptResult } from './types';

export const SOURCE_LABEL =
  'Yeh RW et al. Development and Validation of a Prediction Rule for Benefit and Harm of Dual Antiplatelet Therapy Beyond 1 Year After Percutaneous Coronary Intervention. JAMA. 2016;315(16):1735–1749; ACC/AHA 2016 DAPT focused update Table 5.';

export const DISCLAIMER =
  'Educational DAPT score total only. It does not decide dual antiplatelet duration, start/stop order, or replace cardiology judgment. The published rule was derived in patients event-free after ~12 months of DAPT post-PCI and not on chronic oral anticoagulation.';

export const AGE_POINTS: Record<DaptAgeBand, number> = {
  under65: 0,
  age65to74: -1,
  age75plus: -2,
};

export function buildBreakdown(input: DaptInput): DaptBreakdown {
  return {
    agePoints: AGE_POINTS[input.ageBand],
    diabetesPoints: input.diabetes ? 1 : 0,
    priorMiOrPciPoints: input.priorMiOrPci ? 1 : 0,
    miAtPresentationPoints: input.miAtPresentation ? 1 : 0,
    stentLt3Points: input.stentDiameterLt3mm ? 1 : 0,
    veinGraftPoints: input.veinGraftStent ? 2 : 0,
    chfOrLowEfPoints: input.chfOrLowEf ? 2 : 0,
    smokerPoints: input.smoker ? 1 : 0,
    paclitaxelPoints: input.paclitaxelElutingStent ? 1 : 0,
  };
}

export function sumBreakdown(b: DaptBreakdown): number {
  return (
    b.agePoints +
    b.diabetesPoints +
    b.priorMiOrPciPoints +
    b.miAtPresentationPoints +
    b.stentLt3Points +
    b.veinGraftPoints +
    b.chfOrLowEfPoints +
    b.smokerPoints +
    b.paclitaxelPoints
  );
}

export function calculateDaptScore(input: DaptInput): DaptResult {
  const breakdown = buildBreakdown(input);
  const totalScore = sumBreakdown(breakdown);
  const highScoreBand = totalScore >= 2;

  return {
    totalScore,
    breakdown,
    formattedScore: String(totalScore),
    highScoreBand,
    explanation: `DAPT score = age (${breakdown.agePoints}) + diabetes (${breakdown.diabetesPoints}) + prior MI/PCI (${breakdown.priorMiOrPciPoints}) + MI at presentation (${breakdown.miAtPresentationPoints}) + stent <3 mm (${breakdown.stentLt3Points}) + vein graft (${breakdown.veinGraftPoints}) + CHF/LVEF<30% (${breakdown.chfOrLowEfPoints}) + smoking (${breakdown.smokerPoints}) + paclitaxel stent (${breakdown.paclitaxelPoints}) = ${totalScore} (range −2 to 10). Stent diameter of exactly 3 mm does not add a point. Screenshot “past smoker” maps to Yeh’s current-or-within-past-year smoking item for educational parity — confirm the clinical definition with a clinician.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
