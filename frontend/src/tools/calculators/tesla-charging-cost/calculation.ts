/**
 * Tesla charging cost — kWh / km / kWh-per-km internally.
 * Full: C = B × P
 * Driving (kWh/100km): Cd = D × R × P / 100
 * Partial: C = B × (SOCt−SOCs)/100 / η × P
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  ChartInterval,
  ChartPoint,
  DistanceUnit,
  EfficiencyUnit,
  EnergyUnit,
  TeslaChargingInput,
  TeslaChargingResult,
} from './types';

export const ENERGY_TO_KWH: Record<EnergyUnit, number> = {
  Wh: 0.001,
  kWh: 1,
  MWh: 1000,
};

export const MI_TO_KM = 1.609344;

export function fmt(n: number, digits = 4): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function convertEnergyToKWh(value: number, unit: EnergyUnit): number {
  return value * ENERGY_TO_KWH[unit];
}

export function fromKWh(kWh: number, unit: EnergyUnit): number {
  return kWh / ENERGY_TO_KWH[unit];
}

export function convertDistanceToKm(value: number, unit: DistanceUnit): number {
  return unit === 'km' ? value : value * MI_TO_KM;
}

export function fromKm(km: number, unit: DistanceUnit): number {
  return unit === 'km' ? km : km / MI_TO_KM;
}

/** Normalize to kWh per km */
export function convertEfficiencyToKWhPerKm(
  value: number,
  unit: EfficiencyUnit,
): number {
  switch (unit) {
    case 'kWh/100km':
      return value / 100;
    case 'kWh/100mi':
      return value / 100 / MI_TO_KM;
    case 'Wh/km':
      return value / 1000;
    case 'Wh/mi':
      return value / 1000 / MI_TO_KM;
    case 'km/kWh':
      if (value === 0) throw new Error('km/kWh cannot be zero');
      return 1 / value;
    case 'mi/kWh':
      if (value === 0) throw new Error('mi/kWh cannot be zero');
      return 1 / (value * MI_TO_KM);
    default:
      return value / 100;
  }
}

export function fromKWhPerKm(
  kWhPerKm: number,
  unit: EfficiencyUnit,
): number {
  switch (unit) {
    case 'kWh/100km':
      return kWhPerKm * 100;
    case 'kWh/100mi':
      return kWhPerKm * 100 * MI_TO_KM;
    case 'Wh/km':
      return kWhPerKm * 1000;
    case 'Wh/mi':
      return kWhPerKm * 1000 * MI_TO_KM;
    case 'km/kWh':
      return kWhPerKm === 0 ? 0 : 1 / kWhPerKm;
    case 'mi/kWh':
      return kWhPerKm === 0 ? 0 : 1 / (kWhPerKm * MI_TO_KM);
    default:
      return kWhPerKm * 100;
  }
}

export function calculateFullChargeCost(
  batteryKWh: number,
  pricePerKWh: number,
): number {
  return batteryKWh * pricePerKWh;
}

export function calculateDrivingEnergy(
  distanceKm: number,
  kWhPerKm: number,
): number {
  return distanceKm * kWhPerKm;
}

export function calculateDrivingCost(
  distanceKm: number,
  kWhPerKm: number,
  pricePerKWh: number,
): number {
  return distanceKm * kWhPerKm * pricePerKWh;
}

/** When efficiency given as kWh/100km: Cd = D × R × P / 100 */
export function calculateDrivingCostFromKWhPer100Km(
  distanceKm: number,
  kWhPer100Km: number,
  pricePerKWh: number,
): number {
  return (distanceKm * kWhPer100Km * pricePerKWh) / 100;
}

export function calculateBatteryEnergyAdded(
  batteryKWh: number,
  startPercent: number,
  targetPercent: number,
): number {
  return batteryKWh * ((targetPercent - startPercent) / 100);
}

export function calculateGridEnergyRequired(
  batteryEnergyAddedKWh: number,
  efficiencyDecimal: number,
): number {
  return batteryEnergyAddedKWh / efficiencyDecimal;
}

export function calculatePartialChargingCost(
  batteryKWh: number,
  startPercent: number,
  targetPercent: number,
  pricePerKWh: number,
  efficiencyDecimal: number,
): number {
  const added = calculateBatteryEnergyAdded(
    batteryKWh,
    startPercent,
    targetPercent,
  );
  const grid = calculateGridEnergyRequired(added, efficiencyDecimal);
  return grid * pricePerKWh;
}

export function generateChargingCostChartData(
  batteryKWh: number,
  pricePerKWh: number,
  startPercent: number,
  interval: ChartInterval,
  efficiencyDecimal: number,
): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (let soc = startPercent; soc <= 100; soc += interval) {
    const cost =
      soc <= startPercent
        ? 0
        : calculatePartialChargingCost(
            batteryKWh,
            startPercent,
            soc,
            pricePerKWh,
            efficiencyDecimal,
          );
    points.push({ socPercent: soc, cost });
  }
  if (points.length === 0 || points[points.length - 1]?.socPercent !== 100) {
    points.push({
      socPercent: 100,
      cost: calculatePartialChargingCost(
        batteryKWh,
        startPercent,
        100,
        pricePerKWh,
        efficiencyDecimal,
      ),
    });
  }
  return points;
}

