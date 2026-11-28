/**
 * GVWR / GVW — canonical mass: kilograms.
 */

import type {
  GvwrInput,
  GvwrResult,
  LoadingStatus,
  WeightUnit,
} from './types';
import { WEIGHT_UNIT_LABELS } from './types';

/** Exact: 1 lb = 0.45359237 kg */
export const KG_PER_LB = 0.45359237;
export const LB_PER_KG = 1 / KG_PER_LB;
export const KG_PER_METRIC_TONNE = 1000;
export const LB_PER_US_TON = 2000;
export const KG_PER_US_TON = LB_PER_US_TON * KG_PER_LB;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function toKg(value: number, unit: WeightUnit): number {
  if (unit === 'kg') return value;
  if (unit === 'lb') return value * KG_PER_LB;
  if (unit === 't') return value * KG_PER_METRIC_TONNE;
  return value * KG_PER_US_TON;
}

export function fromKg(kg: number, unit: WeightUnit): number {
  if (unit === 'kg') return kg;
  if (unit === 'lb') return kg * LB_PER_KG;
  if (unit === 't') return kg / KG_PER_METRIC_TONNE;
  return kg / KG_PER_US_TON;
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): number {
  if (from === to) return value;
  return fromKg(toKg(value, from), to);
}

export function calculateGrossVehicleWeight(
  tareKg: number,
  payloadKg: number,
): number | null {
  if (!(tareKg >= 0) || !(payloadKg >= 0)) return null;
  return tareKg + payloadKg;
}

export function calculateRemainingCapacity(
  gvwrKg: number,
  gvwKg: number,
): number | null {
  if (!(gvwrKg > 0) || !(gvwKg >= 0)) return null;
  return gvwrKg - gvwKg;
}

export function calculateGvwrUtilization(
  gvwKg: number,
  gvwrKg: number,
): number | null {
  if (!(gvwrKg > 0) || !(gvwKg >= 0)) return null;
  return (gvwKg / gvwrKg) * 100;
}

export function calculateOverloadedWeight(
  gvwKg: number,
  gvwrKg: number,
): number | null {
  if (!(gvwrKg > 0) || !(gvwKg >= 0)) return null;
  return Math.max(0, gvwKg - gvwrKg);
}

export function calculateMaximumPayload(
  gvwrKg: number,
  unloadedKg: number,
): number | null {
  if (!(gvwrKg > 0) || !(unloadedKg >= 0)) return null;
  return gvwrKg - unloadedKg;
}

