/**
 * Wheel Horsepower Calculator — WHP ↔ crank HP via drivetrain efficiency.
 * Presets are illustrative estimates — editable, not universal OEM specs.
 * Do not double-count: overall mode OR component mode, not both stacks.
 */

export type DrivetrainType = 'FWD' | 'RWD' | 'AWD' | '4WD' | 'CUSTOM';
export type PowerUnit = 'hp' | 'kW' | 'PS';
export type CalculationMode =
  | 'engine-to-wheel'
  | 'wheel-to-engine'
  | 'measured-efficiency';
export type EfficiencyMode = 'overall' | 'components';

export const DRIVETRAIN_LABELS: Record<DrivetrainType, string> = {
  FWD: 'Front-wheel drive (FWD)',
  RWD: 'Rear-wheel drive (RWD)',
  AWD: 'All-wheel drive (AWD)',
  '4WD': 'Four-wheel drive (4WD)',
  CUSTOM: 'Custom drivetrain',
};

export const POWER_UNIT_LABELS: Record<PowerUnit, string> = {
  hp: 'hp',
  kW: 'kW',
  PS: 'PS',
};

export const MODE_LABELS: Record<CalculationMode, string> = {
  'engine-to-wheel': 'Engine HP → Wheel HP',
  'wheel-to-engine': 'Wheel HP → Engine HP',
  'measured-efficiency': 'Measured HP & WHP → efficiency',
};

export const EFFICIENCY_MODE_LABELS: Record<EfficiencyMode, string> = {
  overall: 'Overall efficiency',
  components: 'Component efficiencies',
};

/** Illustrative overall-efficiency presets (%). */
export const DRIVETRAIN_PRESETS: Record<
  Exclude<DrivetrainType, 'CUSTOM'>,
  { efficiencyPercent: number; note: string }
> = {
  FWD: { efficiencyPercent: 88, note: 'Illustrative ~12% loss' },
  RWD: { efficiencyPercent: 85, note: 'Illustrative ~15% loss' },
  AWD: { efficiencyPercent: 80, note: 'Illustrative ~20% loss' },
  '4WD': { efficiencyPercent: 80, note: 'Illustrative ~20% loss' },
};

/** Default component % for RWD-style series model. */
export const DEFAULT_COMPONENTS = {
  gearbox: 97,
  propellerShaft: 98,
  differential: 95,
  driveshaft: 99,
} as const;

export interface WheelHorsepowerInput {
  drivetrainType: DrivetrainType;
  calculationMode: CalculationMode;
  efficiencyMode: EfficiencyMode;
  openGearbox: boolean;
  openProp: boolean;
  openDiff: boolean;
  openDrive: boolean;
  engineHorsepower: string;
  wheelHorsepower: string;
  powerUnit: PowerUnit;
  overallEfficiency: string;
  gearboxEfficiency: string;
  propellerShaftEfficiency: string;
  differentialEfficiency: string;
  driveshaftEfficiency: string;
  /** Prop shaft only for RWD / AWD / 4WD / CUSTOM layouts. */
  includePropellerShaft: boolean;
}

export interface WheelHorsepowerResult {
  engineHorsepowerHp: number;
  wheelHorsepowerHp: number;
  overallEfficiencyDecimal: number;
  overallEfficiencyPercent: number;
  drivetrainLossHorsepower: number;
  drivetrainLossPercent: number;
  gearboxEfficiencyPercent: number | null;
  propellerShaftEfficiencyPercent: number | null;
  differentialEfficiencyPercent: number | null;
  driveshaftEfficiencyPercent: number | null;
  efficiencySource: 'overall' | 'components' | 'measured';
  whpExceedsEngine: boolean;
  formulaSteps: string[];
  interpretation: string;
  engineDisplay: string;
  wheelDisplay: string;
  lossDisplay: string;
}

export type WheelHorsepowerFieldErrors = {
  engineHorsepower?: string;
  wheelHorsepower?: string;
  overallEfficiency?: string;
  gearboxEfficiency?: string;
  propellerShaftEfficiency?: string;
  differentialEfficiency?: string;
  driveshaftEfficiency?: string;
  form?: string;
};

export function createEmptyInput(): WheelHorsepowerInput {
  return {
    drivetrainType: 'RWD',
    calculationMode: 'engine-to-wheel',
    efficiencyMode: 'overall',
    openGearbox: true,
    openProp: false,
    openDiff: false,
    openDrive: false,
    engineHorsepower: '300',
    wheelHorsepower: '',
    powerUnit: 'hp',
    overallEfficiency: '85',
    gearboxEfficiency: String(DEFAULT_COMPONENTS.gearbox),
    propellerShaftEfficiency: String(DEFAULT_COMPONENTS.propellerShaft),
    differentialEfficiency: String(DEFAULT_COMPONENTS.differential),
    driveshaftEfficiency: String(DEFAULT_COMPONENTS.driveshaft),
    includePropellerShaft: true,
  };
}

export function createBlankInput(): WheelHorsepowerInput {
  return {
    ...createEmptyInput(),
    engineHorsepower: '',
    wheelHorsepower: '',
    overallEfficiency: '',
    gearboxEfficiency: '',
    propellerShaftEfficiency: '',
    differentialEfficiency: '',
    driveshaftEfficiency: '',
  };
}
