const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const APPROVED_COMPONENT_KEYS = [
  'AutoLoanCalculator',
  'LoanCalculator',
  'RrefCalculator',
  'ArmMortgageCalculator',
  'HundredDayCalculator',
  'ZeroToSixtyCalculator',
  'TwelveVoltWireCalculator',
  'TwelveHourShiftPayCalculator',
  'ThreeXRentCalculator',
  'ThreeDPrinterBuyVsOutsourceCalculator',
  'ARDaysCalculator',
  'FourZeroThreeBCalculator',
  'ADRCalculator',
  'AFFOCalculator',
  'FiveTwentyNineCalculator',
  'SeventyTwentyTenCalculator',
  'FourZeroOneKCalculator',
  'AmortizationCalculator',
  'AcreageCalculator',
  'FeetToInchesCalculator',
  'AcresToSquareMilesCalculator',
  'HeightInInchesCalculator',
  'AcreToAreConversionCalculator',
  'InchesToFractionCalculator',
  'AreaConverter',
  'LengthConverter',
  'AresToCentConverter',
  'LightYearConversion',
  'AresToHectaresConverter',
  'MeshToMicronConverter',
  'AstronomicalUnitCalculator',
  'PixelsToInchesConverter',
  'DecimeterToMeterConverter',
  'SquareKilometersToAcresConverter',
  'FeetAndInchesCalculator',
  'YardsToAcresCalculator',
  'CcfToGallonsConversion',
  'LitersToCentilitersConverter',
  'CubicFeetCalculator',
  'McgToMgConverter',
  'CubicMeterCalculator',
  'MgToMlCalculator',
  'CubicYardsToTonsCalculator',
  'MlToCupsConverter',
  'DecagramToGramConverter',
  'PintToPoundCalculator',
  'DropsToMlConverter',
  'PoundsAndOuncesCalculator',
  'OzToCupsConverter',
  'GallonCalculator',
  'QuartsToPoundsConverter',
  'GallonsToPoundsConverter',
  'VolumeConversion',
  'GramsToOuncesCalculator',
  'WeightConverter',
  'KgToGallonsConverter',
  'ForceConverter',
  'NmToInLbsConverter',
  'InchLbsToNmConverter',
  'PressureConversion',
  'InchPoundsToFootPoundsConverter',
  'PsiToGpmCalculator',
  'LbsToNewtonsConverter',
  'TorqueToHpCalculator',
  'NewtonMeterCalculator',
  'TorrToAtmConverter',
  'NmToFtLbsConverter',
  'CoordinatesConverter',
  'LatLongToUtmConverter',
  'DegreesMinutesSecondsCalculator',
  'ScaleCalculator',
  'BillionToTrillionConverter',
  'MillionToLakhConverter',
  'CentsToEurosCalculator',
  'MillionToThousandConverter',
  'CroreToLakhConverter',
  'NumberToBillionConverter',
  'CroreToMillionConverter',
  'NumberToMillionConverter',
  'MillionToBillionConverter',
  'BinaryConverter',
  'GematriaCalculator',
  'BinaryToHexConverter',
  'GreekGematriaCalculator',
  'BinaryToOctalConverter',
  'HexadecimalConverter',
  'DecimalToHexConverter',
  'RomanNumeralsConverter',
  'DecimalToOctalConverter',
  'ByteConversionCalculator',
  'MbpsToGbpsConverter',
  'CapacitanceConverter',
  'MbToGbConverter',
  'ColorConverter',
  'RgbToHexConverter',
  'HexToRgbConverter',
  'UnicodeTextConverter',
  'KbToMbConverter',
  'UnixTimeConverter',
  'MbpsCalculator',
  'MilitaryTimeConverter',
  'TimeZonesConverter',
  'MinutesToHoursConverter',
  'YearsToDecadesCalculator',
  'TimeUnitConverter',
  'ZuluTimeConverter',
  'AngleConversionCalculator',
  'MsToKmhConverter',
  'CcfToThermsCalculator',
  'NaturalGasConverter',
  'AdditionalFundsNeededCalculator',
  'AbsencePercentageCalculator',
  'AccumulatedDepreciationCalculator',
  'AttritionRateCalculator',
  'BusinessLoanCalculator',
  'ProfitabilityIndexCalculator',
  'RevenuePerEmployeeCalculator',
  'RoasCalculator',
  'RoceCalculator',
  'RoiCalculator',
  'SaasLifetimeValueCalculator',
  'SafetyStockCalculator',
  'SalesCommissionCalculator',
  'SellThroughRateCalculator',
  'SimpleInterestCalculator',
  'SinkingFundCalculator',
  'SmokersCtcCalculator',
  'TenureCalculator',
  'TimeValueOfMoneyCalculator',
  'TtmCalculator',
  'TreynorRatioCalculator',
  'TurnoverRateCalculator',
  'WebsiteAdRevenueCalculator',
  'WeekOverWeekCalculator',
  'SoftwareContractValueCalculator',
  'SortinoRatioCalculator',
  'YearOverYearGrowthCalculator',
  'YoutubeMoneyCalculator',
  'AnnualizedRateOfReturnCalculator',
  'AppreciationCalculator',
  'AnnualizedReturnCalculator',
  'ApyCalculator',
  'BasisPointCalculator',
  'BetaStockCalculator',
  'AverageCollectionPeriodCalculator',
  'AverageFixedCostCalculator',
  'BounceRateCalculator',
  'BradfordFactorCalculator',
  'BreakEvenCalculator',
  'BuildVsBuyCalculator',
  'BurnRateCalculator',
  'BurndownChartCalculator',
  'BusinessBudgetCalculator',
  'BusinessValuationCalculator',
  'CagrCalculator',
  'CapmCalculator',
  'CapitalGainsYieldCalculator',
  'CarriedInterestCalculator',
  'ChurnRateCalculator',
  'ConsultingFeesCalculator',
  'ContributionMarginCalculator',
  'ConversionRateCalculator',
  'CostFunctionCalculator',
  'CostOfDoingBusinessCalculator',
  'CostOfGoodsSoldCalculator',
  'CostOfEquityCalculator',
  'CpaCalculator',
  'CpcAndCpmCalculator',
  'CpmCalculator',
  'CtrCalculator',
  'CustomerAcquisitionCostCalculator',
  'CustomerRetentionRateCalculator',
  'DaysOffCalculator',
  'DirectMaterialPriceVarianceCalculator',
  'EarCalculator',
  'EquivalentRateCalculator',
  'EffectiveCorporateTaxRateCalculator',
  'EmvCalculator',
  'EvmCalculator',
  'ExitRateCalculator',
  'ExpectedReturnCalculator',
  'ExpenseRatioCalculator',
  'FifoInventoryCalculator',
  'FullTimeEquivalentCalculator',
  'GmroiCalculator',
  'GoogleAdsenseCalculator',
  'HedgeRatioCalculator',
  'HhiCalculator',
  'HighLowMethodCalculator',
  'LaborCostCalculator',
  'LemonadeStandCalculator',
  'LernerIndexCalculator',
  'LiquidNetWorthCalculator',
  'ManHoursCalculator',
  'MarginInterestCalculator',
  'MirrCalculator',
  'MoneyFactorCalculator',
  'MoneyMarketAccountCalculator',
  'MovingAverageCalculator',
  'MutualFundCalculator',
  'MvaCalculator',
  'NopatCalculator',
  'NpvCalculator',
  'OnlineMarketingConversionCalculator',
  'OperatingAssetTurnoverCalculator',
  'OptimalHedgeRatioCalculator',
  'OpportunityCostCalculator',
  'ParkingRatioCalculator',
  'PaybackPeriodCalculator',
  'PercentageReturnCalculator',
  'PerpetuityCalculator',
  'PreAndPostMoneyValuationCalculator',
  'PresentValueCalculator',
  'PriceQuantityCalculator',
  'PvgoCalculator',
  'PvifaCalculator',
  'RateOfReturnCalculator',
  'RealRateOfReturnCalculator',
  'BitcoinEtfCalculator',
  'CdCalculator',
  'CompoundInterestCalculator',
  'DiscountedCashFlowCalculator',
  'DiscountRateCalculator',
  'CompoundGrowthCalculator',
  'CompoundInterestRateCalculator',
  'ContinuousCompoundInterestCalculator',
  'EffectiveAnnualYieldCalculator',
  'EffectiveInterestRateCalculator',
  'ExpectedUtilityCalculator',
  'FutureValueCalculator',
  'FdCalculator',
  'HoldingPeriodReturnCalculator',
  'ImpermanentLossCalculator',
  'InformationRatioCalculator',
  'InterestRateCalculator',
  'IrrCalculator',
  'InvestmentCalculator',
  'InvestmentFeeCalculator',
  'JensensAlphaCalculator',
  'SavingsInterestRateCalculator',
  'SharpeRatioCalculator',
  'ValueAtRiskCalculator',
] as const;

