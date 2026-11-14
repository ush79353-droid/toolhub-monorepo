import {
  NEWTON_METERS_PER_DYNE_CM,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_OUNCE,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  type NmToInLbsInput,
  type NmToInLbsResult,
  type OtherUnitRow,
} from './types';

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

function otherUnitsFromNm(nm: number): readonly OtherUnitRow[] {
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

export function calculateNmToInLbs(input: NmToInLbsInput): NmToInLbsResult {
  let nm: number;
  let inlbf: number;

  if (input.source === 'nm') {
    nm = input.nm!;
    inlbf = nmToInLbs(nm);
  } else {
    inlbf = input.inlbf!;
    nm = inLbsToNm(inlbf);
  }

  return {
    source: input.source,
    nm,
    inlbf,
    otherUnits: otherUnitsFromNm(nm),
  };
}
