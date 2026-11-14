'use client';

import { lazy, type LazyExoticComponent } from 'react';
import type { ToolComponent } from '../types';
import { isRegisteredComponentKey, type RegisteredComponentKey } from './keys';

function lazyTool(
  load: () => Promise<{ default: ToolComponent }>,
): LazyExoticComponent<ToolComponent> {
  return lazy(load);
}

/**
 * One static import path per calculator so the bundler emits a separate chunk.
 * The chunk loads when that tool is rendered.
 */
const calculators: Record<RegisteredComponentKey, LazyExoticComponent<ToolComponent>> = {
  AutoLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/auto-loan/AutoLoanCalculator').then((mod) => ({
      default: mod.AutoLoanCalculator,
    })),
  ),
  LoanCalculator: lazyTool(() =>
    import('@/tools/calculators/loan/LoanCalculator').then((mod) => ({
      default: mod.LoanCalculator,
    })),
  ),
  RrefCalculator: lazyTool(() =>
    import('@/tools/calculators/rref/RrefCalculator').then((mod) => ({
      default: mod.RrefCalculator,
    })),
  ),
  ArmMortgageCalculator: lazyTool(() =>
    import('@/tools/calculators/arm-mortgage/ArmMortgageCalculator').then((mod) => ({
      default: mod.ArmMortgageCalculator,
    })),
  ),
  HundredDayCalculator: lazyTool(() =>
    import('@/tools/calculators/hundred-day/HundredDayCalculator').then((mod) => ({
      default: mod.HundredDayCalculator,
    })),
  ),
  TwelveVoltWireCalculator: lazyTool(() =>
    import('@/tools/calculators/twelve-volt-wire/TwelveVoltWireCalculator').then((mod) => ({
      default: mod.TwelveVoltWireCalculator,
    })),
  ),
  ZeroToSixtyCalculator: lazyTool(() =>
    import('@/tools/calculators/zero-to-sixty/ZeroToSixtyCalculator').then((mod) => ({
      default: mod.ZeroToSixtyCalculator,
    })),
  ),
  TwelveHourShiftPayCalculator: lazyTool(() =>
    import('@/tools/calculators/twelve-hour-shift-pay/TwelveHourShiftPayCalculator').then((mod) => ({
      default: mod.TwelveHourShiftPayCalculator,
    })),
  ),
  ThreeXRentCalculator: lazyTool(() =>
    import('@/tools/calculators/three-x-rent/ThreeXRentCalculator').then((mod) => ({
      default: mod.ThreeXRentCalculator,
    })),
  ),
  ThreeDPrinterBuyVsOutsourceCalculator: lazyTool(() =>
    import('@/tools/calculators/three-d-printer-buy-vs-outsource/ThreeDPrinterBuyVsOutsourceCalculator').then((mod) => ({
      default: mod.ThreeDPrinterBuyVsOutsourceCalculator,
    })),
  ),
  ARDaysCalculator: lazyTool(() =>
    import('@/tools/calculators/ar-days/ARDaysCalculator').then((mod) => ({
      default: mod.ARDaysCalculator,
    })),
  ),
  FourZeroThreeBCalculator: lazyTool(() =>
    import('@/tools/calculators/four-zero-three-b/FourZeroThreeBCalculator').then((mod) => ({
      default: mod.FourZeroThreeBCalculator,
    })),
  ),
  ADRCalculator: lazyTool(() =>
    import('@/tools/calculators/adr/ADRCalculator').then((mod) => ({
      default: mod.ADRCalculator,
    })),
  ),
  AFFOCalculator: lazyTool(() =>
    import('@/tools/calculators/affo/AFFOCalculator').then((mod) => ({
      default: mod.AFFOCalculator,
    })),
  ),
  FiveTwentyNineCalculator: lazyTool(() =>
    import('@/tools/calculators/five-twenty-nine/FiveTwentyNineCalculator').then((mod) => ({
      default: mod.FiveTwentyNineCalculator,
    })),
  ),
  SeventyTwentyTenCalculator: lazyTool(() =>
    import('@/tools/calculators/seventy-twenty-ten-rule/SeventyTwentyTenCalculator').then((mod) => ({
      default: mod.SeventyTwentyTenCalculator,
    })),
  ),
  FourZeroOneKCalculator: lazyTool(() =>
    import('@/tools/calculators/four-zero-one-k/FourZeroOneKCalculator').then((mod) => ({
      default: mod.FourZeroOneKCalculator,
    })),
  ),
  AmortizationCalculator: lazyTool(() =>
    import('@/tools/calculators/amortization/AmortizationCalculator').then((mod) => ({
      default: mod.AmortizationCalculator,
    })),
  ),
  AcreageCalculator: lazyTool(() =>
    import('@/tools/calculators/acreage/AcreageCalculator').then((mod) => ({
      default: mod.AcreageCalculator,
    })),
  ),
  FeetToInchesCalculator: lazyTool(() =>
    import('@/tools/calculators/feet-to-inches/FeetToInchesCalculator').then((mod) => ({
      default: mod.FeetToInchesCalculator,
    })),
  ),
  AcresToSquareMilesCalculator: lazyTool(() =>
    import('@/tools/calculators/acres-to-square-miles/AcresToSquareMilesCalculator').then((mod) => ({
      default: mod.AcresToSquareMilesCalculator,
    })),
  ),
  HeightInInchesCalculator: lazyTool(() =>
    import('@/tools/calculators/height-in-inches/HeightInInchesCalculator').then((mod) => ({
      default: mod.HeightInInchesCalculator,
    })),
  ),
  AcreToAreConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/acre-to-are/AcreToAreCalculator').then((mod) => ({
      default: mod.AcreToAreConversionCalculator,
    })),
  ),
  InchesToFractionCalculator: lazyTool(() =>
    import('@/tools/calculators/inches-to-fraction/InchesToFractionCalculator').then((mod) => ({
      default: mod.InchesToFractionCalculator,
    })),
  ),
  AreaConverter: lazyTool(() =>
    import('@/tools/calculators/area-converter/AreaConverterCalculator').then((mod) => ({
      default: mod.AreaConverter,
    })),
  ),
  LengthConverter: lazyTool(() =>
    import('@/tools/calculators/length-converter/LengthConverterCalculator').then((mod) => ({
      default: mod.LengthConverter,
    })),
  ),
  AresToCentConverter: lazyTool(() =>
    import('@/tools/calculators/ares-to-cent/AresToCentCalculator').then((mod) => ({
      default: mod.AresToCentConverter,
    })),
  ),
  LightYearConversion: lazyTool(() =>
    import('@/tools/calculators/light-year-conversion/LightYearConversionCalculator').then(
      (mod) => ({
        default: mod.LightYearConversion,
      })
    )
  ),
  AresToHectaresConverter: lazyTool(() =>
    import('@/tools/calculators/ares-to-hectares/AresToHectaresCalculator').then((mod) => ({
      default: mod.AresToHectaresConverter,
    })),
  ),
  MeshToMicronConverter: lazyTool(() =>
    import('@/tools/calculators/mesh-to-micron/MeshToMicronCalculator').then((mod) => ({
      default: mod.MeshToMicronConverter,
    })),
  ),
  AstronomicalUnitCalculator: lazyTool(() =>
    import('@/tools/calculators/astronomical-unit/AstronomicalUnitCalculator').then((mod) => ({
      default: mod.AstronomicalUnitCalculator,
    })),
  ),
  PixelsToInchesConverter: lazyTool(() =>
    import('@/tools/calculators/pixels-to-inches/PixelsToInchesConverter').then((mod) => ({
      default: mod.PixelsToInchesConverter,
    })),
  ),
  DecimeterToMeterConverter: lazyTool(() =>
    import('@/tools/calculators/decimeter-to-meter/DecimeterToMeterConverter').then((mod) => ({
      default: mod.DecimeterToMeterConverter,
    })),
  ),
  SquareKilometersToAcresConverter: lazyTool(() =>
    import(
      '@/tools/calculators/square-kilometers-to-acres/SquareKilometersToAcresConverter'
    ).then((mod) => ({
      default: mod.SquareKilometersToAcresConverter,
    })),
  ),
  FeetAndInchesCalculator: lazyTool(() =>
    import('@/tools/calculators/feet-and-inches/FeetAndInchesCalculator').then((mod) => ({
      default: mod.FeetAndInchesCalculator,
    })),
  ),
  YardsToAcresCalculator: lazyTool(() =>
    import('@/tools/calculators/yards-to-acres/YardsToAcresCalculator').then((mod) => ({
      default: mod.YardsToAcresCalculator,
    })),
  ),
  CcfToGallonsConversion: lazyTool(() =>
    import('@/tools/calculators/ccf-to-gallons/CcfToGallonsConversion').then((mod) => ({
      default: mod.CcfToGallonsConversion,
    })),
  ),
  LitersToCentilitersConverter: lazyTool(() =>
    import('@/tools/calculators/liters-to-centiliters/LitersToCentilitersConverter').then(
      (mod) => ({
        default: mod.LitersToCentilitersConverter,
      })
    ),
  ),
  CubicFeetCalculator: lazyTool(() =>
    import('@/tools/calculators/cubic-feet/CubicFeetCalculator').then((mod) => ({
      default: mod.CubicFeetCalculator,
    })),
  ),
  McgToMgConverter: lazyTool(() =>
    import('@/tools/calculators/mcg-to-mg/McgToMgConverter').then((mod) => ({
      default: mod.McgToMgConverter,
    })),
  ),
  CubicMeterCalculator: lazyTool(() =>
    import('@/tools/calculators/cubic-meter/CubicMeterCalculator').then((mod) => ({
      default: mod.CubicMeterCalculator,
    })),
  ),
  MgToMlCalculator: lazyTool(() =>
    import('@/tools/calculators/mg-to-ml/MgToMlCalculator').then((mod) => ({
      default: mod.MgToMlCalculator,
    })),
  ),
  CubicYardsToTonsCalculator: lazyTool(() =>
    import('@/tools/calculators/cubic-yards-to-tons/CubicYardsToTonsCalculator').then(
      (mod) => ({
        default: mod.CubicYardsToTonsCalculator,
      })
    ),
  ),
  MlToCupsConverter: lazyTool(() =>
    import('@/tools/calculators/ml-to-cups/MlToCupsConverter').then((mod) => ({
      default: mod.MlToCupsConverter,
    })),
  ),
  DecagramToGramConverter: lazyTool(() =>
    import('@/tools/calculators/decagram-to-gram/DecagramToGramConverter').then(
      (mod) => ({
        default: mod.DecagramToGramConverter,
      })
    ),
  ),
  PintToPoundCalculator: lazyTool(() =>
    import('@/tools/calculators/pint-to-pound/PintToPoundCalculator').then((mod) => ({
      default: mod.PintToPoundCalculator,
    })),
  ),
  DropsToMlConverter: lazyTool(() =>
    import('@/tools/calculators/drops-to-ml/DropsToMlConverter').then((mod) => ({
      default: mod.DropsToMlConverter,
    })),
  ),
  PoundsAndOuncesCalculator: lazyTool(() =>
    import('@/tools/calculators/pounds-and-ounces/PoundsAndOuncesCalculator').then(
      (mod) => ({
        default: mod.PoundsAndOuncesCalculator,
      })
    ),
  ),
  OzToCupsConverter: lazyTool(() =>
    import('@/tools/calculators/oz-to-cups/OzToCupsConverter').then((mod) => ({
      default: mod.OzToCupsConverter,
    })),
  ),
  GallonCalculator: lazyTool(() =>
    import('@/tools/calculators/gallon/GallonCalculator').then((mod) => ({
      default: mod.GallonCalculator,
    })),
  ),
  QuartsToPoundsConverter: lazyTool(() =>
    import('@/tools/calculators/quarts-to-pounds/QuartsToPoundsCalculator').then((mod) => ({
      default: mod.QuartsToPoundsConverter,
    })),
  ),
  GallonsToPoundsConverter: lazyTool(() =>
    import('@/tools/calculators/gallons-to-pounds/GallonsToPoundsCalculator').then((mod) => ({
      default: mod.GallonsToPoundsConverter,
    })),
  ),
  VolumeConversion: lazyTool(() =>
    import('@/tools/calculators/volume-conversion/VolumeConversionCalculator').then((mod) => ({
      default: mod.VolumeConversion,
    })),
  ),
  GramsToOuncesCalculator: lazyTool(() =>
    import('@/tools/calculators/grams-to-ounces/GramsToOuncesCalculator').then((mod) => ({
      default: mod.GramsToOuncesCalculator,
    })),
  ),
  WeightConverter: lazyTool(() =>
    import('@/tools/calculators/weight-converter/WeightConverterCalculator').then((mod) => ({
      default: mod.WeightConverter,
    })),
  ),
  KgToGallonsConverter: lazyTool(() =>
    import('@/tools/calculators/kg-to-gallons/KgToGallonsCalculator').then((mod) => ({
      default: mod.KgToGallonsConverter,
    })),
  ),
  ForceConverter: lazyTool(() =>
    import('@/tools/calculators/force-converter/ForceConverterCalculator').then((mod) => ({
      default: mod.ForceConverter,
    })),
  ),
  NmToInLbsConverter: lazyTool(() =>
    import('@/tools/calculators/nm-to-in-lbs/NmToInLbsCalculator').then((mod) => ({
      default: mod.NmToInLbsConverter,
    })),
  ),
  InchLbsToNmConverter: lazyTool(() =>
    import('@/tools/calculators/inch-lbs-to-nm/InchLbsToNmCalculator').then((mod) => ({
      default: mod.InchLbsToNmConverter,
    })),
  ),
  PressureConversion: lazyTool(() =>
    import('@/tools/calculators/pressure-conversion/PressureConverterCalculator').then(
      (mod) => ({
        default: mod.PressureConversion,
      })
    )
  ),
  InchPoundsToFootPoundsConverter: lazyTool(() =>
    import(
      '@/tools/calculators/inch-pounds-to-foot-pounds/InchPoundsToFootPoundsCalculator'
    ).then((mod) => ({
      default: mod.InchPoundsToFootPoundsConverter,
    })),
  ),
  PsiToGpmCalculator: lazyTool(() =>
    import('@/tools/calculators/psi-to-gpm/PsiToGpmCalculator').then((mod) => ({
      default: mod.PsiToGpmCalculator,
    })),
  ),
  LbsToNewtonsConverter: lazyTool(() =>
    import('@/tools/calculators/lbs-to-newtons/LbsToNewtonsCalculator').then((mod) => ({
      default: mod.LbsToNewtonsConverter,
    })),
  ),
  TorqueToHpCalculator: lazyTool(() =>
    import('@/tools/calculators/torque-to-hp/TorqueToHpCalculator').then((mod) => ({
      default: mod.TorqueToHpCalculator,
    })),
  ),
  NewtonMeterCalculator: lazyTool(() =>
    import('@/tools/calculators/newton-meter/NewtonMeterCalculator').then((mod) => ({
      default: mod.NewtonMeterCalculator,
    })),
  ),
  TorrToAtmConverter: lazyTool(() =>
    import('@/tools/calculators/torr-to-atm/TorrToAtmCalculator').then((mod) => ({
      default: mod.TorrToAtmConverter,
    })),
  ),
  NmToFtLbsConverter: lazyTool(() =>
    import('@/tools/calculators/nm-to-ft-lbs/NmToFtLbsCalculator').then((mod) => ({
      default: mod.NmToFtLbsConverter,
    })),
  ),
  CoordinatesConverter: lazyTool(() =>
    import('@/tools/calculators/coordinates/CoordinatesCalculator').then((mod) => ({
      default: mod.CoordinatesConverter,
    })),
  ),
  LatLongToUtmConverter: lazyTool(() =>
    import('@/tools/calculators/lat-long-to-utm/LatLongToUtmCalculator').then((mod) => ({
      default: mod.LatLongToUtmConverter,
    })),
  ),
  DegreesMinutesSecondsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/degrees-minutes-seconds/DegreesMinutesSecondsCalculator'
    ).then((mod) => ({
      default: mod.DegreesMinutesSecondsCalculator,
    })),
  ),
  ScaleCalculator: lazyTool(() =>
    import('@/tools/calculators/scale/ScaleCalculator').then((mod) => ({
      default: mod.ScaleCalculator,
    })),
  ),
  BillionToTrillionConverter: lazyTool(() =>
    import(
      '@/tools/calculators/billion-to-trillion/BillionToTrillionCalculator'
    ).then((mod) => ({
      default: mod.BillionToTrillionConverter,
    })),
  ),
  MillionToLakhConverter: lazyTool(() =>
    import('@/tools/calculators/million-to-lakh/MillionToLakhCalculator').then((mod) => ({
      default: mod.MillionToLakhConverter,
    })),
  ),
  CentsToEurosCalculator: lazyTool(() =>
    import('@/tools/calculators/cents-to-euros/CentsToEurosCalculator').then((mod) => ({
      default: mod.CentsToEurosCalculator,
    })),
  ),
  MillionToThousandConverter: lazyTool(() =>
    import(
      '@/tools/calculators/million-to-thousand/MillionToThousandCalculator'
    ).then((mod) => ({
      default: mod.MillionToThousandConverter,
    })),
  ),
  CroreToLakhConverter: lazyTool(() =>
    import('@/tools/calculators/crore-to-lakh/CroreToLakhCalculator').then((mod) => ({
      default: mod.CroreToLakhConverter,
    })),
  ),
  NumberToBillionConverter: lazyTool(() =>
    import('@/tools/calculators/number-to-billion/NumberToBillionCalculator').then(
      (mod) => ({
        default: mod.NumberToBillionConverter,
      })
    ),
  ),
  CroreToMillionConverter: lazyTool(() =>
    import('@/tools/calculators/crore-to-million/CroreToMillionCalculator').then((mod) => ({
      default: mod.CroreToMillionConverter,
    })),
  ),
  NumberToMillionConverter: lazyTool(() =>
    import('@/tools/calculators/number-to-million/NumberToMillionCalculator').then((mod) => ({
      default: mod.NumberToMillionConverter,
    })),
  ),
  MillionToBillionConverter: lazyTool(() =>
    import('@/tools/calculators/million-to-billion/MillionToBillionCalculator').then((mod) => ({
      default: mod.MillionToBillionConverter,
    })),
  ),
  BinaryConverter: lazyTool(() =>
    import('@/tools/calculators/binary/BinaryCalculator').then((mod) => ({
      default: mod.BinaryConverter,
    })),
  ),
  GematriaCalculator: lazyTool(() =>
    import('@/tools/calculators/gematria/GematriaCalculator').then((mod) => ({
      default: mod.GematriaCalculator,
    })),
  ),
  BinaryToHexConverter: lazyTool(() =>
    import('@/tools/calculators/binary-to-hex/BinaryToHexCalculator').then((mod) => ({
      default: mod.BinaryToHexConverter,
    })),
  ),
  GreekGematriaCalculator: lazyTool(() =>
    import('@/tools/calculators/greek-gematria/GreekGematriaCalculator').then((mod) => ({
      default: mod.GreekGematriaCalculator,
    })),
  ),
  BinaryToOctalConverter: lazyTool(() =>
    import('@/tools/calculators/binary-to-octal/BinaryToOctalCalculator').then((mod) => ({
      default: mod.BinaryToOctalConverter,
    })),
  ),
  HexadecimalConverter: lazyTool(() =>
    import('@/tools/calculators/hexadecimal/HexadecimalCalculator').then((mod) => ({
      default: mod.HexadecimalConverter,
    })),
  ),
  DecimalToHexConverter: lazyTool(() =>
    import('@/tools/calculators/decimal-to-hexadecimal/DecimalToHexCalculator').then((mod) => ({
      default: mod.DecimalToHexConverter,
    })),
  ),
  RomanNumeralsConverter: lazyTool(() =>
    import('@/tools/calculators/roman-numerals/RomanNumeralsCalculator').then((mod) => ({
      default: mod.RomanNumeralsConverter,
    })),
  ),
  DecimalToOctalConverter: lazyTool(() =>
    import('@/tools/calculators/decimal-to-octal/DecimalToOctalCalculator').then((mod) => ({
      default: mod.DecimalToOctalConverter,
    })),
  ),
  ByteConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/byte-conversion/ByteConversionCalculator').then((mod) => ({
      default: mod.ByteConversionCalculator,
    })),
  ),
  MbpsToGbpsConverter: lazyTool(() =>
    import('@/tools/calculators/mbps-to-gbps/MbpsToGbpsCalculator').then((mod) => ({
      default: mod.MbpsToGbpsConverter,
    })),
  ),
  CapacitanceConverter: lazyTool(() =>
    import('@/tools/calculators/capacitance/CapacitanceCalculator').then((mod) => ({
      default: mod.CapacitanceConverter,
    })),
  ),
  AdditionalFundsNeededCalculator: lazyTool(() =>
    import('@/tools/calculators/additional-funds-needed/AdditionalFundsNeededCalculator').then(
      (mod) => ({
        default: mod.AdditionalFundsNeededCalculator,
      }),
    ),
  ),
  AbsencePercentageCalculator: lazyTool(() =>
    import('@/tools/calculators/absence-percentage/AbsencePercentageCalculator').then((mod) => ({
      default: mod.AbsencePercentageCalculator,
    })),
  ),
  AccumulatedDepreciationCalculator: lazyTool(() =>
    import('@/tools/calculators/accumulated-depreciation/AccumulatedDepreciationCalculator').then(
      (mod) => ({
        default: mod.AccumulatedDepreciationCalculator,
      })
    )
  ),
  AttritionRateCalculator: lazyTool(() =>
    import('@/tools/calculators/attrition-rate/AttritionRateCalculator').then((mod) => ({
      default: mod.AttritionRateCalculator,
    })),
  ),
  BusinessLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/business-loan/BusinessLoanCalculator').then((mod) => ({
      default: mod.BusinessLoanCalculator,
    })),
  ProfitabilityIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/profitability-index/ProfitabilityIndexCalculator'
    ).then((mod) => ({
      default: mod.ProfitabilityIndexCalculator,
    })),
  ),
  RevenuePerEmployeeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/revenue-per-employee/RevenuePerEmployeeCalculator'
    ).then((mod) => ({
      default: mod.RevenuePerEmployeeCalculator,
    })),
  ),
  RoasCalculator: lazyTool(() =>
    import('@/tools/calculators/roas/RoasCalculator').then((mod) => ({
      default: mod.RoasCalculator,
    })),
  ),
  SaasLifetimeValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/saas-lifetime-value/SaasLifetimeValueCalculator'
    ).then((mod) => ({
      default: mod.SaasLifetimeValueCalculator,
    })),
  ),
  SafetyStockCalculator: lazyTool(() =>
    import('@/tools/calculators/safety-stock/SafetyStockCalculator').then((mod) => ({
      default: mod.SafetyStockCalculator,
    })),
  ),
  SalesCommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sales-commission/SalesCommissionCalculator'
    ).then((mod) => ({
      default: mod.SalesCommissionCalculator,
    })),
  ),
  SellThroughRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sell-through-rate/SellThroughRateCalculator'
    ).then((mod) => ({
      default: mod.SellThroughRateCalculator,
    })),
  ),
  SmokersCtcCalculator: lazyTool(() =>
    import('@/tools/calculators/smokers-ctc/SmokersCtcCalculator').then((mod) => ({
      default: mod.SmokersCtcCalculator,
    })),
  ),
  TenureCalculator: lazyTool(() =>
    import('@/tools/calculators/tenure/TenureCalculator').then((mod) => ({
      default: mod.TenureCalculator,
    })),
  ),
  TurnoverRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/turnover-rate/TurnoverRateCalculator'
    ).then((mod) => ({
      default: mod.TurnoverRateCalculator,
    })),
  ),
  WebsiteAdRevenueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/website-ad-revenue/WebsiteAdRevenueCalculator'
    ).then((mod) => ({
      default: mod.WebsiteAdRevenueCalculator,
    })),
  ),
  SoftwareContractValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/software-contract-value/SoftwareContractValueCalculator'
    ).then((mod) => ({
      default: mod.SoftwareContractValueCalculator,
    })),
  ),
  YoutubeMoneyCalculator: lazyTool(() =>
    import('@/tools/calculators/youtube-money/YoutubeMoneyCalculator').then((mod) => ({
      default: mod.YoutubeMoneyCalculator,
    })),
  ),
  AnnualizedRateOfReturnCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annualized-rate-of-return/AnnualizedRateOfReturnCalculator'
    ).then((mod) => ({
      default: mod.AnnualizedRateOfReturnCalculator,
    })),
  ),
  AppreciationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/appreciation/AppreciationCalculator'
    ).then((mod) => ({
      default: mod.AppreciationCalculator,
    })),
  ),
  AnnualizedReturnCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annualized-return/AnnualizedReturnCalculator'
    ).then((mod) => ({
      default: mod.AnnualizedReturnCalculator,
    })),
  ),
};

export function getToolComponent(key: string): LazyExoticComponent<ToolComponent> | null {
  if (!isRegisteredComponentKey(key)) return null;
  return calculators[key];
}
