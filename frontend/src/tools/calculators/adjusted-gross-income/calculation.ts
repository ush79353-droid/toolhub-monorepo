import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { FilingStatus, HsaCoverage } from './types';
import {
  CAPITAL_LOSS_LIMIT,
  CAPITAL_LOSS_LIMIT_MFS,
  EDUCATOR_MAX,
  HSA_CATCH_UP_55,
  HSA_FAMILY,
  HSA_SELF_ONLY,
  IRA_CATCH_UP,
  IRA_LIMIT,
  IRA_PHASEOUT_COVERED,
  MEDICARE_RATE,
  SE_NET_EARNINGS_FACTOR,
  SE_TAX_RATE,
  SS_RATE,
  SS_WAGE_BASE_2025,
  STUDENT_LOAN_MAX,
  STUDENT_LOAN_PHASE_JOINT,
  STUDENT_LOAN_PHASE_SINGLE,
  TAX_YEAR_LABEL,
} from './tax-parameters';

export { TAX_YEAR_LABEL };

export interface AgiIncomeUsd {
  wages: number;
  business: number;
  interestDividends: number;
  capitalGains: number;
  retirementDistributions: number;
  unemployment: number;
  alimonyReceived: number;
  taxableSocialSecurity: number;
  otherIncome: number;
}

export interface AgiAdjustmentInputsUsd {
  iraContributions: number;
  studentLoanInterest: number;
  educatorExpenses: number;
  hsaContributions: number;
  healthInsurancePremiums: number;
  earlyWithdrawalPenalty: number;
  alimonyPaid: number;
  movingExpenses: number;
}

function clampNonNeg(n: number): number {
  return n < 0 ? 0 : n;
}

function isJoint(status: FilingStatus): boolean {
  return (
    status === 'married-joint' || status === 'qualifying-surviving-spouse'
  );
}

/** Linear phaseout factor in [0, 1]. */
export function phaseoutFactor(
  magi: number,
  start: number,
  end: number
): number {
  if (!(end > start)) return magi >= end ? 0 : 1;
  if (magi <= start) return 1;
  if (magi >= end) return 0;
  return (end - magi) / (end - start);
}

export function applyCapitalLossLimit(
  capital: number,
  status: FilingStatus
): { included: number; limited: boolean } {
  if (!(capital < 0)) return { included: capital, limited: false };
  const limit =
    status === 'married-separate'
      ? CAPITAL_LOSS_LIMIT_MFS
      : CAPITAL_LOSS_LIMIT;
  const included = Math.max(capital, -limit);
  return { included, limited: included > capital };
}

/** Simplified Schedule SE tax on net SE profit; returns deductible half. */
export function deductibleHalfSeTax(businessProfit: number): number {
  const profit = clampNonNeg(businessProfit);
  if (!(profit > 0)) return 0;
  const netEarnings = profit * SE_NET_EARNINGS_FACTOR;
  if (!(netEarnings > 0)) return 0;
  const ssBase = Math.min(netEarnings, SS_WAGE_BASE_2025);
  const seTax = ssBase * SS_RATE + netEarnings * MEDICARE_RATE;
  // Equivalent check: seTax ≈ netEarnings * 0.153 when under wage base
  void SE_TAX_RATE;
  const half = seTax / 2;
  return Number.isFinite(half) && half > 0 ? half : 0;
}

export function iraDeductionLimit(input: {
  contribution: number;
  magi: number;
  status: FilingStatus;
  coveredByWorkplacePlan: boolean;
  age50OrOver: boolean;
}): { deduction: number; note?: string } {
  const max = IRA_LIMIT + (input.age50OrOver ? IRA_CATCH_UP : 0);
  const allowed = Math.min(clampNonNeg(input.contribution), max);
  if (!(allowed > 0)) return { deduction: 0 };

  if (!input.coveredByWorkplacePlan) {
    return { deduction: allowed };
  }

  let start: number;
  let end: number;
  if (input.status === 'married-separate') {
    start = IRA_PHASEOUT_COVERED.mfs.start;
    end = IRA_PHASEOUT_COVERED.mfs.end;
  } else if (isJoint(input.status)) {
    start = IRA_PHASEOUT_COVERED.jointOrQss.start;
    end = IRA_PHASEOUT_COVERED.jointOrQss.end;
  } else {
    start = IRA_PHASEOUT_COVERED.singleOrHoh.start;
    end = IRA_PHASEOUT_COVERED.singleOrHoh.end;
  }

  const factor = phaseoutFactor(input.magi, start, end);
  const deduction = allowed * factor;
  return {
    deduction,
    note:
      factor < 1
        ? 'Traditional IRA deduction reduced by workplace-plan MAGI phaseout (Pub. 590-A 2025).'
        : undefined,
  };
}

