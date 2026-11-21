import {
  annualizeQuarterlyGrowth,
  calculateCurrentGDP,
  calculateGDPGrowth,
  calculatePreviousGDP,
  displayFromBase,
  formatGdpAmount,
  formatGrowthPercent,
  growthStatus,
  measureLabel,
  periodLabel,
  toBaseUnits,
} from './calculation';
import type {
  GdpGrowthFieldErrors,
  GdpGrowthInput,
  GdpGrowthMode,
  GdpGrowthResult,
  GdpMagnitude,
} from './types';

export interface GdpGrowthValidation {
  isValid: boolean;
  errors: GdpGrowthFieldErrors;
  result: GdpGrowthResult | null;
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

export function validateGdpGrowthInput(
  input: GdpGrowthInput
): GdpGrowthValidation {
  const errors: GdpGrowthFieldErrors = {};
  const mode: GdpGrowthMode = input.mode;

  const current = parseNumber(input.currentGdp);
  const previous = parseNumber(input.previousGdp);
  const growth = parseNumber(input.growthPercent);

  let currentBase: number | null = null;
  let previousBase: number | null = null;
  let growthPercent: number | null = null;

  if (mode === 'growth') {
    if (current.blank || current.invalid || current.value == null) {
      errors.currentGdp = 'Enter a valid current-period GDP greater than zero.';
    } else if (current.value <= 0) {
      errors.currentGdp = 'Current GDP must be greater than zero.';
    } else {
      currentBase = toBaseUnits(current.value, input.currentMagnitude);
    }

    if (previous.blank || previous.invalid || previous.value == null) {
      errors.previousGdp =
        'Enter a valid previous-period GDP greater than zero.';
    } else if (previous.value <= 0) {
      errors.previousGdp = 'Previous GDP must be greater than zero.';
    } else {
      previousBase = toBaseUnits(previous.value, input.previousMagnitude);
    }
  } else if (mode === 'current') {
    if (previous.blank || previous.invalid || previous.value == null) {
      errors.previousGdp =
        'Enter a valid previous-period GDP greater than zero.';
    } else if (previous.value <= 0) {
      errors.previousGdp = 'Previous GDP must be greater than zero.';
    } else {
      previousBase = toBaseUnits(previous.value, input.previousMagnitude);
    }

    if (growth.blank || growth.invalid || growth.value == null) {
      errors.growthPercent = 'Enter a valid GDP growth percentage.';
    } else if (growth.value <= -100) {
      errors.growthPercent =
        'GDP growth must be greater than −100% when calculating current GDP.';
    } else {
      growthPercent = growth.value;
    }
  } else {
    if (current.blank || current.invalid || current.value == null) {
      errors.currentGdp = 'Enter a valid current-period GDP greater than zero.';
    } else if (current.value <= 0) {
      errors.currentGdp = 'Current GDP must be greater than zero.';
    } else {
      currentBase = toBaseUnits(current.value, input.currentMagnitude);
    }

    if (growth.blank || growth.invalid || growth.value == null) {
      errors.growthPercent = 'Enter a valid GDP growth percentage.';
    } else if (growth.value <= -100) {
      errors.growthPercent =
        'GDP growth must be greater than −100% when calculating previous GDP.';
    } else {
      growthPercent = growth.value;
    }
  }

  if (errors.currentGdp || errors.previousGdp || errors.growthPercent) {
    return { isValid: false, errors, result: null };
  }

  try {
    if (mode === 'growth') {
      growthPercent = calculateGDPGrowth(currentBase!, previousBase!);
    } else if (mode === 'current') {
      currentBase = calculateCurrentGDP(previousBase!, growthPercent!);
    } else {
      previousBase = calculatePreviousGDP(currentBase!, growthPercent!);
    }
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to calculate GDP growth.';
    return { isValid: false, errors, result: null };
  }

  const absoluteChange = currentBase! - previousBase!;
  const status = growthStatus(growthPercent!, input.measureType);

  let annualizedGrowth: number | null = null;
  if (
    input.period === 'quarterly' &&
    input.annualizeQuarterly &&
    mode === 'growth'
  ) {
    try {
      annualizedGrowth = annualizeQuarterlyGrowth(currentBase!, previousBase!);
    } catch {
      annualizedGrowth = null;
    }
  }

  const outMagCurrent: GdpMagnitude =
    mode === 'current' ? input.previousMagnitude : input.currentMagnitude;
  const outMagPrevious: GdpMagnitude =
    mode === 'previous' ? input.currentMagnitude : input.previousMagnitude;

  const steps: string[] = [];
  if (mode === 'growth') {
    steps.push(
      `Identify Current GDP = ${formatGdpAmount(currentBase!, input.currency, outMagCurrent)}.`
    );
    steps.push(
      `Identify Previous GDP = ${formatGdpAmount(previousBase!, input.currency, outMagPrevious)}.`
    );
    steps.push(
      `GDP change = Current − Previous = ${formatGdpAmount(absoluteChange, input.currency, outMagPrevious)}.`
    );
    steps.push(
      `Divide by Previous GDP, then × 100 → ${formatGrowthPercent(growthPercent!)}.`
    );
    steps.push(status.interpretation);
    if (annualizedGrowth != null) {
      steps.push(
        `Optional annualized QoQ (labeled separately): (Current/Previous)^4 − 1 → ${formatGrowthPercent(annualizedGrowth)}.`
      );
    }
  } else if (mode === 'current') {
    steps.push(
      `Identify Previous GDP = ${formatGdpAmount(previousBase!, input.currency, outMagPrevious)}.`
    );
    steps.push(`Identify GDP Growth = ${formatGrowthPercent(growthPercent!)}.`);
    steps.push('Apply Current = Previous × (1 + g/100).');
    steps.push(
      `Calculate Current GDP = ${formatGdpAmount(currentBase!, input.currency, outMagCurrent)}.`
    );
  } else {
    steps.push(
      `Identify Current GDP = ${formatGdpAmount(currentBase!, input.currency, outMagCurrent)}.`
    );
    steps.push(`Identify GDP Growth = ${formatGrowthPercent(growthPercent!)}.`);
    steps.push('Apply Previous = Current / (1 + g/100).');
    steps.push(
      `Calculate Previous GDP = ${formatGdpAmount(previousBase!, input.currency, outMagPrevious)}.`
    );
  }

  const formulaBreakdown =
    mode === 'growth'
      ? `g = ((Current − Previous) / Previous) × 100 = ${formatGrowthPercent(growthPercent!)}`
      : mode === 'current'
        ? `Current = Previous × (1 + g/100)`
        : `Previous = Current / (1 + g/100)`;

  const result: GdpGrowthResult = {
    mode,
    currency: input.currency,
    currentBase: currentBase!,
    previousBase: previousBase!,
    growthPercent: growthPercent!,
    absoluteChange,
    annualizedGrowth,
    formattedCurrent: formatGdpAmount(
      currentBase!,
      input.currency,
      outMagCurrent
    ),
    formattedPrevious: formatGdpAmount(
      previousBase!,
      input.currency,
      outMagPrevious
    ),
    formattedGrowth: formatGrowthPercent(growthPercent!),
    formattedAbsoluteChange: formatGdpAmount(
      absoluteChange,
      input.currency,
      outMagPrevious
    ),
    formattedAnnualized:
      annualizedGrowth != null ? formatGrowthPercent(annualizedGrowth) : null,
    displayCurrent: displayFromBase(currentBase!, outMagCurrent),
    displayPrevious: displayFromBase(previousBase!, outMagPrevious),
    displayGrowth: new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
    }).format(growthPercent!),
    periodLabel: periodLabel(input.period),
    measureLabel: measureLabel(input.measureType),
    statusTitle: status.title,
    interpretation: status.interpretation,
    formulaBreakdown,
    steps,
    explanation:
      'Do not mix nominal and real GDP, or incompatible currencies, in one growth calculation. Annualized quarterly growth is shown only when explicitly selected and must not be confused with the period growth rate.',
  };

  return { isValid: true, errors, result };
}
