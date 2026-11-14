import {
  calculateExpectedReturns,
  probabilitiesSumTo100,
  type ScenarioValues,
} from './calculation';
import {
  MAX_SCENARIOS,
  emptyScenario,
  type ExpectedReturnFieldErrors,
  type ExpectedReturnInput,
  type ExpectedReturnResult,
  type ScenarioDraft,
} from './types';

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function isDefaultScenario(s: ScenarioDraft): boolean {
  return (
    (s.probability.trim() === '' || s.probability.trim() === '0') &&
    s.stockA.trim() === '' &&
    s.stockB.trim() === ''
  );
}

function isDirtyScenario(s: ScenarioDraft): boolean {
  return !isDefaultScenario(s);
}

/** Ensure a blank trailing row while the last scenario has data (cap MAX). */
export function ensureTrailingScenario(input: ExpectedReturnInput): ExpectedReturnInput {
  const scenarios = [...input.scenarios];
  if (scenarios.length === 0) return { scenarios: [emptyScenario()] };

  const last = scenarios[scenarios.length - 1];
  if (isDirtyScenario(last) && scenarios.length < MAX_SCENARIOS) {
    scenarios.push(emptyScenario());
  }

  while (
    scenarios.length > 4 &&
    scenarios.length >= 2 &&
    isDefaultScenario(scenarios[scenarios.length - 1]!) &&
    isDefaultScenario(scenarios[scenarios.length - 2]!)
  ) {
    scenarios.pop();
  }

  return { scenarios };
}

export function validateExpectedReturnInput(input: ExpectedReturnInput): {
  isValid: boolean;
  errors: ExpectedReturnFieldErrors;
  result: ExpectedReturnResult | null;
  probabilityTotal: number;
} {
  const errors: ExpectedReturnFieldErrors = {};
  const parsed: ScenarioValues[] = [];
  let probabilityTotal = 0;
  let fieldErrors = false;

  input.scenarios.forEach((scenario, index) => {
    if (isDefaultScenario(scenario)) return;

    const n = index + 1;
    const probParsed = parseNumber(
      scenario.probability.trim() === '' ? '0' : scenario.probability
    );
    const aParsed = parseNumber(scenario.stockA);
    const bParsed = parseNumber(scenario.stockB);

    if (probParsed === null || Number.isNaN(probParsed)) {
      errors[`scenario${n}Probability`] = 'Enter a valid probability.';
      fieldErrors = true;
      return;
    }
    if (probParsed < 0 || probParsed > 100) {
      errors[`scenario${n}Probability`] = 'Probability must be between 0 and 100%.';
      fieldErrors = true;
      return;
    }

    probabilityTotal += probParsed;

    let stockA = 0;
    let stockB = 0;

    if (probParsed > 0 && scenario.stockA.trim() === '') {
      errors[`scenario${n}StockA`] = 'Enter Stock A return.';
      fieldErrors = true;
    } else if (scenario.stockA.trim() !== '') {
      if (aParsed === null || Number.isNaN(aParsed)) {
        errors[`scenario${n}StockA`] = 'Enter a valid Stock A return.';
        fieldErrors = true;
      } else {
        stockA = aParsed;
      }
    }

    if (probParsed > 0 && scenario.stockB.trim() === '') {
      errors[`scenario${n}StockB`] = 'Enter Stock B return.';
      fieldErrors = true;
    } else if (scenario.stockB.trim() !== '') {
      if (bParsed === null || Number.isNaN(bParsed)) {
        errors[`scenario${n}StockB`] = 'Enter a valid Stock B return.';
        fieldErrors = true;
      } else {
        stockB = bParsed;
      }
    }

    if (!errors[`scenario${n}StockA`] && !errors[`scenario${n}StockB`]) {
      parsed.push({ probability: probParsed, stockA, stockB });
    }
  });

  if (fieldErrors) {
    return { isValid: false, errors, result: null, probabilityTotal };
  }

  if (!probabilitiesSumTo100(probabilityTotal)) {
    return {
      isValid: false,
      errors: {
        probabilityTotal: 'The total probability for all scenarios must equal 100%.',
      },
      result: null,
      probabilityTotal,
    };
  }

  const result = calculateExpectedReturns(parsed);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate expected returns for these scenarios.' },
      result: null,
      probabilityTotal,
    };
  }

  return { isValid: true, errors: {}, result, probabilityTotal };
}
