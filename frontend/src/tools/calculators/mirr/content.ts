import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MIRR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mirr', label: 'What Is MIRR?' },
  { id: 'mirr-formula', label: 'MIRR Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mirr-faq', label: 'Frequently Asked Questions' },
];

export const MIRR_FAQS: readonly FAQItem[] = [
  {
    question: 'How does MIRR differ from IRR?',
    answer:
      'IRR assumes interim cash flows are reinvested at the IRR itself. MIRR compounds positive flows at a stated reinvestment rate and discounts negative flows at a financing rate, so the result is usually unique and easier to interpret.',
  },
  {
    question: 'What are the financing and reinvestment rates?',
    answer:
      'The financing rate discounts negative cash flows (including the initial investment) to year 0. The reinvestment rate compounds positive cash flows forward to the final year.',
  },
  {
    question: 'Can annual cash flows be negative or zero?',
    answer:
      'Yes. Positive values are inflows; negative values are outflows. Zero years inside the horizon are kept. Trailing zero years after the last non-zero flow are trimmed when counting periods.',
  },
  {
    question: 'Does changing currency convert amounts?',
    answer:
      'No. Currency selection only changes the denomination symbol and formatting.',
  },
];
