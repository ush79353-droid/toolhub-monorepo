import type { FilingStatus, TaxYear } from './tax-parameters';

export type { FilingStatus, TaxYear };

/** Screenshot-first US federal income tax inputs. Fixed USD — no FX. */
export interface IncomeTaxInput {
  filingStatus: FilingStatus;
  youngDependents: string;
  otherDependents: string;
  taxYear: TaxYear;
  age: string;
  wages: string;
  federalWithheld: string;
  stateWithheld: string;
  localWithheld: string;
  hasSelfEmployment: 'yes' | 'no';
  socialSecurity: string;
  interestIncome: string;
  ordinaryDividends: string;
  qualifiedDividends: string;
  passiveIncome: string;
  shortTermGains: string;
  longTermGains: string;
  otherIncome: string;
  stateLocalTaxRatePercent: string;
  tipsIncome: string;
  overtimeIncome: string;
  carLoanInterest: string;
  iraContributions: string;
  realEstateTax: string;
  mortgageInterest: string;
  charitableDonations: string;
  studentLoanInterest: string;
  childCareExpense: string;
  collegeStudent1: string;
  collegeStudent2: string;
  collegeStudent3: string;
  collegeStudent4: string;
  otherDeductibles: string;
}

export interface IncomeTaxResult {
  taxYear: TaxYear;
  filingStatus: FilingStatus;
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
  formattedTotalReportedIncome: string;
  formattedAdjustedGrossIncome: string;
  formattedTotalDeductions: string;
  formattedTaxableIncome: string;
  formattedTaxBeforeCredits: string;
  formattedTotalCredits: string;
  formattedTaxAfterCredits: string;
  formattedFederalWithholding: string;
  formattedRefundOrOwed: string;
  formattedEffectiveRate: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type IncomeTaxFieldErrors = {
  age?: string;
  wages?: string;
  federalWithheld?: string;
  stateWithheld?: string;
  localWithheld?: string;
  youngDependents?: string;
  otherDependents?: string;
  socialSecurity?: string;
  interestIncome?: string;
  ordinaryDividends?: string;
  qualifiedDividends?: string;
  passiveIncome?: string;
  shortTermGains?: string;
  longTermGains?: string;
  otherIncome?: string;
  stateLocalTaxRatePercent?: string;
  tipsIncome?: string;
  overtimeIncome?: string;
  carLoanInterest?: string;
  iraContributions?: string;
  realEstateTax?: string;
  mortgageInterest?: string;
  charitableDonations?: string;
  studentLoanInterest?: string;
  childCareExpense?: string;
  collegeStudent1?: string;
  collegeStudent2?: string;
  collegeStudent3?: string;
  collegeStudent4?: string;
  otherDeductibles?: string;
  form?: string;
};

export function createDefaultInput(): IncomeTaxInput {
  return {
    filingStatus: 'single',
    youngDependents: '0',
    otherDependents: '0',
    taxYear: 2025,
    age: '30',
    wages: '80000',
    federalWithheld: '9000',
    stateWithheld: '0',
    localWithheld: '0',
    hasSelfEmployment: 'no',
    socialSecurity: '0',
    interestIncome: '0',
    ordinaryDividends: '0',
    qualifiedDividends: '0',
    passiveIncome: '0',
    shortTermGains: '0',
    longTermGains: '0',
    otherIncome: '0',
    stateLocalTaxRatePercent: '0',
    tipsIncome: '0',
    overtimeIncome: '0',
    carLoanInterest: '0',
    iraContributions: '0',
    realEstateTax: '0',
    mortgageInterest: '0',
    charitableDonations: '0',
    studentLoanInterest: '0',
    childCareExpense: '0',
    collegeStudent1: '0',
    collegeStudent2: '0',
    collegeStudent3: '0',
    collegeStudent4: '0',
    otherDeductibles: '0',
  };
}

export function inputsEqual(a: IncomeTaxInput, b: IncomeTaxInput): boolean {
  return (
    a.filingStatus === b.filingStatus &&
    a.youngDependents === b.youngDependents &&
    a.otherDependents === b.otherDependents &&
    a.taxYear === b.taxYear &&
    a.age === b.age &&
    a.wages === b.wages &&
    a.federalWithheld === b.federalWithheld &&
    a.stateWithheld === b.stateWithheld &&
    a.localWithheld === b.localWithheld &&
    a.hasSelfEmployment === b.hasSelfEmployment &&
    a.socialSecurity === b.socialSecurity &&
    a.interestIncome === b.interestIncome &&
    a.ordinaryDividends === b.ordinaryDividends &&
    a.qualifiedDividends === b.qualifiedDividends &&
    a.passiveIncome === b.passiveIncome &&
    a.shortTermGains === b.shortTermGains &&
    a.longTermGains === b.longTermGains &&
    a.otherIncome === b.otherIncome &&
    a.stateLocalTaxRatePercent === b.stateLocalTaxRatePercent &&
    a.tipsIncome === b.tipsIncome &&
    a.overtimeIncome === b.overtimeIncome &&
    a.carLoanInterest === b.carLoanInterest &&
    a.iraContributions === b.iraContributions &&
    a.realEstateTax === b.realEstateTax &&
    a.mortgageInterest === b.mortgageInterest &&
    a.charitableDonations === b.charitableDonations &&
    a.studentLoanInterest === b.studentLoanInterest &&
    a.childCareExpense === b.childCareExpense &&
    a.collegeStudent1 === b.collegeStudent1 &&
    a.collegeStudent2 === b.collegeStudent2 &&
    a.collegeStudent3 === b.collegeStudent3 &&
    a.collegeStudent4 === b.collegeStudent4 &&
    a.otherDeductibles === b.otherDeductibles
  );
}
