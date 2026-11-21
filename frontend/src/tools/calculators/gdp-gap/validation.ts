import {
  absoluteOutputGap,
  calculateActualGDP,
  calculateGDPGap,
  calculatePotentialGDP,
  displayFromBase,
  formatGapPercent,
  formatGdpAmount,
  gapStatus,
  toBaseUnits,
} from './calculation';
import type {
  GdpGapFieldErrors,
  GdpGapInput,
  GdpGapMode,
  GdpGapResult,
  GdpMagnitude,
} from './types';

export interface GdpGapValidation {
  isValid: boolean;
  errors: GdpGapFieldErrors;
  result: GdpGapResult | null;
}

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

export function validateGdpGapInput(input: GdpGapInput): GdpGapValidation {
  const errors: GdpGapFieldErrors = {};
  const mode: GdpGapMode = input.mode;

  const actual = parseNumber(input.actualGdp);
  const potential = parseNumber(input.potentialGdp);
  const gap = parseNumber(input.gapPercent);

  let actualBase: number | null = null;
  let potentialBase: number | null = null;
  let gapPercent: number | null = null;

  if (mode === 'gap') {
    if (actual.blank || actual.invalid || actual.value == null) {
      errors.actualGdp = 'Enter a valid actual GDP greater than zero.';
    } else if (actual.value <= 0) {
      errors.actualGdp = 'Actual GDP must be greater than zero.';
    } else {
      actualBase = toBaseUnits(actual.value, input.actualMagnitude);
    }

    if (potential.blank || potential.invalid || potential.value == null) {
      errors.potentialGdp = 'Enter a valid potential GDP greater than zero.';
    } else if (potential.value <= 0) {
      errors.potentialGdp = 'Potential GDP must be greater than zero.';
    } else {
      potentialBase = toBaseUnits(potential.value, input.potentialMagnitude);
    }
  } else if (mode === 'actual') {
    if (potential.blank || potential.invalid || potential.value == null) {
      errors.potentialGdp = 'Enter a valid potential GDP greater than zero.';
    } else if (potential.value <= 0) {
      errors.potentialGdp = 'Potential GDP must be greater than zero.';
    } else {
      potentialBase = toBaseUnits(potential.value, input.potentialMagnitude);
    }

    if (gap.blank || gap.invalid || gap.value == null) {
      errors.gapPercent = 'Enter a valid GDP gap percentage.';
    } else if (gap.value <= -100) {
      errors.gapPercent =
        'GDP gap must be greater than −100% when calculating actual GDP.';
    } else {
      gapPercent = gap.value;
    }
  } else {
    if (actual.blank || actual.invalid || actual.value == null) {
      errors.actualGdp = 'Enter a valid actual GDP greater than zero.';
    } else if (actual.value <= 0) {
      errors.actualGdp = 'Actual GDP must be greater than zero.';
    } else {
      actualBase = toBaseUnits(actual.value, input.actualMagnitude);
    }

    if (gap.blank || gap.invalid || gap.value == null) {
      errors.gapPercent = 'Enter a valid GDP gap percentage.';
    } else if (gap.value <= -100) {
      errors.gapPercent =
        'GDP gap must be greater than −100% when calculating potential GDP.';
    } else {
      gapPercent = gap.value;
    }
  }

  if (errors.actualGdp || errors.potentialGdp || errors.gapPercent) {
    return { isValid: false, errors, result: null };
  }

  try {
    if (mode === 'gap') {
      gapPercent = calculateGDPGap(actualBase!, potentialBase!);
    } else if (mode === 'actual') {
      actualBase = calculateActualGDP(potentialBase!, gapPercent!);
    } else {
      potentialBase = calculatePotentialGDP(actualBase!, gapPercent!);
    }
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to calculate the GDP gap.';
    return { isValid: false, errors, result: null };
  }

  const absolute = absoluteOutputGap(actualBase!, potentialBase!);
  const status = gapStatus(gapPercent!);

  const outMagActual: GdpMagnitude =
    mode === 'actual' ? input.potentialMagnitude : input.actualMagnitude;
  const outMagPotential: GdpMagnitude =
    mode === 'potential' ? input.actualMagnitude : input.potentialMagnitude;

  const steps: string[] = [];
  if (mode === 'gap') {
    steps.push(
      `Identify Actual GDP = ${formatGdpAmount(actualBase!, input.currency, outMagActual)}.`
    );
    steps.push(
      `Identify Potential GDP = ${formatGdpAmount(potentialBase!, input.currency, outMagPotential)}.`
    );
    steps.push(
      `Absolute gap = Actual − Potential = ${formatGdpAmount(absolute, input.currency, outMagPotential)}.`
    );
    steps.push(
      `Divide absolute gap by Potential GDP, then × 100 → ${formatGapPercent(gapPercent!)}.`
    );
    steps.push(status.interpretation);
  } else if (mode === 'actual') {
    steps.push(
      `Identify Potential GDP = ${formatGdpAmount(potentialBase!, input.currency, outMagPotential)}.`
    );
    steps.push(`Identify GDP Gap = ${formatGapPercent(gapPercent!)}.`);
    steps.push('Apply Actual = Potential × (1 + Gap/100).');
    steps.push(
      `Calculate Actual GDP = ${formatGdpAmount(actualBase!, input.currency, outMagActual)}.`
    );
  } else {
    steps.push(
      `Identify Actual GDP = ${formatGdpAmount(actualBase!, input.currency, outMagActual)}.`
    );
    steps.push(`Identify GDP Gap = ${formatGapPercent(gapPercent!)}.`);
    steps.push('Apply Potential = Actual / (1 + Gap/100).');
    steps.push(
      `Calculate Potential GDP = ${formatGdpAmount(potentialBase!, input.currency, outMagPotential)}.`
    );
  }

  const formulaBreakdown =
    mode === 'gap'
      ? `Gap% = ((Y − Y*) / Y*) × 100 = ${formatGapPercent(gapPercent!)}`
      : mode === 'actual'
        ? `Y = Y* × (1 + Gap/100)`
        : `Y* = Y / (1 + Gap/100)`;

  const result: GdpGapResult = {
    mode,
    currency: input.currency,
    actualBase: actualBase!,
    potentialBase: potentialBase!,
    gapPercent: gapPercent!,
    absoluteGap: absolute,
    formattedActual: formatGdpAmount(
      actualBase!,
      input.currency,
      outMagActual
    ),
    formattedPotential: formatGdpAmount(
      potentialBase!,
      input.currency,
      outMagPotential
    ),
    formattedGap: formatGapPercent(gapPercent!),
    formattedAbsoluteGap: formatGdpAmount(
      absolute,
      input.currency,
      outMagPotential
    ),
    displayActual: displayFromBase(actualBase!, outMagActual),
    displayPotential: displayFromBase(potentialBase!, outMagPotential),
    displayGap: new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
    }).format(gapPercent!),
    statusTitle: status.title,
    interpretation: status.interpretation,
    formulaBreakdown,
    steps,
    explanation:
      'Use real GDP on a consistent price basis for both actual and potential output. Potential GDP is an estimate of sustainable capacity, not an exact physical maximum.',
  };

  return { isValid: true, errors, result };
}