export function studentLoanDeduction(input: {
  interest: number;
  magi: number;
  status: FilingStatus;
}): { deduction: number; note?: string } {
  if (input.status === 'married-separate') {
    return {
      deduction: 0,
      note: 'Student loan interest deduction is not allowed when married filing separately.',
    };
  }
  const capped = Math.min(clampNonNeg(input.interest), STUDENT_LOAN_MAX);
  if (!(capped > 0)) return { deduction: 0 };
  const range = isJoint(input.status)
    ? STUDENT_LOAN_PHASE_JOINT
    : STUDENT_LOAN_PHASE_SINGLE;
  const factor = phaseoutFactor(input.magi, range.start, range.end);
  return {
    deduction: capped * factor,
    note:
      factor < 1
        ? 'Student loan interest reduced by MAGI phaseout (Pub. 970 2025).'
        : undefined,
  };
}

export function hsaDeduction(input: {
  contribution: number;
  coverage: HsaCoverage;
  age55OrOver: boolean;
}): number {
  const base = input.coverage === 'family' ? HSA_FAMILY : HSA_SELF_ONLY;
  const max = base + (input.age55OrOver ? HSA_CATCH_UP_55 : 0);
  return Math.min(clampNonNeg(input.contribution), max);
}

/**
 * Pure AGI engine — all amounts in USD. Round only via formatAgiMoney.
 */