export function calculateTeslaChargingFromInput(
  input: TeslaChargingInput,
  parsed: {
    batteryKWh: number | null;
    price: number | null;
    distanceKm: number | null;
    kWhPerKm: number | null;
    startPercent: number;
    targetPercent: number;
    chargeEffDecimal: number;
  },
): TeslaChargingResult {
  const money = (n: number) => formatCurrencyValue(n, input.currency);

  let fullChargeCost: number | null = null;
  let drivingEnergyKWh: number | null = null;
  let drivingCost: number | null = null;
  let batteryEnergyAddedKWh: number | null = null;
  let gridEnergyRequiredKWh: number | null = null;
  let partialChargingCost: number | null = null;
  let costPer100Km: number | null = null;
  let costPer100Mi: number | null = null;
  let chartPoints: ChartPoint[] = [];

  const steps: string[] = [];

  if (parsed.batteryKWh != null && parsed.price != null) {
    fullChargeCost = calculateFullChargeCost(
      parsed.batteryKWh,
      parsed.price,
    );
    steps.push(
      `Full charge (ideal) = ${fmt(parsed.batteryKWh, 2)} kWh × ${fmt(parsed.price, 4)} = ${money(fullChargeCost)}`,
    );
  }

  if (
    parsed.distanceKm != null &&
    parsed.kWhPerKm != null &&
    parsed.price != null
  ) {
    drivingEnergyKWh = calculateDrivingEnergy(
      parsed.distanceKm,
      parsed.kWhPerKm,
    );
    drivingCost = calculateDrivingCost(
      parsed.distanceKm,
      parsed.kWhPerKm,
      parsed.price,
    );
    costPer100Km = parsed.kWhPerKm * 100 * parsed.price;
    costPer100Mi = costPer100Km * MI_TO_KM;
    steps.push(
      `Driving energy = ${fmt(parsed.distanceKm, 2)} km × ${fmt(parsed.kWhPerKm, 4)} kWh/km = ${fmt(drivingEnergyKWh, 2)} kWh`,
    );
    steps.push(`Driving cost = ${money(drivingCost)}`);
  }

  if (
    input.advancedMode &&
    parsed.batteryKWh != null &&
    parsed.price != null &&
    parsed.targetPercent > parsed.startPercent &&
    parsed.chargeEffDecimal > 0
  ) {
    batteryEnergyAddedKWh = calculateBatteryEnergyAdded(
      parsed.batteryKWh,
      parsed.startPercent,
      parsed.targetPercent,
    );
    gridEnergyRequiredKWh = calculateGridEnergyRequired(
      batteryEnergyAddedKWh,
      parsed.chargeEffDecimal,
    );
    partialChargingCost = gridEnergyRequiredKWh * parsed.price;
    steps.push(
      `Partial: add ${fmt(batteryEnergyAddedKWh, 2)} kWh → grid ${fmt(gridEnergyRequiredKWh, 2)} kWh (η=${fmt(parsed.chargeEffDecimal * 100, 0)}%) → ${money(partialChargingCost)}`,
    );
  }

  if (parsed.batteryKWh != null && parsed.price != null) {
    const eta = input.advancedMode ? parsed.chargeEffDecimal : 1;
    chartPoints = generateChargingCostChartData(
      parsed.batteryKWh,
      parsed.price,
      input.advancedMode ? parsed.startPercent : 0,
      input.chartInterval,
      eta,
    );
  }

  const hasAny =
    fullChargeCost != null ||
    drivingCost != null ||
    partialChargingCost != null;

  return {
    fullChargeCost,
    drivingEnergyKWh,
    drivingCost,
    batteryEnergyAddedKWh,
    gridEnergyRequiredKWh,
    partialChargingCost,
    costPer100Km,
    costPer100Mi,
    fullChargeCostDisplay:
      fullChargeCost != null ? money(fullChargeCost) : null,
    drivingEnergyDisplay:
      drivingEnergyKWh != null ? `${fmt(drivingEnergyKWh, 2)} kWh` : null,
    drivingCostDisplay: drivingCost != null ? money(drivingCost) : null,
    partialChargingCostDisplay:
      partialChargingCost != null ? money(partialChargingCost) : null,
    chartPoints,
    currency: input.currency,
    formulaSteps: steps,
    interpretation: hasAny
      ? 'Ideal full-charge cost ignores charging losses unless Advanced mode is on. Currency labels denomination only — changing currency does not convert your tariff. Presets are illustrative estimates.'
      : 'Enter battery capacity and electricity price for charging cost, plus distance and efficiency for driving cost.',
  };
}
