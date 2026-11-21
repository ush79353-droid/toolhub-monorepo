/**
 * US federal income tax estimate for tax years 2025 and 2026.
 *
 * Official sources:
 * - Rev. Proc. 2024-40 (TY 2025 ordinary / LTCG brackets)
 * - Rev. Proc. 2025-32 + IRS IR-2025-103 (TY 2026 brackets / std. deduction)
 * - P.L. 119-21 (OBBBA): enhanced std. deduction, CTC $2,200, SALT $40k,
 *   Schedule 1-A tips / overtime / car loan interest deductions
 * - IRS Pub. 915 (taxable Social Security worksheet)
 * - IRS Form 1040 / Sch. A / Sch. 8812 / Form 2441 / Form 8863 instructions
 *
 * This is an educational estimate — not a filed Form 1040. See DISCLOSURES.
 */

import type { FilingStatus, TaxYear } from './types';
import {
  AOTC_MAX_PER_STUDENT,
  CHILD_CARE_EXPENSE_MAX_ONE,
  CHILD_CARE_EXPENSE_MAX_TWO,
  OBBBA,
  STUDENT_LOAN_INTEREST_MAX,
  YEAR_PARAMS,
  type Bracket,
} from './tax-parameters';

export interface FederalTaxNumericInput {
  filingStatus: FilingStatus;
  taxYear: TaxYear;
  age: number;
  youngDependents: number;
  otherDependents: number;
  wages: number;
  federalWithheld: number;
  stateWithheld: number;
  localWithheld: number;
  hasSelfEmployment: boolean;
  socialSecurity: number;
  interestIncome: number;
  ordinaryDividends: number;
  qualifiedDividends: number;
  passiveIncome: number;
  shortTermGains: number;
  longTermGains: number;
  otherIncome: number;
  stateLocalTaxRatePercent: number;
  tipsIncome: number;
  overtimeIncome: number;
  carLoanInterest: number;
  iraContributions: number;
  realEstateTax: number;
  mortgageInterest: number;
  charitableDonations: number;
  studentLoanInterest: number;
  childCareExpense: number;
  collegeExpenses: readonly number[];
  otherDeductibles: number;
}

export interface FederalTaxComputation {
  totalReportedIncome: number;
  adjustedGrossIncome: number;
  totalDeductions: number;
  deductionType: 'standard' | 'itemized';
  taxableIncome: number;
  taxBeforeCredits: number;
  totalCredits: number;
  refundableCredits: number;
  nonrefundableCredits: number;
  taxAfterCredits: number;
  federalWithholding: number;
  refundOrOwed: number;
  isRefund: boolean;
  effectiveRatePercent: number;
  disclosures: string[];
}

export const DISCLOSURE_BASE =
  'Educational federal estimate only; not a complete or legally authoritative tax return. State income tax, AMT, NIIT, SE tax, QBI, Form 8960/8959, and many credits/deductions are out of scope.';

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function clampNonNeg(n: number): number {
  return n < 0 ? 0 : n;
}

function isJoint(status: FilingStatus): boolean {
  return status === 'married-joint' || status === 'qualifying-surviving-spouse';
}

/** Progressive ordinary tax on a taxable ordinary amount. */
export function taxFromBrackets(amount: number, brackets: readonly Bracket[]): number {
  if (!(amount > 0) || !Number.isFinite(amount)) return 0;
  for (const b of brackets) {
    if (amount <= b.upTo || !Number.isFinite(b.upTo)) {
      return b.baseTax + (amount - b.from) * b.rate;
    }
  }
  const last = brackets[brackets.length - 1]!;
  return last.baseTax + (amount - last.from) * last.rate;
}

/**
 * Taxable Social Security (Pub. 915 simplified worksheet).
 * baseAgi excludes Social Security benefits.
 */
export function taxableSocialSecurityBenefits(
  benefits: number,
  baseAgi: number,
  status: FilingStatus
): number {
  if (!(benefits > 0)) return 0;
  const halfSs = benefits * 0.5;
  const combined = baseAgi + halfSs;
  let base = 25_000;
  let upper = 34_000;
  if (isJoint(status)) {
    base = 32_000;
    upper = 44_000;
  } else if (status === 'married-separate') {
    // MFS living apart uses single thresholds; living with spouse → up to 85%.
    // Without household detail, apply the conservative 85% ceiling path.
    return roundMoney(Math.min(benefits * 0.85, benefits));
  }
  if (combined <= base) return 0;
  if (combined <= upper) {
    return roundMoney(Math.min(halfSs, (combined - base) * 0.5));
  }
  const tier1 = Math.min(halfSs, (upper - base) * 0.5);
  const tier2 = (combined - upper) * 0.85;
  return roundMoney(Math.min(benefits * 0.85, tier1 + tier2));
}

