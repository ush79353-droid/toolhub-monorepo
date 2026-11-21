/**
 * Deadweight loss estimates.
 * Triangle: DWL = ½ |ΔP| |ΔQ|
 * Tax: DWL = ½ t (Qe − Qt); revenue = t Qt
 * Linear: PD=a−bQ, PS=c+dQ → Qe=(a−c)/(b+d); DWL = ½(b+d)(Qe−Qd)²
 */
import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  DeadweightLossGraph,
  DeadweightLossMode,
  GraphPoint,
  QuantityUnitLabel,
} from './types';

export function calculateTriangleDwl(
  originalPrice: number,
  newPrice: number,
  originalQuantity: number,
  newQuantity: number
): {
  priceDifference: number;
  quantityDifference: number;
  deadweightLoss: number;
} | null {
  if (
    ![originalPrice, newPrice, originalQuantity, newQuantity].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (
    originalPrice < 0 ||
    newPrice < 0 ||
    originalQuantity < 0 ||
    newQuantity < 0
  ) {
    return null;
  }
  const priceDifference = Math.abs(newPrice - originalPrice);
  const quantityDifference = Math.abs(newQuantity - originalQuantity);
  const deadweightLoss = 0.5 * priceDifference * quantityDifference;
  if (!Number.isFinite(deadweightLoss)) return null;
  return { priceDifference, quantityDifference, deadweightLoss };
}

export function calculateTaxDwl(
  efficientQuantity: number,
  afterTaxQuantity: number,
  taxWedge: number
): {
  quantityDifference: number;
  deadweightLoss: number;
  taxRevenue: number;
} | null {
  if (
    ![efficientQuantity, afterTaxQuantity, taxWedge].every(Number.isFinite)
  ) {
    return null;
  }
  if (efficientQuantity < 0 || afterTaxQuantity < 0 || taxWedge < 0) {
    return null;
  }
  const quantityDifference = Math.abs(efficientQuantity - afterTaxQuantity);
  const deadweightLoss = 0.5 * taxWedge * quantityDifference;
  const taxRevenue = taxWedge * afterTaxQuantity;
  if (![deadweightLoss, taxRevenue].every(Number.isFinite)) return null;
  return { quantityDifference, deadweightLoss, taxRevenue };
}

export function calculateLinearEquilibrium(
  a: number,
  b: number,
  c: number,
  d: number
): { qe: number; pe: number } | null {
  if (![a, b, c, d].every(Number.isFinite)) return null;
  if (b <= 0 || d <= 0) return null;
  const denom = b + d;
  if (denom <= 0) return null;
  const qe = (a - c) / denom;
  if (!Number.isFinite(qe) || qe < 0) return null;
  const pe = a - b * qe;
  if (!Number.isFinite(pe) || pe < 0) return null;
  // Also check supply side consistency
  const peSupply = c + d * qe;
  if (Math.abs(pe - peSupply) > 1e-9) {
    // floating noise only — still ok if close
    if (Math.abs(pe - peSupply) > 1e-6) return null;
  }
  return { qe, pe };
}

/** DWL = ½(b+d)(Qe−Qd)² under linear inverse S&D. */
export function calculateLinearDwl(
  a: number,
  b: number,
  c: number,
  d: number,
  qd: number
): {
  qe: number;
  pe: number;
  quantityDifference: number;
  deadweightLoss: number;
  priceWedgeAtQd: number;
} | null {
  if (!Number.isFinite(qd) || qd < 0) return null;
  const eq = calculateLinearEquilibrium(a, b, c, d);
  if (!eq) return null;
  const { qe, pe } = eq;
  const quantityDifference = Math.abs(qe - qd);
  const deadweightLoss = 0.5 * (b + d) * quantityDifference * quantityDifference;
  const pd = a - b * qd;
  const ps = c + d * qd;
  const priceWedgeAtQd = Math.abs(pd - ps);
  if (![deadweightLoss, priceWedgeAtQd].every(Number.isFinite)) return null;
  if (pd < 0 || ps < 0) return null;
  return { qe, pe, quantityDifference, deadweightLoss, priceWedgeAtQd };
}

export function formatMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const symbol = getCurrencySymbol(currency);
  const body = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
  return `${symbol}${body}`;
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
}

