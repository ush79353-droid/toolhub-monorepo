import {
  calculateIndexedHomeValue,
  calculateInflationAdjustedPurchasePrice,
  calculateNominalDollarChange,
  calculateNominalPercentageChange,
  calculateRealDollarChange,
  calculateRealPercentageChange,
  comparePeriods,
  findObservation,
  formatPercent,
  formatUsd,
  toPeriod,
} from './calculation';
import type {
  HomeValueUsFieldErrors,
  HomeValueUsInput,
  HomeValueUsResult,
  IndexSeriesSnapshot,
} from './types';
import { periodLabel } from './types';

export interface HomeValueUsValidation {
  isValid: boolean;
  errors: HomeValueUsFieldErrors;
  result: HomeValueUsResult | null;
}

function parsePrice(raw: string): {
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateHomeValueUsInput(
  input: HomeValueUsInput,
  homeIndex: IndexSeriesSnapshot | null,
  cpi: IndexSeriesSnapshot | null,
  metroLabel: string
): HomeValueUsValidation {
  const errors: HomeValueUsFieldErrors = {};

  if (!input.metroId.trim()) {
    errors.metroId = 'Select a metropolitan area.';
  }
  if (!homeIndex) {
    errors.data =
      'Home price index data is not loaded for the selected metro yet.';
  }

  if (!input.purchaseYear.trim()) {
    errors.purchaseYear = 'Select a purchase year.';
  }
  if (!input.purchaseMonth.trim()) {
    errors.purchaseMonth = 'Select a purchase month.';
  }

  const price = parsePrice(input.purchasePrice);
  if (price.blank) {
    errors.purchasePrice = 'Enter the home purchase price.';
  } else if (price.invalid || price.value === null) {
    errors.purchasePrice = 'Enter a valid purchase price.';
  } else if (price.value < 0) {
    errors.purchasePrice = 'Purchase price cannot be negative.';
  }

  let valuationYear = input.valuationYear;
  let valuationMonth = input.valuationMonth;
  if (input.valuationMode === 'present') {
    if (homeIndex) {
      const [y, m] = homeIndex.latestPeriod.split('-');
      valuationYear = y ?? '';
      valuationMonth = m ?? '';
    }
  } else {
    if (!input.valuationYear.trim()) {
      errors.valuationYear = 'Select a valuation year.';
    }
    if (!input.valuationMonth.trim()) {
      errors.valuationMonth = 'Select a valuation month.';
    }
  }

  const purchasePeriod =
    input.purchaseYear && input.purchaseMonth
      ? toPeriod(Number(input.purchaseYear), Number(input.purchaseMonth))
      : null;
  const valuationPeriod =
    valuationYear && valuationMonth
      ? toPeriod(Number(valuationYear), Number(valuationMonth))
      : null;

  if (homeIndex && purchasePeriod) {
    if (
      comparePeriods(purchasePeriod, homeIndex.firstPeriod) < 0 ||
      comparePeriods(purchasePeriod, homeIndex.latestPeriod) > 0
    ) {
      errors.purchaseYear = `Purchase date must fall between ${periodLabel(homeIndex.firstPeriod)} and ${periodLabel(homeIndex.latestPeriod)}.`;
    } else if (!findObservation(homeIndex.observations, purchasePeriod)) {
      errors.purchaseMonth =
        'No Case-Shiller observation is available for that purchase month.';
    }
  }

  if (homeIndex && valuationPeriod && input.valuationMode === 'past') {
    if (
      comparePeriods(valuationPeriod, homeIndex.firstPeriod) < 0 ||
      comparePeriods(valuationPeriod, homeIndex.latestPeriod) > 0
    ) {
      errors.valuationYear = `Valuation date must fall between ${periodLabel(homeIndex.firstPeriod)} and ${periodLabel(homeIndex.latestPeriod)}.`;
    } else if (!findObservation(homeIndex.observations, valuationPeriod)) {
      errors.valuationMonth =
        'No Case-Shiller observation is available for that valuation month.';
    }
  }

  if (Object.keys(errors).length > 0 || !homeIndex || price.value === null) {
    return { isValid: false, errors, result: null };
  }

  if (!purchasePeriod || !valuationPeriod) {
    return {
      isValid: false,
      errors: { form: 'Purchase and valuation dates are required.' },
      result: null,
    };
  }

  const purchaseObs = findObservation(homeIndex.observations, purchasePeriod);
  const valuationObs = findObservation(homeIndex.observations, valuationPeriod);
  if (!purchaseObs || !valuationObs) {
    return {
      isValid: false,
      errors: {
        data: 'Required home price index observations are unavailable.',
      },
      result: null,
    };
  }

  const estimated = calculateIndexedHomeValue(
    price.value,
    purchaseObs.value,
    valuationObs.value
  );
  if (estimated === null) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate an indexed home value.' },
      result: null,
    };
  }

  const nominalDollar = calculateNominalDollarChange(estimated, price.value);
  const nominalPercent = calculateNominalPercentageChange(
    estimated,
    price.value
  );

  let inflationAdjusted: number | null = null;
  let realDollar: number | null = null;
  let realPercent: number | null = null;
  let purchaseCpi: number | null = null;
  let valuationCpi: number | null = null;
  let cpiSource: string | null = null;
  let cpiFredId: string | null = null;

  if (cpi) {
    const pCpi = findObservation(cpi.observations, purchasePeriod);
    let vCpi = findObservation(cpi.observations, valuationPeriod);
    // If CPI lags the HPI latest month, use the latest common CPI period ≤ valuation
    if (!vCpi) {
      const earlier = [...cpi.observations]
        .reverse()
        .find((o) => comparePeriods(o.period, valuationPeriod) <= 0);
      if (earlier) vCpi = earlier;
    }
    if (pCpi && vCpi) {
      purchaseCpi = pCpi.value;
      valuationCpi = vCpi.value;
      inflationAdjusted = calculateInflationAdjustedPurchasePrice(
        price.value,
        pCpi.value,
        vCpi.value
      );
      if (inflationAdjusted !== null) {
        realDollar = calculateRealDollarChange(estimated, inflationAdjusted);
        realPercent = calculateRealPercentageChange(
          valuationObs.value / purchaseObs.value,
          vCpi.value / pCpi.value
        );
      }
      cpiSource = cpi.source;
      cpiFredId = cpi.fredSeriesId;
    }
  }

  const retrospective = comparePeriods(valuationPeriod, purchasePeriod) < 0;
  const direction =
    estimated > price.value
      ? 'increased'
      : estimated < price.value
        ? 'decreased'
        : 'was unchanged';

  const explanation = retrospective
    ? `Applying the ${metroLabel} Case-Shiller index ratio from ${periodLabel(purchasePeriod)} back to ${periodLabel(valuationPeriod)} produces a retrospective indexed estimate. This is not an earlier transaction price or appraisal.`
    : `The selected metropolitan home price index ${direction} between ${periodLabel(purchasePeriod)} and ${periodLabel(valuationPeriod)}. Applying that index change to the entered purchase price produces the estimated value shown above. Actual sale prices for a specific home can differ due to condition, neighborhood, renovations, and other factors.`;

  const result: HomeValueUsResult = {
    metroLabel,
    purchasePeriod,
    valuationPeriod,
    purchasePrice: price.value,
    purchaseIndex: purchaseObs.value,
    valuationIndex: valuationObs.value,
    estimatedHomeValue: estimated,
    nominalDollarChange: nominalDollar ?? 0,
    nominalPercentChange: nominalPercent,
    inflationAdjustedPurchasePrice: inflationAdjusted,
    realDollarChange: realDollar,
    realPercentChange: realPercent,
    purchaseCpi,
    valuationCpi,
    homeIndexSource: homeIndex.source,
    cpiSource,
    homeIndexFredId: homeIndex.fredSeriesId,
    cpiFredId,
    retrospective,
    staleData: Boolean(homeIndex.stale || cpi?.stale),
    explanation,
    formattedPurchasePrice: formatUsd(price.value),
    formattedEstimatedValue: formatUsd(estimated),
    formattedNominalDollar: formatUsd(nominalDollar ?? 0),
    formattedNominalPercent:
      nominalPercent === null ? null : formatPercent(nominalPercent),
    formattedInflationAdjustedPurchase:
      inflationAdjusted === null ? null : formatUsd(inflationAdjusted),
    formattedRealDollar: realDollar === null ? null : formatUsd(realDollar),
    formattedRealPercent:
      realPercent === null ? null : formatPercent(realPercent),
  };

  return { isValid: true, errors, result };
}
