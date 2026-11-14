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
};

export function getToolComponent(key: string): LazyExoticComponent<ToolComponent> | null {
  if (!isRegisteredComponentKey(key)) return null;
  return calculators[key];
}
