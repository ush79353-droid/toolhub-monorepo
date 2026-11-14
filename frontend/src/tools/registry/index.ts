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
};

export function getToolComponent(key: string): LazyExoticComponent<ToolComponent> | null {
  if (!isRegisteredComponentKey(key)) return null;
  return calculators[key];
}
