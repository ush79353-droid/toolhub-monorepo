/**
 * Crouch formula reference convention:
 *   S (mph) = C × √(P_hp / D_lb)
 * Coefficients are empirical estimates for comparable planing hulls — not design guarantees.
 */

export type BoatCalculationMode =
  | 'speed'
  | 'horsepower'
  | 'displacement'
  | 'crouchConstant';

export type BoatPowerUnit = 'hp' | 'kW' | 'W' | 'PS';
export type BoatDisplacementUnit = 'lb' | 'kg' | 't' | 'shortTon' | 'longTon';
export type BoatSpeedUnit = 'mph' | 'kmh' | 'knots' | 'ms' | 'fts';

export type BoatTypeId =
  | 'cruiser'
  | 'light-cruiser'
  | 'racing'
  | 'hydroplane'
  | 'catamaran'
  | 'custom';

export interface BoatTypeOption {
  id: BoatTypeId;
  label: string;
  crouchConstant: number | null;
}

export const BOAT_TYPES: readonly BoatTypeOption[] = [
  {
    id: 'cruiser',
    label: 'Cruisers, average runabouts, passenger vessels',
    crouchConstant: 150,
  },
  {
    id: 'light-cruiser',
    label: 'Light high-speed cruisers and high-speed runabouts',
    crouchConstant: 190,
  },
  {
    id: 'racing',
    label: 'Racing boats',
    crouchConstant: 210,
  },
  {
    id: 'hydroplane',
    label: 'Hydroplanes',
    crouchConstant: 220,
  },
  {
    id: 'catamaran',
    label: 'Racing catamarans and sea sleds',
    crouchConstant: 230,
  },
  {
    id: 'custom',
    label: 'Custom Boat',
    crouchConstant: null,
  },
] as const;

export const POWER_UNIT_LABELS: Record<BoatPowerUnit, string> = {
  hp: 'hp',
  kW: 'kW',
  W: 'W',
  PS: 'PS',
};

export const DISPLACEMENT_UNIT_LABELS: Record<BoatDisplacementUnit, string> = {
  lb: 'lb',
  kg: 'kg',
  t: 't',
  shortTon: 'US ton',
  longTon: 'long ton',
};

export const SPEED_UNIT_LABELS: Record<BoatSpeedUnit, string> = {
  mph: 'mph',
  kmh: 'km/h',
  knots: 'kn',
  ms: 'm/s',
  fts: 'ft/s',
};

export interface BoatSpeedInput {
  mode: BoatCalculationMode;
  horsepower: string;
  horsepowerUnit: BoatPowerUnit;
  displacement: string;
  displacementUnit: BoatDisplacementUnit;
  boatType: BoatTypeId;
  crouchConstant: string;
  speed: string;
  speedUnit: BoatSpeedUnit;
}

export interface HorsepowerSpeedPoint {
  horsepowerHp: number;
  speedMph: number;
}

export interface BoatSpeedResult {
  mode: BoatCalculationMode;
  speedMph: number;
  horsepowerHp: number;
  displacementLb: number;
  crouchConstant: number;
  boatType: BoatTypeId;
  boatTypeLabel: string;
  powerToDisplacementRatio: number;
  speedDisplay: number;
  speedUnit: BoatSpeedUnit;
  horsepowerDisplay: number;
  horsepowerUnit: BoatPowerUnit;
  displacementDisplay: number;
  displacementUnit: BoatDisplacementUnit;
  formulaSteps: string[];
  comparison: HorsepowerSpeedPoint[];
  interpretation: string;
  formattedPrimary: string;
  primaryLabel: string;
}

export type BoatSpeedFieldErrors = {
  horsepower?: string;
  displacement?: string;
  crouchConstant?: string;
  speed?: string;
  boatType?: string;
  form?: string;
};

export function getBoatTypeCoefficient(boatType: BoatTypeId): number | null {
  return BOAT_TYPES.find((t) => t.id === boatType)?.crouchConstant ?? null;
}

export function createEmptyInput(): BoatSpeedInput {
  return {
    mode: 'speed',
    horsepower: '',
    horsepowerUnit: 'hp',
    displacement: '',
    displacementUnit: 'lb',
    boatType: 'cruiser',
    crouchConstant: '150',
    speed: '',
    speedUnit: 'mph',
  };
}

export function createExampleInput(): BoatSpeedInput {
  return {
    mode: 'speed',
    horsepower: '3000',
    horsepowerUnit: 'hp',
    displacement: '6000',
    displacementUnit: 'lb',
    boatType: 'cruiser',
    crouchConstant: '150',
    speed: '',
    speedUnit: 'mph',
  };
}
