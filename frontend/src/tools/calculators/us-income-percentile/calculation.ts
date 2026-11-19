import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  INDIVIDUAL_OPEN_INTERVAL_START,
  datasetFor,
} from './datasets';
import type {
  IncomeType,
  UsIncomePercentileResult,
} from './types';

export function roundPercentile(value: number): number {
  return Math.round(value * 10) / 10;
}

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/[$,]/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function formatUsd(amount: number): string {
  return formatCurrencyValue(amount, 'USD');
}

function populationNoun(incomeType: IncomeType, plural = true): string {
  if (incomeType === 'household') return plural ? 'households' : 'household';
  return plural ? 'people with individual money income' : 'person';
}

/**
 * Linear interpolation between published cumulative points.
 * Does not extend past the first or last published income.
 */
export function interpolatePercentile(
  income: number,
  brackets: readonly { income: number; percentile: number }[],
): number | null {
  if (!Number.isFinite(income) || brackets.length < 2) return null;
  const first = brackets[0]!;
  const last = brackets[brackets.length - 1]!;
  if (income < first.income || income > last.income) return null;
  for (let i = 0; i < brackets.length; i += 1) {
    const point = brackets[i]!;
    if (income === point.income) return point.percentile;
    if (income < point.income) {
      const prev = brackets[i - 1]!;
      const span = point.income - prev.income;
      if (!(span > 0)) return point.percentile;
      const share = (income - prev.income) / span;
      return prev.percentile + share * (point.percentile - prev.percentile);
    }
  }
  return last.percentile;
}

export function calculateIncomePercentile(input: {
  incomeType: IncomeType;
  annualIncome: number;
}): UsIncomePercentileResult | null {
  const { incomeType, annualIncome } = input;
  if (!Number.isFinite(annualIncome) || annualIncome < 0) return null;

  const dataset = datasetFor(incomeType);
  const published = dataset.brackets;
  const first = published[0]!;
  const last = published[published.length - 1]!;
  const curve =
    incomeType === 'individual'
      ? [{ income: 0, percentile: 0 }, ...published]
      : published;
  const money = formatUsd(annualIncome);

  const base = {
    incomeType,
    annualIncome,
    medianIncome: dataset.medianIncome,
    meanIncome: dataset.meanIncome,
    referenceYear: dataset.referenceYear,
    source: dataset.source,
    populationLabel: dataset.populationLabel,
  };

  if (annualIncome === 0) {
    return {
      ...base,
      percentile: null,
      rangeStatus: 'zero',
      percentageBelow: null,
      percentageAbove: null,
      rangeNote:
        incomeType === 'individual'
          ? 'PINC-01 ranks people with money income. Zero is outside that distribution. The first published bin also mixes losses with $1 to $2,499, so a percentile is not assigned at $0.'
          : 'Table A-4a starts at the 10th percentile. $0 is below the lowest published household threshold, so a percentile is not estimated.',
      explanation: `An annual income of ${money} is below the reliable ${dataset.referenceYear} range for ${dataset.populationLabel}. Median ${incomeType} income that year was ${formatUsd(dataset.medianIncome)}.`,
    };
  }

  const aboveOpenIndividual =
    incomeType === 'individual' && annualIncome >= INDIVIDUAL_OPEN_INTERVAL_START;
  const belowPublished =
    incomeType === 'household' ? annualIncome < first.income : false;

  if (belowPublished || aboveOpenIndividual || annualIncome > last.income) {
    const above = annualIncome > last.income || aboveOpenIndividual;
    const floor = above ? roundPercentile(last.percentile) : null;
    return {
      ...base,
      percentile: floor,
      rangeStatus: above ? 'above' : 'below',
      percentageBelow: floor,
      percentageAbove: floor === null ? null : roundPercentile(100 - floor),
      rangeNote: above
        ? incomeType === 'individual'
          ? `$${INDIVIDUAL_OPEN_INTERVAL_START.toLocaleString('en-US')} and above is an open interval in PINC-01. About ${roundPercentile(last.percentile)}% of people with income fall at or below $${last.income.toLocaleString('en-US')}. A finer rank inside the top interval is not published.`
          : `Above the highest published threshold (${formatUsd(last.income)}, ${last.percentile}th percentile). Table A-4a does not publish a more detailed top-end rank.`
        : `Below the lowest published threshold (${formatUsd(first.income)}, ${first.percentile}th percentile). A lower percentile is not estimated.`,
      explanation: above
        ? `${money} is above the top published ${dataset.referenceYear} threshold for ${dataset.populationLabel}.`
        : `${money} is below the lowest published ${dataset.referenceYear} threshold for ${dataset.populationLabel}.`,
    };
  }

  const raw = interpolatePercentile(annualIncome, curve);
  if (raw === null) return null;
  const percentile = roundPercentile(raw);
  const above = roundPercentile(100 - percentile);
  const who = populationNoun(incomeType);
  return {
    ...base,
    percentile,
    rangeStatus: 'inside',
    percentageBelow: percentile,
    percentageAbove: above,
    rangeNote:
      incomeType === 'individual'
        ? 'Approximate rank from linear interpolation inside Census $2,500 person-income bins. The first bin includes losses.'
        : 'Approximate rank from linear interpolation between Census Table A-4a percentile thresholds.',
    explanation: `Your annual income of ${money} is about the ${percentile}th percentile among ${who} in ${dataset.referenceYear}. That is higher than about ${percentile}% of that group, and about ${above}% are higher.`,
  };
}

export function shareIncomePercentileText(
  result: UsIncomePercentileResult,
): string {
  const lines = [
    'US Income Percentile Calculator',
    `Income type: ${result.incomeType}`,
    `Annual income: ${formatUsd(result.annualIncome)}`,
    `Reference year: ${result.referenceYear}`,
    `Median: ${formatUsd(result.medianIncome)}`,
    `Mean: ${formatUsd(result.meanIncome)}`,
  ];
  if (result.percentile === null) {
    lines.push('Percentile: not estimated (outside published range)');
  } else {
    lines.push(`Percentile: ${result.percentile}`);
    if (result.percentageBelow !== null) {
      lines.push(`Percentage at or below: ${result.percentageBelow}`);
    }
    if (result.percentageAbove !== null && result.rangeStatus === 'inside') {
      lines.push(`Percentage above: ${result.percentageAbove}`);
    }
  }
  lines.push(result.rangeNote);
  return lines.join('\n');
}
