/**
 * Face Shape — Omega-defined aesthetic heuristic (ADR-018).
 *
 * NOT Omiverse/Omni proprietary parity, NOT clinical or dermatological validation.
 * Jawline length is entered as chin-to-outer-ear along the jaw and is treated as a
 * jaw-width PROXY only (not true mandible breadth).
 *
 * All comparisons run in centimeters after unit conversion.
 * Let F=forehead, C=cheeks, J=jawlineLength (proxy), L=faceLength.
 * rLF = L / C (face length vs cheek width).
 * widest = max(F, C, J) — informational context only; rules use pairwise ratios.
 *
 * Ordered first-match rules (order is part of the algorithm):
 * 1. HEART:      F >= C*1.05 AND J <= C*0.92 AND L >= C*1.25 (equal F/C counts when widths match exactly)
 * 2. DIAMOND:    C >= F*1.05 AND C >= J*1.05 AND L >= C*1.2 AND sharpness !== 'round'
 * 3. TRIANGLE:   J >= C*1.08 AND J >= F*1.05 AND L >= C*1.15  (pear / base-heavy)
 * 4. SQUARE:     |F-C|/C <= 0.06 AND |C-J|/C <= 0.08 AND rLF <= 1.35 AND sharpness !== 'round'
 * 5. ROUND:      |F-C|/C <= 0.08 AND |C-J|/C <= 0.10 AND rLF <= 1.28 AND (sharpness === 'round' OR rLF <= 1.22)
 * 6. OBLONG:     rLF >= 1.45 AND |F-C|/C <= 0.12 AND |C-J|/C <= 0.12
 * 7. OVAL:       rLF >= 1.28 AND rLF < 1.45 AND C >= F*0.95 AND C >= J*0.95
 * 8. Else OVAL soft fallback with note "closest match"
 */

import type {
  FaceShapeId,
  FaceShapeInput,
  FaceShapeResult,
  FaceShapeSex,
  FeatureSharpness,
  LengthUnit,
} from './types';

export const METHODOLOGY_NOTE =
  'Omega-defined aesthetic face-shape heuristic from forehead, cheek, jawline-proxy, and face-length ratios. Not Omiverse/Omni parity and not clinically validated.';

export const DISCLAIMER =
  'Educational styling context only — not medical, aesthetic-surgery, or identity assessment. Results follow an internal Omega rule set.';

export const JAWLINE_PROXY_CAVEAT =
  'Jawline length (chin to outer ear along the jaw) is used only as a jaw-width proxy, not true jaw breadth.';

export const CM_PER_INCH = 2.54;

export const SHAPE_LABELS: Record<FaceShapeId, string> = {
  oval: 'Oval',
  round: 'Round',
  oblong: 'Oblong',
  square: 'Square',
  triangle: 'Triangle (pear)',
  diamond: 'Diamond',
  heart: 'Heart',
};

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toCm(value: number, unit: LengthUnit): number {
  return unit === 'cm' ? value : value * CM_PER_INCH;
}

export function fromCm(cm: number, unit: LengthUnit): number {
  return unit === 'cm' ? cm : cm / CM_PER_INCH;
}

export function formatLength(cm: number, unit: LengthUnit): string {
  if (!Number.isFinite(cm)) return '';
  const v = fromCm(cm, unit);
  return String(Number(v.toFixed(4)));
}

