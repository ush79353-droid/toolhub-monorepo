import {
  AREA_UNIT_TO_M2,
  CUBIC_METERS_PER_IMP_GALLON,
  CUBIC_METERS_PER_US_GALLON,
  LENGTH_UNIT_TO_M,
  PASCALS_PER_PSI,
  PRESSURE_UNIT_TO_PA,
  type AreaUnit,
  type FlowUnit,
  type LengthUnit,
  type PressureUnit,
  type PsiToGpmInput,
  type PsiToGpmResult,
} from './types';

export function formatFlowNumber(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(8)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
      .replace(/e\+?/, 'e');
  }

  let digits = 10;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 8;
  else digits = 12;

  const rounded = Number(value.toFixed(digits));
  if (Math.abs(rounded) >= 1) {
    const nearest = Math.round(rounded);
    if (Math.abs(rounded - nearest) < 1e-8 * Math.max(1, Math.abs(nearest))) {
      return String(nearest);
    }
  }
  return String(rounded);
}

export function toPascals(value: number, unit: PressureUnit): number {
  return value * PRESSURE_UNIT_TO_PA[unit];
}

export function fromPascals(pascals: number, unit: PressureUnit): number {
  return pascals / PRESSURE_UNIT_TO_PA[unit];
}

export function psiToPascal(psi: number): number {
  return psi * PASCALS_PER_PSI;
}

export function pascalToPsi(pascals: number): number {
  return pascals / PASCALS_PER_PSI;
}

export function toMeters(value: number, unit: LengthUnit): number {
  return value * LENGTH_UNIT_TO_M[unit];
}

export function fromMeters(meters: number, unit: LengthUnit): number {
  return meters / LENGTH_UNIT_TO_M[unit];
}

export function toSquareMeters(value: number, unit: AreaUnit): number {
  return value * AREA_UNIT_TO_M2[unit];
}

export function fromSquareMeters(m2: number, unit: AreaUnit): number {
  return m2 / AREA_UNIT_TO_M2[unit];
}

export function calculatePipeArea(diameterMeters: number): number {
  return (Math.PI * diameterMeters * diameterMeters) / 4;
}

export function diameterFromArea(areaM2: number): number {
  return Math.sqrt((4 * areaM2) / Math.PI);
}

export function calculateIdealVelocity(
  pressureDifferencePa: number,
  densityKgM3: number
): number {
  return Math.sqrt((2 * pressureDifferencePa) / densityKgM3);
}

export function calculateIdealFlowM3S(
  pressureDifferencePa: number,
  areaM2: number,
  densityKgM3: number,
  dischargeCoefficient = 1
): number {
  const velocity = calculateIdealVelocity(pressureDifferencePa, densityKgM3);
  return dischargeCoefficient * areaM2 * velocity;
}

export function m3sToUsGpm(cubicMetersPerSecond: number): number {
  return (cubicMetersPerSecond * 60) / CUBIC_METERS_PER_US_GALLON;
}

export function usGpmToM3s(usGpm: number): number {
  return (usGpm * CUBIC_METERS_PER_US_GALLON) / 60;
}

export function fromM3s(flowM3s: number, unit: FlowUnit): number {
  switch (unit) {
    case 'm3s':
      return flowM3s;
    case 'm3h':
      return flowM3s * 3600;
    case 'Ls':
      return flowM3s * 1000;
    case 'Lmin':
      return flowM3s * 1000 * 60;
    case 'usGpm':
      return m3sToUsGpm(flowM3s);
    case 'usGalH':
      return m3sToUsGpm(flowM3s) * 60;
    case 'impGpm':
      return (flowM3s * 60) / CUBIC_METERS_PER_IMP_GALLON;
    default:
      return flowM3s;
  }
}

export function resolveGeometry(input: PsiToGpmInput): {
  diameterM: number;
  areaM2: number;
} {
  if (input.geometrySource === 'area') {
    const areaM2 = input.areaM2!;
    return { areaM2, diameterM: diameterFromArea(areaM2) };
  }
  const diameterM = input.diameterM!;
  return { diameterM, areaM2: calculatePipeArea(diameterM) };
}

export function calculatePsiToGpm(input: PsiToGpmInput): PsiToGpmResult {
  const inletPa = psiToPascal(input.inletPsi!);
  const outletPa = psiToPascal(input.outletPsi!);
  const deltaPPa = inletPa - outletPa;
  const { diameterM, areaM2 } = resolveGeometry(input);
  const velocityMs = calculateIdealVelocity(deltaPPa, input.densityKgM3);
  const flowM3s = calculateIdealFlowM3S(
    deltaPPa,
    areaM2,
    input.densityKgM3,
    input.dischargeCoefficient
  );

  return {
    deltaPPa,
    diameterM,
    areaM2,
    velocityMs,
    flowM3s,
    flowUsGpm: m3sToUsGpm(flowM3s),
    densityKgM3: input.densityKgM3,
    dischargeCoefficient: input.dischargeCoefficient,
    pressureReference: input.pressureReference,
    modelNote:
      'Ideal incompressible discharge model (Bernoulli). Not a full pipe-network friction analysis.',
  };
}
