import type { ToolPageDetail } from '@/tools/page-detail';
import { isRegisteredComponentKey, type RegisteredComponentKey } from './keys';

const details: Record<RegisteredComponentKey, () => Promise<{ toolPageDetail: ToolPageDetail }>> = {
  AutoLoanCalculator: () => import('@/tools/calculators/auto-loan/detail'),
  LoanCalculator: () => import('@/tools/calculators/loan/detail'),
  RrefCalculator: () => import('@/tools/calculators/rref/detail'),
  ArmMortgageCalculator: () => import('@/tools/calculators/arm-mortgage/detail'),
  HundredDayCalculator: () => import('@/tools/calculators/hundred-day/detail'),
  TwelveVoltWireCalculator: () => import('@/tools/calculators/twelve-volt-wire/detail'),
  ZeroToSixtyCalculator: () => import('@/tools/calculators/zero-to-sixty/detail'),
  TwelveHourShiftPayCalculator: () => import('@/tools/calculators/twelve-hour-shift-pay/detail'),
  ThreeXRentCalculator: () => import('@/tools/calculators/three-x-rent/detail'),
  ThreeDPrinterBuyVsOutsourceCalculator: () =>
    import('@/tools/calculators/three-d-printer-buy-vs-outsource/detail'),
  ARDaysCalculator: () => import('@/tools/calculators/ar-days/detail'),
  FourZeroThreeBCalculator: () => import('@/tools/calculators/four-zero-three-b/detail'),
  ADRCalculator: () => import('@/tools/calculators/adr/detail'),
  AFFOCalculator: () => import('@/tools/calculators/affo/detail'),
  FiveTwentyNineCalculator: () => import('@/tools/calculators/five-twenty-nine/detail'),
  SeventyTwentyTenCalculator: () => import('@/tools/calculators/seventy-twenty-ten-rule/detail'),
  FourZeroOneKCalculator: () => import('@/tools/calculators/four-zero-one-k/detail'),
  AmortizationCalculator: () => import('@/tools/calculators/amortization/detail'),
  AcreageCalculator: () => import('@/tools/calculators/acreage/detail'),
  FeetToInchesCalculator: () => import('@/tools/calculators/feet-to-inches/detail'),
  AcresToSquareMilesCalculator: () => import('@/tools/calculators/acres-to-square-miles/detail'),
  HeightInInchesCalculator: () => import('@/tools/calculators/height-in-inches/detail'),
  AcreToAreConversionCalculator: () => import('@/tools/calculators/acre-to-are/detail'),
  InchesToFractionCalculator: () => import('@/tools/calculators/inches-to-fraction/detail'),
  AreaConverter: () => import('@/tools/calculators/area-converter/detail'),
  LengthConverter: () => import('@/tools/calculators/length-converter/detail'),
  AresToCentConverter: () => import('@/tools/calculators/ares-to-cent/detail'),
  LightYearConversion: () => import('@/tools/calculators/light-year-conversion/detail'),
  AresToHectaresConverter: () => import('@/tools/calculators/ares-to-hectares/detail'),
  MeshToMicronConverter: () => import('@/tools/calculators/mesh-to-micron/detail'),
  AstronomicalUnitCalculator: () => import('@/tools/calculators/astronomical-unit/detail'),
  PixelsToInchesConverter: () => import('@/tools/calculators/pixels-to-inches/detail'),
  DecimeterToMeterConverter: () => import('@/tools/calculators/decimeter-to-meter/detail'),
  SquareKilometersToAcresConverter: () =>
    import('@/tools/calculators/square-kilometers-to-acres/detail'),
  FeetAndInchesCalculator: () => import('@/tools/calculators/feet-and-inches/detail'),
  YardsToAcresCalculator: () => import('@/tools/calculators/yards-to-acres/detail'),
  CcfToGallonsConversion: () => import('@/tools/calculators/ccf-to-gallons/detail'),
  LitersToCentilitersConverter: () => import('@/tools/calculators/liters-to-centiliters/detail'),
  CubicFeetCalculator: () => import('@/tools/calculators/cubic-feet/detail'),
  McgToMgConverter: () => import('@/tools/calculators/mcg-to-mg/detail'),
  CubicMeterCalculator: () => import('@/tools/calculators/cubic-meter/detail'),
  MgToMlCalculator: () => import('@/tools/calculators/mg-to-ml/detail'),
  CubicYardsToTonsCalculator: () =>
    import('@/tools/calculators/cubic-yards-to-tons/detail'),
  MlToCupsConverter: () => import('@/tools/calculators/ml-to-cups/detail'),
  DecagramToGramConverter: () => import('@/tools/calculators/decagram-to-gram/detail'),
  PintToPoundCalculator: () => import('@/tools/calculators/pint-to-pound/detail'),
  DropsToMlConverter: () => import('@/tools/calculators/drops-to-ml/detail'),
  PoundsAndOuncesCalculator: () =>
    import('@/tools/calculators/pounds-and-ounces/detail'),
  OzToCupsConverter: () => import('@/tools/calculators/oz-to-cups/detail'),
  GallonCalculator: () => import('@/tools/calculators/gallon/detail'),
  QuartsToPoundsConverter: () => import('@/tools/calculators/quarts-to-pounds/detail'),
  GallonsToPoundsConverter: () => import('@/tools/calculators/gallons-to-pounds/detail'),
  VolumeConversion: () => import('@/tools/calculators/volume-conversion/detail'),
  GramsToOuncesCalculator: () => import('@/tools/calculators/grams-to-ounces/detail'),
};

export async function loadToolPageDetail(key: string): Promise<ToolPageDetail | null> {
  if (!isRegisteredComponentKey(key)) return null;
  const mod = await details[key]();
  return mod.toolPageDetail;
}
