import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CHILD_TAX_CREDIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ctc', label: 'What Is the Child Tax Credit?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'ctc-rules-2025', label: 'Tax Year 2025 Rules' },
  { id: 'eligibility-assumptions', label: 'Eligibility Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ctc-faq', label: 'Frequently Asked Questions' },
];

export const CHILD_TAX_CREDIT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which tax year does this calculator use?',
    answer:
      'Tax year 2025. The maximum credit is $2,200 per qualifying child under age 17, with Schedule 8812 phaseout thresholds of $200,000 (single / head of household) and $400,000 (married filing jointly). Sources include IRS Child Tax Credit guidance and 2025 Schedule 8812.',
  },
  {
    question: 'Who counts as a qualifying child here?',
    answer:
      'This tool treats a child as age-eligible when finished years of age are 0–16 (under 17 at year-end). It assumes the child meets other §24 / Schedule 8812 tests (dependent, residency, support, SSN, relationship). Children age 17+ do not qualify for CTC.',
  },
  {
    question: 'Why is the refundable Additional Child Tax Credit not shown as a dollar amount?',
    answer:
      'The refundable ACTC depends on earned income, tax liability, and Schedule 8812 Part II worksheets. This calculator only collects AGI, filing status, and two children’s ages, so ACTC is labeled not determinable rather than invented.',
  },
  {
    question: 'Is this a guaranteed IRS refund?',
    answer:
      'No. Results are educational estimates of the potential Child Tax Credit after income phaseout under simplified eligibility assumptions. They are not tax advice and do not replace Form 1040 / Schedule 8812.',
  },
];
