import type { ToolPageDetail } from '@/tools/page-detail';
import { isRegisteredComponentKey, type RegisteredComponentKey } from './keys';

const details: Record<RegisteredComponentKey, () => Promise<{ toolPageDetail: ToolPageDetail }>> = {
  AfterTaxCostOfDebtCalculator: () =>
    import('@/tools/calculators/after-tax-cost-of-debt/detail'),
  AltmanZScoreCalculator: () =>
    import('@/tools/calculators/altman-z-score/detail'),
  AnnuityCalculator: () =>
    import('@/tools/calculators/annuity/detail'),
  AnnuityPayoutCalculator: () =>
    import('@/tools/calculators/annuity-payout/detail'),
  AnorexicBmiCalculator: () =>
    import('@/tools/calculators/anorexic-bmi/detail'),
  AorticValveAreaCalculator: () =>
    import('@/tools/calculators/aortic-valve-area/detail'),
  ArmyBodyFatCalculator: () =>
    import('@/tools/calculators/army-body-fat/detail'),
  ArterialAgeCalculator: () =>
    import('@/tools/calculators/arterial-age/detail'),
  AuditCCalculator: () => import('@/tools/calculators/audit-c/detail'),
  AuditScoreCalculator: () => import('@/tools/calculators/audit-score/detail'),
  AutoLeaseCalculator: () => import('@/tools/calculators/auto-lease/detail'),
  AutoLoanCalculator: () => import('@/tools/calculators/auto-loan/detail'),
  CageCalculator: () => import('@/tools/calculators/cage/detail'),
  CaliforniaOvertimeCalculator: () =>
    import('@/tools/calculators/california-overtime/detail'),
  CalorieDeficitCalculator: () =>
    import('@/tools/calculators/calorie-deficit/detail'),
  CarbCalculator: () =>
    import('@/tools/calculators/carb-calculator/detail'),
  CarbohydrateCalculator: () =>
    import('@/tools/calculators/carbohydrate-calculator/detail'),
  CarboplatinCalculator: () =>
    import('@/tools/calculators/carboplatin/detail'),
  CefdinirDoseCalculator: () =>
    import('@/tools/calculators/cefdinir-dose/detail'),
  ChancesOfHavingTwinsCalculator: () =>
    import('@/tools/calculators/chances-of-having-twins/detail'),
  CorrectedCalciumCalculator: () =>
    import('@/tools/calculators/corrected-calcium/detail'),
  CorrectedMagnesiumCalculator: () =>
    import('@/tools/calculators/corrected-magnesium/detail'),
  CorrectedReticulocyteCountCalculator: () =>
    import('@/tools/calculators/corrected-reticulocyte-count/detail'),


  CreatinineClearanceCalculator: () =>

    import('@/tools/calculators/creatinine-clearance/detail'),
  DaptCalculator: () => import('@/tools/calculators/dapt/detail'),
  DebtAvalancheCalculator: () =>
    import('@/tools/calculators/debt-avalanche/detail'),
  DebtCalculator: () =>
    import('@/tools/calculators/debt/detail'),
  DebtServiceCoverageRatioCalculator: () =>
    import('@/tools/calculators/debt-service-coverage-ratio/detail'),
  DebtSnowballCalculator: () =>
    import('@/tools/calculators/debt-snowball/detail'),
  DebtToAssetRatioCalculator: () =>
    import('@/tools/calculators/debt-to-asset-ratio/detail'),
  DebtToCapitalRatioCalculator: () =>
    import('@/tools/calculators/debt-to-capital-ratio/detail'),
  DebtToEquityCalculator: () =>
    import('@/tools/calculators/debt-to-equity/detail'),
  DefensiveIntervalRatioCalculator: () =>
    import('@/tools/calculators/defensive-interval-ratio/detail'),
  DeferredAnnuityCalculator: () =>
    import('@/tools/calculators/deferred-annuity/detail'),
  DepreciationCalculator: () =>
    import('@/tools/calculators/depreciation/detail'),
  DicSyndromeCalculator: () =>
    import('@/tools/calculators/dic-syndrome/detail'),
  DietRiskScoreCalculator: () =>
    import('@/tools/calculators/diet-risk-score/detail'),
  DiffuseLargeBCellLymphomaPrognosisCalculator: () =>
    import(
      '@/tools/calculators/diffuse-large-b-cell-lymphoma-prognosis/detail'
    ),
  DrawLengthCalculator: () =>
    import('@/tools/calculators/draw-length/detail'),
  DripRateCalculator: () =>
    import('@/tools/calculators/drip-rate/detail'),
  DropsPerMinuteCalculator: () =>
    import('@/tools/calculators/drops-per-minute/detail'),
  DrugHalfLifeCalculator: () =>
    import('@/tools/calculators/drug-half-life/detail'),
  DriCalculator: () => import('@/tools/calculators/dri/detail'),
  EbitdaMarginCalculator: () =>
    import('@/tools/calculators/ebitda-margin/detail'),
  EerCalculator: () => import('@/tools/calculators/eer/detail'),
  FatIntakeCalculator: () =>
    import('@/tools/calculators/fat-intake/detail'),
  FenaCalculator: () => import('@/tools/calculators/fena/detail'),
  FeureaCalculator: () => import('@/tools/calculators/feurea/detail'),
  FfmiCalculator: () => import('@/tools/calculators/ffmi/detail'),
  FiberCalculator: () => import('@/tools/calculators/fiber/detail'),
  FishOilCalculator: () => import('@/tools/calculators/fish-oil/detail'),
  FloridaOvertimeCalculator: () =>
    import('@/tools/calculators/florida-overtime/detail'),
  FreeWaterDeficitCalculator: () =>
    import('@/tools/calculators/free-water-deficit/detail'),
  FreshFrozenPlasmaDoseCalculator: () =>
    import('@/tools/calculators/fresh-frozen-plasma-dose/detail'),
  FutureValueOfAnnuityCalculator: () =>
    import('@/tools/calculators/future-value-of-annuity/detail'),
  GastricSleeveWeightLossCalculator: () =>
    import('@/tools/calculators/gastric-sleeve-weight-loss/detail'),
  GeriatricBmiCalculator: () =>
    import('@/tools/calculators/geriatric-bmi/detail'),
  GestationalAgeCalculator: () =>
    import('@/tools/calculators/gestational-age/detail'),
  GfrEstimatedCalculator: () =>
    import('@/tools/calculators/gfr-estimated/detail'),
  GeorgiaOvertimeCalculator: () =>
    import('@/tools/calculators/georgia-overtime/detail'),
  GrossMarginCalculator: () =>
    import('@/tools/calculators/gross-margin/detail'),
  GrossRentMultiplierCalculator: () =>
    import('@/tools/calculators/gross-rent-multiplier/detail'),
  GorlinFormulaCalculator: () =>
    import('@/tools/calculators/gorlin-formula/detail'),
  GraceCalculator: () => import('@/tools/calculators/grace/detail'),
  GratuityCalculator: () => import('@/tools/calculators/gratuity/detail'),
  GrowingAnnuityCalculator: () =>
    import('@/tools/calculators/growing-annuity/detail'),
  GuptaRiskCalculator: () =>
    import('@/tools/calculators/gupta-risk/detail'),
  HematocritHemoglobinRatioCalculator: () =>
    import('@/tools/calculators/hematocrit-hemoglobin-ratio/detail'),
  HarrisBenedictCalculator: () =>
    import('@/tools/calculators/harris-benedict/detail'),
  HealthyWeightCalculator: () =>
    import('@/tools/calculators/healthy-weight/detail'),
  HydroxychloroquineDoseCalculator: () =>
    import('@/tools/calculators/hydroxychloroquine-dose/detail'),
  IllinoisOvertimeCalculator: () =>
    import('@/tools/calculators/illinois-overtime/detail'),
  ImmediateAnnuityCalculator: () =>
    import('@/tools/calculators/immediate-annuity/detail'),
  IifymCalculator: () => import('@/tools/calculators/iifym/detail'),
  InfantTylenolDosageCalculator: () =>
    import('@/tools/calculators/infant-tylenol-dosage/detail'),
  InrCalculator: () => import('@/tools/calculators/inr/detail'),
  InsulinDosageCalculator: () =>
    import('@/tools/calculators/insulin-dosage/detail'),
  InterestRateParityCalculator: () =>
    import('@/tools/calculators/interest-rate-parity/detail'),
  IronDeficiencyCalculator: () =>
    import('@/tools/calculators/iron-deficiency/detail'),
  IsotretinoinDoseCalculator: () =>
    import('@/tools/calculators/isotretinoin-dose/detail'),
  IvigDoseCalculator: () =>
    import('@/tools/calculators/ivig-dose/detail'),
  KarvonenFormulaCalculator: () =>
    import('@/tools/calculators/karvonen-formula/detail'),
  KatchMcardleCalculator: () =>
    import('@/tools/calculators/katch-mcardle/detail'),
  KtvDaugirdasCalculator: () =>
    import('@/tools/calculators/ktv-daugirdas/detail'),
  KetoCalculator: () => import('@/tools/calculators/keto/detail'),
  KidneyFailureRiskCalculator: () =>
    import('@/tools/calculators/kidney-failure-risk/detail'),
  KidneyStonePcnlCalculator: () =>
    import('@/tools/calculators/kidney-stone-pcnl/detail'),
  LidocaineDoseCalculator: () =>
    import('@/tools/calculators/lidocaine-dose/detail'),
  LoanCalculator: () => import('@/tools/calculators/loan/detail'),
  LoanInterestCalculator: () =>
    import('@/tools/calculators/loan-interest/detail'),
  LocalAnestheticCalculator: () =>
    import('@/tools/calculators/local-anesthetic/detail'),
  LotteryAnnuityCalculator: () =>
    import('@/tools/calculators/lottery-annuity/detail'),
  LotteryTaxCalculator: () => import('@/tools/calculators/lottery-tax/detail'),
  LvCalculator: () => import('@/tools/calculators/lv/detail'),
  MacroCalculator: () => import('@/tools/calculators/macro/detail'),
  McgToIuConverter: () => import('@/tools/calculators/mcg-to-iu/detail'),
  Medicine3TimesADayCalculator: () =>
    import('@/tools/calculators/medicine-3-times-a-day/detail'),
  MentzerIndexCalculator: () =>
    import('@/tools/calculators/mentzer-index/detail'),
  MicronutrientCalculator: () =>
    import('@/tools/calculators/micronutrient/detail'),
  MipiCalculator: () => import('@/tools/calculators/mipi/detail'),
  MmeCalculator: () => import('@/tools/calculators/mme/detail'),
  MmollToMgdlCalculator: () =>
    import('@/tools/calculators/mmoll-to-mgdl/detail'),
  NetCarbsCalculator: () => import('@/tools/calculators/net-carbs/detail'),
  OpioidConversionCalculator: () =>
    import('@/tools/calculators/opioid-conversion/detail'),
  OxygenationIndexCalculator: () =>
    import('@/tools/calculators/oxygenation-index/detail'),
  ParklandFormulaCalculator: () =>
    import('@/tools/calculators/parkland-formula/detail'),
  PeptideCalculator: () => import('@/tools/calculators/peptide/detail'),
  PrescriptionRefillCalculator: () =>
    import('@/tools/calculators/prescription-refill/detail'),
  ProstateVolumeCalculator: () =>
    import('@/tools/calculators/prostate-volume/detail'),
  PsaDensityCalculator: () =>
    import('@/tools/calculators/psa-density/detail'),
  PsaDoublingTimeCalculator: () =>
    import('@/tools/calculators/psa-doubling-time/detail'),
  ProteinCalculator: () => import('@/tools/calculators/protein/detail'),
  ProteinCreatinineRatioCalculator: () =>
    import('@/tools/calculators/protein-creatinine-ratio/detail'),
  QuarantineActivityCalculator: () =>
    import('@/tools/calculators/quarantine-activity/detail'),
  QuizFfmiCalculator: () =>
    import('@/tools/calculators/quiz-ffmi/detail'),
  QuizHarrisBenedictCalculator: () =>
    import('@/tools/calculators/quiz-harris-benedict/detail'),
  QuizProteinCreatinineRatioCalculator: () =>
    import('@/tools/calculators/quiz-protein-creatinine-ratio/detail'),
  RmrCalculator: () => import('@/tools/calculators/rmr/detail'),
  SodiumChangeHypertriglyceridemiaCalculator: () =>
    import('@/tools/calculators/sodium-change-hypertriglyceridemia/detail'),
  SodiumCorrectionCalculator: () =>
    import('@/tools/calculators/sodium-correction/detail'),
  SodiumDeficitCalculator: () =>
    import('@/tools/calculators/sodium-deficit/detail'),
  SodiumCorrectionRateCalculator: () =>
    import('@/tools/calculators/sodium-correction-rate/detail'),
  SodiumInSaltCalculator: () =>
    import('@/tools/calculators/sodium-in-salt/detail'),
  SteroidConversionCalculator: () =>
    import('@/tools/calculators/steroid-conversion/detail'),
  StillbirthRiskCalculator: () =>
    import('@/tools/calculators/stillbirth-risk/detail'),
  StrokeVolumeCalculator: () =>
    import('@/tools/calculators/stroke-volume/detail'),
  TdeeCalculator: () => import('@/tools/calculators/tdee/detail'),
  TimiStemiCalculator: () => import('@/tools/calculators/timi-stemi/detail'),
  TimiUanstemiCalculator: () =>
    import('@/tools/calculators/timi-uanstemi/detail'),
  TpaStrokeCalculator: () => import('@/tools/calculators/tpa-stroke/detail'),
  TylenolOverdoseCalculator: () =>
    import('@/tools/calculators/tylenol-overdose/detail'),
  VitaminACalculator: () => import('@/tools/calculators/vitamin-a/detail'),
  VitaminCalculator: () => import('@/tools/calculators/vitamin/detail'),
  VitaminDCalculator: () => import('@/tools/calculators/vitamin-d/detail'),
  WeightWatcherPointsCalculator: () =>
    import('@/tools/calculators/weight-watcher-points/detail'),
  WeightWatchersPointsCalculator: () =>
    import('@/tools/calculators/weight-watchers-points/detail'),
  WarfarinDosingCalculator: () =>
    import('@/tools/calculators/warfarin-dosing/detail'),
  WellsPeCalculator: () => import('@/tools/calculators/wells-pe/detail'),
  MarginAndMarkupCalculator: () =>
    import('@/tools/calculators/margin-and-markup/detail'),
  MarginAndSalesTaxCalculator: () =>
    import('@/tools/calculators/margin-and-sales-tax/detail'),
  MarginAndVatCalculator: () =>
    import('@/tools/calculators/margin-and-vat/detail'),
  MarginCallCalculator: () =>
    import('@/tools/calculators/margin-call/detail'),
  MarginOfSafetyCalculator: () =>
    import('@/tools/calculators/margin-of-safety/detail'),
  MarginWithDiscountCalculator: () =>
    import('@/tools/calculators/margin-with-discount/detail'),
  MaintainPregnancyWeightCalculator: () =>
    import('@/tools/calculators/maintain-pregnancy-weight/detail'),
  McaCalculator: () => import('@/tools/calculators/mca/detail'),
  MeanAirwayPressureCalculator: () =>
    import('@/tools/calculators/mean-airway-pressure/detail'),
  MealCalorieCalculator: () =>
    import('@/tools/calculators/meal-calorie/detail'),
  MaintenanceCalorieCalculator: () =>
    import('@/tools/calculators/maintenance-calorie/detail'),
  MapCalculator: () =>
    import('@/tools/calculators/map-mean-arterial-pressure/detail'),
  MeanSacDiameterCalculator: () =>
    import('@/tools/calculators/mean-sac-diameter/detail'),
  MelatoninDosageCalculator: () =>
    import('@/tools/calculators/melatonin-dosage/detail'),
  MarkdownCalculator: () =>
    import('@/tools/calculators/markdown/detail'),
  MarkupCalculator: () =>
    import('@/tools/calculators/markup/detail'),
  ModifiedAdjustedGrossIncomeCalculator: () =>
    import(
      '@/tools/calculators/modified-adjusted-gross-income/detail'
    ),
  MarriageTaxCalculator: () =>
    import('@/tools/calculators/marriage-tax/detail'),
  MileageReimbursementCalculator: () =>
    import('@/tools/calculators/mileage-reimbursement/detail'),
  NetDebtCalculator: () =>
    import('@/tools/calculators/net-debt/detail'),
  NetEffectiveRentCalculator: () =>
    import('@/tools/calculators/net-effective-rent/detail'),
  IncomeTaxCalculator: () => import('@/tools/calculators/income-tax/detail'),
  TakeHomePayUkCalculator: () =>
    import('@/tools/calculators/take-home-pay-uk/detail'),
  TaxBracketCalculator: () =>
    import('@/tools/calculators/tax-bracket/detail'),
  AdjustedGrossIncomeCalculator: () =>
    import('@/tools/calculators/adjusted-gross-income/detail'),
  IncomeTaxCalculatorPakistan: () =>
    import('@/tools/calculators/pakistan-income-tax/detail'),
  IncomeTaxCalculatorPhilippines: () =>
    import('@/tools/calculators/philippines-income-tax/detail'),
  AlabamaTaxCalculator: () =>
    import('@/tools/calculators/alabama-tax/detail'),
  CaliforniaTaxCalculator: () =>
    import('@/tools/calculators/california-tax/detail'),
  IllinoisTaxCalculator: () =>
    import('@/tools/calculators/illinois-tax/detail'),
  StateTaxCalculator: () =>
    import('@/tools/calculators/state-tax/detail'),
  TexasTaxCalculator: () =>
    import('@/tools/calculators/texas-tax/detail'),
  CaliforniaSalesTaxCalculator: () =>
    import('@/tools/calculators/california-sales-tax/detail'),
  CanadaGstQstCalculator: () =>
    import('@/tools/calculators/canada-gst-qst/detail'),
  FloridaSalesTaxCalculator: () =>
    import('@/tools/calculators/florida-sales-tax/detail'),
  NewJerseySalesTaxCalculator: () =>
    import('@/tools/calculators/new-jersey-sales-tax/detail'),
  OhioSalesTaxCalculator: () =>
    import('@/tools/calculators/ohio-sales-tax/detail'),
  SalesTaxCalculator: () => import('@/tools/calculators/sales-tax/detail'),
  GrossToNetCalculator: () => import('@/tools/calculators/gross-to-net/detail'),
  NetToGrossCalculator: () => import('@/tools/calculators/net-to-gross/detail'),
  GstCalculator: () => import('@/tools/calculators/gst/detail'),
  NewYorkTaxCalculator: () =>
    import('@/tools/calculators/new-york-tax/detail'),
  NewYorkOvertimeCalculator: () =>
    import('@/tools/calculators/new-york-overtime/detail'),
  OperatingMarginCalculator: () =>
    import('@/tools/calculators/operating-margin/detail'),
  NetProfitMarginCalculator: () =>
    import('@/tools/calculators/net-profit-margin/detail'),
  ReturnOnSalesCalculator: () =>
    import('@/tools/calculators/return-on-sales/detail'),
  OvertimeCalculator: () =>
    import('@/tools/calculators/overtime/detail'),
  OvertimePaycheckCalculator: () =>
    import('@/tools/calculators/overtime-paycheck/detail'),
  PresentValueOfAnnuityCalculator: () =>
    import('@/tools/calculators/present-value-of-annuity/detail'),
  RentIncreaseCalculator: () =>
    import('@/tools/calculators/rent-increase/detail'),
  RentOrBuyCalculator: () =>
    import('@/tools/calculators/rent-or-buy/detail'),
  RmdCalculator: () => import('@/tools/calculators/rmd/detail'),
  RrefCalculator: () => import('@/tools/calculators/rref/detail'),
  RsbiCalculator: () => import('@/tools/calculators/rsbi/detail'),
  ArmMortgageCalculator: () => import('@/tools/calculators/arm-mortgage/detail'),
  HundredDayCalculator: () => import('@/tools/calculators/hundred-day/detail'),
  SalaryWithOvertimeCalculator: () =>
    import('@/tools/calculators/salary-with-overtime/detail'),
  TexasOvertimeCalculator: () =>
    import('@/tools/calculators/texas-overtime/detail'),
  TimesInterestEarnedCalculator: () =>
    import('@/tools/calculators/times-interest-earned/detail'),
  TwelveVoltWireCalculator: () => import('@/tools/calculators/twelve-volt-wire/detail'),
  VariableAnnuityCalculator: () =>
    import('@/tools/calculators/variable-annuity/detail'),
  ZeroToSixtyCalculator: () => import('@/tools/calculators/zero-to-sixty/detail'),
  TwelveHourShiftPayCalculator: () => import('@/tools/calculators/twelve-hour-shift-pay/detail'),
  ThreeXRentCalculator: () => import('@/tools/calculators/three-x-rent/detail'),
  ThreeDPrinterBuyVsOutsourceCalculator: () =>
    import('@/tools/calculators/three-d-printer-buy-vs-outsource/detail'),
  ARDaysCalculator: () => import('@/tools/calculators/ar-days/detail'),
  ArvCalculator: () => import('@/tools/calculators/arv/detail'),
  FourZeroThreeBCalculator: () => import('@/tools/calculators/four-zero-three-b/detail'),
  ADRCalculator: () => import('@/tools/calculators/adr/detail'),
  AFFOCalculator: () => import('@/tools/calculators/affo/detail'),
  FiveTwentyNineCalculator: () => import('@/tools/calculators/five-twenty-nine/detail'),
  SeventyTwentyTenCalculator: () => import('@/tools/calculators/seventy-twenty-ten-rule/detail'),
  FourZeroOneKCalculator: () => import('@/tools/calculators/four-zero-one-k/detail'),
  AmoxicillinPediatricDosageCalculator: () =>
    import('@/tools/calculators/amoxicillin-pediatric-dosage/detail'),
  AmortizationCalculator: () => import('@/tools/calculators/amortization/detail'),
  AncAbsoluteNeutrophilCountCalculator: () =>
    import('@/tools/calculators/anc-absolute-neutrophil-count/detail'),
  AncWithoutBandsCalculator: () =>
    import('@/tools/calculators/anc-without-bands/detail'),
  AnionGapCalculator: () => import('@/tools/calculators/anion-gap/detail'),
  ArterialBloodPhCalculator: () => import('@/tools/calculators/arterial-blood-ph/detail'),
  VenousBloodPhCalculator: () => import('@/tools/calculators/venous-blood-ph/detail'),
  BedriddenPatientHeightCalculator: () => import('@/tools/calculators/bedridden-patient-height/detail'),
  PlasmaVolumeCalculator: () => import('@/tools/calculators/plasma-volume/detail'),
  BicarbonateDeficitCalculator: () =>
    import('@/tools/calculators/bicarbonate-deficit/detail'),
  AcidBaseCalculator: () => import('@/tools/calculators/acid-base/detail'),
  AmtCalculator: () => import('@/tools/calculators/amt/detail'),
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
  DeferredPaymentLoanCalculator: () =>
    import('@/tools/calculators/deferred-payment-loan/detail'),
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
  MlToCcConverter: () => import('@/tools/calculators/ml-to-cc/detail'),
  MlToKgConverter: () => import('@/tools/calculators/ml-to-kg/detail'),
  MlToLbsConversion: () => import('@/tools/calculators/ml-to-lbs/detail'),
  MlToOzConverter: () => import('@/tools/calculators/ml-to-oz/detail'),
  MlToTbspConverter: () => import('@/tools/calculators/ml-to-tbsp/detail'),
  MlToTspConverter: () => import('@/tools/calculators/ml-to-tsp/detail'),
  MlToUlConversion: () => import('@/tools/calculators/ml-to-ul/detail'),
  DecagramToGramConverter: () => import('@/tools/calculators/decagram-to-gram/detail'),
  PintToPoundCalculator: () => import('@/tools/calculators/pint-to-pound/detail'),
  PintsToCupsConverter: () => import('@/tools/calculators/pints-to-cups/detail'),
  PintsToGallonsConverter: () => import('@/tools/calculators/pints-to-gallons/detail'),
  QuartsToGallonsConverter: () => import('@/tools/calculators/quarts-to-gallons/detail'),
  DropsToMlConverter: () => import('@/tools/calculators/drops-to-ml/detail'),
  PoundsAndOuncesCalculator: () =>
    import('@/tools/calculators/pounds-and-ounces/detail'),
  PoundsToGramsConverter: () => import('@/tools/calculators/pounds-to-grams/detail'),
  PoundsToLbsConverter: () => import('@/tools/calculators/pounds-to-lbs/detail'),
  PoundsToOuncesConverter: () => import('@/tools/calculators/pounds-to-ounces/detail'),
  PoundsToStoneConverter: () => import('@/tools/calculators/pounds-to-stone/detail'),
  OunceToKgConverter: () => import('@/tools/calculators/ounce-to-kg/detail'),
  OuncesToGramsConverter: () => import('@/tools/calculators/ounces-to-grams/detail'),
  OuncesToMillilitersConverter: () =>
    import('@/tools/calculators/ounces-to-milliliters/detail'),
  OuncesToPoundsConverter: () => import('@/tools/calculators/ounces-to-pounds/detail'),
  OzToCcConverter: () => import('@/tools/calculators/oz-to-cc/detail'),
  OzToCupsConverter: () => import('@/tools/calculators/oz-to-cups/detail'),
  GallonCalculator: () => import('@/tools/calculators/gallon/detail'),
  PricePerLiterToGallonConverter: () =>
    import('@/tools/calculators/price-per-liter-to-gallon/detail'),
  QuartsToPoundsConverter: () => import('@/tools/calculators/quarts-to-pounds/detail'),
  GallonsToPoundsConverter: () => import('@/tools/calculators/gallons-to-pounds/detail'),
  VolumeConversion: () => import('@/tools/calculators/volume-conversion/detail'),
  GramsToOuncesCalculator: () => import('@/tools/calculators/grams-to-ounces/detail'),
  WeightConverter: () => import('@/tools/calculators/weight-converter/detail'),
  WeightGainCalculator: () => import('@/tools/calculators/weight-gain/detail'),
  WeightPercentileCalculator: () =>
    import('@/tools/calculators/weight-percentile/detail'),
  KgToGallonsConverter: () => import('@/tools/calculators/kg-to-gallons/detail'),
  ForceConverter: () => import('@/tools/calculators/force-converter/detail'),
  NmToInLbsConverter: () => import('@/tools/calculators/nm-to-in-lbs/detail'),
  InchLbsToNmConverter: () => import('@/tools/calculators/inch-lbs-to-nm/detail'),
  PaToPsiConversion: () => import('@/tools/calculators/pa-to-psi/detail'),
  PascalConversion: () => import('@/tools/calculators/pascal-conversion/detail'),
  PsiConverter: () => import('@/tools/calculators/psi-converter/detail'),
  PsiPortCalculator: () => import('@/tools/calculators/pneumonia-psi/detail'),
  PsiToAtmConversion: () => import('@/tools/calculators/psi-to-atm/detail'),
  PsiToInchesOfWaterConversion: () =>
    import('@/tools/calculators/psi-to-inches-of-water/detail'),
  PressureUnitConversion: () =>
    import('@/tools/calculators/pressure-unit-conversion/detail'),
  PressureConversion: () => import('@/tools/calculators/pressure-conversion/detail'),
  InchPoundsToFootPoundsConverter: () =>
    import('@/tools/calculators/inch-pounds-to-foot-pounds/detail'),
  PsiToGpmCalculator: () => import('@/tools/calculators/psi-to-gpm/detail'),
  LbsToNewtonsConverter: () => import('@/tools/calculators/lbs-to-newtons/detail'),
  TorqueToHpCalculator: () => import('@/tools/calculators/torque-to-hp/detail'),
  NewtonMeterCalculator: () => import('@/tools/calculators/newton-meter/detail'),
  TorrToAtmConverter: () => import('@/tools/calculators/torr-to-atm/detail'),
  MmhgToAtmConversion: () => import('@/tools/calculators/mmhg-to-atm/detail'),
  MmToAtmConverter: () => import('@/tools/calculators/mm-to-atm/detail'),
  NmToFtLbsConverter: () => import('@/tools/calculators/nm-to-ft-lbs/detail'),
  CoordinatesConverter: () => import('@/tools/calculators/coordinates/detail'),
  LatLongToUtmConverter: () => import('@/tools/calculators/lat-long-to-utm/detail'),
  DegreesMinutesSecondsCalculator: () =>
    import('@/tools/calculators/degrees-minutes-seconds/detail'),
  ScaleCalculator: () => import('@/tools/calculators/scale/detail'),
  BillionToTrillionConverter: () =>
    import('@/tools/calculators/billion-to-trillion/detail'),
  MillionToLakhConverter: () => import('@/tools/calculators/million-to-lakh/detail'),
  CentsToEurosCalculator: () => import('@/tools/calculators/cents-to-euros/detail'),
  MillionToThousandConverter: () =>
    import('@/tools/calculators/million-to-thousand/detail'),
  CroreToLakhConverter: () => import('@/tools/calculators/crore-to-lakh/detail'),
  NumberToBillionConverter: () =>
    import('@/tools/calculators/number-to-billion/detail'),
  CroreToMillionConverter: () => import('@/tools/calculators/crore-to-million/detail'),
  NumberToMillionConverter: () => import('@/tools/calculators/number-to-million/detail'),
  MillionToBillionConverter: () =>
    import('@/tools/calculators/million-to-billion/detail'),
  BinaryConverter: () => import('@/tools/calculators/binary/detail'),
  GematriaCalculator: () => import('@/tools/calculators/gematria/detail'),
  BinaryToHexConverter: () => import('@/tools/calculators/binary-to-hex/detail'),
  GreekGematriaCalculator: () => import('@/tools/calculators/greek-gematria/detail'),
  BinaryToOctalConverter: () => import('@/tools/calculators/binary-to-octal/detail'),
  HexadecimalConverter: () => import('@/tools/calculators/hexadecimal/detail'),
  DecimalToHexConverter: () =>
    import('@/tools/calculators/decimal-to-hexadecimal/detail'),
  RomanNumeralsConverter: () => import('@/tools/calculators/roman-numerals/detail'),
  DecimalToOctalConverter: () => import('@/tools/calculators/decimal-to-octal/detail'),
  ByteConversionCalculator: () => import('@/tools/calculators/byte-conversion/detail'),
  MbpsToGbpsConverter: () => import('@/tools/calculators/mbps-to-gbps/detail'),
  CapacitanceConverter: () => import('@/tools/calculators/capacitance/detail'),
  MbToGbConverter: () => import('@/tools/calculators/mb-to-gb/detail'),
  ColorConverter: () => import('@/tools/calculators/color/detail'),
  RgbToHexConverter: () => import('@/tools/calculators/rgb-to-hex/detail'),
  HexToRgbConverter: () => import('@/tools/calculators/hex-to-rgb/detail'),
  UnicodeTextConverter: () => import('@/tools/calculators/unicode-text/detail'),
  KbToMbConverter: () => import('@/tools/calculators/kb-to-mb/detail'),
  UnixTimeConverter: () => import('@/tools/calculators/unix-time/detail'),
  MbpsCalculator: () => import('@/tools/calculators/mbps/detail'),
  MilitaryTimeConverter: () => import('@/tools/calculators/military-time/detail'),
  TimeZonesConverter: () => import('@/tools/calculators/time-zones/detail'),
  MinutesToHoursConverter: () => import('@/tools/calculators/minutes-to-hours/detail'),
  YearsToDecadesCalculator: () => import('@/tools/calculators/years-to-decades/detail'),
  TimeUnitConverter: () => import('@/tools/calculators/time-unit/detail'),
  ZuluTimeConverter: () => import('@/tools/calculators/zulu-time/detail'),
  AngleConversionCalculator: () => import('@/tools/calculators/angle-conversion/detail'),
  MsToKmhConverter: () => import('@/tools/calculators/ms-to-kmh/detail'),
  CcfToThermsCalculator: () => import('@/tools/calculators/ccf-to-therms/detail'),
  NaturalGasConverter: () => import('@/tools/calculators/natural-gas/detail'),
  NaturalRateOfUnemploymentCalculator: () =>
    import('@/tools/calculators/natural-rate-of-unemployment/detail'),
  UnemploymentCalculator: () => import('@/tools/calculators/unemployment/detail'),
  UrineAnionGapCalculator: () =>
    import('@/tools/calculators/urine-anion-gap/detail'),
  UrineHomePregnancyTestCalculator: () =>
    import('@/tools/calculators/urine-home-pregnancy-test/detail'),
  UrineOutputCalculator: () =>
    import('@/tools/calculators/urine-output/detail'),
  UrrCalculator: () => import('@/tools/calculators/urr/detail'),
  CentsToDollarsCalculator: () => import('@/tools/calculators/cents-to-dollars/detail'),
  NmToJoulesCalculator: () => import('@/tools/calculators/nm-to-joules/detail'),
  CgsSystemOfUnitsConverter: () => import('@/tools/calculators/cgs-system/detail'),
  NickelsToDollarsCalculator: () => import('@/tools/calculators/nickels-to-dollars/detail'),
  ConversionCalculator: () => import('@/tools/calculators/conversion/detail'),
  PaperQuantityConverter: () => import('@/tools/calculators/paper-quantity/detail'),
  CpsCalculator: () => import('@/tools/calculators/cps/detail'),
  PenniesToDollarsCalculator: () => import('@/tools/calculators/pennies-to-dollars/detail'),
  DbmToWattsCalculator: () => import('@/tools/calculators/dbm-to-watts/detail'),
  PowerConverter: () => import('@/tools/calculators/power/detail'),
  DensityConversion: () => import('@/tools/calculators/density/detail'),
  PpmCalculator: () => import('@/tools/calculators/ppm/detail'),
  DimensionalAnalysisCalculator: () =>
    import('@/tools/calculators/dimensional-analysis/detail'),
  PpmToMglConverter: () => import('@/tools/calculators/ppm-to-mgl/detail'),
  DimesToDollarsCalculator: () => import('@/tools/calculators/dimes-to-dollars/detail'),
  PxToEmConverter: () => import('@/tools/calculators/px-to-em/detail'),
  EnergyConversionCalculator: () => import('@/tools/calculators/energy/detail'),
  QuantityConverter: () => import('@/tools/calculators/quantity/detail'),
  MpgToL100Converter: () => import('@/tools/calculators/mpg-to-l100/detail'),
  QuartersToDollarsCalculator: () => import('@/tools/calculators/quarters-to-dollars/detail'),
  GramsToCaloriesCalculator: () => import('@/tools/calculators/grams-to-calories/detail'),
  RadiationConverter: () => import('@/tools/calculators/radiation/detail'),
  HardnessConversionCalculator: () => import('@/tools/calculators/hardness/detail'),
  RmsToWattsConverter: () => import('@/tools/calculators/rms-to-watts/detail'),
  JoulesToVoltsCalculator: () => import('@/tools/calculators/joules-to-volts/detail'),
  SpeedConversionCalculator: () => import('@/tools/calculators/speed/detail'),
  KnotsToMphConverter: () => import('@/tools/calculators/knots-to-mph/detail'),
  UppercaseToLowercaseConverter: () =>
    import('@/tools/calculators/uppercase-to-lowercase/detail'),
  LeetSpeakTranslator: () => import('@/tools/calculators/leet-speak/detail'),
  WeirdUnitsConverter: () => import('@/tools/calculators/weird-units/detail'),
  LowercaseToUppercaseConverter: () =>
    import('@/tools/calculators/lowercase-to-uppercase/detail'),
  AcresToHectaresConverter: () => import('@/tools/calculators/acres-to-hectares/detail'),
  LbsToPsiConverter: () => import('@/tools/calculators/lbs-to-psi/detail'),
  AcresToSquareFeetConverter: () => import('@/tools/calculators/acres-to-square-feet/detail'),
  LbsToStoneConverter: () => import('@/tools/calculators/lbs-to-stone/detail'),
  AngstromToNmConverter: () => import('@/tools/calculators/angstrom-to-nm/detail'),
  LitersToPoundsCalculator: () => import('@/tools/calculators/liters-to-pounds/detail'),
  AtmConversionCalculator: () => import('@/tools/calculators/atm-conversion/detail'),
  LiterToCcConverter: () => import('@/tools/calculators/liter-to-cc/detail'),
  AtmToPascalsConverter: () => import('@/tools/calculators/atm-to-pascals/detail'),
  LotSizeToAcresCalculator: () => import('@/tools/calculators/lot-size-to-acres/detail'),
  BarometricPressureConverter: () => import('@/tools/calculators/barometric-pressure/detail'),
  LotSizeToSqftCalculator: () => import('@/tools/calculators/lot-size-to-sqft/detail'),
  BarToAtmConverter: () => import('@/tools/calculators/bar-to-atm/detail'),
  LToGalConverter: () => import('@/tools/calculators/l-to-gal/detail'),
  BarToPsiConverter: () => import('@/tools/calculators/bar-to-psi/detail'),
  McgToMlConverter: () => import('@/tools/calculators/mcg-to-ml/detail'),
  BarToPsigConverter: () => import('@/tools/calculators/bar-to-psig/detail'),
  MeasurementConverter: () => import('@/tools/calculators/measurement-converter/detail'),
  CcToGramsConverter: () => import('@/tools/calculators/cc-to-grams/detail'),
  MeterConverter: () => import('@/tools/calculators/meter-converter/detail'),
  CcToLiterConverter: () => import('@/tools/calculators/cc-to-liter/detail'),
  MetersToFeetConverter: () => import('@/tools/calculators/meters-to-feet/detail'),
  CcToMlConverter: () => import('@/tools/calculators/cc-to-ml/detail'),
  MeterToMileConverter: () => import('@/tools/calculators/meter-to-mile/detail'),
  CcToOzConverter: () => import('@/tools/calculators/cc-to-oz/detail'),
  MetricConverter: () => import('@/tools/calculators/metric-converter/detail'),
  CelsiusConverter: () => import('@/tools/calculators/celsius-converter/detail'),
  MetricToImperialConverter: () => import('@/tools/calculators/metric-to-imperial/detail'),
  CelsiusToFahrenheitConverter: () =>
    import('@/tools/calculators/celsius-to-fahrenheit/detail'),
  CentigradeToCelsiusConverter: () =>
    import('@/tools/calculators/centigrade-to-celsius/detail'),
  MetricToSaeCalculator: () => import('@/tools/calculators/metric-to-sae/detail'),
  CmHeightConversionCalculator: () =>
    import('@/tools/calculators/cm-height-conversion/detail'),
  CentimeterCalculator: () => import('@/tools/calculators/centimeter/detail'),
  CentToSquareMeterConverter: () =>
    import('@/tools/calculators/cent-to-square-meter/detail'),
  CmToFtInConverter: () => import('@/tools/calculators/cm-to-ft-in/detail'),
  CmToInConverter: () => import('@/tools/calculators/cm-to-in/detail'),
  CmToKmConverter: () => import('@/tools/calculators/cm-to-km/detail'),
  CmToMConverter: () => import('@/tools/calculators/cm-to-m/detail'),
  CmToMmConverter: () => import('@/tools/calculators/cm-to-mm/detail'),
  CubicFeetToCubicMetersConverter: () =>
    import('@/tools/calculators/cubic-feet-to-cubic-meters/detail'),
  CubicFeetToGallonsConverter: () =>
    import('@/tools/calculators/cubic-feet-to-gallons/detail'),
  CubicFeetToPoundsCalculator: () =>
    import('@/tools/calculators/cubic-feet-to-pounds/detail'),
  CubicInchesToGallonsConverter: () =>
    import('@/tools/calculators/cubic-inches-to-gallons/detail'),
  CubicMeterToTonConverter: () =>
    import('@/tools/calculators/cubic-meter-to-ton/detail'),
  CupsToGallonsConverter: () => import('@/tools/calculators/cups-to-gallons/detail'),
  CupsToOzConverter: () => import('@/tools/calculators/cups-to-oz/detail'),
  CupsToPintsConverter: () => import('@/tools/calculators/cups-to-pints/detail'),
  CupsToQuartsConverter: () => import('@/tools/calculators/cups-to-quarts/detail'),
  DayConverter: () => import('@/tools/calculators/day-converter/detail'),
  DaysToMonthsCalculator: () => import('@/tools/calculators/days-to-months/detail'),
  DaysToWeeksCalculator: () => import('@/tools/calculators/days-to-weeks/detail'),
  DaysToYearsCalculator: () => import('@/tools/calculators/days-to-years/detail'),
  DegreesToMinutesConverter: () => import('@/tools/calculators/degrees-to-minutes/detail'),
  DegreesToRadiansConverter: () => import('@/tools/calculators/degrees-to-radians/detail'),
  RadiansToDegreesConverter: () => import('@/tools/calculators/radians-to-degrees/detail'),
  DegreesToSecondsConverter: () => import('@/tools/calculators/degrees-to-seconds/detail'),
  DistanceConverter: () => import('@/tools/calculators/distance-converter/detail'),
  DmConverter: () => import('@/tools/calculators/dm-converter/detail'),
  FahrenheitConverter: () => import('@/tools/calculators/fahrenheit-converter/detail'),
  FahrenheitToCelsiusConverter: () =>
    import('@/tools/calculators/fahrenheit-to-celsius/detail'),
  FeetConverter: () => import('@/tools/calculators/feet-converter/detail'),
  FeetToMilesConverter: () => import('@/tools/calculators/feet-to-miles/detail'),
  FeetToYardsConverter: () => import('@/tools/calculators/feet-to-yards/detail'),
  FluidOuncesToPoundsConverter: () =>
    import('@/tools/calculators/fluid-ounces-to-pounds/detail'),
  FootToCentimeterConverter: () => import('@/tools/calculators/foot-to-centimeter/detail'),
  FtToMConverter: () => import('@/tools/calculators/ft-to-m/detail'),
  GajToSquareYardConverter: () => import('@/tools/calculators/gaj-to-square-yard/detail'),
  GallonsToCubicFeetConverter: () =>
    import('@/tools/calculators/gallons-to-cubic-feet/detail'),
  GallonsToCupsConverter: () => import('@/tools/calculators/gallons-to-cups/detail'),
  GallonsToGramsConverter: () => import('@/tools/calculators/gallons-to-grams/detail'),
  GallonsToPintsConverter: () => import('@/tools/calculators/gallons-to-pints/detail'),
  GallonsToQuartsConverter: () => import('@/tools/calculators/gallons-to-quarts/detail'),
  GallonsToTonsConverter: () => import('@/tools/calculators/gallons-to-tons/detail'),
  GalToKgConverter: () => import('@/tools/calculators/gal-to-kg/detail'),
  GramsInMlConverter: () => import('@/tools/calculators/grams-in-ml/detail'),
  GramsToFlOzConverter: () => import('@/tools/calculators/grams-to-fl-oz/detail'),
  GramToLiterConversion: () => import('@/tools/calculators/gram-to-liter/detail'),
  GrToMlConverter: () => import('@/tools/calculators/gr-to-ml/detail'),
  GToTspConverter: () => import('@/tools/calculators/g-to-tsp/detail'),
  GToLbsConverter: () => import('@/tools/calculators/g-to-lbs/detail'),
  HectaresToAcresConverter: () => import('@/tools/calculators/hectares-to-acres/detail'),
  HeightConverter: () => import('@/tools/calculators/height-converter/detail'),
  HourConverter: () => import('@/tools/calculators/hour-converter/detail'),
  HoursToDaysCalculator: () => import('@/tools/calculators/hours-to-days/detail'),
  HoursToMinutesConverter: () => import('@/tools/calculators/hours-to-minutes/detail'),
  HoursToSecondsConverter: () => import('@/tools/calculators/hours-to-seconds/detail'),
  HoursToWeekConversion: () => import('@/tools/calculators/hours-to-weeks/detail'),
  HoursToYearsConverter: () => import('@/tools/calculators/hours-to-years/detail'),
  ImperialCalculator: () => import('@/tools/calculators/imperial/detail'),
  ImperialToMetricConversion: () => import('@/tools/calculators/imperial-to-metric/detail'),
  InchConverter: () => import('@/tools/calculators/inch-converter/detail'),
  InchToMeterCalculator: () => import('@/tools/calculators/inch-to-meter/detail'),
  InchesToYardConversion: () => import('@/tools/calculators/inches-to-yards/detail'),
  InToCmConverter: () => import('@/tools/calculators/in-to-cm/detail'),
  KathaToSquareFeetConverter: () => import('@/tools/calculators/katha-to-sqft/detail'),
  KelvinConverter: () => import('@/tools/calculators/kelvin-converter/detail'),
  KelvinToCelsiusConverter: () => import('@/tools/calculators/kelvin-to-celsius/detail'),
  KelvinToFahrenheitConverter: () => import('@/tools/calculators/kelvin-to-fahrenheit/detail'),
  KgCmToPsiConverter: () => import('@/tools/calculators/kgcm-to-psi/detail'),
  KgToLbsConverter: () => import('@/tools/calculators/kg-to-lbs/detail'),
  KgToLiterConverter: () => import('@/tools/calculators/kg-to-liter/detail'),
  KgToMlConverter: () => import('@/tools/calculators/kg-to-ml/detail'),
  KgToOunceConverter: () => import('@/tools/calculators/kg-to-ounce/detail'),
  KgToStonesConverter: () => import('@/tools/calculators/kg-to-stones/detail'),
  KilometerCalculator: () => import('@/tools/calculators/kilometer-calculator/detail'),
  KilometerToMeterConverter: () => import('@/tools/calculators/kilometer-to-meter/detail'),
  KilometersToMilesCalculator: () => import('@/tools/calculators/kilometers-to-miles/detail'),
  KmToFeetConversion: () => import('@/tools/calculators/km-to-feet/detail'),
  KpaConverter: () => import('@/tools/calculators/kpa-converter/detail'),
  KpaToAtmConversion: () => import('@/tools/calculators/kpa-to-atm/detail'),
  KpaToMmhgConversion: () => import('@/tools/calculators/kpa-to-mmhg/detail'),
  KpaToPsiConversion: () => import('@/tools/calculators/kpa-to-psi/detail'),
  KsiToMpaConverter: () => import('@/tools/calculators/ksi-to-mpa/detail'),
  KsiToPsiConversion: () => import('@/tools/calculators/ksi-to-psi/detail'),
  LandAreaCalculator: () => import('@/tools/calculators/land-area/detail'),
  LbsToGConverter: () => import('@/tools/calculators/lbs-to-g/detail'),
  LbsToKgConverter: () => import('@/tools/calculators/lbs-to-kg/detail'),
  LbsToPoundsConverter: () => import('@/tools/calculators/lbs-to-pounds/detail'),
  MetricToStandardConverter: () => import('@/tools/calculators/metric-to-standard/detail'),
  MgToCcConverter: () => import('@/tools/calculators/mg-to-cc/detail'),
  MgToLbsConverter: () => import('@/tools/calculators/mg-to-lbs/detail'),
  MgToTablespoonConverter: () => import('@/tools/calculators/mg-to-tablespoon/detail'),
  MgToTeaspoonConverter: () => import('@/tools/calculators/mg-to-teaspoon/detail'),
  MicronToMilConversionCalculator: () => import('@/tools/calculators/micron-to-mil/detail'),
  MilConversion: () => import('@/tools/calculators/mil-conversion/detail'),
  MileConversionCalculator: () => import('@/tools/calculators/mile-conversion/detail'),
  MillimeterCalculator: () => import('@/tools/calculators/millimeter/detail'),
  MmCalculator: () => import('@/tools/calculators/mm-calculator/detail'),
  MmToFootConverter: () => import('@/tools/calculators/mm-to-foot/detail'),
  MmToInchesConversion: () => import('@/tools/calculators/mm-to-inches/detail'),
  MmToKmConversion: () => import('@/tools/calculators/mm-to-km/detail'),
  MmToMConversion: () => import('@/tools/calculators/mm-to-m/detail'),
  MillisecondsConverter: () => import('@/tools/calculators/milliseconds/detail'),
  MilToInchConversion: () => import('@/tools/calculators/mil-to-inch/detail'),
  MilToMmConversion: () => import('@/tools/calculators/mil-to-mm/detail'),
  MinuteConverter: () => import('@/tools/calculators/minute-converter/detail'),
  MinutesToDaysCalculator: () => import('@/tools/calculators/minutes-to-days/detail'),
  MinutesToDecimalCalculator: () => import('@/tools/calculators/minutes-to-decimal/detail'),
  MinutesToSecondsConverter: () => import('@/tools/calculators/minutes-to-seconds/detail'),
  MinutesToYearsConversion: () => import('@/tools/calculators/minutes-to-years/detail'),
  MonthsToYearsCalculator: () => import('@/tools/calculators/months-to-years/detail'),
  MpaConversion: () => import('@/tools/calculators/mpa-conversion/detail'),
  MpaToPsiConversion: () => import('@/tools/calculators/mpa-to-psi/detail'),
  MpaToPsigConversion: () => import('@/tools/calculators/mpa-to-psig/detail'),
  MsToSecondsConverter: () => import('@/tools/calculators/ms-to-seconds/detail'),
  SecondsConverter: () => import('@/tools/calculators/seconds-converter/detail'),
  SecondsToDaysConverter: () => import('@/tools/calculators/seconds-to-days/detail'),
  SecondsToHoursConverter: () => import('@/tools/calculators/seconds-to-hours/detail'),
  SecondsToMinutesConverter: () => import('@/tools/calculators/seconds-to-minutes/detail'),
  SecondsToYearsConversion: () => import('@/tools/calculators/seconds-to-years/detail'),
  SquareCmToSquareMmConverter: () => import('@/tools/calculators/square-cm-to-square-mm/detail'),
  SquareFeetConverter: () => import('@/tools/calculators/square-feet-converter/detail'),
  SquareFeetToAcresCalculator: () => import('@/tools/calculators/square-feet-to-acres/detail'),
  SquareInchToSquareFootConverter: () =>
    import('@/tools/calculators/square-inch-to-square-foot/detail'),
  SquareMeterConverter: () => import('@/tools/calculators/square-meter-converter/detail'),
  SquareMetersToSquareFeetConverter: () =>
    import('@/tools/calculators/square-meters-to-square-feet/detail'),
  SquareMilesToSquareKmConverter: () =>
    import('@/tools/calculators/square-miles-to-square-km/detail'),
  SquareYardConverter: () => import('@/tools/calculators/square-yard-converter/detail'),
  StoneToKgConverter: () => import('@/tools/calculators/stone-to-kg/detail'),
  StoneToLbsConverter: () => import('@/tools/calculators/stone-to-lbs/detail'),
  TbspToGramsConverter: () => import('@/tools/calculators/tbsp-to-grams/detail'),
  TbspToMlConverter: () => import('@/tools/calculators/tbsp-to-ml/detail'),
  TspToGramsConverter: () => import('@/tools/calculators/tsp-to-grams/detail'),
  TspToMlConverter: () => import('@/tools/calculators/tsp-to-ml/detail'),
  WeeksToMonthsCalculator: () => import('@/tools/calculators/weeks-to-months/detail'),
  WeeksToYearsConverter: () => import('@/tools/calculators/weeks-to-years/detail'),
  YardConversionCalculator: () => import('@/tools/calculators/yard-conversion/detail'),
  YardToMeterConverter: () => import('@/tools/calculators/yard-to-meter/detail'),
  YardToMileConverter: () => import('@/tools/calculators/yard-to-mile/detail'),
  NmConverter: () => import('@/tools/calculators/nm-converter/detail'),
  NmToMConverter: () => import('@/tools/calculators/nm-to-m/detail'),
  KnotsToKphConverter: () => import('@/tools/calculators/knots-to-kph/detail'),
  TemperatureConversionCalculator: () => import('@/tools/calculators/temperature/detail'),
  AdditionalFundsNeededCalculator: () =>
    import('@/tools/calculators/additional-funds-needed/detail'),
  AbsencePercentageCalculator: () =>
    import('@/tools/calculators/absence-percentage/detail'),
  AccumulatedDepreciationCalculator: () =>
    import('@/tools/calculators/accumulated-depreciation/detail'),
  CarDepreciationCalculator: () =>
    import('@/tools/calculators/car-depreciation/detail'),
  AttritionRateCalculator: () =>
    import('@/tools/calculators/attrition-rate/detail'),
  BusinessLoanCalculator: () =>
    import('@/tools/calculators/business-loan/detail'),
  AccountingProfitCalculator: () =>
    import('@/tools/calculators/accounting-profit/detail'),
  ProfitCalculator: () => import('@/tools/calculators/profit/detail'),
  EconomicProfitCalculator: () =>
    import('@/tools/calculators/economic-profit/detail'),
  EvToSalesCalculator: () =>
    import('@/tools/calculators/ev-to-sales/detail'),
  PriceToSalesRatioCalculator: () =>
    import('@/tools/calculators/price-to-sales-ratio/detail'),
  ProfitabilityIndexCalculator: () =>
    import('@/tools/calculators/profitability-index/detail'),
  RevenueCalculator: () => import('@/tools/calculators/revenue/detail'),
  RevenueGrowthCalculator: () =>
    import('@/tools/calculators/revenue-growth/detail'),
  RevenuePerEmployeeCalculator: () =>
    import('@/tools/calculators/revenue-per-employee/detail'),
  RoasCalculator: () => import('@/tools/calculators/roas/detail'),
  RoceCalculator: () => import('@/tools/calculators/roce/detail'),
  RoiCalculator: () =>
    import('@/tools/calculators/roi/detail'),
  SaasLifetimeValueCalculator: () =>
    import('@/tools/calculators/saas-lifetime-value/detail'),
  SafetyStockCalculator: () =>
    import('@/tools/calculators/safety-stock/detail'),
  StockCalculator: () => import('@/tools/calculators/stock/detail'),
  StockAverageCalculator: () =>
    import('@/tools/calculators/stock-average/detail'),
  StockSplitCalculator: () =>
    import('@/tools/calculators/stock-split/detail'),
  CommercialLeaseCalculator: () =>
    import('@/tools/calculators/commercial-lease/detail'),
  CommissionCalculator: () =>
    import('@/tools/calculators/commission/detail'),
  CommuteCalculator: () => import('@/tools/calculators/commute/detail'),
  SalesCommissionCalculator: () =>
    import('@/tools/calculators/sales-commission/detail'),
  SalesCalculator: () => import('@/tools/calculators/sales/detail'),
  TrueCostOfRealEstateCommissionCalculator: () =>
    import('@/tools/calculators/true-cost-real-estate-commission/detail'),
  SellThroughRateCalculator: () =>
    import('@/tools/calculators/sell-through-rate/detail'),
  SimpleInterestCalculator: () =>
    import('@/tools/calculators/simple-interest/detail'),
  SpermAnalysisCalculator: () =>
    import('@/tools/calculators/sperm-analysis/detail'),
  SpendingMultiplierCalculator: () =>
    import('@/tools/calculators/spending-multiplier/detail'),
  TaxEquivalentYieldCalculator: () =>
    import('@/tools/calculators/tax-equivalent-yield/detail'),
  TaylorRuleCalculator: () =>
    import('@/tools/calculators/taylor-rule/detail'),
  TrumpTariffCalculator: () =>
    import('@/tools/calculators/trump-tariff/detail'),
  VelocityOfMoneyCalculator: () =>
    import('@/tools/calculators/velocity-of-money/detail'),
  TdsInterestCalculator: () =>
    import('@/tools/calculators/tds-interest/detail'),
  SinkingFundCalculator: () =>
    import('@/tools/calculators/sinking-fund/detail'),
  SipCalculator: () => import('@/tools/calculators/sip/detail'),
  SipLumpsumCalculator: () =>
    import('@/tools/calculators/sip-lumpsum/detail'),
  SixMinuteWalkTestCalculator: () =>
    import('@/tools/calculators/six-minute-walk-test/detail'),
  SocialSecurityCalculator: () =>
    import('@/tools/calculators/social-security/detail'),
  StampDutyLandTaxUkCalculator: () =>
    import('@/tools/calculators/stamp-duty-land-tax-uk/detail'),
  SmokersCtcCalculator: () =>
    import('@/tools/calculators/smokers-ctc/detail'),
  TenureCalculator: () => import('@/tools/calculators/tenure/detail'),
  TestosteroneEstradiolRatioCalculator: () =>
    import('@/tools/calculators/testosterone-estradiol-ratio/detail'),
  TidalVolumeCalculator: () =>
    import('@/tools/calculators/tidal-volume/detail'),
  TimeValueOfMoneyCalculator: () =>
    import('@/tools/calculators/time-value-of-money/detail'),
  TtkgCalculator: () => import('@/tools/calculators/ttkg/detail'),
  TtmCalculator: () => import('@/tools/calculators/ttm/detail'),
  TreynorRatioCalculator: () =>
    import('@/tools/calculators/treynor-ratio/detail'),
  TurnoverRateCalculator: () =>
    import('@/tools/calculators/turnover-rate/detail'),
  WebsiteAdRevenueCalculator: () =>
    import('@/tools/calculators/website-ad-revenue/detail'),
  MarginalRevenueCalculator: () =>
    import('@/tools/calculators/marginal-revenue/detail'),
  WeddingBudgetCalculator: () =>
    import('@/tools/calculators/wedding-budget/detail'),
  WeekOverWeekCalculator: () =>
    import('@/tools/calculators/week-over-week/detail'),
  SoftwareContractValueCalculator: () =>
    import('@/tools/calculators/software-contract-value/detail'),
  SortinoRatioCalculator: () =>
    import('@/tools/calculators/sortino-ratio/detail'),
  YearOverYearGrowthCalculator: () =>
    import('@/tools/calculators/year-over-year-growth/detail'),
  YoutubeMoneyCalculator: () =>
    import('@/tools/calculators/youtube-money/detail'),
  AnnualSalaryCalculator: () =>
    import('@/tools/calculators/annual-salary/detail'),
  AnnualIncomeCalculator: () =>
    import('@/tools/calculators/annual-income/detail'),
  AnnualPayCalculator: () =>
    import('@/tools/calculators/annual-pay/detail'),
  AnnualSalaryPerHourCalculator: () =>
    import('@/tools/calculators/annual-salary-per-hour/detail'),
  AnnualToMonthlySalaryCalculator: () =>
    import('@/tools/calculators/annual-to-monthly-salary/detail'),
  AnnualizedRateOfReturnCalculator: () =>
    import('@/tools/calculators/annualized-rate-of-return/detail'),
  AppreciationCalculator: () =>
    import('@/tools/calculators/appreciation/detail'),
  AnnualizedReturnCalculator: () =>
    import('@/tools/calculators/annualized-return/detail'),
  AprCalculator: () => import('@/tools/calculators/apr/detail'),
  ApyCalculator: () => import('@/tools/calculators/apy/detail'),
  BalanceTransferCalculator: () =>
    import('@/tools/calculators/balance-transfer/detail'),
  BalloonPaymentCalculator: () =>
    import('@/tools/calculators/balloon-payment/detail'),
  BasisPointCalculator: () =>
    import('@/tools/calculators/basis-point/detail'),
  BbtCalculator: () => import('@/tools/calculators/bbt/detail'),
  AaGradientCalculator: () =>
    import('@/tools/calculators/aa-gradient/detail'),
  AbiCalculator: () => import('@/tools/calculators/abi/detail'),
  AbsiCalculator: () => import('@/tools/calculators/absi/detail'),
  AbsoluteEosinophilCountCalculator: () =>
    import('@/tools/calculators/absolute-eosinophil-count/detail'),
  AbsoluteLymphocyteCountCalculator: () =>
    import('@/tools/calculators/absolute-lymphocyte-count/detail'),
  AbsoluteReticulocyteCountCalculator: () =>
    import('@/tools/calculators/absolute-reticulocyte-count/detail'),
  AddedSugarIntakeCalculator: () =>
    import('@/tools/calculators/added-sugar-intake/detail'),
  AdderallDosageCalculator: () =>
    import('@/tools/calculators/adderall-dosage/detail'),
  AdjustedBodyWeightCalculator: () =>
    import('@/tools/calculators/adjusted-body-weight/detail'),
  AdrenalWashoutCalculator: () =>
    import('@/tools/calculators/adrenal-washout/detail'),
  AgeAdjustedDDimerCalculator: () =>
    import('@/tools/calculators/age-adjusted-d-dimer/detail'),
  AlbuminCreatinineRatioCalculator: () =>
    import('@/tools/calculators/albumin-creatinine-ratio/detail'),
  AlbuminGlobulinRatioCalculator: () =>
    import('@/tools/calculators/albumin-globulin-ratio/detail'),
  AlcoholUnitCalculator: () =>
    import('@/tools/calculators/alcohol-unit/detail'),
  AleveDosageCalculator: () =>
    import('@/tools/calculators/aleve-dosage/detail'),
  AllowableBloodLossCalculator: () =>
    import('@/tools/calculators/allowable-blood-loss/detail'),
  BaiCalculator: () => import('@/tools/calculators/bai/detail'),
  BriCalculator: () => import('@/tools/calculators/bri-body-roundness/detail'),
  WaistToHipRatioCalculator: () =>
    import('@/tools/calculators/waist-to-hip/detail'),
  WaistToHeightRatioCalculator: () =>
    import('@/tools/calculators/waist-to-height/detail'),
  PlasmaOsmolalityCalculator: () =>
    import('@/tools/calculators/plasma-osmolality/detail'),
  SerumOsmolalityCalculator: () =>
    import('@/tools/calculators/serum-osmolality/detail'),
  PonderalIndexCalculator: () =>
    import('@/tools/calculators/ponderal-index/detail'),
  WeightLossPercentageCalculator: () =>
    import('@/tools/calculators/weight-loss-percentage/detail'),
  WintersFormulaCalculator: () =>
    import('@/tools/calculators/winters-formula/detail'),
  WaterIntakeCalculator: () =>
    import('@/tools/calculators/water-intake/detail'),
  RfmCalculator: () => import('@/tools/calculators/rfm/detail'),
  LeanBodyMassCalculator: () =>
    import('@/tools/calculators/lean-body-mass/detail'),
  NlrCalculator: () => import('@/tools/calculators/nlr/detail'),
  TransferrinSaturationCalculator: () =>
    import('@/tools/calculators/transferrin-saturation/detail'),
  OverweightCalculator: () =>
    import('@/tools/calculators/overweight/detail'),
  TotalBodyWaterCalculator: () =>
    import('@/tools/calculators/total-body-water/detail'),
  BeeCalculator: () => import('@/tools/calculators/bee-calculator/detail'),
  BenadrylDosageCalculator: () =>
    import('@/tools/calculators/benadryl-dosage/detail'),
  BenzodiazepineConversionCalculator: () =>
    import('@/tools/calculators/benzodiazepine-conversion/detail'),
  BloodDonorCalculator: () =>
    import('@/tools/calculators/blood-donor/detail'),
  BloodTypeCalculator: () =>
    import('@/tools/calculators/blood-type/detail'),
  BloodVolumeCalculator: () =>
    import('@/tools/calculators/blood-volume/detail'),
  BodyFrameSizeCalculator: () =>
    import('@/tools/calculators/body-frame-size/detail'),
  BodyShapeCalculator: () =>
    import('@/tools/calculators/body-shape/detail'),
  BodySurfaceAreaCalculator: () =>
    import('@/tools/calculators/body-surface-area/detail'),
  BodyTypeCalculator: () =>
    import('@/tools/calculators/body-type/detail'),
  BodeIndexCalculator: () =>
    import('@/tools/calculators/bode-index/detail'),
  BsaCalculator: () => import('@/tools/calculators/bsa/detail'),

  IbuprofenDosageCalculator: () =>
    import('@/tools/calculators/ibuprofen-dosage/detail'),
  IchVolumeCalculator: () =>
    import('@/tools/calculators/ich-volume/detail'),
  IdealWeightCalculator: () =>
    import('@/tools/calculators/ideal-weight/detail'),
  IvFlowRateCalculator: () =>
    import('@/tools/calculators/iv-flow-rate/detail'),
  BetaStockCalculator: () =>
    import('@/tools/calculators/beta-stock/detail'),
  BidensTaxPlanCalculator: () =>
    import('@/tools/calculators/bidens-tax-plan/detail'),
  BirthControlCalculator: () =>
    import('@/tools/calculators/birth-control/detail'),
  BirthWeightPercentileCalculator: () =>
    import('@/tools/calculators/birth-weight-percentile/detail'),
  BlendedRateCalculator: () =>
    import('@/tools/calculators/blended-rate/detail'),
  BmiBodyMassIndexCalculator: () =>
    import('@/tools/calculators/bmi-body-mass-index/detail'),
  BmiCalculatorForKids: () =>
    import('@/tools/calculators/bmi-kids/detail'),
  BmiCalculatorForTeens: () =>
    import('@/tools/calculators/bmi-teens/detail'),
  BmiForMenCalculator: () =>
    import('@/tools/calculators/bmi-for-men/detail'),
  BmiForWomenCalculator: () =>
    import('@/tools/calculators/bmi-for-women/detail'),
  BmiPercentileCalculator: () =>
    import('@/tools/calculators/bmi-percentile/detail'),
  BmiWeightLossCalculator: () =>
    import('@/tools/calculators/bmi-weight-loss/detail'),
  DueDateCalculator: () =>
    import('@/tools/calculators/due-date/detail'),
  DopplerEchoCardiacOutputCalculator: () =>
    import('@/tools/calculators/doppler-echo-cardiac-output/detail'),
  DukeTreadmillScoreCalculator: () =>
    import('@/tools/calculators/duke-treadmill-score/detail'),
  AverageCollectionPeriodCalculator: () =>
    import('@/tools/calculators/average-collection-period/detail'),
  AverageFixedCostCalculator: () =>
    import('@/tools/calculators/average-fixed-cost/detail'),
  BounceRateCalculator: () =>
    import('@/tools/calculators/bounce-rate/detail'),
  BradfordFactorCalculator: () =>
    import('@/tools/calculators/bradford-factor/detail'),
  BreakEvenCalculator: () =>
    import('@/tools/calculators/break-even/detail'),
  BishopScoreCalculator: () =>
    import('@/tools/calculators/bishop-score/detail'),
  BladderVolumeCalculator: () =>
    import('@/tools/calculators/bladder-volume/detail'),
  BreastCancerRecurrenceRiskCalculator: () =>
    import('@/tools/calculators/breast-cancer-recurrence-risk/detail'),
  BreastfeedingCalorieCalculator: () =>
    import('@/tools/calculators/breastfeeding-calorie/detail'),
  BrexitCalculator: () => import('@/tools/calculators/brexit/detail'),
  BuildVsBuyCalculator: () =>
    import('@/tools/calculators/build-vs-buy/detail'),
  BunCreatinineRatioCalculator: () =>
    import('@/tools/calculators/bun-creatinine-ratio/detail'),
  BurnRateCalculator: () =>
    import('@/tools/calculators/burn-rate/detail'),
  BurndownChartCalculator: () =>
    import('@/tools/calculators/burndown-chart/detail'),
  BudgetCalculator: () => import('@/tools/calculators/budget/detail'),
  BusinessBudgetCalculator: () =>
    import('@/tools/calculators/business-budget/detail'),
  BusinessValuationCalculator: () =>
    import('@/tools/calculators/business-valuation/detail'),
  CagrCalculator: () => import('@/tools/calculators/cagr/detail'),
  Cha2ds2VascCalculator: () =>
    import('@/tools/calculators/cha2ds2-vasc/detail'),
  CvdRiskCalculator: () => import('@/tools/calculators/cvd-risk/detail'),
  CalorieCalculator: () =>
    import('@/tools/calculators/calorie/detail'),
  CalorieIntakeSimpleCalculator: () =>
    import('@/tools/calculators/calorie-intake-simple/detail'),
  CaffeineCalculator: () =>
    import('@/tools/calculators/caffeine/detail'),
  CaloriesBurnedCalculator: () =>
    import('@/tools/calculators/calories-burned/detail'),
  CallOptionCalculator: () => import('@/tools/calculators/call-option/detail'),
  CapmCalculator: () => import('@/tools/calculators/capm/detail'),
  CardiacOutputCalculator: () =>
    import('@/tools/calculators/cardiac-output/detail'),
  CardiacIndexCalculator: () =>
    import('@/tools/calculators/cardiac-index/detail'),
  CanadianMortgageCalculator: () =>
    import('@/tools/calculators/canadian-mortgage/detail'),
  MortgageCalculatorUk: () =>
    import('@/tools/calculators/mortgage-uk/detail'),
  CarInterestCalculator: () =>
    import('@/tools/calculators/car-interest/detail'),
  CarLeaseCalculator: () =>
    import('@/tools/calculators/car-lease/detail'),
  LeaseMileageCalculator: () =>
    import('@/tools/calculators/lease-mileage/detail'),
  CarLoanEmiCalculator: () =>
    import('@/tools/calculators/car-loan-emi/detail'),
  CarpoolingCalculator: () =>
    import('@/tools/calculators/carpooling/detail'),
  CarRefinanceCalculator: () =>
    import('@/tools/calculators/car-refinance/detail'),
  RefinanceCalculator: () =>
    import('@/tools/calculators/refinance/detail'),
  CarriedInterestCalculator: () =>
    import('@/tools/calculators/carried-interest/detail'),
  CashBackCalculator: () =>
    import('@/tools/calculators/cash-back/detail'),
  CashBackOrLowInterestCalculator: () =>
    import('@/tools/calculators/cash-back-or-low-interest/detail'),
  CashFlowToDebtRatioCalculator: () =>
    import('@/tools/calculators/cash-flow-to-debt-ratio/detail'),
  CashRatioCalculator: () => import('@/tools/calculators/cash-ratio/detail'),
  CerebralPerfusionPressureCalculator: () =>
    import('@/tools/calculators/cerebral-perfusion-pressure/detail'),
  CheckDigitCalculator: () =>
    import('@/tools/calculators/check-digit/detail'),
  ChildTaxCreditCalculator: () =>
    import('@/tools/calculators/child-tax-credit/detail'),
  CigaretteCalculator: () =>
    import('@/tools/calculators/cigarette/detail'),
  CiwaCalculator: () => import('@/tools/calculators/ciwa/detail'),
  ClomidOvulationCalculator: () =>
    import('@/tools/calculators/clomid-ovulation/detail'),
  ChurnRateCalculator: () =>
    import('@/tools/calculators/churn-rate/detail'),
  CltvCalculator: () => import('@/tools/calculators/cltv/detail'),
  ConceptionCalculator: () =>
    import('@/tools/calculators/conception/detail'),
  ConsultingFeesCalculator: () =>
    import('@/tools/calculators/consulting-fees/detail'),
  ContributionMarginCalculator: () =>
    import('@/tools/calculators/contribution-margin/detail'),
  ConversionRateCalculator: () =>
    import('@/tools/calculators/conversion-rate/detail'),
  CostFunctionCalculator: () =>
    import('@/tools/calculators/cost-function/detail'),
  CostOfDoingBusinessCalculator: () =>
    import('@/tools/calculators/cost-of-doing-business/detail'),
  CostOfGoodsSoldCalculator: () =>
    import('@/tools/calculators/cost-of-goods-sold/detail'),
  CostOfEquityCalculator: () =>
    import('@/tools/calculators/cost-of-equity/detail'),
  CpaCalculator: () =>
    import('@/tools/calculators/cpa/detail'),
  CpcAndCpmCalculator: () =>
    import('@/tools/calculators/cpc-and-cpm/detail'),
  CpmCalculator: () =>
    import('@/tools/calculators/cpm/detail'),
  CtrCalculator: () =>
    import('@/tools/calculators/ctr/detail'),
  Curb65Calculator: () =>
    import('@/tools/calculators/curb-65/detail'),
  CustomerAcquisitionCostCalculator: () =>
    import('@/tools/calculators/customer-acquisition-cost/detail'),
  CustomerRetentionRateCalculator: () =>
    import('@/tools/calculators/customer-retention-rate/detail'),
  CyberMondayCalculator: () =>
    import('@/tools/calculators/cyber-monday/detail'),
  DaysOffCalculator: () =>
    import('@/tools/calculators/days-off/detail'),
  DividendDiscountModelCalculator: () =>
    import('@/tools/calculators/dividend-discount-model/detail'),
  DividendPayoutRatioCalculator: () =>
    import('@/tools/calculators/dividend-payout-ratio/detail'),
  DividendYieldCalculator: () =>
    import('@/tools/calculators/dividend-yield/detail'),
  DosageCalculator: () => import('@/tools/calculators/dosage/detail'),
  DirectMaterialPriceVarianceCalculator: () =>
    import('@/tools/calculators/direct-material-price-variance/detail'),
  DupontAnalysisCalculator: () =>
    import('@/tools/calculators/dupont-analysis/detail'),
  EarningsPerShareCalculator: () =>
    import('@/tools/calculators/earnings-per-share/detail'),
  EarningsPerShareGrowthCalculator: () =>
    import('@/tools/calculators/earnings-per-share-growth/detail'),
  EarCalculator: () => import('@/tools/calculators/ear/detail'),
  EarlyLoanPayoffCalculator: () =>
    import('@/tools/calculators/early-loan-payoff/detail'),
  EarlyRetirementCalculator: () =>
    import('@/tools/calculators/early-retirement/detail'),
  EbitCalculator: () => import('@/tools/calculators/ebit/detail'),
  EbitdaCalculator: () => import('@/tools/calculators/ebitda/detail'),
  EbitdaMultipleCalculator: () =>
    import('@/tools/calculators/ebitda-multiple/detail'),
  EggFreezingCalculator: () =>
    import('@/tools/calculators/egg-freezing/detail'),
  EcgBoxesToSecondsCalculator: () =>
    import('@/tools/calculators/ecg-boxes-to-seconds/detail'),
  EcgHeartRateCalculator: () =>
    import('@/tools/calculators/ecg-heart-rate/detail'),
  EconomicValueAddedCalculator: () =>
    import('@/tools/calculators/economic-value-added/detail'),
  EddCalculator: () => import('@/tools/calculators/edd/detail'),
  EffectiveDurationCalculator: () =>
    import('@/tools/calculators/effective-duration/detail'),
  EmiCalculator: () =>
    import('@/tools/calculators/emi/detail'),
  EpfCalculator: () =>
    import('@/tools/calculators/epf/detail'),
  EnterpriseValueCalculator: () =>
    import('@/tools/calculators/enterprise-value/detail'),
  EbtCalculator: () => import('@/tools/calculators/ebt/detail'),
  EstateTaxCalculator: () => import('@/tools/calculators/estate-tax/detail'),
  ExcessiveWeightGainInPregnancyCalculator: () =>
    import('@/tools/calculators/excessive-weight-gain-in-pregnancy/detail'),
  EquivalentRateCalculator: () =>
    import('@/tools/calculators/equivalent-rate/detail'),
  EffectiveCorporateTaxRateCalculator: () =>
    import('@/tools/calculators/effective-corporate-tax-rate/detail'),
  EmvCalculator: () =>
    import('@/tools/calculators/emv/detail'),
  EvmCalculator: () =>
    import('@/tools/calculators/evm/detail'),
  ExitRateCalculator: () =>
    import('@/tools/calculators/exit-rate/detail'),
  ExpectedReturnCalculator: () =>
    import('@/tools/calculators/expected-return/detail'),
  ExpenseRatioCalculator: () =>
    import('@/tools/calculators/expense-ratio/detail'),
  FifoInventoryCalculator: () =>
    import('@/tools/calculators/fifo-inventory/detail'),
  FlangeSizeCalculator: () =>
    import('@/tools/calculators/flange-size/detail'),
  FullTimeEquivalentCalculator: () =>
    import('@/tools/calculators/full-time-equivalent/detail'),
  GmroiCalculator: () =>
    import('@/tools/calculators/gmroi/detail'),
  GoogleAdsenseCalculator: () =>
    import('@/tools/calculators/google-adsense/detail'),
  GrahamNumberCalculator: () =>
    import('@/tools/calculators/graham-number/detail'),
  HasBledCalculator: () =>
    import('@/tools/calculators/has-bled/detail'),
  HeartScoreCalculator: () =>
    import('@/tools/calculators/heart-score/detail'),
  HeartFailureLifeExpectancyCalculator: () =>
    import('@/tools/calculators/heart-failure-life-expectancy/detail'),
  HcgLevelsCalculator: () =>
    import('@/tools/calculators/hcg-levels/detail'),
  ImplantationCalculator: () =>
    import('@/tools/calculators/implantation/detail'),
  HedgeRatioCalculator: () =>
    import('@/tools/calculators/hedge-ratio/detail'),
  HhiCalculator: () =>
    import('@/tools/calculators/hhi/detail'),
  HighLowMethodCalculator: () =>
    import('@/tools/calculators/high-low-method/detail'),
  LaborCostCalculator: () =>
    import('@/tools/calculators/labor-cost/detail'),
  LemonadeStandCalculator: () =>
    import('@/tools/calculators/lemonade-stand/detail'),
  LightsCriteriaCalculator: () =>
    import('@/tools/calculators/lights-criteria/detail'),
  LernerIndexCalculator: () =>
    import('@/tools/calculators/lerner-index/detail'),
  LevothyroxineDosageCalculator: () =>
    import('@/tools/calculators/levothyroxine-dosage/detail'),
  LutealPhaseCalculator: () =>
    import('@/tools/calculators/luteal-phase/detail'),
  LiquidNetWorthCalculator: () =>
    import('@/tools/calculators/liquid-net-worth/detail'),
  LoanBalanceCalculator: () =>
    import('@/tools/calculators/loan-balance/detail'),
  LoanPaymentCalculator: () =>
    import('@/tools/calculators/loan-payment/detail'),
  LoanRepaymentCalculator: () =>
    import('@/tools/calculators/loan-repayment/detail'),
  QuickRatioCalculator: () =>
    import('@/tools/calculators/quick-ratio/detail'),
  QtcCalculator: () => import('@/tools/calculators/qtc/detail'),
  ManHoursCalculator: () =>
    import('@/tools/calculators/man-hours/detail'),
  MarginInterestCalculator: () =>
    import('@/tools/calculators/margin-interest/detail'),
  MarginalCostCalculator: () =>
    import('@/tools/calculators/marginal-cost/detail'),
  MarketCapitalizationCalculator: () =>
    import('@/tools/calculators/market-capitalization/detail'),
  MaturityValueCalculator: () =>
    import('@/tools/calculators/maturity-value/detail'),
  MirrCalculator: () =>
    import('@/tools/calculators/mirr/detail'),
  MitralValveAreaCalculator: () =>
    import('@/tools/calculators/mitral-valve-area/detail'),
  MoneyCounterCalculator: () =>
    import('@/tools/calculators/money-counter/detail'),
  MoneyFactorCalculator: () =>
    import('@/tools/calculators/money-factor/detail'),
  MoneyMarketAccountCalculator: () =>
    import('@/tools/calculators/money-market-account/detail'),
  MonthOverMonthCalculator: () =>
    import('@/tools/calculators/month-over-month/detail'),
  MovingAverageCalculator: () =>
    import('@/tools/calculators/moving-average/detail'),
  MutualFundCalculator: () =>
    import('@/tools/calculators/mutual-fund/detail'),
  MvaCalculator: () =>
    import('@/tools/calculators/mva/detail'),
  NationalInsuranceCalculator: () =>
    import('@/tools/calculators/national-insurance/detail'),
  NavCalculator: () =>
    import('@/tools/calculators/nav/detail'),
  NavyBodyFatCalculator: () =>
    import('@/tools/calculators/navy-body-fat/detail'),
  NuchalTranslucencyCalculator: () =>
    import('@/tools/calculators/nuchal-translucency/detail'),
  SkinfoldBodyFatCalculator: () =>
    import('@/tools/calculators/skinfold-body-fat/detail'),
  NopatCalculator: () =>
    import('@/tools/calculators/nopat/detail'),
  NpvCalculator: () =>
    import('@/tools/calculators/npv/detail'),
  OnlineMarketingConversionCalculator: () =>
    import('@/tools/calculators/online-marketing-conversion/detail'),
  OperatingAssetTurnoverCalculator: () =>
    import('@/tools/calculators/operating-asset-turnover/detail'),
  OptimalHedgeRatioCalculator: () =>
    import('@/tools/calculators/optimal-hedge-ratio/detail'),
  OptimalPriceCalculator: () =>
    import('@/tools/calculators/optimal-price/detail'),
  OpportunityCostCalculator: () =>
    import('@/tools/calculators/opportunity-cost/detail'),
  ParkingRatioCalculator: () =>
    import('@/tools/calculators/parking-ratio/detail'),
  PartiallyAmortizedLoanCalculator: () =>
    import('@/tools/calculators/partially-amortized-loan/detail'),
  PaydayLoanCalculator: () =>
    import('@/tools/calculators/payday-loan/detail'),
  PaymentCalculator: () =>
    import('@/tools/calculators/payment/detail'),
  PaybackPeriodCalculator: () =>
    import('@/tools/calculators/payback-period/detail'),
  PaduaScoreCalculator: () =>
    import('@/tools/calculators/padua-score/detail'),
  ParacetamolDosageCalculator: () =>
    import('@/tools/calculators/paracetamol-dosage/detail'),
  PayPalFeeCalculator: () =>
    import('@/tools/calculators/paypal-fee/detail'),
  PayRaiseCalculator: () =>
    import('@/tools/calculators/pay-raise/detail'),
  PeakFlowCalculator: () =>
    import('@/tools/calculators/peak-flow/detail'),
  PegRatioCalculator: () =>
    import('@/tools/calculators/peg-ratio/detail'),
  PenceToPoundsConverter: () =>
    import('@/tools/calculators/pence-to-pounds/detail'),
  PearlIndexCalculator: () =>
    import('@/tools/calculators/pearl-index/detail'),
  PensionCalculator: () =>
    import('@/tools/calculators/pension/detail'),
  PercCalculator: () => import('@/tools/calculators/perc/detail'),
  PercentOffCalculator: () =>
    import('@/tools/calculators/percent-off/detail'),
  PercentageDiscountCalculator: () =>
    import('@/tools/calculators/percentage-discount/detail'),
  PercentageReturnCalculator: () =>
    import('@/tools/calculators/percentage-return/detail'),
  PeriodCalculator: () => import('@/tools/calculators/period/detail'),
  PerpetuityCalculator: () =>
    import('@/tools/calculators/perpetuity/detail'),
  PfRatioCalculator: () => import('@/tools/calculators/pf-ratio/detail'),
  QpQsCalculator: () => import('@/tools/calculators/qpqs/detail'),
  PisaCalculator: () => import('@/tools/calculators/pisa/detail'),
  PitiCalculator: () => import('@/tools/calculators/piti/detail'),
  PivotPointCalculator: () =>
    import('@/tools/calculators/pivot-point/detail'),
  PortfolioBetaCalculator: () =>
    import('@/tools/calculators/portfolio-beta/detail'),
  PositivePregnancyFollowUpCalculator: () =>
    import('@/tools/calculators/positive-pregnancy-follow-up/detail'),
  PositivePregnancyTestAt3WeeksCalculator: () =>
    import('@/tools/calculators/positive-pregnancy-test-3-weeks/detail'),
  PostJudgmentInterestCalculator: () =>
    import('@/tools/calculators/post-judgment-interest/detail'),
  PreAndPostMoneyValuationCalculator: () =>
    import('@/tools/calculators/pre-and-post-money-valuation/detail'),
  PregnancyCalculator: () =>
    import('@/tools/calculators/pregnancy/detail'),
  PregnancyConceptionCalculator: () =>
    import('@/tools/calculators/pregnancy-conception/detail'),
  PregnancyTestCalculator: () =>
    import('@/tools/calculators/pregnancy-test/detail'),
  PregnancyWeightGainCalculator: () =>
    import('@/tools/calculators/pregnancy-weight-gain/detail'),
  PregnancyWeightGainWeekByWeekCalculator: () =>
    import('@/tools/calculators/pregnancy-weight-gain-week-by-week/detail'),
  PresentValueCalculator: () =>
    import('@/tools/calculators/present-value/detail'),
  PriceElasticityOfDemandCalculator: () =>
    import('@/tools/calculators/price-elasticity-of-demand/detail'),
  PriceElasticityOfSupplyCalculator: () =>
    import('@/tools/calculators/price-elasticity-of-supply/detail'),
  PriceQuantityCalculator: () =>
    import('@/tools/calculators/price-quantity/detail'),
  PriceToBookRatioCalculator: () =>
    import('@/tools/calculators/price-to-book-ratio/detail'),
  PriceToCashFlowRatioCalculator: () =>
    import('@/tools/calculators/price-to-cash-flow-ratio/detail'),
  PriceToEarningsRatioCalculator: () =>
    import('@/tools/calculators/price-to-earnings-ratio/detail'),
  PrivateSavingsCalculator: () =>
    import('@/tools/calculators/private-savings/detail'),
  ProgesteroneToEstrogenRatioCalculator: () =>
    import('@/tools/calculators/progesterone-to-estrogen-ratio/detail'),
  ProratedSalaryCalculator: () =>
    import('@/tools/calculators/prorated-salary/detail'),
  ProratedRentCalculator: () =>
    import('@/tools/calculators/prorated-rent/detail'),
  PutCallParityCalculator: () =>
    import('@/tools/calculators/put-call-parity/detail'),
  PvgoCalculator: () =>
    import('@/tools/calculators/pvgo/detail'),
  PvifaCalculator: () =>
    import('@/tools/calculators/pvifa/detail'),
  PvrCalculator: () => import('@/tools/calculators/pvr/detail'),
  RateOfPayCalculator: () =>
    import('@/tools/calculators/rate-of-pay/detail'),
  RateOfReturnCalculator: () =>
    import('@/tools/calculators/rate-of-return/detail'),
  RatePressureProductCalculator: () =>
    import('@/tools/calculators/rate-pressure-product/detail'),
  RbcIndicesCalculator: () =>
    import('@/tools/calculators/rbc-indices/detail'),
  RdCalculator: () => import('@/tools/calculators/rd/detail'),
  RealEstateCommissionCalculator: () =>
    import('@/tools/calculators/real-estate-commission/detail'),
  RealGdpCalculator: () => import('@/tools/calculators/real-gdp/detail'),
  RealRateOfReturnCalculator: () =>
    import('@/tools/calculators/real-rate-of-return/detail'),
  RealtorCommissionVatCalculator: () =>
    import('@/tools/calculators/realtor-commission-vat/detail'),
  RelativeStrengthIndexCalculator: () =>
    import('@/tools/calculators/relative-strength-index/detail'),
  ReserveRatioCalculator: () =>
    import('@/tools/calculators/reserve-ratio/detail'),
  ResidualIncomeCalculator: () =>
    import('@/tools/calculators/residual-income/detail'),
  RetirementWithdrawalCalculator: () =>
    import('@/tools/calculators/retirement-withdrawal/detail'),
  ReturnOnAssetsCalculator: () =>
    import('@/tools/calculators/return-on-assets/detail'),
  ReturnOnEquityCalculator: () =>
    import('@/tools/calculators/return-on-equity/detail'),
  RoicCalculator: () => import('@/tools/calculators/roic/detail'),
  RothIraCalculator: () =>
    import('@/tools/calculators/roth-ira/detail'),
  SustainableGrowthRateCalculator: () =>
    import('@/tools/calculators/sustainable-growth-rate/detail'),
  SwpCalculator: () => import('@/tools/calculators/swp/detail'),
  UnleveredBetaCalculator: () =>
    import('@/tools/calculators/unlevered-beta/detail'),
  WaccCalculator: () => import('@/tools/calculators/wacc/detail'),
  YieldToMaturityCalculator: () =>
    import('@/tools/calculators/yield-to-maturity/detail'),
  YieldToCallCalculator: () =>
    import('@/tools/calculators/yield-to-call/detail'),
  UkCoinWeightCalculator: () =>
    import('@/tools/calculators/uk-coin-weight/detail'),
  BuyingPowerCalculator: () =>
    import('@/tools/calculators/buying-power/detail'),
  CarryTradeCalculator: () =>
    import('@/tools/calculators/carry-trade/detail'),
  CobbDouglasCalculator: () =>
    import('@/tools/calculators/cobb-douglas/detail'),
  CpiInflationCalculator: () =>
    import('@/tools/calculators/cpi-inflation/detail'),
  CurrencyCalculator: () => import('@/tools/calculators/currency/detail'),
  CurrencyForwardCalculator: () =>
    import('@/tools/calculators/currency-forward/detail'),
  DeadSpaceCalculator: () =>
    import('@/tools/calculators/dead-space/detail'),
  DeadweightLossCalculator: () =>
    import('@/tools/calculators/deadweight-loss/detail'),
  DiscretionaryIncomeCalculator: () =>
    import('@/tools/calculators/discretionary-income/detail'),
  FisherEffectCalculator: () =>
    import('@/tools/calculators/fisher-effect/detail'),
  FaceShapeCalculator: () =>
    import('@/tools/calculators/face-shape/detail'),
  FalseNegativePregnancyTestCalculator: () =>
    import('@/tools/calculators/false-negative-pregnancy-test/detail'),
  FertilityByAgeCalculator: () =>
    import('@/tools/calculators/fertility-by-age/detail'),
  Fev1FvcRatioCalculator: () =>
    import('@/tools/calculators/fev1-fvc-ratio/detail'),
  FisherEquationCalculator: () =>
    import('@/tools/calculators/fisher-equation/detail'),
  ForwardPremiumCalculator: () =>
    import('@/tools/calculators/forward-premium/detail'),
  ForwardRateCalculator: () =>
    import('@/tools/calculators/forward-rate/detail'),
  FourTScoreCalculator: () =>
    import('@/tools/calculators/four-t-score/detail'),
  FraminghamRiskCalculator: () =>
    import('@/tools/calculators/framingham-risk/detail'),
  FuturesContractsCalculator: () =>
    import('@/tools/calculators/futures-contracts/detail'),
  GabapentinDosageCalculator: () =>
    import('@/tools/calculators/gabapentin-dosage/detail'),

  ComparativeAdvantageCalculator: () =>
    import('@/tools/calculators/comparative-advantage/detail'),
  GdpDeflatorFormulaCalculator: () =>
    import('@/tools/calculators/gdp-deflator-formula/detail'),
  GdpGapCalculator: () => import('@/tools/calculators/gdp-gap/detail'),
  GdpGrowthRateCalculator: () =>
    import('@/tools/calculators/gdp-growth-rate/detail'),
  GdpPerCapitaCalculator: () =>
    import('@/tools/calculators/gdp-per-capita/detail'),
  GiniCoefficientCalculator: () =>
    import('@/tools/calculators/gini-coefficient/detail'),
  InflationCalculator: () =>
    import('@/tools/calculators/inflation/detail'),
  LaborForceParticipationRateCalculator: () =>
    import('@/tools/calculators/labor-force-participation/detail'),
  LcrCalculator: () => import('@/tools/calculators/lcr/detail'),
  LgdCalculator: () => import('@/tools/calculators/lgd/detail'),
  LumpsumCalculator: () =>
    import('@/tools/calculators/lumpsum/detail'),
  MoneyMultiplierCalculator: () =>
    import('@/tools/calculators/money-multiplier/detail'),
  MoneySupplyCalculator: () =>
    import('@/tools/calculators/money-supply/detail'),
  MoratoriumCalculator: () =>
    import('@/tools/calculators/moratorium/detail'),
  MpcCalculator: () => import('@/tools/calculators/mpc/detail'),
  NsfrCalculator: () => import('@/tools/calculators/nsfr/detail'),
  OkunsLawCalculator: () => import('@/tools/calculators/okuns-law/detail'),
  PhillipsCurveCalculator: () =>
    import('@/tools/calculators/phillips-curve/detail'),
  PomisCalculator: () => import('@/tools/calculators/pomis/detail'),
  PpfCalculator: () => import('@/tools/calculators/ppf/detail'),
  PppCalculator: () => import('@/tools/calculators/ppp/detail'),
  RentalCommissionCalculator: () =>
    import('@/tools/calculators/rental-commission/detail'),
  RentalPropertyCalculator: () =>
    import('@/tools/calculators/rental-property/detail'),
  RentSplitCalculator: () =>
    import('@/tools/calculators/rent-split/detail'),
  RentVsBuyCalculator: () =>
    import('@/tools/calculators/rent-vs-buy/detail'),
  BitcoinEtfCalculator: () =>
    import('@/tools/calculators/bitcoin-etf/detail'),
  BiweeklyMortgageCalculator: () =>
    import('@/tools/calculators/biweekly-mortgage/detail'),
  BiWeeklyMortgagePaymentCalculator: () =>
    import('@/tools/calculators/bi-weekly-mortgage-payment/detail'),
  BiweeklyPayCalculator: () =>
    import('@/tools/calculators/biweekly-pay/detail'),
  SemiMonthlyPayCalculator: () =>
    import('@/tools/calculators/semi-monthly-pay/detail'),
  BlackFridayCalculator: () =>
    import('@/tools/calculators/black-friday/detail'),
  BlackScholesCalculator: () =>
    import('@/tools/calculators/black-scholes/detail'),
  BloodDonationDueDateCalculator: () =>
    import('@/tools/calculators/blood-donation-due-date/detail'),
  BloodPregnancyHcgCalculator: () =>
    import('@/tools/calculators/blood-pregnancy-hcg/detail'),
  BloodPressureCalculator: () =>
    import('@/tools/calculators/blood-pressure/detail'),
  BoatLoanCalculator: () =>
    import('@/tools/calculators/boat-loan/detail'),
  BoatSpeedCalculator: () =>
    import('@/tools/calculators/boat-speed/detail'),
  BoostHorsepowerCalculator: () =>
    import('@/tools/calculators/boost-horsepower/detail'),
  HorsepowerCalculator: () =>
    import('@/tools/calculators/horsepower/detail'),
  BsfcCalculator: () => import('@/tools/calculators/bsfc/detail'),
  BodyFatCalculator: () =>
    import('@/tools/calculators/body-fat/detail'),
  BondCalculator: () => import('@/tools/calculators/bond/detail'),
  BondConvexityCalculator: () =>
    import('@/tools/calculators/bond-convexity/detail'),
  BondCurrentYieldCalculator: () =>
    import('@/tools/calculators/bond-current-yield/detail'),
  BondEquivalentYieldCalculator: () =>
    import('@/tools/calculators/bond-equivalent-yield/detail'),
  BondPriceCalculator: () =>
    import('@/tools/calculators/bond-price/detail'),
  BondYieldCalculator: () =>
    import('@/tools/calculators/bond-yield/detail'),
  BondYtmCalculator: () =>
    import('@/tools/calculators/bond-ytm/detail'),
  JumboLoanCalculator: () =>
    import('@/tools/calculators/jumbo-loan/detail'),
  LandLoanCalculator: () =>
    import('@/tools/calculators/land-loan/detail'),
  LeaseCalculator: () => import('@/tools/calculators/lease/detail'),
  PagIbigHousingLoanCalculator: () =>
    import('@/tools/calculators/pag-ibig-housing-loan/detail'),
  RvLoanCalculator: () => import('@/tools/calculators/rv-loan/detail'),
  StudentLoanCalculator: () =>
    import('@/tools/calculators/student-loan/detail'),
  StudentLoanForgivenessCalculator: () =>
    import('@/tools/calculators/student-loan-forgiveness/detail'),
  StudentLoanPaymentCalculator: () =>
    import('@/tools/calculators/student-loan-payment/detail'),
  SimpleMortgageCalculator: () =>
    import('@/tools/calculators/simple-mortgage/detail'),
  LtvCalculator: () => import('@/tools/calculators/ltv/detail'),
  LungCancerRiskCalculator: () =>
    import('@/tools/calculators/lung-cancer-risk/detail'),
  LungCapacityCalculator: () =>
    import('@/tools/calculators/lung-capacity/detail'),
  LungNoduleGrowthRateCalculator: () =>
    import('@/tools/calculators/lung-nodule-growth-rate/detail'),
  VitalCapacityCalculator: () =>
    import('@/tools/calculators/vital-capacity/detail'),
  CdCalculator: () => import('@/tools/calculators/cd/detail'),
  CapitalGainsYieldCalculator: () =>
    import('@/tools/calculators/capital-gains-yield/detail'),
  CapitalGainsTaxUkCalculator: () =>
    import('@/tools/calculators/capital-gains-tax-uk/detail'),
  CompoundInterestCalculator: () =>
    import('@/tools/calculators/compound-interest/detail'),
  CompoundInterestRateCalculator: () =>
    import('@/tools/calculators/compound-interest-rate/detail'),
  CompressionRatioCalculator: () =>
    import('@/tools/calculators/compression-ratio/detail'),
  CompressionRatioToPsiCalculator: () =>
    import('@/tools/calculators/compression-ratio-to-psi/detail'),
  CompoundGrowthCalculator: () =>
    import('@/tools/calculators/compound-growth/detail'),
  ContinuousCompoundInterestCalculator: () =>
    import('@/tools/calculators/continuous-compound-interest/detail'),
  CouponPaymentCalculator: () =>
    import('@/tools/calculators/coupon-payment/detail'),
  CouponRateCalculator: () =>
    import('@/tools/calculators/coupon-rate/detail'),
  CreditSpreadCalculator: () =>
    import('@/tools/calculators/credit-spread/detail'),
  CreditCardCalculator: () =>
    import('@/tools/calculators/credit-card/detail'),
  CreditCardInterestCalculator: () =>
    import('@/tools/calculators/credit-card-interest/detail'),
  CreditCardMinimumPaymentCalculator: () =>
    import('@/tools/calculators/credit-card-minimum-payment/detail'),
  CrownRumpLengthCalculator: () =>
    import('@/tools/calculators/crown-rump-length/detail'),
  CreditCardPaymentCalculator: () =>
    import('@/tools/calculators/credit-card-payment/detail'),
  CreditCardPayoffCalculator: () =>
    import('@/tools/calculators/credit-card-payoff/detail'),
  CreditUtilizationCalculator: () =>
    import('@/tools/calculators/credit-utilization/detail'),
  CrossExchangeRateCalculator: () =>
    import('@/tools/calculators/cross-exchange-rate/detail'),
  CrosswindCalculator: () =>
    import('@/tools/calculators/crosswind/detail'),
  DiscountedCashFlowCalculator: () =>
    import('@/tools/calculators/discounted-cash-flow/detail'),
  DiscountCalculator: () =>
    import('@/tools/calculators/discount/detail'),
  DiscountRateCalculator: () =>
    import('@/tools/calculators/discount-rate/detail'),
  DoubleDiscountCalculator: () =>
    import('@/tools/calculators/double-discount/detail'),
  DriveTimeCalculator: () =>
    import('@/tools/calculators/drive-time/detail'),
  EngineHoursToMilesConverter: () =>
    import('@/tools/calculators/engine-hours-to-miles/detail'),
  FlightRadiationCalculator: () =>
    import('@/tools/calculators/flight-radiation/detail'),
  FuelCostCalculator: () =>
    import('@/tools/calculators/fuel-cost/detail'),
  FuelInjectorCalculator: () =>
    import('@/tools/calculators/fuel-injector/detail'),
  FuelPumpCalculator: () =>
    import('@/tools/calculators/fuel-pump/detail'),
  GasCalculator: () => import('@/tools/calculators/gas/detail'),
  GasOilRatioCalculator: () =>
    import('@/tools/calculators/gas-oil-ratio/detail'),
  GvwrCalculator: () => import('@/tools/calculators/gvwr/detail'),
  IdlingFuelConsumptionCalculator: () =>
    import('@/tools/calculators/idling-fuel-consumption/detail'),
  MilesPerYearCalculator: () =>
    import('@/tools/calculators/miles-per-year/detail'),
  MilesToDollarsCalculator: () =>
    import('@/tools/calculators/miles-to-dollars/detail'),
  MilesToHoursConverter: () =>
    import('@/tools/calculators/miles-to-hours/detail'),
  MpgCalculator: () => import('@/tools/calculators/mpg/detail'),
  NauticalMileCalculator: () =>
    import('@/tools/calculators/nautical-mile/detail'),
  PulsePerMileCalculator: () =>
    import('@/tools/calculators/pulse-per-mile/detail'),
  RpmCalculator: () => import('@/tools/calculators/rpm/detail'),
  SpeedCalculator: () => import('@/tools/calculators/speed/detail'),
  SpeedometerGearCalculator: () =>
    import('@/tools/calculators/speedometer-gear/detail'),
  TramadolDosageCalculator: () =>
    import('@/tools/calculators/tramadol-dosage/detail'),
  TripleDiscountCalculator: () =>
    import('@/tools/calculators/triple-discount/detail'),
  EffectiveAnnualYieldCalculator: () =>
    import('@/tools/calculators/effective-annual-yield/detail'),
  EffectiveInterestRateCalculator: () =>
    import('@/tools/calculators/effective-interest-rate/detail'),
  EjectionFractionCalculator: () =>
    import('@/tools/calculators/ejection-fraction/detail'),
  EndingInventoryCalculator: () =>
    import('@/tools/calculators/ending-inventory/detail'),
  EoqCalculator: () => import('@/tools/calculators/eoq/detail'),
  EortcBladderCancerRecurrenceProgressionCalculator: () =>
    import(
      '@/tools/calculators/eortc-bladder-cancer-recurrence-progression/detail'
    ),
  EroaMitralRegurgitationCalculator: () =>
    import('@/tools/calculators/eroa-mitral-regurgitation/detail'),
  ExpectedUtilityCalculator: () =>
    import('@/tools/calculators/expected-utility/detail'),
  FreeCashFlowCalculator: () =>
    import('@/tools/calculators/free-cash-flow/detail'),
  FundalHeightCalculator: () =>
    import('@/tools/calculators/fundal-height/detail'),
  FcfeCalculator: () => import('@/tools/calculators/fcfe/detail'),
  FcffCalculator: () => import('@/tools/calculators/fcff/detail'),
  FetalWeightPercentileCalculator: () =>
    import('@/tools/calculators/fetal-weight-percentile/detail'),
  FfoCalculator: () => import('@/tools/calculators/ffo/detail'),
  FibonacciRetracementCalculator: () =>
    import('@/tools/calculators/fibonacci-retracement/detail'),
  FicaTaxCalculator: () => import('@/tools/calculators/fica-tax/detail'),
  FreeFloatCalculator: () => import('@/tools/calculators/free-float/detail'),
  LeveredFreeCashFlowCalculator: () =>
    import('@/tools/calculators/levered-free-cash-flow/detail'),
  UnpaidWorkCalculator: () =>
    import('@/tools/calculators/unpaid-work/detail'),
  UsIncomePercentileCalculator: () =>
    import('@/tools/calculators/us-income-percentile/detail'),
  UnleveredFreeCashFlowCalculator: () =>
    import('@/tools/calculators/unlevered-free-cash-flow/detail'),
  TrumpAccountsCalculator: () =>
    import('@/tools/calculators/trump-accounts/detail'),
  TrumpsTaxesVsYourTaxesCalculator: () =>
    import('@/tools/calculators/trumps-taxes-vs-your-taxes/detail'),
  TwinPregnancyWeightGainCalculator: () =>
    import('@/tools/calculators/twin-pregnancy-weight-gain/detail'),
  TylenolDosageCalculator: () =>
    import('@/tools/calculators/tylenol-dosage/detail'),
  VaDisabilityCalculator: () =>
    import('@/tools/calculators/va-disability/detail'),
  ZakatCalculator: () => import('@/tools/calculators/zakat/detail'),
  VatCalculator: () => import('@/tools/calculators/vat/detail'),
  WeeklyPayCalculator: () => import('@/tools/calculators/weekly-pay/detail'),
  WhatToOfferOnAHouseCalculator: () =>
    import('@/tools/calculators/what-to-offer-on-a-house/detail'),
  CombinedRatioCalculator: () => import('@/tools/calculators/combined-ratio/detail'),
  CustomerEffortScoreCalculator: () =>
    import('@/tools/calculators/customer-effort-score/detail'),
  DartRateCalculator: () => import('@/tools/calculators/dart-rate/detail'),
  HrSoftwareRoiCalculator: () =>
    import('@/tools/calculators/hr-software-roi/detail'),
  LossRatioCalculator: () => import('@/tools/calculators/loss-ratio/detail'),
  NpsCalculator: () => import('@/tools/calculators/nps/detail'),
  RemoteVsOnLocationWorkersCalculator: () =>
    import('@/tools/calculators/remote-vs-on-location-workers/detail'),
  TrirCalculator: () => import('@/tools/calculators/trir/detail'),
  AverageReturnCalculator: () =>
    import('@/tools/calculators/average-return/detail'),
  AverageVariableCostCalculator: () =>
    import('@/tools/calculators/average-variable-cost/detail'),
  MaximumDrawdownCalculator: () =>
    import('@/tools/calculators/maximum-drawdown/detail'),
  FiftyThirtyTwentyCalculator: () =>
    import('@/tools/calculators/fifty-thirty-twenty-rule/detail'),
  ApcCalculator: () => import('@/tools/calculators/apc/detail'),
  AccrualRatioCalculator: () =>
    import('@/tools/calculators/accrual-ratio/detail'),
  ActualCashValueCalculator: () =>
    import('@/tools/calculators/actual-cash-value/detail'),
  BankReconciliationCalculator: () =>
    import('@/tools/calculators/bank-reconciliation/detail'),
  CapRateCalculator: () => import('@/tools/calculators/cap-rate/detail'),
  CashConversionCycleCalculator: () =>
    import('@/tools/calculators/cash-conversion-cycle/detail'),
  ConsumerSurplusCalculator: () =>
    import('@/tools/calculators/consumer-surplus/detail'),
  CrossPriceElasticityCalculator: () =>
    import('@/tools/calculators/cross-price-elasticity/detail'),
  CurrentRatioCalculator: () =>
    import('@/tools/calculators/current-ratio/detail'),
  DegreeOfOperatingLeverageCalculator: () =>
    import('@/tools/calculators/degree-of-operating-leverage/detail'),
  DioCalculator: () => import('@/tools/calculators/dio/detail'),
  DpoCalculator: () => import('@/tools/calculators/dpo/detail'),
  DsoCalculator: () => import('@/tools/calculators/dso/detail'),
  CashOnCashReturnCalculator: () =>
    import('@/tools/calculators/cash-on-cash-return/detail'),
  CarAffordabilityCalculator: () =>
    import('@/tools/calculators/car-affordability/detail'),
  CellPhonePlanCalculator: () =>
    import('@/tools/calculators/cell-phone-plan/detail'),
  CollegeCostCalculator: () =>
    import('@/tools/calculators/college-cost/detail'),
  DreamComeTrueCalculator: () =>
    import('@/tools/calculators/dream-come-true/detail'),
  EarnestMoneyCalculator: () =>
    import('@/tools/calculators/earnest-money/detail'),
  EmergencyFundCalculator: () =>
    import('@/tools/calculators/emergency-fund/detail'),
  EndotrachealTubeSizeCalculator: () =>
    import('@/tools/calculators/endotracheal-tube-size/detail'),
  FinanceCalculator: () => import('@/tools/calculators/finance/detail'),
  FinanceChargeCalculator: () =>
    import('@/tools/calculators/finance-charge/detail'),
  FinancialLeverageRatioCalculator: () =>
    import('@/tools/calculators/financial-leverage-ratio/detail'),
  FireCalculator: () => import('@/tools/calculators/fire/detail'),
  FixedAssetTurnoverRatioCalculator: () =>
    import('@/tools/calculators/fixed-asset-turnover-ratio/detail'),
  GiftOfEquityCalculator: () =>
    import('@/tools/calculators/gift-of-equity/detail'),
  GoldMeltCalculator: () => import('@/tools/calculators/gold-melt/detail'),
  GoodwillCalculator: () => import('@/tools/calculators/goodwill/detail'),
  IncomeElasticityOfDemandCalculator: () =>
    import('@/tools/calculators/income-elasticity-of-demand/detail'),
  InventoryTurnoverCalculator: () =>
    import('@/tools/calculators/inventory-turnover/detail'),
  LifetimeEarningsCalculator: () =>
    import('@/tools/calculators/lifetime-earnings/detail'),
  LifoInventoryCalculator: () =>
    import('@/tools/calculators/lifo-inventory/detail'),
  LongTermCareCalculator: () =>
    import('@/tools/calculators/long-term-care/detail'),
  MegaMillionsPayoutCalculator: () =>
    import('@/tools/calculators/mega-millions-payout/detail'),
  MillionaireCalculator: () =>
    import('@/tools/calculators/millionaire/detail'),
  NetIncomeCalculator: () =>
    import('@/tools/calculators/net-income/detail'),
  NetOperatingAssetsCalculator: () =>
    import('@/tools/calculators/net-operating-assets/detail'),
  NetOperatingIncomeCalculator: () =>
    import('@/tools/calculators/net-operating-income/detail'),
  NetOperatingWorkingCapitalCalculator: () =>
    import('@/tools/calculators/net-operating-working-capital/detail'),
  NetWorthCalculator: () =>
    import('@/tools/calculators/net-worth/detail'),
  PmiCalculator: () => import('@/tools/calculators/pmi/detail'),
  PowerballCalculator: () =>
    import('@/tools/calculators/powerball/detail'),
  PricePerSquareFootCalculator: () =>
    import('@/tools/calculators/price-per-square-foot/detail'),
  PricePerSquareMeterCalculator: () =>
    import('@/tools/calculators/price-per-square-meter/detail'),
  ProductivityCalculator: () =>
    import('@/tools/calculators/productivity/detail'),
  RcriCalculator: () => import('@/tools/calculators/rcri/detail'),
  ReceivablesTurnoverRatioCalculator: () =>
    import('@/tools/calculators/receivables-turnover-ratio/detail'),
  RepaymentCalculator: () =>
    import('@/tools/calculators/repayment/detail'),
  RetainedEarningsCalculator: () =>
    import('@/tools/calculators/retained-earnings/detail'),
  RetentionRatioCalculator: () =>
    import('@/tools/calculators/retention-ratio/detail'),
  ReverseDueDateCalculator: () =>
    import('@/tools/calculators/reverse-due-date/detail'),
  RevisedGenevaScoreCalculator: () =>
    import('@/tools/calculators/revised-geneva-score/detail'),
  RetirementCalculator: () =>
    import('@/tools/calculators/retirement/detail'),
  Rule2836Calculator: () =>
    import('@/tools/calculators/rule-2836/detail'),
  RuleOf72Calculator: () =>
    import('@/tools/calculators/rule-of-72/detail'),
  SabbaticalCalculator: () =>
    import('@/tools/calculators/sabbatical/detail'),
  ScrapGoldCalculator: () =>
    import('@/tools/calculators/scrap-gold/detail'),
  ScrapSilverCalculator: () =>
    import('@/tools/calculators/scrap-silver/detail'),
  SilverMeltCalculator: () =>
    import('@/tools/calculators/silver-melt/detail'),
  SubscriptionWasteCalculator: () =>
    import('@/tools/calculators/subscription-waste/detail'),
  TotalAssetTurnoverCalculator: () =>
    import('@/tools/calculators/total-asset-turnover/detail'),
  WorkingCapitalCalculator: () =>
    import('@/tools/calculators/working-capital/detail'),
  WorkingCapitalTurnoverRatioCalculator: () =>
    import('@/tools/calculators/working-capital-turnover-ratio/detail'),
  OperatingCashFlowCalculator: () =>
    import('@/tools/calculators/operating-cash-flow/detail'),
  OptionsSpreadCalculator: () =>
    import('@/tools/calculators/options-spread/detail'),
  OvulationCalculator: () => import('@/tools/calculators/ovulation/detail'),
  FdCalculator: () => import('@/tools/calculators/fd/detail'),
  FhaLoanCalculator: () => import('@/tools/calculators/fha-loan/detail'),
  FutureValueCalculator: () =>
    import('@/tools/calculators/future-value/detail'),
  FutureSalaryCalculator: () =>
    import('@/tools/calculators/future-salary/detail'),
  HelocCalculator: () => import('@/tools/calculators/heloc/detail'),
  HomeAffordabilityCalculator: () =>
    import('@/tools/calculators/home-affordability/detail'),
  HomeEquityLoanCalculator: () =>
    import('@/tools/calculators/home-equity-loan/detail'),
  HomeImprovementLoanCalculator: () =>
    import('@/tools/calculators/home-improvement-loan/detail'),
  HomeLoanEmiCalculator: () =>
    import('@/tools/calculators/home-loan-emi/detail'),
  HomeLoanCalculator: () => import('@/tools/calculators/home-loan/detail'),
  HomeValueUsCalculator: () =>
    import('@/tools/calculators/home-value-us/detail'),
  HouseAffordabilityCalculator: () =>
    import('@/tools/calculators/house-affordability/detail'),
  HraExemptionCalculator: () =>
    import('@/tools/calculators/hra-exemption/detail'),
  MortgageTaxesInsuranceCalculator: () => import('@/tools/calculators/mortgage-taxes-insurance/detail'),
  MortgageComparisonCalculator: () =>
    import('@/tools/calculators/mortgage-comparison/detail'),
  HomeMortgageCalculator: () =>
    import('@/tools/calculators/home-mortgage/detail'),
  MortgageAmortizationCalculator: () =>
    import('@/tools/calculators/mortgage-amortization/detail'),
  MortgageAccelerationCalculator: () =>
    import('@/tools/calculators/mortgage-acceleration/detail'),
  MortgagePrepaymentCalculator: () =>
    import('@/tools/calculators/mortgage-prepayment/detail'),
  MortgageWithExtraPaymentsCalculator: () =>
    import('@/tools/calculators/mortgage-with-extra-payments/detail'),
  MortgagePointsCalculator: () =>
    import('@/tools/calculators/mortgage-points/detail'),
  HoldingPeriodReturnCalculator: () =>
    import('@/tools/calculators/holding-period-return/detail'),
  HourlyToAnnualSalaryCalculator: () =>
    import('@/tools/calculators/hourly-to-annual-salary/detail'),
  HourlyToSalaryWageCalculator: () =>
    import('@/tools/calculators/hourly-to-salary-wage/detail'),
  HourlyToSalaryWithOvertimeCalculator: () =>
    import('@/tools/calculators/hourly-to-salary-with-overtime/detail'),
  HourlyWageCalculator: () =>
    import('@/tools/calculators/hourly-wage/detail'),
  HoursPayCalculator: () =>
    import('@/tools/calculators/hours-pay/detail'),
  SellingLeaveDaysCalculator: () =>
    import('@/tools/calculators/selling-leave-days/detail'),
  MonthlyIncomeCalculator: () =>
    import('@/tools/calculators/monthly-income/detail'),
  WageCalculator: () => import('@/tools/calculators/wage/detail'),
  WageToSalaryCalculator: () =>
    import('@/tools/calculators/wage-to-salary/detail'),
  YearlyWageCalculator: () =>
    import('@/tools/calculators/yearly-wage/detail'),
  MoneyPerHourCalculator: () =>
    import('@/tools/calculators/money-per-hour/detail'),
  TimeAndAHalfCalculator: () =>
    import('@/tools/calculators/time-and-a-half/detail'),
  MonthlyIncomeHourlyCalculator: () =>
    import('@/tools/calculators/monthly-income-hourly/detail'),
  BillableHoursCalculator: () =>
    import('@/tools/calculators/billable-hours/detail'),
  BillRateCalculator: () =>
    import('@/tools/calculators/bill-rate/detail'),

  ImpermanentLossCalculator: () =>
    import('@/tools/calculators/impermanent-loss/detail'),

  InformationRatioCalculator: () =>
    import('@/tools/calculators/information-ratio/detail'),
  InterestCalculator: () => import('@/tools/calculators/interest/detail'),
  InterestCoverageRatioCalculator: () =>
    import('@/tools/calculators/interest-coverage-ratio/detail'),
  IntrinsicValueCalculator: () =>
    import('@/tools/calculators/intrinsic-value/detail'),
  IraCalculator: () => import('@/tools/calculators/ira/detail'),
  IvfDueDateCalculator: () =>
    import('@/tools/calculators/ivf-due-date/detail'),
  IsBmiPregnancyWeightIndicatorCalculator: () =>
    import('@/tools/calculators/is-bmi-pregnancy-weight-indicator/detail'),
  InterestOnlyMortgageCalculator: () =>
    import('@/tools/calculators/interest-only-mortgage/detail'),
  InterestPerDayCalculator: () =>
    import('@/tools/calculators/interest-per-day/detail'),
  MortgageInterestCalculator: () =>
    import('@/tools/calculators/mortgage-interest/detail'),
  MortgageRateCalculator: () =>
    import('@/tools/calculators/mortgage-rate/detail'),
  MortgageRefinanceCalculator: () =>
    import('@/tools/calculators/mortgage-refinance/detail'),
  InterestRateCalculator: () =>
    import('@/tools/calculators/interest-rate/detail'),
  IrrCalculator: () => import('@/tools/calculators/irr/detail'),
  InvestmentCalculator: () => import('@/tools/calculators/investment/detail'),
  InvestmentFeeCalculator: () =>
    import('@/tools/calculators/investment-fee/detail'),
  JensensAlphaCalculator: () =>
    import('@/tools/calculators/jensens-alpha/detail'),
  SalaryCalculator: () => import('@/tools/calculators/salary/detail'),
  SalaryInflationCalculator: () =>
    import('@/tools/calculators/salary-inflation/detail'),
  SalaryToHourlyCalculator: () =>
    import('@/tools/calculators/salary-to-hourly/detail'),
  SavingsCalculator: () => import('@/tools/calculators/savings/detail'),
  SavingsGoalCalculator: () =>
    import('@/tools/calculators/savings-goal/detail'),
  SavingsInterestRateCalculator: () =>
    import('@/tools/calculators/savings-interest-rate/detail'),
  SavingsPlanCalculator: () =>
    import('@/tools/calculators/savings-plan/detail'),
  SavingsWithdrawalCalculator: () =>
    import('@/tools/calculators/savings-withdrawal/detail'),
  SimpleSavingsCalculator: () =>
    import('@/tools/calculators/simple-savings/detail'),
  SharpeRatioCalculator: () => import('@/tools/calculators/sharpe-ratio/detail'),
  VaMortgageCalculator: () => import('@/tools/calculators/va-mortgage/detail'),
  ValueAtRiskCalculator: () => import('@/tools/calculators/value-at-risk/detail'),
  VbacCalculator: () => import('@/tools/calculators/vbac/detail'),
  VteRiskScorePregnancyCalculator: () =>
    import('@/tools/calculators/vte-risk-pregnancy/detail'),
  EidlCalculator: () => import('@/tools/calculators/eidl/detail'),
  HealsActStimulusCalculator: () =>
    import('@/tools/calculators/heals-act-stimulus/detail'),
  HeroesActStimulusCalculator: () =>
    import('@/tools/calculators/heroes-act-stimulus/detail'),
  CaliforniaStimulusCheckIiCalculator: () =>
    import('@/tools/calculators/california-stimulus-check-ii/detail'),
  StudentLoanRepaymentCovidCalculator: () =>
    import('@/tools/calculators/student-loan-repayment-covid/detail'),
  StimulusCheck40kCalculator: () =>
    import('@/tools/calculators/stimulus-check-40k/detail'),
  StimulusCheckCalculator: () =>
    import('@/tools/calculators/stimulus-check/detail'),
  CaresActUnemploymentBenefitCalculator: () =>
    import('@/tools/calculators/cares-act-unemployment-benefit/detail'),
  LwaUnemploymentBenefitCalculator: () =>
    import('@/tools/calculators/lwa-unemployment-benefit/detail'),
  HealsHeroesUnemploymentBenefitCalculator: () =>
    import('@/tools/calculators/heals-heroes-unemployment-benefit/detail'),
  AustraliaFederalBudgetTaxCutsCalculator: () =>
    import('@/tools/calculators/australia-federal-budget-tax-cuts/detail'),
  CashActStimulusCalculator: () =>
    import('@/tools/calculators/cash-act-stimulus/detail'),
  SecondStimulus900BillionCalculator: () =>
    import('@/tools/calculators/second-stimulus-900-billion/detail'),
  AmericanRescuePlanStimulusCalculator: () =>
    import('@/tools/calculators/american-rescue-plan-stimulus/detail'),
};

export async function loadToolPageDetail(key: string): Promise<ToolPageDetail | null> {
  if (!isRegisteredComponentKey(key)) return null;
  const mod = await details[key]();
  return mod.toolPageDetail;
}
