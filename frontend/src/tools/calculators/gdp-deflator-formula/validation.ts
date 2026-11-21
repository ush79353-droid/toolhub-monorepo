import {
  calculateDeflatorInflation,
  calculateGDPDeflator,
  calculateNominalGDP,
  calculateRealGDP,
  formatGdpAmount,
  formatIndex,
  formatPercent,
  magnitudeFactor,
  magnitudeLabel,
  priceLevelInterpretation,
  toBaseUnits,
} from './calculation';
import type {
  GdpDeflatorFieldErrors,
  GdpDeflatorInput,
  GdpDeflatorResult,
  GdpDeflatorMode,
  GdpMagnitude,
} from './types';

export interface GdpDeflatorValidation {
  isValid: boolean;
  errors: GdpDeflatorFieldErrors;
  result: GdpDeflatorResult | null;
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

function parseOptionalInflation(
  previousRaw: string,
  currentRaw: string
): {
  rate: number | null;
  formatted: string | null;
  note: string | null;
  errors: Pick<GdpDeflatorFieldErrors, 'previousDeflator' | 'currentDeflator'>;
} {
  const errors: Pick<
    GdpDeflatorFieldErrors,
    'previousDeflator' | 'currentDeflator'
  > = {};
  const prev = parseNumber(previousRaw);
  const curr = parseNumber(currentRaw);
  const bothBlank = prev.blank && curr.blank;
  if (bothBlank) {
    return { rate: null, formatted: null, note: null, errors };
  }
  if (prev.blank) {
    errors.previousDeflator = 'Enter the previous-period GDP deflator.';
  } else if (prev.invalid || prev.value == null) {
    errors.previousDeflator = 'Enter a valid previous-period GDP deflator.';
  } else if (prev.value <= 0) {
    errors.previousDeflator =
      'Previous-period GDP deflator must be greater than zero.';
  }
  if (curr.blank) {
    errors.currentDeflator = 'Enter the current-period GDP deflator.';
  } else if (curr.invalid || curr.value == null) {
    errors.currentDeflator = 'Enter a valid current-period GDP deflator.';
  }
  if (errors.previousDeflator || errors.currentDeflator) {
    return { rate: null, formatted: null, note: null, errors };
  }
  try {
    const rate = calculateDeflatorInflation(prev.value!, curr.value!);
    return {
      rate,
      formatted: formatPercent(rate),
      note: buildInflationNote(rate),
      errors,
    };
  } catch {
    errors.previousDeflator =
      'Unable to compute inflation from these deflator values.';
    return { rate: null, formatted: null, note: null, errors };
  }
}

function buildInflationNote(rate: number): string {
  if (rate >= 0) {
    return `The GDP deflator increased by ${formatPercent(rate)} between the two periods.`;
  }
  return `The GDP deflator decreased by ${formatPercent(Math.abs(rate))} between the two periods.`;
}

export function validateGdpDeflatorInput(
  input: GdpDeflatorInput
): GdpDeflatorValidation {
  const errors: GdpDeflatorFieldErrors = {};
  const mode: GdpDeflatorMode = input.mode;

  const nom = parseNumber(input.nominalGdp);
  const real = parseNumber(input.realGdp);
  const def = parseNumber(input.deflator);

  let nominalBase: number | null = null;
  let realBase: number | null = null;
  let deflator: number | null = null;

  if (mode === 'deflator') {
    if (nom.blank) {
      errors.nominalGdp = 'Please enter a valid nominal GDP.';
    } else if (nom.invalid || nom.value == null) {
      errors.nominalGdp = 'Please enter a valid nominal GDP.';
    } else if (nom.value < 0) {
      errors.nominalGdp = 'Nominal GDP must be non-negative.';
    } else {
      nominalBase = toBaseUnits(nom.value, input.nominalMagnitude);
    }

    if (real.blank) {
      errors.realGdp = 'Real GDP must be greater than zero.';
    } else if (real.invalid || real.value == null) {
      errors.realGdp = 'Please enter a valid real GDP.';
    } else if (real.value <= 0) {
      errors.realGdp = 'Real GDP must be greater than zero.';
    } else {
      realBase = toBaseUnits(real.value, input.realMagnitude);
    }
  } else if (mode === 'nominal') {
    if (real.blank) {
      errors.realGdp = 'Please enter a valid real GDP.';
    } else if (real.invalid || real.value == null) {
      errors.realGdp = 'Please enter a valid real GDP.';
    } else if (real.value < 0) {
      errors.realGdp = 'Real GDP must be non-negative.';
    } else {
      realBase = toBaseUnits(real.value, input.realMagnitude);
    }

    if (def.blank) {
      errors.deflator = 'Enter a GDP deflator greater than zero.';
    } else if (def.invalid || def.value == null) {
      errors.deflator = 'Enter a valid GDP deflator.';
    } else if (def.value <= 0) {
      errors.deflator =
        'GDP deflator must be greater than zero to calculate nominal GDP.';
    } else {
      deflator = def.value;
    }
  } else {
    if (nom.blank) {
      errors.nominalGdp = 'Please enter a valid nominal GDP.';
    } else if (nom.invalid || nom.value == null) {
      errors.nominalGdp = 'Please enter a valid nominal GDP.';
    } else if (nom.value < 0) {
      errors.nominalGdp = 'Nominal GDP must be non-negative.';
    } else {
      nominalBase = toBaseUnits(nom.value, input.nominalMagnitude);
    }

    if (def.blank) {
      errors.deflator = 'Enter a GDP deflator greater than zero.';
    } else if (def.invalid || def.value == null) {
      errors.deflator = 'Enter a valid GDP deflator.';
    } else if (def.value <= 0) {
      errors.deflator =
        'GDP deflator must be greater than zero to calculate real GDP.';
    } else {
      deflator = def.value;
    }
  }

  const inflationParsed = parseOptionalInflation(
    input.previousDeflator,
    input.currentDeflator
  );
  if (inflationParsed.errors.previousDeflator) {
    errors.previousDeflator = inflationParsed.errors.previousDeflator;
  }
  if (inflationParsed.errors.currentDeflator) {
    errors.currentDeflator = inflationParsed.errors.currentDeflator;
  }

  const hasCoreError = Boolean(
    errors.nominalGdp || errors.realGdp || errors.deflator || errors.form
  );
  if (hasCoreError) {
    return { isValid: false, errors, result: null };
  }

  try {
    if (mode === 'deflator') {
      deflator = calculateGDPDeflator(nominalBase!, realBase!);
    } else if (mode === 'nominal') {
      nominalBase = calculateNominalGDP(realBase!, deflator!);
    } else {
      realBase = calculateRealGDP(nominalBase!, deflator!);
    }
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to calculate GDP deflator.';
    return { isValid: false, errors, result: null };
  }

  const inflationRate =
    inflationParsed.rate != null &&
    !inflationParsed.errors.previousDeflator &&
    !inflationParsed.errors.currentDeflator
      ? inflationParsed.rate
      : null;
  const formattedInflation =
    inflationRate != null ? formatPercent(inflationRate) : null;
  const inflationNote =
    inflationRate != null ? buildInflationNote(inflationRate) : null;

  const zeroNominalNote =
    nominalBase === 0 && realBase! > 0
      ? 'A zero GDP deflator can arise mathematically when nominal GDP is zero and real GDP is positive, but that scenario has limited economic interpretation.'
      : null;

  const steps: string[] = [];
  if (mode === 'deflator') {
    steps.push(
      `Identify Nominal GDP = ${formatGdpAmount(nominalBase!, input.currency, input.nominalMagnitude)}.`
    );
    steps.push(
      `Identify Real GDP = ${formatGdpAmount(realBase!, input.currency, input.realMagnitude)}.`
    );
    steps.push(
      `Apply D = (N / R) × 100 using compatible ${input.currency} base units (${magnitudeLabel(input.nominalMagnitude)} vs ${magnitudeLabel(input.realMagnitude)} converted internally).`
    );
    steps.push(`Calculate D = ${formatIndex(deflator!)}.`);
    steps.push(priceLevelInterpretation(deflator!));
  } else if (mode === 'nominal') {
    steps.push(
      `Identify Real GDP = ${formatGdpAmount(realBase!, input.currency, input.realMagnitude)}.`
    );
    steps.push(`Identify GDP Deflator = ${formatIndex(deflator!)}.`);
    steps.push('Apply N = (D × R) / 100.');
    steps.push(
      `Calculate Nominal GDP = ${formatGdpAmount(nominalBase!, input.currency, input.realMagnitude)}.`
    );
  } else {
    steps.push(
      `Identify Nominal GDP = ${formatGdpAmount(nominalBase!, input.currency, input.nominalMagnitude)}.`
    );
    steps.push(`Identify GDP Deflator = ${formatIndex(deflator!)}.`);
    steps.push('Apply R = (N × 100) / D.');
    steps.push(
      `Calculate Real GDP = ${formatGdpAmount(realBase!, input.currency, input.nominalMagnitude)}.`
    );
  }

  const formulaBreakdown =
    mode === 'deflator'
      ? `D = (N / R) × 100 = ${formatIndex(deflator!)}`
      : mode === 'nominal'
        ? `N = (D × R) / 100`
        : `R = (N × 100) / D`;

  const outMagNominal: GdpMagnitude =
    mode === 'nominal' ? input.realMagnitude : input.nominalMagnitude;
  const outMagReal: GdpMagnitude =
    mode === 'real' ? input.nominalMagnitude : input.realMagnitude;
  const displayFromBase = (base: number, mag: GdpMagnitude) =>
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
    }).format(base / magnitudeFactor(mag));

  const result: GdpDeflatorResult = {
    mode,
    currency: input.currency,
    nominalBase: nominalBase!,
    realBase: realBase!,
    deflator: deflator!,
    formattedNominal: formatGdpAmount(
      nominalBase!,
      input.currency,
      outMagNominal
    ),
    formattedReal: formatGdpAmount(realBase!, input.currency, outMagReal),
    formattedDeflator: formatIndex(deflator!),
    displayNominal: displayFromBase(nominalBase!, outMagNominal),
    displayReal: displayFromBase(realBase!, outMagReal),
    displayDeflator: formatIndex(deflator!),
    priceLevelInterpretation: priceLevelInterpretation(deflator!),
    formulaBreakdown,
    steps,
    explanation:
      'The GDP deflator is a price-level index. Do not label a single index reading as the one-year inflation rate; inflation needs two comparable periods.',
    zeroNominalNote,
    inflationRate,
    formattedInflation,
    inflationNote,
  };

  return { isValid: true, errors, result };
}
