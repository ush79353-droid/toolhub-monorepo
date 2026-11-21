import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { DEFAULT_POMIS_SCHEME } from './types';

const R = DEFAULT_POMIS_SCHEME.annualInterestRate;
const IND = DEFAULT_POMIS_SCHEME.individualInvestmentLimit.toLocaleString('en-IN');
const JOINT = DEFAULT_POMIS_SCHEME.jointInvestmentLimit.toLocaleString('en-IN');
const MIN = DEFAULT_POMIS_SCHEME.minimumInvestment.toLocaleString('en-IN');
const YEARS = DEFAULT_POMIS_SCHEME.investmentTermYears;

export const POMIS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'POMIS Calculator' },
  { id: 'what-is-pomis', label: 'What Is POMIS?' },
  { id: 'how-it-works', label: 'How Does POMIS Work?' },
  { id: 'how-to-calculate', label: 'How to Calculate Monthly Income' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'interest-rates', label: 'POMIS Interest Rates' },
  { id: 'account-types', label: 'Individual and Joint Accounts' },
  { id: 'limits', label: 'Investment Limits' },
  { id: 'benefits', label: 'Benefits of POMIS' },
  { id: 'maturity', label: 'Maturity and Principal Repayment' },
  { id: 'open-account', label: 'How to Open a POMIS Account' },
  { id: 'close-account', label: 'How to Close a POMIS Account' },
  { id: 'taxation', label: 'Is POMIS Interest Taxable?' },
  { id: 'vs-fd', label: 'POMIS vs. Fixed Deposits' },
  { id: 'who-should', label: 'Who Should Consider POMIS?' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pomis-faq', label: 'Frequently Asked Questions' },
];

