import {
  US_CPI_BASE,
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_RETRIEVED_AT,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
  US_CPI_SOURCE_URL,
} from '../buying-power/us-cpi-u-annual';
import {
  averageAnnualInflationPercent,
  buildCustomProjectionPoints,
  buildHistoricalChartPoints,
  calculateCustomAdjusted,
  calculateHistoricalAdjusted,
  cumulativeInflationPercent,
  formatCpi,
  formatFactor,
  formatPercent,
  formatUsd,
  historicalPurchasingPowerFactor,
  resolveHistoricalCpi,
  timePeriodToYears,
} from './calculation';
import type {
  InflationFieldErrors,
  InflationInput,
  InflationResult,
} from './types';

export interface InflationValidation {
  isValid: boolean;
  errors: InflationFieldErrors;
  result: InflationResult | null;
}

function parseFinite(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
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

function parseYear(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim();
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (!/^\d{4}$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

const SOURCE_SUMMARY = `${US_CPI_SOURCE_NAME} · ${US_CPI_SERIES_ID} · CPI-U annual average · ${US_CPI_BASE} · ${US_CPI_MIN_YEAR}–${US_CPI_MAX_YEAR} · retrieved ${US_CPI_RETRIEVED_AT} · ${US_CPI_SOURCE_URL}`;

export function validateInflationInput(
  input: InflationInput
): InflationValidation {
  const errors: InflationFieldErrors = {};

  const amount = parseFinite(input.originalAmount);
  if (amount.blank) errors.originalAmount = 'Enter an original amount.';
  else if (amount.invalid || amount.value === null)
    errors.originalAmount = 'Enter a valid amount.';
  else if (amount.value < 0)
    errors.originalAmount = 'Amount cannot be negative.';

  if (input.dataMode === 'historical') {
    if (input.frequency === 'quarterly') {
      errors.frequency =
        'Quarterly CPI averages require monthly BLS CUUR0000SA0 observations. This build embeds annual averages only — switch Frequency to Yearly or use Custom data.';
      return { isValid: false, errors, result: null };
    }

    if (errors.originalAmount) {
      return { isValid: false, errors, result: null };
    }

    const refY = parseYear(input.referenceYear);
    const tgtY = parseYear(input.targetYear);

    if (refY.blank) errors.referenceYear = 'Select a reference year.';
    else if (
      refY.invalid ||
      refY.value === null ||
      resolveHistoricalCpi(refY.value) == null
    ) {
      errors.referenceYear = 'No CPI data is available for the selected year.';
    }

    if (tgtY.blank) errors.targetYear = 'Select a target year.';
    else if (
      tgtY.invalid ||
      tgtY.value === null ||
      resolveHistoricalCpi(tgtY.value) == null
    ) {
      errors.targetYear = 'No CPI data is available for the selected year.';
    }

    if (errors.referenceYear || errors.targetYear) {
      return { isValid: false, errors, result: null };
    }

    const referenceCPI = resolveHistoricalCpi(refY.value!)!;
    const targetCPI = resolveHistoricalCpi(tgtY.value!)!;
    let adjusted: number;
    try {
      adjusted = calculateHistoricalAdjusted(
        amount.value!,
        referenceCPI,
        targetCPI
      );
    } catch (e) {
      errors.form =
        e instanceof Error ? e.message : 'Unable to calculate inflation.';
      return { isValid: false, errors, result: null };
    }

    const cumulative = cumulativeInflationPercent(referenceCPI, targetCPI);
    const yearsElapsed = Math.abs(tgtY.value! - refY.value!);
    const annualized = averageAnnualInflationPercent(
      referenceCPI,
      targetCPI,
      yearsElapsed
    );
    const ppFactor = historicalPurchasingPowerFactor(referenceCPI, targetCPI);
    const monetaryChange = adjusted - amount.value!;
    const sameYear = refY.value === tgtY.value;

    const steps = [
      `Identify original amount = ${formatUsd(amount.value!)}.`,
      `Identify reference CPI (${refY.value}) = ${formatCpi(referenceCPI)}.`,
      `Identify target CPI (${tgtY.value}) = ${formatCpi(targetCPI)}.`,
      'Apply Adjusted = Amount × (CPI_target / CPI_reference).',
      `Substitute: ${formatUsd(amount.value!)} × (${formatCpi(targetCPI)} / ${formatCpi(referenceCPI)}).`,
      `Result: ${formatUsd(adjusted)}; cumulative inflation ${formatPercent(cumulative)}.`,
    ];

    const interpretation = sameYear
      ? 'The selected years are identical, so the inflation-adjusted amount is unchanged.'
      : `An amount of ${formatUsd(amount.value!)} in ${refY.value} would require approximately ${formatUsd(adjusted)} in ${tgtY.value} to purchase an equivalent CPI basket, based on US CPI-U annual averages.`;

    const result: InflationResult = {
      dataMode: 'historical',
      originalAmount: amount.value!,
      adjustedAmount: adjusted,
      cumulativeInflationPercent: cumulative,
      annualizedInflationPercent: annualized,
      purchasingPowerFactor: ppFactor,
      monetaryChange,
      referenceLabel: String(refY.value),
      targetLabel: String(tgtY.value),
      referenceCPI,
      targetCPI,
      yearsElapsed: sameYear ? 0 : yearsElapsed,
      annualRatePercent: null,
      formattedOriginal: formatUsd(amount.value!),
      formattedAdjusted: formatUsd(adjusted),
      formattedCumulative: formatPercent(cumulative),
      formattedAnnualized:
        annualized == null ? 'N/A (same year)' : formatPercent(annualized),
      formattedPurchasingPowerFactor: formatFactor(ppFactor),
      formattedMonetaryChange: formatUsd(monetaryChange),
      interpretation,
      explanation:
        'Purchasing-power factor is CPI_reference / CPI_target (remaining power of $1 held without return). Adjusted amount is the nominal dollars needed for equal purchasing power.',
      formulaBreakdown: `Adjusted = ${formatUsd(amount.value!)} × (${formatCpi(targetCPI)} / ${formatCpi(referenceCPI)}) = ${formatUsd(adjusted)}`,
      steps,
      sourceSummary: SOURCE_SUMMARY,
      chart: {
        kind: 'historical-cpi',
        points: buildHistoricalChartPoints(refY.value!, tgtY.value!),
        referenceYear: refY.value!,
        targetYear: tgtY.value!,
        note: `Actual embedded annual-average CPI-U (${US_CPI_SERIES_ID}) between the selected years.`,
      },
    };

    return { isValid: true, errors, result };
  }

  // Custom mode
  if (errors.originalAmount) {
    return { isValid: false, errors, result: null };
  }

  const rate = parseFinite(input.annualInflationRate);
  if (rate.blank) errors.annualInflationRate = 'Enter an annual inflation rate.';
  else if (rate.invalid || rate.value === null)
    errors.annualInflationRate = 'Enter a valid inflation rate.';
  else if (rate.value <= -100)
    errors.annualInflationRate =
      'Inflation rate must be greater than −100% for this compounding model.';

  const period = parseFinite(input.timePeriod);
  if (period.blank) errors.timePeriod = 'Enter a time period.';
  else if (period.invalid || period.value === null)
    errors.timePeriod = 'Enter a valid time period.';
  else if (period.value < 0)
    errors.timePeriod = 'Time period cannot be negative.';

  if (errors.annualInflationRate || errors.timePeriod) {
    return { isValid: false, errors, result: null };
  }

  let years: number;
  try {
    years = timePeriodToYears(period.value!, input.timeUnit);
  } catch (e) {
    errors.timePeriod =
      e instanceof Error ? e.message : 'Invalid time period.';
    return { isValid: false, errors, result: null };
  }

  let custom;
  try {
    custom = calculateCustomAdjusted(amount.value!, rate.value!, years);
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to calculate custom inflation.';
    return { isValid: false, errors, result: null };
  }

  const unitLabel =
    input.timeUnit === 'years'
      ? 'years'
      : input.timeUnit === 'months'
        ? 'months'
        : 'quarters';

  const steps = [
    `Identify original amount = ${formatUsd(amount.value!)}.`,
    `Identify annual inflation rate = ${rate.value}% (${rate.value! / 100} as a decimal).`,
    `Convert time ${period.value} ${unitLabel} → ${formatFactor(years)} years.`,
    'Apply FV = PV × (1 + r)^t (compound inflation estimate).',
    `Substitute: ${formatUsd(amount.value!)} × (1 + ${rate.value! / 100})^${formatFactor(years)}.`,
    `Result: ${formatUsd(custom.adjustedAmount)}; purchasing-power factor ${formatFactor(custom.purchasingPowerFactor)}.`,
  ];

  const result: InflationResult = {
    dataMode: 'custom',
    originalAmount: amount.value!,
    adjustedAmount: custom.adjustedAmount,
    cumulativeInflationPercent: custom.cumulativeInflationPercent,
    annualizedInflationPercent: rate.value!,
    purchasingPowerFactor: custom.purchasingPowerFactor,
    monetaryChange: custom.monetaryChange,
    referenceLabel: 'Today (assumed start)',
    targetLabel: `After ${period.value} ${unitLabel}`,
    referenceCPI: null,
    targetCPI: null,
    yearsElapsed: years,
    annualRatePercent: rate.value!,
    formattedOriginal: formatUsd(amount.value!),
    formattedAdjusted: formatUsd(custom.adjustedAmount),
    formattedCumulative: formatPercent(custom.cumulativeInflationPercent),
    formattedAnnualized: formatPercent(rate.value!),
    formattedPurchasingPowerFactor: formatFactor(custom.purchasingPowerFactor),
    formattedMonetaryChange: formatUsd(custom.monetaryChange),
    interpretation: `At a constant ${rate.value}% annual inflation rate for ${period.value} ${unitLabel}, ${formatUsd(amount.value!)} would require about ${formatUsd(custom.adjustedAmount)} for equivalent purchasing power. This is a model-based estimate, not a forecast.`,
    explanation:
      'Purchasing-power factor 1/(1+r)^t is the remaining power of $1 held without return. The adjusted amount is the future nominal dollars needed for the same basket under constant inflation.',
    formulaBreakdown: `FV = ${formatUsd(amount.value!)} × (1 + ${rate.value! / 100})^${formatFactor(years)} = ${formatUsd(custom.adjustedAmount)}`,
    steps,
    sourceSummary:
      'Custom annual inflation assumption — not a historical BLS CPI observation.',
    chart: {
      kind: 'custom-projection',
      points: buildCustomProjectionPoints(
        amount.value!,
        rate.value!,
        years
      ),
      note: 'Model-based projection using the supplied constant annual inflation rate — not historical CPI data.',
    },
  };

  return { isValid: true, errors, result };
}