function triangleGraph(
  p1: number,
  p2: number,
  q1: number,
  q2: number,
  modeNote: string
): DeadweightLossGraph {
  const qEff = Math.max(q1, q2);
  const qDist = Math.min(q1, q2);
  const pLow = Math.min(p1, p2);
  const pHigh = Math.max(p1, p2);
  const qMax = Math.max(qEff * 1.15, qDist * 1.15, 1);
  const pMax = Math.max(pHigh * 1.2, pLow * 1.2, 1);
  // Illustrative DWL triangle: apex at (qEff, mid) is wrong —
  // standard textbook triangle: vertices at (Qd, Pc), (Qd, Pp), (Qe, Pe≈mid)
  // For generic |ΔP|×|ΔQ|/2 we place:
  // (qDist, pHigh), (qDist, pLow), (qEff, (pHigh+pLow)/2)
  const mid = (pHigh + pLow) / 2;
  const dwlPolygon: GraphPoint[] = [
    { q: qDist, p: pHigh },
    { q: qDist, p: pLow },
    { q: qEff, p: mid },
  ];
  return {
    kind: 'triangle',
    dwlPolygon,
    qEfficient: qEff,
    qDistorted: qDist,
    pLow,
    pHigh,
    qMax,
    pMax,
    labels: {
      title: 'Illustrative deadweight-loss triangle',
      note: modeNote,
    },
  };
}

function linearGraph(
  a: number,
  b: number,
  c: number,
  d: number,
  qe: number,
  qd: number,
  pe: number
): DeadweightLossGraph {
  const qHi = Math.max(qe, qd) * 1.25;
  const qMax = Math.max(qHi, 1);
  const samples = 24;
  const demandPoints: GraphPoint[] = [];
  const supplyPoints: GraphPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const q = (qMax * i) / samples;
    demandPoints.push({ q, p: a - b * q });
    supplyPoints.push({ q, p: c + d * q });
  }
  const pd = a - b * qd;
  const ps = c + d * qd;
  const pHigh = Math.max(pd, ps, pe);
  const pLow = Math.min(pd, ps, pe);
  const pMax = Math.max(
    ...demandPoints.map((pt) => pt.p),
    ...supplyPoints.map((pt) => pt.p),
    pHigh,
    1
  ) * 1.1;

  // Polygon between curves from qd to qe
  const steps = 16;
  const qLo = Math.min(qd, qe);
  const qHiSeg = Math.max(qd, qe);
  const upper: GraphPoint[] = [];
  const lower: GraphPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const q = qLo + ((qHiSeg - qLo) * i) / steps;
    const pD = a - b * q;
    const pS = c + d * q;
    upper.push({ q, p: Math.max(pD, pS) });
    lower.push({ q, p: Math.min(pD, pS) });
  }
  const dwlPolygon = [...upper, ...lower.reverse()];

  return {
    kind: 'linear',
    dwlPolygon,
    demandPoints,
    supplyPoints,
    qEfficient: qe,
    qDistorted: qd,
    pLow,
    pHigh,
    qMax,
    pMax: Math.max(pMax, 1),
    labels: {
      title: 'Linear supply & demand with DWL region',
      note: 'Shaded area is ∫|PD−PS| between Qd and Qe (equals ½(b+d)(Qe−Qd)²).',
    },
  };
}

export function buildTriangleGraph(
  originalPrice: number,
  newPrice: number,
  originalQuantity: number,
  newQuantity: number
): DeadweightLossGraph {
  return triangleGraph(
    originalPrice,
    newPrice,
    originalQuantity,
    newQuantity,
    'Illustrative geometry from |ΔP| and |ΔQ| only — not fitted supply/demand curves.'
  );
}

export function buildTaxGraph(
  efficientQuantity: number,
  afterTaxQuantity: number,
  taxWedge: number
): DeadweightLossGraph {
  // Place wedge at after-tax qty with height t; apex toward efficient qty at mid.
  const pLow = 0;
  const pHigh = taxWedge;
  return triangleGraph(
    pLow,
    pHigh,
    efficientQuantity,
    afterTaxQuantity,
    'Illustrative tax wedge triangle: DWL = ½ t |Qe − Qt|. Not a full S&D model.'
  );
}

export function buildLinearGraph(
  a: number,
  b: number,
  c: number,
  d: number,
  qe: number,
  qd: number,
  pe: number
): DeadweightLossGraph {
  return linearGraph(a, b, c, d, qe, qd, pe);
}

export function modeLabel(mode: DeadweightLossMode): string {
  if (mode === 'triangle') return 'Simple triangle';
  if (mode === 'tax') return 'Per-unit tax';
  return 'Linear supply & demand';
}

export function quantityUnitPhrase(unit: QuantityUnitLabel): string {
  return unit;
}
