import type { PrinterCostPoint, ThreeDPrinterInput, ThreeDPrinterResult } from './types';
import { validateThreeDPrinterInput } from './validation';

/** Cents. Inputs that are already on a cent boundary are unchanged. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

function roundQuantity(value: number): number {
  return Math.round(value * 100) / 100;
}

function timelineMonths(span: number): number[] {
  if (!(span > 0) || !Number.isFinite(span)) return [];
  if (span <= 24) {
    const points: number[] = [];
    for (let month = 1; month < span; month += 1) points.push(month);
    points.push(span);
    return points;
  }
  const steps = 24;
  const points: number[] = [];
  for (let step = 1; step <= steps; step += 1) {
    points.push(roundQuantity((span * step) / steps));
  }
  const last = points[points.length - 1];
  if (last !== undefined && Math.abs(last - span) > 1e-9) points.push(span);
  return points;
}

export function calculateThreeDPrinter(input: ThreeDPrinterInput): ThreeDPrinterResult | null {
  if (!validateThreeDPrinterInput(input).isValid) return null;

  const failureRate = input.failureRatePercent / 100;
  const successShare = 1 - failureRate;
  const totalParts = input.partsPerMonth * input.months;
  const expectedAttempts = totalParts / successShare;

  const materialCostPerAttempt = roundMoney((input.materialGramsPerPart / 1000) * input.materialPricePerKg);
  const electricityCostPerAttempt = roundMoney(
    (input.printerPowerWatts / 1000) * input.printHoursPerPart * input.electricityPricePerKWh
  );
  const laborCostPerAttempt = roundMoney(input.laborHoursPerPrint * input.laborHourlyRate);
  const variableCostPerAttempt = roundMoney(
    materialCostPerAttempt + electricityCostPerAttempt + laborCostPerAttempt
  );

  const materialCost = roundMoney(expectedAttempts * materialCostPerAttempt);
  const electricityCost = roundMoney(expectedAttempts * electricityCostPerAttempt);
  const laborCost = roundMoney(expectedAttempts * laborCostPerAttempt);
  const expectedVariableCost = roundMoney(materialCost + electricityCost + laborCost);

  const printerPrice = roundMoney(input.printerPrice);
  const setupCosts = roundMoney(input.setupCosts);
  const resaleValue = roundMoney(input.resaleValue);
  const maintenanceCost = roundMoney(input.maintenancePerMonth * input.months);
  const fixedOwnershipCost = roundMoney(printerPrice + setupCosts + maintenanceCost - resaleValue);
  const totalInHouseCost = roundMoney(fixedOwnershipCost + expectedVariableCost);

  const pricePerPart = roundMoney(input.pricePerPart);
  const finishingCostPerPart = roundMoney(input.finishingCostPerPart);
  const outsourcingPartsCost = roundMoney(totalParts * (pricePerPart + finishingCostPerPart));
  const shippingCost = roundMoney(input.shippingPerOrder * input.ordersPerMonth * input.months);
  const oneTimeServiceFee = roundMoney(input.oneTimeServiceFee);
  const totalOutsourcingCost = roundMoney(outsourcingPartsCost + shippingCost + oneTimeServiceFee);

  const netSavings = roundMoney(totalOutsourcingCost - totalInHouseCost);
  const inHouseCostPerPart = totalParts > 0 ? roundMoney(totalInHouseCost / totalParts) : null;
  const outsourceCostPerPart = totalParts > 0 ? roundMoney(totalOutsourcingCost / totalParts) : null;

  const inHouseVariablePerPart = variableCostPerAttempt / successShare;
  const outsourceVariablePerPart = pricePerPart + finishingCostPerPart;

  const ownershipFixed = printerPrice + setupCosts - resaleValue;
  const serviceFixed = oneTimeServiceFee;
  const monthlyInHouse = input.maintenancePerMonth + input.partsPerMonth * inHouseVariablePerPart;
  const monthlyOutsource =
    input.shippingPerOrder * input.ordersPerMonth + input.partsPerMonth * outsourceVariablePerPart;
  const monthlyMargin = monthlyOutsource - monthlyInHouse;
  const netFixed = ownershipFixed - serviceFixed;

  const variableGapFavorsBuying = outsourceVariablePerPart > inHouseVariablePerPart;
  const rawBreakEvenMonths =
    variableGapFavorsBuying && input.partsPerMonth > 0 && monthlyMargin > 0 && netFixed > 0
      ? netFixed / monthlyMargin
      : null;
  const breakEvenMonths = rawBreakEvenMonths === null ? null : roundQuantity(rawBreakEvenMonths);
  const breakEvenParts =
    rawBreakEvenMonths === null ? null : roundQuantity(rawBreakEvenMonths * input.partsPerMonth);

  const recommendation =
    netSavings > 0 ? 'buy' : netSavings < 0 ? 'outsource' : 'tie';

  const points: PrinterCostPoint[] = timelineMonths(input.months).map((month) => {
    const parts = input.partsPerMonth * month;
    const attempts = parts / successShare;
    const variable = attempts * variableCostPerAttempt;
    const atEnd = Math.abs(month - input.months) < 1e-9;
    const inHouse =
      printerPrice + setupCosts + input.maintenancePerMonth * month + variable - (atEnd ? resaleValue : 0);
    const outsource =
      parts * outsourceVariablePerPart + input.shippingPerOrder * input.ordersPerMonth * month + oneTimeServiceFee;
    return {
      month: roundQuantity(month),
      inHouseCost: roundMoney(inHouse),
      outsourcingCost: roundMoney(outsource),
    };
  });

  return {
    currency: input.currency,
    totalParts,
    failureRate,
    expectedAttempts,
    materialCostPerAttempt,
    electricityCostPerAttempt,
    laborCostPerAttempt,
    variableCostPerAttempt,
    materialCost,
    electricityCost,
    laborCost,
    expectedVariableCost,
    maintenanceCost,
    fixedOwnershipCost,
    totalInHouseCost,
    outsourcingPartsCost,
    shippingCost,
    oneTimeServiceFee,
    totalOutsourcingCost,
    netSavings,
    inHouseCostPerPart,
    outsourceCostPerPart,
    inHouseVariablePerPart,
    outsourceVariablePerPart,
    breakEvenMonths,
    breakEvenParts,
    recommendation,
    resaleExceedsInvestment: resaleValue > printerPrice + setupCosts,
    breakEvenDependsOnTimeline: input.maintenancePerMonth > 0 || input.shippingPerOrder > 0,
    points,
  };
}
