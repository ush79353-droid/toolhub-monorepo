import {
  calculateCapRate,
  calculateEffectiveGrossIncome,
  calculateNoi,
  calculateOperatingExpenseRatio,
  calculatePotentialGrossIncome,
  calculatePropertyValueFromCapRate,
  calculateRequiredNoi,
  calculateVacancyLoss,
  formatCapRateMoney,
  formatCapRatePercent,
  toAnnualIncome,
} from './calculation';
import type { CapRateFieldErrors, CapRateInput, CapRateResult } from './types';

export interface CapRateValidation {
  isValid: boolean;
  errors: CapRateFieldErrors;
  result: CapRateResult | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

/**
 * Validates Cap Rate inputs. Primary, reverse, and required-NOI sections
 * stay independent — no shared source overwrites.
 */
export function validateCapRateInput(input: CapRateInput): CapRateValidation {
  const errors: CapRateFieldErrors = {};

  const propertyValue = parseNumber(input.propertyValue);
  const grossRental = parseNumber(input.grossRentalIncome);
  const otherIncome = parseNumber(input.otherIncome);
  const vacancy = parseNumber(input.vacancyRate);
  const opEx = parseNumber(input.operatingExpenses);
  const reverseNoi = parseNumber(input.reverseNoi);
  const reverseCap = parseNumber(input.reverseCapRate);
  const requiredPv = parseNumber(input.requiredPropertyValue);
  const targetCap = parseNumber(input.targetCapRate);

  if (
    !propertyValue.blank &&
    (propertyValue.invalid || propertyValue.value === null)
  ) {
    errors.propertyValue = 'Enter a valid property value.';
  } else if (propertyValue.value !== null && propertyValue.value < 0) {
    errors.propertyValue = 'Property value must be zero or greater.';
  } else if (propertyValue.value === 0) {
    errors.propertyValue = 'Property value must be greater than zero for cap rate.';
  }

  if (
    !grossRental.blank &&
    (grossRental.invalid || grossRental.value === null)
  ) {
    errors.grossRentalIncome = 'Enter a valid gross rental income.';
  } else if (grossRental.value !== null && grossRental.value < 0) {
    errors.grossRentalIncome = 'Gross rental income must be zero or greater.';
  }

  if (
    !otherIncome.blank &&
    (otherIncome.invalid || otherIncome.value === null)
  ) {
    errors.otherIncome = 'Enter a valid other income amount.';
  } else if (otherIncome.value !== null && otherIncome.value < 0) {
    errors.otherIncome = 'Other income must be zero or greater.';
  }

  if (!vacancy.blank && (vacancy.invalid || vacancy.value === null)) {
    errors.vacancyRate = 'Enter a valid vacancy rate.';
  } else if (
    vacancy.value !== null &&
    (vacancy.value < 0 || vacancy.value > 100)
  ) {
    errors.vacancyRate = 'Vacancy rate must be between 0% and 100%.';
  }

  if (!opEx.blank && (opEx.invalid || opEx.value === null)) {
    errors.operatingExpenses = 'Enter a valid operating expense amount.';
  } else if (opEx.value !== null && opEx.value < 0) {
    errors.operatingExpenses = 'Operating expenses must be zero or greater.';
  }

  if (
    !reverseNoi.blank &&
    (reverseNoi.invalid || reverseNoi.value === null)
  ) {
    errors.reverseNoi = 'Enter a valid annual NOI.';
  }

  if (
    !reverseCap.blank &&
    (reverseCap.invalid || reverseCap.value === null)
  ) {
    errors.reverseCapRate = 'Enter a valid capitalization rate.';
  } else if (reverseCap.value !== null && reverseCap.value < 0) {
    errors.reverseCapRate = 'Cap rate must be zero or greater.';
  } else if (reverseCap.value === 0) {
    errors.reverseCapRate = 'Cap rate must be greater than zero to estimate value.';
  }

  if (
    !requiredPv.blank &&
    (requiredPv.invalid || requiredPv.value === null)
  ) {
    errors.requiredPropertyValue = 'Enter a valid property value.';
  } else if (requiredPv.value !== null && requiredPv.value < 0) {
    errors.requiredPropertyValue = 'Property value must be zero or greater.';
  }

  if (
    !targetCap.blank &&
    (targetCap.invalid || targetCap.value === null)
  ) {
    errors.targetCapRate = 'Enter a valid target cap rate.';
  } else if (targetCap.value !== null && targetCap.value < 0) {
    errors.targetCapRate = 'Target cap rate must be zero or greater.';
  }

  const currency = input.currency;

  // —— Primary path ——
  let annualGrossRental = 0;
  let annualOtherIncome = 0;
  let potentialGrossIncome = 0;
  let vacancyLoss = 0;
  let effectiveGrossIncome = 0;
  let noi = 0;
  let capRatePercent: number | null = null;
  let operatingExpenseRatio: number | null = null;
  let primaryReady = false;

  const grossReady = !grossRental.blank && !errors.grossRentalIncome;
  const vacancyReady =
    !vacancy.blank && !errors.vacancyRate && vacancy.value !== null;
  const opExReady = !opEx.blank && !errors.operatingExpenses;
  const otherOk =
    otherIncome.blank ||
    (!errors.otherIncome && otherIncome.value !== null);

  if (grossReady && vacancyReady && opExReady && otherOk) {
    const annualGross = toAnnualIncome(
      grossRental.value!,
      input.incomePeriod
    );
    const otherAnnualRaw = otherIncome.blank
      ? 0
      : toAnnualIncome(otherIncome.value!, input.incomePeriod);
    if (annualGross !== null && otherAnnualRaw !== null) {
      annualGrossRental = annualGross;
      annualOtherIncome = otherAnnualRaw;
      const pgi = calculatePotentialGrossIncome(
        annualGrossRental,
        annualOtherIncome
      );
      if (pgi !== null) {
        potentialGrossIncome = pgi;
        const loss = calculateVacancyLoss(pgi, vacancy.value!);
        if (loss !== null) {
          vacancyLoss = loss;
          const egi = calculateEffectiveGrossIncome(pgi, loss);
          if (egi !== null) {
            effectiveGrossIncome = egi;
            const computedNoi = calculateNoi(egi, opEx.value!);
            if (computedNoi !== null) {
              noi = computedNoi;
              primaryReady = true;
              operatingExpenseRatio = calculateOperatingExpenseRatio(
                opEx.value!,
                egi
              );
              if (
                !propertyValue.blank &&
                !errors.propertyValue &&
                propertyValue.value !== null &&
                propertyValue.value > 0
              ) {
                capRatePercent = calculateCapRate(noi, propertyValue.value);
              }
            }
          }
        }
      }
    }
  }

  // —— Reverse path (independent) ——
  let estimatedPropertyValue: number | null = null;
  if (
    !reverseNoi.blank &&
    !reverseCap.blank &&
    !errors.reverseNoi &&
    !errors.reverseCapRate &&
    reverseNoi.value !== null &&
    reverseCap.value !== null
  ) {
    estimatedPropertyValue = calculatePropertyValueFromCapRate(
      reverseNoi.value,
      reverseCap.value
    );
  }

  // —— Required NOI path (independent) ——
  let requiredAnnualNoi: number | null = null;
  let requiredMonthlyNoi: number | null = null;
  if (
    !requiredPv.blank &&
    !targetCap.blank &&
    !errors.requiredPropertyValue &&
    !errors.targetCapRate &&
    requiredPv.value !== null &&
    targetCap.value !== null
  ) {
    requiredAnnualNoi = calculateRequiredNoi(
      requiredPv.value,
      targetCap.value
    );
    if (requiredAnnualNoi !== null) {
      requiredMonthlyNoi = requiredAnnualNoi / 12;
    }
  }

  const anyResult =
    primaryReady ||
    estimatedPropertyValue !== null ||
    requiredAnnualNoi !== null;

  if (!anyResult) {
    return { isValid: false, errors, result: null };
  }

  const result: CapRateResult = {
    annualGrossRental,
    annualOtherIncome,
    potentialGrossIncome,
    vacancyLoss,
    effectiveGrossIncome,
    noi,
    capRatePercent,
    operatingExpenseRatio,
    estimatedPropertyValue,
    requiredAnnualNoi,
    requiredMonthlyNoi,
    currency,
    formattedAnnualGrossRental: primaryReady
      ? formatCapRateMoney(annualGrossRental, currency)
      : '',
    formattedPotentialGrossIncome: primaryReady
      ? formatCapRateMoney(potentialGrossIncome, currency)
      : '',
    formattedVacancyLoss: primaryReady
      ? formatCapRateMoney(vacancyLoss, currency)
      : '',
    formattedEffectiveGrossIncome: primaryReady
      ? formatCapRateMoney(effectiveGrossIncome, currency)
      : '',
    formattedNoi: primaryReady ? formatCapRateMoney(noi, currency) : '',
    formattedCapRate:
      capRatePercent !== null ? formatCapRatePercent(capRatePercent) : null,
    formattedExpenseRatio:
      operatingExpenseRatio !== null
        ? formatCapRatePercent(operatingExpenseRatio)
        : null,
    formattedEstimatedPropertyValue:
      estimatedPropertyValue !== null
        ? formatCapRateMoney(estimatedPropertyValue, currency)
        : null,
    formattedRequiredAnnualNoi:
      requiredAnnualNoi !== null
        ? formatCapRateMoney(requiredAnnualNoi, currency)
        : null,
    formattedRequiredMonthlyNoi:
      requiredMonthlyNoi !== null
        ? formatCapRateMoney(requiredMonthlyNoi, currency)
        : null,
  };

  return { isValid: true, errors, result };
}
