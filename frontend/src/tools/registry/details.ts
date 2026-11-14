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
};

export async function loadToolPageDetail(key: string): Promise<ToolPageDetail | null> {
  if (!isRegisteredComponentKey(key)) return null;
  const mod = await details[key]();
  return mod.toolPageDetail;
}
