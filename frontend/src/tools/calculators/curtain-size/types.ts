/**
 * Curtain Size Calculator — finished length & flat width from window + style.
 * Distinct from Curtain Panel (fabric yardage). Dimensions here are finished, not cut.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type CurtainType = 'sill-length' | 'cafe' | 'extra-long';

export type CurtainFullness = 'standard' | 'deluxe' | 'ultra' | 'custom';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
};

export const LENGTH_UNITS: readonly LengthUnit[] = [
  'mm',
  'cm',
  'm',
  'in',
  'ft',
];

export const CURTAIN_TYPE_LABELS: Record<CurtainType, string> = {
  'sill-length': 'Sill-length curtains',
  cafe: 'Café-length curtains',
  'extra-long': 'Extra-long curtains',
};

export const FULLNESS_LABELS: Record<CurtainFullness, string> = {
  standard: 'Standard fullness',
  deluxe: 'Deluxe fullness',
  ultra: 'Ultra fullness',
  custom: 'Custom fullness',
};

export interface CurtainSizeInput {
  curtainType: CurtainType;
  fullnessType: CurtainFullness;
  fullnessMultiplier: string;
  windowHeight: string;
  windowWidth: string;
  rodMountingHeight: string;
  rodExtension: string;
  extraLengthBelowSill: string;
  cafeCoverageRatio: string;
  rodHeightAboveFloor: string;
  floorClearance: string;
  puddlingLength: string;
  numberOfPanels: string;
  unit: LengthUnit;
  showAdvanced: boolean;
}

export interface CurtainSizeResult {
  effectiveRodWidthCm: number;
  recommendedCurtainLengthCm: number;
  totalCurtainWidthCm: number;
  curtainWidthPerPanelCm: number;
  numberOfPanels: number;
  fullnessMultiplier: number;
  curtainType: CurtainType;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type CurtainSizeFieldErrors = {
  fullnessMultiplier?: string;
  windowHeight?: string;
  windowWidth?: string;
  rodMountingHeight?: string;
  rodExtension?: string;
  extraLengthBelowSill?: string;
  cafeCoverageRatio?: string;
  rodHeightAboveFloor?: string;
  floorClearance?: string;
  puddlingLength?: string;
  numberOfPanels?: string;
  form?: string;
};

export function createEmptyInput(): CurtainSizeInput {
  return {
    curtainType: 'sill-length',
    fullnessType: 'deluxe',
    fullnessMultiplier: '2',
    windowHeight: '120',
    windowWidth: '150',
    rodMountingHeight: '15',
    rodExtension: '15',
    extraLengthBelowSill: '0',
    cafeCoverageRatio: '0.5',
    rodHeightAboveFloor: '240',
    floorClearance: '2',
    puddlingLength: '0',
    numberOfPanels: '2',
    unit: 'cm',
    showAdvanced: false,
  };
}

export function createBlankInput(): CurtainSizeInput {
  return {
    ...createEmptyInput(),
    windowHeight: '',
    windowWidth: '',
    rodHeightAboveFloor: '',
  };
}
