import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ESTATE_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-estate-tax-calculator', label: 'What Is This Calculator?' },
  { id: 'estate-tax-formulas', label: 'Formulas & Sources' },
  { id: 'estate-tax-assumptions', label: 'Assumptions' },
  { id: 'estate-tax-example', label: 'Example' },
  { id: 'estate-tax-faq', label: 'Frequently Asked Questions' },
];

export const ESTATE_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which tax year does this use?',
    answer:
      'This estimate uses the Instructions for Form 706 (Rev. July 2026) amounts for decedents dying in calendar year 2026: basic exclusion amount $15,000,000 and applicable credit amount $5,945,800 (IRC §§2001, 2010; Rev. Proc. 2025-32 / OBBBA §70106).',
  },
  {
    question: 'How are tax-free lifetime gifts handled?',
    answer:
      'The screenshot field is labeled tax-free lifetime gifts (annual-exclusion style). Those amounts are shown for context only. They are not treated as adjusted taxable gifts, are not added to the taxable estate, and do not reduce the basic exclusion amount in this estimate. Taxable lifetime gifts require Form 709 detail this tool does not collect.',
  },
  {
    question: 'Are state estate or inheritance taxes included in the federal tax?',
    answer:
      'State inheritance or estate taxes you enter are deducted when computing the taxable estate (IRC §2058-style deduction). The estimated federal estate tax itself is only the federal liability. Many states impose separate estate or inheritance taxes; this tool does not compute those state taxes.',
  },
  {
    question: 'Is life insurance always in the gross estate?',
    answer:
      'This estimate assumes the life insurance benefit you enter is includible (for example under IRC §2042 when the decedent retained incidents of ownership or the estate is the beneficiary). Proceeds payable to others with no retained incidents may be excluded; adjust the input accordingly.',
  },
];
