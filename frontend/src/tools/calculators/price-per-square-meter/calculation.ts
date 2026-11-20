/**
 * Re-exports shared price-per-area math for the square-meter calculator.
 * Defaults (m²) live in this module's types; math is shared with PPSF.
 */
export {
  SQ_FT_PER_M2,
  M2_PER_SQ_FT,
  areaUnitLabel,
  convertArea,
  convertPricePerArea,
  convertRentalPeriodDisplay,
  calculatePricePerArea,
  calculateTotalPrice,
  calculateAreaFromPrice,
  calculateAbsolutePriceDifference,
  calculatePercentagePriceDifference,
  formatPricePerAreaMoney as formatMoney,
  formatPricePerAreaValue as formatArea,
  formatPricePerAreaRate as formatRate,
  pricePerAreaUnitLabel,
} from '@/tools/shared/price-per-area';
