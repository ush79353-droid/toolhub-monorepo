import {
  calculateBudgetingDiscretionaryIncome,
  calculateDiscretionaryIncome,
  estimateMonthlyIdrPayment,
  formatPercent,
  formatUsd,
  sumNecessaryExpenses,
} from './calculation';
import {
  LATEST_POVERTY_YEAR,
  lookupPovertyGuideline,
  regionForState,
  type UsStateCode,
  US_STATES,
} from './poverty-guidelines';
import {
  computeFamilySize,
  getRepaymentStandard,
  resolveApplicableAgi,
  type MaritalStatus,
} from './repayment-standards';
import type {
  DiscretionaryIncomeFieldErrors,
  DiscretionaryIncomeInput,
  DiscretionaryIncomeResult,
} from './types';

export interface DiscretionaryIncomeValidation {
  isValid: boolean;
  errors: DiscretionaryIncomeFieldErrors;
  result: DiscretionaryIncomeResult | null;
}

const PAYMENT_DISCLAIMER =
  'Estimated payments are informational and may differ from amounts calculated by your loan servicer or the U.S. Department of Education.';

function parseNumber(raw: string): {
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

function isState(code: string): code is UsStateCode {
  return US_STATES.some((s) => s.code === code);
}

export function validateDiscretionaryIncomeInput(
  input: DiscretionaryIncomeInput
): DiscretionaryIncomeValidation {
  const errors: DiscretionaryIncomeFieldErrors = {};

  if (input.purpose === 'budgeting') {
    const fields: {
      key: keyof DiscretionaryIncomeFieldErrors;
      raw: string;
      label: string;
    }[] = [
      { key: 'monthlyTakeHome', raw: input.monthlyTakeHome, label: 'take-home income' },
      { key: 'housing', raw: input.housing, label: 'housing' },
      { key: 'utilities', raw: input.utilities, label: 'utilities' },
      { key: 'groceries', raw: input.groceries, label: 'groceries' },
      { key: 'transportation', raw: input.transportation, label: 'transportation' },
      { key: 'insurance', raw: input.insurance, label: 'insurance' },
      { key: 'minDebt', raw: input.minDebt, label: 'minimum debt payments' },
      { key: 'healthcare', raw: input.healthcare, label: 'essential healthcare' },
      { key: 'childcare', raw: input.childcare, label: 'childcare' },
      { key: 'otherNecessary', raw: input.otherNecessary, label: 'other necessary expenses' },
    ];

    const values: number[] = [];
    let hasError = false;
    for (const f of fields) {
      const p = parseNumber(f.raw);
      if (p.blank) {
        errors[f.key] = `Enter ${f.label}.`;
        hasError = true;
      } else if (p.invalid || p.value === null) {
        errors[f.key] = `Enter a valid ${f.label}.`;
        hasError = true;
      } else if (p.value < 0) {
        errors[f.key] = `${f.label} cannot be negative.`;
        hasError = true;
      } else {
        values.push(p.value);
      }
    }
    if (hasError) return { isValid: false, errors, result: null };

    const [takeHome, ...expenseParts] = values;
    const necessary = sumNecessaryExpenses(expenseParts);
    if (takeHome == null || necessary == null) {
      errors.form = 'Unable to compute budgeting discretionary income.';
      return { isValid: false, errors, result: null };
    }
    const di = calculateBudgetingDiscretionaryIncome(takeHome, necessary);
    if (di == null) {
      errors.form = 'Unable to compute budgeting discretionary income.';
      return { isValid: false, errors, result: null };
    }

    const result: DiscretionaryIncomeResult = {
      purpose: 'budgeting',
      applicableAgi: null,
      povertyGuideline: null,
      protectionMultiplier: null,
      protectedIncome: null,
      familySize: null,
      povertyRegion: null,
      guidelineYear: null,
      guidelineSourceLabel: null,
      guidelineSourceUrl: null,
      planName: null,
      planAvailability: null,
      planNotes: null,
      includesSpouseIncome: null,
      assessmentRate: null,
      annualDiscretionaryIncome: null,
      monthlyDiscretionaryIncome: null,
      estimatedMonthlyPayment: null,
      totalNecessaryExpenses: necessary,
      budgetingDiscretionaryIncome: di,
      formattedApplicableAgi: null,
      formattedPovertyGuideline: null,
      formattedProtectedIncome: null,
      formattedAnnualDi: null,
      formattedMonthlyDi: null,
      formattedEstimatedPayment: null,
      formattedTakeHome: formatUsd(takeHome),
      formattedNecessary: formatUsd(necessary),
      formattedBudgetingDi: formatUsd(di),
      formulaBreakdown: `${formatUsd(takeHome)} − ${formatUsd(necessary)} = ${formatUsd(di)}`,
      explanation:
        di < 0
          ? `Necessary expenses exceed take-home income by ${formatUsd(Math.abs(di))} per month.`
          : `Monthly budgeting discretionary income is ${formatUsd(di)}.`,
      disclaimer:
        'Budgeting discretionary income is not the same as student-loan discretionary income and does not use federal poverty guidelines.',
    };
    return { isValid: true, errors, result };
  }

  // Student loan mode
  let hasError = false;
  if (!isState(input.state)) {
    errors.state = 'Select a U.S. state or District of Columbia.';
    hasError = true;
  }

  const standard = getRepaymentStandard(input.repaymentStandardId);
  if (!standard) {
    errors.repaymentStandardId = 'Select a supported calculation standard.';
    hasError = true;
  }

  const yearParsed = parseNumber(input.povertyYear);
  if (yearParsed.blank || yearParsed.invalid || yearParsed.value == null) {
    errors.povertyYear = 'Select a poverty guideline year.';
    hasError = true;
  }

  const agi = parseNumber(input.annualAgi);
  if (agi.blank) {
    errors.annualAgi = 'Enter annual adjusted gross income (AGI).';
    hasError = true;
  } else if (agi.invalid || agi.value == null) {
    errors.annualAgi = 'Enter a valid AGI.';
    hasError = true;
  }

  const dep = parseNumber(input.dependents);
  if (dep.blank) {
    errors.dependents = 'Enter number of dependents (use 0 if none).';
    hasError = true;
  } else if (
    dep.invalid ||
    dep.value == null ||
    dep.value < 0 ||
    !Number.isInteger(dep.value)
  ) {
    errors.dependents = 'Dependents must be a whole number ≥ 0.';
    hasError = true;
  }

  const marital: MaritalStatus = input.maritalStatus;
  const needsSpouse =
    marital === 'marriedFilingJointly' ||
    (marital === 'marriedFilingSeparately' &&
      Boolean(standard?.includeSpouseIncomeWhenMfs));

  let spouseValue = 0;
  if (needsSpouse) {
    const sp = parseNumber(input.spouseAgi);
    if (sp.blank) {
      errors.spouseAgi = 'Enter spouse adjusted gross income.';
      hasError = true;
    } else if (sp.invalid || sp.value == null) {
      errors.spouseAgi = 'Enter a valid spouse AGI.';
      hasError = true;
    } else {
      spouseValue = sp.value;
    }
  }

  if (hasError || !standard || agi.value == null || dep.value == null) {
    return { isValid: false, errors, result: null };
  }

  const year = yearParsed.value ?? LATEST_POVERTY_YEAR;
  const region = regionForState(input.state as UsStateCode);
  const familySize = computeFamilySize(marital, dep.value, standard);
  const guideline = lookupPovertyGuideline(year, region, familySize);
  if (!guideline) {
    errors.povertyYear = `Poverty guidelines for ${year} are not available in this tool. Latest verified year: ${LATEST_POVERTY_YEAR}.`;
    return { isValid: false, errors, result: null };
  }

  const { applicableAgi, includesSpouseIncome } = resolveApplicableAgi(
    marital,
    agi.value,
    spouseValue,
    standard
  );

  const di = calculateDiscretionaryIncome({
    annualAGI: applicableAgi,
    povertyGuideline: guideline.annualAmount,
    protectionMultiplier: standard.protectionMultiplier,
  });
  if (!di) {
    errors.form = 'Unable to compute discretionary income.';
    return { isValid: false, errors, result: null };
  }

  const payment = estimateMonthlyIdrPayment(
    di.annualDiscretionaryIncome,
    standard.assessmentRate
  );

  const result: DiscretionaryIncomeResult = {
    purpose: 'studentLoan',
    applicableAgi,
    povertyGuideline: guideline.annualAmount,
    protectionMultiplier: standard.protectionMultiplier,
    protectedIncome: di.protectedIncome,
    familySize,
    povertyRegion: region,
    guidelineYear: year,
    guidelineSourceLabel: guideline.sourceLabel,
    guidelineSourceUrl: guideline.sourceUrl,
    planName: standard.name,
    planAvailability: standard.availability,
    planNotes: standard.notes,
    includesSpouseIncome,
    assessmentRate: standard.assessmentRate,
    annualDiscretionaryIncome: di.annualDiscretionaryIncome,
    monthlyDiscretionaryIncome: di.monthlyDiscretionaryIncome,
    estimatedMonthlyPayment: payment,
    totalNecessaryExpenses: null,
    budgetingDiscretionaryIncome: null,
    formattedApplicableAgi: formatUsd(applicableAgi, 2),
    formattedPovertyGuideline: formatUsd(guideline.annualAmount, 0),
    formattedProtectedIncome: formatUsd(di.protectedIncome, 2),
    formattedAnnualDi: formatUsd(di.annualDiscretionaryIncome, 2),
    formattedMonthlyDi: formatUsd(di.monthlyDiscretionaryIncome, 2),
    formattedEstimatedPayment:
      payment == null ? null : formatUsd(payment, 2),
    formattedTakeHome: null,
    formattedNecessary: null,
    formattedBudgetingDi: null,
    formulaBreakdown: `Protected = ${formatUsd(guideline.annualAmount, 0)} × ${standard.protectionMultiplier} = ${formatUsd(di.protectedIncome, 2)}; DI = max(0, ${formatUsd(applicableAgi, 2)} − ${formatUsd(di.protectedIncome, 2)}) = ${formatUsd(di.annualDiscretionaryIncome, 2)}; Monthly DI = ${formatUsd(di.monthlyDiscretionaryIncome, 2)}${
      payment == null
        ? ''
        : `; Est. payment = (${formatUsd(di.annualDiscretionaryIncome, 2)} × ${formatPercent(standard.assessmentRate)}) / 12 = ${formatUsd(payment, 2)}`
    }`,
    explanation: `Under ${standard.shortLabel}, family size ${familySize} (${region}, ${year} HHS guidelines) yields annual DI ${formatUsd(di.annualDiscretionaryIncome, 2)} (${formatUsd(di.monthlyDiscretionaryIncome, 2)}/mo).`,
    disclaimer: `${PAYMENT_DISCLAIMER} Availability: ${standard.availability}. ${standard.notes}`,
  };

  return { isValid: true, errors, result };
}
