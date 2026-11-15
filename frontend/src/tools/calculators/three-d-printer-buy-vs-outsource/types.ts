import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ThreeDPrinterInput {
  partsPerMonth: number;
  months: number;
  materialGramsPerPart: number;
  printHoursPerPart: number;
  /** 0 inclusive, 100 exclusive. Each failed attempt uses the same material, time, and labor as a success. */
  failureRatePercent: number;
  currency: SupportedCurrency;
  printerPrice: number;
  setupCosts: number;
  materialPricePerKg: number;
  printerPowerWatts: number;
  electricityPricePerKWh: number;
  maintenancePerMonth: number;
  laborHourlyRate: number;
  laborHoursPerPrint: number;
  resaleValue: number;
  pricePerPart: number;
  finishingCostPerPart: number;
  shippingPerOrder: number;
  ordersPerMonth: number;
  oneTimeServiceFee: number;
}

export type ThreeDPrinterFieldKey = keyof ThreeDPrinterInput | 'form';
export type ThreeDPrinterFieldErrors = Partial<Record<ThreeDPrinterFieldKey, string>>;

export interface ThreeDPrinterValidationResult {
  isValid: boolean;
  errors: ThreeDPrinterFieldErrors;
}

export type PrinterRecommendation = 'buy' | 'outsource' | 'tie';

export interface PrinterCostPoint {
  month: number;
  inHouseCost: number;
  outsourcingCost: number;
}

export interface ThreeDPrinterResult {
  currency: SupportedCurrency;
  totalParts: number;
  failureRate: number;
  expectedAttempts: number;
  materialCostPerAttempt: number;
  electricityCostPerAttempt: number;
  laborCostPerAttempt: number;
  variableCostPerAttempt: number;
  materialCost: number;
  electricityCost: number;
  laborCost: number;
  expectedVariableCost: number;
  maintenanceCost: number;
  fixedOwnershipCost: number;
  totalInHouseCost: number;
  outsourcingPartsCost: number;
  shippingCost: number;
  oneTimeServiceFee: number;
  totalOutsourcingCost: number;
  netSavings: number;
  /** Null when no successful parts are requested, so the UI does not show a divide-by-zero. */
  inHouseCostPerPart: number | null;
  outsourceCostPerPart: number | null;
  inHouseVariablePerPart: number;
  outsourceVariablePerPart: number;
  /**
   * Null when outsourcing is not more expensive per successful part, when the
   * monthly margin never pays back ownership, or when no parts are printed.
   * Shipping stays tied to orders per month, not to the part count.
   */
  breakEvenMonths: number | null;
  breakEvenParts: number | null;
  recommendation: PrinterRecommendation;
  resaleExceedsInvestment: boolean;
  /** True when maintenance or per-order shipping means the part count is not independent of the timeline. */
  breakEvenDependsOnTimeline: boolean;
  points: readonly PrinterCostPoint[];
}

export const DEFAULT_THREE_D_PRINTER_INPUT: ThreeDPrinterInput = {
  partsPerMonth: 10,
  months: 12,
  materialGramsPerPart: 40,
  printHoursPerPart: 3,
  failureRatePercent: 10,
  currency: 'PKR',
  printerPrice: 50000,
  setupCosts: 0,
  materialPricePerKg: 2500,
  printerPowerWatts: 200,
  electricityPricePerKWh: 30,
  maintenancePerMonth: 500,
  laborHourlyRate: 0,
  laborHoursPerPrint: 0,
  resaleValue: 20000,
  pricePerPart: 800,
  finishingCostPerPart: 0,
  shippingPerOrder: 0,
  ordersPerMonth: 1,
  oneTimeServiceFee: 0,
};
