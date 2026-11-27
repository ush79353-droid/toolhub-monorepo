/**
 * IV drip rate worksheet (educational, ADR-018).
 *
 * Canonical teaching relations (prompt + Omni worked example):
 *   concentration_mg/L = drug_mg × 1000 / bag_mL
 *   drip_mL/h = dose_mg/kg/min × weight_kg × 60 × 1000 / concentration_mg/L
 *             = dose_mg/kg/min × weight_kg × 60 × bag_mL / drug_mg
 *   flow_gtts/min = drip_mL/h × drop_factor_gtts/mL / 60
 *   bag_duration_h = bag_mL / drip_mL/h
 *
 * Fixture: 0.02 mg/kg/min · 85 kg · 10 mg in 40 mL · drop factor 10
 *   → drip 408 mL/h · flow 68 gtts/min · duration ≈ 0.098 h
 *
 * Omni’s published algebraic string for drip rate is arithmetically wrong;
 * the worked example numbers match the relations above.
 *
 * Precedence: direct concentration wins when `source === 'concentration'`;
 * otherwise bag + drug define concentration when both are present.
 */

import type {
  ConcentrationUnit,
  DoseMassUnit,
  DoseTimeUnit,
  DropFactorVolumeUnit,
  DrugMassUnit,
  DripRateInput,
  DripRateResult,
  DripRateSource,
  DripVolumeUnit,
  DurationUnit,
  FlowTimeUnit,
  VolumeUnit,
  WeightUnit,
} from './types';

export const LB_PER_KG = 2.2046226218;

export const SOURCE_NOTE =
  'Educational IV drip worksheet: drip (mL/h) = dose (mg/kg/min) × weight (kg) × 60 × 1000 / concentration (mg/L); flow (gtts/min) = drip × drop factor / 60; bag time (h) = bag volume (mL) / drip. Concentration from bag = drug (mg) × 1000 / volume (mL).';

export const DISCLAIMER =
  'Educational only — not a prescription, pump program, or clinical order. Confirm dose, concentration, tubing drop factor, and infusion device settings with a licensed clinician and the product label.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'kg' ? kg : kg * LB_PER_KG;
}

/** Normalize desired dose to mg/kg/min. */
export function doseToMgPerKgPerMin(
  value: number,
  massUnit: DoseMassUnit,
  weightUnit: WeightUnit,
  timeUnit: DoseTimeUnit,
): number {
  let mgPerMassPerMin = massUnit === 'mg' ? value : value / 1000;
  // Dose is already “per kg” or “per lb” of body mass in the UI.
  if (weightUnit === 'lb') {
    // 1 mg/lb/min = 1 mg / (1/LB_PER_KG kg) / min = LB_PER_KG mg/kg/min
    mgPerMassPerMin *= LB_PER_KG;
  }
  if (timeUnit === 'h') {
    mgPerMassPerMin /= 60;
  }
  return mgPerMassPerMin;
}

export function mgPerKgPerMinToDose(
  mgPerKgPerMin: number,
  massUnit: DoseMassUnit,
  weightUnit: WeightUnit,
  timeUnit: DoseTimeUnit,
): number {
  let v = mgPerKgPerMin;
  if (timeUnit === 'h') v *= 60;
  if (weightUnit === 'lb') v /= LB_PER_KG;
  if (massUnit === 'mcg') v *= 1000;
  return v;
}

