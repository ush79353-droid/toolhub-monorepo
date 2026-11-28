/**
 * Curtain panel fabric planning — pure math.
 * Coverage = R×F · W_panel = coverage/N · W_cut = W_panel+2Hs
 * Drops: D = ceil((W_cut−2S)/(W_f−2S)) when W_f>2S
 * L_cut = Lf+Ht+Hb · repeat ceil · purchase with shrinkage/waste · yards
 */

import type {
  CurtainPanelResult,
  CurtainPanelType,
  FabricWeight,
  LengthUnit,
} from './types';
import { PANEL_TYPE_LABELS } from './types';

export const CM_PER_MM = 0.1;
export const CM_PER_M = 100;
export const CM_PER_IN = 2.54;
export const CM_PER_FT = 30.48;
export const M_PER_YD = 0.9144;

export function convertLengthToCm(value: number, unit: LengthUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'mm') return value * CM_PER_MM;
  if (unit === 'm') return value * CM_PER_M;
  if (unit === 'in') return value * CM_PER_IN;
  return value * CM_PER_FT;
}

export function convertCmToLength(cm: number, unit: LengthUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'mm') return cm / CM_PER_MM;
  if (unit === 'm') return cm / CM_PER_M;
  if (unit === 'in') return cm / CM_PER_IN;
  return cm / CM_PER_FT;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertCmToLength(convertLengthToCm(value, from), to);
}