function phaseoutFactor(
  magi: number,
  start: number,
  width: number
): number {
  if (!(magi > start)) return 1;
  if (!(width > 0)) return 0;
  return clampNonNeg(1 - (magi - start) / width);
}

/** OBBBA Schedule 1-A style linear phaseout (educational when IRS table is not digitized). */
function obbbaDeduction(
  amount: number,
  cap: number,
  magi: number,
  phaseStart: number
): number {
  const eligible = Math.min(clampNonNeg(amount), cap);
  return roundMoney(eligible * phaseoutFactor(magi, phaseStart, OBBBA.phaseoutWidth));
}

/**
 * Student loan interest deduction (§221) — max $2,500 with MAGI phaseout.
 * 2025/2026 phaseout ranges follow IRS inflation of TCJA/OBBBA §221 amounts
 * (single ~$80k–$95k; joint ~$165k–$195k). Exact cents may vary by Rev. Proc.
 */
function studentLoanInterestDeduction(
  interest: number,
  magi: number,
  status: FilingStatus
): number {
  const capped = Math.min(clampNonNeg(interest), STUDENT_LOAN_INTEREST_MAX);
  if (!(capped > 0)) return 0;
  if (status === 'married-separate') return 0;
  const start = isJoint(status) ? 165_000 : 80_000;
  const width = isJoint(status) ? 30_000 : 15_000;
  return roundMoney(capped * phaseoutFactor(magi, start, width));
}

function saltCapAllowed(
  saltPaid: number,
  magi: number,
  status: FilingStatus,
  year: TaxYear
): number {
  const p = YEAR_PARAMS[year];
  const mfs = status === 'married-separate';
  let cap = mfs ? p.saltCapMfs : p.saltCap;
  const floor = mfs ? p.saltFloorMfs : p.saltFloor;
  const phaseStart = mfs ? p.saltPhaseoutStartMfs : p.saltPhaseoutStart;
  if (magi > phaseStart) {
    // OBBBA: cap reduced by 30% of MAGI over threshold, not below floor.
    cap = Math.max(floor, cap - 0.3 * (magi - phaseStart));
  }
  return roundMoney(Math.min(clampNonNeg(saltPaid), cap));
}

/**
 * Qualified dividends + LTCG preferential worksheet (simplified IRS stack):
 * tax ordinary income at ordinary brackets; stack preferential income into
 * 0% / 15% / 20% LTCG brackets using taxable income stacking.
 */
export function taxWithPreferentialIncome(input: {
  taxableIncome: number;
  qualifiedAndLtcg: number;
  brackets: readonly Bracket[];
  zeroMax: number;
  fifteenMax: number;
}): number {
  const { taxableIncome, brackets, zeroMax, fifteenMax } = input;
  const pref = Math.min(clampNonNeg(input.qualifiedAndLtcg), clampNonNeg(taxableIncome));
  const ordinary = clampNonNeg(taxableIncome - pref);
  let tax = taxFromBrackets(ordinary, brackets);

  let remaining = pref;
  let cursor = ordinary;

  const zeroRoom = Math.max(0, zeroMax - cursor);
  const take0 = Math.min(remaining, zeroRoom);
  remaining -= take0;
  cursor += take0;

  const fifteenRoom = Math.max(0, fifteenMax - cursor);
  const take15 = Math.min(remaining, fifteenRoom);
  tax += take15 * 0.15;
  remaining -= take15;

  tax += remaining * 0.2;
  return tax;
}

