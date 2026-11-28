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
  AnorexicBmiCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/anorexic-bmi/AnorexicBmiCalculator'
    ).then((mod) => ({
      default: mod.AnorexicBmiCalculator,
    })),
  ),
  AorticValveAreaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/aortic-valve-area/AorticValveAreaCalculator'
    ).then((mod) => ({
      default: mod.AorticValveAreaCalculator,
    })),
  ),
  ArmyBodyFatCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/army-body-fat/ArmyBodyFatCalculator'
    ).then((mod) => ({
      default: mod.ArmyBodyFatCalculator,
    })),
  ),
  ArterialAgeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/arterial-age/ArterialAgeCalculator'
    ).then((mod) => ({
      default: mod.ArterialAgeCalculator,
    })),
  ),
  AuditCCalculator: lazyTool(() =>
    import('@/tools/calculators/audit-c/AuditCCalculator').then((mod) => ({
      default: mod.AuditCCalculator,
    })),
  ),
  AuditScoreCalculator: lazyTool(() =>
    import('@/tools/calculators/audit-score/AuditScoreCalculator').then((mod) => ({
      default: mod.AuditScoreCalculator,
    })),
  ),
  AutoLeaseCalculator: lazyTool(() =>
    import('@/tools/calculators/auto-lease/AutoLeaseCalculator').then((mod) => ({
      default: mod.AutoLeaseCalculator,
    })),
  ),
  AutoLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/auto-loan/AutoLoanCalculator').then((mod) => ({
      default: mod.AutoLoanCalculator,
    })),
  ),
  CageCalculator: lazyTool(() =>
    import('@/tools/calculators/cage/CageCalculator').then((mod) => ({
      default: mod.CageCalculator,
    })),
  ),
  CaliforniaOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/california-overtime/CaliforniaOvertimeCalculator'
    ).then((mod) => ({
      default: mod.CaliforniaOvertimeCalculator,
    })),
  ),
  CalorieDeficitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/calorie-deficit/CalorieDeficitCalculator'
    ).then((mod) => ({
      default: mod.CalorieDeficitCalculator,
    })),
  ),
  CarbCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/carb-calculator/CarbCalculator'
    ).then((mod) => ({
      default: mod.CarbCalculator,
    })),
  ),
  CarbohydrateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/carbohydrate-calculator/CarbohydrateCalculator'
    ).then((mod) => ({
      default: mod.CarbohydrateCalculator,
    })),
  ),
  CarboplatinCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/carboplatin/CarboplatinCalculator'
    ).then((mod) => ({
      default: mod.CarboplatinCalculator,
    })),
  ),
  CefdinirDoseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cefdinir-dose/CefdinirDoseCalculator'
    ).then((mod) => ({
      default: mod.CefdinirDoseCalculator,
    })),
  ),
  ChancesOfHavingTwinsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/chances-of-having-twins/ChancesOfHavingTwinsCalculator'
    ).then((mod) => ({
      default: mod.ChancesOfHavingTwinsCalculator,
    })),
  ),
  CorrectedCalciumCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/corrected-calcium/CorrectedCalciumCalculator'
    ).then((mod) => ({
      default: mod.CorrectedCalciumCalculator,
    })),
  ),
  CorrectedMagnesiumCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/corrected-magnesium/CorrectedMagnesiumCalculator'
    ).then((mod) => ({
      default: mod.CorrectedMagnesiumCalculator,
    })),
  ),
  CorrectedReticulocyteCountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/corrected-reticulocyte-count/CorrectedReticulocyteCountCalculator'
    ).then((mod) => ({
      default: mod.CorrectedReticulocyteCountCalculator,
    })),
  ),



  CreatinineClearanceCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/creatinine-clearance/CreatinineClearanceCalculator'
    ).then((mod) => ({
      default: mod.CreatinineClearanceCalculator,
    })),
  ),
  DaptCalculator: lazyTool(() =>
    import('@/tools/calculators/dapt/DaptCalculator').then((mod) => ({
      default: mod.DaptCalculator,
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
  DefensiveIntervalRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/defensive-interval-ratio/DefensiveIntervalRatioCalculator'
    ).then((mod) => ({
      default: mod.DefensiveIntervalRatioCalculator,
    })),
  ),
  DeferredAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/deferred-annuity/DeferredAnnuityCalculator'
    ).then((mod) => ({
      default: mod.DeferredAnnuityCalculator,
    })),
  ),
  DepreciationCalculator: lazyTool(() =>
    import('@/tools/calculators/depreciation/DepreciationCalculator').then(
      (mod) => ({
        default: mod.DepreciationCalculator,
      }),
    ),
  ),
  DicSyndromeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/dic-syndrome/DicSyndromeCalculator'
    ).then((mod) => ({
      default: mod.DicSyndromeCalculator,
    })),
  ),
  DietRiskScoreCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/diet-risk-score/DietRiskScoreCalculator'
    ).then((mod) => ({
      default: mod.DietRiskScoreCalculator,
    })),
  ),
  DiffuseLargeBCellLymphomaPrognosisCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/diffuse-large-b-cell-lymphoma-prognosis/DiffuseLargeBCellLymphomaPrognosisCalculator'
    ).then((mod) => ({
      default: mod.DiffuseLargeBCellLymphomaPrognosisCalculator,
    })),
  ),
  DrawLengthCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/draw-length/DrawLengthCalculator'
    ).then((mod) => ({
      default: mod.DrawLengthCalculator,
    })),
  ),
  DripRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/drip-rate/DripRateCalculator'
    ).then((mod) => ({
      default: mod.DripRateCalculator,
    })),
  ),
  DropsPerMinuteCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/drops-per-minute/DropsPerMinuteCalculator'
    ).then((mod) => ({
      default: mod.DropsPerMinuteCalculator,
    })),
  ),
  DrugHalfLifeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/drug-half-life/DrugHalfLifeCalculator'
    ).then((mod) => ({
      default: mod.DrugHalfLifeCalculator,
    })),
  ),
  DriCalculator: lazyTool(() =>
    import('@/tools/calculators/dri/DriCalculator').then((mod) => ({
      default: mod.DriCalculator,
    })),
  ),
  EbitdaMarginCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ebitda-margin/EbitdaMarginCalculator'
    ).then((mod) => ({
      default: mod.EbitdaMarginCalculator,
    })),
  ),
  EerCalculator: lazyTool(() =>
    import('@/tools/calculators/eer/EerCalculator').then((mod) => ({
      default: mod.EerCalculator,
    })),
  ),
  FatIntakeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fat-intake/FatIntakeCalculator'
    ).then((mod) => ({
      default: mod.FatIntakeCalculator,
    })),
  ),
  FenaCalculator: lazyTool(() =>
    import('@/tools/calculators/fena/FenaCalculator').then((mod) => ({
      default: mod.FenaCalculator,
    })),
  ),
  FeureaCalculator: lazyTool(() =>
    import('@/tools/calculators/feurea/FeureaCalculator').then((mod) => ({
      default: mod.FeureaCalculator,
    })),
  ),
  FfmiCalculator: lazyTool(() =>
    import('@/tools/calculators/ffmi/FfmiCalculator').then((mod) => ({
      default: mod.FfmiCalculator,
    })),
  ),
  FiberCalculator: lazyTool(() =>
    import('@/tools/calculators/fiber/FiberCalculator').then((mod) => ({
      default: mod.FiberCalculator,
    })),
  ),
  FishOilCalculator: lazyTool(() =>
    import('@/tools/calculators/fish-oil/FishOilCalculator').then((mod) => ({
      default: mod.FishOilCalculator,
    })),
  ),
  FloridaOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/florida-overtime/FloridaOvertimeCalculator'
    ).then((mod) => ({
      default: mod.FloridaOvertimeCalculator,
    })),
  ),
  FreeWaterDeficitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/free-water-deficit/FreeWaterDeficitCalculator'
    ).then((mod) => ({
      default: mod.FreeWaterDeficitCalculator,
    })),
  ),
  FreshFrozenPlasmaDoseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fresh-frozen-plasma-dose/FreshFrozenPlasmaDoseCalculator'
    ).then((mod) => ({
      default: mod.FreshFrozenPlasmaDoseCalculator,
    })),
  ),
  FutureValueOfAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/future-value-of-annuity/FutureValueOfAnnuityCalculator'
    ).then((mod) => ({
      default: mod.FutureValueOfAnnuityCalculator,
    })),
  ),
  GastricSleeveWeightLossCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gastric-sleeve-weight-loss/GastricSleeveWeightLossCalculator'
    ).then((mod) => ({
      default: mod.GastricSleeveWeightLossCalculator,
    })),
  ),
  GeriatricBmiCalculator: lazyTool(() =>
    import('@/tools/calculators/geriatric-bmi/GeriatricBmiCalculator').then((mod) => ({
      default: mod.GeriatricBmiCalculator,
    })),
  ),
  GestationalAgeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gestational-age/GestationalAgeCalculator'
    ).then((mod) => ({
      default: mod.GestationalAgeCalculator,
    })),
  ),
  GfrEstimatedCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gfr-estimated/GfrEstimatedCalculator'
    ).then((mod) => ({
      default: mod.GfrEstimatedCalculator,
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
  GorlinFormulaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gorlin-formula/GorlinFormulaCalculator'
    ).then((mod) => ({
      default: mod.GorlinFormulaCalculator,
    })),
  ),
  GraceCalculator: lazyTool(() =>
    import('@/tools/calculators/grace/GraceCalculator').then((mod) => ({
      default: mod.GraceCalculator,
    })),
  ),
  GratuityCalculator: lazyTool(() =>
    import('@/tools/calculators/gratuity/GratuityCalculator').then((mod) => ({
      default: mod.GratuityCalculator,
    })),
  ),
  GrowingAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/growing-annuity/GrowingAnnuityCalculator'
    ).then((mod) => ({
      default: mod.GrowingAnnuityCalculator,
    })),
  ),
  GuptaRiskCalculator: lazyTool(() =>
    import('@/tools/calculators/gupta-risk/GuptaRiskCalculator').then((mod) => ({
      default: mod.GuptaRiskCalculator,
    })),
  ),
  HematocritHemoglobinRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hematocrit-hemoglobin-ratio/HematocritHemoglobinRatioCalculator'
    ).then((mod) => ({
      default: mod.HematocritHemoglobinRatioCalculator,
    })),
  ),
  HarrisBenedictCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/harris-benedict/HarrisBenedictCalculator'
    ).then((mod) => ({
      default: mod.HarrisBenedictCalculator,
    })),
  ),
  HealthyWeightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/healthy-weight/HealthyWeightCalculator'
    ).then((mod) => ({
      default: mod.HealthyWeightCalculator,
    })),
  ),
  HydroxychloroquineDoseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hydroxychloroquine-dose/HydroxychloroquineDoseCalculator'
    ).then((mod) => ({
      default: mod.HydroxychloroquineDoseCalculator,
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
  IifymCalculator: lazyTool(() =>
    import('@/tools/calculators/iifym/IifymCalculator').then((mod) => ({
      default: mod.IifymCalculator,
    })),
  ),
  InfantTylenolDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/infant-tylenol-dosage/InfantTylenolDosageCalculator'
    ).then((mod) => ({
      default: mod.InfantTylenolDosageCalculator,
    })),
  ),
  InrCalculator: lazyTool(() =>
    import('@/tools/calculators/inr/InrCalculator').then((mod) => ({
      default: mod.InrCalculator,
    })),
  ),
  InsulinDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/insulin-dosage/InsulinDosageCalculator'
    ).then((mod) => ({
      default: mod.InsulinDosageCalculator,
    })),
  ),
  InterestRateParityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/interest-rate-parity/InterestRateParityCalculator'
    ).then((mod) => ({
      default: mod.InterestRateParityCalculator,
    })),
  ),
  IronDeficiencyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/iron-deficiency/IronDeficiencyCalculator'
    ).then((mod) => ({
      default: mod.IronDeficiencyCalculator,
    })),
  ),
  IsotretinoinDoseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/isotretinoin-dose/IsotretinoinDoseCalculator'
    ).then((mod) => ({
      default: mod.IsotretinoinDoseCalculator,
    })),
  ),
  IvigDoseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ivig-dose/IvigDoseCalculator'
    ).then((mod) => ({
      default: mod.IvigDoseCalculator,
    })),
  ),
  KarvonenFormulaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/karvonen-formula/KarvonenFormulaCalculator'
    ).then((mod) => ({
      default: mod.KarvonenFormulaCalculator,
    })),
  ),
  KatchMcardleCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/katch-mcardle/KatchMcardleCalculator'
    ).then((mod) => ({
      default: mod.KatchMcardleCalculator,
    })),
  ),
  KtvDaugirdasCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ktv-daugirdas/KtvDaugirdasCalculator'
    ).then((mod) => ({
      default: mod.KtvDaugirdasCalculator,
    })),
  ),
  KidneyStonePcnlCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/kidney-stone-pcnl/KidneyStonePcnlCalculator'
    ).then((mod) => ({
      default: mod.KidneyStonePcnlCalculator,
    })),
  ),
  KetoCalculator: lazyTool(() =>
    import('@/tools/calculators/keto/KetoCalculator').then((mod) => ({
      default: mod.KetoCalculator,
    })),
  ),
  KidneyFailureRiskCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/kidney-failure-risk/KidneyFailureRiskCalculator'
    ).then((mod) => ({
      default: mod.KidneyFailureRiskCalculator,
    })),
  ),
  LidocaineDoseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lidocaine-dose/LidocaineDoseCalculator'
    ).then((mod) => ({
      default: mod.LidocaineDoseCalculator,
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
  LocalAnestheticCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/local-anesthetic/LocalAnestheticCalculator'
    ).then((mod) => ({
      default: mod.LocalAnestheticCalculator,
    })),
  ),
  LotteryAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lottery-annuity/LotteryAnnuityCalculator'
    ).then((mod) => ({
      default: mod.LotteryAnnuityCalculator,
    })),
  ),
  LotteryTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/lottery-tax/LotteryTaxCalculator').then((mod) => ({
      default: mod.LotteryTaxCalculator,
    })),
  ),
  LvCalculator: lazyTool(() =>
    import('@/tools/calculators/lv/LvCalculator').then((mod) => ({
      default: mod.LvCalculator,
    })),
  ),
  MacroCalculator: lazyTool(() =>
    import('@/tools/calculators/macro/MacroCalculator').then((mod) => ({
      default: mod.MacroCalculator,
    })),
  ),
  McgToIuConverter: lazyTool(() =>
    import('@/tools/calculators/mcg-to-iu/McgToIuConverter').then((mod) => ({
      default: mod.McgToIuConverter,
    })),
  ),
  Medicine3TimesADayCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/medicine-3-times-a-day/Medicine3TimesADayCalculator'
    ).then((mod) => ({
      default: mod.Medicine3TimesADayCalculator,
    })),
  ),
  MentzerIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mentzer-index/MentzerIndexCalculator'
    ).then((mod) => ({
      default: mod.MentzerIndexCalculator,
    })),
  ),
  MicronutrientCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/micronutrient/MicronutrientCalculator'
    ).then((mod) => ({
      default: mod.MicronutrientCalculator,
    })),
  ),
  MipiCalculator: lazyTool(() =>
    import('@/tools/calculators/mipi/MipiCalculator').then((mod) => ({
      default: mod.MipiCalculator,
    })),
  ),
  MmeCalculator: lazyTool(() =>
    import('@/tools/calculators/mme/MmeCalculator').then((mod) => ({
      default: mod.MmeCalculator,
    })),
  ),
  MmollToMgdlCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mmoll-to-mgdl/MmollToMgdlCalculator'
    ).then((mod) => ({
      default: mod.MmollToMgdlCalculator,
    })),
  ),
  NetCarbsCalculator: lazyTool(() =>
    import('@/tools/calculators/net-carbs/NetCarbsCalculator').then((mod) => ({
      default: mod.NetCarbsCalculator,
    })),
  ),
  OpioidConversionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/opioid-conversion/OpioidConversionCalculator'
    ).then((mod) => ({
      default: mod.OpioidConversionCalculator,
    })),
  ),
  OxygenationIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/oxygenation-index/OxygenationIndexCalculator'
    ).then((mod) => ({
      default: mod.OxygenationIndexCalculator,
    })),
  ),
  ParklandFormulaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/parkland-formula/ParklandFormulaCalculator'
    ).then((mod) => ({
      default: mod.ParklandFormulaCalculator,
    })),
  ),
  PeptideCalculator: lazyTool(() =>
    import('@/tools/calculators/peptide/PeptideCalculator').then((mod) => ({
      default: mod.PeptideCalculator,
    })),
  ),
  PrescriptionRefillCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/prescription-refill/PrescriptionRefillCalculator'
    ).then((mod) => ({
      default: mod.PrescriptionRefillCalculator,
    })),
  ),
  ProstateVolumeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/prostate-volume/ProstateVolumeCalculator'
    ).then((mod) => ({
      default: mod.ProstateVolumeCalculator,
    })),
  ),
  PsaDensityCalculator: lazyTool(() =>
    import('@/tools/calculators/psa-density/PsaDensityCalculator').then(
      (mod) => ({
        default: mod.PsaDensityCalculator,
      }),
    ),
  ),
  PsaDoublingTimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/psa-doubling-time/PsaDoublingTimeCalculator'
    ).then((mod) => ({
      default: mod.PsaDoublingTimeCalculator,
    })),
  ),
  ProteinCalculator: lazyTool(() =>
    import('@/tools/calculators/protein/ProteinCalculator').then((mod) => ({
      default: mod.ProteinCalculator,
    })),
  ),
  ProteinCreatinineRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/protein-creatinine-ratio/ProteinCreatinineRatioCalculator'
    ).then((mod) => ({
      default: mod.ProteinCreatinineRatioCalculator,
    })),
  ),
  QuarantineActivityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/quarantine-activity/QuarantineActivityCalculator'
    ).then((mod) => ({
      default: mod.QuarantineActivityCalculator,
    })),
  ),
  QuizFfmiCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/quiz-ffmi/QuizFfmiCalculator'
    ).then((mod) => ({
      default: mod.QuizFfmiCalculator,
    })),
  ),
  QuizHarrisBenedictCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/quiz-harris-benedict/QuizHarrisBenedictCalculator'
    ).then((mod) => ({
      default: mod.QuizHarrisBenedictCalculator,
    })),
  ),
  QuizProteinCreatinineRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/quiz-protein-creatinine-ratio/QuizProteinCreatinineRatioCalculator'
    ).then((mod) => ({
      default: mod.QuizProteinCreatinineRatioCalculator,
    })),
  ),
  RmrCalculator: lazyTool(() =>
    import('@/tools/calculators/rmr/RmrCalculator').then((mod) => ({
      default: mod.RmrCalculator,
    })),
  ),
  SodiumChangeHypertriglyceridemiaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sodium-change-hypertriglyceridemia/SodiumChangeHypertriglyceridemiaCalculator'
    ).then((mod) => ({
      default: mod.SodiumChangeHypertriglyceridemiaCalculator,
    })),
  ),
  SodiumCorrectionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sodium-correction/SodiumCorrectionCalculator'
    ).then((mod) => ({
      default: mod.SodiumCorrectionCalculator,
    })),
  ),
  SodiumDeficitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sodium-deficit/SodiumDeficitCalculator'
    ).then((mod) => ({
      default: mod.SodiumDeficitCalculator,
    })),
  ),
  SodiumCorrectionRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sodium-correction-rate/SodiumCorrectionRateCalculator'
    ).then((mod) => ({
      default: mod.SodiumCorrectionRateCalculator,
    })),
  ),
  SodiumInSaltCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sodium-in-salt/SodiumInSaltCalculator'
    ).then((mod) => ({
      default: mod.SodiumInSaltCalculator,
    })),
  ),
  SteroidConversionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/steroid-conversion/SteroidConversionCalculator'
    ).then((mod) => ({
      default: mod.SteroidConversionCalculator,
    })),
  ),
  StillbirthRiskCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/stillbirth-risk/Calculator'
    ).then((mod) => ({
      default: mod.StillbirthRiskCalculator,
    })),
  ),
  StrokeVolumeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/stroke-volume/StrokeVolumeCalculator'
    ).then((mod) => ({
      default: mod.StrokeVolumeCalculator,
    })),
  ),
  TdeeCalculator: lazyTool(() =>
    import('@/tools/calculators/tdee/TdeeCalculator').then((mod) => ({
      default: mod.TdeeCalculator,
    })),
  ),
  TimiStemiCalculator: lazyTool(() =>
    import('@/tools/calculators/timi-stemi/TimiStemiCalculator').then((mod) => ({
      default: mod.TimiStemiCalculator,
    })),
  ),
  TimiUanstemiCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/timi-uanstemi/TimiUanstemiCalculator'
    ).then((mod) => ({
      default: mod.TimiUanstemiCalculator,
    })),
  ),
  TpaStrokeCalculator: lazyTool(() =>
    import('@/tools/calculators/tpa-stroke/TpaStrokeCalculator').then((mod) => ({
      default: mod.TpaStrokeCalculator,
    })),
  ),
  TylenolOverdoseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/tylenol-overdose/TylenolOverdoseCalculator'
    ).then((mod) => ({
      default: mod.TylenolOverdoseCalculator,
    })),
  ),
  VitaminACalculator: lazyTool(() =>
    import('@/tools/calculators/vitamin-a/VitaminACalculator').then((mod) => ({
      default: mod.VitaminACalculator,
    })),
  ),
  VitaminCalculator: lazyTool(() =>
    import('@/tools/calculators/vitamin/VitaminCalculator').then((mod) => ({
      default: mod.VitaminCalculator,
    })),
  ),
  VitaminDCalculator: lazyTool(() =>
    import('@/tools/calculators/vitamin-d/VitaminDCalculator').then((mod) => ({
      default: mod.VitaminDCalculator,
    })),
  ),
  WeightWatcherPointsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/weight-watcher-points/WeightWatcherPointsCalculator'
    ).then((mod) => ({
      default: mod.WeightWatcherPointsCalculator,
    })),
  ),
  WeightWatchersPointsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/weight-watchers-points/WeightWatchersPointsCalculator'
    ).then((mod) => ({
      default: mod.WeightWatchersPointsCalculator,
    })),
  ),
  WarfarinDosingCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/warfarin-dosing/WarfarinDosingCalculator'
    ).then((mod) => ({
      default: mod.WarfarinDosingCalculator,
    })),
  ),
  WellsPeCalculator: lazyTool(() =>
    import('@/tools/calculators/wells-pe/WellsPeCalculator').then((mod) => ({
      default: mod.WellsPeCalculator,
    })),
  ),
  MarginAndMarkupCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-and-markup/MarginAndMarkupCalculator'
    ).then((mod) => ({
      default: mod.MarginAndMarkupCalculator,
    })),
  ),
  MarginAndSalesTaxCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-and-sales-tax/MarginAndSalesTaxCalculator'
    ).then((mod) => ({
      default: mod.MarginAndSalesTaxCalculator,
    })),
  ),
  MarginAndVatCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/margin-and-vat/MarginAndVatCalculator'
    ).then((mod) => ({
      default: mod.MarginAndVatCalculator,
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
  MaintainPregnancyWeightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/maintain-pregnancy-weight/MaintainPregnancyWeightCalculator'
    ).then((mod) => ({
      default: mod.MaintainPregnancyWeightCalculator,
    })),
  ),
  McaCalculator: lazyTool(() =>
    import('@/tools/calculators/mca/McaCalculator').then((mod) => ({
      default: mod.McaCalculator,
    })),
  ),
  MeanAirwayPressureCalculator: lazyTool(() =>
    import('@/tools/calculators/mean-airway-pressure/MeanAirwayPressureCalculator').then((mod) => ({
      default: mod.MeanAirwayPressureCalculator,
    })),
  ),
  MelatoninDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/melatonin-dosage/MelatoninDosageCalculator'
    ).then((mod) => ({
      default: mod.MelatoninDosageCalculator,
    })),
  ),
  MealCalorieCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/meal-calorie/MealCalorieCalculator'
    ).then((mod) => ({
      default: mod.MealCalorieCalculator,
    })),
  ),
  MaintenanceCalorieCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/maintenance-calorie/MaintenanceCalorieCalculator'
    ).then((mod) => ({
      default: mod.MaintenanceCalorieCalculator,
    })),
  ),
  MapCalculator: lazyTool(() =>
    import('@/tools/calculators/map-mean-arterial-pressure/MapCalculator').then(
      (mod) => ({
        default: mod.MapCalculator,
      }),
    ),
  ),
  MeanSacDiameterCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mean-sac-diameter/MeanSacDiameterCalculator'
    ).then((mod) => ({
      default: mod.MeanSacDiameterCalculator,
    })),
  ),
  MarkdownCalculator: lazyTool(() =>
    import('@/tools/calculators/markdown/MarkdownCalculator').then((mod) => ({
      default: mod.MarkdownCalculator,
    })),
  ),
  MarkupCalculator: lazyTool(() =>
    import('@/tools/calculators/markup/MarkupCalculator').then((mod) => ({
      default: mod.MarkupCalculator,
    })),
  ),
  ModifiedAdjustedGrossIncomeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/modified-adjusted-gross-income/ModifiedAdjustedGrossIncomeCalculator'
    ).then((mod) => ({
      default: mod.ModifiedAdjustedGrossIncomeCalculator,
    })),
  ),
  MarriageTaxCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/marriage-tax/MarriageTaxCalculator'
    ).then((mod) => ({
      default: mod.MarriageTaxCalculator,
    })),
  ),
  MileageReimbursementCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mileage-reimbursement/MileageReimbursementCalculator'
    ).then((mod) => ({
      default: mod.MileageReimbursementCalculator,
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
  IncomeTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/income-tax/IncomeTaxCalculator').then((mod) => ({
      default: mod.IncomeTaxCalculator,
    })),
  ),
  TakeHomePayUkCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/take-home-pay-uk/TakeHomePayUkCalculator'
    ).then((mod) => ({
      default: mod.TakeHomePayUkCalculator,
    })),
  ),
  TaxBracketCalculator: lazyTool(() =>
    import('@/tools/calculators/tax-bracket/TaxBracketCalculator').then((mod) => ({
      default: mod.TaxBracketCalculator,
    })),
  ),
  AdjustedGrossIncomeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/adjusted-gross-income/AdjustedGrossIncomeCalculator'
    ).then((mod) => ({
      default: mod.AdjustedGrossIncomeCalculator,
    })),
  ),
  IncomeTaxCalculatorPakistan: lazyTool(() =>
    import(
      '@/tools/calculators/pakistan-income-tax/PakistanIncomeTaxCalculator'
    ).then((mod) => ({
      default: mod.PakistanIncomeTaxCalculator,
    })),
  ),
  IncomeTaxCalculatorPhilippines: lazyTool(() =>
    import(
      '@/tools/calculators/philippines-income-tax/PhilippinesIncomeTaxCalculator'
    ).then((mod) => ({
      default: mod.PhilippinesIncomeTaxCalculator,
    })),
  ),
  AlabamaTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/alabama-tax/AlabamaTaxCalculator').then(
      (mod) => ({
        default: mod.AlabamaTaxCalculator,
      }),
    ),
  ),
  CaliforniaTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/california-tax/CaliforniaTaxCalculator').then(
      (mod) => ({
        default: mod.CaliforniaTaxCalculator,
      }),
    ),
  ),
  IllinoisTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/illinois-tax/IllinoisTaxCalculator').then(
      (mod) => ({
        default: mod.IllinoisTaxCalculator,
      }),
    ),
  ),
  StateTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/state-tax/StateTaxCalculator').then((mod) => ({
      default: mod.StateTaxCalculator,
    })),
  ),
  TexasTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/texas-tax/TexasTaxCalculator').then(
      (mod) => ({
        default: mod.TexasTaxCalculator,
      }),
    ),
  ),
  CaliforniaSalesTaxCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/california-sales-tax/CaliforniaSalesTaxCalculator'
    ).then((mod) => ({
      default: mod.CaliforniaSalesTaxCalculator,
    })),
  ),
  CanadaGstQstCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/canada-gst-qst/CanadaGstQstCalculator'
    ).then((mod) => ({
      default: mod.CanadaGstQstCalculator,
    })),
  ),
  FloridaSalesTaxCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/florida-sales-tax/FloridaSalesTaxCalculator'
    ).then((mod) => ({
      default: mod.FloridaSalesTaxCalculator,
    })),
  ),
  NewJerseySalesTaxCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/new-jersey-sales-tax/NewJerseySalesTaxCalculator'
    ).then((mod) => ({
      default: mod.NewJerseySalesTaxCalculator,
    })),
  ),
  OhioSalesTaxCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ohio-sales-tax/OhioSalesTaxCalculator'
    ).then((mod) => ({
      default: mod.OhioSalesTaxCalculator,
    })),
  ),
  SalesTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/sales-tax/SalesTaxCalculator').then((mod) => ({
      default: mod.SalesTaxCalculator,
    })),
  ),
  GrossToNetCalculator: lazyTool(() =>
    import('@/tools/calculators/gross-to-net/GrossToNetCalculator').then(
      (mod) => ({
        default: mod.GrossToNetCalculator,
      }),
    ),
  ),
  NetToGrossCalculator: lazyTool(() =>
    import('@/tools/calculators/net-to-gross/NetToGrossCalculator').then(
      (mod) => ({
        default: mod.NetToGrossCalculator,
      }),
    ),
  ),
  GstCalculator: lazyTool(() =>
    import('@/tools/calculators/gst/GstCalculator').then((mod) => ({
      default: mod.GstCalculator,
    })),
  ),
  NewYorkTaxCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/new-york-tax/NewYorkTaxCalculator'
    ).then((mod) => ({
      default: mod.NewYorkTaxCalculator,
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
  NetProfitMarginCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-profit-margin/NetProfitMarginCalculator'
    ).then((mod) => ({
      default: mod.NetProfitMarginCalculator,
    })),
  ),
  ReturnOnSalesCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/return-on-sales/ReturnOnSalesCalculator'
    ).then((mod) => ({
      default: mod.ReturnOnSalesCalculator,
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
  RmdCalculator: lazyTool(() =>
    import('@/tools/calculators/rmd/RmdCalculator').then((mod) => ({
      default: mod.RmdCalculator,
    })),
  ),
  RrefCalculator: lazyTool(() =>
    import('@/tools/calculators/rref/RrefCalculator').then((mod) => ({
      default: mod.RrefCalculator,
    })),
  ),
  RsbiCalculator: lazyTool(() =>
    import('@/tools/calculators/rsbi/RsbiCalculator').then((mod) => ({
      default: mod.RsbiCalculator,
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
  TaxEquivalentYieldCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/tax-equivalent-yield/TaxEquivalentYieldCalculator'
    ).then((mod) => ({
      default: mod.TaxEquivalentYieldCalculator,
    })),
  ),
  TaylorRuleCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/taylor-rule/TaylorRuleCalculator'
    ).then((mod) => ({
      default: mod.TaylorRuleCalculator,
    })),
  ),
  TrumpTariffCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/trump-tariff/TrumpTariffCalculator'
    ).then((mod) => ({
      default: mod.TrumpTariffCalculator,
    })),
  ),
  VelocityOfMoneyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/velocity-of-money/VelocityOfMoneyCalculator'
    ).then((mod) => ({
      default: mod.VelocityOfMoneyCalculator,
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
  AmoxicillinPediatricDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/amoxicillin-pediatric-dosage/AmoxicillinPediatricDosageCalculator'
    ).then((mod) => ({
      default: mod.AmoxicillinPediatricDosageCalculator,
    })),
  ),
  AmortizationCalculator: lazyTool(() =>
    import('@/tools/calculators/amortization/AmortizationCalculator').then((mod) => ({
      default: mod.AmortizationCalculator,
    })),
  ),
  AmtCalculator: lazyTool(() =>
    import('@/tools/calculators/amt/AmtCalculator').then((mod) => ({
      default: mod.AmtCalculator,
    })),
  ),
  AncAbsoluteNeutrophilCountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/anc-absolute-neutrophil-count/AncAbsoluteNeutrophilCountCalculator'
    ).then((mod) => ({
      default: mod.AncAbsoluteNeutrophilCountCalculator,
    })),
  ),
  AncWithoutBandsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/anc-without-bands/AncWithoutBandsCalculator'
    ).then((mod) => ({
      default: mod.AncWithoutBandsCalculator,
    })),
  ),
  AnionGapCalculator: lazyTool(() =>
    import('@/tools/calculators/anion-gap/AnionGapCalculator').then((mod) => ({
      default: mod.AnionGapCalculator,
    })),
  ),
  ArterialBloodPhCalculator: lazyTool(() =>
    import('@/tools/calculators/arterial-blood-ph/ArterialBloodPhCalculator').then((mod) => ({
      default: mod.ArterialBloodPhCalculator,
    })),
  ),
  VenousBloodPhCalculator: lazyTool(() =>
    import('@/tools/calculators/venous-blood-ph/VenousBloodPhCalculator').then((mod) => ({
      default: mod.VenousBloodPhCalculator,
    })),
  ),
  BedriddenPatientHeightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bedridden-patient-height/BedriddenPatientHeightCalculator'
    ).then((mod) => ({
      default: mod.BedriddenPatientHeightCalculator,
    })),
  ),
  PlasmaVolumeCalculator: lazyTool(() =>
    import('@/tools/calculators/plasma-volume/PlasmaVolumeCalculator').then((mod) => ({
      default: mod.PlasmaVolumeCalculator,
    })),
  ),
  BicarbonateDeficitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bicarbonate-deficit/BicarbonateDeficitCalculator'
    ).then((mod) => ({
      default: mod.BicarbonateDeficitCalculator,
    })),
  ),
  AcidBaseCalculator: lazyTool(() =>
    import('@/tools/calculators/acid-base/AcidBaseCalculator').then((mod) => ({
      default: mod.AcidBaseCalculator,
    })),
  ),
  AltmanZScoreCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/altman-z-score/AltmanZScoreCalculator'
    ).then((mod) => ({
      default: mod.AltmanZScoreCalculator,
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
  WeightGainCalculator: lazyTool(() =>
    import('@/tools/calculators/weight-gain/WeightGainCalculator').then((mod) => ({
      default: mod.WeightGainCalculator,
    })),
  ),
  WeightPercentileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/weight-percentile/WeightPercentileCalculator'
    ).then((mod) => ({
      default: mod.WeightPercentileCalculator,
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
  PsiPortCalculator: lazyTool(() =>
    import('@/tools/calculators/pneumonia-psi/PsiPortCalculator').then((mod) => ({
      default: mod.PsiPortCalculator,
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
  NaturalRateOfUnemploymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/natural-rate-of-unemployment/NaturalUnemploymentCalculator'
    ).then((mod) => ({
      default: mod.NaturalUnemploymentCalculator,
    })),
  ),
  UnemploymentCalculator: lazyTool(() =>
    import('@/tools/calculators/unemployment/UnemploymentCalculator').then((mod) => ({
      default: mod.UnemploymentCalculator,
    })),
  ),
  UrineAnionGapCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/urine-anion-gap/UrineAnionGapCalculator'
    ).then((mod) => ({
      default: mod.UrineAnionGapCalculator,
    })),
  ),
  UrineHomePregnancyTestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/urine-home-pregnancy-test/UrineHomePregnancyTestCalculator'
    ).then((mod) => ({
      default: mod.UrineHomePregnancyTestCalculator,
    })),
  ),
  UrineOutputCalculator: lazyTool(() =>
    import('@/tools/calculators/urine-output/UrineOutputCalculator').then(
      (mod) => ({
        default: mod.UrineOutputCalculator,
      }),
    ),
  ),
  UrrCalculator: lazyTool(() =>
    import('@/tools/calculators/urr/UrrCalculator').then((mod) => ({
      default: mod.UrrCalculator,
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
  CarDepreciationCalculator: lazyTool(() =>
    import('@/tools/calculators/car-depreciation/CarDepreciationCalculator').then(
      (mod) => ({
        default: mod.CarDepreciationCalculator,
      }),
    ),
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
  AccountingProfitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/accounting-profit/AccountingProfitCalculator'
    ).then((mod) => ({
      default: mod.AccountingProfitCalculator,
    })),
  ),
  ProfitCalculator: lazyTool(() =>
    import('@/tools/calculators/profit/ProfitCalculator').then((mod) => ({
      default: mod.ProfitCalculator,
    })),
  ),
  EconomicProfitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/economic-profit/EconomicProfitCalculator'
    ).then((mod) => ({
      default: mod.EconomicProfitCalculator,
    })),
  ),
  EvToSalesCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ev-to-sales/EvToSalesCalculator'
    ).then((mod) => ({
      default: mod.EvToSalesCalculator,
    })),
  ),
  PriceToSalesRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-to-sales-ratio/PriceToSalesRatioCalculator'
    ).then((mod) => ({
      default: mod.PriceToSalesRatioCalculator,
    })),
  ),
  ProfitabilityIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/profitability-index/ProfitabilityIndexCalculator'
    ).then((mod) => ({
      default: mod.ProfitabilityIndexCalculator,
    })),
  ),
  RevenueCalculator: lazyTool(() =>
    import('@/tools/calculators/revenue/RevenueCalculator').then((mod) => ({
      default: mod.RevenueCalculator,
    })),
  ),
  RevenueGrowthCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/revenue-growth/RevenueGrowthCalculator'
    ).then((mod) => ({
      default: mod.RevenueGrowthCalculator,
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
  StockCalculator: lazyTool(() =>
    import('@/tools/calculators/stock/StockCalculator').then((mod) => ({
      default: mod.StockCalculator,
    })),
  ),
  StockAverageCalculator: lazyTool(() =>
    import('@/tools/calculators/stock-average/StockAverageCalculator').then(
      (mod) => ({
        default: mod.StockAverageCalculator,
      }),
    ),
  ),
  StockSplitCalculator: lazyTool(() =>
    import('@/tools/calculators/stock-split/StockSplitCalculator').then(
      (mod) => ({
        default: mod.StockSplitCalculator,
      }),
    ),
  ),
  CommercialLeaseCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/commercial-lease/CommercialLeaseCalculator'
    ).then((mod) => ({
      default: mod.CommercialLeaseCalculator,
    })),
  ),
  CommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/commission/CommissionCalculator'
    ).then((mod) => ({
      default: mod.CommissionCalculator,
    })),
  ),
  CommuteCalculator: lazyTool(() =>
    import('@/tools/calculators/commute/CommuteCalculator').then((mod) => ({
      default: mod.CommuteCalculator,
    })),
  ),
  SalesCommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sales-commission/SalesCommissionCalculator'
    ).then((mod) => ({
      default: mod.SalesCommissionCalculator,
    })),
  ),
  SalesCalculator: lazyTool(() =>
    import('@/tools/calculators/sales/SalesCalculator').then((mod) => ({
      default: mod.SalesCalculator,
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
  SpermAnalysisCalculator: lazyTool(() =>
    import('@/tools/calculators/sperm-analysis/SpermAnalysisCalculator').then((mod) => ({
      default: mod.SpermAnalysisCalculator,
    })),
  ),
  SpendingMultiplierCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/spending-multiplier/SpendingMultiplierCalculator'
    ).then((mod) => ({
      default: mod.SpendingMultiplierCalculator,
    })),
  ),
  SinkingFundCalculator: lazyTool(() =>
    import('@/tools/calculators/sinking-fund/SinkingFundCalculator').then((mod) => ({
      default: mod.SinkingFundCalculator,
    })),
  ),
  SipCalculator: lazyTool(() =>
    import('@/tools/calculators/sip/SipCalculator').then((mod) => ({
      default: mod.SipCalculator,
    })),
  ),
  SipLumpsumCalculator: lazyTool(() =>
    import('@/tools/calculators/sip-lumpsum/SipLumpsumCalculator').then(
      (mod) => ({
        default: mod.SipLumpsumCalculator,
      }),
    ),
  ),
  SixMinuteWalkTestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/six-minute-walk-test/SixMinuteWalkTestCalculator'
    ).then((mod) => ({
      default: mod.SixMinuteWalkTestCalculator,
    })),
  ),
  SocialSecurityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/social-security/SocialSecurityCalculator'
    ).then((mod) => ({
      default: mod.SocialSecurityCalculator,
    })),
  ),
  StampDutyLandTaxUkCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/stamp-duty-land-tax-uk/StampDutyLandTaxUkCalculator'
    ).then((mod) => ({
      default: mod.StampDutyLandTaxUkCalculator,
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
  TestosteroneEstradiolRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/testosterone-estradiol-ratio/TestosteroneEstradiolRatioCalculator'
    ).then((mod) => ({
      default: mod.TestosteroneEstradiolRatioCalculator,
    })),
  ),
  TimeValueOfMoneyCalculator: lazyTool(() =>
    import('@/tools/calculators/time-value-of-money/TimeValueOfMoneyCalculator').then((mod) => ({
      default: mod.TimeValueOfMoneyCalculator,
    })),
  ),
  TidalVolumeCalculator: lazyTool(() =>
    import('@/tools/calculators/tidal-volume/TidalVolumeCalculator').then((mod) => ({
      default: mod.TidalVolumeCalculator,
    })),
  ),
  TtkgCalculator: lazyTool(() =>
    import('@/tools/calculators/ttkg/TtkgCalculator').then((mod) => ({
      default: mod.TtkgCalculator,
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
  MarginalRevenueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/marginal-revenue/MarginalRevenueCalculator'
    ).then((mod) => ({
      default: mod.MarginalRevenueCalculator,
    })),
  ),
  WeddingBudgetCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/wedding-budget/WeddingBudgetCalculator'
    ).then((mod) => ({
      default: mod.WeddingBudgetCalculator,
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
  AnnualIncomeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annual-income/AnnualIncomeCalculator'
    ).then((mod) => ({
      default: mod.AnnualIncomeCalculator,
    })),
  ),
  AnnualPayCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annual-pay/AnnualPayCalculator'
    ).then((mod) => ({
      default: mod.AnnualPayCalculator,
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
  BbtCalculator: lazyTool(() =>
    import('@/tools/calculators/bbt/BbtCalculator').then((mod) => ({
      default: mod.BbtCalculator,
    })),
  ),
  AaGradientCalculator: lazyTool(() =>
    import('@/tools/calculators/aa-gradient/AaGradientCalculator').then((mod) => ({
      default: mod.AaGradientCalculator,
    })),
  ),
  AbiCalculator: lazyTool(() =>
    import('@/tools/calculators/abi/AbiCalculator').then((mod) => ({
      default: mod.AbiCalculator,
    })),
  ),
  AbsiCalculator: lazyTool(() =>
    import('@/tools/calculators/absi/AbsiCalculator').then((mod) => ({
      default: mod.AbsiCalculator,
    })),
  ),
  AbsoluteEosinophilCountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/absolute-eosinophil-count/AbsoluteEosinophilCountCalculator'
    ).then((mod) => ({
      default: mod.AbsoluteEosinophilCountCalculator,
    })),
  ),
  AbsoluteLymphocyteCountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/absolute-lymphocyte-count/AbsoluteLymphocyteCountCalculator'
    ).then((mod) => ({
      default: mod.AbsoluteLymphocyteCountCalculator,
    })),
  ),
  AbsoluteReticulocyteCountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/absolute-reticulocyte-count/AbsoluteReticulocyteCountCalculator'
    ).then((mod) => ({
      default: mod.AbsoluteReticulocyteCountCalculator,
    })),
  ),
  AddedSugarIntakeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/added-sugar-intake/AddedSugarIntakeCalculator'
    ).then((mod) => ({
      default: mod.AddedSugarIntakeCalculator,
    })),
  ),
  AdderallDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/adderall-dosage/AdderallDosageCalculator'
    ).then((mod) => ({
      default: mod.AdderallDosageCalculator,
    })),
  ),
  AdjustedBodyWeightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/adjusted-body-weight/AdjustedBodyWeightCalculator'
    ).then((mod) => ({
      default: mod.AdjustedBodyWeightCalculator,
    })),
  ),
  AdrenalWashoutCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/adrenal-washout/AdrenalWashoutCalculator'
    ).then((mod) => ({
      default: mod.AdrenalWashoutCalculator,
    })),
  ),
  AgeAdjustedDDimerCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/age-adjusted-d-dimer/AgeAdjustedDDimerCalculator'
    ).then((mod) => ({
      default: mod.AgeAdjustedDDimerCalculator,
    })),
  ),
  AlbuminCreatinineRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/albumin-creatinine-ratio/AlbuminCreatinineRatioCalculator'
    ).then((mod) => ({
      default: mod.AlbuminCreatinineRatioCalculator,
    })),
  ),
  AlbuminGlobulinRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/albumin-globulin-ratio/AlbuminGlobulinRatioCalculator'
    ).then((mod) => ({
      default: mod.AlbuminGlobulinRatioCalculator,
    })),
  ),
  AlcoholUnitCalculator: lazyTool(() =>
    import('@/tools/calculators/alcohol-unit/AlcoholUnitCalculator').then(
      (mod) => ({
        default: mod.AlcoholUnitCalculator,
      }),
    ),
  ),
  AleveDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/aleve-dosage/AleveDosageCalculator'
    ).then((mod) => ({
      default: mod.AleveDosageCalculator,
    })),
  ),
  AllowableBloodLossCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/allowable-blood-loss/AllowableBloodLossCalculator'
    ).then((mod) => ({
      default: mod.AllowableBloodLossCalculator,
    })),
  ),
  BaiCalculator: lazyTool(() =>
    import('@/tools/calculators/bai/BaiCalculator').then((mod) => ({
      default: mod.BaiCalculator,
    })),
  ),
  BriCalculator: lazyTool(() =>
    import('@/tools/calculators/bri-body-roundness/BriCalculator').then((mod) => ({
      default: mod.BriCalculator,
    })),
  ),
  WaistToHipRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/waist-to-hip/WaistToHipRatioCalculator'
    ).then((mod) => ({
      default: mod.WaistToHipRatioCalculator,
    })),
  ),
  WaistToHeightRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/waist-to-height/WhtrCalculator').then((mod) => ({
      default: mod.WaistToHeightRatioCalculator,
    })),
  ),
  PlasmaOsmolalityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/plasma-osmolality/PlasmaOsmolalityCalculator'
    ).then((mod) => ({
      default: mod.PlasmaOsmolalityCalculator,
    })),
  ),
  SerumOsmolalityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/serum-osmolality/SerumOsmolalityCalculator'
    ).then((mod) => ({
      default: mod.SerumOsmolalityCalculator,
    })),
  ),
  PonderalIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ponderal-index/PonderalIndexCalculator'
    ).then((mod) => ({
      default: mod.PonderalIndexCalculator,
    })),
  ),
  WeightLossPercentageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/weight-loss-percentage/WeightLossPercentageCalculator'
    ).then((mod) => ({
      default: mod.WeightLossPercentageCalculator,
    })),
  ),
  WintersFormulaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/winters-formula/WintersFormulaCalculator'
    ).then((mod) => ({
      default: mod.WintersFormulaCalculator,
    })),
  ),
  WaterIntakeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/water-intake/WaterIntakeCalculator'
    ).then((mod) => ({
      default: mod.WaterIntakeCalculator,
    })),
  ),
  RfmCalculator: lazyTool(() =>
    import('@/tools/calculators/rfm/RfmCalculator').then((mod) => ({
      default: mod.RfmCalculator,
    })),
  ),
  LeanBodyMassCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lean-body-mass/LeanBodyMassCalculator'
    ).then((mod) => ({
      default: mod.LeanBodyMassCalculator,
    })),
  ),
  NlrCalculator: lazyTool(() =>
    import('@/tools/calculators/nlr/NlrCalculator').then((mod) => ({
      default: mod.NlrCalculator,
    })),
  ),
  TransferrinSaturationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/transferrin-saturation/TransferrinSaturationCalculator'
    ).then((mod) => ({
      default: mod.TransferrinSaturationCalculator,
    })),
  ),
  OverweightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/overweight/OverweightCalculator'
    ).then((mod) => ({
      default: mod.OverweightCalculator,
    })),
  ),
  TotalBodyWaterCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/total-body-water/TotalBodyWaterCalculator'
    ).then((mod) => ({
      default: mod.TotalBodyWaterCalculator,
    })),
  ),
  BeeCalculator: lazyTool(() =>
    import('@/tools/calculators/bee-calculator/BeeCalculator').then((mod) => ({
      default: mod.BeeCalculator,
    })),
  ),
  BenadrylDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/benadryl-dosage/BenadrylDosageCalculator'
    ).then((mod) => ({
      default: mod.BenadrylDosageCalculator,
    })),
  ),
  BenzodiazepineConversionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/benzodiazepine-conversion/BenzodiazepineConversionCalculator'
    ).then((mod) => ({
      default: mod.BenzodiazepineConversionCalculator,
    })),
  ),
  BloodDonorCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blood-donor/BloodDonorCalculator'
    ).then((mod) => ({
      default: mod.BloodDonorCalculator,
    })),
  ),
  BloodTypeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blood-type/BloodTypeCalculator'
    ).then((mod) => ({
      default: mod.BloodTypeCalculator,
    })),
  ),
  BloodVolumeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blood-volume/BloodVolumeCalculator'
    ).then((mod) => ({
      default: mod.BloodVolumeCalculator,
    })),
  ),
  BodyFrameSizeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/body-frame-size/BodyFrameSizeCalculator'
    ).then((mod) => ({
      default: mod.BodyFrameSizeCalculator,
    })),
  ),
  BodyShapeCalculator: lazyTool(() =>
    import('@/tools/calculators/body-shape/BodyShapeCalculator').then((mod) => ({
      default: mod.BodyShapeCalculator,
    })),
  ),
  BodySurfaceAreaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/body-surface-area/BodySurfaceAreaCalculator'
    ).then((mod) => ({
      default: mod.BodySurfaceAreaCalculator,
    })),
  ),
  BodyTypeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/body-type/BodyTypeCalculator'
    ).then((mod) => ({
      default: mod.BodyTypeCalculator,
    })),
  ),
  BodeIndexCalculator: lazyTool(() =>
    import('@/tools/calculators/bode-index/BodeIndexCalculator').then((mod) => ({
      default: mod.BodeIndexCalculator,
    })),
  ),
  BsaCalculator: lazyTool(() =>
    import('@/tools/calculators/bsa/BsaCalculator').then((mod) => ({
      default: mod.BsaCalculator,
    })),
  ),

  BladderVolumeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bladder-volume/BladderVolumeCalculator'
    ).then((mod) => ({
      default: mod.BladderVolumeCalculator,
    })),
  ),
  IbuprofenDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ibuprofen-dosage/IbuprofenDosageCalculator'
    ).then((mod) => ({
      default: mod.IbuprofenDosageCalculator,
    })),
  ),
  IchVolumeCalculator: lazyTool(() =>
    import('@/tools/calculators/ich-volume/IchVolumeCalculator').then((mod) => ({
      default: mod.IchVolumeCalculator,
    })),
  ),
  IdealWeightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ideal-weight/IdealWeightCalculator'
    ).then((mod) => ({
      default: mod.IdealWeightCalculator,
    })),
  ),
  IvFlowRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/iv-flow-rate/IvFlowRateCalculator'
    ).then((mod) => ({
      default: mod.IvFlowRateCalculator,
    })),
  ),
  BetaStockCalculator: lazyTool(() =>
    import('@/tools/calculators/beta-stock/BetaStockCalculator').then((mod) => ({
      default: mod.BetaStockCalculator,
    })),
  ),
  BidensTaxPlanCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bidens-tax-plan/BidensTaxPlanCalculator'
    ).then((mod) => ({
      default: mod.BidensTaxPlanCalculator,
    })),
  ),
  BirthControlCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/birth-control/BirthControlCalculator'
    ).then((mod) => ({
      default: mod.BirthControlCalculator,
    })),
  ),
  BirthWeightPercentileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/birth-weight-percentile/BirthWeightPercentileCalculator'
    ).then((mod) => ({
      default: mod.BirthWeightPercentileCalculator,
    })),
  ),
  BlendedRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blended-rate/BlendedRateCalculator'
    ).then((mod) => ({
      default: mod.BlendedRateCalculator,
    })),
  ),
  BmiBodyMassIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bmi-body-mass-index/BmiBodyMassIndexCalculator'
    ).then((mod) => ({
      default: mod.BmiBodyMassIndexCalculator,
    })),
  ),
  BmiCalculatorForKids: lazyTool(() =>
    import(
      '@/tools/calculators/bmi-kids/BmiKidsCalculator'
    ).then((mod) => ({
      default: mod.BmiKidsCalculator,
    })),
  ),
  BmiCalculatorForTeens: lazyTool(() =>
    import(
      '@/tools/calculators/bmi-teens/BmiTeensCalculator'
    ).then((mod) => ({
      default: mod.BmiTeensCalculator,
    })),
  ),
  BmiForMenCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bmi-for-men/BmiForMenCalculator'
    ).then((mod) => ({
      default: mod.BmiForMenCalculator,
    })),
  ),
  BmiForWomenCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bmi-for-women/BmiForWomenCalculator'
    ).then((mod) => ({
      default: mod.BmiForWomenCalculator,
    })),
  ),
  BmiPercentileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bmi-percentile/BmiPercentileCalculator'
    ).then((mod) => ({
      default: mod.BmiPercentileCalculator,
    })),
  ),
  BmiWeightLossCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bmi-weight-loss/BmiWeightLossCalculator'
    ).then((mod) => ({
      default: mod.BmiWeightLossCalculator,
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
  BishopScoreCalculator: lazyTool(() =>
    import('@/tools/calculators/bishop-score/BishopScoreCalculator').then(
      (mod) => ({
        default: mod.BishopScoreCalculator,
      }),
    ),
  ),
  BreastCancerRecurrenceRiskCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/breast-cancer-recurrence-risk/BreastCancerRecurrenceCalculator'
    ).then((mod) => ({
      default: mod.BreastCancerRecurrenceRiskCalculator,
    })),
  ),
  BreastfeedingCalorieCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/breastfeeding-calorie/BreastfeedingCalorieCalculator'
    ).then((mod) => ({
      default: mod.BreastfeedingCalorieCalculator,
    })),
  ),
  BrexitCalculator: lazyTool(() =>
    import('@/tools/calculators/brexit/BrexitCalculator').then((mod) => ({
      default: mod.BrexitCalculator,
    })),
  ),
  BuildVsBuyCalculator: lazyTool(() =>
    import('@/tools/calculators/build-vs-buy/BuildVsBuyCalculator').then((mod) => ({
      default: mod.BuildVsBuyCalculator,
    })),
  ),
  BunCreatinineRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/bun-creatinine-ratio/BunCreatinineRatioCalculator').then(
      (mod) => ({
        default: mod.BunCreatinineRatioCalculator,
      }),
    ),
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
  BudgetCalculator: lazyTool(() =>
    import('@/tools/calculators/budget/BudgetCalculator').then((mod) => ({
      default: mod.BudgetCalculator,
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
  Cha2ds2VascCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cha2ds2-vasc/Cha2ds2VascCalculator'
    ).then((mod) => ({
      default: mod.Cha2ds2VascCalculator,
    })),
  ),
  CvdRiskCalculator: lazyTool(() =>
    import('@/tools/calculators/cvd-risk/CvdRiskCalculator').then((mod) => ({
      default: mod.CvdRiskCalculator,
    })),
  ),
  CalorieCalculator: lazyTool(() =>
    import('@/tools/calculators/calorie/CalorieCalculator').then((mod) => ({
      default: mod.CalorieCalculator,
    })),
  ),
  CalorieIntakeSimpleCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/calorie-intake-simple/CalorieIntakeSimpleCalculator'
    ).then((mod) => ({
      default: mod.CalorieIntakeSimpleCalculator,
    })),
  ),
  CaffeineCalculator: lazyTool(() =>
    import('@/tools/calculators/caffeine/CaffeineCalculator').then((mod) => ({
      default: mod.CaffeineCalculator,
    })),
  ),
  CaloriesBurnedCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/calories-burned/CaloriesBurnedCalculator'
    ).then((mod) => ({
      default: mod.CaloriesBurnedCalculator,
    })),
  ),
  CallOptionCalculator: lazyTool(() =>
    import('@/tools/calculators/call-option/CallOptionCalculator').then(
      (mod) => ({
        default: mod.CallOptionCalculator,
      }),
    ),
  ),
  CapmCalculator: lazyTool(() =>
    import('@/tools/calculators/capm/CapmCalculator').then((mod) => ({
      default: mod.CapmCalculator,
    })),
  ),
  CardiacOutputCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cardiac-output/CardiacOutputCalculator'
    ).then((mod) => ({
      default: mod.CardiacOutputCalculator,
    })),
  ),
  CardiacIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cardiac-index/CardiacIndexCalculator'
    ).then((mod) => ({
      default: mod.CardiacIndexCalculator,
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
  CarLeaseCalculator: lazyTool(() =>
    import('@/tools/calculators/car-lease/CarLeaseCalculator').then((mod) => ({
      default: mod.CarLeaseCalculator,
    })),
  ),
  LeaseMileageCalculator: lazyTool(() =>
    import('@/tools/calculators/lease-mileage/LeaseMileageCalculator').then((mod) => ({
      default: mod.LeaseMileageCalculator,
    })),
  ),
  CarLoanEmiCalculator: lazyTool(() =>
    import('@/tools/calculators/car-loan-emi/CarLoanEmiCalculator').then((mod) => ({
      default: mod.CarLoanEmiCalculator,
    })),
  ),
  CarpoolingCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/carpooling/CarpoolingCalculator'
    ).then((mod) => ({
      default: mod.CarpoolingCalculator,
    })),
  ),
  CarRefinanceCalculator: lazyTool(() =>
    import('@/tools/calculators/car-refinance/CarRefinanceCalculator').then(
      (mod) => ({
        default: mod.CarRefinanceCalculator,
      })
    ),
  ),
  RefinanceCalculator: lazyTool(() =>
    import('@/tools/calculators/refinance/RefinanceCalculator').then((mod) => ({
      default: mod.RefinanceCalculator,
    })),
  ),
  CarriedInterestCalculator: lazyTool(() =>
    import('@/tools/calculators/carried-interest/CarriedInterestCalculator').then(
      (mod) => ({
        default: mod.CarriedInterestCalculator,
      })
    ),
  ),
  CashBackCalculator: lazyTool(() =>
    import('@/tools/calculators/cash-back/CashBackCalculator').then((mod) => ({
      default: mod.CashBackCalculator,
    })),
  ),
  CashBackOrLowInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cash-back-or-low-interest/CashBackOrLowInterestCalculator'
    ).then((mod) => ({
      default: mod.CashBackOrLowInterestCalculator,
    })),
  ),
  CashFlowToDebtRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cash-flow-to-debt-ratio/CashFlowToDebtRatioCalculator'
    ).then((mod) => ({
      default: mod.CashFlowToDebtRatioCalculator,
    })),
  ),
  CashRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/cash-ratio/CashRatioCalculator').then((mod) => ({
      default: mod.CashRatioCalculator,
    })),
  ),
  CerebralPerfusionPressureCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cerebral-perfusion-pressure/CerebralPerfusionPressureCalculator'
    ).then((mod) => ({
      default: mod.CerebralPerfusionPressureCalculator,
    })),
  ),
  CheckDigitCalculator: lazyTool(() =>
    import('@/tools/calculators/check-digit/CheckDigitCalculator').then(
      (mod) => ({
        default: mod.CheckDigitCalculator,
      }),
    ),
  ),
  ChildTaxCreditCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/child-tax-credit/ChildTaxCreditCalculator'
    ).then((mod) => ({
      default: mod.ChildTaxCreditCalculator,
    })),
  ),
  CigaretteCalculator: lazyTool(() =>
    import('@/tools/calculators/cigarette/CigaretteCalculator').then((mod) => ({
      default: mod.CigaretteCalculator,
    })),
  ),
  CiwaCalculator: lazyTool(() =>
    import('@/tools/calculators/ciwa/CiwaCalculator').then((mod) => ({
      default: mod.CiwaCalculator,
    })),
  ),
  ClomidOvulationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/clomid-ovulation/ClomidOvulationCalculator'
    ).then((mod) => ({
      default: mod.ClomidOvulationCalculator,
    })),
  ),
  ChurnRateCalculator: lazyTool(() =>
    import('@/tools/calculators/churn-rate/ChurnRateCalculator').then((mod) => ({
      default: mod.ChurnRateCalculator,
    })),
  ),
  CltvCalculator: lazyTool(() =>
    import('@/tools/calculators/cltv/CltvCalculator').then((mod) => ({
      default: mod.CltvCalculator,
    })),
  ),
  ConceptionCalculator: lazyTool(() =>
    import('@/tools/calculators/conception/ConceptionCalculator').then((mod) => ({
      default: mod.ConceptionCalculator,
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
  Curb65Calculator: lazyTool(() =>
    import('@/tools/calculators/curb-65/Curb65Calculator').then((mod) => ({
      default: mod.Curb65Calculator,
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
  CyberMondayCalculator: lazyTool(() =>
    import('@/tools/calculators/cyber-monday/CyberMondayCalculator').then(
      (mod) => ({
        default: mod.CyberMondayCalculator,
      }),
    ),
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
  DosageCalculator: lazyTool(() =>
    import('@/tools/calculators/dosage/DosageCalculator').then((mod) => ({
      default: mod.DosageCalculator,
    })),
  ),
  DirectMaterialPriceVarianceCalculator: lazyTool(() =>
    import('@/tools/calculators/direct-material-price-variance/DirectMaterialPriceVarianceCalculator').then((mod) => ({
      default: mod.DirectMaterialPriceVarianceCalculator,
    })),
  ),
  DupontAnalysisCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/dupont-analysis/DupontAnalysisCalculator'
    ).then((mod) => ({
      default: mod.DupontAnalysisCalculator,
    })),
  ),
  EarningsPerShareCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/earnings-per-share/EarningsPerShareCalculator'
    ).then((mod) => ({
      default: mod.EarningsPerShareCalculator,
    })),
  ),
  EarningsPerShareGrowthCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/earnings-per-share-growth/EarningsPerShareGrowthCalculator'
    ).then((mod) => ({
      default: mod.EarningsPerShareGrowthCalculator,
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
  EarlyRetirementCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/early-retirement/EarlyRetirementCalculator'
    ).then((mod) => ({
      default: mod.EarlyRetirementCalculator,
    })),
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
  EbitdaMultipleCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ebitda-multiple/EbitdaMultipleCalculator'
    ).then((mod) => ({
      default: mod.EbitdaMultipleCalculator,
    })),
  ),
  EggFreezingCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/egg-freezing/EggFreezingCalculator'
    ).then((mod) => ({
      default: mod.EggFreezingCalculator,
    })),
  ),
  EcgBoxesToSecondsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ecg-boxes-to-seconds/EcgBoxesToSecondsCalculator'
    ).then((mod) => ({
      default: mod.EcgBoxesToSecondsCalculator,
    })),
  ),
  EcgHeartRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ecg-heart-rate/EcgHeartRateCalculator'
    ).then((mod) => ({
      default: mod.EcgHeartRateCalculator,
    })),
  ),
  EconomicValueAddedCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/economic-value-added/EconomicValueAddedCalculator'
    ).then((mod) => ({
      default: mod.EconomicValueAddedCalculator,
    })),
  ),
  EddCalculator: lazyTool(() =>
    import('@/tools/calculators/edd/EddCalculator').then((mod) => ({
      default: mod.EddCalculator,
    })),
  ),
  EffectiveDurationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/effective-duration/EffectiveDurationCalculator'
    ).then((mod) => ({
      default: mod.EffectiveDurationCalculator,
    })),
  ),
  EmiCalculator: lazyTool(() =>
    import('@/tools/calculators/emi/EmiCalculator').then((mod) => ({
      default: mod.EmiCalculator,
    })),
  ),
  EpfCalculator: lazyTool(() =>
    import('@/tools/calculators/epf/EpfCalculator').then((mod) => ({
      default: mod.EpfCalculator,
    })),
  ),
  EnterpriseValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/enterprise-value/EnterpriseValueCalculator'
    ).then((mod) => ({
      default: mod.EnterpriseValueCalculator,
    })),
  ),
  EbtCalculator: lazyTool(() =>
    import('@/tools/calculators/ebt/EbtCalculator').then((mod) => ({
      default: mod.EbtCalculator,
    })),
  ),
  EstateTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/estate-tax/EstateTaxCalculator').then((mod) => ({
      default: mod.EstateTaxCalculator,
    })),
  ),
  ExcessiveWeightGainInPregnancyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/excessive-weight-gain-in-pregnancy/ExcessiveWeightGainInPregnancyCalculator'
    ).then((mod) => ({
      default: mod.ExcessiveWeightGainInPregnancyCalculator,
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
  FlangeSizeCalculator: lazyTool(() =>
    import('@/tools/calculators/flange-size/FlangeSizeCalculator').then((mod) => ({
      default: mod.FlangeSizeCalculator,
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
  GrahamNumberCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/graham-number/GrahamNumberCalculator'
    ).then((mod) => ({
      default: mod.GrahamNumberCalculator,
    })),
  ),
  HasBledCalculator: lazyTool(() =>
    import('@/tools/calculators/has-bled/HasBledCalculator').then((mod) => ({
      default: mod.HasBledCalculator,
    })),
  ),
  HeartScoreCalculator: lazyTool(() =>
    import('@/tools/calculators/heart-score/HeartScoreCalculator').then((mod) => ({
      default: mod.HeartScoreCalculator,
    })),
  ),
  HeartFailureLifeExpectancyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/heart-failure-life-expectancy/HeartFailureLifeExpectancyCalculator'
    ).then((mod) => ({
      default: mod.HeartFailureLifeExpectancyCalculator,
    })),
  ),
  HcgLevelsCalculator: lazyTool(() =>
    import('@/tools/calculators/hcg-levels/HcgLevelsCalculator').then((mod) => ({
      default: mod.HcgLevelsCalculator,
    })),
  ),
  ImplantationCalculator: lazyTool(() =>
    import('@/tools/calculators/implantation/ImplantationCalculator').then(
      (mod) => ({
        default: mod.ImplantationCalculator,
      }),
    ),
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
  LevothyroxineDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/levothyroxine-dosage/LevothyroxineDosageCalculator'
    ).then((mod) => ({
      default: mod.LevothyroxineDosageCalculator,
    })),
  ),
  LutealPhaseCalculator: lazyTool(() =>
    import('@/tools/calculators/luteal-phase/LutealPhaseCalculator').then(
      (mod) => ({
        default: mod.LutealPhaseCalculator,
      }),
    ),
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
  QuickRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/quick-ratio/QuickRatioCalculator').then(
      (mod) => ({
        default: mod.QuickRatioCalculator,
      })
    )
  ),
  QpQsCalculator: lazyTool(() =>
    import('@/tools/calculators/qpqs/QpQsCalculator').then((mod) => ({
      default: mod.QpQsCalculator,
    })),
  ),
  QtcCalculator: lazyTool(() =>
    import('@/tools/calculators/qtc/QtcCalculator').then((mod) => ({
      default: mod.QtcCalculator,
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
  MarginalCostCalculator: lazyTool(() =>
    import('@/tools/calculators/marginal-cost/MarginalCostCalculator').then((mod) => ({
      default: mod.MarginalCostCalculator,
    })),
  ),
  MarketCapitalizationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/market-capitalization/MarketCapitalizationCalculator'
    ).then((mod) => ({
      default: mod.MarketCapitalizationCalculator,
    })),
  ),
  MaturityValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/maturity-value/MaturityValueCalculator'
    ).then((mod) => ({
      default: mod.MaturityValueCalculator,
    })),
  ),
  MirrCalculator: lazyTool(() =>
    import('@/tools/calculators/mirr/MirrCalculator').then((mod) => ({
      default: mod.MirrCalculator,
    })),
  ),
  MitralValveAreaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mitral-valve-area/MitralValveAreaCalculator'
    ).then((mod) => ({
      default: mod.MitralValveAreaCalculator,
    })),
  ),
  MoneyCounterCalculator: lazyTool(() =>
    import('@/tools/calculators/money-counter/MoneyCounterCalculator').then((mod) => ({
      default: mod.MoneyCounterCalculator,
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
  NationalInsuranceCalculator: lazyTool(() =>
    import('@/tools/calculators/national-insurance/NationalInsuranceCalculator').then(
      (mod) => ({
        default: mod.NationalInsuranceCalculator,
      }),
    ),
  ),
  NavCalculator: lazyTool(() =>
    import('@/tools/calculators/nav/NavCalculator').then((mod) => ({
      default: mod.NavCalculator,
    })),
  ),
  NavyBodyFatCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/navy-body-fat/NavyBodyFatCalculator'
    ).then((mod) => ({
      default: mod.NavyBodyFatCalculator,
    })),
  ),
  NuchalTranslucencyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/nuchal-translucency/NuchalTranslucencyCalculator'
    ).then((mod) => ({
      default: mod.NuchalTranslucencyCalculator,
    })),
  ),
  SkinfoldBodyFatCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/skinfold-body-fat/SkinfoldBodyFatCalculator'
    ).then((mod) => ({
      default: mod.SkinfoldBodyFatCalculator,
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
  ParacetamolDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/paracetamol-dosage/ParacetamolDosageCalculator'
    ).then((mod) => ({
      default: mod.ParacetamolDosageCalculator,
    })),
  ),
  PaduaScoreCalculator: lazyTool(() =>
    import('@/tools/calculators/padua-score/PaduaScoreCalculator').then((mod) => ({
      default: mod.PaduaScoreCalculator,
    })),
  ),
  PayPalFeeCalculator: lazyTool(() =>
    import('@/tools/calculators/paypal-fee/PayPalFeeCalculator').then((mod) => ({
      default: mod.PayPalFeeCalculator,
    })),
  ),
  PayRaiseCalculator: lazyTool(() =>
    import('@/tools/calculators/pay-raise/PayRaiseCalculator').then((mod) => ({
      default: mod.PayRaiseCalculator,
    })),
  ),
  PeakFlowCalculator: lazyTool(() =>
    import('@/tools/calculators/peak-flow/PeakFlowCalculator').then((mod) => ({
      default: mod.PeakFlowCalculator,
    })),
  ),
  PegRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/peg-ratio/PegRatioCalculator').then((mod) => ({
      default: mod.PegRatioCalculator,
    })),
  ),
  PenceToPoundsConverter: lazyTool(() =>
    import('@/tools/calculators/pence-to-pounds/PenceToPoundsConverter').then((mod) => ({
      default: mod.PenceToPoundsConverter,
    })),
  ),
  PearlIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pearl-index/PearlIndexCalculator'
    ).then((mod) => ({
      default: mod.PearlIndexCalculator,
    })),
  ),
  PensionCalculator: lazyTool(() =>
    import('@/tools/calculators/pension/PensionCalculator').then((mod) => ({
      default: mod.PensionCalculator,
    })),
  ),
  PercCalculator: lazyTool(() =>
    import('@/tools/calculators/perc/PercCalculator').then((mod) => ({
      default: mod.PercCalculator,
    })),
  ),
  PercentOffCalculator: lazyTool(() =>
    import('@/tools/calculators/percent-off/PercentOffCalculator').then((mod) => ({
      default: mod.PercentOffCalculator,
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
  PeriodCalculator: lazyTool(() =>
    import('@/tools/calculators/period/PeriodCalculator').then((mod) => ({
      default: mod.PeriodCalculator,
    })),
  ),
  PerpetuityCalculator: lazyTool(() =>
    import('@/tools/calculators/perpetuity/PerpetuityCalculator').then((mod) => ({
      default: mod.PerpetuityCalculator,
    })),
  ),
  PfRatioCalculator: lazyTool(() =>
    import('@/tools/calculators/pf-ratio/PfRatioCalculator').then((mod) => ({
      default: mod.PfRatioCalculator,
    })),
  ),
  PisaCalculator: lazyTool(() =>
    import('@/tools/calculators/pisa/PisaCalculator').then((mod) => ({
      default: mod.PisaCalculator,
    })),
  ),
  PitiCalculator: lazyTool(() =>
    import('@/tools/calculators/piti/PitiCalculator').then((mod) => ({
      default: mod.PitiCalculator,
    })),
  ),
  PivotPointCalculator: lazyTool(() =>
    import('@/tools/calculators/pivot-point/PivotPointCalculator').then((mod) => ({
      default: mod.PivotPointCalculator,
    })),
  ),
  PortfolioBetaCalculator: lazyTool(() =>
    import('@/tools/calculators/portfolio-beta/PortfolioBetaCalculator').then((mod) => ({
      default: mod.PortfolioBetaCalculator,
    })),
  ),
  PositivePregnancyFollowUpCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/positive-pregnancy-follow-up/PositivePregnancyFollowUpCalculator'
    ).then((mod) => ({
      default: mod.PositivePregnancyFollowUpCalculator,
    })),
  ),
  PositivePregnancyTestAt3WeeksCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/positive-pregnancy-test-3-weeks/PositivePregnancyTestAt3WeeksCalculator'
    ).then((mod) => ({
      default: mod.PositivePregnancyTestAt3WeeksCalculator,
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
  PregnancyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pregnancy/PregnancyCalculator'
    ).then((mod) => ({
      default: mod.PregnancyCalculator,
    })),
  ),
  PregnancyConceptionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pregnancy-conception/PregnancyConceptionCalculator'
    ).then((mod) => ({
      default: mod.PregnancyConceptionCalculator,
    })),
  ),
  PregnancyTestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pregnancy-test/PregnancyTestCalculator'
    ).then((mod) => ({
      default: mod.PregnancyTestCalculator,
    })),
  ),
  PregnancyWeightGainCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pregnancy-weight-gain/PregnancyWeightGainCalculator'
    ).then((mod) => ({
      default: mod.PregnancyWeightGainCalculator,
    })),
  ),
  PregnancyWeightGainWeekByWeekCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pregnancy-weight-gain-week-by-week/PregnancyWeightGainWeekByWeekCalculator'
    ).then((mod) => ({
      default: mod.PregnancyWeightGainWeekByWeekCalculator,
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
  PriceElasticityOfSupplyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-elasticity-of-supply/PriceElasticityOfSupplyCalculator'
    ).then((mod) => ({
      default: mod.PriceElasticityOfSupplyCalculator,
    })),
  ),
  PriceQuantityCalculator: lazyTool(() =>
    import('@/tools/calculators/price-quantity/PriceQuantityCalculator').then((mod) => ({
      default: mod.PriceQuantityCalculator,
    })),
  ),
  PriceToBookRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-to-book-ratio/PriceToBookRatioCalculator'
    ).then((mod) => ({
      default: mod.PriceToBookRatioCalculator,
    })),
  ),
  PriceToCashFlowRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-to-cash-flow-ratio/PriceToCashFlowRatioCalculator'
    ).then((mod) => ({
      default: mod.PriceToCashFlowRatioCalculator,
    })),
  ),
  PriceToEarningsRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/price-to-earnings-ratio/PriceToEarningsRatioCalculator'
    ).then((mod) => ({
      default: mod.PriceToEarningsRatioCalculator,
    })),
  ),
  PrivateSavingsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/private-savings/PrivateSavingsCalculator'
    ).then((mod) => ({
      default: mod.PrivateSavingsCalculator,
    })),
  ),
  ProgesteroneToEstrogenRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/progesterone-to-estrogen-ratio/ProgesteroneToEstrogenRatioCalculator'
    ).then((mod) => ({
      default: mod.ProgesteroneToEstrogenRatioCalculator,
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
  PutCallParityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/put-call-parity/PutCallParityCalculator'
    ).then((mod) => ({
      default: mod.PutCallParityCalculator,
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
  PvrCalculator: lazyTool(() =>
    import('@/tools/calculators/pvr/PvrCalculator').then((mod) => ({
      default: mod.PvrCalculator,
    })),
  ),
  RateOfPayCalculator: lazyTool(() =>
    import('@/tools/calculators/rate-of-pay/RateOfPayCalculator').then((mod) => ({
      default: mod.RateOfPayCalculator,
    })),
  ),
  RateOfReturnCalculator: lazyTool(() =>
    import('@/tools/calculators/rate-of-return/RateOfReturnCalculator').then((mod) => ({
      default: mod.RateOfReturnCalculator,
    })),
  ),
  RatePressureProductCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/rate-pressure-product/RatePressureProductCalculator'
    ).then((mod) => ({
      default: mod.RatePressureProductCalculator,
    })),
  ),
  RbcIndicesCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/rbc-indices/RbcIndicesCalculator'
    ).then((mod) => ({
      default: mod.RbcIndicesCalculator,
    })),
  ),
  RdCalculator: lazyTool(() =>
    import('@/tools/calculators/rd/RdCalculator').then((mod) => ({
      default: mod.RdCalculator,
    })),
  ),
  RealEstateCommissionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/real-estate-commission/RealEstateCommissionCalculator'
    ).then((mod) => ({
      default: mod.RealEstateCommissionCalculator,
    })),
  ),
  RealGdpCalculator: lazyTool(() =>
    import('@/tools/calculators/real-gdp/RealGdpCalculator').then((mod) => ({
      default: mod.RealGdpCalculator,
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
  RelativeStrengthIndexCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/relative-strength-index/RelativeStrengthIndexCalculator'
    ).then((mod) => ({
      default: mod.RelativeStrengthIndexCalculator,
    })),
  ),
  ReserveRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/reserve-ratio/ReserveRatioCalculator'
    ).then((mod) => ({
      default: mod.ReserveRatioCalculator,
    })),
  ),
  ResidualIncomeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/residual-income/ResidualIncomeCalculator'
    ).then((mod) => ({
      default: mod.ResidualIncomeCalculator,
    })),
  ),
  RetirementWithdrawalCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/retirement-withdrawal/RetirementWithdrawalCalculator'
    ).then((mod) => ({
      default: mod.RetirementWithdrawalCalculator,
    })),
  ),
  ReturnOnAssetsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/return-on-assets/ReturnOnAssetsCalculator'
    ).then((mod) => ({
      default: mod.ReturnOnAssetsCalculator,
    })),
  ),
  ReturnOnEquityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/return-on-equity/ReturnOnEquityCalculator'
    ).then((mod) => ({
      default: mod.ReturnOnEquityCalculator,
    })),
  ),
  RoicCalculator: lazyTool(() =>
    import('@/tools/calculators/roic/RoicCalculator').then((mod) => ({
      default: mod.RoicCalculator,
    })),
  ),
  RothIraCalculator: lazyTool(() =>
    import('@/tools/calculators/roth-ira/RothIraCalculator').then((mod) => ({
      default: mod.RothIraCalculator,
    })),
  ),
  SustainableGrowthRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/sustainable-growth-rate/SustainableGrowthRateCalculator'
    ).then((mod) => ({
      default: mod.SustainableGrowthRateCalculator,
    })),
  ),
  SwpCalculator: lazyTool(() =>
    import('@/tools/calculators/swp/SwpCalculator').then((mod) => ({
      default: mod.SwpCalculator,
    })),
  ),
  UnleveredBetaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/unlevered-beta/UnleveredBetaCalculator'
    ).then((mod) => ({
      default: mod.UnleveredBetaCalculator,
    })),
  ),
  WaccCalculator: lazyTool(() =>
    import('@/tools/calculators/wacc/WaccCalculator').then((mod) => ({
      default: mod.WaccCalculator,
    })),
  ),
  YieldToMaturityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/yield-to-maturity/YieldToMaturityCalculator'
    ).then((mod) => ({
      default: mod.YieldToMaturityCalculator,
    })),
  ),
  YieldToCallCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/yield-to-call/YieldToCallCalculator'
    ).then((mod) => ({
      default: mod.YieldToCallCalculator,
    })),
  ),
  UkCoinWeightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/uk-coin-weight/UkCoinWeightCalculator'
    ).then((mod) => ({
      default: mod.UkCoinWeightCalculator,
    })),
  ),
  BuyingPowerCalculator: lazyTool(() =>
    import('@/tools/calculators/buying-power/BuyingPowerCalculator').then(
      (mod) => ({
        default: mod.BuyingPowerCalculator,
      }),
    ),
  ),
  CarryTradeCalculator: lazyTool(() =>
    import('@/tools/calculators/carry-trade/CarryTradeCalculator').then(
      (mod) => ({
        default: mod.CarryTradeCalculator,
      }),
    ),
  ),
  CobbDouglasCalculator: lazyTool(() =>
    import('@/tools/calculators/cobb-douglas/CobbDouglasCalculator').then(
      (mod) => ({
        default: mod.CobbDouglasCalculator,
      }),
    ),
  ),
  CpiInflationCalculator: lazyTool(() =>
    import('@/tools/calculators/cpi-inflation/CpiInflationCalculator').then(
      (mod) => ({
        default: mod.CpiInflationCalculator,
      }),
    ),
  ),
  CurrencyCalculator: lazyTool(() =>
    import('@/tools/calculators/currency/CurrencyCalculator').then((mod) => ({
      default: mod.CurrencyCalculator,
    })),
  ),
  CurrencyForwardCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/currency-forward/CurrencyForwardCalculator'
    ).then((mod) => ({
      default: mod.CurrencyForwardCalculator,
    })),
  ),
  DeadSpaceCalculator: lazyTool(() =>
    import('@/tools/calculators/dead-space/DeadSpaceCalculator').then((mod) => ({
      default: mod.DeadSpaceCalculator,
    })),
  ),
  DeadweightLossCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/deadweight-loss/DeadweightLossCalculator'
    ).then((mod) => ({
      default: mod.DeadweightLossCalculator,
    })),
  ),
  DiscretionaryIncomeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/discretionary-income/DiscretionaryIncomeCalculator'
    ).then((mod) => ({
      default: mod.DiscretionaryIncomeCalculator,
    })),
  ),
  FisherEffectCalculator: lazyTool(() =>
    import('@/tools/calculators/fisher-effect/FisherEffectCalculator').then(
      (mod) => ({
        default: mod.FisherEffectCalculator,
      }),
    ),
  ),
  FaceShapeCalculator: lazyTool(() =>
    import('@/tools/calculators/face-shape/FaceShapeCalculator').then((mod) => ({
      default: mod.FaceShapeCalculator,
    })),
  ),
  FalseNegativePregnancyTestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/false-negative-pregnancy-test/FalseNegativePregnancyTestCalculator'
    ).then((mod) => ({
      default: mod.FalseNegativePregnancyTestCalculator,
    })),
  ),
  FertilityByAgeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fertility-by-age/FertilityByAgeCalculator'
    ).then((mod) => ({
      default: mod.FertilityByAgeCalculator,
    })),
  ),
  Fev1FvcRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fev1-fvc-ratio/Fev1FvcCalculator'
    ).then((mod) => ({
      default: mod.Fev1FvcRatioCalculator,
    })),
  ),
  FisherEquationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fisher-equation/FisherEquationCalculator'
    ).then((mod) => ({
      default: mod.FisherEquationCalculator,
    })),
  ),
  ForwardPremiumCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/forward-premium/ForwardPremiumCalculator'
    ).then((mod) => ({
      default: mod.ForwardPremiumCalculator,
    })),
  ),
  ForwardRateCalculator: lazyTool(() =>
    import('@/tools/calculators/forward-rate/ForwardRateCalculator').then(
      (mod) => ({
        default: mod.ForwardRateCalculator,
      }),
    ),
  ),
  FourTScoreCalculator: lazyTool(() =>
    import('@/tools/calculators/four-t-score/FourTScoreCalculator').then(
      (mod) => ({
        default: mod.FourTScoreCalculator,
      }),
    ),
  ),
  FraminghamRiskCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/framingham-risk/FraminghamRiskCalculator'
    ).then((mod) => ({
      default: mod.FraminghamRiskCalculator,
    })),
  ),
  FuturesContractsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/futures-contracts/FuturesContractsCalculator'
    ).then((mod) => ({
      default: mod.FuturesContractsCalculator,
    })),
  ),
  GabapentinDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gabapentin-dosage/GabapentinDosageCalculator'
    ).then((mod) => ({
      default: mod.GabapentinDosageCalculator,
    })),
  ),
  ComparativeAdvantageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/comparative-advantage/ComparativeAdvantageCalculator'
    ).then((mod) => ({
      default: mod.ComparativeAdvantageCalculator,
    })),
  ),
  GdpDeflatorFormulaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gdp-deflator-formula/GdpDeflatorCalculator'
    ).then((mod) => ({
      default: mod.GdpDeflatorFormulaCalculator,
    })),
  ),
  GdpGapCalculator: lazyTool(() =>
    import('@/tools/calculators/gdp-gap/GdpGapCalculator').then((mod) => ({
      default: mod.GdpGapCalculator,
    })),
  ),
  GdpGrowthRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gdp-growth-rate/GdpGrowthCalculator'
    ).then((mod) => ({
      default: mod.GdpGrowthRateCalculator,
    })),
  ),
  GdpPerCapitaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gdp-per-capita/GdpPerCapitaCalculator'
    ).then((mod) => ({
      default: mod.GdpPerCapitaCalculator,
    })),
  ),
  GiniCoefficientCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gini-coefficient/GiniCalculator'
    ).then((mod) => ({
      default: mod.GiniCoefficientCalculator,
    })),
  ),
  InflationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/inflation/InflationCalculator'
    ).then((mod) => ({
      default: mod.InflationCalculator,
    })),
  ),
  LaborForceParticipationRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/labor-force-participation/LfprCalculator'
    ).then((mod) => ({
      default: mod.LaborForceParticipationRateCalculator,
    })),
  ),
  LcrCalculator: lazyTool(() =>
    import('@/tools/calculators/lcr/LcrCalculator').then((mod) => ({
      default: mod.LcrCalculator,
    })),
  ),
  LgdCalculator: lazyTool(() =>
    import('@/tools/calculators/lgd/LgdCalculator').then((mod) => ({
      default: mod.LgdCalculator,
    })),
  ),
  LumpsumCalculator: lazyTool(() =>
    import('@/tools/calculators/lumpsum/LumpsumCalculator').then((mod) => ({
      default: mod.LumpsumCalculator,
    })),
  ),
  MoneyMultiplierCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/money-multiplier/MoneyMultiplierCalculator'
    ).then((mod) => ({
      default: mod.MoneyMultiplierCalculator,
    })),
  ),
  MoneySupplyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/money-supply/MoneySupplyCalculator'
    ).then((mod) => ({
      default: mod.MoneySupplyCalculator,
    })),
  ),
  MoratoriumCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/moratorium/MoratoriumCalculator'
    ).then((mod) => ({
      default: mod.MoratoriumCalculator,
    })),
  ),
  MpcCalculator: lazyTool(() =>
    import('@/tools/calculators/mpc/MpcCalculator').then((mod) => ({
      default: mod.MpcCalculator,
    })),
  ),
  NsfrCalculator: lazyTool(() =>
    import('@/tools/calculators/nsfr/NsfrCalculator').then((mod) => ({
      default: mod.NsfrCalculator,
    })),
  ),
  OkunsLawCalculator: lazyTool(() =>
    import('@/tools/calculators/okuns-law/OkunsLawCalculator').then((mod) => ({
      default: mod.OkunsLawCalculator,
    })),
  ),
  PhillipsCurveCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/phillips-curve/PhillipsCurveCalculator'
    ).then((mod) => ({
      default: mod.PhillipsCurveCalculator,
    })),
  ),
  PomisCalculator: lazyTool(() =>
    import('@/tools/calculators/pomis/PomisCalculator').then((mod) => ({
      default: mod.PomisCalculator,
    })),
  ),
  PpfCalculator: lazyTool(() =>
    import('@/tools/calculators/ppf/PpfCalculator').then((mod) => ({
      default: mod.PpfCalculator,
    })),
  ),
  PppCalculator: lazyTool(() =>
    import('@/tools/calculators/ppp/PppCalculator').then((mod) => ({
      default: mod.PppCalculator,
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
  BiweeklyPayCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/biweekly-pay/BiweeklyPayCalculator'
    ).then((mod) => ({
      default: mod.BiweeklyPayCalculator,
    })),
  ),
  SemiMonthlyPayCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/semi-monthly-pay/SemiMonthlyPayCalculator'
    ).then((mod) => ({
      default: mod.SemiMonthlyPayCalculator,
    })),
  ),
  BlackFridayCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/black-friday/BlackFridayCalculator'
    ).then((mod) => ({
      default: mod.BlackFridayCalculator,
    })),
  ),
  BlackScholesCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/black-scholes/BlackScholesCalculator'
    ).then((mod) => ({
      default: mod.BlackScholesCalculator,
    })),
  ),
  DueDateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/due-date/DueDateCalculator'
    ).then((mod) => ({
      default: mod.DueDateCalculator,
    })),
  ),
  DopplerEchoCardiacOutputCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/doppler-echo-cardiac-output/DopplerEchoCardiacOutputCalculator'
    ).then((mod) => ({
      default: mod.DopplerEchoCardiacOutputCalculator,
    })),
  ),
  DukeTreadmillScoreCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/duke-treadmill-score/DukeTreadmillScoreCalculator'
    ).then((mod) => ({
      default: mod.DukeTreadmillScoreCalculator,
    })),
  ),
  BloodDonationDueDateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blood-donation-due-date/BloodDonationDueDateCalculator'
    ).then((mod) => ({
      default: mod.BloodDonationDueDateCalculator,
    })),
  ),
  IsBmiPregnancyWeightIndicatorCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/is-bmi-pregnancy-weight-indicator/IsBmiPregnancyWeightIndicatorCalculator'
    ).then((mod) => ({
      default: mod.IsBmiPregnancyWeightIndicatorCalculator,
    })),
  ),
  BloodPregnancyHcgCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blood-pregnancy-hcg/BloodPregnancyHcgCalculator'
    ).then((mod) => ({
      default: mod.BloodPregnancyHcgCalculator,
    })),
  ),
  BloodPressureCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/blood-pressure/BloodPressureCalculator'
    ).then((mod) => ({
      default: mod.BloodPressureCalculator,
    })),
  ),
  BoatLoanCalculator: lazyTool(() =>
    import('@/tools/calculators/boat-loan/BoatLoanCalculator').then((mod) => ({
      default: mod.BoatLoanCalculator,
    })),
  ),
  BoatSpeedCalculator: lazyTool(() =>
    import('@/tools/calculators/boat-speed/BoatSpeedCalculator').then((mod) => ({
      default: mod.BoatSpeedCalculator,
    })),
  ),
  BoostHorsepowerCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/boost-horsepower/BoostHorsepowerCalculator'
    ).then((mod) => ({
      default: mod.BoostHorsepowerCalculator,
    })),
  ),
  HorsepowerCalculator: lazyTool(() =>
    import('@/tools/calculators/horsepower/HorsepowerCalculator').then(
      (mod) => ({
        default: mod.HorsepowerCalculator,
      }),
    ),
  ),
  BsfcCalculator: lazyTool(() =>
    import('@/tools/calculators/bsfc/BsfcCalculator').then((mod) => ({
      default: mod.BsfcCalculator,
    })),
  ),
  BodyFatCalculator: lazyTool(() =>
    import('@/tools/calculators/body-fat/BodyFatCalculator').then((mod) => ({
      default: mod.BodyFatCalculator,
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
  LeaseCalculator: lazyTool(() =>
    import('@/tools/calculators/lease/LeaseCalculator').then((mod) => ({
      default: mod.LeaseCalculator,
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
  LungCancerRiskCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lung-cancer-risk/LungCancerRiskCalculator'
    ).then((mod) => ({
      default: mod.LungCancerRiskCalculator,
    })),
  ),
  LungCapacityCalculator: lazyTool(() =>
    import('@/tools/calculators/lung-capacity/LungCapacityCalculator').then(
      (mod) => ({
        default: mod.LungCapacityCalculator,
      }),
    ),
  ),
  LungNoduleGrowthRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lung-nodule-growth-rate/LungNoduleGrowthRateCalculator'
    ).then((mod) => ({
      default: mod.LungNoduleGrowthRateCalculator,
    })),
  ),
  VitalCapacityCalculator: lazyTool(() =>
    import('@/tools/calculators/vital-capacity/VitalCapacityCalculator').then(
      (mod) => ({
        default: mod.VitalCapacityCalculator,
      }),
    ),
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
  CapitalGainsTaxUkCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/capital-gains-tax-uk/CapitalGainsTaxUkCalculator'
    ).then((mod) => ({
      default: mod.CapitalGainsTaxUkCalculator,
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
  CompressionRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/compression-ratio/CompressionRatioCalculator'
    ).then((mod) => ({
      default: mod.CompressionRatioCalculator,
    })),
  ),
  CompressionRatioToPsiCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/compression-ratio-to-psi/CompressionRatioToPsiCalculator'
    ).then((mod) => ({
      default: mod.CompressionRatioToPsiCalculator,
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
  CouponRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/coupon-rate/CouponRateCalculator'
    ).then((mod) => ({
      default: mod.CouponRateCalculator,
    })),
  ),
  CreditSpreadCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-spread/CreditSpreadCalculator'
    ).then((mod) => ({
      default: mod.CreditSpreadCalculator,
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
  CreditUtilizationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/credit-utilization/CreditUtilizationCalculator'
    ).then((mod) => ({
      default: mod.CreditUtilizationCalculator,
    })),
  ),
  CrossExchangeRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cross-exchange-rate/CrossExchangeRateCalculator'
    ).then((mod) => ({
      default: mod.CrossExchangeRateCalculator,
    })),
  ),
  CrosswindCalculator: lazyTool(() =>
    import('@/tools/calculators/crosswind/CrosswindCalculator').then((mod) => ({
      default: mod.CrosswindCalculator,
    })),
  ),
  CrownRumpLengthCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/crown-rump-length/CrownRumpLengthCalculator'
    ).then((mod) => ({
      default: mod.CrownRumpLengthCalculator,
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
  DriveTimeCalculator: lazyTool(() =>
    import('@/tools/calculators/drive-time/DriveTimeCalculator').then((mod) => ({
      default: mod.DriveTimeCalculator,
    })),
  ),
  EngineHoursToMilesConverter: lazyTool(() =>
    import(
      '@/tools/calculators/engine-hours-to-miles/EngineHoursToMilesCalculator'
    ).then((mod) => ({
      default: mod.EngineHoursToMilesConverter,
    })),
  ),
  FlightRadiationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/flight-radiation/FlightRadiationCalculator'
    ).then((mod) => ({
      default: mod.FlightRadiationCalculator,
    })),
  ),
  FuelCostCalculator: lazyTool(() =>
    import('@/tools/calculators/fuel-cost/FuelCostCalculator').then((mod) => ({
      default: mod.FuelCostCalculator,
    })),
  ),
  FuelInjectorCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fuel-injector/FuelInjectorCalculator'
    ).then((mod) => ({
      default: mod.FuelInjectorCalculator,
    })),
  ),
  FuelPumpCalculator: lazyTool(() =>
    import('@/tools/calculators/fuel-pump/FuelPumpCalculator').then((mod) => ({
      default: mod.FuelPumpCalculator,
    })),
  ),
  GasCalculator: lazyTool(() =>
    import('@/tools/calculators/gas/GasCalculator').then((mod) => ({
      default: mod.GasCalculator,
    })),
  ),
  GasOilRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/gas-oil-ratio/GasOilRatioCalculator'
    ).then((mod) => ({
      default: mod.GasOilRatioCalculator,
    })),
  ),
  GvwrCalculator: lazyTool(() =>
    import('@/tools/calculators/gvwr/GvwrCalculator').then((mod) => ({
      default: mod.GvwrCalculator,
    })),
  ),
  IdlingFuelConsumptionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/idling-fuel-consumption/IdlingFuelConsumptionCalculator'
    ).then((mod) => ({
      default: mod.IdlingFuelConsumptionCalculator,
    })),
  ),
  MilesPerYearCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/miles-per-year/MilesPerYearCalculator'
    ).then((mod) => ({
      default: mod.MilesPerYearCalculator,
    })),
  ),
  MilesToDollarsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/miles-to-dollars/MilesToDollarsCalculator'
    ).then((mod) => ({
      default: mod.MilesToDollarsCalculator,
    })),
  ),
  MilesToHoursConverter: lazyTool(() =>
    import(
      '@/tools/calculators/miles-to-hours/MilesToHoursCalculator'
    ).then((mod) => ({
      default: mod.MilesToHoursConverter,
    })),
  ),
  MpgCalculator: lazyTool(() =>
    import('@/tools/calculators/mpg/MpgCalculator').then((mod) => ({
      default: mod.MpgCalculator,
    })),
  ),
  NauticalMileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/nautical-mile/NauticalMileCalculator'
    ).then((mod) => ({
      default: mod.NauticalMileCalculator,
    })),
  ),
  PulsePerMileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/pulse-per-mile/PulsePerMileCalculator'
    ).then((mod) => ({
      default: mod.PulsePerMileCalculator,
    })),
  ),
  RpmCalculator: lazyTool(() =>
    import('@/tools/calculators/rpm/RpmCalculator').then((mod) => ({
      default: mod.RpmCalculator,
    })),
  ),
  SpeedCalculator: lazyTool(() =>
    import('@/tools/calculators/speed/SpeedCalculator').then((mod) => ({
      default: mod.SpeedCalculator,
    })),
  ),
  SpeedometerGearCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/speedometer-gear/SpeedometerGearCalculator'
    ).then((mod) => ({
      default: mod.SpeedometerGearCalculator,
    })),
  ),
  TeslaChargingCostCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/tesla-charging-cost/TeslaChargingCostCalculator'
    ).then((mod) => ({
      default: mod.TeslaChargingCostCalculator,
    })),
  ),
  TicketOptimizerCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ticket-optimizer/TicketOptimizerCalculator'
    ).then((mod) => ({
      default: mod.TicketOptimizerCalculator,
    })),
  ),
  TireSizeCalculator: lazyTool(() =>
    import('@/tools/calculators/tire-size/TireSizeCalculator').then((mod) => ({
      default: mod.TireSizeCalculator,
    })),
  ),
  TrafficDensityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/traffic-density/TrafficDensityCalculator'
    ).then((mod) => ({
      default: mod.TrafficDensityCalculator,
    })),
  ),
  TramadolDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/tramadol-dosage/TramadolDosageCalculator'
    ).then((mod) => ({
      default: mod.TramadolDosageCalculator,
    })),
  ),
  TripleDiscountCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/triple-discount/TripleDiscountCalculator'
    ).then((mod) => ({
      default: mod.TripleDiscountCalculator,
    })),
  ),
  TurboSizeCalculator: lazyTool(() =>
    import('@/tools/calculators/turbo-size/TurboSizeCalculator').then((mod) => ({
      default: mod.TurboSizeCalculator,
    })),
  ),
  WheelHorsepowerCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/wheel-horsepower/WheelHorsepowerCalculator'
    ).then((mod) => ({
      default: mod.WheelHorsepowerCalculator,
    })),
  ),
  WheelOffsetCalculator: lazyTool(() =>
    import('@/tools/calculators/wheel-offset/WheelOffsetCalculator').then(
      (mod) => ({
        default: mod.WheelOffsetCalculator,
      }),
    ),
  ),
  WinchSizeCalculator: lazyTool(() =>
    import('@/tools/calculators/winch-size/WinchSizeCalculator').then(
      (mod) => ({
        default: mod.WinchSizeCalculator,
      }),
    ),
  ),
  WindsockCalculator: lazyTool(() =>
    import('@/tools/calculators/windsock/WindsockCalculator').then((mod) => ({
      default: mod.WindsockCalculator,
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
  EjectionFractionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ejection-fraction/EjectionFractionCalculator'
    ).then((mod) => ({
      default: mod.EjectionFractionCalculator,
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
  EortcBladderCancerRecurrenceProgressionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/eortc-bladder-cancer-recurrence-progression/EortcBladderCancerRecurrenceProgressionCalculator'
    ).then((mod) => ({
      default: mod.EortcBladderCancerRecurrenceProgressionCalculator,
    })),
  ),
  EroaMitralRegurgitationCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/eroa-mitral-regurgitation/EroaMitralRegurgitationCalculator'
    ).then((mod) => ({
      default: mod.EroaMitralRegurgitationCalculator,
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
  FundalHeightCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fundal-height/FundalHeightCalculator'
    ).then((mod) => ({
      default: mod.FundalHeightCalculator,
    })),
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
  FetalWeightPercentileCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fetal-weight-percentile/FetalWeightPercentileCalculator'
    ).then((mod) => ({
      default: mod.FetalWeightPercentileCalculator,
    })),
  ),
  FfoCalculator: lazyTool(() =>
    import('@/tools/calculators/ffo/FfoCalculator').then((mod) => ({
      default: mod.FfoCalculator,
    })),
  ),
  FibonacciRetracementCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/fibonacci-retracement/FibonacciRetracementCalculator'
    ).then((mod) => ({
      default: mod.FibonacciRetracementCalculator,
    })),
  ),
  FicaTaxCalculator: lazyTool(() =>
    import('@/tools/calculators/fica-tax/FicaTaxCalculator').then((mod) => ({
      default: mod.FicaTaxCalculator,
    })),
  ),
  FreeFloatCalculator: lazyTool(() =>
    import('@/tools/calculators/free-float/FreeFloatCalculator').then(
      (mod) => ({
        default: mod.FreeFloatCalculator,
      }),
    ),
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
  TwinPregnancyWeightGainCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/twin-pregnancy-weight-gain/TwinPregnancyWeightGainCalculator'
    ).then((mod) => ({
      default: mod.TwinPregnancyWeightGainCalculator,
    })),
  ),
  TylenolDosageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/tylenol-dosage/TylenolDosageCalculator'
    ).then((mod) => ({
      default: mod.TylenolDosageCalculator,
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
  EndotrachealTubeSizeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/endotracheal-tube-size/EndotrachealTubeSizeCalculator'
    ).then((mod) => ({
      default: mod.EndotrachealTubeSizeCalculator,
    })),
  ),
  FinanceCalculator: lazyTool(() =>
    import('@/tools/calculators/finance/FinanceCalculator').then((mod) => ({
      default: mod.FinanceCalculator,
    })),
  ),
  FinanceChargeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/finance-charge/FinanceChargeCalculator'
    ).then((mod) => ({
      default: mod.FinanceChargeCalculator,
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
  LightsCriteriaCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lights-criteria/LightsCriteriaCalculator'
    ).then((mod) => ({
      default: mod.LightsCriteriaCalculator,
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
  RcriCalculator: lazyTool(() =>
    import('@/tools/calculators/rcri/RcriCalculator').then((mod) => ({
      default: mod.RcriCalculator,
    })),
  ),
  ReceivablesTurnoverRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/receivables-turnover-ratio/ReceivablesTurnoverRatioCalculator'
    ).then((mod) => ({
      default: mod.ReceivablesTurnoverRatioCalculator,
    })),
  ),
  RepaymentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/repayment/RepaymentCalculator'
    ).then((mod) => ({
      default: mod.RepaymentCalculator,
    })),
  ),
  RetainedEarningsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/retained-earnings/RetainedEarningsCalculator'
    ).then((mod) => ({
      default: mod.RetainedEarningsCalculator,
    })),
  ),
  RetentionRatioCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/retention-ratio/RetentionRatioCalculator'
    ).then((mod) => ({
      default: mod.RetentionRatioCalculator,
    })),
  ),
  ReverseDueDateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/reverse-due-date/ReverseDueDateCalculator'
    ).then((mod) => ({
      default: mod.ReverseDueDateCalculator,
    })),
  ),
  RevisedGenevaScoreCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/revised-geneva-score/RevisedGenevaScoreCalculator'
    ).then((mod) => ({
      default: mod.RevisedGenevaScoreCalculator,
    })),
  ),
  RetirementCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/retirement/RetirementCalculator'
    ).then((mod) => ({
      default: mod.RetirementCalculator,
    })),
  ),
  Rule2836Calculator: lazyTool(() =>
    import(
      '@/tools/calculators/rule-2836/Rule2836Calculator'
    ).then((mod) => ({
      default: mod.Rule2836Calculator,
    })),
  ),
  RuleOf72Calculator: lazyTool(() =>
    import(
      '@/tools/calculators/rule-of-72/RuleOf72Calculator'
    ).then((mod) => ({
      default: mod.RuleOf72Calculator,
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
  OptionsSpreadCalculator: lazyTool(() =>
    import('@/tools/calculators/options-spread/OptionsSpreadCalculator').then(
      (mod) => ({
        default: mod.OptionsSpreadCalculator,
      }),
    ),
  ),
  OvulationCalculator: lazyTool(() =>
    import('@/tools/calculators/ovulation/OvulationCalculator').then((mod) => ({
      default: mod.OvulationCalculator,
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
  HraExemptionCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hra-exemption/HraExemptionCalculator'
    ).then((mod) => ({
      default: mod.HraExemptionCalculator,
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
  HourlyToSalaryWithOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hourly-to-salary-with-overtime/HourlyToSalaryWithOvertimeCalculator'
    ).then((mod) => ({
      default: mod.HourlyToSalaryWithOvertimeCalculator,
    })),
  ),
  HourlyWageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hourly-wage/HourlyWageCalculator'
    ).then((mod) => ({
      default: mod.HourlyWageCalculator,
    })),
  ),
  HoursPayCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/hours-pay/HoursPayCalculator'
    ).then((mod) => ({
      default: mod.HoursPayCalculator,
    })),
  ),
  SellingLeaveDaysCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/selling-leave-days/SellingLeaveDaysCalculator'
    ).then((mod) => ({
      default: mod.SellingLeaveDaysCalculator,
    })),
  ),
  MonthlyIncomeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/monthly-income/MonthlyIncomeCalculator'
    ).then((mod) => ({
      default: mod.MonthlyIncomeCalculator,
    })),
  ),
  WageCalculator: lazyTool(() =>
    import('@/tools/calculators/wage/WageCalculator').then((mod) => ({
      default: mod.WageCalculator,
    })),
  ),
  WageToSalaryCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/wage-to-salary/WageToSalaryCalculator'
    ).then((mod) => ({
      default: mod.WageToSalaryCalculator,
    })),
  ),
  YearlyWageCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/yearly-wage/YearlyWageCalculator'
    ).then((mod) => ({
      default: mod.YearlyWageCalculator,
    })),
  ),
  MoneyPerHourCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/money-per-hour/MoneyPerHourCalculator'
    ).then((mod) => ({
      default: mod.MoneyPerHourCalculator,
    })),
  ),
  TimeAndAHalfCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/time-and-a-half/TimeAndAHalfCalculator'
    ).then((mod) => ({
      default: mod.TimeAndAHalfCalculator,
    })),
  ),
  MonthlyIncomeHourlyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/monthly-income-hourly/MonthlyIncomeHourlyCalculator'
    ).then((mod) => ({
      default: mod.MonthlyIncomeHourlyCalculator,
    })),
  ),
  BillableHoursCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/billable-hours/BillableHoursCalculator'
    ).then((mod) => ({
      default: mod.BillableHoursCalculator,
    })),
  ),
  BillRateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/bill-rate/BillRateCalculator'
    ).then((mod) => ({
      default: mod.BillRateCalculator,
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
  IntrinsicValueCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/intrinsic-value/IntrinsicValueCalculator'
    ).then((mod) => ({
      default: mod.IntrinsicValueCalculator,
    })),
  ),
  IraCalculator: lazyTool(() =>
    import('@/tools/calculators/ira/IraCalculator').then((mod) => ({
      default: mod.IraCalculator,
    })),
  ),
  IvfDueDateCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/ivf-due-date/IvfDueDateCalculator'
    ).then((mod) => ({
      default: mod.IvfDueDateCalculator,
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
  MortgageRefinanceCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/mortgage-refinance/MortgageRefinanceCalculator'
    ).then((mod) => ({
      default: mod.MortgageRefinanceCalculator,
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
  VbacCalculator: lazyTool(() =>
    import('@/tools/calculators/vbac/VbacCalculator').then((mod) => ({
      default: mod.VbacCalculator,
    })),
  ),
  VteRiskScorePregnancyCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/vte-risk-pregnancy/VteRiskPregnancyCalculator'
    ).then((mod) => ({
      default: mod.VteRiskPregnancyCalculator,
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
  StimulusCheckCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/stimulus-check/StimulusCheckCalculator'
    ).then((mod) => ({
      default: mod.StimulusCheckCalculator,
    })),
  ),
  CaresActUnemploymentBenefitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/cares-act-unemployment-benefit/CaresActUnemploymentBenefitCalculator'
    ).then((mod) => ({
      default: mod.CaresActUnemploymentBenefitCalculator,
    })),
  ),
  LwaUnemploymentBenefitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/lwa-unemployment-benefit/LwaUnemploymentBenefitCalculator'
    ).then((mod) => ({
      default: mod.LwaUnemploymentBenefitCalculator,
    })),
  ),
  HealsHeroesUnemploymentBenefitCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/heals-heroes-unemployment-benefit/HealsHeroesUnemploymentBenefitCalculator'
    ).then((mod) => ({
      default: mod.HealsHeroesUnemploymentBenefitCalculator,
    })),
  ),
  AustraliaFederalBudgetTaxCutsCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/australia-federal-budget-tax-cuts/AustraliaFederalBudgetTaxCutsCalculator'
    ).then((mod) => ({
      default: mod.AustraliaFederalBudgetTaxCutsCalculator,
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
