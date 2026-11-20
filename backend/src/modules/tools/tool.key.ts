const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const APPROVED_COMPONENT_KEYS = [
  'AfterTaxCostOfDebtCalculator',
  'AnnuityCalculator',
  'AnnuityPayoutCalculator',
  'AutoLeaseCalculator',
  'AutoLoanCalculator',
  'CaliforniaOvertimeCalculator',
  'DebtAvalancheCalculator',
  'DebtCalculator',
  'DebtServiceCoverageRatioCalculator',
  'DebtSnowballCalculator',
  'DebtToAssetRatioCalculator',
  'DebtToCapitalRatioCalculator',
  'DebtToEquityCalculator',
  'DeferredAnnuityCalculator',
  'DepreciationCalculator',
  'EbitdaMarginCalculator',
  'FloridaOvertimeCalculator',
  'FutureValueOfAnnuityCalculator',
  'GeorgiaOvertimeCalculator',
  'GrossMarginCalculator',
  'GrossRentMultiplierCalculator',
  'GrowingAnnuityCalculator',
  'IllinoisOvertimeCalculator',
  'ImmediateAnnuityCalculator',
  'InterestRateParityCalculator',
  'LoanCalculator',
  'LoanInterestCalculator',
  'LotteryAnnuityCalculator',
  'MarginAndMarkupCalculator',
  'MarginAndSalesTaxCalculator',
  'MarginAndVatCalculator',
  'MarginCalculatorClassic',
  'MarginCallCalculator',
  'MarginOfSafetyCalculator',
  'MarginWithDiscountCalculator',
  'NetDebtCalculator',
  'NetEffectiveRentCalculator',
  'IncomeTaxCalculator',
  'IncomeTaxCalculatorPakistan',
  'IncomeTaxCalculatorPhilippines',
  'AdjustedGrossIncomeCalculator',
  'AlabamaTaxCalculator',
  'CaliforniaSalesTaxCalculator',
  'FloridaSalesTaxCalculator',
  'NewJerseySalesTaxCalculator',
  'OhioSalesTaxCalculator',
  'SalesTaxCalculator',
  'NewYorkOvertimeCalculator',
  'OperatingMarginCalculator',
  'NetProfitMarginCalculator',
  'ReturnOnSalesCalculator',
  'OvertimeCalculator',
  'OvertimePaycheckCalculator',
  'PresentValueOfAnnuityCalculator',
  'RentIncreaseCalculator',
  'RentOrBuyCalculator',
  'RrefCalculator',
  'ArmMortgageCalculator',
  'HundredDayCalculator',
  'SalaryWithOvertimeCalculator',
  'TexasOvertimeCalculator',
  'TimesInterestEarnedCalculator',
  'VariableAnnuityCalculator',
  'ZeroToSixtyCalculator',
  'TwelveVoltWireCalculator',
  'TwelveHourShiftPayCalculator',
  'ThreeXRentCalculator',
  'ThreeDPrinterBuyVsOutsourceCalculator',
  'ARDaysCalculator',
  'ArvCalculator',
  'FourZeroThreeBCalculator',
  'ADRCalculator',
  'AFFOCalculator',
  'FiveTwentyNineCalculator',
  'SeventyTwentyTenCalculator',
  'FourZeroOneKCalculator',
  'AmortizationCalculator',
  'AmtCalculator',
  'AccrualRatioCalculator',
  'ActualCashValueCalculator',
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
  'DeferredPaymentLoanCalculator',
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
  'MlToCcConverter',
  'MlToKgConverter',
  'MlToLbsConversion',
  'MlToOzConverter',
  'MlToTbspConverter',
  'MlToTspConverter',
  'MlToUlConversion',
  'DecagramToGramConverter',
  'PintToPoundCalculator',
  'PintsToCupsConverter',
  'PintsToGallonsConverter',
  'QuartsToGallonsConverter',
  'DropsToMlConverter',
  'PoundsAndOuncesCalculator',
  'PoundsToGramsConverter',
  'PoundsToLbsConverter',
  'PoundsToOuncesConverter',
  'PoundsToStoneConverter',
  'OunceToKgConverter',
  'OuncesToGramsConverter',
  'OuncesToMillilitersConverter',
  'OuncesToPoundsConverter',
  'OzToCcConverter',
  'OzToCupsConverter',
  'GallonCalculator',
  'PricePerLiterToGallonConverter',
  'QuartsToPoundsConverter',
  'GallonsToPoundsConverter',
  'VolumeConversion',
  'GramsToOuncesCalculator',
  'WeightConverter',
  'KgToGallonsConverter',
  'ForceConverter',
  'NmToInLbsConverter',
  'InchLbsToNmConverter',
  'PaToPsiConversion',
  'PascalConversion',
  'PsiConverter',
  'PsiToAtmConversion',
  'PsiToInchesOfWaterConversion',
  'PressureUnitConversion',
  'PressureConversion',
  'InchPoundsToFootPoundsConverter',
  'PsiToGpmCalculator',
  'LbsToNewtonsConverter',
  'TorqueToHpCalculator',
  'NewtonMeterCalculator',
  'TorrToAtmConverter',
  'MmhgToAtmConversion',
  'MmToAtmConverter',
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
  'NaturalRateOfUnemploymentCalculator',
  'UnemploymentCalculator',
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
  'RadiansToDegreesConverter',
  'DegreesToSecondsConverter',
  'DistanceConverter',
  'DmConverter',
  'FahrenheitConverter',
  'FahrenheitToCelsiusConverter',
  'FeetConverter',
  'FeetToMilesConverter',
  'FeetToYardsConverter',
  'FluidOuncesToPoundsConverter',
  'FootToCentimeterConverter',
  'FtToMConverter',
  'GajToSquareYardConverter',
  'GallonsToCubicFeetConverter',
  'GallonsToCupsConverter',
  'GallonsToGramsConverter',
  'GallonsToPintsConverter',
  'GallonsToQuartsConverter',
  'GallonsToTonsConverter',
  'GalToKgConverter',
  'GramsInMlConverter',
  'GramsToFlOzConverter',
  'GramToLiterConversion',
  'GrToMlConverter',
  'GToTspConverter',
  'GToLbsConverter',
  'HectaresToAcresConverter',
  'HeightConverter',
  'HourConverter',
  'HoursToDaysCalculator',
  'HoursToMinutesConverter',
  'HoursToSecondsConverter',
  'HoursToWeekConversion',
  'HoursToYearsConverter',
  'ImperialCalculator',
  'ImperialToMetricConversion',
  'InchConverter',
  'InchToMeterCalculator',
  'InchesToYardConversion',
  'InToCmConverter',
  'KathaToSquareFeetConverter',
  'KelvinConverter',
  'KelvinToCelsiusConverter',
  'KelvinToFahrenheitConverter',
  'KgCmToPsiConverter',
  'KgToLbsConverter',
  'KgToLiterConverter',
  'KgToMlConverter',
  'KgToOunceConverter',
  'KgToStonesConverter',
  'KilometerCalculator',
  'KilometerToMeterConverter',
  'KilometersToMilesCalculator',
  'KmToFeetConversion',
  'KpaConverter',
  'KpaToAtmConversion',
  'KpaToMmhgConversion',
  'KpaToPsiConversion',
  'KsiToMpaConverter',
  'KsiToPsiConversion',
  'LandAreaCalculator',
  'LbsToGConverter',
  'LbsToKgConverter',
  'LbsToPoundsConverter',
  'MetricToStandardConverter',
  'MgToCcConverter',
  'MgToLbsConverter',
  'MgToTablespoonConverter',
  'MgToTeaspoonConverter',
  'MicronToMilConversionCalculator',
  'MilConversion',
  'MileConversionCalculator',
  'MillimeterCalculator',
  'MmCalculator',
  'MmToFootConverter',
  'MmToInchesConversion',
  'MmToKmConversion',
  'MmToMConversion',
  'MillisecondsConverter',
  'MilToInchConversion',
  'MilToMmConversion',
  'MinuteConverter',
  'MinutesToDaysCalculator',
  'MinutesToDecimalCalculator',
  'MinutesToSecondsConverter',
  'MinutesToYearsConversion',
  'MonthsToYearsCalculator',
  'MpaConversion',
  'MpaToPsiConversion',
  'MpaToPsigConversion',
  'MsToSecondsConverter',
  'SecondsConverter',
  'SecondsToDaysConverter',
  'SecondsToHoursConverter',
  'SecondsToMinutesConverter',
  'SecondsToYearsConversion',
  'SquareCmToSquareMmConverter',
  'SquareFeetConverter',
  'SquareFeetToAcresCalculator',
  'SquareInchToSquareFootConverter',
  'SquareMeterConverter',
  'SquareMetersToSquareFeetConverter',
  'SquareMilesToSquareKmConverter',
  'SquareYardConverter',
  'StoneToKgConverter',
  'StoneToLbsConverter',
  'TbspToGramsConverter',
  'TbspToMlConverter',
  'TspToGramsConverter',
  'TspToMlConverter',
  'WeeksToMonthsCalculator',
  'WeeksToYearsConverter',
  'YardConversionCalculator',
  'YardToMeterConverter',
  'YardToMileConverter',
  'YardsToMetersConversion',
  'NmConverter',
  'NmToMConverter',
  'AdditionalFundsNeededCalculator',
  'AbsencePercentageCalculator',
  'AccumulatedDepreciationCalculator',
  'CarDepreciationCalculator',
  'AttritionRateCalculator',
  'BusinessLoanCalculator',
  'AccountingProfitCalculator',
  'ProfitCalculator',
  'EconomicProfitCalculator',
  'EvToSalesCalculator',
  'PriceToSalesRatioCalculator',
  'ProfitabilityIndexCalculator',
  'RevenuePerEmployeeCalculator',
  'RoasCalculator',
  'RoceCalculator',
  'RoiCalculator',
  'SaasLifetimeValueCalculator',
  'SafetyStockCalculator',
  'StockCalculator',
  'StockAverageCalculator',
  'StockSplitCalculator',
  'CommercialLeaseCalculator',
  'CommissionCalculator',
  'SalesCommissionCalculator',
  'SalesCalculator',
  'RentalCommissionCalculator',
  'RentalPropertyCalculator',
  'TrueCostOfRealEstateCommissionCalculator',
  'SellThroughRateCalculator',
  'SimpleInterestCalculator',
  'TdsInterestCalculator',
  'SinkingFundCalculator',
  'SipCalculator',
  'SmokersCtcCalculator',
  'TenureCalculator',
  'TimeValueOfMoneyCalculator',
  'TtmCalculator',
  'TreynorRatioCalculator',
  'TurnoverRateCalculator',
  'WebsiteAdRevenueCalculator',
  'MarginalRevenueCalculator',
  'RevenueGrowthCalculator',
  'WeddingBudgetCalculator',
  'WeekOverWeekCalculator',
  'SoftwareContractValueCalculator',
  'SortinoRatioCalculator',
  'YearOverYearGrowthCalculator',
  'YoutubeMoneyCalculator',
  'AnnualSalaryCalculator',
  'AnnualIncomeCalculator',
  'AnnualPayCalculator',
  'AnnualSalaryPerHourCalculator',
  'AnnualToMonthlySalaryCalculator',
  'AnnualizedRateOfReturnCalculator',
  'AppreciationCalculator',
  'AnnualizedReturnCalculator',
  'AprCalculator',
  'ApyCalculator',
  'BalanceTransferCalculator',
  'BalloonPaymentCalculator',
  'BasisPointCalculator',
  'BetaStockCalculator',
  'BlendedRateCalculator',
  'AverageCollectionPeriodCalculator',
  'AverageFixedCostCalculator',
  'AverageVariableCostCalculator',
  'BounceRateCalculator',
  'BradfordFactorCalculator',
  'BreakEvenCalculator',
  'BuildVsBuyCalculator',
  'BurnRateCalculator',
  'BurndownChartCalculator',
  'BudgetCalculator',
  'BusinessBudgetCalculator',
  'BusinessValuationCalculator',
  'CagrCalculator',
  'CapmCalculator',
  'CapitalGainsYieldCalculator',
  'CarInterestCalculator',
  'CarLeaseCalculator',
  'LeaseMileageCalculator',
  'CarLoanEmiCalculator',
  'CarRefinanceCalculator',
  'RefinanceCalculator',
  'CarriedInterestCalculator',
  'CashBackOrLowInterestCalculator',
  'CashFlowToDebtRatioCalculator',
  'CashRatioCalculator',
  'CashConversionCycleCalculator',
  'ChurnRateCalculator',
  'ConsultingFeesCalculator',
  'ConsumerSurplusCalculator',
  'ContributionMarginCalculator',
  'ConversionRateCalculator',
  'CostFunctionCalculator',
  'CostOfDoingBusinessCalculator',
  'CostOfGoodsSoldCalculator',
  'CostOfEquityCalculator',
  'CpaCalculator',
  'CpcAndCpmCalculator',
  'CpmCalculator',
  'CrossPriceElasticityCalculator',
  'CtrCalculator',
  'CurrentRatioCalculator',
  'CustomerAcquisitionCostCalculator',
  'CustomerRetentionRateCalculator',
  'DaysOffCalculator',
  'DegreeOfOperatingLeverageCalculator',
  'DioCalculator',
  'DpoCalculator',
  'DsoCalculator',
  'DividendDiscountModelCalculator',
  'DividendPayoutRatioCalculator',
  'DividendYieldCalculator',
  'DirectMaterialPriceVarianceCalculator',
  'DupontAnalysisCalculator',
  'EarCalculator',
  'EarningsPerShareCalculator',
  'EarningsPerShareGrowthCalculator',
  'EarlyLoanPayoffCalculator',
  'EbitCalculator',
  'EbitdaCalculator',
  'EbitdaMultipleCalculator',
  'EconomicValueAddedCalculator',
  'EnterpriseValueCalculator',
  'EbtCalculator',
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
  'GrahamNumberCalculator',
  'HedgeRatioCalculator',
  'HhiCalculator',
  'HighLowMethodCalculator',
  'LaborCostCalculator',
  'LemonadeStandCalculator',
  'LernerIndexCalculator',
  'LiquidNetWorthCalculator',
  'LoanBalanceCalculator',
  'LoanPaymentCalculator',
  'LoanRepaymentCalculator',
  'QuizLoanBalanceCalculator',
  'QuizCarDepreciationCalculator',
  'QuizDividendCalculator',
  'ManHoursCalculator',
  'MarginInterestCalculator',
  'MarginalCostCalculator',
  'MarketCapitalizationCalculator',
  'MaturityValueCalculator',
  'MirrCalculator',
  'MoneyFactorCalculator',
  'MoneyMarketAccountCalculator',
  'MonthOverMonthCalculator',
  'MovingAverageCalculator',
  'MutualFundCalculator',
  'MvaCalculator',
  'NavCalculator',
  'NopatCalculator',
  'NpvCalculator',
  'OnlineMarketingConversionCalculator',
  'OperatingAssetTurnoverCalculator',
  'OptimalHedgeRatioCalculator',
  'OptimalPriceCalculator',
  'OpportunityCostCalculator',
  'ParkingRatioCalculator',
  'PartiallyAmortizedLoanCalculator',
  'PaydayLoanCalculator',
  'PaymentCalculator',
  'PaybackPeriodCalculator',
  'PegRatioCalculator',
  'PercentageDiscountCalculator',
  'PercentageReturnCalculator',
  'PerpetuityCalculator',
  'PitiCalculator',
  'PivotPointCalculator',
  'PortfolioBetaCalculator',
  'PostJudgmentInterestCalculator',
  'PreAndPostMoneyValuationCalculator',
  'PresentValueCalculator',
  'PriceElasticityOfDemandCalculator',
  'PriceQuantityCalculator',
  'PriceToBookRatioCalculator',
  'PriceToCashFlowRatioCalculator',
  'PriceToEarningsRatioCalculator',
  'PrivateSavingsCalculator',
  'ProratedSalaryCalculator',
  'ProratedRentCalculator',
  'PvgoCalculator',
  'PvifaCalculator',
  'RateOfReturnCalculator',
  'RealEstateCommissionCalculator',
  'RealRateOfReturnCalculator',
  'RealtorCommissionVatCalculator',
  'RelativeStrengthIndexCalculator',
  'ResidualIncomeCalculator',
  'RentSplitCalculator',
  'RentVsBuyCalculator',
  'RevenueCalculator',
  'BitcoinEtfCalculator',
  'BiweeklyMortgageCalculator',
  'BiWeeklyMortgagePaymentCalculator',
  'BoatLoanCalculator',
  'BondCalculator',
  'BondConvexityCalculator',
  'BondCurrentYieldCalculator',
  'BondEquivalentYieldCalculator',
  'BondPriceCalculator',
  'BondYieldCalculator',
  'BondYtmCalculator',
  'JumboLoanCalculator',
  'LandLoanCalculator',
  'LeaseCalculator',
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
  'DiscountCalculator',
  'DiscountRateCalculator',
  'DoubleDiscountCalculator',
  'TripleDiscountCalculator',
  'CompoundGrowthCalculator',
  'CompoundInterestRateCalculator',
  'ContinuousCompoundInterestCalculator',
  'CouponPaymentCalculator',
  'CreditCardCalculator',
  'CreditCardInterestCalculator',
  'CreditCardMinimumPaymentCalculator',
  'CreditCardPaymentCalculator',
  'CreditCardPayoffCalculator',
  'CreditCardsPayoffCalculator',
  'CreditUtilizationCalculator',
  'EffectiveAnnualYieldCalculator',
  'EffectiveInterestRateCalculator',
  'EndingInventoryCalculator',
  'EoqCalculator',
  'ExpectedUtilityCalculator',
  'FutureValueCalculator',
  'FutureSalaryCalculator',
  'FreeCashFlowCalculator',
  'FcfeCalculator',
  'FcffCalculator',
  'FfoCalculator',
  'FibonacciRetracementCalculator',
  'FreeFloatCalculator',
  'LeveredFreeCashFlowCalculator',
  'UnpaidWorkCalculator',
  'UsIncomePercentileCalculator',
  'UnleveredFreeCashFlowCalculator',
  'TrumpAccountsCalculator',
  'TrumpsTaxesVsYourTaxesCalculator',
  'VaDisabilityCalculator',
  'ZakatCalculator',
  'VatCalculator',
  'WeeklyPayCalculator',
  'WhatToOfferOnAHouseCalculator',
  'CombinedRatioCalculator',
  'CustomerEffortScoreCalculator',
  'DartRateCalculator',
  'HrSoftwareRoiCalculator',
  'LossRatioCalculator',
  'NpsCalculator',
  'RemoteVsOnLocationWorkersCalculator',
  'TrirCalculator',
  'AverageReturnCalculator',
  'MaximumDrawdownCalculator',
  'FiftyThirtyTwentyCalculator',
  'ApcCalculator',
  'BankReconciliationCalculator',
  'CapRateCalculator',
  'CashOnCashReturnCalculator',
  'CarAffordabilityCalculator',
  'CellPhonePlanCalculator',
  'CollegeCostCalculator',
  'DreamComeTrueCalculator',
  'EarnestMoneyCalculator',
  'EmergencyFundCalculator',
  'FinanceCalculator',
  'FinanceChargeCalculator',
  'FinancialLeverageRatioCalculator',
  'FireCalculator',
  'FixedAssetTurnoverRatioCalculator',
  'GiftOfEquityCalculator',
  'GoldMeltCalculator',
  'GoodwillCalculator',
  'IncomeElasticityOfDemandCalculator',
  'InventoryTurnoverCalculator',
  'LifetimeEarningsCalculator',
  'LifoInventoryCalculator',
  'LongTermCareCalculator',
  'MegaMillionsPayoutCalculator',
  'MillionaireCalculator',
  'NetIncomeCalculator',
  'NetOperatingAssetsCalculator',
  'NetOperatingIncomeCalculator',
  'NetOperatingWorkingCapitalCalculator',
  'NetWorthCalculator',
  'PmiCalculator',
  'PowerballCalculator',
  'PricePerSquareFootCalculator',
  'PricePerSquareMeterCalculator',
  'ProductivityCalculator',
  'QuizUsIncomePercentileCalculator',
  'ReceivablesTurnoverRatioCalculator',
  'RepaymentCalculator',
  'RetainedEarningsCalculator',
  'Rule2836Calculator',
  'SabbaticalCalculator',
  'ScrapGoldCalculator',
  'ScrapSilverCalculator',
  'SilverMeltCalculator',
  'SubscriptionWasteCalculator',
  'TotalAssetTurnoverCalculator',
  'WorkingCapitalCalculator',
  'WorkingCapitalTurnoverRatioCalculator',
  'OperatingCashFlowCalculator',
  'FdCalculator',
  'FhaLoanCalculator',
  'HelocCalculator',
  'HomeAffordabilityCalculator',
  'HomeEquityLoanCalculator',
  'HomeImprovementLoanCalculator',
  'HomeLoanEmiCalculator',
  'HomeLoanCalculator',
  'HomeValueUsCalculator',
  'HouseAffordabilityCalculator',
  'MortgageTaxesInsuranceCalculator',
  'MortgageComparisonCalculator',
  'HomeMortgageCalculator',
  'MortgageAccelerationCalculator',
  'MortgageAmortizationCalculator',
  'MortgagePrepaymentCalculator',
  'MortgageWithExtraPaymentsCalculator',
  'MortgagePointsCalculator',
  'CanadianMortgageCalculator',
  'MortgageCalculatorUk',
  'MortgageInterestCalculator',
  'MortgageRateCalculator',
  'MortgageRefinanceCalculator',
  'HoldingPeriodReturnCalculator',
  'HourlyToAnnualSalaryCalculator',
  'HourlyToSalaryWageCalculator',
  'HourlyToSalaryWithOvertimeCalculator',
  'HourlyWageCalculator',
  'WageCalculator',
  'WageToSalaryCalculator',
  'YearlyWageCalculator',
  'ImpermanentLossCalculator',
  'InformationRatioCalculator',
  'InterestCalculator',
  'InterestCoverageRatioCalculator',
  'IntrinsicValueCalculator',
  'InterestOnlyMortgageCalculator',
  'InterestPerDayCalculator',
  'InterestRateCalculator',
  'IrrCalculator',
  'InvestmentCalculator',
  'InvestmentFeeCalculator',
  'JensensAlphaCalculator',
  'SalaryCalculator',
  'SalaryInflationCalculator',
  'SalaryToHourlyCalculator',
  'SavingsCalculator',
  'SavingsGoalCalculator',
  'SavingsInterestRateCalculator',
  'SavingsPlanCalculator',
  'SavingsWithdrawalCalculator',
  'SimpleSavingsCalculator',
  'SharpeRatioCalculator',
  'VaMortgageCalculator',
  'ValueAtRiskCalculator',
  'EidlCalculator',
  'CaliforniaStimulusCheckIiCalculator',
  'HealsActStimulusCalculator',
  'HeroesActStimulusCalculator',
  'StudentLoanRepaymentCovidCalculator',
  'StimulusCheck40kCalculator',
  'StimulusCheckCalculator',
  'CaresActUnemploymentBenefitCalculator',
  'LwaUnemploymentBenefitCalculator',
  'HealsHeroesUnemploymentBenefitCalculator',
  'AustraliaFederalBudgetTaxCutsCalculator',
  'CashActStimulusCalculator',
  'SecondStimulus900BillionCalculator',
  'AmericanRescuePlanStimulusCalculator',
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
    !isApprovedComponentKey('AutoLeaseCalculator') ||
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
    !isApprovedComponentKey('ArvCalculator') ||
    !isApprovedComponentKey('FourZeroThreeBCalculator') ||
    !isApprovedComponentKey('ADRCalculator') ||
    !isApprovedComponentKey('AFFOCalculator') ||
    !isApprovedComponentKey('FiveTwentyNineCalculator') ||
    !isApprovedComponentKey('SeventyTwentyTenCalculator') ||
    !isApprovedComponentKey('FourZeroOneKCalculator') ||
    !isApprovedComponentKey('AmortizationCalculator') ||
    !isApprovedComponentKey('AmtCalculator') ||
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
    !isApprovedComponentKey('DeferredPaymentLoanCalculator') ||
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
    !isApprovedComponentKey('MlToCcConverter') ||
    !isApprovedComponentKey('MlToKgConverter') ||
    !isApprovedComponentKey('MlToLbsConversion') ||
    !isApprovedComponentKey('MlToOzConverter') ||
    !isApprovedComponentKey('MlToTbspConverter') ||
    !isApprovedComponentKey('MlToTspConverter') ||
    !isApprovedComponentKey('MlToUlConversion') ||
    !isApprovedComponentKey('DecagramToGramConverter') ||
    !isApprovedComponentKey('PintToPoundCalculator') ||
    !isApprovedComponentKey('PintsToCupsConverter') ||
    !isApprovedComponentKey('PintsToGallonsConverter') ||
    !isApprovedComponentKey('QuartsToGallonsConverter') ||
    !isApprovedComponentKey('DropsToMlConverter') ||
    !isApprovedComponentKey('PoundsAndOuncesCalculator') ||
    !isApprovedComponentKey('PoundsToGramsConverter') ||
    !isApprovedComponentKey('PoundsToLbsConverter') ||
    !isApprovedComponentKey('PoundsToOuncesConverter') ||
    !isApprovedComponentKey('PoundsToStoneConverter') ||
    !isApprovedComponentKey('OunceToKgConverter') ||
    !isApprovedComponentKey('OuncesToGramsConverter') ||
    !isApprovedComponentKey('OuncesToMillilitersConverter') ||
    !isApprovedComponentKey('OuncesToPoundsConverter') ||
    !isApprovedComponentKey('OzToCcConverter') ||
    !isApprovedComponentKey('OzToCupsConverter') ||
    !isApprovedComponentKey('GallonCalculator') ||
    !isApprovedComponentKey('PricePerLiterToGallonConverter') ||
    !isApprovedComponentKey('QuartsToPoundsConverter') ||
    !isApprovedComponentKey('GallonsToPoundsConverter') ||
    !isApprovedComponentKey('VolumeConversion') ||
    !isApprovedComponentKey('GramsToOuncesCalculator') ||
    !isApprovedComponentKey('WeightConverter') ||
    !isApprovedComponentKey('KgToGallonsConverter') ||
    !isApprovedComponentKey('ForceConverter') ||
    !isApprovedComponentKey('NmToInLbsConverter') ||
    !isApprovedComponentKey('InchLbsToNmConverter') ||
    !isApprovedComponentKey('PaToPsiConversion') ||
    !isApprovedComponentKey('PascalConversion') ||
    !isApprovedComponentKey('PsiConverter') ||
    !isApprovedComponentKey('PsiToAtmConversion') ||
    !isApprovedComponentKey('PsiToInchesOfWaterConversion') ||
    !isApprovedComponentKey('PressureUnitConversion') ||
    !isApprovedComponentKey('PressureConversion') ||
    !isApprovedComponentKey('InchPoundsToFootPoundsConverter') ||
    !isApprovedComponentKey('PsiToGpmCalculator') ||
    !isApprovedComponentKey('LbsToNewtonsConverter') ||
    !isApprovedComponentKey('TorqueToHpCalculator') ||
    !isApprovedComponentKey('NewtonMeterCalculator') ||
    !isApprovedComponentKey('TorrToAtmConverter') ||
    !isApprovedComponentKey('MmhgToAtmConversion') ||
    !isApprovedComponentKey('MmToAtmConverter') ||
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
    !isApprovedComponentKey('NaturalRateOfUnemploymentCalculator') ||
    !isApprovedComponentKey('UnemploymentCalculator') ||
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
    !isApprovedComponentKey('RadiansToDegreesConverter') ||
    !isApprovedComponentKey('DegreesToSecondsConverter') ||
    !isApprovedComponentKey('DistanceConverter') ||
    !isApprovedComponentKey('DmConverter') ||
    !isApprovedComponentKey('FahrenheitConverter') ||
    !isApprovedComponentKey('FahrenheitToCelsiusConverter') ||
    !isApprovedComponentKey('FeetConverter') ||
    !isApprovedComponentKey('FeetToMilesConverter') ||
    !isApprovedComponentKey('FeetToYardsConverter') ||
    !isApprovedComponentKey('FluidOuncesToPoundsConverter') ||
    !isApprovedComponentKey('FootToCentimeterConverter') ||
    !isApprovedComponentKey('FtToMConverter') ||
    !isApprovedComponentKey('GajToSquareYardConverter') ||
    !isApprovedComponentKey('GallonsToCubicFeetConverter') ||
    !isApprovedComponentKey('GallonsToCupsConverter') ||
    !isApprovedComponentKey('GallonsToGramsConverter') ||
    !isApprovedComponentKey('GallonsToPintsConverter') ||
    !isApprovedComponentKey('GallonsToQuartsConverter') ||
    !isApprovedComponentKey('GallonsToTonsConverter') ||
    !isApprovedComponentKey('GalToKgConverter') ||
    !isApprovedComponentKey('GramsInMlConverter') ||
    !isApprovedComponentKey('GramsToFlOzConverter') ||
    !isApprovedComponentKey('GramToLiterConversion') ||
    !isApprovedComponentKey('GrToMlConverter') ||
    !isApprovedComponentKey('GToTspConverter') ||
    !isApprovedComponentKey('GToLbsConverter') ||
    !isApprovedComponentKey('HectaresToAcresConverter') ||
    !isApprovedComponentKey('HeightConverter') ||
    !isApprovedComponentKey('HourConverter') ||
    !isApprovedComponentKey('HoursToDaysCalculator') ||
    !isApprovedComponentKey('HoursToMinutesConverter') ||
    !isApprovedComponentKey('HoursToSecondsConverter') ||
    !isApprovedComponentKey('HoursToWeekConversion') ||
    !isApprovedComponentKey('HoursToYearsConverter') ||
    !isApprovedComponentKey('ImperialCalculator') ||
    !isApprovedComponentKey('ImperialToMetricConversion') ||
    !isApprovedComponentKey('InchConverter') ||
    !isApprovedComponentKey('InchToMeterCalculator') ||
    !isApprovedComponentKey('InchesToYardConversion') ||
    !isApprovedComponentKey('InToCmConverter') ||
    !isApprovedComponentKey('KathaToSquareFeetConverter') ||
    !isApprovedComponentKey('KelvinConverter') ||
    !isApprovedComponentKey('KelvinToCelsiusConverter') ||
    !isApprovedComponentKey('KelvinToFahrenheitConverter') ||
    !isApprovedComponentKey('KgCmToPsiConverter') ||
    !isApprovedComponentKey('KgToLbsConverter') ||
    !isApprovedComponentKey('KgToLiterConverter') ||
    !isApprovedComponentKey('KgToMlConverter') ||
    !isApprovedComponentKey('KgToOunceConverter') ||
    !isApprovedComponentKey('KgToStonesConverter') ||
    !isApprovedComponentKey('KilometerCalculator') ||
    !isApprovedComponentKey('KilometerToMeterConverter') ||
    !isApprovedComponentKey('KilometersToMilesCalculator') ||
    !isApprovedComponentKey('KmToFeetConversion') ||
    !isApprovedComponentKey('KpaConverter') ||
    !isApprovedComponentKey('KpaToAtmConversion') ||
    !isApprovedComponentKey('KpaToMmhgConversion') ||
    !isApprovedComponentKey('KpaToPsiConversion') ||
    !isApprovedComponentKey('KsiToMpaConverter') ||
    !isApprovedComponentKey('KsiToPsiConversion') ||
    !isApprovedComponentKey('LandAreaCalculator') ||
    !isApprovedComponentKey('LbsToGConverter') ||
    !isApprovedComponentKey('LbsToKgConverter') ||
    !isApprovedComponentKey('LbsToPoundsConverter') ||
    !isApprovedComponentKey('MetricToStandardConverter') ||
    !isApprovedComponentKey('MgToCcConverter') ||
    !isApprovedComponentKey('MgToLbsConverter') ||
    !isApprovedComponentKey('MgToTablespoonConverter') ||
    !isApprovedComponentKey('MgToTeaspoonConverter') ||
    !isApprovedComponentKey('MicronToMilConversionCalculator') ||
    !isApprovedComponentKey('MilConversion') ||
    !isApprovedComponentKey('MileConversionCalculator') ||
    !isApprovedComponentKey('MillimeterCalculator') ||
    !isApprovedComponentKey('MmCalculator') ||
    !isApprovedComponentKey('MmToFootConverter') ||
    !isApprovedComponentKey('MmToInchesConversion') ||
    !isApprovedComponentKey('MmToKmConversion') ||
    !isApprovedComponentKey('MmToMConversion') ||
    !isApprovedComponentKey('MillisecondsConverter') ||
    !isApprovedComponentKey('MilToInchConversion') ||
    !isApprovedComponentKey('MilToMmConversion') ||
    !isApprovedComponentKey('MinuteConverter') ||
    !isApprovedComponentKey('MinutesToDaysCalculator') ||
    !isApprovedComponentKey('MinutesToDecimalCalculator') ||
    !isApprovedComponentKey('MinutesToSecondsConverter') ||
    !isApprovedComponentKey('MinutesToYearsConversion') ||
    !isApprovedComponentKey('MonthsToYearsCalculator') ||
    !isApprovedComponentKey('MpaConversion') ||
    !isApprovedComponentKey('MpaToPsiConversion') ||
    !isApprovedComponentKey('MpaToPsigConversion') ||
    !isApprovedComponentKey('MsToSecondsConverter') ||
    !isApprovedComponentKey('SecondsConverter') ||
    !isApprovedComponentKey('SecondsToDaysConverter') ||
    !isApprovedComponentKey('SecondsToHoursConverter') ||
    !isApprovedComponentKey('SecondsToMinutesConverter') ||
    !isApprovedComponentKey('SecondsToYearsConversion') ||
    !isApprovedComponentKey('SquareCmToSquareMmConverter') ||
    !isApprovedComponentKey('SquareFeetConverter') ||
    !isApprovedComponentKey('SquareFeetToAcresCalculator') ||
    !isApprovedComponentKey('SquareInchToSquareFootConverter') ||
    !isApprovedComponentKey('SquareMeterConverter') ||
    !isApprovedComponentKey('SquareMetersToSquareFeetConverter') ||
    !isApprovedComponentKey('SquareMilesToSquareKmConverter') ||
    !isApprovedComponentKey('SquareYardConverter') ||
    !isApprovedComponentKey('StoneToKgConverter') ||
    !isApprovedComponentKey('StoneToLbsConverter') ||
    !isApprovedComponentKey('TbspToGramsConverter') ||
    !isApprovedComponentKey('TbspToMlConverter') ||
    !isApprovedComponentKey('TspToGramsConverter') ||
    !isApprovedComponentKey('TspToMlConverter') ||
    !isApprovedComponentKey('WeeksToMonthsCalculator') ||
    !isApprovedComponentKey('WeeksToYearsConverter') ||
    !isApprovedComponentKey('YardConversionCalculator') ||
    !isApprovedComponentKey('YardToMeterConverter') ||
    !isApprovedComponentKey('YardToMileConverter') ||
    !isApprovedComponentKey('YardsToMetersConversion') ||
    !isApprovedComponentKey('NmConverter') ||
    !isApprovedComponentKey('NmToMConverter') ||
    !isApprovedComponentKey('AdditionalFundsNeededCalculator') ||
    !isApprovedComponentKey('AbsencePercentageCalculator') ||
    !isApprovedComponentKey('AccumulatedDepreciationCalculator') ||
    !isApprovedComponentKey('CarDepreciationCalculator') ||
    !isApprovedComponentKey('AttritionRateCalculator') ||
    !isApprovedComponentKey('BusinessLoanCalculator') ||
    !isApprovedComponentKey('AccountingProfitCalculator') ||
    !isApprovedComponentKey('ProfitCalculator') ||
    !isApprovedComponentKey('EconomicProfitCalculator') ||
    !isApprovedComponentKey('EvToSalesCalculator') ||
    !isApprovedComponentKey('PriceToSalesRatioCalculator') ||
    !isApprovedComponentKey('ProfitabilityIndexCalculator') ||
    !isApprovedComponentKey('RevenuePerEmployeeCalculator') ||
    !isApprovedComponentKey('RoasCalculator') ||
    !isApprovedComponentKey('RoceCalculator') ||
    !isApprovedComponentKey('RoiCalculator') ||
    !isApprovedComponentKey('SaasLifetimeValueCalculator') ||
    !isApprovedComponentKey('SafetyStockCalculator') ||
    !isApprovedComponentKey('StockCalculator') ||
    !isApprovedComponentKey('StockAverageCalculator') ||
    !isApprovedComponentKey('StockSplitCalculator') ||
    !isApprovedComponentKey('CommercialLeaseCalculator') ||
    !isApprovedComponentKey('CommissionCalculator') ||
    !isApprovedComponentKey('SalesCommissionCalculator') ||
    !isApprovedComponentKey('SalesCalculator') ||
    !isApprovedComponentKey('RentalCommissionCalculator') ||
    !isApprovedComponentKey('RentalPropertyCalculator') ||
    !isApprovedComponentKey('TrueCostOfRealEstateCommissionCalculator') ||
    !isApprovedComponentKey('SellThroughRateCalculator') ||
    !isApprovedComponentKey('SimpleInterestCalculator') ||
    !isApprovedComponentKey('TdsInterestCalculator') ||
    !isApprovedComponentKey('SinkingFundCalculator') ||
    !isApprovedComponentKey('SipCalculator') ||
    !isApprovedComponentKey('SmokersCtcCalculator') ||
    !isApprovedComponentKey('TenureCalculator') ||
    !isApprovedComponentKey('TimeValueOfMoneyCalculator') ||
    !isApprovedComponentKey('TtmCalculator') ||
    !isApprovedComponentKey('TreynorRatioCalculator') ||
    !isApprovedComponentKey('TurnoverRateCalculator') ||
    !isApprovedComponentKey('WebsiteAdRevenueCalculator') ||
    !isApprovedComponentKey('MarginalRevenueCalculator') ||
    !isApprovedComponentKey('RevenueGrowthCalculator') ||
    !isApprovedComponentKey('WeddingBudgetCalculator') ||
    !isApprovedComponentKey('WeekOverWeekCalculator') ||
    !isApprovedComponentKey('SoftwareContractValueCalculator') ||
    !isApprovedComponentKey('SortinoRatioCalculator') ||
    !isApprovedComponentKey('YearOverYearGrowthCalculator') ||
    !isApprovedComponentKey('YoutubeMoneyCalculator') ||
    !isApprovedComponentKey('AnnualSalaryCalculator') ||
    !isApprovedComponentKey('AnnualIncomeCalculator') ||
    !isApprovedComponentKey('AnnualPayCalculator') ||
    !isApprovedComponentKey('AnnualSalaryPerHourCalculator') ||
    !isApprovedComponentKey('AnnualToMonthlySalaryCalculator') ||
    !isApprovedComponentKey('AnnualizedRateOfReturnCalculator') ||
    !isApprovedComponentKey('AppreciationCalculator') ||
    !isApprovedComponentKey('AnnualizedReturnCalculator') ||
    !isApprovedComponentKey('AprCalculator') ||
    !isApprovedComponentKey('ApyCalculator') ||
    !isApprovedComponentKey('BalanceTransferCalculator') ||
    !isApprovedComponentKey('BalloonPaymentCalculator') ||
    !isApprovedComponentKey('BasisPointCalculator') ||
    !isApprovedComponentKey('BetaStockCalculator') ||
    !isApprovedComponentKey('BlendedRateCalculator') ||
    !isApprovedComponentKey('AverageCollectionPeriodCalculator') ||
    !isApprovedComponentKey('AverageFixedCostCalculator') ||
    !isApprovedComponentKey('AverageVariableCostCalculator') ||
    !isApprovedComponentKey('BounceRateCalculator') ||
    !isApprovedComponentKey('BradfordFactorCalculator') ||
    !isApprovedComponentKey('BreakEvenCalculator') ||
    !isApprovedComponentKey('BuildVsBuyCalculator') ||
    !isApprovedComponentKey('BurnRateCalculator') ||
    !isApprovedComponentKey('BurndownChartCalculator') ||
    !isApprovedComponentKey('BudgetCalculator') ||
    !isApprovedComponentKey('BusinessBudgetCalculator') ||
    !isApprovedComponentKey('BusinessValuationCalculator') ||
    !isApprovedComponentKey('CagrCalculator') ||
    !isApprovedComponentKey('CapmCalculator') ||
    !isApprovedComponentKey('CapitalGainsYieldCalculator') ||
    !isApprovedComponentKey('CarInterestCalculator') ||
    !isApprovedComponentKey('CarLeaseCalculator') ||
    !isApprovedComponentKey('LeaseMileageCalculator') ||
    !isApprovedComponentKey('CarLoanEmiCalculator') ||    !isApprovedComponentKey('CarRefinanceCalculator') ||
    !isApprovedComponentKey('RefinanceCalculator') ||

    !isApprovedComponentKey('CarriedInterestCalculator') ||
    !isApprovedComponentKey('CashBackOrLowInterestCalculator') ||
    !isApprovedComponentKey('CashFlowToDebtRatioCalculator') ||
    !isApprovedComponentKey('CashRatioCalculator') ||
    !isApprovedComponentKey('CashConversionCycleCalculator') ||
    !isApprovedComponentKey('ChurnRateCalculator') ||
    !isApprovedComponentKey('ConsultingFeesCalculator') ||
    !isApprovedComponentKey('ConsumerSurplusCalculator') ||
    !isApprovedComponentKey('ContributionMarginCalculator') ||
    !isApprovedComponentKey('ConversionRateCalculator') ||
    !isApprovedComponentKey('CostFunctionCalculator') ||
    !isApprovedComponentKey('CostOfDoingBusinessCalculator') ||
    !isApprovedComponentKey('CostOfGoodsSoldCalculator') ||
    !isApprovedComponentKey('CostOfEquityCalculator') ||
    !isApprovedComponentKey('CpaCalculator') ||
    !isApprovedComponentKey('CpcAndCpmCalculator') ||
    !isApprovedComponentKey('CpmCalculator') ||
    !isApprovedComponentKey('CrossPriceElasticityCalculator') ||
    !isApprovedComponentKey('CtrCalculator') ||
    !isApprovedComponentKey('CurrentRatioCalculator') ||
    !isApprovedComponentKey('CustomerAcquisitionCostCalculator') ||
    !isApprovedComponentKey('CustomerRetentionRateCalculator') ||
    !isApprovedComponentKey('DaysOffCalculator') ||
    !isApprovedComponentKey('DegreeOfOperatingLeverageCalculator') ||
    !isApprovedComponentKey('DioCalculator') ||
    !isApprovedComponentKey('DpoCalculator') ||
    !isApprovedComponentKey('DsoCalculator') ||
    !isApprovedComponentKey('DividendDiscountModelCalculator') ||
    !isApprovedComponentKey('DividendPayoutRatioCalculator') ||
    !isApprovedComponentKey('DividendYieldCalculator') ||
    !isApprovedComponentKey('DirectMaterialPriceVarianceCalculator') ||
    !isApprovedComponentKey('DupontAnalysisCalculator') ||
    !isApprovedComponentKey('EarCalculator') ||
    !isApprovedComponentKey('EarningsPerShareCalculator') ||
    !isApprovedComponentKey('EarningsPerShareGrowthCalculator') ||
    !isApprovedComponentKey('EarlyLoanPayoffCalculator') ||
    !isApprovedComponentKey('EbitCalculator') ||
    !isApprovedComponentKey('EbitdaCalculator') ||
    !isApprovedComponentKey('EbitdaMultipleCalculator') ||
    !isApprovedComponentKey('EconomicValueAddedCalculator') ||
    !isApprovedComponentKey('EnterpriseValueCalculator') ||
    !isApprovedComponentKey('EbtCalculator') ||
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
    !isApprovedComponentKey('GrahamNumberCalculator') ||
    !isApprovedComponentKey('HedgeRatioCalculator') ||
    !isApprovedComponentKey('HhiCalculator') ||
    !isApprovedComponentKey('HighLowMethodCalculator') ||
    !isApprovedComponentKey('LaborCostCalculator') ||
    !isApprovedComponentKey('LemonadeStandCalculator') ||
    !isApprovedComponentKey('LernerIndexCalculator') ||
    !isApprovedComponentKey('LiquidNetWorthCalculator') ||
    !isApprovedComponentKey('LoanBalanceCalculator') ||
    !isApprovedComponentKey('LoanPaymentCalculator') ||
    !isApprovedComponentKey('LoanRepaymentCalculator') ||
    !isApprovedComponentKey('QuizLoanBalanceCalculator') ||
    !isApprovedComponentKey('QuizCarDepreciationCalculator') ||
    !isApprovedComponentKey('QuizDividendCalculator') ||
    !isApprovedComponentKey('ManHoursCalculator') ||
    !isApprovedComponentKey('MarginInterestCalculator') ||
    !isApprovedComponentKey('MarginalCostCalculator') ||
    !isApprovedComponentKey('MarketCapitalizationCalculator') ||
    !isApprovedComponentKey('MaturityValueCalculator') ||
    !isApprovedComponentKey('MirrCalculator') ||
    !isApprovedComponentKey('MoneyFactorCalculator') ||
    !isApprovedComponentKey('MoneyMarketAccountCalculator') ||
    !isApprovedComponentKey('MonthOverMonthCalculator') ||
    !isApprovedComponentKey('MovingAverageCalculator') ||
    !isApprovedComponentKey('MutualFundCalculator') ||
    !isApprovedComponentKey('MvaCalculator') ||
    !isApprovedComponentKey('NavCalculator') ||
    !isApprovedComponentKey('NopatCalculator') ||
    !isApprovedComponentKey('NpvCalculator') ||
    !isApprovedComponentKey('OnlineMarketingConversionCalculator') ||
    !isApprovedComponentKey('OperatingAssetTurnoverCalculator') ||
    !isApprovedComponentKey('OptimalHedgeRatioCalculator') ||
    !isApprovedComponentKey('OptimalPriceCalculator') ||
    !isApprovedComponentKey('OpportunityCostCalculator') ||
    !isApprovedComponentKey('ParkingRatioCalculator') ||
    !isApprovedComponentKey('PartiallyAmortizedLoanCalculator') ||
    !isApprovedComponentKey('PaydayLoanCalculator') ||
    !isApprovedComponentKey('PaybackPeriodCalculator') ||
    !isApprovedComponentKey('PegRatioCalculator') ||
    !isApprovedComponentKey('PercentageDiscountCalculator') ||
    !isApprovedComponentKey('PercentageReturnCalculator') ||
    !isApprovedComponentKey('PerpetuityCalculator') ||
    !isApprovedComponentKey('PitiCalculator') ||
    !isApprovedComponentKey('PivotPointCalculator') ||
    !isApprovedComponentKey('PortfolioBetaCalculator') ||
    !isApprovedComponentKey('PostJudgmentInterestCalculator') ||
    !isApprovedComponentKey('PreAndPostMoneyValuationCalculator') ||
    !isApprovedComponentKey('PresentValueCalculator') ||
    !isApprovedComponentKey('PriceElasticityOfDemandCalculator') ||
    !isApprovedComponentKey('PriceQuantityCalculator') ||
    !isApprovedComponentKey('PriceToBookRatioCalculator') ||
    !isApprovedComponentKey('PriceToCashFlowRatioCalculator') ||
    !isApprovedComponentKey('PriceToEarningsRatioCalculator') ||
    !isApprovedComponentKey('PrivateSavingsCalculator') ||
    !isApprovedComponentKey('ProratedSalaryCalculator') ||
    !isApprovedComponentKey('ProratedRentCalculator') ||
    !isApprovedComponentKey('PvgoCalculator') ||
    !isApprovedComponentKey('PvifaCalculator') ||
    !isApprovedComponentKey('RateOfReturnCalculator') ||
    !isApprovedComponentKey('RealEstateCommissionCalculator') ||
    !isApprovedComponentKey('RealRateOfReturnCalculator') ||
    !isApprovedComponentKey('RealtorCommissionVatCalculator') ||
    !isApprovedComponentKey('RelativeStrengthIndexCalculator') ||
    !isApprovedComponentKey('ResidualIncomeCalculator') ||
    !isApprovedComponentKey('RentSplitCalculator') ||
    !isApprovedComponentKey('RentVsBuyCalculator') ||
    !isApprovedComponentKey('RevenueCalculator') ||
    !isApprovedComponentKey('BitcoinEtfCalculator') ||
    !isApprovedComponentKey('BiweeklyMortgageCalculator') ||
    !isApprovedComponentKey('BiWeeklyMortgagePaymentCalculator') ||
    !isApprovedComponentKey('BoatLoanCalculator') ||
    !isApprovedComponentKey('BondCalculator') ||
    !isApprovedComponentKey('BondConvexityCalculator') ||
    !isApprovedComponentKey('BondCurrentYieldCalculator') ||
    !isApprovedComponentKey('BondEquivalentYieldCalculator') ||
    !isApprovedComponentKey('BondPriceCalculator') ||
    !isApprovedComponentKey('BondYieldCalculator') ||
    !isApprovedComponentKey('BondYtmCalculator') ||
    !isApprovedComponentKey('JumboLoanCalculator') ||
    !isApprovedComponentKey('LandLoanCalculator') ||
    !isApprovedComponentKey('LeaseCalculator') ||
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
    !isApprovedComponentKey('DiscountCalculator') ||
    !isApprovedComponentKey('DiscountRateCalculator') ||
    !isApprovedComponentKey('DoubleDiscountCalculator') ||
    !isApprovedComponentKey('TripleDiscountCalculator') ||
    !isApprovedComponentKey('CompoundGrowthCalculator') ||
    !isApprovedComponentKey('CompoundInterestRateCalculator') ||
    !isApprovedComponentKey('ContinuousCompoundInterestCalculator') ||
    !isApprovedComponentKey('CouponPaymentCalculator') ||
    !isApprovedComponentKey('CreditCardCalculator') ||
    !isApprovedComponentKey('CreditCardInterestCalculator') ||
    !isApprovedComponentKey('CreditCardMinimumPaymentCalculator') ||
    !isApprovedComponentKey('CreditCardPaymentCalculator') ||
    !isApprovedComponentKey('CreditCardPayoffCalculator') ||
    !isApprovedComponentKey('CreditCardsPayoffCalculator') ||
    !isApprovedComponentKey('CreditUtilizationCalculator') ||
    !isApprovedComponentKey('EffectiveAnnualYieldCalculator') ||
    !isApprovedComponentKey('EffectiveInterestRateCalculator') ||
    !isApprovedComponentKey('EndingInventoryCalculator') ||
    !isApprovedComponentKey('EoqCalculator') ||
    !isApprovedComponentKey('ExpectedUtilityCalculator') ||
    !isApprovedComponentKey('FutureValueCalculator') ||
    !isApprovedComponentKey('FutureSalaryCalculator') ||
    !isApprovedComponentKey('FreeCashFlowCalculator') ||
    !isApprovedComponentKey('FcfeCalculator') ||
    !isApprovedComponentKey('FcffCalculator') ||
    !isApprovedComponentKey('FfoCalculator') ||
    !isApprovedComponentKey('FibonacciRetracementCalculator') ||
    !isApprovedComponentKey('FreeFloatCalculator') ||
    !isApprovedComponentKey('LeveredFreeCashFlowCalculator') ||
    !isApprovedComponentKey('UnpaidWorkCalculator') ||
    !isApprovedComponentKey('UsIncomePercentileCalculator') ||
    !isApprovedComponentKey('UnleveredFreeCashFlowCalculator') ||
    !isApprovedComponentKey('TrumpAccountsCalculator') ||
    !isApprovedComponentKey('TrumpsTaxesVsYourTaxesCalculator') ||
    !isApprovedComponentKey('VaDisabilityCalculator') ||
    !isApprovedComponentKey('ZakatCalculator') ||
    !isApprovedComponentKey('VatCalculator') ||
    !isApprovedComponentKey('WeeklyPayCalculator') ||
    !isApprovedComponentKey('WhatToOfferOnAHouseCalculator') ||
    !isApprovedComponentKey('CombinedRatioCalculator') ||
    !isApprovedComponentKey('CustomerEffortScoreCalculator') ||
    !isApprovedComponentKey('DartRateCalculator') ||
    !isApprovedComponentKey('HrSoftwareRoiCalculator') ||
    !isApprovedComponentKey('LossRatioCalculator') ||
    !isApprovedComponentKey('NpsCalculator') ||
    !isApprovedComponentKey('RemoteVsOnLocationWorkersCalculator') ||
    !isApprovedComponentKey('TrirCalculator') ||
    !isApprovedComponentKey('AverageReturnCalculator') ||
    !isApprovedComponentKey('MaximumDrawdownCalculator') ||
    !isApprovedComponentKey('FiftyThirtyTwentyCalculator') ||
    !isApprovedComponentKey('ApcCalculator') ||
    !isApprovedComponentKey('AccrualRatioCalculator') ||
    !isApprovedComponentKey('ActualCashValueCalculator') ||
    !isApprovedComponentKey('BankReconciliationCalculator') ||
    !isApprovedComponentKey('CapRateCalculator') ||
    !isApprovedComponentKey('CashOnCashReturnCalculator') ||
    !isApprovedComponentKey('CarAffordabilityCalculator') ||
    !isApprovedComponentKey('CellPhonePlanCalculator') ||
    !isApprovedComponentKey('CollegeCostCalculator') ||
    !isApprovedComponentKey('DreamComeTrueCalculator') ||
    !isApprovedComponentKey('EarnestMoneyCalculator') ||
    !isApprovedComponentKey('EmergencyFundCalculator') ||
    !isApprovedComponentKey('FinanceCalculator') ||
    !isApprovedComponentKey('FinanceChargeCalculator') ||
    !isApprovedComponentKey('FinancialLeverageRatioCalculator') ||
    !isApprovedComponentKey('FireCalculator') ||
    !isApprovedComponentKey('FixedAssetTurnoverRatioCalculator') ||
    !isApprovedComponentKey('GiftOfEquityCalculator') ||
    !isApprovedComponentKey('GoldMeltCalculator') ||
    !isApprovedComponentKey('GoodwillCalculator') ||
    !isApprovedComponentKey('IncomeElasticityOfDemandCalculator') ||
    !isApprovedComponentKey('InventoryTurnoverCalculator') ||
    !isApprovedComponentKey('LifetimeEarningsCalculator') ||
    !isApprovedComponentKey('LifoInventoryCalculator') ||
    !isApprovedComponentKey('LongTermCareCalculator') ||
    !isApprovedComponentKey('MegaMillionsPayoutCalculator') ||
    !isApprovedComponentKey('MillionaireCalculator') ||
    !isApprovedComponentKey('NetIncomeCalculator') ||
    !isApprovedComponentKey('NetOperatingAssetsCalculator') ||
    !isApprovedComponentKey('NetOperatingIncomeCalculator') ||
    !isApprovedComponentKey('NetOperatingWorkingCapitalCalculator') ||
    !isApprovedComponentKey('NetWorthCalculator') ||
    !isApprovedComponentKey('PmiCalculator') ||
    !isApprovedComponentKey('PowerballCalculator') ||
    !isApprovedComponentKey('PricePerSquareFootCalculator') ||
    !isApprovedComponentKey('PricePerSquareMeterCalculator') ||
    !isApprovedComponentKey('ProductivityCalculator') ||
    !isApprovedComponentKey('QuizUsIncomePercentileCalculator') ||
    !isApprovedComponentKey('ReceivablesTurnoverRatioCalculator') ||
    !isApprovedComponentKey('RepaymentCalculator') ||
    !isApprovedComponentKey('RetainedEarningsCalculator') ||
    !isApprovedComponentKey('Rule2836Calculator') ||
    !isApprovedComponentKey('SabbaticalCalculator') ||
    !isApprovedComponentKey('ScrapGoldCalculator') ||
    !isApprovedComponentKey('ScrapSilverCalculator') ||
    !isApprovedComponentKey('SilverMeltCalculator') ||
    !isApprovedComponentKey('SubscriptionWasteCalculator') ||
    !isApprovedComponentKey('TotalAssetTurnoverCalculator') ||
    !isApprovedComponentKey('WorkingCapitalCalculator') ||
    !isApprovedComponentKey('WorkingCapitalTurnoverRatioCalculator') ||
    !isApprovedComponentKey('OperatingCashFlowCalculator') ||
    !isApprovedComponentKey('FdCalculator') ||
    !isApprovedComponentKey('FhaLoanCalculator') ||
    !isApprovedComponentKey('HelocCalculator') ||
    !isApprovedComponentKey('HomeAffordabilityCalculator') ||
    !isApprovedComponentKey('HomeEquityLoanCalculator') ||
    !isApprovedComponentKey('HomeImprovementLoanCalculator') ||
    !isApprovedComponentKey('HomeLoanEmiCalculator') ||
    !isApprovedComponentKey('HomeLoanCalculator') ||
    !isApprovedComponentKey('HomeValueUsCalculator') ||
    !isApprovedComponentKey('HouseAffordabilityCalculator') ||
    !isApprovedComponentKey('MortgageTaxesInsuranceCalculator') ||
    !isApprovedComponentKey('MortgageComparisonCalculator') ||
    !isApprovedComponentKey('HomeMortgageCalculator') ||
    !isApprovedComponentKey('MortgageAccelerationCalculator') ||
    !isApprovedComponentKey('MortgageAmortizationCalculator') ||
    !isApprovedComponentKey('MortgagePrepaymentCalculator') ||
    !isApprovedComponentKey('MortgageWithExtraPaymentsCalculator') ||
    !isApprovedComponentKey('MortgagePointsCalculator') ||
    !isApprovedComponentKey('CanadianMortgageCalculator') ||
    !isApprovedComponentKey('MortgageCalculatorUk') ||
    !isApprovedComponentKey('MortgageInterestCalculator') ||
    !isApprovedComponentKey('MortgageRateCalculator') ||
    !isApprovedComponentKey('MortgageRefinanceCalculator') ||
    !isApprovedComponentKey('HoldingPeriodReturnCalculator') ||
    !isApprovedComponentKey('HourlyToAnnualSalaryCalculator') ||
    !isApprovedComponentKey('HourlyToSalaryWageCalculator') ||
    !isApprovedComponentKey('HourlyToSalaryWithOvertimeCalculator') ||
    !isApprovedComponentKey('HourlyWageCalculator') ||
    !isApprovedComponentKey('WageCalculator') ||
    !isApprovedComponentKey('WageToSalaryCalculator') ||
    !isApprovedComponentKey('YearlyWageCalculator') ||
    !isApprovedComponentKey('ImpermanentLossCalculator') ||
    !isApprovedComponentKey('InformationRatioCalculator') ||
    !isApprovedComponentKey('InterestCalculator') ||
    !isApprovedComponentKey('InterestCoverageRatioCalculator') ||
    !isApprovedComponentKey('IntrinsicValueCalculator') ||
    !isApprovedComponentKey('InterestOnlyMortgageCalculator') ||
    !isApprovedComponentKey('InterestPerDayCalculator') ||
    !isApprovedComponentKey('InterestRateCalculator') ||
    !isApprovedComponentKey('IrrCalculator') ||
    !isApprovedComponentKey('InvestmentCalculator') ||
    !isApprovedComponentKey('InvestmentFeeCalculator') ||
    !isApprovedComponentKey('JensensAlphaCalculator') ||
    !isApprovedComponentKey('SalaryCalculator') ||
    !isApprovedComponentKey('SalaryInflationCalculator') ||
    !isApprovedComponentKey('SalaryToHourlyCalculator') ||
    !isApprovedComponentKey('SavingsCalculator') ||
    !isApprovedComponentKey('SavingsGoalCalculator') ||
    !isApprovedComponentKey('SavingsInterestRateCalculator') ||
    !isApprovedComponentKey('SavingsPlanCalculator') ||
    !isApprovedComponentKey('SavingsWithdrawalCalculator') ||
    !isApprovedComponentKey('SimpleSavingsCalculator') ||
    !isApprovedComponentKey('SharpeRatioCalculator') ||
    !isApprovedComponentKey('VaMortgageCalculator') ||
    !isApprovedComponentKey('ValueAtRiskCalculator') ||
    !isApprovedComponentKey('EidlCalculator') ||
    !isApprovedComponentKey('CaliforniaStimulusCheckIiCalculator') ||
    !isApprovedComponentKey('HealsActStimulusCalculator') ||
    !isApprovedComponentKey('HeroesActStimulusCalculator') ||
    !isApprovedComponentKey('StudentLoanRepaymentCovidCalculator') ||
    !isApprovedComponentKey('StimulusCheck40kCalculator') ||
    !isApprovedComponentKey('StimulusCheckCalculator') ||
    !isApprovedComponentKey('CaresActUnemploymentBenefitCalculator') ||
    !isApprovedComponentKey('LwaUnemploymentBenefitCalculator') ||
    !isApprovedComponentKey('HealsHeroesUnemploymentBenefitCalculator') ||
    !isApprovedComponentKey('AustraliaFederalBudgetTaxCutsCalculator') ||
    !isApprovedComponentKey('CashActStimulusCalculator') ||
    !isApprovedComponentKey('SecondStimulus900BillionCalculator') ||
    !isApprovedComponentKey('AmericanRescuePlanStimulusCalculator') ||
    !isApprovedComponentKey('LoanInterestCalculator') ||
    !isApprovedComponentKey('TimesInterestEarnedCalculator') ||
    !isApprovedComponentKey('InterestRateParityCalculator') ||
    !isApprovedComponentKey('DebtCalculator') ||
    !isApprovedComponentKey('AfterTaxCostOfDebtCalculator') ||
    !isApprovedComponentKey('DebtAvalancheCalculator') ||
    !isApprovedComponentKey('DebtServiceCoverageRatioCalculator') ||
    !isApprovedComponentKey('DebtSnowballCalculator') ||
    !isApprovedComponentKey('DebtToAssetRatioCalculator') ||
    !isApprovedComponentKey('DebtToEquityCalculator') ||
    !isApprovedComponentKey('DebtToCapitalRatioCalculator') ||
    !isApprovedComponentKey('NetDebtCalculator') ||
    !isApprovedComponentKey('EbitdaMarginCalculator') ||
    !isApprovedComponentKey('GrossMarginCalculator') ||
    !isApprovedComponentKey('MarginAndMarkupCalculator') ||
    !isApprovedComponentKey('MarginAndSalesTaxCalculator') ||
    !isApprovedComponentKey('MarginAndVatCalculator') ||
    !isApprovedComponentKey('MarginCalculatorClassic') ||
    !isApprovedComponentKey('MarginCallCalculator') ||
    !isApprovedComponentKey('MarginOfSafetyCalculator') ||
    !isApprovedComponentKey('MarginWithDiscountCalculator') ||
    !isApprovedComponentKey('OperatingMarginCalculator') ||
    !isApprovedComponentKey('NetProfitMarginCalculator') ||
    !isApprovedComponentKey('ReturnOnSalesCalculator') ||
    !isApprovedComponentKey('AnnuityCalculator') ||
    !isApprovedComponentKey('AnnuityPayoutCalculator') ||
    !isApprovedComponentKey('DeferredAnnuityCalculator') ||
    !isApprovedComponentKey('DepreciationCalculator') ||
    !isApprovedComponentKey('FutureValueOfAnnuityCalculator') ||
    !isApprovedComponentKey('GrowingAnnuityCalculator') ||
    !isApprovedComponentKey('ImmediateAnnuityCalculator') ||
    !isApprovedComponentKey('LotteryAnnuityCalculator') ||
    !isApprovedComponentKey('PresentValueOfAnnuityCalculator') ||
    !isApprovedComponentKey('VariableAnnuityCalculator') ||
    !isApprovedComponentKey('OvertimeCalculator') ||
    !isApprovedComponentKey('CaliforniaOvertimeCalculator') ||
    !isApprovedComponentKey('FloridaOvertimeCalculator') ||
    !isApprovedComponentKey('GeorgiaOvertimeCalculator') ||
    !isApprovedComponentKey('IllinoisOvertimeCalculator') ||
    !isApprovedComponentKey('IncomeTaxCalculator') ||
    !isApprovedComponentKey('IncomeTaxCalculatorPakistan') ||
    !isApprovedComponentKey('IncomeTaxCalculatorPhilippines') ||
    !isApprovedComponentKey('AdjustedGrossIncomeCalculator') ||
    !isApprovedComponentKey('AlabamaTaxCalculator') ||
    !isApprovedComponentKey('CaliforniaSalesTaxCalculator') ||
    !isApprovedComponentKey('FloridaSalesTaxCalculator') ||
    !isApprovedComponentKey('NewJerseySalesTaxCalculator') ||
    !isApprovedComponentKey('OhioSalesTaxCalculator') ||
    !isApprovedComponentKey('SalesTaxCalculator') ||
    !isApprovedComponentKey('NewYorkOvertimeCalculator') ||
    !isApprovedComponentKey('OvertimePaycheckCalculator') ||
    !isApprovedComponentKey('SalaryWithOvertimeCalculator') ||
    !isApprovedComponentKey('TexasOvertimeCalculator') ||
    !isApprovedComponentKey('GrossRentMultiplierCalculator') ||
    !isApprovedComponentKey('NetEffectiveRentCalculator') ||
    !isApprovedComponentKey('RentIncreaseCalculator') ||
    !isApprovedComponentKey('RentOrBuyCalculator') ||
    isApprovedComponentKey('EvilEval')
  ) {
    throw new Error('component key allowlist');
  }
  console.log('tool.key ok');
}
