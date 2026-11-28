/**
 * Wheel Offset — pure rim-edge geometry.
 * I = W/2 + ET; O = W/2 − ET; C = I_c − I_n; P = O_n − O_c
 */

import type { LengthUnit, WheelOffsetResult } from './types';

export const MM_PER_IN = 25.4;
export const MM_PER_CM = 10;

export function convertLengthToMillimeters(
  value: number,
  unit: LengthUnit,
): number {
  if (unit === 'mm') return value;
  if (unit === 'cm') return value * MM_PER_CM;
  return value * MM_PER_IN;
}

export function convertMillimetersToLength(
  mm: number,
  unit: LengthUnit,
): number {
  if (unit === 'mm') return mm;
  if (unit === 'cm') return mm / MM_PER_CM;
  return mm / MM_PER_IN;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertMillimetersToLength(
    convertLengthToMillimeters(value, from),
    to,
  );
}

/** Inward extent from hub-mounting plane (mm). */
export function calculateWheelInnerPosition(
  widthMm: number,
  offsetMm: number,
): number {
  return widthMm / 2 + offsetMm;
}

/** Outward extent from hub-mounting plane (mm). */
export function calculateWheelOuterPosition(
  widthMm: number,
  offsetMm: number,
): number {
  return widthMm / 2 - offsetMm;
}

export function calculateClearanceChange(
  currentInnerMm: number,
  newInnerMm: number,
): number {
  return currentInnerMm - newInnerMm;
}

export function calculatePositionChange(
  newOuterMm: number,
  currentOuterMm: number,
): number {
  return newOuterMm - currentOuterMm;
}

export function calculateWheelWidthDifference(
  newWidthMm: number,
  currentWidthMm: number,
): number {
  return newWidthMm - currentWidthMm;
}

export function calculateWheelOffsetDifference(
  newOffsetMm: number,
  currentOffsetMm: number,
): number {
  return newOffsetMm - currentOffsetMm;
}

export function fmt(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

function signedMm(n: number, digits = 1): string {
  const abs = Math.abs(n);
  const body = `${fmt(abs, digits)} mm`;
  if (Math.abs(n) < 1e-9) return `0 mm`;
  return n > 0 ? `+${body}` : `−${body}`;
}

function etLabel(offsetMm: number): string {
  const r = Math.round(offsetMm * 100) / 100;
  if (r === 0) return 'ET0';
  return r > 0 ? `ET${fmt(r, 1)}` : `ET${fmt(r, 1)}`;
}

export function computeWheelOffset(params: {
  currentWidth: number;
  currentWidthUnit: LengthUnit;
  currentOffset: number;
  currentOffsetUnit: LengthUnit;
  newWidth: number;
  newWidthUnit: LengthUnit;
  newOffset: number;
  newOffsetUnit: LengthUnit;
}): WheelOffsetResult {
  const Wc = convertLengthToMillimeters(
    params.currentWidth,
    params.currentWidthUnit,
  );
  const Wn = convertLengthToMillimeters(params.newWidth, params.newWidthUnit);
  const ETc = convertLengthToMillimeters(
    params.currentOffset,
    params.currentOffsetUnit,
  );
  const ETn = convertLengthToMillimeters(
    params.newOffset,
    params.newOffsetUnit,
  );

  const Ic = calculateWheelInnerPosition(Wc, ETc);
  const In = calculateWheelInnerPosition(Wn, ETn);
  const Oc = calculateWheelOuterPosition(Wc, ETc);
  const On = calculateWheelOuterPosition(Wn, ETn);

  const C = calculateClearanceChange(Ic, In);
  const P = calculatePositionChange(On, Oc);
  const dW = calculateWheelWidthDifference(Wn, Wc);
  const dET = calculateWheelOffsetDifference(ETn, ETc);

  let clearanceInterpretation: string;
  if (Math.abs(C) < 1e-9) {
    clearanceInterpretation =
      'Nominal inner rim-edge position is unchanged relative to the hub-mounting plane.';
  } else if (C > 0) {
    clearanceInterpretation = `Your new wheel will sit approximately ${fmt(C, 1)} mm farther from the suspension side (more inner clearance at the rim edge).`;
  } else {
    clearanceInterpretation = `Your new wheel will sit approximately ${fmt(Math.abs(C), 1)} mm closer to the suspension or other inner components.`;
  }

  let positionInterpretation: string;
  if (Math.abs(P) < 1e-9) {
    positionInterpretation =
      'Nominal outer rim-edge position is unchanged relative to the hub-mounting plane.';
  } else if (P > 0) {
    positionInterpretation = `Your new wheel will extend approximately ${fmt(P, 1)} mm farther outward toward the fender.`;
  } else {
    positionInterpretation = `Your new wheel will sit approximately ${fmt(Math.abs(P), 1)} mm farther inward from the fender side.`;
  }

  const formulaSteps = [
    `W_c = ${fmt(params.currentWidth, 2)} ${params.currentWidthUnit} = ${fmt(Wc, 2)} mm`,
    `W_n = ${fmt(params.newWidth, 2)} ${params.newWidthUnit} = ${fmt(Wn, 2)} mm`,
    `ET_c = ${fmt(ETc, 2)} mm · ET_n = ${fmt(ETn, 2)} mm`,
    `I = W/2 + ET → I_c = ${fmt(Ic, 2)} mm · I_n = ${fmt(In, 2)} mm`,
    `O = W/2 − ET → O_c = ${fmt(Oc, 2)} mm · O_n = ${fmt(On, 2)} mm`,
    `C = I_c − I_n = ${fmt(C, 2)} mm`,
    `P = O_n − O_c = ${fmt(P, 2)} mm`,
  ];

  return {
    currentWidthMm: Wc,
    newWidthMm: Wn,
    currentOffsetMm: ETc,
    newOffsetMm: ETn,
    currentInnerPositionMm: Ic,
    newInnerPositionMm: In,
    currentOuterPositionMm: Oc,
    newOuterPositionMm: On,
    clearanceChangeMm: C,
    positionChangeMm: P,
    widthDifferenceMm: dW,
    offsetDifferenceMm: dET,
    clearanceInterpretation,
    positionInterpretation,
    formulaSteps,
    interpretation: `${clearanceInterpretation} ${positionInterpretation} Nominal rim edges only — not a fitment guarantee.`,
    currentWidthDisplay: `${fmt(params.currentWidth, 2)} ${params.currentWidthUnit}`,
    newWidthDisplay: `${fmt(params.newWidth, 2)} ${params.newWidthUnit}`,
    currentOffsetDisplay: etLabel(ETc),
    newOffsetDisplay: etLabel(ETn),
    clearanceDisplay: signedMm(C, 1),
    positionDisplay: signedMm(P, 1),
  };
}
