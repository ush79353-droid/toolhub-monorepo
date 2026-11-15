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
  WeightConverter: () => import('@/tools/calculators/weight-converter/detail'),
  KgToGallonsConverter: () => import('@/tools/calculators/kg-to-gallons/detail'),
  ForceConverter: () => import('@/tools/calculators/force-converter/detail'),
  NmToInLbsConverter: () => import('@/tools/calculators/nm-to-in-lbs/detail'),
  InchLbsToNmConverter: () => import('@/tools/calculators/inch-lbs-to-nm/detail'),
  PressureConversion: () => import('@/tools/calculators/pressure-conversion/detail'),
  InchPoundsToFootPoundsConverter: () =>
    import('@/tools/calculators/inch-pounds-to-foot-pounds/detail'),
  PsiToGpmCalculator: () => import('@/tools/calculators/psi-to-gpm/detail'),
  LbsToNewtonsConverter: () => import('@/tools/calculators/lbs-to-newtons/detail'),
  TorqueToHpCalculator: () => import('@/tools/calculators/torque-to-hp/detail'),
  NewtonMeterCalculator: () => import('@/tools/calculators/newton-meter/detail'),
  TorrToAtmConverter: () => import('@/tools/calculators/torr-to-atm/detail'),
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
  AdditionalFundsNeededCalculator: () =>
    import('@/tools/calculators/additional-funds-needed/detail'),
  AbsencePercentageCalculator: () =>
    import('@/tools/calculators/absence-percentage/detail'),
  AccumulatedDepreciationCalculator: () =>
    import('@/tools/calculators/accumulated-depreciation/detail'),
  AttritionRateCalculator: () =>
    import('@/tools/calculators/attrition-rate/detail'),
  BusinessLoanCalculator: () =>
    import('@/tools/calculators/business-loan/detail'),
  ProfitabilityIndexCalculator: () =>
    import('@/tools/calculators/profitability-index/detail'),
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
  SalesCommissionCalculator: () =>
    import('@/tools/calculators/sales-commission/detail'),
  SellThroughRateCalculator: () =>
    import('@/tools/calculators/sell-through-rate/detail'),
  SimpleInterestCalculator: () =>
    import('@/tools/calculators/simple-interest/detail'),
  SinkingFundCalculator: () =>
    import('@/tools/calculators/sinking-fund/detail'),
  SmokersCtcCalculator: () =>
    import('@/tools/calculators/smokers-ctc/detail'),
  TenureCalculator: () => import('@/tools/calculators/tenure/detail'),
  TimeValueOfMoneyCalculator: () =>
    import('@/tools/calculators/time-value-of-money/detail'),
  TtmCalculator: () => import('@/tools/calculators/ttm/detail'),
  TreynorRatioCalculator: () =>
    import('@/tools/calculators/treynor-ratio/detail'),
  TurnoverRateCalculator: () =>
    import('@/tools/calculators/turnover-rate/detail'),
  WebsiteAdRevenueCalculator: () =>
    import('@/tools/calculators/website-ad-revenue/detail'),
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
  AnnualizedRateOfReturnCalculator: () =>
    import('@/tools/calculators/annualized-rate-of-return/detail'),
  AppreciationCalculator: () =>
    import('@/tools/calculators/appreciation/detail'),
  AnnualizedReturnCalculator: () =>
    import('@/tools/calculators/annualized-return/detail'),
  ApyCalculator: () => import('@/tools/calculators/apy/detail'),
  BasisPointCalculator: () =>
    import('@/tools/calculators/basis-point/detail'),
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
  BuildVsBuyCalculator: () =>
    import('@/tools/calculators/build-vs-buy/detail'),
  BurnRateCalculator: () =>
    import('@/tools/calculators/burn-rate/detail'),
  BurndownChartCalculator: () =>
    import('@/tools/calculators/burndown-chart/detail'),
  BusinessBudgetCalculator: () =>
    import('@/tools/calculators/business-budget/detail'),
  BusinessValuationCalculator: () =>
    import('@/tools/calculators/business-valuation/detail'),
  CagrCalculator: () => import('@/tools/calculators/cagr/detail'),
  ChurnRateCalculator: () =>
    import('@/tools/calculators/churn-rate/detail'),
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
  CpaCalculator: () =>
    import('@/tools/calculators/cpa/detail'),
  CpcAndCpmCalculator: () =>
    import('@/tools/calculators/cpc-and-cpm/detail'),
  CpmCalculator: () =>
    import('@/tools/calculators/cpm/detail'),
  CtrCalculator: () =>
    import('@/tools/calculators/ctr/detail'),
  CustomerAcquisitionCostCalculator: () =>
    import('@/tools/calculators/customer-acquisition-cost/detail'),
  CustomerRetentionRateCalculator: () =>
    import('@/tools/calculators/customer-retention-rate/detail'),
  DaysOffCalculator: () =>
    import('@/tools/calculators/days-off/detail'),
  DirectMaterialPriceVarianceCalculator: () =>
    import('@/tools/calculators/direct-material-price-variance/detail'),
  EarCalculator: () => import('@/tools/calculators/ear/detail'),
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
  FullTimeEquivalentCalculator: () =>
    import('@/tools/calculators/full-time-equivalent/detail'),
  GmroiCalculator: () =>
    import('@/tools/calculators/gmroi/detail'),
  GoogleAdsenseCalculator: () =>
    import('@/tools/calculators/google-adsense/detail'),
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
  LernerIndexCalculator: () =>
    import('@/tools/calculators/lerner-index/detail'),
  LiquidNetWorthCalculator: () =>
    import('@/tools/calculators/liquid-net-worth/detail'),
  ManHoursCalculator: () =>
    import('@/tools/calculators/man-hours/detail'),
  MarginInterestCalculator: () =>
    import('@/tools/calculators/margin-interest/detail'),
  MirrCalculator: () =>
    import('@/tools/calculators/mirr/detail'),
  MoneyFactorCalculator: () =>
    import('@/tools/calculators/money-factor/detail'),
  MoneyMarketAccountCalculator: () =>
    import('@/tools/calculators/money-market-account/detail'),
  MovingAverageCalculator: () =>
    import('@/tools/calculators/moving-average/detail'),
  MutualFundCalculator: () =>
    import('@/tools/calculators/mutual-fund/detail'),
  MvaCalculator: () =>
    import('@/tools/calculators/mva/detail'),
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
  OpportunityCostCalculator: () =>
    import('@/tools/calculators/opportunity-cost/detail'),
  ParkingRatioCalculator: () =>
    import('@/tools/calculators/parking-ratio/detail'),
  PaybackPeriodCalculator: () =>
    import('@/tools/calculators/payback-period/detail'),
  PercentageReturnCalculator: () =>
    import('@/tools/calculators/percentage-return/detail'),
  PerpetuityCalculator: () =>
    import('@/tools/calculators/perpetuity/detail'),
  PreAndPostMoneyValuationCalculator: () =>
    import('@/tools/calculators/pre-and-post-money-valuation/detail'),
  PresentValueCalculator: () =>
    import('@/tools/calculators/present-value/detail'),
  PriceQuantityCalculator: () =>
    import('@/tools/calculators/price-quantity/detail'),
  PvgoCalculator: () =>
    import('@/tools/calculators/pvgo/detail'),
  PvifaCalculator: () =>
    import('@/tools/calculators/pvifa/detail'),
  RateOfReturnCalculator: () =>
    import('@/tools/calculators/rate-of-return/detail'),
  
  RealRateOfReturnCalculator: () =>
    import('@/tools/calculators/real-rate-of-return/detail'),
  BitcoinEtfCalculator: () =>
    import('@/tools/calculators/bitcoin-etf/detail'),
  CdCalculator: () => import('@/tools/calculators/cd/detail'),
  CapitalGainsYieldCalculator: () =>
    import('@/tools/calculators/capital-gains-yield/detail'),
  CompoundInterestCalculator: () =>
    import('@/tools/calculators/compound-interest/detail'),
  CompoundInterestRateCalculator: () =>
    import('@/tools/calculators/compound-interest-rate/detail'),
  CompoundGrowthCalculator: () =>
    import('@/tools/calculators/compound-growth/detail'),
  ContinuousCompoundInterestCalculator: () =>
    import('@/tools/calculators/continuous-compound-interest/detail'),
  DiscountedCashFlowCalculator: () =>
    import('@/tools/calculators/discounted-cash-flow/detail'),
  DiscountRateCalculator: () =>
    import('@/tools/calculators/discount-rate/detail'),
  EffectiveAnnualYieldCalculator: () =>
    import('@/tools/calculators/effective-annual-yield/detail'),
  EffectiveInterestRateCalculator: () =>
    import('@/tools/calculators/effective-interest-rate/detail'),
  ExpectedUtilityCalculator: () =>
    import('@/tools/calculators/expected-utility/detail'),
  FdCalculator: () => import('@/tools/calculators/fd/detail'),
  FutureValueCalculator: () =>
    import('@/tools/calculators/future-value/detail'),
  HoldingPeriodReturnCalculator: () =>
    import('@/tools/calculators/holding-period-return/detail'),
  ImpermanentLossCalculator: () =>
    import('@/tools/calculators/impermanent-loss/detail'),
  InformationRatioCalculator: () =>
    import('@/tools/calculators/information-ratio/detail'),
  InterestRateCalculator: () =>
    import('@/tools/calculators/interest-rate/detail'),
  IrrCalculator: () => import('@/tools/calculators/irr/detail'),
  InvestmentCalculator: () => import('@/tools/calculators/investment/detail'),
  InvestmentFeeCalculator: () =>
    import('@/tools/calculators/investment-fee/detail'),
  JensensAlphaCalculator: () =>
    import('@/tools/calculators/jensens-alpha/detail'),
  SavingsInterestRateCalculator: () =>
    import('@/tools/calculators/savings-interest-rate/detail'),
  SharpeRatioCalculator: () => import('@/tools/calculators/sharpe-ratio/detail'),
  ValueAtRiskCalculator: () => import('@/tools/calculators/value-at-risk/detail'),
};

export async function loadToolPageDetail(key: string): Promise<ToolPageDetail | null> {
  if (!isRegisteredComponentKey(key)) return null;
  const mod = await details[key]();
  return mod.toolPageDetail;
}
