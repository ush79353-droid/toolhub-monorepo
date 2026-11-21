import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'EMI Calculator' },
  { id: 'what-is-emi', label: 'What Is EMI?' },
  { id: 'stands-for', label: 'What Does EMI Stand For?' },
  { id: 'how-it-works', label: 'How an EMI Calculator Works' },
  { id: 'formula', label: 'EMI Formula' },
  { id: 'step-by-step', label: 'Calculate EMI Step by Step' },
  { id: 'monthly-rate', label: 'Monthly Interest Rate' },
  { id: 'total-interest', label: 'Total Interest' },
  { id: 'total-repayment', label: 'Total Repayment' },
  { id: 'amortization', label: 'Amortization Schedule' },
  { id: 'principal-vs-interest', label: 'Principal vs. Interest' },
  { id: 'tenure', label: 'How Tenure Affects EMI' },
  { id: 'rates', label: 'How Rates Affect EMI' },
  { id: 'fixed-vs-floating', label: 'Fixed vs. Floating Rates' },
  { id: 'emi-changes', label: 'Can EMI Change?' },
  { id: 'extra-payments', label: 'Extra Payments' },
  { id: 'home-loans', label: 'Home Loans' },
  { id: 'car-loans', label: 'Car Loans' },
  { id: 'personal-loans', label: 'Personal Loans' },
  { id: 'vs-simple', label: 'EMI vs. Simple Interest' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'emi-faq', label: 'Frequently Asked Questions' },
];

export const EMI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is EMI?',
    answer:
      'EMI is a fixed monthly payment that covers both interest and principal on a reducing-balance loan, so the loan is fully repaid by the end of the term if all payments are made as scheduled.',
  },
  {
    question: 'What does EMI stand for?',
    answer: 'EMI stands for Equated Monthly Installment.',
  },
  {
    question: 'How do I calculate EMI?',
    answer:
      'Convert the annual nominal rate to a monthly rate r = R/1200, set n to the number of months, then use EMI = P × r(1+r)^n / ((1+r)^n − 1). If R = 0%, EMI = P/n.',
  },
  {
    question: 'What is the EMI formula?',
    answer:
      'EMI = P × r(1+r)^n / ((1+r)^n − 1), where P is principal, r is the monthly rate, and n is the installment count.',
  },
  {
    question: 'How do I calculate monthly EMI manually?',
    answer:
      'Example: P = 500,000, R = 10%, n = 60 → r = 0.008333… → EMI ≈ 10,623.52. Multiply EMI by n for total payable, then subtract P for total interest.',
  },
  {
    question: 'Can EMI change during the loan term?',
    answer:
      'Fixed-rate EMIs stay constant if the contract does. Floating-rate loans, restructuring, or missed payments can change the installment. This calculator models a fixed nominal rate.',
  },
  {
    question: 'What happens when the interest rate increases?',
    answer:
      'A higher rate raises the monthly EMI for the same principal and term, and increases total interest over the life of the loan.',
  },
  {
    question: 'What happens when the interest rate decreases?',
    answer:
      'A lower rate reduces EMI and total interest for the same principal and tenure.',
  },
  {
    question: 'Does a longer loan tenure reduce EMI?',
    answer:
      'Usually yes: spreading principal over more months lowers the monthly installment, but total interest typically rises.',
  },
  {
    question: 'Does a shorter loan tenure reduce total interest?',
    answer:
      'Yes. Paying off faster usually means less cumulative interest, though each EMI is higher.',
  },
  {
    question: 'What is the difference between EMI and interest?',
    answer:
      'EMI is the monthly payment (principal + interest for that month). Interest is only the cost of borrowing; total interest is total payable minus principal.',
  },
  {
    question: 'What is an amortization schedule?',
    answer:
      'A period-by-period table showing each payment’s interest, principal, and remaining balance until the loan reaches zero.',
  },
  {
    question: 'How much interest do I pay on a loan?',
    answer:
      'Total interest ≈ EMI × n − principal for a fixed EMI loan with no extras. Check the amortization table for month-by-month interest.',
  },
  {
    question: 'How do I calculate EMI for a car loan?',
    answer:
      'Use the same EMI formula with the financed vehicle amount, the lender’s annual rate, and the tenure in months. Fees may be financed separately.',
  },
  {
    question: 'How do I calculate EMI for a home loan?',
    answer:
      'Enter the mortgage principal (often property price minus down payment), annual rate, and term. Taxes and insurance are usually outside basic EMI.',
  },
  {
    question: 'Can I pay more than my monthly EMI?',
    answer:
      'Many lenders allow extra principal payments. This calculator’s optional extra-payment mode shows faster payoff and interest saved; confirm your lender’s rules.',
  },
  {
    question: 'Does early repayment reduce interest?',
    answer:
      'Yes, when extras reduce principal. Less balance remains to accrue interest, so total interest falls if the rate and payment rules allow it.',
  },
  {
    question: 'What happens if I miss an EMI payment?',
    answer:
      'Lenders may charge late fees, report delinquency, or restructure the loan. This tool does not model penalties or credit reporting.',
  },
  {
    question: 'Can I calculate EMI with a 0% interest rate?',
    answer: 'Yes. With R = 0%, EMI = principal ÷ number of months and total interest is zero.',
  },
  {
    question: 'Is EMI calculated using flat or reducing-balance interest?',
    answer:
      'This calculator uses reducing-balance (amortizing) interest. Flat-rate products use a different convention and are not modeled here.',
  },
  {
    question: 'What factors affect monthly EMI?',
    answer:
      'Principal, nominal annual rate, tenure, and payment frequency. Fees, insurance, and floating-rate resets can also change what you pay.',
  },
  {
    question: 'How do I calculate the remaining loan balance?',
    answer:
      'Use the amortization schedule after k payments, or the closed form B_k = P(1+r)^k − EMI × ((1+r)^k − 1)/r when r > 0. Enable “payments already made” in this tool.',
  },
];
