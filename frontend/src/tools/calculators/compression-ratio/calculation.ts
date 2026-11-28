/**
 * Compression ratio engine — canonical lengths in mm, volumes in cc.
 */

import type {
  CompressionRatioInput,
  CompressionRatioResult,
  LengthUnit,
  VolumeUnit,
} from './types';

export const MM_PER_IN = 25.4;
export const CC_PER_IN3 = 16.387064;

function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  const toMm: Record<LengthUnit, number> = {
    mm: 1,
    cm: 10,
    m: 1000,
    in: MM_PER_IN,
  };
  return (value * toMm[from]) / toMm[to];
}

export function toMm(value: number, unit: LengthUnit): number {
  return convertLength(value, unit, 'mm');
}

export function convertVolume(
  value: number,
  from: VolumeUnit,
  to: VolumeUnit,
): number {
  const toCc: Record<VolumeUnit, number> = {
    cc: 1,
    mL: 1,
    L: 1000,
    in3: CC_PER_IN3,
  };
  return (value * toCc[from]) / toCc[to];
}

export function toCc(value: number, unit: VolumeUnit): number {
  return convertVolume(value, unit, 'cc');
}

export function fromCc(cc: number, unit: VolumeUnit): number {
  return convertVolume(cc, 'cc', unit);
}

export function calculateCylinderArea(boreMm: number): number | null {
  if (!(boreMm > 0)) return null;
  return (Math.PI / 4) * boreMm * boreMm;
}

/** Swept volume in cc from bore & stroke in mm: π D² L / 4000 */
export function calculateSweptVolume(
  boreMm: number,
  strokeMm: number,
): number | null {
  if (!(boreMm > 0) || !(strokeMm > 0)) return null;
  return (Math.PI * boreMm * boreMm * strokeMm) / 4000;
}

export function calculateEngineDisplacement(
  sweptCc: number,
  cylinders: number,
): number | null {
  if (!(sweptCc > 0) || !(cylinders >= 1) || !Number.isInteger(cylinders)) {
    return null;
  }
  return sweptCc * cylinders;
}

export function calculateHeadGasketVolume(
  gasketBoreMm: number,
  thicknessMm: number,
): number | null {
  if (!(gasketBoreMm > 0) || thicknessMm < 0) return null;
  return (Math.PI * gasketBoreMm * gasketBoreMm * thicknessMm) / 4000;
}

export function calculateDeckClearanceVolume(
  boreMm: number,
  deckMm: number,
): number | null {
  if (!(boreMm > 0) || !Number.isFinite(deckMm)) return null;
  return (Math.PI * boreMm * boreMm * deckMm) / 4000;
}

export function calculateTotalClearanceVolume(
  chamberCc: number,
  gasketCc: number,
  deckCc: number,
  pistonCc: number,
): number | null {
  if (
    ![chamberCc, gasketCc, deckCc, pistonCc].every(Number.isFinite) ||
    chamberCc < 0
  ) {
    return null;
  }
  const total = chamberCc + gasketCc + deckCc + pistonCc;
  if (!(total > 0)) return null;
  return total;
}

export function calculateVolumeAtBDC(
  sweptCc: number,
  clearanceCc: number,
): number {
  return sweptCc + clearanceCc;
}

export function calculateStaticCompressionRatio(
  sweptCc: number,
  clearanceCc: number,
): number | null {
  if (!(sweptCc >= 0) || !(clearanceCc > 0)) return null;
  return (sweptCc + clearanceCc) / clearanceCc;
}

export function calculateClearanceVolumeFromRatio(
  sweptCc: number,
  cr: number,
): number | null {
  if (!(sweptCc > 0) || !(cr > 1)) return null;
  return sweptCc / (cr - 1);
}

export function calculateCompressionRatioFromVolumes(
  displacementCc: number,
  compressedCc: number,
): number | null {
  return calculateStaticCompressionRatio(displacementCc, compressedCc);
}

/**
 * Piston distance from TDC (mm) for crank angle θ measured from TDC
 * (0 at TDC, π at BDC). Crank radius r = stroke/2.
 */
