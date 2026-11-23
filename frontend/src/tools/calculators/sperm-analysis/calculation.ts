/**
 * Educational semen arithmetic (ADR-018).
 *
 * Total sperm (million) = volume_mL × concentration_million_per_mL
 *
 * Functional sperm (million) — product-based teaching estimate only:
 *   total × (motility/100) × (vitality/100) × (morphology/100)
 *
 * Percentages are treated as independent fractions. Real overlap between
 * living, motile, and morphologically normal sperm is not measured by lab
 * percentages alone; this product is labeled as an estimate, not a WHO
 * diagnostic class or fertility diagnosis.
 *
 * Prompt fixture: 3 mL × 20 million/mL → 60 million total.
 *
 * Motility input follows the screenshot label “Normal motility %” and is
 * used as the motility fraction in the product model (commonly progressive
 * motility in teaching calculators such as Omni Calculator).
 */

import type {
  ConcentrationUnit,
  SpermAnalysisInput,
  SpermAnalysisResult,
  VolumeUnit,
} from './types';

export const SOURCE_NOTE =
  'Total sperm = volume (mL) × concentration (million/mL). Functional sperm is a product-based educational estimate: total × motility × vitality × morphology fractions. Overlap is not measured by separate percentages alone.';

export const DISCLAIMER =
  'Educational worksheet only — not a fertility diagnosis, not WHO diagnostic classification of a patient, and not clinical advice. Semen parameters vary between samples; interpret results with a clinician.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function volumeToMl(value: number, unit: VolumeUnit): number {
  return unit === 'uL' ? value / 1000 : value;
}

export function mlToVolumeUnit(ml: number, unit: VolumeUnit): number {
  return unit === 'uL' ? ml * 1000 : ml;
}

export function concentrationToMlnPerMl(
  value: number,
  unit: ConcentrationUnit,
): number {
  return unit === 'mln_per_uL' ? value * 1000 : value;
}

export function mlnPerMlToConcentrationUnit(
  mlnPerMl: number,
  unit: ConcentrationUnit,
): number {
  return unit === 'mln_per_uL' ? mlnPerMl / 1000 : mlnPerMl;
}

export function formatMillion(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 100 || abs === 0) return n.toFixed(0);
  if (abs >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

/**
 * Pure totals. Percentages optional; functional requires all three.
 * @throws on non-finite or negative volume/concentration
 */
export function computeSpermCounts(
  volumeMl: number,
  concentrationMlnPerMl: number,
  motilityPct: number | null,
  vitalityPct: number | null,
  morphologyPct: number | null,
): { totalSpermMillion: number; functionalSpermMillion: number | null } {
  if (!(volumeMl >= 0) || !Number.isFinite(volumeMl)) {
    throw new Error('Volume must be a non-negative finite number.');
  }
  if (!(concentrationMlnPerMl >= 0) || !Number.isFinite(concentrationMlnPerMl)) {
    throw new Error('Concentration must be a non-negative finite number.');
  }
  const totalSpermMillion = volumeMl * concentrationMlnPerMl;
  if (
    motilityPct === null ||
    vitalityPct === null ||
    morphologyPct === null
  ) {
    return { totalSpermMillion, functionalSpermMillion: null };
  }
  for (const p of [motilityPct, vitalityPct, morphologyPct]) {
    if (!(p >= 0) || !(p <= 100) || !Number.isFinite(p)) {
      throw new Error('Percentages must be finite values from 0 to 100.');
    }
  }
  const functionalSpermMillion =
    totalSpermMillion *
    (motilityPct / 100) *
    (vitalityPct / 100) *
    (morphologyPct / 100);
  return { totalSpermMillion, functionalSpermMillion };
}

export function calculateSpermAnalysis(
  input: SpermAnalysisInput,
): SpermAnalysisResult {
  const volumeRaw = parseNumber(input.volumeText);
  const concRaw = parseNumber(input.concentrationText);
  const morphRaw = parseNumber(input.morphologyText);
  const motRaw = parseNumber(input.motilityText);
  const vitRaw = parseNumber(input.vitalityText);

  const blankCore = volumeRaw === null || concRaw === null;

  if (blankCore) {
    return {
      totalSpermMillion: null,
      functionalSpermMillion: null,
      volumeMl: volumeRaw === null ? null : volumeToMl(volumeRaw, input.volumeUnit),
      concentrationMlnPerMl:
        concRaw === null
          ? null
          : concentrationToMlnPerMl(concRaw, input.concentrationUnit),
      statusHeadline: 'Enter volume and concentration',
      statusDetail:
        'Total sperm appears when both volume and concentration are valid. Functional sperm also needs motility, vitality, and morphology percentages.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const volumeMl = volumeToMl(volumeRaw, input.volumeUnit);
  const concentrationMlnPerMl = concentrationToMlnPerMl(
    concRaw,
    input.concentrationUnit,
  );

  const { totalSpermMillion, functionalSpermMillion } = computeSpermCounts(
    volumeMl,
    concentrationMlnPerMl,
    motRaw,
    vitRaw,
    morphRaw,
  );

  const functionalReady = functionalSpermMillion !== null;

  return {
    totalSpermMillion,
    functionalSpermMillion,
    volumeMl,
    concentrationMlnPerMl,
    statusHeadline: functionalReady
      ? 'Total and functional sperm (estimate)'
      : 'Total sperm calculated',
    statusDetail: functionalReady
      ? 'Functional count multiplies total by motility, vitality, and morphology fractions. This assumes independence and does not measure true overlap.'
      : 'Add all three percentages (motility, vitality, morphology) for the product-based functional estimate.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