export function calculateAgiUsd(input: {
  filingStatus: FilingStatus;
  age50OrOver: boolean;
  age55OrOver: boolean;
  coveredByWorkplacePlan: boolean;
  hsaCoverage: HsaCoverage;
  selfEmployedHealthInsurance: boolean;
  alimonyReceivedPre2019: boolean;
  alimonyPaidPre2019: boolean;
  armedForcesMove: boolean;
  includeMoreIncome: boolean;
  includeMoreDeductions: boolean;
  income: AgiIncomeUsd;
  adjustments: AgiAdjustmentInputsUsd;
}): {
  grossIncomeUsd: number;
  totalAdjustmentsUsd: number;
  agiUsd: number;
  capitalLossAppliedUsd: number;
  iraDeductionUsd: number;
  studentLoanDeductionUsd: number;
  educatorDeductionUsd: number;
  hsaDeductionUsd: number;
  seHealthDeductionUsd: number;
  halfSeTaxUsd: number;
  earlyWithdrawalUsd: number;
  alimonyPaidUsd: number;
  movingUsd: number;
  notes: string[];
} | null {
  const notes: string[] = [];
  const inc = input.income;
  const adj = input.adjustments;

  const values = [
    inc.wages,
    inc.business,
    inc.interestDividends,
    inc.capitalGains,
    inc.retirementDistributions,
    inc.unemployment,
    inc.alimonyReceived,
    inc.taxableSocialSecurity,
    inc.otherIncome,
    adj.iraContributions,
    adj.studentLoanInterest,
    adj.educatorExpenses,
    adj.hsaContributions,
    adj.healthInsurancePremiums,
    adj.earlyWithdrawalPenalty,
    adj.alimonyPaid,
    adj.movingExpenses,
  ];
  if (!values.every(Number.isFinite)) return null;

  // Nonnegative income lines (except capital gains/losses).
  for (const [label, v] of [
    ['wages', inc.wages],
    ['business', inc.business],
    ['interestDividends', inc.interestDividends],
    ['retirementDistributions', inc.retirementDistributions],
  ] as const) {
    if (v < 0) return null;
    void label;
  }

  const cap = applyCapitalLossLimit(inc.capitalGains, input.filingStatus);
  if (cap.limited) {
    notes.push(
      `Net capital loss included in income is limited to $${input.filingStatus === 'married-separate' ? '1,500' : '3,000'} (Form 1040).`
    );
  }

  let gross =
    clampNonNeg(inc.wages) +
    clampNonNeg(inc.business) +
    clampNonNeg(inc.interestDividends) +
    cap.included +
    clampNonNeg(inc.retirementDistributions);

  if (input.includeMoreIncome) {
    gross += clampNonNeg(inc.unemployment);
    if (input.alimonyReceivedPre2019) {
      gross += clampNonNeg(inc.alimonyReceived);
    } else if (inc.alimonyReceived > 0) {
      notes.push(
        'Alimony received was ignored because the pre-2019 instrument checkbox is off.'
      );
    }
    gross += clampNonNeg(inc.taxableSocialSecurity);
    gross += clampNonNeg(inc.otherIncome);
  }

  if (!Number.isFinite(gross)) return null;

  const educatorDeductionUsd = Math.min(
    clampNonNeg(adj.educatorExpenses),
    EDUCATOR_MAX
  );
  const hsaDeductionUsd = hsaDeduction({
    contribution: adj.hsaContributions,
    coverage: input.hsaCoverage,
    age55OrOver: input.age55OrOver,
  });

  let seHealthDeductionUsd = 0;
  if (input.selfEmployedHealthInsurance && inc.business > 0) {
    seHealthDeductionUsd = Math.min(
      clampNonNeg(adj.healthInsurancePremiums),
      clampNonNeg(inc.business)
    );
  } else if (adj.healthInsurancePremiums > 0) {
    notes.push(
      'Health insurance premiums were not deducted: mark self-employed health insurance eligibility and enter business income (Schedule 1).'
    );
  }

  let halfSeTaxUsd = 0;
  if (input.includeMoreDeductions && inc.business > 0) {
    halfSeTaxUsd = deductibleHalfSeTax(inc.business);
  }

  let earlyWithdrawalUsd = 0;
  let alimonyPaidUsd = 0;
  let movingUsd = 0;
  if (input.includeMoreDeductions) {
    earlyWithdrawalUsd = clampNonNeg(adj.earlyWithdrawalPenalty);
    if (input.alimonyPaidPre2019) {
      alimonyPaidUsd = clampNonNeg(adj.alimonyPaid);
    } else if (adj.alimonyPaid > 0) {
      notes.push(
        'Alimony paid was ignored because the pre-2019 instrument checkbox is off.'
      );
    }
    if (input.armedForcesMove) {
      movingUsd = clampNonNeg(adj.movingExpenses);
    } else if (adj.movingExpenses > 0) {
      notes.push(
        'Moving expenses were ignored: only Armed Forces moves remain deductible under current law.'
      );
    }
  }

  // Adjustments that do not depend on MAGI phaseouts of IRA / student loan.
  const fixedAdjustments =
    educatorDeductionUsd +
    hsaDeductionUsd +
    seHealthDeductionUsd +
    halfSeTaxUsd +
    earlyWithdrawalUsd +
    alimonyPaidUsd +
    movingUsd;

  // MAGI proxy for IRA: AGI before IRA and student loan deductions.
  const magiForIra = gross - fixedAdjustments;
  const ira = iraDeductionLimit({
    contribution: adj.iraContributions,
    magi: magiForIra,
    status: input.filingStatus,
    coveredByWorkplacePlan: input.coveredByWorkplacePlan,
    age50OrOver: input.age50OrOver,
  });
  if (ira.note) notes.push(ira.note);

  const magiForStudent = magiForIra - ira.deduction;
  const student = studentLoanDeduction({
    interest: adj.studentLoanInterest,
    magi: magiForStudent,
    status: input.filingStatus,
  });
  if (student.note) notes.push(student.note);

  const totalAdjustmentsUsd =
    fixedAdjustments + ira.deduction + student.deduction;
  const agiUsd = gross - totalAdjustmentsUsd;

  if (
    ![gross, totalAdjustmentsUsd, agiUsd].every(Number.isFinite) ||
    totalAdjustmentsUsd < 0
  ) {
    return null;
  }

  notes.push(
    `Tax Year ${TAX_YEAR_LABEL} Schedule 1 estimate. Standard/itemized deductions are not included.`
  );

  return {
    grossIncomeUsd: gross,
    totalAdjustmentsUsd,
    agiUsd,
    capitalLossAppliedUsd: cap.included,
    iraDeductionUsd: ira.deduction,
    studentLoanDeductionUsd: student.deduction,
    educatorDeductionUsd,
    hsaDeductionUsd,
    seHealthDeductionUsd,
    halfSeTaxUsd,
    earlyWithdrawalUsd,
    alimonyPaidUsd,
    movingUsd,
    notes,
  };
}

export function formatAgiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
