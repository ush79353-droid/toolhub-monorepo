import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_TO_GROSS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-net-to-gross', label: 'What This Calculator Does' },
  { id: 'net-to-gross-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'net-to-gross-faq', label: 'Frequently Asked Questions' },
];

export const NET_TO_GROSS_FAQS: readonly FAQItem[] = [
  {
    question: 'How is this different from the Gross to Net Calculator?',
    answer:
      'Gross to Net uses a single tax rate applied as a percent of gross (Tax = Gross × rate/100). This Net to Gross tool exposes two equivalent views of the same tax — percent of net (rN) and percent of gross (rG) — and synchronizes net, gross, tax, and both rates from any valid pair of inputs.',
  },
  {
    question: 'Are the two percentage fields two different taxes?',
    answer:
      'No. They describe the same tax amount. For example, net 100 with rN = 20% gives tax 20 and gross 120, so rG = 16.666…%. The relationship is rG = 100 × rN / (100 + rN).',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Net, gross, and tax amount each have independent currencies. Money is normalized into the authoritative field currency before calculation using stored FX rates. The percentage fields are never converted.',
  },
];
