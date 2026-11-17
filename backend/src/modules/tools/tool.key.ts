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
  'CentsToDollarsCalculator',
  'NmToJoulesCalculator',
  'CgsSystemOfUnitsConverter',
  'NickelsToDollarsCalculator',
  'ConversionCalculator',
  'PaperQuantityConverter',
  'CpsCalculator',
  'PenniesToDollarsCalculator',
  'DbmToWattsCalculator',
  'PowerConverter',
  'DensityConversion',
  'PpmCalculator',
  'DimensionalAnalysisCalculator',
  'PpmToMglConverter',
  'DimesToDollarsCalculator',
  'PxToEmConverter',
  'EnergyConversionCalculator',
  'QuantityConverter',
  'MpgToL100Converter',
  'QuartersToDollarsCalculator',
  'GramsToCaloriesCalculator',
  'RadiationConverter',
  'HardnessConversionCalculator',
  'RmsToWattsConverter',
  'JoulesToVoltsCalculator',
  'SpeedConversionCalculator',
  'KnotsToKphConverter',
  'TemperatureConversionCalculator',
  'KnotsToMphConverter',
  'UppercaseToLowercaseConverter',
  'LeetSpeakTranslator',
  'WeirdUnitsConverter',
  'LowercaseToUppercaseConverter',
  'AcresToHectaresConverter',
  'LbsToPsiConverter',
  'AcresToSquareFeetConverter',
  'LbsToStoneConverter',
  'AngstromToNmConverter',
  'LitersToPoundsCalculator',
  'AtmConversionCalculator',
  'LiterToCcConverter',
  'AtmToPascalsConverter',
  'LotSizeToAcresCalculator',
  'BarometricPressureConverter',
  'LotSizeToSqftCalculator',
  'BarToAtmConverter',
  'LToGalConverter',
  'BarToPsiConverter',
  'McgToMlConverter',
  'BarToPsigConverter',
  'MeasurementConverter',
  'CcToGramsConverter',
  'MeterConverter',
  'CcToLiterConverter',
  'MetersToFeetConverter',
  'CcToMlConverter',
  'MeterToMileConverter',
  'CcToOzConverter',
  'MetricConverter',
  'CelsiusConverter',
  'MetricToImperialConverter',
  'CelsiusToFahrenheitConverter',
  'CentigradeToCelsiusConverter',
  'MetricToSaeCalculator',
  'CmHeightConversionCalculator',
  'CentimeterCalculator',
  'CentToSquareMeterConverter',
  'CmToFtInConverter',
  'CmToInConverter',
  'CmToKmConverter',
  'CmToMConverter',
  'CmToMmConverter',
  'CubicFeetToCubicMetersConverter',
  'CubicFeetToGallonsConverter',
  'CubicFeetToPoundsCalculator',
  'CubicInchesToGallonsConverter',
  'CubicMeterToTonConverter',
  'CupsToGallonsConverter',
  'CupsToOzConverter',
  'CupsToPintsConverter',
  'CupsToQuartsConverter',
  'DayConverter',
  'DaysToMonthsCalculator',
  'DaysToWeeksCalculator',
  'DaysToYearsCalculator',
  'DegreesToMinutesConverter',
  'DegreesToRadiansConverter',
  'DegreesToSecondsConverter',
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
  'DividendDiscountModelCalculator',
  'DirectMaterialPriceVarianceCalculator',
  'EarCalculator',
  'EarlyLoanPayoffCalculator',
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
  'LoanBalanceCalculator',
  'QuizLoanBalanceCalculator',
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
  'PartiallyAmortizedLoanCalculator',
  'PaydayLoanCalculator',
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
  'BiweeklyMortgageCalculator',
  'BoatLoanCalculator',
  'LandLoanCalculator',
  'PagIbigHousingLoanCalculator',
  'RvLoanCalculator',
  'StudentLoanCalculator',
  'StudentLoanForgivenessCalculator',
  'StudentLoanPaymentCalculator',
  'SimpleMortgageCalculator',
  'LtvCalculator',
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
  'FhaLoanCalculator',
  'HomeEquityLoanCalculator',
  'HomeLoanEmiCalculator',
  'HomeLoanCalculator',
  'MortgageTaxesInsuranceCalculator',
  'HomeMortgageCalculator',
  'MortgageAccelerationCalculator',
  'MortgageAmortizationCalculator',
  'MortgagePrepaymentCalculator',
  'MortgagePointsCalculator',
  'CanadianMortgageCalculator',
  'MortgageCalculatorUk',
  'MortgageRateCalculator',
  'HoldingPeriodReturnCalculator',
  'ImpermanentLossCalculator',
  'InformationRatioCalculator',
  'InterestCalculator',
  'InterestOnlyMortgageCalculator',
  'InterestRateCalculator',
  'IrrCalculator',
  'InvestmentCalculator',
  'InvestmentFeeCalculator',
  'JensensAlphaCalculator',
  'SavingsInterestRateCalculator',
  'SharpeRatioCalculator',
  'VaMortgageCalculator',
  'ValueAtRiskCalculator',
  'EidlCalculator',
  'StudentLoanRepaymentCovidCalculator',
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
    !isApprovedComponentKey('CentsToDollarsCalculator') ||
    !isApprovedComponentKey('NmToJoulesCalculator') ||
    !isApprovedComponentKey('CgsSystemOfUnitsConverter') ||
    !isApprovedComponentKey('NickelsToDollarsCalculator') ||
    !isApprovedComponentKey('ConversionCalculator') ||
    !isApprovedComponentKey('PaperQuantityConverter') ||
    !isApprovedComponentKey('CpsCalculator') ||
    !isApprovedComponentKey('PenniesToDollarsCalculator') ||
    !isApprovedComponentKey('DbmToWattsCalculator') ||
    !isApprovedComponentKey('PowerConverter') ||
    !isApprovedComponentKey('DensityConversion') ||
    !isApprovedComponentKey('PpmCalculator') ||
    !isApprovedComponentKey('DimensionalAnalysisCalculator') ||
    !isApprovedComponentKey('PpmToMglConverter') ||
    !isApprovedComponentKey('DimesToDollarsCalculator') ||
    !isApprovedComponentKey('PxToEmConverter') ||
    !isApprovedComponentKey('EnergyConversionCalculator') ||
    !isApprovedComponentKey('QuantityConverter') ||
    !isApprovedComponentKey('MpgToL100Converter') ||
    !isApprovedComponentKey('QuartersToDollarsCalculator') ||
    !isApprovedComponentKey('GramsToCaloriesCalculator') ||
    !isApprovedComponentKey('RadiationConverter') ||
    !isApprovedComponentKey('HardnessConversionCalculator') ||
    !isApprovedComponentKey('RmsToWattsConverter') ||
    !isApprovedComponentKey('JoulesToVoltsCalculator') ||
    !isApprovedComponentKey('SpeedConversionCalculator') ||
    !isApprovedComponentKey('KnotsToKphConverter') ||
    !isApprovedComponentKey('TemperatureConversionCalculator') ||
    !isApprovedComponentKey('KnotsToMphConverter') ||
    !isApprovedComponentKey('UppercaseToLowercaseConverter') ||
    !isApprovedComponentKey('LeetSpeakTranslator') ||
    !isApprovedComponentKey('WeirdUnitsConverter') ||
    !isApprovedComponentKey('LowercaseToUppercaseConverter') ||
    !isApprovedComponentKey('AcresToHectaresConverter') ||
    !isApprovedComponentKey('LbsToPsiConverter') ||
    !isApprovedComponentKey('AcresToSquareFeetConverter') ||
    !isApprovedComponentKey('LbsToStoneConverter') ||
    !isApprovedComponentKey('AngstromToNmConverter') ||
    !isApprovedComponentKey('LitersToPoundsCalculator') ||
    !isApprovedComponentKey('AtmConversionCalculator') ||
    !isApprovedComponentKey('LiterToCcConverter') ||
    !isApprovedComponentKey('AtmToPascalsConverter') ||
    !isApprovedComponentKey('LotSizeToAcresCalculator') ||
    !isApprovedComponentKey('BarometricPressureConverter') ||
    !isApprovedComponentKey('LotSizeToSqftCalculator') ||
    !isApprovedComponentKey('BarToAtmConverter') ||
    !isApprovedComponentKey('LToGalConverter') ||
    !isApprovedComponentKey('BarToPsiConverter') ||
    !isApprovedComponentKey('McgToMlConverter') ||
    !isApprovedComponentKey('BarToPsigConverter') ||
    !isApprovedComponentKey('MeasurementConverter') ||
    !isApprovedComponentKey('CcToGramsConverter') ||
    !isApprovedComponentKey('MeterConverter') ||
    !isApprovedComponentKey('CcToLiterConverter') ||
    !isApprovedComponentKey('MetersToFeetConverter') ||
    !isApprovedComponentKey('CcToMlConverter') ||
    !isApprovedComponentKey('MeterToMileConverter') ||
    !isApprovedComponentKey('CcToOzConverter') ||
    !isApprovedComponentKey('MetricConverter') ||
    !isApprovedComponentKey('CelsiusConverter') ||
    !isApprovedComponentKey('MetricToImperialConverter') ||
    !isApprovedComponentKey('CelsiusToFahrenheitConverter') ||
    !isApprovedComponentKey('CentigradeToCelsiusConverter') ||
    !isApprovedComponentKey('MetricToSaeCalculator') ||
    !isApprovedComponentKey('CmHeightConversionCalculator') ||
    !isApprovedComponentKey('CentimeterCalculator') ||
    !isApprovedComponentKey('CentToSquareMeterConverter') ||
    !isApprovedComponentKey('CmToFtInConverter') ||
    !isApprovedComponentKey('CmToInConverter') ||
    !isApprovedComponentKey('CmToKmConverter') ||
    !isApprovedComponentKey('CmToMConverter') ||
    !isApprovedComponentKey('CmToMmConverter') ||
    !isApprovedComponentKey('CubicFeetToCubicMetersConverter') ||
    !isApprovedComponentKey('CubicFeetToGallonsConverter') ||
    !isApprovedComponentKey('CubicFeetToPoundsCalculator') ||
    !isApprovedComponentKey('CubicInchesToGallonsConverter') ||
    !isApprovedComponentKey('CubicMeterToTonConverter') ||
    !isApprovedComponentKey('CupsToGallonsConverter') ||
    !isApprovedComponentKey('CupsToOzConverter') ||
    !isApprovedComponentKey('CupsToPintsConverter') ||
    !isApprovedComponentKey('CupsToQuartsConverter') ||
    !isApprovedComponentKey('DayConverter') ||
    !isApprovedComponentKey('DaysToMonthsCalculator') ||
    !isApprovedComponentKey('DaysToWeeksCalculator') ||
    !isApprovedComponentKey('DaysToYearsCalculator') ||
    !isApprovedComponentKey('DegreesToMinutesConverter') ||
    !isApprovedComponentKey('DegreesToRadiansConverter') ||
    !isApprovedComponentKey('DegreesToSecondsConverter') ||
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
    !isApprovedComponentKey('DividendDiscountModelCalculator') ||
    !isApprovedComponentKey('DirectMaterialPriceVarianceCalculator') ||
    !isApprovedComponentKey('EarCalculator') ||
    !isApprovedComponentKey('EarlyLoanPayoffCalculator') ||
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
    !isApprovedComponentKey('LoanBalanceCalculator') ||
    !isApprovedComponentKey('QuizLoanBalanceCalculator') ||
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
    !isApprovedComponentKey('PartiallyAmortizedLoanCalculator') ||
    !isApprovedComponentKey('PaydayLoanCalculator') ||
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
    !isApprovedComponentKey('BiweeklyMortgageCalculator') ||
    !isApprovedComponentKey('BoatLoanCalculator') ||
    !isApprovedComponentKey('LandLoanCalculator') ||
    !isApprovedComponentKey('PagIbigHousingLoanCalculator') ||
    !isApprovedComponentKey('RvLoanCalculator') ||
    !isApprovedComponentKey('StudentLoanCalculator') ||
    !isApprovedComponentKey('StudentLoanForgivenessCalculator') ||
    !isApprovedComponentKey('StudentLoanPaymentCalculator') ||
    !isApprovedComponentKey('SimpleMortgageCalculator') ||
    !isApprovedComponentKey('LtvCalculator') ||
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
    !isApprovedComponentKey('FhaLoanCalculator') ||
    !isApprovedComponentKey('HomeEquityLoanCalculator') ||
    !isApprovedComponentKey('HomeLoanEmiCalculator') ||
    !isApprovedComponentKey('HomeLoanCalculator') ||
    !isApprovedComponentKey('MortgageTaxesInsuranceCalculator') ||
    !isApprovedComponentKey('HomeMortgageCalculator') ||
    !isApprovedComponentKey('MortgageAccelerationCalculator') ||
    !isApprovedComponentKey('MortgageAmortizationCalculator') ||
    !isApprovedComponentKey('MortgagePrepaymentCalculator') ||
    !isApprovedComponentKey('MortgagePointsCalculator') ||
    !isApprovedComponentKey('CanadianMortgageCalculator') ||
    !isApprovedComponentKey('MortgageCalculatorUk') ||
    !isApprovedComponentKey('MortgageRateCalculator') ||
    !isApprovedComponentKey('HoldingPeriodReturnCalculator') ||
    !isApprovedComponentKey('ImpermanentLossCalculator') ||
    !isApprovedComponentKey('InformationRatioCalculator') ||
    !isApprovedComponentKey('InterestCalculator') ||
    !isApprovedComponentKey('InterestOnlyMortgageCalculator') ||
    !isApprovedComponentKey('InterestRateCalculator') ||
    !isApprovedComponentKey('IrrCalculator') ||
    !isApprovedComponentKey('InvestmentCalculator') ||
    !isApprovedComponentKey('InvestmentFeeCalculator') ||
    !isApprovedComponentKey('JensensAlphaCalculator') ||
    !isApprovedComponentKey('SavingsInterestRateCalculator') ||
    !isApprovedComponentKey('SharpeRatioCalculator') ||
    !isApprovedComponentKey('VaMortgageCalculator') ||
    !isApprovedComponentKey('ValueAtRiskCalculator') ||
    !isApprovedComponentKey('EidlCalculator') ||
    !isApprovedComponentKey('StudentLoanRepaymentCovidCalculator') ||
    isApprovedComponentKey('EvilEval')
  ) {
    throw new Error('component key allowlist');
  }
  console.log('tool.key ok');
}