export function concentrationToMgPerL(
  value: number,
  unit: ConcentrationUnit,
): number {
  switch (unit) {
    case 'mg/L':
      return value;
    case 'mg/mL':
      return value * 1000;
    case 'mcg/mL':
      return value; // 1 mcg/mL = 1 mg/L
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function mgPerLToConcentration(
  mgPerL: number,
  unit: ConcentrationUnit,
): number {
  switch (unit) {
    case 'mg/L':
      return mgPerL;
    case 'mg/mL':
      return mgPerL / 1000;
    case 'mcg/mL':
      return mgPerL;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function volumeToMl(value: number, unit: VolumeUnit): number {
  return unit === 'mL' ? value : value * 1000;
}

export function mlToVolume(ml: number, unit: VolumeUnit): number {
  return unit === 'mL' ? ml : ml / 1000;
}

export function drugToMg(value: number, unit: DrugMassUnit): number {
  switch (unit) {
    case 'mg':
      return value;
    case 'mcg':
      return value / 1000;
    case 'g':
      return value * 1000;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function mgToDrug(mg: number, unit: DrugMassUnit): number {
  switch (unit) {
    case 'mg':
      return mg;
    case 'mcg':
      return mg * 1000;
    case 'g':
      return mg / 1000;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function dripToMlPerH(value: number, unit: DripVolumeUnit): number {
  return unit === 'mL' ? value : value * 1000;
}

export function mlPerHToDrip(mlPerH: number, unit: DripVolumeUnit): number {
  return unit === 'mL' ? mlPerH : mlPerH / 1000;
}

export function dropFactorToGttsPerMl(
  value: number,
  unit: DropFactorVolumeUnit,
): number {
  return unit === 'mL' ? value : value / 1000;
}

export function gttsPerMlToDropFactor(
  gttsPerMl: number,
  unit: DropFactorVolumeUnit,
): number {
  return unit === 'mL' ? gttsPerMl : gttsPerMl * 1000;
}

export function flowToGttsPerMin(value: number, unit: FlowTimeUnit): number {
  return unit === 'min' ? value : value / 60;
}

export function gttsPerMinToFlow(
  gttsPerMin: number,
  unit: FlowTimeUnit,
): number {
  return unit === 'min' ? gttsPerMin : gttsPerMin * 60;
}

export function durationToH(value: number, unit: DurationUnit): number {
  return unit === 'hrs' ? value : value / 60;
}

export function hToDuration(h: number, unit: DurationUnit): number {
  return unit === 'hrs' ? h : h * 60;
}

export function concentrationFromBag(drugMg: number, bagMl: number): number {
  return (drugMg * 1000) / bagMl;
}

export function dripRateMlPerH(
  doseMgPerKgPerMin: number,
  weightKg: number,
  concentrationMgPerL: number,
): number {
  return (doseMgPerKgPerMin * weightKg * 60 * 1000) / concentrationMgPerL;
}

export function flowRateGttsPerMin(
  dripMlPerH: number,
  dropFactorGttsPerMl: number,
): number {
  return (dripMlPerH * dropFactorGttsPerMl) / 60;
}

export function bagDurationHours(bagMl: number, dripMlPerH: number): number {
  return bagMl / dripMlPerH;
}

export function formatDisplay(n: number, digits = 6): string {
  if (!Number.isFinite(n)) return '';
  const rounded = Number(n.toPrecision(digits));
  if (Object.is(rounded, -0)) return '0';
  return String(rounded);
}

function emptyResult(partial?: Partial<DripRateResult>): DripRateResult {
  return {
    doseMgPerKgPerMin: null,
    weightKg: null,
    concentrationMgPerL: null,
    bagVolumeMl: null,
    drugInBagMg: null,
    dripRateMlPerH: null,
    dropFactorGttsPerMl: null,
    flowRateGttsPerMin: null,
    bagDurationH: null,
    formattedConcentration: '',
    formattedDrugInBag: '',
    formattedBagVolume: '',
    formattedDripRate: '',
    formattedFlowRate: '',
    formattedBagDuration: '',
    statusHeadline: 'Enter dose, weight, and concentration or bag contents.',
    statusDetail:
      'When enough values are present, drip rate (mL/h), flow (gtts/min), and bag duration are computed.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export interface DripRateSolve {
  result: DripRateResult;
  /** Optional text write-backs for empty/derived fields (display units). */
  writeBack: Partial<
    Pick<
      DripRateInput,
      | 'concentrationText'
      | 'drugInBagText'
      | 'bagVolumeText'
      | 'dripRateText'
      | 'flowRateText'
      | 'bagDurationText'
      | 'doseText'
    >
  >;
}

function positive(n: number | null): n is number {
  return n !== null && n > 0 && Number.isFinite(n);
}

/**
 * Resolve bag / concentration triangle with source precedence.
 * - source concentration → prefer direct concentration; derive drug if bag known
 * - source bagVolume / drugInBag → prefer bag+drug for concentration
 * - otherwise: use direct concentration if present, else bag+drug
 */
export function resolveConcentrationMgPerL(
  source: DripRateSource,
  directMgPerL: number | null,
  drugMg: number | null,
  bagMl: number | null,
): number | null {
  const fromBag =
    positive(drugMg) && positive(bagMl)
      ? concentrationFromBag(drugMg, bagMl)
      : null;

  if (source === 'concentration' && positive(directMgPerL)) {
    return directMgPerL;
  }
  if (
    (source === 'bagVolume' || source === 'drugInBag') &&
    positive(fromBag)
  ) {
    return fromBag;
  }
  if (positive(directMgPerL)) return directMgPerL;
  if (positive(fromBag)) return fromBag;
  return null;
}

export function calculateDripRate(input: DripRateInput): DripRateSolve {
  const doseRaw = parseNumber(input.doseText);
  const weightRaw = parseNumber(input.weightText);
  const concRaw = parseNumber(input.concentrationText);
  const bagRaw = parseNumber(input.bagVolumeText);
  const drugRaw = parseNumber(input.drugInBagText);
  const dripRaw = parseNumber(input.dripRateText);
  const dropRaw = parseNumber(input.dropFactorText);
  const flowRaw = parseNumber(input.flowRateText);
  const durRaw = parseNumber(input.bagDurationText);

  const doseMgPerKgPerMin =
    doseRaw !== null
      ? doseToMgPerKgPerMin(
          doseRaw,
          input.doseMassUnit,
          input.doseWeightUnit,
          input.doseTimeUnit,
        )
      : null;
  const weightKg =
    weightRaw !== null ? weightToKg(weightRaw, input.weightUnit) : null;
  const directConc =
    concRaw !== null
      ? concentrationToMgPerL(concRaw, input.concentrationUnit)
      : null;
  const bagMl =
    bagRaw !== null ? volumeToMl(bagRaw, input.bagVolumeUnit) : null;
  const drugMg =
    drugRaw !== null ? drugToMg(drugRaw, input.drugMassUnit) : null;
  let dripMlPerH =
    dripRaw !== null ? dripToMlPerH(dripRaw, input.dripVolumeUnit) : null;
  const dropGttsPerMl =
    dropRaw !== null
      ? dropFactorToGttsPerMl(dropRaw, input.dropFactorVolumeUnit)
      : null;
  let flowGttsPerMin =
    flowRaw !== null ? flowToGttsPerMin(flowRaw, input.flowTimeUnit) : null;
  let bagDurationH =
    durRaw !== null ? durationToH(durRaw, input.durationUnit) : null;

  const concentrationMgPerL = resolveConcentrationMgPerL(
    input.source,
    directConc,
    drugMg,
    bagMl,
  );

  const writeBack: DripRateSolve['writeBack'] = {};

  // Derive concentration display from bag when user did not type concentration.
  if (
    !positive(directConc) &&
    positive(concentrationMgPerL) &&
    input.source !== 'concentration'
  ) {
    writeBack.concentrationText = formatDisplay(
      mgPerLToConcentration(concentrationMgPerL, input.concentrationUnit),
    );
  }

  // Derive drug from concentration + bag when drug blank / concentration authoritative.
  if (
    positive(concentrationMgPerL) &&
    positive(bagMl) &&
    input.source === 'concentration' &&
    !positive(drugMg)
  ) {
    const derivedDrug = (concentrationMgPerL * bagMl) / 1000;
    writeBack.drugInBagText = formatDisplay(
      mgToDrug(derivedDrug, input.drugMassUnit),
    );
  }

  // Derive bag from concentration + drug when bag blank.
  if (
    positive(concentrationMgPerL) &&
    positive(drugMg) &&
    input.source === 'concentration' &&
    !positive(bagMl)
  ) {
    const derivedBag = (drugMg * 1000) / concentrationMgPerL;
    writeBack.bagVolumeText = formatDisplay(
      mlToVolume(derivedBag, input.bagVolumeUnit),
    );
  }

  // Primary drip from dose × weight × concentration
  if (
    positive(doseMgPerKgPerMin) &&
    positive(weightKg) &&
    positive(concentrationMgPerL) &&
    input.source !== 'dripRate' &&
    input.source !== 'flowRate' &&
    input.source !== 'bagDuration'
  ) {
    dripMlPerH = dripRateMlPerH(
      doseMgPerKgPerMin,
      weightKg,
      concentrationMgPerL,
    );
    writeBack.dripRateText = formatDisplay(
      mlPerHToDrip(dripMlPerH, input.dripVolumeUnit),
    );
  }

  // Flow from drip × drop factor
  if (
    positive(dripMlPerH) &&
    positive(dropGttsPerMl) &&
    input.source !== 'flowRate'
  ) {
    flowGttsPerMin = flowRateGttsPerMin(dripMlPerH, dropGttsPerMl);
    writeBack.flowRateText = formatDisplay(
      gttsPerMinToFlow(flowGttsPerMin, input.flowTimeUnit),
    );
  }

  // Duration from bag / drip
  const bagForDuration =
    bagMl ??
    (writeBack.bagVolumeText
      ? volumeToMl(
          parseNumber(writeBack.bagVolumeText) ?? 0,
          input.bagVolumeUnit,
        )
      : null);
  if (
    positive(dripMlPerH) &&
    positive(bagForDuration) &&
    input.source !== 'bagDuration'
  ) {
    bagDurationH = bagDurationHours(bagForDuration, dripMlPerH);
    writeBack.bagDurationText = formatDisplay(
      hToDuration(bagDurationH, input.durationUnit),
    );
  }

  // Reverse: if user sets drip + drop factor, flow follows (already).
  // Reverse: drip from flow + drop factor when drip blank / flow authoritative.
  if (
    input.source === 'flowRate' &&
    positive(flowGttsPerMin) &&
    positive(dropGttsPerMl) &&
    !positive(dripMlPerH)
  ) {
    dripMlPerH = (flowGttsPerMin * 60) / dropGttsPerMl;
    writeBack.dripRateText = formatDisplay(
      mlPerHToDrip(dripMlPerH, input.dripVolumeUnit),
    );
  }

  // Reverse: drip from bag duration + bag volume
  if (
    input.source === 'bagDuration' &&
    positive(bagDurationH) &&
    positive(bagMl) &&
    !positive(dripMlPerH)
  ) {
    dripMlPerH = bagMl / bagDurationH;
    writeBack.dripRateText = formatDisplay(
      mlPerHToDrip(dripMlPerH, input.dripVolumeUnit),
    );
  }

  if (
    !positive(doseMgPerKgPerMin) ||
    !positive(weightKg) ||
    !positive(concentrationMgPerL)
  ) {
    if (!positive(dripMlPerH)) {
      return {
        result: emptyResult({
          doseMgPerKgPerMin: positive(doseMgPerKgPerMin)
            ? doseMgPerKgPerMin
            : null,
          weightKg: positive(weightKg) ? weightKg : null,
          concentrationMgPerL: positive(concentrationMgPerL)
            ? concentrationMgPerL
            : null,
          bagVolumeMl: positive(bagMl) ? bagMl : null,
          drugInBagMg: positive(drugMg) ? drugMg : null,
          dripRateMlPerH: positive(dripMlPerH) ? dripMlPerH : null,
          dropFactorGttsPerMl: positive(dropGttsPerMl) ? dropGttsPerMl : null,
          flowRateGttsPerMin: positive(flowGttsPerMin) ? flowGttsPerMin : null,
          bagDurationH: positive(bagDurationH) ? bagDurationH : null,
          formattedConcentration: writeBack.concentrationText ?? '',
          formattedDrugInBag: writeBack.drugInBagText ?? '',
          formattedBagVolume: writeBack.bagVolumeText ?? '',
          formattedDripRate: writeBack.dripRateText ?? '',
          formattedFlowRate: writeBack.flowRateText ?? '',
          formattedBagDuration: writeBack.bagDurationText ?? '',
        }),
        writeBack,
      };
    }
  }

  if (!positive(dripMlPerH)) {
    return {
      result: emptyResult({
        statusHeadline: 'Unable to compute drip rate.',
        statusDetail:
          'Provide a positive dose, weight, and concentration (or bag volume + drug amount).',
        doseMgPerKgPerMin: positive(doseMgPerKgPerMin)
          ? doseMgPerKgPerMin
          : null,
        weightKg: positive(weightKg) ? weightKg : null,
        concentrationMgPerL: positive(concentrationMgPerL)
          ? concentrationMgPerL
          : null,
      }),
      writeBack,
    };
  }

  return {
    result: {
      doseMgPerKgPerMin: positive(doseMgPerKgPerMin) ? doseMgPerKgPerMin : null,
      weightKg: positive(weightKg) ? weightKg : null,
      concentrationMgPerL: positive(concentrationMgPerL)
        ? concentrationMgPerL
        : null,
      bagVolumeMl: positive(bagForDuration) ? bagForDuration : null,
      drugInBagMg: positive(drugMg) ? drugMg : null,
      dripRateMlPerH: dripMlPerH,
      dropFactorGttsPerMl: positive(dropGttsPerMl) ? dropGttsPerMl : null,
      flowRateGttsPerMin: positive(flowGttsPerMin) ? flowGttsPerMin : null,
      bagDurationH: positive(bagDurationH) ? bagDurationH : null,
      formattedConcentration: writeBack.concentrationText ?? '',
      formattedDrugInBag: writeBack.drugInBagText ?? '',
      formattedBagVolume: writeBack.bagVolumeText ?? '',
      formattedDripRate:
        writeBack.dripRateText ??
        formatDisplay(mlPerHToDrip(dripMlPerH, input.dripVolumeUnit)),
      formattedFlowRate: writeBack.flowRateText ?? '',
      formattedBagDuration: writeBack.bagDurationText ?? '',
      statusHeadline: 'Drip rate computed.',
      statusDetail: `Infusion ≈ ${formatDisplay(dripMlPerH, 4)} mL/h${
        positive(flowGttsPerMin)
          ? ` · ${formatDisplay(flowGttsPerMin, 4)} gtts/min`
          : ''
      }.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    },
    writeBack,
  };
}