export const POMIS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Post Office Monthly Income Scheme?',
    answer:
      'POMIS is an India Post savings product that pays interest monthly on a fixed deposit-like principal and typically returns the principal at the end of a fixed tenure (commonly five years under scheme rules represented here).',
  },
  {
    question: 'How is POMIS monthly income calculated?',
    answer:
      'Monthly income = P × R ÷ (12 × 100), where P is the invested principal in INR and R is the annual interest rate in percent. Example: ₹4,50,000 at 6.6% → ₹2,475 per month.',
  },
  {
    question: 'What is the current POMIS interest rate?',
    answer: `Official rates are notified periodically by the Government of India. This calculator defaults to an editable example rate of ${R}% and does not claim that figure is the live official rate. Check India Post or the latest MoF / NSI notification for the rate applicable at account opening.`,
  },
  {
    question: 'What is the minimum POMIS investment?',
    answer: `This calculator uses a configurable minimum of ₹${MIN} (typically in multiples of ₹${MIN}). Confirm the current official minimum and increment rules before investing.`,
  },
  {
    question: 'What is the maximum investment in an Individual POMIS account?',
    answer: `The configured educational Individual limit is ₹${IND}. Treat this as a scheme-rule setting that can change; verify with India Post.`,
  },
  {
    question: 'What is the maximum investment in a Joint POMIS account?',
    answer: `The configured educational Joint limit is ₹${JOINT}. Joint limits are not modeled as each holder independently receiving a full joint ceiling.`,
  },
  {
    question: 'How long is the POMIS maturity period?',
    answer: `This tool uses a configurable tenure of ${YEARS} years (${YEARS * 12} monthly interest payments). Confirm the official tenure on your account documents.`,
  },
  {
    question: 'Is POMIS interest paid monthly?',
    answer:
      'Yes under the standard scheme model: interest is credited/paid periodically each month while the principal remains invested until maturity (subject to operational rules).',
  },
  {
    question: 'Is POMIS interest taxable?',
    answer:
      'Interest taxation depends on applicable Indian tax law and your circumstances. Do not assume POMIS interest is universally tax-free. Consult a tax professional or official guidance for TDS and return filing.',
  },
  {
    question: 'Is the principal returned after maturity?',
    answer:
      'Under the normal scheme model used here, the invested principal is scheduled to be repaid at maturity, separately from the monthly interest already paid.',
  },
  {
    question: 'Can I open multiple POMIS accounts?',
    answer:
      'Scheme rules may allow more than one account subject to overall investment ceilings and eligibility. Confirm with your post office; this calculator validates per-account type limits only.',
  },
  {
    question: 'Who is eligible for POMIS?',
    answer:
      'Eligibility is defined by official India Post / National Savings scheme rules (typically resident individuals, with joint and guardian/minor provisions as applicable). Check current eligibility before opening an account.',
  },
  {
    question: 'Can senior citizens invest in POMIS?',
    answer:
      'Age alone does not generally bar investment if other eligibility conditions are met. Senior-citizen-specific schemes (such as SCSS) are separate products with different rules and rates.',
  },
  {
    question: 'Can a minor have a POMIS account?',
    answer:
      'Minors may be able to hold accounts through a guardian under scheme rules. Confirm documentation and operational requirements with India Post.',
  },
  {
    question: 'Can I close my POMIS account early?',
    answer:
      'Premature closure may be allowed after a minimum lock-in under official rules, often with a penalty or reduced interest. Exact terms depend on the applicable notification.',
  },
  {
    question: 'What happens if I withdraw before maturity?',
    answer:
      'Early withdrawal can reduce interest earned and may involve deductions. This calculator models the full-tenure income path only and does not simulate premature-closure penalties.',
  },
  {
    question: 'Does the POMIS interest rate change after account opening?',
    answer:
      'For many National Savings products, the rate applicable at account opening governs that deposit for its tenure, while new accounts follow newer notifications. Confirm for your account type; this tool does not auto-update historical deposits when the official rate changes.',
  },
  {
    question: 'Can I reinvest monthly POMIS interest?',
    answer:
      'Monthly interest is typically paid out. Reinvestment would be a separate decision (for example into another savings product). This calculator does not compound monthly POMIS interest into the POMIS principal.',
  },
  {
    question: 'How much monthly income can I earn from ₹1 lakh?',
    answer: `At the example rate of ${R}%: monthly income = 100000 × ${R} ÷ 1200 ≈ ₹${((100000 * R) / 1200).toFixed(2)}. Change the rate field to match the official rate you verify.`,
  },
  {
    question: 'How much monthly income can I earn from ₹5 lakh?',
    answer: `At ${R}% example: 500000 × ${R} ÷ 1200 ≈ ₹${((500000 * R) / 1200).toFixed(2)} per month.`,
  },
  {
    question: 'How much monthly income can I earn from ₹9 lakh?',
    answer: `At ${R}% example and within the configured Individual ceiling: 900000 × ${R} ÷ 1200 ≈ ₹${((900000 * R) / 1200).toFixed(2)} per month.`,
  },
  {
    question: 'What is the difference between POMIS and a fixed deposit?',
    answer:
      'Bank/post-office FDs often pay interest at maturity or at chosen frequencies and may compound; POMIS is structured around monthly income payouts with principal returned at tenure end. Rates, limits, tax treatment, and premature-closure rules differ by product.',
  },
  {
    question: 'Can I nominate someone for a POMIS account?',
    answer:
      'Nomination facilities are generally available for National Savings accounts under applicable rules. Complete nomination formalities at the post office when opening or updating the account.',
  },
  {
    question: 'How do I calculate the total interest earned?',
    answer: `Total interest ≈ monthly income × 12 × tenure years. At ${R}% on ₹4,50,000 for ${YEARS} years: ₹2,475 × 60 = ₹1,48,500 (excluding tax/fees).`,
  },
  {
    question: 'Is POMIS suitable for regular monthly income?',
    answer:
      'It can suit investors seeking predictable monthly cash flow with a government-backed savings product, subject to rate risk on new deposits, investment ceilings, liquidity constraints, and tax. Suitability depends on your goals and risk tolerance.',
  },
];
