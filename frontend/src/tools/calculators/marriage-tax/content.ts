import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARRIAGE_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-marriage-tax', label: 'What Is a Marriage Tax Penalty or Bonus?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'ty-2026-rules', label: 'Tax Year 2026 Rules' },
  { id: 'assumptions', label: 'Assumptions and Limits' },
  { id: 'marriage-tax-faq', label: 'Frequently Asked Questions' },
];

export const MARRIAGE_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compare?',
    answer:
      'It estimates combined federal, simplified self-employment, and flat state/city tax if each spouse files under their before-marriage status, versus filing married jointly for tax year 2026. A positive difference is a marriage penalty; a negative difference is a marriage bonus.',
  },
  {
    question: 'Which tax year and sources are used?',
    answer:
      'Tax year 2026 ordinary brackets and standard deductions come from the shared Income Tax Calculator parameters (Rev. Proc. 2025-32 / IR-2025-103, OBBBA-enhanced standard deductions).',
  },
  {
    question: 'What if I decline the standard deduction?',
    answer:
      'The screenshot does not collect itemized dollar amounts. If “Use Standard Deduction?” is No, this estimate uses $0 itemized deductions rather than inventing Schedule A totals.',
  },
  {
    question: 'How are self-employment tax and dependents simplified?',
    answer:
      'Self-employment tax uses a simplified SE base (Social Security + Medicare on SE income); the deductible employer-equivalent half of SE tax (SE½) is not subtracted from AGI here. Dependents feed a simplified Child Tax Credit only — not a full dependent-exemption or Schedule 8812 ACTC model.',
  },
];
