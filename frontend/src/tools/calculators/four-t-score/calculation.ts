/**
 * 4Ts pretest probability score for HIT — educational only.
 *
 * Thrombocytopenia: platelet fall AND nadir jointly score ONE component (0–2).
 * Timing, thrombosis, and other causes each add 0–2 points (total 0–8).
 *
 * Pretest bands (Cuker et al. Blood 2012 meta-analysis PPV teaching estimates):
 * 0–3 low (~5%), 4–5 intermediate (~14%), 6–8 high (~64%).
 */

import type {
  FourTScoreInput,
  FourTScoreResult,
  FourTTiming,
  FourTThrombosis,
  HitProbabilityBand,
  OtherCauses,
  PlateletFall,
  PlateletNadir,
} from './types';

export const SOURCE_LABEL =
  'Cuker A et al. The 4Ts scoring system for heparin-induced thrombocytopenia in adults with ≥20% platelet fall. Blood. 2012;120(20):4160–4165. PPV bands from meta-analysis; Warkentin TE, Heddle NM. Blood. 2003;102(8):2764–2767 (4Ts framework).';

export const DISCLAIMER =
  'Educational 4Ts pretest probability only. It does not diagnose HIT, order PF4/heparin antibody testing, or stop heparin. PPV figures are population estimates from validation cohorts, not an individual’s absolute risk.';

export function thrombocytopeniaPoints(
  fall: PlateletFall,
  nadir: PlateletNadir,
): number {
  if (fall === 'over50' && nadir === 'ge20') return 2;
  if (fall === 'under30' || nadir === 'under10') return 0;
  return 1;
}

export function timingPoints(timing: FourTTiming): number {
  switch (timing) {
    case 'clear_onset_5_10':
    case 'fall_1day_heparin_within_30d':
      return 2;
    case 'consistent_5_10_unclear':
    case 'onset_after_day_10':
    case 'fall_1day_heparin_30_100d':
      return 1;
    case 'onset_under4_no_heparin':
    default:
      return 0;
  }
}

export function thrombosisPoints(thrombosis: FourTThrombosis): number {
  switch (thrombosis) {
    case 'new_thrombosis_necrosis_asr':
      return 2;
    case 'progressive_recurrent_suspected':
      return 1;
    case 'none':
    default:
      return 0;
  }
}

export function otherCausesPoints(other: OtherCauses): number {
  switch (other) {
    case 'none':
      return 2;
    case 'possible':
      return 1;
    case 'definite':
    default:
      return 0;
  }
}

export function computeFourTScore(input: FourTScoreInput): number {
  return (
    thrombocytopeniaPoints(input.plateletFall, input.plateletNadir) +
    timingPoints(input.timing) +
    thrombosisPoints(input.thrombosis) +
    otherCausesPoints(input.otherCauses)
  );
}

export function probabilityBandForScore(score: number): HitProbabilityBand {
  if (score <= 3) return 'low';
  if (score <= 5) return 'intermediate';
  return 'high';
}

const PPV_BY_BAND: Readonly<
  Record<HitProbabilityBand, { label: string; percent: string }>
> = {
  low: { label: 'low', percent: '~5%' },
  intermediate: { label: 'intermediate', percent: '~14%' },
  high: { label: 'high', percent: '~64%' },
};

export function interpretationForBand(band: HitProbabilityBand): string {
  const { label, percent } = PPV_BY_BAND[band];
  return `The probability of HIT (Heparin-Induced Thrombocytopenia) is ${label} (${percent}).`;
}

export function calculateFourTScore(input: FourTScoreInput): FourTScoreResult {
  const thrombocytopeniaPts = thrombocytopeniaPoints(
    input.plateletFall,
    input.plateletNadir,
  );
  const timingPts = timingPoints(input.timing);
  const thrombosisPts = thrombosisPoints(input.thrombosis);
  const otherPts = otherCausesPoints(input.otherCauses);
  const score =
    thrombocytopeniaPts + timingPts + thrombosisPts + otherPts;
  const probabilityBand = probabilityBandForScore(score);

  return {
    score,
    formattedScore: String(score),
    thrombocytopeniaPoints: thrombocytopeniaPts,
    timingPoints: timingPts,
    thrombosisPoints: thrombosisPts,
    otherCausesPoints: otherPts,
    probabilityBand,
    interpretation: interpretationForBand(probabilityBand),
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}