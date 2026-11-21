import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DISCRETIONARY_INCOME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Discretionary Income Calculator' },
  { id: 'what-is', label: 'What Is Discretionary Income?' },
  { id: 'vs-disposable', label: 'Discretionary vs. Disposable Income' },
  { id: 'how-calculated', label: 'How Is Discretionary Income Calculated?' },
  { id: 'student-loans', label: 'Discretionary Income and Student Loans' },
  { id: 'agi', label: 'What Is Adjusted Gross Income?' },
  { id: 'fpl', label: 'What Are Federal Poverty Guidelines?' },
  { id: 'marital', label: 'How Does Marital Status Affect DI?' },
  { id: 'how-to-student', label: 'How to Calculate DI for Student Loans' },
  { id: 'how-to-budget', label: 'How to Calculate DI for Budgeting' },
  { id: 'increase', label: 'How to Increase Discretionary Income' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'limitations', label: 'Limitations of the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'discretionary-income-faq', label: 'Frequently Asked Questions' },
];

export const DISCRETIONARY_INCOME_FAQS: readonly FAQItem[] = [
  {
    question: 'What is discretionary income?',
    answer:
      'In budgeting, it is income left after necessary expenses. For federal student loans, it is income above a poverty-guideline threshold under a named repayment calculation standard.',
  },
  {
    question: 'How do I calculate discretionary income?',
    answer:
      'Budgeting: take-home − necessary expenses. Student loans: max(0, applicable AGI − k × poverty guideline), where k is the plan’s protection multiplier.',
  },
  {
    question: 'What is the difference between disposable and discretionary income?',
    answer:
      'Disposable income is generally income after taxes. Budgeting discretionary income subtracts necessary living costs. Student-loan DI uses a statutory threshold formula — not your grocery budget.',
  },
  {
    question: 'How is discretionary income calculated for student loans?',
    answer:
      'Select a calculation standard, state, AGI, family size, and HHS guideline year, then compute DI = max(0, AGI − kP).',
  },
  {
    question: 'Does discretionary income include taxes?',
    answer:
      'Student-loan DI starts from AGI (already after certain adjustments, not a net paycheck). Budgeting mode uses take-home pay you enter.',
  },
  {
    question: 'What is adjusted gross income?',
    answer:
      'AGI is total income minus specific adjustments on your federal return. It differs from gross wages and from take-home pay.',
  },
  {
    question: 'What is a federal poverty guideline?',
    answer:
      'An annual HHS income figure by household size and region (contiguous/DC, Alaska, or Hawaii) used by many federal programs.',
  },
  {
    question: 'Does marital status affect discretionary income?',
    answer:
      'Yes. Filing status can change whether spouse AGI is included and how family size is counted — rules are standard-specific.',
  },
  {
    question: 'Does filing jointly affect student-loan payments?',
    answer:
      'Often yes, because combined AGI and a larger family size can change DI and estimated payments. Confirm with your plan rules.',
  },
  {
    question: 'How does family size affect discretionary income?',
    answer:
      'Larger family size raises the poverty guideline, increasing protected income and typically lowering DI.',
  },
  {
    question: 'Can discretionary income be zero?',
    answer:
      'Yes. If AGI is at or below protected income, student-loan DI is zero under the threshold formula.',
  },
  {
    question: 'Can budgeting discretionary income be negative?',
    answer:
      'Yes. If necessary expenses exceed take-home income, budgeting DI is negative and is not floored at zero.',
  },
  {
    question: 'Is discretionary income the same as net income?',
    answer:
      'No. Net or take-home pay is after taxes and withholdings; DI definitions subtract either a poverty threshold or necessary expenses.',
  },
  {
    question: 'Why do student-loan repayment plans use discretionary income?',
    answer:
      'IDR formulas tie payments to income above a protected living standard so payments scale with ability to pay under program rules.',
  },
  {
    question: 'How does the income protection percentage work?',
    answer:
      'The multiplier k (e.g. 150% or 225%) scales the poverty guideline into protected income that is subtracted from AGI.',
  },
  {
    question: 'What if my income changes?',
    answer:
      'IDR borrowers typically recertify income periodically. Recalculate with updated AGI and the correct guideline year.',
  },
  {
    question: 'Does my state affect the calculation?',
    answer:
      'Yes. Alaska and Hawaii use different HHS poverty guidelines than the contiguous states and D.C.',
  },
  {
    question: 'Are Alaska and Hawaii poverty guidelines different?',
    answer:
      'Yes. HHS publishes separate higher guideline tables for Alaska and Hawaii.',
  },
  {
    question: 'Can I use this calculator for personal budgeting?',
    answer:
      'Yes — switch to general discretionary income mode. That path does not apply poverty guidelines.',
  },
  {
    question: 'How accurate is the estimated student-loan payment?',
    answer:
      'It applies the selected standard’s published rate to DI only. Caps, eligibility, loan type, and servicer calculations can differ — treat it as informational.',
  },
];
