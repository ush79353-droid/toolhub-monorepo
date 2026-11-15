import { isSupportedCurrency } from '@/tools/shared/currency';
import type {
  ThreeDPrinterFieldErrors,
  ThreeDPrinterInput,
  ThreeDPrinterValidationResult,
} from './types';

const MAX_PARTS_PER_MONTH = 1_000_000;
const MAX_MONTHS = 600;
const MAX_GRAMS = 100_000;
const MAX_HOURS = 1_000;
const MAX_MONEY = 1_000_000_000_000;
const MAX_WATTS = 100_000;
const MAX_ORDERS = 100_000;

function finiteInRange(
  value: number,
  min: number,
  max: number,
  label: string,
  errors: ThreeDPrinterFieldErrors,
  key: keyof ThreeDPrinterInput
): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    errors[key] = `Enter a valid ${label}.`;
    return;
  }
  if (value < min || value > max) {
    errors[key] = `${label} must be between ${min} and ${max}.`;
  }
}

export function validateThreeDPrinterInput(input: ThreeDPrinterInput): ThreeDPrinterValidationResult {
  const errors: ThreeDPrinterFieldErrors = {};

  finiteInRange(input.partsPerMonth, 0, MAX_PARTS_PER_MONTH, 'Parts per month', errors, 'partsPerMonth');
  finiteInRange(input.months, 0, MAX_MONTHS, 'Months', errors, 'months');
  finiteInRange(input.materialGramsPerPart, 0, MAX_GRAMS, 'Material per part', errors, 'materialGramsPerPart');
  finiteInRange(input.printHoursPerPart, 0, MAX_HOURS, 'Print time per part', errors, 'printHoursPerPart');

  if (typeof input.failureRatePercent !== 'number' || !Number.isFinite(input.failureRatePercent)) {
    errors.failureRatePercent = 'Enter a valid failure rate.';
  } else if (input.failureRatePercent < 0 || input.failureRatePercent >= 100) {
    errors.failureRatePercent = 'Failure rate must be from 0 up to, but not including, 100%.';
  }

  if (typeof input.currency !== 'string' || !isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  finiteInRange(input.printerPrice, 0, MAX_MONEY, 'Printer price', errors, 'printerPrice');
  finiteInRange(input.setupCosts, 0, MAX_MONEY, 'Setup cost', errors, 'setupCosts');
  finiteInRange(input.materialPricePerKg, 0, MAX_MONEY, 'Material price', errors, 'materialPricePerKg');
  finiteInRange(input.printerPowerWatts, 0, MAX_WATTS, 'Printer power', errors, 'printerPowerWatts');
  finiteInRange(
    input.electricityPricePerKWh,
    0,
    MAX_MONEY,
    'Electricity price',
    errors,
    'electricityPricePerKWh'
  );
  finiteInRange(input.maintenancePerMonth, 0, MAX_MONEY, 'Maintenance', errors, 'maintenancePerMonth');
  finiteInRange(input.laborHourlyRate, 0, MAX_MONEY, 'Labor rate', errors, 'laborHourlyRate');
  finiteInRange(input.laborHoursPerPrint, 0, MAX_HOURS, 'Labor time', errors, 'laborHoursPerPrint');
  finiteInRange(input.resaleValue, 0, MAX_MONEY, 'Resale value', errors, 'resaleValue');
  finiteInRange(input.pricePerPart, 0, MAX_MONEY, 'Outsource price', errors, 'pricePerPart');
  finiteInRange(input.finishingCostPerPart, 0, MAX_MONEY, 'Finishing cost', errors, 'finishingCostPerPart');
  finiteInRange(input.shippingPerOrder, 0, MAX_MONEY, 'Shipping', errors, 'shippingPerOrder');
  finiteInRange(input.ordersPerMonth, 0, MAX_ORDERS, 'Orders per month', errors, 'ordersPerMonth');
  finiteInRange(input.oneTimeServiceFee, 0, MAX_MONEY, 'Service fee', errors, 'oneTimeServiceFee');

  return { isValid: Object.keys(errors).length === 0, errors };
}
