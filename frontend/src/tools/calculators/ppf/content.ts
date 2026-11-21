import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { DEFAULT_PPF_SCHEME } from './types';

const R = DEFAULT_PPF_SCHEME.defaultAnnualInterestRate;
const MAX = DEFAULT_PPF_SCHEME.maximumAnnualDeposit.toLocaleString('en-IN');
const MIN = DEFAULT_PPF_SCHEME.minimumAnnualDeposit.toLocaleString('en-IN');

export const PPF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'PPF Calculator' },
  { id: 'what-is-ppf', label: 'What Is a PPF Account?' },
  { id: 'how-ppf-works', label: 'How Does PPF Work?' },
  { id: 'how-to-calculate', label: 'How to Calculate PPF Returns' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'interest-rates', label: 'PPF Interest Rates' },
  { id: 'limits', label: 'Minimum and Maximum Investment' },
  { id: 'maturity', label: 'PPF Maturity Period' },
  { id: 'fifth-day', label: 'Deposit Before or After the Fifth Day' },
  { id: 'monthly-vs-annual', label: 'Monthly vs. Annual Investment' },
  { id: 'tax', label: 'PPF Tax Benefits' },
  { id: 'withdrawal', label: 'PPF Withdrawal Rules' },
  { id: 'loan', label: 'PPF Loan Facility' },
  { id: 'extension', label: 'PPF Account Extension' },
  { id: 'example', label: 'Interest Calculation Example' },
  { id: 'vs-fd', label: 'PPF vs. Fixed Deposit' },
  { id: 'vs-epf', label: 'PPF vs. EPF' },
  { id: 'pros-cons', label: 'Advantages and Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ppf-faq', label: 'Frequently Asked Questions' },
];