export function formatRatio(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function sexTipForShape(sex: FaceShapeSex, shapeId: FaceShapeId): string {
  if (sex !== 'unset') {
    const who = sex === 'female' ? 'women' : 'men';
    return `Tips for ${who} with ${SHAPE_LABELS[shapeId].toLowerCase()} proportions are styling suggestions only.`;
  }
  return 'Select sex (optional) for gender-context styling tips — classification does not change.';
}

export interface ClassifyOutcome {
  shapeId: FaceShapeId;
  matchedRule: number | null;
  fallbackNote: string;
}

/**
 * Classify using ordered Omega heuristic (measurements in cm).
 */
export function classifyFaceShape(
  F: number,
  C: number,
  J: number,
  L: number,
  sharpness: FeatureSharpness,
): ClassifyOutcome {
  const rLF = L / C;
  const absFc = Math.abs(F - C) / C;
  const absCj = Math.abs(C - J) / C;

  // 1. HEART — narrow jaw + long face; forehead ≥ 1.05× cheeks, or equal F/C (Omni probe tie)
  const foreheadMeetsHeart = F >= C * 1.05 || (F >= C && Math.abs(F - C) <= C * 1e-6);
  if (foreheadMeetsHeart && J <= C * 0.92 && L >= C * 1.25) {
    return { shapeId: 'heart', matchedRule: 1, fallbackNote: '' };
  }

  // 2. DIAMOND
  if (
    C >= F * 1.05 &&
    C >= J * 1.05 &&
    L >= C * 1.2 &&
    sharpness !== 'round'
  ) {
    return { shapeId: 'diamond', matchedRule: 2, fallbackNote: '' };
  }

  // 3. TRIANGLE (pear)
  if (J >= C * 1.08 && J >= F * 1.05 && L >= C * 1.15) {
    return { shapeId: 'triangle', matchedRule: 3, fallbackNote: '' };
  }

  // 4. SQUARE
  if (
    absFc <= 0.06 &&
    absCj <= 0.08 &&
    rLF <= 1.35 &&
    sharpness !== 'round'
  ) {
    return { shapeId: 'square', matchedRule: 4, fallbackNote: '' };
  }

  // 5. ROUND
  if (
    absFc <= 0.08 &&
    absCj <= 0.1 &&
    rLF <= 1.28 &&
    (sharpness === 'round' || rLF <= 1.22)
  ) {
    return { shapeId: 'round', matchedRule: 5, fallbackNote: '' };
  }

  // 6. OBLONG
  if (rLF >= 1.45 && absFc <= 0.12 && absCj <= 0.12) {
    return { shapeId: 'oblong', matchedRule: 6, fallbackNote: '' };
  }

  // 7. OVAL
  if (rLF >= 1.28 && rLF < 1.45 && C >= F * 0.95 && C >= J * 0.95) {
    return { shapeId: 'oval', matchedRule: 7, fallbackNote: '' };
  }

  // 8. Soft fallback
  return {
    shapeId: 'oval',
    matchedRule: null,
    fallbackNote: 'closest match',
  };
}

function widestZone(
  F: number,
  C: number,
  J: number,
): 'forehead' | 'cheeks' | 'jawline' {
  const m = Math.max(F, C, J);
  if (m === F) return 'forehead';
  if (m === C) return 'cheeks';
  return 'jawline';
}

export function calculateFaceShape(input: FaceShapeInput): FaceShapeResult {
  const empty: FaceShapeResult = {
    foreheadCm: null,
    cheeksCm: null,
    jawlineCm: null,
    faceLengthCm: null,
    rLf: null,
    formattedRLf: '',
    widestZone: '',
    shapeId: null,
    shapeLabel: '',
    matchedRule: null,
    fallbackNote: '',
    statusHeadline: 'Enter measurements',
    statusDetail:
      'Enter forehead, cheeks, jawline length (proxy), and face length for an Omega-defined aesthetic estimate.',
    sexTip:
      input.sex === 'unset'
        ? 'Select sex (optional) for styling tips — not used in the numeric rules.'
        : '',
    methodologyNote: METHODOLOGY_NOTE,
    disclaimer: DISCLAIMER,
  };

  const fRaw = parseNumber(input.foreheadText);
  const cRaw = parseNumber(input.cheeksText);
  const jRaw = parseNumber(input.jawlineText);
  const lRaw = parseNumber(input.faceLengthText);

  const anyFilled =
    input.foreheadText.trim() !== '' ||
    input.cheeksText.trim() !== '' ||
    input.jawlineText.trim() !== '' ||
    input.faceLengthText.trim() !== '';

  if (
    fRaw === null ||
    cRaw === null ||
    jRaw === null ||
    lRaw === null
  ) {
    return {
      ...empty,
      statusHeadline: anyFilled ? 'Incomplete measurements' : 'Enter measurements',
      statusDetail: anyFilled
        ? 'Fill all four length fields with positive numbers.'
        : empty.statusDetail,
      sexTip:
        input.sex === 'unset'
          ? 'Select sex (optional) for styling tips — not used in the numeric rules.'
          : '',
    };
  }

  if (!(fRaw > 0 && cRaw > 0 && jRaw > 0 && lRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid measurements',
      statusDetail: 'All lengths must be greater than zero.',
      sexTip:
        input.sex === 'unset'
          ? 'Select sex (optional) for styling tips — not used in the numeric rules.'
          : '',
    };
  }

  const F = toCm(fRaw, input.foreheadUnit);
  const C = toCm(cRaw, input.cheeksUnit);
  const J = toCm(jRaw, input.jawlineUnit);
  const L = toCm(lRaw, input.faceLengthUnit);

  const { shapeId, matchedRule, fallbackNote } = classifyFaceShape(
    F,
    C,
    J,
    L,
    input.sharpness,
  );

  const rLf = Math.round((L / C) * 1000) / 1000;
  const zone = widestZone(F, C, J);

  const rulePhrase =
    matchedRule != null
      ? `Matched Omega heuristic rule ${matchedRule}.`
      : `Soft oval fallback (${fallbackNote}).`;

  return {
    foreheadCm: F,
    cheeksCm: C,
    jawlineCm: J,
    faceLengthCm: L,
    rLf,
    formattedRLf: formatRatio(rLf),
    widestZone: zone,
    shapeId,
    shapeLabel: SHAPE_LABELS[shapeId],
    matchedRule,
    fallbackNote,
    statusHeadline: `Face shape: ${SHAPE_LABELS[shapeId]}`,
    statusDetail: `${rulePhrase} ${JAWLINE_PROXY_CAVEAT} Length-to-cheek ratio (rLF) ≈ ${formatRatio(rLf)}; widest zone: ${zone}.`,
    sexTip: sexTipForShape(input.sex, shapeId),
    methodologyNote: METHODOLOGY_NOTE,
    disclaimer: DISCLAIMER,
  };
}