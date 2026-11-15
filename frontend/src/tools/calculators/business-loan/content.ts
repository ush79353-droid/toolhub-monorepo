import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BUSINESS_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'understanding-business-loans', label: 'Understanding Business Loans' },
  { id: 'amortization-formula', label: 'Business Loan Amortization Formula' },
  { id: 'interest-vs-apr', label: 'Interest Rate vs. APR vs. Effective APR' },
  { id: 'commercial-fees-explained', label: 'Prepaid, Loaned, & Origination Fees' },
  { id: 'repayment-methods', label: 'Origination Fee Repayment Options' },
  { id: 'step-by-step-example', label: 'Step-by-Step Calculation Example' },
  { id: 'business-loan-faq', label: 'Frequently Asked Questions' },
];

export const BUSINESS_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is a business loan payment calculated?',
    answer:
      'A standard amortized business loan payment is calculated using the formula PMT = P × r / (1 - (1 + r)^(-n)), where P is the total financed principal (loan amount plus any financed fees), r is the periodic effective interest rate, and n is the total number of scheduled payments over the term.',
  },
  {
    question: 'What is the difference between nominal interest rate and APR on a business loan?',
    answer:
      'The nominal interest rate is the stated percentage charged solely on the unpaid principal balance. The Annual Percentage Rate (APR) incorporates the nominal interest rate along with all mandatory lender fees, origination charges, and upfront closing expenses relative to the actual cash proceeds disbursed to your business.',
  },
  {
    question: 'What is the difference between APR and Effective APR?',
    answer:
      'Nominal APR multiplies the periodic interest rate by the number of payment periods in a year (annualizing without compounding). Effective APR (or Annual Percentage Yield / EAR) accounts for the compounding of interest within the year, reflecting the true annualized economic cost of borrowing.',
  },
  {
    question: 'What is the difference between prepaid fees and loaned fees?',
    answer:
      'Prepaid fees (such as application or processing fees) are paid upfront out of pocket by the borrower at loan closing and are not added to the loan balance. Loaned fees (or financed closing costs) are added directly to the loan principal, increasing your periodic payment and accruing interest over the term.',
  },
  {
    question: 'How do origination fee repayment options affect cash flow?',
    answer:
      'Deducting from the loan amount lowers the cash proceeds you receive at closing while keeping your financed balance equal to the loan amount. Rolling into the loan finances the fee so you receive full requested cash, but increases your loan balance and monthly payment. Paying out of pocket preserves your full loan proceeds without increasing periodic debt service.',
  },
  {
    question: 'Can business loan interest be deducted on business taxes?',
    answer:
      'In most tax jurisdictions, legitimate business loan interest payments and amortized loan financing charges are deductible business expenses, provided the loan proceeds are utilized exclusively for qualified operational or capital enterprise purposes. Consult a certified public accountant (CPA) regarding specific deduction limitations.',
  },
];