function childTaxCredits(input: {
  young: number;
  other: number;
  agi: number;
  status: FilingStatus;
  year: TaxYear;
  taxBeforeCredits: number;
}): { nonrefundable: number; refundable: number } {
  const p = YEAR_PARAMS[input.year];
  const young = Math.max(0, Math.floor(input.young));
  const other = Math.max(0, Math.floor(input.other));
  let ctc = young * p.childTaxCreditPerChild;
  let odc = other * p.otherDependentCredit;
  const start = p.ctcPhaseoutStart[input.status];
  const over = Math.max(0, input.agi - start);
  const steps = Math.ceil(over / 1_000);
  const reduction = steps * 50;
  // Reduce CTC first, then ODC (Sch. 8812 ordering simplified).
  const ctcReduced = clampNonNeg(ctc - reduction);
  const remainingReduction = clampNonNeg(reduction - ctc);
  odc = clampNonNeg(odc - remainingReduction);
  ctc = ctcReduced;

  const nonrefundableLimit = clampNonNeg(input.taxBeforeCredits);
  const odcNonref = Math.min(odc, nonrefundableLimit);
  let room = nonrefundableLimit - odcNonref;
  const ctcNonref = Math.min(ctc, room);
  const ctcUnused = ctc - ctcNonref;
  // Additional CTC: lesser of unused CTC and $1,700/child (simplified; ignores earned-income floor detail beyond wages).
  const actcCap = young * p.additionalCtcMaxPerChild;
  const refundable = Math.min(ctcUnused, actcCap);
  return {
    nonrefundable: roundMoney(odcNonref + ctcNonref),
    refundable: roundMoney(refundable),
  };
}

/** Form 2441 dependent care credit — percentage of expenses by AGI. */
function dependentCareCredit(
  expenses: number,
  dependentsForCare: number,
  agi: number,
  taxBeforeCredits: number,
  creditsUsed: number
): number {
  if (!(expenses > 0) || dependentsForCare < 1) return 0;
  const maxExp =
    dependentsForCare >= 2 ? CHILD_CARE_EXPENSE_MAX_TWO : CHILD_CARE_EXPENSE_MAX_ONE;
  const allowed = Math.min(expenses, maxExp);
  let rate = 0.2;
  if (agi <= 15_000) rate = 0.35;
  else if (agi < 43_000) {
    const steps = Math.ceil((agi - 15_000) / 2_000);
    rate = Math.max(0.2, 0.35 - steps * 0.01);
  }
  const credit = allowed * rate;
  const room = clampNonNeg(taxBeforeCredits - creditsUsed);
  return roundMoney(Math.min(credit, room));
}

/** American Opportunity Credit — per student, 40% of up to $2,500 refundable (max $1,000). */
function educationCredits(
  collegeExpenses: readonly number[],
  agi: number,
  status: FilingStatus,
  taxBeforeCredits: number,
  creditsUsed: number
): { nonrefundable: number; refundable: number } {
  if (status === 'married-separate') return { nonrefundable: 0, refundable: 0 };
  const phaseStart = isJoint(status) ? 160_000 : 80_000;
  const phaseEnd = isJoint(status) ? 180_000 : 90_000;
  if (agi >= phaseEnd) return { nonrefundable: 0, refundable: 0 };
  const factor =
    agi <= phaseStart ? 1 : clampNonNeg((phaseEnd - agi) / (phaseEnd - phaseStart));

  let total = 0;
  for (const raw of collegeExpenses) {
    const exp = clampNonNeg(raw);
    if (!(exp > 0)) continue;
    const first = Math.min(exp, 2_000);
    const second = Math.min(Math.max(0, exp - 2_000), 2_000);
    const per = Math.min(AOTC_MAX_PER_STUDENT, first + second * 0.25);
    total += per * factor;
  }
  total = roundMoney(total);
  const refundable = roundMoney(Math.min(total * 0.4, collegeExpenses.filter((e) => e > 0).length * 1_000));
  const nonrefundablePotential = clampNonNeg(total - refundable);
  const room = clampNonNeg(taxBeforeCredits - creditsUsed);
  const nonrefundable = Math.min(nonrefundablePotential, room);
  const unusedNonref = nonrefundablePotential - nonrefundable;
  return {
    nonrefundable: roundMoney(nonrefundable),
    refundable: roundMoney(refundable + unusedNonref * 0), // unused nonref does not become refundable beyond 40% rule
  };
}

