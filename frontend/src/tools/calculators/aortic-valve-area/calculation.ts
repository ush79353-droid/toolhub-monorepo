/**
 * Aortic Valve Area (continuity equation) — educational Doppler AVA.
 *
 * AVA = π (d_cm / 2)² × VTI_LVOT / VTI_AV
 *
 * VTI₁ = LVOT stroke distance; VTI₂ = transaortic jet stroke distance.
 * Severity table matches the reference screenshot bands with boundary
 * resolution documented below. ACC/AHA 2020 treats AVA ≤ 1.0 cm² as typical
 * for severe AS but not required alone; area alone cannot grade discordant
 * velocity/gradient studies.
 *
 * Sources: continuity equation (standard Doppler echo); 2020 ACC/AHA Guideline
 * for the Management of Patients With Valvular Heart Disease (JACC).
 */

import type {
  AorticValveAreaResult,
  AreaUnit,
  AsSeverityBand,
  LengthUnit,
  VtiUnit,
} from './types';

export const SOURCE_LABEL =
  'Continuity-equation Doppler AVA; severity bands shown for education with ACC/AHA 2020 VHD guideline context (AVA ≤1.0 cm² typical for severe AS; not required alone).';

export const DISCLAIMER =
  'Educational continuity-equation estimate only. It does not diagnose aortic stenosis, recommend intervention, or replace echocardiography interpreted by a qualified clinician. Valve area alone cannot establish severity when Doppler findings are discordant.';

/** Practical upper bound for adult LVOT diameter (cm) to reject typos. */
export const MAX_LVOT_CM = 5;

/** Practical upper bound for VTI in cm. */
export const MAX_VTI_CM = 500;

export function lengthToCm(value: number, unit: LengthUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'mm':
      return value / 10;
    default:
      return null;
  }
}

export function cmToLength(cm: number, unit: LengthUnit): number {
  return unit === 'mm' ? cm * 10 : cm;
}

export function vtiToCm(value: number, unit: VtiUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    default:
      return null;
  }
}

export function cmToVti(cm: number, unit: VtiUnit): number {
  return unit === 'm' ? cm / 100 : cm;
}

export function cm2ToArea(cm2: number, unit: AreaUnit): number {
  return unit === 'mm2' ? cm2 * 100 : cm2;
}

export function areaToCm2(value: number, unit: AreaUnit): number {
  return unit === 'mm2' ? value / 100 : value;
}

/**
 * Continuity-equation AVA in cm².
 * Requires positive LVOT diameter and both VTIs; rejects non-finite results.
 */
export function computeAvaCm2(
  lvotCm: number,
  vtiLvotCm: number,
  vtiAvCm: number
): number | null {
  if (
    !Number.isFinite(lvotCm) ||
    !Number.isFinite(vtiLvotCm) ||
    !Number.isFinite(vtiAvCm)
  ) {
    return null;
  }
  if (lvotCm <= 0 || vtiLvotCm <= 0 || vtiAvCm <= 0) return null;
  const radius = lvotCm / 2;
  const csa = Math.PI * radius * radius;
  const ava = (csa * vtiLvotCm) / vtiAvCm;
  if (!Number.isFinite(ava) || ava < 0) return null;
  return ava;
}

/**
 * Screenshot table with resolved boundaries:
 * - severe: AVA &lt; 1
 * - moderate: 1 ≤ AVA ≤ 1.5 (ACC/AHA moderate band; 1.5 stays moderate)
 * - mild: 1.5 &lt; AVA ≤ 3
 * - normal: AVA &gt; 3 (educational upper band; not an ACC/AHA “normal” definition)
 *
 * Note: ACC/AHA 2020 often cites severe as AVA ≤ 1.0 cm²; the screenshot uses
 * &lt; 1 for severe, so exactly 1.0 cm² maps to moderate here for UI parity.
 */
export function classifySeverity(avaCm2: number): AsSeverityBand {
  if (avaCm2 < 1) return 'severe';
  if (avaCm2 <= 1.5) return 'moderate';
  if (avaCm2 <= 3) return 'mild';
  return 'normal';
}

export const SEVERITY_LABELS: Record<AsSeverityBand, string> = {
  severe: 'Severe',
  moderate: 'Moderate',
  mild: 'Mild',
  normal: 'Normal',
};

export function formatAva(value: number, unit: AreaUnit): string {
  const digits = unit === 'mm2' ? 2 : 4;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function calculateAorticValveArea(
  lvotCm: number,
  vtiLvotCm: number,
  vtiAvCm: number,
  avaUnit: AreaUnit
): AorticValveAreaResult | null {
  const avaCm2 = computeAvaCm2(lvotCm, vtiLvotCm, vtiAvCm);
  if (avaCm2 == null) return null;

  const band = classifySeverity(avaCm2);
  const avaDisplay = cm2ToArea(avaCm2, avaUnit);
  const unitLabel = avaUnit === 'mm2' ? 'mm²' : 'cm²';

  return {
    avaCm2,
    avaDisplay,
    formattedAva: formatAva(avaDisplay, avaUnit),
    severityBand: band,
    severityLabel: SEVERITY_LABELS[band],
    explanation: `AVA = π × (LVOT/2)² × VTI₁/VTI₂ = ${formatAva(avaCm2, 'cm2')} cm² (${formatAva(avaDisplay, avaUnit)} ${unitLabel}). VTI₁ is LVOT stroke distance; VTI₂ is the transaortic jet. Educational band: ${SEVERITY_LABELS[band]}. Area alone cannot grade discordant studies.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