export type ApprovedComponentKey = (typeof APPROVED_COMPONENT_KEYS)[number];

export function toolNameKey(name: string): string {
  return name.trim().toLowerCase();
}

export function isToolSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function isApprovedComponentKey(key: string): key is ApprovedComponentKey {
  return (APPROVED_COMPONENT_KEYS as readonly string[]).includes(key);
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('tool.key.ts');
if (isDirect) {
  if (toolNameKey('  Loan Calculator ') !== 'loan calculator') throw new Error('name key');
  if (!isToolSlug('loan-calculator') || isToolSlug('Loan') || isToolSlug('-loan')) {
    throw new Error('slug rule');
  }
  if (
    !isApprovedComponentKey('AutoLoanCalculator') ||
    !isApprovedComponentKey('LoanCalculator') ||
    !isApprovedComponentKey('RrefCalculator') ||
    !isApprovedComponentKey('ArmMortgageCalculator') ||
    !isApprovedComponentKey('HundredDayCalculator') ||
    !isApprovedComponentKey('ZeroToSixtyCalculator') ||
    !isApprovedComponentKey('TwelveVoltWireCalculator') ||
    !isApprovedComponentKey('TwelveHourShiftPayCalculator') ||
    !isApprovedComponentKey('ThreeXRentCalculator') ||
    !isApprovedComponentKey('ThreeDPrinterBuyVsOutsourceCalculator') ||
    !isApprovedComponentKey('ARDaysCalculator') ||
    !isApprovedComponentKey('FourZeroThreeBCalculator') ||
    !isApprovedComponentKey('ADRCalculator') ||
    !isApprovedComponentKey('AFFOCalculator') ||
    !isApprovedComponentKey('FiveTwentyNineCalculator') ||
    !isApprovedComponentKey('SeventyTwentyTenCalculator') ||
    !isApprovedComponentKey('FourZeroOneKCalculator') ||
    !isApprovedComponentKey('AmortizationCalculator') ||
    !isApprovedComponentKey('AcreageCalculator') ||
    !isApprovedComponentKey('FeetToInchesCalculator') ||
    !isApprovedComponentKey('AcresToSquareMilesCalculator') ||
    !isApprovedComponentKey('HeightInInchesCalculator') ||
    !isApprovedComponentKey('AcreToAreConversionCalculator') ||
    !isApprovedComponentKey('InchesToFractionCalculator') ||
    !isApprovedComponentKey('AreaConverter') ||
    !isApprovedComponentKey('LengthConverter') ||
    !isApprovedComponentKey('AresToCentConverter') ||
    !isApprovedComponentKey('LightYearConversion') ||
    !isApprovedComponentKey('AresToHectaresConverter') ||
    !isApprovedComponentKey('MeshToMicronConverter') ||
    !isApprovedComponentKey('AstronomicalUnitCalculator') ||
    !isApprovedComponentKey('PixelsToInchesConverter') ||
    !isApprovedComponentKey('DecimeterToMeterConverter') ||
    !isApprovedComponentKey('SquareKilometersToAcresConverter') ||
    !isApprovedComponentKey('FeetAndInchesCalculator') ||
    !isApprovedComponentKey('YardsToAcresCalculator') ||
    !isApprovedComponentKey('CcfToGallonsConversion') ||
    !isApprovedComponentKey('LitersToCentilitersConverter') ||
    !isApprovedComponentKey('CubicFeetCalculator') ||
    !isApprovedComponentKey('McgToMgConverter') ||
    !isApprovedComponentKey('CubicMeterCalculator') ||
    !isApprovedComponentKey('MgToMlCalculator') ||
    !isApprovedComponentKey('CubicYardsToTonsCalculator') ||
    !isApprovedComponentKey('MlToCupsConverter') ||
    !isApprovedComponentKey('DecagramToGramConverter') ||
    !isApprovedComponentKey('PintToPoundCalculator') ||
    !isApprovedComponentKey('DropsToMlConverter') ||
    !isApprovedComponentKey('PoundsAndOuncesCalculator') ||
    !isApprovedComponentKey('OzToCupsConverter') ||
    !isApprovedComponentKey('GallonCalculator') ||
    !isApprovedComponentKey('QuartsToPoundsConverter') ||
    !isApprovedComponentKey('GallonsToPoundsConverter') ||
    !isApprovedComponentKey('VolumeConversion') ||
    !isApprovedComponentKey('GramsToOuncesCalculator') ||
    !isApprovedComponentKey('WeightConverter') ||
    !isApprovedComponentKey('KgToGallonsConverter') ||
    !isApprovedComponentKey('ForceConverter') ||
    !isApprovedComponentKey('NmToInLbsConverter') ||
    !isApprovedComponentKey('InchLbsToNmConverter') ||
    !isApprovedComponentKey('PressureConversion') ||
    !isApprovedComponentKey('InchPoundsToFootPoundsConverter') ||
    !isApprovedComponentKey('PsiToGpmCalculator') ||
    !isApprovedComponentKey('LbsToNewtonsConverter') ||
    !isApprovedComponentKey('TorqueToHpCalculator') ||
    !isApprovedComponentKey('NewtonMeterCalculator') ||
    !isApprovedComponentKey('TorrToAtmConverter') ||
    !isApprovedComponentKey('NmToFtLbsConverter') ||
    !isApprovedComponentKey('CoordinatesConverter') ||
    !isApprovedComponentKey('LatLongToUtmConverter') ||
    !isApprovedComponentKey('DegreesMinutesSecondsCalculator') ||
    !isApprovedComponentKey('ScaleCalculator') ||
    !isApprovedComponentKey('BillionToTrillionConverter') ||
    !isApprovedComponentKey('MillionToLakhConverter') ||
    !isApprovedComponentKey('CentsToEurosCalculator') ||
    !isApprovedComponentKey('MillionToThousandConverter') ||
    !isApprovedComponentKey('CroreToLakhConverter') ||
    !isApprovedComponentKey('NumberToBillionConverter') ||
    !isApprovedComponentKey('CroreToMillionConverter') ||
    !isApprovedComponentKey('NumberToMillionConverter') ||
    !isApprovedComponentKey('MillionToBillionConverter') ||
    !isApprovedComponentKey('BinaryConverter') ||
    !isApprovedComponentKey('GematriaCalculator') ||
    !isApprovedComponentKey('BinaryToHexConverter') ||
    !isApprovedComponentKey('GreekGematriaCalculator') ||
    !isApprovedComponentKey('BinaryToOctalConverter') ||
    !isApprovedComponentKey('HexadecimalConverter') ||
    !isApprovedComponentKey('DecimalToHexConverter') ||
    !isApprovedComponentKey('RomanNumeralsConverter') ||
    !isApprovedComponentKey('DecimalToOctalConverter') ||
    !isApprovedComponentKey('ByteConversionCalculator') ||
    !isApprovedComponentKey('MbpsToGbpsConverter') ||
    !isApprovedComponentKey('CapacitanceConverter') ||
    !isApprovedComponentKey('MbToGbConverter') ||
    !isApprovedComponentKey('ColorConverter') ||
    !isApprovedComponentKey('RgbToHexConverter') ||
    !isApprovedComponentKey('HexToRgbConverter') ||
    !isApprovedComponentKey('UnicodeTextConverter') ||
    !isApprovedComponentKey('KbToMbConverter') ||
    !isApprovedComponentKey('UnixTimeConverter') ||
    !isApprovedComponentKey('MbpsCalculator') ||
    !isApprovedComponentKey('MilitaryTimeConverter') ||
    !isApprovedComponentKey('TimeZonesConverter') ||
    !isApprovedComponentKey('MinutesToHoursConverter') ||
    !isApprovedComponentKey('YearsToDecadesCalculator') ||
    !isApprovedComponentKey('TimeUnitConverter') ||
    !isApprovedComponentKey('ZuluTimeConverter') ||
    !isApprovedComponentKey('AngleConversionCalculator') ||
    !isApprovedComponentKey('MsToKmhConverter') ||
    !isApprovedComponentKey('CcfToThermsCalculator') ||
    !isApprovedComponentKey('NaturalGasConverter') ||
    !isApprovedComponentKey('AdditionalFundsNeededCalculator') ||
    !isApprovedComponentKey('AbsencePercentageCalculator') ||
    !isApprovedComponentKey('AccumulatedDepreciationCalculator') ||
    !isApprovedComponentKey('AttritionRateCalculator') ||
    !isApprovedComponentKey('BusinessLoanCalculator') ||
    !isApprovedComponentKey('ProfitabilityIndexCalculator') ||
    !isApprovedComponentKey('RevenuePerEmployeeCalculator') ||
    !isApprovedComponentKey('RoasCalculator') ||
    !isApprovedComponentKey('RoceCalculator') ||
    !isApprovedComponentKey('RoiCalculator') ||
    !isApprovedComponentKey('SaasLifetimeValueCalculator') ||
    !isApprovedComponentKey('SafetyStockCalculator') ||
    !isApprovedComponentKey('SalesCommissionCalculator') ||
    !isApprovedComponentKey('SellThroughRateCalculator') ||
    !isApprovedComponentKey('SimpleInterestCalculator') ||
    !isApprovedComponentKey('SinkingFundCalculator') ||
    !isApprovedComponentKey('SmokersCtcCalculator') ||
    !isApprovedComponentKey('TenureCalculator') ||
    !isApprovedComponentKey('TimeValueOfMoneyCalculator') ||
    !isApprovedComponentKey('TtmCalculator') ||
    !isApprovedComponentKey('TreynorRatioCalculator') ||
    !isApprovedComponentKey('TurnoverRateCalculator') ||
    !isApprovedComponentKey('WebsiteAdRevenueCalculator') ||
    !isApprovedComponentKey('WeekOverWeekCalculator') ||
    !isApprovedComponentKey('SoftwareContractValueCalculator') ||
    !isApprovedComponentKey('SortinoRatioCalculator') ||
    !isApprovedComponentKey('YearOverYearGrowthCalculator') ||
    !isApprovedComponentKey('YoutubeMoneyCalculator') ||
    !isApprovedComponentKey('AnnualizedRateOfReturnCalculator') ||
    !isApprovedComponentKey('AppreciationCalculator') ||
    !isApprovedComponentKey('AnnualizedReturnCalculator') ||
    !isApprovedComponentKey('ApyCalculator') ||
    !isApprovedComponentKey('BasisPointCalculator') ||
    !isApprovedComponentKey('BetaStockCalculator') ||
        !isApprovedComponentKey('AverageCollectionPeriodCalculator') ||
    !isApprovedComponentKey('AverageFixedCostCalculator') ||
    !isApprovedComponentKey('BounceRateCalculator') ||
    !isApprovedComponentKey('BradfordFactorCalculator') ||
    !isApprovedComponentKey('BreakEvenCalculator') ||
    !isApprovedComponentKey('BuildVsBuyCalculator') ||
    !isApprovedComponentKey('BurnRateCalculator') ||
    !isApprovedComponentKey('BurndownChartCalculator') ||
    !isApprovedComponentKey('BusinessBudgetCalculator') ||
    !isApprovedComponentKey('BusinessValuationCalculator') ||
    !isApprovedComponentKey('CagrCalculator') ||
    !isApprovedComponentKey('CapmCalculator') ||
    !isApprovedComponentKey('CapitalGainsYieldCalculator') ||
    !isApprovedComponentKey('CarriedInterestCalculator') ||
    !isApprovedComponentKey('ChurnRateCalculator') ||
    !isApprovedComponentKey('ConsultingFeesCalculator') ||
    !isApprovedComponentKey('ContributionMarginCalculator') ||
    !isApprovedComponentKey('ConversionRateCalculator') ||
    !isApprovedComponentKey('CostFunctionCalculator') ||
    !isApprovedComponentKey('CostOfDoingBusinessCalculator') ||
    !isApprovedComponentKey('CostOfGoodsSoldCalculator') ||
    !isApprovedComponentKey('CostOfEquityCalculator') ||
    !isApprovedComponentKey('CpaCalculator') ||
    !isApprovedComponentKey('CpcAndCpmCalculator') ||
    !isApprovedComponentKey('CpmCalculator') ||
    !isApprovedComponentKey('CtrCalculator') ||
    !isApprovedComponentKey('CustomerAcquisitionCostCalculator') ||
    !isApprovedComponentKey('CustomerRetentionRateCalculator') ||
    !isApprovedComponentKey('DaysOffCalculator') ||
    !isApprovedComponentKey('DirectMaterialPriceVarianceCalculator') ||
    !isApprovedComponentKey('EarCalculator') ||
    !isApprovedComponentKey('EquivalentRateCalculator') ||
    !isApprovedComponentKey('EffectiveCorporateTaxRateCalculator') ||
    !isApprovedComponentKey('EmvCalculator') ||
    !isApprovedComponentKey('EvmCalculator') ||
    !isApprovedComponentKey('ExitRateCalculator') ||
    !isApprovedComponentKey('ExpectedReturnCalculator') ||
    !isApprovedComponentKey('ExpenseRatioCalculator') ||
    !isApprovedComponentKey('FifoInventoryCalculator') ||
    !isApprovedComponentKey('FullTimeEquivalentCalculator') ||
    !isApprovedComponentKey('GmroiCalculator') ||
    !isApprovedComponentKey('GoogleAdsenseCalculator') ||
    !isApprovedComponentKey('HedgeRatioCalculator') ||
    !isApprovedComponentKey('HhiCalculator') ||
    !isApprovedComponentKey('HighLowMethodCalculator') ||
    !isApprovedComponentKey('LaborCostCalculator') ||
    !isApprovedComponentKey('LemonadeStandCalculator') ||
    !isApprovedComponentKey('LernerIndexCalculator') ||
    !isApprovedComponentKey('LiquidNetWorthCalculator') ||
    !isApprovedComponentKey('ManHoursCalculator') ||
    !isApprovedComponentKey('MarginInterestCalculator') ||
    !isApprovedComponentKey('MirrCalculator') ||
    !isApprovedComponentKey('MoneyFactorCalculator') ||
    !isApprovedComponentKey('MoneyMarketAccountCalculator') ||
    !isApprovedComponentKey('MovingAverageCalculator') ||
    !isApprovedComponentKey('MutualFundCalculator') ||
    !isApprovedComponentKey('MvaCalculator') ||
    !isApprovedComponentKey('NopatCalculator') ||
    !isApprovedComponentKey('NpvCalculator') ||
    !isApprovedComponentKey('OnlineMarketingConversionCalculator') ||
    !isApprovedComponentKey('OperatingAssetTurnoverCalculator') ||
    !isApprovedComponentKey('OptimalHedgeRatioCalculator') ||
    !isApprovedComponentKey('OpportunityCostCalculator') ||
    !isApprovedComponentKey('ParkingRatioCalculator') ||
    !isApprovedComponentKey('PaybackPeriodCalculator') ||
    !isApprovedComponentKey('PercentageReturnCalculator') ||
    !isApprovedComponentKey('PerpetuityCalculator') ||
    !isApprovedComponentKey('PreAndPostMoneyValuationCalculator') ||
    !isApprovedComponentKey('PresentValueCalculator') ||
    !isApprovedComponentKey('PriceQuantityCalculator') ||
    !isApprovedComponentKey('PvgoCalculator') ||
    !isApprovedComponentKey('PvifaCalculator') ||
    !isApprovedComponentKey('RateOfReturnCalculator') ||
    !isApprovedComponentKey('RealRateOfReturnCalculator') ||
    !isApprovedComponentKey('BitcoinEtfCalculator') ||
    !isApprovedComponentKey('CdCalculator') ||
    !isApprovedComponentKey('CompoundInterestCalculator') ||
    !isApprovedComponentKey('DiscountedCashFlowCalculator') ||
    !isApprovedComponentKey('DiscountRateCalculator') ||
    !isApprovedComponentKey('CompoundGrowthCalculator') ||
    !isApprovedComponentKey('CompoundInterestRateCalculator') ||
    !isApprovedComponentKey('ContinuousCompoundInterestCalculator') ||
    !isApprovedComponentKey('EffectiveAnnualYieldCalculator') ||
    !isApprovedComponentKey('EffectiveInterestRateCalculator') ||
    !isApprovedComponentKey('ExpectedUtilityCalculator') ||
    !isApprovedComponentKey('FutureValueCalculator') ||
    !isApprovedComponentKey('FdCalculator') ||
    !isApprovedComponentKey('HoldingPeriodReturnCalculator') ||
    !isApprovedComponentKey('ImpermanentLossCalculator') ||
    !isApprovedComponentKey('InformationRatioCalculator') ||
    !isApprovedComponentKey('InterestRateCalculator') ||
    !isApprovedComponentKey('IrrCalculator') ||
    !isApprovedComponentKey('InvestmentCalculator') ||
    !isApprovedComponentKey('InvestmentFeeCalculator') ||
    !isApprovedComponentKey('JensensAlphaCalculator') ||
    !isApprovedComponentKey('SavingsInterestRateCalculator') ||
    !isApprovedComponentKey('SharpeRatioCalculator') ||
    !isApprovedComponentKey('ValueAtRiskCalculator') ||
    isApprovedComponentKey('EvilEval')
  ) {
    throw new Error('component key allowlist');
  }
  console.log('tool.key ok');
}
