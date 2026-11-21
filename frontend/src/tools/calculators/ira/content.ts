import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  IRA_BASE_LIMIT_USD,
  IRA_CATCH_UP_AGE,
  IRA_CATCH_UP_USD,
  IRA_RULE_YEAR,
} from './ira-limits';

export const IRA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'IRA Calculator' },
  { id: 'definition', label: 'Traditional vs Roth' },
  { id: 'formula', label: 'Growth and Withdrawal Formulas' },
  { id: 'limits', label: `IRS ${IRA_RULE_YEAR} Contribution Limits` },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'example', label: 'Worked Example' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ira-faq', label: 'Frequently Asked Questions' },
];

export const IRA_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this IRA calculator compare?',
    answer:
      'It compares a Traditional/SEP/SIMPLE-style deductible contribution path with a Roth after-tax contribution path using the same contribution years, return rate, and withdrawal horizon. SEP and SIMPLE employer formulas are not separately modeled.',
  },
  {
    question: `What is the IRS IRA contribution limit for ${IRA_RULE_YEAR}?`,
    answer: `For ${IRA_RULE_YEAR}, the combined Traditional and Roth IRA contribution limit is $${IRA_BASE_LIMIT_USD.toLocaleString('en-US')} ($${IRA_BASE_LIMIT_USD + IRA_CATCH_UP_USD} if you are age ${IRA_CATCH_UP_AGE} or older), or your taxable compensation if lower. Source: IRS retirement topics / Notice 2025-67.`,
  },
  {
    question: 'How is the Roth contribution related to the Traditional contribution?',
    answer:
      'When you edit the Traditional contribution or the contribution tax bracket, the Roth field defaults to Traditional × (1 − contribution tax rate) so both paths use comparable cash outlays. You can override either field.',
  },
  {
    question: 'What contribution timing is assumed?',
    answer:
      'End-of-year ordinary annuity: each year’s contribution is applied at year-end, then the balance compounds annually at the stated return.',
  },
  {
    question: 'How are withdrawals calculated?',
    answer:
      'The calculator solves for a constant annual withdrawal that amortizes the projected balance over the withdrawal years while the remaining balance continues to earn the same annual return.',
  },
  {
    question: 'Are RMDs or early-withdrawal penalties included?',
    answer:
      'No. Results are educational estimates and do not model required minimum distributions, 10% early-withdrawal penalties, NIIT, or state taxes.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Money fields use Omega’s stored exchange-rate map. Missing rates block conversion; stale rates still convert with a warning. IRS limits are checked in USD after conversion.',
  },
];
