import {
  calculateGiniCoefficient,
  calculateGiniFromIncomes,
  formatGini,
  formatIndex,
  giniIndexFromCoefficient,
  illustrativeLorenzFromGini,
  interpretGini,
  lorenzFromIncomes,
  parseIncomesText,
} from './calculation';
import type {
  GiniFieldErrors,
  GiniInput,
  GiniResult,
} from './types';

export interface GiniValidation {
  isValid: boolean;
  errors: GiniFieldErrors;
  result: GiniResult | null;
}

function parseNonNegative(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  negative: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, negative: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  if (value < 0) {
    return { value: null, blank: false, invalid: false, negative: true };
  }
  return { value, blank: false, invalid: false, negative: false };
}

export function validateGiniInput(input: GiniInput): GiniValidation {
  const errors: GiniFieldErrors = {};

  if (input.mode === 'areas') {
    const a = parseNonNegative(input.areaA);
    const b = parseNonNegative(input.areaB);

    if (a.blank) errors.areaA = 'Enter Area A.';
    else if (a.invalid) errors.areaA = 'Enter a valid Area A.';
    else if (a.negative) errors.areaA = 'Areas cannot be negative.';

    if (b.blank) errors.areaB = 'Enter Area B.';
    else if (b.invalid) errors.areaB = 'Enter a valid Area B.';
    else if (b.negative) errors.areaB = 'Areas cannot be negative.';

    if (errors.areaA || errors.areaB) {
      return { isValid: false, errors, result: null };
    }

    let g: number;
    try {
      g = calculateGiniCoefficient(a.value!, b.value!);
    } catch (e) {
      errors.form =
        e instanceof Error ? e.message : 'Unable to calculate Gini coefficient.';
      return { isValid: false, errors, result: null };
    }

    const combined = a.value! + b.value!;
    const status = interpretGini(g);
    const steps = [
      `Identify Area A = ${a.value} unit².`,
      `Identify Area B = ${b.value} unit².`,
      `Calculate total area A + B = ${combined}.`,
      'Apply G = A / (A + B).',
      `Substitute: G = ${a.value} / ${combined}.`,
      `Result: G = ${formatGini(g)}; Gini Index = ${formatIndex(giniIndexFromCoefficient(g))}.`,
    ];

    const result: GiniResult = {
      mode: 'areas',
      giniCoefficient: g,
      giniIndex: giniIndexFromCoefficient(g),
      areaA: a.value!,
      areaB: b.value!,
      combinedArea: combined,
      areaAShare: (a.value! / combined) * 100,
      areaBShare: (b.value! / combined) * 100,
      formattedGini: formatGini(g),
      formattedIndex: formatIndex(giniIndexFromCoefficient(g)),
      statusTitle: status.title,
      interpretation: status.interpretation,
      formulaBreakdown: `G = A / (A + B) = ${formatGini(g)}`,
      steps,
      explanation:
        'Use A/(A+B) with consistent area units. The formula G=2A applies only when areas are normalized so A+B=0.5.',
      lorenz: {
        kind: 'illustrative',
        points: illustrativeLorenzFromGini(g),
        note: 'Modeled Lorenz illustration from the Gini coefficient (power-curve illustration). Area A and Area B alone do not uniquely determine a measured Lorenz curve.',
      },
      observationCount: null,
    };

    return { isValid: true, errors, result };
  }

  // Income distribution mode
  const parsed = parseIncomesText(input.incomesText);
  if (input.incomesText.trim() === '') {
    errors.incomesText = 'Enter at least two nonnegative income values.';
    return { isValid: false, errors, result: null };
  }
  if (parsed.some((x) => !Number.isFinite(x))) {
    errors.incomesText = 'Incomes must be valid numbers.';
    return { isValid: false, errors, result: null };
  }
  if (parsed.some((x) => x < 0)) {
    errors.incomesText =
      'Negative incomes are not supported in this calculation mode.';
    return { isValid: false, errors, result: null };
  }
  if (parsed.length < 2) {
    errors.incomesText = 'Enter at least two income observations.';
    return { isValid: false, errors, result: null };
  }

  let g: number;
  try {
    g = calculateGiniFromIncomes(parsed);
  } catch (e) {
    errors.incomesText =
      e instanceof Error ? e.message : 'Unable to calculate Gini from incomes.';
    return { isValid: false, errors, result: null };
  }

  const status = interpretGini(g);
  const steps = [
    `Parse ${parsed.length} nonnegative income observations.`,
    'Sort incomes ascending and compute G = 2∑(i·x_i)/(n·∑x_i) − (n+1)/n.',
    `Result: G = ${formatGini(g)}; Gini Index = ${formatIndex(giniIndexFromCoefficient(g))}.`,
  ];

  const result: GiniResult = {
    mode: 'incomes',
    giniCoefficient: g,
    giniIndex: giniIndexFromCoefficient(g),
    areaA: null,
    areaB: null,
    combinedArea: null,
    areaAShare: null,
    areaBShare: null,
    formattedGini: formatGini(g),
    formattedIndex: formatIndex(giniIndexFromCoefficient(g)),
    statusTitle: status.title,
    interpretation: status.interpretation,
    formulaBreakdown: `G from sorted incomes = ${formatGini(g)}`,
    steps,
    explanation:
      'Individual and household data, pre-tax vs post-tax, and weights produce different measures. This mode uses unweighted individual observations.',
    lorenz: {
      kind: 'from-data',
      points: lorenzFromIncomes(parsed),
      note: 'Lorenz curve constructed from the entered income observations (sorted ascending).',
    },
    observationCount: parsed.length,
  };

  return { isValid: true, errors, result };
}