export const PPF_FAQS: readonly FAQItem[] = [
  {
    question: 'What is PPF?',
    answer:
      'Public Provident Fund is a long-term savings scheme in India with annual deposit limits, government-notified interest, and a standard 15-year maturity measured from the end of the opening financial year.',
  },
  {
    question: 'How does a PPF calculator work?',
    answer:
      'It schedules deposits, applies the 5th-day eligible-balance rule each month, accrues interest monthly, credits interest at financial-year end, and projects the balance to maturity (with optional extension and inflation adjustment).',
  },
  {
    question: 'What is the current PPF interest rate?',
    answer: `Official rates are notified quarterly. This calculator defaults to an editable illustrative rate of ${R}% and does not claim that figure is the live official rate. Verify the applicable notification for each period.`,
  },
  {
    question: 'How is PPF interest calculated?',
    answer:
      'Each month, interest is computed on the minimum balance between the close of the fifth day and month-end (with no withdrawals, that is the balance after deposits on/before the 5th). MonthlyInterest = EligibleBalance × R ÷ 1,200. Accrued interest is credited at FY end.',
  },
  {
    question: 'Is PPF interest compounded monthly or yearly?',
    answer:
      'Interest accrues monthly on the eligible balance but is credited annually at the end of the financial year. Credited interest then earns interest in later periods.',
  },
  {
    question: 'What is the maximum PPF investment per year?',
    answer: `This tool uses a configurable maximum of ₹${MAX} of aggregate eligible contributions per Indian financial year (April–March). Confirm the official ceiling before depositing.`,
  },
  {
    question: 'What is the minimum PPF deposit?',
    answer: `The configured educational minimum is ₹${MIN} per financial year (typically in ₹${DEFAULT_PPF_SCHEME.depositIncrement} increments). Missing the minimum can attract penalties under scheme rules.`,
  },
  {
    question: 'What is the PPF maturity period?',
    answer:
      'Accounts generally mature 15 years from the end of the financial year in which they were opened — for example, an account opened in FY 2026–27 matures on 31 March 2042 under this model.',
  },
  {
    question: 'Can I deposit monthly in PPF?',
    answer:
      'Yes. You may deposit any number of times in a year as long as the annual aggregate stays within limits. This calculator supports monthly, quarterly, half-yearly, and annual fixed schedules.',
  },
  {
    question: 'Can I deposit ₹1,50,000 at once?',
    answer:
      'Yes, if that amount is within the annual limit and increment rules. A single early-in-month deposit can maximize months of eligibility versus spreading deposits after the 5th.',
  },
  {
    question: 'What happens if I deposit after the fifth day?',
    answer:
      'Deposits after the 5th generally do not raise that month’s eligible interest balance; they begin influencing eligibility from the following month.',
  },
  {
    question: 'Can I open multiple PPF accounts?',
    answer:
      'Scheme rules restrict individuals from holding multiple PPF accounts in their own name (exceptions such as guardianship accounts may apply). Confirm current rules with the account office.',
  },
  {
    question: 'Can I withdraw PPF money before maturity?',
    answer:
      'Partial withdrawals may be allowed after a lock-in under specified conditions and limits. This calculator models contributions and interest only — not withdrawals.',
  },
  {
    question: 'Can I extend PPF after 15 years?',
    answer:
      'Yes, typically in five-year blocks, with or without fresh contributions subject to declaration and timing rules. This tool offers optional +5 year projections.',
  },
  {
    question: 'Is PPF interest tax-free?',
    answer:
      'PPF is commonly treated as EEE (exempt-exempt-exempt) under older tax frameworks for eligible accounts, but tax treatment depends on the law and regime in force. Do not assume identical treatment for every taxpayer.',
  },
  {
    question: 'Can I claim Section 80C benefits for PPF?',
    answer:
      'Eligible contributions may qualify for deduction under Section 80C within overall 80C limits when you opt for a regime that allows it. New-regime eligibility differs — check current tax law.',
  },
  {
    question: 'Can an NRI open a PPF account?',
    answer:
      'New PPF accounts by NRIs are generally not permitted under current scheme practice; resident accounts that later become NRI may have restricted contribution rules. Verify with the account office.',
  },
  {
    question: 'Can a minor have a PPF account?',
    answer:
      'Yes, a guardian can open and operate a PPF account for a minor under applicable rules. Contribution limits still apply.',
  },
  {
    question: 'What happens if I miss a yearly deposit?',
    answer:
      'Failing to meet the minimum annual deposit can attract a reactivation fee and other consequences under scheme rules. Keep at least the minimum each FY you intend to maintain the account.',
  },
  {
    question: 'Can I take a loan against PPF?',
    answer:
      'Loans against PPF balances may be available in eligible years under capped percentages and repayment conditions. This calculator does not simulate loans.',
  },
  {
    question: 'Can PPF interest rates change?',
    answer:
      'Yes. Rates are reviewed periodically. Existing projections that assume a constant rate are illustrations only; historical Mode B can apply stored period rates when configured.',
  },
  {
    question: 'What is the difference between PPF and EPF?',
    answer:
      'EPF is employment-linked with employee/employer contributions and EPFO administration. PPF is a voluntary individual/small-savings account with annual ceilings and post office/bank channels.',
  },
  {
    question: 'What is the difference between PPF and FD?',
    answer:
      'Bank/post-office FDs have flexible tenures and different tax/liquidity rules. PPF has a long statutory tenure, annual contribution caps, and distinctive interest-crediting mechanics.',
  },
  {
    question: 'What happens when my PPF account matures?',
    answer:
      'You may close and withdraw the balance, or extend in five-year blocks with or without further deposits, subject to scheme formalities.',
  },
  {
    question: 'How can I calculate PPF maturity value?',
    answer:
      'Schedule deposits, apply monthly eligible-balance interest, credit interest each 31 March, and accumulate until the FY-based maturity date. Use this calculator rather than a plain SIP FV formula.',
  },
  {
    question: 'What is the best month to invest in PPF?',
    answer:
      'Deposits on or before the 5th earn that month’s interest eligibility. Many investors prefer early-month deposits, especially early in the financial year, to maximize compounding months — subject to cash-flow needs.',
  },
  {
    question: 'What happens if I invest more than the annual limit?',
    answer:
      'Excess contributions are not eligible under scheme rules and should be avoided. This calculator rejects schedules that exceed the configured FY maximum.',
  },
  {
    question: 'How does inflation affect PPF returns?',
    answer:
      'Inflation reduces purchasing power. This tool optionally shows RealValue = FV / (1+i)^t separately from the nominal maturity balance.',
  },
  {
    question: 'Can I continue PPF without further deposits?',
    answer:
      'After maturity, extension without contributions lets the balance continue earning interest under applicable rules. During the original tenure you still need to meet annual minimums if the account remains active.',
  },
  {
    question: 'Can I nominate someone for my PPF account?',
    answer:
      'Yes. Nomination facilities are generally available; complete nomination formalities with the account office.',
  },
];
