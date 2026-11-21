import {
  calculateSocialSecurity,
  formatUsd,
  roundMoney2,
} from './calculation';
import type {
  SocialSecurityFieldErrors,
  SocialSecurityInput,
  SocialSecurityResult,
} from './types';

export interface SocialSecurityValidation {
  isValid: boolean;
  errors: SocialSecurityFieldErrors;
  result: SocialSecurityResult | null;
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

export function validateSocialSecurityInput(
  input: SocialSecurityInput
): SocialSecurityValidation {
  const errors: SocialSecurityFieldErrors = {};
  let hasFieldError = false;

  const birthYear = parseNumber(input.birthYear);
  if (birthYear.blank) {
    errors.birthYear = 'Enter your birth year.';
    hasFieldError = true;
  } else if (
    birthYear.invalid ||
    birthYear.value === null ||
    !Number.isInteger(birthYear.value)
  ) {
    errors.birthYear = 'Enter a whole birth year (for example 1970).';
    hasFieldError = true;
  } else if (birthYear.value < 1900 || birthYear.value > 2010) {
    errors.birthYear = 'Birth year must be between 1900 and 2010.';
    hasFieldError = true;
  }

  const lifeExpectancy = parseNumber(input.lifeExpectancy);
  if (lifeExpectancy.blank) {
    errors.lifeExpectancy = 'Enter your life expectancy.';
    hasFieldError = true;
  } else if (lifeExpectancy.invalid || lifeExpectancy.value === null) {
    errors.lifeExpectancy = 'Enter a valid life expectancy.';
    hasFieldError = true;
  } else if (lifeExpectancy.value <= 62) {
    errors.lifeExpectancy =
      'Life expectancy must be greater than 62 to compare claiming ages.';
    hasFieldError = true;
  } else if (lifeExpectancy.value > 120) {
    errors.lifeExpectancy = 'Life expectancy cannot exceed 120.';
    hasFieldError = true;
  }

  const roi = parseNumber(input.investmentReturn);
  if (roi.blank) {
    errors.investmentReturn = 'Enter the expected investment return.';
    hasFieldError = true;
  } else if (roi.invalid || roi.value === null) {
    errors.investmentReturn = 'Enter a valid annual return percentage.';
    hasFieldError = true;
  } else if (roi.value <= -100) {
    errors.investmentReturn = 'Annual return cannot be −100% or lower.';
    hasFieldError = true;
  } else if (roi.value > 50) {
    errors.investmentReturn = 'Annual return cannot exceed 50%.';
    hasFieldError = true;
  }

  const cola = parseNumber(input.cola);
  if (cola.blank) {
    errors.cola = 'Enter the cost-of-living adjustment.';
    hasFieldError = true;
  } else if (cola.invalid || cola.value === null) {
    errors.cola = 'Enter a valid COLA percentage.';
    hasFieldError = true;
  } else if (cola.value <= -100) {
    errors.cola = 'COLA cannot be −100% or lower.';
    hasFieldError = true;
  } else if (cola.value > 20) {
    errors.cola = 'COLA cannot exceed 20% per year in this model.';
    hasFieldError = true;
  }

  const pia = parseNumber(input.piaMonthly);
  if (pia.blank) {
    errors.piaMonthly =
      'Enter your estimated monthly benefit at full retirement age (from SSA).';
    hasFieldError = true;
  } else if (pia.invalid || pia.value === null) {
    errors.piaMonthly = 'Enter a valid monthly benefit amount.';
    hasFieldError = true;
  } else if (!(pia.value > 0)) {
    errors.piaMonthly = 'Monthly benefit at FRA must be greater than zero.';
    hasFieldError = true;
  } else if (pia.value > 50_000) {
    errors.piaMonthly = 'Monthly benefit looks unrealistically high.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    birthYear.value === null ||
    lifeExpectancy.value === null ||
    roi.value === null ||
    cola.value === null ||
    pia.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateSocialSecurity({
    birthYear: birthYear.value,
    lifeExpectancy: lifeExpectancy.value,
    annualReturnPercent: roi.value,
    colaPercent: cola.value,
    piaMonthly: pia.value,
  });

  if (!math) {
    errors.form =
      'Unable to compare claiming ages with these inputs. Check that life expectancy exceeds ages 62–70.';
    return { isValid: false, errors, result: null };
  }

  const ideal = math.idealScenario;
  const result: SocialSecurityResult = {
    birthYear: birthYear.value,
    lifeExpectancy: lifeExpectancy.value,
    annualReturnPercent: roi.value,
    colaPercent: cola.value,
    piaMonthly: roundMoney2(pia.value),
    fraLabel: math.fraLabel,
    idealClaimAge: math.idealClaimAge,
    idealStartingMonthly: roundMoney2(ideal.startingMonthlyBenefit),
    idealCumulativeNominal: roundMoney2(ideal.cumulativeNominal),
    idealInvestedTerminal: roundMoney2(ideal.investedTerminalValue),
    breakEvenVs62Age: math.breakEvenVs62Age,
    scenarios: math.scenarios.map((s) => ({
      ...s,
      startingMonthlyBenefit: roundMoney2(s.startingMonthlyBenefit),
      cumulativeNominal: roundMoney2(s.cumulativeNominal),
      investedTerminalValue: roundMoney2(s.investedTerminalValue),
    })),
    formattedPiaMonthly: formatUsd(roundMoney2(pia.value)),
    formattedIdealStartingMonthly: formatUsd(
      roundMoney2(ideal.startingMonthlyBenefit)
    ),
    formattedIdealCumulative: formatUsd(roundMoney2(ideal.cumulativeNominal)),
    formattedIdealInvested: formatUsd(roundMoney2(ideal.investedTerminalValue)),
    formattedBreakEvenVs62:
      math.breakEvenVs62Age == null
        ? null
        : `age ${math.breakEvenVs62Age.toFixed(1)}`,
    rulesSource: math.rulesSource,
    rulesEffective: math.rulesEffective,
    timingNote: math.timingNote,
    disclaimer:
      'Educational estimate only — not SSA advice. Ideal age depends on taxes, health, spousal/survivor benefits, work earnings tests, and personal circumstances.',
  };

  return { isValid: true, errors, result };
}
