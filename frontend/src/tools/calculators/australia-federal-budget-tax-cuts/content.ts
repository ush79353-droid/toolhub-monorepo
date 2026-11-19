import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { GST_CALCULATOR_HREF } from './types';

export const AUSTRALIA_TAX_CUTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-was-budget', label: 'What Was Budget 2020/21 About?' },
  { id: 'why-unavailable', label: 'Why This Calculator Is Unavailable' },
  { id: 'where-to-go', label: 'Where to Go Next' },
  { id: 'australia-tax-cuts-faq', label: 'Frequently Asked Questions' },
];

export const AUSTRALIA_TAX_CUTS_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this page calculate Australian income tax for 2020/21?',
    answer:
      'No. This page is an unavailable / historical notice only. It does not apply 2020/21 budget assumptions to current returns and does not invent tax brackets, refunds, or eligibility rules.',
  },
  {
    question: 'Were the Federal Budget 2020/21 income tax cuts proposals or law?',
    answer:
      'Australia’s Federal Budget 2020/21 announced staged personal income tax changes. Treat Budget papers as proposals until enacted through legislation and administered by the Australian Taxation Office. This page does not model either proposed or enacted schedules.',
  },
  {
    question: 'Can I use this tool for a current ATO income tax estimate?',
    answer:
      'No. Do not use historical 2020/21 budget assumptions for current Australian income tax. For official guidance, use Australian Taxation Office resources. This Omega Calculators page does not replace ATO tools or advice.',
  },
  {
    question: 'Which calculator should I try instead?',
    answer: `The notice points to the GST Calculator (${GST_CALCULATOR_HREF}). That catalog slug is verified; the GST module may still be undeveloped on this site until it is registered and activated.`,
  },
];
