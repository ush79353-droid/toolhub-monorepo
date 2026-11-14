/** Shared torque conversion engine (N·m canonical). Used by Nm↔in·lbf converters. */

export interface TorqueOtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

/** Conventional standard gravity (exact). */
export const STANDARD_GRAVITY = 9.80665;
/** Exact: 1 international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
/** Exact: 1 international inch. */
export const METERS_PER_INCH = 0.0254;
/** Exact: 1 lbf = lb × g₀. */
export const NEWTONS_PER_LBF = KG_PER_POUND * STANDARD_GRAVITY;
/**
 * Exact: 1 in·lbf = 0.0254 m × 4.4482216152605 N
 * = 0.1129848290276167 N·m (literal avoids IEEE display noise).
 */
export const NEWTON_METERS_PER_INCH_POUND = 0.1129848290276167;
/** Exact: 1 ft·lbf = 12 in·lbf. */
export const INCH_POUNDS_PER_FOOT_POUND = 12;
/** Exact: 1 ft·lbf = 12 × in·lbf in N·m. */
export const NEWTON_METERS_PER_FOOT_POUND =
  NEWTON_METERS_PER_INCH_POUND * INCH_POUNDS_PER_FOOT_POUND;
/** Exact: 1 in·ozf = in·lbf / 16. */
export const NEWTON_METERS_PER_INCH_OUNCE = NEWTON_METERS_PER_INCH_POUND / 16;
/** Exact: 1 kgf·m = g₀ N·m. */
export const NEWTON_METERS_PER_KGF_M = STANDARD_GRAVITY;
/** Exact: 1 kgf·cm = kgf·m / 100. */
export const NEWTON_METERS_PER_KGF_CM = NEWTON_METERS_PER_KGF_M / 100;
/** Exact: 1 dyn·cm = 1e-7 N·m. */
export const NEWTON_METERS_PER_DYNE_CM = 1e-7;

export const TORQUE_MAX_ABS_VALUE = 1e15;

/** Readable torque display without ugly trailing zeros. */
export function formatTorque(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(8)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
      .replace(/e\+?/, 'e');
  }

  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;

  const rounded = Number(value.toFixed(digits));
  if (Math.abs(rounded) >= 1) {
    const nearest = Math.round(rounded);
    if (Math.abs(rounded - nearest) < 1e-8 * Math.max(1, Math.abs(nearest))) {
      return String(nearest);
    }
  }
  return String(rounded);
}

export function nmToInLbs(newtonMeters: number): number {
  return newtonMeters / NEWTON_METERS_PER_INCH_POUND;
}

export function inLbsToNm(inchPounds: number): number {
  return inchPounds * NEWTON_METERS_PER_INCH_POUND;
}

export function nmToFtLbs(newtonMeters: number): number {
  return newtonMeters / NEWTON_METERS_PER_FOOT_POUND;
}

export function ftLbsToNm(footPounds: number): number {
  return footPounds * NEWTON_METERS_PER_FOOT_POUND;
}

/** Aliases matching task naming. */
export const newtonMetersToFootPounds = nmToFtLbs;
export const footPoundsToNewtonMeters = ftLbsToNm;

/** Exact: ft·lbf = in·lbf / 12. */
export function inchPoundsToFootPounds(inchPounds: number): number {
  return inchPounds / INCH_POUNDS_PER_FOOT_POUND;
}

/** Exact: in·lbf = ft·lbf × 12. */
export function footPoundsToInchPounds(footPounds: number): number {
  return footPounds * INCH_POUNDS_PER_FOOT_POUND;
}

/** Aliases matching task naming. */
export const nmToInchPounds = nmToInLbs;
export const inchPoundsToNm = inLbsToNm;

export function otherTorqueUnitsFromNm(nm: number): readonly TorqueOtherUnitRow[] {
  return [
    { unit: 'N·m', label: 'Newton-meters (N·m)', value: nm },
    { unit: 'mN·m', label: 'Millinewton-meters (mN·m)', value: nm * 1000 },
    { unit: 'kN·m', label: 'Kilonewton-meters (kN·m)', value: nm / 1000 },
    { unit: 'N·cm', label: 'Newton-centimeters (N·cm)', value: nm * 100 },
    { unit: 'N·mm', label: 'Newton-millimeters (N·mm)', value: nm * 1000 },
    {
      unit: 'in·lbf',
      label: 'Inch-pounds (in·lbf)',
      value: nmToInLbs(nm),
    },
    {
      unit: 'ft·lbf',
      label: 'Foot-pounds (ft·lbf)',
      value: nm / NEWTON_METERS_PER_FOOT_POUND,
    },
    {
      unit: 'in·ozf',
      label: 'Ounce-force inches (in·ozf)',
      value: nm / NEWTON_METERS_PER_INCH_OUNCE,
    },
    {
      unit: 'kgf·m',
      label: 'Kilogram-force meters (kgf·m)',
      value: nm / NEWTON_METERS_PER_KGF_M,
    },
    {
      unit: 'kgf·cm',
      label: 'Kilogram-force centimeters (kgf·cm)',
      value: nm / NEWTON_METERS_PER_KGF_CM,
    },
    {
      unit: 'dyn·cm',
      label: 'Dyne-centimeters (dyn·cm)',
      value: nm / NEWTON_METERS_PER_DYNE_CM,
    },
  ];
}
