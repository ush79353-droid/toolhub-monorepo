/**
 * Curtain Panel Calculator — coverage, drops, cut length, yardage.
 * Fullness and allowances are sewing conventions, not universal rules.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type CurtainPanelType = 'standard' | 'grommet' | 'gathered';

export type FabricWeight = 'lightweight' | 'medium' | 'heavyweight' | 'custom';

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

export const PANEL_TYPE_LABELS: Record<CurtainPanelType, string> = {
  standard: 'Standard curtain',
  grommet: 'Grommet / eyelet curtain',
  gathered: 'Gathered curtain',
};

export const FABRIC_WEIGHT_LABELS: Record<FabricWeight, string> = {
  lightweight: 'Lightweight',
  medium: 'Medium-weight',
  heavyweight: 'Heavyweight',
  custom: 'Custom',
};

export interface CurtainPanelInput {
  panelType: CurtainPanelType;
  fabricWeight: FabricWeight;
  fullnessRatio: string;
  rodWidth: string;
  finishedLength: string;
  numberOfPanels: string;
  fabricWidth: string;
  sideHemAllowance: string;
  topAllowance: string;
  bottomAllowance: string;
  joiningSeamAllowance: string;
  patternRepeat: string;
  shrinkagePercentage: string;
  wastePercentage: string;
  unit: LengthUnit;
  showAdvanced: boolean;
}

export interface CurtainPanelResult {
  totalCoverageWidthCm: number;
  finishedWidthPerPanelCm: number;
  cutWidthPerPanelCm: number;
  cutLengthPerDropCm: number;
  fabricDropsPerPanel: number;
  totalFabricDrops: number;
  assembledWidthCm: number;
  excessWidthCm: number;
  totalFabricLengthCm: number;
  totalFabricMeters: number;
  totalFabricYards: number;
  recommendedPurchaseYards: number;
  fullnessRatio: number;
  panelType: CurtainPanelType;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type CurtainPanelFieldErrors = {
  fullnessRatio?: string;
  rodWidth?: string;
  finishedLength?: string;
  numberOfPanels?: string;
  fabricWidth?: string;
  sideHemAllowance?: string;
  topAllowance?: string;
  bottomAllowance?: string;
  joiningSeamAllowance?: string;
  patternRepeat?: string;
  shrinkagePercentage?: string;
  wastePercentage?: string;
  form?: string;
};

export function createEmptyInput(): CurtainPanelInput {
  return {
    panelType: 'standard',
    fabricWeight: 'medium',
    fullnessRatio: '2',
    rodWidth: '200',
    finishedLength: '220',
    numberOfPanels: '2',
    fabricWidth: '140',
    sideHemAllowance: '3',
    topAllowance: '10',
    bottomAllowance: '15',
    joiningSeamAllowance: '1.5',
    patternRepeat: '0',
    shrinkagePercentage: '0',
    wastePercentage: '0',
    unit: 'cm',
    showAdvanced: false,
  };
}

export function createBlankInput(): CurtainPanelInput {
  return {
    ...createEmptyInput(),
    rodWidth: '',
    finishedLength: '',
    fabricWidth: '',
  };
}
