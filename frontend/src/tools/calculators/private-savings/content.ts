import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRIVATE_SAVINGS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-private-savings', label: 'What Is Private Savings?' },
  { id: 'private-savings-formula', label: 'Private Savings Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'private-savings-faq', label: 'Frequently Asked Questions' },
];

export const PRIVATE_SAVINGS_FAQS: readonly FAQItem[] = [
  {
    question: 'How is private savings calculated?',
    answer:
      'Private savings uses the basic macroeconomic identity Sp = Y − T − C, where Y is total income, T is taxes paid to government, and C is consumption. The result can be zero or negative.',
  },
  {
    question: 'What does a negative private savings result mean?',
    answer:
      'Negative private savings is dissaving: consumption and taxes together exceed income for the period. Households may fund that gap with prior savings, borrowing, or asset sales. The calculator reports the signed amount and labels it as dissaving.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Total income, taxes, consumption, and private savings each have independent currencies. Income, taxes, and consumption are normalized into the private-savings currency before Sp = Y − T − C runs. Missing rates block conversion; stale rates warn but still convert. Never assume a 1:1 exchange between different currencies.',
  },
  {
    question: 'What does “Include additional parameters” do?',
    answer:
      'The checkbox matches the reference layout. This tool does not unlock extra inputs because no verified additional-parameter formulas are defined in project specifications. The basic identity Sp = Y − T − C always applies.',
  },
];
