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
  AfterTaxCostOfDebtCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/after-tax-cost-of-debt/AfterTaxCostOfDebtCalculator'
    ).then((mod) => ({
      default: mod.AfterTaxCostOfDebtCalculator,
    })),
  ),
  AnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annuity/AnnuityCalculator'
    ).then((mod) => ({
      default: mod.AnnuityCalculator,
    })),
  ),
  AnnuityPayoutCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annuity-payout/AnnuityPayoutCalculator'
    ).then((mod) => ({
      default: mod.AnnuityPayoutCalculator,
    })),
  ),
  AutoLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/auto-loan/AutoLoanCalculator').then((mod) => ({
      default: mod.AutoLoanCalculator,
    })),
  ),
  CaliforniaOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/california-overtime/CaliforniaOvertimeCalculator'
    ).then((mod) => ({
      default: mod.CaliforniaOvertimeCalculator,
    })),
  ),
  DebtAvalancheCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/debt-avalanche/DebtAvalancheCalculator'
    ).then((mod) => ({
      default: mod.DebtAvalancheCalculator,
    })),
  ),
  DebtCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/debt/DebtCalculator'
    ).then((mod) => ({
      default: mod.DebtCalculator,
    })),
  ),
  DebtServiceCoverageRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/debt-service-coverage-ratio/DebtServiceCoverageRatioCalculator'
    ).then((mod) => ({
      default: mod.DebtServiceCoverageRatioCalculator,
    })),
  ),
  DebtSnowballCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/debt-snowball/DebtSnowballCalculator'
    ).then((mod) => ({
      default: mod.DebtSnowballCalculator,
    })),
  ),
  DebtToAssetRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/debt-to-asset-ratio/DebtToAssetRatioCalculator'
    ).then((mod) => ({
      default: mod.DebtToAssetRatioCalculator,
    })),
  ),
  DebtToCapitalRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/debt-to-capital-ratio/DebtToCapitalRatioCalculator'
    ).then((mod) => ({
      default: mod.DebtToCapitalRatioCalculator,
    })),
  ),
  DebtToEquityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/debt-to-equity/DebtToEquityCalculator'
    ).then((mod) => ({
      default: mod.DebtToEquityCalculator,
    })),
  ),
  DeferredAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/deferred-annuity/DeferredAnnuityCalculator'
    ).then((mod) => ({
      default: mod.DeferredAnnuityCalculator,
    })),
  ),
  EbitdaMarginCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ebitda-margin/EbitdaMarginCalculator'
    ).then((mod) => ({
      default: mod.EbitdaMarginCalculator,
    })),
  ),
  FloridaOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/florida-overtime/FloridaOvertimeCalculator'
    ).then((mod) => ({
      default: mod.FloridaOvertimeCalculator,
    })),
  ),
  FutureValueOfAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/future-value-of-annuity/FutureValueOfAnnuityCalculator'
    ).then((mod) => ({
      default: mod.FutureValueOfAnnuityCalculator,
    })),
  ),
  GeorgiaOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/georgia-overtime/GeorgiaOvertimeCalculator'
    ).then((mod) => ({
      default: mod.GeorgiaOvertimeCalculator,
    })),
  ),
  GrossMarginCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gross-margin/GrossMarginCalculator'
    ).then((mod) => ({
      default: mod.GrossMarginCalculator,
    })),
  ),
  GrossRentMultiplierCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gross-rent-multiplier/GrossRentMultiplierCalculator'
    ).then((mod) => ({
      default: mod.GrossRentMultiplierCalculator,
    })),
  ),
  GrowingAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/growing-annuity/GrowingAnnuityCalculator'
    ).then((mod) => ({
      default: mod.GrowingAnnuityCalculator,
    })),
  ),
  IllinoisOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/illinois-overtime/IllinoisOvertimeCalculator'
    ).then((mod) => ({
      default: mod.IllinoisOvertimeCalculator,
    })),
  ),
  ImmediateAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/immediate-annuity/ImmediateAnnuityCalculator'
    ).then((mod) => ({
      default: mod.ImmediateAnnuityCalculator,
    })),
  ),
  InterestRateParityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/interest-rate-parity/InterestRateParityCalculator'
    ).then((mod) => ({
      default: mod.InterestRateParityCalculator,
    })),
  ),
  LoanCalculator: lazyTool(() =>
    import('@/tools/calculators/loan/LoanCalculator').then((mod) => ({
      default: mod.LoanCalculator,
    })),
  ),
  LoanInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/loan-interest/LoanInterestCalculator'
    ).then((mod) => ({
      default: mod.LoanInterestCalculator,
    })),
  ),
  LotteryAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lottery-annuity/LotteryAnnuityCalculator'
    ).then((mod) => ({
      default: mod.LotteryAnnuityCalculator,
    })),
  ),
  MarginAndMarkupCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-and-markup/MarginAndMarkupCalculator'
    ).then((mod) => ({
      default: mod.MarginAndMarkupCalculator,
    })),
  ),
  MarginAndVatCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-and-vat/MarginAndVatCalculator'
    ).then((mod) => ({
      default: mod.MarginAndVatCalculator,
    })),
  ),
  MarginCalculatorClassic: lazyTool(() =>
    import(
      '@/tools/calculators/margin-calculator-classic/MarginCalculatorClassicCalculator'
    ).then((mod) => ({
      default: mod.MarginCalculatorClassicCalculator,
    })),
  ),
  MarginCallCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-call/MarginCallCalculator'
    ).then((mod) => ({
      default: mod.MarginCallCalculator,
    })),
  ),
  MarginOfSafetyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-of-safety/MarginOfSafetyCalculator'
    ).then((mod) => ({
      default: mod.MarginOfSafetyCalculator,
    })),
  ),
  MarginWithDiscountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-with-discount/MarginWithDiscountCalculator'
    ).then((mod) => ({
      default: mod.MarginWithDiscountCalculator,
    })),
  ),
  NetDebtCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-debt/NetDebtCalculator'
    ).then((mod) => ({
      default: mod.NetDebtCalculator,
    })),
  ),
  NetEffectiveRentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-effective-rent/NetEffectiveRentCalculator'
    ).then((mod) => ({
      default: mod.NetEffectiveRentCalculator,
    })),
  ),
  NewYorkOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/new-york-overtime/NewYorkOvertimeCalculator'
    ).then((mod) => ({
      default: mod.NewYorkOvertimeCalculator,
    })),
  ),
  OperatingMarginCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/operating-margin/OperatingMarginCalculator'
    ).then((mod) => ({
      default: mod.OperatingMarginCalculator,
    })),
  ),
  OvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/overtime/OvertimeCalculator'
    ).then((mod) => ({
      default: mod.OvertimeCalculator,
    })),
  ),
  OvertimePaycheckCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/overtime-paycheck/OvertimePaycheckCalculator'
    ).then((mod) => ({
      default: mod.OvertimePaycheckCalculator,
    })),
  ),
  PresentValueOfAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/present-value-of-annuity/PresentValueOfAnnuityCalculator'
    ).then((mod) => ({
      default: mod.PresentValueOfAnnuityCalculator,
    })),
  ),
  RentIncreaseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/rent-increase/RentIncreaseCalculator'
    ).then((mod) => ({
      default: mod.RentIncreaseCalculator,
    })),
  ),
  RentOrBuyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/rent-or-buy/RentOrBuyCalculator'
    ).then((mod) => ({
      default: mod.RentOrBuyCalculator,
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
  SalaryWithOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/salary-with-overtime/SalaryWithOvertimeCalculator'
    ).then((mod) => ({
      default: mod.SalaryWithOvertimeCalculator,
    })),
  ),
  TdsInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/tds-interest/TdsInterestCalculator'
    ).then((mod) => ({
      default: mod.TdsInterestCalculator,
    })),
  ),
  TexasOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/texas-overtime/TexasOvertimeCalculator'
    ).then((mod) => ({
      default: mod.TexasOvertimeCalculator,
    })),
  ),
  TimesInterestEarnedCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/times-interest-earned/TimesInterestEarnedCalculator'
    ).then((mod) => ({
      default: mod.TimesInterestEarnedCalculator,
    })),
  ),
  TwelveVoltWireCalculator: lazyTool(() =>
    import('@/tools/calculators/twelve-volt-wire/TwelveVoltWireCalculator').then((mod) => ({
      default: mod.TwelveVoltWireCalculator,
    })),
  ),
  VariableAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/variable-annuity/VariableAnnuityCalculator'
    ).then((mod) => ({
      default: mod.VariableAnnuityCalculator,
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
  ArvCalculator: lazyTool(() =>
    import('@/tools/calculators/arv/ArvCalculator').then((mod) => ({
      default: mod.ArvCalculator,
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
  DeferredPaymentLoanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/deferred-payment-loan/DeferredPaymentLoanCalculator'
    ).then((mod) => ({
      default: mod.DeferredPaymentLoanCalculator,
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
  MlToCcConverter: lazyTool(() =>
    import('@/tools/calculators/ml-to-cc/MlToCcConverter').then((mod) => ({
      default: mod.MlToCcConverter,
    })),
  ),
  MlToKgConverter: lazyTool(() =>
    import('@/tools/calculators/ml-to-kg/MlToKgConverter').then((mod) => ({
      default: mod.MlToKgConverter,
    })),
  ),
  MlToLbsConversion: lazyTool(() =>
    import('@/tools/calculators/ml-to-lbs/MlToLbsConverter').then((mod) => ({
      default: mod.MlToLbsConversion,
    })),
  ),
  MlToOzConverter: lazyTool(() =>
    import('@/tools/calculators/ml-to-oz/MlToOzConverter').then((mod) => ({
      default: mod.MlToOzConverter,
    })),
  ),
  MlToTbspConverter: lazyTool(() =>
    import('@/tools/calculators/ml-to-tbsp/MlToTbspConverter').then((mod) => ({
      default: mod.MlToTbspConverter,
    })),
  ),
  MlToTspConverter: lazyTool(() =>
    import('@/tools/calculators/ml-to-tsp/MlToTspConverter').then((mod) => ({
      default: mod.MlToTspConverter,
    })),
  ),
  MlToUlConversion: lazyTool(() =>
    import('@/tools/calculators/ml-to-ul/MlToUlConverter').then((mod) => ({
      default: mod.MlToUlConversion,
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
  PintsToCupsConverter: lazyTool(() =>
    import('@/tools/calculators/pints-to-cups/PintsToCupsConverter').then((mod) => ({
      default: mod.PintsToCupsConverter,
    })),
  ),
  PintsToGallonsConverter: lazyTool(() =>
    import('@/tools/calculators/pints-to-gallons/PintsToGallonsConverter').then((mod) => ({
      default: mod.PintsToGallonsConverter,
    })),
  ),
  QuartsToGallonsConverter: lazyTool(() =>
    import('@/tools/calculators/quarts-to-gallons/QuartsToGallonsConverter').then((mod) => ({
      default: mod.QuartsToGallonsConverter,
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
  PoundsToGramsConverter: lazyTool(() =>
    import('@/tools/calculators/pounds-to-grams/PoundsToGramsConverter').then((mod) => ({
      default: mod.PoundsToGramsConverter,
    })),
  ),
  PoundsToLbsConverter: lazyTool(() =>
    import('@/tools/calculators/pounds-to-lbs/PoundsToLbsConverter').then((mod) => ({
      default: mod.PoundsToLbsConverter,
    })),
  ),
  PoundsToOuncesConverter: lazyTool(() =>
    import('@/tools/calculators/pounds-to-ounces/PoundsToOuncesConverter').then((mod) => ({
      default: mod.PoundsToOuncesConverter,
    })),
  ),
  PoundsToStoneConverter: lazyTool(() =>
    import('@/tools/calculators/pounds-to-stone/PoundsToStoneConverter').then((mod) => ({
      default: mod.PoundsToStoneConverter,
    })),
  ),
  OunceToKgConverter: lazyTool(() =>
    import('@/tools/calculators/ounce-to-kg/OunceToKgConverter').then((mod) => ({
      default: mod.OunceToKgConverter,
    })),
  ),
  OuncesToGramsConverter: lazyTool(() =>
    import('@/tools/calculators/ounces-to-grams/OuncesToGramsConverter').then((mod) => ({
      default: mod.OuncesToGramsConverter,
    })),
  ),
  OuncesToMillilitersConverter: lazyTool(() =>
    import('@/tools/calculators/ounces-to-milliliters/OuncesToMillilitersConverter').then(
      (mod) => ({
        default: mod.OuncesToMillilitersConverter,
      }),
    ),
  ),
  OuncesToPoundsConverter: lazyTool(() =>
    import('@/tools/calculators/ounces-to-pounds/OuncesToPoundsConverter').then((mod) => ({
      default: mod.OuncesToPoundsConverter,
    })),
  ),
  OzToCcConverter: lazyTool(() =>
    import('@/tools/calculators/oz-to-cc/OzToCcConverter').then((mod) => ({
      default: mod.OzToCcConverter,
    })),
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
  PricePerLiterToGallonConverter: lazyTool(() =>
    import('@/tools/calculators/price-per-liter-to-gallon/PricePerLiterToGallonConverter').then(
      (mod) => ({
        default: mod.PricePerLiterToGallonConverter,
      }),
    ),
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
  PaToPsiConversion: lazyTool(() =>
    import('@/tools/calculators/pa-to-psi/PaToPsiConversion').then((mod) => ({
      default: mod.PaToPsiConversion,
    })),
  ),
  PascalConversion: lazyTool(() =>
    import('@/tools/calculators/pascal-conversion/PascalConversion').then((mod) => ({
      default: mod.PascalConversion,
    })),
  ),
  PsiConverter: lazyTool(() =>
    import('@/tools/calculators/psi-converter/PsiConverter').then((mod) => ({
      default: mod.PsiConverter,
    })),
  ),
  PsiToAtmConversion: lazyTool(() =>
    import('@/tools/calculators/psi-to-atm/PsiToAtmConversion').then((mod) => ({
      default: mod.PsiToAtmConversion,
    })),
  ),
  PsiToInchesOfWaterConversion: lazyTool(() =>
    import('@/tools/calculators/psi-to-inches-of-water/PsiToInchesOfWaterConversion').then(
      (mod) => ({
        default: mod.PsiToInchesOfWaterConversion,
      }),
    ),
  ),
  PressureUnitConversion: lazyTool(() =>
    import('@/tools/calculators/pressure-unit-conversion/PressureUnitConversion').then((mod) => ({
      default: mod.PressureUnitConversion,
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
  MmhgToAtmConversion: lazyTool(() =>
    import('@/tools/calculators/mmhg-to-atm/MmhgToAtmConversion').then((mod) => ({
      default: mod.MmhgToAtmConversion,
    })),
  ),
  MmToAtmConverter: lazyTool(() =>
    import('@/tools/calculators/mm-to-atm/MmToAtmConverter').then((mod) => ({
      default: mod.MmToAtmConverter,
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
  CentsToDollarsCalculator: lazyTool(() =>
    import('@/tools/calculators/cents-to-dollars/CentsToDollarsCalculator').then((mod) => ({
      default: mod.CentsToDollarsCalculator,
    })),
  ),
  NmToJoulesCalculator: lazyTool(() =>
    import('@/tools/calculators/nm-to-joules/NmToJoulesCalculator').then((mod) => ({
      default: mod.NmToJoulesCalculator,
    })),
  ),
  CgsSystemOfUnitsConverter: lazyTool(() =>
    import('@/tools/calculators/cgs-system/CgsSystemOfUnitsConverter').then((mod) => ({
      default: mod.CgsSystemOfUnitsConverter,
    })),
  ),
  NickelsToDollarsCalculator: lazyTool(() =>
    import('@/tools/calculators/nickels-to-dollars/NickelsToDollarsCalculator').then((mod) => ({
      default: mod.NickelsToDollarsCalculator,
    })),
  ),
  ConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/conversion/ConversionCalculator').then((mod) => ({
      default: mod.ConversionCalculator,
    })),
  ),
  PaperQuantityConverter: lazyTool(() =>
    import('@/tools/calculators/paper-quantity/PaperQuantityConverter').then((mod) => ({
      default: mod.PaperQuantityConverter,
    })),
  ),
  CpsCalculator: lazyTool(() =>
    import('@/tools/calculators/cps/CpsCalculator').then((mod) => ({
      default: mod.CpsCalculator,
    })),
  ),
  PenniesToDollarsCalculator: lazyTool(() =>
    import('@/tools/calculators/pennies-to-dollars/PenniesToDollarsCalculator').then((mod) => ({
      default: mod.PenniesToDollarsCalculator,
    })),
  ),
  DbmToWattsCalculator: lazyTool(() =>
    import('@/tools/calculators/dbm-to-watts/DbmToWattsCalculator').then((mod) => ({
      default: mod.DbmToWattsCalculator,
    })),
  ),
  PowerConverter: lazyTool(() =>
    import('@/tools/calculators/power/PowerConverter').then((mod) => ({
      default: mod.PowerConverter,
    })),
  ),
  DensityConversion: lazyTool(() =>
    import('@/tools/calculators/density/DensityConversion').then((mod) => ({
      default: mod.DensityConversion,
    })),
  ),
  PpmCalculator: lazyTool(() =>
    import('@/tools/calculators/ppm/PpmCalculator').then((mod) => ({
      default: mod.PpmCalculator,
    })),
  ),
  DimensionalAnalysisCalculator: lazyTool(() =>
    import('@/tools/calculators/dimensional-analysis/DimensionalAnalysisCalculator').then(
      (mod) => ({
        default: mod.DimensionalAnalysisCalculator,
      }),
    ),
  ),
  PpmToMglConverter: lazyTool(() =>
    import('@/tools/calculators/ppm-to-mgl/PpmToMglConverter').then((mod) => ({
      default: mod.PpmToMglConverter,
    })),
  ),
  DimesToDollarsCalculator: lazyTool(() =>
    import('@/tools/calculators/dimes-to-dollars/DimesToDollarsCalculator').then((mod) => ({
      default: mod.DimesToDollarsCalculator,
    })),
  ),
  PxToEmConverter: lazyTool(() =>
    import('@/tools/calculators/px-to-em/PxToEmConverter').then((mod) => ({
      default: mod.PxToEmConverter,
    })),
  ),
  EnergyConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/energy/EnergyConversionCalculator').then((mod) => ({
      default: mod.EnergyConversionCalculator,
    })),
  ),
  QuantityConverter: lazyTool(() =>
    import('@/tools/calculators/quantity/QuantityConverter').then((mod) => ({
      default: mod.QuantityConverter,
    })),
  ),
  MpgToL100Converter: lazyTool(() =>
    import('@/tools/calculators/mpg-to-l100/MpgToL100Converter').then((mod) => ({
      default: mod.MpgToL100Converter,
    })),
  ),
  QuartersToDollarsCalculator: lazyTool(() =>
    import('@/tools/calculators/quarters-to-dollars/QuartersToDollarsCalculator').then((mod) => ({
      default: mod.QuartersToDollarsCalculator,
    })),
  ),
  GramsToCaloriesCalculator: lazyTool(() =>
    import('@/tools/calculators/grams-to-calories/GramsToCaloriesCalculator').then((mod) => ({
      default: mod.GramsToCaloriesCalculator,
    })),
  ),
  RadiationConverter: lazyTool(() =>
    import('@/tools/calculators/radiation/RadiationConverter').then((mod) => ({
      default: mod.RadiationConverter,
    })),
  ),
  HardnessConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/hardness/HardnessConversionCalculator').then((mod) => ({
      default: mod.HardnessConversionCalculator,
    })),
  ),
  RmsToWattsConverter: lazyTool(() =>
    import('@/tools/calculators/rms-to-watts/RmsToWattsConverter').then((mod) => ({
      default: mod.RmsToWattsConverter,
    })),
  ),
  JoulesToVoltsCalculator: lazyTool(() =>
    import('@/tools/calculators/joules-to-volts/JoulesToVoltsCalculator').then((mod) => ({
      default: mod.JoulesToVoltsCalculator,
    })),
  ),
  SpeedConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/speed/SpeedConversionCalculator').then((mod) => ({
      default: mod.SpeedConversionCalculator,
    })),
  ),
  KnotsToMphConverter: lazyTool(() =>
    import('@/tools/calculators/knots-to-mph/KnotsToMphConverter').then((mod) => ({
      default: mod.KnotsToMphConverter,
    }))
  ),
  UppercaseToLowercaseConverter: lazyTool(() =>
    import('@/tools/calculators/uppercase-to-lowercase/UppercaseToLowercaseConverter').then(
      (mod) => ({
        default: mod.UppercaseToLowercaseConverter,
      }),
    ),
  ),
  LeetSpeakTranslator: lazyTool(() =>
    import('@/tools/calculators/leet-speak/LeetSpeakTranslator').then((mod) => ({
      default: mod.LeetSpeakTranslator,
    })),
  ),
  WeirdUnitsConverter: lazyTool(() =>
    import('@/tools/calculators/weird-units/WeirdUnitsConverter').then((mod) => ({
      default: mod.WeirdUnitsConverter,
    })),
  ),
  LowercaseToUppercaseConverter: lazyTool(() =>
    import('@/tools/calculators/lowercase-to-uppercase/LowercaseToUppercaseConverter').then(
      (mod) => ({
        default: mod.LowercaseToUppercaseConverter,
      }),
    ),
  ),
  AcresToHectaresConverter: lazyTool(() =>
    import('@/tools/calculators/acres-to-hectares/AcresToHectaresConverter').then((mod) => ({
      default: mod.AcresToHectaresConverter,
    })),
  ),
  LbsToPsiConverter: lazyTool(() =>
    import('@/tools/calculators/lbs-to-psi/LbsToPsiConverter').then((mod) => ({
      default: mod.LbsToPsiConverter,
    })),
  ),
  AcresToSquareFeetConverter: lazyTool(() =>
    import('@/tools/calculators/acres-to-square-feet/AcresToSquareFeetConverter').then((mod) => ({
      default: mod.AcresToSquareFeetConverter,
    })),
  ),
  LbsToStoneConverter: lazyTool(() =>
    import('@/tools/calculators/lbs-to-stone/LbsToStoneConverter').then((mod) => ({
      default: mod.LbsToStoneConverter,
    })),
  ),
  AngstromToNmConverter: lazyTool(() =>
    import('@/tools/calculators/angstrom-to-nm/AngstromToNmConverter').then((mod) => ({
      default: mod.AngstromToNmConverter,
    })),
  ),
  LitersToPoundsCalculator: lazyTool(() =>
    import('@/tools/calculators/liters-to-pounds/LitersToPoundsCalculator').then((mod) => ({
      default: mod.LitersToPoundsCalculator,
    })),
  ),
  AtmConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/atm-conversion/AtmConversionCalculator').then((mod) => ({
      default: mod.AtmConversionCalculator,
    })),
  ),
  LiterToCcConverter: lazyTool(() =>
    import('@/tools/calculators/liter-to-cc/LiterToCcConverter').then((mod) => ({
      default: mod.LiterToCcConverter,
    })),
  ),
  AtmToPascalsConverter: lazyTool(() =>
    import('@/tools/calculators/atm-to-pascals/AtmToPascalsConverter').then((mod) => ({
      default: mod.AtmToPascalsConverter,
    })),
  ),
  LotSizeToAcresCalculator: lazyTool(() =>
    import('@/tools/calculators/lot-size-to-acres/LotSizeToAcresCalculator').then((mod) => ({
      default: mod.LotSizeToAcresCalculator,
    })),
  ),
  BarometricPressureConverter: lazyTool(() =>
    import('@/tools/calculators/barometric-pressure/BarometricPressureConverter').then((mod) => ({
      default: mod.BarometricPressureConverter,
    })),
  ),
  LotSizeToSqftCalculator: lazyTool(() =>
    import('@/tools/calculators/lot-size-to-sqft/LotSizeToSqftCalculator').then((mod) => ({
      default: mod.LotSizeToSqftCalculator,
    })),
  ),
  BarToAtmConverter: lazyTool(() =>
    import('@/tools/calculators/bar-to-atm/BarToAtmConverter').then((mod) => ({
      default: mod.BarToAtmConverter,
    })),
  ),
  LToGalConverter: lazyTool(() =>
    import('@/tools/calculators/l-to-gal/LToGalConverter').then((mod) => ({
      default: mod.LToGalConverter,
    })),
  ),
  BarToPsiConverter: lazyTool(() =>
    import('@/tools/calculators/bar-to-psi/BarToPsiConverter').then((mod) => ({
      default: mod.BarToPsiConverter,
    })),
  ),
  McgToMlConverter: lazyTool(() =>
    import('@/tools/calculators/mcg-to-ml/McgToMlConverter').then((mod) => ({
      default: mod.McgToMlConverter,
    })),
  ),
  BarToPsigConverter: lazyTool(() =>
    import('@/tools/calculators/bar-to-psig/BarToPsigConverter').then((mod) => ({
      default: mod.BarToPsigConverter,
    })),
  ),
  MeasurementConverter: lazyTool(() =>
    import('@/tools/calculators/measurement-converter/MeasurementConverter').then((mod) => ({
      default: mod.MeasurementConverter,
    })),
  ),
  CcToGramsConverter: lazyTool(() =>
    import('@/tools/calculators/cc-to-grams/CcToGramsConverter').then((mod) => ({
      default: mod.CcToGramsConverter,
    })),
  ),
  MeterConverter: lazyTool(() =>
    import('@/tools/calculators/meter-converter/MeterConverter').then((mod) => ({
      default: mod.MeterConverter,
    })),
  ),
  CcToLiterConverter: lazyTool(() =>
    import('@/tools/calculators/cc-to-liter/CcToLiterConverter').then((mod) => ({
      default: mod.CcToLiterConverter,
    })),
  ),
  MetersToFeetConverter: lazyTool(() =>
    import('@/tools/calculators/meters-to-feet/MetersToFeetConverter').then((mod) => ({
      default: mod.MetersToFeetConverter,
    })),
  ),
  CcToMlConverter: lazyTool(() =>
    import('@/tools/calculators/cc-to-ml/CcToMlConverter').then((mod) => ({
      default: mod.CcToMlConverter,
    })),
  ),
  MeterToMileConverter: lazyTool(() =>
    import('@/tools/calculators/meter-to-mile/MeterToMileConverter').then((mod) => ({
      default: mod.MeterToMileConverter,
    })),
  ),
  CcToOzConverter: lazyTool(() =>
    import('@/tools/calculators/cc-to-oz/CcToOzConverter').then((mod) => ({
      default: mod.CcToOzConverter,
    })),
  ),
  MetricConverter: lazyTool(() =>
    import('@/tools/calculators/metric-converter/MetricConverter').then((mod) => ({
      default: mod.MetricConverter,
    })),
  ),
  CelsiusConverter: lazyTool(() =>
    import('@/tools/calculators/celsius-converter/CelsiusConverter').then((mod) => ({
      default: mod.CelsiusConverter,
    })),
  ),
  MetricToImperialConverter: lazyTool(() =>
    import('@/tools/calculators/metric-to-imperial/MetricToImperialConverter').then((mod) => ({
      default: mod.MetricToImperialConverter,
    })),
  ),
  CelsiusToFahrenheitConverter: lazyTool(() =>
    import('@/tools/calculators/celsius-to-fahrenheit/CelsiusToFahrenheitConverter').then(
      (mod) => ({
        default: mod.CelsiusToFahrenheitConverter,
      }),
    ),
  ),
  CentigradeToCelsiusConverter: lazyTool(() =>
    import('@/tools/calculators/centigrade-to-celsius/CentigradeToCelsiusConverter').then(
      (mod) => ({
        default: mod.CentigradeToCelsiusConverter,
      }),
    ),
  ),
  MetricToSaeCalculator: lazyTool(() =>
    import('@/tools/calculators/metric-to-sae/MetricToSaeCalculator').then((mod) => ({
      default: mod.MetricToSaeCalculator,
    })),
  ),
  CmHeightConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/cm-height-conversion/CmHeightConversionCalculator').then(
      (mod) => ({
        default: mod.CmHeightConversionCalculator,
      }),
    ),
  ),
  CentimeterCalculator: lazyTool(() =>
    import('@/tools/calculators/centimeter/CentimeterCalculator').then((mod) => ({
      default: mod.CentimeterCalculator,
    })),
  ),
  CentToSquareMeterConverter: lazyTool(() =>
    import('@/tools/calculators/cent-to-square-meter/CentToSquareMeterConverter').then((mod) => ({
      default: mod.CentToSquareMeterConverter,
    })),
  ),
  CmToFtInConverter: lazyTool(() =>
    import('@/tools/calculators/cm-to-ft-in/CmToFtInConverter').then((mod) => ({
      default: mod.CmToFtInConverter,
    })),
  ),
  CmToInConverter: lazyTool(() =>
    import('@/tools/calculators/cm-to-in/CmToInConverter').then((mod) => ({
      default: mod.CmToInConverter,
    })),
  ),
  CmToKmConverter: lazyTool(() =>
    import('@/tools/calculators/cm-to-km/CmToKmConverter').then((mod) => ({
      default: mod.CmToKmConverter,
    })),
  ),
  CmToMConverter: lazyTool(() =>
    import('@/tools/calculators/cm-to-m/CmToMConverter').then((mod) => ({
      default: mod.CmToMConverter,
    })),
  ),
  CmToMmConverter: lazyTool(() =>
    import('@/tools/calculators/cm-to-mm/CmToMmConverter').then((mod) => ({
      default: mod.CmToMmConverter,
    })),
  ),
  CubicFeetToCubicMetersConverter: lazyTool(() =>
    import(
      '@/tools/calculators/cubic-feet-to-cubic-meters/CubicFeetToCubicMetersConverter'
    ).then((mod) => ({
      default: mod.CubicFeetToCubicMetersConverter,
    })),
  ),
  CubicFeetToGallonsConverter: lazyTool(() =>
    import('@/tools/calculators/cubic-feet-to-gallons/CubicFeetToGallonsConverter').then(
      (mod) => ({
        default: mod.CubicFeetToGallonsConverter,
      }),
    ),
  ),
  CubicFeetToPoundsCalculator: lazyTool(() =>
    import('@/tools/calculators/cubic-feet-to-pounds/CubicFeetToPoundsCalculator').then(
      (mod) => ({
        default: mod.CubicFeetToPoundsCalculator,
      }),
    ),
  ),
  CubicInchesToGallonsConverter: lazyTool(() =>
    import('@/tools/calculators/cubic-inches-to-gallons/CubicInchesToGallonsConverter').then(
      (mod) => ({
        default: mod.CubicInchesToGallonsConverter,
      }),
    ),
  ),
  CubicMeterToTonConverter: lazyTool(() =>
    import('@/tools/calculators/cubic-meter-to-ton/CubicMeterToTonConverter').then((mod) => ({
      default: mod.CubicMeterToTonConverter,
    })),
  ),
  CupsToGallonsConverter: lazyTool(() =>
    import('@/tools/calculators/cups-to-gallons/CupsToGallonsConverter').then((mod) => ({
      default: mod.CupsToGallonsConverter,
    })),
  ),
  CupsToOzConverter: lazyTool(() =>
    import('@/tools/calculators/cups-to-oz/CupsToOzConverter').then((mod) => ({
      default: mod.CupsToOzConverter,
    })),
  ),
  CupsToPintsConverter: lazyTool(() =>
    import('@/tools/calculators/cups-to-pints/CupsToPintsConverter').then((mod) => ({
      default: mod.CupsToPintsConverter,
    })),
  ),
  CupsToQuartsConverter: lazyTool(() =>
    import('@/tools/calculators/cups-to-quarts/CupsToQuartsConverter').then((mod) => ({
      default: mod.CupsToQuartsConverter,
    })),
  ),
  DayConverter: lazyTool(() =>
    import('@/tools/calculators/day-converter/DayConverter').then((mod) => ({
      default: mod.DayConverter,
    })),
  ),
  DaysToMonthsCalculator: lazyTool(() =>
    import('@/tools/calculators/days-to-months/DaysToMonthsCalculator').then((mod) => ({
      default: mod.DaysToMonthsCalculator,
    })),
  ),
  DaysToWeeksCalculator: lazyTool(() =>
    import('@/tools/calculators/days-to-weeks/DaysToWeeksCalculator').then((mod) => ({
      default: mod.DaysToWeeksCalculator,
    })),
  ),
  DaysToYearsCalculator: lazyTool(() =>
    import('@/tools/calculators/days-to-years/DaysToYearsCalculator').then((mod) => ({
      default: mod.DaysToYearsCalculator,
    })),
  ),
  DegreesToMinutesConverter: lazyTool(() =>
    import('@/tools/calculators/degrees-to-minutes/DegreesToMinutesConverter').then((mod) => ({
      default: mod.DegreesToMinutesConverter,
    })),
  ),
  DegreesToRadiansConverter: lazyTool(() =>
    import('@/tools/calculators/degrees-to-radians/DegreesToRadiansConverter').then((mod) => ({
      default: mod.DegreesToRadiansConverter,
    })),
  ),
  RadiansToDegreesConverter: lazyTool(() =>
    import('@/tools/calculators/radians-to-degrees/RadiansToDegreesConverter').then((mod) => ({
      default: mod.RadiansToDegreesConverter,
    })),
  ),
  DegreesToSecondsConverter: lazyTool(() =>
    import('@/tools/calculators/degrees-to-seconds/DegreesToSecondsConverter').then((mod) => ({
      default: mod.DegreesToSecondsConverter,
    })),
  ),
  DistanceConverter: lazyTool(() =>
    import('@/tools/calculators/distance-converter/DistanceConverter').then((mod) => ({
      default: mod.DistanceConverter,
    })),
  ),
  DmConverter: lazyTool(() =>
    import('@/tools/calculators/dm-converter/DmConverter').then((mod) => ({
      default: mod.DmConverter,
    })),
  ),
  FahrenheitConverter: lazyTool(() =>
    import('@/tools/calculators/fahrenheit-converter/FahrenheitConverter').then((mod) => ({
      default: mod.FahrenheitConverter,
    })),
  ),
  FahrenheitToCelsiusConverter: lazyTool(() =>
    import('@/tools/calculators/fahrenheit-to-celsius/FahrenheitToCelsiusConverter').then(
      (mod) => ({
        default: mod.FahrenheitToCelsiusConverter,
      }),
    ),
  ),
  FeetConverter: lazyTool(() =>
    import('@/tools/calculators/feet-converter/FeetConverter').then((mod) => ({
      default: mod.FeetConverter,
    })),
  ),
  FeetToMilesConverter: lazyTool(() =>
    import('@/tools/calculators/feet-to-miles/FeetToMilesConverter').then((mod) => ({
      default: mod.FeetToMilesConverter,
    })),
  ),
  FeetToYardsConverter: lazyTool(() =>
    import('@/tools/calculators/feet-to-yards/FeetToYardsConverter').then((mod) => ({
      default: mod.FeetToYardsConverter,
    })),
  ),
  FluidOuncesToPoundsConverter: lazyTool(() =>
    import('@/tools/calculators/fluid-ounces-to-pounds/FluidOuncesToPoundsConverter').then(
      (mod) => ({
        default: mod.FluidOuncesToPoundsConverter,
      }),
    ),
  ),
  FootToCentimeterConverter: lazyTool(() =>
    import('@/tools/calculators/foot-to-centimeter/FootToCentimeterConverter').then((mod) => ({
      default: mod.FootToCentimeterConverter,
    })),
  ),
  FtToMConverter: lazyTool(() =>
    import('@/tools/calculators/ft-to-m/FtToMConverter').then((mod) => ({
      default: mod.FtToMConverter,
    })),
  ),
  GajToSquareYardConverter: lazyTool(() =>
    import('@/tools/calculators/gaj-to-square-yard/GajToSquareYardConverter').then((mod) => ({
      default: mod.GajToSquareYardConverter,
    })),
  ),
  GallonsToCubicFeetConverter: lazyTool(() =>
    import('@/tools/calculators/gallons-to-cubic-feet/GallonsToCubicFeetConverter').then(
      (mod) => ({
        default: mod.GallonsToCubicFeetConverter,
      }),
    ),
  ),
  GallonsToCupsConverter: lazyTool(() =>
    import('@/tools/calculators/gallons-to-cups/GallonsToCupsConverter').then((mod) => ({
      default: mod.GallonsToCupsConverter,
    })),
  ),
  GallonsToGramsConverter: lazyTool(() =>
    import('@/tools/calculators/gallons-to-grams/GallonsToGramsConverter').then((mod) => ({
      default: mod.GallonsToGramsConverter,
    })),
  ),
  GallonsToPintsConverter: lazyTool(() =>
    import('@/tools/calculators/gallons-to-pints/GallonsToPintsConverter').then((mod) => ({
      default: mod.GallonsToPintsConverter,
    })),
  ),
  GallonsToQuartsConverter: lazyTool(() =>
    import('@/tools/calculators/gallons-to-quarts/GallonsToQuartsConverter').then((mod) => ({
      default: mod.GallonsToQuartsConverter,
    })),
  ),
  GallonsToTonsConverter: lazyTool(() =>
    import('@/tools/calculators/gallons-to-tons/GallonsToTonsConverter').then((mod) => ({
      default: mod.GallonsToTonsConverter,
    })),
  ),
  GalToKgConverter: lazyTool(() =>
    import('@/tools/calculators/gal-to-kg/GalToKgConverter').then((mod) => ({
      default: mod.GalToKgConverter,
    })),
  ),
  GramsInMlConverter: lazyTool(() =>
    import('@/tools/calculators/grams-in-ml/GramsInMlConverter').then((mod) => ({
      default: mod.GramsInMlConverter,
    })),
  ),
  GramsToFlOzConverter: lazyTool(() =>
    import('@/tools/calculators/grams-to-fl-oz/GramsToFlOzConverter').then((mod) => ({
      default: mod.GramsToFlOzConverter,
    })),
  ),
  GramToLiterConversion: lazyTool(() =>
    import('@/tools/calculators/gram-to-liter/GramToLiterConversion').then((mod) => ({
      default: mod.GramToLiterConversion,
    })),
  ),
  GrToMlConverter: lazyTool(() =>
    import('@/tools/calculators/gr-to-ml/GrToMlConverter').then((mod) => ({
      default: mod.GrToMlConverter,
    })),
  ),
  GToTspConverter: lazyTool(() =>
    import('@/tools/calculators/g-to-tsp/GToTspConverter').then((mod) => ({
      default: mod.GToTspConverter,
    })),
  ),
  GToLbsConverter: lazyTool(() =>
    import('@/tools/calculators/g-to-lbs/GToLbsConverter').then((mod) => ({
      default: mod.GToLbsConverter,
    })),
  ),
  HectaresToAcresConverter: lazyTool(() =>
    import('@/tools/calculators/hectares-to-acres/HectaresToAcresConverter').then((mod) => ({
      default: mod.HectaresToAcresConverter,
    })),
  ),
  HeightConverter: lazyTool(() =>
    import('@/tools/calculators/height-converter/HeightConverter').then((mod) => ({
      default: mod.HeightConverter,
    })),
  ),
  HourConverter: lazyTool(() =>
    import('@/tools/calculators/hour-converter/HourConverter').then((mod) => ({
      default: mod.HourConverter,
    })),
  ),
  HoursToDaysCalculator: lazyTool(() =>
    import('@/tools/calculators/hours-to-days/HoursToDaysCalculator').then((mod) => ({
      default: mod.HoursToDaysCalculator,
    })),
  ),
  HoursToMinutesConverter: lazyTool(() =>
    import('@/tools/calculators/hours-to-minutes/HoursToMinutesConverter').then((mod) => ({
      default: mod.HoursToMinutesConverter,
    })),
  ),
  HoursToSecondsConverter: lazyTool(() =>
    import('@/tools/calculators/hours-to-seconds/HoursToSecondsConverter').then((mod) => ({
      default: mod.HoursToSecondsConverter,
    })),
  ),
  HoursToWeekConversion: lazyTool(() =>
    import('@/tools/calculators/hours-to-weeks/HoursToWeekConversion').then((mod) => ({
      default: mod.HoursToWeekConversion,
    })),
  ),
  HoursToYearsConverter: lazyTool(() =>
    import('@/tools/calculators/hours-to-years/HoursToYearsConverter').then((mod) => ({
      default: mod.HoursToYearsConverter,
    })),
  ),
  ImperialCalculator: lazyTool(() =>
    import('@/tools/calculators/imperial/ImperialCalculator').then((mod) => ({
      default: mod.ImperialCalculator,
    })),
  ),
  ImperialToMetricConversion: lazyTool(() =>
    import('@/tools/calculators/imperial-to-metric/ImperialToMetricConversion').then((mod) => ({
      default: mod.ImperialToMetricConversion,
    })),
  ),
  InchConverter: lazyTool(() =>
    import('@/tools/calculators/inch-converter/InchConverter').then((mod) => ({
      default: mod.InchConverter,
    })),
  ),
  InchToMeterCalculator: lazyTool(() =>
    import('@/tools/calculators/inch-to-meter/InchToMeterCalculator').then((mod) => ({
      default: mod.InchToMeterCalculator,
    })),
  ),
  InchesToYardConversion: lazyTool(() =>
    import('@/tools/calculators/inches-to-yards/InchesToYardsConverter').then((mod) => ({
      default: mod.InchesToYardsConverter,
    })),
  ),
  InToCmConverter: lazyTool(() =>
    import('@/tools/calculators/in-to-cm/InToCmConverter').then((mod) => ({
      default: mod.InToCmConverter,
    })),
  ),
  KathaToSquareFeetConverter: lazyTool(() =>
    import('@/tools/calculators/katha-to-sqft/KathaToSquareFeetConverter').then((mod) => ({
      default: mod.KathaToSquareFeetConverter,
    })),
  ),
  KelvinConverter: lazyTool(() =>
    import('@/tools/calculators/kelvin-converter/KelvinConverter').then((mod) => ({
      default: mod.KelvinConverter,
    })),
  ),
  KelvinToCelsiusConverter: lazyTool(() =>
    import('@/tools/calculators/kelvin-to-celsius/KelvinToCelsiusConverter').then((mod) => ({
      default: mod.KelvinToCelsiusConverter,
    })),
  ),
  KelvinToFahrenheitConverter: lazyTool(() =>
    import('@/tools/calculators/kelvin-to-fahrenheit/KelvinToFahrenheitConverter').then((mod) => ({
      default: mod.KelvinToFahrenheitConverter,
    })),
  ),
  KgCmToPsiConverter: lazyTool(() =>
    import('@/tools/calculators/kgcm-to-psi/KgCmToPsiConverter').then((mod) => ({
      default: mod.KgCmToPsiConverter,
    })),
  ),
  KgToLbsConverter: lazyTool(() =>
    import('@/tools/calculators/kg-to-lbs/KgToLbsConverter').then((mod) => ({
      default: mod.KgToLbsConverter,
    })),
  ),
  KgToLiterConverter: lazyTool(() =>
    import('@/tools/calculators/kg-to-liter/KgToLiterConverter').then((mod) => ({
      default: mod.KgToLiterConverter,
    })),
  ),
  KgToMlConverter: lazyTool(() =>
    import('@/tools/calculators/kg-to-ml/KgToMlConverter').then((mod) => ({
      default: mod.KgToMlConverter,
    })),
  ),
  KgToOunceConverter: lazyTool(() =>
    import('@/tools/calculators/kg-to-ounce/KgToOunceConverter').then((mod) => ({
      default: mod.KgToOunceConverter,
    })),
  ),
  KgToStonesConverter: lazyTool(() =>
    import('@/tools/calculators/kg-to-stones/KgToStonesConverter').then((mod) => ({
      default: mod.KgToStonesConverter,
    })),
  ),
  KilometerCalculator: lazyTool(() =>
    import('@/tools/calculators/kilometer-calculator/KilometerCalculator').then((mod) => ({
      default: mod.KilometerCalculator,
    })),
  ),
  KilometerToMeterConverter: lazyTool(() =>
    import('@/tools/calculators/kilometer-to-meter/KilometerToMeterConverter').then((mod) => ({
      default: mod.KilometerToMeterConverter,
    })),
  ),
  KilometersToMilesCalculator: lazyTool(() =>
    import('@/tools/calculators/kilometers-to-miles/KilometersToMilesCalculator').then((mod) => ({
      default: mod.KilometersToMilesCalculator,
    })),
  ),
  KmToFeetConversion: lazyTool(() =>
    import('@/tools/calculators/km-to-feet/KmToFeetConversion').then((mod) => ({
      default: mod.KmToFeetConversion,
    })),
  ),
  KpaConverter: lazyTool(() =>
    import('@/tools/calculators/kpa-converter/KpaConverter').then((mod) => ({
      default: mod.KpaConverter,
    })),
  ),
  KpaToAtmConversion: lazyTool(() =>
    import('@/tools/calculators/kpa-to-atm/KpaToAtmConversion').then((mod) => ({
      default: mod.KpaToAtmConversion,
    })),
  ),
  KpaToMmhgConversion: lazyTool(() =>
    import('@/tools/calculators/kpa-to-mmhg/KpaToMmhgConversion').then((mod) => ({
      default: mod.KpaToMmhgConversion,
    })),
  ),
  KpaToPsiConversion: lazyTool(() =>
    import('@/tools/calculators/kpa-to-psi/KpaToPsiConversion').then((mod) => ({
      default: mod.KpaToPsiConversion,
    })),
  ),
  KsiToMpaConverter: lazyTool(() =>
    import('@/tools/calculators/ksi-to-mpa/KsiToMpaConverter').then((mod) => ({
      default: mod.KsiToMpaConverter,
    })),
  ),
  KsiToPsiConversion: lazyTool(() =>
    import('@/tools/calculators/ksi-to-psi/KsiToPsiConversion').then((mod) => ({
      default: mod.KsiToPsiConversion,
    })),
  ),
  LandAreaCalculator: lazyTool(() =>
    import('@/tools/calculators/land-area/LandAreaCalculator').then((mod) => ({
      default: mod.LandAreaCalculator,
    })),
  ),
  LbsToGConverter: lazyTool(() =>
    import('@/tools/calculators/lbs-to-g/LbsToGConverter').then((mod) => ({
      default: mod.LbsToGConverter,
    })),
  ),
  LbsToKgConverter: lazyTool(() =>
    import('@/tools/calculators/lbs-to-kg/LbsToKgConverter').then((mod) => ({
      default: mod.LbsToKgConverter,
    })),
  ),
  LbsToPoundsConverter: lazyTool(() =>
    import('@/tools/calculators/lbs-to-pounds/LbsToPoundsConverter').then((mod) => ({
      default: mod.LbsToPoundsConverter,
    })),
  ),
  MetricToStandardConverter: lazyTool(() =>
    import('@/tools/calculators/metric-to-standard/MetricToStandardConverter').then((mod) => ({
      default: mod.MetricToStandardConverter,
    })),
  ),
  MgToCcConverter: lazyTool(() =>
    import('@/tools/calculators/mg-to-cc/MgToCcConverter').then((mod) => ({
      default: mod.MgToCcConverter,
    })),
  ),
  MgToLbsConverter: lazyTool(() =>
    import('@/tools/calculators/mg-to-lbs/MgToLbsConverter').then((mod) => ({
      default: mod.MgToLbsConverter,
    })),
  ),
  MgToTablespoonConverter: lazyTool(() =>
    import('@/tools/calculators/mg-to-tablespoon/MgToTablespoonConverter').then((mod) => ({
      default: mod.MgToTablespoonConverter,
    })),
  ),
  MgToTeaspoonConverter: lazyTool(() =>
    import('@/tools/calculators/mg-to-teaspoon/MgToTeaspoonConverter').then((mod) => ({
      default: mod.MgToTeaspoonConverter,
    })),
  ),
  MicronToMilConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/micron-to-mil/MicronToMilConversionCalculator').then((mod) => ({
      default: mod.MicronToMilConversionCalculator,
    })),
  ),
  MilConversion: lazyTool(() =>
    import('@/tools/calculators/mil-conversion/MilConversion').then((mod) => ({
      default: mod.MilConversion,
    })),
  ),
  MileConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/mile-conversion/MileConversionCalculator').then((mod) => ({
      default: mod.MileConversionCalculator,
    })),
  ),
  MillimeterCalculator: lazyTool(() =>
    import('@/tools/calculators/millimeter/MillimeterCalculator').then((mod) => ({
      default: mod.MillimeterCalculator,
    })),
  ),
  MmCalculator: lazyTool(() =>
    import('@/tools/calculators/mm-calculator/MmCalculator').then((mod) => ({
      default: mod.MmCalculator,
    })),
  ),
  MmToFootConverter: lazyTool(() =>
    import('@/tools/calculators/mm-to-foot/MmToFootConverter').then((mod) => ({
      default: mod.MmToFootConverter,
    })),
  ),
  MmToInchesConversion: lazyTool(() =>
    import('@/tools/calculators/mm-to-inches/MmToInchesConversion').then((mod) => ({
      default: mod.MmToInchesConversion,
    })),
  ),
  MmToKmConversion: lazyTool(() =>
    import('@/tools/calculators/mm-to-km/MmToKmConversion').then((mod) => ({
      default: mod.MmToKmConversion,
    })),
  ),
  MmToMConversion: lazyTool(() =>
    import('@/tools/calculators/mm-to-m/MmToMConversion').then((mod) => ({
      default: mod.MmToMConversion,
    })),
  ),
  MillisecondsConverter: lazyTool(() =>
    import('@/tools/calculators/milliseconds/MillisecondsConverter').then((mod) => ({
      default: mod.MillisecondsConverter,
    })),
  ),
  MilToInchConversion: lazyTool(() =>
    import('@/tools/calculators/mil-to-inch/MilToInchConversion').then((mod) => ({
      default: mod.MilToInchConversion,
    })),
  ),
  MilToMmConversion: lazyTool(() =>
    import('@/tools/calculators/mil-to-mm/MilToMmConversion').then((mod) => ({
      default: mod.MilToMmConversion,
    })),
  ),
  MinuteConverter: lazyTool(() =>
    import('@/tools/calculators/minute-converter/MinuteConverter').then((mod) => ({
      default: mod.MinuteConverter,
    })),
  ),
  MinutesToDaysCalculator: lazyTool(() =>
    import('@/tools/calculators/minutes-to-days/MinutesToDaysCalculator').then((mod) => ({
      default: mod.MinutesToDaysCalculator,
    })),
  ),
  MinutesToDecimalCalculator: lazyTool(() =>
    import('@/tools/calculators/minutes-to-decimal/MinutesToDecimalCalculator').then((mod) => ({
      default: mod.MinutesToDecimalCalculator,
    })),
  ),
  MinutesToSecondsConverter: lazyTool(() =>
    import('@/tools/calculators/minutes-to-seconds/MinutesToSecondsConverter').then((mod) => ({
      default: mod.MinutesToSecondsConverter,
    })),
  ),
  MinutesToYearsConversion: lazyTool(() =>
    import('@/tools/calculators/minutes-to-years/MinutesToYearsConversion').then((mod) => ({
      default: mod.MinutesToYearsConversion,
    })),
  ),
  MonthsToYearsCalculator: lazyTool(() =>
    import('@/tools/calculators/months-to-years/MonthsToYearsCalculator').then((mod) => ({
      default: mod.MonthsToYearsCalculator,
    })),
  ),
  MpaConversion: lazyTool(() =>
    import('@/tools/calculators/mpa-conversion/MpaConversion').then((mod) => ({
      default: mod.MpaConversion,
    })),
  ),
  MpaToPsiConversion: lazyTool(() =>
    import('@/tools/calculators/mpa-to-psi/MpaToPsiConversion').then((mod) => ({
      default: mod.MpaToPsiConversion,
    })),
  ),
  MpaToPsigConversion: lazyTool(() =>
    import('@/tools/calculators/mpa-to-psig/MpaToPsigConversion').then((mod) => ({
      default: mod.MpaToPsigConversion,
    })),
  ),
  MsToSecondsConverter: lazyTool(() =>
    import('@/tools/calculators/ms-to-seconds/MsToSecondsConverter').then((mod) => ({
      default: mod.MsToSecondsConverter,
    })),
  ),
  SecondsConverter: lazyTool(() =>
    import('@/tools/calculators/seconds-converter/SecondsConverter').then((mod) => ({
      default: mod.SecondsConverter,
    })),
  ),
  SecondsToDaysConverter: lazyTool(() =>
    import('@/tools/calculators/seconds-to-days/SecondsToDaysConverter').then((mod) => ({
      default: mod.SecondsToDaysConverter,
    })),
  ),
  SecondsToHoursConverter: lazyTool(() =>
    import('@/tools/calculators/seconds-to-hours/SecondsToHoursConverter').then((mod) => ({
      default: mod.SecondsToHoursConverter,
    })),
  ),
  SecondsToMinutesConverter: lazyTool(() =>
    import('@/tools/calculators/seconds-to-minutes/SecondsToMinutesConverter').then((mod) => ({
      default: mod.SecondsToMinutesConverter,
    })),
  ),
  SecondsToYearsConversion: lazyTool(() =>
    import('@/tools/calculators/seconds-to-years/SecondsToYearsConversion').then((mod) => ({
      default: mod.SecondsToYearsConversion,
    })),
  ),
  SquareCmToSquareMmConverter: lazyTool(() =>
    import('@/tools/calculators/square-cm-to-square-mm/SquareCmToSquareMmConverter').then((mod) => ({
      default: mod.SquareCmToSquareMmConverter,
    })),
  ),
  SquareFeetConverter: lazyTool(() =>
    import('@/tools/calculators/square-feet-converter/SquareFeetConverter').then((mod) => ({
      default: mod.SquareFeetConverter,
    })),
  ),
  SquareFeetToAcresCalculator: lazyTool(() =>
    import('@/tools/calculators/square-feet-to-acres/SquareFeetToAcresCalculator').then((mod) => ({
      default: mod.SquareFeetToAcresCalculator,
    })),
  ),
  SquareInchToSquareFootConverter: lazyTool(() =>
    import('@/tools/calculators/square-inch-to-square-foot/SquareInchToSquareFootConverter').then(
      (mod) => ({
        default: mod.SquareInchToSquareFootConverter,
      }),
    ),
  ),
  SquareMeterConverter: lazyTool(() =>
    import('@/tools/calculators/square-meter-converter/SquareMeterConverter').then((mod) => ({
      default: mod.SquareMeterConverter,
    })),
  ),
  SquareMetersToSquareFeetConverter: lazyTool(() =>
    import(
      '@/tools/calculators/square-meters-to-square-feet/SquareMetersToSquareFeetConverter'
    ).then((mod) => ({
      default: mod.SquareMetersToSquareFeetConverter,
    })),
  ),
  SquareMilesToSquareKmConverter: lazyTool(() =>
    import(
      '@/tools/calculators/square-miles-to-square-km/SquareMilesToSquareKmConverter'
    ).then((mod) => ({
      default: mod.SquareMilesToSquareKmConverter,
    })),
  ),
  SquareYardConverter: lazyTool(() =>
    import('@/tools/calculators/square-yard-converter/SquareYardConverter').then((mod) => ({
      default: mod.SquareYardConverter,
    })),
  ),
  StoneToKgConverter: lazyTool(() =>
    import('@/tools/calculators/stone-to-kg/StoneToKgConverter').then((mod) => ({
      default: mod.StoneToKgConverter,
    })),
  ),
  StoneToLbsConverter: lazyTool(() =>
    import('@/tools/calculators/stone-to-lbs/StoneToLbsConverter').then((mod) => ({
      default: mod.StoneToLbsConverter,
    })),
  ),
  TbspToGramsConverter: lazyTool(() =>
    import('@/tools/calculators/tbsp-to-grams/TbspToGramsConverter').then((mod) => ({
      default: mod.TbspToGramsConverter,
    })),
  ),
  TbspToMlConverter: lazyTool(() =>
    import('@/tools/calculators/tbsp-to-ml/TbspToMlConverter').then((mod) => ({
      default: mod.TbspToMlConverter,
    })),
  ),
  TspToGramsConverter: lazyTool(() =>
    import('@/tools/calculators/tsp-to-grams/TspToGramsConverter').then((mod) => ({
      default: mod.TspToGramsConverter,
    })),
  ),
  TspToMlConverter: lazyTool(() =>
    import('@/tools/calculators/tsp-to-ml/TspToMlConverter').then((mod) => ({
      default: mod.TspToMlConverter,
    })),
  ),
  WeeksToMonthsCalculator: lazyTool(() =>
    import('@/tools/calculators/weeks-to-months/WeeksToMonthsCalculator').then((mod) => ({
      default: mod.WeeksToMonthsCalculator,
    })),
  ),
  WeeksToYearsConverter: lazyTool(() =>
    import('@/tools/calculators/weeks-to-years/WeeksToYearsConverter').then((mod) => ({
      default: mod.WeeksToYearsConverter,
    })),
  ),
  YardConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/yard-conversion/YardConversionCalculator').then((mod) => ({
      default: mod.YardConversionCalculator,
    })),
  ),
  YardToMeterConverter: lazyTool(() =>
    import('@/tools/calculators/yard-to-meter/YardToMeterConverter').then((mod) => ({
      default: mod.YardToMeterConverter,
    })),
  ),
  YardToMileConverter: lazyTool(() =>
    import('@/tools/calculators/yard-to-mile/YardToMileConverter').then((mod) => ({
      default: mod.YardToMileConverter,
    })),
  ),
  YardsToMetersConversion: lazyTool(() =>
    import('@/tools/calculators/yards-to-meters/YardsToMetersConversion').then((mod) => ({
      default: mod.YardsToMetersConversion,
    })),
  ),
  NmConverter: lazyTool(() =>
    import('@/tools/calculators/nm-converter/NmConverter').then((mod) => ({
      default: mod.NmConverter,
    })),
  ),
  NmToMConverter: lazyTool(() =>
    import('@/tools/calculators/nm-to-m/NmToMConverter').then((mod) => ({
      default: mod.NmToMConverter,
    })),
  ),
  KnotsToKphConverter: lazyTool(() =>
    import('@/tools/calculators/knots-to-kph/KnotsToKphConverter').then((mod) => ({
      default: mod.KnotsToKphConverter,
    })),
  ),
  TemperatureConversionCalculator: lazyTool(() =>
    import('@/tools/calculators/temperature/TemperatureConversionCalculator').then((mod) => ({
      default: mod.TemperatureConversionCalculator,
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
  CommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/commission/CommissionCalculator'
    ).then((mod) => ({
      default: mod.CommissionCalculator,
    })),
  ),
  SalesCommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sales-commission/SalesCommissionCalculator'
    ).then((mod) => ({
      default: mod.SalesCommissionCalculator,
    })),
  ),
  TrueCostOfRealEstateCommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/true-cost-real-estate-commission/TrueCostRealEstateCommissionCalculator'
    ).then((mod) => ({
      default: mod.TrueCostOfRealEstateCommissionCalculator,
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
  AnnualSalaryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annual-salary/AnnualSalaryCalculator'
    ).then((mod) => ({
      default: mod.AnnualSalaryCalculator,
    })),
  ),
  AnnualSalaryPerHourCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annual-salary-per-hour/AnnualSalaryPerHourCalculator'
    ).then((mod) => ({
      default: mod.AnnualSalaryPerHourCalculator,
    })),
  ),
  AnnualToMonthlySalaryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annual-to-monthly-salary/AnnualToMonthlySalaryCalculator'
    ).then((mod) => ({
      default: mod.AnnualToMonthlySalaryCalculator,
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
  AprCalculator: lazyTool(() =>
    import('@/tools/calculators/apr/AprCalculator').then((mod) => ({
      default: mod.AprCalculator,
    })),
  ),
  ApyCalculator: lazyTool(() =>
    import('@/tools/calculators/apy/ApyCalculator').then((mod) => ({
      default: mod.ApyCalculator,
    })),
  ),
  BalanceTransferCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/balance-transfer/BalanceTransferCalculator'
    ).then((mod) => ({
      default: mod.BalanceTransferCalculator,
    })),
  ),
  BalloonPaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/balloon-payment/BalloonPaymentCalculator'
    ).then((mod) => ({
      default: mod.BalloonPaymentCalculator,
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
  BlendedRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blended-rate/BlendedRateCalculator'
    ).then((mod) => ({
      default: mod.BlendedRateCalculator,
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
  CanadianMortgageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/canadian-mortgage/CanadianMortgageCalculator'
    ).then((mod) => ({
      default: mod.CanadianMortgageCalculator,
    })),
  ),
  MortgageCalculatorUk: lazyTool(() =>
    import('@/tools/calculators/mortgage-uk/MortgageCalculatorUk').then((mod) => ({
      default: mod.MortgageCalculatorUk,
    })),
  ),
  CarInterestCalculator: lazyTool(() =>
    import('@/tools/calculators/car-interest/CarInterestCalculator').then((mod) => ({
      default: mod.CarInterestCalculator,
    })),
  ),
  CarLoanEmiCalculator: lazyTool(() =>
    import('@/tools/calculators/car-loan-emi/CarLoanEmiCalculator').then((mod) => ({
      default: mod.CarLoanEmiCalculator,
    })),
  ),
  CarriedInterestCalculator: lazyTool(() =>
    import('@/tools/calculators/carried-interest/CarriedInterestCalculator').then(
      (mod) => ({
        default: mod.CarriedInterestCalculator,
      })
    ),
  ),
  CashBackOrLowInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cash-back-or-low-interest/CashBackOrLowInterestCalculator'
    ).then((mod) => ({
      default: mod.CashBackOrLowInterestCalculator,
    })),
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
  DividendDiscountModelCalculator: lazyTool(() =>
    import('@/tools/calculators/dividend-discount-model/DividendDiscountModelCalculator').then(
      (mod) => ({
        default: mod.DividendDiscountModelCalculator,
      })
    )
  ),
  DividendPayoutRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/dividend-payout-ratio/DividendPayoutRatioCalculator').then(
      (mod) => ({
        default: mod.DividendPayoutRatioCalculator,
      })
    )
  ),
  DividendYieldCalculator: lazyTool(() =>
    import('@/tools/calculators/dividend-yield/DividendYieldCalculator').then(
      (mod) => ({
        default: mod.DividendYieldCalculator,
      })
    )
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
  EarlyLoanPayoffCalculator: lazyTool(() =>
    import('@/tools/calculators/early-loan-payoff/EarlyLoanPayoffCalculator').then(
      (mod) => ({
        default: mod.EarlyLoanPayoffCalculator,
      })
    )
  ),
  EbitCalculator: lazyTool(() =>
    import('@/tools/calculators/ebit/EbitCalculator').then((mod) => ({
      default: mod.EbitCalculator,
    })),
  ),
  EbitdaCalculator: lazyTool(() =>
    import('@/tools/calculators/ebitda/EbitdaCalculator').then((mod) => ({
      default: mod.EbitdaCalculator,
    })),
  ),
  EbtCalculator: lazyTool(() =>
    import('@/tools/calculators/ebt/EbtCalculator').then((mod) => ({
      default: mod.EbtCalculator,
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
  LoanBalanceCalculator: lazyTool(() =>
    import('@/tools/calculators/loan-balance/LoanBalanceCalculator').then((mod) => ({
      default: mod.LoanBalanceCalculator,
    })),
  ),
  LoanPaymentCalculator: lazyTool(() =>
    import('@/tools/calculators/loan-payment/LoanPaymentCalculator').then((mod) => ({
      default: mod.LoanPaymentCalculator,
    })),
  ),
  LoanRepaymentCalculator: lazyTool(() =>
    import('@/tools/calculators/loan-repayment/LoanRepaymentCalculator').then(
      (mod) => ({
        default: mod.LoanRepaymentCalculator,
      })
    )
  ),
  QuizLoanBalanceCalculator: lazyTool(() =>
    import('@/tools/calculators/quiz-loan-balance/QuizLoanBalanceCalculator').then(
      (mod) => ({
        default: mod.QuizLoanBalanceCalculator,
      })
    )
  ),
  QuizDividendCalculator: lazyTool(() =>
    import('@/tools/calculators/quiz-dividend/QuizDividendCalculator').then(
      (mod) => ({
        default: mod.QuizDividendCalculator,
      })
    )
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
  MarginalCostCalculator: lazyTool(() =>
    import('@/tools/calculators/marginal-cost/MarginalCostCalculator').then((mod) => ({
      default: mod.MarginalCostCalculator,
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
  MonthOverMonthCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/month-over-month/MonthOverMonthCalculator'
    ).then((mod) => ({
      default: mod.MonthOverMonthCalculator,
    })),
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
  OptimalPriceCalculator: lazyTool(() =>
    import('@/tools/calculators/optimal-price/OptimalPriceCalculator').then((mod) => ({
      default: mod.OptimalPriceCalculator,
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
  PartiallyAmortizedLoanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/partially-amortized-loan/PartiallyAmortizedLoanCalculator'
    ).then((mod) => ({
      default: mod.PartiallyAmortizedLoanCalculator,
    })),
  ),
  PaydayLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/payday-loan/PaydayLoanCalculator').then((mod) => ({
      default: mod.PaydayLoanCalculator,
    })),
  ),
  PaymentCalculator: lazyTool(() =>
    import('@/tools/calculators/payment/PaymentCalculator').then((mod) => ({
      default: mod.PaymentCalculator,
    })),
  ),
  PaybackPeriodCalculator: lazyTool(() =>
    import('@/tools/calculators/payback-period/PaybackPeriodCalculator').then((mod) => ({
      default: mod.PaybackPeriodCalculator,
    })),
  ),
  PercentageDiscountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/percentage-discount/PercentageDiscountCalculator'
    ).then((mod) => ({
      default: mod.PercentageDiscountCalculator,
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
  PostJudgmentInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/post-judgment-interest/PostJudgmentInterestCalculator'
    ).then((mod) => ({
      default: mod.PostJudgmentInterestCalculator,
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
  PriceElasticityOfDemandCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-elasticity-of-demand/PriceElasticityOfDemandCalculator'
    ).then((mod) => ({
      default: mod.PriceElasticityOfDemandCalculator,
    })),
  ),
  PriceQuantityCalculator: lazyTool(() =>
    import('@/tools/calculators/price-quantity/PriceQuantityCalculator').then((mod) => ({
      default: mod.PriceQuantityCalculator,
    })),
  ),
  PrivateSavingsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/private-savings/PrivateSavingsCalculator'
    ).then((mod) => ({
      default: mod.PrivateSavingsCalculator,
    })),
  ),
  ProratedSalaryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/prorated-salary/ProratedSalaryCalculator'
    ).then((mod) => ({
      default: mod.ProratedSalaryCalculator,
    })),
  ),
  ProratedRentCalculator: lazyTool(() =>
    import('@/tools/calculators/prorated-rent/ProratedRentCalculator').then((mod) => ({
      default: mod.ProratedRentCalculator,
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
  RealEstateCommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/real-estate-commission/RealEstateCommissionCalculator'
    ).then((mod) => ({
      default: mod.RealEstateCommissionCalculator,
    })),
  ),
  RealRateOfReturnCalculator: lazyTool(() =>
    import('@/tools/calculators/real-rate-of-return/RealRateOfReturnCalculator').then((mod) => ({
      default: mod.RealRateOfReturnCalculator,
    })),
  ),
  RealtorCommissionVatCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/realtor-commission-vat/RealtorCommissionVatCalculator'
    ).then((mod) => ({
      default: mod.RealtorCommissionVatCalculator,
    })),
  ),
  RentalCommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/rental-commission/RentalCommissionCalculator'
    ).then((mod) => ({
      default: mod.RentalCommissionCalculator,
    })),
  ),
  RentalPropertyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/rental-property/RentalPropertyCalculator'
    ).then((mod) => ({
      default: mod.RentalPropertyCalculator,
    })),
  ),
  RentSplitCalculator: lazyTool(() =>
    import('@/tools/calculators/rent-split/RentSplitCalculator').then((mod) => ({
      default: mod.RentSplitCalculator,
    })),
  ),
  RentVsBuyCalculator: lazyTool(() =>
    import('@/tools/calculators/rent-vs-buy/RentVsBuyCalculator').then((mod) => ({
      default: mod.RentVsBuyCalculator,
    })),
  ),
  BitcoinEtfCalculator: lazyTool(() =>
    import('@/tools/calculators/bitcoin-etf/BitcoinEtfCalculator').then((mod) => ({
      default: mod.BitcoinEtfCalculator,
    })),
  ),
  BiweeklyMortgageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/biweekly-mortgage/BiweeklyMortgageCalculator'
    ).then((mod) => ({
      default: mod.BiweeklyMortgageCalculator,
    })),
  ),
  BiWeeklyMortgagePaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bi-weekly-mortgage-payment/BiWeeklyMortgagePaymentCalculator'
    ).then((mod) => ({
      default: mod.BiWeeklyMortgagePaymentCalculator,
    })),
  ),
  BoatLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/boat-loan/BoatLoanCalculator').then((mod) => ({
      default: mod.BoatLoanCalculator,
    })),
  ),
  BondCalculator: lazyTool(() =>
    import('@/tools/calculators/bond/BondCalculator').then((mod) => ({
      default: mod.BondCalculator,
    })),
  ),
  BondConvexityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bond-convexity/BondConvexityCalculator'
    ).then((mod) => ({
      default: mod.BondConvexityCalculator,
    })),
  ),
  BondCurrentYieldCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bond-current-yield/BondCurrentYieldCalculator'
    ).then((mod) => ({
      default: mod.BondCurrentYieldCalculator,
    })),
  ),
  BondEquivalentYieldCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bond-equivalent-yield/BondEquivalentYieldCalculator'
    ).then((mod) => ({
      default: mod.BondEquivalentYieldCalculator,
    })),
  ),
  BondPriceCalculator: lazyTool(() =>
    import('@/tools/calculators/bond-price/BondPriceCalculator').then((mod) => ({
      default: mod.BondPriceCalculator,
    })),
  ),
  BondYieldCalculator: lazyTool(() =>
    import('@/tools/calculators/bond-yield/BondYieldCalculator').then((mod) => ({
      default: mod.BondYieldCalculator,
    })),
  ),
  BondYtmCalculator: lazyTool(() =>
    import('@/tools/calculators/bond-ytm/BondYtmCalculator').then((mod) => ({
      default: mod.BondYtmCalculator,
    })),
  ),
  JumboLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/jumbo-loan/JumboLoanCalculator').then((mod) => ({
      default: mod.JumboLoanCalculator,
    })),
  ),
  LandLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/land-loan/LandLoanCalculator').then((mod) => ({
      default: mod.LandLoanCalculator,
    })),
  ),
  PagIbigHousingLoanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pag-ibig-housing-loan/PagIbigHousingLoanCalculator'
    ).then((mod) => ({
      default: mod.PagIbigHousingLoanCalculator,
    })),
  ),
  RvLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/rv-loan/RvLoanCalculator').then((mod) => ({
      default: mod.RvLoanCalculator,
    })),
  ),
  StudentLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/student-loan/StudentLoanCalculator').then(
      (mod) => ({
        default: mod.StudentLoanCalculator,
      })
    ),
  ),
  StudentLoanForgivenessCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/student-loan-forgiveness/StudentLoanForgivenessCalculator'
    ).then((mod) => ({
      default: mod.StudentLoanForgivenessCalculator,
    })),
  ),
  StudentLoanPaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/student-loan-payment/StudentLoanPaymentCalculator'
    ).then((mod) => ({
      default: mod.StudentLoanPaymentCalculator,
    })),
  ),
  SimpleMortgageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/simple-mortgage/SimpleMortgageCalculator'
    ).then((mod) => ({
      default: mod.SimpleMortgageCalculator,
    })),
  ),
  LtvCalculator: lazyTool(() =>
    import('@/tools/calculators/ltv/LtvCalculator').then((mod) => ({
      default: mod.LtvCalculator,
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
  CouponPaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/coupon-payment/CouponPaymentCalculator'
    ).then((mod) => ({
      default: mod.CouponPaymentCalculator,
    })),
  ),
  CreditCardCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-card/CreditCardCalculator'
    ).then((mod) => ({
      default: mod.CreditCardCalculator,
    })),
  ),
  CreditCardInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-card-interest/CreditCardInterestCalculator'
    ).then((mod) => ({
      default: mod.CreditCardInterestCalculator,
    })),
  ),
  CreditCardMinimumPaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-card-minimum-payment/CreditCardMinimumPaymentCalculator'
    ).then((mod) => ({
      default: mod.CreditCardMinimumPaymentCalculator,
    })),
  ),
  CreditCardPaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-card-payment/CreditCardPaymentCalculator'
    ).then((mod) => ({
      default: mod.CreditCardPaymentCalculator,
    })),
  ),
  CreditCardPayoffCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-card-payoff/CreditCardPayoffCalculator'
    ).then((mod) => ({
      default: mod.CreditCardPayoffCalculator,
    })),
  ),
  CreditCardsPayoffCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-cards-payoff/CreditCardsPayoffCalculator'
    ).then((mod) => ({
      default: mod.CreditCardsPayoffCalculator,
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
  DiscountCalculator: lazyTool(() =>
    import('@/tools/calculators/discount/DiscountCalculator').then((mod) => ({
      default: mod.DiscountCalculator,
    })),
  ),
  DoubleDiscountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/double-discount/DoubleDiscountCalculator'
    ).then((mod) => ({
      default: mod.DoubleDiscountCalculator,
    })),
  ),
  TripleDiscountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/triple-discount/TripleDiscountCalculator'
    ).then((mod) => ({
      default: mod.TripleDiscountCalculator,
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
  EndingInventoryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ending-inventory/EndingInventoryCalculator'
    ).then((mod) => ({
      default: mod.EndingInventoryCalculator,
    })),
  ),
  EoqCalculator: lazyTool(() =>
    import('@/tools/calculators/eoq/EoqCalculator').then((mod) => ({
      default: mod.EoqCalculator,
    })),
  ),
  ExpectedUtilityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/expected-utility/ExpectedUtilityCalculator'
    ).then((mod) => ({
      default: mod.ExpectedUtilityCalculator,
    })),
  ),
  FreeCashFlowCalculator: lazyTool(() =>
    import('@/tools/calculators/free-cash-flow/FreeCashFlowCalculator').then(
      (mod) => ({
        default: mod.FreeCashFlowCalculator,
      })
    ),
  ),
  FcfeCalculator: lazyTool(() =>
    import('@/tools/calculators/fcfe/FcfeCalculator').then((mod) => ({
      default: mod.FcfeCalculator,
    })),
  ),
  FcffCalculator: lazyTool(() =>
    import('@/tools/calculators/fcff/FcffCalculator').then((mod) => ({
      default: mod.FcffCalculator,
    })),
  ),
  FfoCalculator: lazyTool(() =>
    import('@/tools/calculators/ffo/FfoCalculator').then((mod) => ({
      default: mod.FfoCalculator,
    })),
  ),
  LeveredFreeCashFlowCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/levered-free-cash-flow/LeveredFreeCashFlowCalculator'
    ).then((mod) => ({
      default: mod.LeveredFreeCashFlowCalculator,
    })),
  ),
  UnpaidWorkCalculator: lazyTool(() =>
    import('@/tools/calculators/unpaid-work/UnpaidWorkCalculator').then(
      (mod) => ({
        default: mod.UnpaidWorkCalculator,
      }),
    ),
  ),
  UsIncomePercentileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/us-income-percentile/UsIncomePercentileCalculator'
    ).then((mod) => ({
      default: mod.UsIncomePercentileCalculator,
    })),
  ),
  UnleveredFreeCashFlowCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/unlevered-free-cash-flow/UnleveredFreeCashFlowCalculator'
    ).then((mod) => ({
      default: mod.UnleveredFreeCashFlowCalculator,
    })),
  ),
  TrumpAccountsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/trump-accounts/TrumpAccountsCalculator'
    ).then((mod) => ({
      default: mod.TrumpAccountsCalculator,
    })),
  ),
  TrumpsTaxesVsYourTaxesCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/trumps-taxes-vs-your-taxes/TrumpsTaxesVsYourTaxesCalculator'
    ).then((mod) => ({
      default: mod.TrumpsTaxesVsYourTaxesCalculator,
    })),
  ),
  VaDisabilityCalculator: lazyTool(() =>
    import('@/tools/calculators/va-disability/VaDisabilityCalculator').then(
      (mod) => ({
        default: mod.VaDisabilityCalculator,
      }),
    ),
  ),
  ZakatCalculator: lazyTool(() =>
    import('@/tools/calculators/zakat/ZakatCalculator').then((mod) => ({
      default: mod.ZakatCalculator,
    })),
  ),
  VatCalculator: lazyTool(() =>
    import('@/tools/calculators/vat/VatCalculator').then((mod) => ({
      default: mod.VatCalculator,
    })),
  ),
  WeeklyPayCalculator: lazyTool(() =>
    import('@/tools/calculators/weekly-pay/WeeklyPayCalculator').then((mod) => ({
      default: mod.WeeklyPayCalculator,
    })),
  ),
  WhatToOfferOnAHouseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/what-to-offer-on-a-house/WhatToOfferOnAHouseCalculator'
    ).then((mod) => ({
      default: mod.WhatToOfferOnAHouseCalculator,
    })),
  ),
  CombinedRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/combined-ratio/CombinedRatioCalculator').then((mod) => ({
      default: mod.CombinedRatioCalculator,
    })),
  ),
  CustomerEffortScoreCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/customer-effort-score/CustomerEffortScoreCalculator'
    ).then((mod) => ({
      default: mod.CustomerEffortScoreCalculator,
    })),
  ),
  DartRateCalculator: lazyTool(() =>
    import('@/tools/calculators/dart-rate/DartRateCalculator').then((mod) => ({
      default: mod.DartRateCalculator,
    })),
  ),
  HrSoftwareRoiCalculator: lazyTool(() =>
    import('@/tools/calculators/hr-software-roi/HrSoftwareRoiCalculator').then(
      (mod) => ({
        default: mod.HrSoftwareRoiCalculator,
      }),
    ),
  ),
  LossRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/loss-ratio/LossRatioCalculator').then((mod) => ({
      default: mod.LossRatioCalculator,
    })),
  ),
  NpsCalculator: lazyTool(() =>
    import('@/tools/calculators/nps/NpsCalculator').then((mod) => ({
      default: mod.NpsCalculator,
    })),
  ),
  RemoteVsOnLocationWorkersCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/remote-vs-on-location-workers/RemoteVsOnLocationCalculator'
    ).then((mod) => ({
      default: mod.RemoteVsOnLocationWorkersCalculator,
    })),
  ),
  TrirCalculator: lazyTool(() =>
    import('@/tools/calculators/trir/TrirCalculator').then((mod) => ({
      default: mod.TrirCalculator,
    })),
  ),
  AverageReturnCalculator: lazyTool(() =>
    import('@/tools/calculators/average-return/AverageReturnCalculator').then(
      (mod) => ({
        default: mod.AverageReturnCalculator,
      }),
    ),
  ),
  AverageVariableCostCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/average-variable-cost/AverageVariableCostCalculator'
    ).then((mod) => ({
      default: mod.AverageVariableCostCalculator,
    })),
  ),
  MaximumDrawdownCalculator: lazyTool(() =>
    import('@/tools/calculators/maximum-drawdown/MaximumDrawdownCalculator').then(
      (mod) => ({
        default: mod.MaximumDrawdownCalculator,
      }),
    ),
  ),
  FiftyThirtyTwentyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fifty-thirty-twenty-rule/FiftyThirtyTwentyCalculator'
    ).then((mod) => ({
      default: mod.FiftyThirtyTwentyCalculator,
    })),
  ),
  ApcCalculator: lazyTool(() =>
    import('@/tools/calculators/apc/ApcCalculator').then((mod) => ({
      default: mod.ApcCalculator,
    })),
  ),
  AccrualRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/accrual-ratio/AccrualRatioCalculator').then(
      (mod) => ({
        default: mod.AccrualRatioCalculator,
      })
    ),
  ),
  ActualCashValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/actual-cash-value/ActualCashValueCalculator'
    ).then((mod) => ({
      default: mod.ActualCashValueCalculator,
    })),
  ),
  BankReconciliationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bank-reconciliation/BankReconciliationCalculator'
    ).then((mod) => ({
      default: mod.BankReconciliationCalculator,
    })),
  ),
  CapRateCalculator: lazyTool(() =>
    import('@/tools/calculators/cap-rate/CapRateCalculator').then((mod) => ({
      default: mod.CapRateCalculator,
    })),
  ),
  CashConversionCycleCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cash-conversion-cycle/CashConversionCycleCalculator'
    ).then((mod) => ({
      default: mod.CashConversionCycleCalculator,
    })),
  ),
  ConsumerSurplusCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/consumer-surplus/ConsumerSurplusCalculator'
    ).then((mod) => ({
      default: mod.ConsumerSurplusCalculator,
    })),
  ),
  CrossPriceElasticityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cross-price-elasticity/CrossPriceElasticityCalculator'
    ).then((mod) => ({
      default: mod.CrossPriceElasticityCalculator,
    })),
  ),
  CurrentRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/current-ratio/CurrentRatioCalculator'
    ).then((mod) => ({
      default: mod.CurrentRatioCalculator,
    })),
  ),
  DegreeOfOperatingLeverageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/degree-of-operating-leverage/DegreeOfOperatingLeverageCalculator'
    ).then((mod) => ({
      default: mod.DegreeOfOperatingLeverageCalculator,
    })),
  ),
  DioCalculator: lazyTool(() =>
    import('@/tools/calculators/dio/DioCalculator').then((mod) => ({
      default: mod.DioCalculator,
    })),
  ),
  DpoCalculator: lazyTool(() =>
    import('@/tools/calculators/dpo/DpoCalculator').then((mod) => ({
      default: mod.DpoCalculator,
    })),
  ),
  DsoCalculator: lazyTool(() =>
    import('@/tools/calculators/dso/DsoCalculator').then((mod) => ({
      default: mod.DsoCalculator,
    })),
  ),
  CashOnCashReturnCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cash-on-cash-return/CashOnCashReturnCalculator'
    ).then((mod) => ({
      default: mod.CashOnCashReturnCalculator,
    })),
  ),
  CarAffordabilityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/car-affordability/CarAffordabilityCalculator'
    ).then((mod) => ({
      default: mod.CarAffordabilityCalculator,
    })),
  ),
  CellPhonePlanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cell-phone-plan/CellPhonePlanCalculator'
    ).then((mod) => ({
      default: mod.CellPhonePlanCalculator,
    })),
  ),
  CollegeCostCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/college-cost/CollegeCostCalculator'
    ).then((mod) => ({
      default: mod.CollegeCostCalculator,
    })),
  ),
  DreamComeTrueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/dream-come-true/DreamComeTrueCalculator'
    ).then((mod) => ({
      default: mod.DreamComeTrueCalculator,
    })),
  ),
  EarnestMoneyCalculator: lazyTool(() =>
    import('@/tools/calculators/earnest-money/EarnestMoneyCalculator').then(
      (mod) => ({
        default: mod.EarnestMoneyCalculator,
      })
    )
  ),
  EmergencyFundCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/emergency-fund/EmergencyFundCalculator'
    ).then((mod) => ({
      default: mod.EmergencyFundCalculator,
    })),
  ),
  FinanceCalculator: lazyTool(() =>
    import('@/tools/calculators/finance/FinanceCalculator').then((mod) => ({
      default: mod.FinanceCalculator,
    })),
  ),
  FinancialLeverageRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/financial-leverage-ratio/FinancialLeverageRatioCalculator'
    ).then((mod) => ({
      default: mod.FinancialLeverageRatioCalculator,
    })),
  ),
  FireCalculator: lazyTool(() =>
    import('@/tools/calculators/fire/FireCalculator').then((mod) => ({
      default: mod.FireCalculator,
    })),
  ),
  FixedAssetTurnoverRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fixed-asset-turnover-ratio/FixedAssetTurnoverRatioCalculator'
    ).then((mod) => ({
      default: mod.FixedAssetTurnoverRatioCalculator,
    })),
  ),
  GiftOfEquityCalculator: lazyTool(() =>
    import('@/tools/calculators/gift-of-equity/GiftOfEquityCalculator').then(
      (mod) => ({
        default: mod.GiftOfEquityCalculator,
      })
    )
  ),
  GoldMeltCalculator: lazyTool(() =>
    import('@/tools/calculators/gold-melt/GoldMeltCalculator').then((mod) => ({
      default: mod.GoldMeltCalculator,
    })),
  ),
  GoodwillCalculator: lazyTool(() =>
    import('@/tools/calculators/goodwill/GoodwillCalculator').then((mod) => ({
      default: mod.GoodwillCalculator,
    })),
  ),
  IncomeElasticityOfDemandCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/income-elasticity-of-demand/IncomeElasticityOfDemandCalculator'
    ).then((mod) => ({
      default: mod.IncomeElasticityOfDemandCalculator,
    })),
  ),
  InventoryTurnoverCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/inventory-turnover/InventoryTurnoverCalculator'
    ).then((mod) => ({
      default: mod.InventoryTurnoverCalculator,
    })),
  ),
  LifetimeEarningsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lifetime-earnings/LifetimeEarningsCalculator'
    ).then((mod) => ({
      default: mod.LifetimeEarningsCalculator,
    })),
  ),
  LifoInventoryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lifo-inventory/LifoInventoryCalculator'
    ).then((mod) => ({
      default: mod.LifoInventoryCalculator,
    })),
  ),
  LongTermCareCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/long-term-care/LongTermCareCalculator'
    ).then((mod) => ({
      default: mod.LongTermCareCalculator,
    })),
  ),
  MegaMillionsPayoutCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mega-millions-payout/MegaMillionsPayoutCalculator'
    ).then((mod) => ({
      default: mod.MegaMillionsPayoutCalculator,
    })),
  ),
  MillionaireCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/millionaire/MillionaireCalculator'
    ).then((mod) => ({
      default: mod.MillionaireCalculator,
    })),
  ),
  NetIncomeCalculator: lazyTool(() =>
    import('@/tools/calculators/net-income/NetIncomeCalculator').then((mod) => ({
      default: mod.NetIncomeCalculator,
    })),
  ),
  NetOperatingAssetsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-operating-assets/NetOperatingAssetsCalculator'
    ).then((mod) => ({
      default: mod.NetOperatingAssetsCalculator,
    })),
  ),
  NetOperatingIncomeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-operating-income/NoiCalculator'
    ).then((mod) => ({
      default: mod.NetOperatingIncomeCalculator,
    })),
  ),
  NetOperatingWorkingCapitalCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-operating-working-capital/NetOperatingWorkingCapitalCalculator'
    ).then((mod) => ({
      default: mod.NetOperatingWorkingCapitalCalculator,
    })),
  ),
  NetWorthCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-worth/NetWorthCalculator'
    ).then((mod) => ({
      default: mod.NetWorthCalculator,
    })),
  ),
  PmiCalculator: lazyTool(() =>
    import('@/tools/calculators/pmi/PmiCalculator').then((mod) => ({
      default: mod.PmiCalculator,
    })),
  ),
  PowerballCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/powerball/PowerballCalculator'
    ).then((mod) => ({
      default: mod.PowerballCalculator,
    })),
  ),
  PricePerSquareFootCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-per-square-foot/PricePerSqftCalculator'
    ).then((mod) => ({
      default: mod.PricePerSquareFootCalculator,
    })),
  ),
  PricePerSquareMeterCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-per-square-meter/PricePerSqmCalculator'
    ).then((mod) => ({
      default: mod.PricePerSquareMeterCalculator,
    })),
  ),
  ProductivityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/productivity/ProductivityCalculator'
    ).then((mod) => ({
      default: mod.ProductivityCalculator,
    })),
  ),
  QuizUsIncomePercentileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/quiz-us-income-percentile/QuizUsIncomePercentileCalculator'
    ).then((mod) => ({
      default: mod.QuizUsIncomePercentileCalculator,
    })),
  ),
  ReceivablesTurnoverRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/receivables-turnover-ratio/ReceivablesTurnoverRatioCalculator'
    ).then((mod) => ({
      default: mod.ReceivablesTurnoverRatioCalculator,
    })),
  ),
  RetainedEarningsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/retained-earnings/RetainedEarningsCalculator'
    ).then((mod) => ({
      default: mod.RetainedEarningsCalculator,
    })),
  ),
  Rule2836Calculator: lazyTool(() =>
    import(
      '@/tools/calculators/rule-2836/Rule2836Calculator'
    ).then((mod) => ({
      default: mod.Rule2836Calculator,
    })),
  ),
  SabbaticalCalculator: lazyTool(() =>
    import('@/tools/calculators/sabbatical/SabbaticalCalculator').then((mod) => ({
      default: mod.SabbaticalCalculator,
    })),
  ),
  ScrapGoldCalculator: lazyTool(() =>
    import('@/tools/calculators/scrap-gold/ScrapGoldCalculator').then((mod) => ({
      default: mod.ScrapGoldCalculator,
    })),
  ),
  ScrapSilverCalculator: lazyTool(() =>
    import('@/tools/calculators/scrap-silver/ScrapSilverCalculator').then(
      (mod) => ({
        default: mod.ScrapSilverCalculator,
      }),
    ),
  ),
  SilverMeltCalculator: lazyTool(() =>
    import('@/tools/calculators/silver-melt/SilverMeltCalculator').then(
      (mod) => ({
        default: mod.SilverMeltCalculator,
      }),
    ),
  ),
  SubscriptionWasteCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/subscription-waste/SubscriptionWasteCalculator'
    ).then((mod) => ({
      default: mod.SubscriptionWasteCalculator,
    })),
  ),
  TotalAssetTurnoverCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/total-asset-turnover/TotalAssetTurnoverCalculator'
    ).then((mod) => ({
      default: mod.TotalAssetTurnoverCalculator,
    })),
  ),
  WorkingCapitalCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/working-capital/WorkingCapitalCalculator'
    ).then((mod) => ({
      default: mod.WorkingCapitalCalculator,
    })),
  ),
  WorkingCapitalTurnoverRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/working-capital-turnover-ratio/WorkingCapitalTurnoverRatioCalculator'
    ).then((mod) => ({
      default: mod.WorkingCapitalTurnoverRatioCalculator,
    })),
  ),
  OperatingCashFlowCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/operating-cash-flow/OperatingCashFlowCalculator'
    ).then((mod) => ({
      default: mod.OperatingCashFlowCalculator,
    })),
  ),
  FdCalculator: lazyTool(() =>
    import('@/tools/calculators/fd/FdCalculator').then((mod) => ({
      default: mod.FdCalculator,
    })),
  ),
  FhaLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/fha-loan/FhaLoanCalculator').then((mod) => ({
      default: mod.FhaLoanCalculator,
    })),
  ),
  HelocCalculator: lazyTool(() =>
    import('@/tools/calculators/heloc/HelocCalculator').then((mod) => ({
      default: mod.HelocCalculator,
    })),
  ),
  HomeAffordabilityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/home-affordability/HomeAffordabilityCalculator'
    ).then((mod) => ({
      default: mod.HomeAffordabilityCalculator,
    })),
  ),
  HomeEquityLoanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/home-equity-loan/HomeEquityLoanCalculator'
    ).then((mod) => ({
      default: mod.HomeEquityLoanCalculator,
    })),
  ),
  HomeImprovementLoanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/home-improvement-loan/HomeImprovementLoanCalculator'
    ).then((mod) => ({
      default: mod.HomeImprovementLoanCalculator,
    })),
  ),
  HomeLoanEmiCalculator: lazyTool(() =>
    import('@/tools/calculators/home-loan-emi/HomeLoanEmiCalculator').then((mod) => ({
      default: mod.HomeLoanEmiCalculator,
    })),
  ),
  HomeLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/home-loan/HomeLoanCalculator').then((mod) => ({
      default: mod.HomeLoanCalculator,
    })),
  ),
  HomeValueUsCalculator: lazyTool(() =>
    import('@/tools/calculators/home-value-us/HomeValueUsCalculator').then(
      (mod) => ({
        default: mod.HomeValueUsCalculator,
      })
    )
  ),
  HouseAffordabilityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/house-affordability/HouseAffordabilityCalculator'
    ).then((mod) => ({
      default: mod.HouseAffordabilityCalculator,
    })),
  ),
  MortgageTaxesInsuranceCalculator: lazyTool(() =>
    import('@/tools/calculators/mortgage-taxes-insurance/MortgageTaxesInsuranceCalculator').then((mod) => ({
      default: mod.MortgageTaxesInsuranceCalculator,
    })),
  ),
  MortgageComparisonCalculator: lazyTool(() =>
    import('@/tools/calculators/mortgage-comparison/MortgageComparisonCalculator').then((mod) => ({
      default: mod.MortgageComparisonCalculator,
    })),
  ),
  HomeMortgageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/home-mortgage/HomeMortgageCalculator'
    ).then((mod) => ({
      default: mod.HomeMortgageCalculator,
    })),
  ),
  MortgageAmortizationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-amortization/MortgageAmortizationCalculator'
    ).then((mod) => ({
      default: mod.MortgageAmortizationCalculator,
    })),
  ),
  MortgageAccelerationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-acceleration/MortgageAccelerationCalculator'
    ).then((mod) => ({
      default: mod.MortgageAccelerationCalculator,
    })),
  ),
  MortgagePrepaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-prepayment/MortgagePrepaymentCalculator'
    ).then((mod) => ({
      default: mod.MortgagePrepaymentCalculator,
    })),
  ),
  MortgageWithExtraPaymentsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-with-extra-payments/MortgageWithExtraPaymentsCalculator'
    ).then((mod) => ({
      default: mod.MortgageWithExtraPaymentsCalculator,
    })),
  ),
  MortgagePointsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-points/MortgagePointsCalculator'
    ).then((mod) => ({
      default: mod.MortgagePointsCalculator,
    })),
  ),
  FutureValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/future-value/FutureValueCalculator'
    ).then((mod) => ({
      default: mod.FutureValueCalculator,
    })),
  ),
  FutureSalaryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/future-salary/FutureSalaryCalculator'
    ).then((mod) => ({
      default: mod.FutureSalaryCalculator,
    })),
  ),
  HoldingPeriodReturnCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/holding-period-return/HoldingPeriodReturnCalculator'
    ).then((mod) => ({
      default: mod.HoldingPeriodReturnCalculator,
    })),
  ),
  HourlyToAnnualSalaryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hourly-to-annual-salary/HourlyToAnnualSalaryCalculator'
    ).then((mod) => ({
      default: mod.HourlyToAnnualSalaryCalculator,
    })),
  ),
  HourlyToSalaryWageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hourly-to-salary-wage/HourlyToSalaryWageCalculator'
    ).then((mod) => ({
      default: mod.HourlyToSalaryWageCalculator,
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
  InterestCalculator: lazyTool(() =>
    import('@/tools/calculators/interest/InterestCalculator').then((mod) => ({
      default: mod.InterestCalculator,
    })),
  ),
  InterestCoverageRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/interest-coverage-ratio/InterestCoverageRatioCalculator'
    ).then((mod) => ({
      default: mod.InterestCoverageRatioCalculator,
    })),
  ),
  InterestOnlyMortgageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/interest-only-mortgage/InterestOnlyMortgageCalculator'
    ).then((mod) => ({
      default: mod.InterestOnlyMortgageCalculator,
    })),
  ),
  InterestPerDayCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/interest-per-day/InterestPerDayCalculator'
    ).then((mod) => ({
      default: mod.InterestPerDayCalculator,
    })),
  ),
  MortgageInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-interest/MortgageInterestCalculator'
    ).then((mod) => ({
      default: mod.MortgageInterestCalculator,
    })),
  ),
  MortgageRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-rate/MortgageRateCalculator'
    ).then((mod) => ({
      default: mod.MortgageRateCalculator,
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
  SalaryCalculator: lazyTool(() =>
    import('@/tools/calculators/salary/SalaryCalculator').then((mod) => ({
      default: mod.SalaryCalculator,
    })),
  ),
  SalaryInflationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/salary-inflation/SalaryInflationCalculator'
    ).then((mod) => ({
      default: mod.SalaryInflationCalculator,
    })),
  ),
  SalaryToHourlyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/salary-to-hourly/SalaryToHourlyCalculator'
    ).then((mod) => ({
      default: mod.SalaryToHourlyCalculator,
    })),
  ),
  SavingsCalculator: lazyTool(() =>
    import('@/tools/calculators/savings/SavingsCalculator').then((mod) => ({
      default: mod.SavingsCalculator,
    })),
  ),
  SavingsGoalCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/savings-goal/SavingsGoalCalculator'
    ).then((mod) => ({
      default: mod.SavingsGoalCalculator,
    })),
  ),
  SavingsInterestRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/savings-interest-rate/SavingsInterestRateCalculator'
    ).then((mod) => ({
      default: mod.SavingsInterestRateCalculator,
    })),
  ),
  SavingsPlanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/savings-plan/SavingsPlanCalculator'
    ).then((mod) => ({
      default: mod.SavingsPlanCalculator,
    })),
  ),
  SavingsWithdrawalCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/savings-withdrawal/SavingsWithdrawalCalculator'
    ).then((mod) => ({
      default: mod.SavingsWithdrawalCalculator,
    })),
  ),
  SimpleSavingsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/simple-savings/SimpleSavingsCalculator'
    ).then((mod) => ({
      default: mod.SimpleSavingsCalculator,
    })),
  ),
  SharpeRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/sharpe-ratio/SharpeRatioCalculator').then((mod) => ({
      default: mod.SharpeRatioCalculator,
    })),
  ),
  VaMortgageCalculator: lazyTool(() =>
    import('@/tools/calculators/va-mortgage/VaMortgageCalculator').then((mod) => ({
      default: mod.VaMortgageCalculator,
    })),
  ),
  ValueAtRiskCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/value-at-risk/ValueAtRiskCalculator'
    ).then((mod) => ({
      default: mod.ValueAtRiskCalculator,
    })),
  ),
  EidlCalculator: lazyTool(() =>
    import('@/tools/calculators/eidl/EidlCalculator').then((mod) => ({
      default: mod.EidlCalculator,
    })),
  ),
  HealsActStimulusCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/heals-act-stimulus/HealsActStimulusCalculator'
    ).then((mod) => ({
      default: mod.HealsActStimulusCalculator,
    })),
  ),
  HeroesActStimulusCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/heroes-act-stimulus/HeroesActStimulusCalculator'
    ).then((mod) => ({
      default: mod.HeroesActStimulusCalculator,
    })),
  ),
  CaliforniaStimulusCheckIiCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/california-stimulus-check-ii/CaliforniaStimulusCheckIiCalculator'
    ).then((mod) => ({
      default: mod.CaliforniaStimulusCheckIiCalculator,
    })),
  ),

  StudentLoanRepaymentCovidCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/student-loan-repayment-covid/StudentLoanRepaymentCovidCalculator'
    ).then((mod) => ({
      default: mod.StudentLoanRepaymentCovidCalculator,
    })),
  ),
  StimulusCheck40kCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/stimulus-check-40k/StimulusCheck40kCalculator'
    ).then((mod) => ({
      default: mod.StimulusCheck40kCalculator,
    })),
  ),
  CashActStimulusCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cash-act-stimulus/CashActStimulusCalculator'
    ).then((mod) => ({
      default: mod.CashActStimulusCalculator,
    })),
  ),
  SecondStimulus900BillionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/second-stimulus-900-billion/SecondStimulus900BillionCalculator'
    ).then((mod) => ({
      default: mod.SecondStimulus900BillionCalculator,
    })),
  ),
  AmericanRescuePlanStimulusCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/american-rescue-plan-stimulus/AmericanRescuePlanStimulusCalculator'
    ).then((mod) => ({
      default: mod.AmericanRescuePlanStimulusCalculator,
    })),
  ),
};

export function getToolComponent(key: string): LazyExoticComponent<ToolComponent> | null {
  if (!isRegisteredComponentKey(key)) return null;
  return calculators[key];
}
