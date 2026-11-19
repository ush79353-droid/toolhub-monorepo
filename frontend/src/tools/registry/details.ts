import type { ToolPageDetail } from '@/tools/page-detail';
import { isRegisteredComponentKey, type RegisteredComponentKey } from './keys';

const details: Record<RegisteredComponentKey, () => Promise<{ toolPageDetail: ToolPageDetail }>> = {
  AfterTaxCostOfDebtCalculator: () =>
    import('@/tools/calculators/after-tax-cost-of-debt/detail'),
  AnnuityCalculator: () =>
    import('@/tools/calculators/annuity/detail'),
  AnnuityPayoutCalculator: () =>
    import('@/tools/calculators/annuity-payout/detail'),
  AutoLoanCalculator: () => import('@/tools/calculators/auto-loan/detail'),
  CaliforniaOvertimeCalculator: () =>
    import('@/tools/calculators/california-overtime/detail'),
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
  DeferredAnnuityCalculator: () =>
    import('@/tools/calculators/deferred-annuity/detail'),
  EbitdaMarginCalculator: () =>
    import('@/tools/calculators/ebitda-margin/detail'),
  FloridaOvertimeCalculator: () =>
    import('@/tools/calculators/florida-overtime/detail'),
  FutureValueOfAnnuityCalculator: () =>
    import('@/tools/calculators/future-value-of-annuity/detail'),
  GeorgiaOvertimeCalculator: () =>
    import('@/tools/calculators/georgia-overtime/detail'),
  GrossMarginCalculator: () =>
    import('@/tools/calculators/gross-margin/detail'),
  GrossRentMultiplierCalculator: () =>
    import('@/tools/calculators/gross-rent-multiplier/detail'),
  GrowingAnnuityCalculator: () =>
    import('@/tools/calculators/growing-annuity/detail'),
  IllinoisOvertimeCalculator: () =>
    import('@/tools/calculators/illinois-overtime/detail'),
  ImmediateAnnuityCalculator: () =>
    import('@/tools/calculators/immediate-annuity/detail'),
  InterestRateParityCalculator: () =>
    import('@/tools/calculators/interest-rate-parity/detail'),
  LoanCalculator: () => import('@/tools/calculators/loan/detail'),
  LoanInterestCalculator: () =>
    import('@/tools/calculators/loan-interest/detail'),
  LotteryAnnuityCalculator: () =>
    import('@/tools/calculators/lottery-annuity/detail'),
  MarginAndMarkupCalculator: () =>
    import('@/tools/calculators/margin-and-markup/detail'),
  MarginAndVatCalculator: () =>
    import('@/tools/calculators/margin-and-vat/detail'),
  MarginCalculatorClassic: () =>
    import('@/tools/calculators/margin-calculator-classic/detail'),
  MarginCallCalculator: () =>
    import('@/tools/calculators/margin-call/detail'),
  MarginOfSafetyCalculator: () =>
    import('@/tools/calculators/margin-of-safety/detail'),
  MarginWithDiscountCalculator: () =>
    import('@/tools/calculators/margin-with-discount/detail'),
  NetDebtCalculator: () =>
    import('@/tools/calculators/net-debt/detail'),
  NetEffectiveRentCalculator: () =>
    import('@/tools/calculators/net-effective-rent/detail'),
  NewYorkOvertimeCalculator: () =>
    import('@/tools/calculators/new-york-overtime/detail'),
  OperatingMarginCalculator: () =>
    import('@/tools/calculators/operating-margin/detail'),
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
  RrefCalculator: () => import('@/tools/calculators/rref/detail'),
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
  KgToGallonsConverter: () => import('@/tools/calculators/kg-to-gallons/detail'),
  ForceConverter: () => import('@/tools/calculators/force-converter/detail'),
  NmToInLbsConverter: () => import('@/tools/calculators/nm-to-in-lbs/detail'),
  InchLbsToNmConverter: () => import('@/tools/calculators/inch-lbs-to-nm/detail'),
  PaToPsiConversion: () => import('@/tools/calculators/pa-to-psi/detail'),
  PascalConversion: () => import('@/tools/calculators/pascal-conversion/detail'),
  PsiConverter: () => import('@/tools/calculators/psi-converter/detail'),
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
  YardsToMetersConversion: () => import('@/tools/calculators/yards-to-meters/detail'),
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
  CommissionCalculator: () =>
    import('@/tools/calculators/commission/detail'),
  SalesCommissionCalculator: () =>
    import('@/tools/calculators/sales-commission/detail'),
  TrueCostOfRealEstateCommissionCalculator: () =>
    import('@/tools/calculators/true-cost-real-estate-commission/detail'),
  SellThroughRateCalculator: () =>
    import('@/tools/calculators/sell-through-rate/detail'),
  SimpleInterestCalculator: () =>
    import('@/tools/calculators/simple-interest/detail'),
  TdsInterestCalculator: () =>
    import('@/tools/calculators/tds-interest/detail'),
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
  AnnualSalaryCalculator: () =>
    import('@/tools/calculators/annual-salary/detail'),
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
  ApyCalculator: () => import('@/tools/calculators/apy/detail'),
  BalloonPaymentCalculator: () =>
    import('@/tools/calculators/balloon-payment/detail'),
  BasisPointCalculator: () =>
    import('@/tools/calculators/basis-point/detail'),
  BetaStockCalculator: () =>
    import('@/tools/calculators/beta-stock/detail'),
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
  CapmCalculator: () => import('@/tools/calculators/capm/detail'),
  CanadianMortgageCalculator: () =>
    import('@/tools/calculators/canadian-mortgage/detail'),
  MortgageCalculatorUk: () =>
    import('@/tools/calculators/mortgage-uk/detail'),
  CarInterestCalculator: () =>
    import('@/tools/calculators/car-interest/detail'),
  CarLoanEmiCalculator: () =>
    import('@/tools/calculators/car-loan-emi/detail'),
  CarriedInterestCalculator: () =>
    import('@/tools/calculators/carried-interest/detail'),
  CashBackOrLowInterestCalculator: () =>
    import('@/tools/calculators/cash-back-or-low-interest/detail'),
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
  CustomerAcquisitionCostCalculator: () =>
    import('@/tools/calculators/customer-acquisition-cost/detail'),
  CustomerRetentionRateCalculator: () =>
    import('@/tools/calculators/customer-retention-rate/detail'),
  DaysOffCalculator: () =>
    import('@/tools/calculators/days-off/detail'),
  DividendDiscountModelCalculator: () =>
    import('@/tools/calculators/dividend-discount-model/detail'),
  DividendPayoutRatioCalculator: () =>
    import('@/tools/calculators/dividend-payout-ratio/detail'),
  DividendYieldCalculator: () =>
    import('@/tools/calculators/dividend-yield/detail'),
  DirectMaterialPriceVarianceCalculator: () =>
    import('@/tools/calculators/direct-material-price-variance/detail'),
  EarCalculator: () => import('@/tools/calculators/ear/detail'),
  EarlyLoanPayoffCalculator: () =>
    import('@/tools/calculators/early-loan-payoff/detail'),
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
  LoanBalanceCalculator: () =>
    import('@/tools/calculators/loan-balance/detail'),
  LoanPaymentCalculator: () =>
    import('@/tools/calculators/loan-payment/detail'),
  LoanRepaymentCalculator: () =>
    import('@/tools/calculators/loan-repayment/detail'),
  QuizLoanBalanceCalculator: () =>
    import('@/tools/calculators/quiz-loan-balance/detail'),
  QuizDividendCalculator: () =>
    import('@/tools/calculators/quiz-dividend/detail'),
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
  PartiallyAmortizedLoanCalculator: () =>
    import('@/tools/calculators/partially-amortized-loan/detail'),
  PaydayLoanCalculator: () =>
    import('@/tools/calculators/payday-loan/detail'),
  PaymentCalculator: () =>
    import('@/tools/calculators/payment/detail'),
  PaybackPeriodCalculator: () =>
    import('@/tools/calculators/payback-period/detail'),
  PercentageDiscountCalculator: () =>
    import('@/tools/calculators/percentage-discount/detail'),
  PercentageReturnCalculator: () =>
    import('@/tools/calculators/percentage-return/detail'),
  PerpetuityCalculator: () =>
    import('@/tools/calculators/perpetuity/detail'),
  PostJudgmentInterestCalculator: () =>
    import('@/tools/calculators/post-judgment-interest/detail'),
  PreAndPostMoneyValuationCalculator: () =>
    import('@/tools/calculators/pre-and-post-money-valuation/detail'),
  PresentValueCalculator: () =>
    import('@/tools/calculators/present-value/detail'),
  PriceQuantityCalculator: () =>
    import('@/tools/calculators/price-quantity/detail'),
  PrivateSavingsCalculator: () =>
    import('@/tools/calculators/private-savings/detail'),
  ProratedSalaryCalculator: () =>
    import('@/tools/calculators/prorated-salary/detail'),
  ProratedRentCalculator: () =>
    import('@/tools/calculators/prorated-rent/detail'),
  PvgoCalculator: () =>
    import('@/tools/calculators/pvgo/detail'),
  PvifaCalculator: () =>
    import('@/tools/calculators/pvifa/detail'),
  RateOfReturnCalculator: () =>
    import('@/tools/calculators/rate-of-return/detail'),
  RealEstateCommissionCalculator: () =>
    import('@/tools/calculators/real-estate-commission/detail'),
  RealRateOfReturnCalculator: () =>
    import('@/tools/calculators/real-rate-of-return/detail'),
  RealtorCommissionVatCalculator: () =>
    import('@/tools/calculators/realtor-commission-vat/detail'),
  RentalCommissionCalculator: () =>
    import('@/tools/calculators/rental-commission/detail'),
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
  BoatLoanCalculator: () =>
    import('@/tools/calculators/boat-loan/detail'),
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
  CouponPaymentCalculator: () =>
    import('@/tools/calculators/coupon-payment/detail'),
  CreditCardCalculator: () =>
    import('@/tools/calculators/credit-card/detail'),
  CreditCardInterestCalculator: () =>
    import('@/tools/calculators/credit-card-interest/detail'),
  CreditCardMinimumPaymentCalculator: () =>
    import('@/tools/calculators/credit-card-minimum-payment/detail'),
  CreditCardPaymentCalculator: () =>
    import('@/tools/calculators/credit-card-payment/detail'),
  CreditCardPayoffCalculator: () =>
    import('@/tools/calculators/credit-card-payoff/detail'),
  CreditCardsPayoffCalculator: () =>
    import('@/tools/calculators/credit-cards-payoff/detail'),
  DiscountedCashFlowCalculator: () =>
    import('@/tools/calculators/discounted-cash-flow/detail'),
  DiscountCalculator: () =>
    import('@/tools/calculators/discount/detail'),
  DiscountRateCalculator: () =>
    import('@/tools/calculators/discount-rate/detail'),
  DoubleDiscountCalculator: () =>
    import('@/tools/calculators/double-discount/detail'),
  TripleDiscountCalculator: () =>
    import('@/tools/calculators/triple-discount/detail'),
  EffectiveAnnualYieldCalculator: () =>
    import('@/tools/calculators/effective-annual-yield/detail'),
  EffectiveInterestRateCalculator: () =>
    import('@/tools/calculators/effective-interest-rate/detail'),
  ExpectedUtilityCalculator: () =>
    import('@/tools/calculators/expected-utility/detail'),
  FreeCashFlowCalculator: () =>
    import('@/tools/calculators/free-cash-flow/detail'),
  FcffCalculator: () => import('@/tools/calculators/fcff/detail'),
  LeveredFreeCashFlowCalculator: () =>
    import('@/tools/calculators/levered-free-cash-flow/detail'),
  UnleveredFreeCashFlowCalculator: () =>
    import('@/tools/calculators/unlevered-free-cash-flow/detail'),
  TrumpsTaxesVsYourTaxesCalculator: () =>
    import('@/tools/calculators/trumps-taxes-vs-your-taxes/detail'),
  VatCalculator: () => import('@/tools/calculators/vat/detail'),
  WeeklyPayCalculator: () => import('@/tools/calculators/weekly-pay/detail'),
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
  MaximumDrawdownCalculator: () =>
    import('@/tools/calculators/maximum-drawdown/detail'),
  FiftyThirtyTwentyCalculator: () =>
    import('@/tools/calculators/fifty-thirty-twenty-rule/detail'),
  ApcCalculator: () => import('@/tools/calculators/apc/detail'),
  BankReconciliationCalculator: () =>
    import('@/tools/calculators/bank-reconciliation/detail'),
  CarAffordabilityCalculator: () =>
    import('@/tools/calculators/car-affordability/detail'),
  CellPhonePlanCalculator: () =>
    import('@/tools/calculators/cell-phone-plan/detail'),
  CollegeCostCalculator: () =>
    import('@/tools/calculators/college-cost/detail'),
  DreamComeTrueCalculator: () =>
    import('@/tools/calculators/dream-come-true/detail'),
  EmergencyFundCalculator: () =>
    import('@/tools/calculators/emergency-fund/detail'),
  FinanceCalculator: () => import('@/tools/calculators/finance/detail'),
  FireCalculator: () => import('@/tools/calculators/fire/detail'),
  GoldMeltCalculator: () => import('@/tools/calculators/gold-melt/detail'),
  OperatingCashFlowCalculator: () =>
    import('@/tools/calculators/operating-cash-flow/detail'),
  FdCalculator: () => import('@/tools/calculators/fd/detail'),
  FhaLoanCalculator: () => import('@/tools/calculators/fha-loan/detail'),
  FutureValueCalculator: () =>
    import('@/tools/calculators/future-value/detail'),
  FutureSalaryCalculator: () =>
    import('@/tools/calculators/future-salary/detail'),
  HomeEquityLoanCalculator: () =>
    import('@/tools/calculators/home-equity-loan/detail'),
  HomeImprovementLoanCalculator: () =>
    import('@/tools/calculators/home-improvement-loan/detail'),
  HomeLoanEmiCalculator: () =>
    import('@/tools/calculators/home-loan-emi/detail'),
  HomeLoanCalculator: () => import('@/tools/calculators/home-loan/detail'),
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
  ImpermanentLossCalculator: () =>
    import('@/tools/calculators/impermanent-loss/detail'),
  InformationRatioCalculator: () =>
    import('@/tools/calculators/information-ratio/detail'),
  InterestCalculator: () => import('@/tools/calculators/interest/detail'),
  InterestCoverageRatioCalculator: () =>
    import('@/tools/calculators/interest-coverage-ratio/detail'),
  InterestOnlyMortgageCalculator: () =>
    import('@/tools/calculators/interest-only-mortgage/detail'),
  InterestPerDayCalculator: () =>
    import('@/tools/calculators/interest-per-day/detail'),
  MortgageInterestCalculator: () =>
    import('@/tools/calculators/mortgage-interest/detail'),
  MortgageRateCalculator: () =>
    import('@/tools/calculators/mortgage-rate/detail'),
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