export function convertCurtainLengthUnits(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertLength(value, from, to);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatMeasurement(
  cm: number,
  unit: LengthUnit,
  digits = 2,
): string {
  return `${fmt(convertCmToLength(cm, unit), digits)} ${unit}`;
}

export function getRecommendedFullnessRatio(
  weight: FabricWeight,
  panelType: CurtainPanelType,
): number {
  let base =
    weight === 'lightweight'
      ? 2.5
      : weight === 'heavyweight'
        ? 1.5
        : weight === 'custom'
          ? 2
          : 2;
  if (panelType === 'gathered' && base < 2.5) base = Math.max(base, 2.5);
  if (panelType === 'grommet' && base > 2) base = Math.min(base, 2);
  return base;
}

export function calculateCurtainCoverageWidth(
  rodWidthCm: number,
  fullnessRatio: number,
): number {
  return rodWidthCm * fullnessRatio;
}

export function calculateFinishedPanelWidth(
  coverageCm: number,
  numberOfPanels: number,
): number {
  return coverageCm / numberOfPanels;
}

export function calculateCutPanelWidth(
  finishedPanelWidthCm: number,
  sideHemPerSideCm: number,
): number {
  return finishedPanelWidthCm + 2 * sideHemPerSideCm;
}

export function calculateAssembledWidth(
  drops: number,
  fabricWidthCm: number,
  joiningSeamPerEdgeCm: number,
): number {
  if (drops <= 1) return fabricWidthCm;
  return drops * fabricWidthCm - 2 * joiningSeamPerEdgeCm * (drops - 1);
}

/**
 * Smallest D≥1 such that assembled width ≥ cut width.
 * Closed form when W_f > 2S: D = ceil((W_cut − 2S) / (W_f − 2S))
 */
export function calculateFabricDropsPerPanel(
  cutWidthCm: number,
  fabricWidthCm: number,
  joiningSeamPerEdgeCm: number,
): { drops: number; assembledWidthCm: number; excessWidthCm: number } {
  if (fabricWidthCm <= 0) {
    return { drops: 0, assembledWidthCm: 0, excessWidthCm: 0 };
  }
  if (cutWidthCm <= fabricWidthCm) {
    return {
      drops: 1,
      assembledWidthCm: fabricWidthCm,
      excessWidthCm: fabricWidthCm - cutWidthCm,
    };
  }
  const S = joiningSeamPerEdgeCm;
  if (fabricWidthCm <= 2 * S) {
    // Cannot join usefully — report infeasible via 0 drops
    return { drops: 0, assembledWidthCm: 0, excessWidthCm: 0 };
  }
  const D = Math.max(
    1,
    Math.ceil((cutWidthCm - 2 * S) / (fabricWidthCm - 2 * S)),
  );
  const assembled = calculateAssembledWidth(D, fabricWidthCm, S);
  return {
    drops: D,
    assembledWidthCm: assembled,
    excessWidthCm: assembled - cutWidthCm,
  };
}

export function calculateTotalFabricDrops(
  dropsPerPanel: number,
  numberOfPanels: number,
): number {
  return dropsPerPanel * numberOfPanels;
}

export function calculateBaseCutLength(
  finishedLengthCm: number,
  topAllowanceCm: number,
  bottomAllowanceCm: number,
): number {
  return finishedLengthCm + topAllowanceCm + bottomAllowanceCm;
}

export function calculatePatternRepeatLength(
  baseCutLengthCm: number,
  patternRepeatCm: number,
): number {
  if (patternRepeatCm <= 0) return baseCutLengthCm;
  return Math.ceil(baseCutLengthCm / patternRepeatCm) * patternRepeatCm;
}

export function calculateFabricShrinkageAllowance(
  lengthCm: number,
  shrinkagePercentage: number,
): number {
  if (shrinkagePercentage <= 0) return lengthCm;
  if (shrinkagePercentage >= 100) return Number.POSITIVE_INFINITY;
  return lengthCm / (1 - shrinkagePercentage / 100);
}

export function calculateFabricWasteAllowance(
  lengthCm: number,
  wastePercentage: number,
): number {
  return lengthCm * (1 + Math.max(0, wastePercentage) / 100);
}

export function calculateTotalFabricLength(
  cutLengthPerDropCm: number,
  totalDrops: number,
): number {
  return cutLengthPerDropCm * totalDrops;
}

export function calculateFabricYardage(totalLengthCm: number): number {
  const meters = totalLengthCm / CM_PER_M;
  return meters / M_PER_YD;
}

export function roundFabricPurchaseQuantity(
  yards: number,
  increment = 0.25,
): number {
  if (!Number.isFinite(yards) || yards <= 0) return 0;
  return Math.ceil(yards / increment - 1e-12) * increment;
}

export function calculateCurtainPanelResults(args: {
  panelType: CurtainPanelType;
  fullnessRatio: number;
  rodWidthCm: number;
  finishedLengthCm: number;
  numberOfPanels: number;
  fabricWidthCm: number;
  sideHemAllowanceCm: number;
  topAllowanceCm: number;
  bottomAllowanceCm: number;
  joiningSeamAllowanceCm: number;
  patternRepeatCm: number;
  shrinkagePercentage: number;
  wastePercentage: number;
}): CurtainPanelResult {
  const coverage = calculateCurtainCoverageWidth(
    args.rodWidthCm,
    args.fullnessRatio,
  );
  const finishedW = calculateFinishedPanelWidth(
    coverage,
    args.numberOfPanels,
  );
  const cutW = calculateCutPanelWidth(finishedW, args.sideHemAllowanceCm);
  const dropInfo = calculateFabricDropsPerPanel(
    cutW,
    args.fabricWidthCm,
    args.joiningSeamAllowanceCm,
  );
  const warnings: string[] = [];
  if (dropInfo.drops === 0) {
    warnings.push(
      'Fabric width is too narrow for the joining-seam configuration — widen fabric or reduce seam allowance.',
    );
  }
  if (args.fullnessRatio < 1.2 || args.fullnessRatio > 3.5) {
    warnings.push(
      'Fullness ratio is unusual for typical drapery — check preferred look and heading style.',
    );
  }

  const baseLen = calculateBaseCutLength(
    args.finishedLengthCm,
    args.topAllowanceCm,
    args.bottomAllowanceCm,
  );
  const dropLen = calculatePatternRepeatLength(
    baseLen,
    args.patternRepeatCm,
  );
  const totalDrops = calculateTotalFabricDrops(
    dropInfo.drops,
    args.numberOfPanels,
  );
  let totalLen = calculateTotalFabricLength(dropLen, totalDrops);
  totalLen = calculateFabricShrinkageAllowance(
    totalLen,
    args.shrinkagePercentage,
  );
  totalLen = calculateFabricWasteAllowance(totalLen, args.wastePercentage);

  const yards = calculateFabricYardage(totalLen);
  const purchase = roundFabricPurchaseQuantity(yards, 0.25);

  const formulaSteps = [
    `W_coverage = R×F = ${fmt(args.rodWidthCm, 1)}×${fmt(args.fullnessRatio, 2)} = ${fmt(coverage, 1)} cm`,
    `W_panel = coverage/N = ${fmt(coverage, 1)}/${args.numberOfPanels} = ${fmt(finishedW, 1)} cm`,
    `W_cut = W_panel+2Hs = ${fmt(finishedW, 1)}+2×${fmt(args.sideHemAllowanceCm, 1)} = ${fmt(cutW, 1)} cm`,
    `Drops/panel = ${dropInfo.drops} (assembled ${fmt(dropInfo.assembledWidthCm, 1)} cm)`,
    `L_cut = Lf+Ht+Hb${args.patternRepeatCm > 0 ? ' → repeat-aligned' : ''} = ${fmt(dropLen, 1)} cm`,
    `Total drops = ${dropInfo.drops}×${args.numberOfPanels} = ${totalDrops}`,
    `L_total = ${fmt(totalLen, 1)} cm = ${fmt(totalLen / 100, 2)} m ≈ ${fmt(yards, 2)} yd → buy ${fmt(purchase, 2)} yd`,
  ];

  return {
    totalCoverageWidthCm: coverage,
    finishedWidthPerPanelCm: finishedW,
    cutWidthPerPanelCm: cutW,
    cutLengthPerDropCm: dropLen,
    fabricDropsPerPanel: dropInfo.drops,
    totalFabricDrops: totalDrops,
    assembledWidthCm: dropInfo.assembledWidthCm,
    excessWidthCm: dropInfo.excessWidthCm,
    totalFabricLengthCm: totalLen,
    totalFabricMeters: totalLen / 100,
    totalFabricYards: yards,
    recommendedPurchaseYards: purchase,
    fullnessRatio: args.fullnessRatio,
    panelType: args.panelType,
    formulaSteps,
    explanation: `${PANEL_TYPE_LABELS[args.panelType]} plan at ${fmt(args.fullnessRatio, 2)}× fullness. Fabric drops are widths of cloth joined into a panel — not the same as finished curtain panels.`,
    warnings,
  };
}
