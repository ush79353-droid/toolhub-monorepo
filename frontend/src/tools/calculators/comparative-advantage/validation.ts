import {
  advantageStatus,
  calculateComparativeAdvantage,
  formatNumber,
  formatOc,
  producerLabel,
} from './calculation';
import type {
  ComparativeAdvantageFieldErrors,
  ComparativeAdvantageInput,
  ComparativeAdvantageResult,
} from './types';

export interface ComparativeAdvantageValidation {
  isValid: boolean;
  errors: ComparativeAdvantageFieldErrors;
  result: ComparativeAdvantageResult | null;
}

function parsePositive(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  nonPositive: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false, nonPositive: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, nonPositive: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, nonPositive: false };
  }
  if (value <= 0) {
    return { value: null, blank: false, invalid: false, nonPositive: true };
  }
  return { value, blank: false, invalid: false, nonPositive: false };
}

function requirePositive(
  raw: string,
  blankMsg: string,
  invalidMsg: string,
  nonPosMsg: string
): { value: number | null; error?: string } {
  const p = parsePositive(raw);
  if (p.blank) return { value: null, error: blankMsg };
  if (p.invalid) return { value: null, error: invalidMsg };
  if (p.nonPositive) return { value: null, error: nonPosMsg };
  return { value: p.value };
}

export function validateComparativeAdvantageInput(
  input: ComparativeAdvantageInput
): ComparativeAdvantageValidation {
  const errors: ComparativeAdvantageFieldErrors = {};
  let hasError = false;

  const xa = requirePositive(
    input.countryXGoodA,
    'Enter Country X output of Good A per labor unit.',
    'Enter a valid Good A productivity for Country X.',
    'Productivity must be greater than zero.'
  );
  if (xa.error) {
    errors.countryXGoodA = xa.error;
    hasError = true;
  }
  const xb = requirePositive(
    input.countryXGoodB,
    'Enter Country X output of Good B per labor unit.',
    'Enter a valid Good B productivity for Country X.',
    'Productivity must be greater than zero.'
  );
  if (xb.error) {
    errors.countryXGoodB = xb.error;
    hasError = true;
  }
  const ya = requirePositive(
    input.countryYGoodA,
    'Enter Country Y output of Good A per labor unit.',
    'Enter a valid Good A productivity for Country Y.',
    'Productivity must be greater than zero.'
  );
  if (ya.error) {
    errors.countryYGoodA = ya.error;
    hasError = true;
  }
  const yb = requirePositive(
    input.countryYGoodB,
    'Enter Country Y output of Good B per labor unit.',
    'Enter a valid Good B productivity for Country Y.',
    'Productivity must be greater than zero.'
  );
  if (yb.error) {
    errors.countryYGoodB = yb.error;
    hasError = true;
  }

  const h = requirePositive(
    input.laborEndowment,
    'Enter the common labor endowment for PPF intercepts.',
    'Enter a valid labor endowment.',
    'Labor endowment must be greater than zero.'
  );
  if (h.error) {
    errors.laborEndowment = h.error;
    hasError = true;
  }

  if (
    hasError ||
    xa.value == null ||
    xb.value == null ||
    ya.value == null ||
    yb.value == null ||
    h.value == null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateComparativeAdvantage(
    xa.value,
    xb.value,
    ya.value,
    yb.value
  );
  if (!math) {
    errors.form = 'Unable to compute comparative advantage from these inputs.';
    return { isValid: false, errors, result: null };
  }

  const goodA = input.goodALabel.trim() || 'Good A';
  const goodB = input.goodBLabel.trim() || 'Good B';

  const summaryParts: string[] = [];
  if (math.comparativeA === 'tie') {
    summaryParts.push(`${goodA}: equal opportunity cost (no unique advantage)`);
  } else {
    summaryParts.push(`${goodA}: ${producerLabel(math.comparativeA)}`);
  }
  if (math.comparativeB === 'tie') {
    summaryParts.push(`${goodB}: equal opportunity cost (no unique advantage)`);
  } else {
    summaryParts.push(`${goodB}: ${producerLabel(math.comparativeB)}`);
  }

  let termsNote: string | null = null;
  if (math.termsOfTrade) {
    termsNote = `A mutually beneficial terms-of-trade interval for ${goodA} (in units of ${goodB} per ${goodA}) can lie strictly between ${formatNumber(math.termsOfTrade.low)} and ${formatNumber(math.termsOfTrade.high)}, under the linear two-good model — not a guaranteed market price.`;
  }

  const result: ComparativeAdvantageResult = {
    ocXA: math.ocXA,
    ocXB: math.ocXB,
    ocYA: math.ocYA,
    ocYB: math.ocYB,
    comparativeA: math.comparativeA,
    comparativeB: math.comparativeB,
    absoluteA: math.absoluteA,
    absoluteB: math.absoluteB,
    specializeX: math.specializeX,
    specializeY: math.specializeY,
    termsOfTradeLow: math.termsOfTrade?.low ?? null,
    termsOfTradeHigh: math.termsOfTrade?.high ?? null,
    labelXA: formatNumber(xa.value),
    labelXB: formatNumber(xb.value),
    labelYA: formatNumber(ya.value),
    labelYB: formatNumber(yb.value),
    labelCompXA: advantageStatus('countryX', math.comparativeA),
    labelCompXB: advantageStatus('countryX', math.comparativeB),
    labelCompYA: advantageStatus('countryY', math.comparativeA),
    labelCompYB: advantageStatus('countryY', math.comparativeB),
    formattedOcXA: formatOc(math.ocXA, goodB),
    formattedOcXB: formatOc(math.ocXB, goodA),
    formattedOcYA: formatOc(math.ocYA, goodB),
    formattedOcYB: formatOc(math.ocYB, goodA),
    summary: summaryParts.join(' · '),
    explanation:
      math.comparativeA !== 'tie' && math.comparativeB !== 'tie'
        ? `${producerLabel(math.comparativeA)} has the lower opportunity cost of ${goodA}, while ${producerLabel(math.comparativeB)} has the lower opportunity cost of ${goodB}. Under the model's assumptions, specialization and trade can allow both countries to benefit — but gains need not be equal for all individuals.`
        : 'When opportunity costs are equal for a good, neither country has a unique comparative advantage in that good.',
    absoluteSummary: `${goodA}: ${producerLabel(math.absoluteA)} · ${goodB}: ${producerLabel(math.absoluteB)}`,
    termsOfTradeNote: termsNote,
    ppf: {
      laborH: h.value,
      xAMax: h.value * xa.value,
      xBMax: h.value * xb.value,
      yAMax: h.value * ya.value,
      yBMax: h.value * yb.value,
    },
    formulaBreakdown: `OC_X,A=${xb.value}/${xa.value}=${math.ocXA}; OC_X,B=${xa.value}/${xb.value}=${math.ocXB}; OC_Y,A=${yb.value}/${ya.value}=${math.ocYA}; OC_Y,B=${ya.value}/${yb.value}=${math.ocYB}`,
  };

  return { isValid: true, errors, result };
}
