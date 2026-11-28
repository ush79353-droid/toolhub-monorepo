/**
 * GVWR Calculator — educational vehicle weight / rating check.
 * GVW = Tare + Payload (estimated loaded weight).
 * Manufacturer GVWR is a separate user-supplied rating — never invent it from tare+payload.
 */

export type WeightUnit = 'kg' | 'lb' | 't' | 'usTon';

export type GvwrMode = 'grossWeight' | 'capacityCheck' | 'maximumPayload';

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: 'kg',
  lb: 'lb',
  t: 't',
  usTon: 'US ton',
};

export const MODE_LABELS: Record<GvwrMode, string> = {
  grossWeight: 'Gross weight',
  capacityCheck: 'GVWR capacity check',
  maximumPayload: 'Maximum payload',
};

export interface GvwrInput {
  mode: GvwrMode;
  tareWeight: string;
  tareUnit: WeightUnit;
  payloadWeight: string;
  payloadUnit: WeightUnit;
  /** Display unit for calculated GVW */
  gvwUnit: WeightUnit;
  manufacturerGvwr: string;
  manufacturerGvwrUnit: WeightUnit;
  /** Optional override; blank uses calculated GVW in capacity check */
  actualGrossWeight: string;
  actualGrossUnit: WeightUnit;
  unloadedWeight: string;
  unloadedUnit: WeightUnit;
}

export type LoadingStatus = 'within' | 'atLimit' | 'over' | null;

export interface GvwrResult {
  mode: GvwrMode;
  grossVehicleWeightKg: number | null;
  manufacturerGvwrKg: number | null;
  remainingCapacityKg: number | null;
  maximumPayloadKg: number | null;
  utilizationPercent: number | null;
  overloadedWeightKg: number | null;
  isOverloaded: boolean | null;
  loadingStatus: LoadingStatus;
  formattedGvw: string | null;
  formattedRemaining: string | null;
  formattedMaxPayload: string | null;
  formattedOverload: string | null;
  formulaSteps: string[];
  interpretation: string;
}

export type GvwrFieldErrors = {
  tareWeight?: string;
  payloadWeight?: string;
  manufacturerGvwr?: string;
  actualGrossWeight?: string;
  unloadedWeight?: string;
  form?: string;
};

/** Spec fixture: 1,000 kg + 500 kg → 1,500 kg GVW */
export function createEmptyInput(): GvwrInput {
  return {
    mode: 'grossWeight',
    tareWeight: '1000',
    tareUnit: 'kg',
    payloadWeight: '500',
    payloadUnit: 'kg',
    gvwUnit: 'kg',
    manufacturerGvwr: '2000',
    manufacturerGvwrUnit: 'kg',
    actualGrossWeight: '',
    actualGrossUnit: 'kg',
    unloadedWeight: '2300',
    unloadedUnit: 'kg',
  };
}

export function createCapacityExample(): GvwrInput {
  return {
    ...createEmptyInput(),
    mode: 'capacityCheck',
    tareWeight: '1600',
    payloadWeight: '500',
    manufacturerGvwr: '2500',
  };
}
