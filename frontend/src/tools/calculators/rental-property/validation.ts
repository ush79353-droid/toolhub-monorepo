import {
  calculateAnnualCashFlow,
  calculateAnnualDebtService,
  calculateAnnualOperatingExpenses,
  calculateCapRate,
  calculateCashOnCashReturn,
  calculateDownPaymentAmount,
  calculateDownPaymentPercentage,
  calculateEffectiveRentalIncome,
  calculateHoldingPeriodCashFlow,
  calculateInitialCashInvestment,
  calculateManagementFee,
  calculateMonthlyMortgagePayment,
  calculateMortgageAmount,
  calculateNetOperatingIncome,
  calculateNetSaleProceeds,
  calculateOutstandingLoanBalance,
  calculateProjectedSellingPrice,
  calculateSellingCosts,
  calculateTotalInvestmentRoi,
  calculateTotalMortgagePayments,
  calculateVacancyLoss,
  durationToMonths,
  formatRentalMoney,
  formatRentalPercent,
  toAnnualExpense,
  toAnnualIncome,
} from './calculation';
import type {
  RentalPropertyFieldErrors,
  RentalPropertyInput,
  RentalPropertyResult,
} from './types';

export interface RentalPropertyValidation {
  isValid: boolean;
  errors: RentalPropertyFieldErrors;
  result: RentalPropertyResult | null;
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

function parseNonNegative(
  raw: string,
  field: keyof RentalPropertyFieldErrors,
  errors: RentalPropertyFieldErrors,
  label: string,
  opts?: { allowBlankAsZero?: boolean; required?: boolean }
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    if (opts?.allowBlankAsZero) return 0;
    if (opts?.required) errors[field] = `Enter ${label}.`;
    return null;
  }
  if (parsed.invalid || parsed.value === null) {
    errors[field] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0) {
    errors[field] = `${label} cannot be negative.`;
    return null;
  }
  return parsed.value;
}