export function resolveLoadingStatus(
  remainingKg: number | null,
): LoadingStatus {
  if (remainingKg == null) return null;
  if (remainingKg > 0) return 'within';
  if (remainingKg === 0) return 'atLimit';
  return 'over';
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function formatMass(kg: number, unit: WeightUnit): string {
  return `${fmt(fromKg(kg, unit))} ${WEIGHT_UNIT_LABELS[unit]}`;
}

export function calculateGvwrFromInput(input: GvwrInput): GvwrResult | null {
  const steps: string[] = [];

  if (input.mode === 'grossWeight' || input.mode === 'capacityCheck') {
    const tareRaw = parseNum(input.tareWeight);
    const payRaw = parseNum(input.payloadWeight);
    if (tareRaw == null || tareRaw < 0) return null;
    if (payRaw == null || payRaw < 0) return null;

    const tareKg = toKg(tareRaw, input.tareUnit);
    const payloadKg = toKg(payRaw, input.payloadUnit);
    const gvwKg = calculateGrossVehicleWeight(tareKg, payloadKg);
    if (gvwKg == null) return null;

    steps.push(
      `Tare = ${formatMass(tareKg, input.tareUnit)} = ${fmt(tareKg)} kg`,
    );
    steps.push(
      `Payload = ${formatMass(payloadKg, input.payloadUnit)} = ${fmt(payloadKg)} kg`,
    );
    steps.push(
      `GVW = tare + payload = ${fmt(tareKg)} + ${fmt(payloadKg)} = ${fmt(gvwKg)} kg`,
    );

    if (input.mode === 'grossWeight') {
      return {
        mode: input.mode,
        grossVehicleWeightKg: gvwKg,
        manufacturerGvwrKg: null,
        remainingCapacityKg: null,
        maximumPayloadKg: null,
        utilizationPercent: null,
        overloadedWeightKg: null,
        isOverloaded: null,
        loadingStatus: null,
        formattedGvw: formatMass(gvwKg, input.gvwUnit),
        formattedRemaining: null,
        formattedMaxPayload: null,
        formattedOverload: null,
        formulaSteps: steps,
        interpretation:
          'Gross vehicle weight (GVW) is the estimated weight of your loaded vehicle. GVWR is the manufacturer’s maximum permitted loaded weight — enter it separately in capacity check. Axle, tire, and towing limits may still apply.',
      };
    }

    // capacityCheck
    const gvwrRaw = parseNum(input.manufacturerGvwr);
    if (gvwrRaw == null || !(gvwrRaw > 0)) return null;
    const gvwrKg = toKg(gvwrRaw, input.manufacturerGvwrUnit);

    let compareKg = gvwKg;
    const actualRaw = parseNum(input.actualGrossWeight);
    if (actualRaw != null) {
      if (actualRaw < 0) return null;
      compareKg = toKg(actualRaw, input.actualGrossUnit);
      steps.push(
        `Using entered actual/estimated gross = ${fmt(compareKg)} kg`,
      );
    }

    const remaining = calculateRemainingCapacity(gvwrKg, compareKg);
    const util = calculateGvwrUtilization(compareKg, gvwrKg);
    const overload = calculateOverloadedWeight(compareKg, gvwrKg);
    if (remaining == null || util == null || overload == null) return null;
    const status = resolveLoadingStatus(remaining);
    const isOverloaded = overload > 0;

    steps.push(`Manufacturer GVWR = ${fmt(gvwrKg)} kg`);
    steps.push(
      `Remaining capacity = ${fmt(gvwrKg)} − ${fmt(compareKg)} = ${fmt(remaining)} kg`,
    );
    steps.push(
      `Utilization = ${fmt(compareKg)} / ${fmt(gvwrKg)} × 100 = ${fmt(util)}%`,
    );
    if (isOverloaded) {
      steps.push(`Overload = ${fmt(overload)} kg`);
    }

    return {
      mode: input.mode,
      grossVehicleWeightKg: compareKg,
      manufacturerGvwrKg: gvwrKg,
      remainingCapacityKg: remaining,
      maximumPayloadKg: null,
      utilizationPercent: util,
      overloadedWeightKg: overload,
      isOverloaded,
      loadingStatus: status,
      formattedGvw: formatMass(compareKg, input.gvwUnit),
      formattedRemaining: formatMass(remaining, input.gvwUnit),
      formattedMaxPayload: null,
      formattedOverload: isOverloaded
        ? formatMass(overload, input.gvwUnit)
        : null,
      formulaSteps: steps,
      interpretation: isOverloaded
        ? 'The estimated gross vehicle weight exceeds the manufacturer-specified GVWR. Reduce the load and verify all applicable axle, tire, and towing limits before operating the vehicle.'
        : 'Within or at the entered GVWR for this comparison only. Remaining capacity does not guarantee compliance with axle, tire, or other ratings.',
    };
  }

  // maximumPayload
  const gvwrRaw = parseNum(input.manufacturerGvwr);
  const unloadRaw = parseNum(input.unloadedWeight);
  if (gvwrRaw == null || !(gvwrRaw > 0)) return null;
  if (unloadRaw == null || unloadRaw < 0) return null;

  const gvwrKg = toKg(gvwrRaw, input.manufacturerGvwrUnit);
  const unloadedKg = toKg(unloadRaw, input.unloadedUnit);
  const maxPay = calculateMaximumPayload(gvwrKg, unloadedKg);
  if (maxPay == null) return null;

  steps.push(`Manufacturer GVWR = ${fmt(gvwrKg)} kg`);
  steps.push(`Unloaded weight = ${fmt(unloadedKg)} kg`);
  steps.push(
    `Maximum payload ≈ ${fmt(gvwrKg)} − ${fmt(unloadedKg)} = ${fmt(maxPay)} kg`,
  );

  return {
    mode: input.mode,
    grossVehicleWeightKg: null,
    manufacturerGvwrKg: gvwrKg,
    remainingCapacityKg: null,
    maximumPayloadKg: maxPay,
    utilizationPercent: null,
    overloadedWeightKg: null,
    isOverloaded: null,
    loadingStatus: null,
    formattedGvw: null,
    formattedRemaining: null,
    formattedMaxPayload: formatMass(maxPay, input.gvwUnit),
    formattedOverload: null,
    formulaSteps: steps,
    interpretation:
      'Estimated maximum payload from GVWR − unloaded weight. Actual available payload may differ due to fuel, passengers, accessories, and the manufacturer’s published payload rating.',
  };
}
