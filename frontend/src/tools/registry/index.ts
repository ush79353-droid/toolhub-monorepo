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
  MbToGbConverter: lazyTool(() =>
    import('@/tools/calculators/mb-to-gb/MbToGbCalculator').then((mod) => ({
      default: mod.MbToGbConverter,
    })),
  ),
  ColorConverter: lazyTool(() =>
    import('@/tools/calculators/color/ColorConverter').then((mod) => ({
      default: mod.ColorConverter,
    })),
  ),
  RgbToHexConverter: lazyTool(() =>
    import('@/tools/calculators/rgb-to-hex/RgbToHexConverter').then((mod) => ({
      default: mod.RgbToHexConverter,
    })),
  ),
  HexToRgbConverter: lazyTool(() =>
    import('@/tools/calculators/hex-to-rgb/HexToRgbConverter').then((mod) => ({
      default: mod.HexToRgbConverter,
    })),
  ),
  UnicodeTextConverter: lazyTool(() =>
    import('@/tools/calculators/unicode-text/UnicodeTextConverter').then((mod) => ({
      default: mod.UnicodeTextConverter,
    })),
  ),
  KbToMbConverter: lazyTool(() =>
    import('@/tools/calculators/kb-to-mb/KbToMbConverter').then((mod) => ({
      default: mod.KbToMbConverter,
    })),
  ),
  UnixTimeConverter: lazyTool(() =>
    import('@/tools/calculators/unix-time/UnixTimeConverter').then((mod) => ({
      default: mod.UnixTimeConverter,
    })),
  ),
  MbpsCalculator: lazyTool(() =>
    import('@/tools/calculators/mbps/MbpsCalculator').then((mod) => ({
      default: mod.MbpsCalculator,
    })),
  ),
  MilitaryTimeConverter: lazyTool(() =>
    import('@/tools/calculators/military-time/MilitaryTimeConverter').then((mod) => ({
      default: mod.MilitaryTimeConverter,
    })),
  ),
  TimeZonesConverter: lazyTool(() =>
    import('@/tools/calculators/time-zones/TimeZonesConverter').then((mod) => ({
      default: mod.TimeZonesConverter,
    })),
  ),
  MinutesToHoursConverter: lazyTool(() =>
    import('@/tools/calculators/minutes-to-hours/MinutesToHoursConverter').then((mod) => ({
      default: mod.MinutesToHoursConverter,
    })),
  ),
  YearsToDecadesCalculator: lazyTool(() =>
    import('@/tools/calculators/years-to-decades/YearsToDecadesCalculator').then((mod) => ({
      default: mod.YearsToDecadesCalculator,
    })),
  ),
  TimeUnitConverter: lazyTool(() =>
    import('@/tools/calculators/time-unit/TimeUnitConverter').then((mod) => ({
      default: mod.TimeUnitConverter,
    })),
  ),
  ZuluTimeConverter: lazyTool(() =>
    import('@/tools/calculators/zulu-time/ZuluTimeConverter').then((mod) => ({
      default: mod.ZuluTimeConverter,
    })),
  ),
  AngleConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/angle-conversion/AngleConversionCalculator').then((mod) => ({
      default: mod.AngleConversionCalculator,
    })),
  ),
  MsToKmhConverter: lazyTool(() =>
    import('@/tools/calculators/ms-to-kmh/MsToKmhConverter').then((mod) => ({
      default: mod.MsToKmhConverter,
    })),
  ),
  CcfToThermsCalculator: lazyTool(() =>
    import('@/tools/calculators/ccf-to-therms/CcfToThermsCalculator').then((mod) => ({
      default: mod.CcfToThermsCalculator,
    })),
  ),
  NaturalGasConverter: lazyTool(() =>
    import('@/tools/calculators/natural-gas/NaturalGasConverter').then((mod) => ({
      default: mod.NaturalGasConverter,
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
  ),
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
  RoceCalculator: lazyTool(() =>
    import('@/tools/calculators/roce/RoceCalculator').then((mod) => ({
      default: mod.RoceCalculator,
    })),
  ),
  RoiCalculator: lazyTool(() =>
    import('@/tools/calculators/roi/RoiCalculator').then((mod) => ({
      default: mod.RoiCalculator,
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
  SimpleInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/simple-interest/SimpleInterestCalculator'
    ).then((mod) => ({
      default: mod.SimpleInterestCalculator,
    })),
  ),
  SinkingFundCalculator: lazyTool(() =>
    import('@/tools/calculators/sinking-fund/SinkingFundCalculator').then((mod) => ({
      default: mod.SinkingFundCalculator,
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
  TimeValueOfMoneyCalculator: lazyTool(() =>
    import('@/tools/calculators/time-value-of-money/TimeValueOfMoneyCalculator').then((mod) => ({
      default: mod.TimeValueOfMoneyCalculator,
    })),
  ),
  TtmCalculator: lazyTool(() =>
    import('@/tools/calculators/ttm/TtmCalculator').then((mod) => ({
      default: mod.TtmCalculator,
    })),
  ),
  TreynorRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/treynor-ratio/TreynorRatioCalculator').then(
      (mod) => ({
        default: mod.TreynorRatioCalculator,
      }),
    ),
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
  WeekOverWeekCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/week-over-week/WeekOverWeekCalculator'
    ).then((mod) => ({
      default: mod.WeekOverWeekCalculator,
    })),
  ),
  SoftwareContractValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/software-contract-value/SoftwareContractValueCalculator'
    ).then((mod) => ({
      default: mod.SoftwareContractValueCalculator,
    })),
  ),
  SortinoRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/sortino-ratio/SortinoRatioCalculator').then((mod) => ({
      default: mod.SortinoRatioCalculator,
    })),
  ),
  YearOverYearGrowthCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/year-over-year-growth/YearOverYearGrowthCalculator'
    ).then((mod) => ({
      default: mod.YearOverYearGrowthCalculator,
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
  ApyCalculator: lazyTool(() =>
    import('@/tools/calculators/apy/ApyCalculator').then((mod) => ({
      default: mod.ApyCalculator,
    })),
  ),
  BasisPointCalculator: lazyTool(() =>
    import('@/tools/calculators/basis-point/BasisPointCalculator').then((mod) => ({
      default: mod.BasisPointCalculator,
    })),
  ),
  BetaStockCalculator: lazyTool(() =>
    import('@/tools/calculators/beta-stock/BetaStockCalculator').then((mod) => ({
      default: mod.BetaStockCalculator,
    })),
  ),
  AverageCollectionPeriodCalculator: lazyTool(() =>
    import('@/tools/calculators/average-collection-period/AverageCollectionPeriodCalculator').then((mod) => ({
      default: mod.AverageCollectionPeriodCalculator,
    })),
  ),
  AverageFixedCostCalculator: lazyTool(() =>
    import('@/tools/calculators/average-fixed-cost/AverageFixedCostCalculator').then((mod) => ({
      default: mod.AverageFixedCostCalculator,
    })),
  ),
  BounceRateCalculator: lazyTool(() =>
    import('@/tools/calculators/bounce-rate/BounceRateCalculator').then((mod) => ({
      default: mod.BounceRateCalculator,
    })),
  ),
  BradfordFactorCalculator: lazyTool(() =>
    import('@/tools/calculators/bradford-factor/BradfordFactorCalculator').then((mod) => ({
      default: mod.BradfordFactorCalculator,
    })),
  ),
  BreakEvenCalculator: lazyTool(() =>
    import('@/tools/calculators/break-even/BreakEvenCalculator').then((mod) => ({
      default: mod.BreakEvenCalculator,
    })),
  ),
  BuildVsBuyCalculator: lazyTool(() =>
    import('@/tools/calculators/build-vs-buy/BuildVsBuyCalculator').then((mod) => ({
      default: mod.BuildVsBuyCalculator,
    })),
  ),
  BurnRateCalculator: lazyTool(() =>
    import('@/tools/calculators/burn-rate/BurnRateCalculator').then((mod) => ({
      default: mod.BurnRateCalculator,
    })),
  ),
  BurndownChartCalculator: lazyTool(() =>
    import('@/tools/calculators/burndown-chart/BurndownChartCalculator').then((mod) => ({
      default: mod.BurndownChartCalculator,
    })),
  ),
  BusinessBudgetCalculator: lazyTool(() =>
    import('@/tools/calculators/business-budget/BusinessBudgetCalculator').then((mod) => ({
      default: mod.BusinessBudgetCalculator,
    })),
  ),
  BusinessValuationCalculator: lazyTool(() =>
    import('@/tools/calculators/business-valuation/BusinessValuationCalculator').then((mod) => ({
      default: mod.BusinessValuationCalculator,
    })),
  ),
  CagrCalculator: lazyTool(() =>
    import('@/tools/calculators/cagr/CagrCalculator').then((mod) => ({
      default: mod.CagrCalculator,
    })),
  ),
  CapmCalculator: lazyTool(() =>
    import('@/tools/calculators/capm/CapmCalculator').then((mod) => ({
      default: mod.CapmCalculator,
    })),
  ),
  CarriedInterestCalculator: lazyTool(() =>
    import('@/tools/calculators/carried-interest/CarriedInterestCalculator').then(
      (mod) => ({
        default: mod.CarriedInterestCalculator,
      })
    ),
  ),
  ChurnRateCalculator: lazyTool(() =>
    import('@/tools/calculators/churn-rate/ChurnRateCalculator').then((mod) => ({
      default: mod.ChurnRateCalculator,
    })),
  ),
  ConsultingFeesCalculator: lazyTool(() =>
    import('@/tools/calculators/consulting-fees/ConsultingFeesCalculator').then((mod) => ({
      default: mod.ConsultingFeesCalculator,
    })),
  ),
  ContributionMarginCalculator: lazyTool(() =>
    import('@/tools/calculators/contribution-margin/ContributionMarginCalculator').then((mod) => ({
      default: mod.ContributionMarginCalculator,
    })),
  ),
  ConversionRateCalculator: lazyTool(() =>
    import('@/tools/calculators/conversion-rate/ConversionRateCalculator').then((mod) => ({
      default: mod.ConversionRateCalculator,
    })),
  ),
  CostFunctionCalculator: lazyTool(() =>
    import('@/tools/calculators/cost-function/CostFunctionCalculator').then((mod) => ({
      default: mod.CostFunctionCalculator,
    })),
  ),
  CostOfDoingBusinessCalculator: lazyTool(() =>
    import('@/tools/calculators/cost-of-doing-business/CostOfDoingBusinessCalculator').then((mod) => ({
      default: mod.CostOfDoingBusinessCalculator,
    })),
  ),
  CostOfGoodsSoldCalculator: lazyTool(() =>
    import('@/tools/calculators/cost-of-goods-sold/CostOfGoodsSoldCalculator').then((mod) => ({
      default: mod.CostOfGoodsSoldCalculator,
    })),
  ),
  CostOfEquityCalculator: lazyTool(() =>
    import('@/tools/calculators/cost-of-equity/CostOfEquityCalculator').then((mod) => ({
      default: mod.CostOfEquityCalculator,
    })),
  ),
  CpaCalculator: lazyTool(() =>
    import('@/tools/calculators/cpa/CpaCalculator').then((mod) => ({
      default: mod.CpaCalculator,
    })),
  ),
  CpcAndCpmCalculator: lazyTool(() =>
    import('@/tools/calculators/cpc-and-cpm/CpcAndCpmCalculator').then((mod) => ({
      default: mod.CpcAndCpmCalculator,
    })),
  ),
  CpmCalculator: lazyTool(() =>
    import('@/tools/calculators/cpm/CpmCalculator').then((mod) => ({
      default: mod.CpmCalculator,
    })),
  ),
  CtrCalculator: lazyTool(() =>
    import('@/tools/calculators/ctr/CtrCalculator').then((mod) => ({
      default: mod.CtrCalculator,
    })),
  ),
  CustomerAcquisitionCostCalculator: lazyTool(() =>
    import('@/tools/calculators/customer-acquisition-cost/CustomerAcquisitionCostCalculator').then((mod) => ({
      default: mod.CustomerAcquisitionCostCalculator,
    })),
  ),
  CustomerRetentionRateCalculator: lazyTool(() =>
    import('@/tools/calculators/customer-retention-rate/CustomerRetentionRateCalculator').then((mod) => ({
      default: mod.CustomerRetentionRateCalculator,
    })),
  ),
  DaysOffCalculator: lazyTool(() =>
    import('@/tools/calculators/days-off/DaysOffCalculator').then((mod) => ({
      default: mod.DaysOffCalculator,
    })),
  ),
  DirectMaterialPriceVarianceCalculator: lazyTool(() =>
    import('@/tools/calculators/direct-material-price-variance/DirectMaterialPriceVarianceCalculator').then((mod) => ({
      default: mod.DirectMaterialPriceVarianceCalculator,
    })),
  ),
  EarCalculator: lazyTool(() =>
    import('@/tools/calculators/ear/EarCalculator').then((mod) => ({
      default: mod.EarCalculator,
    })),
  ),
  EquivalentRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/equivalent-rate/EquivalentRateCalculator'
    ).then((mod) => ({
      default: mod.EquivalentRateCalculator,
    })),
  ),
  EffectiveCorporateTaxRateCalculator: lazyTool(() =>
    import('@/tools/calculators/effective-corporate-tax-rate/EffectiveCorporateTaxRateCalculator').then((mod) => ({
      default: mod.EffectiveCorporateTaxRateCalculator,
    })),
  ),
  EmvCalculator: lazyTool(() =>
    import('@/tools/calculators/emv/EmvCalculator').then((mod) => ({
      default: mod.EmvCalculator,
    })),
  ),
  EvmCalculator: lazyTool(() =>
    import('@/tools/calculators/evm/EvmCalculator').then((mod) => ({
      default: mod.EvmCalculator,
    })),
  ),
  ExitRateCalculator: lazyTool(() =>
    import('@/tools/calculators/exit-rate/ExitRateCalculator').then((mod) => ({
      default: mod.ExitRateCalculator,
    })),
  ),
  ExpectedReturnCalculator: lazyTool(() =>
    import('@/tools/calculators/expected-return/ExpectedReturnCalculator').then((mod) => ({
      default: mod.ExpectedReturnCalculator,
    })),
  ),
  ExpenseRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/expense-ratio/ExpenseRatioCalculator').then((mod) => ({
      default: mod.ExpenseRatioCalculator,
    })),
  ),
  FifoInventoryCalculator: lazyTool(() =>
    import('@/tools/calculators/fifo-inventory/FifoInventoryCalculator').then((mod) => ({
      default: mod.FifoInventoryCalculator,
    })),
  ),
  FullTimeEquivalentCalculator: lazyTool(() =>
    import('@/tools/calculators/full-time-equivalent/FullTimeEquivalentCalculator').then((mod) => ({
      default: mod.FullTimeEquivalentCalculator,
    })),
  ),
  GmroiCalculator: lazyTool(() =>
    import('@/tools/calculators/gmroi/GmroiCalculator').then((mod) => ({
      default: mod.GmroiCalculator,
    })),
  ),
  GoogleAdsenseCalculator: lazyTool(() =>
    import('@/tools/calculators/google-adsense/GoogleAdsenseCalculator').then((mod) => ({
      default: mod.GoogleAdsenseCalculator,
    })),
  ),
  HedgeRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/hedge-ratio/HedgeRatioCalculator').then((mod) => ({
      default: mod.HedgeRatioCalculator,
    })),
  ),
  HhiCalculator: lazyTool(() =>
    import('@/tools/calculators/hhi/HhiCalculator').then((mod) => ({
      default: mod.HhiCalculator,
    })),
  ),
  HighLowMethodCalculator: lazyTool(() =>
    import('@/tools/calculators/high-low-method/HighLowMethodCalculator').then((mod) => ({
      default: mod.HighLowMethodCalculator,
    })),
  ),
  LaborCostCalculator: lazyTool(() =>
    import('@/tools/calculators/labor-cost/LaborCostCalculator').then((mod) => ({
      default: mod.LaborCostCalculator,
    })),
  ),
  LemonadeStandCalculator: lazyTool(() =>
    import('@/tools/calculators/lemonade-stand/LemonadeStandCalculator').then((mod) => ({
      default: mod.LemonadeStandCalculator,
    })),
  ),
  LernerIndexCalculator: lazyTool(() =>
    import('@/tools/calculators/lerner-index/LernerIndexCalculator').then((mod) => ({
      default: mod.LernerIndexCalculator,
    })),
  ),
  LiquidNetWorthCalculator: lazyTool(() =>
    import('@/tools/calculators/liquid-net-worth/LiquidNetWorthCalculator').then((mod) => ({
      default: mod.LiquidNetWorthCalculator,
    })),
  ),
  ManHoursCalculator: lazyTool(() =>
    import('@/tools/calculators/man-hours/ManHoursCalculator').then((mod) => ({
      default: mod.ManHoursCalculator,
    })),
  ),
  MarginInterestCalculator: lazyTool(() =>
    import('@/tools/calculators/margin-interest/MarginInterestCalculator').then((mod) => ({
      default: mod.MarginInterestCalculator,
    })),
  ),
  MirrCalculator: lazyTool(() =>
    import('@/tools/calculators/mirr/MirrCalculator').then((mod) => ({
      default: mod.MirrCalculator,
    })),
  ),
  MoneyFactorCalculator: lazyTool(() =>
    import('@/tools/calculators/money-factor/MoneyFactorCalculator').then((mod) => ({
      default: mod.MoneyFactorCalculator,
    })),
  ),
  MoneyMarketAccountCalculator: lazyTool(() =>
    import('@/tools/calculators/money-market-account/MoneyMarketAccountCalculator').then(
      (mod) => ({
        default: mod.MoneyMarketAccountCalculator,
      })
    ),
  ),
  MovingAverageCalculator: lazyTool(() =>
    import('@/tools/calculators/moving-average/MovingAverageCalculator').then((mod) => ({
      default: mod.MovingAverageCalculator,
    })),
  ),
  MutualFundCalculator: lazyTool(() =>
    import('@/tools/calculators/mutual-fund/MutualFundCalculator').then((mod) => ({
      default: mod.MutualFundCalculator,
    })),
  ),
  MvaCalculator: lazyTool(() =>
    import('@/tools/calculators/mva/MvaCalculator').then((mod) => ({
      default: mod.MvaCalculator,
    })),
  ),
  NopatCalculator: lazyTool(() =>
    import('@/tools/calculators/nopat/NopatCalculator').then((mod) => ({
      default: mod.NopatCalculator,
    })),
  ),
  NpvCalculator: lazyTool(() =>
    import('@/tools/calculators/npv/NpvCalculator').then((mod) => ({
      default: mod.NpvCalculator,
    })),
  ),
  OnlineMarketingConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/online-marketing-conversion/OnlineMarketingConversionCalculator').then((mod) => ({
      default: mod.OnlineMarketingConversionCalculator,
    })),
  ),
  OperatingAssetTurnoverCalculator: lazyTool(() =>
    import('@/tools/calculators/operating-asset-turnover/OperatingAssetTurnoverCalculator').then((mod) => ({
      default: mod.OperatingAssetTurnoverCalculator,
    })),
  ),
  OptimalHedgeRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/optimal-hedge-ratio/OptimalHedgeRatioCalculator').then((mod) => ({
      default: mod.OptimalHedgeRatioCalculator,
    })),
  ),
  OpportunityCostCalculator: lazyTool(() =>
    import('@/tools/calculators/opportunity-cost/OpportunityCostCalculator').then((mod) => ({
      default: mod.OpportunityCostCalculator,
    })),
  ),
  ParkingRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/parking-ratio/ParkingRatioCalculator').then((mod) => ({
      default: mod.ParkingRatioCalculator,
    })),
  ),
  PaybackPeriodCalculator: lazyTool(() =>
    import('@/tools/calculators/payback-period/PaybackPeriodCalculator').then((mod) => ({
      default: mod.PaybackPeriodCalculator,
    })),
  ),
  PercentageReturnCalculator: lazyTool(() =>
    import('@/tools/calculators/percentage-return/PercentageReturnCalculator').then((mod) => ({
      default: mod.PercentageReturnCalculator,
    })),
  ),
  PerpetuityCalculator: lazyTool(() =>
    import('@/tools/calculators/perpetuity/PerpetuityCalculator').then((mod) => ({
      default: mod.PerpetuityCalculator,
    })),
  ),
  PreAndPostMoneyValuationCalculator: lazyTool(() =>
    import('@/tools/calculators/pre-and-post-money-valuation/PreAndPostMoneyValuationCalculator').then((mod) => ({
      default: mod.PreAndPostMoneyValuationCalculator,
    })),
  ),
  PresentValueCalculator: lazyTool(() =>
    import('@/tools/calculators/present-value/PresentValueCalculator').then((mod) => ({
      default: mod.PresentValueCalculator,
    })),
  ),
  PriceQuantityCalculator: lazyTool(() =>
    import('@/tools/calculators/price-quantity/PriceQuantityCalculator').then((mod) => ({
      default: mod.PriceQuantityCalculator,
    })),
  ),
  PvgoCalculator: lazyTool(() =>
    import('@/tools/calculators/pvgo/PvgoCalculator').then((mod) => ({
      default: mod.PvgoCalculator,
    })),
  ),
  PvifaCalculator: lazyTool(() =>
    import('@/tools/calculators/pvifa/PvifaCalculator').then((mod) => ({
      default: mod.PvifaCalculator,
    })),
  ),
  RateOfReturnCalculator: lazyTool(() =>
    import('@/tools/calculators/rate-of-return/RateOfReturnCalculator').then((mod) => ({
      default: mod.RateOfReturnCalculator,
    })),
  ),
  
  RealRateOfReturnCalculator: lazyTool(() =>
    import('@/tools/calculators/real-rate-of-return/RealRateOfReturnCalculator').then((mod) => ({
      default: mod.RealRateOfReturnCalculator,
    })),
  ),
  BitcoinEtfCalculator: lazyTool(() =>
    import('@/tools/calculators/bitcoin-etf/BitcoinEtfCalculator').then((mod) => ({
      default: mod.BitcoinEtfCalculator,
    })),
  ),
  CdCalculator: lazyTool(() =>
    import('@/tools/calculators/cd/CdCalculator').then((mod) => ({
      default: mod.CdCalculator,
    })),
  ),
  CapitalGainsYieldCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/capital-gains-yield/CapitalGainsYieldCalculator'
    ).then((mod) => ({
      default: mod.CapitalGainsYieldCalculator,
    })),
  ),
  CompoundInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/compound-interest/CompoundInterestCalculator'
    ).then((mod) => ({
      default: mod.CompoundInterestCalculator,
    })),
  ),
  CompoundInterestRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/compound-interest-rate/CompoundInterestRateCalculator'
    ).then((mod) => ({
      default: mod.CompoundInterestRateCalculator,
    })),
  ),
  CompoundGrowthCalculator: lazyTool(() =>
    import('@/tools/calculators/compound-growth/CompoundGrowthCalculator').then((mod) => ({
      default: mod.CompoundGrowthCalculator,
    })),
  ),
  ContinuousCompoundInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/continuous-compound-interest/ContinuousCompoundInterestCalculator'
    ).then((mod) => ({
      default: mod.ContinuousCompoundInterestCalculator,
    })),
  ),
  DiscountedCashFlowCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/discounted-cash-flow/DiscountedCashFlowCalculator'
    ).then((mod) => ({
      default: mod.DiscountedCashFlowCalculator,
    })),
  ),
  DiscountRateCalculator: lazyTool(() =>
    import('@/tools/calculators/discount-rate/DiscountRateCalculator').then((mod) => ({
      default: mod.DiscountRateCalculator,
    })),
  ),
  EffectiveAnnualYieldCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/effective-annual-yield/EffectiveAnnualYieldCalculator'
    ).then((mod) => ({
      default: mod.EffectiveAnnualYieldCalculator,
    })),
  ),
  EffectiveInterestRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/effective-interest-rate/EffectiveInterestRateCalculator'
    ).then((mod) => ({
      default: mod.EffectiveInterestRateCalculator,
    })),
  ),
  ExpectedUtilityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/expected-utility/ExpectedUtilityCalculator'
    ).then((mod) => ({
      default: mod.ExpectedUtilityCalculator,
    })),
  ),
  FdCalculator: lazyTool(() =>
    import('@/tools/calculators/fd/FdCalculator').then((mod) => ({
      default: mod.FdCalculator,
    })),
  ),
  FutureValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/future-value/FutureValueCalculator'
    ).then((mod) => ({
      default: mod.FutureValueCalculator,
    })),
  ),
  HoldingPeriodReturnCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/holding-period-return/HoldingPeriodReturnCalculator'
    ).then((mod) => ({
      default: mod.HoldingPeriodReturnCalculator,
    })),
  ),
  ImpermanentLossCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/impermanent-loss/ImpermanentLossCalculator'
    ).then((mod) => ({
      default: mod.ImpermanentLossCalculator,
    })),
  ),
  InformationRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/information-ratio/InformationRatioCalculator'
    ).then((mod) => ({
      default: mod.InformationRatioCalculator,
    })),
  ),
  InterestRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/interest-rate/InterestRateCalculator'
    ).then((mod) => ({
      default: mod.InterestRateCalculator,
    })),
  ),
  IrrCalculator: lazyTool(() =>
    import('@/tools/calculators/irr/IrrCalculator').then((mod) => ({
      default: mod.IrrCalculator,
    })),
  ),
  InvestmentCalculator: lazyTool(() =>
    import('@/tools/calculators/investment/InvestmentCalculator').then((mod) => ({
      default: mod.InvestmentCalculator,
    })),
  ),
  InvestmentFeeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/investment-fee/InvestmentFeeCalculator'
    ).then((mod) => ({
      default: mod.InvestmentFeeCalculator,
    })),
  ),
  JensensAlphaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/jensens-alpha/JensensAlphaCalculator'
    ).then((mod) => ({
      default: mod.JensensAlphaCalculator,
    })),
  ),
  SavingsInterestRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/savings-interest-rate/SavingsInterestRateCalculator'
    ).then((mod) => ({
      default: mod.SavingsInterestRateCalculator,
    })),
  ),
  SharpeRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/sharpe-ratio/SharpeRatioCalculator').then((mod) => ({
      default: mod.SharpeRatioCalculator,
    })),
  ),
  ValueAtRiskCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/value-at-risk/ValueAtRiskCalculator'
    ).then((mod) => ({
      default: mod.ValueAtRiskCalculator,
    })),
  ),
};

export function getToolComponent(key: string): LazyExoticComponent<ToolComponent> | null {
  if (!isRegisteredComponentKey(key)) return null;
  return calculators[key];
}
