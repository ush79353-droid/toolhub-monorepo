const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const APPROVED_COMPONENT_KEYS = [
  'AutoLoanCalculator',
  'LoanCalculator',
  'RrefCalculator',
  'ArmMortgageCalculator',
  'HundredDayCalculator',
  'ZeroToSixtyCalculator',
  'TwelveVoltWireCalculator',
  'TwelveHourShiftPayCalculator',
  'ThreeXRentCalculator',
  'ThreeDPrinterBuyVsOutsourceCalculator',
  'ARDaysCalculator',
  'FourZeroThreeBCalculator',
  'ADRCalculator',
  'AFFOCalculator',
  'FiveTwentyNineCalculator',
  'SeventyTwentyTenCalculator',
  'FourZeroOneKCalculator',
  'AmortizationCalculator',
  'AcreageCalculator',
  'FeetToInchesCalculator',
  'AcresToSquareMilesCalculator',
  'HeightInInchesCalculator',
  'AcreToAreConversionCalculator',
  'InchesToFractionCalculator',
  'AreaConverter',
  'LengthConverter',
  'AresToCentConverter',
  'LightYearConversion',
  'AresToHectaresConverter',
  'MeshToMicronConverter',
  'AstronomicalUnitCalculator',
  'PixelsToInchesConverter',
  'DecimeterToMeterConverter',
  'SquareKilometersToAcresConverter',
  'FeetAndInchesCalculator',
  'YardsToAcresCalculator',
  'CcfToGallonsConversion',
  'LitersToCentilitersConverter',
  'CubicFeetCalculator',
  'McgToMgConverter',
  'CubicMeterCalculator',
  'MgToMlCalculator',
  'CubicYardsToTonsCalculator',
] as const;

export type ApprovedComponentKey = (typeof APPROVED_COMPONENT_KEYS)[number];

export function toolNameKey(name: string): string {
  return name.trim().toLowerCase();
}

export function isToolSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function isApprovedComponentKey(key: string): key is ApprovedComponentKey {
  return (APPROVED_COMPONENT_KEYS as readonly string[]).includes(key);
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('tool.key.ts');
if (isDirect) {
  if (toolNameKey('  Loan Calculator ') !== 'loan calculator') throw new Error('name key');
  if (!isToolSlug('loan-calculator') || isToolSlug('Loan') || isToolSlug('-loan')) {
    throw new Error('slug rule');
  }
  if (
    !isApprovedComponentKey('AutoLoanCalculator') ||
    !isApprovedComponentKey('LoanCalculator') ||
    !isApprovedComponentKey('RrefCalculator') ||
    !isApprovedComponentKey('ArmMortgageCalculator') ||
    !isApprovedComponentKey('HundredDayCalculator') ||
    !isApprovedComponentKey('ZeroToSixtyCalculator') ||
    !isApprovedComponentKey('TwelveVoltWireCalculator') ||
    !isApprovedComponentKey('TwelveHourShiftPayCalculator') ||
    !isApprovedComponentKey('ThreeXRentCalculator') ||
    !isApprovedComponentKey('ThreeDPrinterBuyVsOutsourceCalculator') ||
    !isApprovedComponentKey('ARDaysCalculator') ||
    !isApprovedComponentKey('FourZeroThreeBCalculator') ||
    !isApprovedComponentKey('ADRCalculator') ||
    !isApprovedComponentKey('AFFOCalculator') ||
    !isApprovedComponentKey('FiveTwentyNineCalculator') ||
    !isApprovedComponentKey('SeventyTwentyTenCalculator') ||
    !isApprovedComponentKey('FourZeroOneKCalculator') ||
    !isApprovedComponentKey('AmortizationCalculator') ||
    !isApprovedComponentKey('AcreageCalculator') ||
    !isApprovedComponentKey('FeetToInchesCalculator') ||
    !isApprovedComponentKey('AcresToSquareMilesCalculator') ||
    !isApprovedComponentKey('HeightInInchesCalculator') ||
    !isApprovedComponentKey('AcreToAreConversionCalculator') ||
    !isApprovedComponentKey('InchesToFractionCalculator') ||
    !isApprovedComponentKey('AreaConverter') ||
    !isApprovedComponentKey('LengthConverter') ||
    !isApprovedComponentKey('AresToCentConverter') ||
    !isApprovedComponentKey('LightYearConversion') ||
    !isApprovedComponentKey('AresToHectaresConverter') ||
    !isApprovedComponentKey('MeshToMicronConverter') ||
    !isApprovedComponentKey('AstronomicalUnitCalculator') ||
    !isApprovedComponentKey('PixelsToInchesConverter') ||
    !isApprovedComponentKey('DecimeterToMeterConverter') ||
    !isApprovedComponentKey('SquareKilometersToAcresConverter') ||
    !isApprovedComponentKey('FeetAndInchesCalculator') ||
    !isApprovedComponentKey('YardsToAcresCalculator') ||
    !isApprovedComponentKey('CcfToGallonsConversion') ||
    !isApprovedComponentKey('LitersToCentilitersConverter') ||
    !isApprovedComponentKey('CubicFeetCalculator') ||
    !isApprovedComponentKey('McgToMgConverter') ||
    !isApprovedComponentKey('CubicMeterCalculator') ||
    !isApprovedComponentKey('MgToMlCalculator') ||
    !isApprovedComponentKey('CubicYardsToTonsCalculator') ||
    isApprovedComponentKey('EvilEval')
  ) {
    throw new Error('component key allowlist');
  }
  console.log('tool.key ok');
}
