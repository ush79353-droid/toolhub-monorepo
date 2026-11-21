import {
  calculateGDPDeflator,
  calculateNominalGDP,
  calculateRealGDP,
  calculateRealGDPGrowth,
  formatDisplayAmount,
  formatGdpAmount,
  formatIndex,
  formatPercent,
  fromBaseUnits,
  priceLevelInterpretation,
  toBaseUnits,
} from './calculation';
import type {
  RealGdpFieldErrors,
  RealGdpInput,
  RealGdpResult,
} from './types';

export interface RealGdpValidation {
  isValid: boolean;
  errors: RealGdpFieldErrors;
  result: RealGdpResult | null;
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

function parseOptionalGrowth(
  prevRaw: string,
  currRaw: string,
  magnitude: RealGdpInput['magnitude']
): {
  rate: number | null;
  formatted: string | null;
  note: string | null;
  errors: Pick<RealGdpFieldErrors, 'previousRealGdp' | 'currentRealGdp'>;
} {
  const errors: Pick<
    RealGdpFieldErrors,
    'previousRealGdp' | 'currentRealGdp'
  > = {};
  const prev = parseNumber(prevRaw);
  const curr = parseNumber(currRaw);
  if (prev.blank && curr.blank) {
    return { rate: null, formatted: null, note: null, errors };
  }
  if (prev.blank)
    errors.previousRealGdp = 'Enter previous-period real GDP.';
  else if (prev.invalid || prev.value == null)
    errors.previousRealGdp = 'Enter a valid previous real GDP.';
  else if (prev.value <= 0)
    errors.previousRealGdp = 'Previous real GDP must be greater than zero.';

  if (curr.blank) errors.currentRealGdp = 'Enter current-period real GDP.';
  else if (curr.invalid || curr.value == null)
    errors.currentRealGdp = 'Enter a valid current real GDP.';
  else if (curr.value < 0)
    errors.currentRealGdp = 'Current real GDP cannot be negative.';

  if (errors.previousRealGdp || errors.currentRealGdp) {
    return { rate: null, formatted: null, note: null, errors };
  }

  const prevBase = toBaseUnits(prev.value!, magnitude);
  const currBase = toBaseUnits(curr.value!, magnitude);
  const rate = calculateRealGDPGrowth(prevBase, currBase);
  if (rate == null) {
    errors.previousRealGdp = 'Unable to compute real GDP growth.';
    return { rate: null, formatted: null, note: null, errors };
  }
  return {
    rate,
    formatted: formatPercent(rate),
    note: `Real GDP growth between the two periods is ${formatPercent(rate)} (inflation-adjusted output change).`,
    errors,
  };
}

export function validateRealGdpInput(input: RealGdpInput): RealGdpValidation {
  const errors: RealGdpFieldErrors = {};
  const nom = parseNumber(input.nominalGdp);
  const real = parseNumber(input.realGdp);
  const def = parseNumber(input.deflator);
  const mag = input.magnitude;

  let nominalBase: number | null = null;
  let realBase: number | null = null;
  let deflator: number | null = null;

  if (input.mode === 'real') {
    if (nom.blank) errors.nominalGdp = 'Enter nominal GDP.';
    else if (nom.invalid || nom.value == null)
      errors.nominalGdp = 'Enter a valid nominal GDP.';
    else if (nom.value < 0) errors.nominalGdp = 'Nominal GDP cannot be negative.';

    if (def.blank) errors.deflator = 'Enter the GDP deflator.';
    else if (def.invalid || def.value == null)
      errors.deflator = 'Enter a valid GDP deflator.';
    else if (def.value <= 0)
      errors.deflator = 'The GDP deflator must be greater than zero.';

    if (Object.keys(errors).length === 0) {
      nominalBase = toBaseUnits(nom.value!, mag);
      deflator = def.value!;
      realBase = calculateRealGDP(nominalBase, deflator);
      if (realBase == null) errors.form = 'Unable to calculate real GDP.';
    }
  } else if (input.mode === 'nominal') {
    if (real.blank) errors.realGdp = 'Enter real GDP.';
    else if (real.invalid || real.value == null)
      errors.realGdp = 'Enter a valid real GDP.';
    else if (real.value < 0) errors.realGdp = 'Real GDP cannot be negative.';

    if (def.blank) errors.deflator = 'Enter the GDP deflator.';
    else if (def.invalid || def.value == null)
      errors.deflator = 'Enter a valid GDP deflator.';
    else if (def.value <= 0)
      errors.deflator = 'The GDP deflator must be greater than zero.';

    if (Object.keys(errors).length === 0) {
      realBase = toBaseUnits(real.value!, mag);
      deflator = def.value!;
      nominalBase = calculateNominalGDP(realBase, deflator);
      if (nominalBase == null) errors.form = 'Unable to calculate nominal GDP.';
    }
  } else {
    if (nom.blank) errors.nominalGdp = 'Enter nominal GDP.';
    else if (nom.invalid || nom.value == null)
      errors.nominalGdp = 'Enter a valid nominal GDP.';
    else if (nom.value < 0) errors.nominalGdp = 'Nominal GDP cannot be negative.';

    if (real.blank) errors.realGdp = 'Enter real GDP.';
    else if (real.invalid || real.value == null)
      errors.realGdp = 'Enter a valid real GDP.';
    else if (real.value <= 0)
      errors.realGdp = 'Real GDP must be greater than zero to calculate the deflator.';

    if (Object.keys(errors).length === 0) {
      nominalBase = toBaseUnits(nom.value!, mag);
      realBase = toBaseUnits(real.value!, mag);
      deflator = calculateGDPDeflator(nominalBase, realBase);
      if (deflator == null) errors.form = 'Unable to calculate the GDP deflator.';
    }
  }

  const growth = parseOptionalGrowth(
    input.previousRealGdp,
    input.currentRealGdp,
    mag
  );

  if (
    Object.keys(errors).length > 0 ||
    nominalBase == null ||
    realBase == null ||
    deflator == null
  ) {
    return {
      isValid: false,
      errors: { ...errors, ...growth.errors },
      result: null,
    };
  }

  const displayNom = formatDisplayAmount(fromBaseUnits(nominalBase, mag));
  const displayReal = formatDisplayAmount(fromBaseUnits(realBase, mag));
  const displayDef = formatIndex(deflator);
  const ratio =
    nominalBase > 0 ? realBase / nominalBase : nominalBase === 0 ? null : null;

  const steps =
    input.mode === 'real'
      ? [
          `Real GDP = (Nominal GDP / GDP Deflator) × 100.`,
          `Real GDP = (${formatGdpAmount(nominalBase, input.currency, mag)} / ${displayDef}) × 100.`,
          `Real GDP = ${formatGdpAmount(realBase, input.currency, mag)}.`,
          priceLevelInterpretation(deflator),
        ]
      : input.mode === 'nominal'
        ? [
            `Nominal GDP = (Real GDP × GDP Deflator) / 100.`,
            `Nominal GDP = (${formatGdpAmount(realBase, input.currency, mag)} × ${displayDef}) / 100.`,
            `Nominal GDP = ${formatGdpAmount(nominalBase, input.currency, mag)}.`,
          ]
        : [
            `GDP Deflator = (Nominal GDP / Real GDP) × 100.`,
            `GDP Deflator = (${formatGdpAmount(nominalBase, input.currency, mag)} / ${formatGdpAmount(realBase, input.currency, mag)}) × 100.`,
            `GDP Deflator = ${displayDef}.`,
            priceLevelInterpretation(deflator),
          ];

  const interpretation =
    input.mode === 'real'
      ? `After adjusting for the GDP deflator, output is valued at ${formatGdpAmount(realBase, input.currency, mag)} in base-year prices.`
      : input.mode === 'nominal'
        ? `Implied nominal GDP is ${formatGdpAmount(nominalBase, input.currency, mag)} at the selected deflator.`
        : `The GDP deflator is ${displayDef}. ${priceLevelInterpretation(deflator)}`;

  const result: RealGdpResult = {
    mode: input.mode,
    currency: input.currency,
    magnitude: mag,
    nominalBase,
    realBase,
    deflator,
    formattedNominal: formatGdpAmount(nominalBase, input.currency, mag),
    formattedReal: formatGdpAmount(realBase, input.currency, mag),
    formattedDeflator: displayDef,
    displayNominal: displayNom,
    displayReal: displayReal,
    displayDeflator: displayDef,
    priceLevelInterpretation: priceLevelInterpretation(deflator),
    realToNominalRatio: ratio,
    formattedRatio:
      ratio != null ? formatDisplayAmount(ratio) : '—',
    formulaBreakdown:
      input.mode === 'real'
        ? 'Real GDP = (Nominal GDP / GDP Deflator) × 100'
        : input.mode === 'nominal'
          ? 'Nominal GDP = (Real GDP × GDP Deflator) / 100'
          : 'GDP Deflator = (Nominal GDP / Real GDP) × 100',
    steps,
    interpretation,
    explanation:
      'Currency selection is denomination only (no FX conversion). The GDP deflator compares the price level with its base year (100); it is not a one-year inflation rate by itself.',
    growthRate: growth.rate,
    formattedGrowth: growth.formatted,
    growthNote: growth.note,
  };

  return {
    isValid: true,
    errors: { ...growth.errors },
    result,
  };
}
