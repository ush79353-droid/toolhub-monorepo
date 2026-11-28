import {
  calculateTeslaChargingFromInput,
  convertDistanceToKm,
  convertEfficiencyToKWhPerKm,
  convertEnergyToKWh,
} from './calculation';
import type {
  TeslaChargingFieldErrors,
  TeslaChargingInput,
  TeslaChargingResult,
} from './types';

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface TeslaChargingValidation {
  isValid: boolean;
  errors: TeslaChargingFieldErrors;
  result: TeslaChargingResult | null;
}

export function collectFieldErrors(
  input: TeslaChargingInput,
): TeslaChargingFieldErrors {
  const errors: TeslaChargingFieldErrors = {};

  const cap = parseNumber(input.batteryCapacity);
  if (!cap.blank) {
    if (cap.invalid || cap.value == null || cap.value <= 0) {
      errors.batteryCapacity = 'Battery capacity must be greater than zero.';
    }
  }

  const price = parseNumber(input.electricityPrice);
  if (!price.blank) {
    if (price.invalid || price.value == null || price.value < 0) {
      errors.electricityPrice = 'Electricity price cannot be negative.';
    }
  }

  const dist = parseNumber(input.drivingDistance);
  if (!dist.blank) {
    if (dist.invalid || dist.value == null || dist.value < 0) {
      errors.drivingDistance = 'Distance cannot be negative.';
    }
  }

  const eff = parseNumber(input.efficiency);
  if (!eff.blank) {
    if (eff.invalid || eff.value == null || eff.value <= 0) {
      errors.efficiency = 'Efficiency must be greater than zero.';
    } else if (
      (input.efficiencyUnit === 'mi/kWh' ||
        input.efficiencyUnit === 'km/kWh') &&
      eff.value === 0
    ) {
      errors.efficiency = 'Efficiency must be greater than zero.';
    }
  }

  if (input.advancedMode) {
    const start = parseNumber(input.startBatteryPercent);
    const target = parseNumber(input.targetBatteryPercent);
    const eta = parseNumber(input.chargingEfficiencyPercent);

    if (!start.blank) {
      if (
        start.invalid ||
        start.value == null ||
        start.value < 0 ||
        start.value > 100
      ) {
        errors.startBatteryPercent = 'Start level must be between 0% and 100%.';
      }
    }
    if (!target.blank) {
      if (
        target.invalid ||
        target.value == null ||
        target.value < 0 ||
        target.value > 100
      ) {
        errors.targetBatteryPercent =
          'Target level must be between 0% and 100%.';
      }
    }
    if (
      !start.blank &&
      !target.blank &&
      start.value != null &&
      target.value != null &&
      !errors.startBatteryPercent &&
      !errors.targetBatteryPercent &&
      target.value <= start.value
    ) {
      errors.targetBatteryPercent =
        'Target battery level must exceed starting level.';
    }
    if (!eta.blank) {
      if (
        eta.invalid ||
        eta.value == null ||
        eta.value <= 0 ||
        eta.value > 100
      ) {
        errors.chargingEfficiencyPercent =
          'Charging efficiency must be greater than 0% and at most 100%.';
      }
    }
  }

  return errors;
}

export function validateTeslaChargingInputs(
  input: TeslaChargingInput,
): TeslaChargingValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const cap = parseNumber(input.batteryCapacity);
  const price = parseNumber(input.electricityPrice);
  const dist = parseNumber(input.drivingDistance);
  const eff = parseNumber(input.efficiency);
  const start = parseNumber(input.startBatteryPercent);
  const target = parseNumber(input.targetBatteryPercent);
  const eta = parseNumber(input.chargingEfficiencyPercent);

  let kWhPerKm: number | null = null;
  if (!eff.blank && eff.value != null && eff.value > 0) {
    try {
      kWhPerKm = convertEfficiencyToKWhPerKm(eff.value, input.efficiencyUnit);
    } catch {
      errors.efficiency = 'Invalid efficiency value.';
      return { isValid: false, errors, result: null };
    }
  }

  const parsed = {
    batteryKWh:
      !cap.blank && cap.value != null && cap.value > 0
        ? convertEnergyToKWh(cap.value, input.batteryCapacityUnit)
        : null,
    price:
      !price.blank && price.value != null && price.value >= 0
        ? price.value
        : null,
    distanceKm:
      !dist.blank && dist.value != null && dist.value >= 0
        ? convertDistanceToKm(dist.value, input.distanceUnit)
        : null,
    kWhPerKm,
    startPercent:
      !start.blank && start.value != null ? start.value : 20,
    targetPercent:
      !target.blank && target.value != null ? target.value : 80,
    chargeEffDecimal:
      !eta.blank && eta.value != null && eta.value > 0
        ? eta.value / 100
        : 0.9,
  };

  const anyInput =
    parsed.batteryKWh != null ||
    parsed.price != null ||
    parsed.distanceKm != null ||
    parsed.kWhPerKm != null;

  if (!anyInput) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateTeslaChargingFromInput(input, parsed);
  const useful =
    result.fullChargeCost != null ||
    result.drivingCost != null ||
    result.partialChargingCost != null ||
    result.chartPoints.length > 0;

  return {
    isValid: useful,
    errors,
    result: useful ? result : null,
  };
}