export function calculateFederalIncomeTax(
  input: FederalTaxNumericInput
): FederalTaxComputation | null {
  const values = [
    input.age,
    input.youngDependents,
    input.otherDependents,
    input.wages,
    input.federalWithheld,
    input.stateWithheld,
    input.localWithheld,
    input.socialSecurity,
    input.interestIncome,
    input.ordinaryDividends,
    input.qualifiedDividends,
    input.passiveIncome,
    input.shortTermGains,
    input.longTermGains,
    input.otherIncome,
    input.stateLocalTaxRatePercent,
    input.tipsIncome,
    input.overtimeIncome,
    input.carLoanInterest,
    input.iraContributions,
    input.realEstateTax,
    input.mortgageInterest,
    input.charitableDonations,
    input.studentLoanInterest,
    input.childCareExpense,
    input.otherDeductibles,
    ...input.collegeExpenses,
  ];
  if (!values.every((v) => Number.isFinite(v))) return null;
  if (input.age < 0 || input.age > 120) return null;
  if (input.youngDependents < 0 || input.otherDependents < 0) return null;
  if (input.stateLocalTaxRatePercent < 0 || input.stateLocalTaxRatePercent > 100) return null;
  for (const v of values) {
    if (v < 0) return null;
  }

  const disclosures: string[] = [DISCLOSURE_BASE];
  const status = input.filingStatus;
  const year = input.taxYear;
  const params = YEAR_PARAMS[year];

  const qualifiedDividends = Math.min(
    input.qualifiedDividends,
    input.ordinaryDividends
  );
  if (input.qualifiedDividends > input.ordinaryDividends) {
    disclosures.push(
      'Qualified dividends were capped at ordinary dividends (Form 1040 / 1099-DIV relationship).'
    );
  }

  const incomeBeforeSs =
    input.wages +
    input.interestIncome +
    input.ordinaryDividends +
    input.passiveIncome +
    input.shortTermGains +
    input.longTermGains +
    input.otherIncome;

  const taxableSs = taxableSocialSecurityBenefits(
    input.socialSecurity,
    incomeBeforeSs,
    status
  );
  const totalReportedIncome = roundMoney(
    incomeBeforeSs + input.socialSecurity
  );

  // MAGI proxy for phaseouts before above-the-line deductions (tips/OT/car use AGI-like base).
  const magiProxy = roundMoney(incomeBeforeSs + taxableSs);

  const joint = isJoint(status);
  const tipsDed = obbbaDeduction(
    input.tipsIncome,
    OBBBA.tipsMax,
    magiProxy,
    joint ? OBBBA.tipsOtPhaseoutStart.joint : OBBBA.tipsOtPhaseoutStart.single
  );
  const otCap = joint ? OBBBA.overtimeMaxJoint : OBBBA.overtimeMaxSingle;
  const otDed = obbbaDeduction(
    input.overtimeIncome,
    otCap,
    magiProxy,
    joint ? OBBBA.tipsOtPhaseoutStart.joint : OBBBA.tipsOtPhaseoutStart.single
  );
  const carDed = obbbaDeduction(
    input.carLoanInterest,
    OBBBA.carInterestMax,
    magiProxy,
    joint ? OBBBA.carPhaseoutStart.joint : OBBBA.carPhaseoutStart.single
  );
  const iraDed = clampNonNeg(input.iraContributions);
  const studentDed = studentLoanInterestDeduction(
    input.studentLoanInterest,
    magiProxy,
    status
  );

  const adjustments = roundMoney(tipsDed + otDed + carDed + iraDed + studentDed);
  if (tipsDed + otDed + carDed > 0) {
    disclosures.push(
      'OBBBA tips, overtime, and car-loan interest use statutory caps with a linear MAGI phaseout approximation when the published IRS phaseout table is not fully digitized.'
    );
  }
  if (iraDed > 0) {
    disclosures.push(
      'IRA contributions are treated as deductible traditional IRA amounts; Roth contributions and deduction limits/phaseouts by coverage are not fully modeled.'
    );
  }

  const agi = roundMoney(Math.max(0, incomeBeforeSs + taxableSs - adjustments));

  let std = params.standardDeduction[status];
  if (input.age >= 65) {
    std +=
      status === 'married-joint' || status === 'married-separate'
        ? params.additionalStdAgedMarried
        : params.additionalStdAgedUnmarried;
    if (year === 2026) {
      disclosures.push(
        '2026 additional standard deduction for age 65+ uses inflation-rounded amounts ($2,050 unmarried / $1,650 married per IRS §63(f) inflation notes).'
      );
    }
  }

  // State income tax estimate for SALT: rate × (wages + other state-taxable proxy) plus withheld state/local + real estate.
  const stateTaxFromRate = roundMoney(
    (input.stateLocalTaxRatePercent / 100) *
      (input.wages +
        input.interestIncome +
        input.ordinaryDividends +
        input.passiveIncome +
        input.shortTermGains +
        input.longTermGains +
        input.otherIncome)
  );
  const saltPaid =
    stateTaxFromRate +
    input.stateWithheld +
    input.localWithheld +
    input.realEstateTax;
  const saltAllowed = saltCapAllowed(saltPaid, agi, status, year);

  const itemized = roundMoney(
    saltAllowed +
      clampNonNeg(input.mortgageInterest) +
      clampNonNeg(input.charitableDonations) +
      clampNonNeg(input.otherDeductibles)
  );

  const useItemized = itemized > std;
  const totalDeductions = useItemized ? itemized : std;
  const deductionType = useItemized ? 'itemized' : 'standard';
  const taxableIncome = roundMoney(Math.max(0, agi - totalDeductions));

  const prefIncome = roundMoney(
    Math.min(
      taxableIncome,
      qualifiedDividends + clampNonNeg(input.longTermGains)
    )
  );

  const taxBeforeCredits = roundMoney(
    taxWithPreferentialIncome({
      taxableIncome,
      qualifiedAndLtcg: prefIncome,
      brackets: params.ordinaryBrackets[status],
      zeroMax: params.ltcgZeroMax[status],
      fifteenMax: params.ltcgFifteenMax[status],
    })
  );

  const ctc = childTaxCredits({
    young: input.youngDependents,
    other: input.otherDependents,
    agi,
    status,
    year,
    taxBeforeCredits,
  });

  let nonrefundable = ctc.nonrefundable;
  let refundable = ctc.refundable;

  const careDeps = Math.max(
    0,
    Math.floor(input.youngDependents) // care credit typically ages 0–12; screenshot allows care expense up to age 13
  );
  const care = dependentCareCredit(
    input.childCareExpense,
    careDeps,
    agi,
    taxBeforeCredits,
    nonrefundable
  );
  nonrefundable = roundMoney(nonrefundable + care);

  const edu = educationCredits(
    input.collegeExpenses,
    agi,
    status,
    taxBeforeCredits,
    nonrefundable
  );
  nonrefundable = roundMoney(nonrefundable + edu.nonrefundable);
  refundable = roundMoney(refundable + edu.refundable);

  const totalCredits = roundMoney(nonrefundable + refundable);
  const taxAfterNonref = roundMoney(Math.max(0, taxBeforeCredits - nonrefundable));

  const federalWithholding = roundMoney(input.federalWithheld);
  // Net tax after credits (can be negative via refundable credits)
  const netTaxLiability = roundMoney(taxAfterNonref - refundable);
  const refundOrOwed = roundMoney(federalWithholding - netTaxLiability);
  const isRefund = refundOrOwed >= 0;

  const effectiveDenom = agi > 0 ? agi : 0;
  const effectiveRatePercent =
    effectiveDenom > 0
      ? roundMoney((Math.max(0, netTaxLiability) / effectiveDenom) * 100)
      : 0;

  if (input.hasSelfEmployment) {
    disclosures.push(
      'Self-employment was indicated but no net SE income field exists on this form; SE tax, SE health insurance, and QBI are not calculated.'
    );
  }
  if (input.stateWithheld > 0 || input.localWithheld > 0) {
    disclosures.push(
      'State and local income tax withheld are not federal withholding; they may increase the SALT itemized deduction only.'
    );
  }
  if (year === 2026) {
    disclosures.push(
      '2026 SALT cap uses the OBBBA $40,000 statutory base ($20,000 MFS); any separate IRS inflation figure for 2026 is not applied pending publication.'
    );
  }
  disclosures.push(
    'Child & dependent care and education credits use IRS percentage/phaseout rules with simplified eligibility (no Form 2441 provider TIN or AOTC half-time enrollment checks).'
  );

  return {
    totalReportedIncome,
    adjustedGrossIncome: agi,
    totalDeductions,
    deductionType,
    taxableIncome,
    taxBeforeCredits,
    totalCredits,
    refundableCredits: refundable,
    nonrefundableCredits: nonrefundable,
    taxAfterCredits: Math.max(0, netTaxLiability),
    federalWithholding,
    refundOrOwed: Math.abs(refundOrOwed),
    isRefund,
    effectiveRatePercent,
    disclosures,
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export { formatFilingStatusLabel } from './labels';