export function calculatePistonPosition(
  strokeMm: number,
  rodMm: number,
  thetaRad: number,
): number | null {
  if (!(strokeMm > 0) || !(rodMm > 0)) return null;
  const r = strokeMm / 2;
  if (!(rodMm > r)) return null;
  const sin = Math.sin(thetaRad);
  const under = rodMm * rodMm - r * r * sin * sin;
  if (under < 0) return null;
  return r * (1 - Math.cos(thetaRad)) + rodMm - Math.sqrt(under);
}

/**
 * IVC ABDC → θ = π + α (radians). Effective remaining stroke = x(θ).
 * At α=0 (IVC at BDC), x(π)=stroke → DCR = SCR.
 */
export function calculateEffectiveCompressionStroke(
  strokeMm: number,
  rodMm: number,
  ivcAbdcDeg: number,
): number | null {
  if (!(ivcAbdcDeg >= 0) || !(ivcAbdcDeg < 180)) return null;
  const alpha = (ivcAbdcDeg * Math.PI) / 180;
  const theta = Math.PI + alpha;
  const x = calculatePistonPosition(strokeMm, rodMm, theta);
  if (x == null) return null;
  if (x < 0 || x > strokeMm + 1e-6) return null;
  return Math.min(strokeMm, Math.max(0, x));
}

export function calculateEffectiveSweptVolume(
  boreMm: number,
  effectiveStrokeMm: number,
): number | null {
  return calculateSweptVolume(boreMm, effectiveStrokeMm);
}