export function validateRentalPropertyInput(
  input: RentalPropertyInput
): RentalPropertyValidation {
  const errors: RentalPropertyFieldErrors = {};
  const currency = input.currency;

  // --- Purchase ---
  const purchaseParsed = parseNumber(input.purchasePrice);
  let purchasePrice: number | null = null;
  if (purchaseParsed.blank) {
    // wait
  } else if (purchaseParsed.invalid || purchaseParsed.value === null) {
    errors.purchasePrice = 'Enter a valid purchase price.';
  } else if (purchaseParsed.value <= 0) {
    errors.purchasePrice = 'Purchase price must be greater than zero.';
  } else {
    purchasePrice = purchaseParsed.value;
  }

  let downPaymentAmount: number | null = null;
  let downPaymentPercentage: number | null = null;

  if (input.downPaymentMode === 'amount') {
    const amountParsed = parseNumber(input.downPaymentAmount);
    if (amountParsed.blank) {
      // wait
    } else if (amountParsed.invalid || amountParsed.value === null) {
      errors.downPaymentAmount = 'Enter a valid down payment amount.';
    } else if (amountParsed.value < 0) {
      errors.downPaymentAmount = 'Down payment cannot be negative.';
    } else if (purchasePrice !== null && amountParsed.value > purchasePrice) {
      errors.downPaymentAmount = 'Down payment cannot exceed purchase price.';
    } else {
      downPaymentAmount = amountParsed.value;
      if (purchasePrice !== null) {
        downPaymentPercentage = calculateDownPaymentPercentage(
          purchasePrice,
          downPaymentAmount
        );
      }
    }
  } else {
    const pctParsed = parseNumber(input.downPaymentPercentage);
    if (pctParsed.blank) {
      // wait
    } else if (pctParsed.invalid || pctParsed.value === null) {
      errors.downPaymentPercentage = 'Enter a valid down payment percentage.';
    } else if (pctParsed.value < 0) {
      errors.downPaymentPercentage = 'Down payment cannot be negative.';
    } else if (pctParsed.value > 100) {
      errors.downPaymentPercentage = 'Down payment cannot exceed 100%.';
    } else {
      downPaymentPercentage = pctParsed.value;
      if (purchasePrice !== null) {
        downPaymentAmount = calculateDownPaymentAmount(
          purchasePrice,
          downPaymentPercentage
        );
      }
    }
  }

  let loanAmount: number | null = null;
  if (purchasePrice !== null && downPaymentAmount !== null) {
    loanAmount = calculateMortgageAmount(purchasePrice, downPaymentAmount);
  }

  const rateParsed = parseNumber(input.interestRate);
  let interestRate: number | null = null;
  if (rateParsed.blank) {
    // wait
  } else if (rateParsed.invalid || rateParsed.value === null) {
    errors.interestRate = 'Enter a valid interest rate.';
  } else if (rateParsed.value < 0) {
    errors.interestRate = 'Interest rate cannot be negative.';
  } else {
    interestRate = rateParsed.value;
  }

  const termParsed = parseNumber(input.loanTermValue);
  let loanTermMonths: number | null = null;
  if (termParsed.blank) {
    // wait
  } else if (termParsed.invalid || termParsed.value === null) {
    errors.loanTermValue = 'Enter a valid loan term.';
  } else if (termParsed.value <= 0) {
    errors.loanTermValue = 'Loan term must be greater than zero.';
  } else {
    loanTermMonths = durationToMonths(termParsed.value, input.loanTermUnit);
    if (loanTermMonths === null || loanTermMonths <= 0) {
      errors.loanTermValue = 'Enter a valid loan term.';
      loanTermMonths = null;
    }
  }

  let monthlyMortgagePayment: number | null = null;
  let totalMortgagePayments: number | null = null;
  if (loanAmount !== null && loanAmount === 0) {
    monthlyMortgagePayment = 0;
    totalMortgagePayments = 0;
  } else if (
    loanAmount !== null &&
    loanAmount > 0 &&
    interestRate !== null &&
    loanTermMonths !== null
  ) {
    monthlyMortgagePayment = calculateMonthlyMortgagePayment(
      loanAmount,
      interestRate,
      loanTermMonths
    );
    if (monthlyMortgagePayment !== null) {
      totalMortgagePayments = calculateTotalMortgagePayments(
        monthlyMortgagePayment,
        loanTermMonths
      );
    }
  } else if (loanAmount !== null && loanAmount > 0) {
    if (interestRate === null && !rateParsed.blank) {
      // already errored
    } else if (loanTermMonths === null && !termParsed.blank) {
      // already errored
    }
  }

  // --- Income ---
  const rentParsed = parseNumber(input.rent);
  let annualGrossRent: number | null = null;
  if (rentParsed.blank) {
    // wait
  } else if (rentParsed.invalid || rentParsed.value === null) {
    errors.rent = 'Enter a valid rent amount.';
  } else if (rentParsed.value < 0) {
    errors.rent = 'Rent cannot be negative.';
  } else {
    annualGrossRent = toAnnualIncome(rentParsed.value, input.rentPeriod);
  }

  const vacancyParsed = parseNumber(input.vacancyRate);
  let vacancyRate: number | null = null;
  if (vacancyParsed.blank) {
    vacancyRate = 0;
  } else if (vacancyParsed.invalid || vacancyParsed.value === null) {
    errors.vacancyRate = 'Enter a valid vacancy rate.';
  } else if (vacancyParsed.value < 0 || vacancyParsed.value > 100) {
    errors.vacancyRate = 'Vacancy rate must be between 0% and 100%.';
  } else {
    vacancyRate = vacancyParsed.value;
  }

  const mgmtParsed = parseNumber(input.managementFeeRate);
  let managementFeeRate: number | null = null;
  if (mgmtParsed.blank) {
    managementFeeRate = 0;
  } else if (mgmtParsed.invalid || mgmtParsed.value === null) {
    errors.managementFeeRate = 'Enter a valid management fee.';
  } else if (mgmtParsed.value < 0 || mgmtParsed.value > 100) {
    errors.managementFeeRate = 'Management fee must be between 0% and 100%.';
  } else {
    managementFeeRate = mgmtParsed.value;
  }

  // --- Expenses (blank → 0) ---
  const propertyTaxAmt = parseNonNegative(
    input.propertyTax,
    'propertyTax',
    errors,
    'property tax',
    { allowBlankAsZero: true }
  );
  const insuranceAmt = parseNonNegative(
    input.insurance,
    'insurance',
    errors,
    'insurance',
    { allowBlankAsZero: true }
  );
  const maintenanceAmt = parseNonNegative(
    input.maintenance,
    'maintenance',
    errors,
    'maintenance',
    { allowBlankAsZero: true }
  );
  const hoaAmt = parseNonNegative(input.hoaFee, 'hoaFee', errors, 'HOA fee', {
    allowBlankAsZero: true,
  });
  const otherAmt = parseNonNegative(
    input.otherCosts,
    'otherCosts',
    errors,
    'other costs',
    { allowBlankAsZero: true }
  );

  const annualPropertyTax =
    propertyTaxAmt === null
      ? null
      : toAnnualExpense(propertyTaxAmt, input.propertyTaxPeriod);
  const annualInsurance =
    insuranceAmt === null
      ? null
      : toAnnualExpense(insuranceAmt, input.insurancePeriod);
  const annualMaintenance =
    maintenanceAmt === null
      ? null
      : toAnnualExpense(maintenanceAmt, input.maintenancePeriod);
  const annualHoa =
    hoaAmt === null ? null : toAnnualExpense(hoaAmt, input.hoaFeePeriod);
  const annualOther =
    otherAmt === null
      ? null
      : toAnnualExpense(otherAmt, input.otherCostsPeriod);

  // --- Selling ---
  const apprecParsed = parseNumber(input.appreciationRate);
  let appreciationRate: number | null = null;
  if (apprecParsed.blank) {
    appreciationRate = 0;
  } else if (apprecParsed.invalid || apprecParsed.value === null) {
    errors.appreciationRate = 'Enter a valid appreciation rate.';
  } else if (apprecParsed.value <= -100) {
    errors.appreciationRate =
      'Appreciation must be greater than −100% for geometric projection.';
  } else {
    appreciationRate = apprecParsed.value;
  }

  const holdParsed = parseNumber(input.holdingPeriodValue);
  let holdingPeriodMonths: number | null = null;
  if (holdParsed.blank) {
    // optional for operating metrics; required for sale ROI
  } else if (holdParsed.invalid || holdParsed.value === null) {
    errors.holdingPeriodValue = 'Enter a valid holding period.';
  } else if (holdParsed.value < 0) {
    errors.holdingPeriodValue = 'Holding period cannot be negative.';
  } else {
    holdingPeriodMonths = durationToMonths(
      holdParsed.value,
      input.holdingPeriodUnit
    );
  }

  let manualSellingPrice: number | null = null;
  if (input.sellingPriceMode === 'manual') {
    const sp = parseNumber(input.manualSellingPrice);
    if (sp.blank) {
      // wait for sale metrics
    } else if (sp.invalid || sp.value === null) {
      errors.manualSellingPrice = 'Enter a valid selling price.';
    } else if (sp.value < 0) {
      errors.manualSellingPrice = 'Selling price cannot be negative.';
    } else {
      manualSellingPrice = sp.value;
    }
  }

  const sellPct = parseNonNegative(
    input.sellingCostPercent,
    'sellingCostPercent',
    errors,
    'selling cost percent',
    { allowBlankAsZero: true }
  );
  const sellFixed = parseNonNegative(
    input.sellingCostFixed,
    'sellingCostFixed',
    errors,
    'fixed selling costs',
    { allowBlankAsZero: true }
  );

  const closingCosts = parseNonNegative(
    input.closingCosts,
    'closingCosts',
    errors,
    'closing costs',
    { allowBlankAsZero: true }
  );
  const renovationCosts = parseNonNegative(
    input.renovationCosts,
    'renovationCosts',
    errors,
    'renovation costs',
    { allowBlankAsZero: true }
  );
  const otherInitialCosts = parseNonNegative(
    input.otherInitialCosts,
    'otherInitialCosts',
    errors,
    'other initial costs',
    { allowBlankAsZero: true }
  );

  const hasBlockingErrors = Object.keys(errors).length > 0;
  if (hasBlockingErrors) {
    return { isValid: false, errors, result: null };
  }

  // Need purchase + down payment + financing inputs for mortgage results;
  // income for cash-flow chain. Require core purchase chain to show results.
  if (
    purchasePrice === null ||
    downPaymentAmount === null ||
    downPaymentPercentage === null ||
    loanAmount === null ||
    monthlyMortgagePayment === null ||
    totalMortgagePayments === null ||
    (loanAmount > 0 &&
      (interestRate === null || loanTermMonths === null)) ||
    annualGrossRent === null ||
    vacancyRate === null ||
    managementFeeRate === null ||
    annualPropertyTax === null ||
    annualInsurance === null ||
    annualMaintenance === null ||
    annualHoa === null ||
    annualOther === null ||
    closingCosts === null ||
    renovationCosts === null ||
    otherInitialCosts === null
  ) {
    return { isValid: false, errors, result: null };
  }

  // Zero-loan may leave rate/term unset; positive loan is guarded above.
  const resolvedInterestRate = interestRate ?? 0;
  const resolvedLoanTermMonths = loanTermMonths ?? 0;

  const vacancyLoss = calculateVacancyLoss(annualGrossRent, vacancyRate);
  if (vacancyLoss === null) {
    return { isValid: false, errors, result: null };
  }
  const effectiveRentalIncome = calculateEffectiveRentalIncome(
    annualGrossRent,
    vacancyLoss
  );
  if (effectiveRentalIncome === null) {
    return { isValid: false, errors, result: null };
  }
  const managementFee = calculateManagementFee(
    effectiveRentalIncome,
    managementFeeRate
  );
  if (managementFee === null) {
    return { isValid: false, errors, result: null };
  }

  const annualOperatingExpenses = calculateAnnualOperatingExpenses({
    propertyTax: annualPropertyTax,
    insurance: annualInsurance,
    maintenance: annualMaintenance,
    hoa: annualHoa,
    other: annualOther,
    managementFee,
  });
  if (annualOperatingExpenses === null) {
    return { isValid: false, errors, result: null };
  }

  const noi = calculateNetOperatingIncome(
    effectiveRentalIncome,
    annualOperatingExpenses
  );
  if (noi === null) return { isValid: false, errors, result: null };

  const annualDebtService = calculateAnnualDebtService(monthlyMortgagePayment);
  if (annualDebtService === null) {
    return { isValid: false, errors, result: null };
  }

  const annualCashFlow = calculateAnnualCashFlow(noi, annualDebtService);
  if (annualCashFlow === null) {
    return { isValid: false, errors, result: null };
  }

  const initialCashInvestment = calculateInitialCashInvestment(
    downPaymentAmount,
    closingCosts,
    renovationCosts,
    otherInitialCosts
  );
  if (initialCashInvestment === null) {
    return { isValid: false, errors, result: null };
  }

  const cashOnCashReturnPercent = calculateCashOnCashReturn(
    annualCashFlow,
    initialCashInvestment
  );
  const capRatePercent = calculateCapRate(noi, purchasePrice);

  // Sale / holding-period metrics (optional until holding period provided)
  let sellingPrice = purchasePrice;
  let sellingCosts = 0;
  let outstandingLoanBalance = loanAmount;
  let netSaleProceeds = 0;
  let cumulativeOperatingCashFlow = 0;
  let totalInvestmentProfit = 0;
  let totalRoiPercent: number | null = null;
  let resolvedHoldingMonths = 0;

  const canProjectSale =
    appreciationRate !== null &&
    sellPct !== null &&
    sellFixed !== null &&
    holdingPeriodMonths !== null &&
    holdingPeriodMonths > 0 &&
    (input.sellingPriceMode === 'appreciation' || manualSellingPrice !== null);

  if (canProjectSale && holdingPeriodMonths !== null) {
    resolvedHoldingMonths = holdingPeriodMonths;
    const holdingYears = holdingPeriodMonths / 12;

    if (input.sellingPriceMode === 'manual' && manualSellingPrice !== null) {
      sellingPrice = manualSellingPrice;
    } else if (appreciationRate !== null) {
      const projected = calculateProjectedSellingPrice(
        purchasePrice,
        appreciationRate,
        holdingYears
      );
      if (projected === null) {
        return { isValid: false, errors, result: null };
      }
      sellingPrice = projected;
    }

    const costs = calculateSellingCosts(sellingPrice, sellPct!, sellFixed!);
    if (costs === null) return { isValid: false, errors, result: null };
    sellingCosts = costs;

    const balance =
      loanAmount === 0
        ? 0
        : calculateOutstandingLoanBalance(
            loanAmount,
            resolvedInterestRate,
            resolvedLoanTermMonths,
            holdingPeriodMonths
          );
    if (balance === null) return { isValid: false, errors, result: null };
    outstandingLoanBalance = balance;

    const net = calculateNetSaleProceeds(
      sellingPrice,
      sellingCosts,
      outstandingLoanBalance
    );
    if (net === null) return { isValid: false, errors, result: null };
    netSaleProceeds = net;

    const cumulative = calculateHoldingPeriodCashFlow(
      effectiveRentalIncome,
      annualOperatingExpenses,
      monthlyMortgagePayment,
      resolvedLoanTermMonths,
      holdingPeriodMonths
    );
    if (cumulative === null) return { isValid: false, errors, result: null };
    cumulativeOperatingCashFlow = cumulative;

    totalInvestmentProfit =
      cumulativeOperatingCashFlow + netSaleProceeds - initialCashInvestment;
    totalRoiPercent = calculateTotalInvestmentRoi(
      totalInvestmentProfit,
      initialCashInvestment
    );
  }

  const monthlyOperatingExpenses = annualOperatingExpenses / 12;
  const monthlyCashFlow = annualCashFlow / 12;
  const monthlyGrossIncome = annualGrossRent / 12;

  const result: RentalPropertyResult = {
    currency,
    purchasePrice,
    downPaymentAmount,
    downPaymentPercentage,
    loanAmount,
    interestRate: resolvedInterestRate,
    loanTermMonths: resolvedLoanTermMonths,
    monthlyMortgagePayment,
    totalMortgagePayments,
    annualGrossRent,
    vacancyLoss,
    effectiveRentalIncome,
    managementFee,
    annualOperatingExpenses,
    noi,
    annualDebtService,
    annualCashFlow,
    monthlyCashFlow,
    monthlyOperatingExpenses,
    monthlyGrossIncome,
    initialCashInvestment,
    cashOnCashReturnPercent,
    capRatePercent,
    holdingPeriodMonths: resolvedHoldingMonths,
    sellingPrice,
    sellingCosts,
    outstandingLoanBalance,
    netSaleProceeds,
    cumulativeOperatingCashFlow,
    totalInvestmentProfit,
    totalRoiPercent,
    formattedPurchasePrice: formatRentalMoney(purchasePrice, currency),
    formattedDownPaymentAmount: formatRentalMoney(downPaymentAmount, currency),
    formattedDownPaymentPercentage: formatRentalPercent(downPaymentPercentage),
    formattedLoanAmount: formatRentalMoney(loanAmount, currency),
    formattedMonthlyMortgagePayment: formatRentalMoney(
      monthlyMortgagePayment,
      currency
    ),
    formattedTotalMortgagePayments: formatRentalMoney(
      totalMortgagePayments,
      currency
    ),
    formattedAnnualGrossRent: formatRentalMoney(annualGrossRent, currency),
    formattedVacancyLoss: formatRentalMoney(vacancyLoss, currency),
    formattedEffectiveRentalIncome: formatRentalMoney(
      effectiveRentalIncome,
      currency
    ),
    formattedManagementFee: formatRentalMoney(managementFee, currency),
    formattedAnnualOperatingExpenses: formatRentalMoney(
      annualOperatingExpenses,
      currency
    ),
    formattedMonthlyOperatingExpenses: formatRentalMoney(
      monthlyOperatingExpenses,
      currency
    ),
    formattedNoi: formatRentalMoney(noi, currency),
    formattedAnnualDebtService: formatRentalMoney(annualDebtService, currency),
    formattedAnnualCashFlow: formatRentalMoney(annualCashFlow, currency),
    formattedMonthlyCashFlow: formatRentalMoney(monthlyCashFlow, currency),
    formattedMonthlyGrossIncome: formatRentalMoney(monthlyGrossIncome, currency),
    formattedInitialCashInvestment: formatRentalMoney(
      initialCashInvestment,
      currency
    ),
    formattedCashOnCashReturn:
      cashOnCashReturnPercent === null
        ? null
        : formatRentalPercent(cashOnCashReturnPercent),
    formattedCapRate:
      capRatePercent === null ? null : formatRentalPercent(capRatePercent),
    formattedSellingPrice: formatRentalMoney(sellingPrice, currency),
    formattedSellingCosts: formatRentalMoney(sellingCosts, currency),
    formattedOutstandingLoanBalance: formatRentalMoney(
      outstandingLoanBalance,
      currency
    ),
    formattedNetSaleProceeds: formatRentalMoney(netSaleProceeds, currency),
    formattedCumulativeOperatingCashFlow: formatRentalMoney(
      cumulativeOperatingCashFlow,
      currency
    ),
    formattedTotalInvestmentProfit: formatRentalMoney(
      totalInvestmentProfit,
      currency
    ),
    formattedTotalRoi:
      totalRoiPercent === null ? null : formatRentalPercent(totalRoiPercent),
  };

  return { isValid: true, errors, result };
}
