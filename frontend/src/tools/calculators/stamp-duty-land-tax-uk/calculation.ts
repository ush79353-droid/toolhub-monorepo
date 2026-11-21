/**
 * England & NI residential SDLT estimator — pure engine (ADR-018).
 *
 * Marginal bands (not flat rate). First-time buyer relief when eligible and
 * price ≤ schedule.firstTimeBuyerMaxPrice. Higher rates (+5 pp from 1 Apr 2025)
 * for additional / let-or-flip. Non-UK resident +2 pp on every band rate.
 * Fixed GBP; no FX. Not Scotland/Wales.
 */

import {
  DEFAULT_SDLT_SCHEDULE,
  buyerScenarioLabel,
  usesHigherRates,
  type SdltBand,
  type SdltBuyerScenario,
  type SdltRateSchedule,
  type SdltResidency,
} from './rates';
import type {
  SdltBandBreakdownRow,
  StampDutyLandTaxUkInput,
  StampDutyLandTaxUkResult,
} from './types';

export function roundGbp(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatGbp(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatRatePercent(rate: number): string {
  const pct = rate * 100;
  const rounded = Math.round((pct + Number.EPSILON) * 100) / 100;
  return `${rounded.toLocaleString('en-GB', {
    maximumFractionDigits: 2,
  })}%`;
}

function parseMoney(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function applySurcharges(
  baseRate: number,
  higher: boolean,
  nonResident: boolean,
  schedule: SdltRateSchedule,
): number {
  let rate = baseRate;
  if (higher) rate += schedule.higherRatesSurchargePp;
  if (nonResident) rate += schedule.nonResidentSurchargePp;
  return rate;
}

function taxOnBands(
  price: number,
  bands: readonly SdltBand[],
  higher: boolean,
  nonResident: boolean,
  schedule: SdltRateSchedule,
): { total: number; rows: SdltBandBreakdownRow[] } {
  const rows: SdltBandBreakdownRow[] = [];
  let remaining = price;
  let lower = 0;
  let total = 0;

  for (const band of bands) {
    if (remaining <= 0) break;
    const upper = band.upTo;
    const width =
      upper === Number.POSITIVE_INFINITY
        ? remaining
        : Math.max(0, Math.min(remaining, upper - lower));
    if (width <= 0) {
      lower = upper;
      continue;
    }
    const rate = applySurcharges(
      band.rate,
      higher,
      nonResident,
      schedule,
    );
    const tax = roundGbp(width * rate);
    total = roundGbp(total + tax);
    rows.push({
      label: band.label,
      portion: width,
      rate,
      tax,
      formattedPortion: formatGbp(width),
      formattedRate: formatRatePercent(rate),
      formattedTax: formatGbp(tax),
    });
    remaining = roundGbp(remaining - width);
    lower = upper;
  }

  return { total, rows };
}

export interface SdltNumericInputs {
  buyerScenario: SdltBuyerScenario;
  residency: SdltResidency;
  propertyPrice: number;
  schedule?: SdltRateSchedule;
}

export function calculateStampDutyLandTaxUk(
  inputs: SdltNumericInputs,
): StampDutyLandTaxUkResult | null {
  const schedule = inputs.schedule ?? DEFAULT_SDLT_SCHEDULE;
  const { buyerScenario, residency, propertyPrice } = inputs;

  if (!Number.isFinite(propertyPrice) || propertyPrice < 0) return null;

  const nonResident = residency === 'non_uk';
  const higher = usesHigherRates(buyerScenario);
  const ftbEligible =
    buyerScenario === 'first_time_buyer' &&
    propertyPrice <= schedule.firstTimeBuyerMaxPrice &&
    !higher;

  const bands = ftbEligible
    ? schedule.firstTimeBuyerBands
    : schedule.standardBands;

  const { total, rows } = taxOnBands(
    propertyPrice,
    bands,
    higher,
    nonResident,
    schedule,
  );

  const steps: string[] = [
    `Schedule: ${schedule.label} (${schedule.sourceNote})`,
    `Buyer: ${buyerScenarioLabel(buyerScenario)}; residency: ${
      nonResident ? 'Non-UK resident' : 'UK resident'
    }.`,
    `Property price: £${formatGbp(propertyPrice)}.`,
  ];

  if (buyerScenario === 'first_time_buyer') {
    if (ftbEligible) {
      steps.push(
        `First-time buyer relief applied (price ≤ £${formatGbp(schedule.firstTimeBuyerMaxPrice)}).`,
      );
    } else if (propertyPrice > schedule.firstTimeBuyerMaxPrice) {
      steps.push(
        `Price above £${formatGbp(schedule.firstTimeBuyerMaxPrice)} — first-time buyer relief not available; standard bands used.`,
      );
    }
  }

  if (higher) {
    steps.push(
      `Higher rates for additional dwellings applied (+${formatRatePercent(schedule.higherRatesSurchargePp)} on each band).`,
    );
  }
  if (nonResident) {
    steps.push(
      `Non-UK resident surcharge applied (+${formatRatePercent(schedule.nonResidentSurchargePp)} on each band).`,
    );
  }

  for (const row of rows) {
    steps.push(
      `${row.label}: £${row.formattedPortion} × ${row.formattedRate} = £${row.formattedTax}`,
    );
  }
  steps.push(`Total stamp duty: £${formatGbp(total)}`);

  const interpretation = `Estimated SDLT is £${formatGbp(total)} on a £${formatGbp(propertyPrice)} purchase (${buyerScenarioLabel(buyerScenario)}, ${
    nonResident ? 'non-UK' : 'UK'
  } resident).`;

  const explanation = ftbEligible
    ? 'First-time buyer relief uses 0% up to £300,000 and 5% from £300,001 to £500,000 (plus any non-resident surcharge).'
    : higher
      ? 'Higher rates add 5 percentage points to each standard residential band (from 1 April 2025).'
      : 'Standard residential marginal bands apply for a single main home / moving home replacement.';

  return {
    propertyPrice,
    buyerScenario,
    residency,
    scheduleId: schedule.id,
    scheduleLabel: schedule.label,
    usedFirstTimeBuyerRelief: ftbEligible,
    usedHigherRates: higher,
    nonResidentSurchargeApplied: nonResident,
    stampDuty: total,
    formattedStampDuty: formatGbp(total),
    formattedPropertyPrice: formatGbp(propertyPrice),
    bands: rows,
    steps,
    interpretation,
    explanation,
    disclaimer:
      'Educational estimate for England and Northern Ireland residential purchases only. Not Scotland (LBTT) or Wales (LTT). Special rules (companies, trusts, shared ownership, linked purchases, leases NPV) are not modelled. Confirm with HMRC or a qualified adviser.',
  };
}

export function calculateStampDutyLandTaxUkFromInput(
  input: StampDutyLandTaxUkInput,
  schedule?: SdltRateSchedule,
): StampDutyLandTaxUkResult | null {
  const price = parseMoney(input.propertyPrice);
  if (price == null) return null;
  return calculateStampDutyLandTaxUk({
    buyerScenario: input.buyerScenario,
    residency: input.residency,
    propertyPrice: price,
    schedule,
  });
}

export function shareResultText(
  result: StampDutyLandTaxUkResult,
  title: string,
  url: string,
): string {
  return [
    title,
    '',
    `Buyer: ${buyerScenarioLabel(result.buyerScenario)}`,
    `Residency: ${result.residency === 'uk' ? 'UK resident' : 'Non-UK resident'}`,
    `Property price: £${result.formattedPropertyPrice}`,
    `Stamp duty: £${result.formattedStampDuty}`,
    `Rates: ${result.scheduleLabel}`,
    '',
    result.interpretation,
    result.disclaimer,
    '',
    'Omega Calculators',
    url,
  ].join('\n');
}