export function calculateDynamicCompressionRatio(
  effectiveSweptCc: number,
  clearanceCc: number,
): number | null {
  return calculateStaticCompressionRatio(effectiveSweptCc, clearanceCc);
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function parsePositiveInt(raw: string): number | null {
  const n = parseNum(raw);
  if (n == null || !Number.isInteger(n) || n < 1) return null;
  return n;
}

export function calculateCompressionFromInput(
  input: CompressionRatioInput,
): CompressionRatioResult | null {
  const steps: string[] = [];
  let cylinders = 1;
  let swept = 0;
  let engineDisp = 0;
  let gasket = 0;
  let deck = 0;
  let piston = 0;
  let chamber = 0;
  let clearance = 0;
  let cr = 0;
  let boreMm = 0;
  let strokeMm = 0;

  if (input.mode === 'knownVolumes') {
    const vs = parseNum(input.displacementVolume);
    const vc = parseNum(input.compressedVolume);
    if (vs == null || !(vs > 0) || vc == null || !(vc > 0)) return null;
    swept = toCc(vs, input.displacementVolumeUnit);
    clearance = toCc(vc, input.compressedVolumeUnit);
    cr = calculateStaticCompressionRatio(swept, clearance)!;
    chamber = clearance;
    engineDisp = swept;
    steps.push(`Vs = ${fmt(swept)} cc · Vc = ${fmt(clearance)} cc`);
    steps.push(`CR = (Vs + Vc) / Vc = ${fmt(cr, 4)} : 1`);
  } else if (input.mode === 'clearanceFromRatio') {
    const vs = parseNum(input.displacementVolume);
    const target = parseNum(input.targetCR);
    if (vs == null || !(vs > 0) || target == null || !(target > 1)) return null;
    swept = toCc(vs, input.displacementVolumeUnit);
    clearance = calculateClearanceVolumeFromRatio(swept, target)!;
    cr = target;
    chamber = clearance;
    engineDisp = swept;
    steps.push(`Vc = Vs / (CR − 1) = ${fmt(swept)} / (${fmt(target)} − 1)`);
    steps.push(`Vc = ${fmt(clearance)} cc`);
  } else {
    // engineGeometry
    cylinders = parsePositiveInt(input.cylinders) ?? 0;
    if (!(cylinders >= 1)) return null;
    const boreRaw = parseNum(input.bore);
    const strokeRaw = parseNum(input.stroke);
    const chamberRaw = parseNum(input.chamberVolume);
    if (
      boreRaw == null ||
      !(boreRaw > 0) ||
      strokeRaw == null ||
      !(strokeRaw > 0) ||
      chamberRaw == null ||
      chamberRaw < 0
    ) {
      return null;
    }
    boreMm = toMm(boreRaw, input.boreUnit);
    strokeMm = toMm(strokeRaw, input.strokeUnit);
    chamber = toCc(chamberRaw, input.chamberVolumeUnit);

    const gThickRaw = parseNum(input.gasketThickness) ?? 0;
    if (gThickRaw < 0) return null;
    const gThickMm = toMm(gThickRaw, input.gasketThicknessUnit);
    let gBoreMm = boreMm;
    if (!input.useBoreForGasket) {
      const gb = parseNum(input.gasketBore);
      if (gb == null || !(gb > 0)) return null;
      gBoreMm = toMm(gb, input.gasketBoreUnit);
    }
    gasket = calculateHeadGasketVolume(gBoreMm, gThickMm) ?? 0;

    const deckRaw = parseNum(input.deckClearance) ?? 0;
    deck = calculateDeckClearanceVolume(boreMm, toMm(deckRaw, input.deckClearanceUnit)) ?? 0;

    const pistRaw = parseNum(input.pistonVolume) ?? 0;
    piston = toCc(pistRaw, input.pistonVolumeUnit);

    swept = calculateSweptVolume(boreMm, strokeMm)!;
    engineDisp = calculateEngineDisplacement(swept, cylinders)!;
    const vc = calculateTotalClearanceVolume(chamber, gasket, deck, piston);
    if (vc == null) return null;
    clearance = vc;
    cr = calculateStaticCompressionRatio(swept, clearance)!;

    steps.push(
      `Vs = π D² L / 4000 = π × ${fmt(boreMm)}² × ${fmt(strokeMm)} / 4000 = ${fmt(swept)} cc`,
    );
    steps.push(
      `Engine = Vs × N = ${fmt(swept)} × ${cylinders} = ${fmt(engineDisp)} cc`,
    );
    steps.push(`Vgasket = ${fmt(gasket)} cc · Vdeck = ${fmt(deck)} cc`);
    steps.push(
      `Vc = ${fmt(chamber)} + ${fmt(gasket)} + ${fmt(deck)} + ${fmt(piston)} = ${fmt(clearance)} cc`,
    );
    steps.push(
      `CR = (${fmt(swept)} + ${fmt(clearance)}) / ${fmt(clearance)} = ${fmt(cr, 4)} : 1`,
    );
  }

  let effectiveStrokeMm: number | null = null;
  let effectiveSweptCc: number | null = null;
  let dcr: number | null = null;

  if (
    input.enableDynamic &&
    input.mode === 'engineGeometry' &&
    boreMm > 0 &&
    strokeMm > 0 &&
    clearance > 0
  ) {
    const rodRaw = parseNum(input.rodLength);
    const ivc = parseNum(input.ivcAbdc);
    if (rodRaw != null && rodRaw > 0 && ivc != null) {
      const rodMm = toMm(rodRaw, input.rodLengthUnit);
      const leff = calculateEffectiveCompressionStroke(strokeMm, rodMm, ivc);
      if (leff != null) {
        effectiveStrokeMm = leff;
        effectiveSweptCc = calculateEffectiveSweptVolume(boreMm, leff);
        if (effectiveSweptCc != null) {
          dcr = calculateDynamicCompressionRatio(effectiveSweptCc, clearance);
          steps.push(
            `IVC ${fmt(ivc, 1)}° ABDC → Leff = ${fmt(leff)} mm · Vs,eff = ${fmt(effectiveSweptCc)} cc`,
          );
          if (dcr != null) {
            steps.push(`DCR = ${fmt(dcr, 4)} : 1`);
          }
        }
      }
    }
  }

  return {
    mode: input.mode,
    cylinders,
    sweptVolumePerCylinderCc: swept,
    engineDisplacementCc: engineDisp,
    gasketVolumeCc: gasket,
    deckVolumeCc: deck,
    pistonVolumeCc: piston,
    chamberVolumeCc: chamber,
    clearanceVolumeCc: clearance,
    volumeAtBDCCc: calculateVolumeAtBDC(swept, clearance),
    staticCompressionRatio: cr,
    effectiveStrokeMm,
    effectiveSweptVolumeCc: effectiveSweptCc,
    dynamicCompressionRatio: dcr,
    formulaSteps: steps,
    interpretation:
      'Geometric static compression ratio. Dynamic CR (when enabled) is an idealized crank-slider estimate from IVC ABDC — not measured cylinder pressure or knock prediction.',
    formattedPrimary: `${fmt(cr, 2)} : 1`,
    primaryLabel: 'Static Compression Ratio',
  };
}

export { fmt };
