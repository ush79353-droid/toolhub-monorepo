/**
 * DC conductor resistance for a two-wire circuit.
 *
 * Resistivity at 20°C and the linear temperature coefficients follow IEC 60228:
 * copper 0.017241 Ω·mm²/m (1.7241e-8 Ω·m), α = 0.00393 /°C;
 * aluminium 0.028264 Ω·mm²/m (2.8264e-8 Ω·m), α = 0.00403 /°C.
 * AWG areas use the ASTM B258 diameter series:
 * d(mm) = 0.127 × 92^((36−n)/39), area = π d² / 4.
 * Metric sizes are nominal IEC cross-sections, not AWG equivalents.
 */

export type ConductorMaterialId = 'copper' | 'aluminum';

export interface ConductorMaterial {
  id: ConductorMaterialId;
  label: string;
  /** Ω·m at 20°C. */
  rho20OhmM: number;
  /** Per °C, applied from 20°C. */
  alphaPerC: number;
}

export const COPPER: ConductorMaterial = {
  id: 'copper',
  label: 'Copper',
  rho20OhmM: 1.7241e-8,
  alphaPerC: 0.00393,
};

export const ALUMINUM: ConductorMaterial = {
  id: 'aluminum',
  label: 'Aluminum',
  rho20OhmM: 2.8264e-8,
  alphaPerC: 0.00403,
};

export const MATERIALS: Record<ConductorMaterialId, ConductorMaterial> = {
  copper: COPPER,
  aluminum: ALUMINUM,
};

/** Nominal metric conductor sizes in mm². Not interchangeable with AWG. */
export const METRIC_SIZES_MM2 = [
  0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300,
] as const;

const AWG_MIN = -3;
const AWG_MAX = 40;

export function temperatureFactor(material: ConductorMaterial, tempC: number): number {
  return 1 + material.alphaPerC * (tempC - 20);
}

export function resistivityOhmM(material: ConductorMaterial, tempC: number): number {
  const factor = temperatureFactor(material, tempC);
  if (!(factor > 0)) {
    throw new Error('Temperature is outside the linear resistance model');
  }
  return material.rho20OhmM * factor;
}

export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/** ASTM B258 solid-wire diameter in millimetres for AWG n (4/0 = −3). */
export function awgDiameterMm(awg: number): number {
  return 0.127 * 92 ** ((36 - awg) / 39);
}

export function awgAreaMm2(awg: number): number {
  const diameter = awgDiameterMm(awg);
  return (Math.PI * diameter * diameter) / 4;
}

export function awgLabel(awg: number): string {
  if (awg === -3) return '4/0 AWG';
  if (awg === -2) return '3/0 AWG';
  if (awg === -1) return '2/0 AWG';
  if (awg === 0) return '1/0 AWG';
  return `${awg} AWG`;
}

export function solidDiameterMm(areaMm2: number): number {
  return Math.sqrt((4 * areaMm2) / Math.PI);
}

/**
 * Minimum copper/aluminum area for a two-wire DC run.
 * A = (2 × ρ(T) × I × L) / Vdrop, with L the one-way length.
 * Both supply and return are included. Chassis return is not assumed.
 */
export function minimumAreaM2(rhoOhmM: number, currentA: number, oneWayMeters: number, maxDropVolts: number): number {
  if (oneWayMeters === 0) return 0;
  return (2 * rhoOhmM * currentA * oneWayMeters) / maxDropVolts;
}

export function loopResistanceOhm(rhoOhmM: number, oneWayMeters: number, areaM2: number): number {
  if (areaM2 <= 0) return oneWayMeters === 0 ? 0 : Number.POSITIVE_INFINITY;
  return (2 * rhoOhmM * oneWayMeters) / areaM2;
}

export interface StandardSize {
  label: string;
  areaMm2: number;
}

export function smallestMetric(areaMm2: number): StandardSize | null {
  const found = METRIC_SIZES_MM2.find((size) => size + 1e-12 >= areaMm2);
  return found === undefined ? null : { label: `${found} mm²`, areaMm2: found };
}

export function smallestAwg(areaMm2: number): (StandardSize & { awg: number }) | null {
  for (let awg = AWG_MAX; awg >= AWG_MIN; awg -= 1) {
    const area = awgAreaMm2(awg);
    if (area + 1e-9 >= areaMm2) {
      return { awg, label: awgLabel(awg), areaMm2: area };
    }
  }
  return null;
}
