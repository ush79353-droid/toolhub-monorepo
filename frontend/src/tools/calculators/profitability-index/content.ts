import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pi', label: 'What Is Profitability Index?' },
  { id: 'pi-formula', label: 'PI Formula' },
  { id: 'pi-how-to', label: 'How to Use' },
  { id: 'pi-interpretation', label: 'Interpretation' },
  { id: 'pi-faq', label: 'Frequently Asked Questions' },
];

export const PI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the profitability index?',
    answer:
      'The profitability index (PI) compares the present value of expected future cash flows with the initial investment. Values above 1 generally suggest a favorable project on a PV basis.',
  },
  {
    question: 'How is PI calculated?',
    answer:
      'PI = PV of future cash flow ÷ initial investment. Initial investment must be greater than zero.',
  },
  {
    question: 'What if PV of future cash flow is unknown?',
    answer:
      'You still need a present-value estimate to compute PI with this simple calculator. Use a PV figure you already calculated elsewhere, then enter it above.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only labels monetary fields. Enter investment and PV already in the same currency.',
  },
];
