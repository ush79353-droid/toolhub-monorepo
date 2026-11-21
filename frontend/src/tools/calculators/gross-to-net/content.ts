import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GROSS_TO_NET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-gross-to-net', label: 'What This Calculator Does' },
  { id: 'gross-to-net-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'gross-to-net-faq', label: 'Frequently Asked Questions' },
];

export const GROSS_TO_NET_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this the same as sales tax / VAT math?',
    answer:
      'No. Here tax is deducted as a percentage of gross (Tax = Gross × rate/100; Net = Gross − Tax). VAT-style tools add tax onto a net price instead.',
  },
  {
    question: 'How do the two modes work?',
    answer:
      'Gross to net: enter gross and the tax rate to get net and tax. Net to gross: enter net and the rate to recover gross = Net / (1 − rate/100). At 100% tax, net-to-gross is undefined.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Gross, net, and tax amount each have independent currencies. Money is normalized into the authoritative side currency before calculation using stored FX rates. The tax percent is never converted.',
  },
];
